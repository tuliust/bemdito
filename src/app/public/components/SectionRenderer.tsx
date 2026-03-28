import React from 'react';
import { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from '@/lib/components/Link';
import { useNavigate, useLocation, useInRouterContext } from 'react-router';
import { supabase } from '../../../lib/supabase/client';
import { useDesignSystem } from '../../../lib/contexts/DesignSystemContext';
import { ResponsiveText, MainTitle, Subtitle, BodyText, Heading2 } from '../../components/ResponsiveText';
import { ResponsiveButton, PrimaryButton } from '../../components/ResponsiveButton';
import * as LucideIcons from 'lucide-react';
import type { Database } from '../../../lib/supabase/client';
import { CardRenderer } from './CardRenderer';
import { ScrollRevealCards } from './ScrollRevealCards';
import { CarouselCards } from './CarouselCards';
import { AdvancedLayoutContainer, useAdvancedLayout, type AdvancedLayout } from './AdvancedLayoutContainer';
import { AVAILABLE_LUCIDE_ICONS, LEGACY_ICON_ALIASES } from '../../../lib/constants/lucideIcons';  // ✅ FIX 2026-02-16: Usar lista centralizada
import { useMobileConfig } from '../../../lib/contexts/MobileConfigContext';

// ========================================================================
// ✅ GLOBAL SCALE COORDINATION (2026-02-21)
// Garante que TODAS as seções da página usem o mesmo zoom proporcional.
// Cada seção calcula sua escala individual (quanto precisa encolher para caber).
// O MÍNIMO global é aplicado a TODAS as seções, mantendo proporções consistentes.
// Seções com height:auto registram scale=1 (não precisam encolher individualmente)
// mas RECEBEM o zoom global (mantendo consistência visual com seções fixas).
// ========================================================================
const sectionScaleRegistry: Record<string, number> = {};
let globalScaleRafId: number | null = null;

function registerSectionScale(id: string, scale: number): void {
  sectionScaleRegistry[id] = scale;
  // Debounce: esperar todas as seções registrarem no mesmo frame
  if (globalScaleRafId !== null) cancelAnimationFrame(globalScaleRafId);
  globalScaleRafId = requestAnimationFrame(() => {
    globalScaleRafId = null;
    const minScale = Math.min(...Object.values(sectionScaleRegistry));
    window.dispatchEvent(new CustomEvent('globalTextScaleUpdate', { detail: minScale }));
  });
}

function getGlobalMinScale(): number {
  const scales = Object.values(sectionScaleRegistry);
  return scales.length > 0 ? Math.min(...scales) : 1;
}

function unregisterSection(id: string): void {
  delete sectionScaleRegistry[id];
}

type Section = {
  id: string;
  name?: string;
  type: string;
  config: any;
  elements?: any;   // JSONB — toggle flags (hasMedia, hasCards, etc.)
  layout?: any;     // JSONB — posições no grid 2×2
  styling?: any;    // JSONB — altura, padding, cores
  global?: boolean;
  published?: boolean;
  // ⚠️  NÃO inclui `order` — coluna não existe em `sections` (existe em `page_sections.order_index`)
};

type DesignToken = {
  id: string;
  category: string;
  name: string;
  value: any;
  label: string;
};

type MenuCard = Database['public']['Tables']['menu_cards']['Row'];

type Card = {
  id: string;
  name: string;
  type: string;
  config: any;
  global: boolean;
  published: boolean;
};

// Support both old format (section prop) and new format (type + config props)
type SectionRendererProps = 
  | { section: Section; type?: never; config?: never; styling?: never; layout?: never; elements?: never; sectionId?: string; sectionAnchorId?: string }
  | { type: string; config: any; styling?: any; layout?: any; elements?: any; section?: never; sectionId?: string; sectionAnchorId?: string };

export function SectionRenderer(props: SectionRendererProps) {
  // Handle both old and new prop formats
  const sectionType = props.section?.type || props.type;
  const sectionConfig = props.section?.config || props.config || {};
  const sectionStyling = props.section?.styling || props.styling || {};
  const sectionLayout = props.section?.layout || props.layout || {};
  const sectionId = props.sectionId || props.section?.id;
  const sectionAnchorId = props.sectionAnchorId;
  
  // ✅ EXTRAIR elements LOGO NO INÍCIO (2026-02-17)
  const elements = props.section?.elements || props.elements || {};
  
  // ✅ EXTRAIR cardDisplayMode LOGO NO INÍCIO (antes de qualquer uso)
  const cardDisplayMode = sectionConfig.cardDisplayMode || 'normal'; // 'normal' | 'compact'

  const [tokens, setTokens] = useState<Record<string, DesignToken>>({});
  const [cards, setCards] = useState<MenuCard[]>([]);
  const [sectionCards, setSectionCards] = useState<Card[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<any[]>([]); // ✅ NOVO: Estado para filtros
  
  // ✅ AUTO-FIT: Refs para escalonamento proporcional do texto em seções com altura fixa
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const autoFitFitting = useRef(false); // Guard contra re-entrada
  
  // ✅ SCROLL-REVEAL: Ref e estado para efeito de cards com scroll
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [scrollRevealProgress, setScrollRevealProgress] = useState(0);
  
  // Use DesignSystemContext
  const { getColor, getRadius, colors } = useDesignSystem();
  
  // ✅ Mobile config — per-section overrides from /admin/mobile-manager
  const { getSectionOverride, isMobile: isMobileViewport, global: mobileGlobal } = useMobileConfig();
  const mobileCfg = sectionId ? getSectionOverride(sectionId) : null;
  
  // 🔧 FIX: Verificar se estamos dentro do Router context antes de usar hooks
  const isInRouter = useInRouterContext();
  
  // React Router hooks para navegação suave (apenas se estiver em Router context)
  let navigate: any;
  let location: any;
  
  try {
    if (isInRouter) {
      navigate = useNavigate();
      location = useLocation();
    }
  } catch (error) {
    // Router hooks not available
  }

  /**
   * 🎯 Função de navegação com scroll suave para âncoras
   * - Detecta se é âncora na mesma página
   * - Faz scroll suave até a seção
   * - Se for página diferente, navega com React Router
   */
  const handleNavigation = (url: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    // Se não estiver em Router context, usar navegação padrão
    if (!isInRouter || !navigate || !location) {
      console.warn('⚠️ Router não disponível, usando navegação padrão');
      window.location.href = url;
      return;
    }
    
    // Parse da URL
    const [path, anchor] = url.split('#');
    const currentPath = location.pathname;
    
    // Caso 1: Âncora na mesma página (ex: /#secao ou /home#secao quando estamos em /home)
    if (anchor && (path === currentPath || path === '' || path === '/')) {
      // Normalizar ID da âncora (remover espaços, caracteres especiais)
      const anchorId = anchor.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const element = document.getElementById(anchorId);
      
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
        });
      }
      return;
    }
    
    // Caso 2: Página diferente com âncora
    if (anchor && path !== currentPath) {
      navigate(url);
      
      // Aguardar navegação e depois fazer scroll
      setTimeout(() => {
        const anchorId = anchor.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
          });
        }
      }, 100);
      return;
    }
    
    // Caso 3: Página diferente sem âncora
    navigate(url);
  };

  useEffect(() => {
    loadTokens();
    loadCards();
    // Carregar cards para qualquer tipo de seção que possa ter cards
    if (sectionId) {
      loadSectionCards();
    }
  }, [sectionId, sectionType, sectionConfig.cardTemplateId, sectionConfig.elements?.hasCards]); // ✅ CORREÇÃO 2026-02-17: Usar sectionConfig.elements ao invés de elements

  // ✅ NOVO: useEffect para carregar filtros quando sectionCards mudar
  useEffect(() => {
    const hasFilterIds = sectionCards.some((card: any) => card.filter_id);
    
    if (hasFilterIds) {
      const filterIds = Array.from(
        new Set(
          sectionCards
            .map((card: any) => card.filter_id)
            .filter(Boolean)
        )
      ) as string[];
      
      if (filterIds.length > 0) {
        const loadFilters = async () => {
          const { data } = await supabase
            .from('card_filters')
            .select('*')
            .in('id', filterIds)
            .order('order_index', { ascending: true });
          
          if (data) {
            setFilters(data);
            // Definir primeiro filtro como ativo se não houver
            if (!activeCategory && data.length > 0) {
              setActiveCategory(data[0].id);
            }
          }
        };
        loadFilters();
      }
    }
  }, [sectionCards]);

  // ✅ SCROLL-REVEAL: Rastrear progresso do scroll quando scroll-reveal está ativo
  const cardTemplateForEffect = sectionCards[0]?._template;
  // ✅ CORREÇÃO 2026-02-22: Respeitar toggle hasCards — scroll-reveal só ativa se cards estão ligados.
  // Sem isto, cards desligados no toggle mas existentes no banco ativavam scroll-reveal (100vh + sticky).
  const elementsHasCards = (() => {
    const v = elements.hasCards ?? sectionConfig.elements?.hasCards;
    if (typeof v === 'string') return v === 'true';
    if (typeof v === 'boolean') return v;
    // ✅ CORREÇÃO 2026-02-22: Toggle desligado (ou nunca ativado) = false.
    // Não inferir true a partir de cardTemplateId — toggle é a fonte de verdade.
    return false;
  })();
  const isScrollReveal = cardTemplateForEffect?.variant === 'scroll-reveal' && sectionCards.length > 0 && elementsHasCards;
  const isCarousel     = cardTemplateForEffect?.variant === 'carousel'      && sectionCards.length > 0 && elementsHasCards;
  
  useEffect(() => {
    if (!isScrollReveal) return;
    
    const handleScroll = () => {
      if (!scrollTrackRef.current) return;
      const rect = scrollTrackRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableRange = rect.height - viewportHeight;
      if (scrollableRange <= 0) return;
      
      // progress: 0 quando topo do track no topo do viewport, 1 quando acabou o scroll
      const scrolled = -rect.top;
      const prog = Math.max(0, Math.min(1, scrolled / scrollableRange));
      setScrollRevealProgress(prog);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Calcular posição inicial
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrollReveal, sectionCards.length]);

  async function loadTokens() {
    const { data } = await supabase
      .from('design_tokens')
      .select('*');

    if (data) {
      const tokensMap: Record<string, DesignToken> = {};
      data.forEach((token) => {
        tokensMap[token.id] = token;
      });
      setTokens(tokensMap);
    }
  }

  async function loadCards() {
    const { data } = await supabase
      .from('menu_cards')
      .select('*');

    if (data) {
      setCards(data);
    }
  }

  async function loadSectionCards() {
    if (!sectionId) {
      console.error('❌ [loadSectionCards] sectionId é undefined! Cards não serão carregados.');
      return;
    }
    
    const cardTemplateId = sectionConfig.cardTemplateId;
    
    if (!cardTemplateId) {
      // Seção não tem cards configurados - isso é válido, não �� erro
      return;
    }
    
    try {
      // Buscar template e cards via template_cards
      if (cardTemplateId) {
        
        const { data: templateData, error: templateError } = await supabase
          .from('card_templates')
          .select('*')
          .eq('id', cardTemplateId)
          .single();

        if (templateError) {
          console.error('❌ Erro ao carregar template:', templateError.message);
          return;
        }
        
        if (!templateData) {
          console.error('❌ Template não encontrado no banco! cardTemplateId:', cardTemplateId);
          return;
        }

        const { data, error } = await supabase
          .from('template_cards')
          .select('*')
          .eq('template_id', cardTemplateId)
          .order('order_index', { ascending: true });

        if (error) {
          console.error('❌ Erro ao carregar cards do template:', error.message);
          return;
        }

        if (data && data.length > 0) {
          // ✅ Anexar configuração do template aos cards
          const cardsWithTemplate = data.map((card: any) => ({
            ...card,
            _template: templateData, // Prefixo _ para indicar metadata
          }));
          setSectionCards(cardsWithTemplate);
        }
        return;
      }
    } catch (error) {
      console.error('❌ [loadSectionCards] Erro ao carregar cards:', error);
    }
  }

  /**
   * Get color value from token ID
   * First tries to find in tokens state, then falls back to DesignSystemContext
   * 
   * ✅ IMPORTANTE: Se tokenId === null, retorna 'transparent' (usuário selecionou "Nenhuma cor")
   * ��� Se tokenId === undefined, usa fallback (campo não foi configurado)
   */
  const getTokenValue = (tokenId: string | null | undefined, fallback: string) => {
    // ✅ Se explicitamente null, usuário selecionou "Nenhuma cor"
    if (tokenId === null) return 'transparent';
    
    // ✅ Se undefined ou string vazia, usar fallback
    if (!tokenId) return fallback;
    
    // Try from loaded tokens first
    if (tokens[tokenId]) {
      const token = tokens[tokenId];
      if (token.category === 'color' && token.value.hex) {
        return token.value.hex;
      }
    }
    
    // Fallback to DesignSystemContext
    const token = colors.find((t) => t.id === tokenId);
    if (token) {
      try {
        const parsed = JSON.parse(token.value);
        return parsed.color || fallback;
      } catch {
        return fallback;
      }
    }
    
    return fallback;
  };

  /**
   * Get typography token style (fontSize, fontWeight) from token ID
   */
  const getTypographyStyle = (tokenId: string | undefined): React.CSSProperties => {
    if (!tokenId || !tokens[tokenId]) return {};
    
    const token = tokens[tokenId];
    if (token.category !== 'typography') return {};
    
    try {
      const value = typeof token.value === 'string' ? JSON.parse(token.value) : token.value;
      return {
        fontSize: value.size,
        fontWeight: value.weight,
        lineHeight: value.lineHeight,
      };
    } catch {
      return {};
    }
  };

  const getLucideIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  const renderCard = (card: MenuCard, compact: boolean = false) => {
    const bgColor = getTokenValue(card.bg_color_token || undefined, '#ffffff');
    const borderColor = getTokenValue(card.border_color_token || undefined, getColor('muted') ?? '#e5e7eb');
    const iconColor = getTokenValue(card.icon_color_token || undefined, getColor('primary') ?? '#ea526e');
    const titleColor = getTokenValue(card.title_color_token || undefined, getColor('dark') ?? '#2e2240');
    const subtitleColor = getTokenValue(card.subtitle_color_token || undefined, getColor('dark') ?? '#020105');
    const cardRadius = getRadius('lg') || '24px';

    const CardIcon = card.icon ? (LucideIcons as any)[card.icon] : null;
    const cardUrl = card.url || '#';

    const content = (
      <>
        {CardIcon && (
          <div className={compact ? 'mb-2' : 'mb-4'} style={{ color: iconColor }}>
            <CardIcon className="h-5 w-5" />
          </div>
        )}
        {card.title && (
          <h4 
            className={`font-semibold ${compact ? 'text-sm mb-1' : 'text-lg mb-2'}`} 
            style={{ color: titleColor }}
          >
            {card.title}
          </h4>
        )}
        {card.subtitle && (
          <p 
            className={compact ? 'text-xs' : 'text-sm'} 
            style={{ color: subtitleColor }}
          >
            {card.subtitle}
          </p>
        )}
      </>
    );

    const className = `block border-2 hover:shadow-lg ${
      compact ? 'p-4' : 'p-6'
    }`;
    const style = {
      backgroundColor: bgColor,
      borderColor: borderColor,
      borderRadius: cardRadius,
      transition: 'none',
      animation: 'none',
    };

    return cardUrl && cardUrl !== '#' ? (
      <Link
        to={cardUrl}
        className={className}
        style={style}
      >
        {content}
      </Link>
    ) : (
      <div className={className} style={style}>
        {content}
      </div>
    );
  };

  // Use the extracted config
  const config = sectionConfig;
  const height = config.height || 'auto';
  const background = config.background || {};
  const layout = config.layout || {};
  const padding = config.padding || {};

  // Build inline styles
  const sectionStyle: React.CSSProperties = {
    height: height === 'auto' ? 'auto' : height,
    minHeight: height === 'auto' ? undefined : height,
    // ✅ NOVO 2026-02-17: Remover paddings do container (aplicados nas colunas)
    padding: 0,
    margin: 0,
  };

  // Background styles
  if (background.type === 'color' && background.color_token) {
    sectionStyle.backgroundColor = getTokenValue(background.color_token, getColor('background') ?? '#f6f6f6');
  } else if (background.type === 'image' && background.url) {
    sectionStyle.backgroundImage = `url(${background.url})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }

  // Dynamic colors
  const primaryColor = getColor('primary') ?? '#ea526e';
  const secondaryColor = getColor('secondary') ?? '#2e2240';
  const darkColor = getColor('dark') ?? '#2e2240';
  const mutedColor = getColor('muted') ?? '#6b7280';
  const backgroundColor = getColor('background') ?? '#f6f6f6';
  
  // ========================================================================
  // ✅ CORREÇ��O: Declarar variáveis ANTES da função renderUnifiedLayout
  // ========================================================================
  
  // Extrair dados comuns do config
  const smallTitle = sectionConfig.smallTitle || '';
  const title = sectionConfig.title || '';
  const subtitle = sectionConfig.subtitle || sectionConfig.description || sectionConfig.text || '';
  const ctaLabel = sectionConfig.ctaButton?.label || '';
  const ctaUrl = sectionConfig.ctaButton?.url || '';
  const mediaUrl = sectionConfig.mediaUrl || sectionConfig.image || '';
  const backgroundImage = sectionConfig.backgroundImage || '';
  const bgOpacity = sectionConfig.bgOpacity !== undefined ? sectionConfig.bgOpacity : 50;
  // ✅ CORREÇÃO 2026-02-23: Detectar se background é vídeo (CSS background-image NÃO suporta vídeo)
  const isBackgroundVideo = (() => {
    if (!backgroundImage) return false;
    const lower = backgroundImage.toLowerCase();
    const pathPart = lower.split('?')[0];
    return pathPart.endsWith('.mp4') || pathPart.endsWith('.webm') || pathPart.endsWith('.ogg') || pathPart.endsWith('.mov');
  })();
  const sectionHeightConfig = sectionConfig.sectionHeight || 'auto';
  const bgColorToken = sectionConfig.bgColor;
  
  // 🎯 Mapear altura da seção para valores CSS válidos
  const sectionHeightMap: Record<string, string> = {
    'auto': 'auto',
    'small': '25vh',
    '25vh': '25vh',
    'medium': '50vh',
    '50vh': '50vh',
    'large': '75vh',
    '75vh': '75vh',
    'full': '100vh',
    '100vh': '100vh',
  };
  const sectionHeight = sectionHeightMap[sectionHeightConfig] || sectionHeightConfig || 'auto';
  
  // ✅ CORREÇÃO: Extrair heightMode ANTES de renderUnifiedLayout
  const heightModeRaw = sectionStyling.height || sectionConfig.sectionHeight || sectionConfig.heightMode || 'auto';
  // ✅ SCROLL-REVEAL: Forçar heightMode '100vh' para que o grid interno use height:100% e não auto
  // ✅ Mobile override: force auto height on mobile when configured in /admin/mobile-manager
  const heightMode = isScrollReveal ? '100vh' 
    : (isMobileViewport && mobileCfg?.height) ? mobileCfg.height 
    : heightModeRaw;
  
  // ✅ NOVO: Usar spacing de styling (não mais paddingTop/Bottom do config)
  const spacingMap: Record<string, number> = {
    'none': 0,
    'xs': 8,
    'sm': 16,
    'md': 24,
    'lg': 32,
    'xl': 48,
    '2xl': 64,
  };
  
  // ✅ NOVO 2026-02-17: Função híbrida que aceita TOKENS e VALORES EM PX
  const parseSpacing = (value: string | number | undefined, defaultValue: number): number => {
    if (!value) return defaultValue;
    if (typeof value === 'number') return value;
    
    // 1. Tentar spacingMap primeiro (tokens: none, xs, sm, md, lg, xl, 2xl)
    if (spacingMap[value] !== undefined) {
      return spacingMap[value];
    }
    
    // 2. Fallback: extrair número de string px ("0px" → 0, "32px" → 32)
    // ✅ CORREÇÃO 2026-02-17: Usar verificação explícita ao invés de || para permitir 0
    const parsed = parseInt(value.replace('px', ''));
    return !isNaN(parsed) ? parsed : defaultValue;
  };
  
  // ✅ CORREÇÃO 2026-02-17: Usar parseSpacing para TODOS os spacings (consistência)
  // ✅ CORREÇÃO 2026-02-17: Todos os fallbacks agora são 50px (novo padrão)
  const paddingTopConfig = parseSpacing(sectionStyling.spacing?.top, 50);
  const paddingBottomConfig = parseSpacing(sectionStyling.spacing?.bottom, 50);
  const paddingLeftConfig = parseSpacing(sectionStyling.spacing?.left || sectionConfig.paddingLeft, 50);
  const paddingRightConfig = parseSpacing(sectionStyling.spacing?.right || sectionConfig.paddingRight, 50);
  const columnGapConfig = parseSpacing(sectionStyling.spacing?.gap || sectionConfig.columnGap, 50);
  const rowGapConfig = parseSpacing(sectionStyling.spacing?.rowGap, 50); // ✅ NOVO 2026-02-17: Gap entre linhas
  
  // ✅ CORREÇÃO: Validar gridRows e gridCols entre 1-2
  // ✅ FIX 2026-02-14: Ler de sectionConfig (gridRows/Cols estão no 'config')
  let gridRows = Math.min(2, Math.max(1, sectionConfig.gridRows || 1));
  const gridCols = Math.min(2, Math.max(1, sectionConfig.gridCols || 1));
  
  // ⚠️ VALIDAÇÃO: Detectar conflito entre gridRows e posições
  // ✅ FIX 2026-02-14: Extrair .position de objetos (compatibilidade com dados legados)
  const textPos = typeof sectionLayout.desktop?.text === 'string' 
    ? sectionLayout.desktop.text 
    : (sectionLayout.desktop?.text?.position || '');
  const mediaPos = typeof sectionLayout.desktop?.media === 'string' 
    ? sectionLayout.desktop.media 
    : (sectionLayout.desktop?.media?.position || '');
  const cardsPos = typeof sectionLayout.desktop?.cards === 'string' 
    ? sectionLayout.desktop.cards 
    : (sectionLayout.desktop?.cards?.position || '');
  
  const needsTwoRows = textPos.includes('middle-') || textPos === 'center' || 
                       mediaPos.includes('middle-') || mediaPos === 'center' ||
                       cardsPos.includes('middle-') || cardsPos === 'center';
  
  // ✅ FIX 2026-02-15: CORREÇÃO AUTOMÁTICA de conflito de gridRows
  if (gridRows === 1 && needsTwoRows) {
    gridRows = 2; // ✅ Auto-fix: posições requerem 2 linhas mas gridRows = 1
  }
  
  // ✅ NOVO: Função para mapear GridPosition para {gridColumn, gridRow}
  // ✅ FIX 2026-02-15: Função deve ser definida APÓS termos gridRows e gridCols
  // Será definida mais abaixo após calcular effectiveGridCols e effectiveGridRows
  
  // ✅ NOVO: Extrair rowHeightPriority
  const rowHeightPriority = sectionConfig.rowHeightPriority || 'content'; // 'media' | 'content'
  
  // ✅ NOVO: Extrair rowPriority (prioridade entre row 1 e row 2)
  const rowPriority = sectionConfig.rowPriority || 'equal'; // 'row1' | 'row2' | 'equal'
  
  // Elementos selecionados (já extraído no topo do componente - linha 59)
  // const elements = sectionConfig.elements || {}; // ❌ REMOVIDO: Causava sobrescrita
  const _hasIcon = elements.hasIcon !== undefined ? elements.hasIcon : !!sectionConfig.icon;  // ✅ FIX 2026-02-16: Fallback inteligente para ícone
  const hasMinorTitle = elements.hasMinorTitle !== undefined ? elements.hasMinorTitle : !!smallTitle;
  const hasMainTitle = elements.hasMainTitle !== undefined ? elements.hasMainTitle : true;
  const hasSubtitle = elements.hasSubtitle !== undefined ? elements.hasSubtitle : !!subtitle;
  const _hasButton = elements.hasButton !== undefined ? elements.hasButton : !!(ctaLabel || sectionConfig.ctaButton?.hasIcon);
  const _hasMedia = elements.hasMedia !== undefined ? elements.hasMedia : !!mediaUrl;

  // ✅ Mobile visibility overrides from /admin/mobile-manager
  const hasIcon = (isMobileViewport && mobileCfg?.hideIcon) ? false : _hasIcon;
  const hasButton = (isMobileViewport && mobileCfg?.hideButton) ? false : _hasButton;
  const hasMedia = (isMobileViewport && mobileCfg?.hideMedia) ? false : _hasMedia;
  
  // ✅ CORREÇÃO FINAL 2026-02-17: Leitura robusta com múltiplos fallbacks
  const hasCards = (() => {
    // Passo 1: Tentar ler de elements.hasCards (pode ser boolean, string ou undefined)
    let elementsValue = elements.hasCards;
    
    // Passo 1.5: Se undefined em elements, tentar ler de sectionConfig.elements.hasCards
    if (elementsValue === undefined && sectionConfig.elements?.hasCards !== undefined) {
      elementsValue = sectionConfig.elements.hasCards;
    }
    
    // Passo 2: Converter string "true"/"false" para boolean
    if (typeof elementsValue === 'string') {
      return elementsValue === 'true';
    }
    
    // Passo 3: Se for boolean, usar diretamente
    if (typeof elementsValue === 'boolean') {
      return elementsValue;
    }
    
    // ✅ CORREÇÃO 2026-02-22: Toggle desligado (ou nunca ativado) = false.
    // Não inferir true a partir de cardTemplateId — toggle é a única fonte de verdade.
    // Se elements.hasCards nunca foi definido, tratar como desligado.
    return false;
  })();
  
  // ✅ Mobile override: hide cards when configured in /admin/mobile-manager
  const hasCardsEffective = (isMobileViewport && mobileCfg?.hideCards) ? false : hasCards;

  // ✅ CORREÇÃO 2026-02-16: Ler fitMode de config.media (prioridade) ou elements.mediaDisplayMode (fallback)
  const mediaDisplayMode = sectionConfig.media?.fitMode || elements.mediaDisplayMode || 'ajustada';
  
  // 🆕 DETECTAR SE MÍDIA ESTÁ EM MODO AMPLIADO + CENTRO
  const mediaAlign = sectionConfig.layout?.desktop?.media?.horizontal || 'right';
  const isMediaFullWidth = hasMedia && (mediaDisplayMode === 'cobrir' || mediaDisplayMode === 'contida') && mediaAlign === 'center';
  
  // ✅ AUTO-FIT: Determinar se seção usa grid layout (texto em coluna própria)
  // Apenas ativa para seções com altura fixa + grid layout (onde texto tem coluna dedicada)
  const wouldForceGridForText = gridCols === 1 && !hasMedia && 
    (textPos?.includes('left') || textPos?.includes('center'));
  // ✅ NOVO: Alinhamento vertical da SECTION (para flex center)
  const mediaVerticalAlign = sectionConfig.layout?.desktop?.media?.verticalAlign || 'center';
  const sectionAlignItems = {
    'top': 'flex-start',
    'center': 'center',
    'bottom': 'flex-end',
  }[mediaVerticalAlign] || 'center';
  
  // Estilos unificados
  const smallTitleStyle: React.CSSProperties = {
    color: getTokenValue(sectionConfig.smallTitleColor, mutedColor),
    ...getTypographyStyle(sectionConfig.smallTitleFontSize),
    whiteSpace: 'pre-line',
  };

  const titleStyle: React.CSSProperties = {
    color: getTokenValue(sectionConfig.titleColor, darkColor),
    ...getTypographyStyle(sectionConfig.titleFontSize),
    whiteSpace: 'pre-line',
    lineHeight: 1.2,
  };

  const subtitleStyle: React.CSSProperties = {
    color: getTokenValue(
      sectionConfig.subtitleColor || sectionConfig.descriptionColor || sectionConfig.textColor, 
      mutedColor
    ),
    ...getTypographyStyle(
      sectionConfig.subtitleFontSize || sectionConfig.descriptionFontSize || sectionConfig.textFontSize
    ),
    whiteSpace: 'pre-line',
  };

  const ctaButtonStyle: React.CSSProperties = {
    color: getTokenValue(
      sectionConfig.ctaTextColor !== undefined ? sectionConfig.ctaTextColor : sectionConfig.buttonTextColor,
      '#ffffff'
    ),
    backgroundColor: getTokenValue(
      sectionConfig.ctaBgColor !== undefined ? sectionConfig.ctaBgColor : sectionConfig.buttonBgColor,
      'transparent'
    ),
    borderColor: getTokenValue(
      sectionConfig.ctaBorderColor !== undefined ? sectionConfig.ctaBorderColor : sectionConfig.buttonBorderColor,
      primaryColor
    ),
    borderWidth: '2px',
    borderStyle: 'solid',
    ...getTypographyStyle(sectionConfig.ctaLabelFontSize || sectionConfig.buttonFontSize),
  };

  const iconColor = getTokenValue(sectionConfig.iconColor, primaryColor);

  // Background da seção
  const sectionBgStyle: React.CSSProperties = {};
  // ✅ CORREÇÃO 2026-02-23: Só aplicar background-image CSS para imagens (não vídeos)
  if (backgroundImage && !isBackgroundVideo) {
    sectionBgStyle.backgroundImage = `url(${backgroundImage})`;
    sectionBgStyle.backgroundSize = 'cover';
    sectionBgStyle.backgroundPosition = 'center';
    sectionBgStyle.backgroundRepeat = 'no-repeat';
  }
  if (bgColorToken) {
    sectionBgStyle.backgroundColor = getTokenValue(bgColorToken, backgroundColor);
  }
  
  // ========================================================================
  // ✅ AUTO-FIT + GLOBAL SCALE (2026-02-21)
  // Sistema de escalonamento proporcional de texto em 2 fases:
  //   FASE 1 (medição): Cada seção com altura fixa calcula quanto precisa encolher.
  //                     Seções com altura auto registram scale=1 (conteúdo cabe naturalmente).
  //   FASE 2 (aplicação): O MÍNIMO global é aplicado a TODAS as seções da página,
  //                       garantindo que ícone, chamada, título, subtítulo e botão
  //                       tenham tamanhos proporcionais e consistentes entre seções.
  //
  // Técnica: CSS `zoom` (não `transform:scale()`) — causa re-quebra de linha (text reflow).
  // Compensação de largura: `width: ${100/scale}%` para que `(100%/s) × s = 100%`.
  // ========================================================================
  
  const tokenCount = Object.keys(tokens).length; // Dep para re-fit quando tokens carregam
  
  // Helper: aplica o zoom global ao textContentRef desta seção
  const applyScale = useCallback((scale: number) => {
    const content = textContentRef.current;
    if (!content) return;
    
    // ✅ CORREÇÃO 2026-02-23: No mobile (< 768px), NÃO aplicar zoom trick.
    // O zoom: 0.55 + width: 181.818% encolhe todo o texto para 55%, tornando
    // impossível ter títulos grandes no mobile. Sem zoom, o CSS responsivo
    // (clamp, vw) funciona diretamente e o texto preenche a tela.
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      content.style.zoom = '';
      content.style.width = '';
      return;
    }
    
    if (scale < 1) {
      content.style.zoom = `${scale}`;
      // Compensar encolhimento de largura: (100%/scale) × scale = 100% renderizado
      content.style.width = `${100 / scale}%`;
    } else {
      content.style.zoom = '';
      content.style.width = '';
    }
  }, []);
  
  const fitText = useCallback(() => {
    if (autoFitFitting.current) return; // Prevenir re-entrada
    autoFitFitting.current = true;
    
    const container = textContainerRef.current;
    const content = textContentRef.current;
    
    if (!container || !content) {
      autoFitFitting.current = false;
      return;
    }
    
    // ── Seções com altura auto: não medem individualmente ──
    // Registram scale=1 (conteúdo cabe naturalmente) e aplicam o mínimo global.
    // NÃO resetam zoom porque isso causaria loop com ResizeObserver
    // (reset → container cresce → observer dispara → reset → loop).
    if (heightMode === 'auto') {
      if (sectionId) registerSectionScale(sectionId, 1);
      applyScale(getGlobalMinScale());
      setTimeout(() => { autoFitFitting.current = false; }, 50);
      return;
    }
    
    // ── Seções com altura fixa: medir e calcular escala individual ──
    
    // 1. Reset para medir tamanho natural
    content.style.zoom = '';
    content.style.width = '';
    
    // 2. Forçar reflow para obter medidas precisas
    void content.offsetHeight;
    
    const containerH = container.clientHeight;
    const contentH = content.scrollHeight;
    
    // 3. Calcular escala individual (mínimo 0.55 para legibilidade)
    let individualScale = 1;
    if (contentH > containerH && containerH > 0) {
      individualScale = Math.max(0.55, containerH / contentH);
    }
    
    // 4. Registrar no sistema global
    if (sectionId) registerSectionScale(sectionId, individualScale);
    
    // 5. Aplicar: usar o MÍNIMO entre escala individual e global
    //    (global pode ser menor se outra seção precisa encolher mais)
    const globalScale = getGlobalMinScale();
    const effectiveScale = Math.min(individualScale, globalScale);
    applyScale(effectiveScale);
    
    // Liberar guard após curto delay (evita loop com ResizeObserver)
    setTimeout(() => { autoFitFitting.current = false; }, 50);
  }, [heightMode, sectionId, applyScale]);
  
  // ✅ AUTO-FIT: Aplicar antes do paint (evita flash de conteúdo cortado)
  useLayoutEffect(() => {
    fitText();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitText, title, subtitle, smallTitle, hasIcon, hasMinorTitle, hasMainTitle, hasSubtitle, hasButton, tokenCount]);
  
  // ✅ AUTO-FIT: Re-aplicar quando viewport/container muda de tamanho
  // Apenas para seções com altura FIXA (auto-height não precisa de ResizeObserver)
  useEffect(() => {
    if (heightMode === 'auto') return;
    
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(fitText);
    });
    
    if (textContainerRef.current) {
      observer.observe(textContainerRef.current);
    }
    
    // Também re-fit quando fontes carregam (pode alterar tamanhos de texto)
    document.fonts.ready.then(() => {
      requestAnimationFrame(fitText);
    });
    
    return () => observer.disconnect();
  }, [heightMode, fitText]);
  
  // ✅ GLOBAL SCALE: Ouvir atualizações de outras seções e re-aplicar
  useEffect(() => {
    const handler = (e: Event) => {
      const globalScale = (e as CustomEvent).detail as number;
      applyScale(globalScale);
    };
    window.addEventListener('globalTextScaleUpdate', handler);
    return () => {
      window.removeEventListener('globalTextScaleUpdate', handler);
      // Limpar registro ao desmontar
      if (sectionId) unregisterSection(sectionId);
    };
  }, [sectionId, applyScale]);
  
  /**
   * 🎯 SISTEMA UNIFICADO DE LAYOUT
   * Renderiza qualquer seção com layout configurável (ícone, texto, mídia, cards, etc)
   */
  const renderUnifiedLayout = (options: {
    elements?: any;
    layout?: any;
    gridCols?: number; // ✅ NOVO: Receber gridCols explicitamente
    gridRows?: number; // ✅ NOVO: Receber gridRows explicitamente
    content: {
      icon?: string;
      iconColor?: string;
      smallTitle?: string;
      smallTitleStyle?: React.CSSProperties;
      title?: string;
      titleStyle?: React.CSSProperties;
      subtitle?: string;
      subtitleStyle?: React.CSSProperties;
      ctaLabel?: string;
      ctaUrl?: string;
      ctaStyle?: React.CSSProperties;
      ctaHasIcon?: boolean; // ✅ NOVO
      ctaIcon?: string; // ✅ NOVO
      ctaIconSize?: number; // ✅ NOVO
      ctaIconColor?: string; // ✅ NOVO
      ctaIconEffect?: string; // ✅ NOVO: Efeito de animação
      mediaUrl?: string;
      customContent?: React.ReactNode; // Para tabs navigation, cards grid, etc
    };
    // ❌ REMOVIDO: sectionLines (determinado automaticamente pelo layout)
  }) => {
    const { elements = {}, layout = {}, content, gridCols: propsGridCols, gridRows: propsGridRows } = options;
    
    // ✅ CORREÇÃO: Usar valores passados como props, com fallback para escopo externo
    const effectiveGridCols = propsGridCols !== undefined ? propsGridCols : gridCols;
    const effectiveGridRows = propsGridRows !== undefined ? propsGridRows : gridRows;
    
    // Elementos selecionados
    const hasIcon = elements.hasIcon !== undefined ? elements.hasIcon : false;
    const hasMinorTitle = elements.hasMinorTitle !== undefined ? elements.hasMinorTitle : !!content.smallTitle;
    const hasMainTitle = elements.hasMainTitle !== undefined ? elements.hasMainTitle : !!content.title;
    const hasSubtitle = elements.hasSubtitle !== undefined ? elements.hasSubtitle : !!content.subtitle;
    const hasButton = elements.hasButton !== undefined ? elements.hasButton : !!(content.ctaLabel || content.ctaHasIcon);
    const hasMedia = elements.hasMedia !== undefined ? elements.hasMedia : !!content.mediaUrl;
    // ✅ CORREÇÃO 2026-02-17: Respeitar APENAS o toggle (ignorar customContent)
    const hasCards = elements.hasCards !== undefined ? elements.hasCards : false;
    
    // ✅ CORREÇÃO 2026-02-16: Ler fitMode de config.media (prioridade) ou elements.mediaDisplayMode (fallback)
    const mediaDisplayMode = sectionConfig.media?.fitMode || elements.mediaDisplayMode || 'ajustada';
    
    // ✅ FIX: Definir desktopLayout ANTES de getMediaStyles() para evitar erro de inicialização
    const desktopLayout = layout.desktop || {};
    
    // ✅ Definir alinhamento horizontal da mídia ANTES de getMediaStyles() para uso no case 'alinhada'
    const mediaHorizontalAlign = 
      sectionConfig.media?.alignX ||           // ← Prioridade 1
      'center';                                // ← Fallback
    
    // 🆕 Função para obter classes e estilos da mídia baseado no modo
    const getMediaStyles = () => {
      // ✅ CORREÇÃO 2026-02-16: Buscar alinhamento vertical de config.media.alignY PRIMEIRO
      const verticalAlign = 
        sectionConfig.media?.alignY ||           // ← Prioridade 1: config.media.alignY
        desktopLayout.media?.verticalAlign ||    // ← Prioridade 2: layout.desktop.media.verticalAlign
        'center';                                // ← Fallback
      const objectPosition = {
        'top': 'top',
        'center': 'center',
        'bottom': 'bottom',
      }[verticalAlign] || 'center';

      // 🎯 CRITICAL FIX: Remover h-full quando sectionHeight === 'auto'
      // Isso permite que a mídia tenha altura natural ao invés de forçar 100%
      const shouldUseFullHeight = sectionHeight !== 'auto';

      switch (mediaDisplayMode) {
        case 'contida':
          // 📦 Contida: Exibe 100% da mídia, proporcional, SEM cortes (pode ter espaço vazio)
          return {
            containerClass: 'p-0', // ✅ ZERO padding
            imgClass: `w-full ${shouldUseFullHeight ? 'h-full' : 'h-auto'} object-contain`, // ✅ h-full apenas se altura fixa
            imgStyle: { 
              borderRadius: '0',
              objectPosition: objectPosition,
            },
          };
        case 'cobrir':
          // 🔲 Cobrir: Maximiza mídia, COM cortes, exibe centro
          return {
            containerClass: 'p-0', // ✅ ZERO padding
            imgClass: `w-full ${shouldUseFullHeight ? 'h-full' : 'h-auto'} object-cover`, // ✅ h-full apenas se altura fixa
            imgStyle: { 
              borderRadius: '0',
              objectPosition: objectPosition,
            },
          };
        case 'expandida':
          // 🎯 Expandida: Preenche espaço disponível, COM cortes se necessário (similar a cobrir)
          return {
            containerClass: 'p-0', // ✅ ZERO padding
            imgClass: `w-full ${shouldUseFullHeight ? 'h-full' : 'h-auto'} object-cover`, // ✅ h-full apenas se altura fixa
            imgStyle: { 
              borderRadius: '0',
              objectPosition: objectPosition,
            },
          };
        case 'alinhada':
          // ✅ CORREÇÃO #2 (2026-02-16): Alinhada - Cola perfeitamente nas bordas (sem espaço vazio)
          return {
            containerClass: 'p-0', // ✅ ZERO padding
            imgClass: 'object-contain', // ✅ SEM w-full/h-full para permitir alinhamento flex
            imgStyle: { 
              borderRadius: '0',
              // ❌ NÃO incluir objectPosition (não funciona com position: absolute)
              maxWidth: '100%',   // ✅ CORRIGIDO: 90% → 100% (cola nas bordas)
              maxHeight: '100%',  // ✅ CORRIGIDO: 90% → 100% (sem espaço vazio)
              width: 'auto',      // Permitir tamanho natural
              height: 'auto',
            },
          };
        case 'ajustada':
        default:
          // 📐 Ajustada: Preserva altura OU largura, estende máximo possível, SEM cortes
          return {
            containerClass: 'p-0', // ✅ ZERO padding
            imgClass: `w-full ${shouldUseFullHeight ? 'h-full' : 'h-auto'} object-contain`, // ✅ h-full apenas se altura fixa
            imgStyle: { 
              borderRadius: '0',
              objectPosition: objectPosition,
            },
          };
      }
    };
    
    const mediaStyles = getMediaStyles();
    
    // 🔄 HELPER: Converter GridPosition para alinhamento horizontal
    const getHorizontalAlign = (position: any): 'left' | 'center' | 'right' => {
      // Se for string (novo formato Grid 2x2)
      if (typeof position === 'string') {
        if (position.includes('left')) return 'left';
        if (position.includes('right')) return 'right';
        return 'center'; // center, top-center, bottom-center, etc
      }
      // Se for objeto (formato legado)
      if (typeof position === 'object' && position?.horizontal) {
        return position.horizontal;
      }
      return 'center'; // fallback
    };
    
    // Layout configurado (já definido acima)
    const textAlign = getHorizontalAlign(desktopLayout.text);
    const mediaAlign = getHorizontalAlign(desktopLayout.media) || 'right';
    // 🔧 FIX: Não usar fallback para cardsAlign - se não estiver configurado, deixar undefined
    const cardsAlign = desktopLayout.cards ? getHorizontalAlign(desktopLayout.cards) : undefined;
    
    // ✅ NOVO: Alinhamento HORIZONTAL do texto (gerencia todo o bloco: ícone, chamada, título, subtítulo, botão)
    // ✅ CORREÇÃO #3 (2026-02-16): Adicionar fallback para layout.mobile.textAlign
    const textAlignInternal = desktopLayout.textAlign || desktopLayout.text?.textAlign || layout.mobile?.textAlign || textAlign;
    
    // ✅ NOVO: Alinhamento VERTICAL do texto (gerencia todo o bloco: ícone, chamada, título, subtítulo, botão)
    const textVerticalAlign = desktopLayout.verticalAlign || 'center';
    const textVerticalAlignClass = {
      'top': 'justify-start',
      'center': 'justify-center',
      'bottom': 'justify-end',
    }[textVerticalAlign] || 'justify-center';
    
    // ✅ CORREÇÃO 2026-02-16: Classe de alinhamento vertical da mídia (buscar de config.media.alignY)
    const mediaVerticalAlign = 
      sectionConfig.media?.alignY ||           // ← Prioridade 1
      desktopLayout.media?.verticalAlign ||    // ← Prioridade 2
      'center';                                // ← Fallback
    
    const mediaVerticalAlignClass = {
      'top': 'items-start',
      'center': 'items-center',
      'bottom': 'items-end',
    }[mediaVerticalAlign] || 'items-center';
    
    // ✅ CORREÇÃO 2026-02-16: Classe de alinhamento HORIZONTAL da mídia
    const mediaHorizontalAlignClass = {
      'left': 'justify-start',
      'center': 'justify-center',
      'right': 'justify-end',
    }[mediaHorizontalAlign] || 'justify-center';
    
    // ✅ NOVO: Alinhamento vertical da SECTION (para flex center)
    const sectionAlignItems = {
      'top': 'flex-start',
      'center': 'center',
      'bottom': 'flex-end',
    }[mediaVerticalAlign] || 'center';
    
    // 🆕 DETECTAR SE MÍDIA DEVE OCUPAR 2 COLUNAS
    // Mídia ocupa 2 colunas quando: modo maior_largura + alinhamento centro
    const mediaSpansTwoColumns = (mediaDisplayMode === 'ampliada' || mediaDisplayMode === 'maior_largura') && mediaAlign === 'center';
    
    // Classes de alinhamento (posição na grid)
    const textAlignClass = {
      'left': 'text-left',
      'center': 'text-center',
      'right': 'text-right',
    }[textAlign] || 'text-center';
    
    // ✅ NOVO: Classes de alinhamento INTERNO do texto
    const textAlignInternalClass = {
      'left': 'text-left',
      'center': 'text-center',
      'right': 'text-right',
    }[textAlignInternal] || 'text-center';
    
    // ✅ FIX: textJustifyClass deve usar textAlignInternal, não textAlign!
    // Isso garante que ícone e botão sigam o alinhamento interno do texto
    const textJustifyClass = {
      'left': 'justify-start',
      'center': 'justify-center',
      'right': 'justify-end',
    }[textAlignInternal] || 'justify-center';
    
    // ✅ NOVO: Classes para alinhar o ELEMENTO em si (não apenas o texto)
    const elementAlignClass = {
      'left': '', // Alinhamento padrão à esquerda
      'center': 'mx-auto', // Centraliza o elemento
      'right': 'ml-auto', // Alinha à direita
    }[textAlignInternal] || '';
    
    // ✅ NOVO: Largura máxima do subtítulo (para não ficar muito largo)
    const subtitleWidthClass = 'w-full max-w-4xl';
    
    const mediaJustifyClass = {
      'left': 'justify-start',
      'center': 'justify-center',
      'right': 'justify-end',
    }[mediaAlign] || 'justify-end';
    
    const cardsJustifyClass = {
      'left': 'justify-start',
      'center': 'justify-center',
      'right': 'justify-end',
    }[cardsAlign] || 'justify-center';
    
    // ✅ NOVO 2026-02-17: Alinhamento VERTICAL dos cards (ler de config.cards.alignY)
    const cardsAlignY = sectionConfig.cards?.alignY || 'middle';
    const cardsVerticalAlignClass = {
      'top': 'justify-start',
      'middle': 'justify-center',  // ✅ "middle" mapeia para "justify-center"
      'bottom': 'justify-end',
    }[cardsAlignY] || 'justify-center';
    
    // 🆕 DETECTAR SE CARDS DEVEM FICAR EM COLUNA SEPARADA
    // Cards ficam separados se:
    // 1. Tem cards E não tem mídia (cards substituem mídia)
    // 2. Cards estão em posição horizontal diferente do texto
    // ✅ CORREÇÃO 2026-02-17: Considerar também posições no grid 2×2
    
    // ✅ FIX 2026-02-15: Detectar se texto está em posição "center" com grid 2x2
    // Quando textPosition = "center" E gridCols = 2 E gridRows = 2, deve usar grid para ocupar todo espaço
    // 🔧 CORREÇÃO: Extrair posição corretamente (pode ser string ou objeto)
    const getGridPosition = (position: any): string | undefined => {
      // Se for string direta (novo formato)
      if (typeof position === 'string') {
        return position;
      }
      // Se for objeto (formato legado)
      if (typeof position === 'object' && position?.position) {
        return position.position;
      }
      return undefined;
    };
    
    const hasCardsInSeparateColumn = hasCards && content.customContent && (() => {
      // ✅ SCROLL-REVEAL: Cards em scroll-reveal SEMPRE ficam em coluna separada
      if (isScrollReveal) return true;
      
      // ✅ CORREÇÃO 2026-02-17: Suportar 3 cenários de cards separados
      
      // CENÁRIO 1: Cards SEM mídia (cards substituem mídia na coluna)
      if (!hasMedia) {
        // Em grid 2×2, verificar se posições são diferentes
        if (effectiveGridCols === 2 && effectiveGridRows === 2) {
          const textPos = getGridPosition(desktopLayout.text);
          const cardsPos = getGridPosition(desktopLayout.cards);
          // Cards separados se posições diferentes (ex: middle-left vs middle-right)
          return textPos !== cardsPos;
        }
        // Em grid 2×1 ou 1×2, verificar alinhamento horizontal
        return cardsAlign !== textAlign;
      }
      
      // CENÁRIO 2: Cards COM mídia E texto em grid 2×2 (row 2 completa)
      if (hasMedia && effectiveGridCols === 2 && effectiveGridRows === 2) {
        const textPos = getGridPosition(desktopLayout.text);
        const mediaPos = getGridPosition(desktopLayout.media);
        const cardsPos = getGridPosition(desktopLayout.cards);
        
        // Cards em posição que ocupa linha inteira (bottom-center)
        if (cardsPos === 'bottom-center') {
          return true;
        }
        
        // Verificar se cards estão em linha diferente (row 2) enquanto texto/mídia em row 1
        const textInRow1 = textPos?.includes('top');
        const mediaInRow1 = mediaPos?.includes('top');
        const cardsInRow2 = cardsPos?.includes('bottom');
        
        if (textInRow1 && mediaInRow1 && cardsInRow2) {
          return true;
        }
        
        return false;
      }
      
      // CENÁRIO 3: Outros casos (fallback)
      return false;
    })();
    
    // ✅ Extrair posições do grid (já definido acima)
    const textPosition = getGridPosition(desktopLayout.text);
    const mediaPosition = getGridPosition(desktopLayout.media);
    const cardsPosition = getGridPosition(desktopLayout.cards);
    
    const isTextCenterInGrid2x2 = textPosition === 'center' && effectiveGridCols === 2 && effectiveGridRows === 2;
    
    // ✅ NOVO 2026-02-15: Função para mapear GridPosition para {gridColumn, gridRow}
    // Agora considera o número real de linhas e colunas do grid
    const getGridCellPosition = (position: string | undefined): { gridColumn: string; gridRow: string } => {
      if (!position) return { gridColumn: '1', gridRow: '1' };
      
      // 🔧 Para grid 2×2 (2 colunas, 2 linhas)
      if (effectiveGridCols === 2 && effectiveGridRows === 2) {
        const mapping: Record<string, { gridColumn: string; gridRow: string }> = {
          'top-left': { gridColumn: '1', gridRow: '1' },
          'top-center': { gridColumn: '1 / 3', gridRow: '1' },
          'top-right': { gridColumn: '2', gridRow: '1' },
          'bottom-left': { gridColumn: '1', gridRow: '2' },
          'bottom-center': { gridColumn: '1 / 3', gridRow: '2' },
          'bottom-right': { gridColumn: '2', gridRow: '2' },
          'middle-left': { gridColumn: '1', gridRow: '1 / 3' },
          'middle-right': { gridColumn: '2', gridRow: '1 / 3' },
          'center': { gridColumn: '1 / 3', gridRow: '1 / 3' },
        };
        return mapping[position] || { gridColumn: '1', gridRow: '1' };
      }
      
      // 🔧 Para grid 2×1 (2 colunas, 1 linha) - CENÁRIO ATUAL
      if (effectiveGridCols === 2 && effectiveGridRows === 1) {
        // Todas as posições ficam na linha 1, mas respeitam colunas
        if (position.includes('left')) return { gridColumn: '1', gridRow: '1' };
        if (position.includes('right')) return { gridColumn: '2', gridRow: '1' };
        if (position.includes('center') || position === 'center') return { gridColumn: '1 / 3', gridRow: '1' };
        return { gridColumn: '1', gridRow: '1' };
      }
      
      // 🔧 Para grid 1×2 (1 coluna, 2 linhas)
      if (effectiveGridCols === 1 && effectiveGridRows === 2) {
        // Todas as posições ficam na coluna 1, mas respeitam linhas
        if (position.includes('top')) return { gridColumn: '1', gridRow: '1' };
        if (position.includes('bottom')) return { gridColumn: '1', gridRow: '2' };
        if (position.includes('middle') || position === 'center') return { gridColumn: '1', gridRow: '1 / 3' };
        return { gridColumn: '1', gridRow: '1' };
      }
      
      // 🔧 Para grid 1×1 (1 coluna, 1 linha) - fallback
      return { gridColumn: '1', gridRow: '1' };
    };
    
    // ✅ NOVO: Calcular posições no grid para cada elemento
    const textGridPosition = getGridCellPosition(textPosition);
    const mediaGridPosition = getGridCellPosition(mediaPosition);
    const cardsGridPosition = getGridCellPosition(cardsPosition);
    

    
    // ✅ NOVO: Detectar elementos únicos em grid 2x2 (devem ocupar toda a seção)
    const hasTextContent = hasIcon || hasMinorTitle || hasMainTitle || hasSubtitle || hasButton;
    const visibleElementsCount = [hasTextContent, hasMedia, hasCards].filter(Boolean).length;
    const isSingleElementInGrid2x2 = visibleElementsCount === 1 && effectiveGridCols === 2 && effectiveGridRows === 2;
    
    // ✅ NOVO: Determinar qual elemento único deve ocupar toda a seção
    const isOnlyTextInGrid2x2 = isSingleElementInGrid2x2 && hasTextContent && !hasMedia && !hasCards;
    const isOnlyMediaInGrid2x2 = isSingleElementInGrid2x2 && hasMedia && !hasTextContent && !hasCards;
    const isOnlyCardsInGrid2x2 = isSingleElementInGrid2x2 && hasCards && !hasTextContent && !hasMedia;
    

    
    // ✅ NOVO 2026-02-18: Detectar se texto deve ficar apenas no lado esquerdo (50%)
    // Quando gridCols = 1 MAS posição contém "left", criar grid 2 colunas com texto à esquerda
    // ✅ CORREÇÃO 2026-02-22: Removido 'center' — texto centralizado NÃO deve
    // forçar grid 2 colunas com layout de coluna esquerda. Apenas posições 'left' ativam.
    const isTextOnlyLeft = effectiveGridCols === 1 && 
                           !hasMedia && 
                           !hasCardsInSeparateColumn && 
                           textPosition?.includes('left');
    
    // Se houver mídia OU cards em coluna separada OU elemento único em grid 2x2 OU texto apenas na esquerda, usar grid
    const useGrid = hasMedia || hasCardsInSeparateColumn || isSingleElementInGrid2x2 || isTextOnlyLeft;
    
    // ✅ FIX 2026-02-16: Usar lista centralizada de ícones
    const AVAILABLE_ICONS = AVAILABLE_LUCIDE_ICONS;
    
    const IconComponent = content.icon ? (() => {
      // 1. Tentar import direto pelo nome exato
      let Component = (LucideIcons as any)[content.icon];

      // 2. Se não encontrou, tentar alias de nome legado (ícones renomeados no v0.480+)
      if (!Component) {
        const alias = LEGACY_ICON_ALIASES[content.icon];
        if (alias) {
          Component = (LucideIcons as any)[alias];
          if (Component) {
            console.log(`ℹ️ [SectionRenderer] Ícone legado "${content.icon}" resolvido via alias "${alias}".`);
          }
        }
      }

      // 3. Se ainda não encontrou, tentar com sufixo "Icon" (compatibilidade antiga)
      if (!Component) {
        Component = (LucideIcons as any)[`${content.icon}Icon`];
      }

      // 4. Fallback final para Circle
      if (!Component) {
        console.warn(`⚠️ [SectionRenderer] Ícone "${content.icon}" não encontrado no Lucide. Usando Circle como fallback.`);
        Component = LucideIcons.Circle;
      }

      return Component;
    })() : null;
    
    // ❌ REMOVIDO: Layout de duas linhas (determinado automaticamente pelo grid 2x2)
    // O número de linhas agora é inferido automaticamente das posições dos elementos
    
    // 📐 LAYOUT EM GRID (50% texto + 50% mídia/cards)
    if (useGrid) {
      // Determinar ordem das colunas
      const textOrder = textAlign === 'right' ? 'lg:order-2' : textAlign === 'left' ? 'lg:order-1' : '';
      const mediaOrder = mediaAlign === 'left' ? 'lg:order-1' : mediaAlign === 'right' ? 'lg:order-2' : '';
      const cardsOrder = cardsAlign === 'left' ? 'lg:order-1' : cardsAlign === 'right' ? 'lg:order-2' : '';
      
      // ✅ Mobile stackOrder from /admin/mobile-manager
      // On mobile the grid collapses to 1 column (theme.css forces 1fr !important),
      // so items stack in DOM source order. CSS `order` overrides visual stacking.
      // 'media-first' puts media before text; 'text-first' keeps default DOM order.
      const mobileStackMediaFirst = isMobileViewport && mobileCfg?.stackOrder === 'media-first';
      const mobileTextOrder = mobileStackMediaFirst ? 2 : undefined;
      const mobileMediaOrder = mobileStackMediaFirst ? 1 : undefined;
      const mobileCardsOrder = mobileStackMediaFirst ? 3 : undefined;
      
      // ✅ Mobile mediaMaxHeight: limit media height on mobile when configured
      const mobileMediaMaxHeight = (isMobileViewport && mobileCfg?.mediaMaxHeight) ? mobileCfg.mediaMaxHeight : undefined;
      
      // 🆕 Remover gap quando mídia está em modo cobrir
      const gridGap = mediaDisplayMode === 'cobrir' ? 'gap-0' : 'gap-8';
      
      // 🎯 REGRA FUNDAMENTAL: Texto define a altura, mídia/cards se adaptam
      // ✅ CORREÇÃO: Usar altura completa quando heightMode !== 'auto'
      // ✅ NOVO: Respeitar gridCols e gridRows do banco de dados
      
      // ✅ CORREÇÃO 2026-02-16: Remover column-gap quando mídia em modo "alinhada" + alinhamento nas bordas
      const shouldRemoveGap = mediaDisplayMode === 'alinhada' && hasMedia && (mediaAlign === 'left' || mediaAlign === 'right');
      
      const gridStyle: React.CSSProperties = {
        display: 'grid',
        // ✅ NOVO 2026-02-18: Forçar 2 colunas quando texto deve ficar apenas na esquerda
        // ✅ SCROLL-REVEAL: Forçar 2 colunas para texto à esquerda e cards animados à direita
        gridTemplateColumns: (effectiveGridCols === 2 || isTextOnlyLeft || isScrollReveal) ? '1fr 1fr' : '1fr',
        // ✅ CORREÇÃO 2026-02-17: Grid 2x2 com altura auto usa "auto auto" ao invés de "1fr 1fr"
        gridTemplateRows: effectiveGridRows === 2 
          ? (heightMode === 'auto' ? 'auto auto' : '1fr 1fr')  // ← Auto: linhas ajustam ao conteúdo
          : (heightMode === 'auto' ? 'min-content' : '1fr'),
        height: heightMode === 'auto' ? 'auto' : '100%', // ✅ FIX: Respeitar altura fixa da seção
        columnGap: shouldRemoveGap ? '0px' : `${columnGapConfig}px`, // ✅ NOVO 2026-02-16: Remover gap quando mídia alinhada nas bordas
        rowGap: `${rowGapConfig}px`, // ✅ NOVO 2026-02-17: Gap entre linhas
        // ✅ NOVO 2026-02-17: Garantir padding/margin zero no grid
        padding: 0,
        margin: 0,
        // ✅ CORREÇÃO 2026-02-22: placeItems quando texto center em grid 2x2
        // OU quando grid tem 1 linha e 2 colunas (texto centralizado horizontalmente)
        ...((isTextCenterInGrid2x2 || (effectiveGridCols === 2 && effectiveGridRows === 1)) ? {
          placeItems: textVerticalAlign === 'top' ? 'start center' : 
                      textVerticalAlign === 'bottom' ? 'end center' : 
                      'center center',
        } : {}),
      };
      
      // ✅ CORREÇÃO 2026-02-22: Flag para saber se placeItems está ativo
      const usePlaceItemsCenter = isTextCenterInGrid2x2 || (effectiveGridCols === 2 && effectiveGridRows === 1);
      
      // ✅ CORREÇÃO: Sempre aplicar verticalAlign, independente da altura da seção
      const textSelfAlign = {
        'top': 'self-start',
        'center': 'self-center',
        'bottom': 'self-end',
      }[textVerticalAlign] || 'self-center';
      
      return (
        <div 
          className="gap-0 justify-center section-grid-layout"
          style={{
            ...gridStyle,
            // ✅ CORREÇÃO 2026-02-17: Altura auto quando seção é auto, 100% quando fixa
            height: heightMode !== 'auto' ? '100%' : 'auto',
            minHeight: heightMode !== 'auto' ? '100%' : 'auto',
            maxHeight: heightMode !== 'auto' ? '100%' : 'none',
            flex: '1 1 100%',         // ✅ Se parent for flex, crescer para preencher
            alignContent: heightMode !== 'auto' ? 'stretch' : 'flex-start',  // ✅ CORREÇÃO 2026-02-17: Não esticar em modo auto
            // ✅ CORREÇÃO 2026-02-22: NÃO aplicar stretch quando placeItems está ativo
            // (stretch sobrescreve o align-items: center que vem do placeItems)
            ...(usePlaceItemsCenter ? {} : { alignItems: 'stretch' }),
            // ✅ REGRA 2026-02-21: NUNCA scrollbar em seções/colunas — clip como fallback
            overflow: 'hidden',
            // ✅ CORREÇÃO 2026-02-17: rowGap removido (já vem do gridStyle com valor configurado no modal)
          }}
        >
          {/* ✅ Coluna de Texto - DEFINE A ALTURA DA SEÇÃO */}
          {/* ✅ FIX 2026-02-15: Quando texto center em grid 2x2 OU elemento único, ocupar grid completo */}
          {hasTextContent && (
          <div 
            ref={textContainerRef}
            className={`${textOrder} ${textSelfAlign}`}
            style={{ 
              // ✅ CORREÇÃO 2026-02-21: Flex column + justify-content:center para centralizar
              // o conteúdo verticalmente quando zoom reduz seu tamanho efetivo.
              // zoom (diferente de transform:scale) altera o tamanho de layout real,
              // então o conteúdo fica menor que o container e precisa ser centralizado.
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              // ✅ CORREÇÃO 2026-02-22: alignItems: center para centralizar horizontalmente
              // o textContentRef que tem width > 100% (compensação do zoom).
              // Sem isso, o conteúdo expandido se estende apenas para a DIREITA,
              // e overflow:hidden corta assimetricamente, deslocando o centro visual.
              alignItems: 'center',
              // ✅ CORREÇÃO 2026-02-22: Todos os paddings = 0 no container de texto.
              // Os paddings são configurados no modal e aplicados na <section> pai.
              padding: 0,
              // ✅ CORREÇÃO 2026-02-17: Altura auto quando seção é auto (para não colapsar linha 2)
              height: (heightMode !== 'auto' || isTextCenterInGrid2x2 || isOnlyTextInGrid2x2) ? '100%' : 'auto',
              maxHeight: heightMode !== 'auto' ? '100%' : 'none', // ✅ CORREÇÃO: Sem limite quando auto
              // ✅ REGRA 2026-02-21: NUNCA exibir scrollbar (horizontal ou vertical) em seções ou colunas.
              // Quando conteúdo não cabe: auto-fit redimensiona texto, mídia se ajusta, cards reduzem.
              // Fallback final: clip (overflow hidden). Em NENHUM caso scroll ou vazamento.
              overflow: 'hidden',
              // ✅ NOVO 2026-02-15: Aplicar posição do grid baseada no layout
              ...(isTextCenterInGrid2x2 || isOnlyTextInGrid2x2 ? { 
                gridColumn: 'span 2',  // ✅ Ocupar 2 colunas
                gridRow: 'span 2',     // ✅ Ocupar 2 linhas
              } : {
                gridColumn: textGridPosition.gridColumn,
                gridRow: textGridPosition.gridRow,
              }),
              // ✅ Mobile stackOrder: reorder text vs media on mobile
              ...(mobileTextOrder != null ? { order: mobileTextOrder } : {}),
            }}
          >
            {/* ✅ Wrapper interno com flex para layout vertical */}
            <div 
              ref={textContentRef}
              className={`flex flex-col ${textVerticalAlignClass} ${textAlignInternalClass} section-text-content`} 
              style={{ 
                gap: '1rem', 
                // ✅ GLOBAL SCALE 2026-02-21: height:auto SEMPRE — todas as seções participam
                // do sistema de escala global (fixas medem, auto recebem). O container pai
                // (flex+justify-content:center) centraliza verticalmente quando zoom encolhe.
                height: 'auto',
                // ✅ CORREÇÃO 2026-02-22: alignSelf baseado no alinhamento do texto.
                // O pai tem alignItems:'center' (p/ zoom simétrico), mas textos left/right
                // precisam começar da borda correta, não do centro.
                alignSelf: textAlignInternal === 'center' ? 'center' : 
                           textAlignInternal === 'right' ? 'flex-end' : 
                           'flex-start',
                // ✅ CORREÇÃO 2026-02-22: Limitar largura à coluna do grid.
                // O JS do zoom define width > 100% para compensar encolhimento,
                // mas isso invade colunas vizinhas. maxWidth:100% mantém o texto
                // dentro da sua coluna — se faltar espaço, o texto quebra linhas.
                maxWidth: '100%',
                // ✅ NOVO 2026-02-17: Padding interno do elemento de texto (10px em todos os lados)
                padding: '10px',
                boxSizing: 'border-box', // ✅ Garante que padding não afeta dimensões externas
              }}
            >
            {hasIcon && IconComponent && (
              <div className={`flex ${textJustifyClass} ${elementAlignClass} flex-shrink-0`}>
                <IconComponent className="h-12 w-12" style={{ color: content.iconColor }} />
              </div>
            )}
            {hasMinorTitle && content.smallTitle && (
              <p className={`${elementAlignClass} flex-shrink-0`} style={content.smallTitleStyle}>
                {content.smallTitle}
              </p>
            )}
            {hasMainTitle && content.title && (
              <h2 className={`${elementAlignClass} flex-shrink-0 section-title-mobile-reduce`} style={{
                ...content.titleStyle,
                // ✅ CORREÇÃO 2026-02-23: CSS custom properties como ponte para mobile override.
                // No desktop --_stmr-fs/lh/ls NÃO estão definidas → var() usa fallback (valor original do token).
                // No mobile a media query em theme.css DEFINE --_stmr-fs/lh/ls → var() usa o valor mobile.
                // Isso evita a batalha !important vs inline style que não funciona no Tailwind v4.
                fontSize: `var(--_stmr-fs, ${content.titleStyle?.fontSize || 'inherit'})`,
                lineHeight: `var(--_stmr-lh, ${content.titleStyle?.lineHeight ?? 1.2})`,
                letterSpacing: `var(--_stmr-ls, ${content.titleStyle?.letterSpacing || 'normal'})`,
              }}>
                {content.title}
              </h2>
            )}
            {hasSubtitle && content.subtitle && (
              <p className={`${subtitleWidthClass} ${elementAlignClass}`} style={content.subtitleStyle}>
                {content.subtitle}
              </p>
            )}
            
            {/* 🚫 NÃO renderizar customContent aqui se cards estão em coluna separada */}
            {!hasCardsInSeparateColumn && content.customContent && (
              <div className="overflow-hidden flex-1 min-h-0">
                {content.customContent}
              </div>
            )}
            
            {/* ✅ CORREÇÃO #5 (2026-02-16): Remover verificação de ctaUrl para permitir botões sem URL */}
            {hasButton && (content.ctaLabel || content.ctaHasIcon) && (
              <div className={`flex ${textJustifyClass} ${elementAlignClass} flex-shrink-0`}>

                <ResponsiveButton
                  variant="primary"
                  size="lg"
                  href={content.ctaUrl || '#'}
                  onClick={(e) => handleNavigation(content.ctaUrl || '#', e)}
                  style={content.ctaStyle}
                  leftIcon={
                    content.ctaHasIcon && content.ctaIcon ? (
                      React.createElement(
                        (LucideIcons as any)[content.ctaIcon] || LucideIcons.Circle,
                        { 
                          size: content.ctaIconSize || 20,
                          style: { color: getTokenValue(content.ctaIconColor || undefined, '#ffffff') },
                          className: content.ctaIconEffect && content.ctaIconEffect !== 'none' 
                            ? `icon-effect-${content.ctaIconEffect}` 
                            : '',
                        }
                      )
                    ) : undefined
                  }
                >
                  {content.ctaLabel}
                </ResponsiveButton>

              </div>
            )}
            </div> {/* ✅ Fecha wrapper interno flex */}
          </div>
          
          )}
          
          {/* ✅ Coluna de Mídia - SE ADAPTA à altura do texto OU ocupa toda seção se for única */}
          {hasMedia && content.mediaUrl && (
            <div 
              className={`hidden lg:block ${mediaStyles.containerClass} ${mediaOrder} overflow-hidden`}
              style={{ 
                // ✅ CORREÇÃO 2026-02-17: SEM padding quando mídia ocupa 100% da largura
                paddingRight: 0,                           // ← Mídia preenche 100% da largura
                paddingLeft: 0,                            // ← Sem padding esquerda
                paddingTop: 0,                             // ✅ CORREÇÃO 2026-02-17: SEM padding top (já aplicado na section)
                paddingBottom: 0,                          // ✅ CORREÇÃO 2026-02-17: SEM padding bottom (já aplicado na section)
                margin: 0,                                 // ✅ CORREÇÃO 2026-02-17: SEM margins
                // ✅ CORREÇÃO 2026-02-17: Em grid 2×2 com altura auto, mídia NÃO estique (linha ajusta ao texto)
                alignSelf: (effectiveGridRows === 2 && heightMode === 'auto') ? 'start' : 'stretch',
                width: '100%',      // ✅ CORREÇÃO 2026-02-17: Força container ocupar 100% da célula do grid
                height: heightMode !== 'auto' ? '100%' : 'auto',  // ✅ CORREÇÃO 2026-02-17: Auto quando seção é auto
                maxHeight: '100%',  // ← Não ultrapassar
                position: 'relative', // ✅ CRÍTICO: Referência para position: absolute (Opção 2)
                // ✅ NOVO 2026-02-15: Aplicar posição do grid baseada no layout
                ...(isOnlyMediaInGrid2x2 ? { 
                  gridColumn: 'span 2',  // ✅ Ocupar 2 colunas quando mídia é única
                  gridRow: 'span 2',     // ✅ Ocupar 2 linhas quando mídia é única
                } : {
                  gridColumn: mediaGridPosition.gridColumn,
                  gridRow: mediaGridPosition.gridRow,
                }),
              }}
            >
              {/* ✅ CORREÇÃO 2026-02-16 (OPÇÃO 2): Remover wrapper, imagem alinha diretamente à coluna */}
              {mediaDisplayMode === 'alinhada' ? (
                // ✅ CORREÇÃO 2026-02-21: Modo alinhada — objectPosition controla alinhamento.
                // A img preenche 100% do container (position:absolute + inset:0).
                // objectFit:contain mantém proporção, objectPosition alinha o conteúdo
                // da imagem dentro do elemento (ex: "right bottom" → canto inferior direito).
                // Substitui a lógica anterior de right:0/bottom:0/transform que posicionava
                // o ELEMENTO mas não o CONTEÚDO da imagem dentro dele.
                <img 
                  src={content.mediaUrl} 
                  alt="Section media" 
                  className={`${mediaStyles.imgClass}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: `${sectionConfig.media?.alignX || 'center'} ${sectionConfig.media?.alignY || 'center'}`,
                    borderRadius: mediaStyles.imgStyle?.borderRadius || 0,
                  }}
                />
              ) : (
                // ✅ Flex layout para outros modos (cobrir, ajustada, etc)
                <div 
                  className="flex"
                  style={{
                    height: '100%',
                    alignItems: {
                      'top': 'flex-start',
                      'middle': 'center',
                      'bottom': 'flex-end',
                    }[sectionConfig.media?.alignY || 'center'],
                    justifyContent: {
                      'left': 'flex-start',
                      'center': 'center',
                      'right': 'flex-end',
                    }[sectionConfig.media?.alignX || 'center'],
                  }}
                >
                  <img 
                    src={content.mediaUrl} 
                    alt="Section media" 
                    className={`${mediaStyles.imgClass}`}
                    style={{
                      ...mediaStyles.imgStyle,
                      objectPosition: desktopLayout.verticalAlign || desktopLayout.media?.verticalAlign || 'center',
                      // ✅ NOVO MODO 2026-02-17: "adaptada" - Mídia se adapta à altura do texto
                      ...(mediaDisplayMode === 'adaptada' ? {
                        height: '100%',      // ← Ocupa altura da linha (definida pelo texto)
                        width: 'auto',       // ← Largura proporcional
                        maxHeight: '100%',
                        objectFit: 'contain',
                      } : {}),
                      // ✅ Modo padrão: Mídia preenche 100% da largura (mantém proporção)
                      ...(mediaDisplayMode !== 'adaptada' && mediaDisplayMode !== 'alinhada' ? {
                        width: '100%',
                        height: 'auto',
                        maxWidth: '100%',
                      } : {}),
                      // ✅ Forçar 100% se NÃO for modo "alinhada" e altura não for auto
                      ...(mediaDisplayMode !== 'alinhada' && mediaDisplayMode !== 'adaptada' && heightMode !== 'auto' ? {
                        height: '100%',
                        maxHeight: '100%',
                      } : {}),
                    }}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* ✅ NOVA: Coluna de Cards - SE ADAPTA à altura do texto OU ocupa toda seção se for única */}
          {hasCardsInSeparateColumn && content.customContent && (
            <div 
              className={`flex flex-col ${cardsVerticalAlignClass} ${isScrollReveal ? '' : 'px-8 lg:px-16'} ${cardsOrder} overflow-hidden`} 
              style={{ 
                height: '100%',     // ✅ CORREÇÃO 2026-02-17: Altura 100% para preencher célula
                maxHeight: '100%',
                paddingTop: 0,      // ✅ CORREÇÃO 2026-02-17: SEM padding top (já aplicado na section)
                paddingBottom: 0,   // ✅ CORREÇÃO 2026-02-17: SEM padding bottom (já aplicado na section)
                // ✅ NOVO 2026-02-15: Aplicar posição do grid baseada no layout
                ...(isOnlyCardsInGrid2x2 ? { 
                  gridColumn: 'span 2',  // ✅ Ocupar 2 colunas quando cards são únicos
                  gridRow: 'span 2',     // ✅ Ocupar 2 linhas quando cards são únicos
                } : {
                  gridColumn: cardsGridPosition.gridColumn,
                  gridRow: cardsGridPosition.gridRow,
                }),
                // ✅ Mobile stackOrder: keep cards after text+media
                ...(mobileCardsOrder != null ? { order: mobileCardsOrder } : {}),
              }}
            >
              {content.customContent}
            </div>
          )}
          
          {/* Mídia no mobile (abaixo do texto) */}
          {/* ✅ CORREÇÃO 2026-02-21: Removido px-8 hardcoded (causava gaps laterais de 32px).
              rounded-2xl agora condicional ao mediaDisplayMode (cobrir/expandida = sem arredondamento).
              Este bloco é necessário porque o grid media tem "hidden lg:block" (oculto em mobile). */}
          {hasMedia && content.mediaUrl && (
            <div
              className="lg:hidden overflow-hidden"
              style={{
                // ✅ Mobile stackOrder: move media before text when 'media-first'
                ...(mobileMediaOrder != null ? { order: mobileMediaOrder } : {}),
                // ✅ Mobile mediaMaxHeight: limit media height on mobile
                ...(mobileMediaMaxHeight ? { maxHeight: mobileMediaMaxHeight } : {}),
              }}
            >
              <img 
                src={content.mediaUrl} 
                alt="Section media" 
                className={`w-full h-auto ${mediaDisplayMode === 'ajustada' ? 'rounded-2xl' : ''}`}
                style={{
                  ...mediaStyles.imgStyle,
                  // ✅ FIX 2026-02-16: Remover width/height auto em mobile (conflita com w-full)
                  width: undefined,
                  height: undefined,
                  // ✅ Mobile mediaMaxHeight: object-fit when height is limited
                  ...(mobileMediaMaxHeight ? { objectFit: 'cover' as const, maxHeight: mobileMediaMaxHeight } : {}),
                }}
              />
            </div>
          )}
          
          {/* ✅ CORREÇÃO 2026-02-21: Bloco mobile de cards REMOVIDO.
              O grid (inline display:grid) NUNCA se esconde — a coluna de cards 
              dentro do grid (linha 1495) já renderiza em TODAS as larguras.
              Este bloco com lg:hidden duplicava filtros+cards abaixo de 1024px. */}
        </div>
      );
    }
    
    // 📐 LAYOUT VERTICAL (texto + mídia empilhados ou sem mídia)
    return (
      <div 
        ref={textContainerRef}
        className={`flex flex-col ${textVerticalAlignClass} ${textAlignInternalClass}`} 
        style={{ 
          gap: '1rem',
          // ✅ CORREÇÃO: Herdar altura quando heightMode !== 'auto' para justify-center funcionar
          height: heightMode !== 'auto' ? '100%' : 'auto',
          maxHeight: '100%',
          // ✅ CORREÇÃO 2026-02-22: Todos os paddings = 0 no container de texto.
          // Os paddings são configurados no modal e aplicados na <section> pai.
          padding: 0,
          // ✅ REGRA 2026-02-21: NUNCA scrollbar — clip como fallback
          overflow: 'hidden',
        }}
      >
        {/* ✅ NOVO 2026-02-17: Wrapper interno com padding de 10px para elementos de texto */}
        {/* ✅ AUTO-FIT 2026-02-21: Ref para medição de conteúdo natural (escala proporcional) */}
        <div 
          ref={textContentRef}
          style={{ 
            padding: '10px', 
            boxSizing: 'border-box',
            // ✅ GLOBAL SCALE 2026-02-21: height:auto SEMPRE — todas as seções participam.
            height: 'auto',
          }}
        >
          {hasIcon && IconComponent && (
            <div className={`flex ${textJustifyClass} ${elementAlignClass} flex-shrink-0`}>
              <IconComponent className="h-12 w-12" style={{ color: content.iconColor }} />
            </div>
          )}
          {hasMinorTitle && content.smallTitle && (
            <p className={`${elementAlignClass} flex-shrink-0`} style={content.smallTitleStyle}>
              {content.smallTitle}
            </p>
          )}
          {hasMainTitle && content.title && (
            <h2 className={`${elementAlignClass} flex-shrink-0 section-title-mobile-reduce`} style={{
              ...content.titleStyle,
              fontSize: `var(--_stmr-fs, ${content.titleStyle?.fontSize || 'inherit'})`,
              lineHeight: `var(--_stmr-lh, ${content.titleStyle?.lineHeight ?? 1.2})`,
              letterSpacing: `var(--_stmr-ls, ${content.titleStyle?.letterSpacing || 'normal'})`,
            }}>
              {content.title}
            </h2>
          )}
          {hasSubtitle && content.subtitle && (
            <p className={`${subtitleWidthClass} ${elementAlignClass}`} style={content.subtitleStyle}>
              {content.subtitle}
            </p>
          )}
          
          {/* ✅ Botão CTA dentro do wrapper de texto */}
          {hasButton && (content.ctaLabel || content.ctaHasIcon) && (
            <div className={`flex ${textJustifyClass} ${elementAlignClass} flex-shrink-0`}>
              <ResponsiveButton
                variant="primary"
                size="lg"
                href={content.ctaUrl || '#'}
                onClick={(e) => handleNavigation(content.ctaUrl || '#', e)}
                style={content.ctaStyle}
                leftIcon={
                  content.ctaHasIcon && content.ctaIcon ? (
                    React.createElement(
                      (LucideIcons as any)[content.ctaIcon] || LucideIcons.Circle,
                      { 
                        size: content.ctaIconSize || 20,
                        style: { color: getTokenValue(content.ctaIconColor || undefined, '#ffffff') },
                        className: content.ctaIconEffect && content.ctaIconEffect !== 'none' 
                          ? `icon-effect-${content.ctaIconEffect}` 
                          : '',
                      }
                    )
                  ) : undefined
                }
              >
                {content.ctaLabel}
              </ResponsiveButton>
            </div>
          )}
        </div>
        
        {/* Conteúdo customizado (tabs, cards, etc) */}
        {content.customContent && (
          <div className="overflow-hidden flex-1 min-h-0">
            {content.customContent}
          </div>
        )}
        
        {/* Mídia (se existir e não estiver em grid) */}
        {hasMedia && content.mediaUrl && (
          <div className="max-w-4xl flex-shrink-0 overflow-hidden" style={{
            maxHeight: (isMobileViewport && mobileCfg?.mediaMaxHeight) ? mobileCfg.mediaMaxHeight : '50%',
            // ✅ Mobile stackOrder: move media before text in vertical layout
            ...(isMobileViewport && mobileCfg?.stackOrder === 'media-first' ? { order: -1 } : {}),
          }}>
            <img 
              src={content.mediaUrl} 
              alt="Section media" 
              className="w-full h-auto rounded-2xl max-h-full object-contain"
              style={mediaStyles.imgStyle}
            />
          </div>
        )}
      </div>
    );
  };

  // Render blocks
  const renderBlocks = () => {
    if (!layout.blocks || layout.blocks.length === 0) {
      return (
        <div className="text-center">
          <ResponsiveText tokenName="body" color="muted">
            Seção vazia - Configure no Admin
          </ResponsiveText>
        </div>
      );
    }

    return layout.blocks.map((block: any, index: number) => {
      const blockKey = `block-${index}`;

      if (block.type === 'text') {
        const textColor = getTokenValue(block.color_token, darkColor);
        const textStyle: React.CSSProperties = {
          color: textColor,
        };

        if (block.variant === 'minorTitle') {
          return (
            <ResponsiveText 
              key={blockKey} 
              tokenName="heading-3" 
              as="h3"
              className="mb-2"
              style={textStyle}
            >
              {block.text}
            </ResponsiveText>
          );
        } else if (block.variant === 'mainTitle') {
          return (
            <MainTitle key={blockKey} className="mb-4" style={textStyle}>
              {block.text}
            </MainTitle>
          );
        } else if (block.variant === 'subtitle') {
          return (
            <Subtitle key={blockKey} className="mb-6" style={textStyle}>
              {block.text}
            </Subtitle>
          );
        } else {
          return (
            <BodyText key={blockKey} className="mb-4" style={textStyle}>
              {block.text}
            </BodyText>
          );
        }
      }

      if (block.type === 'button') {
        const variant = block.variant === 'white' ? 'secondary' : 'primary';
        return (
          <ResponsiveButton
            key={blockKey}
            variant={variant}
            externalHref={block.url}
            size="lg"
          >
            {block.label}
          </ResponsiveButton>
        );
      }

      return null;
    });
  };

  // ========================================================================
  // 🎯 RENDERIZAÇÃO UNIFICADA - TODAS AS SEÇÕES
  // ========================================================================
  // O tipo não importa mais! O comportamento é determinado por:
  // - elements: quais elementos estão visíveis
  // - layout: como os elementos são posicionados  
  // - config: conteúdo e estilos específicos
  // ========================================================================
  
  // ===== CUSTOM CONTENT (tabs, cards, etc) =====
  let customContent: React.ReactNode = null;

  // ✅ Log removido após correção de hasCards (2026-02-17)

  // 1️⃣ Se tiver tabs navigation
  const tabs = layout.tabs || [];
  if (tabs.length > 0) {
    // Set first tab as active if not set
    if (!activeTabId && tabs.length > 0) {
      setActiveTabId(tabs[0].id);
    }

    const activeTab = tabs.find((tab: any) => tab.id === activeTabId) || tabs[0];
    const tabCards = activeTab?.card_ids
      ? cards.filter((card) => activeTab.card_ids.includes(card.id))
      : [];

    customContent = (
      <>
        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium ${
                activeTabId === tab.id
                  ? 'text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              style={
                activeTabId === tab.id
                  ? {
                      backgroundColor: getTokenValue(sectionConfig.tabActiveBgColor, primaryColor),
                      color: getTokenValue(sectionConfig.tabActiveTextColor, '#ffffff'),
                      transition: 'none',
                    }
                  : { transition: 'none' }
              }
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab Cards */}
        {tabCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" style={{ gridAutoRows: '1fr' }}>
            {tabCards.map((card) => (
              <CardRenderer key={card.id} card={card} compact={cardDisplayMode === 'compact'} />
            ))}
          </div>
        )}
      </>
    );
  }

  // 2️⃣ Se tiver cards sem tabs
  
  if (hasCardsEffective && sectionCards.length > 0) {
    
    // 🎯 EXTRAIR CONFIGURAÇÕES DO TEMPLATE (se disponível)
    const cardTemplate = sectionCards[0]?._template;
    const filtersPosition = cardTemplate?.filters_position || 'top';
    const filterButtonBgColor = cardTemplate?.filter_button_bg_color_token;
    const filterButtonTextColor = cardTemplate?.filter_button_text_color_token;
    const filterButtonBorderColor = cardTemplate?.filter_button_border_color_token;
    const filterActiveBgColor = cardTemplate?.filter_active_bg_color_token;
    const filterActiveTextColor = cardTemplate?.filter_active_text_color_token;
    const filterActiveBorderColor = cardTemplate?.filter_active_border_color_token;
    
    // 🎯 DETECTAR FILTROS (template_cards com filter_id)
    // Primeiro, verificar se os cards têm filter_id (são template_cards)
    const hasFilterIds = sectionCards.some((card: any) => card.filter_id);
    
    let filteredCards = sectionCards;
    
    if (hasFilterIds) {
      // ✅ Filtrar cards pelo filter_id ativo (filtros são carregados no useEffect)
      if (activeCategory && activeCategory !== 'all') {
        filteredCards = sectionCards.filter((card: any) => card.filter_id === activeCategory);
      }
    } else {
      // ✅ FALLBACK: Sistema antigo com categorias no config
      const categories = Array.from(
        new Set(
          sectionCards
            .map((card) => card.config?.category)
            .filter(Boolean)
        )
      ) as string[];
      
      const hasCategories = categories.length > 1;
      
      if (hasCategories && !activeCategory) {
        setActiveCategory('all');
      }
      
      if (activeCategory && activeCategory !== 'all') {
        filteredCards = sectionCards.filter((card) => card.config?.category === activeCategory);
      }
    }
    
    // ✅ Preferir columns do template; fallback para sectionConfig.columns
    const columns = cardTemplate?.columns_desktop || sectionConfig.columns || 3;
    const columnsTablet = cardTemplate?.columns_tablet || Math.min(columns, 2);
    const columnsMobileBase = cardTemplate?.columns_mobile || 1;
    // ✅ Mobile override from /admin/mobile-manager — per-section cardsPerRow takes priority
    const columnsMobile = (isMobileViewport && mobileCfg?.cardsPerRow)
      ? mobileCfg.cardsPerRow
      : columnsMobileBase;

    // Construir grid responsivo: mobile → tablet → desktop
    const gridClass = (() => {
      const mobile  = `grid-cols-${columnsMobile}`;
      const tablet  = columnsTablet !== columnsMobile ? `md:grid-cols-${columnsTablet}` : '';
      const desktop = columns !== columnsTablet ? `lg:grid-cols-${columns}` : '';
      return [mobile, tablet, desktop].filter(Boolean).join(' ');
    })();

    // Gap do template (fallback: gap-10 = 2.5rem)
    const GAP_MAP: Record<string, string> = {
      xs: 'gap-1', sm: 'gap-2', md: 'gap-4', lg: 'gap-10', xl: 'gap-12',
    };
    const gapClass = GAP_MAP[cardTemplate?.gap || 'lg'] || 'gap-10';

    customContent = (
      <>
        {/* 🎯 FILTROS (se houver) - Posição configurável */}
        {(hasFilterIds && filters.length > 1 && filtersPosition === 'top') && (
          <div className="flex flex-wrap justify-center items-center gap-3 mb-12 w-full">
            {/* Botão "Todos" */}
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-3 rounded-lg font-medium border-2`}
              style={
                activeCategory === 'all'
                  ? {
                      backgroundColor: getTokenValue(filterActiveBgColor, primaryColor),
                      color: getTokenValue(filterActiveTextColor, '#ffffff'),
                      borderColor: getTokenValue(filterActiveBorderColor, getTokenValue(filterActiveBgColor, primaryColor)),
                      transition: 'none',
                    }
                  : {
                      backgroundColor: getTokenValue(filterButtonBgColor, '#ffffff'),
                      color: getTokenValue(filterButtonTextColor, '#6b7280'),
                      borderColor: getTokenValue(filterButtonBorderColor, getTokenValue(filterActiveBgColor, primaryColor)),
                      transition: 'none',
                    }
              }
            >
              Todos
            </button>
            
            {/* Botões de Filtro */}
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveCategory(filter.id)}
                className={`px-6 py-3 rounded-lg font-medium border-2`}
                style={
                  activeCategory === filter.id
                    ? {
                        backgroundColor: getTokenValue(filterActiveBgColor, primaryColor),
                        color: getTokenValue(filterActiveTextColor, '#ffffff'),
                        borderColor: getTokenValue(filterActiveBorderColor, getTokenValue(filterActiveBgColor, primaryColor)),
                        transition: 'none',
                      }
                    : {
                        backgroundColor: getTokenValue(filterButtonBgColor, '#ffffff'),
                        color: getTokenValue(filterButtonTextColor, '#6b7280'),
                        borderColor: getTokenValue(filterButtonBorderColor, getTokenValue(filterActiveBgColor, primaryColor)),
                        transition: 'none',
                      }
                }
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Grid de Cards Filtrados — ScrollRevealCards | CarouselCards | grid padrão */}
        {cardTemplate?.variant === 'scroll-reveal' ? (
          <ScrollRevealCards
            cards={filteredCards}
            cardDisplayMode={cardDisplayMode}
            progress={scrollRevealProgress}
          />
        ) : cardTemplate?.variant === 'carousel' ? (
          <CarouselCards
            cards={filteredCards}
            cardDisplayMode={cardDisplayMode}
          />
        ) : (
          <div className={`grid ${gridClass} ${gapClass}`} style={{ gridAutoRows: '1fr' }}>
            {filteredCards.map((card) => (
              <CardRenderer key={card.id} card={card} compact={cardDisplayMode === 'compact'} />
            ))}
          </div>
        )}
      </>
    );
    
  }
  

  
  // ===== RENDERIZAR VIA SISTEMA UNIFICADO =====
  // ✅ CORREÇÃO 2026-02-21: Usar largura total quando grid layout será usado
  // Inclui: gridCols === 2, hasMedia, OU isTextOnlyLeft (gridCols=1 + posição "left"/"center" sem mídia)
  // Sem isso, o container usa 'container mx-auto px-4' que adiciona max-width + padding extra,
  // desalinhando seções com grid forçado (isTextOnlyLeft) em relação às demais seções com grid real.
  const wouldForceGrid = gridCols === 1 && !hasMedia && !hasCards &&
    (textPos?.includes('left') || textPos?.includes('center'));
  const needsFullWidth = gridCols === 2 || hasMedia || wouldForceGrid || isScrollReveal || isCarousel;
  
  const unifiedContent = renderUnifiedLayout({
    elements: {
      hasIcon,
      hasMinorTitle,
      hasMainTitle,
      hasSubtitle,
      hasButton,
      hasMedia,
      hasCards,
      mediaDisplayMode,
    },
    layout: sectionLayout, // ✅ FIX 2026-02-15: Usar sectionLayout ao invés de sectionConfig.layout
    gridCols, // ✅ NOVO: Passar gridCols explicitamente
    gridRows, // ✅ NOVO: Passar gridRows explicitamente
    content: {
      icon: sectionConfig.icon,
      iconColor,
      smallTitle,
      smallTitleStyle,
      title,
      titleStyle,
      subtitle,
      subtitleStyle,
      ctaLabel,
      ctaUrl,
      ctaStyle: ctaButtonStyle,
      ctaHasIcon: sectionConfig.ctaButton?.hasIcon || false, // ✅ NOVO
      ctaIcon: sectionConfig.ctaButton?.icon || '', // ✅ NOVO
      ctaIconSize: sectionConfig.ctaButton?.iconSize || 24, // ✅ NOVO
      ctaIconColor: sectionConfig.ctaButton?.iconColor || '#ffffff', // ✅ NOVO
      ctaIconEffect: sectionConfig.ctaButton?.iconEffect || 'none', // ✅ NOVO: Efeito de animação
      mediaUrl,
      customContent,
    },
    // ❌ REMOVIDO: sectionLines (determinado automaticamente)
  });
  
  // ✅ NOVO: Função para detectar se mídia e texto estão na mesma linha
  const hasTextAndMediaInSameLine = (): boolean => {
    const textPosition = sectionConfig.layout?.desktop?.text;
    const mediaPosition = sectionConfig.layout?.desktop?.media;
    
    if (!textPosition || !mediaPosition) return false;
    
    // Converter posições para layouts
    const positionToLayout = (position: string) => {
      const layouts: Record<string, { startRow: number; rows: number }> = {
        'top-left': { startRow: 1, rows: 1 },
        'top-right': { startRow: 1, rows: 1 },
        'top-center': { startRow: 1, rows: 1 },
        'bottom-left': { startRow: 2, rows: 1 },
        'bottom-right': { startRow: 2, rows: 1 },
        'bottom-center': { startRow: 2, rows: 1 },
        'middle-left': { startRow: 1, rows: 2 },
        'middle-right': { startRow: 1, rows: 2 },
        'center': { startRow: 1, rows: 2 },
      };
      return layouts[position] || { startRow: 1, rows: 1 };
    };
    
    const textLayout = positionToLayout(textPosition as string);
    const mediaLayout = positionToLayout(mediaPosition as string);
    
    // Verificar se compartilham a mesma linha (row)
    const textRows = new Set<number>();
    for (let r = textLayout.startRow; r < textLayout.startRow + textLayout.rows; r++) {
      textRows.add(r);
    }
    
    for (let r = mediaLayout.startRow; r < mediaLayout.startRow + mediaLayout.rows; r++) {
      if (textRows.has(r)) return true;
    }
    
    return false;
  };
  
  // ✅ NOVO: Sistema de hierarquia - calcular configuração final de altura
  const calculateHeightConfig = () => {
    // 1. PRIORIDADE MÁXIMA: Modo contida + mesma linha → Mídia se ajusta ao texto
    if (
      mediaDisplayMode === 'contida' &&
      hasTextAndMediaInSameLine()
    ) {
      return {
        alignItems: 'stretch',
        minMediaHeight: '300px',
        overflowStrategy: 'hidden' as const,
        effectivePriority: 'content' as const,
      };
    }
    
    // 2. PRIORIDADE SECUNDÁRIA: rowHeightPriority (apenas se heightMode === 'auto')
    if (heightMode === 'auto' && rowHeightPriority) {
      return {
        alignItems: rowHeightPriority === 'content' ? 'start' : 'stretch',
        minMediaHeight: undefined,
        overflowStrategy: 'hidden' as const, // ✅ REGRA 2026-02-21: NUNCA scrollbar
        effectivePriority: rowHeightPriority as 'media' | 'content',
      };
    }
    
    // 3. PRIORIDADE TERCIÁRIA: rowPriority (para grid 2xN com altura fixa)
    if (gridRows === 2 && heightMode !== 'auto' && rowPriority !== 'equal') {
      const row1Priority = rowPriority === 'row1';
      return {
        alignItems: 'stretch',
        minMediaHeight: undefined,
        overflowStrategy: 'hidden' as const, // ✅ REGRA 2026-02-21: NUNCA scrollbar
        effectivePriority: 'content' as const,
        gridTemplateRows: row1Priority ? '1fr auto' : 'auto 1fr', // Linha prioritária recebe 1fr
      };
    }
    
    // 4. COMPORTAMENTO PADRÃO: Divisão igual
    return {
      alignItems: 'stretch',
      minMediaHeight: undefined,
      overflowStrategy: 'hidden' as const, // ✅ REGRA 2026-02-21: NUNCA scrollbar
      effectivePriority: 'content' as const,
    };
  };
  
  const heightConfig = calculateHeightConfig();
  
  // ❌ REMOVIDO: Grid externo que causava duplicação
  // O grid deve ser criado apenas dentro do renderUnifiedLayout()
  // Manter esta variável para não quebrar referências, mas sem aplicar o grid
  const gridContainerStyle: React.CSSProperties = {};

  // ✅ SCROLL-REVEAL: Calcular número de cards para scroll-reveal
  const scrollRevealCardCount = isScrollReveal ? sectionCards.length : 0;

  // ✅ SCROLL-REVEAL: Quando ativo, envolver a seção em um scroll track
  // que cria espaço de scroll extra. A seção fica sticky enquanto os cards passam.
  // ✅ Mobile overrides: Apply per-section mobile config when in mobile viewport
  const mobileOverrideStyle: React.CSSProperties = (isMobileViewport && mobileCfg) ? {
    ...(mobileCfg.height && mobileCfg.height !== 'auto' ? { height: mobileCfg.height } : mobileCfg.height === 'auto' ? { height: 'auto' } : {}),
    ...(mobileCfg.spacingTop ? { paddingTop: mobileCfg.spacingTop } : {}),
    ...(mobileCfg.spacingBottom ? { paddingBottom: mobileCfg.spacingBottom } : {}),
    ...(mobileCfg.spacingX ? { paddingLeft: mobileCfg.spacingX, paddingRight: mobileCfg.spacingX } : {}),
    ...(mobileCfg.textAlign ? { textAlign: mobileCfg.textAlign as any } : {}),
  } : {};

  const sectionJSX = (
    <section
      id={sectionAnchorId || props.section?.id}
      style={{
        ...sectionBgStyle,
        // ✅ SCROLL-REVEAL: Forçar 100vh quando scroll-reveal está ativo (seção sticky ocupa viewport)
        ...(isScrollReveal ? {
          height: '100vh',
        } : heightMode !== 'auto' ? { 
          height: heightMode,
        } : {}),
        // ✅ SCROLL-REVEAL: sticky dentro do scroll track
        ...(isScrollReveal ? {
          position: 'sticky' as const,
          top: 0,
        } : {
          position: 'relative' as const,
        }),
        // ✅ CRÍTICO 2026-02-17: box-sizing para paddings ficarem DENTRO da altura
        boxSizing: 'border-box',
        // ✅ CRÍTICO 2026-02-17: Aplicar paddings do modal (dentro da altura com box-sizing)
        // ✅ CORREÇÃO 2026-02-22: Left/Right movidos para cá (antes estavam assimétricos no textContainerRef)
        paddingTop: `${paddingTopConfig}px`,
        paddingBottom: `${paddingBottomConfig}px`,
        // ✅ CORREÇÃO 2026-02-23: Padding lateral responsivo — reduz automaticamente em mobile
        // para dar mais espaço horizontal ao título. CSS min() garante que nunca excede o config,
        // e max(12px, 3vw) define um mínimo confortável em telas pequenas.
        paddingLeft: `min(${paddingLeftConfig}px, max(12px, 3vw))`,
        paddingRight: `min(${paddingRightConfig}px, max(12px, 3vw))`,
        // ✅ CORREÇÃO 2026-02-22: overflow:hidden no <section> para resetar min-height:auto do flexbox.
        // As seções são flex items (pai é flex-col em Home.tsx/DynamicPage.tsx).
        // Sem isto, min-height:auto faz o conteúdo sobrescrever height:50vh.
        overflow: 'hidden',
        // ✅ Mobile overrides from /admin/mobile-manager (applied last to win specificity)
        ...mobileOverrideStyle,
      }}
      className="relative"
    >
      {/* ✅ CORREÇÃO 2026-02-23: Vídeo de fundo como elemento <video> (CSS background-image não suporta vídeo) */}
      {backgroundImage && isBackgroundVideo && (
        <video
          src={backgroundImage}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: bgOpacity / 100 }}
        />
      )}

      {/* Background Overlay (escurecimento — apenas para imagens estáticas) */}
      {backgroundImage && !isBackgroundVideo && (
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: (100 - bgOpacity) / 100 }}
        />
      )}

      {/* Conteúdo da Seção */}
      <div 
        className="relative z-10 w-full" 
        style={{
          height: '100%',
          // ✅ REGRA 2026-02-21: NUNCA scrollbar/overflow em seções — clip como fallback
          overflow: 'hidden',
        }}
      >
        <div 
          className={isMediaFullWidth ? 'py-0' : needsFullWidth ? 'w-full py-0' : 'w-full py-0'}
          style={{
            height: '100%',
          }}
        >
          {unifiedContent}
        </div>
      </div>
    </section>
  );

  // ✅ SCROLL-REVEAL: Envolver seção em scroll track se variant for scroll-reveal
  if (isScrollReveal) {
    return (
      <div
        ref={scrollTrackRef}
        style={{
          // Cada card ganha 100vh de espaço de scroll + 1 viewport para a seção pinar
          height: `${(scrollRevealCardCount + 1) * 100}vh`,
          position: 'relative',
        }}
      >
        {sectionJSX}
      </div>
    );
  }

  return sectionJSX;
}