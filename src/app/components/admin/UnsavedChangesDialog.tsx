import { ConfirmDialog } from './ConfirmDialog';

interface UnsavedChangesDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * UnsavedChangesDialog — aviso de alterações não salvas.
 *
 * Wrapper semântico sobre ConfirmDialog com texto e comportamento fixos.
 * Usado exclusivamente pelo BaseModal via prop `hasUnsavedChanges`.
 * Não renderizar manualmente dentro de BaseModal — causaria double-dialog.
 *
 * Ações:
 * - "Continuar editando" → fecha o diálogo, mantém o modal aberto
 * - "Sair sem salvar"   → descarta alterações e fecha
 */
export function UnsavedChangesDialog({ open, onConfirm, onCancel }: UnsavedChangesDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title="Alterações não salvas"
      description="Você tem alterações não salvas. Deseja sair sem salvar?"
      confirmLabel="Sair sem salvar"
      cancelLabel="Continuar editando"
      confirmVariant="destructive"
    />
  );
}
