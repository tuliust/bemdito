import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Plus, X, Pencil, ChevronDown, ChevronRight, GripVertical, Palette, Type, Image as ImageIcon } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getLucideIcon } from '../../../lib/utils/icons';
import { supabase } from '../../../lib/supabase/client';
import { ColorTokenPicker } from '../../components/ColorTokenPicker';
import { TypeScalePicker } from '../../components/admin/TypeScalePicker';
import { IconPicker } from '../../components/admin/IconPicker';
import { MediaUploader } from '../../components/admin/MediaUploader';
import { MegamenuContent } from '../../components/megamenu/MegamenuContent';
import { useDesignSystem } from '../../../lib/contexts/DesignSystemContext';
import { getTokenColor } from '../../../lib/utils/colors';
import { adminVar } from '../../components/admin/AdminThemeProvider';
import type { Database } from '../../../lib/supabase/client';

type DesignToken = Database['public']['Tables']['design_tokens']['Row'];

// ✨ NOVO: Interface para cards inline (sem banco)
interface InlineCard {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  url: string;
}

// ✨ NOVO: Interface para formatação compartilhada dos cards
interface SharedCardFormatting {
  titleFontSize?: string;
  titleColor?: string;
  subtitleFontSize?: string;
  iconSize?: string | number; // ✅ Aceita string (do input) ou number
  iconColor?: string;
  bgColor?: string;
  borderColor?: string;
}

interface MegamenuColumn {
  id: string;
  title: string;
  titleColor?: string;
  titleFontSize?: string;
  description?: string;
  descriptionColor?: string;
  descriptionFontSize?: string;
  mainTitle?: string;
  mainTitleColor?: string;
  mainTitleFontSize?: string;
  media_url?: string;
  // ✨ NOVO: Cards inline ao invés de card_ids
  inlineCards?: InlineCard[];
  // ✨ NOVO: Formatação compartilhada dos cards
  cardFormatting?: SharedCardFormatting;
}

interface MegamenuConfig {
  enabled: boolean;
  bgColor?: string;
  mediaPosition?: 'left' | 'right';
  column: MegamenuColumn;
}

interface MegamenuConfiguratorProps {
  config: MegamenuConfig | null;
  onChange: (config: MegamenuConfig) => void;
  activeTab?: 'general' | 'cards' | 'preview';
  labelText?: string;
  labelColor?: string;
}

export function MegamenuConfigurator({ 
  config, 
  onChange, 
  activeTab = 'general',
  labelText,
  labelColor 
}: MegamenuConfiguratorProps) {
  const [designTokens, setDesignTokens] = useState<DesignToken[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { getColor, colors } = useDesignSystem();

  useEffect(() => {
    loadDesignTokens();
  }, []);

  async function loadDesignTokens() {
    const { data } = await supabase
      .from('design_tokens')
      .select('*');

    if (data) {
      setDesignTokens(data);
    }
  }

  // Toggle card expandido/recolhido
  const toggleCardExpanded = (cardId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Config padrão com 1 coluna fixa
  const defaultConfig: MegamenuConfig = {
    enabled: true,
    bgColor: '#e5d4d4',
    mediaPosition: 'left',
    column: {
      id: 'col1',
      title: 'SOBRE A BEMDITO',
      titleColor: 'dark',
      titleFontSize: 'body-small',
      mainTitle: 'Conheça nossa história',
      mainTitleFontSize: 'heading-3',
      inlineCards: [],
      cardFormatting: {},
      media_url: '',
    },
  };

  const currentConfig = config || defaultConfig;
  const column = currentConfig.column || {
    id: 'col1',
    title: 'SOBRE A BEMDITO',
    titleColor: 'dark',
    titleFontSize: 'body-small',
    mainTitle: 'Conheça nossa história',
    mainTitleFontSize: 'heading-3',
    inlineCards: [],
    cardFormatting: {},
    media_url: '',
  };

  // Garantir que inlineCards existe
  const inlineCards = column.inlineCards || [];
  const cardFormatting = column.cardFormatting || {};

  const handleUpdateColumn = (updates: Partial<MegamenuColumn>) => {
    const newConfig = {
      ...currentConfig,
      column: {
        ...column,
        ...updates,
      },
    };
    onChange(newConfig);
  };

  // ✨ NOVO: Atualizar formatação compartilhada
  const handleUpdateFormatting = (updates: Partial<SharedCardFormatting>) => {
    handleUpdateColumn({
      cardFormatting: {
        ...cardFormatting,
        ...updates,
      },
    });
  };

  // ✨ NOVO: Adicionar novo card inline
  const handleAddCard = () => {
    const newCard: InlineCard = {
      id: `card-${Date.now()}`,
      icon: 'Star',
      title: '',
      subtitle: '',
      url: '',
    };
    handleUpdateColumn({
      inlineCards: [...inlineCards, newCard],
    });
  };

  // ✨ NOVO: Atualizar card inline
  const handleUpdateCard = (cardId: string, updates: Partial<InlineCard>) => {
    const updatedCards = inlineCards.map((card) =>
      card.id === cardId ? { ...card, ...updates } : card
    );
    handleUpdateColumn({ inlineCards: updatedCards });
  };

  // ✨ NOVO: Remover card inline
  const handleRemoveCard = (cardId: string) => {
    handleUpdateColumn({
      inlineCards: inlineCards.filter((card) => card.id !== cardId),
    });
  };

  const primaryColor = getColor('primary') ?? '#ea526e';
  const darkColor = getColor('dark') ?? '#020105';

  // ============================================================
  // RENDER: ABA PREVIEW (Apenas visual)
  // ============================================================
  if (activeTab === 'preview') {
    const previewConfig = {
      enabled: true,
      bgColor: currentConfig.bgColor || '#e5d4d4',
      mediaPosition: currentConfig.mediaPosition || 'left',
      columns: [{
        id: column.id,
        title: column.title,
        titleColor: column.titleColor,
        titleFontSize: column.titleFontSize,
        description: column.description,
        descriptionColor: column.descriptionColor,
        descriptionFontSize: column.descriptionFontSize,
        mainTitle: column.mainTitle,
        mainTitleColor: column.mainTitleColor,
        mainTitleFontSize: column.mainTitleFontSize,
        mainTitleFontWeight: 700,
        media_url: column.media_url,
        // ✨ Converter inline cards para formato do preview
        card_ids: [],
      }]
    };

    return (
      <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--admin-card-border, #e5e7eb)' }}>
        <MegamenuContent
          config={previewConfig as any}
          labelText={labelText}
          labelColor={labelColor}
        />
      </div>
    );
  }

  // ============================================================
  // RENDER: ABA GERAL
  // ============================================================
  if (activeTab === 'general') {
    // Estilos para preview dos textos
    const titleStyle = {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: getTokenColor(colors, column.titleColor, darkColor),
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
    };

    const mainTitleStyle = {
      fontSize: '2rem',
      fontWeight: 700,
      color: getTokenColor(colors, column.mainTitleColor, primaryColor),
      marginTop: '0.5rem',
    };

    const descriptionStyle = {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: getTokenColor(colors, column.descriptionColor, '#6b7280'),
      marginTop: '0.25rem',
    };

    return (
      <div className="space-y-6">
        {/* Card "Texto do Megamenu" */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            backgroundColor: 'var(--admin-card-bg, #ffffff)',
            border: '2px solid var(--admin-card-border, #e5e7eb)',
          }}
        >
          {/* Header do card */}
          <button
            type="button"
            onClick={() => toggleCardExpanded('text-megamenu')}
            className="w-full flex items-center justify-between cursor-pointer"
            style={{ transition: 'none' }}
          >
            <h3 className="text-lg font-semibold text-gray-900">Texto do Megamenu</h3>
            {expandedCards.has('text-megamenu') ? (
              <ChevronDown className="h-5 w-5" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
            ) : (
              <ChevronRight className="h-5 w-5" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
            )}
          </button>

          {/* Preview dos 3 campos - HIERARQUIA VISUAL CORRETA */}
          <div className="space-y-2">
            {/* 1. Chamada */}
            <div style={titleStyle}>
              {column.title || 'SOBRE A BEMDITO'}
            </div>
            {/* 2. Título Principal */}
            <div style={mainTitleStyle}>
              {column.mainTitle || 'Conheça nossa história'}
            </div>
            {/* 3. Descrição */}
            <div style={descriptionStyle}>
              {column.description || 'Descubra como transformamos ideias...'}
            </div>
          </div>

          {/* Campos editáveis quando expandido - HIERARQUIA VISUAL CORRETA */}
          {expandedCards.has('text-megamenu') && (
            <div className="space-y-6 pt-4">
              {/* 1️⃣ CHAMADA (title) - Pequeno, Uppercase */}
              <div className="space-y-4 pb-6 border-b" style={{ borderColor: 'var(--admin-collapsible-border, #e5e7eb)' }}>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">1. Chamada</Label>
                  <Input
                    value={column.title || ''}
                    onChange={(e) => handleUpdateColumn({ title: e.target.value })}
                    placeholder="SOBRE A BEMDITO"
                    className="font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TypeScalePicker
                    label="Tamanho da Fonte"
                    value={column.titleFontSize || ''}
                    onChange={(tokenId) => handleUpdateColumn({ titleFontSize: tokenId })}
                  />
                  <ColorTokenPicker
                    label="Cor"
                    value={column.titleColor || ''}
                    onChange={(tokenId) => handleUpdateColumn({ titleColor: tokenId })}
                    layout="compact"
                  />
                </div>
              </div>

              {/* 2️⃣ TÍTULO PRINCIPAL (mainTitle) - Grande, Destaque */}
              <div className="space-y-4 pb-6 border-b" style={{ borderColor: 'var(--admin-collapsible-border, #e5e7eb)' }}>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">2. Título Principal</Label>
                  <Input
                    value={column.mainTitle || ''}
                    onChange={(e) => handleUpdateColumn({ mainTitle: e.target.value })}
                    placeholder="Conheça nossa história"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TypeScalePicker
                    label="Tamanho da Fonte"
                    value={column.mainTitleFontSize || ''}
                    onChange={(tokenId) => handleUpdateColumn({ mainTitleFontSize: tokenId })}
                  />
                  <ColorTokenPicker
                    label="Cor"
                    value={column.mainTitleColor || ''}
                    onChange={(tokenId) => handleUpdateColumn({ mainTitleColor: tokenId })}
                    layout="compact"
                  />
                </div>
              </div>

              {/* 3️⃣ DESCRIÇÃO (description) - Pequeno, Discreto */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">3. Descrição</Label>
                  <Input
                    value={column.description || ''}
                    onChange={(e) => handleUpdateColumn({ description: e.target.value })}
                    placeholder="Descubra como transformamos ideias em soluções digitais inovadoras"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TypeScalePicker
                    label="Tamanho da Fonte"
                    value={column.descriptionFontSize || ''}
                    onChange={(tokenId) => handleUpdateColumn({ descriptionFontSize: tokenId })}
                  />
                  <ColorTokenPicker
                    label="Cor"
                    value={column.descriptionColor || ''}
                    onChange={(tokenId) => handleUpdateColumn({ descriptionColor: tokenId })}
                    layout="compact"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER: ABA CARDS - SISTEMA PROGRESSIVO DE 4 CARDS
  // ============================================================
  return (
    <div className="space-y-6">
      {/* 1️⃣ Formatação Compartilhada dos Cards */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          backgroundColor: 'var(--admin-card-bg, #ffffff)',
          border: '2px solid var(--admin-card-border, #e5e7eb)',
        }}
      >
        <h3 className="text-lg font-semibold text-gray-900">Formatação dos Cards</h3>
        <p className="text-sm text-gray-500">
          Esta formatação será aplicada em todos os cards abaixo
        </p>

        <div className="space-y-4 pt-4">
          {/* Linha 1: Título */}
          <div className="grid grid-cols-2 gap-4">
            <TypeScalePicker
              label="Tamanho do Título"
              value={cardFormatting.titleFontSize || ''}
              onChange={(tokenId) => handleUpdateFormatting({ titleFontSize: tokenId })}
            />
            <ColorTokenPicker
              label="Cor do Título"
              value={cardFormatting.titleColor || ''}
              onChange={(tokenId) => handleUpdateFormatting({ titleColor: tokenId })}
              layout="compact"
            />
          </div>

          {/* Linha 2: Subtítulo e Ícone */}
          <div className="grid grid-cols-2 gap-4">
            <TypeScalePicker
              label="Tamanho do Subtítulo"
              value={cardFormatting.subtitleFontSize || ''}
              onChange={(tokenId) => handleUpdateFormatting({ subtitleFontSize: tokenId })}
            />
            <div>
              <Label className="mb-2">Tamanho do Ícone</Label>
              <div className="relative">
                <Input
                  type="number"
                  min="12"
                  max="64"
                  value={cardFormatting.iconSize || '28'}
                  onChange={(e) => handleUpdateFormatting({ iconSize: e.target.value })}
                  className="pr-12"
                  placeholder="28"
                />
                <span 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}
                >
                  px
                </span>
              </div>
            </div>
          </div>

          {/* Linha 3: Cor do Ícone e Fundo */}
          <div className="grid grid-cols-2 gap-4">
            <ColorTokenPicker
              label="Cor do Ícone"
              value={cardFormatting.iconColor || ''}
              onChange={(tokenId) => handleUpdateFormatting({ iconColor: tokenId })}
              layout="compact"
            />
            <ColorTokenPicker
              label="Cor de Fundo"
              value={cardFormatting.bgColor || ''}
              onChange={(tokenId) => handleUpdateFormatting({ bgColor: tokenId })}
              layout="compact"
            />
          </div>

          {/* Linha 4: Borda */}
          <div className="grid grid-cols-2 gap-4">
            <ColorTokenPicker
              label="Cor da Borda"
              value={cardFormatting.borderColor || ''}
              onChange={(tokenId) => handleUpdateFormatting({ borderColor: tokenId })}
              layout="compact"
            />
            <div></div> {/* Espaço vazio para manter grid 2 colunas */}
          </div>
        </div>
      </div>

      {/* 2️⃣ Cards Inline (Sistema Progressivo) */}
      <div className="space-y-4">
        {/* Card 1 - Sempre visível */}
        {renderInlineCard(0)}

        {/* Card 2 - Só aparece se Card 1 foi preenchido */}
        {inlineCards.length > 0 && inlineCards[0].title && renderInlineCard(1)}

        {/* Card 3 - Só aparece se Card 2 foi preenchido */}
        {inlineCards.length > 1 && inlineCards[1].title && renderInlineCard(2)}

        {/* Card 4 - Só aparece se Card 3 foi preenchido */}
        {inlineCards.length > 2 && inlineCards[2].title && renderInlineCard(3)}

        {/* Botão adicionar (se não houver card na posição) */}
        {inlineCards.length < 4 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddCard}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Card {inlineCards.length + 1}
          </Button>
        )}
      </div>
    </div>
  );

  // ============================================================
  // HELPER: Renderizar Card Inline Individual
  // ============================================================
  function renderInlineCard(index: number) {
    const card = inlineCards[index];
    const isExpanded = card && expandedCards.has(card.id);

    // Se não existe, retornar null
    if (!card) return null;

    return (
      <div
        key={card.id}
        className="rounded-2xl p-6 space-y-4"
        style={{
          backgroundColor: 'var(--admin-card-bg, #ffffff)',
          border: '2px solid var(--admin-card-border, #e5e7eb)',
        }}
      >
        {/* Header do card */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => toggleCardExpanded(card.id)}
            className="flex items-center gap-3 flex-1 cursor-pointer text-left"
            style={{ transition: 'none' }}
          >
            {/* Ícone do card */}
            <div className="flex-shrink-0">
              {getLucideIcon(card.icon, 'h-6 w-6 text-gray-600')}
            </div>

            {/* Preview do título */}
            <div className="flex-1">
              <h4 className="text-base font-semibold text-gray-900">
                {card.title || `Card ${index + 1}`}
              </h4>
              {card.subtitle && (
                <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
              )}
            </div>

            {/* Ícone de expandir/recolher */}
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
            ) : (
              <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
            )}
          </button>

          {/* Botão remover */}
          <button
            type="button"
            onClick={() => handleRemoveCard(card.id)}
            className="ml-2 p-2 rounded flex-shrink-0"
            style={{
              transition: 'none',
              color: 'var(--admin-delete-btn-text, #dc2626)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = 'var(--admin-delete-btn-hover-bg, #fef2f2)';
              el.style.color = 'var(--admin-delete-btn-hover-text, #b91c1c)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = 'transparent';
              el.style.color = 'var(--admin-delete-btn-text, #dc2626)';
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Campos editáveis quando expandido */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--admin-card-border, #e5e7eb)' }}>
            {/* Ícone */}
            <div>
              <Label>Ícone</Label>
              <IconPicker
                value={card.icon}
                onChange={(icon) => handleUpdateCard(card.id, { icon })}
              />
            </div>

            {/* Título */}
            <div>
              <Label>Título</Label>
              <Input
                value={card.title}
                onChange={(e) => handleUpdateCard(card.id, { title: e.target.value })}
                placeholder={`Título do Card ${index + 1}`}
              />
            </div>

            {/* Subtítulo */}
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={card.subtitle}
                onChange={(e) => handleUpdateCard(card.id, { subtitle: e.target.value })}
                placeholder="Subtítulo opcional"
              />
            </div>

            {/* URL */}
            <div>
              <Label>URL de Destino</Label>
              <Input
                value={card.url}
                onChange={(e) => handleUpdateCard(card.id, { url: e.target.value })}
                placeholder="/pagina-destino"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
