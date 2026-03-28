import { useState } from 'react';
import { useDesignTokens, getColorValue } from '../../../lib/hooks/useDesignTokens';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Check, Loader2 } from 'lucide-react';
import { getSelectableClasses } from '../../../lib/constants/theme';

interface RadiusPickerProps {
  value?: string; // token ID
  onChange: (tokenId: string) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * RadiusPicker - Componente oficial de seleção de border-radius
 * 
 * Características:
 * - Tokens de radius do Design System
 * - Preview visual do radius
 * - 2xl como padrão recomendado
 * - Reutilizável em todo o sistema
 */
export function RadiusPicker({ 
  value, 
  onChange, 
  label, 
  disabled,
  placeholder = 'Selecione um radius'
}: RadiusPickerProps) {
  const { tokens, loading } = useDesignTokens('radius' as any);
  const [open, setOpen] = useState(false);

  const selectedToken = tokens.find((token) => token.id === value);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-500">Carregando...</span>
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
            className="w-full justify-start"
            disabled={disabled}
          >
            <div className="flex items-center gap-3">
              {selectedToken ? (
                <>
                  <div 
                    className="h-6 w-6 border-2 border-gray-400 bg-gray-100"
                    style={{ borderRadius: selectedToken.value.value }}
                  />
                  <div className="flex flex-col items-start">
                    <span data-slot="field-button">{selectedToken.label}</span>
                    <span data-slot="field-hint">{selectedToken.value.value}</span>
                  </div>
                </>
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[320px] p-2 rounded-[1.5rem]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="space-y-1">
            {tokens.map((token) => {
              const isSelected = token.id === value;
              const isDefault = token.name === '2xl';

              return (
                <button
                  key={token.id}
                  onClick={() => {
                    onChange(token.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 ${getSelectableClasses(isSelected)}`}
                  style={{
                    transition: 'none',
                    animation: 'none',
                    boxShadow: 'none',
                  }}
                >
                  {/* Preview */}
                  <div 
                    className="h-8 w-8 border-2 border-gray-400 bg-gray-100 flex-shrink-0"
                    style={{ borderRadius: token.value.value }}
                  />
                  
                  {/* Infos */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p data-slot="field-button">{token.label}</p>
                      {isDefault && (
                        <span
                          className="text-xs text-white px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'var(--primary, #ea526e)' }}
                        >
                          Padrão
                        </span>
                      )}
                    </div>
                    <p data-slot="field-hint" className="font-mono">{token.value.value}</p>
                  </div>
                  
                  {/* Check */}
                  {isSelected && (
                    <Check
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: 'var(--primary, #ea526e)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}