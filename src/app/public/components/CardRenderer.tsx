import { Link } from '@/lib/components/Link';
import * as LucideIcons from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { LEGACY_ICON_ALIASES } from '../../../lib/constants/lucideIcons';
import { useMobileConfig } from '../../../lib/contexts/MobileConfigContext';

const Star = LucideIcons.Star;

/** Resolve um nome de ícone, incluindo aliases de nomes renomeados no v0.480+ */
function resolveIcon(iconName: string): React.ComponentType<any> | null {
  if (!iconName) return null;
  let Component = (LucideIcons as any)[iconName];
  if (!Component) {
    const alias = LEGACY_ICON_ALIASES[iconName];
    if (alias) Component = (LucideIcons as any)[alias];
  }
  if (!Component) Component = (LucideIcons as any)[`${iconName}Icon`];
  return Component ?? null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Converte hex para rgba */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Extrai hex de um valor de token (JSON ou string) */
function parseHex(raw: any): string | null {
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return v.color || v.hex || null;
  } catch {
    return null;
  }
}

/** Extrai size de um token de tipografia (ex: {"size":"1rem","weight":600,"color":"#111"}) */
function parseTypographySize(raw: any): string | null {
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return v.size || null;
  } catch {
    return null;
  }
}

// ─── Cache de estilos por template ───────────────────────────────────────────
// Persiste durante a sessão: na troca de filtro os cards são recriados mas
// o cache já tem os estilos, então o estado inicial é direto — sem flash.
interface TemplateStyles {
  titleColor:       string;
  subtitleColor:    string;
  bgColor:          string;
  borderColor:      string;
  iconColor:        string;
  iconBgColor:      string | null;
  titleFontSize:    string;
  subtitleFontSize: string;
}
const templateStyleCache = new Map<string, TemplateStyles>();

const DEFAULT_STYLES: TemplateStyles = {
  titleColor:       '#ea526e',
  subtitleColor:    '#ffffff',
  bgColor:          '#2e2240',
  borderColor:      '#e5e7eb',
  iconColor:        '#ea526e',
  iconBgColor:      null,
  titleFontSize:    '2rem',
  subtitleFontSize: '1rem',
};

// ─── Mapas token → CSS ───────────────────────────────────────────────────────

const BORDER_RADIUS_MAP: Record<string, string> = {
  none: '0px',
  sm:   '6px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  '2xl':'24px',
};

const PADDING_MAP: Record<string, string> = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '2.5rem',
};

const SHADOW_MAP: Record<string, string> = {
  none: 'none',
  sm:   '0 1px 3px 0 rgba(0,0,0,0.10)',
  md:   '0 4px 6px -1px rgba(0,0,0,0.10)',
  lg:   '0 10px 15px -3px rgba(0,0,0,0.15)',
  xl:   '0 20px 25px -5px rgba(0,0,0,0.15)',
};

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Card = {
  id: string;
  name?: string;
  type?: string;
  config?: any;
  global?: boolean;
  published?: boolean;
  icon?: string;
  title?: string;
  subtitle?: string;
  media_url?: string;
  media_opacity?: number;
  bg_image_url?: string;
  link_url?: string;
  link_type?: string;
  _template?: any;
};

type CardRendererProps = {
  card: Card;
  compact?: boolean;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export function CardRenderer({ card, compact = false }: CardRendererProps) {
  const templateId = card._template?.id as string | undefined;

  // Inicializa direto do cache se disponível → sem flash ao trocar filtros
  const cached = templateId ? templateStyleCache.get(templateId) : undefined;

  // ✅ Mobile config — card overrides from /admin/mobile-manager
  const { getCardConfig, isMobile: isMobileViewport } = useMobileConfig();
  const mobileCfg = getCardConfig(templateId);

  const [titleColor,       setTitleColor]       = useState(cached?.titleColor       ?? DEFAULT_STYLES.titleColor);
  const [subtitleColor,    setSubtitleColor]    = useState(cached?.subtitleColor    ?? DEFAULT_STYLES.subtitleColor);
  const [bgColor,          setBgColor]          = useState(cached?.bgColor          ?? DEFAULT_STYLES.bgColor);
  const [borderColor,      setBorderColor]      = useState(cached?.borderColor      ?? DEFAULT_STYLES.borderColor);
  const [iconColor,        setIconColor]        = useState(cached?.iconColor        ?? DEFAULT_STYLES.iconColor);
  const [iconBgColor,      setIconBgColor]      = useState(cached?.iconBgColor      ?? DEFAULT_STYLES.iconBgColor);
  const [titleFontSize,    setTitleFontSize]    = useState(cached?.titleFontSize    ?? DEFAULT_STYLES.titleFontSize);
  const [subtitleFontSize, setSubtitleFontSize] = useState(cached?.subtitleFontSize ?? DEFAULT_STYLES.subtitleFontSize);
  // ✅ FIX: usar media_opacity do card; fallback para o template; depois 100%
  const [mediaOpacity,     setMediaOpacity]     = useState(card.media_opacity ?? card._template?.media_opacity ?? 100);

  // ── Carregar estilos do template (cores + tipografia) ─────────────────────
  useEffect(() => {
    const template = card._template;
    if (!template?.id) return;

    // Se já está em cache, aplicar e sair
    const hit = templateStyleCache.get(template.id);
    if (hit) {
      setTitleColor(hit.titleColor);
      setSubtitleColor(hit.subtitleColor);
      setBgColor(hit.bgColor);
      setBorderColor(hit.borderColor);
      setIconColor(hit.iconColor);
      setIconBgColor(hit.iconBgColor);
      setTitleFontSize(hit.titleFontSize);
      setSubtitleFontSize(hit.subtitleFontSize);
      return;
    }

    // Coletar TODOS os token IDs (cores + tipografia) em uma única query
    const tokenIds = [
      template.title_color_token,
      template.subtitle_color_token,
      template.card_bg_color_token,
      template.card_border_color_token,
      template.icon_color_token,
      template.icon_bg_color_token,
      template.title_font_size,
      template.subtitle_font_size,
    ].filter(Boolean);

    if (tokenIds.length === 0) return;

    supabase
      .from('design_tokens')
      .select('*')
      .in('id', tokenIds)
      .then(({ data }) => {
        if (!data) return;

        // Partir dos defaults
        let newTitleColor       = DEFAULT_STYLES.titleColor;
        let newSubtitleColor    = DEFAULT_STYLES.subtitleColor;
        let newBgColor          = DEFAULT_STYLES.bgColor;
        let newBorderColor      = DEFAULT_STYLES.borderColor;
        let newIconColor        = DEFAULT_STYLES.iconColor;
        let newIconBgColor      = DEFAULT_STYLES.iconBgColor;
        let newTitleFontSize    = DEFAULT_STYLES.titleFontSize;
        let newSubtitleFontSize = DEFAULT_STYLES.subtitleFontSize;

        data.forEach((token) => {
          // Tokens de cor
          const hex = parseHex(token.value);
          if (hex) {
            if (token.id === template.title_color_token)       newTitleColor    = hex;
            if (token.id === template.subtitle_color_token)    newSubtitleColor = hex;
            if (token.id === template.card_bg_color_token)     newBgColor       = hex;
            if (token.id === template.card_border_color_token) newBorderColor   = hex;
            if (token.id === template.icon_color_token)        newIconColor     = hex;
            if (token.id === template.icon_bg_color_token)     newIconBgColor   = hex;
          }

          // Tokens de tipografia
          const typoSize = parseTypographySize(token.value);
          if (typoSize) {
            if (token.id === template.title_font_size)    newTitleFontSize    = typoSize;
            if (token.id === template.subtitle_font_size) newSubtitleFontSize = typoSize;
          }
        });

        // Se icon_color_token não definido, herdar titleColor
        if (!template.icon_color_token) {
          newIconColor = newTitleColor;
        }

        const styles: TemplateStyles = {
          titleColor:       newTitleColor,
          subtitleColor:    newSubtitleColor,
          bgColor:          newBgColor,
          borderColor:      newBorderColor,
          iconColor:        newIconColor,
          iconBgColor:      newIconBgColor,
          titleFontSize:    newTitleFontSize,
          subtitleFontSize: newSubtitleFontSize,
        };

        // Guardar no cache
        templateStyleCache.set(template.id, styles);

        setTitleColor(styles.titleColor);
        setSubtitleColor(styles.subtitleColor);
        setBgColor(styles.bgColor);
        setBorderColor(styles.borderColor);
        setIconColor(styles.iconColor);
        setIconBgColor(styles.iconBgColor);
        setTitleFontSize(styles.titleFontSize);
        setSubtitleFontSize(styles.subtitleFontSize);
      });
  }, [templateId]);

  // ── Opacidade do card ─────────────────────────────────────────────────────
  // ✅ FIX: fallback correto card → template → 100%
  useEffect(() => {
    setMediaOpacity(card.media_opacity ?? card._template?.media_opacity ?? 100);
  }, [card.media_opacity, card._template?.media_opacity]);

  // ── Render: template_cards (campos diretos) ───────────────────────────────
  if (card.title || card.subtitle || card.icon) {
    const template = card._template;
    const IconComponent = card.icon ? resolveIcon(card.icon) : null;
    const link = card.link_url || '#';

    if (card.media_url?.startsWith('figma:asset/') || card.bg_image_url?.startsWith('figma:asset/')) {
      console.warn(
        `⚠️ [CardRenderer] figma:asset não suportado em runtime — Card: "${card.title}"\n` +
        '   Use MediaUploader para fazer upload no Supabase Storage ou URLs externas.'
      );
    }

    // ── Estilos do template ───────────────────────────────────────────────
    const cardBorderRadius = BORDER_RADIUS_MAP[template?.card_border_radius || '2xl'] ?? '24px';
    const cardShadow       = SHADOW_MAP[template?.card_shadow || 'none'] ?? 'none';
    const cardBorderWidth  = template?.card_border_width ?? 1;

    const cardPaddingRaw = PADDING_MAP[template?.card_padding || 'md'] ?? '1.5rem';
    const cardPadding    = compact ? `${parseFloat(cardPaddingRaw) * 0.67}rem` : cardPaddingRaw;

    // ── minHeight dinâmico ────────────────────────────────────────────────
    // Cards sem mídia de background usam altura auto (ajusta ao conteúdo)
    const hasMediaBg = !!(card.media_url || card.bg_image_url);
    const minHeight = hasMediaBg ? (compact ? '220px' : '300px') : 'auto';

    // ── Font sizes (resolvidos dinamicamente dos tokens) ──────────────────
    const rawTitleFontSize    = compact ? `${parseFloat(titleFontSize) * 0.75}rem` : titleFontSize;
    const rawSubtitleFontSize = compact ? `${parseFloat(subtitleFontSize) * 0.75}rem` : subtitleFontSize;

    // ✅ Mobile overrides from /admin/mobile-manager
    const finalTitleFs    = (isMobileViewport && mobileCfg.titleFontSize)    ? mobileCfg.titleFontSize    : rawTitleFontSize;
    const finalSubtitleFs = (isMobileViewport && mobileCfg.subtitleFontSize) ? mobileCfg.subtitleFontSize : rawSubtitleFontSize;
    const finalPadding    = (isMobileViewport && mobileCfg.cardPadding)      ? mobileCfg.cardPadding      : cardPadding;
    const finalRadius     = (isMobileViewport && mobileCfg.borderRadius)     ? mobileCfg.borderRadius     : cardBorderRadius;
    const showMediaBg     = !isMobileViewport || mobileCfg.showMedia !== false;

    // ── Ícone ─────────────────────────────────────────────────────────────
    const iconPosition = template?.icon_position || 'top';
    const iconSizePx   = template?.icon_size || 32;
    const iconSizeRem  = compact ? iconSizePx * 0.75 : iconSizePx;

    // Container do ícone (fundo arredondado para position 'left')
    const iconContainerSize = iconSizeRem + 16; // padding de 8px ao redor
    // ✅ Usar icon_bg_color_token (cor sólida) se disponível; fallback para 10% opacity
    const computedIconBg = iconBgColor ?? hexToRgba(iconColor, 0.1);

    const titleGap = compact ? 'mb-1' : 'mb-2';

    // ── Layout: icon_position = 'left' ────────────────────────────────────
    if (iconPosition === 'left') {
      const content = (
        <div
          style={{
            padding: finalPadding,
            backgroundColor: bgColor,
            borderRadius: finalRadius,
          }}
        >
          <div className="flex items-start gap-4">
            {/* Ícone com fundo arredondado */}
            {IconComponent && (
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-xl"
                style={{
                  width:  `${iconContainerSize}px`,
                  height: `${iconContainerSize}px`,
                  backgroundColor: computedIconBg,
                }}
              >
                <IconComponent
                  style={{
                    width:  `${iconSizeRem}px`,
                    height: `${iconSizeRem}px`,
                    color:  iconColor,
                  }}
                />
              </div>
            )}

            {/* Texto */}
            <div className="flex-1 min-w-0">
              {card.title && (
                <h3
                  className={titleGap}
                  style={{
                    fontSize:   finalTitleFs,
                    fontWeight: template?.title_font_weight || 700,
                    color:      titleColor,
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </h3>
              )}
              {card.subtitle && (
                <p
                  className="leading-relaxed"
                  style={{
                    fontSize:   finalSubtitleFs,
                    fontWeight: template?.subtitle_font_weight || 400,
                    color:      subtitleColor,
                  }}
                >
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      );

      const wrapperStyle: React.CSSProperties = {
        borderRadius: finalRadius,
        border: cardBorderWidth > 0 ? `${cardBorderWidth}px solid ${borderColor}` : 'none',
        boxShadow: cardShadow,
        overflow: 'hidden',
      };

      if (link && link !== '#') {
        return (
          <Link to={link} className="group block" style={wrapperStyle}>
            {content}
          </Link>
        );
      }

      return <div style={wrapperStyle}>{content}</div>;
    }

    // ── Layout: media_position = 'top' — imagem contida + conteúdo centralizado ──
    // Ativado quando o template define media_position = 'top'.
    // Diferente do layout padrão (mídia como background full-bleed), aqui
    // a imagem aparece como elemento visual independente acima do texto.
    if (template?.media_position === 'top' && template?.has_media !== false) {
      const imgMaxH  = compact ? '120px' : '180px';
      const imgAreaH = compact ? '140px' : '200px';

      const topMediaContent = (
        <div
          style={{
            backgroundColor: bgColor,
            borderRadius: finalRadius,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Área da imagem */}
          <div
            style={{
              width: '100%',
              minHeight: imgAreaH,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: `${parseFloat(cardPaddingRaw)}rem ${parseFloat(cardPaddingRaw)}rem ${parseFloat(cardPaddingRaw) * 0.5}rem`,
            }}
          >
            {card.media_url && !card.media_url.startsWith('figma:asset/') ? (
              <img
                src={card.media_url}
                alt={card.title || ''}
                style={{
                  maxHeight: imgMaxH,
                  maxWidth: '80%',
                  width: 'auto',
                  objectFit: 'contain',
                  opacity: mediaOpacity / 100,
                }}
              />
            ) : (
              /* Placeholder quando sem imagem: número do card em badge circular */
              <div
                style={{
                  width:  compact ? '72px' : '96px',
                  height: compact ? '72px' : '96px',
                  borderRadius: '50%',
                  backgroundColor: hexToRgba(titleColor, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: compact ? '1.75rem' : '2.5rem',
                  fontWeight: 700,
                  color: titleColor,
                }}
              >
                {/* Extrair número do título se existir (ex: "Passo 1" → "1") */}
                {card.title?.match(/\d+/)?.[0] ?? '●'}
              </div>
            )}
          </div>

          {/* Conteúdo de texto */}
          <div
            style={{
              padding: `0 ${parseFloat(cardPaddingRaw)}rem ${parseFloat(cardPaddingRaw)}rem`,
              textAlign: 'center',
              width: '100%',
            }}
          >
            {card.title && (
              <h3
                style={{
                  fontSize:    finalTitleFs,
                  fontWeight:  template?.title_font_weight || 600,
                  color:       titleColor,
                  lineHeight:  1.3,
                  marginBottom: compact ? '0.5rem' : '0.75rem',
                }}
              >
                {card.title}
              </h3>
            )}
            {card.subtitle && (
              <p
                style={{
                  fontSize:   finalSubtitleFs,
                  fontWeight: template?.subtitle_font_weight || 400,
                  color:      subtitleColor,
                  lineHeight: 1.6,
                }}
              >
                {card.subtitle}
              </p>
            )}
          </div>
        </div>
      );

      const topMediaWrapper: React.CSSProperties = {
        borderRadius: finalRadius,
        border: cardBorderWidth > 0 ? `${cardBorderWidth}px solid ${borderColor}` : 'none',
        boxShadow: cardShadow,
        overflow: 'hidden',
      };

      if (link && link !== '#') {
        return (
          <Link to={link} className="group block" style={topMediaWrapper}>
            {topMediaContent}
          </Link>
        );
      }
      return <div style={topMediaWrapper}>{topMediaContent}</div>;
    }

    // ── Layout: icon_position = 'top' + textAlign = 'center' ─────────────
    // Ativado quando template.config.textAlign === 'center'.
    // Cards minimalistas: ícone grande centralizado + texto centralizado abaixo.
    // Fundo transparente quando card_bg_color_token é null.
    if (template?.config?.textAlign === 'center') {
      const hasBg = !!template?.card_bg_color_token;

      const centeredContent = (
        <div
          style={{
            padding:         finalPadding,
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            textAlign:       'center',
            backgroundColor: hasBg ? bgColor : 'transparent',
            borderRadius:    finalRadius,
          }}
        >
          {IconComponent && (
            <div
              style={{
                color:        iconColor,
                marginBottom: '5px',
                lineHeight:   0,
              }}
            >
              <IconComponent
                style={{
                  width:       `${iconSizeRem * 1.5}px`,
                  height:      `${iconSizeRem * 1.5}px`,
                  strokeWidth: 1.5,
                }}
              />
            </div>
          )}

          {card.title && (
            <h3
              style={{
                fontSize:   `calc(${finalTitleFs} * 1.15)`,
                fontWeight: template?.title_font_weight || 500,
                color:      titleColor,
                lineHeight: 1.5,
              }}
            >
              {card.title}
            </h3>
          )}

          {card.subtitle && (
            <p
              style={{
                fontSize:   `calc(${finalSubtitleFs} * 1.1)`,
                fontWeight: template?.subtitle_font_weight || 400,
                color:      subtitleColor,
                lineHeight: 1.6,
                marginTop:  '1rem',
              }}
            >
              {card.subtitle}
            </p>
          )}
        </div>
      );

      const centeredWrapper: React.CSSProperties = {
        borderRadius: finalRadius,
        border:       cardBorderWidth > 0 ? `${cardBorderWidth}px solid ${borderColor}` : 'none',
        boxShadow:    cardShadow,
        overflow:     'hidden',
      };

      if (link && link !== '#') {
        return (
          <Link to={link} className="group block" style={centeredWrapper}>
            {centeredContent}
          </Link>
        );
      }
      return <div style={centeredWrapper}>{centeredContent}</div>;
    }

    // ── Layout: icon_position = 'top' (padrão — layout original) ──────────

    const iconClass = compact ? 'h-6 w-6' : 'h-8 w-8';
    const iconGap   = compact ? 'mb-2' : 'mb-4';
    const titleGapTop = compact ? 'mb-2' : 'mb-3';

    const content = (
      <>
        <div className="relative" style={{ minHeight }}>
          {/* CAMADA 1: cor de fundo */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: bgColor, borderRadius: finalRadius }}
          />

          {/* CAMADA 2: mídia de background */}
          {(card.media_url || card.bg_image_url) && showMediaBg && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ borderRadius: finalRadius }}
            >
              {!card.media_url?.startsWith('figma:asset/') && !card.bg_image_url?.startsWith('figma:asset/') ? (
                <img
                  src={card.media_url || card.bg_image_url}
                  alt={card.title || ''}
                  className="w-full h-full object-cover"
                  style={{ opacity: mediaOpacity / 100 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <p className="text-sm text-gray-500 text-center px-4">
                    Mídia não disponível<br />
                    <span className="text-xs">Use Supabase Storage ou URLs externas</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CAMADA 3: conteúdo */}
          <div
            className="relative z-10 flex flex-col justify-start"
            style={{ padding: finalPadding, minHeight, height: '100%' }}
          >
            {IconComponent && (
              <div className={iconGap} style={{ color: iconColor }}>
                <IconComponent
                  style={{
                    width:  `${iconSizeRem}px`,
                    height: `${iconSizeRem}px`,
                  }}
                />
              </div>
            )}
            {card.title && (
              <h3
                className={titleGapTop}
                style={{
                  fontSize:   finalTitleFs,
                  fontWeight: template?.title_font_weight || 700,
                  color:      titleColor,
                }}
              >
                {card.title}
              </h3>
            )}
            {card.subtitle && (
              <p
                className="leading-relaxed"
                style={{
                  fontSize:   finalSubtitleFs,
                  fontWeight: template?.subtitle_font_weight || 400,
                  color:      subtitleColor,
                }}
              >
                {card.subtitle}
              </p>
            )}
          </div>
        </div>
      </>
    );

    const wrapperStyle: React.CSSProperties = {
      borderRadius: finalRadius,
      border: cardBorderWidth > 0 ? `${cardBorderWidth}px solid ${borderColor}` : 'none',
      boxShadow: cardShadow,
      overflow: 'hidden',
    };

    if (link && link !== '#') {
      return (
        <Link to={link} className="group block" style={wrapperStyle}>
          {content}
        </Link>
      );
    }

    return <div style={wrapperStyle}>{content}</div>;
  }

  // ── Render: testimonial ───────────────────────────────────────────────────
  if (card.type === 'testimonial') {
    const config = card.config || {};
    const { name, role, text, avatar, rating } = config;

    return (
      <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6">
        <div className="flex items-center gap-4 mb-4">
          {avatar && (
            <img
              src={avatar}
              alt={name || ''}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
            />
          )}
          <div>
            {name && <h4 className="font-bold text-[#2e2240]">{name}</h4>}
            {role && <p className="text-sm text-gray-600">{role}</p>}
          </div>
        </div>
        {rating && (
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? 'fill-[#ea526e] text-[#ea526e]' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        )}
        {text && <p className="text-gray-700 italic leading-relaxed">"{text}"</p>}
      </div>
    );
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6">
      <p className="text-gray-500">Card tipo: {card.type || 'desconhecido'}</p>
      <p className="text-sm text-gray-400 mt-2">{card.name || 'Sem nome'}</p>
    </div>
  );
}