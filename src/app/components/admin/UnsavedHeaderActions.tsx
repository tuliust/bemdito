import React from 'react';
import { Loader2 } from 'lucide-react';
import { AdminPrimaryButton } from './AdminPrimaryButton';

interface UnsavedHeaderActionsProps {
  /** Controla visibilidade do indicador ⚠️ e o estado disabled do botão Salvar */
  hasUnsavedChanges: boolean;
  /** Estado de loading durante o salvamento */
  saving: boolean;
  /** Callback executado ao clicar em Salvar */
  onSave: () => void;
  /** Label do botão de salvar (padrão: 'Salvar Alterações') */
  saveLabel?: string;
  /**
   * Ações extras renderizadas antes do indicador ⚠️.
   * Use para botões secundários (ex: Preview, Exportar).
   *
   * @example
   * extraActions={
   *   <Button variant="outline" onClick={() => window.open('/', '_blank')}>
   *     <Eye className="h-4 w-4 mr-2" /> Preview
   *   </Button>
   * }
   */
  extraActions?: React.ReactNode;
}

/**
 * Bloco padronizado de headerActions para páginas com estado "não salvo".
 *
 * Renderiza (da esquerda para direita):
 *   [extraActions] → [⚠️ Indicador (condicional)] → [Botão Salvar]
 *
 * Regra: o indicador e o botão Salvar ficam SEMPRE juntos no headerActions,
 * nunca dentro do conteúdo de tabs ou seções.
 *
 * @example
 * <AdminPageLayout
 *   headerActions={
 *     <UnsavedHeaderActions
 *       hasUnsavedChanges={hasUnsavedChanges}
 *       saving={saving}
 *       onSave={handleSave}
 *       extraActions={
 *         <Button variant="outline" onClick={openPreview}>Preview</Button>
 *       }
 *     />
 *   }
 * />
 */
export function UnsavedHeaderActions({
  hasUnsavedChanges,
  saving,
  onSave,
  saveLabel = 'Salvar Alterações',
  extraActions,
}: UnsavedHeaderActionsProps) {
  return (
    <div className="flex items-center gap-3">
      {extraActions}

      {hasUnsavedChanges && (
        <span className="text-sm text-amber-600 font-medium">
          ⚠️ Alterações não salvas
        </span>
      )}

      <AdminPrimaryButton
        onClick={onSave}
        disabled={saving || !hasUnsavedChanges}
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Salvando...
          </>
        ) : (
          saveLabel
        )}
      </AdminPrimaryButton>
    </div>
  );
}