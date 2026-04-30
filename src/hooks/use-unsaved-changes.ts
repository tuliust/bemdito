/**
 * useUnsavedChanges Hook
 *
 * Detecta mudanças não salvas e previne navegação acidental.
 * Usado no Admin para proteger edições em progresso.
 */

'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface UseUnsavedChangesOptions {
  message?: string;
  when?: boolean;
}

export function useUnsavedChanges(options: UseUnsavedChangesOptions = {}) {
  const {
    message = 'Você tem alterações não salvas. Deseja realmente sair?',
    when = true,
  } = options;

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!when || !hasUnsavedChanges) {
      return;
    }

    // Previne fechamento da aba/navegador
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when, hasUnsavedChanges, message]);

  const setUnsavedChanges = useCallback((value: boolean) => {
    setHasUnsavedChanges(value);
  }, []);

  const confirmNavigation = useCallback(() => {
    if (!hasUnsavedChanges) {
      return true;
    }

    return window.confirm(message);
  }, [hasUnsavedChanges, message]);

  return {
    hasUnsavedChanges,
    setUnsavedChanges,
    confirmNavigation,
  };
}

/**
 * useFormUnsavedChanges Hook
 *
 * Versão especializada para formulários com react-hook-form
 */
export function useFormUnsavedChanges<T extends Record<string, any>>(
  isDirty: boolean,
  options?: UseUnsavedChangesOptions
) {
  return useUnsavedChanges({
    ...options,
    when: isDirty,
  });
}
