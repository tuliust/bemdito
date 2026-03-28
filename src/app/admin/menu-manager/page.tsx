import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import {
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Settings,
  Menu as MenuIcon,
  Image as ImageIcon,
  Zap,
  Pin,
} from 'lucide-react';
import { MenuItemEditorModal } from './MenuItemEditorModal';
import { getLucideIcon } from '../../../lib/utils/icons';
import { IconPicker } from '../../components/admin/IconPicker';
import { ImageUploadOnly } from '../../components/ImageUploadOnly';
import { ConfirmDeleteDialog } from '../../components/admin/ConfirmDeleteDialog';
import { toast } from 'sonner';
import type { MenuItem, MenuCard } from '@/types/database';
import type { MenuItemInsert } from '../../../lib/supabase/client';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminListItem } from '../../components/admin/AdminListItem';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminActionButtons } from '../../components/admin/AdminActionButtons';
import { TabSectionHeader } from '../../components/admin/TabSectionHeader';
import { adminVar } from '../../components/admin/AdminThemeProvider';
import { AdminPrimaryButton } from '@/app/components/admin/AdminPrimaryButton';

type HeaderConfig = {
  logo: {
    text: string;
    url?: string;
    link: string;
  };
  cta: {
    label: string;
    icon: string;
    url: string;
  };
  sticky: boolean;
};

export function MenuManagerPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [allCards, setAllCards] = useState<MenuCard[]>([]);
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
    logo: { text: 'BemDito', link: '/' },
    cta: { label: 'Entrar', icon: 'Lock', url: '/login' },
    sticky: false,
  });
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [saving, setSaving] = useState(false);
  const hasLoaded = useRef(false);

  // ── Delete confirmation ──
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Auto-save header config (debounced, 800ms)
  useEffect(() => {
    if (!hasLoaded.current) return;
    const timer = setTimeout(async () => {
      try {
        const { data: existing } = await supabase.from('site_config').select('*').single();
        if (existing) {
          await supabase.from('site_config').update({ header: headerConfig }).eq('id', existing.id);
        } else {
          await supabase.from('site_config').insert([{ header: headerConfig, footer: {}, published: false }]);
        }
      } catch (err) {
        console.error('Error auto-saving header config:', err);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [headerConfig]);

  async function loadData() {
    try {
      const [menuItemsRes, cardsRes, configRes] = await Promise.all([
        supabase.from('menu_items').select('*').order('order'),
        supabase.from('menu_cards').select('*').eq('is_global', true),
        supabase.from('site_config').select('*').single(),
      ]);

      if (menuItemsRes.error) throw menuItemsRes.error;
      if (cardsRes.error) throw cardsRes.error;

      setMenuItems(menuItemsRes.data || []);
      setAllCards(cardsRes.data || []);

      if (configRes.data?.header) {
        setHeaderConfig(configRes.data.header);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
      hasLoaded.current = true;
    }
  }

  async function handleSave(itemData: Partial<MenuItemInsert>) {
    setSaving(true);
    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', selectedItem.id);

        if (error) throw error;

        toast.success('Item de menu atualizado!', {
          icon: <CheckCircle className="h-4 w-4" />,
        });
      } else {
        const maxOrder = menuItems.reduce((max, item) => Math.max(max, item.order), -1);
        const newData = { ...itemData, order: maxOrder + 1 };

        const { error } = await supabase
          .from('menu_items')
          .insert([newData as MenuItemInsert]);

        if (error) throw error;

        toast.success('Item de menu criado!', {
          icon: <CheckCircle className="h-4 w-4" />,
        });
      }

      setEditorOpen(false);
      setSelectedItem(null);
      await loadData();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Erro ao salvar item de menu', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!itemToDelete) return;
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast.success('Item de menu deletado!', {
        icon: <Trash2 className="h-4 w-4" />,
      });
      await loadData();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Erro ao deletar item de menu', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setItemToDelete(null);
    }
  }

  async function handleReorder(itemId: string, direction: 'up' | 'down') {
    const index = menuItems.findIndex((item) => item.id === itemId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;

    const newItems = [...menuItems];
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

    try {
      for (const update of newItems.map((item, idx) => ({ id: item.id, order: idx }))) {
        await supabase
          .from('menu_items')
          .update({ order: update.order })
          .eq('id', update.id);
      }

      setMenuItems(newItems);
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Erro ao reordenar itens');
    }
  }

  // ── Helper: update nested headerConfig field ───────────────────
  function updateHeaderConfig(path: string[], value: any) {
    setHeaderConfig((prev) => {
      const next = { ...prev } as any;
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) {
        cur[path[i]] = { ...cur[path[i]] };
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = value;
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--primary, #ea526e)' }} />
      </div>
    );
  }

  return (
    <>
      <AdminPageLayout
        title="Menu"
        description="Gerencie o menu principal, logo e configurações do header"
        headerActions={
          <AdminPrimaryButton
            onClick={() => { setSelectedItem(null); setEditorOpen(true); }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </AdminPrimaryButton>
        }
        tabs={[
          {
            value: 'items',
            label: 'Itens do Menu',
            icon: <MenuIcon className="h-4 w-4" />,
            content: (
              <>
                {/* Tab content header */}
                <TabSectionHeader
                  title="Itens do Menu"
                  subtitle="Gerencie os itens e a ordem do menu de navegação"
                  icon={<MenuIcon />}
                />

                {/* Menu Items List */}
                <div className="space-y-4">
                  {menuItems.length === 0 ? (
                    <AdminEmptyState
                      message="Nenhum item de menu criado"
                      cta={{
                        label: 'Criar Primeiro Item',
                        onClick: () => { setSelectedItem(null); setEditorOpen(true); },
                      }}
                    />
                  ) : (
                    menuItems.map((item, index) => {
                      const hasMegamenu =
                        item.megamenu_config &&
                        (item.megamenu_config as any).enabled === true;
                      const columns = (item.megamenu_config as any)?.columns || [];
                      const megamenuTitle = columns[0]?.mainTitle;

                      return (
                        <AdminListItem
                          key={item.id}
                          className="p-6"
                        >
                          <div className="flex items-start justify-between">
                            {/* Left: reorder + info */}
                            <div className="flex items-start gap-4 flex-1">

                              {/* Reorder Buttons */}
                              <div className="flex flex-col gap-1 mt-1">
                                <button
                                  onClick={() => handleReorder(item.id, 'up')}
                                  disabled={index === 0}
                                  className="p-1 rounded disabled:opacity-30"
                                  style={{
                                    transition:      'none',
                                    backgroundColor: 'transparent',
                                  }}
                                  onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                      'var(--admin-btn-reorder-hover, #f3f4f6)';
                                  }}
                                  onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                      'transparent';
                                  }}
                                >
                                  <ChevronUp
                                    className="h-4 w-4"
                                    style={{ color: 'var(--admin-icon-action, #4b5563)' }}
                                  />
                                </button>
                                <button
                                  onClick={() => handleReorder(item.id, 'down')}
                                  disabled={index === menuItems.length - 1}
                                  className="p-1 rounded disabled:opacity-30"
                                  style={{
                                    transition:      'none',
                                    backgroundColor: 'transparent',
                                  }}
                                  onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                      'var(--admin-btn-reorder-hover, #f3f4f6)';
                                  }}
                                  onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                      'transparent';
                                  }}
                                >
                                  <ChevronDown
                                    className="h-4 w-4"
                                    style={{ color: 'var(--admin-icon-action, #4b5563)' }}
                                  />
                                </button>
                              </div>

                              {/* Item Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3
                                    style={{
                                      fontSize:   adminVar('item-title-list', 'size'),
                                      fontWeight: adminVar('item-title-list', 'weight'),
                                      color:      adminVar('item-title-list', 'color'),
                                    }}
                                  >
                                    {item.label}
                                  </h3>
                                </div>

                                {/* Secondary info row */}
                                <div className="flex items-center gap-4 mb-3" style={{
                                  fontSize:   adminVar('item-description', 'size'),
                                  fontWeight: adminVar('item-description', 'weight'),
                                  color:      adminVar('item-description', 'color'),
                                }}>
                                  <span className="flex items-center gap-1">
                                    {item.icon
                                      ? (getLucideIcon(item.icon, 'h-4 w-4') ?? <span style={{ fontSize: adminVar('item-tertiary', 'size'), color: adminVar('item-tertiary', 'color') }}>Sem ícone</span>)
                                      : <span style={{ fontSize: adminVar('item-tertiary', 'size'), color: adminVar('item-tertiary', 'color') }}>Sem ícone</span>
                                    }
                                  </span>
                                </div>

                                {/* Tertiary info — megamenu main title */}
                                {hasMegamenu && megamenuTitle && (
                                  <p style={{
                                    fontSize:   adminVar('item-description', 'size'),
                                    fontWeight: adminVar('item-description', 'weight'),
                                    color:      adminVar('item-description', 'color'),
                                  }} className="mb-3">
                                    {megamenuTitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <AdminActionButtons
                              onEdit={() => { setSelectedItem(item); setEditorOpen(true); }}
                              onDelete={() => setItemToDelete(item)}
                              deleteLabel="Excluir"
                            />
                          </div>
                        </AdminListItem>
                      );
                    })
                  )}
                </div>
              </>
            ),
          },
          {
            value: 'config',
            label: 'Header',
            icon: <Settings className="h-4 w-4" />,
            content: (
              <div className="space-y-4">

                {/* Tab Header */}
                <TabSectionHeader
                  title="Configurações do Header"
                  subtitle="Configure o logo, botão de ação e comportamento do cabeçalho do site."
                  icon={<Settings />}
                />

                {/* Container: Logo */}
                <div
                  className="rounded-2xl p-6 space-y-4"
                  style={{
                    backgroundColor: 'var(--admin-card-bg,     #ffffff)',
                    border:          '2px solid var(--admin-card-border, #e5e7eb)',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize:   adminVar('item-title-list', 'size'),
                        fontWeight: adminVar('item-title-list', 'weight'),
                        color:      adminVar('item-title-list', 'color'),
                      }}
                    >
                      Logo
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <ImageUploadOnly
                        label="Imagem do Logo"
                        value={headerConfig.logo.url || ''}
                        onChange={(url) => {
                          updateHeaderConfig(['logo', 'url'], url);
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="logo-link">Link do Logo</Label>
                      <Input
                        id="logo-link"
                        value={headerConfig.logo.link}
                        onChange={(e) =>
                          updateHeaderConfig(['logo', 'link'], e.target.value)
                        }
                        placeholder="/"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Container: CTA Button */}
                <div
                  className="rounded-2xl p-6 space-y-4"
                  style={{
                    backgroundColor: 'var(--admin-card-bg,     #ffffff)',
                    border:          '2px solid var(--admin-card-border, #e5e7eb)',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize:   adminVar('item-title-list', 'size'),
                        fontWeight: adminVar('item-title-list', 'weight'),
                        color:      adminVar('item-title-list', 'color'),
                      }}
                    >
                      Botão de Ação (CTA)
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="cta-label">Label do Botão</Label>
                      <Input
                        id="cta-label"
                        value={headerConfig.cta.label}
                        onChange={(e) =>
                          updateHeaderConfig(['cta', 'label'], e.target.value)
                        }
                        placeholder="Entrar"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <IconPicker
                        label="Ícone do Botão"
                        value={headerConfig.cta.icon}
                        onChange={(icon) =>
                          updateHeaderConfig(['cta', 'icon'], icon)
                        }
                        placeholder="Selecione um ícone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cta-url">URL do Botão</Label>
                      <Input
                        id="cta-url"
                        value={headerConfig.cta.url}
                        onChange={(e) =>
                          updateHeaderConfig(['cta', 'url'], e.target.value)
                        }
                        placeholder="/login"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Container: Sticky */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: 'var(--admin-card-bg,     #ffffff)',
                    border:          '2px solid var(--admin-card-border, #e5e7eb)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        style={{
                          fontSize:   adminVar('item-title-list', 'size'),
                          fontWeight: adminVar('item-title-list', 'weight'),
                          color:      adminVar('item-title-list', 'color'),
                        }}
                      >
                        Header Sticky
                      </h3>
                    </div>
                    <Switch
                      id="sticky-header"
                      checked={headerConfig.sticky}
                      onCheckedChange={(checked) =>
                        updateHeaderConfig(['sticky'], checked)
                      }
                    />
                  </div>
                </div>

              </div>
            ),
          },
        ]}
        defaultTab="items"
      >
        {/* Editor Modal */}
        <MenuItemEditorModal
          open={editorOpen}
          onOpenChange={setEditorOpen}
          menuItem={selectedItem}
          onSave={handleSave}
          saving={saving}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDeleteDialog
          open={!!itemToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setItemToDelete(null)}
          itemName={`o item "${itemToDelete?.label}"`}
        />
      </AdminPageLayout>
    </>
  );
}