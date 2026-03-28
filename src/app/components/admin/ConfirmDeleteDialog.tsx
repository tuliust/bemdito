import { ConfirmDialog } from './ConfirmDialog';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

/**
 * ConfirmDeleteDialog — confirmação de exclusão.
 *
 * Wrapper semântico sobre ConfirmDialog com defaults destrutivos:
 * - Título padrão: "Confirmar exclusão"
 * - Descrição automática via `itemName` quando `description` não é fornecida
 * - Botão confirmar: vermelho ("Excluir")
 *
 * Uso:
 * ```tsx
 * <ConfirmDeleteDialog
 *   open={open}
 *   onConfirm={() => handleDelete(id)}
 *   onCancel={() => setOpen(false)}
 *   itemName="esta página"
 * />
 * ```
 */
export function ConfirmDeleteDialog({
  open,
  onConfirm,
  onCancel,
  title = 'Confirmar exclusão',
  description,
  itemName = 'este item',
}: ConfirmDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title={title}
      description={description ?? `Tem certeza que deseja excluir ${itemName}? Esta ação não pode ser desfeita.`}
      confirmLabel="Excluir"
      cancelLabel="Cancelar"
      confirmVariant="destructive"
    />
  );
}
