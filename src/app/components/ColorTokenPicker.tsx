/**
 * ColorTokenPicker Component
 * 
 * Componente único e padronizado para seleção de tokens de cor.
 * Usa design tokens do banco via useDesignTokens('color') com cache e real-time.
 * 
 * USO:
 * ```tsx
 * <ColorTokenPicker 
 *   value={formData.color_token} 
 *   onChange={(id) => setFormData({...formData, color_token: id})}
 *   label="Cor do Título"
 *   allowNone={true}
 * />
 * ```
 */
import { Check, Loader2 } from 'lucide-react';
import { useDesignTokens, getColorValue } from '../../lib/hooks/useDesignTokens';
import { Label } from './ui/label';

type ColorTokenPickerProps = {
  /** ID do token selecionado */
  value: string | null | undefined;
  /** Callback quando token é selecionado */
  onChange: (tokenId: string | null) => void;
  /** Label do campo. @default 'Cor' */
  label?: string;
  /** Permite selecionar "Nenhuma cor". @default true */
  allowNone?: boolean;
  /** Desabilita o picker. @default false */
  disabled?: boolean;
  /**
   * Layout do grid.
   * @default 'default' (4/6/8 colunas - cores maiores)
   * @option 'compact' (6/8/10/12 colunas - cores menores)
   */
  layout?: 'default' | 'compact';
  /** Placeholder (não usado atualmente) */
  placeholder?: string;
};

export function ColorTokenPicker({ 
  value, 
  onChange, 
  label = 'Cor', 
  allowNone = true,
  disabled = false,
  layout = 'default'
}: ColorTokenPickerProps) {
  const { tokens, loading } = useDesignTokens('color');

  // ✅ Configuração de grid baseada no layout
  const gridConfig = layout === 'compact'
    ? 'grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-10'
    : 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8';
  
  const gapClass = layout === 'compact' ? 'gap-1.5' : 'gap-2';
  const borderRadius = layout === 'compact' ? 'rounded-lg' : 'rounded-xl';
  const innerRadius = layout === 'compact' ? 'rounded-md' : 'rounded-lg';
  const checkSize = layout === 'compact' ? 'h-3 w-3' : 'h-4 w-4';
  const checkPosition = layout === 'compact' ? 'top-0.5 right-0.5' : 'top-1 right-1';
  const patternSize = layout === 'compact' ? '6px' : '8px';
  const patternOffset = layout === 'compact' ? '3px' : '4px';

  return (
    <div>
      {label && <Label className="mb-2">{label}</Label>}
      
      {loading ? (
        <div className="flex items-center justify-center py-8 gap-2" style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}>
          <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--primary, #ea526e)' }} />
          <span className="text-sm">Carregando cores...</span>
        </div>
      ) : (
        <div className={`grid ${gridConfig} ${gapClass}`}>
          {/* Opção "Nenhuma" */}
          {allowNone && (
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={disabled}
              className={`relative flex-shrink-0 w-full aspect-square p-0.5 border-2 ${borderRadius} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                transition: 'none',
                animation: 'none',
                boxShadow: 'none',
                borderColor: value === null || value === undefined
                  ? 'var(--primary, #ea526e)'
                  : 'var(--admin-field-border, #e5e7eb)',
                backgroundColor: value === null || value === undefined
                  ? 'var(--secondary, #2e2240)' // ✅ Fundo roxo quando selecionado
                  : 'var(--admin-field-bg, #ffffff)',
              }}
            >
              <div 
                className={`w-full h-full ${innerRadius} flex items-center justify-center`}
                style={{
                  pointerEvents: 'none',
                  opacity: value === null || value === undefined ? 0 : 1, // ✅ Esconde padrão quando selecionado
                  borderStyle: 'solid',
                  borderWidth: '2px',
                  borderColor: 'var(--admin-field-border, #e5e7eb)',
                  backgroundColor: '#ffffff',
                  background: `
                    linear-gradient(45deg, #e5e7eb 25%, transparent 25%), 
                    linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #e5e7eb 75%), 
                    linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                  `,
                  backgroundSize: `${patternSize} ${patternSize}`,
                  backgroundPosition: `0 0, 0 ${patternOffset}, ${patternOffset} -${patternOffset}, -${patternOffset} 0px`
                }}
              />
              {(value === null || value === undefined) && (
                <Check 
                  className={`absolute ${checkPosition} ${checkSize}`} 
                  style={{ color: '#ffffff' }} // ✅ Check branco para contrastar com fundo roxo
                />
              )}
            </button>
          )}

          {/* Lista de tokens */}
          {tokens.length === 0 ? (
            <div className="col-span-full text-center py-8" style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}>
              <p className="text-sm">Nenhuma cor cadastrada</p>
              <p className="text-xs mt-1">Crie tokens de cor no painel de Design Tokens</p>
            </div>
          ) : (
            tokens.map((token) => {
              const isSelected = value === token.id;
              const hexColor = getColorValue(token);

              return (
                <button
                  key={token.id}
                  type="button"
                  onClick={() => onChange(token.id)}
                  disabled={disabled}
                  title={`${token.label} (${hexColor})`}
                  className={`relative flex-shrink-0 w-full aspect-square p-0.5 border-2 ${borderRadius} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{
                    transition: 'none',
                    animation: 'none',
                    boxShadow: 'none',
                    borderColor: isSelected
                      ? 'var(--primary, #ea526e)'
                      : 'var(--admin-field-border, #e5e7eb)',
                    backgroundColor: isSelected
                      ? 'var(--admin-field-bg, #ffffff)'
                      : 'transparent',
                  }}
                >
                  <div
                    className={`w-full h-full ${innerRadius}`}
                    style={{ backgroundColor: hexColor }}
                  />
                  {isSelected && (
                    <Check 
                      className={`absolute ${checkPosition} ${checkSize}`} 
                      style={{ color: 'var(--primary, #ea526e)' }}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}