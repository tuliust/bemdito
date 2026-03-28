import React, { useState, useEffect } from 'react';
import { BaseModal } from '@/app/components/admin/BaseModal';
import { ConfirmDeleteDialog } from '@/app/components/admin/ConfirmDeleteDialog';
import { AlertMessageDialog } from '@/app/components/admin/AlertMessageDialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { ColorTokenPicker } from '@/app/components/ColorTokenPicker';
import { TypeScalePicker } from '@/app/components/admin/TypeScalePicker';
import { MediaUploader } from '@/app/components/admin/MediaUploader';
import { IconPicker } from '@/app/components/admin/IconPicker';
import { Textarea } from '@/app/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';
import {
  Layout, Palette, FileText,
  ChevronDown, ChevronUp,
  Plus, Pencil, Trash2, ArrowLeft,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible';
import { Switch } from '@/app/components/ui/switch';
import { OpacitySlider } from '@/app/components/admin/OpacitySlider';

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface CardTemplate {
  id: string;
  name: string;
  variant: 'grid' | 'list' | 'masonry' | 'scroll-reveal' | 'carousel';
  columns_desktop: number;
  columns_tablet: number;
  columns_mobile: number;
  gap: string;
  card_bg_color_token?: string | null;
  card_border_color_token?: string | null;
  card_border_radius: string;
  card_border_width?: number;
  card_padding: string;
  card_shadow: string;
  has_icon: boolean;
  icon_size: number;
  icon_color_token?: string | null;
  icon_bg_color_token?: string | null; // ✅ FIX: campo existente no banco, sem representação anterior no TS
  icon_position: string;
  has_title: boolean;
  title_font_size?: string | null;
  title_font_weight: number;
  title_color_token?: string | null;
  has_subtitle: boolean;
  subtitle_font_size?: string | null;
  subtitle_font_weight: number;
  subtitle_color_token?: string | null;
  has_media: boolean;
  example_media_url?: string | null;
  media_position: string;
  media_aspect_ratio: string;
  media_border_radius: string;
  media_opacity?: number;
  has_link: boolean;
  link_style: string;
  link_text_color_token?: string | null;
  has_filters: boolean;
  filters_position: string;
  filter_button_bg_color_token?: string | null;
  filter_button_text_color_token?: string | null;
  filter_button_border_color_token?: string | null;
  filter_active_bg_color_token?: string | null;
  filter_active_text_color_token?: string | null;
  filter_active_border_color_token?: string | null;
}

interface CardFilter {
  id: string;
  template_id: string;
  label: string;
  slug: string;
  icon?: string;
  order_index: number;
}

interface TemplateCard {
  id: string;
  template_id: string;
  icon?: string;
  title?: string;
  subtitle?: string;
  media_url?: string;
  media_opacity?: number;
  link_url?: string;
  link_type: string;
  filter_id?: string;
  order_index: number;
}

interface TemplateEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: CardTemplate | null;
  onSave: () => void;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ─── Componente de seção colapsável reutilizável ──────────────────────────────

function Section({
  label,
  open,
  onOpenChange,
  children,
}: {
  label: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)', border: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
        <CollapsibleTrigger
          className="w-full px-4 py-3 flex items-center justify-between rounded-lg"
          style={{ transition: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--admin-collapsible-hover-bg, #f3f4f6)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <h3 className="uppercase tracking-wide" style={{ fontSize: 'var(--admin-collapsible-label-size, 0.75rem)', fontWeight: 'var(--admin-collapsible-label-weight, 600)', color: 'var(--admin-collapsible-label-color, #374151)' }}>{label}</h3>
          {open
            ? <ChevronUp className="h-4 w-4" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
            : <ChevronDown className="h-4 w-4" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
          }
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-1 space-y-3" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// ─── Card compacto para seleção de cor (grid 3 colunas) ──────────────────────

function CompactColorCard({
  label, open, onOpenChange, children,
}: { label: string; open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)', border: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
        <CollapsibleTrigger
          className="w-full px-3 py-2.5 flex items-center justify-between"
          style={{ transition: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--admin-collapsible-hover-bg, #f3f4f6)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span className="uppercase tracking-wide" style={{ fontSize: 'var(--admin-collapsible-label-size, 0.7rem)', fontWeight: 'var(--admin-collapsible-label-weight, 600)', color: 'var(--admin-collapsible-label-color, #374151)' }}>
            {label}
          </span>
          {open
            ? <ChevronUp   className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
            : <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
          }
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-2 pb-3 pt-2" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function TemplateEditorModal({
  open,
  onOpenChange,
  template,
  onSave,
}: TemplateEditorModalProps) {

  // ── Estado do formulário ──
  const [formData, setFormData] = useState<Partial<CardTemplate>>({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'layout' | 'design' | 'content'>('layout');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ── Alert dialog ──
  const [alertMsg, setAlertMsg] = useState<{ title?: string; message: string } | null>(null);
  const showAlert = (message: string, title?: string) => setAlertMsg({ message, title });

  // ── Collapsibles (Layout) ──
  const [secGeral, setSecGeral] = useState(true);
  const [secGrid, setSecGrid] = useState(false);
  const [secCard, setSecCard] = useState(false);
  const [secIconLayout, setSecIconLayout] = useState(false);

  // ── Collapsibles (Design) ──
  const [secCardColors, setSecCardColors] = useState(false);
  const [secBorda, setSecBorda] = useState(false);
  const [secIcon, setSecIcon] = useState(false);
  const [secIconBg, setSecIconBg] = useState(false);
  const [secTitle, setSecTitle] = useState(false);
  const [secSubtitle, setSecSubtitle] = useState(false);
  const [secMedia, setSecMedia] = useState(false);
  const [secFilters, setSecFilters] = useState(false);

  // ── Conteúdo (filtros + cards) ──
  const [filters, setFilters] = useState<CardFilter[]>([]);
  const [cards, setCards] = useState<TemplateCard[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  // ── Edição inline de filtro ──
  const [editingFilterId, setEditingFilterId] = useState<string | null>(null);
  const [filterDraft, setFilterDraft] = useState({ label: '', slug: '', icon: '' });
  const [savingFilter, setSavingFilter] = useState(false);

  // ── Sub-view de card (sem modal aninhado) ──
  const [editingCard, setEditingCard] = useState<TemplateCard | null>(null);
  const [cardDraft, setCardDraft] = useState({
    icon: '',
    title: '',
    subtitle: '',
    media_url: '',
    media_opacity: 100,
    link_url: '',
    link_type: 'internal' as 'internal' | 'external',
  });
  const [savingCard, setSavingCard] = useState(false);

  // ── Delete confirmations ──
  const [filterToDelete, setFilterToDelete] = useState<string | null>(null);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  // ── Inicialização ──
  useEffect(() => {
    if (open && template) {
      setFormData(template);
      setEditingCard(null);
      setEditingFilterId(null);
      setActiveTab('layout');
      setHasUnsavedChanges(false);
      loadContent(template.id);
    }
  }, [open, template]);

  const loadContent = async (templateId: string) => {
    setLoadingContent(true);
    try {
      const [{ data: filtersData }, { data: cardsData }] = await Promise.all([
        supabase.from('card_filters').select('*').eq('template_id', templateId).order('order_index'),
        supabase.from('template_cards').select('*').eq('template_id', templateId).order('order_index'),
      ]);
      setFilters(filtersData || []);
      setCards(cardsData || []);
      if (filtersData && filtersData.length > 0) setSelectedFilter(filtersData[0].id);
    } catch (err) {
      console.error('Erro ao carregar conteúdo:', err);
    } finally {
      setLoadingContent(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  // ── Salvar template ──
  const handleSave = async () => {
    if (!template) return;
    setSaving(true);
    try {
      const { _count, created_at, updated_at, ...clean } = formData as any;
      const { error } = await supabase.from('card_templates').update(clean).eq('id', template.id);
      if (error) { showAlert('Erro ao salvar template. Verifique o console.', 'Erro'); console.error(error); return; }
      setHasUnsavedChanges(false);
      onSave();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  // ── Filtros ──
  const handleAddFilter = async () => {
    if (!template) return;
    const { data, error } = await supabase
      .from('card_filters')
      .insert({ template_id: template.id, label: 'Novo Filtro', slug: `filtro-${Date.now()}`, order_index: filters.length })
      .select().single();
    if (error) { showAlert('Erro ao criar filtro. Verifique o console.', 'Erro'); return; }
    const newList = [...filters, data];
    setFilters(newList);
    setSelectedFilter(data.id);
    setEditingFilterId(data.id);
    setFilterDraft({ label: data.label, slug: data.slug, icon: '' });
  };

  const handleDeleteFilter = async (filterId: string) => {
    setFilterToDelete(filterId);
  };

  const confirmDeleteFilter = async () => {
    if (!filterToDelete) return;
    const { error } = await supabase.from('card_filters').delete().eq('id', filterToDelete);
    if (error) { console.error('Erro ao excluir filtro:', error); }
    else {
      const remaining = filters.filter(f => f.id !== filterToDelete);
      setFilters(remaining);
      if (selectedFilter === filterToDelete) setSelectedFilter(remaining[0]?.id || null);
      if (editingFilterId === filterToDelete) setEditingFilterId(null);
    }
    setFilterToDelete(null);
  };

  const startEditFilter = (filter: CardFilter) => {
    setEditingFilterId(filter.id);
    setFilterDraft({ label: filter.label, slug: filter.slug, icon: filter.icon || '' });
  };

  const cancelEditFilter = () => setEditingFilterId(null);

  const saveFilter = async () => {
    if (!editingFilterId) return;
    if (!filterDraft.label.trim()) { showAlert('O label não pode estar vazio.'); return; }
    setSavingFilter(true);
    try {
      const updates = { label: filterDraft.label.trim(), slug: filterDraft.slug.trim(), icon: filterDraft.icon || undefined };
      const { error } = await supabase.from('card_filters').update(updates).eq('id', editingFilterId);
      if (error) throw error;
      setFilters(filters.map(f => f.id === editingFilterId ? { ...f, ...updates } : f));
      setEditingFilterId(null);
    } catch (err) {
      showAlert('Erro ao salvar filtro. Verifique o console.', 'Erro');
    } finally {
      setSavingFilter(false);
    }
  };

  // ── Cards ──
  const handleAddCard = async () => {
    if (!template) return;
    const { data, error } = await supabase
      .from('template_cards')
      .insert({
        template_id: template.id,
        title: 'Novo Card',
        subtitle: 'Descrição do card',
        link_type: 'internal',
        filter_id: selectedFilter || undefined,
        order_index: cards.filter(c => c.filter_id === selectedFilter).length,
        // ✅ FIX: herdar media_opacity do template ao criar novo card
        media_opacity: formData.media_opacity ?? 100,
      })
      .select().single();
    if (error) { showAlert('Erro ao criar card. Verifique o console.', 'Erro'); return; }
    setCards([...cards, data]);
    startEditCard(data);
  };

  const handleDeleteCard = async (cardId: string) => {
    setCardToDelete(cardId);
  };

  const confirmDeleteCard = async () => {
    if (!cardToDelete) return;
    const { error } = await supabase.from('template_cards').delete().eq('id', cardToDelete);
    if (error) { console.error('Erro ao excluir card:', error); }
    else { setCards(cards.filter(c => c.id !== cardToDelete)); }
    setCardToDelete(null);
  };

  const startEditCard = (card: TemplateCard) => {
    setEditingCard(card);
    setCardDraft({
      icon: card.icon || '',
      title: card.title || '',
      subtitle: card.subtitle || '',
      media_url: card.media_url || '',
      media_opacity: card.media_opacity ?? 100,
      link_url: card.link_url || '',
      link_type: (card.link_type as 'internal' | 'external') || 'internal',
    });
    setActiveTab('content');
  };

  const cancelEditCard = () => setEditingCard(null);

  const saveCard = async () => {
    if (!editingCard) return;
    if (formData.has_title && !cardDraft.title.trim()) { showAlert('O título não pode estar vazio.'); return; }
    setSavingCard(true);
    try {
      const updates: Partial<TemplateCard> = {};
      if (formData.has_icon) updates.icon = cardDraft.icon || undefined;
      if (formData.has_title !== false) updates.title = cardDraft.title.trim();
      if (formData.has_subtitle !== false) updates.subtitle = cardDraft.subtitle.trim();
      if (formData.has_media) { updates.media_url = cardDraft.media_url || undefined; updates.media_opacity = cardDraft.media_opacity; }
      if (formData.has_link !== false) { updates.link_url = cardDraft.link_url.trim() || undefined; updates.link_type = cardDraft.link_type; }

      const { data, error } = await supabase.from('template_cards').update(updates).eq('id', editingCard.id).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Nenhum card atualizado');
      setCards(cards.map(c => c.id === editingCard.id ? { ...c, ...updates } : c));
      setEditingCard(null);
    } catch (err) {
      console.error('Erro ao salvar card:', err);
      showAlert('Erro ao salvar card. Verifique o console.', 'Erro');
    } finally {
      setSavingCard(false);
    }
  };

  // ── Derivados ──
  if (!template) return null;

  const filteredCards = !formData.has_filters
    ? cards  // filtros desativados → exibe todos os cards
    : selectedFilter
      ? cards.filter(c => c.filter_id === selectedFilter)
      : cards.filter(c => !c.filter_id);

  // ── Tab bar ──
  const tabBtn = (id: 'layout' | 'design' | 'content', icon: React.ReactNode, label: string) => (
    <button
      key={id}
      onClick={() => { setActiveTab(id); setEditingCard(null); }}
      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium"
      style={{
        transition:      'none',
        backgroundColor: activeTab === id ? 'var(--admin-tab-active-bg, #ffffff)'  : 'transparent',
        color:           activeTab === id ? 'var(--admin-tab-active-text, #111827)' : 'var(--admin-tab-label-color, #717182)',
        boxShadow:       activeTab === id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
        fontSize:        'var(--admin-tab-label-size,   0.875rem)',
        fontWeight:      activeTab === id ? 'var(--admin-tab-active-weight, 600)' : 'var(--admin-tab-label-weight, 500)',
      }}
    >
      {icon}
      {label}
    </button>
  );

  // ── Conteúdo: lista de filtros + cards ──
  const renderContentList = () => (
    <div className="space-y-4">

      {/* Filtros */}
      {formData.has_filters && (
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)', border: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
            <h3 className="uppercase tracking-wide" style={{ fontSize: 'var(--admin-collapsible-label-size, 0.75rem)', fontWeight: 'var(--admin-collapsible-label-weight, 600)', color: 'var(--admin-collapsible-label-color, #374151)' }}>
              Filtros / Abas ({filters.length})
            </h3>
            <Button size="sm" onClick={handleAddFilter} className="h-7 text-xs gap-1">
              <Plus className="h-3.5 w-3.5" /> Adicionar
            </Button>
          </div>

          <div className="p-3 space-y-1.5">
            {filters.length === 0 && (
              <p className="text-sm text-center py-3" style={{ color: 'var(--admin-item-description-color, #9ca3af)' }}>
                Nenhum filtro. Clique em "Adicionar" para começar.
              </p>
            )}

            {filters.map((filter) => (
              <div key={filter.id}>
                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer"
                  style={{
                    backgroundColor: editingFilterId === filter.id ? 'rgba(234,82,110,0.05)' : selectedFilter === filter.id ? 'var(--admin-list-item-selected-bg, #eff6ff)' : 'var(--admin-list-item-bg, #ffffff)',
                    border: `1px solid ${editingFilterId === filter.id ? 'var(--primary, #ea526e)' : selectedFilter === filter.id ? 'var(--admin-list-item-selected-border, #93c5fd)' : 'var(--admin-list-item-border, #e5e7eb)'}`,
                    transition: 'none',
                  }}
                  onMouseEnter={(e) => { if (editingFilterId !== filter.id && selectedFilter !== filter.id) e.currentTarget.style.borderColor = 'var(--admin-list-item-hover-border, #d1d5db)'; }}
                  onMouseLeave={(e) => { if (editingFilterId !== filter.id && selectedFilter !== filter.id) e.currentTarget.style.borderColor = 'var(--admin-list-item-border, #e5e7eb)'; }}
                  onClick={() => { if (editingFilterId !== filter.id) setSelectedFilter(filter.id); }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="truncate" style={{ fontSize: 'var(--admin-list-item-title-size, 0.875rem)', fontWeight: 'var(--admin-list-item-title-weight, 500)', color: 'var(--admin-list-item-title-color, #111827)' }}>{filter.label}</span>
                    <span className="ml-2" style={{ fontSize: 'var(--admin-list-item-meta-size, 0.75rem)', color: 'var(--admin-list-item-meta-color, #9ca3af)' }}>
                      ({cards.filter(c => c.filter_id === filter.id).length} cards)
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0 ml-2">
                    <button
                      className="h-7 w-7 flex items-center justify-center rounded"
                      style={{ color: 'var(--admin-btn-action-text, #6b7280)', transition: 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--admin-btn-action-hover-bg, #f3f4f6)'; e.currentTarget.style.color = 'var(--admin-btn-action-hover-text, #111827)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--admin-btn-action-text, #6b7280)'; }}
                      onClick={(e) => { e.stopPropagation(); startEditFilter(filter); }}
                      title="Editar filtro"
                    ><Pencil className="h-3.5 w-3.5" /></button>
                    <button
                      className="h-7 w-7 flex items-center justify-center rounded"
                      style={{ color: 'var(--admin-delete-btn-text, #6b7280)', transition: 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--admin-delete-btn-hover-bg, #fef2f2)'; e.currentTarget.style.color = 'var(--admin-delete-btn-hover-text, #ef4444)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--admin-delete-btn-text, #6b7280)'; }}
                      onClick={(e) => { e.stopPropagation(); handleDeleteFilter(filter.id); }}
                      title="Excluir filtro"
                    ><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>

                {editingFilterId === filter.id && (
                  <div className="mt-1 mb-1 p-4 rounded-lg space-y-3" style={{ backgroundColor: 'var(--admin-list-item-bg, #ffffff)', border: '1px solid var(--primary, #ea526e)' }}>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Label (nome exibido)</Label>
                        <Input value={filterDraft.label} onChange={(e) => { const v = e.target.value; setFilterDraft(p => ({ ...p, label: v, slug: (!p.slug || p.slug.startsWith('filtro-')) ? generateSlug(v) : p.slug })); }} className="mt-1 h-8 text-sm" placeholder="Ex: Marketing Digital" />
                      </div>
                      <div>
                        <Label>Slug (identificador)</Label>
                        <Input value={filterDraft.slug} onChange={(e) => setFilterDraft(p => ({ ...p, slug: e.target.value }))} className="mt-1 h-8 text-sm" placeholder="marketing-digital" />
                      </div>
                    </div>
                    <div>
                      <Label>Ícone (opcional)</Label>
                      <div className="mt-1"><IconPicker value={filterDraft.icon} onChange={(v) => setFilterDraft(p => ({ ...p, icon: v }))} /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
                      <Button size="sm" variant="outline" onClick={cancelEditFilter} disabled={savingFilter} className="h-8 text-xs">Cancelar</Button>
                      <Button size="sm" onClick={saveFilter} disabled={savingFilter} className="h-8 text-xs">{savingFilter ? 'Salvando...' : 'Salvar Filtro'}</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)', border: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
          <h3 className="uppercase tracking-wide" style={{ fontSize: 'var(--admin-collapsible-label-size, 0.75rem)', fontWeight: 'var(--admin-collapsible-label-weight, 600)', color: 'var(--admin-collapsible-label-color, #374151)' }}>
            Cards
            {formData.has_filters && selectedFilter && (
              <span className="font-normal ml-1" style={{ color: 'var(--admin-list-item-meta-color, #9ca3af)' }}>
                — {filters.find(f => f.id === selectedFilter)?.label || ''} ({filteredCards.length})
              </span>
            )}
          </h3>
          <Button size="sm" onClick={handleAddCard} className="h-7 text-xs gap-1">
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </Button>
        </div>

        <div className="p-3 space-y-1.5">
          {loadingContent && (<p className="text-sm text-center py-3" style={{ color: 'var(--admin-item-description-color, #9ca3af)' }}>Carregando...</p>)}
          {!loadingContent && filteredCards.length === 0 && (
            <p className="text-sm text-center py-3" style={{ color: 'var(--admin-item-description-color, #9ca3af)' }}>
              Nenhum card{formData.has_filters && selectedFilter ? ' nesta aba' : ''}. Clique em "Adicionar" para começar.
            </p>
          )}
          {!loadingContent && filteredCards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between px-3 py-2.5 rounded-md"
              style={{ backgroundColor: 'var(--admin-list-item-bg, #ffffff)', border: '1px solid var(--admin-list-item-border, #e5e7eb)', transition: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--admin-list-item-hover-border, #d1d5db)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--admin-list-item-border, #e5e7eb)')}
            >
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontSize: 'var(--admin-list-item-title-size, 0.875rem)', fontWeight: 'var(--admin-list-item-title-weight, 500)', color: 'var(--admin-list-item-title-color, #111827)' }}>{card.title || 'Sem título'}</p>
                <p className="truncate" style={{ fontSize: 'var(--admin-list-item-meta-size, 0.75rem)', color: 'var(--admin-list-item-meta-color, #9ca3af)' }}>{card.subtitle || 'Sem descrição'}</p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0 ml-2">
                <button className="h-7 w-7 flex items-center justify-center rounded" style={{ color: 'var(--admin-btn-action-text, #6b7280)', transition: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--admin-btn-action-hover-bg, #f3f4f6)'; e.currentTarget.style.color = 'var(--admin-btn-action-hover-text, #111827)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--admin-btn-action-text, #6b7280)'; }}
                  onClick={() => startEditCard(card)} title="Editar card"
                ><Pencil className="h-3.5 w-3.5" /></button>
                <button className="h-7 w-7 flex items-center justify-center rounded" style={{ color: 'var(--admin-delete-btn-text, #6b7280)', transition: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--admin-delete-btn-hover-bg, #fef2f2)'; e.currentTarget.style.color = 'var(--admin-delete-btn-hover-text, #ef4444)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--admin-delete-btn-text, #6b7280)'; }}
                  onClick={() => handleDeleteCard(card.id)} title="Excluir card"
                ><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Conteúdo: editor de card (sub-view, sem modal) ──
  const renderCardEditor = () => (
    <div className="space-y-4">
      {/* Cabeçalho de navegação */}
      <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
        <button
          onClick={cancelEditCard}
          className="flex items-center gap-1.5 text-sm"
          style={{ color: 'var(--admin-sub-nav-back-text, #6b7280)', transition: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--admin-sub-nav-back-hover, #111827)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--admin-sub-nav-back-text, #6b7280)')}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para cards
        </button>
        <span style={{ color: 'var(--admin-sub-nav-separator, #d1d5db)' }}>|</span>
        <span className="truncate" style={{ fontSize: 'var(--admin-sub-nav-title-size, 0.875rem)', fontWeight: 'var(--admin-sub-nav-title-weight, 500)', color: 'var(--admin-sub-nav-title-color, #374151)' }}>
          {editingCard?.title || 'Novo Card'}
        </span>
      </div>

      {/* Campos do card */}
      {formData.has_icon && (
        <div>
          <Label>Ícone (Opcional)</Label>
          <div className="mt-1.5">
            <IconPicker value={cardDraft.icon} onChange={(v) => setCardDraft(p => ({ ...p, icon: v }))} />
          </div>
        </div>
      )}

      {formData.has_title !== false && (
        <div>
          <Label>Título *</Label>
          <Input
            value={cardDraft.title}
            onChange={(e) => setCardDraft(p => ({ ...p, title: e.target.value }))}
            placeholder="Ex: Gestão de Redes Sociais"
            className="mt-1.5"
          />
        </div>
      )}

      {formData.has_subtitle !== false && (
        <div>
          <Label>Subtítulo / Descrição</Label>
          <Textarea
            value={cardDraft.subtitle}
            onChange={(e) => setCardDraft(p => ({ ...p, subtitle: e.target.value }))}
            placeholder="Descrição do card..."
            className="mt-1.5"
            rows={3}
          />
        </div>
      )}

      {formData.has_media && (
        <div className="space-y-3">
          <div>
            <Label>Mídia (Imagem/Vídeo)</Label>
            <div className="mt-1.5">
              <MediaUploader
                label=""
                value={cardDraft.media_url}
                onChange={(v) => setCardDraft(p => ({ ...p, media_url: v }))}
                accept="image/*,video/*"
                maxSizeMB={10}
              />
            </div>
          </div>
          <OpacitySlider
            label="Opacidade da Mídia"
            value={cardDraft.media_opacity}
            onChange={(v) => setCardDraft(p => ({ ...p, media_opacity: v }))}
          />
        </div>
      )}

      {formData.has_link !== false && (
        <div className="space-y-3 pt-3" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
          <Label>Link (Opcional)</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tipo</Label>
              <select
                value={cardDraft.link_type}
                onChange={(e) => setCardDraft(p => ({ ...p, link_type: e.target.value as 'internal' | 'external' }))}
                className="mt-1 w-full px-3 py-2 rounded-md focus:outline-none"
                style={{ fontSize: 'var(--admin-field-text-size, 0.875rem)', color: 'var(--admin-field-text, #111827)', backgroundColor: 'var(--admin-field-bg, #f3f3f5)', border: '1px solid var(--admin-field-border, #e5e7eb)' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #ea526e)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--admin-field-border, #e5e7eb)')}
              >
                <option value="internal">Interno (mesma aba)</option>
                <option value="external">Externo (nova aba)</option>
              </select>
            </div>
            <div>
              <Label>URL</Label>
              <Input
                type="url"
                value={cardDraft.link_url}
                onChange={(e) => setCardDraft(p => ({ ...p, link_url: e.target.value }))}
                placeholder={cardDraft.link_type === 'internal' ? '/servicos/...' : 'https://...'}
                className="mt-1 text-sm"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // ── Footer dinâmico ──
  const footer = editingCard ? (
    <div className="flex justify-end gap-3">
      <button
        onClick={cancelEditCard}
        disabled={savingCard}
        className="px-4 py-2 rounded-lg text-sm font-medium"
        style={{ backgroundColor: 'var(--admin-btn-cancel-bg, #ffffff)', border: '1px solid var(--admin-btn-cancel-border, #e5e7eb)', color: 'var(--admin-btn-cancel-text, #374151)', transition: 'none', cursor: savingCard ? 'not-allowed' : 'pointer', opacity: savingCard ? 0.5 : 1 }}
      >
        Voltar à lista
      </button>
      <Button onClick={saveCard} disabled={savingCard}>
        {savingCard ? 'Salvando...' : 'Salvar Card'}
      </Button>
    </div>
  ) : (
    <div className="flex justify-end gap-3">
      <button
        onClick={() => onOpenChange(false)}
        disabled={saving}
        className="px-4 py-2 rounded-lg text-sm font-medium"
        style={{ backgroundColor: 'var(--admin-btn-cancel-bg, #ffffff)', border: '1px solid var(--admin-btn-cancel-border, #e5e7eb)', color: 'var(--admin-btn-cancel-text, #374151)', transition: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.5 : 1 }}
      >
        Cancelar
      </button>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={editingCard ? `Editando: ${editingCard.title || 'Novo Card'}` : `Configurar: ${template.name}`}
      size="large"
      hasUnsavedChanges={!editingCard && hasUnsavedChanges}
      onCancel={() => { setHasUnsavedChanges(false); onOpenChange(false); }}
      footer={footer}
    >
      <div className="space-y-5">

        {/* Tab bar — oculta durante edição de card */}
        {!editingCard && (
          <div
            className="flex gap-1.5 p-1 rounded-lg"
            style={{ backgroundColor: 'var(--admin-tab-list-bg, #e7e8e8)' }}
          >
            {tabBtn('layout', <Layout className="h-4 w-4" />, 'Layout')}
            {tabBtn('design', <Palette className="h-4 w-4" />, 'Design')}
            {tabBtn('content', <FileText className="h-4 w-4" />, 'Conteúdo')}
          </div>
        )}

        {/* ── ABA LAYOUT ──────────────────────────────────────────── */}
        {activeTab === 'layout' && !editingCard && (
          <div className="space-y-3">

            <Section label="Geral" open={secGeral} onOpenChange={setSecGeral}>
              <div>
                <Label>Nome do Template</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Ex: Cards de Serviços"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Variante</Label>
                <select
                  value={formData.variant || 'grid'}
                  onChange={(e) => updateField('variant', e.target.value)}
                  className="mt-1.5 w-full px-3 py-2 rounded-md focus:outline-none"
                  style={{ fontSize: 'var(--admin-field-text-size, 0.875rem)', color: 'var(--admin-field-text, #111827)', backgroundColor: 'var(--admin-field-bg, #f3f3f5)', border: '1px solid var(--admin-field-border, #e5e7eb)' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #ea526e)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--admin-field-border, #e5e7eb)')}
                >
                  <option value="grid">Grid (padrão)</option>
                  <option value="list">Lista</option>
                  <option value="masonry">Masonry</option>
                  <option value="scroll-reveal">Scroll Reveal</option>
                  <option value="carousel">Carrossel</option>
                </select>
              </div>

              <div className="pt-2 space-y-3" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
                <div className="flex items-center gap-3">
                  <Switch
                    id="sw-filters"
                    checked={formData.has_filters || false}
                    onCheckedChange={(v) => updateField('has_filters', v)}
                  />
                  <Label htmlFor="sw-filters" className="cursor-pointer">Exibir Filtros/Abas</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="sw-media"
                    checked={formData.has_media || false}
                    onCheckedChange={(v) => updateField('has_media', v)}
                  />
                  <Label htmlFor="sw-media" className="cursor-pointer">Exibir Mídia nos Cards</Label>
                </div>
              </div>
            </Section>

            <Section label="Grid Responsivo" open={secGrid} onOpenChange={setSecGrid}>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Desktop (cols)</Label>
                  <Input
                    type="number" min={1} max={6}
                    value={formData.columns_desktop || 3}
                    onChange={(e) => updateField('columns_desktop', parseInt(e.target.value))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Tablet (cols)</Label>
                  <Input
                    type="number" min={1} max={4}
                    value={formData.columns_tablet || 2}
                    onChange={(e) => updateField('columns_tablet', parseInt(e.target.value))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Mobile (cols)</Label>
                  <Input
                    type="number" min={1} max={2}
                    value={formData.columns_mobile || 1}
                    onChange={(e) => updateField('columns_mobile', parseInt(e.target.value))}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label>Gap entre Cards</Label>
                <select
                  value={formData.gap || 'md'}
                  onChange={(e) => updateField('gap', e.target.value)}
                  className="mt-1.5 w-full px-3 py-2 rounded-md focus:outline-none"
                  style={{ fontSize: 'var(--admin-field-text-size, 0.875rem)', color: 'var(--admin-field-text, #111827)', backgroundColor: 'var(--admin-field-bg, #f3f3f5)', border: '1px solid var(--admin-field-border, #e5e7eb)' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #ea526e)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--admin-field-border, #e5e7eb)')}
                >
                  <option value="xs">XS (8px)</option>
                  <option value="sm">SM (16px)</option>
                  <option value="md">MD (24px)</option>
                  <option value="lg">LG (32px)</option>
                  <option value="xl">XL (48px)</option>
                </select>
              </div>
            </Section>

            <Section label="Aparência do Card" open={secCard} onOpenChange={setSecCard}>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Border Radius</Label>
                  <select
                    value={formData.card_border_radius || '2xl'}
                    onChange={(e) => updateField('card_border_radius', e.target.value)}
                    className="mt-1.5 w-full px-2 py-2 rounded-md focus:outline-none"
                    style={{ fontSize: 'var(--admin-field-text-size, 0.875rem)', color: 'var(--admin-field-text, #111827)', backgroundColor: 'var(--admin-field-bg, #f3f3f5)', border: '1px solid var(--admin-field-border, #e5e7eb)' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #ea526e)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--admin-field-border, #e5e7eb)')}
                  >
                    <option value="none">None</option>
                    <option value="sm">SM</option>
                    <option value="md">MD</option>
                    <option value="lg">LG</option>
                    <option value="xl">XL</option>
                    <option value="2xl">2XL</option>
                  </select>
                </div>
                <div>
                  <Label>Border Width</Label>
                  <Input
                    type="number" min={0} max={10}
                    value={formData.card_border_width || 1}
                    onChange={(e) => updateField('card_border_width', parseInt(e.target.value))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Padding</Label>
                  <select
                    value={formData.card_padding || 'md'}
                    onChange={(e) => updateField('card_padding', e.target.value)}
                    className="mt-1.5 w-full px-2 py-2 rounded-md focus:outline-none"
                    style={{ fontSize: 'var(--admin-field-text-size, 0.875rem)', color: 'var(--admin-field-text, #111827)', backgroundColor: 'var(--admin-field-bg, #f3f3f5)', border: '1px solid var(--admin-field-border, #e5e7eb)' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #ea526e)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--admin-field-border, #e5e7eb)')}
                  >
                    <option value="xs">XS</option>
                    <option value="sm">SM</option>
                    <option value="md">MD</option>
                    <option value="lg">LG</option>
                    <option value="xl">XL</option>
                  </select>
                </div>
                <div>
                  <Label>Sombra</Label>
                  <select
                    value={formData.card_shadow || 'md'}
                    onChange={(e) => updateField('card_shadow', e.target.value)}
                    className="mt-1.5 w-full px-2 py-2 rounded-md focus:outline-none"
                    style={{ fontSize: 'var(--admin-field-text-size, 0.875rem)', color: 'var(--admin-field-text, #111827)', backgroundColor: 'var(--admin-field-bg, #f3f3f5)', border: '1px solid var(--admin-field-border, #e5e7eb)' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #ea526e)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--admin-field-border, #e5e7eb)')}
                  >
                    <option value="none">Nenhuma</option>
                    <option value="sm">Pequena</option>
                    <option value="md">Média</option>
                    <option value="lg">Grande</option>
                    <option value="xl">Extra Grande</option>
                  </select>
                </div>
              </div>
            </Section>

            {(formData.has_icon || formData.has_title) && (
              <Section label="Ícone e Título" open={secIconLayout} onOpenChange={setSecIconLayout}>
                {formData.has_icon && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Tamanho do Ícone (px)</Label>
                      <Input
                        type="number" min={16} max={64}
                        value={formData.icon_size || 32}
                        onChange={(e) => updateField('icon_size', parseInt(e.target.value))}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Posição do Ícone</Label>
                      <select
                        value={formData.icon_position || 'top'}
                        onChange={(e) => updateField('icon_position', e.target.value)}
                        className="mt-1.5 w-full px-3 py-2 rounded-md focus:outline-none"
                        style={{ fontSize: 'var(--admin-field-text-size, 0.875rem)', color: 'var(--admin-field-text, #111827)', backgroundColor: 'var(--admin-field-bg, #f3f3f5)', border: '1px solid var(--admin-field-border, #e5e7eb)' }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #ea526e)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--admin-field-border, #e5e7eb)')}
                      >
                        <option value="top">Acima do Título</option>
                        <option value="left">À Esquerda do Título</option>
                      </select>
                    </div>
                  </div>
                )}
                {formData.has_title && (
                  <div>
                    <Label>Tamanho da Fonte do Título</Label>
                    <div className="mt-1.5">
                      <TypeScalePicker value={formData.title_font_size || ''} onChange={(v) => updateField('title_font_size', v)} />
                    </div>
                  </div>
                )}
              </Section>
            )}
          </div>
        )}

        {/* ── ABA DESIGN ──────────────────────────────────────────── */}
        {activeTab === 'design' && !editingCard && (
          <div className="space-y-3">

            {/* ── Grid 3 colunas — seletores de cor ── */}
            <div className="grid grid-cols-3 gap-2">
              <CompactColorCard label="Fundo" open={secCardColors} onOpenChange={setSecCardColors}>
                <ColorTokenPicker
                  value={formData.card_bg_color_token || ''}
                  onChange={(v) => updateField('card_bg_color_token', v)}
                  label=""
                />
              </CompactColorCard>

              <CompactColorCard label="Borda" open={secBorda} onOpenChange={setSecBorda}>
                <ColorTokenPicker
                  value={formData.card_border_color_token || ''}
                  onChange={(v) => updateField('card_border_color_token', v)}
                  label=""
                />
              </CompactColorCard>

              {formData.has_icon ? (
                <CompactColorCard label="Ícone" open={secIcon} onOpenChange={setSecIcon}>
                  <ColorTokenPicker
                    value={formData.icon_color_token || ''}
                    onChange={(v) => updateField('icon_color_token', v)}
                    label=""
                  />
                </CompactColorCard>
              ) : <div />}

              {formData.has_icon ? (
                <CompactColorCard label="Fundo do Ícone" open={secIconBg} onOpenChange={setSecIconBg}>
                  {/* ✅ FIX: icon_bg_color_token usado pelo CardRenderer no layout 'left' */}
                  <ColorTokenPicker
                    value={formData.icon_bg_color_token || ''}
                    onChange={(v) => updateField('icon_bg_color_token', v)}
                    label=""
                  />
                </CompactColorCard>
              ) : <div />}

              {formData.has_title ? (
                <CompactColorCard label="Título" open={secTitle} onOpenChange={setSecTitle}>
                  <ColorTokenPicker
                    value={formData.title_color_token || ''}
                    onChange={(v) => updateField('title_color_token', v)}
                    label=""
                  />
                </CompactColorCard>
              ) : <div />}
            </div>

            {formData.has_subtitle && (
              <Section label="Subtítulo" open={secSubtitle} onOpenChange={setSecSubtitle}>
                <div>
                  <Label>Tamanho da Fonte</Label>
                  <div className="mt-1.5">
                    <TypeScalePicker value={formData.subtitle_font_size || ''} onChange={(v) => updateField('subtitle_font_size', v)} />
                  </div>
                </div>
                <div>
                  <ColorTokenPicker value={formData.subtitle_color_token || ''} onChange={(v) => updateField('subtitle_color_token', v)} />
                </div>
              </Section>
            )}

            {formData.has_media && (
              <Section label="Mídia" open={secMedia} onOpenChange={setSecMedia}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Posição</Label>
                    <select
                      value={formData.media_position || 'top'}
                      onChange={(e) => updateField('media_position', e.target.value)}
                      className="mt-1.5 w-full px-3 py-2 rounded-md focus:outline-none"
                      style={{ fontSize: 'var(--admin-field-text-size, 0.875rem)', color: 'var(--admin-field-text, #111827)', backgroundColor: 'var(--admin-field-bg, #f3f3f5)', border: '1px solid var(--admin-field-border, #e5e7eb)' }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #ea526e)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--admin-field-border, #e5e7eb)')}
                    >
                      <option value="top">Acima do Conteúdo</option>
                      <option value="left">À Esquerda</option>
                      <option value="right">À Direita</option>
                    </select>
                  </div>
                  <div>
                    <Label>Aspect Ratio</Label>
                    <select
                      value={formData.media_aspect_ratio || 'auto'}
                      onChange={(e) => updateField('media_aspect_ratio', e.target.value)}
                      className="mt-1.5 w-full px-3 py-2 rounded-md focus:outline-none"
                      style={{ fontSize: 'var(--admin-field-text-size, 0.875rem)', color: 'var(--admin-field-text, #111827)', backgroundColor: 'var(--admin-field-bg, #f3f3f5)', border: '1px solid var(--admin-field-border, #e5e7eb)' }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #ea526e)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--admin-field-border, #e5e7eb)')}
                    >
                      <option value="auto">Automático</option>
                      <option value="1/1">1:1 (Quadrado)</option>
                      <option value="16/9">16:9 (Widescreen)</option>
                      <option value="4/3">4:3 (Clássico)</option>
                      <option value="3/2">3:2 (Fotografia)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Border Radius da Mídia</Label>
                  <select
                    value={formData.media_border_radius || '2xl'}
                    onChange={(e) => updateField('media_border_radius', e.target.value)}
                    className="mt-1.5 w-full px-3 py-2 rounded-md focus:outline-none"
                    style={{ fontSize: 'var(--admin-field-text-size, 0.875rem)', color: 'var(--admin-field-text, #111827)', backgroundColor: 'var(--admin-field-bg, #f3f3f5)', border: '1px solid var(--admin-field-border, #e5e7eb)' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #ea526e)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--admin-field-border, #e5e7eb)')}
                  >
                    <option value="none">None</option>
                    <option value="sm">SM</option>
                    <option value="md">MD</option>
                    <option value="lg">LG</option>
                    <option value="xl">XL</option>
                    <option value="2xl">2XL</option>
                  </select>
                </div>
                {/* ✅ FIX: opacidade padrão a nível de template — herdada por novos cards ao criar */}
                <OpacitySlider
                  label="Opacidade Padrão da Mídia (novos cards)"
                  value={formData.media_opacity ?? 100}
                  onChange={(v) => updateField('media_opacity', v)}
                />
              </Section>
            )}

            {formData.has_filters && (
              <Section label="Filtros / Tabs — Estilo dos Botões" open={secFilters} onOpenChange={setSecFilters}>
                <div>
                  <Label>Posição dos Filtros</Label>
                  <select
                    value={formData.filters_position || 'top'}
                    onChange={(e) => updateField('filters_position', e.target.value)}
                    className="mt-1.5 w-full px-3 py-2 rounded-md focus:outline-none"
                    style={{ fontSize: 'var(--admin-field-text-size, 0.875rem)', color: 'var(--admin-field-text, #111827)', backgroundColor: 'var(--admin-field-bg, #f3f3f5)', border: '1px solid var(--admin-field-border, #e5e7eb)' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary, #ea526e)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--admin-field-border, #e5e7eb)')}
                  >
                    <option value="top">Acima dos Cards</option>
                    <option value="left">À Esquerda dos Cards</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
                  <div className="space-y-2">
                    <p className="uppercase tracking-wide" style={{ fontSize: 'var(--admin-sub-label-size, 0.75rem)', fontWeight: 'var(--admin-sub-label-weight, 500)', color: 'var(--admin-sub-label-color, #4b5563)' }}>Botão Normal</p>
                    <div>
                      <Label>Fundo</Label>
                      <div className="mt-1">
                        <ColorTokenPicker value={formData.filter_button_bg_color_token || ''} onChange={(v) => updateField('filter_button_bg_color_token', v)} />
                      </div>
                    </div>
                    <div>
                      <Label>Texto</Label>
                      <div className="mt-1">
                        <ColorTokenPicker value={formData.filter_button_text_color_token || ''} onChange={(v) => updateField('filter_button_text_color_token', v)} />
                      </div>
                    </div>
                    <div>
                      <Label>Borda</Label>
                      <div className="mt-1">
                        <ColorTokenPicker value={formData.filter_button_border_color_token || ''} onChange={(v) => updateField('filter_button_border_color_token', v)} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="uppercase tracking-wide" style={{ fontSize: 'var(--admin-sub-label-size, 0.75rem)', fontWeight: 'var(--admin-sub-label-weight, 500)', color: 'var(--admin-sub-label-color, #4b5563)' }}>Botão Ativo</p>
                    <div>
                      <Label>Fundo</Label>
                      <div className="mt-1">
                        <ColorTokenPicker value={formData.filter_active_bg_color_token || ''} onChange={(v) => updateField('filter_active_bg_color_token', v)} />
                      </div>
                    </div>
                    <div>
                      <Label>Texto</Label>
                      <div className="mt-1">
                        <ColorTokenPicker value={formData.filter_active_text_color_token || ''} onChange={(v) => updateField('filter_active_text_color_token', v)} />
                      </div>
                    </div>
                    <div>
                      <Label>Borda</Label>
                      <div className="mt-1">
                        <ColorTokenPicker value={formData.filter_active_border_color_token || ''} onChange={(v) => updateField('filter_active_border_color_token', v)} />
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* Mensagem quando não há seções ativas */}
            {!formData.has_icon && !formData.has_title && !formData.has_subtitle && !formData.has_media && !formData.has_filters && (
              <div className="py-8 text-center text-gray-400">
                <Palette className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Ative elementos na aba Layout para configurar o design.</p>
              </div>
            )}
          </div>
        )}

        {/* ── ABA CONTEÚDO ─────────────────────────────────────────── */}
        {activeTab === 'content' && (
          editingCard ? renderCardEditor() : renderContentList()
        )}
      </div>
    </BaseModal>

    {/* ── Confirmação de exclusão de filtro ── */}
    <ConfirmDeleteDialog
      open={!!filterToDelete}
      onConfirm={confirmDeleteFilter}
      onCancel={() => setFilterToDelete(null)}
      title="Excluir Filtro"
      description="Tem certeza que deseja excluir este filtro? Os cards associados serão desvinculados. Esta ação não pode ser desfeita."
    />

    {/* ── Confirmação de exclusão de card ── */}
    <ConfirmDeleteDialog
      open={!!cardToDelete}
      onConfirm={confirmDeleteCard}
      onCancel={() => setCardToDelete(null)}
      title="Excluir Card"
      description="Tem certeza que deseja excluir este card? Esta ação não pode ser desfeita."
    />

    {/* ── Alert dialog ── */}
    <AlertMessageDialog
      open={!!alertMsg}
      message={alertMsg?.message ?? ''}
      title={alertMsg?.title}
      onClose={() => setAlertMsg(null)}
    />
  </>
  );
}