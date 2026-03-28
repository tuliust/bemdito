import { vi } from 'vitest';

/**
 * Mock do toast (sonner)
 * 
 * Este mock simula todas as funções de notificação do sonner.
 * Útil para testar que notificações corretas são exibidas.
 * 
 * @example
 * import { mockToast } from '../mocks/sonner';
 * 
 * // No teste:
 * expect(mockToast.success).toHaveBeenCalledWith('Salvo com sucesso!');
 */

export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  loading: vi.fn(),
  promise: vi.fn(),
  custom: vi.fn(),
  message: vi.fn(),
  dismiss: vi.fn(),
};

/**
 * Reset toast mocks
 */
export function resetMockToast() {
  Object.values(mockToast).forEach((fn) => {
    if (typeof fn === 'function' && 'mockClear' in fn) {
      fn.mockClear();
    }
  });
}

/**
 * Helper para verificar mensagens de toast
 */
export function expectToastSuccess(message: string) {
  expect(mockToast.success).toHaveBeenCalledWith(
    expect.stringContaining(message)
  );
}

export function expectToastError(message: string) {
  expect(mockToast.error).toHaveBeenCalledWith(
    expect.stringContaining(message)
  );
}
