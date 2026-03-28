/**
 * AdminDropdownMenu — Camada 2
 *
 * Menu suspenso tokenizado via admin-ui CSS vars.
 * Substitui o uso direto de DropdownMenu nas features do painel admin.
 *
 * Tokens consumidos:
 *   dropdown-bg / dropdown-border
 *   dropdown-item-text-size/weight/color
 *   dropdown-item-icon-size/color
 *   dropdown-item-hover-bg
 *   dropdown-trigger-hover-bg
 *   delete-btn-text / delete-btn-hover-bg (variant="destructive")
 *   action-menu-icon (ícone padrão do trigger)
 *
 * ❌ NUNCA importar dialog.tsx ou alert-dialog.tsx aqui
 * ✅ Usa DropdownMenu de ui/dropdown-menu.tsx (Camada 1)
 */
import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface AdminDropdownAction {
  label: string;
  /** React element cujo style será aplicado via cloneElement */
  icon?: React.ReactElement;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

interface AdminDropdownMenuProps {
  actions: AdminDropdownAction[];
  align?: 'start' | 'center' | 'end';
  /** Substitui o MoreVertical padrão */
  trigger?: React.ReactNode;
}

export function AdminDropdownMenu({
  actions,
  align = 'end',
  trigger,
}: AdminDropdownMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-8 w-8 flex items-center justify-center rounded-md outline-none"
          style={{ transition: 'none' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'var(--admin-dropdown-trigger-hover-bg, #f3f4f6)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'transparent';
          }}
        >
          {trigger ?? (
            <MoreVertical
              className="h-4 w-4"
              style={{ color: 'var(--admin-action-menu-icon, #6b7280)' }}
            />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        style={{
          backgroundColor: 'var(--admin-dropdown-bg,     #ffffff)',
          border:          '1px solid var(--admin-dropdown-border, #e5e7eb)',
          boxShadow:       '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
        }}
      >
        {actions.map((action, i) => {
          const isDestructive = action.variant === 'destructive';

          // Clona o ícone aplicando cor via inline style (override do
          // [&_svg:not([class*='text-'])]:text-muted-foreground do DropdownMenuItem)
          const clonedIcon = action.icon
            ? React.cloneElement(action.icon, {
                style: {
                  color: isDestructive
                    ? 'var(--admin-delete-btn-text,          #dc2626)'
                    : 'var(--admin-dropdown-item-icon-color, #6b7280)',
                  width:      'var(--admin-dropdown-item-icon-size, 1rem)',
                  height:     'var(--admin-dropdown-item-icon-size, 1rem)',
                  flexShrink: 0,
                },
              })
            : null;

          return (
            <DropdownMenuItem
              key={i}
              onClick={action.onClick}
              className="cursor-pointer"
              style={{
                fontSize:        'var(--admin-dropdown-item-text-size,   0.875rem)',
                fontWeight:      'var(--admin-dropdown-item-text-weight, 400)',
                color:           isDestructive
                  ? 'var(--admin-delete-btn-text,           #dc2626)'
                  : 'var(--admin-dropdown-item-text-color,  #374151)',
                backgroundColor: hoveredIndex === i
                  ? (isDestructive
                      ? 'var(--admin-delete-btn-hover-bg,    #fef2f2)'
                      : 'var(--admin-dropdown-item-hover-bg, #f9fafb)')
                  : 'transparent',
                transition: 'none',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {clonedIcon}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
