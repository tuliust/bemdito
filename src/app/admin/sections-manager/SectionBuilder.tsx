import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { 
  Type, 
  Heading1, 
  Heading2, 
  Sparkles, 
  MousePointerClick, 
  LayoutGrid,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layout as LayoutIcon,
  Check,
  FileText,
  Video,
  Grid2X2,
  FileEdit,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
} from 'lucide-react';
import { GridLayoutEditor } from './GridLayoutEditor';
import { IconField, TextField, TextAreaField } from './CompactFieldEditor';
import { IconPicker } from '@/app/components/admin/IconPicker';
import { ColorTokenPicker } from '@/app/components/ColorTokenPicker';
import { MediaUploader } from '@/app/components/admin/MediaUploader';
import { adminVar } from '@/app/components/admin/AdminThemeProvider';

// ============================================
// TIPOS E INTERFACES
// ============================================

interface SectionElements {
  hasMainTitle: boolean;
  hasMinorTitle: boolean;
  hasSubtitle: boolean;
  hasIcon: boolean;
  hasButton: boolean;
  hasCards: boolean;
  hasMedia: boolean;
  cardCount: number;
  mediaType: 'image' | 'video' | null;
  mediaDisplayMode?: 'contida' | 'cobrir' | 'ajustada' | 'adaptada' | 'alinhada'; // ✅ ATUALIZADO 2026-02-17: Adicionado "adaptada" (se adapta à altura do texto)
}

// Grid 2x2: Posições possíveis
type GridPosition = 
  | 'top-left'      // Topo Esquerda
  | 'top-right'     // Topo Direita
  | 'top-center'    // Topo Centro (ocupa 2 colunas)
  | 'bottom-left'   // Baixo Esquerda
  | 'bottom-right'  // Baixo Direita
  | 'bottom-center' // Baixo Centro (ocupa 2 colunas)
  | 'middle-left'   // Meio Esquerda (ocupa 2 linhas)
  | 'middle-right'  // Meio Direita (ocupa 2 linhas)
  | 'center';       // Centro Total (ocupa grid inteiro)

interface SectionLayout {
  desktop: {
    text?: GridPosition;   // Posição do grupo de texto
    media?: GridPosition;  // Posição da mídia
    cards?: GridPosition;  // Posição dos cards
    textAlign?: 'left' | 'center' | 'right';  // ✅ Alinhamento horizontal interno do texto
    verticalAlign?: 'top' | 'center' | 'bottom';  // ✅ NOVO: Alinhamento vertical do texto
  };
  mobile: {
    textAlign: 'left' | 'center' | 'right';
    // ❌ REMOVIDO: stack (sempre será vertical no mobile)
  };
}

interface SectionStyling {
  height: 'auto' | '25vh' | '50vh' | '100vh';
  background: {
    type: 'color' | 'gradient' | 'image' | 'none';
    value: string;
    colorTokenId?: string;
  };
  spacing: {
    top: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    bottom: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    left: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    right: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  };
}

interface SectionBuilderProps {
  elements?: SectionElements;
  layout?: SectionLayout;
  styling?: SectionStyling;
  onChange: (elements: SectionElements, layout: SectionLayout, styling: SectionStyling) => void;
  // ✅ NOVO: Receber valores de configuração para preencher os campos
  config?: {
    icon?: string;
    iconColor?: string;
    iconSize?: number;
    smallTitle?: string;
    title?: string;
    subtitle?: string;
    buttonLabel?: string;
    buttonUrl?: string;
    rowHeightPriority?: 'content' | 'media';
    rowPriority?: 'row1' | 'row2' | 'equal';
    cardDisplayMode?: 'normal' | 'compact';
    gridRows?: number;
    gridCols?: number;  // ✅ NOVO: Colunas do grid
    ctaButton?: {
      label?: string;
      url?: string;
      hasIcon?: boolean;
      icon?: string;
      iconSize?: number;
      iconColor?: string;
      iconEffect?: 'none' | 'slide-down' | 'slide-right' | 'slide-left' | 'slide-up' | 'pulse' | 'fade';
    };
  };
  onConfigChange?: (config: any) => void;
  // ✅ NOVO: Props para gerenciar páginas e seções
  pages?: any[];
  selectedPageId?: string;
  pageSections?: any[];
  selectedSectionId?: string;
  onPageIdChange?: (pageId: string) => void;
  onSectionIdChange?: (sectionId: string) => void;
}

// ============================================
// VALIDAÇÃO DE CONFIGURAÇÃO
// ============================================

function validateSectionConfig(config: {
  rowHeightPriority?: 'content' | 'media';
  rowPriority?: 'row1' | 'row2' | 'equal';
  cardDisplayMode?: 'normal' | 'compact';
  gridRows?: number;
  gridCols?: number;  // ✅ NOVO: Colunas do grid
  heightMode?: string;
  elements?: SectionElements;
  layout?: SectionLayout;
}): string[] {
  const warnings: string[] = [];
  
  // Conflito 1: rowHeightPriority com altura fixa
  if (config.rowHeightPriority && config.heightMode !== 'auto') {
    warnings.push(
      `⚠️ rowHeightPriority será ignorado com heightMode "${config.heightMode}". ` +
      'Esta configuração só funciona com altura "Auto".'
    );
  }
  
  // Conflito 2: rowHeightPriority sem texto ou mídia
  if (config.rowHeightPriority && config.elements) {
    const hasText = config.elements.hasIcon || config.elements.hasMinorTitle || 
                    config.elements.hasMainTitle || config.elements.hasSubtitle || 
                    config.elements.hasButton;
    const hasMedia = config.elements.hasMedia;
    
    if (!hasText || !hasMedia) {
      warnings.push(
        '⚠️ rowHeightPriority requer texto E mídia na seção. ' +
        'Sem ambos os elementos, esta configuração não terá efeito.'
      );
    }
  }
  
  // Conflito 3: rowPriority com altura auto ou grid 1 linha
  if (config.rowPriority && config.rowPriority !== 'equal') {
    if (config.heightMode === 'auto') {
      warnings.push(
        '⚠️ rowPriority não tem efeito com altura "Auto". ' +
        'Use altura fixa (25vh, 50vh ou 100vh) para priorizar linhas.'
      );
    }
    if (config.gridRows !== 2) {
      warnings.push(
        '⚠️ rowPriority só funciona com grid de 2 linhas. ' +
        'Configure o grid para 2 linhas para usar esta funcionalidade.'
      );
    }
  }
  
  // Conflito 4: Modo contida com texto na mesma linha (aviso informativo)
  if (config.elements?.mediaDisplayMode === 'contida' && config.layout?.desktop) {
    const textPos = config.layout.desktop.text;
    const mediaPos = config.layout.desktop.media;
    
    if (textPos && mediaPos) {
      // Verificar se estão na mesma linha (simplificado)
      const textIsTop = textPos.includes('top');
      const mediaIsTop = mediaPos.includes('top');
      const textIsBottom = textPos.includes('bottom');
      const mediaIsBottom = mediaPos.includes('bottom');
      
      if ((textIsTop && mediaIsTop) || (textIsBottom && mediaIsBottom)) {
        warnings.push(
          '💡 Modo "contida" com texto na mesma linha força ajuste da mídia ao texto. ' +
          'Este é o comportamento esperado (prioridade máxima).'
        );
      }
    }
  }
  
  return warnings;
}

// ============================================
// VALORES PADRÃO
// ============================================

const defaultElements: SectionElements = {
  hasMainTitle: true,
  hasMinorTitle: false,
  hasSubtitle: false,
  hasIcon: false,
  hasButton: false,
  hasCards: false,
  hasMedia: false,
  cardCount: 0,
  mediaType: null,
  mediaDisplayMode: 'ajustada', // Padrão: Contida Otimizada
};

const defaultLayout: SectionLayout = {
  desktop: {
    text: 'top-center',
    media: undefined,
    cards: undefined,
    textAlign: 'center', // ✅ NOVO: Alinhamento interno padrão
    verticalAlign: 'center', // ✅ NOVO: Alinhamento vertical padrão
  },
  mobile: {
    textAlign: 'center',
    // ❌ REMOVIDO: stack (sempre será vertical no mobile)
  },
};

const defaultStyling: SectionStyling = {
  height: 'auto',
  background: {
    type: 'color',
    value: '#ffffff',
  },
  spacing: {
    top: 'none', // ✅ Padding-top = 0
    bottom: 'lg',
    left: 'md',
    right: 'md',
  },
};

// ============================================
// COMPONENTE: BOTÃO DE TOGGLE
// ============================================

function ToggleButton({ 
  icon, 
  label, 
  active, 
  onClick,
  className = ''
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        transition: 'none',
        animation: 'none',
        boxShadow: 'none',
        backgroundColor: active ? 'var(--primary, #ea526e)' : 'var(--admin-card-bg, #ffffff)',
        color: active ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
        borderColor: active ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
      }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 ${className}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {active && <Check className="h-4 w-4 ml-auto" />}
    </button>
  );
}

// ============================================
// COMPONENTE PRINCIPAL: SECTION BUILDER
// ============================================
// (GridPositionSelector descontinuado 2026-02-14 — removido 2026-02-21)



// ✅ FUNÇÃO AUXILIAR: Migrar layout legado para grid 2x2
function migrateLayoutToGrid(layout: any): SectionLayout {
  if (!layout) return defaultLayout;
  
  // Se já estiver no formato novo (GridPosition), retornar como está
  if (
    typeof layout.desktop?.text === 'string' && 
    !layout.desktop?.text?.includes?.('row')
  ) {
    return layout as SectionLayout;
  }
  
  // ========== MIGRAÇÃO: FORMATO LEGADO → GRID 2x2 ==========
  const migratedLayout: SectionLayout = {
    desktop: {},
    mobile: {
      textAlign: layout.mobile?.textAlign || 'center',
    },
  };
  
  // Migrar cada elemento
  for (const [key, value] of Object.entries(layout.desktop || {})) {
    if (typeof value === 'object' && value !== null) {
      // ✅ CORREÇÃO (2026-02-17): Validar se objeto não está vazio
      const legacyPos = value as { row?: string; horizontal?: string; position?: string };
      
      // Se objeto vazio, pular
      if (Object.keys(legacyPos).length === 0) {
        console.warn(`⚠️ [SectionBuilder] Objeto vazio em layout.desktop.${key}, pulando migração`);
        continue;
      }
      
      // ✅ NOVO (2026-02-17): Se já tem campo "position", usar diretamente
      if (legacyPos.position) {
        (migratedLayout.desktop as any)[key] = legacyPos.position;
        continue;
      }
      
      const gridPos = convertLegacyToGrid(legacyPos);
      if (gridPos) {
        (migratedLayout.desktop as any)[key] = gridPos;
      }
    }
  }
  
  return migratedLayout;
}

// ✅ FUNÇÃO: Converter posição legada para grid 2x2
function convertLegacyToGrid(legacy: { row?: string; horizontal?: string }): GridPosition | undefined {
  const { row, horizontal } = legacy;
  
  // ✅ CORREÇÃO (2026-02-17): Validar se row e horizontal existem
  if (!row || !horizontal) {
    console.warn(`⚠️ [SectionBuilder] Posição legada inválida (campos ausentes):`, legacy);
    return undefined;
  }
  
  // Mapear combinações row + horizontal → GridPosition
  const mapping: Record<string, GridPosition> = {
    'single-left': 'middle-left',
    'single-center': 'center',
    'single-right': 'middle-right',
    'top-left': 'top-left',
    'top-center': 'top-center',
    'top-right': 'top-right',
    'bottom-left': 'bottom-left',
    'bottom-center': 'bottom-center',
    'bottom-right': 'bottom-right',
    'both-left': 'middle-left',
    'both-center': 'center',
    'both-right': 'middle-right',
  };
  
  const key = `${row}-${horizontal}`;
  const result = mapping[key];
  
  if (!result) {
    console.warn(`⚠️ [SectionBuilder] Posição legada não mapeada: ${key}`);
  }
  
  return result;
}

export function SectionBuilder({ 
  elements: initialElements, 
  layout: initialLayout,
  styling: initialStyling,
  onChange,
  config,
  onConfigChange,
  pages = [],
  selectedPageId = '',
  pageSections = [],
  selectedSectionId = '',
  onPageIdChange,
  onSectionIdChange,
}: SectionBuilderProps) {
  // ✅ Migrar layout ao inicializar
  const migratedLayout = migrateLayoutToGrid(initialLayout);
  
  const [elements, setElements] = useState<SectionElements>(initialElements || defaultElements);
  const [layout, setLayout] = useState<SectionLayout>(migratedLayout);
  const [styling, setStyling] = useState<SectionStyling>(initialStyling || defaultStyling);

  // ✅ CORREÇÃO 2026-02-17: Sincronizar estado local quando elements prop mudar
  useEffect(() => {
    if (initialElements) {
      setElements(initialElements);
    }
  }, [initialElements]);

  // ✅ NOVO: Sincronizar estado local quando props mudam (importante para re-render dos botões)
  useEffect(() => {
    const newMigratedLayout = migrateLayoutToGrid(initialLayout);
    setLayout(newMigratedLayout);
  }, [initialLayout]);

  // ✅ NOVO (2026-02-17): Sincronizar campos de mídia quando config.media mudar
  // Isso garante que ao trocar de aba e voltar, os campos estejam preenchidos
  // Sincroniza campos de mídia quando config.media mudar
  useEffect(() => {
    // Intencional: sincronizar estado de exibição quando config.media mudar
  }, [config?.media]);

  const updateElements = (updates: Partial<SectionElements>) => {
    const newElements = { ...elements, ...updates };
    setElements(newElements);
    onChange(newElements, layout, styling);
  };

  const updateLayout = (updates: Partial<SectionLayout>) => {
    const newLayout = { 
      ...layout, 
      ...updates,
      desktop: {
        ...layout.desktop,
        ...(updates.desktop || {})
      }
    };
    setLayout(newLayout);
    onChange(elements, newLayout, styling);
  };

  const updateStyling = (updates: Partial<SectionStyling>) => {
    const newStyling = { ...styling, ...updates };
    setStyling(newStyling);
    onChange(elements, layout, newStyling);
  };

  // Verificar se algum elemento de texto está selecionado
  const hasAnyTextElement = elements.hasIcon || elements.hasMinorTitle || elements.hasMainTitle || elements.hasSubtitle || elements.hasButton;

  // Função para atualizar configurações
  const updateConfig = (updates: Partial<SectionBuilderProps['config']>) => {
    const newConfig = { ...config, ...updates };
    onConfigChange && onConfigChange(newConfig);
  };

  return (
    <div className="space-y-6">
      {/* ===== 1. ALTURA DA SEÇÃO ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontSize: adminVar('item-title-list', 'size'), fontWeight: adminVar('item-title-list', 'weight'), color: adminVar('item-title-list', 'color') }}>
            <LayoutIcon className="h-5 w-5" style={{ color: 'var(--primary, #ea526e)' }} />
            1. Altura da Seção
          </CardTitle>
          <CardDescription>
            Define a altura total da seção no desktop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'auto' as const, label: 'Auto', description: 'Ajusta ao conteúdo' },
                { value: '25vh' as const, label: '25%', description: '1/4 da tela' },
                { value: '50vh' as const, label: '50%', description: 'Metade da tela' },
                { value: '100vh' as const, label: '100%', description: 'Tela inteira' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateStyling({ height: option.value })}
                  style={{
                    transition: 'none',
                    animation: 'none',
                    boxShadow: 'none',
                    backgroundColor: styling.height === option.value ? 'var(--primary, #ea526e)' : 'var(--admin-card-bg, #ffffff)',
                    color: styling.height === option.value ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                    borderColor: styling.height === option.value ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                  }}
                  className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg border-2 font-medium"
                >
                  <span className="text-lg font-bold">{option.label}</span>
                  <span className="text-[10px] opacity-70 text-center">{option.description}</span>
                </button>
              ))}
            </div>

            {/* Padding e Margens — 4 colunas: Superior | Inferior | Esquerda | Direita */}
            <div className="grid grid-cols-4 gap-3">
              {([
                { label: 'Superior', key: 'top',    val: styling?.spacing?.top    || '50px' },
                { label: 'Inferior', key: 'bottom', val: styling?.spacing?.bottom || '50px' },
                { label: 'Esquerda', key: 'left',   val: styling?.spacing?.left   || '50px' },
                { label: 'Direita',  key: 'right',  val: styling?.spacing?.right  || '50px' },
              ] as { label: string; key: string; val: string }[]).map(({ label, key, val }) => (
                <div key={key}>
                  <Label className="mb-2 block">{label}</Label>
                  <select
                    value={(() => {
                      if (val === 'none') return '0px';
                      if (val === 'sm')   return '25px';
                      if (val === 'md')   return '50px';
                      if (val === 'lg')   return '75px';
                      if (val === 'xl')   return '100px';
                      return val;
                    })()}
                    onChange={(e) => updateStyling({ spacing: { ...(styling?.spacing || {}), [key]: e.target.value } })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-primary hover:bg-gray-50 text-sm text-gray-600"
                    style={{ transition: 'none' }}
                  >
                    <option value="0px">0px</option>
                    <option value="25px">25px</option>
                    <option value="50px">50px (padrão)</option>
                    <option value="75px">75px</option>
                    <option value="100px">100px</option>
                    <option value="125px">125px</option>
                    <option value="150px">150px</option>
                    <option value="175px">175px</option>
                    <option value="200px">200px</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Gap — 2 colunas: entre colunas | entre linhas */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              {([
                { label: 'Gap (entre colunas)', key: 'gap',    val: styling?.spacing?.gap    || '50px' },
                { label: 'Gap (entre linhas)',  key: 'rowGap', val: styling?.spacing?.rowGap || '50px' },
              ] as { label: string; key: string; val: string }[]).map(({ label, key, val }) => (
                <div key={key}>
                  <Label className="mb-2 block">{label}</Label>
                  <select
                    value={val}
                    onChange={(e) => updateStyling({ spacing: { ...(styling?.spacing || {}), [key]: e.target.value } })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-primary hover:bg-gray-50 text-sm text-gray-600"
                    style={{ transition: 'none' }}
                  >
                    <option value="0px">0px</option>
                    <option value="25px">25px</option>
                    <option value="50px">50px (padrão)</option>
                    <option value="75px">75px</option>
                    <option value="100px">100px</option>
                    <option value="125px">125px</option>
                    <option value="150px">150px</option>
                    <option value="175px">175px</option>
                    <option value="200px">200px</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== 1.5 CONFIGURAÇÕES AVANÇADAS DE ALTURA ===== */}
      {/* ✅ MOVIDO PARA ABA PREVIEW - Conteúdo removido */}

      {/* ===== 2. ELEMENTOS DA SEÇÃO (TOGGLES) ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontSize: adminVar('item-title-list', 'size'), fontWeight: adminVar('item-title-list', 'weight'), color: adminVar('item-title-list', 'color') }}>
            <Sparkles className="h-5 w-5" style={{ color: 'var(--primary, #ea526e)' }} />
            2. Elementos da Seção
          </CardTitle>
          <CardDescription>
            Selecione quais elementos estarão presentes nesta seção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {/* Texto/Ícone */}
            <ToggleButton
              icon={<Type className="h-5 w-5" />}
              label="Texto/Ícone"
              active={hasAnyTextElement}
              onClick={() => {
                // Toggle todos os elementos de texto de uma vez
                const newState = !hasAnyTextElement;
                updateElements({
                  hasIcon: newState,
                  hasMinorTitle: newState,
                  hasMainTitle: newState,
                  hasSubtitle: newState,
                  hasButton: newState,
                });
              }}
              className="h-24"
            />
            
            {/* Cards */}
            <ToggleButton
              icon={<LayoutGrid className="h-5 w-5" />}
              label="Cards"
              active={elements.hasCards}
              onClick={() => {
                const hasCards = !elements.hasCards;
                
                // ✅ CORREÇÃO CRÍTICA 2026-02-17: Atualizar elementos E layout em UMA ÚNICA chamada
                const newElements = { ...elements, hasCards };
                
                // Definir posição inicial se ativado e não existir
                const newLayout = hasCards && !layout.desktop.cards 
                  ? {
                      ...layout,
                      desktop: {
                        ...layout.desktop,
                        cards: 'bottom-center',
                      }
                    }
                  : layout;
                
                // ✅ Atualizar estados locais
                setElements(newElements);
                if (hasCards && !layout.desktop.cards) {
                  setLayout(newLayout);
                }
                
                // ✅ Chamar onChange UMA ÚNICA VEZ com os valores corretos
                onChange(newElements, newLayout, styling);
              }}
              className="h-24"
            />
            
            {/* Mídia */}
            <ToggleButton
              icon={<ImageIcon className="h-5 w-5" />}
              label="Mídia"
              active={elements.hasMedia}
              onClick={() => {
                const hasMedia = !elements.hasMedia;
                updateElements({ 
                  hasMedia,
                  mediaType: hasMedia ? 'image' : null,
                  mediaDisplayMode: hasMedia ? 'ajustada' : undefined,
                });
                // ✅ Definir posição inicial se ativado
                if (hasMedia && !layout.desktop.media) {
                  updateLayout({
                    desktop: {
                      ...layout.desktop,
                      media: 'top-right',
                    }
                  });
                }
              }}
              className="h-24"
            />
            
            {/* BG (Background) */}
            <ToggleButton
              icon={<ImageIcon className="h-5 w-5" />}
              label="BG"
              active={styling?.background?.type !== 'none'}
              onClick={() => {
                const hasBg = styling?.background?.type === 'none';
                updateStyling({
                  background: {
                    type: hasBg ? 'color' : 'none',
                    value: hasBg ? '#f6f6f6' : '',
                  }
                });
              }}
              className="h-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* ===== 2.5 CONFIGURAÇÃO DE MÍDIA ===== */}
      {elements.hasMedia && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ fontSize: adminVar('item-title-list', 'size'), fontWeight: adminVar('item-title-list', 'weight'), color: adminVar('item-title-list', 'color') }}>
              <ImageIcon className="h-5 w-5" style={{ color: 'var(--primary, #ea526e)' }} />
              2.5 Configuração de Mídia
            </CardTitle>
            <CardDescription>
              Configure o upload, modo de exibição e alinhamento da mídia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload de Mídia */}
            <MediaUploader
              label="Mídia (Imagem/Vídeo)"
              value={config?.mediaUrl || ''}
              onChange={(url) => {
                onConfigChange && onConfigChange({ ...config, mediaUrl: url });
              }}
              accept="image/*,video/*"
              maxSizeMB={10}
            />

            {/* Modo de Exibição (fitMode) */}
            <div className="space-y-2">
              <Label>Modo de Exibição</Label>
              <select
                value={config?.media?.fitMode || 'ajustada'}
                onChange={(e) => {
                  const fitMode = e.target.value;
                  onConfigChange && onConfigChange({ 
                    ...config, 
                    media: { 
                      ...config?.media, 
                      fitMode 
                    } 
                  });
                }}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-primary hover:bg-gray-50 text-sm text-gray-600 focus:outline-none"
                style={{ transition: 'none' }}
              >
                <option value="cobrir">📦 Cobrir (Cover) - Preenche área, com cortes</option>
                <option value="ajustada">🖼️ Ajustada (Contain) - Exibe inteira, pode ter espaço</option>
                <option value="contida">🎯 Contida (Natural) - Tamanho real da imagem</option>
                <option value="adaptada">📐 Adaptada - Se adapta à altura do texto</option>
                <option value="alinhada">✨ Alinhada - Cola nas bordas (use alignX/Y abaixo)</option>
              </select>
            </div>

            {/* Alinhamento Horizontal (alignX) - Apenas para modo "alinhada" */}
            {config?.media?.fitMode === 'alinhada' && (
              <>
                <div className="space-y-2">
                  <Label>Alinhamento Horizontal</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['left', 'center', 'right'].map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => {
                          onConfigChange && onConfigChange({ 
                            ...config, 
                            media: { 
                              ...config?.media, 
                              alignX: align 
                            } 
                          });
                        }}
                        style={{
                          transition: 'none', animation: 'none', boxShadow: 'none',
                          backgroundColor: config?.media?.alignX === align ? 'var(--primary, #ea526e)' : 'var(--admin-card-bg, #ffffff)',
                          color: config?.media?.alignX === align ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                          borderColor: config?.media?.alignX === align ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                        }}
                        className="flex flex-col items-center gap-2 px-3 py-3 rounded-lg border-2"
                      >
                        {align === 'left' && <AlignLeft className="h-4 w-4" />}
                        {align === 'center' && <AlignCenter className="h-4 w-4" />}
                        {align === 'right' && <AlignRight className="h-4 w-4" />}
                        <span className="text-xs font-medium capitalize">{align === 'left' ? 'Esquerda' : align === 'center' ? 'Centro' : 'Direita'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alinhamento Vertical (alignY) */}
                <div className="space-y-2">
                  <Label>Alinhamento Vertical</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['top', 'center', 'bottom'].map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => {
                          onConfigChange && onConfigChange({ 
                            ...config, 
                            media: { 
                              ...config?.media, 
                              alignY: align 
                            } 
                          });
                        }}
                        style={{
                          transition: 'none', animation: 'none', boxShadow: 'none',
                          backgroundColor: config?.media?.alignY === align ? 'var(--primary, #ea526e)' : 'var(--admin-card-bg, #ffffff)',
                          color: config?.media?.alignY === align ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                          borderColor: config?.media?.alignY === align ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                        }}
                        className="flex flex-col items-center gap-2 px-3 py-3 rounded-lg border-2"
                      >
                        {align === 'top' && <AlignVerticalJustifyStart className="h-4 w-4" />}
                        {align === 'center' && <AlignVerticalJustifyCenter className="h-4 w-4" />}
                        {align === 'bottom' && <AlignVerticalJustifyEnd className="h-4 w-4" />}
                        <span className="text-xs font-medium capitalize">{align === 'top' ? 'Topo' : align === 'center' ? 'Centro' : 'Baixo'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Preview da Configuração Atual */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 font-medium mb-1">📊 Configuração Atual:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Modo: <strong>{config?.media?.fitMode || 'ajustada'}</strong></li>
                {config?.media?.fitMode === 'alinhada' && (
                  <>
                    <li>• Horizontal: <strong>{config?.media?.alignX || 'não definido'}</strong></li>
                    <li>• Vertical: <strong>{config?.media?.alignY || 'não definido'}</strong></li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== 3. CONTEÚDO ===== */}
      {hasAnyTextElement && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ fontSize: adminVar('item-title-list', 'size'), fontWeight: adminVar('item-title-list', 'weight'), color: adminVar('item-title-list', 'color') }}>
              <FileEdit className="h-5 w-5" style={{ color: 'var(--primary, #ea526e)' }} />
              3. Conteúdo
            </CardTitle>
            <CardDescription>
              Configure os textos e estilos da seção
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 1) Ícone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Ícone</Label>
                <button
                  type="button"
                  onClick={() => updateElements({ hasIcon: !elements.hasIcon })}
                  className="px-3 py-1 rounded-md text-xs font-medium"
                  style={{
                    transition: 'none',
                    backgroundColor: elements.hasIcon ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-bg, #f9fafb)',
                    color: elements.hasIcon ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                  }}
                >
                  {elements.hasIcon ? 'Ativado' : 'Desativado'}
                </button>
              </div>
              {elements.hasIcon && (
                <IconField
                  icon={config?.icon || ''}
                  iconColor={config?.iconColor || '#ea526e'}
                  iconSize={config?.iconSize || 48}
                  onIconChange={(icon) => {
                    onConfigChange && onConfigChange({ ...config, icon });
                  }}
                  onColorChange={(color) => {
                    onConfigChange && onConfigChange({ ...config, iconColor: color });
                  }}
                  onSizeChange={(size) => {
                    onConfigChange && onConfigChange({ ...config, iconSize: size });
                  }}
                />
              )}
            </div>

            {/* 2) Títulos */}
            <div className="space-y-3">
              <Label>Títulos</Label>
              
              {/* Chamada (PRIMEIRO - acima do título principal) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Chamada</Label>
                  <button
                    type="button"
                    onClick={() => updateElements({ hasMinorTitle: !elements.hasMinorTitle })}
                    className="px-3 py-1 rounded-md text-xs font-medium"
                    style={{
                      transition: 'none',
                      backgroundColor: elements.hasMinorTitle ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-bg, #f9fafb)',
                      color: elements.hasMinorTitle ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                    }}
                  >
                    {elements.hasMinorTitle ? 'Ativado' : 'Desativado'}
                  </button>
                </div>
                {elements.hasMinorTitle && (
                  <input
                    type="text"
                    value={config?.smallTitle || ''}
                    placeholder="Ex: Bem-vindo"
                    onChange={(e) => {
                      onConfigChange && onConfigChange({ ...config, smallTitle: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: 'var(--admin-field-bg, #ffffff)',
                      border: '2px solid var(--admin-field-border, #e5e7eb)',
                      color: 'var(--admin-field-text, #111827)',
                    }}
                  />
                )}
              </div>

              {/* Título Principal (SEGUNDO - Textarea com 3 linhas) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Principal</Label>
                  <button
                    type="button"
                    onClick={() => updateElements({ hasMainTitle: !elements.hasMainTitle })}
                    className="px-3 py-1 rounded-md text-xs font-medium"
                    style={{
                      transition: 'none',
                      backgroundColor: elements.hasMainTitle ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-bg, #f9fafb)',
                      color: elements.hasMainTitle ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                    }}
                  >
                    {elements.hasMainTitle ? 'Ativado' : 'Desativado'}
                  </button>
                </div>
                {elements.hasMainTitle && (
                  <textarea
                    value={config?.title || ''}
                    placeholder="Ex: Transforme sua casa em um lar perfeito"
                    rows={3}
                    onChange={(e) => {
                      onConfigChange && onConfigChange({ ...config, title: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                    style={{
                      backgroundColor: 'var(--admin-field-bg, #ffffff)',
                      border: '2px solid var(--admin-field-border, #e5e7eb)',
                      color: 'var(--admin-field-text, #111827)',
                    }}
                  />
                )}
              </div>

              {/* Subtítulo (TERCEIRO) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Subtítulo</Label>
                  <button
                    type="button"
                    onClick={() => updateElements({ hasSubtitle: !elements.hasSubtitle })}
                    className="px-3 py-1 rounded-md text-xs font-medium"
                    style={{
                      transition: 'none',
                      backgroundColor: elements.hasSubtitle ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-bg, #f9fafb)',
                      color: elements.hasSubtitle ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                    }}
                  >
                    {elements.hasSubtitle ? 'Ativado' : 'Desativado'}
                  </button>
                </div>
                {elements.hasSubtitle && (
                  <input
                    type="text"
                    value={config?.subtitle || ''}
                    placeholder="Ex: Com soluções sob medida para cada ambiente"
                    onChange={(e) => {
                      onConfigChange && onConfigChange({ ...config, subtitle: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: 'var(--admin-field-bg, #ffffff)',
                      border: '2px solid var(--admin-field-border, #e5e7eb)',
                      color: 'var(--admin-field-text, #111827)',
                    }}
                  />
                )}
              </div>
            </div>

            {/* 3) Botão */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Botão</Label>
                <button
                  type="button"
                  onClick={() => updateElements({ hasButton: !elements.hasButton })}
                  className="px-3 py-1 rounded-md text-xs font-medium"
                  style={{
                    transition: 'none',
                    backgroundColor: elements.hasButton ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-bg, #f9fafb)',
                    color: elements.hasButton ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                  }}
                >
                  {elements.hasButton ? 'Ativado' : 'Desativado'}
                </button>
              </div>
              {elements.hasButton && (
                <div className="space-y-3 rounded-lg p-4" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)' }}>
                  {/* Campo de texto do botão */}
                  <div>
                    <Label className="mb-2 block">Texto do Botão</Label>
                    <input
                      type="text"
                      value={config?.ctaButton?.label || ''}
                      onChange={(e) => {
                        onConfigChange && onConfigChange({ 
                          ...config, 
                          ctaButton: { ...config?.ctaButton, label: e.target.value } 
                        });
                      }}
                      placeholder="Ex: Saiba Mais"
                      className="w-full px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'var(--admin-field-bg, #ffffff)', border: '2px solid var(--admin-field-border, #e5e7eb)', color: 'var(--admin-field-text, #111827)' }}
                    />
                  </div>

                  {/* ✅ NOVO: Checkbox para habilitar ícone no botão */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="button-has-icon"
                      checked={config?.ctaButton?.hasIcon || false}
                      onChange={(e) => {
                        onConfigChange && onConfigChange({
                          ...config,
                          ctaButton: {
                            ...config?.ctaButton,
                            hasIcon: e.target.checked,
                            // Se desmarcar, limpar campos de ícone
                            ...(e.target.checked ? {} : {
                              icon: undefined,
                              iconSize: undefined,
                              iconColor: undefined,
                            }),
                          },
                        });
                      }}
                      className="h-4 w-4 rounded"
                      style={{ accentColor: 'var(--primary, #ea526e)', borderColor: 'var(--admin-field-border, #e5e7eb)' }}
                    />
                    <Label htmlFor="button-has-icon" className="cursor-pointer">
                      Adicionar ícone ao botão
                    </Label>
                  </div>

                  {/* ✅ NOVO: Campos de ícone (aparecem quando hasIcon = true) */}
                  {config?.ctaButton?.hasIcon && (
                    <div className="space-y-3 pl-6 border-l-2" style={{ borderColor: 'color-mix(in srgb, var(--primary, #ea526e) 20%, transparent)' }}>
                      {/* Seletor de Ícone */}
                      <div>
                        <Label className="mb-2 block">Ícone</Label>
                        <IconPicker
                          value={config?.ctaButton?.icon || ''}
                          onChange={(iconName) => {
                            onConfigChange && onConfigChange({
                              ...config,
                              ctaButton: { ...config?.ctaButton, icon: iconName },
                            });
                          }}
                        />
                      </div>

                      {/* Tamanho do Ícone */}
                      <div>
                        <Label className="mb-2 block">
                          Tamanho do Ícone (px)
                        </Label>
                        <input
                          type="number"
                          min="12"
                          max="48"
                          value={config?.ctaButton?.iconSize || 20}
                          onChange={(e) => {
                            onConfigChange && onConfigChange({
                              ...config,
                              ctaButton: {
                                ...config?.ctaButton,
                                iconSize: parseInt(e.target.value) || 20,
                              },
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--admin-field-bg, #ffffff)', border: '2px solid var(--admin-field-border, #e5e7eb)', color: 'var(--admin-field-text, #111827)' }}
                        />
                      </div>

                      {/* Cor do Ícone */}
                      <div>
                        <Label className="mb-2 block">Cor do Ícone</Label>
                        <ColorTokenPicker
                          value={config?.ctaButton?.iconColor || null}
                          onChange={(tokenId) => {
                            onConfigChange && onConfigChange({
                              ...config,
                              ctaButton: { ...config?.ctaButton, iconColor: tokenId },
                            });
                          }}
                          label=""
                          layout="horizontal"
                        />
                      </div>

                      {/* ✅ NOVO: Efeito do Ícone */}
                      <div>
                        <Label className="mb-2 block">Efeito</Label>
                        <select
                          value={config?.ctaButton?.iconEffect || 'none'}
                          onChange={(e) => {
                            onConfigChange && onConfigChange({
                              ...config,
                              ctaButton: {
                                ...config?.ctaButton,
                                iconEffect: e.target.value,
                              },
                            });
                          }}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-primary hover:bg-gray-50 text-sm text-gray-600"
                          style={{ transition: 'none' }}
                        >
                          <option value="none">Nenhum</option>
                          <option value="slide-down">Deslizar para Baixo</option>
                          <option value="slide-right">Deslizar para Direita</option>
                          <option value="slide-left">Deslizar para Esquerda</option>
                          <option value="slide-up">Deslizar para Cima</option>
                          <option value="pulse">Pulsar</option>
                          <option value="fade">Fade</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Dropdown Página de Destino */}
                  <div>
                    <Label className="mb-2 block">Página de Destino</Label>
                    <select
                      value={selectedPageId}
                      onChange={(e) => {
                        if (onPageIdChange) {
                          onPageIdChange(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-primary hover:bg-gray-50 text-sm text-gray-600"
                      style={{ transition: 'none' }}
                    >
                      <option value="">Selecione uma página</option>
                      {pages.map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dropdown Seção (Opcional) */}
                  <div>
                    <Label className="mb-2 block">Seção (Opcional)</Label>
                    <select
                      value={selectedSectionId}
                      onChange={(e) => {
                        if (onSectionIdChange) {
                          onSectionIdChange(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-primary hover:bg-gray-50 text-sm text-gray-600"
                      style={{ transition: 'none' }}
                      disabled={!selectedPageId}
                    >
                      <option value="">Ir para o topo da página</option>
                      {pageSections.map((ps: any) => (
                        <option key={ps.id} value={ps.section_id}>
                          {ps.sections?.name || `Seção #${ps.order_index}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== 4. POSICIONAMENTO E GRID ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontSize: adminVar('item-title-list', 'size'), fontWeight: adminVar('item-title-list', 'weight'), color: adminVar('item-title-list', 'color') }}>
            <Grid2X2 className="h-5 w-5" style={{ color: 'var(--primary, #ea526e)' }} />
            4. Posicionamento e Grid
          </CardTitle>
          <CardDescription>
            Configure o grid (linhas/colunas) e a posição de cada elemento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ✅ NOVO: Configuração do Grid */}
          <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)', border: '2px solid var(--admin-collapsible-border, #e5e7eb)' }}>
            <Label>Grid da Seção</Label>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Colunas do Grid */}
              <div className="space-y-2">
                <Label>Colunas</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // ✅ FIX 2026-02-15: Atualizar config.gridCols (local correto, não layout)
                      onConfigChange && onConfigChange({ ...config, gridCols: 1 });
                    }}
                    style={{
                      transition: 'none',
                      animation: 'none',
                      boxShadow: 'none',
                      backgroundColor: (config?.gridCols || 1) === 1 ? 'var(--primary, #ea526e)' : 'var(--admin-card-bg, #ffffff)',
                      color: (config?.gridCols || 1) === 1 ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                      borderColor: (config?.gridCols || 1) === 1 ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border-2 font-medium cursor-pointer"
                  >
                    1 Coluna
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // ✅ FIX 2026-02-15: Atualizar config.gridCols (local correto, não layout)
                      onConfigChange && onConfigChange({ ...config, gridCols: 2 });
                    }}
                    style={{
                      transition: 'none',
                      animation: 'none',
                      boxShadow: 'none',
                      backgroundColor: (config?.gridCols || 1) === 2 ? 'var(--primary, #ea526e)' : 'var(--admin-card-bg, #ffffff)',
                      color: (config?.gridCols || 1) === 2 ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                      borderColor: (config?.gridCols || 1) === 2 ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border-2 font-medium cursor-pointer"
                  >
                    2 Colunas
                  </button>
                </div>
              </div>

              {/* Linhas do Grid */}
              <div className="space-y-2">
                <Label>Linhas</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // ✅ FIX 2026-02-15: Atualizar config.gridRows (local correto, não layout)
                      onConfigChange && onConfigChange({ ...config, gridRows: 1 });
                    }}
                    style={{
                      transition: 'none',
                      animation: 'none',
                      boxShadow: 'none',
                      backgroundColor: (config?.gridRows || 1) === 1 ? 'var(--primary, #ea526e)' : 'var(--admin-card-bg, #ffffff)',
                      color: (config?.gridRows || 1) === 1 ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                      borderColor: (config?.gridRows || 1) === 1 ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border-2 font-medium cursor-pointer"
                  >
                    1 Linha
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // ✅ FIX 2026-02-15: Atualizar config.gridRows (local correto, não layout)
                      onConfigChange && onConfigChange({ ...config, gridRows: 2 });
                    }}
                    style={{
                      transition: 'none',
                      animation: 'none',
                      boxShadow: 'none',
                      backgroundColor: (config?.gridRows || 1) === 2 ? 'var(--primary, #ea526e)' : 'var(--admin-card-bg, #ffffff)',
                      color: (config?.gridRows || 1) === 2 ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                      borderColor: (config?.gridRows || 1) === 2 ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border-2 font-medium cursor-pointer"
                  >
                    2 Linhas
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ✅ NOVO: Alinhamento Vertical da Mídia (Ponto Focal) */}
          {elements.hasMedia && (
            <div className="space-y-2 p-4 rounded-lg" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)', border: '2px solid var(--admin-collapsible-border, #e5e7eb)' }}>
              <Label>Ponto Focal da Mídia</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateLayout({
                    desktop: {
                      ...layout.desktop,
                      media: {
                        ...(typeof layout.desktop.media === 'object' ? layout.desktop.media : { position: layout.desktop.media }),
                        verticalAlign: 'top',
                      } as any,
                    }
                  })}
                  className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg border-2 font-medium"
                  style={{
                    transition: 'none',
                    backgroundColor: ((layout.desktop.media as any)?.verticalAlign || 'center') === 'top' ? 'var(--primary, #ea526e)' : 'var(--admin-card-bg, #ffffff)',
                    color: ((layout.desktop.media as any)?.verticalAlign || 'center') === 'top' ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                    borderColor: ((layout.desktop.media as any)?.verticalAlign || 'center') === 'top' ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                  }}
                >
                  <AlignVerticalJustifyStart className="h-5 w-5" />
                  <span className="text-xs">Topo</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateLayout({
                    desktop: {
                      ...layout.desktop,
                      media: {
                        ...(typeof layout.desktop.media === 'object' ? layout.desktop.media : { position: layout.desktop.media }),
                        verticalAlign: 'center',
                      } as any,
                    }
                  })}
                  className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg border-2 font-medium"
                  style={{
                    transition: 'none',
                    backgroundColor: ((layout.desktop.media as any)?.verticalAlign || 'center') === 'center' ? 'var(--primary, #ea526e)' : 'var(--admin-card-bg, #ffffff)',
                    color: ((layout.desktop.media as any)?.verticalAlign || 'center') === 'center' ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                    borderColor: ((layout.desktop.media as any)?.verticalAlign || 'center') === 'center' ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                  }}
                >
                  <AlignVerticalJustifyCenter className="h-5 w-5" />
                  <span className="text-xs">Centro</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateLayout({
                    desktop: {
                      ...layout.desktop,
                      media: {
                        ...(typeof layout.desktop.media === 'object' ? layout.desktop.media : { position: layout.desktop.media }),
                        verticalAlign: 'bottom',
                      } as any,
                    }
                  })}
                  className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg border-2 font-medium"
                  style={{
                    transition: 'none',
                    backgroundColor: ((layout.desktop.media as any)?.verticalAlign || 'center') === 'bottom' ? 'var(--primary, #ea526e)' : 'var(--admin-card-bg, #ffffff)',
                    color: ((layout.desktop.media as any)?.verticalAlign || 'center') === 'bottom' ? '#ffffff' : 'var(--admin-btn-action-text, #374151)',
                    borderColor: ((layout.desktop.media as any)?.verticalAlign || 'center') === 'bottom' ? 'var(--primary, #ea526e)' : 'var(--admin-collapsible-border, #e5e7eb)',
                  }}
                >
                  <AlignVerticalJustifyEnd className="h-5 w-5" />
                  <span className="text-xs">Rodapé</span>
                </button>
              </div>
              <p data-slot="field-hint" className="mt-2">
                ℹ️ Define qual parte da imagem fica visível quando ela é maior que o container (objectPosition CSS).
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}