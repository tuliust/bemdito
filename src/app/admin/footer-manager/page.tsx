import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { useDesignTokens } from '../../../lib/hooks/useDesignTokens';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { IconPicker } from '../../components/admin/IconPicker';
import { ConfirmDeleteDialog } from '../../components/admin/ConfirmDeleteDialog';
import { TabSectionHeader } from '../../components/admin/TabSectionHeader';
import { adminVar } from '../../components/admin/AdminThemeProvider';
import { getLucideIcon } from '../../../lib/utils/icons';
import { MediaUploader } from '../../components/admin/MediaUploader';  // ✅ NOVO
import {
  Loader2,
  AlertCircle,
  Eye,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  List,
  Share2,
  MapPin,      // ✅ NOVO
  Phone,       // ✅ NOVO
} from 'lucide-react';
import { toast } from 'sonner';

type FooterLink = {
  id: string;
  label: string;
  url: string;
};

type FooterColumn = {
  id: string;
  title: string;
  links: FooterLink[];
};

type SocialLink = {
  id: string;
  platform: string;
  icon: string;
  url: string;
};

type FooterConfig = {
  copyright: string;
  columns: FooterColumn[];
  social: SocialLink[];
  logo_url?: string;     // ✅ NOVO
  address?: string;      // ✅ NOVO
  phone?: string;        // ✅ NOVO
};

type SiteConfig = {
  id?: string;
  header: any;
  footer: FooterConfig;
  published: boolean;
};

export function FooterManagerPage() {
  const [config, setConfig] = useState<SiteConfig>({
    header: {},
    footer: {
      copyright: '© 2026 BemDito. Todos os direitos reservados.',
      columns: [],
      social: [],
    },
    published: false,
  });

  const [loading, setLoading] = useState(true);
  const { secondaryColor } = useDesignTokens();
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<{ columnId: string; linkId: string } | null>(null);
  const [socialToDelete, setSocialToDelete] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  // ✅ NOVO: Estado para drag-and-drop de links
  const [draggedLink, setDraggedLink] = useState<{ columnId: string; linkIndex: number } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  // Auto-save footer config (debounced, 800ms)
  useEffect(() => {
    if (!hasLoaded.current) return;
    const timer = setTimeout(async () => {
      try {
        if (config.id) {
          await supabase.from('site_config').update({ footer: config.footer }).eq('id', config.id);
        }
      } catch (err) {
        console.error('Error auto-saving footer config:', err);
        toast.error('Erro ao salvar automaticamente', { icon: <AlertCircle className="h-4 w-4" /> });
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [config.footer]);

  // Garante que todos os itens carregados do banco têm campo `id`
  function normalizeFooter(raw: any): FooterConfig {
    const fallback: FooterConfig = {
      copyright: '© 2026 BemDito. Todos os direitos reservados.',
      columns: [],
      social: [],
    };
    if (!raw) return fallback;
    const ts = Date.now();
    return {
      copyright: raw.copyright || fallback.copyright,
      columns: (raw.columns || []).map((col: any, ci: number) => ({
        id: col.id || `col-${ts}-${ci}`,
        title: col.title || '',
        links: (col.links || []).map((lnk: any, li: number) => ({
          id: lnk.id || `link-${ts}-${ci}-${li}`,
          label: lnk.label || '',
          url: lnk.url || '',
        })),
      })),
      social: (raw.social || []).map((s: any, si: number) => ({
        id: s.id || `social-${ts}-${si}`,
        platform: s.platform || '',
        icon: s.icon || 'Globe',
        url: s.url || '',
      })),
      logo_url: raw.logo_url || undefined,     // ✅ NOVO
      address: raw.address || undefined,      // ✅ NOVO
      phone: raw.phone || undefined,        // ✅ NOVO
    };
  }

  async function loadConfig() {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setConfig({
          id: data.id,
          header: data.header || {},
          footer: normalizeFooter(data.footer),
          published: data.published || false,
        });
      }
    } catch (error) {
      console.error('Error loading footer config:', error);
      toast.error('Erro ao carregar configurações do footer', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
      hasLoaded.current = true;
    }
  }

  const updateFooter = (updates: Partial<FooterConfig>) => {
    setConfig((prev) => ({ ...prev, footer: { ...prev.footer, ...updates } }));
  };

  // ── Column management ──────────────────────────────────────────
  const addColumn = () => {
    const newColumn: FooterColumn = {
      id: `col-${Date.now()}`,
      title: 'Nova Coluna',
      links: [],
    };
    setConfig((prev) => ({
      ...prev,
      footer: { ...prev.footer, columns: [...prev.footer.columns, newColumn] },
    }));
  };

  const updateColumn = (columnId: string, updates: Partial<FooterColumn>) => {
    setConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col) =>
          col.id === columnId ? { ...col, ...updates } : col
        ),
      },
    }));
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    setConfig((prev) => {
      const cols = [...prev.footer.columns];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= cols.length) return prev;
      [cols[index], cols[targetIndex]] = [cols[targetIndex], cols[index]];
      return { ...prev, footer: { ...prev.footer, columns: cols } };
    });
  };

  const confirmDeleteColumn = () => {
    if (!columnToDelete) return;
    const id = columnToDelete;
    setConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.filter((col) => col.id !== id),
      },
    }));
    setColumnToDelete(null);
  };

  // ── Link management ───────────────────────────────────────────
  const addLink = (columnId: string) => {
    const newLink: FooterLink = {
      id: `link-${Date.now()}`,
      label: 'Novo Link',
      url: '/',
    };
    setConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col) =>
          col.id === columnId ? { ...col, links: [...col.links, newLink] } : col
        ),
      },
    }));
  };

  const updateLink = (columnId: string, linkId: string, updates: Partial<FooterLink>) => {
    setConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col) =>
          col.id === columnId
            ? { ...col, links: col.links.map((link) => (link.id === linkId ? { ...link, ...updates } : link)) }
            : col
        ),
      },
    }));
  };

  const confirmDeleteLink = () => {
    if (!linkToDelete) return;
    const { columnId, linkId } = linkToDelete;
    setConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col) =>
          col.id === columnId
            ? { ...col, links: col.links.filter((link) => link.id !== linkId) }
            : col
        ),
      },
    }));
    setLinkToDelete(null);
  };

  // ✅ NOVO: Função para mover links dentro de uma coluna
  const moveLink = (columnId: string, fromIndex: number, toIndex: number) => {
    setConfig((prev) => {
      const cols = [...prev.footer.columns];
      const targetColumn = cols.find((col) => col.id === columnId);
      if (!targetColumn) return prev;
      const links = [...targetColumn.links];
      const [link] = links.splice(fromIndex, 1);
      links.splice(toIndex, 0, link);
      targetColumn.links = links;
      return { ...prev, footer: { ...prev.footer, columns: cols } };
    });
  };

  // ── Social management ─────────────────────────────────────────
  const addSocial = () => {
    const newSocial: SocialLink = {
      id: `social-${Date.now()}`,
      platform: 'Nova Rede',
      icon: 'Globe',
      url: 'https://',
    };
    setConfig((prev) => ({
      ...prev,
      footer: { ...prev.footer, social: [...prev.footer.social, newSocial] },
    }));
  };

  const updateSocial = (socialId: string, updates: Partial<SocialLink>) => {
    setConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        social: prev.footer.social.map((s) => (s.id === socialId ? { ...s, ...updates } : s)),
      },
    }));
  };

  const confirmDeleteSocial = () => {
    if (!socialToDelete) return;
    const id = socialToDelete;
    setConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        social: prev.footer.social.filter((s) => s.id !== id),
      },
    }));
    setSocialToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Tab: Colunas ───────────────────────────────────────────────
  const columnsTabContent = (
    <div className="space-y-6">
      <TabSectionHeader
        title="Colunas de Links"
        subtitle="Configure as colunas e links do footer"
        icon={<List />}
      />

      {/* Copyright */}
      <div
        className="rounded-xl p-5"
        style={{
          backgroundColor: 'var(--admin-card-bg,     #ffffff)',
          border:          '2px solid var(--admin-card-border, #e5e7eb)',
        }}
      >
        <Label
          htmlFor="copyright"
          style={{
            fontSize:   adminVar('item-title-list', 'size'),
            fontWeight: adminVar('item-title-list', 'weight'),
            color:      adminVar('item-title-list', 'color'),
          }}
        >
          Texto de Copyright
        </Label>
        <Input
          id="copyright"
          value={config.footer.copyright}
          onChange={(e) => updateFooter({ copyright: e.target.value })}
          placeholder="© 2026 BemDito. Todos os direitos reservados."
          className="mt-2"
        />
      </div>

      {/* ✅ NOVO: Logo do Footer */}
      <div
        className="rounded-xl p-5 space-y-4"
        style={{
          backgroundColor: 'var(--admin-card-bg,     #ffffff)',
          border:          '2px solid var(--admin-card-border, #e5e7eb)',
        }}
      >
        <h3
          style={{
            fontSize:   adminVar('item-title-list', 'size'),
            fontWeight: adminVar('item-title-list', 'weight'),
            color:      adminVar('item-title-list', 'color'),
          }}
        >
          Logo do Footer
        </h3>
        <MediaUploader
          label="Logo (Imagem)"
          value={config.footer.logo_url || ''}
          onChange={(url) => updateFooter({ logo_url: url })}
          accept="image/*"
          maxSizeMB={5}
        />
      </div>

      {/* ✅ NOVO: Endereço e Telefone */}
      <div
        className="rounded-xl p-5 space-y-4"
        style={{
          backgroundColor: 'var(--admin-card-bg,     #ffffff)',
          border:          '2px solid var(--admin-card-border, #e5e7eb)',
        }}
      >
        <h3
          style={{
            fontSize:   adminVar('item-title-list', 'size'),
            fontWeight: adminVar('item-title-list', 'weight'),
            color:      adminVar('item-title-list', 'color'),
          }}
        >
          Informações de Contato
        </h3>
        
        <div>
          <Label htmlFor="address" className="mb-1 block">Endereço</Label>
          <Input
            id="address"
            value={config.footer.address || ''}
            onChange={(e) => updateFooter({ address: e.target.value })}
            placeholder="Rua Exemplo, 123 - São Paulo, SP"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="mb-1 block">Telefone</Label>
          <Input
            id="phone"
            value={config.footer.phone || ''}
            onChange={(e) => updateFooter({ phone: e.target.value })}
            placeholder="(11) 1234-5678"
          />
        </div>
      </div>

      {/* Columns list */}
      <div className="space-y-4">
        {config.footer.columns.length === 0 ? (
          <AdminEmptyState
            message="Nenhuma coluna configurada"
            cta={{ label: 'Adicionar Primeira Coluna', onClick: addColumn }}
          />
        ) : (
          config.footer.columns.map((column, colIndex) => (
            <div
              key={column.id || `col-${colIndex}`}
              className="overflow-hidden"
              style={{
                backgroundColor: 'var(--admin-card-bg,     #ffffff)',
                border:          '2px solid var(--admin-card-border, #e5e7eb)',
                borderRadius:    'var(--admin-card-radius,  0.75rem)',
              }}
            >
              {/* Column header */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  backgroundColor: 'var(--admin-editor-preview-bg,     #f9fafb)',
                  borderBottom:    '1px solid var(--admin-editor-preview-border, #f3f4f6)',
                }}
              >
                {/* Setas reordenar — icon-action + btn-reorder-hover */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => moveColumn(colIndex, 'up')}
                    disabled={colIndex === 0}
                    className="p-0.5 rounded disabled:opacity-30"
                    style={{ transition: 'none', backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--admin-btn-reorder-hover, #f3f4f6)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                    title="Mover para cima"
                  >
                    <ChevronUp className="h-3.5 w-3.5" style={{ color: 'var(--admin-icon-action, #4b5563)' }} />
                  </button>
                  <button
                    onClick={() => moveColumn(colIndex, 'down')}
                    disabled={colIndex === config.footer.columns.length - 1}
                    className="p-0.5 rounded disabled:opacity-30"
                    style={{ transition: 'none', backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--admin-btn-reorder-hover, #f3f4f6)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                    title="Mover para baixo"
                  >
                    <ChevronDown className="h-3.5 w-3.5" style={{ color: 'var(--admin-icon-action, #4b5563)' }} />
                  </button>
                </div>

                {/* Title input */}
                <div className="flex-1">
                  <Input
                    value={column.title}
                    onChange={(e) => updateColumn(column.id, { title: e.target.value })}
                    placeholder="Título da Coluna"
                    className="font-semibold"
                  />
                </div>

                {/* Botão "+ Link" — btn-action-* */}
                <button
                  type="button"
                  onClick={() => addLink(column.id)}
                  className="shrink-0 h-8 px-3 rounded-md text-sm font-medium flex items-center gap-1.5"
                  style={{
                    transition:      'none',
                    backgroundColor: 'var(--admin-btn-action-bg,     #ffffff)',
                    color:           'var(--admin-btn-action-text,   #374151)',
                    border:          '1px solid var(--admin-btn-action-border, #e5e7eb)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--admin-btn-action-hover-bg,   #f9fafb)';
                    (e.currentTarget as HTMLButtonElement).style.color           = 'var(--admin-btn-action-hover-text, #111827)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--admin-btn-action-bg,   #ffffff)';
                    (e.currentTarget as HTMLButtonElement).style.color           = 'var(--admin-btn-action-text, #374151)';
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Link
                </button>

                {/* Botão lixeira coluna — delete-btn-* */}
                <button
                  onClick={() => setColumnToDelete(column.id || `col-${colIndex}`)}
                  className="p-2 rounded-lg shrink-0"
                  style={{
                    transition:      'none',
                    color:           'var(--admin-delete-btn-text,     #dc2626)',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color           = 'var(--admin-delete-btn-hover-text,   #b91c1c)';
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--admin-delete-btn-hover-bg,     #fef2f2)';
                    (e.currentTarget as HTMLButtonElement).style.border          = '1px solid var(--admin-delete-btn-hover-border, #fca5a5)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color           = 'var(--admin-delete-btn-text, #dc2626)';
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.border          = 'none';
                  }}
                  title="Excluir coluna"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Links */}
              <div className="p-4">
                {column.links.length === 0 ? (
                  <div className="text-center py-4">
                    {/* Texto "Nenhum link adicionado" — item-tertiary */}
                    <p
                      className="mb-2"
                      style={{
                        fontSize: adminVar('item-tertiary', 'size'),
                        color:    adminVar('item-tertiary', 'color'),
                      }}
                    >Nenhum link adicionado</p>
                    {/* Botão "Adicionar Link" — btn-action-* */}
                    <button
                      type="button"
                      onClick={() => addLink(column.id)}
                      className="h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5"
                      style={{
                        transition:      'none',
                        backgroundColor: 'var(--admin-btn-action-bg,     #ffffff)',
                        color:           'var(--admin-btn-action-text,   #374151)',
                        border:          '1px solid var(--admin-btn-action-border, #e5e7eb)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--admin-btn-action-hover-bg,   #f9fafb)';
                        (e.currentTarget as HTMLButtonElement).style.color           = 'var(--admin-btn-action-hover-text, #111827)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--admin-btn-action-bg,   #ffffff)';
                        (e.currentTarget as HTMLButtonElement).style.color           = 'var(--admin-btn-action-text, #374151)';
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Adicionar Link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Header row */}
                    <div className="grid grid-cols-[24px_1fr_1fr_36px] gap-2 px-1">
                      <span />
                      <span
                        className="uppercase tracking-wide"
                        style={{
                          fontSize:   adminVar('item-tertiary', 'size'),
                          fontWeight: adminVar('item-tertiary', 'weight'),
                          color:      adminVar('item-tertiary', 'color'),
                        }}
                      >Label</span>
                      <span
                        className="uppercase tracking-wide"
                        style={{
                          fontSize:   adminVar('item-tertiary', 'size'),
                          fontWeight: adminVar('item-tertiary', 'weight'),
                          color:      adminVar('item-tertiary', 'color'),
                        }}
                      >URL</span>
                      <span />
                    </div>
                    {column.links.map((link, linkIndex) => (
                      <div 
                        key={link.id || `link-${colIndex}-${linkIndex}`} 
                        className="grid grid-cols-[24px_1fr_1fr_36px] gap-2 items-center"
                        draggable
                        onDragStart={() => setDraggedLink({ columnId: column.id, linkIndex })}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.backgroundColor = 'var(--admin-list-item-selected-bg, #fef2f2)';
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.backgroundColor = 'transparent';
                          if (draggedLink && draggedLink.columnId === column.id) {
                            moveLink(column.id, draggedLink.linkIndex, linkIndex);
                            setDraggedLink(null);
                          }
                        }}
                        style={{
                          cursor: 'grab',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        {/* Ícone de grip — indica que é arrastável */}
                        <div className="flex items-center justify-center">
                          <GripVertical 
                            className="h-4 w-4" 
                            style={{ color: 'var(--admin-icon-action, #9ca3af)' }}
                          />
                        </div>
                        <Input
                          value={link.label}
                          onChange={(e) => updateLink(column.id, link.id, { label: e.target.value })}
                          placeholder="Ex: Sobre nós"
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                        <Input
                          value={link.url}
                          onChange={(e) => updateLink(column.id, link.id, { url: e.target.value })}
                          placeholder="/sobre"
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                        {/* Botão lixeira link — delete-btn-* */}
                        <button
                          onClick={() => setLinkToDelete({ columnId: column.id, linkId: link.id })}
                          className="h-9 w-9 flex items-center justify-center rounded-lg"
                          style={{
                            transition:      'none',
                            color:           'var(--admin-delete-btn-text,     #dc2626)',
                            backgroundColor: 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color           = 'var(--admin-delete-btn-hover-text,   #b91c1c)';
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--admin-delete-btn-hover-bg,     #fef2f2)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color           = 'var(--admin-delete-btn-text, #dc2626)';
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                          }}
                          title="Excluir link"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ── Tab: Redes Sociais ────────────────────────────────────────
  const socialTabContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <TabSectionHeader
          title="Redes Sociais"
          subtitle="Configure os links para redes sociais"
          icon={<Share2 />}
        />
        {/* Botão "+ Adicionar Rede" — AdminPrimaryButton → btn-primary-* */}
        <AdminPrimaryButton onClick={addSocial}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Rede
        </AdminPrimaryButton>
      </div>

      <div className="space-y-4">
        {config.footer.social.length === 0 ? (
          <AdminEmptyState
            message="Nenhuma rede social configurada"
            cta={{ label: 'Adicionar Primeira Rede', onClick: addSocial }}
          />
        ) : (
          config.footer.social.map((social, socialIndex) => (
            <div
              key={social.id || `social-${socialIndex}`}
              className="p-4"
              style={{
                backgroundColor: 'var(--admin-card-bg,     #ffffff)',
                border:          '2px solid var(--admin-card-border, #e5e7eb)',
                borderRadius:    'var(--admin-card-radius,  0.75rem)',
              }}
            >
              <div className="grid grid-cols-[1fr_1fr_2fr_40px] gap-3 items-end">
                <div>
                  <Label className="mb-1 block">Plataforma</Label>
                  <Input
                    value={social.platform}
                    onChange={(e) => updateSocial(social.id, { platform: e.target.value })}
                    placeholder="Instagram"
                  />
                </div>
                <div>
                  <IconPicker
                    label="Ícone"
                    value={social.icon}
                    onChange={(icon) => updateSocial(social.id, { icon })}
                    placeholder="Escolher ícone"
                  />
                </div>
                <div>
                  <Label className="mb-1 block">URL</Label>
                  <Input
                    value={social.url}
                    onChange={(e) => updateSocial(social.id, { url: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="flex items-end pb-0.5">
                  {/* Botão lixeira rede social — delete-btn-* */}
                  <button
                    onClick={() => setSocialToDelete(social.id)}
                    className="h-9 w-9 flex items-center justify-center rounded-lg"
                    style={{
                      transition:      'none',
                      color:           'var(--admin-delete-btn-text,     #dc2626)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color           = 'var(--admin-delete-btn-hover-text,   #b91c1c)';
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--admin-delete-btn-hover-bg,     #fef2f2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color           = 'var(--admin-delete-btn-text, #dc2626)';
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                    }}
                    title="Excluir rede social"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ── Tab: Preview ───────────────────────────────────────────────
  const previewTabContent = (
    <div className="space-y-6">
      <TabSectionHeader
        title="Preview do Footer"
        subtitle="Visualização aproximada do rodapé no site"
        icon={<Eye />}
      />

      {/* Footer preview — estrutura idêntica ao Footer.tsx público */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid var(--admin-card-border, #e5e7eb)' }}>
        <div className="px-6 sm:px-8 md:px-12 py-12" style={{ backgroundColor: secondaryColor || '#2e2240' }}>
          {/* ✅ NOVO: Logo do Footer (topo) */}
          {config.footer.logo_url && (
            <div className="mb-8 flex justify-center">
              <img 
                src={config.footer.logo_url} 
                alt="Logo" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </div>
          )}

          {/* Columns grid */}
          {config.footer.columns.length > 0 && (
            <div
              className={`grid gap-8 mb-8 ${
                config.footer.columns.length === 1
                  ? 'grid-cols-1'
                  : config.footer.columns.length === 2
                  ? 'grid-cols-2'
                  : config.footer.columns.length === 3
                  ? 'grid-cols-3'
                  : 'grid-cols-4'
              }`}
            >
              {config.footer.columns.map((column, colIndex) => (
                <div key={column.id || `preview-col-${colIndex}`}>
                  <h3 className="mb-4 font-semibold text-sm text-white">
                    {column.title || 'Coluna'}
                  </h3>
                  <ul className="space-y-2">
                    {column.links.map((link, linkIndex) => (
                      <li key={link.id || `preview-link-${colIndex}-${linkIndex}`}>
                        <span className="text-sm" style={{ color: '#9ca3af' }}>
                          {link.label || 'Link'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Social icons */}
          {config.footer.social.length > 0 && (
            <div
              className="flex items-center gap-4 mb-8 pb-8 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              {config.footer.social.map((social, socialIndex) => {
                const SocialIcon = getLucideIcon(social.icon, 'h-5 w-5');
                return (
                  <span
                    key={social.id || `preview-social-${socialIndex}`}
                    style={{ color: '#9ca3af' }}
                    title={social.platform}
                  >
                    {SocialIcon}
                  </span>
                );
              })}
            </div>
          )}

          {/* ✅ NOVO: Contact Information */}
          {config.footer.address && (
            <div className="flex items-center gap-2 mb-4" style={{ color: '#9ca3af' }}>
              <MapPin className="h-5 w-5" />
              <span className="text-sm">{config.footer.address}</span>
            </div>
          )}
          {config.footer.phone && (
            <div className="flex items-center gap-2 mb-4" style={{ color: '#9ca3af' }}>
              <Phone className="h-5 w-5" />
              <span className="text-sm">{config.footer.phone}</span>
            </div>
          )}

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              {config.footer.copyright || '© 2026 BemDito. Todos os direitos reservados.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminPageLayout
      title="Rodapé"
      description="Configure as colunas, links sociais e copyright do footer"
      headerActions={
        /* Botão "+ Adicionar Coluna" — AdminPrimaryButton → btn-primary-* */
        <AdminPrimaryButton onClick={addColumn}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Coluna
        </AdminPrimaryButton>
      }
      tabs={[
        { value: 'columns', label: 'Colunas', icon: <List className="h-4 w-4" />, content: columnsTabContent },
        { value: 'social', label: 'Redes Sociais', icon: <Share2 className="h-4 w-4" />, content: socialTabContent },
        { value: 'preview', label: 'Preview', icon: <Eye className="h-4 w-4" />, content: previewTabContent },
      ]}
      defaultTab="columns"
    >
      <ConfirmDeleteDialog
        open={!!columnToDelete}
        onConfirm={confirmDeleteColumn}
        onCancel={() => setColumnToDelete(null)}
        itemName="esta coluna e todos os seus links"
      />
      <ConfirmDeleteDialog
        open={!!linkToDelete}
        onConfirm={confirmDeleteLink}
        onCancel={() => setLinkToDelete(null)}
        itemName="este link"
      />
      <ConfirmDeleteDialog
        open={!!socialToDelete}
        onConfirm={confirmDeleteSocial}
        onCancel={() => setSocialToDelete(null)}
        itemName="esta rede social"
      />
    </AdminPageLayout>
  );
}