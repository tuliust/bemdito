import React, { useState } from 'react';
import { X, ChevronDown, GripVertical } from 'lucide-react';
import { adminVar } from '../../components/admin/AdminThemeProvider';
import { Input } from '../../components/ui/input';

interface EditableCardBaseProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove?: () => void;
  isDraggable?: boolean;
  dragHandleProps?: any;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  onTitleChange?: (title: string) => void;  // ✅ NOVO: edição inline do título
  onSubtitleChange?: (subtitle: string) => void;  // ✅ NOVO: edição inline do subtítulo
  onIconClick?: () => void;  // ✅ NOVO: click no ícone
  titleStyle?: React.CSSProperties;  // ✅ NOVO: estilo customizado do título
  subtitleStyle?: React.CSSProperties;  // ✅ NOVO: estilo customizado do subtítulo
}

/**
 * Componente base para cards editáveis no painel admin
 * 
 * Características:
 * - Header com ícone, título e subtítulo sempre visíveis
 * - Botões de drag (opcional), remover e expandir
 * - Conteúdo colapsável
 * - Layout padronizado
 * - ✅ NOVO: Título editável inline
 * - ✅ NOVO: Subtítulo editável inline
 * - ✅ NOVO: Ícone clicável (para abrir popover)
 * 
 * Usado em:
 * - Megamenu Cards (drag-and-drop)
 * - Megamenu Geral (campos de configuração)
 * - Menu Items (edição inline)
 */
export function EditableCardBase({
  title,
  subtitle,
  icon,
  iconColor = '#6b7280',
  isExpanded,
  onToggleExpand,
  onRemove,
  isDraggable = false,
  dragHandleProps,
  children,
  headerContent,
  onTitleChange,
  onSubtitleChange,
  onIconClick,
  titleStyle,
  subtitleStyle,
}: EditableCardBaseProps) {
  return (
    <div
      className="p-4 rounded-lg transition-all"
      style={{
        backgroundColor: 'var(--admin-list-item-bg, #ffffff)',
        border: '2px solid var(--admin-list-item-border, #e5e7eb)',
      }}
      {...(isDraggable ? dragHandleProps : {})}
    >
      {/* Header - sempre visível */}
      <div className="relative pb-4">
        {/* Linha superior: Ícone Drag (opcional) + Botão X (opcional) */}
        {(isDraggable || onRemove) && (
          <div className="flex justify-between items-start mb-3">
            {/* Ícone de Drag (se draggable) */}
            {isDraggable && (
              <div
                className="cursor-grab active:cursor-grabbing"
                style={{ color: 'var(--admin-icon-action, #9ca3af)' }}
              >
                <GripVertical className="h-4 w-4" />
              </div>
            )}

            {/* Espaçador se não tem drag mas tem remove */}
            {!isDraggable && onRemove && <div />}

            {/* Botão Remover (X) */}
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 rounded-lg"
                style={{
                  transition: 'none',
                  color: 'var(--admin-delete-btn-text, #dc2626)',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.color = 'var(--admin-delete-btn-hover-text, #b91c1c)';
                  el.style.backgroundColor = 'var(--admin-delete-btn-hover-bg, #fef2f2)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.color = 'var(--admin-delete-btn-text, #dc2626)';
                  el.style.backgroundColor = 'transparent';
                }}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Conteúdo centralizado: Ícone + Título + Subtítulo (vertical) */}
        <div className="flex flex-col items-center gap-2">
          {/* Ícone (se fornecido) - ✅ NOVO: clicável se onIconClick fornecido */}
          {icon && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // ✅ Impede event bubbling
                if (onIconClick) {
                  onIconClick();
                }
              }}
              disabled={!onIconClick}
              className={onIconClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
              style={{ color: iconColor }}
            >
              {icon}
            </button>
          )}
          
          {/* Título - ✅ NOVO: editável inline se onTitleChange fornecido */}
          {onTitleChange ? (
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Digite o título"
              className="text-center max-w-md font-semibold"
              style={{
                fontSize: titleStyle?.fontSize || '1.125rem',
                fontWeight: titleStyle?.fontWeight || 600,
                color: titleStyle?.color || adminVar('list-item-title', 'color'),
                border: 'none',
                backgroundColor: '#f3f4f6',
                padding: '0.25rem 0.5rem',
                ...titleStyle,
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.border = '1px solid var(--admin-field-border, #e5e7eb)';
                e.target.style.borderRadius = '0.375rem';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.border = 'none';
              }}
            />
          ) : (
            <div
              className="text-center max-w-md font-semibold"
              style={{
                fontSize: titleStyle?.fontSize || '1.125rem',
                fontWeight: titleStyle?.fontWeight || 600,
                color: titleStyle?.color || adminVar('list-item-title', 'color'),
                ...titleStyle,
              }}
            >
              {title}
            </div>
          )}
          
          {/* Subtítulo (se fornecido) - ✅ NOVO: editável inline se onSubtitleChange fornecido */}
          {onSubtitleChange ? (
            <Input
              value={subtitle || ''}
              onChange={(e) => onSubtitleChange(e.target.value)}
              placeholder="Digite o subtítulo"
              className="text-center w-full min-h-[3rem] py-2"
              style={{
                fontSize: subtitleStyle?.fontSize || adminVar('list-item-meta', 'size'),
                fontWeight: subtitleStyle?.fontWeight || adminVar('list-item-meta', 'weight'),
                color: subtitleStyle?.color || adminVar('list-item-meta', 'color'),
                border: 'none',
                backgroundColor: '#f3f4f6',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                ...subtitleStyle,
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.border = '1px solid var(--admin-field-border, #e5e7eb)';
                e.target.style.borderRadius = '0.375rem';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.border = 'none';
              }}
            />
          ) : (
            <div
              className="text-center max-w-md"
              style={{
                fontSize: subtitleStyle?.fontSize || adminVar('list-item-meta', 'size'),
                fontWeight: subtitleStyle?.fontWeight || adminVar('list-item-meta', 'weight'),
                color: subtitleStyle?.color || adminVar('list-item-meta', 'color'),
                ...subtitleStyle,
              }}
            >
              {subtitle}
            </div>
          )}

          {/* Conteúdo extra no header (se fornecido) */}
          {headerContent}
        </div>

        {/* Botão Expandir/Recolher - Canto inferior direito */}
        <button
          type="button"
          onClick={onToggleExpand}
          className="absolute bottom-0 right-0 p-1 rounded transition-colors"
          style={{
            color: 'var(--admin-icon-action, #6b7280)',
          }}
        >
          <ChevronDown
            className="h-6 w-6"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease-in-out',
            }}
          />
        </button>
      </div>

      {/* Conteúdo colapsável */}
      {isExpanded && (
        <div
          className="pt-4 space-y-4"
          style={{
            borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}