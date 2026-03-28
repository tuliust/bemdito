import { useState } from 'react';
import { useDesignTokens } from '../../../lib/hooks/useDesignTokens';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Check, Loader2 } from 'lucide-react';

interface TypeScalePickerProps {
  value?: string; // token ID
  onChange: (tokenId: string) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  /** Filtrar apenas tipos específicos (ex: ['minor-title', 'main-title', 'subtitle']) */
  allowedTypes?: string[];
}

/**
 * TypeScalePicker - Componente oficial de seleção de escalas tipográficas
 * 
 * Características:
 * - Tokens de typography do Design System
 * - Somente família Poppins
 * - Preview visual do tamanho
 * - Opção de filtrar tipos específicos (ex: apenas títulos)
 * - Reutilizável em todo o sistema
 */
export function TypeScalePicker({ 
  value, 
  onChange, 
  label, 
  disabled,
  placeholder = 'Selecione um tamanho',
  allowedTypes
}: TypeScalePickerProps) {
  const { tokens, loading } = useDesignTokens('typography');
  const [open, setOpen] = useState(false);

  // Filtrar apenas font-family não deve aparecer aqui
  const availableTokens = tokens
    .filter((token) => !allowedTypes || allowedTypes.includes(token.name));

  const selectedToken = availableTokens.find((token) => token.id === value);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm" style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}>Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-primary hover:bg-gray-50"
            style={{ transition: 'none' }}
            disabled={disabled}
          >
            {selectedToken ? (
              <span className="text-sm text-gray-600">
                {selectedToken.label} ({selectedToken.value.size} · Peso {selectedToken.value.weight})
              </span>
            ) : (
              <span className="text-sm text-gray-400">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[500px] p-2 rounded-[1.5rem]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div 
            className="space-y-1 max-h-[400px] overflow-y-auto overflow-x-hidden"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f3f4f6',
            }}
            onWheel={(e) => {
              e.stopPropagation();
            }}
          >
            {availableTokens.map((token) => {
              const isSelected = token.id === value;

              return (
                <button
                  key={token.id}
                  onClick={() => {
                    onChange(token.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left hover:opacity-90"
                  style={{
                    transition: 'none',
                    animation: 'none',
                    boxShadow: 'none',
                    borderColor: isSelected ? 'var(--primary, #ea526e)' : 'var(--admin-field-border, #e5e7eb)',
                    backgroundColor: isSelected ? 'color-mix(in srgb, var(--primary, #ea526e) 10%, transparent)' : 'transparent',
                  }}
                >
                  {/* Preview visual */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">{token.label}</p>
                      <p className="text-xs text-gray-500">
                        {token.value.size} · {token.value.weight}
                      </p>
                    </div>
                    <p 
                      style={{ 
                        fontSize: token.value.size,
                        fontWeight: token.value.weight,
                        fontFamily: 'Poppins, sans-serif',
                        lineHeight: token.value.lineHeight,
                        color: 'var(--admin-field-text, #111827)',
                      }}
                    >
                      Exemplo de texto
                    </p>
                  </div>
                  
                  {/* Check */}
                  {isSelected && <Check className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--primary, #ea526e)' }} />}
                </button>
              );
            })}
          </div>

          {availableTokens.length === 0 && (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}>
              Nenhuma escala tipográfica disponível
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}