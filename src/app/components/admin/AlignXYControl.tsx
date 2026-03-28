import { Label } from '../ui/label';

interface AlignOption {
  value: string;
  label: string;
}

const DEFAULT_OPTIONS_X: AlignOption[] = [
  { value: 'left',   label: 'Esquerda' },
  { value: 'center', label: 'Centro' },
  { value: 'right',  label: 'Direita' },
];

const DEFAULT_OPTIONS_Y: AlignOption[] = [
  { value: 'top',    label: 'Topo' },
  { value: 'middle', label: 'Meio' },
  { value: 'bottom', label: 'Baixo' },
];

interface AlignXYControlProps {
  /** Valor atual do alinhamento horizontal */
  valueX: string;
  /** Valor atual do alinhamento vertical */
  valueY: string;
  /** Opções do select horizontal. Padrão: left / center / right */
  optionsX?: AlignOption[];
  /** Opções do select vertical. Padrão: top / middle / bottom */
  optionsY?: AlignOption[];
  onChangeX: (value: string) => void;
  onChangeY: (value: string) => void;
  labelX?: string;
  labelY?: string;
}

/**
 * AlignXYControl — Par de selects para alinhamento horizontal + vertical.
 *
 * Encapsula o grid 2 colunas "Alinhamento Horizontal / Vertical" antes duplicado
 * 6× em `SectionLayoutControls` e `SectionHeightAndAlignmentControls`.
 *
 * @example
 * <AlignXYControl
 *   valueX={config.media?.alignX ?? 'center'}
 *   valueY={config.media?.alignY ?? 'middle'}
 *   onChangeX={(v) => onUpdateConfig('media', { ...config.media, alignX: v })}
 *   onChangeY={(v) => onUpdateConfig('media', { ...config.media, alignY: v })}
 * />
 */
export function AlignXYControl({
  valueX,
  valueY,
  optionsX = DEFAULT_OPTIONS_X,
  optionsY = DEFAULT_OPTIONS_Y,
  onChangeX,
  onChangeY,
  labelX = 'Alinhamento Horizontal',
  labelY = 'Alinhamento Vertical',
}: AlignXYControlProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{labelX}</Label>
        <select
          value={valueX}
          onChange={(e) => onChangeX(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        >
          {optionsX.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label>{labelY}</Label>
        <select
          value={valueY}
          onChange={(e) => onChangeY(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        >
          {optionsY.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}