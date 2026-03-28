import { useEffect, useState, useCallback } from 'react';

/**
 * Hook para proteger contra perda de alterações não salvas
 * 
 * IMPORTANTE: Use em conjunto com UnsavedChangesDialog
 * 
 * Uso:
 * ```tsx
 * import { UnsavedChangesDialog } from '@/app/components/admin/UnsavedChangesDialog';
 * 
 * function MyModal() {
 *   const { 
 *     hasUnsavedChanges, 
 *     setUnsavedChanges, 
 *     confirmDialogOpen,
 *     handleConfirmDiscard,
 *     handleCancelDiscard,
 *     requestDiscard,
 *   } = useUnsavedChangesGuard();
 * 
 *   const handleClose = async () => {
 *     const canClose = await requestDiscard();
 *     if (canClose) {
 *       onClose();
 *     }
 *   };
 * 
 *   return (
 *     <>
 *       <Modal onClose={handleClose}>
 *         <input onChange={() => setUnsavedChanges(true)} />
 *       </Modal>
 *       
 *       <UnsavedChangesDialog
 *         open={confirmDialogOpen}
 *         onConfirm={handleConfirmDiscard}
 *         onCancel={handleCancelDiscard}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function useUnsavedChangesGuard() {
  const [hasUnsavedChanges, setHasUnsavedChangesState] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  // Wrapper estável para setHasUnsavedChanges
  const setUnsavedChanges = useCallback((value: boolean) => {
    setHasUnsavedChangesState(value);
  }, []);

  // Aviso ao fechar aba/janela do navegador
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  /**
   * Solicita confirmação para descartar alterações
   * Retorna Promise que resolve para true se confirmado, false se cancelado
   */
  const requestDiscard = useCallback((): Promise<boolean> => {
    if (!hasUnsavedChanges) {
      return Promise.resolve(true);
    }

    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
      setConfirmDialogOpen(true);
    });
  }, [hasUnsavedChanges]);

  /**
   * Usuário confirmou descarte (botão "Sair sem salvar")
   */
  const handleConfirmDiscard = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setConfirmDialogOpen(false);
    setHasUnsavedChangesState(false);
  }, [resolvePromise]);

  /**
   * Usuário cancelou descarte (botão "Continuar editando")
   */
  const handleCancelDiscard = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    setConfirmDialogOpen(false);
  }, [resolvePromise]);

  /**
   * Marca como salvo (limpa o estado de unsaved changes)
   */
  const markAsSaved = useCallback(() => {
    setHasUnsavedChangesState(false);
  }, []);

  /**
   * @deprecated Use requestDiscard() ao invés. Este método está mantido para compatibilidade.
   */
  const confirmDiscard = useCallback((): Promise<boolean> => {
    console.warn('useUnsavedChangesGuard: confirmDiscard() está deprecated. Use requestDiscard() ao invés.');
    return requestDiscard();
  }, [requestDiscard]);

  return {
    hasUnsavedChanges,
    setUnsavedChanges,
    markAsSaved,
    
    // API nova (recomendada)
    confirmDialogOpen,
    handleConfirmDiscard,
    handleCancelDiscard,
    requestDiscard,
    
    // API antiga (deprecated, mantida para compatibilidade)
    confirmDiscard,
  };
}
