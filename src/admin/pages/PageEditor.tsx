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
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import type { PageSection } from '@/types/cms';

type EditorSection = PageSection;

export function PageEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const [sections, setSections] = useState<EditorSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageName, setPageName] = useState('');
  const [pendingMutations, setPendingMutations] = useState(0);

  const { hasUnsavedChanges, setUnsavedChanges, confirmNavigation } = useUnsavedChanges({
    message: 'Existe uma operacao em andamento no editor. Deseja sair mesmo assim?',
    when: true,
  });

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

      const [pageData, sectionsData] = await Promise.all([getPageById(pageId), getSectionsByPageId(pageId)]);

      if (!pageData) {
        toast.error('Page not found');
        navigate('/admin/pages');
        return;
      }

      const normalizedSections = (sectionsData || []).map((section) => ({
        ...section,
        visible: section.visible ?? true,
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
        section.id === sectionId
          ? {
              ...section,
              ...normalizedUpdates,
              config: normalizedUpdates.config
                ? {
                    ...(section.config ?? {}),
                    ...normalizedUpdates.config,
                  }
                : section.config,
            }
          : section
      )
    );
    setPendingMutations((current) => current + 1);
    setUnsavedChanges(true);

    try {
      const refreshedSection = await updateSection(sectionId, normalizedUpdates as any);
      setSections((current) =>
        current.map((section) => (section.id === sectionId ? refreshedSection : section))
      );
      toast.success('Section saved successfully');
    } catch (error) {
      console.error('Error updating section:', error);
      setSections(previousSections);
      toast.error('Failed to save section');
    } finally {
      setPendingMutations((current) => Math.max(0, current - 1));
      setUnsavedChanges(false);
    }
  };

  const handleSectionReorder = async (reorderedSections: EditorSection[]) => {
    const previousSections = sections;
    setSections(reorderedSections);
    setPendingMutations((current) => current + 1);
    setUnsavedChanges(true);

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
    } finally {
      setPendingMutations((current) => Math.max(0, current - 1));
      setUnsavedChanges(false);
    }
  };

  const handleSectionDelete = async (sectionId: string) => {
    try {
      setPendingMutations((current) => current + 1);
      setUnsavedChanges(true);
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
    } finally {
      setPendingMutations((current) => Math.max(0, current - 1));
      setUnsavedChanges(false);
    }
  };

  const handleSectionDuplicate = async (sectionId: string) => {
    try {
      setPendingMutations((current) => current + 1);
      setUnsavedChanges(true);
      await duplicateSection(sectionId);
      await loadPageData();
      toast.success('Section duplicated successfully');
    } catch (error) {
      console.error('Error duplicating section:', error);
      toast.error('Failed to duplicate section');
    } finally {
      setPendingMutations((current) => Math.max(0, current - 1));
      setUnsavedChanges(false);
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
    setPendingMutations((current) => current + 1);
    setUnsavedChanges(true);

    try {
      await toggleSectionVisibility(sectionId, nextVisible);
      toast.success(nextVisible ? 'Section shown' : 'Section hidden');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      setSections(previousSections);
      toast.error('Failed to update section visibility');
    } finally {
      setPendingMutations((current) => Math.max(0, current - 1));
      setUnsavedChanges(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setUnsavedChanges(false);
    }, 400);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (hasUnsavedChanges && !confirmNavigation()) return;
              navigate('/admin/pages');
            }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Pages
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-lg font-semibold text-gray-900">{pageName}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : pendingMutations > 0 ? 'Syncing...' : 'Saved'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-[30%] flex-col border-r border-gray-200 bg-white">
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

        <div className="flex w-[40%] flex-col overflow-hidden border-r border-gray-200 bg-gray-50">
          {selectedSection ? (
            <SectionEditor
              section={selectedSection}
              onUpdate={(updates) => handleSectionUpdate(selectedSection.id, updates)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">Select a section to edit</p>
            </div>
          )}
        </div>

        <div className="flex w-[30%] flex-col bg-white">
          <LivePreview section={selectedSection} />
        </div>
      </div>
    </div>
  );
}
