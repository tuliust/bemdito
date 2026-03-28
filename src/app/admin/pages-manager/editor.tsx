import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { supabase } from '../../../lib/supabase/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { BaseModal } from '../../components/admin/BaseModal';
import { ConfirmDeleteDialog } from '../../components/admin/ConfirmDeleteDialog';
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Settings,
  FileText,
  Monitor,
  Save,
  Clock,
  GripVertical,
} from 'lucide-react';
import { toast } from 'sonner';
import { useUnsavedChangesGuard } from '../../../lib/hooks/useUnsavedChangesGuard';
import { ResponsivePreview } from '../../components/ResponsivePreview';
import { ImageFieldWithPicker } from '../../components/ImageFieldWithPicker';
import { VersionHistoryModal } from '../components/VersionHistoryModal';
import { savePageVersion } from '../../../lib/supabase/versioning';
import { ColorTokenPicker } from '../../components/ColorTokenPicker';
import { ImageUploadOnly } from '../../components/ImageUploadOnly';
import { PageAnchorPicker } from '../../components/PageAnchorPicker';
import { UnifiedSectionConfigModal } from './UnifiedSectionConfigModal';
import { DraggableSectionItem } from './DraggableSectionItem';
import { AdminPrimaryButton } from '@/app/components/admin/AdminPrimaryButton';
import { adminVar } from '@/app/components/admin/AdminThemeProvider';

type Page = {
  id: string;
  name: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  published: boolean;
};

type Section = {
  id: string;
  name: string;
  type: string;
  config: any;
  global: boolean;
  published: boolean;
  elements?: any;
  layout?: any;
  styling?: any;
};

type PageSection = {
  id: string;
  page_id: string;
  section_id: string;
  order_index: number;
  section?: Section;
};

export function PageEditorPage() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState<Page | null>(null);
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addSectionModalOpen, setAddSectionModalOpen] = useState(false);
  const [editConfigModalOpen, setEditConfigModalOpen] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [versionHistoryModalOpen, setVersionHistoryModalOpen] = useState(false);

  const { hasUnsavedChanges, setUnsavedChanges } = useUnsavedChangesGuard();

  // ✅ Estado para confirmação de remoção de seção
  const [sectionIndexToRemove, setSectionIndexToRemove] = useState<number | null>(null);

  useEffect(() => {
    if (pageId) {
      loadPage();
      loadPageSections();
      loadAvailableSections();
    }
  }, [pageId]);

  async function loadPage() {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (error) throw error;

      setPage(data);
    } catch (error: any) {
      console.error('❌ [Editor] Erro ao carregar página:', error);
      console.error('   Message:', error.message);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      
      toast.error(`Erro ao carregar página: ${error.message || 'Verifique a conexão com o Supabase'}`, {
        icon: <AlertCircle className="h-4 w-4" />,
        description: error.hint || 'Veja o console para mais detalhes',
      });
    }
  }

  async function loadPageSections() {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select(`
          *,
          section:sections(
            *,
            elements,
            layout,
            styling
          )
        `)
        .eq('page_id', pageId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      setPageSections(data || []);
    } catch (error) {
      console.error('❌ [Editor] Erro ao carregar seções:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailableSections() {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('global', true)
        .eq('published', true)
        .order('name', { ascending: true });

      if (error) throw error;

      setAvailableSections(data || []);
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      // Delete all existing page_sections
      await supabase.from('page_sections').delete().eq('page_id', pageId);

      // Insert updated page_sections
      // ✅ MIGRATION v5.0: Coluna config removida de page_sections
      // Agora page_sections apenas vincula seções às páginas (sem config próprio)
      const sectionsToInsert = pageSections.map((ps, index) => ({
        page_id: pageId,
        section_id: ps.section_id,
        order_index: index,
      }));

      if (sectionsToInsert.length > 0) {
        const { error } = await supabase
          .from('page_sections')
          .insert(sectionsToInsert);

        if (error) throw error;
      }

      // Auto-save version after successful save
      try {
        const { savePageVersion } = await import('../../../lib/supabase/versioning');
        await savePageVersion(pageId!, {
          sections: sectionsToInsert,
          timestamp: new Date().toISOString(),
        });
      } catch (versionError) {
        console.error('Error saving version (non-critical):', versionError);
        // Don't fail the save operation if versioning fails
      }

      toast.success('Página salva com sucesso!', {
        icon: <CheckCircle className="h-4 w-4" />,
      });

      setUnsavedChanges(false);
      loadPageSections();
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Erro ao salvar página', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = async (section: Section) => {
    // ✅ Verificar se a seção já está sendo usada em outra página
    try {
      const { data: existingUsage, error } = await supabase
        .from('page_sections')
        .select('page_id, pages!inner(name)')
        .eq('section_id', section.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned (OK, seção não está sendo usada)
        throw error;
      }

      if (existingUsage && existingUsage.page_id !== pageId) {
        // Seção já está sendo usada em outra página
        const pageName = (existingUsage as any).pages.name;
        toast.error(
          `A seção "${section.name}" já está sendo usada na página "${pageName}". Duplique a seção para usá-la em múltiplas páginas.`,
          {
            icon: <AlertCircle className="h-4 w-4" />,
            duration: 5000,
          }
        );
        return;
      }
    } catch (error) {
      console.error('Erro ao verificar uso da seção:', error);
      toast.error('Erro ao verificar disponibilidade da seção', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    const newPageSection: PageSection = {
      id: `temp-${Date.now()}`,
      page_id: pageId!,
      section_id: section.id,
      order_index: pageSections.length,
      section: section,
    };

    setPageSections([...pageSections, newPageSection]);
    setUnsavedChanges(true);
    setAddSectionModalOpen(false);
    toast.success(`Seção "${section.name}" adicionada!`);
  };

  const handleRemoveSection = (index: number) => {
    setSectionIndexToRemove(index);
  };

  const confirmRemoveSection = () => {
    if (sectionIndexToRemove === null) return;
    const updated = pageSections.filter((_, i) => i !== sectionIndexToRemove);
    setPageSections(updated);
    setUnsavedChanges(true);
    setSectionIndexToRemove(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...pageSections];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setPageSections(updated);
    setUnsavedChanges(true);
  };

  const handleMoveDown = (index: number) => {
    if (index === pageSections.length - 1) return;
    const updated = [...pageSections];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setPageSections(updated);
    setUnsavedChanges(true);
  };

  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    setPageSections((prevSections) => {
      const newSections = [...prevSections];
      const draggedSection = newSections[dragIndex];
      newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, draggedSection);
      return newSections;
    });
    setUnsavedChanges(true);
  }, [setUnsavedChanges]);

  const handleEditConfig = (index: number) => {
    setEditingSectionIndex(index);
    setEditConfigModalOpen(true);
  };

  const handleUpdateConfig = (config: any, elements?: any, layout?: any, styling?: any) => {
    if (editingSectionIndex !== null) {
      const updated = [...pageSections];
      const sectionId = updated[editingSectionIndex].section_id;
      
      // ✅ LIMPEZA: Remover campos duplicados/legados do config
      const cleanConfig = { ...config };
      
      // Remover campos que agora estão em `styling`
      delete cleanConfig.styling;
      delete cleanConfig.heightMode;
      delete cleanConfig.sectionHeight; // ✅ NOVO
      
      // Remover campos que agora estão em `layout`
      delete cleanConfig.layout;
      // ✅ FIX 2026-02-15: gridRows/gridCols devem FICAR em config (não deletar!)
      
      // Remover campos que agora estão em `elements`
      delete cleanConfig.elements;
      
      // ✅ NOVO: Remover campo text legado (colSpan/rowSpan incorretos)
      delete cleanConfig.text;
      
      const updatePayload = {
        config: cleanConfig,
        ...(elements && { elements }),
        ...(layout && { layout }),
        ...(styling && { styling }),
      };
      
      // ✅ Atualizar na tabela sections via Supabase
      supabase
        .from('sections')
        .update(updatePayload)
        .eq('id', sectionId)
        .then(({ error }) => {
          if (error) {
            console.error('❌ Erro ao salvar seção:', error);
            toast.error(`Erro ao salvar seção: ${error.message}`);
          } else {
            toast.success('Seção atualizada com sucesso!');
            
            // ✅ CORREÇÃO 2026-02-17: Recarregar seções do banco para garantir dados atualizados
            loadPageSections();
            
            setUnsavedChanges(true);
          }
        });
    }

    setEditConfigModalOpen(false);
    setEditingSectionIndex(null);
  };

  const handleTogglePublish = async () => {
    if (!page) return;

    try {
      const { error } = await supabase
        .from('pages')
        .update({ published: !page.published })
        .eq('id', pageId);

      if (error) throw error;

      setPage({ ...page, published: !page.published });
      toast.success(
        `Página ${!page.published ? 'publicada' : 'despublicada'}!`,
        { icon: <CheckCircle className="h-4 w-4" /> }
      );
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('Erro ao atualizar página', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/pages-manager')}
            style={{
              transition: 'none',
              backgroundColor: 'var(--admin-btn-action-bg, #ffffff)',
              borderColor:     'var(--admin-btn-action-border, #e5e7eb)',
              color:           'var(--admin-btn-action-text, #374151)',
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1
              style={{
                fontSize:   'var(--admin-page-title-size,   1.875rem)',
                fontWeight: 'var(--admin-page-title-weight, 700)',
                color:      'var(--admin-page-title-color,  #111827)',
              }}
            >
              {page.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--accent, #ed9331)' }}
            >
              ⚠️ Alterações não salvas
            </span>
          )}
          <Button
            variant="outline"
            onClick={handleTogglePublish}
            style={{
              transition: 'none',
              backgroundColor: 'var(--admin-btn-action-bg, #ffffff)',
              borderColor:     'var(--admin-btn-action-border, #e5e7eb)',
              color:           'var(--admin-btn-action-text, #374151)',
            }}
          >
            {page.published ? 'Despublicar' : 'Publicar'}
          </Button>
          <AdminPrimaryButton
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Página
              </>
            )}
          </AdminPrimaryButton>
          <Button
            variant="outline"
            onClick={() => setVersionHistoryModalOpen(true)}
            style={{
              transition: 'none',
              backgroundColor: 'var(--admin-btn-action-bg, #ffffff)',
              borderColor:     'var(--admin-btn-action-border, #e5e7eb)',
              color:           'var(--admin-btn-action-text, #374151)',
            }}
          >
            <Clock className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Tabs */}
        <div className="col-span-8 space-y-4">
          <Tabs defaultValue="sections" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sections" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Seções ({pageSections.length})
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {/* Sections Tab */}
            <TabsContent value="sections" className="mt-4">
              <div
                className="p-6"
                style={{
                  backgroundColor: 'var(--admin-card-bg, #ffffff)',
                  border:          '2px solid var(--admin-card-border, #e5e7eb)',
                  borderRadius:    'var(--admin-card-radius, 1.5rem)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    style={{
                      fontSize:   adminVar('section-header', 'size'),
                      fontWeight: adminVar('section-header', 'weight'),
                      color:      adminVar('section-header', 'color'),
                    }}
                  >
                    Seções da Página
                  </h2>
                  <AdminPrimaryButton
                    onClick={() => setAddSectionModalOpen(true)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Seção
                  </AdminPrimaryButton>
                </div>

                {pageSections.length === 0 ? (
                  <div
                    className="text-center py-12 border-2 border-dashed rounded-lg"
                    style={{ borderColor: 'var(--admin-card-border, #e5e7eb)' }}
                  >
                    <p className="mb-4" style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}>
                      Nenhuma seção adicionada ainda
                    </p>
                    <Button
                      onClick={() => setAddSectionModalOpen(true)}
                      variant="outline"
                      style={{
                        transition: 'none',
                        backgroundColor: 'var(--admin-btn-action-bg, #ffffff)',
                        borderColor:     'var(--admin-btn-action-border, #e5e7eb)',
                        color:           'var(--admin-btn-action-text, #374151)',
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Primeira Seção
                    </Button>
                  </div>
                ) : (
                  <DndProvider backend={HTML5Backend}>
                    <div className="space-y-3">
                      {pageSections.map((pageSection, index) => (
                        <DraggableSectionItem
                          key={pageSection.id}
                          pageSection={pageSection}
                          index={index}
                          moveSection={moveSection}
                          onEditConfig={handleEditConfig}
                          onRemove={handleRemoveSection}
                        />
                      ))}
                    </div>
                  </DndProvider>
                )}
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="mt-4">
              <div
                className="p-6"
                style={{
                  backgroundColor: 'var(--admin-card-bg, #ffffff)',
                  border:          '2px solid var(--admin-card-border, #e5e7eb)',
                  borderRadius:    'var(--admin-card-radius, 1.5rem)',
                }}
              >
                {hasUnsavedChanges ? (
                  <div className="text-center py-12">
                    <AlertCircle
                      className="h-12 w-12 mx-auto mb-4"
                      style={{ color: 'var(--accent, #ed9331)' }}
                    />
                    <h3
                      className="mb-2"
                      style={{
                        fontSize:   adminVar('section-header', 'size'),
                        fontWeight: adminVar('section-header', 'weight'),
                        color:      adminVar('section-header', 'color'),
                      }}
                    >
                      Salve suas alterações
                    </h3>
                    <p className="mb-4" style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}>
                      Salve a página para visualizar o preview atualizado
                    </p>
                    <AdminPrimaryButton
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar e Ver Preview
                        </>
                      )}
                    </AdminPrimaryButton>
                  </div>
                ) : (
                  <ResponsivePreview
                    url={`${window.location.origin}${page.slug}`}
                    title={`Preview - ${page.name}`}
                  />
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-4">
              <div
                className="p-6"
                style={{
                  backgroundColor: 'var(--admin-card-bg, #ffffff)',
                  border:          '2px solid var(--admin-card-border, #e5e7eb)',
                  borderRadius:    'var(--admin-card-radius, 1.5rem)',
                }}
              >
                <h2
                  className="mb-6"
                  style={{
                    fontSize:   adminVar('section-header', 'size'),
                    fontWeight: adminVar('section-header', 'weight'),
                    color:      adminVar('section-header', 'color'),
                  }}
                >
                  Configurações da Página
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label>Nome da Página</Label>
                    <Input
                      value={page.name}
                      disabled
                      className="mt-1"
                      style={{ backgroundColor: 'var(--admin-page-bg, #f9fafb)' }}
                    />
                    <p data-slot="field-hint" className="mt-1">
                      Use o Pages Manager principal para editar metadados
                    </p>
                  </div>
                  <div>
                    <Label>Slug (URL)</Label>
                    <Input
                      value={page.slug}
                      disabled
                      className="mt-1"
                      style={{ backgroundColor: 'var(--admin-page-bg, #f9fafb)' }}
                    />
                  </div>
                  {page.meta_title && (
                    <div>
                      <Label>Meta Title</Label>
                      <Input
                        value={page.meta_title}
                        disabled
                        className="mt-1"
                        style={{ backgroundColor: 'var(--admin-page-bg, #f9fafb)' }}
                      />
                    </div>
                  )}
                  {page.meta_description && (
                    <div>
                      <Label>Meta Description</Label>
                      <textarea
                        value={page.meta_description}
                        disabled
                        className="mt-1 w-full px-3 py-2 rounded-lg"
                        rows={3}
                        style={{
                          backgroundColor: 'var(--admin-page-bg, #f9fafb)',
                          border:          '2px solid var(--admin-field-border, #e5e7eb)',
                          color:           'var(--admin-field-text, #111827)',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Page Info */}
        <div className="col-span-4">
          <div
            className="p-6 sticky top-6"
            style={{
              backgroundColor: 'var(--admin-card-bg, #ffffff)',
              border:          '2px solid var(--admin-card-border, #e5e7eb)',
              borderRadius:    'var(--admin-card-radius, 1.5rem)',
            }}
          >
            <h3
              className="mb-4"
              style={{
                fontSize:   adminVar('section-header', 'size'),
                fontWeight: adminVar('section-header', 'weight'),
                color:      adminVar('section-header', 'color'),
              }}
            >
              Informações da Página
            </h3>

            <div className="space-y-4">
              <div>
                <p style={{
                  fontSize:   adminVar('item-tertiary', 'size'),
                  fontWeight: adminVar('item-tertiary', 'weight'),
                  color:      adminVar('item-tertiary', 'color'),
                }}>Nome</p>
                <p style={{
                  fontSize:   adminVar('item-title-list', 'size'),
                  fontWeight: adminVar('item-title-list', 'weight'),
                  color:      adminVar('item-title-list', 'color'),
                }}>{page.name}</p>
              </div>

              <div>
                <p style={{
                  fontSize:   adminVar('item-tertiary', 'size'),
                  fontWeight: adminVar('item-tertiary', 'weight'),
                  color:      adminVar('item-tertiary', 'color'),
                }}>Slug (URL)</p>
                <p style={{
                  fontSize:   adminVar('item-title-list', 'size'),
                  fontWeight: adminVar('item-title-list', 'weight'),
                  color:      adminVar('item-title-list', 'color'),
                }}>{page.slug}</p>
              </div>

              {page.meta_title && (
                <div>
                  <p style={{
                    fontSize:   adminVar('item-tertiary', 'size'),
                    fontWeight: adminVar('item-tertiary', 'weight'),
                    color:      adminVar('item-tertiary', 'color'),
                  }}>Meta Title</p>
                  <p style={{
                    fontSize:   adminVar('item-title-list', 'size'),
                    fontWeight: adminVar('item-title-list', 'weight'),
                    color:      adminVar('item-title-list', 'color'),
                  }}>{page.meta_title}</p>
                </div>
              )}

              {page.meta_description && (
                <div>
                  <p style={{
                    fontSize:   adminVar('item-tertiary', 'size'),
                    fontWeight: adminVar('item-tertiary', 'weight'),
                    color:      adminVar('item-tertiary', 'color'),
                  }}>Meta Description</p>
                  <p style={{
                    fontSize:   adminVar('item-description', 'size'),
                    fontWeight: adminVar('item-description', 'weight'),
                    color:      adminVar('item-description', 'color'),
                  }}>{page.meta_description}</p>
                </div>
              )}

              <div
                className="pt-4"
                style={{ borderTop: '1px solid var(--admin-card-border, #e5e7eb)' }}
              >
                <p
                  className="mb-2"
                  style={{
                    fontSize:   adminVar('item-tertiary', 'size'),
                    fontWeight: adminVar('item-tertiary', 'weight'),
                    color:      adminVar('item-tertiary', 'color'),
                  }}
                >Estatísticas</p>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span style={{ color: adminVar('item-tertiary', 'color') }}>Seções:</span>
                    <span style={{
                      fontWeight: adminVar('item-title-list', 'weight'),
                      color:      adminVar('item-title-list', 'color'),
                    }}>{pageSections.length}</span>
                  </p>
                  <p className="flex justify-between">
                    <span style={{ color: adminVar('item-tertiary', 'color') }}>Status:</span>
                    <span
                      className="font-semibold"
                      style={{
                        color: page.published
                          ? 'var(--primary, #ea526e)'
                          : 'var(--admin-field-placeholder, #9ca3af)',
                      }}
                    >
                      {page.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </p>
                </div>
              </div>

              <div
                className="pt-4"
                style={{ borderTop: '1px solid var(--admin-card-border, #e5e7eb)' }}
              >
                <p data-slot="field-hint" className="">
                  💡 Adicione seções da biblioteca, reordene com as setas e
                  configure cada seção individualmente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      {addSectionModalOpen && (
        <AddSectionModal
          sections={availableSections}
          onClose={() => setAddSectionModalOpen(false)}
          onAdd={handleAddSection}
        />
      )}

      {/* Edit Config Modal */}
      {editConfigModalOpen && editingSectionIndex !== null && (
        <EditConfigModal
          pageSection={pageSections[editingSectionIndex]}
          onClose={() => {
            setEditConfigModalOpen(false);
            setEditingSectionIndex(null);
          }}
          onSave={handleUpdateConfig}
        />
      )}

      {/* Version History Modal */}
      {versionHistoryModalOpen && page && (
        <VersionHistoryModal
          open={versionHistoryModalOpen}
          onOpenChange={(o) => !o && setVersionHistoryModalOpen(false)}
          entityId={pageId!}
          entityType="page"
          currentData={page}
          onRestore={async (data) => {
            // Restore page data (except ID)
            const { id, created_at, updated_at, ...restoreData } = data;
            const { error } = await supabase
              .from('pages')
              .update(restoreData)
              .eq('id', pageId);
            
            if (!error) {
              await loadPage();
              toast.success('Versão restaurada com sucesso!');
            } else {
              toast.error('Erro ao restaurar versão');
            }
          }}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={sectionIndexToRemove !== null}
        onConfirm={confirmRemoveSection}
        onCancel={() => setSectionIndexToRemove(null)}
        title="Remover Seção"
        description="Tem certeza que deseja remover esta seção da página?"
      />
    </div>
  );
}

// Add Section Modal
function AddSectionModal({
  sections,
  onClose,
  onAdd,
}: {
  sections: Section[];
  onClose: () => void;
  onAdd: (section: Section) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSections, setFilteredSections] = useState(sections);

  useEffect(() => {
    if (searchTerm) {
      setFilteredSections(
        sections.filter((s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredSections(sections);
    }
  }, [searchTerm, sections]);

  return (
    <BaseModal
      open={true}
      onOpenChange={onClose}
      title="Adicionar Seção da Biblioteca"
    >
      <div className="space-y-4">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar seções..."
          className="w-full"
        />

        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredSections.length === 0 ? (
            <p
              className="text-center py-8"
              style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}
            >
              Nenhuma seção disponível
            </p>
          ) : (
            filteredSections.map((section) => (
              <div
                key={section.id}
                className="rounded-lg p-4 cursor-pointer"
                style={{
                  transition: 'none',
                  backgroundColor: 'var(--admin-list-item-bg, #ffffff)',
                  border:          '2px solid var(--admin-list-item-border, #e5e7eb)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--admin-list-item-hover-border, #d1d5db)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--admin-list-item-border, #e5e7eb)';
                }}
                onClick={() => onAdd(section)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{
                      fontSize:   adminVar('list-item-title', 'size'),
                      fontWeight: adminVar('list-item-title', 'weight'),
                      color:      adminVar('list-item-title', 'color'),
                    }}>
                      {section.name}
                    </h4>
                    <p style={{
                      fontSize:   adminVar('list-item-meta', 'size'),
                      fontWeight: adminVar('list-item-meta', 'weight'),
                      color:      adminVar('list-item-meta', 'color'),
                    }}>Tipo: {section.type}</p>
                  </div>
                  <AdminPrimaryButton size="sm">
                    <Plus className="h-4 w-4" />
                  </AdminPrimaryButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </BaseModal>
  );
}

// Edit Config Modal - Uses UnifiedSectionConfigModal
function EditConfigModal({
  pageSection,
  onClose,
  onSave,
}: {
  pageSection: PageSection;
  onClose: () => void;
  onSave: (config: any, elements?: any, layout?: any, styling?: any) => void;
}) {
  return (
    <UnifiedSectionConfigModal
      pageSection={pageSection}
      onClose={onClose}
      onSave={onSave}
    />
  );
}