import { useState, useRef, useCallback } from 'react';

/**
 * Gerencia o estado de hover de itens de menu com grace-period configurável.
 *
 * Resolve o problema de megamenus que fecham prematuramente quando o mouse
 * cruza o espaço entre o item de menu e o painel do megamenu.
 *
 * API:
 * - `openItem(id)`      → abre imediatamente, cancela timer pendente
 * - `scheduleClose(id)` → inicia timer; só fecha se `id` ainda for o item ativo
 * - `clearTimer()`      → cancela timer sem fechar (usar no onMouseEnter do megamenu)
 * - `closeImmediate()`  → fecha sem esperar (usar em mobile / ao clicar fora)
 *
 * @param timeoutMs Grace period antes de fechar (padrão: 1000 ms)
 *
 * @example
 * const { hoveredItem, openItem, scheduleClose, clearTimer } = useMenuHover(1000);
 *
 * // Item de menu:
 * onMouseEnter={() => openItem(item.id)}
 * onMouseLeave={() => scheduleClose(item.id)}
 *
 * // Container do megamenu:
 * onMouseEnter={clearTimer}
 * onMouseLeave={() => scheduleClose(item.id)}
 *
 * // Botão do item (cancelar timer ao entrar):
 * onMouseEnter={(e) => { e.currentTarget.style.color = primary; clearTimer(); }}
 */
export function useMenuHover(timeoutMs = 1000) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /** Abre o item imediatamente e cancela qualquer timer pendente */
  const openItem = useCallback(
    (itemId: string) => {
      clearTimer();
      setHoveredItem(itemId);
    },
    [clearTimer]
  );

  /**
   * Inicia timer para fechar após `timeoutMs`.
   * Se o usuário já passou para outro item, não fecha (closure sobre itemId).
   */
  const scheduleClose = useCallback(
    (itemId: string) => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        setHoveredItem((prev) => (prev === itemId ? null : prev));
      }, timeoutMs);
    },
    [clearTimer, timeoutMs]
  );

  /** Fecha imediatamente sem timer (uso em mobile / ao clicar fora) */
  const closeImmediate = useCallback(() => {
    clearTimer();
    setHoveredItem(null);
  }, [clearTimer]);

  return { hoveredItem, openItem, scheduleClose, closeImmediate, clearTimer };
}
