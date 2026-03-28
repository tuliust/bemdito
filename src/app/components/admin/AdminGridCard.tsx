import React from 'react';
import { adminVar } from './AdminThemeProvider';

interface AdminGridCardProps {
  /** Conteúdo da área de preview (bg-black aspect-video) */
  preview: React.ReactNode;
  /** Badge sobreposto ao preview (ex: "Publicado") */
  badge?: React.ReactNode;
  /** Nome principal do card — aceita string ou ReactNode (inline edit) */
  name: React.ReactNode;
  /** Meta-informação abaixo do nome (tipo, variante, contagens, etc.) */
  meta?: React.ReactNode;
  /** Botões de acção (DropdownMenu, AdminActionButtons, etc.) */
  actions: React.ReactNode;
}

/**
 * AdminGridCard — card de grelha visual para páginas de biblioteca.
 *
 * Usado em:
 * - sections-manager/page.tsx (seções)
 * - cards-manager/page.tsx (templates de cards)
 *
 * Estrutura garantida:
 * - bg-white · border-2 border-gray-200 · rounded-xl · overflow-hidden · transition:none
 * - Área de preview: bg-black · aspect-video
 * - Área de info: p-3 · flex · justify-between
 *
 * @example
 * <AdminGridCard
 *   preview={<Layout className="h-12 w-12 text-white opacity-50" />}
 *   badge={section.published && <span className="...">Publicado</span>}
 *   name={section.name}
 *   meta={<p className="text-xs text-gray-500 mt-0.5">Hero</p>}
 *   actions={<DropdownMenu>...</DropdownMenu>}
 * />
 */
export function AdminGridCard({
  preview,
  badge,
  name,
  meta,
  actions,
}: AdminGridCardProps) {
  return (
    <div
      className="overflow-hidden border-2"
      style={{
        transition:      'none',
        backgroundColor: 'var(--admin-card-bg,     #ffffff)',
        borderColor:     'var(--admin-card-border,  #e5e7eb)',
        borderRadius:    'var(--admin-card-radius,  0.75rem)',
      }}
    >
      {/* Preview Area */}
      <div
        className="aspect-video flex items-center justify-center relative"
        style={{ backgroundColor: 'var(--admin-sidebar-bg, #2e2240)' }}
      >
        {preview}
        {badge && (
          <div className="absolute top-2 right-2">
            {badge}
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-3 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4
            className="truncate"
            style={{
              fontSize:   adminVar('item-title-list', 'size'),
              fontWeight: adminVar('item-title-list', 'weight'),
              color:      adminVar('item-title-list', 'color'),
            }}
          >
            {name}
          </h4>
          {meta && <div className="mt-0.5">{meta}</div>}
        </div>
        <div className="flex-shrink-0">
          {actions}
        </div>
      </div>
    </div>
  );
}