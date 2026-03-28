import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'default' | 'destructive' | 'primary';
}

/**
 * ConfirmDialog - Dialog genérico de confirmação
 * 
 * Componente flexível para qualquer tipo de confirmação.
 * Use componentes específicos (UnsavedChangesDialog, ConfirmDeleteDialog) quando possível.
 * 
 * Uso:
 * ```tsx
 * <ConfirmDialog
 *   open={open}
 *   onConfirm={handleAction}
 *   onCancel={() => setOpen(false)}
 *   title="Publicar página?"
 *   description="Esta página ficará visível para todos os usuários."
 *   confirmLabel="Publicar"
 *   cancelLabel="Cancelar"
 *   confirmVariant="primary"
 * />
 * ```
 */
export function ConfirmDialog({ 
  open, 
  onConfirm, 
  onCancel,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'default',
}: ConfirmDialogProps) {
  // Estilos tokenizados via CSS vars — apenas a variante "primary" usa tokens do DS admin
  const variantStyles: Record<string, React.CSSProperties> = {
    default:     {},
    destructive: { backgroundColor: '#dc2626', color: '#ffffff', transition: 'none' },
    primary:     {
      backgroundColor: 'var(--admin-btn-primary-bg,  #ea526e)',
      color:           'var(--admin-btn-primary-text, #ffffff)',
      transition:      'none',
    },
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-[1.5rem]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            style={variantStyles[confirmVariant]}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
