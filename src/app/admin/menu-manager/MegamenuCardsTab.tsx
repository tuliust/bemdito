import { getLucideIcon } from '../../../lib/utils/icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { BaseModal } from '../../components/admin/BaseModal';
import { ConfirmDeleteDialog } from '../../components/admin/ConfirmDeleteDialog';
import { IconPicker } from '../../components/admin/IconPicker';
import { EditCardVisualModal } from './MegamenuEditModals'; // ✅ NOVO: Modal de visual
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Grip,
  Copy,
  ExternalLink,
  Palette, // ✅ NOVO: Ícone para editar visual
} from 'lucide-react';
import type { Database } from '../../../lib/supabase/client';
import { adminVar } from '../../components/admin/AdminThemeProvider';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';

type MenuCard = Database['public']['Tables']['menu_cards']['Row'];

interface MegamenuCardsTabProps {
  onCardsChange?: () => void;
}

export function MegamenuCardsTab({ onCardsChange }: MegamenuCardsTabProps) {
  const [cards, setCards] = useState<MenuCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<MenuCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<MenuCard | null>(null);
  // ✅ Estado para confirmação de exclusão
  const [cardToDelete, setCardToDelete] = useState<MenuCard | null>(null);
  // ✅ NOVO: Estado para modal de visual
  const [visualModalOpen, setVisualModalOpen] = useState(false);
  const [editingVisualCard, setEditingVisualCard] = useState<MenuCard | null>(null);

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    filterCards();
  }, [cards, searchTerm]);

  async function loadCards() {
    try {
      const { data, error } = await supabase
        .from('menu_cards')
        .select('*')
        .eq('is_global', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCards(data || []);
    } catch (error) {
      console.error('Error loading cards:', error);
      toast.error('Erro ao carregar cards', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  }

  function filterCards() {
    let filtered = cards;

    if (searchTerm) {
      filtered = filtered.filter(
        (card) =>
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCards(filtered);
  }

  const handleCreate = () => {
    setEditingCard(null);
    setModalOpen(true);
  };

  const handleEdit = (card: MenuCard) => {
    setEditingCard(card);
    setModalOpen(true);
  };

  const handleDelete = async (card: MenuCard) => {
    setCardToDelete(card);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;
    try {
      const { error } = await supabase
        .from('menu_cards')
        .delete()
        .eq('id', cardToDelete.id);

      if (error) throw error;

      toast.success('Card deletado com sucesso!', {
        icon: <CheckCircle className="h-4 w-4" />,
      });

      loadCards();
      onCardsChange?.();
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Erro ao deletar card', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setCardToDelete(null);
    }
  };

  const handleDuplicate = async (card: MenuCard) => {
    try {
      const { error } = await supabase.from('menu_cards').insert({
        name: `${card.name} (Cópia)`,
        icon: card.icon,
        title: card.title,
        subtitle: card.subtitle,
        url: card.url,
        url_type: card.url_type,
        is_global: true,
      });

      if (error) throw error;

      toast.success('Card duplicado com sucesso!', {
        icon: <CheckCircle className="h-4 w-4" />,
      });

      loadCards();
      onCardsChange?.();
    } catch (error) {
      console.error('Error duplicating card:', error);
      toast.error('Erro ao duplicar card', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  // ✅ NOVO: Handler para abrir modal de visual
  const handleEditVisual = (card: MenuCard) => {
    setEditingVisualCard(card);
    setVisualModalOpen(true);
  };

  // ✅ NOVO: Handler para atualizar visual do card
  const handleUpdateVisual = async (updates: {
    bgColor?: string;
    bgOpacity?: number;
    borderColor?: string;
    borderOpacity?: number;
  }) => {
    if (!editingVisualCard) return;

    try {
      const { error } = await supabase
        .from('menu_cards')
        .update({
          bg_color_token: updates.bgColor || null,
          bg_opacity: updates.bgOpacity ?? 100,
          border_color_token: updates.borderColor || null,
          border_opacity: updates.borderOpacity ?? 100,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingVisualCard.id);

      if (error) throw error;

      toast.success('Visual do card atualizado!', {
        icon: <CheckCircle className="h-4 w-4" />,
      });

      loadCards();
      onCardsChange?.();
    } catch (error) {
      console.error('Error updating card visual:', error);
      toast.error('Erro ao atualizar visual', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      throw error; // Re-throw para o modal tratar
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--primary, #ea526e)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: adminVar('item-title-list', 'size'), fontWeight: adminVar('item-title-list', 'weight'), color: adminVar('item-title-list', 'color') }}>Cards Globais</h2>
          <p className="mt-1" style={{ fontSize: adminVar('section-subheader', 'size'), color: adminVar('section-subheader', 'color') }}>
            Gerencie os cards reutilizáveis dos mega menus
          </p>
        </div>
        <AdminPrimaryButton onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Card
        </AdminPrimaryButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--admin-card-bg, #ffffff)', border: '2px solid var(--admin-card-border, #e5e7eb)' }}>
          <p style={{ fontSize: adminVar('section-subheader', 'size'), color: adminVar('section-subheader', 'color') }}>Total de Cards</p>
          <p className="text-2xl font-bold" style={{ color: adminVar('item-title-list', 'color') }}>{cards.length}</p>
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--admin-card-bg, #ffffff)', border: '2px solid var(--admin-card-border, #e5e7eb)' }}>
          <p style={{ fontSize: adminVar('section-subheader', 'size'), color: adminVar('section-subheader', 'color') }}>Com Link</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--primary, #ea526e)' }}>
            {cards.filter((c) => c.url).length}
          </p>
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--admin-card-bg, #ffffff)', border: '2px solid var(--admin-card-border, #e5e7eb)' }}>
          <p style={{ fontSize: adminVar('section-subheader', 'size'), color: adminVar('section-subheader', 'color') }}>Com Ícone</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent, #ed9331)' }}>
            {cards.filter((c) => c.icon).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-[1.5rem] p-4" style={{ backgroundColor: 'var(--admin-card-bg, #ffffff)', border: '2px solid var(--admin-card-border, #e5e7eb)' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cards por nome, título ou descrição..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.length === 0 ? (
          <div className="col-span-full text-center py-12 rounded-lg" style={{ border: '2px dashed var(--admin-field-border, #e5e7eb)' }}>
            <p className="mb-4" style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}>
              {searchTerm ? 'Nenhum card encontrado' : 'Nenhum card criado ainda'}
            </p>
            <Button onClick={handleCreate} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Card
            </Button>
          </div>
        ) : (
          filteredCards.map((card) => (
            <div
              key={card.id}
              className="rounded-lg p-4 group"
              style={{ transition: 'none', backgroundColor: 'var(--admin-card-bg, #ffffff)', border: '2px solid var(--admin-card-border, #e5e7eb)' }}
            >
              {/* Card Preview */}
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)', border: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
                <div className="flex items-start gap-3">
                  {card.icon && (
                    <div className="flex-shrink-0" style={{ color: 'var(--primary, #ea526e)' }}>
                      {getLucideIcon(card.icon, 'h-5 w-5')}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {card.title && (
                      <h4 className="mb-1" style={{ fontSize: adminVar('list-item-title', 'size'), fontWeight: adminVar('list-item-title', 'weight'), color: adminVar('list-item-title', 'color') }}>
                        {card.title}
                      </h4>
                    )}
                    {card.subtitle && (
                      <p className="line-clamp-2" style={{ fontSize: adminVar('item-description', 'size'), color: adminVar('item-description', 'color') }}>
                        {card.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Grip className="h-4 w-4" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
                  <span style={{ fontSize: adminVar('list-item-title', 'size'), fontWeight: adminVar('list-item-title', 'weight'), color: adminVar('list-item-title', 'color') }}>{card.name}</span>
                </div>
                {card.url && (
                  <div className="flex items-center gap-2" style={{ fontSize: adminVar('item-description', 'size'), color: adminVar('item-description', 'color') }}>
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate">{card.url}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(card)}
                  className="flex-1"
                  style={{
                    transition: 'none',
                    color: 'var(--admin-btn-action-text, #374151)',
                    borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = 'var(--admin-btn-action-hover-bg, #f9fafb)';
                    el.style.color = 'var(--admin-btn-action-hover-text, #111827)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = 'transparent';
                    el.style.color = 'var(--admin-btn-action-text, #374151)';
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicate(card)}
                  style={{
                    transition: 'none',
                    color: 'var(--admin-btn-action-text, #374151)',
                    borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = 'var(--admin-btn-action-hover-bg, #f9fafb)';
                    el.style.color = 'var(--admin-btn-action-hover-text, #111827)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = 'transparent';
                    el.style.color = 'var(--admin-btn-action-text, #374151)';
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(card)}
                  style={{
                    transition: 'none',
                    color: 'var(--admin-delete-btn-text, #dc2626)',
                    borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = 'var(--admin-delete-btn-hover-bg, #fef2f2)';
                    el.style.color = 'var(--admin-delete-btn-hover-text, #b91c1c)';
                    el.style.borderColor = 'var(--admin-delete-btn-hover-border, #fca5a5)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = 'transparent';
                    el.style.color = 'var(--admin-delete-btn-text, #dc2626)';
                    el.style.borderColor = 'var(--admin-btn-action-border, #e5e7eb)';
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditVisual(card)}
                  style={{
                    transition: 'none',
                    color: 'var(--admin-btn-action-text, #374151)',
                    borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = 'var(--admin-btn-action-hover-bg, #f9fafb)';
                    el.style.color = 'var(--admin-btn-action-hover-text, #111827)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.backgroundColor = 'transparent';
                    el.style.color = 'var(--admin-btn-action-text, #374151)';
                  }}
                >
                  <Palette className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <CardEditorModal
          card={editingCard}
          onClose={() => {
            setModalOpen(false);
            setEditingCard(null);
          }}
          onSuccess={() => {
            setModalOpen(false);
            setEditingCard(null);
            loadCards();
            onCardsChange?.();
          }}
        />
      )}

      {/* ✅ Confirmação de exclusão */}
      <ConfirmDeleteDialog
        open={!!cardToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setCardToDelete(null)}
        itemName={cardToDelete?.name}
      />

      {/* ✅ Modal de visual */}
      {visualModalOpen && editingVisualCard && (
        <EditCardVisualModal
          open={visualModalOpen}
          onOpenChange={setVisualModalOpen}
          value={{
            bgColor: editingVisualCard.bg_color_token || undefined,
            bgOpacity: editingVisualCard.bg_opacity ?? 100,
            borderColor: editingVisualCard.border_color_token || undefined,
            borderOpacity: editingVisualCard.border_opacity ?? 100,
          }}
          onChange={handleUpdateVisual}
        />
      )}
    </div>
  );
}

// Card Editor Modal
function CardEditorModal({
  card,
  onClose,
  onSuccess,
}: {
  card: MenuCard | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: card?.name || '',
    icon: card?.icon || '',
    title: card?.title || '',
    subtitle: card?.subtitle || '',
    url: card?.url || '',
    url_type: (card?.url_type as 'internal' | 'external' | 'anchor') || 'internal',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Preencha o nome do card', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    setSaving(true);
    try {
      if (card) {
        // Update
        const { error } = await supabase
          .from('menu_cards')
          .update({
            name: formData.name,
            icon: formData.icon || null,
            title: formData.title || null,
            subtitle: formData.subtitle || null,
            url: formData.url || null,
            url_type: formData.url_type,
            updated_at: new Date().toISOString(),
          })
          .eq('id', card.id);

        if (error) throw error;

        toast.success('Card atualizado com sucesso!', {
          icon: <CheckCircle className="h-4 w-4" />,
        });
      } else {
        // Create
        const { error } = await supabase.from('menu_cards').insert({
          name: formData.name,
          icon: formData.icon || null,
          title: formData.title || null,
          subtitle: formData.subtitle || null,
          url: formData.url || null,
          url_type: formData.url_type,
          is_global: true,
        });

        if (error) throw error;

        toast.success('Card criado com sucesso!', {
          icon: <CheckCircle className="h-4 w-4" />,
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Erro ao salvar card', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <BaseModal
      open={true}
      onOpenChange={(v) => !v && onClose()}
      title={card ? 'Editar Card' : 'Criar Novo Card'}
      size="large"
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Nome do Card (interno) *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Branding & Identidade"
            className="mt-1"
          />
          <p data-slot="field-hint" className="mt-1">
            Nome interno para identificação no admin
          </p>
        </div>

        <div>
          <Label htmlFor="icon">Ícone</Label>
          <IconPicker
            value={formData.icon}
            onChange={(icon) => setFormData({ ...formData, icon })}
          />
        </div>

        <div className="pt-4" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
          <h4 className="mb-4" style={{ fontSize: adminVar('list-item-title', 'size'), fontWeight: adminVar('list-item-title', 'weight'), color: adminVar('list-item-title', 'color') }}>Conteúdo Visual</h4>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título visível no card"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Descrição</Label>
              <textarea
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Descrição breve do serviço ou recurso"
                className="mt-1 w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--admin-field-bg, #ffffff)', border: '2px solid var(--admin-field-border, #e5e7eb)', color: 'var(--admin-field-text, #111827)' }}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="pt-4" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
          <h4 className="mb-4" style={{ fontSize: adminVar('list-item-title', 'size'), fontWeight: adminVar('list-item-title', 'weight'), color: adminVar('list-item-title', 'color') }}>Link</h4>

          <div className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="/servicos/branding"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="url_type">Tipo de URL</Label>
              <select
                id="url_type"
                value={formData.url_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    url_type: e.target.value as 'internal' | 'external' | 'anchor',
                  })
                }
                className="mt-1 w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--admin-field-bg, #ffffff)', border: '2px solid var(--admin-field-border, #e5e7eb)', color: 'var(--admin-field-text, #111827)' }}
              >
                <option value="internal">Interna (React Router)</option>
                <option value="external">Externa (nova aba)</option>
                <option value="anchor">Âncora (mesma página)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
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
              <>{card ? 'Atualizar' : 'Criar'} Card</>
            )}
          </AdminPrimaryButton>
        </div>
      </div>
    </BaseModal>
  );
}