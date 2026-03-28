import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface AlertMessageDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  /** Rótulo do botão de confirmação. Padrão: "OK" */
  actionLabel?: string;
}

/**
 * AlertMessageDialog — substituto para o `alert()` nativo do navegador.
 *
 * Exibe uma mensagem informativa com um único botão de confirmação (OK).
 * Seguindo o mesmo padrão visual de ConfirmDeleteDialog e UnsavedChangesDialog.
 *
 * Uso:
 * ```tsx
 * const [alertMsg, setAlertMsg] = useState<{ title?: string; message: string } | null>(null);
 *
 * // Para exibir:
 * setAlertMsg({ message: 'O campo "Label" é obrigatório.' });
 * setAlertMsg({ title: 'Atenção', message: 'Mensagem...' });
 *
 * // No JSX:
 * <AlertMessageDialog
 *   open={!!alertMsg}
 *   message={alertMsg?.message ?? ''}
 *   title={alertMsg?.title}
 *   onClose={() => setAlertMsg(null)}
 * />
 * ```
 */
export function AlertMessageDialog({
  open,
  onClose,
  title = 'Atenção',
  message,
  actionLabel = 'OK',
}: AlertMessageDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-[1.5rem] max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onClose}
            className="min-w-[80px]"
            style={{
              backgroundColor: 'var(--admin-btn-primary-bg,  #ea526e)',
              color:           'var(--admin-btn-primary-text, #ffffff)',
              transition:      'none',
            }}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
