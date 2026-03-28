import { Label } from '../ui/label';

export type FitMode = 'cover' | 'contain' | 'natural' | 'adaptada' | 'alinhada';

interface FitModeOption {
  value: FitMode;
  label: string;
  description: string;
}

const FIT_MODE_OPTIONS: FitModeOption[] = [
  { value: 'cover',    label: 'Cover',    description: 'Preencher área' },
  { value: 'contain',  label: 'Contain',  description: 'Exibir inteira' },
  { value: 'natural',  label: 'Natural',  description: 'Tamanho real' },
  { value: 'adaptada', label: 'Adaptada', description: 'Altura do texto' },
  { value: 'alinhada', label: 'Alinhada', description: 'Cola nas bordas' },
];

interface MediaFitModePickerProps {
  /**
   * Valor atual do fitMode.
   * Quando `undefined`, o visual padrão recai em 'cover'.
   */
  value?: string;
  onChange: (fitMode: FitMode) => void;
  label?: string;
}

/**
 * MediaFitModePicker — Seletor unificado do modo de ajuste de mídia.
 *
 * Encapsula os 5 botões de fitMode (Cover / Contain / Natural / Adaptada / Alinhada)
 * antes duplicados em `SectionLayoutControls` e `SectionHeightAndAlignmentControls`.
 *
 * @example
 * <MediaFitModePicker
 *   value={config.media?.fitMode}
 *   onChange={(fitMode) => onUpdateConfig('media', { ...config.media, fitMode })}
 * />
 */
export function MediaFitModePicker({
  value,
  onChange,
  label = 'Modo de Ajuste',
}: MediaFitModePickerProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label>{label}</Label>
      )}
      <div className="grid grid-cols-5 gap-2">
        {FIT_MODE_OPTIONS.map((option) => {
          const isSelected =
            option.value === value || (!value && option.value === 'cover');

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className="px-3 py-2 rounded-lg border-2 text-center"
              style={{
                transition: 'none',
                animation: 'none',
                boxShadow: 'none',
                borderColor: isSelected ? 'var(--primary, #ea526e)' : '#e5e7eb',
                backgroundColor: isSelected
                  ? 'color-mix(in srgb, var(--primary, #ea526e) 10%, transparent)'
                  : '#ffffff',
                color: isSelected ? 'var(--primary, #ea526e)' : '#374151',
                fontWeight: isSelected ? 600 : 400,
              }}
            >
              <div className="text-sm">{option.label}</div>
              <div className="text-xs opacity-70">{option.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}