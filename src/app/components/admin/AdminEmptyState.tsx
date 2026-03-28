import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { adminVar } from './AdminThemeProvider';

interface AdminEmptyStateCTA {
  label: string;
  onClick: () => void;
  /** Ícone opcional. Se omitido usa <Plus> */
  icon?: React.ReactNode;
}

interface AdminEmptyStateProps {
  /**
   * Título em destaque (Nível 1 grid).
   * Se omitido, `message` assume o papel de título.
   */
  title?: string;
  /**
   * Descrição/subtítulo (Nível 3). Aparece abaixo de `title`.
   * @deprecated Use `title` + `description` em vez de apenas `message`.
   */
  message?: string;
  /** Descrição secundária — use com `title` */
  description?: string;
  /** Botão de ação principal (opcional) */
  cta?: AdminEmptyStateCTA | React.ReactNode;
  /** Classes extras para o container */
  className?: string;
}

/**
 * Estado vazio padronizado do admin.
 *
 * Tipografia controlada por tokens admin-ui:
 * - title       → item-title-grid
 * - description → item-description
 *
 * @example
 * <AdminEmptyState
 *   title="Nenhuma página criada"
 *   description="Clique em 'Nova Página' para começar."
 *   cta={{ label: 'Nova Página', onClick: handleCreate }}
 * />
 *
 * // Modo legado (compatível)
 * <AdminEmptyState
 *   message="Nenhuma página criada ainda"
 *   cta={{ label: 'Criar Primeira Página', onClick: handleCreate }}
 * />
 */
export function AdminEmptyState({
  title,
  message,
  description,
  cta,
  className = '',
}: AdminEmptyStateProps) {
  // Compatibilidade: se só `message` for passado, usa como título
  const resolvedTitle       = title       ?? message ?? '';
  const resolvedDescription = description ?? (!title ? undefined : undefined);

  // Detectar se cta é o objeto typed ou ReactNode arbitrário
  const isCtaObject = cta && typeof cta === 'object' && 'label' in (cta as object);

  return (
    <div
      className={`text-center py-12 border-2 border-dashed border-gray-300 rounded-xl ${className}`}
    >
      {resolvedTitle && (
        <p
          className="mb-1"
          style={{
            fontSize:   adminVar('item-title-grid', 'size'),
            fontWeight: adminVar('item-title-grid', 'weight'),
            color:      adminVar('item-title-grid', 'color'),
          }}
        >
          {resolvedTitle}
        </p>
      )}

      {resolvedDescription && (
        <p
          className="mb-4"
          style={{
            fontSize:   adminVar('item-description', 'size'),
            fontWeight: adminVar('item-description', 'weight'),
            color:      adminVar('item-description', 'color'),
          }}
        >
          {resolvedDescription}
        </p>
      )}

      {/* Espaço entre título e CTA quando não há descrição */}
      {resolvedTitle && !resolvedDescription && <div className="mb-4" />}

      {cta && (
        isCtaObject ? (
          <Button
            variant="outline"
            onClick={(cta as AdminEmptyStateCTA).onClick}
          >
            {(cta as AdminEmptyStateCTA).icon ?? <Plus className="h-4 w-4 mr-2" />}
            {(cta as AdminEmptyStateCTA).label}
          </Button>
        ) : (
          // ReactNode arbitrário (ex: bloco de código, link, etc.)
          <>{cta as React.ReactNode}</>
        )
      )}
    </div>
  );
}
