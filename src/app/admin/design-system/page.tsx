import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Plus, Loader2, Palette, Type, Ruler, Circle, Sparkles,
  Code2, Eye, Shapes, Search, X,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase/client';
import type { Database } from '../../../lib/supabase/client';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { BaseModal } from '@/app/components/admin/BaseModal';
import { ConfirmDeleteDialog } from '@/app/components/admin/ConfirmDeleteDialog';
import { TypographyManager } from './TypographyManager';
import { AdminPageLayout } from '@/app/components/admin/AdminPageLayout';
import { AdminEmptyState } from '@/app/components/admin/AdminEmptyState';
import { AdminListItem } from '@/app/components/admin/AdminListItem';
import { TabSectionHeader } from '@/app/components/admin/TabSectionHeader';
import {
  adminVar,
  colorVar,
  useAdminTheme,
  UNIFIED_COLOR_GROUPS,
  COLOR_CSS_VAR_MAP,
  resolveColor,
} from '@/app/components/admin/AdminThemeProvider';
import { AdminPrimaryButton } from '@/app/components/admin/AdminPrimaryButton';
import { AVAILABLE_LUCIDE_ICONS } from '@/lib/constants/lucideIcons';
import { getLucideIcon } from '@/lib/utils/icons';
import * as LucideIcons from 'lucide-react';

type DesignToken = Database['public']['Tables']['design_tokens']['Row'];

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN EDITOR (Color)
// ═══════════════════════════════════════════════════════════════════════════════

function UnifiedColorEditor({
  token,
  onSave,
}: {
  token: DesignToken;
  onSave: (id: string, value: Record<string, any>) => void;
}) {
  const [hex, setHex] = useState<string>(token.value?.hex ?? '#ffffff');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (value: string) => {
    setHex(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onSave(token.id, { hex: value });
    }, 800);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 flex-shrink-0 cursor-pointer">
        <div
          className="h-10 w-10 rounded-lg"
          style={{
            backgroundColor: hex,
            border: '1px solid var(--border-default, #E5E7EB)',
          }}
        />
        <input
          type="color"
          value={hex}
          onChange={(e) => handleChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: adminVar('item-tertiary', 'size'),
              fontWeight: adminVar('item-tertiary', 'weight'),
              color: adminVar('item-tertiary', 'color'),
            }}
          >{token.label}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Input
            value={hex}
            onChange={(e) => handleChange(e.target.value)}
            className="h-7 text-xs font-mono"
            placeholder="#ffffff"
          />
          <span
            className="font-mono text-xs flex-shrink-0 hidden md:inline"
            style={{ color: 'var(--text-muted, #6B7280)', opacity: 0.7 }}
          >
            --{token.name}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: CORES (Unified Color System)
// ═══════════════════════════════════════════════════════════════════════════════
function ColorsTab({
  colorTokens,
  onSave,
}: {
  colorTokens: DesignToken[];
  onSave: (id: string, value: Record<string, any>) => void;
}) {
  const tokenMap = Object.fromEntries(colorTokens.map((t) => [t.name, t]));

  return (
    <div className="space-y-6">
      <TabSectionHeader
        icon={<Palette />}
        title="Paleta de Cores"
        subtitle="Sistema unificado de cores para todo o site e painel admin. Zero hardcoded."
      />

      {UNIFIED_COLOR_GROUPS.map((group) => {
        const groupTokens = group.tokens.map((n) => tokenMap[n]).filter(Boolean);

        if (groupTokens.length === 0) {
          return (
            <div
              key={group.key}
              className="rounded-2xl p-6"
              style={{
                backgroundColor: 'var(--bg-surface, #FFFFFF)',
                border: '2px solid var(--border-default, #E5E7EB)',
              }}
            >
              <h3 style={{
                fontSize: adminVar('item-title-list', 'size'),
                fontWeight: adminVar('item-title-list', 'weight'),
                color: adminVar('item-title-list', 'color'),
              }}>{group.title}</h3>
              <p className="mt-1" style={{
                fontSize: adminVar('section-subheader', 'size'),
                color: adminVar('section-subheader', 'color'),
              }}>{group.subtitle}</p>
              <div className="mt-4">
                <AdminEmptyState
                  title={`Tokens de "${group.title}" não encontrados`}
                  description="Execute o SQL de migration para criar os tokens unificados."
                />
              </div>
            </div>
          );
        }

        return (
          <div
            key={group.key}
            className="rounded-2xl p-6 space-y-4"
            style={{
              backgroundColor: 'var(--bg-surface, #FFFFFF)',
              border: '2px solid var(--border-default, #E5E7EB)',
            }}
          >
            <div>
              <h3 style={{
                fontSize: adminVar('item-title-list', 'size'),
                fontWeight: adminVar('item-title-list', 'weight'),
                color: adminVar('item-title-list', 'color'),
              }}>{group.title}</h3>
              <p className="mt-0.5" style={{
                fontSize: adminVar('section-subheader', 'size'),
                color: adminVar('section-subheader', 'color'),
              }}>{group.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groupTokens.map((token) => (
                <AdminListItem key={token.id} className="p-3">
                  <UnifiedColorEditor token={token} onSave={onSave} />
                </AdminListItem>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: ÍCONES LUCIDE
// ═══════════════════════════════════════════════════════════════════════════════
function IconsManagerTab({ 
  isAddModalOpen, 
  setIsAddModalOpen 
}: { 
  isAddModalOpen: boolean; 
  setIsAddModalOpen: (open: boolean) => void;
}) {
  const [availableIcons, setAvailableIcons] = useState<string[]>([...AVAILABLE_LUCIDE_ICONS]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [addIconSearch, setAddIconSearch] = useState('');
  const [iconToDelete, setIconToDelete] = useState<string | null>(null);

  // Categorias dos ícones (baseado na estrutura do lucideIcons.ts)
  const categories = [
    { id: 'all', label: 'Todos', count: availableIcons.length },
    { id: 'people', label: 'Pessoas & Comunicação', keywords: ['User', 'Mail', 'Phone', 'Calendar', 'Heart', 'Star', 'Message'] },
    { id: 'navigation', label: 'Navegação & UI', keywords: ['Search', 'Filter', 'Bell', 'Check', 'Circle', 'Plus', 'Minus', 'Trash', 'Download', 'Chevron', 'Arrow', 'Ellipsis'] },
    { id: 'business', label: 'Comércio & Negócios', keywords: ['Shopping', 'Credit', 'Briefcase', 'Building', 'Key', 'Shield', 'Award', 'Target', 'Package', 'Truck'] },
    { id: 'data', label: 'Dados & Análise', keywords: ['Trending', 'Chart', 'Pie', 'Activity'] },
    { id: 'links', label: 'Links & Arquivos', keywords: ['Share', 'Copy', 'Link', 'External', 'Eye', 'Lock', 'File', 'Folder', 'Save', 'Archive', 'Printer'] },
    { id: 'tech', label: 'Tecnologia', keywords: ['Zap', 'Cpu', 'Smartphone', 'Laptop', 'Monitor', 'Globe', 'Wifi', 'Bluetooth', 'Battery'] },
    { id: 'media', label: 'Mídia', keywords: ['Volume', 'Music', 'Play', 'Pause', 'Skip', 'Camera', 'Image'] },
    { id: 'life', label: 'Viagem & Vida', keywords: ['Plane', 'Coffee', 'Sun', 'Moon'] },
    { id: 'design', label: 'Natureza & Design', keywords: ['Sparkles', 'Flame', 'Droplet', 'Wind', 'Cloud', 'Umbrella', 'Palette', 'Brush', 'Pencil', 'Eraser', 'Scissors'] },
    { id: 'layout', label: 'Layout & Grid', keywords: ['Layers', 'Layout', 'Grid', 'Menu'] },
  ];

  // Todos os ícones disponíveis no Lucide (filtrados por busca)
  const allLucideIcons = useMemo(() => {
    if (!LucideIcons || typeof LucideIcons !== 'object') {
      console.error('LucideIcons não está disponível');
      return [];
    }
    
    return Object.keys(LucideIcons)
      .filter((name) => {
        // Filtrar apenas componentes de ícone (não tipos, etc)
        if (name === 'default' || name === 'createLucideIcon' || !name.match(/^[A-Z]/)) return false;
        
        // Verificar se é realmente um componente válido
        const component = (LucideIcons as any)[name];
        if (typeof component !== 'function') return false;
        
        // Busca
        if (addIconSearch) {
          return name.toLowerCase().includes(addIconSearch.toLowerCase());
        }
        return true;
      })
      .sort();
  }, [addIconSearch]);

  // Ícones filtrados por categoria e busca
  const filteredIcons = availableIcons.filter((iconName) => {
    // Filtro de busca
    if (searchTerm && !iconName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filtro de categoria
    if (categoryFilter !== 'all') {
      const category = categories.find(c => c.id === categoryFilter);
      if (category && category.keywords) {
        return category.keywords.some(keyword => 
          iconName.toLowerCase().includes(keyword.toLowerCase())
        );
      }
    }

    return true;
  });

  const handleAddIcon = (iconName: string) => {
    if (!availableIcons.includes(iconName)) {
      setAvailableIcons(prev => [...prev, iconName].sort());
      toast.success(`Ícone "${iconName}" adicionado!`);
      setAddIconSearch('');
    }
  };

  const confirmDeleteIcon = () => {
    if (!iconToDelete) return;
    setAvailableIcons(prev => prev.filter(name => name !== iconToDelete));
    toast.success(`Ícone "${iconToDelete}" removido!`);
    setIconToDelete(null);
  };

  return (
    <div className="space-y-6">
      <TabSectionHeader
        icon={<Shapes />}
        title="Ícones Lucide"
        subtitle={`Gerencie os ${availableIcons.length} ícones disponíveis para uso no site e no painel admin.`}
      />

      {/* Barra de busca e categorias */}
      <div className="space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
            style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar ícones..."
            className="pl-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4" style={{ color: 'var(--admin-icon-action, #9ca3af)' }} />
            </button>
          )}
        </div>

        {/* Filtro de categorias */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count = cat.id === 'all' 
              ? availableIcons.length 
              : availableIcons.filter(icon => 
                  cat.keywords?.some(k => icon.toLowerCase().includes(k.toLowerCase()))
                ).length;

            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-none"
                style={{
                  backgroundColor: categoryFilter === cat.id 
                    ? 'var(--admin-list-item-selected-bg, #fef2f2)' 
                    : 'var(--admin-card-bg, #ffffff)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: categoryFilter === cat.id 
                    ? 'var(--primary, #ea526e)' 
                    : 'var(--admin-card-border, #e5e7eb)',
                  color: categoryFilter === cat.id 
                    ? 'var(--primary, #ea526e)' 
                    : 'var(--admin-btn-action-text, #374151)',
                }}
              >
                {cat.label} <span style={{ opacity: 0.6 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de ícones */}
      {filteredIcons.length === 0 ? (
        <AdminEmptyState
          title="Nenhum ícone encontrado"
          description={searchTerm 
            ? `Nenhum ícone corresponde à busca "${searchTerm}"` 
            : "Nenhum ícone nesta categoria"}
        />
      ) : (
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--admin-card-bg, #ffffff)',
            border: '2px solid var(--admin-card-border, #e5e7eb)',
          }}
        >
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
            {filteredIcons.map((iconName) => {
              const IconComponent = getLucideIcon(iconName, 'h-6 w-6');
              
              if (!IconComponent) {
                console.warn(`Ícone não encontrado: ${iconName}`);
                return null;
              }
              
              return (
                <div
                  key={iconName}
                  className="group relative flex flex-col items-center justify-center p-3 rounded-xl transition-none"
                  style={{
                    backgroundColor: 'var(--admin-editor-preview-bg, #f9fafb)',
                    border: '1px solid var(--admin-editor-preview-border, #f3f4f6)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--admin-list-item-selected-bg, #fef2f2)';
                    e.currentTarget.style.borderColor = 'var(--primary, #ea526e)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--admin-editor-preview-bg, #f9fafb)';
                    e.currentTarget.style.borderColor = 'var(--admin-editor-preview-border, #f3f4f6)';
                  }}
                >
                  {/* Botão deletar (aparece no hover) */}
                  <button
                    onClick={() => setIconToDelete(iconName)}
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 h-5 w-5 rounded-full flex items-center justify-center transition-opacity"
                    style={{
                      backgroundColor: 'var(--admin-delete-btn-hover-bg, #fef2f2)',
                      color: 'var(--admin-delete-btn-hover-text, #b91c1c)',
                    }}
                    title={`Remover ${iconName}`}
                  >
                    <X className="h-3 w-3" />
                  </button>

                  {/* Ícone */}
                  <div className="mb-1" style={{ color: 'var(--admin-icon-action, #4b5563)' }}>
                    {IconComponent}
                  </div>

                  {/* Nome */}
                  <span
                    className="text-center text-xs leading-tight"
                    style={{
                      fontSize: 'var(--admin-item-tertiary-size, 0.75rem)',
                      color: 'var(--admin-item-tertiary-color, #6b7280)',
                    }}
                  >
                    {iconName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de adicionar ícone */}
      <BaseModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Adicionar Ícone Lucide"
        description={`Busque entre ${allLucideIcons.length} ícones disponíveis no Lucide`}
        onSave={() => setIsAddModalOpen(false)}
        onCancel={() => setIsAddModalOpen(false)}
        saveLabel="Fechar"
      >
        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
              style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }} />
            <Input
              value={addIconSearch}
              onChange={(e) => setAddIconSearch(e.target.value)}
              placeholder="Buscar ícones Lucide..."
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Grid de ícones disponíveis */}
          <div
            className="max-h-96 overflow-y-auto rounded-xl p-4"
            style={{
              backgroundColor: 'var(--admin-editor-preview-bg, #f9fafb)',
              border: '1px solid var(--admin-editor-preview-border, #f3f4f6)',
            }}
          >
            {allLucideIcons.length === 0 ? (
              <AdminEmptyState
                title="Nenhum ícone encontrado"
                description={`Nenhum ícone corresponde à busca "${addIconSearch}"`}
              />
            ) : (
              <div className="grid grid-cols-6 gap-2">
                {allLucideIcons.map((iconName) => {
                  const IconComponent = getLucideIcon(iconName, 'h-5 w-5');
                  const isAdded = availableIcons.includes(iconName);

                  if (!IconComponent) {
                    console.warn(`Ícone não encontrado no modal: ${iconName}`);
                    return null;
                  }

                  return (
                    <button
                      key={iconName}
                      onClick={() => !isAdded && handleAddIcon(iconName)}
                      disabled={isAdded}
                      className="flex flex-col items-center justify-center p-2 rounded-lg transition-none disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: isAdded 
                          ? 'var(--admin-list-item-selected-bg, #fef2f2)' 
                          : 'var(--admin-card-bg, #ffffff)',
                        border: '1px solid',
                        borderColor: isAdded 
                          ? 'var(--primary, #ea526e)' 
                          : 'var(--admin-card-border, #e5e7eb)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isAdded) {
                          e.currentTarget.style.backgroundColor = 'var(--admin-list-item-hover-border, #f3f4f6)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isAdded) {
                          e.currentTarget.style.backgroundColor = 'var(--admin-card-bg, #ffffff)';
                        }
                      }}
                      title={isAdded ? 'Já adicionado' : `Adicionar ${iconName}`}
                    >
                      <div className="mb-1" style={{ color: isAdded ? 'var(--primary, #ea526e)' : 'var(--admin-icon-action, #4b5563)' }}>
                        {IconComponent}
                      </div>
                      <span
                        className="text-xs text-center leading-tight"
                        style={{
                          fontSize: '0.625rem',
                          color: isAdded ? 'var(--primary, #ea526e)' : 'var(--admin-item-tertiary-color, #6b7280)',
                        }}
                      >
                        {iconName}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </BaseModal>

      {/* Confirm delete dialog */}
      <ConfirmDeleteDialog
        open={!!iconToDelete}
        onConfirm={confirmDeleteIcon}
        onCancel={() => setIconToDelete(null)}
        itemName={`o ícone "${iconToDelete}"`}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: CSS VARIABLES (REMOVIDA - substituída por Ícones)
// ═══════════════════════════════════════════════════════════════════════════════
function CSSVariablesTab({
  adminTokens,
  colorTokens,
}: {
  adminTokens: DesignToken[];
  colorTokens: DesignToken[];
}) {
  const cssLines: { varName: string; value: string; token: string; category: string }[] = [];

  // Color tokens → --{name}
  for (const token of colorTokens) {
    if (!token.value?.hex) continue;
    cssLines.push({
      varName: `--${token.name}`,
      value: token.value.hex,
      token: token.name,
      category: 'color',
    });
    const tailwindVar = COLOR_CSS_VAR_MAP[token.name];
    if (tailwindVar) {
      cssLines.push({
        varName: tailwindVar,
        value: token.value.hex,
        token: token.name,
        category: 'tailwind',
      });
    }
  }

  // Admin-ui tokens (typography, icon, value — colors resolved to unified vars)
  for (const token of adminTokens) {
    const v = token.value;
    const base = `--admin-${token.name}`;
    if (v.hex) {
      cssLines.push({ varName: base, value: v.hex, token: token.name, category: 'admin-ui' });
    } else {
      if (v.size   !== undefined) cssLines.push({ varName: `${base}-size`,   value: v.size,   token: token.name, category: 'admin-ui' });
      if (v.weight !== undefined) cssLines.push({ varName: `${base}-weight`, value: String(v.weight), token: token.name, category: 'admin-ui' });
      if (v.color  !== undefined) cssLines.push({ varName: `${base}-color`,  value: resolveColor(v.color), token: token.name, category: 'admin-ui' });
      if (v.mono   !== undefined) cssLines.push({ varName: `${base}-font`,   value: v.mono ? 'monospace' : 'inherit', token: token.name, category: 'admin-ui' });
      if (v.value  !== undefined) cssLines.push({ varName: `${base}`,       value: v.value,  token: token.name, category: 'admin-ui' });
    }
  }

  return (
    <div className="space-y-6">
      <TabSectionHeader
        icon={<Code2 />}
        title="CSS Custom Properties"
        subtitle="Referência completa de todas as CSS vars geradas a partir dos tokens."
      />

      <div className="rounded-2xl p-6 overflow-x-auto" style={{ backgroundColor: 'var(--brand-primary, #2E2240)' }}>
        <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre">
          {`:root {\n${cssLines.map((l) => `  ${l.varName}: ${l.value};`).join('\n')}\n}`}
        </pre>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-surface, #FFFFFF)',
          border: '2px solid var(--border-default, #E5E7EB)',
        }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--border-default, #E5E7EB)',
              backgroundColor: 'var(--bg-base, #F6F6F6)',
            }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--text-muted, #6B7280)' }}>CSS Variable</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--text-muted, #6B7280)' }}>Valor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--text-muted, #6B7280)' }}>Token</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--text-muted, #6B7280)' }}>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {cssLines.map((row, i) => (
              <tr
                key={`${row.varName}-${i}`}
                style={{
                  borderTop: i > 0 ? '1px solid var(--border-soft, #ECEAF1)' : 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--state-hover-neutral, #F3F4F6)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--brand-pink, #EA526E)' }}>{row.varName}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {row.value.startsWith('#') && (
                      <div
                        className="h-4 w-4 rounded flex-shrink-0"
                        style={{
                          backgroundColor: row.value,
                          border: '1px solid var(--border-default, #E5E7EB)',
                        }}
                      />
                    )}
                    <span className="font-mono text-xs" style={{ color: 'var(--text-secondary, #4B5563)' }}>{row.value}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--text-muted, #6B7280)' }}>{row.token}</td>
                <td className="px-4 py-2.5">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      row.category === 'admin-ui' ? 'border-purple-200 text-purple-700'
                      : row.category === 'tailwind' ? 'border-blue-200 text-blue-700'
                      : 'border-pink-200 text-pink-700'
                    }`}
                  >
                    {row.category}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: PREVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function PreviewTab() {
  return (
    <div className="space-y-6">
      <TabSectionHeader
        icon={<Eye />}
        title="Preview da Interface"
        subtitle="Visualização dos elementos do painel com as configurações atuais de tokens."
      />

      {/* Color Palette Preview */}
      <div
        className="p-6 space-y-4 rounded-2xl"
        style={{
          backgroundColor: 'var(--bg-surface, #FFFFFF)',
          border: '2px solid var(--border-default, #E5E7EB)',
        }}
      >
        <p className="text-xs font-mono uppercase tracking-wide" style={{ color: 'var(--text-muted, #6B7280)' }}>
          Paleta de Cores
        </p>
        <div className="flex gap-2 flex-wrap">
          {[
            { name: 'brand-primary', label: 'Primary' },
            { name: 'brand-pink', label: 'Pink' },
            { name: 'brand-orange', label: 'Orange' },
            { name: 'bg-base', label: 'Base' },
            { name: 'bg-surface', label: 'Surface' },
            { name: 'bg-subtle', label: 'Subtle' },
          ].map(({ name, label }) => (
            <div key={name} className="text-center">
              <div
                className="h-12 w-12 rounded-xl"
                style={{
                  backgroundColor: colorVar(name),
                  border: '1px solid var(--border-default, #E5E7EB)',
                }}
              />
              <p className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted, #6B7280)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Page Header Preview */}
      <div
        className="p-6 space-y-4 rounded-2xl"
        style={{
          backgroundColor: 'var(--bg-surface, #FFFFFF)',
          border: '2px solid var(--border-default, #E5E7EB)',
        }}
      >
        <p className="text-xs font-mono uppercase tracking-wide" style={{ color: 'var(--text-muted, #6B7280)' }}>
          Cabeçalho de Página
        </p>
        <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--border-soft, #ECEAF1)' }}>
          <div>
            <h1 style={{
              fontSize: adminVar('page-title', 'size'),
              fontWeight: adminVar('page-title', 'weight'),
              color: adminVar('page-title', 'color'),
            }}>Titulo da Pagina</h1>
            <p style={{
              fontSize: adminVar('page-description', 'size'),
              fontWeight: adminVar('page-description', 'weight'),
              color: adminVar('page-description', 'color'),
            }} className="mt-1">Descricao breve da finalidade desta pagina</p>
          </div>
          <div className="h-9 px-4 rounded-2xl flex items-center text-sm font-medium" style={{
            backgroundColor: 'var(--button-primary-bg, #2E2240)',
            color: 'var(--button-primary-text, #FFFFFF)',
          }}>+ Acao Principal</div>
        </div>
      </div>

      {/* Buttons Preview */}
      <div
        className="p-6 space-y-4 rounded-2xl"
        style={{
          backgroundColor: 'var(--bg-surface, #FFFFFF)',
          border: '2px solid var(--border-default, #E5E7EB)',
        }}
      >
        <p className="text-xs font-mono uppercase tracking-wide" style={{ color: 'var(--text-muted, #6B7280)' }}>
          Botoes
        </p>
        <div className="flex gap-3 flex-wrap">
          <div className="h-9 px-4 rounded-2xl flex items-center text-sm font-medium" style={{
            backgroundColor: 'var(--button-primary-bg, #2E2240)',
            color: 'var(--button-primary-text, #FFFFFF)',
          }}>Primario</div>
          <div className="h-9 px-4 rounded-2xl flex items-center text-sm font-medium" style={{
            backgroundColor: 'var(--button-primary-hover, #241A33)',
            color: 'var(--button-primary-text, #FFFFFF)',
          }}>Primario Hover</div>
          <div className="h-9 px-4 rounded-2xl flex items-center text-sm font-medium" style={{
            backgroundColor: 'transparent',
            color: 'var(--text-secondary, #4B5563)',
            border: '1px solid var(--button-ghost-border, #E5E7EB)',
          }}>Ghost</div>
          <div className="h-9 px-4 rounded-2xl flex items-center text-sm font-medium" style={{
            backgroundColor: 'var(--semantic-error-bg, #FEE2E2)',
            color: 'var(--semantic-error-text, #7F1D1D)',
          }}>Excluir</div>
        </div>
      </div>

      {/* Inputs Preview */}
      <div
        className="p-6 space-y-4 rounded-2xl"
        style={{
          backgroundColor: 'var(--bg-surface, #FFFFFF)',
          border: '2px solid var(--border-default, #E5E7EB)',
        }}
      >
        <p className="text-xs font-mono uppercase tracking-wide" style={{ color: 'var(--text-muted, #6B7280)' }}>
          Campos de Formulario
        </p>
        <div className="max-w-sm space-y-3">
          <div className="space-y-1">
            <Label>Label do Campo</Label>
            <div className="h-9 rounded-md px-3 flex items-center text-sm" style={{
              backgroundColor: 'var(--input-bg, #FFFFFF)',
              color: 'var(--input-placeholder, #9CA3AF)',
              border: '1px solid var(--input-border, #D1D5DB)',
            }}>Placeholder do campo...</div>
          </div>
          <div className="space-y-1">
            <Label>Campo com Foco</Label>
            <div className="h-9 rounded-md px-3 flex items-center text-sm" style={{
              backgroundColor: 'var(--input-bg, #FFFFFF)',
              color: 'var(--input-text, #2E2240)',
              border: '2px solid var(--input-border-focus, #A78BFA)',
            }}>Texto digitado</div>
          </div>
        </div>
      </div>

      {/* Semantic Colors Preview */}
      <div
        className="p-6 space-y-4 rounded-2xl"
        style={{
          backgroundColor: 'var(--bg-surface, #FFFFFF)',
          border: '2px solid var(--border-default, #E5E7EB)',
        }}
      >
        <p className="text-xs font-mono uppercase tracking-wide" style={{ color: 'var(--text-muted, #6B7280)' }}>
          Cores Semanticas
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['success', 'warning', 'error', 'info'].map((type) => (
            <div
              key={type}
              className="rounded-xl p-3"
              style={{
                backgroundColor: colorVar(`semantic-${type}-bg`),
                border: `1px solid ${colorVar(`semantic-${type}-border`)}`,
              }}
            >
              <p className="text-sm font-medium capitalize" style={{ color: colorVar(`semantic-${type}-text`) }}>
                {type}
              </p>
              <div className="h-2 w-8 rounded-full mt-2" style={{ backgroundColor: colorVar(`semantic-${type}-base`) }} />
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Preview */}
      <div
        className="p-6 space-y-3 rounded-2xl"
        style={{
          backgroundColor: 'var(--bg-surface, #FFFFFF)',
          border: '2px solid var(--border-default, #E5E7EB)',
        }}
      >
        <p className="text-xs font-mono uppercase tracking-wide" style={{ color: 'var(--text-muted, #6B7280)' }}>
          Sidebar
        </p>
        <div
          className="rounded-xl p-3 w-56 space-y-1"
          style={{ backgroundColor: 'var(--brand-primary, #2E2240)' }}
        >
          <p className="px-3 pb-2" style={{
            fontSize: 'var(--admin-sidebar-title-size, 1.5rem)',
            fontWeight: 'var(--admin-sidebar-title-weight, 700)',
            color: 'var(--text-on-dark, #FFFFFF)',
          }}>Ajustes</p>
          {['Ativo', 'Item 2', 'Item 3'].map((name, i) => (
            <div
              key={name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                fontSize: 'var(--admin-nav-item-size, 0.875rem)',
                fontWeight: 'var(--admin-nav-item-weight, 500)',
                backgroundColor: i === 0
                  ? 'var(--brand-pink, #EA526E)'
                  : 'transparent',
                color: i === 0
                  ? 'var(--text-on-dark, #FFFFFF)'
                  : 'var(--admin-nav-item-color, #d1d5db)',
              }}
            >
              <div className="h-4 w-4 rounded bg-white/20 flex-shrink-0" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPACING, RADIUS, TRANSITION CARDS
// ═══════════════════════════════════════════════════════════════════════════════

function SpacingTokenCard({ token, onUpdate, saving }: {
  token: DesignToken;
  onUpdate: (id: string, value: string) => void;
  saving: boolean;
}) {
  const [value, setValue] = useState(token.value.value || '0px');
  const handleBlur = () => { if (value !== token.value.value) onUpdate(token.id, value); };

  return (
    <div className="flex flex-col rounded-2xl" style={{
      backgroundColor: 'var(--bg-surface, #FFFFFF)',
      border: '2px solid var(--border-default, #E5E7EB)',
    }}>
      <div className="px-5 pt-5 pb-3 space-y-0.5">
        <h4 style={{
          fontSize: adminVar('item-title-list', 'size'),
          fontWeight: adminVar('item-title-list', 'weight'),
          color: adminVar('item-title-list', 'color'),
        }}>{token.label}</h4>
        <p className="font-mono" style={{
          fontSize: adminVar('item-description', 'size'),
          color: adminVar('item-description', 'color'),
        }}>{token.name}</p>
      </div>
      <div className="px-5 pb-5">
        <div className="space-y-2">
          <Label htmlFor={`sp-${token.id}`}>Valor</Label>
          <Input id={`sp-${token.id}`} value={value} onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur} placeholder="0px" disabled={saving} />
        </div>
        <div className="mt-4" style={{
          padding: value,
          border: '1px solid var(--border-default, #E5E7EB)',
          borderRadius: '0.75rem',
        }}>Exemplo de espacamento</div>
      </div>
    </div>
  );
}

function RadiusTokenCard({ token, onUpdate, saving }: {
  token: DesignToken;
  onUpdate: (id: string, value: string) => void;
  saving: boolean;
}) {
  const [value, setValue] = useState(token.value.value || '0px');
  const handleBlur = () => { if (value !== token.value.value) onUpdate(token.id, value); };

  return (
    <div className="flex flex-col rounded-2xl" style={{
      backgroundColor: 'var(--bg-surface, #FFFFFF)',
      border: '2px solid var(--border-default, #E5E7EB)',
    }}>
      <div className="px-5 pt-5 pb-3 space-y-0.5">
        <h4 style={{
          fontSize: adminVar('item-title-list', 'size'),
          fontWeight: adminVar('item-title-list', 'weight'),
          color: adminVar('item-title-list', 'color'),
        }}>{token.label}</h4>
        <p className="font-mono" style={{
          fontSize: adminVar('item-description', 'size'),
          color: adminVar('item-description', 'color'),
        }}>{token.name}</p>
      </div>
      <div className="px-5 pb-5">
        <div className="space-y-2">
          <Label htmlFor={`rd-${token.id}`}>Valor</Label>
          <Input id={`rd-${token.id}`} value={value} onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur} placeholder="0px" disabled={saving} />
        </div>
        <div className="mt-4 p-4" style={{
          borderRadius: value,
          border: '1px solid var(--border-default, #E5E7EB)',
        }}>Exemplo de border radius</div>
      </div>
    </div>
  );
}

function TransitionTokenCard({ token, onUpdate, saving }: {
  token: DesignToken;
  onUpdate: (id: string, duration: string, easing: string) => void;
  saving: boolean;
}) {
  const [duration, setDuration] = useState(token.value.duration || '0s');
  const [easing, setEasing] = useState(token.value.easing || 'ease');
  const handleBlur = () => {
    if (duration !== token.value.duration || easing !== token.value.easing) onUpdate(token.id, duration, easing);
  };

  return (
    <div className="flex flex-col rounded-2xl" style={{
      backgroundColor: 'var(--bg-surface, #FFFFFF)',
      border: '2px solid var(--border-default, #E5E7EB)',
    }}>
      <div className="px-5 pt-5 pb-3 space-y-0.5">
        <h4 style={{
          fontSize: adminVar('item-title-list', 'size'),
          fontWeight: adminVar('item-title-list', 'weight'),
          color: adminVar('item-title-list', 'color'),
        }}>{token.label}</h4>
        <p className="font-mono" style={{
          fontSize: adminVar('item-description', 'size'),
          color: adminVar('item-description', 'color'),
        }}>{token.name}</p>
      </div>
      <div className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Duracao</Label>
            <Input value={duration} onChange={(e) => setDuration(e.target.value)}
              onBlur={handleBlur} placeholder="0s" disabled={saving} />
          </div>
          <div className="space-y-2">
            <Label>Easing</Label>
            <Input value={easing} onChange={(e) => setEasing(e.target.value)}
              onBlur={handleBlur} placeholder="ease" disabled={saving} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD TOKEN MODAL (Generic)
// ═══════════════════════════════════════════════════════════════════════════════
function AddTokenModal({
  open, onClose, title, description, saving, fields, extraContent, initialExtra = {}, onSave,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  saving: boolean;
  fields: { id: string; label: string; placeholder: string }[];
  extraContent?: (vals: Record<string, string>, setVals: (v: Record<string, string>) => void) => React.ReactNode;
  initialExtra?: Record<string, string>;
  onSave: (vals: Record<string, string>) => Promise<boolean | void>;
}) {
  const [vals, setVals] = useState<Record<string, string>>({});
  useEffect(() => { if (open) setVals(initialExtra); }, [open]);

  const handleSave = async () => {
    const allFilled = fields.every((f) => (vals[f.id] ?? '').trim() !== '');
    if (!allFilled) { toast.error('Preencha todos os campos obrigatorios.'); return; }
    const result = await onSave(vals);
    if (result !== false) onClose();
  };

  return (
    <BaseModal open={open} onOpenChange={(v) => !v && onClose()} title={title}
      description={description} onSave={handleSave} onCancel={onClose} saveLabel="Adicionar" saving={saving}>
      <div className="space-y-4 py-1">
        {fields.map((f) => (
          <div key={f.id} className="space-y-1.5">
            <Label htmlFor={`atm-${f.id}`}>{f.label}</Label>
            <Input id={`atm-${f.id}`} value={vals[f.id] ?? ''} disabled={saving}
              onChange={(e) => setVals((prev) => ({ ...prev, [f.id]: e.target.value }))}
              placeholder={f.placeholder} />
          </div>
        ))}
        {extraContent?.(vals, setVals)}
      </div>
    </BaseModal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export function DesignSystemPage() {
  const { adminTokens, colorTokens, refreshTheme, loading: themeLoading } = useAdminTheme();
  const [typographyTokens, setTypographyTokens] = useState<DesignToken[]>([]);
  const [spacingTokens, setSpacingTokens] = useState<DesignToken[]>([]);
  const [radiusTokens, setRadiusTokens] = useState<DesignToken[]>([]);
  const [transitionTokens, setTransitionTokens] = useState<DesignToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<string | null>(null);
  const [isAddIconModalOpen, setIsAddIconModalOpen] = useState(false);

  useEffect(() => { loadTokens(); }, []);

  const loadTokens = async () => {
    try {
      const [typRes, spRes, rdRes, trRes] = await Promise.all([
        supabase.from('design_tokens').select('*').eq('category', 'typography').order('order', { ascending: true }),
        supabase.from('design_tokens').select('*').eq('category', 'spacing').order('created_at'),
        supabase.from('design_tokens').select('*').eq('category', 'radius').order('created_at'),
        supabase.from('design_tokens').select('*').eq('category', 'transition').order('created_at'),
      ]);

      if (typRes.error) throw typRes.error;
      if (spRes.error) throw spRes.error;
      if (rdRes.error) throw rdRes.error;
      if (trRes.error) throw trRes.error;

      setTypographyTokens(typRes.data || []);
      setSpacingTokens(spRes.data || []);
      setRadiusTokens(rdRes.data || []);
      setTransitionTokens(trRes.data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar tokens', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // ── Save handlers ──────────────────────────────────────────────────────────

  const handleColorSave = useCallback(async (id: string, value: Record<string, any>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('design_tokens')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      await refreshTheme();
      toast.success('Cor salva', { description: 'CSS vars atualizadas automaticamente.' });
    } catch (err: any) {
      toast.error('Erro ao salvar', { description: err.message });
    } finally {
      setSaving(false);
    }
  }, [refreshTheme]);

  const addColorToken = async (name: string, label: string, hex: string) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('design_tokens')
        .insert({ category: 'color', name, label, value: { hex } })
        .select().single();
      if (error) throw error;
      await refreshTheme();
      toast.success('Cor adicionada!');
      return true;
    } catch (error: any) {
      toast.error('Erro ao adicionar cor', { description: error.message });
      return false;
    } finally { setSaving(false); }
  };

  const confirmDeleteColor = async () => {
    if (!colorToDelete) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('design_tokens').delete().eq('id', colorToDelete);
      if (error) throw error;
      await refreshTheme();
      toast.success('Cor deletada!');
    } catch (error: any) {
      toast.error('Erro ao deletar cor', { description: error.message });
    } finally {
      setSaving(false);
      setColorToDelete(null);
    }
  };

  // Typography
  const updateTypographyToken = async (id: string, updates: Partial<DesignToken>) => {
    setSaving(true);
    try {
      const { error } = await supabase.from('design_tokens').update(updates).eq('id', id);
      if (error) throw error;
      setTypographyTokens(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      toast.success('Tipografia atualizada!');
    } catch (error: any) { toast.error('Erro', { description: error.message }); }
    finally { setSaving(false); }
  };

  const createTypographyToken = async (token: Omit<DesignToken, 'id' | 'created_at'>) => {
    setSaving(true);
    try {
      const { data, error } = await supabase.from('design_tokens').insert(token).select().single();
      if (error) throw error;
      setTypographyTokens(prev => [...prev, data]);
      toast.success('Tipo de fonte criado!');
    } catch (error: any) { toast.error('Erro', { description: error.message }); }
    finally { setSaving(false); }
  };

  const deleteTypographyToken = async (id: string) => {
    setSaving(true);
    try {
      const deletedToken = typographyTokens.find(t => t.id === id);
      if (!deletedToken) throw new Error('Token nao encontrado');
      const remaining = typographyTokens.filter(t => t.id !== id);
      if (remaining.length === 0) {
        toast.error('Nao e possivel deletar o ultimo tipo de fonte!');
        setSaving(false);
        return;
      }
      const { error } = await supabase.from('design_tokens').delete().eq('id', id);
      if (error) throw error;
      setTypographyTokens(remaining);
      toast.success('Tipo de fonte deletado!');
    } catch (error: any) { toast.error('Erro', { description: error.message }); }
    finally { setSaving(false); }
  };

  const reorderTypographyTokens = async (reordered: DesignToken[]) => {
    setSaving(true);
    try {
      await Promise.all(reordered.map((t, i) =>
        supabase.from('design_tokens').update({ order: i + 1 }).eq('id', t.id)
      ));
      setTypographyTokens(reordered);
      toast.success('Ordem atualizada!');
    } catch (error: any) { toast.error('Erro', { description: error.message }); }
    finally { setSaving(false); }
  };

  // Spacing
  const updateSpacing = async (id: string, value: string) => {
    setSaving(true);
    try {
      const { error } = await supabase.from('design_tokens').update({ value: { value } }).eq('id', id);
      if (error) throw error;
      setSpacingTokens(prev => prev.map(t => t.id === id ? { ...t, value: { value } } : t));
      toast.success('Espacamento atualizado!');
    } catch (error: any) { toast.error('Erro', { description: error.message }); }
    finally { setSaving(false); }
  };

  const addSpacing = async (name: string, label: string, value: string) => {
    setSaving(true);
    try {
      const { data, error } = await supabase.from('design_tokens')
        .insert({ category: 'spacing', name, label, value: { value } }).select().single();
      if (error) throw error;
      setSpacingTokens(prev => [...prev, data]);
      toast.success('Espacamento adicionado!');
      return true;
    } catch (error: any) { toast.error('Erro', { description: error.message }); return false; }
    finally { setSaving(false); }
  };

  // Radius
  const updateRadius = async (id: string, value: string) => {
    setSaving(true);
    try {
      const { error } = await supabase.from('design_tokens').update({ value: { value } }).eq('id', id);
      if (error) throw error;
      setRadiusTokens(prev => prev.map(t => t.id === id ? { ...t, value: { value } } : t));
      toast.success('Border radius atualizado!');
    } catch (error: any) { toast.error('Erro', { description: error.message }); }
    finally { setSaving(false); }
  };

  const addRadius = async (name: string, label: string, value: string) => {
    setSaving(true);
    try {
      const { data, error } = await supabase.from('design_tokens')
        .insert({ category: 'radius', name, label, value: { value } }).select().single();
      if (error) throw error;
      setRadiusTokens(prev => [...prev, data]);
      toast.success('Border radius adicionado!');
      return true;
    } catch (error: any) { toast.error('Erro', { description: error.message }); return false; }
    finally { setSaving(false); }
  };

  // Transition
  const updateTransition = async (id: string, duration: string, easing: string) => {
    setSaving(true);
    try {
      const { error } = await supabase.from('design_tokens').update({ value: { duration, easing } }).eq('id', id);
      if (error) throw error;
      setTransitionTokens(prev => prev.map(t => t.id === id ? { ...t, value: { duration, easing } } : t));
      toast.success('Transicao atualizada!');
    } catch (error: any) { toast.error('Erro', { description: error.message }); }
    finally { setSaving(false); }
  };

  const addTransition = async (name: string, label: string, duration: string, easing: string) => {
    setSaving(true);
    try {
      const { data, error } = await supabase.from('design_tokens')
        .insert({ category: 'transition', name, label, value: { duration, easing } }).select().single();
      if (error) throw error;
      setTransitionTokens(prev => [...prev, data]);
      toast.success('Transicao adicionada!');
      return true;
    } catch (error: any) { toast.error('Erro', { description: error.message }); return false; }
    finally { setSaving(false); }
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading || themeLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--brand-pink, #EA526E)' }} />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <AdminPageLayout
        title="Design System"
        description="Gerencie cores, tipografia, espacamento e tokens do sistema"
        headerActions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddIconModalOpen(true)}
              className="h-9 px-4 rounded-full flex items-center gap-2 text-sm font-medium transition-none"
              style={{
                backgroundColor: 'var(--admin-btn-action-bg, #ffffff)',
                color: 'var(--admin-btn-action-text, #374151)',
                border: '2px solid var(--admin-btn-action-border, #e5e7eb)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--admin-btn-action-hover-bg, #f9fafb)';
                e.currentTarget.style.color = 'var(--admin-btn-action-hover-text, #111827)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--admin-btn-action-bg, #ffffff)';
                e.currentTarget.style.color = 'var(--admin-btn-action-text, #374151)';
              }}
            >
              <Search className="h-4 w-4" />
              Buscar Ícones
            </button>
            <AddTokenMenuButton
              onAddColor={addColorToken}
              onAddTypography={createTypographyToken}
              onAddSpacing={addSpacing}
              onAddRadius={addRadius}
              onAddTransition={addTransition}
              saving={saving}
            />
          </div>
        }
        tabs={[
          {
            value: 'colors',
            label: 'Cores',
            icon: <Palette className="h-4 w-4" />,
            content: <ColorsTab colorTokens={colorTokens} onSave={handleColorSave} />,
          },
          {
            value: 'typography',
            label: 'Tipografia',
            icon: <Type className="h-4 w-4" />,
            content: (
              <TypographyManager
                tokens={typographyTokens}
                onReorder={reorderTypographyTokens}
                onUpdate={updateTypographyToken}
                onCreate={createTypographyToken}
                onDelete={deleteTypographyToken}
                saving={saving}
              />
            ),
          },
          {
            value: 'spacing',
            label: 'Espacamento',
            icon: <Ruler className="h-4 w-4" />,
            content: (
              <>
                <TabSectionHeader icon={<Ruler />} title="Espacamento" subtitle="Configure os valores de espacamento utilizados no site." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {spacingTokens.map((t) => <SpacingTokenCard key={t.id} token={t} onUpdate={updateSpacing} saving={saving} />)}
                </div>
              </>
            ),
          },
          {
            value: 'radius',
            label: 'Bordas',
            icon: <Circle className="h-4 w-4" />,
            content: (
              <>
                <TabSectionHeader icon={<Circle />} title="Border Radius" subtitle="Configure os valores de border radius. Padrao: 2XL (1.5rem)." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {radiusTokens.map((t) => <RadiusTokenCard key={t.id} token={t} onUpdate={updateRadius} saving={saving} />)}
                </div>
              </>
            ),
          },
          {
            value: 'transitions',
            label: 'Transicoes',
            icon: <Sparkles className="h-4 w-4" />,
            content: (
              <>
                <TabSectionHeader icon={<Sparkles />} title="Transicoes" subtitle="Configure as transicoes e animacoes do site." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {transitionTokens.map((t) => <TransitionTokenCard key={t.id} token={t} onUpdate={updateTransition} saving={saving} />)}
                </div>
              </>
            ),
          },
          {
            value: 'icons',
            label: 'Ícones',
            icon: <Shapes className="h-4 w-4" />,
            content: <IconsManagerTab isAddModalOpen={isAddIconModalOpen} setIsAddModalOpen={setIsAddIconModalOpen} />,
          },
          {
            value: 'preview',
            label: 'Preview',
            icon: <Eye className="h-4 w-4" />,
            content: <PreviewTab />,
          },
        ]}
        defaultTab="colors"
      />

      <ConfirmDeleteDialog
        open={!!colorToDelete}
        onConfirm={confirmDeleteColor}
        onCancel={() => setColorToDelete(null)}
        title="Excluir Cor"
        description="Tem certeza que deseja excluir esta cor? Esta acao nao pode ser desfeita."
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD TOKEN MENU BUTTON
// ═══════════════════════════════════════════════════════════════════════════════
function AddTokenMenuButton({
  onAddColor, onAddTypography, onAddSpacing, onAddRadius, onAddTransition, saving,
}: {
  onAddColor: (name: string, label: string, hex: string) => Promise<boolean>;
  onAddTypography: (token: Omit<DesignToken, 'id' | 'created_at'>) => Promise<void>;
  onAddSpacing: (name: string, label: string, value: string) => Promise<boolean>;
  onAddRadius: (name: string, label: string, value: string) => Promise<boolean>;
  onAddTransition: (name: string, label: string, duration: string, easing: string) => Promise<boolean>;
  saving: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setExpanded(false);
    }
    if (expanded) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [expanded]);

  const items = [
    { type: 'color', Icon: Palette, label: 'Cor' },
    { type: 'typography', Icon: Type, label: 'Tipografia' },
    { type: 'spacing', Icon: Ruler, label: 'Espacamento' },
    { type: 'radius', Icon: Circle, label: 'Border Radius' },
    { type: 'transition', Icon: Sparkles, label: 'Transicao' },
  ];

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      {items.map((item, index) => (
        <div
          key={item.type}
          style={{
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'scale(1) translateX(0)' : `scale(0.75) translateX(${(items.length - index) * 16}px)`,
            transition: `opacity 140ms ease ${expanded ? index * 35 : (items.length - 1 - index) * 35}ms, transform 140ms ease ${expanded ? index * 35 : (items.length - 1 - index) * 35}ms`,
            pointerEvents: expanded ? 'auto' : 'none',
          }}
        >
          <button
            title={item.label}
            onClick={() => { setActiveModal(item.type); setExpanded(false); }}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              transition: 'none',
              backgroundColor: 'var(--bg-surface, #FFFFFF)',
              border: '2px solid var(--border-default, #E5E7EB)',
              color: 'var(--text-muted, #6B7280)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--state-hover-neutral, #F3F4F6)';
              e.currentTarget.style.borderColor = 'var(--text-primary, #2E2240)';
              e.currentTarget.style.color = 'var(--text-primary, #2E2240)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface, #FFFFFF)';
              e.currentTarget.style.borderColor = 'var(--border-default, #E5E7EB)';
              e.currentTarget.style.color = 'var(--text-muted, #6B7280)';
            }}
          >
            <item.Icon className="h-4 w-4" />
          </button>
        </div>
      ))}

      <AdminPrimaryButton onClick={() => setExpanded((v) => !v)} style={{ transition: 'none' }}>
        <Plus className="h-4 w-4 mr-2" style={{
          transition: 'transform 200ms ease',
          transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
        }} />
        Adicionar
      </AdminPrimaryButton>

      {/* Modals */}
      <AddTokenModal open={activeModal === 'color'} onClose={() => setActiveModal(null)}
        title="Adicionar Cor" description="Crie um novo token de cor" saving={saving}
        fields={[
          { id: 'name', label: 'Nome (slug)', placeholder: 'ex: brand-blue' },
          { id: 'label', label: 'Label', placeholder: 'ex: Azul da Marca' },
        ]}
        extraContent={(vals, setVals) => (
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex gap-2">
              <input type="color" value={vals.hex ?? '#000000'}
                onChange={(e) => setVals({ ...vals, hex: e.target.value })}
                className="w-14 h-10 p-1 rounded cursor-pointer"
                style={{ border: '2px solid var(--border-default, #E5E7EB)' }}
              />
              <Input value={vals.hex ?? '#000000'}
                onChange={(e) => setVals({ ...vals, hex: e.target.value })}
                placeholder="#000000" className="flex-1 font-mono" />
            </div>
          </div>
        )}
        initialExtra={{ hex: '#000000' }}
        onSave={async (vals) => onAddColor(vals.name, vals.label, vals.hex ?? '#000000')}
      />

      <AddTokenModal open={activeModal === 'typography'} onClose={() => setActiveModal(null)}
        title="Adicionar Tipografia" description="Crie um novo token de tipografia" saving={saving}
        fields={[
          { id: 'name', label: 'Nome (slug)', placeholder: 'ex: heading-1' },
          { id: 'label', label: 'Label', placeholder: 'ex: Heading 1' },
          { id: 'size', label: 'Tamanho', placeholder: 'ex: 2rem' },
          { id: 'weight', label: 'Peso', placeholder: 'ex: 700' },
        ]}
        onSave={async (vals) => {
          await onAddTypography({
            category: 'typography',
            name: (vals.name ?? '').toLowerCase().replace(/\s+/g, '-'),
            label: vals.label ?? '',
            value: { size: vals.size ?? '1rem', weight: Number(vals.weight ?? 400) },
            order: 999,
          } as any);
          return true;
        }}
      />

      <AddTokenModal open={activeModal === 'spacing'} onClose={() => setActiveModal(null)}
        title="Adicionar Espacamento" description="Crie um novo token de espacamento" saving={saving}
        fields={[
          { id: 'name', label: 'Nome (slug)', placeholder: 'ex: section-gap' },
          { id: 'label', label: 'Label', placeholder: 'ex: Gap de Secao' },
          { id: 'value', label: 'Valor', placeholder: 'ex: 1.5rem' },
        ]}
        onSave={async (vals) => onAddSpacing(vals.name, vals.label, vals.value ?? '0px')}
      />

      <AddTokenModal open={activeModal === 'radius'} onClose={() => setActiveModal(null)}
        title="Adicionar Border Radius" description="Crie um novo token de border radius" saving={saving}
        fields={[
          { id: 'name', label: 'Nome (slug)', placeholder: 'ex: card-radius' },
          { id: 'label', label: 'Label', placeholder: 'ex: Radius de Card' },
          { id: 'value', label: 'Valor', placeholder: 'ex: 1.5rem' },
        ]}
        onSave={async (vals) => onAddRadius(vals.name, vals.label, vals.value ?? '0px')}
      />

      <AddTokenModal open={activeModal === 'transition'} onClose={() => setActiveModal(null)}
        title="Adicionar Transicao" description="Crie um novo token de transicao" saving={saving}
        fields={[
          { id: 'name', label: 'Nome (slug)', placeholder: 'ex: hover-fast' },
          { id: 'label', label: 'Label', placeholder: 'ex: Hover Rapido' },
          { id: 'duration', label: 'Duracao', placeholder: 'ex: 150ms' },
          { id: 'easing', label: 'Easing', placeholder: 'ex: ease-in-out' },
        ]}
        onSave={async (vals) => onAddTransition(vals.name, vals.label, vals.duration ?? '150ms', vals.easing ?? 'ease')}
      />
    </div>
  );
}

export default DesignSystemPage;