/**
 * AdminPrimaryButton
 * ------------------
 * Botão CTA primário do painel admin completamente tokenizado.
 *
 * Tokens usados (categoria admin-ui):
 *   --admin-btn-primary-bg       → fundo normal
 *   --admin-btn-primary-text     → cor do texto e ícones
 *   --admin-btn-primary-hover-bg → fundo no hover
 *
 * Estes tokens são configuráveis em /admin/design-system.
 *
 * Regra de uso:
 *   ✅ SEMPRE usar AdminPrimaryButton no lugar de <Button className="bg-primary ...">
 *   ❌ NUNCA usar className="bg-primary hover:bg-primary/90" em botões do painel
 */
import React, { useState } from 'react';
import { Button } from '../ui/button';

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

export function AdminPrimaryButton({
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  disabled,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Button
      {...props}
      disabled={disabled}
      style={{
        // Quando desabilitado, não sobrescreve o estilo do Button (opacity-50 etc.)
        ...(disabled
          ? {}
          : {
              backgroundColor: hovered
                ? 'var(--admin-btn-primary-hover-bg, #d44960)'
                : 'var(--admin-btn-primary-bg,       #ea526e)',
              color: 'var(--admin-btn-primary-text, #ffffff)',
            }),
        transition: 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
    >
      {children}
    </Button>
  );
}