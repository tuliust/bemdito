import React, { useState } from 'react';
import { Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '../ui/button';

interface AdminActionButtonsProps {
  /** Callback para ação de edição. Omita para ocultar o botão. */
  onEdit?: () => void;
  /** Callback para ação de exclusão. Omita para ocultar o botão. */
  onDelete?: () => void;
  /** Callback para ação de duplicação. Omita para ocultar o botão. */
  onDuplicate?: () => void;
  /** Label do botão de edição (padrão: 'Editar') */
  editLabel?: string;
  /** Label do botão de exclusão (padrão: 'Excluir') */
  deleteLabel?: string;
  /** Label do botão de duplicação (padrão: 'Duplicar') */
  duplicateLabel?: string;
  /** Classes extras para o container */
  className?: string;
}

/**
 * Conjunto padronizado de botões de ação inline em linhas de lista.
 *
 * Ordem fixa: [Editar] [Duplicar] [Excluir]
 * Ícones fixos: Edit · Copy · Trash2
 *
 * Cores tokenizadas via CSS vars:
 *   Editar/Duplicar → --admin-btn-action-*
 *   Excluir         → --admin-delete-btn-*
 *
 * @example
 * <AdminActionButtons
 *   onEdit={() => handleEdit(item)}
 *   onDelete={() => handleDelete(item)}
 *   onDuplicate={() => handleDuplicate(item)}
 * />
 *
 * // Apenas editar + excluir
 * <AdminActionButtons onEdit={handleEdit} onDelete={handleDelete} />
 */
export function AdminActionButtons({
  onEdit,
  onDelete,
  onDuplicate,
  editLabel = 'Editar',
  deleteLabel = 'Excluir',
  duplicateLabel = 'Duplicar',
  className = '',
}: AdminActionButtonsProps) {
  const [editHovered,      setEditHovered]      = useState(false);
  const [duplicateHovered, setDuplicateHovered] = useState(false);
  const [deleteHovered,    setDeleteHovered]    = useState(false);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* ── Editar ── */}
      {onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          style={{
            transition:      'none',
            backgroundColor: editHovered
              ? 'var(--admin-btn-action-hover-bg,   #f9fafb)'
              : 'var(--admin-btn-action-bg,         #ffffff)',
            color: editHovered
              ? 'var(--admin-btn-action-hover-text, #111827)'
              : 'var(--admin-btn-action-text,       #374151)',
            borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
          }}
          onMouseEnter={() => setEditHovered(true)}
          onMouseLeave={() => setEditHovered(false)}
        >
          <Edit
            className="h-4 w-4 mr-1"
            style={{ color: 'inherit' }}
          />
          {editLabel}
        </Button>
      )}

      {/* ── Duplicar ── */}
      {onDuplicate && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDuplicate}
          style={{
            transition:      'none',
            backgroundColor: duplicateHovered
              ? 'var(--admin-btn-action-hover-bg,   #f9fafb)'
              : 'var(--admin-btn-action-bg,         #ffffff)',
            color: duplicateHovered
              ? 'var(--admin-btn-action-hover-text, #111827)'
              : 'var(--admin-btn-action-text,       #374151)',
            borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
          }}
          onMouseEnter={() => setDuplicateHovered(true)}
          onMouseLeave={() => setDuplicateHovered(false)}
        >
          <Copy
            className="h-4 w-4 mr-1"
            style={{ color: 'inherit' }}
          />
          {duplicateLabel}
        </Button>
      )}

      {/* ── Excluir (tokens próprios: delete-btn-*) ── */}
      {onDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          style={{
            transition:      'none',
            color:           deleteHovered
              ? 'var(--admin-delete-btn-hover-text,  #b91c1c)'
              : 'var(--admin-delete-btn-text,        #dc2626)',
            backgroundColor: deleteHovered
              ? 'var(--admin-delete-btn-hover-bg,    #fef2f2)'
              : 'var(--admin-delete-btn-bg,          transparent)',
            borderColor:     deleteHovered
              ? 'var(--admin-delete-btn-hover-border,#fca5a5)'
              : 'var(--admin-delete-btn-border,      #e5e7eb)',
          }}
          onMouseEnter={() => setDeleteHovered(true)}
          onMouseLeave={() => setDeleteHovered(false)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {deleteLabel}
        </Button>
      )}
    </div>
  );
}