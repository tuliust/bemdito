import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { SectionList } from '@/admin/components/page-editor/SectionList';
import { SectionEditor } from '@/admin/components/page-editor/SectionEditor';
import { LivePreview } from '@/admin/components/page-editor/LivePreview';
import { Button } from '@/components/foundation';
import { getPageById } from '@/lib/services/pages-service';
import {
  getSectionsByPageId,
  updateSection,
  reorderSections,
  deleteSection,
  duplicateSection,
  toggleSectionVisibility,
} from '@/lib/services/sections-service';

interface EditorSection {
  id: string;
  page_id: string;
  template_id: string;
  variant_id?: string;
  order_index: number;
  visible: boolean;
  content: Record<string, any>;
  content_config?: Record<string, any>;
  style_config?: Record<string, any>;
  layout_config?: Record<string, any>;
  behavior_config?: Record<string, any>;
  items?: any[];
  breakpointOverrides?: any[];
  template?: {
    id: string;
    slug: string;
    name: string;
  };
  variant?: {
    id: string;
    slug: string;
    name: string;
  };
}

export function PageEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const [sections, setSections] = useState<EditorSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageName, setPageName] = useState('');

  const selectedSection = useMemo(
    () => sections.find((section) => section.id === selectedSectionId),
    [sections, selectedSectionId]
  );

  useEffect(() => {
    if (!pageId) return;
    loadPageData();
  }, [pageId]);

  const loadPageData = async () => {
    if (!pageId) return;

    try {
      setLoading(true);

      const [pageData, sectionsData] = await Promise.all([
        getPageById(pageId),
        getSectionsByPageId(pageId),
      ]);

      if (!pageData) {
        toast.error('Page not found');
        navigate('/admin/pages');
        return;
      }

      const normalizedSections = (sectionsData || []).map((section: any) => ({
        ...section,
        visible: section.visible ?? section.is_visible ?? true,
      }));

      setPageName(pageData.title || pageData.slug || 'Untitled Page');
      setSections(normalizedSections);

      if (normalizedSections.length > 0) {
        setSelectedSectionId((current) =>
          current && normalizedSections.some((section) => section.id === current)
            ? current
            : normalizedSections[0].id
        );
      } else {
        setSelectedSectionId(null);
      }
    } catch (error) {
      console.error('Error loading page data:', error);
      toast.error('Failed to load page editor');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionId(sectionId);
  };

  const handleSectionUpdate = async (sectionId: string, updates: Partial<EditorSection>) => {
    const previousSections = sections;

    const normalizedUpdates = {
      ...updates,
      ...(updates.visible !== undefined ? { visible: updates.visible } : {}),
    };

    setSections((current) =>
      current.map((section) =>
        section.id === sectionId ? { ...section, ...normalizedUpdates } : section
      )
    );

    try {
      await updateSection(sectionId, normalizedUpdates as any);
      toast.success('Section saved successfully');
    } catch (error) {
      console.error('Error updating section:', error);
      setSections(previousSections);
      toast.error('Failed to save section');
    }
  };

  const handleSectionReorder = async (reorderedSections: EditorSection[]) => {
    const previousSections = sections;
    setSections(reorderedSections);

    try {
      await reorderSections(
        pageId || '',
        reorderedSections.map((section) => section.id)
      );
      toast.success('Section order updated');
    } catch (error) {
      console.error('Error reordering sections:', error);
      setSections(previousSections);
      toast.error('Failed to reorder sections');
    }
  };

  const handleSectionDelete = async (sectionId: string) => {
    try {
      await deleteSection(sectionId);
      const nextSections = sections.filter((section) => section.id !== sectionId);
      setSections(nextSections);

      setSelectedSectionId((current) => {
        if (current !== sectionId) return current;
        return nextSections[0]?.id || null;
      });

      toast.success('Section deleted successfully');
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Failed to delete section');
    }
  };

  const handleSectionDuplicate = async (sectionId: string) => {
    try {
      await duplicateSection(sectionId);
      await loadPageData();
      toast.success('Section duplicated successfully');
    } catch (error) {
      console.error('Error duplicating section:', error);
      toast.error('Failed to duplicate section');
    }
  };

  const handleToggleVisibility = async (sectionId: string) => {
    const section = sections.find((entry) => entry.id === sectionId);
    if (!section) return;

    const nextVisible = !section.visible;
    const previousSections = sections;

    setSections((current) =>
      current.map((entry) =>
        entry.id === sectionId ? { ...entry, visible: nextVisible } : entry
      )
    );

    try {
      await toggleSectionVisibility(sectionId, nextVisible);
      toast.success(nextVisible ? 'Section shown' : 'Section hidden');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      setSections(previousSections);
      toast.error('Failed to update section visibility');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 400);
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
            {saving ? 'Saving...' : 'Saved'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[30%] bg-white border-r border-gray-200 flex flex-col">
          <SectionList
            sections={sections}
            selectedSectionId={selectedSectionId}
            onSectionSelect={handleSectionSelect}
            onSectionReorder={handleSectionReorder}
            onSectionDelete={handleSectionDelete}
            onSectionDuplicate={handleSectionDuplicate}
            onSectionToggleVisibility={handleToggleVisibility}
            pageId={pageId || ''}
            onSectionAdd={() => loadPageData()}
          />
        </div>

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

        <div className="w-[30%] bg-white flex flex-col">
          <LivePreview section={selectedSection} />
        </div>
      </div>
    </div>
  );
}
