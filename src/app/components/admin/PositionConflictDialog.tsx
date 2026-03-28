import React from 'react';
import { BaseModal } from './BaseModal';
import { AlertTriangle } from 'lucide-react';

interface Conflict {
  element1: string;
  element2: string;
  position1: string;
  position2: string;
  description: string;
}

interface PositionConflictDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflicts: Conflict[];
  onContinue: () => void;
}

/**
 * 🚨 PositionConflictDialog - Modal de aviso de conflitos de posicionamento
 * 
 * Exibido quando o usuário tenta salvar uma configuração onde elementos
 * (texto, mídia, cards) estão em posições que se sobrepõem no grid 2×2.
 */
export function PositionConflictDialog({
  open,
  onOpenChange,
  conflicts,
  onContinue,
}: PositionConflictDialogProps) {
  
  const getPositionLabel = (position: string): string => {
    const labels: Record<string, string> = {
      'top-left': 'Topo Esquerda',
      'top-center': 'Linha Superior',
      'top-right': 'Topo Direita',
      'middle-left': 'Coluna Esquerda',
      'center': 'Grid Completo',
      'middle-right': 'Coluna Direita',
      'bottom-left': 'Baixo Esquerda',
      'bottom-center': 'Linha Inferior',
      'bottom-right': 'Baixo Direita',
    };
    return labels[position] || position;
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <span>Conflito de Posicionamento Detectado</span>
        </div>
      }
      description="Os seguintes elementos estão configurados para ocupar posições sobrepostas no grid"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Voltar e Ajustar
          </button>
          <button
            onClick={() => {
              onContinue();
              onOpenChange(false);
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Continuar Mesmo Assim
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {conflicts.map((conflict, index) => (
          <div
            key={index}
            className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  {conflict.element1} e {conflict.element2}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  {conflict.description}
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-gray-600">{conflict.element1}:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {getPositionLabel(conflict.position1)}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-gray-600">{conflict.element2}:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {getPositionLabel(conflict.position2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-medium mb-2">
            💡 Como resolver:
          </p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Volte e ajuste as posições dos elementos na aba "Preview"</li>
            <li>Certifique-se de que cada elemento ocupe áreas diferentes do grid</li>
            <li>Ou continue se deseja que os elementos se sobreponham intencionalmente</li>
          </ul>
        </div>
      </div>
    </BaseModal>
  );
}