import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { supabase } from '../../../lib/supabase/client';
import type { Section } from '@/types/database';
import { ConfirmDeleteDialog } from '../../components/admin/ConfirmDeleteDialog';
import { CreateSectionModal } from './CreateSectionModal';
import { UnifiedSectionConfigModal } from '../pages-manager/UnifiedSectionConfigModal';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminGridCard } from '../../components/admin/AdminGridCard';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { AdminDropdownMenu } from '../../components/admin/AdminDropdownMenu';
import { adminVar } from '../../components/admin/AdminThemeProvider';
import { 
  Sparkles, 
  Zap, 
  Layout, 
  Grid3x3, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Copy,
  Pencil,
} from 'lucide-react';

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero', icon: Sparkles },
  { value: 'cta', label: 'CTA', icon: Zap },
  { value: 'tabs', label: 'Tabs', icon: Layout },
  { value: 'cards_grid', label: 'Cards Grid', icon: Grid3x3 },
  { value: 'unico', label: 'Seção', icon: Layout },
];

// ── Helper: monta string compacta de características da seção ────────────────
function getSectionInfo(section: Section): string {
  const config   = (section.config   as any) || {};
  const elements = (section.elements as any) || {};
  const styling  = (section.styling  as any) || {};

  const parts: string[] = [];

  // Altura
  const rawHeight = styling.height || config.sectionHeight || 'auto';
  const heightLabel: Record<string, string> = {
    auto:   'Auto',
    '100vh':'100%',
    '50vh': '50%',
    '25vh': '25vh',
  };
  parts.push(heightLabel[rawHeight] ?? rawHeight);

  // Grid (só mostra se diferente de 1×1)
  const cols = Number(config.gridCols ?? 1);
  const rows = Number(config.gridRows ?? 1);
  if (cols > 1 || rows > 1) parts.push(`${cols}x${rows}`);

  // Cards
  if (elements.hasCards)  parts.push('Cards');

  // Mídia
  if (elements.hasMedia)  parts.push('Mídia');

  // Background image / color
  const hasBg =
    config.bgImage || config.bgColor || config.backgroundColor ||
    config.backgroundImage || styling.bgColor || styling.backgroundColor;
  if (hasBg) parts.push('BG');

  return parts.join(' | ');
}

export function SectionsManagerPage() {
  const [sections, setSections]       = useState<Section[]>([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editConfigModalOpen, setEditConfigModalOpen] = useState(false);

  // ── Inline title editing ──
  const [editingTitleId, setEditingTitleId]     = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState('');

  // ── Page names per section (section_id → "Página X") ──
  const [sectionPageNames, setSectionPageNames] = useState<Record<string, string>>({});

  // ── Delete confirmation ──
  const [sectionToDelete, setSectionToDelete]   = useState<Section | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadSections(); }, []);

  async function loadSections() {
    try {
      const [sectionsRes, pageSectionsRes] = await Promise.all([
        supabase
          .from('sections')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('page_sections')
          .select('section_id, pages!inner(name)'),
      ]);

      if (sectionsRes.error) throw sectionsRes.error;

      setSections(sectionsRes.data || []);

      // Montar mapa section_id → nome da primeira página encontrada
      const nameMap: Record<string, string> = {};
      (pageSectionsRes.data || []).forEach((row: any) => {
        if (row.section_id && row.pages?.name && !nameMap[row.section_id]) {
          nameMap[row.section_id] = row.pages.name;
        }
      });
      setSectionPageNames(nameMap);
    } catch (error) {
      console.error('Error loading sections:', error);
      toast.error('Erro ao carregar seções', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  }

  // ── Save inline title ────────────────────────────────────────────────────
  const saveSectionName = async (sectionId: string, newName: string) => {
    const trimmed = newName.trim();
    setEditingTitleId(null);
    if (!trimmed) return;
    const prev = sections.find(s => s.id === sectionId)?.name;
    if (trimmed === prev) return;
    setSections(sections.map(s => s.id === sectionId ? { ...s, name: trimmed } : s));
    const { error } = await supabase
      .from('sections')
      .update({ name: trimmed })
      .eq('id', sectionId);
    if (error) {
      console.error('❌ Erro ao renomear seção:', error);
      setSections(sections.map(s => s.id === sectionId ? { ...s, name: prev! } : s));
    }
  };

  const handleCreate = () => { setEditingSection(null); setModalOpen(true); };

  const handleEdit = async (section: Section) => {
    setEditingSection(section);
    setEditConfigModalOpen(true);
  };

  const handleDelete = async (section: Section) => {
    try {
      const { data: usageData, error } = await supabase
        .from('page_sections')
        .select('page_id, pages!inner(name)')
        .eq('section_id', section.id);

      if (error) throw error;

      if (usageData && usageData.length > 0) {
        const pageNames = usageData.map((u: any) => u.pages.name).join(', ');
        toast.error(
          `Não é possível deletar a seção "${section.name}" porque está sendo usada em: ${pageNames}. Remova a seção das páginas primeiro.`,
          { icon: <AlertCircle className="h-4 w-4" />, duration: 6000 }
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

    setSectionToDelete(section);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!sectionToDelete) return;
    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', sectionToDelete.id);

      if (error) throw error;

      toast.success('Seção deletada com sucesso!', { icon: <CheckCircle className="h-4 w-4" /> });
      loadSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Erro ao deletar seção', { icon: <AlertCircle className="h-4 w-4" /> });
    } finally {
      setShowDeleteConfirm(false);
      setSectionToDelete(null);
    }
  };

  const handleClone = async (section: Section) => {
    try {
      const { error } = await supabase
        .from('sections')
        .insert([{
          name: `${section.name} (Cópia)`,
          type: section.type,
          config: section.config,
          global: section.global,
          published: false,
        }]);

      if (error) throw error;

      toast.success('Seção clonada com sucesso!', { icon: <CheckCircle className="h-4 w-4" /> });
      loadSections();
    } catch (error) {
      console.error('Error cloning section:', error);
      toast.error('Erro ao clonar seção', { icon: <AlertCircle className="h-4 w-4" /> });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Seções"
      description="Biblioteca de templates de seções reutilizáveis"
      headerActions={
        <AdminPrimaryButton onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Seção
        </AdminPrimaryButton>
      }
    >

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.length === 0 ? (
          <AdminEmptyState
            message="Nenhuma seção criada ainda"
            cta={{ label: 'Criar Primeira Seção', onClick: handleCreate }}
            className="col-span-full"
          />
        ) : (
          sections.map((section) => {
            const typeInfo = SECTION_TYPES.find((t) => t.value === section.type);
            const TypeIcon = typeInfo?.icon || Layout;

            const config   = section.config as any;
            const mediaUrl = config?.mediaUrl || config?.media_url || null;

            const pageName  = sectionPageNames[section.id] || null;
            const sectionInfo = getSectionInfo(section);

            return (
              <AdminGridCard
                key={section.id}
                preview={
                  mediaUrl ? (
                    <img
                      src={mediaUrl}
                      alt={section.name || 'Section preview'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center"
                      style={{ color: 'var(--admin-grid-preview-content-color, #ffffff)' }}
                    >
                      <TypeIcon className="h-12 w-12 mb-2 opacity-50" />
                      <p
                        className="opacity-70"
                        style={{
                          fontSize:   'var(--admin-grid-preview-content-size,   0.875rem)',
                          fontWeight: 'var(--admin-grid-preview-content-weight, 400)',
                        }}
                      >
                        {typeInfo?.label || section.type}
                      </p>
                    </div>
                  )
                }
                badge={
                  <span
                    className="px-2 py-1 rounded"
                    style={{
                      fontSize:        'var(--admin-badge-label-size,   0.75rem)',
                      fontWeight:      'var(--admin-badge-label-weight, 500)',
                      color:           'var(--admin-badge-label-color,  #ffffff)',
                      backgroundColor: sectionPageNames[section.id]
                        ? 'var(--primary, #ea526e)'
                        : 'var(--admin-field-placeholder, #9ca3af)',
                    }}
                  >
                    {sectionPageNames[section.id] ? 'Publicado' : 'Rascunho'}
                  </span>
                }
                name={
                  editingTitleId === section.id ? (
                    <input
                      autoFocus
                      value={editingTitleValue}
                      onChange={(e) => setEditingTitleValue(e.target.value)}
                      onBlur={() => saveSectionName(section.id, editingTitleValue)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveSectionName(section.id, editingTitleValue);
                        if (e.key === 'Escape') setEditingTitleId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '100%',
                        fontSize:   adminVar('item-title-list', 'size'),
                        fontWeight: adminVar('item-title-list', 'weight'),
                        color:      adminVar('item-title-list', 'color'),
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--admin-field-border, #e5e7eb)',
                        outline: 'none',
                        padding: '0',
                      }}
                    />
                  ) : (
                    <span
                      className="group/title flex items-center gap-1 cursor-text"
                      onClick={() => {
                        setEditingTitleId(section.id);
                        setEditingTitleValue(section.name || '');
                      }}
                      title="Clique para renomear"
                    >
                      <span className="truncate">{section.name}</span>
                      <Pencil
                        className="h-3 w-3 flex-shrink-0 opacity-0 group-hover/title:opacity-40"
                        style={{ transition: 'none' }}
                      />
                    </span>
                  )
                }
                meta={
                  <>
                    {/* Linha 2: página onde está incorporada (ou "Não publicada") */}
                    <p
                      style={{
                        fontSize:   adminVar('item-description', 'size'),
                        fontWeight: adminVar('item-description', 'weight'),
                        color:      adminVar('item-description', 'color'),
                        marginTop: '0.125rem',
                      }}
                    >
                      {pageName ?? 'Não incorporada'}
                    </p>

                    {/* Linha 3: altura | grid | elementos */}
                    <p
                      style={{
                        fontSize:   adminVar('item-tertiary', 'size'),
                        fontWeight: adminVar('item-tertiary', 'weight'),
                        color:      adminVar('item-tertiary', 'color'),
                        marginTop: '0.125rem',
                      }}
                    >
                      {sectionInfo}
                    </p>
                  </>
                }
                actions={
                  <AdminDropdownMenu
                    actions={[
                      { label: 'Editar',    icon: <Edit className="w-4 h-4" />,   onClick: () => handleEdit(section) },
                      { label: 'Duplicar',  icon: <Copy className="w-4 h-4" />,   onClick: () => handleClone(section) },
                      { label: 'Excluir',   icon: <Trash2 className="w-4 h-4" />, onClick: () => handleDelete(section), variant: 'destructive' },
                    ]}
                  />
                }
              />
            );
          })
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <CreateSectionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); loadSections(); }}
        />
      )}

      {/* Edit Config Modal */}
      {editConfigModalOpen && editingSection && (
        <UnifiedSectionConfigModal
          pageSection={{
            id: editingSection.id,
            page_id: '',
            section_id: editingSection.id,
            order: 0,
            config: editingSection.config,
            section: {
              id: editingSection.id,
              name: editingSection.name,
              type: editingSection.type,
              config: editingSection.config,
              elements: editingSection.elements,
              layout: editingSection.layout,
              styling: editingSection.styling,
            },
          }}
          onClose={() => setEditConfigModalOpen(false)}
          onSave={async (config, elements, layout, styling) => {
            try {
              const updateData: any = { config };
              if (elements) updateData.elements = elements;
              if (layout)   updateData.layout   = layout;
              if (styling)  updateData.styling  = styling;

              const { error } = await supabase
                .from('sections')
                .update(updateData)
                .eq('id', editingSection.id);

              if (error) throw error;

              toast.success('Configurações salvas com sucesso!', { icon: <CheckCircle className="h-4 w-4" /> });
              setEditConfigModalOpen(false);
              loadSections();
            } catch (error) {
              console.error('Error saving config:', error);
              toast.error('Erro ao salvar configurações', { icon: <AlertCircle className="h-4 w-4" /> });
            }
          }}
          onSaveAs={async (config, elements, layout, styling) => {
            try {
              const { error } = await supabase
                .from('sections')
                .insert([{
                  name: `${editingSection.name} (Cópia)`,
                  type: editingSection.type,
                  config,
                  elements,
                  layout,
                  styling,
                  global: editingSection.global,
                  published: false,
                }])
                .select()
                .single();

              if (error) throw error;

              toast.success('Seção duplicada com sucesso!', { icon: <CheckCircle className="h-4 w-4" /> });
              setEditConfigModalOpen(false);
              loadSections();
            } catch (error) {
              console.error('Error saving as new section:', error);
              toast.error('Erro ao duplicar seção', { icon: <AlertCircle className="h-4 w-4" /> });
            }
          }}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={showDeleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => { setShowDeleteConfirm(false); setSectionToDelete(null); }}
        title={`Excluir "${sectionToDelete?.name}"`}
        description="Tem certeza que deseja excluir esta seção? Esta ação não pode ser desfeita."
      />
    </AdminPageLayout>
  );
}