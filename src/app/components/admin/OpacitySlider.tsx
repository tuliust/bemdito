import React from 'react';
import { Label } from '../ui/label';

interface OpacitySliderProps {
  /** Texto exibido acima do slider. Padrão: "Opacidade" */
  label?: string;
  /** Valor atual (0–100) */
  value: number;
  /** Callback chamado ao mover o slider */
  onChange: (value: number) => void;
  /** Classes CSS extras para o elemento raiz */
  className?: string;
}

/**
 * OpacitySlider — controle deslizante padronizado para valores de opacidade (0–100%).
 *
 * Exibe label, valor numérico atual e um <input type="range"> com gradiente
 * visual que acompanha o valor selecionado.
 *
 * @example
 * <OpacitySlider
 *   label="Opacidade do Fundo"
 *   value={bgOpacity}
 *   onChange={(v) => setBgOpacity(v)}
 *   className="mt-2"
 * />
 */
export function OpacitySlider({
  label = 'Opacidade',
  value,
  onChange,
  className = '',
}: OpacitySliderProps) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={`p-3 bg-white rounded-lg border-2 border-primary/20 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <Label>{label}</Label>
        <span data-slot="field-button">{pct}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--primary, #ea526e) 0%, var(--primary, #ea526e) ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );
}