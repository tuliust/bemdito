import { useState } from 'react';
import { useDesignTokens } from '../../../lib/hooks/useDesignTokens';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Check, Loader2, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { getSelectableClasses } from '../../../lib/constants/theme';

interface TransitionPickerProps {
  value?: string; // token ID
  onChange: (tokenId: string) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * TransitionPicker - Componente oficial de seleção de transições/efeitos
 * 
 * Características:
 * - Tokens de transition do Design System
 * - Preview animado ao passar mouse
 * - Reutilizável em todo o sistema
 */
export function TransitionPicker({ 
  value, 
  onChange, 
  label, 
  disabled,
  placeholder = 'Selecione uma transição'
}: TransitionPickerProps) {
  const { tokens, loading } = useDesignTokens('transition');
  const [open, setOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

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
                  <Play className="h-4 w-4 text-gray-500" />
                  <div className="flex flex-col items-start">
                    <span data-slot="field-button">{selectedToken.label}</span>
                    <span data-slot="field-hint">
                      {selectedToken.value.duration} · {selectedToken.value.easing}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[360px] p-2 rounded-[1.5rem]">
          <div className="space-y-1">
            {tokens.map((token) => {
              const isSelected = token.id === value;
              const isPlaying = previewId === token.id;

              return (
                <button
                  key={token.id}
                  onClick={() => {
                    onChange(token.id);
                    setOpen(false);
                  }}
                  onMouseEnter={() => setPreviewId(token.id)}
                  onMouseLeave={() => setPreviewId(null)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 ${getSelectableClasses(isSelected)}`}
                  style={{
                    transition: 'none',
                    animation: 'none',
                    boxShadow: 'none',
                  }}
                >
                  {/* Preview animado */}
                  <div className="w-12 h-8 bg-gray-100 rounded border border-gray-300 flex items-center justify-center overflow-hidden">
                    <motion.div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: 'var(--primary, #ea526e)' }}
                      animate={
                        isPlaying
                          ? { x: [0, 16, 0] }
                          : { x: 0 }
                      }
                      transition={{
                        duration: parseFloat(token.value.duration) / 1000,
                        ease: token.value.easing,
                        repeat: isPlaying ? Infinity : 0,
                      }}
                    />
                  </div>
                  
                  {/* Infos */}
                  <div className="flex-1 text-left">
                    <p data-slot="field-button">{token.label}</p>
                    <p data-slot="field-hint">
                      {token.value.duration} · {token.value.easing}
                    </p>
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

          <div data-slot="field-hint" className="mt-2 p-2 bg-gray-50 rounded-lg text-center">
            Passe o mouse para visualizar a animação
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}