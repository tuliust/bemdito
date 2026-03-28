import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, Filter, Grid3x3, Loader2, Pencil } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { BaseModal } from '@/app/components/admin/BaseModal';
import { ConfirmDeleteDialog } from '@/app/components/admin/ConfirmDeleteDialog';
import { AlertMessageDialog } from '@/app/components/admin/AlertMessageDialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { AdminDropdownMenu } from '@/app/components/admin/AdminDropdownMenu';
import { TemplateEditorModal } from './TemplateEditorModal';
import { AdminPageLayout } from '@/app/components/admin/AdminPageLayout';
import { AdminEmptyState } from '@/app/components/admin/AdminEmptyState';
import { AdminGridCard } from '@/app/components/admin/AdminGridCard';
import { adminVar } from '@/app/components/admin/AdminThemeProvider';
import { AdminPrimaryButton } from '@/app/components/admin/AdminPrimaryButton';

interface CardTemplate {
  id: string;
  name: string;
  variant: string;
  columns_desktop: number;
  columns_tablet: number;
  columns_mobile: number;
  gap: string;
  has_filters: boolean;
  created_at: string;
  _count?: {
    filters: number;
    cards: number;
  };
}

export default function Page() {
  // State
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [usedTemplateIds, setUsedTemplateIds] = useState<Set<string>>(new Set());

  // ── Rótulos legíveis para variantes ──────────────────────────────────────
  const VARIANT_LABELS: Record<string, string> = {
    'grid':         'Grid (padrão)',
    'list':         'Lista',
    'masonry':      'Masonry',
    'scroll-reveal':'Scroll Reveal',
    'carousel':     'Carrossel',
  };

  // Inline title editing
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CardTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<CardTemplate | null>(null);

  // Alert
  const [alertMsg, setAlertMsg] = useState<{ title?: string; message: string } | null>(null);
  const showAlert = (message: string, title?: string) => setAlertMsg({ message, title });
  
  // Form state
  const [templateName, setTemplateName] = useState('');
  const [templateVariant, setTemplateVariant] = useState<'grid' | 'list' | 'masonry' | 'scroll-reveal'>('grid');
  const [createHasUnsaved, setCreateHasUnsaved] = useState(false);

  // ── Inline title save ────────────────────────────────────────────────────
  const saveTemplateName = async (templateId: string, newName: string) => {
    const trimmed = newName.trim();
    setEditingTitleId(null);
    if (!trimmed) return;
    const prev = templates.find(t => t.id === templateId)?.name;
    if (trimmed === prev) return;
    setTemplates(templates.map(t => t.id === templateId ? { ...t, name: trimmed } : t));
    const { error } = await supabase
      .from('card_templates')
      .update({ name: trimmed })
      .eq('id', templateId);
    if (error) {
      console.error('❌ Erro ao renomear template:', error);
      setTemplates(templates.map(t => t.id === templateId ? { ...t, name: prev! } : t));
    }
  };

  // Load templates
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    
    try {
      // ✅ OTIMIZAÇÃO 2026-02-18: Buscar templates, filtros e cards em paralelo (3 queries totais)
      const [templatesResult, filtersResult, cardsResult, sectionsResult] = await Promise.all([
        supabase
          .from('card_templates')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('card_filters')
          .select('template_id'),
        supabase
          .from('template_cards')
          .select('template_id'),
        supabase
          .from('sections')
          .select("config->>cardTemplateId"),
      ]);

      if (templatesResult.error) {
        console.error('❌ Erro ao carregar templates:', templatesResult.error);
        return;
      }

      // Contar filtros e cards por template_id em memória (O(n))
      const filterCounts: Record<string, number> = {};
      const cardCounts: Record<string, number> = {};

      (filtersResult.data || []).forEach((filter) => {
        filterCounts[filter.template_id] = (filterCounts[filter.template_id] || 0) + 1;
      });

      (cardsResult.data || []).forEach((card) => {
        cardCounts[card.template_id] = (cardCounts[card.template_id] || 0) + 1;
      });

      // Anexar contagens aos templates (O(n))
      const templatesWithCounts = (templatesResult.data || []).map((template) => ({
        ...template,
        _count: {
          filters: filterCounts[template.id] || 0,
          cards: cardCounts[template.id] || 0,
        },
      }));

      // IDs de templates usados em pelo menos 1 seção
      const usedIds = new Set<string>(
        (sectionsResult.data || [])
          .map((row: any) => row['?column?'] || row.cardTemplateId || (row as any)['config->>cardTemplateId'])
          .filter(Boolean)
      );
      setUsedTemplateIds(usedIds);

      setTemplates(templatesWithCounts);
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setShowCreateModal(true);
  };

  const handleEdit = (template: CardTemplate) => {
    setEditingTemplate(template);
    setShowEditorModal(true);
  };

  const handleDelete = (template: CardTemplate) => {
    setTemplateToDelete(template);
    setShowDeleteConfirm(true);
  };

  const handleClone = async (template: CardTemplate) => {
    try {
      const { data: newTemplate, error } = await supabase
        .from('card_templates')
        .insert({
          name: `${template.name} (Cópia)`,
          variant: template.variant,
          columns_desktop: template.columns_desktop,
          columns_tablet: template.columns_tablet,
          columns_mobile: template.columns_mobile,
          gap: template.gap,
          has_filters: template.has_filters,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao duplicar template:', error);
        return;
      }

      await loadTemplates();
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateName.trim()) {
      showAlert('Por favor, insira um nome para o template.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('card_templates')
        .insert({
          name: templateName,
          variant: templateVariant,
          columns_desktop: 3,
          columns_tablet: 2,
          columns_mobile: 1,
          gap: 'md',
          card_border_radius: '2xl',
          card_padding: 'md',
          card_shadow: 'md',
          has_icon: true,
          icon_size: 32,
          icon_position: 'top',
          has_title: true,
          title_font_weight: 600,
          has_subtitle: true,
          subtitle_font_weight: 400,
          has_media: false,
          has_link: true,
          link_style: 'card',
          has_filters: false,
          filters_position: 'top',
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar template:', error);
        showAlert('Erro ao criar template. Verifique o console.', 'Erro');
        return;
      }

      setShowCreateModal(false);
      setTemplateName('');
      setTemplateVariant('grid');
      setCreateHasUnsaved(false);
      await loadTemplates();
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
    }
  };

  const confirmDelete = async () => {
    if (!templateToDelete) return;

    try {
      const { error } = await supabase
        .from('card_templates')
        .delete()
        .eq('id', templateToDelete.id);

      if (error) {
        console.error('❌ Erro ao deletar template:', error);
        showAlert('Erro ao deletar template. Verifique o console.', 'Erro');
        return;
      }

      setShowDeleteConfirm(false);
      setTemplateToDelete(null);
      await loadTemplates();
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
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
      title="Cards"
      description="Crie templates reutilizáveis de cards para usar nas seções"
      headerActions={
        <AdminPrimaryButton onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </AdminPrimaryButton>
      }
    >
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <AdminEmptyState
            message="Nenhum template criado ainda"
            cta={{ label: 'Criar Primeiro Template', onClick: handleCreate }}
            className="col-span-full"
          />
        ) : (
          templates.map((template) => {
            return (
              <AdminGridCard
                key={template.id}
                preview={
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{ color: 'var(--admin-grid-preview-content-color, #ffffff)' }}
                  >
                    <Grid3x3 className="h-12 w-12 mb-2 opacity-50" />
                    <p
                      className="opacity-70"
                      style={{
                        fontSize:   'var(--admin-grid-preview-content-size,   0.875rem)',
                        fontWeight: 'var(--admin-grid-preview-content-weight, 400)',
                      }}
                    >
                      {template.variant}
                    </p>
                  </div>
                }
                badge={
                  <span
                    className="px-2 py-1 rounded"
                    style={{
                      fontSize:        'var(--admin-badge-label-size,   0.75rem)',
                      fontWeight:      'var(--admin-badge-label-weight, 500)',
                      color:           'var(--admin-badge-label-color,  #ffffff)',
                      backgroundColor: usedTemplateIds.has(template.id)
                        ? 'var(--primary, #ea526e)'
                        : 'var(--admin-field-placeholder, #9ca3af)',
                    }}
                  >
                    {usedTemplateIds.has(template.id) ? 'Publicado' : 'Rascunho'}
                  </span>
                }
                name={
                  editingTitleId === template.id ? (
                    <input
                      autoFocus
                      value={editingTitleValue}
                      onChange={(e) => setEditingTitleValue(e.target.value)}
                      onBlur={() => saveTemplateName(template.id, editingTitleValue)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTemplateName(template.id, editingTitleValue);
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
                        setEditingTitleId(template.id);
                        setEditingTitleValue(template.name);
                      }}
                      title="Clique para renomear"
                    >
                      <span className="truncate">{template.name}</span>
                      <Pencil
                        className="h-3 w-3 flex-shrink-0 opacity-0 group-hover/title:opacity-40"
                        style={{ transition: 'none' }}
                      />
                    </span>
                  )
                }
                meta={
                  <>
                    <p
                      style={{
                        fontSize:   adminVar('item-description', 'size'),
                        fontWeight: adminVar('item-description', 'weight'),
                        color:      adminVar('item-description', 'color'),
                        marginTop: '0.125rem',
                      }}
                    >
                      {VARIANT_LABELS[template.variant] || template.variant}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{
                        fontSize: adminVar('item-tertiary', 'size'),
                        color:    adminVar('item-tertiary', 'color'),
                      }}>
                        <Filter className="w-3 h-3 inline mr-1" />
                        {template._count?.filters || 0} filtros
                      </span>
                      <span style={{
                        fontSize: adminVar('item-tertiary', 'size'),
                        color:    adminVar('item-tertiary', 'color'),
                      }}>
                        {template._count?.cards || 0} cards
                      </span>
                      <span style={{
                        fontSize: adminVar('item-tertiary', 'size'),
                        color:    adminVar('item-tertiary', 'color'),
                      }}>
                        {template.columns_desktop} col
                      </span>
                    </div>
                  </>
                }
                actions={
                  <AdminDropdownMenu
                    align="end"
                    actions={[
                      {
                        label: 'Editar',
                        icon: <Edit className="h-4 w-4" />,
                        onClick: () => handleEdit(template),
                      },
                      {
                        label: 'Duplicar',
                        icon: <Copy className="h-4 w-4" />,
                        onClick: () => handleClone(template),
                      },
                      {
                        label: 'Excluir',
                        icon: <Trash2 className="h-4 w-4" />,
                        onClick: () => handleDelete(template),
                        variant: 'destructive',
                      },
                    ]}
                  />
                }
              />
            );
          })
        )}
      </div>

      {/* Create Template Modal */}
      <BaseModal
        open={showCreateModal}
        onOpenChange={(open) => {
          if (!open) {
            setTemplateName('');
            setTemplateVariant('grid');
            setCreateHasUnsaved(false);
          }
          setShowCreateModal(open);
        }}
        title="Criar Novo Template"
        description="Crie um template de cards para usar nas seções do site"
        hasUnsavedChanges={createHasUnsaved}
        onSave={handleCreateTemplate}
        saveLabel="Criar Template"
        onCancel={() => {
          setShowCreateModal(false);
          setTemplateName('');
          setTemplateVariant('grid');
          setCreateHasUnsaved(false);
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="template-name">Nome do Template</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => { setTemplateName(e.target.value); setCreateHasUnsaved(true); }}
              placeholder="Ex: Cards de Serviços"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="template-variant">Variante</Label>
            <select
              id="template-variant"
              value={templateVariant}
              onChange={(e) => { setTemplateVariant(e.target.value as 'grid' | 'list' | 'masonry' | 'scroll-reveal'); setCreateHasUnsaved(true); }}
              className="mt-1 w-full px-3 py-2 rounded-lg focus:outline-none"
              style={{
                backgroundColor: 'var(--admin-field-bg,     #ffffff)',
                color:           'var(--admin-field-text,    #111827)',
                border:          '2px solid var(--admin-field-border, #e5e7eb)',
                fontSize:        'var(--admin-dropdown-item-text-size, 0.875rem)',
              }}
            >
              <option value="grid">Grid (padrão)</option>
              <option value="list">Lista</option>
              <option value="masonry">Masonry</option>
              <option value="scroll-reveal">Scroll Reveal</option>
            </select>
          </div>
        </div>
      </BaseModal>

      {/* Template Editor Modal */}
      <TemplateEditorModal
        open={showEditorModal}
        onOpenChange={setShowEditorModal}
        template={editingTemplate}
        onSave={async () => {
          await loadTemplates();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={showDeleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => { setShowDeleteConfirm(false); setTemplateToDelete(null); }}
        title={`Excluir "${templateToDelete?.name}"`}
        description="Tem certeza que deseja excluir este template? Todos os filtros e cards associados também serão deletados. Esta ação não pode ser desfeita."
      />

      {/* Alert dialog */}
      <AlertMessageDialog
        open={!!alertMsg}
        message={alertMsg?.message ?? ''}
        title={alertMsg?.title}
        onClose={() => setAlertMsg(null)}
      />
    </AdminPageLayout>
  );
}