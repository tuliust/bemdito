import { useState, useCallback } from 'react';

/**
 * Hook genérico para gerenciar diálogos de confirmação
 * 
 * Retorna um Promise que resolve quando o usuário confirma ou cancela.
 * 
 * Uso:
 * ```tsx
 * const { isOpen, confirm, DialogComponent } = useConfirmDialog();
 * 
 * async function handleDelete() {
 *   const confirmed = await confirm();
 *   if (confirmed) {
 *     // Executar ação
 *   }
 * }
 * 
 * return (
 *   <>
 *     <button onClick={handleDelete}>Excluir</button>
 *     <DialogComponent
 *       title="Confirmar exclusão"
 *       description="Tem certeza?"
 *     />
 *   </>
 * );
 * ```
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  /**
   * Abre o diálogo e retorna uma Promise que resolve para true/false
   */
  const confirm = useCallback((): Promise<boolean> => {
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  /**
   * Confirma e fecha o diálogo
   */
  const handleConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setIsOpen(false);
  }, [resolvePromise]);

  /**
   * Cancela e fecha o diálogo
   */
  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    setIsOpen(false);
  }, [resolvePromise]);

  return {
    isOpen,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
