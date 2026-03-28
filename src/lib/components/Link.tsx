/**
 * Link Component
 * 
 * Wrapper around React Router Link that automatically detects
 * internal vs external links and applies correct navigation.
 * 
 * Usage: Replace all <Link> with <Link to={...}>
 */

import { useNavigate } from 'react-router';
import type { ReactNode, MouseEvent, AnchorHTMLAttributes } from 'react';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  replace?: boolean;
  state?: any;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Componente Link customizado que usa useNavigate do react-router-dom
 * Funciona como Link do react-router-dom mas usando apenas react-router-dom
 */
export function Link({
  to,
  replace = false,
  state,
  children,
  className,
  style,
  onClick,
  ...rest
}: LinkProps) {
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Chamar onClick customizado se fornecido
    if (onClick) {
      onClick(event);
    }

    // Prevenir comportamento padrão apenas se não for link externo
    // e não tiver modificadores (ctrl, shift, meta)
    const isExternal = to.startsWith('http://') || to.startsWith('https://') || to.startsWith('//');
    const isModifiedEvent = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
    const isDefaultPrevented = event.defaultPrevented;

    if (!isExternal && !isModifiedEvent && !isDefaultPrevented && event.button === 0) {
      event.preventDefault();
      navigate(to, { replace, state });
    }
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </a>
  );
}

export default Link;