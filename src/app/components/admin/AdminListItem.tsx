import React from 'react';

interface AdminListItemProps {
  children: React.ReactNode;
  /**
   * Classes extras adicionadas ao container.
   * Use para padding (p-4 / p-6) e variações de layout (flex items-center gap-4).
   *
   * @example
   * // Lista simples com padding padrão
   * <AdminListItem className="p-4 flex items-center gap-4">...</AdminListItem>
   *
   * // Lista com padding maior e layout topo–início
   * <AdminListItem className="p-6">
   *   <div className="flex items-start justify-between">...</div>
   * </AdminListItem>
   */
  className?: string;
}

/**
 * Container padrão de linha de lista no admin.
 *
 * Garante: bg-white · border-2 border-gray-200 · rounded-xl · transition:none
 *
 * @example
 * <AdminListItem className="p-4 flex items-center gap-4">
 *   <div className="flex-1">
 *     <p className="font-semibold text-gray-900">Nome do item</p>
 *   </div>
 *   <AdminActionButtons onEdit={handleEdit} onDelete={handleDelete} />
 * </AdminListItem>
 */
export function AdminListItem({ children, className = '' }: AdminListItemProps) {
  return (
    <div
      className={`border-2 ${className}`}
      style={{
        transition:      'none',
        backgroundColor: 'var(--admin-card-bg,     #ffffff)',
        borderColor:     'var(--admin-card-border,  #e5e7eb)',
        borderRadius:    'var(--admin-card-radius,  0.75rem)',
      }}
    >
      {children}
    </div>
  );
}