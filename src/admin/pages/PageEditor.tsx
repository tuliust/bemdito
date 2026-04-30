import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { SectionList } from '@/admin/components/page-editor/SectionList';
import { SectionEditor } from '@/admin/components/page-editor/SectionEditor';
import { LivePreview } from '@/admin/components/page-editor/LivePreview';
import { Button } from '@/components/foundation';
import { supabase } from '@/lib/supabase/client';

interface Section {
  id: string;
  page_id: string;
  template_id: string;
  order_index: number;
  content: Record<string, any>;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  template?: {
    id: string;
    slug: string;
    name: string;
  };
}

export function PageEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageName, setPageName] = useState('');

  const selectedSection = sections.find(s => s.id === selectedSectionId);

  // Load page and sections
  useEffect(() => {
    if (!pageId) return;
    loadPageData();
  }, [pageId]);

  const loadPageData = async () => {
    try {
      setLoading(true);

      // Load page info
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (pageError) throw pageError;
      setPageName(pageData.name);

      // Load sections with template info
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select(`
          *,
          template:templates(id, slug, name)
        `)
        .eq('page_id', pageId)
        .order('order_index');

      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);

      // Auto-select first section
      if (sectionsData && sectionsData.length > 0 && !selectedSectionId) {
        setSelectedSectionId(sectionsData[0].id);
      }
    } catch (error) {
      console.error('Error loading page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionId(sectionId);
  };

  const handleSectionUpdate = async (sectionId: string, updates: Partial<Section>) => {
    try {
      // Optimistic update
      setSections(prev =>
        prev.map(s => (s.id === sectionId ? { ...s, ...updates } : s))
      );

      // Save to database
      const { error } = await supabase
        .from('sections')
        .update(updates)
        .eq('id', sectionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating section:', error);
      // Reload on error
      loadPageData();
    }
  };

  const handleSectionReorder = async (reorderedSections: Section[]) => {
    try {
      setSections(reorderedSections);

      // Update order_index for all sections
      const updates = reorderedSections.map((section, index) => ({
        id: section.id,
        order_index: index,
      }));

      for (const update of updates) {
        await supabase
          .from('sections')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error reordering sections:', error);
      loadPageData();
    }
  };

  const handleSectionDelete = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;

      setSections(prev => prev.filter(s => s.id !== sectionId));

      // Select another section
      const remainingSections = sections.filter(s => s.id !== sectionId);
      if (remainingSections.length > 0) {
        setSelectedSectionId(remainingSections[0].id);
      } else {
        setSelectedSectionId(null);
      }
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const handleSectionDuplicate = async (sectionId: string) => {
    try {
      const section = sections.find(s => s.id === sectionId);
      if (!section) return;

      const { data, error } = await supabase
        .from('sections')
        .insert({
          page_id: section.page_id,
          template_id: section.template_id,
          order_index: section.order_index + 1,
          content: section.content,
          is_visible: section.is_visible,
        })
        .select()
        .single();

      if (error) throw error;

      loadPageData();
    } catch (error) {
      console.error('Error duplicating section:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Auto-save is handled in handleSectionUpdate
    setTimeout(() => setSaving(false), 1000);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/pages')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Pages
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-lg font-semibold text-gray-900">{pageName}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Section List (30%) */}
        <div className="w-[30%] bg-white border-r border-gray-200 flex flex-col">
          <SectionList
            sections={sections}
            selectedSectionId={selectedSectionId}
            onSectionSelect={handleSectionSelect}
            onSectionReorder={handleSectionReorder}
            onSectionDelete={handleSectionDelete}
            onSectionDuplicate={handleSectionDuplicate}
            onSectionToggleVisibility={(sectionId) => {
              const section = sections.find(s => s.id === sectionId);
              if (section) {
                handleSectionUpdate(sectionId, { is_visible: !section.is_visible });
              }
            }}
            pageId={pageId || ''}
            onSectionAdd={() => loadPageData()}
          />
        </div>

        {/* Column 2: Section Editor (40%) */}
        <div className="w-[40%] bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
          {selectedSection ? (
            <SectionEditor
              section={selectedSection}
              onUpdate={(updates) => handleSectionUpdate(selectedSection.id, updates)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Select a section to edit
              </p>
            </div>
          )}
        </div>

        {/* Column 3: Live Preview (30%) */}
        <div className="w-[30%] bg-white flex flex-col">
          <LivePreview
            section={selectedSection}
          />
        </div>
      </div>
    </div>
  );
}
