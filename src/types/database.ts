/**
 * Tipos TypeScript centralizados para o banco de dados BemDito CMS
 *
 * ⚠️  IMPORTANTE: Sempre use estes tipos ao invés de criar novos localmente.
 *     Última revisão: 2026-02-21 (v2.1 — category 'admin-ui' adicionada; AdminUIToken documentado)
 */

// ===== SECTION TYPES =====

/**
 * Posições válidas no grid 2×2
 * Armazenadas como STRINGS DIRETAS em layout.desktop.*
 */
export type GridPosition =
  | 'top-left'    | 'top-center'    | 'top-right'
  | 'middle-left' | 'center'        | 'middle-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

/**
 * Valores reais de fitMode confirmados no banco (2026-02-19):
 * - "cover"    → cobre área, pode cortar    (Melhores Profissionais)
 * - "contain"  → exibe imagem completa      (Prazer, somos a BemDito!)
 * - "adaptada" → se adapta à altura do txt  (APP, Monte seu Projeto)
 * - "alinhada" → cola nas bordas alinhX/Y   (0 seções ativas, suportado)
 *
 * ⚠️  NÃO usar: "cobrir", "ajustada", "contida" — não são valores reais do banco
 */
export type MediaFitMode = 'cover' | 'contain' | 'adaptada' | 'alinhada';

/**
 * Elementos presentes em uma seção (fields confirmados do banco)
 */
export interface SectionElements {
  hasIcon:       boolean;
  hasMinorTitle: boolean;    // Chamada (smallTitle)
  hasMainTitle:  boolean;
  hasSubtitle:   boolean;
  hasButton:     boolean;
  hasMedia:      boolean;
  hasCards:      boolean;
  hasContainer:  boolean;
  cardCount?:    number;
  mediaType?:    'image' | 'video' | null;
}

/**
 * Layout de uma seção (estrutura real confirmada em 2026-02-19)
 *
 * ⚠️  desktop.text / desktop.media / desktop.cards são STRINGS DIRETAS do tipo GridPosition.
 *     NÃO são objetos {position: "..."} — formato objeto é legado e deve ser migrado.
 *
 * @example
 * layout.desktop.text  = "middle-left"   ← CORRETO
 * layout.desktop.text  = { position: "middle-left" }  ← LEGADO — migrar
 */
export interface SectionLayout {
  desktop: {
    text?:  GridPosition;   // Posição do bloco de texto
    media?: GridPosition;   // Posição da mídia
    cards?: GridPosition;   // Posição dos cards
    /** @deprecated Usar SectionLayout.desktop.text */
    textAlign?: 'left' | 'center' | 'right';
  };
  mobile?: {
    stack?:    'vertical' | 'horizontal';
    textAlign?: 'left' | 'center' | 'right';
  };
}

/**
 * Estilos visuais de uma seção (valores reais confirmados em 2026-02-19)
 *
 * spacing aceita:
 *  - Incrementos de 25px: "0px" | "25px" | "50px" | "75px" | "100px" | "125px" | "150px" | "175px" | "200px"
 *  - Tokens legados (retrocompatibilidade): "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
 *  Padrão: "50px"
 *
 * Valores reais do banco (Bloco 7 — 2026-02-19):
 *  - Melhores Profissionais: top=50px, bottom=0px, left=0px, right=0px, gap=0px
 *  - Prazer, somos a BemDito!: top=0px, bottom=0px, left=50px, right=0px, gap=50px
 *  - Monte seu Projeto: all=50px, rowGap=100px
 */
export interface SectionStyling {
  height?:  'auto' | '50vh' | '100vh';   // Valores reais confirmados
  bgColor?: string;                       // UUID de design_token
  spacing?: {
    top?:    string;   // "0px"–"200px" em passos de 25 ou token legado
    bottom?: string;
    left?:   string;
    right?:  string;
    gap?:    string;   // Gap entre colunas
    rowGap?: string;   // Gap entre linhas
  };
}

/**
 * Seção do banco de dados
 *
 * type é sempre 'unico' (sistema unificado desde 2026-02-10).
 * config, layout, styling, elements são JSONB flexíveis.
 *
 * Seções reais (10 — Bloco 7, 2026-02-19):
 *   APP, Blog, Como funciona?, Marketing Digital, Melhores Profissionais,
 *   Monte seu Projeto, Orçamento, Portfólio, Prazer somos a BemDito!, Seção Inicial - Home
 */
export interface Section {
  id:         string;
  name:       string;
  type:       string;          // Sempre 'unico'
  config:     Record<string, any>;   // JSONB: gridRows, gridCols, title, mediaUrl, cardTemplateId…
  elements:   SectionElements;
  layout:     SectionLayout;
  styling:    SectionStyling;
  global:     boolean;
  published:  boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Seção vinculada a uma página (relacionamento N:N via page_sections)
 */
export interface PageSection {
  id:          string;
  page_id:     string;
  section_id:  string;
  order_index: number;       // ✅ "order_index" — NÃO "order"
  config:      Record<string, any>;   // Override config específico desta instância
  section?:    Section;      // JOIN opcional
}

// ===== PAGE TYPES =====

/**
 * Página do site público.
 * Registros reais (2026-02-19): '/' (Página Inicial, 10 seções), '/ajustes' (0 seções)
 */
export interface Page {
  id:               string;
  name:             string;
  slug:             string;
  title?:           string;
  meta_title?:      string;
  meta_description?: string;
  meta_keywords?:   string;
  og_image?:        string;
  published:        boolean;
  created_at?:      string;
  updated_at?:      string;
}

// ===== CARD TYPES =====

/**
 * Card de megamenu (tabela menu_cards — 24 colunas confirmadas em 2026-02-19)
 *
 * ⚠️  NÃO tem FK para menu_items.
 *     A associação é feita via JSONB: menu_items.megamenu_config.columns[].card_ids[]
 */
export interface MenuCard {
  id:   string;
  name: string;

  // Visual
  bg_color_token?:     string;    // UUID → design_tokens
  border_color_token?: string;    // UUID → design_tokens

  // Ícone
  icon?:              string;     // Nome do ícone Lucide
  icon_size?:         number;     // pos 20 — Default: 28
  icon_color_token?:  string;     // UUID → design_tokens

  // Título
  title?:             string;
  title_font_size?:   string;     // pos 21 — UUID → design_tokens
  title_font_weight?: number;     // pos 22 — Default: 600
  title_color_token?: string;     // UUID → design_tokens

  // Subtítulo
  subtitle?:              string;
  subtitle_font_size?:    string; // pos 23 — UUID → design_tokens ← EXISTE (confirmado)
  subtitle_font_weight?:  number; // pos 24 — Default: 400          ← EXISTE (confirmado)
  subtitle_color_token?:  string; // UUID → design_tokens

  // Link
  url?:       string;
  url_type?:  'internal' | 'external' | 'anchor';

  // Tabs (opcional)
  tabs?:                  any[];   // JSONB array
  active_tab_id?:         string;
  tab_bg_color_token?:    string;  // UUID → design_tokens
  tab_border_color_token?: string; // UUID → design_tokens

  is_global?:  boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Template de cards para seções (tabela card_templates — 43 colunas confirmadas 2026-02-19)
 *
 * Registros reais:
 *  - 'Marketing Digital Cards' (id: 035097b0-4f3c) — grid 1×1×1, 1 card, sem filtros, opacity=26
 *  - 'Serviços BemDito'        (id: 404c526d-bf7a) — grid 3×2×1, 6 cards, filtros=4, opacity=100
 *
 * ⚠️  NÃO existem: display_mode, cols — use columns_desktop / columns_tablet / columns_mobile
 */
export interface CardTemplate {
  id:   string;
  name: string;                     // pos 2 — NOT NULL

  // Geral
  variant?:   string;               // pos 3 — identificador de variante visual
  config:     Record<string, any>;  // pos 4 — JSONB de configs extras, NOT NULL default '{}'

  is_global?: boolean;              // pos 5 — default false
  created_at?: string;
  updated_at?: string;

  // Grid responsivo
  columns_desktop?: number;   // pos 8  default 3  ← ⚠️ NÃO é "display_mode" nem "cols"
  columns_tablet?:  number;   // pos 9  default 2
  columns_mobile?:  number;   // pos 10 default 1
  gap?:             string;   // pos 11 default 'md' — token de espaçamento

  // Visual do card
  card_bg_color_token?:     string; // pos 12 UUID → design_tokens (SET NULL)
  card_border_color_token?: string; // pos 13 UUID → design_tokens (SET NULL)
  card_border_radius?:      string; // pos 14 default '2xl'
  card_padding?:            string; // pos 15 default 'md'
  card_shadow?:             string; // pos 16 default 'md'

  // Ícone
  has_icon?:         boolean;       // pos 17 default true
  icon_size?:        number;        // pos 18 default 32
  icon_color_token?: string;        // pos 19 UUID → design_tokens (SET NULL)
  icon_position?:    string;        // pos 20 default 'top'

  // Título
  has_title?:         boolean;      // pos 21 default true
  title_font_size?:   string;       // pos 22 UUID → design_tokens (SET NULL)
  title_font_weight?: number;       // pos 23 default 600
  title_color_token?: string;       // pos 24 UUID → design_tokens (SET NULL)

  // Subtítulo
  has_subtitle?:         boolean;   // pos 25 default true
  subtitle_font_size?:   string;    // pos 26 UUID → design_tokens (SET NULL)
  subtitle_font_weight?: number;    // pos 27 default 400
  subtitle_color_token?: string;    // pos 28 UUID → design_tokens (SET NULL)

  // Mídia
  has_media?:          boolean;     // pos 29 default false
  media_position?:     string;      // pos 30 default 'top'
  media_aspect_ratio?: string;      // pos 31 default '16/9'
  media_border_radius?: string;     // pos 32 default '2xl'

  // Link
  has_link?:              boolean;  // pos 33 default true
  link_style?:            string;   // pos 34 default 'card'
  link_text_color_token?: string;   // pos 35 UUID → design_tokens (SET NULL)

  // Filtros
  has_filters?:                    boolean;         // pos 36 default false
  filters_position?:               'top' | 'bottom'; // pos 37 default 'top'
  filter_button_bg_color_token?:   string;           // pos 38 UUID (SET NULL)
  filter_button_text_color_token?: string;           // pos 39 UUID (SET NULL)
  filter_active_bg_color_token?:   string;           // pos 40 UUID (SET NULL)
  filter_active_text_color_token?: string;           // pos 41 UUID (SET NULL)

  // Extras
  example_media_url?: string;       // pos 42 — URL de exemplo para preview no admin
  media_opacity?:     number;       // pos 43 default 100 (constraint: 0–100%)
}

/**
 * Filtro de cards (tabela card_filters — 7 colunas confirmadas)
 *
 * ⚠️  Usar "label" — NÃO "name" (coluna não existe)
 * ⚠️  Usar "order_index" — NÃO "order" (coluna não existe)
 *
 * Registros reais (todos do template 'Serviços BemDito' 404c526d):
 *  - Todos (order=0), Marketing Digital (order=1), Branding (order=2), Conteúdo (order=3)
 */
export interface CardFilter {
  id:          string;
  template_id: string;       // FK → card_templates.id (CASCADE) — UNIQUE com slug
  label:       string;       // ✅ "label" — NÃO "name"
  slug?:       string;       // UNIQUE com template_id
  icon?:       string;
  order_index: number;       // ✅ "order_index" — NÃO "order"  NOT NULL default 0
  created_at?: string;
  // ⚠️ NÃO tem updated_at
}

/**
 * Card individual de seção (tabela template_cards — 14 colunas confirmadas)
 *
 * ⚠️  Usar "order_index" — NÃO "order" (coluna não existe)
 * ⚠️  NÃO existe coluna "published" nesta tabela
 *
 * Registros reais (7 cards):
 *  - 1 card em 'Marketing Digital Cards' (3.2 bilhões — com media_url, opacity=50)
 *  - 6 cards em 'Serviços BemDito' (todos sem media_url, opacity=100)
 */
export interface TemplateCard {
  id:            string;
  template_id:   string;    // FK → card_templates.id (CASCADE)
  icon?:         string;    // Nome ícone Lucide
  title?:        string;
  subtitle?:     string;
  media_url?:    string;    // URL Supabase Storage ou CDN. NÃO usar figma:asset/
  link_url?:     string;
  link_type?:    'internal' | 'external'; // default 'internal'
  filter_id?:    string;    // FK → card_filters.id (SET NULL)
  filter_tags?:  string[];  // ARRAY PostgreSQL
  order_index:   number;    // ✅ "order_index" — NOT NULL default 0
  media_opacity?: number;   // 0-100, default 100
  created_at?:   string;
  updated_at?:   string;
  // Dados populados por join (não estão no banco)
  _template?:   CardTemplate;
  _filter?:     CardFilter;
}

/**
 * Vínculo seção ↔ template (tabela section_template_cards — 0 registros)
 * ⚠️ A vinculação real é feita via sections.config.cardTemplateId (JSONB), não por esta tabela.
 *    Índice unique: (section_id, template_id)
 */
export interface SectionTemplateCard {
  section_id:  string;   // FK → sections.id (CASCADE)
  template_id: string;   // FK → card_templates.id (CASCADE)
  updated_at?: string;   // Atualizado via trigger update_section_template_cards_updated_at
}

/**
 * Ativo de mídia (tabela media_assets — 14 colunas, 0 registros)
 * O bucket Supabase Storage (make-72da2481-media) é a fonte real. media_assets registra metadados.
 */
export interface MediaAsset {
  id:                string;
  filename:          string;
  original_filename: string;
  mime_type:         string;
  size_bytes:        number;
  storage_path:      string;
  public_url:        string;
  width?:            number;
  height?:           number;
  alt_text?:         string;
  caption?:          string;
  created_at?:       string;
  created_by?:       string;  // UUID do usuário (FK para auth.users)
  updated_at?:       string;
}

// ===== DESIGN SYSTEM TYPES =====

/**
 * Token do Design System (tabela design_tokens)
 *
 * ⚠️  category usa SINGULAR: 'color', 'typography', 'spacing', 'radius', 'transition', 'admin-ui'
 *     NÃO usar plurais nem 'colors', 'typographies', 'transitions'
 *
 * Distribuição real (2026-02-21):
 *  - color (8):      primary, secondary, accent, background, dark, muted, purple-dark, test-token
 *  - typography (12): body, body-base, body-small, button-text, card-menu-title, font-family,
 *                     heading-medium, main-title, megamenu-title, menu, minor-title, subtitle
 *  - spacing (6):    xs, sm, md, lg, xl, 2xl  (tokens legados — spacing em px via dropdown)
 *  - radius (7):     none, sm, md, lg, xl, 2xl, full
 *  - transition (5): fast, normal, slow, smooth, bounce
 *  - admin-ui (16):  page-title, page-description, section-header, section-subheader,
 *                    item-title-list, item-title-grid, item-identifier, item-slug,
 *                    item-description, item-tertiary, item-token,
 *                    card-border, card-bg, page-bg, sidebar-bg, sidebar-active
 *
 * ⚠️  admin-ui: tokens de interface do painel admin, injetados como CSS vars --admin-* pelo
 *               AdminThemeProvider. NÃO são usados no site público.
 */
export interface DesignToken {
  id:         string;
  category:   'color' | 'typography' | 'spacing' | 'radius' | 'transition' | 'admin-ui';
  name:       string;
  label:      string;
  value:      any;    // JSONB — estrutura varia por categoria
  order:      number;
  created_at?: string;
  updated_at?: string;
}

/** Token de cor: value = { "hex": "#ea526e" } */
export interface ColorToken extends DesignToken {
  category: 'color';
  value: { hex: string };
}

/** Token de tipografia: value = { "size": "1rem", "weight": 400, "lineHeight": 1.6 } */
export interface TypographyToken extends DesignToken {
  category: 'typography';
  value: { size: string; weight: number | string; lineHeight?: number | string; family?: string; weights?: number[] };
}

/** Token de espaçamento (legado): value = { "value": "1.5rem" } */
export interface SpacingToken extends DesignToken {
  category: 'spacing';
  value: { value: string };
}

/** Token de border-radius: value = { "value": "1.5rem" } */
export interface RadiusToken extends DesignToken {
  category: 'radius';
  value: { value: string };
}

/** Token de transição: value = { "duration": "300ms", "easing": "ease-in-out" } */
export interface TransitionToken extends DesignToken {
  category: 'transition';
  value: { duration: string; easing: string };
}

/**
 * Token de interface do painel admin (category = 'admin-ui').
 * Injetados como CSS vars --admin-* pelo AdminThemeProvider.
 *
 * Valor tipográfico: { size: string; weight: number; color: string; mono?: boolean }
 *   CSS vars geradas: --admin-{name}-size, -weight, -color [, -font se mono=true]
 *
 * Valor de cor: { hex: string }
 *   CSS var gerada: --admin-{name}
 *
 * @example
 * // Ler o token via helper:
 * import { adminVar } from '@/app/components/admin/AdminThemeProvider';
 * style={{ fontSize: adminVar('item-title-grid', 'size') }}
 *   → style={{ fontSize: 'var(--admin-item-title-grid-size)' }}
 */
export interface AdminUIToken extends DesignToken {
  category: 'admin-ui';
  value:
    | { size: string; weight: number; color: string; mono?: boolean }  // tipográfico
    | { hex: string };                                                  // cor pura
}

// ===== MENU TYPES =====

/**
 * Estrutura do megamenu_config em menu_items (JSONB)
 *
 * ⚠️  bgColor e mediaPosition estão no NÍVEL RAIZ (não dentro de columns)
 *
 * Valores reais (2026-02-19):
 *  - 'Muito prazer!'           bgColor=#f7c7a6  mediaPosition=right  colunas=1
 *  - 'Tendências e Inspiração' bgColor=#e5d4d4  mediaPosition=left   colunas=1
 *  - 'Chama a gente!'          bgColor=#e5d4d4  mediaPosition=left   colunas=2
 *  - 'Ajustes'                 bgColor=#e5d4d4  mediaPosition=left   colunas=1
 */
export interface MegamenuConfig {
  enabled:        boolean;
  bgColor?:       string;                            // Cor de fundo do painel (ex: "#e5d4d4")
  mediaPosition?: 'left' | 'right';                  // Posição padrão da mídia nas colunas
  columns: {
    id:                   string;
    title?:               string;                    // Título pequeno (chamada)
    titleColor?:          string;                    // UUID ou hex
    titleFontSize?:       string;                    // UUID
    titleFontWeight?:     number;
    mainTitle?:           string;
    mainTitleColor?:      string;
    mainTitleFontSize?:   string;                    // UUID
    mainTitleFontWeight?: number;
    media_url?:           string;
    card_ids:             string[];
  }[];
  footer?: {
    url:  string;
    text: string;
  };
}

/**
 * Item do menu principal (tabela menu_items — 4 registros)
 *
 * Labels reais: 'Muito prazer!', 'Tendências e Inspiração', 'Chama a gente!', 'Ajustes'
 * ⚠️ Diferem levemente do site_config.header.menu_items (hardcoded e desatualizado)
 */
export interface MenuItem {
  id:                  string;
  label:               string;
  label_color_token?:  string;   // UUID → design_tokens
  icon?:               string;
  order:               number;
  megamenu_config?:    MegamenuConfig;
  created_at?:         string;
  updated_at?:         string;
}

// ===== SITE CONFIG TYPES =====

/**
 * Configuração global do site (tabela site_config — 1 registro)
 *
 * ⚠️  DISCREPÂNCIAS CONFIRMADAS (2026-02-19):
 *   1. site_config.header.menu_items é HARDCODED (4 itens diferentes da tabela menu_items)
 *   2. site_config.footer ≠ footer_config.config (estruturas e conteúdos diferentes)
 *
 * → Para o Header: buscar dados da tabela `menu_items` via API
 * → Para o Footer: usar `footer_config.config` (fonte primária do footer_manager)
 */
export interface SiteConfig {
  id: string;
  header: {
    sticky?: boolean;
    logo?: {
      alt?:  string;
      url:   string;
      link:  string;
    };
    cta?: {
      label: string;
      icon:  string;
      url:   string;
    };
    /** @deprecated Hardcoded — buscar da tabela menu_items via API */
    menu_items?: Array<{
      id:           string;
      url:          string;
      icon?:        string;
      label:        string;
      has_dropdown: boolean;
    }>;
  };
  footer: {
    columns?: Array<{
      title: string;
      links: Array<{ label: string; url: string }>;
    }>;
    copyright?: string;
    social?: Array<{ platform?: string; network?: string; url: string; icon: string }>;
  };
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Configuração do footer (tabela footer_config — 1 registro, source of truth do footer_manager)
 * id: 9c1054ca-ce27-48f6-8718-88aed69340c6
 * updated_at: 2026-02-07 08:40:53
 *
 * Conteúdo real:
 *  - social: [facebook, instagram]
 *  - columns: [Empresa (Sobre Nós, Contato), Recursos (Blog)]
 *  - copyright: "© 2026 BemDito. Todos os direitos reservados."
 */
export interface FooterConfig {
  id: string;
  config: {
    columns?: Array<{
      id?:    string;
      title:  string;
      links:  Array<{ url: string; label: string; icon?: string }>;
    }>;
    social?: Array<{
      platform: string;
      url:      string;
      icon:     string;
    }>;
    copyright?: string;
  };
  created_at?: string;
  updated_at?: string;
}

// ===== HELPER TYPES =====

/** Resultado de validação de estrutura de seção */
export interface SectionValidationResult {
  is_valid:       boolean;
  missing_fields: string[];
}

export type SortOrder = 'asc' | 'desc';

export interface SearchFilters {
  published?:  boolean;
  global?:     boolean;
  type?:       string;
  searchTerm?: string;
}