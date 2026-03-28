import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { AlignVerticalSpaceAround } from 'lucide-react';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type GridPosition = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface CornerPositionSelectorProps {
  title: string;
  description?: string;
  value: GridPosition | { position: GridPosition; [key: string]: any }; // ✅ Aceita string OU objeto com position
  onChange: (position: GridPosition) => void;
  icon?: React.ReactNode;
}

/**
 * 🎯 CornerPositionSelector - Sistema intuitivo de posicionamento por cantos
 * 
 * Permite selecionar 1-4 cantos do grid 2×2:
 * - 1 canto: Posição específica (1×1)
 * - 2 cantos horizontais: Linha completa (2×1)
 * - 2 cantos verticais: Coluna completa (1×2)
 * - 4 cantos: Grid completo (2×2)
 */
export function CornerPositionSelector({
  title,
  description,
  value,
  onChange,
  icon,
}: CornerPositionSelectorProps) {
  
  // ✅ VALIDAÇÃO ROBUSTA: Extrair string de posição de qualquer formato
  let validatedValue: GridPosition = 'top-left';
  
  // Caso 1: value é um objeto com campo "position"
  if (value && typeof value === 'object' && 'position' in value) {
    const positionValue = (value as any).position;
    if (typeof positionValue === 'string') {
      const validPositions: GridPosition[] = [
        'top-left', 'top-center', 'top-right',
        'middle-left', 'center', 'middle-right',
        'bottom-left', 'bottom-center', 'bottom-right'
      ];
      
      if (validPositions.includes(positionValue as GridPosition)) {
        validatedValue = positionValue as GridPosition;
      } else {
        console.warn(`⚠️ [CornerPositionSelector] Posição inválida em objeto: "${positionValue}". Usando padrão "top-left".`);
      }
    }
  }
  // Caso 2: value é uma string direta
  else if (typeof value === 'string') {
    const validPositions: GridPosition[] = [
      'top-left', 'top-center', 'top-right',
      'middle-left', 'center', 'middle-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ];
    
    if (validPositions.includes(value as GridPosition)) {
      validatedValue = value as GridPosition;
    } else {
      console.warn(`⚠️ [CornerPositionSelector] Posição inválida recebida: "${value}". Usando padrão "top-left".`);
    }
  }
  // Caso 3: value é inválido (undefined, null, outro tipo)
  else {
    console.warn(`⚠️ [CornerPositionSelector] Tipo inválido para ${title.toLowerCase()}:`, {
      value,
      tipo: typeof value,
      esperado: 'string (GridPosition) ou objeto com campo "position"'
    });
  }
  
  // Converter GridPosition para array de corners selecionados
  const getSelectedCorners = (position: GridPosition): Corner[] => {
    const mapping: Record<GridPosition, Corner[]> = {
      'top-left': ['top-left'],
      'top-center': ['top-left', 'top-right'],
      'top-right': ['top-right'],
      'middle-left': ['top-left', 'bottom-left'],
      'center': ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      'middle-right': ['top-right', 'bottom-right'],
      'bottom-left': ['bottom-left'],
      'bottom-center': ['bottom-left', 'bottom-right'],
      'bottom-right': ['bottom-right'],
    };
    return mapping[position] || ['top-left'];
  };

  // Converter array de corners para GridPosition
  const cornersToPosition = (corners: Corner[]): GridPosition => {
    const sorted = [...corners].sort();
    const key = sorted.join(',');

    const mapping: Record<string, GridPosition> = {
      'top-left': 'top-left',
      'top-right': 'top-right',
      'bottom-left': 'bottom-left',
      'bottom-right': 'bottom-right',
      'top-left,top-right': 'top-center',
      'bottom-left,bottom-right': 'bottom-center',
      'bottom-left,top-left': 'middle-left',
      'bottom-right,top-right': 'middle-right',
      'bottom-left,bottom-right,top-left,top-right': 'center',
    };

    return mapping[key] || 'top-left';
  };

  const selectedCorners = getSelectedCorners(validatedValue);

  // Toggle corner selecionado
  const handleToggleCorner = (corner: Corner) => {
    const isSelected = selectedCorners.includes(corner);
    let newCorners: Corner[];

    if (isSelected) {
      // Desselecionar: remover o corner
      newCorners = selectedCorners.filter(c => c !== corner);
      
      // Se ficou vazio, manter pelo menos 1 corner (o clicado volta a ser selecionado)
      if (newCorners.length === 0) {
        newCorners = [corner];
      }
    } else {
      // Selecionar: adicionar o corner
      newCorners = [...selectedCorners, corner];
    }

    // ✅ REMOVIDO: Validação de combinação (permite qualquer seleção)
    // O usuário pode clicar livremente. Validação de conflitos acontece apenas ao salvar.
    
    const newPosition = cornersToPosition(newCorners);
    onChange(newPosition);
  };

  // ❌ REMOVIDO: validateCornerCombination (não é mais usado)
  // Validação de conflitos entre elementos (texto/mídia/cards) acontece no momento de salvar

  // Obter label descritivo da seleção atual
  const getPositionLabel = (position: GridPosition): string => {
    const labels: Record<GridPosition, string> = {
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
    return labels[position];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          {icon || <AlignVerticalSpaceAround className="h-4 w-4 text-primary" />}
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Grid 2×2 de botões de canto */}
          <div className="grid grid-cols-2 gap-3">
            {/* Topo Esquerda */}
            <button
              type="button"
              onClick={() => handleToggleCorner('top-left')}
              className="relative h-24 rounded-lg border-2"
              style={{
                transition: 'none',
                backgroundColor: selectedCorners.includes('top-left') ? 'var(--primary, #ea526e)' : '#ffffff',
                borderColor: selectedCorners.includes('top-left') ? 'var(--primary, #ea526e)' : '#e5e7eb',
              }}
            >
              <div className="absolute top-2 left-2">
                <div className={`w-4 h-4 rounded-full ${selectedCorners.includes('top-left') ? 'bg-white' : 'bg-gray-300'}`} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-medium ${selectedCorners.includes('top-left') ? 'text-white' : 'text-gray-400'}`}>
                  Topo<br/>Esquerda
                </span>
              </div>
            </button>

            {/* Topo Direita */}
            <button
              type="button"
              onClick={() => handleToggleCorner('top-right')}
              className="relative h-24 rounded-lg border-2"
              style={{
                transition: 'none',
                backgroundColor: selectedCorners.includes('top-right') ? 'var(--primary, #ea526e)' : '#ffffff',
                borderColor: selectedCorners.includes('top-right') ? 'var(--primary, #ea526e)' : '#e5e7eb',
              }}
            >
              <div className="absolute top-2 right-2">
                <div className={`w-4 h-4 rounded-full ${selectedCorners.includes('top-right') ? 'bg-white' : 'bg-gray-300'}`} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-medium ${selectedCorners.includes('top-right') ? 'text-white' : 'text-gray-400'}`}>
                  Topo<br/>Direita
                </span>
              </div>
            </button>

            {/* Baixo Esquerda */}
            <button
              type="button"
              onClick={() => handleToggleCorner('bottom-left')}
              className="relative h-24 rounded-lg border-2"
              style={{
                transition: 'none',
                backgroundColor: selectedCorners.includes('bottom-left') ? 'var(--primary, #ea526e)' : '#ffffff',
                borderColor: selectedCorners.includes('bottom-left') ? 'var(--primary, #ea526e)' : '#e5e7eb',
              }}
            >
              <div className="absolute bottom-2 left-2">
                <div className={`w-4 h-4 rounded-full ${selectedCorners.includes('bottom-left') ? 'bg-white' : 'bg-gray-300'}`} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-medium ${selectedCorners.includes('bottom-left') ? 'text-white' : 'text-gray-400'}`}>
                  Baixo<br/>Esquerda
                </span>
              </div>
            </button>

            {/* Baixo Direita */}
            <button
              type="button"
              onClick={() => handleToggleCorner('bottom-right')}
              className="relative h-24 rounded-lg border-2"
              style={{
                transition: 'none',
                backgroundColor: selectedCorners.includes('bottom-right') ? 'var(--primary, #ea526e)' : '#ffffff',
                borderColor: selectedCorners.includes('bottom-right') ? 'var(--primary, #ea526e)' : '#e5e7eb',
              }}
            >
              <div className="absolute bottom-2 right-2">
                <div className={`w-4 h-4 rounded-full ${selectedCorners.includes('bottom-right') ? 'bg-white' : 'bg-gray-300'}`} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-medium ${selectedCorners.includes('bottom-right') ? 'text-white' : 'text-gray-400'}`}>
                  Baixo<br/>Direita
                </span>
              </div>
            </button>
          </div>

          {/* Label descritivo da seleção atual */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Posição atual:</p>
            <p className="text-sm font-semibold text-gray-900">
              {getPositionLabel(validatedValue)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}