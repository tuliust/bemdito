import React from 'react';
import { adminVar } from './AdminThemeProvider';

interface TabSectionHeaderProps {
  /** Ícone Lucide — será estilizado automaticamente com os tokens section-header-icon */
  icon: React.ReactElement;
  title: string;
  /** Subtítulo descritivo da aba — estilizado via token section-subheader */
  subtitle?: string;
}

/**
 * Cabeçalho padrão de aba do painel admin.
 * Aplica automaticamente os tokens:
 *   section-header       → tamanho/peso/cor do h3
 *   section-header-icon  → tamanho/cor do ícone
 *   section-subheader    → tamanho/peso/cor do subtítulo
 */
export function TabSectionHeader({ icon, title, subtitle }: TabSectionHeaderProps) {
  const styledIcon = React.cloneElement(icon, {
    className: undefined,
    style: {
      width:     adminVar('section-header-icon', 'size'),
      height:    adminVar('section-header-icon', 'size'),
      color:     adminVar('section-header-icon', 'color'),
      flexShrink: 0,
    },
  } as React.HTMLAttributes<SVGElement>);

  return (
    <div>
      <h3
        className="flex items-center gap-2"
        style={{
          fontSize:   adminVar('section-header', 'size'),
          fontWeight: adminVar('section-header', 'weight'),
          color:      adminVar('section-header', 'color'),
        }}
      >
        {styledIcon}
        {title}
      </h3>
      {subtitle && (
        <p
          style={{
            fontSize:   adminVar('section-subheader', 'size'),
            fontWeight: adminVar('section-subheader', 'weight'),
            color:      adminVar('section-subheader', 'color'),
            marginTop:  '0.125rem',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}