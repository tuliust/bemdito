import React, { useState, useEffect } from 'react';
import { GridLayoutEditor } from '../sections-manager/GridLayoutEditor';
import { SectionLayoutControls } from './SectionLayoutControls';
import { CornerPositionSelector } from '../../components/admin/CornerPositionSelector';
import { PositionConflictDialog } from '../../components/admin/PositionConflictDialog';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { BaseModal } from '../../components/admin/BaseModal';
import { SectionBuilder } from '../sections-manager/SectionBuilder';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { ColorTokenPicker } from '../../components/ColorTokenPicker';
import { TypeScalePicker } from '../../components/admin/TypeScalePicker';
import { ImageUploadOnly } from '../../components/ImageUploadOnly';
import { OpacitySlider } from '../../components/admin/OpacitySlider';
import { 
  Layout, 
  Palette, 
  Eye, 
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  FileText,
  Image as ImageIcon,
  ArrowUpLeft,
  ArrowDownLeft,
  AlignHorizontalJustifyCenter,
  LayoutGrid,
  Grid2X2,
  Maximize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { adminVar } from '../../components/admin/AdminThemeProvider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';

// ─── Seção colapsável reutilizável (Design tab) ───────────────────────────────
function DesignSection({
  label, open, onOpenChange, children,
}: { label: string; open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)', border: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
        <CollapsibleTrigger
          className="w-full px-4 py-3 flex items-center justify-between rounded-lg"
          style={{ transition: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--admin-collapsible-hover-bg, #f3f4f6)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <h3 className="uppercase tracking-wide" style={{ fontSize: 'var(--admin-collapsible-label-size, 0.75rem)', fontWeight: 'var(--admin-collapsible-label-weight, 600)', color: 'var(--admin-collapsible-label-color, #374151)' }}>{label}</h3>
          {open
            ? <ChevronUp   className="h-4 w-4" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
            : <ChevronDown className="h-4 w-4" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
          }
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-2 space-y-3" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// ─── Card compacto de cor (grid 3 colunas) ───────────────────────────────────
function CompactColorCardSection({
  label, open, onOpenChange, children,
}: { label: string; open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)', border: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
        <CollapsibleTrigger
          className="w-full px-3 py-2.5 flex items-center justify-between"
          style={{ transition: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--admin-collapsible-hover-bg, #f3f4f6)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span className="uppercase tracking-wide" style={{ fontSize: 'var(--admin-collapsible-label-size, 0.7rem)', fontWeight: 'var(--admin-collapsible-label-weight, 600)', color: 'var(--admin-collapsible-label-color, #374151)' }}>
            {label}
          </span>
          {open
            ? <ChevronUp   className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
            : <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
          }
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-2 pb-3 pt-2" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

type PageSection = {
  id: string;
  page_id: string;
  section_id: string;
  order: number;
  config: any;
  section?: {
    id: string;
    name: string;
    type: string;
    config: any;
    elements?: any;
    layout?: any;
    styling?: any;
  };
};

interface UnifiedSectionConfigModalProps {
  pageSection: PageSection;
  onClose: () => void;
  onSave: (config: any, elements?: any, layout?: any, styling?: any) => void;
  onSaveAs?: (config: any, elements?: any, layout?: any, styling?: any) => void; // ✅ NOVO: Salvar como (duplicar)
}

export function UnifiedSectionConfigModal({
  pageSection,
  onClose,
  onSave,
  onSaveAs,
}: UnifiedSectionConfigModalProps) {
  // ✅ HELPER: Extrair posição de objeto ou string
  const extractPosition = (value: any, fallback: string = 'top-left'): string => {
    // ✅ CORREÇÃO (2026-02-16): Tratar undefined/null
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value.position) return value.position;
    if (typeof value === 'object') return fallback;
    return fallback;
  };
  
  // ✅ NOVO: Ler SEMPRE de sections (não mais merge com page_sections.config)
  const sectionConfig = pageSection.section?.config || {};
  
  // ✅ Padronizar smallTitle (remover minorTitle duplicado)
  const normalizedConfig = {
    ...sectionConfig,
    smallTitle: sectionConfig.smallTitle || sectionConfig.minorTitle || '',
    // ❌ REMOVIDO: minorTitle (usar apenas smallTitle)
  };
  
  const [config, setConfig] = useState(normalizedConfig);
  const [activeView, setActiveView] = useState<'layout' | 'design' | 'preview'>('layout');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // ✅ Ler elements/layout/styling SEMPRE de sections
  const [elements, setElements] = useState(
    pageSection.section?.elements || null
  );
  const [layout, setLayout] = useState(
    pageSection.section?.layout || null
  );
  const [styling, setStyling] = useState(
    pageSection.section?.styling || null
  );
  
  // ✅ NOVO (2026-02-17): Sincronizar estado local quando pageSection mudar
  // Isso garante que ao reabrir o modal após salvamento, os campos estejam atualizados
  useEffect(() => {
    const newSectionConfig = pageSection.section?.config || {};
    const newNormalizedConfig = {
      ...newSectionConfig,
      smallTitle: newSectionConfig.smallTitle || newSectionConfig.minorTitle || '',
    };
    
    setConfig(newNormalizedConfig);
    setElements(pageSection.section?.elements || null);
    setLayout(pageSection.section?.layout || null);
    setStyling(pageSection.section?.styling || null);
    // ✅ FIX: Restaurar seleções de página/seção do botão CTA ao reabrir o modal
    setSelectedPageId(newNormalizedConfig.ctaButton?.pageId || '');
    setSelectedSectionId(newNormalizedConfig.ctaButton?.sectionId || '');
    setHasUnsavedChanges(false);
  }, [pageSection]);
  
  // ✅ Garantir que layout tenha valores padrão para textAlign e verticalAlign
  useEffect(() => {
    if (layout) {
      const needsDefaults = !layout.desktop?.textAlign || !layout.desktop?.verticalAlign;
      
      if (needsDefaults) {
        const updatedLayout = {
          ...layout,
          desktop: {
            ...layout.desktop,
            textAlign: layout.desktop?.textAlign || 'left',
            verticalAlign: layout.desktop?.verticalAlign || 'center',
          },
        };
        setLayout(updatedLayout);
      }
    }
  }, []);
  
  // Estados para controlar collapse de cada seção
  const [openChamada, setOpenChamada] = useState(false);
  const [openTitulo, setOpenTitulo] = useState(false);
  const [openSubtitulo, setOpenSubtitulo] = useState(false);
  const [openBotao, setOpenBotao] = useState(false);
  const [openIcone, setOpenIcone] = useState(false);
  const [openBackground, setOpenBackground] = useState(false);

  // CompactColorCard open states
  const [openBotaoTexto, setOpenBotaoTexto] = useState(false);
  const [openBotaoFundo, setOpenBotaoFundo] = useState(false);
  const [openBotaoBorda, setOpenBotaoBorda] = useState(false);
  const [openIconeCor, setOpenIconeCor] = useState(false);
  const [openBgCor, setOpenBgCor] = useState(false);

  // 🆕 Estado legado (mantido para compatibilidade com outros usos)
  const [expandedField, setExpandedField] = useState<string | null>(null);

  // 🆕 Estados para templates de cards
  const [cardTemplates, setCardTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    sectionConfig.cardTemplateId || null
  );

  // 🆕 Estados para páginas e seções (URL do botão)
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>(sectionConfig.ctaButton?.pageId || '');
  const [pageSections, setPageSections] = useState<any[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sectionConfig.ctaButton?.sectionId || '');

  // ✨ NOVO: Estados para validação de conflitos de posicionamento
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [detectedConflicts, setDetectedConflicts] = useState<any[]>([]);
  const [pendingSaveData, setPendingSaveData] = useState<any>(null);

  // 🆕 Sincronizar estados quando pageSection mudar
  useEffect(() => {
    const updatedSectionConfig = pageSection.section?.config || {};
    
    // ✅ Padronizar smallTitle
    const updatedNormalizedConfig = {
      ...updatedSectionConfig,
      smallTitle: updatedSectionConfig.smallTitle || updatedSectionConfig.minorTitle || '',
    };
    
    setConfig(updatedNormalizedConfig);
    setElements(pageSection.section?.elements || null);
    setLayout(pageSection.section?.layout || null);
    setStyling(pageSection.section?.styling || null);
    setSelectedTemplateId(updatedSectionConfig.cardTemplateId || null);

    // Parse da URL do botão (se existir)
    const buttonUrl = updatedSectionConfig.ctaButton?.url || updatedSectionConfig.primaryUrl || updatedSectionConfig.ctaUrl || '';
    if (buttonUrl.startsWith('/page/')) {
      const parts = buttonUrl.replace('/page/', '').split('#');
      setSelectedPageId(parts[0] || '');
      setSelectedSectionId(parts[1] || '');
    }
  }, [pageSection]);

  // 🆕 Carregar templates de cards e páginas ao montar
  useEffect(() => {
    loadCardTemplates();
    loadPages();
  }, []);

  // 🆕 Carregar seções quando a página mudar
  useEffect(() => {
    if (selectedPageId) {
      loadPageSections(selectedPageId);
    } else {
      setPageSections([]);
    }
  }, [selectedPageId]);

  // ❌ DESABILITADO 2026-02-14: Auto-validação de gridRows (interferia com escolha manual do usuário)
  // O usuário agora controla gridRows via botões "1 Linha" e "2 Linhas" no SectionBuilder
  // Se elementos estiverem em posições incompatíveis (ex: 1 linha mas middle-*), é responsabilidade do usuário ajustar
  /*
  useEffect(() => {
    if (elements && layout && layout.gridRows !== undefined) {
      const calculatedGridRows = calculateGridRows(elements, layout);
      
      // Só atualizar se o valor calculado for diferente do atual
      if (layout.gridRows !== calculatedGridRows) {
        setLayout({
          ...layout,
          gridRows: calculatedGridRows,
        });
      }
    }
  }, [pageSection.section?.id]); // Re-executar quando a seção mudar
  */

  const loadCardTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('card_templates')
        .select('*')
        .eq('is_global', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setCardTemplates(data || []);
    } catch (error: any) {
      toast.error(`Erro ao carregar templates: ${error.message}`);
    }
  };

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('id, title, slug')
        .eq('published', true)
        .order('title', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error: any) {
      toast.error(`Erro ao carregar páginas: ${error.message}`);
    }
  };

  const loadPageSections = async (pageId: string) => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select(`
          id,
          section_id,
          order_index,
          sections:section_id (
            id,
            name
          )
        `)
        .eq('page_id', pageId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      setPageSections(data || []);
    } catch (error: any) {
      console.error('❌ Erro ao carregar seções:', error);
      toast.error(`Erro ao carregar seções: ${error.message}`);
    }
  };

  // ✨ NOVO: Detectar conflitos de posicionamento
  const detectPositionConflicts = (elements: any, layout: any) => {
    if (!elements || !layout?.desktop) return [];

    const conflicts: any[] = [];
    
    // Extrair posições dos elementos ativos
    const activeElements: Array<{
      name: string;
      displayName: string;
      position: string;
    }> = [];

    // ✅ FIX 2026-02-24: usar extractPosition (que já lida com string e objeto)
    // em vez de .position que retorna undefined quando layout.desktop.text é string direta.
    // O fallback layout.desktop.textAlign era ERRADO: é alinhamento interno do texto
    // (ex: "center"), não posição no grid — causava falso-positivo de conflito.
    if (elements.hasIcon || elements.hasMinorTitle || elements.hasMainTitle || elements.hasSubtitle || elements.hasButton) {
      activeElements.push({
        name: 'text',
        displayName: 'Texto/Ícone',
        position: extractPosition(layout.desktop.text, 'top-left'),
      });
    }

    if (elements.hasMedia) {
      activeElements.push({
        name: 'media',
        displayName: 'Mídia',
        position: extractPosition(layout.desktop.media, 'top-right'),
      });
    }

    if (elements.hasCards) {
      activeElements.push({
        name: 'cards',
        displayName: 'Cards',
        position: extractPosition(layout.desktop.cards, 'bottom-center'),
      });
    }

    // Verificar sobreposição entre elementos
    for (let i = 0; i < activeElements.length; i++) {
      for (let j = i + 1; j < activeElements.length; j++) {
        const el1 = activeElements[i];
        const el2 = activeElements[j];

        if (doPositionsOverlap(el1.position, el2.position)) {
          conflicts.push({
            element1: el1.displayName,
            element2: el2.displayName,
            position1: el1.position,
            position2: el2.position,
            description: `Ambos os elementos estão configurados para ocupar áreas sobrepostas no grid.`,
          });
        }
      }
    }

    return conflicts;
  };

  // ✨ NOVO: Verificar se duas posições se sobrepõem no grid 2×2
  const doPositionsOverlap = (pos1: string, pos2: string): boolean => {
    // Mapeamento de posições para células do grid (linha, coluna)
    const positionToCells: Record<string, Array<[number, number]>> = {
      'top-left': [[1, 1]],
      'top-right': [[1, 2]],
      'top-center': [[1, 1], [1, 2]],
      'middle-left': [[1, 1], [2, 1]],
      'middle-right': [[1, 2], [2, 2]],
      'center': [[1, 1], [1, 2], [2, 1], [2, 2]],
      'bottom-left': [[2, 1]],
      'bottom-right': [[2, 2]],
      'bottom-center': [[2, 1], [2, 2]],
    };

    const cells1 = positionToCells[pos1] || [];
    const cells2 = positionToCells[pos2] || [];

    // Verificar se há células em comum
    for (const cell1 of cells1) {
      for (const cell2 of cells2) {
        if (cell1[0] === cell2[0] && cell1[1] === cell2[1]) {
          return true;
        }
      }
    }

    return false;
  };

  const handleSave = () => {
    // ✨ NOVO: Validar conflitos de posicionamento antes de salvar
    const conflicts = detectPositionConflicts(elements, layout);
    
    if (conflicts.length > 0) {
      console.warn('⚠️ [Save] Conflitos de posicionamento detectados:', conflicts);
      setDetectedConflicts(conflicts);
      
      // Guardar dados pendentes para salvar após confirmação
      setPendingSaveData({ config, elements, layout, styling });
      
      // Exibir modal de aviso
      setShowConflictDialog(true);
      return; // Interromper salvamento
    }
    
    // ✅ Se não há conflitos, continuar com o salvamento normal
    performSave();
  };

  // ✨ NOVO: Função que efetivamente executa o salvamento
  const performSave = () => {
    const finalConfig = pendingSaveData ? { ...pendingSaveData.config } : { ...config };
    let finalElements = pendingSaveData ? pendingSaveData.elements : elements;
    const finalLayout = pendingSaveData ? pendingSaveData.layout : layout;
    const finalStyling = pendingSaveData ? pendingSaveData.styling : styling;
    
    // ✅ CORREÇÃO 2026-02-16: Mapear config.media.fitMode para elements.mediaDisplayMode
    if (finalConfig.media?.fitMode) {
      const fitModeMap: Record<string, string> = {
        'cover': 'expandida',
        'contain': 'ajustada',
        'natural': 'contida',
        'alinhada': 'alinhada', // ✨ NOVO MODO
      };
      finalElements = {
        ...finalElements,
        mediaDisplayMode: fitModeMap[finalConfig.media.fitMode] || 'ajustada',
      };
    }
    
    // ✅ Construir URL do botão com SLUG da página ao invés de UUID
    let buttonUrl = '';
    if (selectedPageId) {
      // ✅ Buscar slug da página selecionada
      const selectedPage = pages.find((p: any) => p.id === selectedPageId);
      const pageSlug = selectedPage?.slug || selectedPageId; // Fallback para UUID se não houver slug
      
      buttonUrl = `/${pageSlug}`;
      if (selectedSectionId) {
        // ✅ Buscar nome da seção e converter para anchor ID (slug)
        const selectedSection = pageSections.find((ps: any) => ps.section_id === selectedSectionId);
        const sectionName = selectedSection?.sections?.name || '';
        const sectionAnchor = sectionName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        
        buttonUrl += `#${sectionAnchor}`;
      }
    }

    // ✅ Atualizar ctaButton (usar config correto)
    const configToUse = pendingSaveData ? pendingSaveData.config : config;
    if (configToUse.ctaButton?.label || buttonUrl) {
      finalConfig.ctaButton = {
        label: configToUse.ctaButton?.label || '',
        url: buttonUrl,
        // ✅ FIX: Persistir IDs para restaurar seleções ao reabrir o modal
        pageId: selectedPageId,
        sectionId: selectedSectionId,
        hasIcon: configToUse.ctaButton?.hasIcon || false,
        icon: configToUse.ctaButton?.icon || undefined,
        iconSize: configToUse.ctaButton?.iconSize || undefined,
        iconColor: configToUse.ctaButton?.iconColor || undefined,
        iconEffect: configToUse.ctaButton?.iconEffect || 'none',
      };
    }
    
    // ✅ Garantir que cardTemplateId está no config
    if (selectedTemplateId) {
      finalConfig.cardTemplateId = selectedTemplateId;
    }
    
    // ✅ FIX 2026-02-15: Remover gridRows/gridCols do layout (devem estar apenas em config)
    const cleanedLayout = { ...finalLayout };
    delete cleanedLayout.gridRows;
    delete cleanedLayout.gridCols;
    
    // ✅ Executar salvamento
    onSave(finalConfig, finalElements, cleanedLayout, finalStyling);
    
    // ✅ Limpar dados pendentes após salvamento
    setPendingSaveData(null);
    setShowConflictDialog(false);
  };

  const updateConfigField = (key: string, value: any) => {
    setConfig({ ...config, [key]: value });
    setHasUnsavedChanges(true);
  };

  // ✅ NOVA FUNÇÃO: Calcular gridRows automaticamente
  const calculateGridRows = (elements: any, layout: any): 1 | 2 => {
    if (!elements || !layout?.desktop) return 1;

    // Lista de elementos possíveis e suas positions
    const elementPositions = [
      { name: 'icon', active: elements.hasIcon, position: layout.desktop.icon?.position },
      { name: 'text', active: elements.hasMinorTitle || elements.hasMainTitle || elements.hasSubtitle || elements.hasButton, position: layout.desktop.text?.position },
      { name: 'media', active: elements.hasMedia, position: layout.desktop.media?.position },
      { name: 'cards', active: elements.hasCards, position: layout.desktop.cards?.position },
      { name: 'container', active: elements.hasContainer, position: layout.desktop.container?.position },
    ];

    // Verificar se algum elemento ativo está em position que requer 2 linhas
    for (const el of elementPositions) {
      if (!el.active || !el.position) continue;

      const pos = el.position as string;

      // Posições que EXIGEM 2 linhas:
      // - middle-left (ocupa 2 linhas)
      // - middle-right (ocupa 2 linhas)
      // - bottom-* (linha inferior)
      // - center (fullscreen 2×2)
      if (
        pos === 'middle-left' ||
        pos === 'middle-right' ||
        pos.startsWith('bottom-') ||
        pos === 'center'
      ) {
        return 2; // Precisa de 2 linhas
      }
    }

    // Se chegou aqui, todos os elementos estão em top-*
    return 1;
  };

  const handleBuilderChange = (newElements: any, newLayout: any, newStyling: any) => {
    setElements(newElements);
    setLayout(newLayout);
    setStyling(newStyling);
    setHasUnsavedChanges(true);
  };

  const handleConfigChange = (newConfig: any) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    setHasUnsavedChanges(true);
  };

  const sectionType = pageSection.section?.type;

  // Verificar quais elementos estão selecionados
  const hasMinorTitle = elements?.hasMinorTitle || false;
  const hasMainTitle = elements?.hasMainTitle !== false;
  const hasSubtitle = elements?.hasSubtitle || false;
  const hasButton = elements?.hasButton || false;
  const hasIcon = elements?.hasIcon || false;
  const hasMedia = elements?.hasMedia || false;
  const hasCards = elements?.hasCards || false;

  // Verificar se algum elemento de texto está ativo
  const hasAnyTextElement = hasIcon || hasMinorTitle || hasMainTitle || hasSubtitle || hasButton;

  // 🆕 Função helper para buscar token e exibir valor
  const [tokens, setTokens] = useState<any[]>([]);
  
  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('design_tokens')
        .select('*');
      
      if (error) throw error;
      setTokens(data || []);
    } catch (error: any) {
      console.error('❌ Erro ao carregar tokens:', error);
    }
  };

  const getTokenDisplay = (tokenId: string | null): string => {
    if (!tokenId) return 'Não definido';
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return 'Não definido';
    
    if (token.category === 'typography') {
      return token.name; // Ex: "heading-1", "body-base"
    } else if (token.category === 'color') {
      return token.name; // Ex: "Primary", "Dark"
    }
    return token.name;
  };

  // 🆕 Tradução de nomes técnicos para nomes amigáveis
  const getTypographyFriendlyName = (name: string): string => {
    const translations: Record<string, string> = {
      'body': 'Corpo do Texto',
      'font-family': 'Subtítulo Menor',
      'heading-medium': 'Título Médio',
      'body-base': 'Corpo Base',
      'main-title': 'Título Maior',
      'menu': 'Menu',
      'minor-title': 'Chamada',
      'subtitle': 'Subtítulo Maior',
      'body-small': 'Corpo Pequeno',
      'button-text': 'Botão',
      'megamenu-title': 'Título do Megamenu',
      'card-menu-title': 'Título Card Menu',
    };
    const friendlyName = translations[name];
    return friendlyName ? `${friendlyName} (${name})` : name;
  };

  // 🆕 Exibir cor visual ao invés de nome
  const getColorDisplay = (tokenId: string | null): React.ReactNode => {
    if (!tokenId) return <span style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}>Transparente</span>;
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return <span style={{ color: 'var(--admin-field-placeholder, #9ca3af)' }}>Transparente</span>;
    
    // Parse correto do valor da cor
    let hexColor = '#cccccc';
    try {
      if (typeof token.value === 'string') {
        const parsed = JSON.parse(token.value);
        hexColor = parsed.color || parsed.hex || '#cccccc';
      } else if (token.value?.color) {
        hexColor = token.value.color;
      } else if (token.value?.hex) {
        hexColor = token.value.hex;
      }
    } catch {
      hexColor = '#cccccc';
    }
    
    return (
      <div className="flex items-center gap-2">
        <div 
          className="w-4 h-4 rounded"
          style={{ backgroundColor: hexColor, border: '1px solid var(--admin-field-border, #e5e7eb)' }}
        />
        <span>{token.label || token.name}</span>
      </div>
    );
  };

  // 🆕 Wrapper para decidir qual display usar
  const getFieldDisplay = (tokenId: string | null, isColor: boolean = false): React.ReactNode => {
    if (isColor) {
      return getColorDisplay(tokenId);
    }
    
    if (!tokenId) return 'Não definido';
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return 'Não definido';
    
    if (token.category === 'typography') {
      return getTypographyFriendlyName(token.name);
    }
    
    return token.name;
  };

  // ── Token style helpers (avoid hardcoded classes) ─────────────────────
  const pickerBtnStyle: React.CSSProperties = {
    transition: 'none',
    backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)',
    border: '2px solid var(--admin-collapsible-border, #e5e7eb)',
  };
  const pickerExpandStyle: React.CSSProperties = {
    backgroundColor: 'var(--admin-card-bg, #ffffff)',
    border: '2px solid var(--admin-collapsible-border, #e5e7eb)',
  };
  const numberBadgeStyle: React.CSSProperties = {
    backgroundColor: 'color-mix(in srgb, var(--primary, #ea526e) 10%, transparent)',
    color: 'var(--primary, #ea526e)',
  };
  const selBtnActive: React.CSSProperties = {
    transition: 'none',
    backgroundColor: 'var(--primary, #ea526e)',
    color: '#ffffff',
    borderColor: 'var(--primary, #ea526e)',
  };
  const selBtnInactive: React.CSSProperties = {
    transition: 'none',
    backgroundColor: 'var(--admin-card-bg, #ffffff)',
    color: 'var(--admin-btn-action-text, #374151)',
    borderColor: 'var(--admin-collapsible-border, #e5e7eb)',
  };

  return (
    <>
    <BaseModal
      open={true}
      onOpenChange={onClose}
      title={`Configurar: ${pageSection.section?.name}`}
      size="large"
      hasUnsavedChanges={hasUnsavedChanges}
      onSave={handleSave}
      saveLabel="Salvar"
      onCancel={() => { setHasUnsavedChanges(false); onClose(); }}
      extraFooterActions={
        onSaveAs ? (
          <button
            onClick={() => {
              const finalConfig = { ...config };
              onSaveAs(finalConfig, elements, layout, styling);
            }}
            className="px-4 py-2 rounded-lg"
            style={{
              transition: 'none',
              backgroundColor: 'var(--admin-btn-action-bg, #ffffff)',
              border:          '2px solid var(--admin-btn-action-border, #e5e7eb)',
              color:           'var(--admin-btn-action-text, #374151)',
            }}
          >
            Salvar como
          </button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* ===== TOGGLE VIEW - 3 ABAS ===== */}
        <div
          className="flex gap-2 p-1 rounded-lg"
          style={{ backgroundColor: 'var(--admin-tab-list-bg, #e7e8e8)' }}
        >
          {([
            { id: 'layout',  icon: <Layout  className="h-4 w-4" />, label: 'Layout'  },
            { id: 'design',  icon: <Palette className="h-4 w-4" />, label: 'Design'  },
            { id: 'preview', icon: <Eye     className="h-4 w-4" />, label: 'Preview' },
          ] as const).map(({ id, icon, label }) => {
            const isActive = activeView === id;
            return (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md"
                style={{
                  transition:      'none',
                  backgroundColor: isActive ? 'var(--admin-tab-active-bg, #ffffff)' : 'transparent',
                  color:           isActive ? 'var(--admin-tab-active-text, #111827)' : 'var(--admin-tab-label-color, #717182)',
                  boxShadow:       isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  fontSize:        'var(--admin-tab-label-size, 0.875rem)',
                  fontWeight:      isActive ? '600' : 'var(--admin-tab-label-weight, 500)',
                }}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </div>

        {/* ===== ABA LAYOUT (SECTIONBUILDER COMPLETO) ===== */}
        {activeView === 'layout' && (
          <div className="space-y-4">
            <SectionBuilder
              elements={elements}
              layout={layout}
              styling={styling}
              config={{
                ...config,  // ✅ Passa TUDO do estado, incluindo gridCols/gridRows
                buttonLabel: config.ctaButton?.label || config.primaryLabel || config.ctaLabel || '',
                buttonUrl: '', // Será substituído pelos dropdowns abaixo
              }}
              onChange={handleBuilderChange}
              onConfigChange={handleConfigChange}
              pages={pages}
              selectedPageId={selectedPageId}
              pageSections={pageSections}
              selectedSectionId={selectedSectionId}
              onPageIdChange={(pageId) => {
                setSelectedPageId(pageId);
                setSelectedSectionId(''); // Reset seção
              }}
              onSectionIdChange={setSelectedSectionId}
            />

            {/* Altura e Alinhamentos Internos */}
            <SectionLayoutControls
              config={config}
              hasMedia={hasMedia}
              hasCards={hasCards}
              hasButton={hasButton}
              onUpdateConfig={updateConfigField}
              selectedTemplateId={selectedTemplateId}
              cardTemplates={cardTemplates}
              onTemplateChange={(templateId) => {
                setSelectedTemplateId(templateId);
                updateConfigField('cardTemplateId', templateId);
              }}
              pages={pages}
              selectedPageId={selectedPageId}
              pageSections={pageSections}
              selectedSectionId={selectedSectionId}
              onPageIdChange={(pageId) => {
                setSelectedPageId(pageId);
                setSelectedSectionId(''); // Reset seção
              }}
              onSectionIdChange={setSelectedSectionId}
            />


          </div>
        )}

        {/* ===== ABA DESIGN (CORES E TAMANHOS) ===== */}
        {activeView === 'design' && (
          <div className="space-y-3">
            {/* ==================== CHAMADA - DESIGN ==================== */}
            {hasMinorTitle && (
              <DesignSection label="Chamada" open={openChamada} onOpenChange={setOpenChamada}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Tamanho da Fonte</Label>
                    <div className="mt-1.5">
                      <TypeScalePicker
                        value={config.smallTitleFontSize || null}
                        onChange={(tokenId) => updateConfigField('smallTitleFontSize', tokenId)}
                        label=""
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Cor do Texto</Label>
                    <div className="mt-1.5">
                      <ColorTokenPicker
                        value={config.smallTitleColor || null}
                        onChange={(tokenId) => updateConfigField('smallTitleColor', tokenId)}
                        label=""
                        layout="horizontal"
                      />
                    </div>
                  </div>
                </div>
              </DesignSection>
            )}

            {/* ==================== TÍTULO PRINCIPAL - DESIGN ==================== */}
            {hasMainTitle && (
              <DesignSection label="Título Principal" open={openTitulo} onOpenChange={setOpenTitulo}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Tamanho da Fonte</Label>
                    <div className="mt-1.5">
                      <TypeScalePicker
                        value={config.titleFontSize || null}
                        onChange={(tokenId) => updateConfigField('titleFontSize', tokenId)}
                        label=""
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Cor do Texto</Label>
                    <div className="mt-1.5">
                      <ColorTokenPicker
                        value={config.titleColor || null}
                        onChange={(tokenId) => updateConfigField('titleColor', tokenId)}
                        label=""
                        layout="horizontal"
                      />
                    </div>
                  </div>
                </div>

                {/* Alinhamentos */}
                <div className="grid grid-cols-2 gap-3 pt-3" style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}>
                  <div className="space-y-2">
                    <Label>Alinhamento Horizontal</Label>
                    <div className="flex gap-2">
                      {[
                        { value: 'left' as const, icon: AlignLeft, title: 'Esquerda' },
                        { value: 'center' as const, icon: AlignCenter, title: 'Centro' },
                        { value: 'right' as const, icon: AlignRight, title: 'Direita' },
                      ].map(({ value, icon: Icon, title }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            const newLayout = { ...layout, desktop: { ...layout?.desktop, textAlign: value } };
                            setLayout(newLayout);
                            handleBuilderChange(elements, newLayout, styling);
                          }}
                          className="flex-1 p-2 rounded-md border-2"
                          style={(layout?.desktop?.textAlign || 'left') === value ? selBtnActive : selBtnInactive}
                          title={title}
                        >
                          <Icon className="h-4 w-4 mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Alinhamento Vertical</Label>
                    <div className="flex gap-2">
                      {[
                        { value: 'top' as const, icon: AlignVerticalJustifyStart, title: 'Superior' },
                        { value: 'center' as const, icon: AlignVerticalJustifyCenter, title: 'Meio' },
                        { value: 'bottom' as const, icon: AlignVerticalJustifyEnd, title: 'Inferior' },
                      ].map(({ value, icon: Icon, title }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            const newLayout = { ...layout, desktop: { ...layout?.desktop, verticalAlign: value } };
                            setLayout(newLayout);
                            handleBuilderChange(elements, newLayout, styling);
                          }}
                          className="flex-1 p-2 rounded-md border-2"
                          style={(layout?.desktop?.verticalAlign || 'center') === value ? selBtnActive : selBtnInactive}
                          title={title}
                        >
                          <Icon className="h-4 w-4 mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </DesignSection>
            )}

            {/* ==================== SUBTÍTULO - DESIGN ==================== */}
            {hasSubtitle && (
              <DesignSection
                label={sectionType === 'cta' ? 'Descrição' : sectionType === 'text_image' ? 'Texto' : 'Subtítulo'}
                open={openSubtitulo}
                onOpenChange={setOpenSubtitulo}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Tamanho da Fonte</Label>
                    <div className="mt-1.5">
                      <TypeScalePicker
                        value={
                          sectionType === 'cta' ? (config.descriptionFontSize || null) :
                          sectionType === 'text_image' ? (config.textFontSize || null) :
                          (config.subtitleFontSize || null)
                        }
                        onChange={(tokenId) => {
                          if (sectionType === 'cta') updateConfigField('descriptionFontSize', tokenId);
                          else if (sectionType === 'text_image') updateConfigField('textFontSize', tokenId);
                          else updateConfigField('subtitleFontSize', tokenId);
                        }}
                        label=""
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Cor do Texto</Label>
                    <div className="mt-1.5">
                      <ColorTokenPicker
                        value={
                          sectionType === 'cta' ? (config.descriptionColor || null) :
                          sectionType === 'text_image' ? (config.textColor || null) :
                          (config.subtitleColor || null)
                        }
                        onChange={(tokenId) => {
                          if (sectionType === 'cta') updateConfigField('descriptionColor', tokenId);
                          else if (sectionType === 'text_image') updateConfigField('textColor', tokenId);
                          else updateConfigField('subtitleColor', tokenId);
                        }}
                        label=""
                        layout="horizontal"
                      />
                    </div>
                  </div>
                </div>
              </DesignSection>
            )}

            {/* ==================== BOTÃO - DESIGN ==================== */}
            {hasButton && (
              <DesignSection label="Botão" open={openBotao} onOpenChange={setOpenBotao}>
                <div>
                  <Label>Tamanho da Fonte</Label>
                  <div className="mt-1.5">
                    <TypeScalePicker
                      value={config.ctaLabelFontSize || null}
                      onChange={(tokenId) => updateConfigField('ctaLabelFontSize', tokenId)}
                      label=""
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <CompactColorCardSection label="Texto" open={openBotaoTexto} onOpenChange={setOpenBotaoTexto}>
                    <ColorTokenPicker
                      value={config.ctaTextColor || null}
                      onChange={(tokenId) => updateConfigField('ctaTextColor', tokenId)}
                      label=""
                      layout="horizontal"
                    />
                  </CompactColorCardSection>
                  <CompactColorCardSection label="Fundo" open={openBotaoFundo} onOpenChange={setOpenBotaoFundo}>
                    <ColorTokenPicker
                      value={config.ctaBgColor || null}
                      onChange={(tokenId) => updateConfigField('ctaBgColor', tokenId)}
                      label=""
                      layout="horizontal"
                    />
                  </CompactColorCardSection>
                  <CompactColorCardSection label="Borda" open={openBotaoBorda} onOpenChange={setOpenBotaoBorda}>
                    <ColorTokenPicker
                      value={config.ctaBorderColor || null}
                      onChange={(tokenId) => updateConfigField('ctaBorderColor', tokenId)}
                      label=""
                      layout="horizontal"
                    />
                  </CompactColorCardSection>
                </div>
              </DesignSection>
            )}

            {/* ==================== ÍCONE - DESIGN ==================== */}
            {hasIcon && (
              <DesignSection label="Ícone" open={openIcone} onOpenChange={setOpenIcone}>
                <div className="grid grid-cols-2 gap-3">
                  <CompactColorCardSection label="Cor do Ícone" open={openIconeCor} onOpenChange={setOpenIconeCor}>
                    <ColorTokenPicker
                      value={config.iconColor || null}
                      onChange={(tokenId) => updateConfigField('iconColor', tokenId)}
                      label=""
                      layout="horizontal"
                    />
                  </CompactColorCardSection>
                  <div>
                    <Label>Tamanho (px)</Label>
                    <Input
                      type="number"
                      value={config.iconSize || 48}
                      onChange={(e) => updateConfigField('iconSize', Number(e.target.value))}
                      min={16}
                      max={128}
                      step={4}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </DesignSection>
            )}

            {/* ==================== BACKGROUND - DESIGN ==================== */}
            <DesignSection label="Background" open={openBackground} onOpenChange={setOpenBackground}>
              <div>
                <Label>Mídia de Fundo</Label>
                <div className="mt-1.5">
                  <ImageUploadOnly
                    value={config.backgroundImage || ''}
                    onChange={(value) => updateConfigField('backgroundImage', value)}
                  />
                </div>
              </div>
              {config.backgroundImage && (
                <OpacitySlider
                  label="Opacidade da Mídia"
                  value={config.bgOpacity !== undefined ? config.bgOpacity : 50}
                  onChange={(v) => updateConfigField('bgOpacity', v)}
                />
              )}
              <CompactColorCardSection label="Cor de Fundo" open={openBgCor} onOpenChange={setOpenBgCor}>
                <ColorTokenPicker
                  value={config.bgColor || null}
                  onChange={(tokenId) => updateConfigField('bgColor', tokenId)}
                  label=""
                  layout="horizontal"
                />
              </CompactColorCardSection>
            </DesignSection>
          </div>
        )}

        {/* ===== ABA PREVIEW (GRID + ALINHAMENTOS) ===== */}
        {activeView === 'preview' && (
          <div className="space-y-4">
            {/* ==================== GRID LAYOUT EDITOR ==================== */}
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)',
                border:          '2px solid var(--admin-collapsible-border, #e5e7eb)',
              }}
            >
              <Label className="mb-3 block">
                Posicionamento no Grid 2×2
              </Label>
              <GridLayoutEditor
                elements={{
                  hasText: hasAnyTextElement,
                  hasMedia: elements?.hasMedia || false,
                  hasCards: elements?.hasCards || false,
                  mediaType: elements?.mediaType || null,
                }}
                layout={layout?.desktop || {}}
                onChange={(newDesktopLayout) => {
                  const newLayout = { ...layout, desktop: newDesktopLayout };
                  setLayout(newLayout);
                  handleBuilderChange(elements, newLayout, styling);
                }}
              />
            </div>

            {/* ==================== SELETORES DE POSIÇÃO POR CANTO ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Posição do Texto/Ícone */}
              {hasAnyTextElement && (
                <CornerPositionSelector
                  title="Posição do Texto/Ícone"
                  description="Escolha onde o conteúdo de texto aparecerá"
                  value={extractPosition(layout?.desktop?.text, 'top-left')}
                  onChange={(position) => {
                    const newLayout = {
                      ...layout,
                      desktop: {
                        ...layout.desktop,
                        text: position,  // ✅ String direta!
                      },
                    };
                    setLayout(newLayout);
                    handleBuilderChange(elements, newLayout, styling);
                  }}
                  icon={<Type className="h-4 w-4" style={{ color: 'var(--primary, #ea526e)' }} />}
                />
              )}

              {/* Posição da Mídia */}
              {elements?.hasMedia && (
                <CornerPositionSelector
                  title="Posição da Mídia"
                  description="Escolha onde a imagem/vídeo aparecerá"
                  value={extractPosition(layout?.desktop?.media, 'top-right')}
                  onChange={(position) => {
                    const newLayout = {
                      ...layout,
                      desktop: {
                        ...layout.desktop,
                        media: position,  // ✅ String direta!
                      },
                    };
                    setLayout(newLayout);
                    handleBuilderChange(elements, newLayout, styling);
                  }}
                  icon={<Layout className="h-4 w-4" style={{ color: 'var(--primary, #ea526e)' }} />}
                />
              )}

              {/* Posição dos Cards */}
              {elements?.hasCards && (
                <CornerPositionSelector
                  title="Posição dos Cards"
                  description="Escolha onde os cards aparecerão"
                  value={extractPosition(layout?.desktop?.cards, 'bottom-left')}
                  onChange={(position) => {
                    const newLayout = {
                      ...layout,
                      desktop: {
                        ...layout.desktop,
                        cards: position,  // ✅ String direta!
                      },
                    };
                    setLayout(newLayout);
                    handleBuilderChange(elements, newLayout, styling);
                  }}
                />
              )}
            </div>

            {/* ==================== CONFIGURAÇÕES AVANÇADAS DE ALTURA ==================== */}
            {/* ✅ Mostrar apenas se houver pelo menos um campo relevante */}
            {(
              (elements?.hasMedia && hasAnyTextElement) || // rowHeightPriority
              (config.gridRows === 2 && styling?.height !== 'auto') || // rowPriority
              elements?.hasCards // cardDisplayMode
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontSize: adminVar('item-title-list', 'size'), fontWeight: adminVar('item-title-list', 'weight'), color: adminVar('item-title-list', 'color') }}>
                    <AlignVerticalJustifyCenter className="h-5 w-5" style={{ color: 'var(--primary, #ea526e)' }} />
                    Configurações Avançadas de Altura
                  </CardTitle>
                  <CardDescription style={{ fontSize: adminVar('section-subheader', 'size'), color: adminVar('section-subheader', 'color') }}>
                    Defina como a altura da seção é distribuída e qual linha do grid tem prioridade no espaço flexível.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                  {/* rowHeightPriority - Apenas se houver texto + mídia */}
                  {elements?.hasMedia && hasAnyTextElement && (
                    <div className="space-y-3">
                      <Label>
                        Prioridade de Altura (Texto vs Mídia)
                      </Label>
                      <p className="mb-3" style={{ fontSize: adminVar('section-subheader', 'size'), color: adminVar('section-subheader', 'color') }}>
                        Quando texto e mídia estão na mesma linha, qual define a altura?
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const newConfig = { ...config, rowHeightPriority: 'content' };
                            setConfig(newConfig);
                          }}
                          className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2"
                          style={(config.rowHeightPriority || 'content') === 'content' ? selBtnActive : selBtnInactive}
                        >
                          <FileText className="h-5 w-5" />
                          <span className="text-sm font-medium">Texto Define</span>
                          <span className="text-xs opacity-70 text-center">
                            Mídia se ajusta ao texto
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newConfig = { ...config, rowHeightPriority: 'media' };
                            setConfig(newConfig);
                          }}
                          className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2"
                          style={config.rowHeightPriority === 'media' ? selBtnActive : selBtnInactive}
                        >
                          <ImageIcon className="h-5 w-5" />
                          <span className="text-sm font-medium">Mídia Define</span>
                          <span className="text-xs opacity-70 text-center">
                            Texto se ajusta à mídia
                          </span>
                        </button>
                      </div>
                      {styling?.height !== 'auto' && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-800">
                            ⚠️ <strong>Aviso:</strong> Esta configuração só tem efeito com altura "Auto". 
                            Com altura fixa, a seção sempre terá o tamanho definido.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* rowPriority - Apenas se grid 2 linhas + altura fixa */}
                  {config.gridRows === 2 && styling?.height !== 'auto' && (() => {
                    // ✅ Calcular elementos visíveis (texto agrupa: icon, minorTitle, mainTitle, subtitle, button)
                    const hasTextContent = elements?.hasIcon || elements?.hasMinorTitle || elements?.hasMainTitle || elements?.hasSubtitle || elements?.hasButton;
                    const hasMedia = elements?.hasMedia;
                    const hasCards = elements?.hasCards;
                    
                    const visibleElementsCount = [hasTextContent, hasMedia, hasCards].filter(Boolean).length;
                    
                    // ✅ Se for grid 2x2 com apenas 1 elemento, esconder prioridade de linha
                    const isSingleElementInGrid2x2 = config.gridCols === 2 && config.gridRows === 2 && visibleElementsCount === 1;
                    
                    if (isSingleElementInGrid2x2) {
                      return null; // Não mostrar prioridade de linha
                    }
                    
                    return (
                      <div className="space-y-3">
                        <Label>
                          Prioridade de Linha (Row 1 vs Row 2)
                        </Label>
                        <p className="mb-3" style={{ fontSize: adminVar('section-subheader', 'size'), color: adminVar('section-subheader', 'color') }}>
                          Em grid de 2 linhas com altura fixa, qual linha é prioritária?
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              const newConfig = { ...config, rowPriority: 'row1' };
                              setConfig(newConfig);
                            }}
                            className="flex flex-col items-center gap-2 px-3 py-3 rounded-lg border-2"
                            style={config.rowPriority === 'row1' ? selBtnActive : selBtnInactive}
                          >
                            <ArrowUpLeft className="h-5 w-5" />
                            <span className="text-sm font-medium">Linha 1</span>
                            <span className="text-xs opacity-70 text-center">
                              Topo prioritário
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newConfig = { ...config, rowPriority: 'row2' };
                              setConfig(newConfig);
                            }}
                            className="flex flex-col items-center gap-2 px-3 py-3 rounded-lg border-2"
                            style={config.rowPriority === 'row2' ? selBtnActive : selBtnInactive}
                          >
                            <ArrowDownLeft className="h-5 w-5" />
                            <span className="text-sm font-medium">Linha 2</span>
                            <span className="text-xs opacity-70 text-center">
                              Base prioritária
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newConfig = { ...config, rowPriority: 'equal' };
                              setConfig(newConfig);
                            }}
                            className="flex flex-col items-center gap-2 px-3 py-3 rounded-lg border-2"
                            style={(config.rowPriority || 'equal') === 'equal' ? selBtnActive : selBtnInactive}
                          >
                            <AlignHorizontalJustifyCenter className="h-5 w-5" />
                            <span className="text-sm font-medium">Igual</span>
                            <span className="text-xs opacity-70 text-center">
                              50% / 50%
                            </span>
                          </button>
                        </div>
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800">
                            💡 <strong>Dica:</strong> Linha prioritária recebe espaço flexível (1fr), 
                            a outra se ajusta ao conteúdo (auto).
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* cardDisplayMode - Apenas se houver cards */}
                  {elements?.hasCards && (
                    <div className="space-y-3">
                      <Label>
                        Modo de Exibição dos Cards
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const newConfig = { ...config, cardDisplayMode: 'normal' };
                            setConfig(newConfig);
                          }}
                          className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2"
                          style={(config.cardDisplayMode || 'normal') === 'normal' ? selBtnActive : selBtnInactive}
                        >
                          <LayoutGrid className="h-5 w-5" />
                          <span className="text-sm font-medium">Normal</span>
                          <span className="text-xs opacity-70 text-center">
                            Tamanho padrão (300px)
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newConfig = { ...config, cardDisplayMode: 'compact' };
                            setConfig(newConfig);
                          }}
                          className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2"
                          style={config.cardDisplayMode === 'compact' ? selBtnActive : selBtnInactive}
                        >
                          <Grid2X2 className="h-5 w-5" />
                          <span className="text-sm font-medium">Compacto</span>
                          <span className="text-xs opacity-70 text-center">
                            Reduzido (220px)
                          </span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            )}
          </div>
        )}

      </div>
    </BaseModal>
    
    {/* ✨ Modal de Aviso de Conflitos de Posicionamento */}
    <PositionConflictDialog
      open={showConflictDialog}
      onOpenChange={setShowConflictDialog}
      conflicts={detectedConflicts}
      onContinue={performSave}
    />
  </>
  );
}