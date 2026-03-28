import React from 'react';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { MediaFitModePicker } from '../../components/admin/MediaFitModePicker';
import { AlignXYControl } from '../../components/admin/AlignXYControl';
import { adminVar } from '../../components/admin/AdminThemeProvider';

interface SectionHeightAndAlignmentControlsProps {
  config: any;
  hasMedia: boolean;
  hasCards: boolean;
  onUpdateConfig: (key: string, value: any) => void;
}

// ─── Opções de altura ──────────────────────────────────────────────────────────
const HEIGHT_OPTIONS = [
  { value: 'auto',   label: 'Auto',  description: 'Ajusta ao conteúdo' },
  { value: '25vh',   label: '25%',   description: '1/4 da tela' },
  { value: '50vh',   label: '50%',   description: 'Metade da tela' },
  { value: '100vh',  label: '100%',  description: 'Tela inteira' },
];

// ─── Opções de spacing (incrementos de 25 px conforme DS v6.14+) ──────────────
const SPACING_TOP_BOTTOM = [0, 25, 50, 75, 100, 125, 150, 175, 200];
const SPACING_SIDES      = [0, 25, 50, 75, 100, 125, 150, 175, 200];
const SPACING_GAP        = [0, 25, 50, 75, 100, 125, 150, 175, 200];

export function SectionHeightAndAlignmentControls({
  config,
  hasMedia,
  hasCards,
  onUpdateConfig,
}: SectionHeightAndAlignmentControlsProps) {
  return (
    <div className="space-y-4">
      {/* ==================== ALTURA E ESPAÇAMENTO ==================== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle style={{
            fontSize: adminVar('item-title-list', 'size'),
            fontWeight: adminVar('item-title-list', 'weight'),
            color: adminVar('item-title-list', 'color'),
          }}>Altura e Espaçamento</CardTitle>
          <CardDescription>
            Configure a altura da seção e os espaçamentos internos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Altura da Seção */}
          <div>
            <Label className="mb-2 block">Altura da Seção</Label>
            <div className="grid grid-cols-4 gap-2">
              {HEIGHT_OPTIONS.map((opt) => {
                const isSelected =
                  opt.value === config.heightMode ||
                  (!config.heightMode && opt.value === 'auto');
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onUpdateConfig('heightMode', opt.value)}
                    className="px-3 py-2 rounded-lg border-2 text-center"
                    style={{
                      transition: 'none',
                      borderColor: isSelected ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                      backgroundColor: isSelected ? 'color-mix(in srgb, var(--primary, #ea526e) 10%, transparent)' : 'var(--admin-card-bg, #ffffff)',
                      color: isSelected ? 'var(--primary, #ea526e)' : 'var(--admin-btn-action-text, #374151)',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    <div className="text-sm">{opt.label}</div>
                    <div className="text-xs opacity-70">{opt.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Padding Top e Bottom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Padding Superior</Label>
              <select
                value={config.paddingTop ?? 40}
                onChange={(e) => onUpdateConfig('paddingTop', parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: 'var(--admin-field-bg, #ffffff)', border: '2px solid var(--admin-field-border, #e5e7eb)', color: 'var(--admin-field-text, #111827)' }}
              >
                {SPACING_TOP_BOTTOM.map((v) => (
                  <option key={v} value={v}>
                    {v}px{v === 50 ? ' (padrão DS)' : v === 40 ? ' (padrão)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-2 block">Padding Inferior</Label>
              <select
                value={config.paddingBottom ?? 40}
                onChange={(e) => onUpdateConfig('paddingBottom', parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: 'var(--admin-field-bg, #ffffff)', border: '2px solid var(--admin-field-border, #e5e7eb)', color: 'var(--admin-field-text, #111827)' }}
              >
                {SPACING_TOP_BOTTOM.map((v) => (
                  <option key={v} value={v}>
                    {v}px{v === 50 ? ' (padrão DS)' : v === 40 ? ' (padrão)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Margens Laterais e Gap */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <Label className="mb-2 block">Margem Esquerda</Label>
              <select
                value={config.paddingLeft ?? 16}
                onChange={(e) => onUpdateConfig('paddingLeft', parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: 'var(--admin-field-bg, #ffffff)', border: '2px solid var(--admin-field-border, #e5e7eb)', color: 'var(--admin-field-text, #111827)' }}
              >
                {SPACING_SIDES.map((v) => (
                  <option key={v} value={v}>
                    {v}px{v === 16 ? ' (padrão)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-2 block">Gap (entre colunas)</Label>
              <select
                value={config.columnGap ?? 32}
                onChange={(e) => onUpdateConfig('columnGap', parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: 'var(--admin-field-bg, #ffffff)', border: '2px solid var(--admin-field-border, #e5e7eb)', color: 'var(--admin-field-text, #111827)' }}
              >
                {SPACING_GAP.map((v) => (
                  <option key={v} value={v}>
                    {v}px{v === 32 ? ' (padrão)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-2 block">Margem Direita</Label>
              <select
                value={config.paddingRight ?? 16}
                onChange={(e) => onUpdateConfig('paddingRight', parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: 'var(--admin-field-bg, #ffffff)', border: '2px solid var(--admin-field-border, #e5e7eb)', color: 'var(--admin-field-text, #111827)' }}
              >
                {SPACING_SIDES.map((v) => (
                  <option key={v} value={v}>
                    {v}px{v === 16 ? ' (padrão)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==================== ALINHAMENTO DA MÍDIA ==================== */}
      {hasMedia && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{
              fontSize: adminVar('item-title-list', 'size'),
              fontWeight: adminVar('item-title-list', 'weight'),
              color: adminVar('item-title-list', 'color'),
            }}>Alinhamento da Mídia</CardTitle>
            <CardDescription>
              Configure como a mídia é ajustada e posicionada na área
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MediaFitModePicker
              value={config.media?.fitMode}
              onChange={(fitMode) =>
                onUpdateConfig('media', { ...(config.media || {}), fitMode })
              }
            />
            <AlignXYControl
              valueX={config.media?.alignX ?? 'center'}
              valueY={config.media?.alignY ?? 'middle'}
              onChangeX={(v) =>
                onUpdateConfig('media', { ...(config.media || {}), alignX: v })
              }
              onChangeY={(v) =>
                onUpdateConfig('media', { ...(config.media || {}), alignY: v })
              }
            />
          </CardContent>
        </Card>
      )}

      {/* ==================== ALINHAMENTO DOS CARDS ==================== */}
      {hasCards && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{
              fontSize: adminVar('item-title-list', 'size'),
              fontWeight: adminVar('item-title-list', 'weight'),
              color: adminVar('item-title-list', 'color'),
            }}>Alinhamento dos Cards</CardTitle>
            <CardDescription>
              Configure o posicionamento dos cards na área
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlignXYControl
              valueX={config.cards?.alignX ?? 'center'}
              valueY={config.cards?.alignY ?? 'top'}
              onChangeX={(v) =>
                onUpdateConfig('cards', { ...(config.cards || {}), alignX: v })
              }
              onChangeY={(v) =>
                onUpdateConfig('cards', { ...(config.cards || {}), alignY: v })
              }
            />
          </CardContent>
        </Card>
      )}

      {/* ==================== ALINHAMENTO DO TEXTO ==================== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle style={{
            fontSize: adminVar('item-title-list', 'size'),
            fontWeight: adminVar('item-title-list', 'weight'),
            color: adminVar('item-title-list', 'color'),
          }}>Alinhamento do Texto</CardTitle>
          <CardDescription>
            Configure o posicionamento do texto na área
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AlignXYControl
            valueX={config.text?.alignX ?? 'left'}
            valueY={config.text?.alignY ?? 'middle'}
            onChangeX={(v) =>
              onUpdateConfig('text', { ...(config.text || {}), alignX: v })
            }
            onChangeY={(v) =>
              onUpdateConfig('text', { ...(config.text || {}), alignY: v })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}