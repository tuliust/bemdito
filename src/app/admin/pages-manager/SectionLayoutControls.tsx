import React from 'react';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Image, Grid3x3 } from 'lucide-react';
import { MediaFitModePicker } from '../../components/admin/MediaFitModePicker';
import { AlignXYControl } from '../../components/admin/AlignXYControl';
import { adminVar } from '../../components/admin/AdminThemeProvider';

interface SectionLayoutControlsProps {
  config: any;
  hasMedia: boolean;
  hasCards: boolean;
  hasButton: boolean;
  onUpdateConfig: (key: string, value: any) => void;
  // Props para Template de Cards
  selectedTemplateId: string | null;
  cardTemplates: any[];
  onTemplateChange: (templateId: string) => void;
  // Props para Botão
  pages: any[];
  selectedPageId: string;
  pageSections: any[];
  selectedSectionId: string;
  onPageIdChange: (pageId: string) => void;
  onSectionIdChange: (sectionId: string) => void;
}

export function SectionLayoutControls({
  config,
  hasMedia,
  hasCards,
  hasButton,
  onUpdateConfig,
  selectedTemplateId,
  cardTemplates,
  onTemplateChange,
  pages,
  selectedPageId,
  pageSections,
  selectedSectionId,
  onPageIdChange,
  onSectionIdChange,
}: SectionLayoutControlsProps) {
  return (
    <div className="space-y-4">
      {/* ==================== 4. MÍDIA ==================== */}
      {hasMedia && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{
              fontSize: adminVar('item-title-list', 'size'),
              fontWeight: adminVar('item-title-list', 'weight'),
              color: adminVar('item-title-list', 'color'),
            }}>
              <Image className="h-5 w-5" style={{ color: 'var(--primary, #ea526e)' }} />
              4. Mídia
            </CardTitle>
            <CardDescription>
              Configure como a mídia é ajustada e posicionada na área
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Modo de Ajuste */}
            <MediaFitModePicker
              value={config.media?.fitMode}
              onChange={(fitMode) =>
                onUpdateConfig('media', { ...(config.media || {}), fitMode })
              }
            />

            {/* Alinhamento Horizontal e Vertical */}
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

      {/* ==================== 5. CARDS ==================== */}
      {hasCards && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{
              fontSize: adminVar('item-title-list', 'size'),
              fontWeight: adminVar('item-title-list', 'weight'),
              color: adminVar('item-title-list', 'color'),
            }}>
              <Grid3x3 className="h-5 w-5" style={{ color: 'var(--primary, #ea526e)' }} />
              5. Cards
            </CardTitle>
            <CardDescription>
              Configure o template e posicionamento dos cards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template de Cards */}
            <div className="space-y-2">
              <Label>Template de Cards</Label>
              <select
                value={selectedTemplateId || ''}
                onChange={(e) => onTemplateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: 'var(--admin-field-bg, #ffffff)', border: '2px solid var(--admin-field-border, #e5e7eb)', color: 'var(--admin-field-text, #111827)' }}
              >
                <option value="">Sem Template</option>
                {cardTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Alinhamento Horizontal e Vertical */}
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
    </div>
  );
}