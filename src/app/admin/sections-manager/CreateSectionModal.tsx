import React, { useState } from 'react';
import { toast } from 'sonner';
import { BaseModal } from '@/app/components/admin/BaseModal';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { SectionBuilder } from './SectionBuilder';
import { supabase } from '@/lib/supabase/client';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface SectionElements {
  hasMainTitle: boolean;
  hasMinorTitle: boolean;
  hasSubtitle: boolean;
  hasIcon: boolean;
  hasButton: boolean;
  hasCards: boolean;
  hasMedia: boolean;
  hasContainer: boolean;
  cardCount: number;
  mediaType: 'image' | 'video' | null;
}

interface SectionLayout {
  desktop: {
    textAlign: 'left' | 'center' | 'right';
    textPosition: 'top' | 'center' | 'bottom' | 'single';
    mediaAlign: 'left' | 'center' | 'right';
    cardsAlign: 'left' | 'center' | 'right';
    columns: 1 | 2 | 3 | 4;
  };
  mobile: {
    textAlign: 'left' | 'center' | 'right';
    stack: 'vertical' | 'horizontal';
  };
}

interface SectionStyling {
  height: 'auto' | 'small' | 'medium' | 'large' | 'full';
  background: {
    type: 'color' | 'gradient' | 'image' | 'none';
    value: string;
    colorTokenId?: string;
  };
  spacing: {
    top: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    bottom: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    left: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    right: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  };
}

interface CreateSectionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateSectionModal({ open, onClose, onSuccess }: CreateSectionModalProps) {
  const [sectionName, setSectionName] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [elements, setElements] = useState<SectionElements | null>(null);
  const [layout, setLayout] = useState<SectionLayout | null>(null);
  const [styling, setStyling] = useState<SectionStyling | null>(null);
  const [config, setConfig] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Limpar estado sempre que o modal fechar — garante que ESC/overlay também limpam
  React.useEffect(() => {
    if (!open) {
      setSectionName('');
      setIsGlobal(false);
      setIsPublished(false);
      setElements(null);
      setLayout(null);
      setStyling(null);
      setConfig({});
      setHasUnsavedChanges(false);
    }
  }, [open]);

  const handleBuilderChange = (
    newElements: SectionElements,
    newLayout: SectionLayout,
    newStyling: SectionStyling
  ) => {
    setElements(newElements);
    setLayout(newLayout);
    setStyling(newStyling);
    setHasUnsavedChanges(true);
  };

  const handleConfigChange = (newConfig: any) => {
    setConfig(newConfig);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!sectionName.trim()) {
      toast.error('Nome da seção é obrigatório', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    if (!elements || !layout || !styling) {
      toast.error('Configure os elementos da seção', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    setSaving(true);

    try {
      const type = generateSectionType(elements);
      const initialConfig = generateInitialConfig(elements, layout, styling);

      const { error } = await supabase.from('sections').insert([
        {
          name: sectionName,
          type: type,
          config: { ...initialConfig, ...config },
          elements: elements,
          layout: layout,
          styling: styling,
          global: isGlobal,
          published: isPublished,
        },
      ]);

      if (error) throw error;

      toast.success('Seção criada com sucesso!', {
        icon: <CheckCircle className="h-4 w-4" />,
      });

      setSectionName('');
      setIsGlobal(false);
      setIsPublished(false);
      setElements(null);
      setLayout(null);
      setStyling(null);
      setConfig({});
      setHasUnsavedChanges(false);

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating section:', error);
      toast.error('Erro ao criar seção', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title="Criar Nova Seção"
      description="Configure os elementos e layout da sua seção personalizada"
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel="Criar Seção"
      saving={saving}
      hasUnsavedChanges={hasUnsavedChanges}
      size="large"
    >
      <div className="space-y-6">
        {/* Nome e Configurações Básicas */}
        <div className="space-y-4 pb-6 border-b">
          <div className="space-y-2">
            <Label htmlFor="section-name">
              Nome da Seção <span style={{ color: 'var(--destructive, #dc2626)' }}>*</span>
            </Label>
            <Input
              id="section-name"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Ex: Hero Principal, CTA Conversão, Grid de Serviços"
            />
            <p data-slot="field-hint" className="">
              Escolha um nome descritivo para identificar esta seção
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="global"
                checked={isGlobal}
                onCheckedChange={(checked) => setIsGlobal(checked as boolean)}
              />
              <Label
                htmlFor="global"
                className="text-sm font-normal cursor-pointer"
              >
                Global (reutilizável em qualquer página)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={isPublished}
                onCheckedChange={(checked) => setIsPublished(checked as boolean)}
              />
              <Label
                htmlFor="published"
                className="text-sm font-normal cursor-pointer"
              >
                Publicado
              </Label>
            </div>
          </div>
        </div>

        {/* Section Builder */}
        <SectionBuilder 
          onChange={handleBuilderChange} 
          onConfigChange={handleConfigChange}
          config={config}
        />
      </div>
    </BaseModal>
  );
}

// ===== HELPER FUNCTIONS =====

/**
 * Gera um tipo único para a seção baseado nos elementos selecionados
 * ⚠️ IMPORTANTE: Sempre retorna 'unico' conforme Guidelines.md
 * O comportamento da seção é determinado por elements, layout e config
 */
function generateSectionType(elements: SectionElements): string {
  // ✅ Sistema unificado: todas as seções usam type = 'unico'
  // O comportamento é determinado pelos campos: elements, layout, config
  return 'unico';
}

/**
 * Gera configuração inicial baseada nos elementos
 */
function generateInitialConfig(
  elements: SectionElements,
  layout: SectionLayout,
  styling: SectionStyling
): any {
  const config: any = {};

  // Títulos
  if (elements.hasMainTitle) {
    config.title = 'Título Principal';
    config.titleTypographyId = null; // Será preenchido no editor
  }

  if (elements.hasMinorTitle) {
    config.minorTitle = 'Título Menor';
    config.minorTitleTypographyId = null;
  }

  if (elements.hasSubtitle) {
    config.subtitle = 'Subtítulo descritivo';
    config.subtitleTypographyId = null;
  }

  // Ícone
  if (elements.hasIcon) {
    config.icon = 'Sparkles';
    config.iconColor = '#ea526e';
  }

  // Botão
  if (elements.hasButton) {
    config.ctaButton = {
      label: 'Saiba Mais',
      url: '#',
      icon: 'ArrowRight',
    };
  }

  // Cards
  if (elements.hasCards) {
    config.cards = Array.from({ length: elements.cardCount }, (_, i) => ({
      id: `card-${i + 1}`,
      title: `Card ${i + 1}`,
      description: 'Descrição do card',
      icon: 'Sparkles',
    }));
  }

  // Mídia
  if (elements.hasMedia) {
    config.media = {
      type: elements.mediaType,
      url: '',
      alt: 'Imagem descritiva',
    };
  }

  // Background
  config.background = styling.background;

  // Spacing
  config.spacing = styling.spacing;

  return config;
}