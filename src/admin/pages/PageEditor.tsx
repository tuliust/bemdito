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
    message: 'Existe uma operação em andamento no editor. Deseja sair mesmo assim?',
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

      const [pageData, sectionsData] = await Promise.all([
        getPageById(pageId),
        getSectionsByPageId(pageId),
      ]);

      if (!pageData) {
        toast.error('Página não encontrada');
        navigate('/admin/pages');
        return;
      }

      const normalizedSections = (sectionsData || []).map((section) => ({
        ...section,
        visible: section.visible ?? true,
      }));

      setPageName(pageData.title || pageData.slug || 'Página sem título');
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
      console.error('Erro ao carregar dados da página:', error);
      toast.error('Não foi possível carregar o editor da página');
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

      toast.success('Seção salva com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar seção:', error);
      setSections(previousSections);
      toast.error('Não foi possível salvar a seção');
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
      toast.success('Ordem das seções atualizada');
    } catch (error) {
      console.error('Erro ao reordenar seções:', error);
      setSections(previousSections);
      toast.error('Não foi possível reordenar as seções');
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

      toast.success('Seção excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir seção:', error);
      toast.error('Não foi possível excluir a seção');
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

      toast.success('Seção duplicada com sucesso');
    } catch (error) {
      console.error('Erro ao duplicar seção:', error);
      toast.error('Não foi possível duplicar a seção');
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
      toast.success(nextVisible ? 'Seção exibida' : 'Seção ocultada');
    } catch (error) {
      console.error('Erro ao alterar visibilidade da seção:', error);
      setSections(previousSections);
      toast.error('Não foi possível atualizar a visibilidade da seção');
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
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando página...</p>
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
            Voltar para páginas
          </Button>

          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-lg font-semibold text-gray-900">{pageName}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Salvando...' : pendingMutations > 0 ? 'Sincronizando...' : 'Salvo'}
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
              <p className="text-sm text-muted-foreground">Selecione uma seção para editar</p>
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