import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useDesignSystem } from '../../../lib/contexts/DesignSystemContext';
import { getTokenColor } from '../../../lib/utils/colors';

/**
 * Converte cor hexadecimal para rgba() com opacidade
 * @param hex - Cor em formato #RRGGBB
 * @param opacity - Opacidade 0-100 (será convertido para 0-1)
 * @returns String rgba(r, g, b, a) ou o hex original se conversão falhar
 */
function hexToRgba(hex: string, opacity: number = 100): string {
  // Se opacidade é 100%, retornar hex direto (sem transparência)
  if (opacity === 100) return hex;

  // Remover # se existir
  const cleanHex = hex.replace('#', '');
  
  // Converter hex para RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  // Validar se a conversão deu certo
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    console.warn(`⚠️ [hexToRgba] Conversão falhou para: ${hex}`);
    return hex; // Fallback para hex original
  }
  
  // Converter opacidade de 0-100 para 0-1
  const alpha = opacity / 100;
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ✨ NOVO: Card inline (sem banco de dados)
interface InlineCard {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  url: string;
}

interface MenuCard {
  id: string;
  name: string;
  icon?: string;
  icon_size?: number;
  icon_color_token?: string;
  title?: string;
  title_font_size?: string;
  title_font_weight?: number;
  title_color_token?: string;
  subtitle?: string;
  subtitle_font_size?: string;
  subtitle_font_weight?: number;
  subtitle_color_token?: string;
  bg_color_token?: string;        // ✅ Cor de fundo
  border_color_token?: string;    // ✅ Cor de borda
  bg_opacity?: number;            // ✅ NOVO: Opacidade de fundo (0-100)
  border_opacity?: number;        // ✅ NOVO: Opacidade de borda (0-100)
  url?: string;
  order_index?: number; // ✅ Usado para ordenação (mas ignorado - usamos card_ids)
}

// ✨ NOVO: Formatação compartilhada dos cards
interface SharedCardFormatting {
  titleFontSize?: string;
  titleColor?: string;
  subtitleFontSize?: string;
  iconSize?: string;
  iconColor?: string;
  bgColor?: string;
  borderColor?: string;
}

interface MegamenuColumn {
  id: string;
  title?: string;
  titleColor?: string;
  titleFontSize?: string;
  titleFontWeight?: number;
  description?: string;  // ✨ NOVO
  descriptionColor?: string;
  descriptionFontSize?: string;
  mainTitle?: string;
  mainTitleColor?: string;
  mainTitleFontSize?: string;
  mainTitleFontWeight?: number;
  media_url?: string;
  // ✨ NOVO: Cards inline ao invés de card_ids
  inlineCards?: InlineCard[];
  // ✨ NOVO: Formatação compartilhada
  cardFormatting?: SharedCardFormatting;
  // ⚠️ DEPRECATED: Manter para backward compatibility
  card_ids?: string[];
}

interface MegamenuConfig {
  enabled: boolean;
  bgColor?: string;
  mediaPosition?: 'left' | 'right';
  // ✅ ESTRUTURA NOVA: 1 coluna fixa (singular)
  column?: MegamenuColumn;
  // ⚠️ DEPRECATED: Manter para backward compatibility
  columns?: MegamenuColumn[];
  footer?: {
    text: string;
    url: string;
  };
  // ✨ NOVO: Estilos globais dos cards
  cardStyles?: {
    bgColorToken?: string;
    bgOpacity?: number;
    borderColorToken?: string;
    borderOpacity?: number;
  };
}

interface MegamenuContentProps {
  config: MegamenuConfig;
  cards?: MenuCard[]; // ✅ Opcional agora (inlineCards não precisam)
  onCardClick?: (url: string) => void;
  labelText?: string;
  labelColor?: string;
}

export function MegamenuContent({ config, cards, onCardClick }: MegamenuContentProps) {
  const { colors, typography, getColor: getColorByName, getTypography, primaryColor, darkColor } = useDesignSystem();
  
  // ✅ BACKWARD COMPATIBILITY: Se não tem "column" mas tem "columns", usar columns[0]
  const column = config.column || config.columns?.[0] || {
    id: 'col-fixed',
    title: '',
    mainTitle: '',
    inlineCards: [],
    card_ids: [],
    media_url: '',
  };
  
  const mediaPosition = config.mediaPosition || 'left';
  const hasMedia = !!column.media_url;
  
  // Espaçamento padrão uniforme: 3rem (48px)
  const standardSpacing = '3rem';
  
  // ✨ NOVO: Usar inlineCards se existir, senão fallback para card_ids antigos
  const columnCards = column.inlineCards || (cards || [])
    .filter(card => column.card_ids?.includes(card.id))
    .sort((a, b) => {
      const indexA = column.card_ids?.indexOf(a.id) ?? 999;
      const indexB = column.card_ids?.indexOf(b.id) ?? 999;
      return indexA - indexB;
    });

  // Helper: Obter ícone Lucide
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || null;
  };

  // Helper: Obter estilo tipográfico por ID ou nome
  // ✅ getColorFromTokenId removido — usar getTokenColor(colors, ...) de @/lib/utils/colors
  const getTypographyFromTokenId = (tokenId?: string, weight?: number) => {
    if (!tokenId) {
      return {
        fontWeight: weight || 400,
      };
    }
    
    // Buscar token de tipografia por ID OU nome (backward compatibility)
    const typoToken = typography.find((t) => t.id === tokenId || t.name === tokenId);
    
    if (!typoToken) {
      return {
        fontWeight: weight || 400,
      };
    }
    
    try {
      const parsed = typeof typoToken.value === 'string' ? JSON.parse(typoToken.value) : typoToken.value;
      
      // ✅ CORREÇÃO: Tokens têm "size" ao invés de "fontSize"
      return {
        fontFamily: parsed.fontFamily,
        fontSize: parsed.fontSize || parsed.size, // Mapear "size" → "fontSize"
        fontWeight: weight !== undefined ? weight : (parsed.fontWeight || parsed.weight || 400),
        lineHeight: parsed.lineHeight,
      };
    } catch (error) {
      console.error('❌ [getTypographyFromTokenId] Erro ao parsear:', error);
      return {
        fontWeight: weight || 400,
      };
    }
  };

  return (
    <div 
      className="rounded-2xl shadow-lg overflow-hidden flex"
      style={{ 
        backgroundColor: config.bgColor || '#e5d4d4',
        paddingLeft: hasMedia && mediaPosition === 'left' ? '0' : standardSpacing,
        paddingRight: hasMedia && mediaPosition === 'right' ? '0' : standardSpacing,
        paddingTop: hasMedia ? '0' : standardSpacing,
        paddingBottom: hasMedia ? '0' : standardSpacing,
        flexDirection: mediaPosition === 'left' ? 'row-reverse' : 'row',
        minHeight: '500px', // ✅ Altura mínima (pode crescer se necessário)
        maxHeight: '80vh',  // ✅ Máximo 80% da altura da viewport
        gap: hasMedia ? standardSpacing : '0',
      }}
    >
      {/* CONTEÚDO: 60% */}
      <div 
        className="flex flex-col justify-between"
        style={{ 
          flex: hasMedia ? '0 0 60%' : '1',
          padding: hasMedia ? `${standardSpacing} 0` : '0',
        }}
      >
        {/* TÍTULOS */}
        <div className="space-y-2">
          {/* 1️⃣ Chamada (Título Pequeno) */}
          {column.title && (
            <h3 
              style={{ 
                color: getTokenColor(colors, column.titleColor, darkColor ?? '#000000'),
                ...getTypographyFromTokenId(column.titleFontSize, column.titleFontWeight),
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {column.title}
            </h3>
          )}
          
          {/* 2️⃣ Título Principal (Grande, Destaque) */}
          {column.mainTitle && (
            <h2 
              className="mt-4"
              style={{ 
                color: getTokenColor(colors, column.mainTitleColor, darkColor ?? '#000000'),
                ...getTypographyFromTokenId(column.mainTitleFontSize, column.mainTitleFontWeight),
              }}
            >
              {column.mainTitle}
            </h2>
          )}
          
          {/* 3️⃣ Descrição (Pequeno, Discreto) */}
          {column.description && (
            <p 
              className="mt-2"
              style={{ 
                color: getTokenColor(colors, column.descriptionColor, darkColor ?? '#000000'),
                ...getTypographyFromTokenId(column.descriptionFontSize),
              }}
            >
              {column.description}
            </p>
          )}
        </div>

        {/* CARDS (Grid 2x2) */}
        {columnCards.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            {columnCards.map((card: any) => {
              // ✨ Detectar se é inline card ou card do banco
              const isInlineCard = !card.name; // Inline cards não têm "name"
              const Icon = getIcon(card.icon);
              
              if (isInlineCard) {
                // ✨ NOVO: Renderizar inline card com formatação compartilhada
                const formatting = column.cardFormatting || {};
                
                const bgColor = formatting.bgColor
                  ? getTokenColor(colors, formatting.bgColor, '#ffffff')
                  : 'rgba(255, 255, 255, 0.5)';
                
                const borderColor = formatting.borderColor
                  ? getTokenColor(colors, formatting.borderColor, '#e5e7eb')
                  : 'transparent';
                
                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (card.url) {
                        onCardClick?.(card.url);
                      }
                    }}
                    className={`p-4 rounded-lg border-2 ${card.url ? 'cursor-pointer' : ''}`}
                    style={{ 
                      transition: 'none',
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                      minHeight: '200px', // ✅ Altura mínima fixa
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Ícone */}
                    {Icon && (
                      <Icon
                        size={typeof formatting.iconSize === 'number' ? formatting.iconSize : parseInt(formatting.iconSize || '28')}
                        style={{ 
                          color: getTokenColor(colors, formatting.iconColor, darkColor ?? '#000000'),
                        }}
                        className="mb-2"
                      />
                    )}
                    
                    {/* Título */}
                    {card.title && (
                      <h4 
                        style={{ 
                          color: getTokenColor(colors, formatting.titleColor, darkColor ?? '#000000'),
                          ...getTypographyFromTokenId(formatting.titleFontSize),
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                        className="mb-1"
                      >
                        {card.title}
                      </h4>
                    )}
                    
                    {/* Subtítulo */}
                    {card.subtitle && (
                      <p 
                        style={{ 
                          color: getTokenColor(colors, formatting.titleColor, darkColor ?? '#000000'),
                          ...getTypographyFromTokenId(formatting.subtitleFontSize),
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {card.subtitle}
                      </p>
                    )}
                  </div>
                );
              } else {
                // ✅ Card do banco (sistema antigo)
                const finalBgColorToken = card.bg_color_token || config.cardStyles?.bgColorToken;
                const finalBgOpacity = card.bg_opacity ?? config.cardStyles?.bgOpacity ?? 100;
                const finalBorderColorToken = card.border_color_token || config.cardStyles?.borderColorToken;
                const finalBorderOpacity = card.border_opacity ?? config.cardStyles?.borderOpacity ?? 100;
                
                const bgColor = finalBgColorToken
                  ? getTokenColor(colors, finalBgColorToken, '#ffffff')
                  : 'rgba(255, 255, 255, 0.5)';
                
                const borderColor = finalBorderColorToken
                  ? getTokenColor(colors, finalBorderColorToken, '#e5e7eb')
                  : 'transparent';
                
                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (card.url) {
                        onCardClick?.(card.url);
                      }
                    }}
                    className={`p-4 rounded-lg border-2 ${card.url ? 'cursor-pointer' : ''}`}
                    style={{ 
                      transition: 'none',
                      backgroundColor: hexToRgba(bgColor, finalBgOpacity),
                      borderColor: hexToRgba(borderColor, finalBorderOpacity),
                      minHeight: '200px', // ✅ Altura mínima fixa
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onMouseEnter={(e) => {
                      if (card.url) {
                        const hoverBgOpacity = Math.min(100, finalBgOpacity + 20);
                        e.currentTarget.style.backgroundColor = hexToRgba(bgColor, hoverBgOpacity);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (card.url) {
                        e.currentTarget.style.backgroundColor = hexToRgba(bgColor, finalBgOpacity);
                      }
                    }}
                  >
                    {Icon && (
                      <Icon
                        size={card.icon_size || 28}
                        style={{ color: getTokenColor(colors, card.icon_color_token, darkColor ?? '#000000') }}
                        className="mb-2"
                      />
                    )}
                    
                    {card.title && (
                      <h4 
                        style={{ 
                          color: getTokenColor(colors, card.title_color_token, darkColor ?? '#000000'),
                          ...getTypographyFromTokenId(card.title_font_size, card.title_font_weight),
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                        className="mb-1"
                      >
                        {card.title}
                      </h4>
                    )}
                    
                    {card.subtitle && (
                      <p 
                        style={{ 
                          color: getTokenColor(colors, card.subtitle_color_token, darkColor ?? '#000000'),
                          ...getTypographyFromTokenId(card.subtitle_font_size, card.subtitle_font_weight),
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {card.subtitle}
                      </p>
                    )}
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>

      {/* MÍDIA: 40% */}
      {hasMedia && column.media_url && (
        <div 
          className="relative overflow-hidden"
          style={{ 
            flex: '0 0 40%',
            height: '100%', // ✅ Ocupar 100% da altura do megamenu
            // Bordas arredondadas APENAS no lado da mídia
            borderTopLeftRadius: mediaPosition === 'left' ? '1rem' : '0',
            borderBottomLeftRadius: mediaPosition === 'left' ? '1rem' : '0',
            borderTopRightRadius: mediaPosition === 'right' ? '1rem' : '0',
            borderBottomRightRadius: mediaPosition === 'right' ? '1rem' : '0',
          }}
        >
          {column.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
            <video 
              src={column.media_url} 
              className="w-full h-full object-cover" // ✅ object-cover para preencher 100%
              style={{ aspectRatio: '9/16' }}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img 
              src={column.media_url} 
              alt={column.mainTitle || 'Megamenu media'}
              className="w-full h-full object-cover" // ✅ object-cover para preencher 100%
              style={{ aspectRatio: '9/16' }}
            />
          )}
        </div>
      )}
    </div>
  );
}