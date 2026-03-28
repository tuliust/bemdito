import { ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { AdminPrimaryButton } from './AdminPrimaryButton';

interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string | ReactNode;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Botões extras renderizados entre Cancelar e Salvar no footer padrão (ex: "Salvar como") */
  extraFooterActions?: ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  saving?: boolean;
  hasUnsavedChanges?: boolean;
  size?: 'default' | 'large' | 'full';
}

/**
 * BaseModal - Modal padrão do projeto
 *
 * Características:
 * - border-radius: 2xl obrigatório
 * - Botão X no canto superior direito
 * - Fecha ao clicar fora (overlay)
 * - Fecha com tecla ESC
 * - Footer de ações (salvar/cancelar) quando aplicável
 * - Proteção automática contra perda de alterações via prop hasUnsavedChanges:
 *   quando hasUnsavedChanges=true, qualquer tentativa de fechar (X, ESC, overlay,
 *   botão Cancelar) exibe UnsavedChangesDialog antes de fechar.
 *
 * API: use sempre `open` + `onOpenChange` (padrão Dialog do shadcn/ui).
 */
export function BaseModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  extraFooterActions,
  onSave,
  onCancel,
  saveLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  saving = false,
  hasUnsavedChanges = false,
  size = 'default',
}: BaseModalProps) {
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);

  /** Executa o fechamento real do modal */
  const doClose = () => onOpenChange(false);

  /**
   * Tenta fechar o modal. Se há alterações não salvas, exibe o diálogo de
   * confirmação antes de fechar. Caso contrário, fecha imediatamente.
   */
  const attemptClose = () => {
    if (hasUnsavedChanges) {
      setUnsavedDialogOpen(true);
    } else {
      doClose();
    }
  };

  /** Intercepta mudanças de estado do Dialog (overlay click, X button) */
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      attemptClose();
    } else {
      onOpenChange(true);
    }
  };

  /** Botão Cancelar no footer */
  const handleCancel = () => {
    if (onCancel && !hasUnsavedChanges) {
      onCancel();
    } else {
      attemptClose();
    }
  };

  /** Usuário confirmou "Sair sem salvar" */
  const handleConfirmDiscard = () => {
    setUnsavedDialogOpen(false);
    if (onCancel) {
      onCancel();
    } else {
      doClose();
    }
  };

  /** Usuário cancelou ("Continuar editando") */
  const handleCancelDiscard = () => {
    setUnsavedDialogOpen(false);
  };

  const sizeClasses = {
    default: 'sm:max-w-[1000px]',
    large: 'sm:max-w-[1300px]',
    full: 'sm:max-w-[95vw]',
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className={`${sizeClasses[size]} rounded-[1.5rem] p-0 gap-0`}
          style={{
            backgroundColor: 'var(--admin-modal-bg, #ffffff)',
            borderColor:     'var(--admin-modal-border, #e5e7eb)',
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            attemptClose();
          }}
          onFocusOutside={(e) => {
            // Prevent focus shifts (native file picker, toast, etc.) from dismissing
            e.preventDefault();
          }}
        >
          {/* Header com título */}
          <DialogHeader className="p-6 pb-4">
            <DialogTitle
              style={{
                fontSize:   'var(--admin-modal-title-size,   1.5rem)',
                fontWeight: 'var(--admin-modal-title-weight, 600)',
                color:      'var(--admin-modal-title-color,  #111827)',
              }}
            >
              {title}
            </DialogTitle>
            {description ? (
              <DialogDescription className="pt-2">{description}</DialogDescription>
            ) : (
              <DialogDescription className="sr-only">
                {typeof title === 'string' ? title : 'Modal dialog'}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {(footer || onSave || onCancel || extraFooterActions) && (
            <DialogFooter
              className="px-6 py-4 rounded-b-[1.5rem]"
              style={{
                borderTop:       '1px solid var(--admin-modal-footer-border, #e5e7eb)',
                backgroundColor: 'var(--admin-modal-footer-bg, #f9fafb)',
              }}
            >
              {footer ? (
                footer
              ) : (
                <div className="flex justify-between items-center w-full">
                  {onCancel ? (
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: 'var(--admin-btn-cancel-bg, #ffffff)',
                        border:          '1px solid var(--admin-btn-cancel-border, #e5e7eb)',
                        color:           'var(--admin-btn-cancel-text, #374151)',
                        transition:      'none',
                        cursor:          saving ? 'not-allowed' : 'pointer',
                        opacity:         saving ? 0.5 : 1,
                      }}
                    >
                      {cancelLabel}
                    </button>
                  ) : <span />}
                  <div className="flex gap-3 items-center">
                    {extraFooterActions}
                    {onSave && (
                      <AdminPrimaryButton onClick={onSave} disabled={saving}>
                        {saving ? 'Salvando...' : saveLabel}
                      </AdminPrimaryButton>
                    )}
                  </div>
                </div>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de alterações não salvas — gerenciado pelo BaseModal */}
      <UnsavedChangesDialog
        open={unsavedDialogOpen}
        onConfirm={handleConfirmDiscard}
        onCancel={handleCancelDiscard}
      />
    </>
  );
}