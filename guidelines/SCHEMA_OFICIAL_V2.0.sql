-- ═══════════════════════════════════════════════════════════════════════════
-- 🗄️  SCHEMA OFICIAL V2.0 — BemDito CMS
-- ═══════════════════════════════════════════════════════════════════════════
-- ⛔ SUPERSEDIDO — Substituído por SCHEMA_OFICIAL_V3.0.sql (2026-02-19)
-- ═══════════════════════════════════════════════════════════════════════════
-- Este arquivo é mantido apenas como referência histórica.
-- Para o schema atual oficial, use: /guidelines/SCHEMA_OFICIAL_V3.0.sql
-- ═══════════════════════════════════════════════════════════════════════════
-- Data de extração: 2026-02-19 (snapshot inicial da sessão V3.0)
-- Fonte: Resultado real dos BLOCOs 1-14 do EXECUTE_SQL.sql (auditoria completa)
-- Plataforma: Supabase (PostgreSQL 15+)
--
-- ⚠️  ARQUIVO SOMENTE LEITURA — NÃO EDITAR DIRETAMENTE
--
-- 📊 Estatísticas confirmadas (2026-02-19 — Bloco 2):
--   design_tokens     = 38
--   menu_cards        = 22  ← 24 colunas (pos 23-24 confirmadas na query final)
--   menu_items        = 4
--   page_sections     = 10
--   pages             = 2
--   sections          = 10
--   template_cards    = 7
--   card_filters      = 4
--   card_templates    = 2
--   footer_config     = 1
--   site_config       = 1
--   media_assets      = 0
--   section_versions  = 0
--   page_versions     = 181
--   section_template_cards = 0
--   kv_store_72da2481 = (sistema — não auditado)
--
-- 🏗️  Arquitetura (confirmada Blocos 3-5):
--   16 tabelas BASE TABLE + 3 VIEWs
--   31 foreign keys (Bloco 4 — contagem real)
--   46 índices personalizados excluindo PKs (Bloco 5 — contagem real)
--    8 funções (Bloco 13)
--   11 triggers (Bloco 13)
--
-- ✅ Diagnóstico de integridade (Bloco 14 — todos sem erros):
--   14a. Posições como objetos:     0 linhas (✅ todas são strings)
--   14b. gridCols/Rows em layout:   0 linhas (✅ todos em config)
--   14c. Seção em >1 página:        0 linhas (✅ regra 1-seção-1-página OK)
--   14d. Cards sem template:        0 linhas (✅ sem órfãos)
--   14e. page_sections órfãs:       0 linhas (✅ sem órfãos)
--
-- ⚠️  fitMode real nas seções:
--   "cover"    → Melhores Profissionais
--   "contain"  → Prazer, somos a BemDito! (NÃO "alinhada" como documentado antes)
--   "adaptada" → APP, Monte seu Projeto
--   "alinhada" → 0 seções ativas (suportado no código mas não usado no banco)
-- ═══════════════════════════════════════════════════════════════════════════

-- Extensão necessária
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. DESIGN_TOKENS
-- Tokens centralizados do Design System (cores, tipografia, espaçamento…)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE design_tokens (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  category    TEXT        NOT NULL,             -- 'color' | 'typography' | 'spacing' | 'radius' | 'transition'
  name        TEXT        NOT NULL,
  value       JSONB       NOT NULL,
  label       TEXT        NOT NULL,
  "order"     INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (category, name)
);
-- Categorias confirmadas: color (8), radius (7), spacing (6),
--                         transition (5), typography (12) → total 38

CREATE INDEX idx_design_tokens_category       ON design_tokens(category);
CREATE INDEX idx_design_tokens_category_order ON design_tokens(category, "order");

-- Valores reais confirmados (2026-02-19):
-- CORES: primary=#ea526e, secondary=#2e2240, background=#f6f6f6,
--        accent=#ed9331, muted=#e7e8e8, dark=#020105,
--        purple-dark=#2e2240, test-token=#000000
-- TIPOGRAFIA: body, body-base, body-small, button-text, card-menu-title,
--             font-family, heading-medium, main-title, megamenu-title,
--             menu, minor-title, subtitle

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. MENU_ITEMS
-- Itens do header (desktop). Cada item pode ter um megamenu.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE menu_items (
  id                UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  label             TEXT    NOT NULL,
  icon              TEXT,                                         -- Nome do ícone Lucide
  "order"           INTEGER NOT NULL DEFAULT 0,
  megamenu_config   JSONB   DEFAULT '{}'::jsonb,
  label_color_token UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
-- Registros reais (4):
--   'Muito prazer!'           order=0  icon=Heart    bg=#f7c7a6  mediaPosition=right  colunas=1
--   'Tendências e Inspiração' order=1  icon=BookOpen bg=#e5d4d4  mediaPosition=left   colunas=1
--   'Chama a gente!'          order=2  icon=ThumbsUp bg=#e5d4d4  mediaPosition=left   colunas=2
--   'Ajustes'                 order=3  icon=Settings bg=#e5d4d4  mediaPosition=left   colunas=1

CREATE INDEX idx_menu_items_order ON menu_items("order");

-- Estrutura do megamenu_config (JSONB):
-- {
--   "enabled": true,
--   "bgColor": "#e5d4d4",           ← Cor de fundo do painel
--   "mediaPosition": "left"|"right",← Posição padrão da mídia
--   "columns": [
--     {
--       "id": "col1",
--       "title": "CHAMADA",          ← Título pequeno
--       "titleColor": UUID,
--       "titleFontSize": UUID,
--       "titleFontWeight": 600,
--       "mainTitle": "Título Principal",
--       "mainTitleColor": UUID,
--       "mainTitleFontSize": UUID,
--       "mainTitleFontWeight": 700,
--       "media_url": "https://...",
--       "card_ids": ["uuid1", "uuid2"]
--     }
--   ],
--   "footer": { "text": "Ver mais →", "url": "/rota" }
-- }

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. MENU_CARDS
-- Cards reutilizáveis exibidos nos megamenus.
-- 24 colunas confirmadas via information_schema (2026-02-19).
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE menu_cards (
  id                    UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),  -- pos 1
  name                  TEXT    NOT NULL,                                -- pos 2

  -- Visual
  bg_color_token        UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,  -- pos 3
  border_color_token    UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,  -- pos 4

  -- Ícone
  icon                  TEXT,                                            -- pos 5
  icon_color_token      UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,  -- pos 6

  -- Título
  title                 TEXT,                                            -- pos 7
  title_color_token     UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,  -- pos 8

  -- Subtítulo
  subtitle              TEXT,                                            -- pos 9
  subtitle_color_token  UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,  -- pos 10

  -- Link
  url                   TEXT,                                            -- pos 11
  url_type              TEXT    CHECK (url_type IN ('internal', 'external', 'anchor')), -- pos 12

  -- Tabs (opcional)
  tabs                  JSONB   DEFAULT '[]'::jsonb,                     -- pos 13
  active_tab_id         TEXT,                                            -- pos 14
  tab_bg_color_token    UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,  -- pos 15
  tab_border_color_token UUID   REFERENCES design_tokens(id) ON DELETE SET NULL,  -- pos 16

  is_global             BOOLEAN DEFAULT false,                           -- pos 17
  created_at            TIMESTAMPTZ DEFAULT NOW(),                       -- pos 18
  updated_at            TIMESTAMPTZ DEFAULT NOW(),                       -- pos 19

  -- Colunas adicionadas após criação inicial
  icon_size             INTEGER DEFAULT 28,                              -- pos 20
  title_font_size       UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,  -- pos 21
  title_font_weight     INTEGER DEFAULT 600,                             -- pos 22
  subtitle_font_size    UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,  -- pos 23 ← confirmada
  subtitle_font_weight  INTEGER DEFAULT 400                              -- pos 24 ← confirmada
);
-- ✅ Total: 24 colunas confirmadas (não 22 como estimado anteriormente)
-- ✅ Colunas pos 23 e 24 (subtitle_font_size, subtitle_font_weight) EXISTEM

CREATE INDEX idx_menu_cards_is_global  ON menu_cards(is_global);
CREATE INDEX idx_menu_cards_active_tab ON menu_cards(active_tab_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. CARD_TEMPLATES
-- Templates de formatação para os cards das seções.
-- 43 colunas confirmadas via information_schema.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE card_templates (
  id                          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                        TEXT    NOT NULL,
  variant                     TEXT,
  config                      JSONB   NOT NULL DEFAULT '{}'::jsonb,
  is_global                   BOOLEAN DEFAULT false,

  -- Grid responsivo
  columns_desktop             INTEGER DEFAULT 3,
  columns_tablet              INTEGER DEFAULT 2,
  columns_mobile              INTEGER DEFAULT 1,
  gap                         TEXT    DEFAULT 'md',

  -- Visual do card
  card_bg_color_token         UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,
  card_border_color_token     UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,
  card_border_radius          TEXT    DEFAULT '2xl',
  card_padding                TEXT    DEFAULT 'md',
  card_shadow                 TEXT    DEFAULT 'md',

  -- Ícone
  has_icon                    BOOLEAN DEFAULT true,
  icon_size                   INTEGER DEFAULT 32,
  icon_color_token            UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,
  icon_position               TEXT    DEFAULT 'top',

  -- Título
  has_title                   BOOLEAN DEFAULT true,
  title_font_size             UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,
  title_font_weight           INTEGER DEFAULT 600,
  title_color_token           UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,

  -- Subtítulo
  has_subtitle                BOOLEAN DEFAULT true,
  subtitle_font_size          UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,
  subtitle_font_weight        INTEGER DEFAULT 400,
  subtitle_color_token        UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,

  -- Mídia
  has_media                   BOOLEAN DEFAULT false,
  media_position              TEXT    DEFAULT 'top',
  media_aspect_ratio          TEXT    DEFAULT '16/9',
  media_border_radius         TEXT    DEFAULT '2xl',
  media_opacity               INTEGER DEFAULT 100,    -- 0-100%
  example_media_url           TEXT,

  -- Link
  has_link                    BOOLEAN DEFAULT true,
  link_style                  TEXT    DEFAULT 'card',
  link_text_color_token       UUID    REFERENCES design_tokens(id) ON DELETE SET NULL,

  -- Filtros / Tabs
  has_filters                 BOOLEAN DEFAULT false,
  filters_position            TEXT    DEFAULT 'top',
  filter_button_bg_color_token     UUID REFERENCES design_tokens(id) ON DELETE SET NULL,
  filter_button_text_color_token   UUID REFERENCES design_tokens(id) ON DELETE SET NULL,
  filter_active_bg_color_token     UUID REFERENCES design_tokens(id) ON DELETE SET NULL,
  filter_active_text_color_token   UUID REFERENCES design_tokens(id) ON DELETE SET NULL,

  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
-- ⚠️  NÃO existem colunas: display_mode, cols  (erros confirmados no Bloco 9)
--     Use columns_desktop / columns_tablet / columns_mobile

CREATE INDEX idx_card_templates_global  ON card_templates(is_global);
CREATE INDEX idx_card_templates_name    ON card_templates(name);
CREATE INDEX idx_card_templates_variant ON card_templates(variant);

-- ── REGISTROS REAIS (2 templates — Bloco 3) ───────────────────────────────
--
-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ ID: 035097b0-4f3c-4ff3-aa54-79f0e14511b6                               │
-- │ name: 'Marketing Digital Cards'                                         │
-- │ columns_desktop: 1  columns_tablet: 1  columns_mobile: 1               │
-- │ gap: 'lg'                                                               │
-- │ has_filters: false   filters_position: null                             │
-- │ has_icon: false  has_title: true  has_subtitle: true                    │
-- │ has_media: true  has_link: false                                        │
-- │ media_opacity: 26   (mídia semi-transparente como background)           │
-- │ total_filtros: 0   total_cards: 1                                       │
-- └─────────────────────────────────────────────────────────────────────────┘
--
-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ ID: 404c526d-bf7a-4725-bee7-7b51ad17bd44                               │
-- │ name: 'Serviços BemDito'                                                │
-- │ columns_desktop: 3  columns_tablet: 2  columns_mobile: 1               │
-- │ gap: 'lg'                                                               │
-- │ has_filters: true   filters_position: 'top'                             │
-- │ has_icon: true   has_title: true  has_subtitle: true                    │
-- │ has_media: false  has_link: true                                        │
-- │ media_opacity: 100                                                      │
-- │ total_filtros: 4   total_cards: 6                                       │
-- └─────────────────────────────────────────────────────────────────────────┘

-- ═══════════════════════════════════════════════════════════════════════════
-- 5. CARD_FILTERS
-- Filtros / abas associados a um card_template.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE card_filters (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID    NOT NULL REFERENCES card_templates(id) ON DELETE CASCADE,
  label       TEXT    NOT NULL,         -- ⚠️ NÃO há coluna "name" — use "label"
  slug        TEXT,
  icon        TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (template_id, slug)
);
-- ⚠️  NÃO existe coluna "name" nem coluna "order" — use "label" e "order_index"

CREATE INDEX idx_card_filters_template_id ON card_filters(template_id);
CREATE INDEX idx_card_filters_order       ON card_filters(order_index);

-- ── REGISTROS REAIS (4 filtros — Bloco 4) ─────────────────────────────────
-- Todos pertencem ao template 'Serviços BemDito'
-- (template 'Marketing Digital Cards' não tem filtros)
--
-- id                                   label               slug               order_index
-- 812581a8-16ff-4a11-88aa-0308058e299f Todos               todos              0
-- d7e9c602-bd97-410b-8862-48b8bb42d9e5 Marketing Digital   marketing-digital  1
-- c7990418-168c-4bb0-9cc7-0cc4d56cccc7 Branding            branding           2
-- bdb2d654-29b3-4e6f-a178-7c70430681f8 Conteúdo            conteudo           3
--
-- ⚠️  Todos os registros têm icon = null

-- ═══════════════════════════════════════════════════════════════════════════
-- 6. TEMPLATE_CARDS
-- Cards individuais pertencentes a um template.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE template_cards (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id   UUID    NOT NULL REFERENCES card_templates(id) ON DELETE CASCADE,
  icon          TEXT,
  title         TEXT,
  subtitle      TEXT,
  media_url     TEXT,
  link_url      TEXT,
  link_type     TEXT    DEFAULT 'internal',
  filter_id     UUID    REFERENCES card_filters(id) ON DELETE SET NULL,
  filter_tags   TEXT[],                 -- Array de slugs de filtros adicionais
  order_index   INTEGER NOT NULL DEFAULT 0,   -- ⚠️ NÃO existe coluna "order"
  media_opacity INTEGER DEFAULT 100,          -- Opacidade da mídia (0-100%)
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
-- ⚠️  NÃO existe coluna "order" — use "order_index"
-- ⚠️  NÃO existe coluna "published" nesta tabela

CREATE INDEX idx_template_cards_template_id ON template_cards(template_id);
CREATE INDEX idx_template_cards_filter_id   ON template_cards(filter_id);
CREATE INDEX idx_template_cards_order       ON template_cards(order_index);

-- ── REGISTROS REAIS (7 cards — Bloco 5) ───────────────────────────────────
--
-- Template: Marketing Digital Cards (035097b0)
--   ef57406e  title='3.2 bilhões'
--             subtitle='de pessoas no mundo usam tecnologia de saúde digital diariamente'
--             icon=null  filter_id=null  order_index=0  media_opacity=50
--             media_url=Supabase signed URL (1770707396027-j5g359j.png)
--             link_url=null  link_type=internal
--
-- Template: Serviços BemDito (404c526d)
--   378a39cd  title='Gestão de Redes Sociais'
--             subtitle='Planejamento, criação e publicação de conteúdo estratégico...'
--             icon='Instagram'  filter_id=d7e9c602(Marketing Digital)
--             order_index=0  media_opacity=100  link_url=/servicos/gestao-redes-sociais
--
--   a6f21d5b  title='Tráfego Pago'
--             subtitle='Campanhas de anúncios pagos no Google Ads, Facebook Ads...'
--             icon='TrendingUp'  filter_id=d7e9c602(Marketing Digital)
--             order_index=1  media_opacity=100  link_url=/servicos/trafego-pago
--
--   fff1b463  title='SEO e Analytics'
--             subtitle='Otimização para mecanismos de busca e análise de dados...'
--             icon='BarChart3'  filter_id=d7e9c602(Marketing Digital)
--             order_index=2  media_opacity=100  link_url=/servicos/seo-analytics
--
--   ab20ea77  title='Identidade Visual'
--             subtitle='Criação de logotipo, paleta de cores e elementos gráficos...'
--             icon='Palette'  filter_id=c7990418(Branding)
--             order_index=3  media_opacity=100  link_url=/servicos/identidade-visual
--
--   0711c10a  title='Posicionamento'
--             subtitle='Estratégia de posicionamento de marca e proposta de valor...'
--             icon='Target'  filter_id=c7990418(Branding)
--             order_index=4  media_opacity=100  link_url=/servicos/posicionamento
--
--   ad44b584  title='Brand Book'
--             subtitle='Manual completo de aplicação da marca com todas as diretrizes...'
--             icon='BookOpen'  filter_id=c7990418(Branding)
--             order_index=5  media_opacity=100  link_url=/servicos/brand-book
--
-- ⚠️  Filtro 'bdb2d654 Conteúdo' existe mas não tem cards vinculados (total=0)
-- ⚠️  filter_tags = null em todos os 7 cards

-- ═══════════════════════════════════════════════════════════════════════════
-- 7. PAGES
-- Páginas do site público.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE pages (
  id               UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT    NOT NULL UNIQUE,
  name             TEXT    NOT NULL,
  title            TEXT    NOT NULL,
  meta_title       TEXT,
  meta_description TEXT,
  meta_keywords    TEXT,
  og_image         TEXT,
  published        BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
-- Registros reais (2):
--   '/'         → Página Inicial (published=true)  → 10 seções vinculadas
--   '/ajustes'  → Ajustes       (published=true)  →  0 seções vinculadas

CREATE UNIQUE INDEX pages_slug_key  ON pages(slug);
CREATE INDEX idx_pages_published    ON pages(published);

-- ── REGISTROS REAIS (2 páginas — Bloco 2) ─────────────────────────────────
-- id: d67a566d-0254-415b-9f79-729a5d8b1ca9
--   slug='/'   name='Página Inicial'  published=true  sections=10
--
-- id: 29ef27fd-25b7-4af4-bcc5-76b17c35c1a4
--   slug='/ajustes'  name='Ajustes'  published=true  sections=0

-- ═══════════════════════════════════════════════════════════════════════════
-- 8. SECTIONS
-- Seções reutilizáveis. Tipo único: 'unico'.
-- 4 colunas JSONB: config | layout | styling | elements
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE sections (
  id        UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  name      TEXT    NOT NULL,
  type      TEXT    NOT NULL DEFAULT 'unico',  -- Sempre 'unico' (sistema unificado)
  config    JSONB   NOT NULL DEFAULT '{}'::jsonb,
  elements  JSONB   NOT NULL DEFAULT '{}'::jsonb,
  layout    JSONB   NOT NULL DEFAULT '{}'::jsonb,
  styling   JSONB   NOT NULL DEFAULT '{}'::jsonb,
  global    BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices GIN para queries JSONB
CREATE INDEX idx_sections_elements  ON sections USING gin(elements);
CREATE INDEX idx_sections_layout    ON sections USING gin(layout);
CREATE INDEX idx_sections_styling   ON sections USING gin(styling);
CREATE INDEX idx_sections_type      ON sections(type);
CREATE INDEX idx_sections_global    ON sections(global);
CREATE INDEX idx_sections_published ON sections(published);

-- ── ESTRUTURA JSONB CONFIRMADA (Bloco 7) ──────────────────────────────────
--
-- config (campos reais extraídos):
-- {
--   "gridCols": "1" | "2",                    ← Número de colunas
--   "gridRows": "1" | "2",                    ← Número de linhas
--   "title": "...",                           ← Título principal
--   "subtitle": "...",
--   "smallTitle": "...",                      ← Chamada / minor title
--   "icon": "NomeLucide",
--   "iconColor": "UUID",
--   "mediaUrl": "https://...",
--   "cardTemplateId": "UUID",
--   "media": {
--     "fitMode": "cobrir"|"ajustada"|"contida"|"adaptada"|"alinhada",
--     "alignX": "left"|"center"|"right",     ← Obrigatório quando fitMode=alinhada
--     "alignY": "top"|"center"|"bottom"      ← Obrigatório quando fitMode=alinhada
--   },
--   "ctaButton": { "label": "...", "url": "/" },
--   "bgColor": "UUID",
--   "cards": { "alignY": "top"|"middle"|"bottom" }
-- }
--
-- layout (campos reais):
-- {
--   "desktop": {
--     "text":  "top-left"|"top-right"|"top-center"|"middle-left"|"middle-right"|
--              "bottom-left"|"bottom-right"|"bottom-center"|"center",
--     "media": "<mesmas opções>",    ← Opcional
--     "cards": "<mesmas opções>"     ← Opcional
--   }
-- }
-- ⚠️  Posições são STRINGS DIRETAS, não objetos {position: "..."}
--
-- styling (campos reais):
-- {
--   "height": "auto" | "50vh" | "100vh",
--   "bgColor": "UUID",
--   "spacing": {
--     "top":    "0px"|"25px"|"50px"|"75px"|"100px"|"125px"|"150px"|"175px"|"200px",
--     "bottom": "<mesmas opções>",
--     "left":   "<mesmas opções>",
--     "right":  "<mesmas opções>",
--     "gap":    "<mesmas opções>",   ← Gap entre colunas (padrão 50px)
--     "rowGap": "<mesmas opções>"    ← Gap entre linhas  (padrão 50px)
--   }
-- }
--
-- elements (campos reais):
-- {
--   "hasIcon":       boolean,
--   "hasMinorTitle": boolean,   ← Chamada
--   "hasMainTitle":  boolean,
--   "hasSubtitle":   boolean,
--   "hasButton":     boolean,
--   "hasMedia":      boolean,
--   "hasCards":      boolean,
--   "hasContainer":  boolean,
--   "cardCount":     number,
--   "mediaType":     "image"|"video"|null
-- }

-- ── SEÇÕES REAIS COMPLETAS (10 seções — Bloco 1) ─────────────────────────
-- Todas: type='unico', global=true, published=true
--
-- ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
-- │ order │ id (abrev.)  │ name                     │ cols │ rows │ pos_text    │ pos_media    │ pos_cards    │ height │ media │
-- ├───────┼──────────────┼──────────────────────────┼──────┼──────┼─────────────┼──────────────┼──────────────┼────────┼───────┤
-- │  0    │ 1379d0af     │ Seção Inicial - Home      │  2   │  2   │ top-center  │ null         │ null         │ 100vh  │ false │
-- │  1    │ 667ab5d5     │ Prazer, somos a BemDito!  │  2   │  2   │ middle-left │ middle-right │ null         │ 50vh   │ true  │
-- │  2    │ 1b43c00d     │ Marketing Digital         │  2   │  2   │ middle-left │ null         │ middle-right │ 100vh  │ false │
-- │  3    │ e735eafe     │ Monte seu Projeto         │  2   │  2   │ top-left    │ top-right    │ bottom-center│ auto   │ true  │
-- │  4    │ d7dbc95a     │ Melhores Profissionais    │  1   │  2   │ top-center  │ bottom-center│ null         │ auto   │ true  │
-- │  5    │ c337eba8     │ Como funciona?            │  1   │  2   │ top-left    │ top-center   │ bottom-center│ auto   │ false │
-- │  6    │ c4865f37     │ APP                       │  2   │  2   │ top-left    │ top-right    │ bottom-center│ auto   │ true  │
-- │  7    │ 236b82f8     │ Portfólio                 │  1   │  2   │ top-left    │ top-center   │ bottom-center│ auto   │ false │
-- │  8    │ 5f40ff6b     │ Orçamento                 │  1   │  1   │ top-left    │ null         │ null         │ auto   │ false │
-- │  9    │ eb77f650     │ Blog                      │  1   │  2   │ middle-left │ null         │ null         │ auto   │ false │
-- └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
--
-- DETALHES DE SPACING (pad_top / pad_bot / pad_left / pad_right / col_gap / row_gap):
--   Seção Inicial - Home:    50/50/50/50/50/null
--   Prazer, somos a BemDito: 0/0/50/0/50/null   ← padding assimétrico
--   Marketing Digital:       50/50/50/50/50/null
--   Monte seu Projeto:       50/50/50/50/50/100px ← rowGap=100px
--   Melhores Profissionais:  50/0/0/0/0/null    ← sem bordas laterais/bottom
--   Como funciona?:          50/50/50/50/50/null
--   APP:                     50/50/50/50/50/null
--   Portfólio:               50/50/50/50/50/null
--   Orçamento:               50/50/50/50/50/null
--   Blog:                    50/50/50/50/50/null
--
-- MEDIA fitMode confirmados:
--   667ab5d5 (Prazer)          → fitMode='contain'   alignX='right'   alignY='bottom'
--   d7dbc95a (Melhores Prof.)  → fitMode='cover'     alignX='center'  alignY='bottom'
--   e735eafe (Monte Projeto)   → fitMode='adaptada'  alignX=null      alignY=null
--   c4865f37 (APP)             → fitMode='adaptada'  alignX=null      alignY=null
-- ⚠️  Blog (eb77f650): pos_media=null mas no Bloco 7 aparece 'middle-left' (pos_texto)
--    — seção sem mídia nem cards, apenas texto no lado esquerdo

-- ═══════════════════════════════════════════════════════════════════════════
-- 9. PAGE_SECTIONS
-- Vínculo N:N entre páginas e seções (define ordem e config local).
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE page_sections (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id     UUID    NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  section_id  UUID    NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  config      JSONB   NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_sections_page_id     ON page_sections(page_id);
CREATE INDEX idx_page_sections_section_id  ON page_sections(section_id);
CREATE INDEX idx_page_sections_order       ON page_sections(order_index);
CREATE INDEX idx_page_sections_order_index ON page_sections(page_id, order_index);

-- ═══════════════════════════════════════════════════════════════════════════
-- 10. SECTION_TEMPLATE_CARDS
-- Vínculo seção ↔ card_template (qual template de cards esta seção usa).
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE section_template_cards (
  section_id  UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES card_templates(id) ON DELETE CASCADE,
  UNIQUE (section_id, template_id)
);
-- ⚠️  0 registros reais — vínculo feito via config->>'cardTemplateId'

CREATE INDEX idx_section_template_cards_section_id  ON section_template_cards(section_id);
CREATE INDEX idx_section_template_cards_template_id ON section_template_cards(template_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- 11. PAGE_VERSIONS
-- Histórico de versões de páginas (181 registros reais).
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE page_versions (
  id             UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id        UUID    NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  data           JSONB   NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  created_by     UUID,
  restore_point  BOOLEAN DEFAULT false,
  UNIQUE (page_id, version_number)
);

CREATE INDEX idx_page_versions_page_id    ON page_versions(page_id);
CREATE INDEX idx_page_versions_created_at ON page_versions(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- 12. SECTION_VERSIONS
-- Histórico de versões de seções (0 registros — não ativado ainda).
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE section_versions (
  id             UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id     UUID    NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  data           JSONB   NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  created_by     UUID,
  restore_point  BOOLEAN DEFAULT false,
  UNIQUE (section_id, version_number)
);

CREATE INDEX idx_section_versions_section_id  ON section_versions(section_id);
CREATE INDEX idx_section_versions_created_at  ON section_versions(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- 13. SITE_CONFIG (Singleton)
-- Configuração global do site (header, logo, CTA).
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE site_config (
  id         UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  header     JSONB   DEFAULT '{}'::jsonb,
  footer     JSONB   DEFAULT '{}'::jsonb,
  published  BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── REGISTRO REAL (1 linha — 2026-02-19) ──────────────────────────────────
-- id: c8af658c-d9b9-4267-9caa-4e7a4f7cb1ce
-- published: true
--
-- header:
-- {
--   "sticky": true,
--   "logo": {
--     "alt":  "BemDito",
--     "link": "/",
--     "url":  "https://fxutnvoaygzvseubiytf.supabase.co/storage/v1/object/public/make-72da2481-media/media/1770461868042-g34eri.png"
--   },
--   "cta": {
--     "label": "Orçamento em 3, 2, 1",
--     "icon":  "Link",
--     "url":   "/contato"
--   },
--   "menu_items": [                        ← ⚠️ Hardcoded! Não referencia tabela menu_items
--     { "id":"menu-1", "url":"/",          "icon":"Heart",         "label":"Muito prazer!",          "has_dropdown":false },
--     { "id":"menu-2", "url":"/tendencias","icon":"TrendingUp",    "label":"Tendências e inspiração", "has_dropdown":true  },
--     { "id":"menu-3", "url":"/contato",   "icon":"MessageCircle", "label":"Chama a gente",           "has_dropdown":true  },
--     { "id":"menu-4", "url":"/ajustes",   "icon":"Settings",      "label":"Ajustes",                "has_dropdown":false }
--   ]
-- }
--
-- footer (DIFERENTE de footer_config.config — veja ⚠️ abaixo):
-- {
--   "social":    [{ "url":"https://instagram.com/bemdito", ... }, { "url":"https://linkedin.com/company/bemdito", ... }],
--   "columns":   [{ "title":"BemDito", "links":[...] }, { "title":"BemDito", ... }, { "title":"BemDito", ... }],
--   "copyright": "© 2026 BemDito. Todos os direitos reservados."
-- }
--
-- ⚠️  DISCREPÂNCIA CONFIRMADA:
--   site_config.header.menu_items ≠ tabela menu_items (hardcoded, 4 itens ligeiramente diferentes)
--   site_config.footer ≠ footer_config.config (estruturas diferentes — 3 colunas "BemDito" vs 2 colunas "Empresa/Recursos")
--   O footer_manager usa footer_config. O site usa site_config ou footer_config dependendo do componente Footer.

-- ═══════════════════════════════════════════════════════════════════════════
-- 14. FOOTER_CONFIG (Singleton)
-- Configuração do rodapé do site — fonte primária do footer_manager.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE footer_config (
  id         UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  config     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_footer_config_config ON footer_config USING gin(config);

-- ── REGISTRO REAL (1 linha — atualizado 2026-02-07) ───────────────────────
-- id: 9c1054ca-ce27-48f6-8718-88aed69340c6
-- updated_at: 2026-02-07 08:40:53.189157+00
--
-- config:
-- {
--   "social": [
--     { "platform": "facebook",  "url": "https://facebook.com/bemdito",  "icon": "Facebook"  },
--     { "platform": "instagram", "url": "https://instagram.com/bemdito", "icon": "Instagram" }
--   ],
--   "columns": [
--     {
--       "id": "col1",
--       "title": "Empresa",
--       "links": [
--         { "url": "/sobre",   "icon": "Info",     "label": "Sobre Nós" },
--         { "url": "/contato", "icon": "Mail",      "label": "Contato"   }
--       ]
--     },
--     {
--       "id": "col2",
--       "title": "Recursos",
--       "links": [
--         { "url": "/blog",    "icon": "BookOpen",  "label": "Blog"      }
--       ]
--     }
--   ],
--   "copyright": "© 2026 BemDito. Todos os direitos reservados."
-- }

-- ═══════════════════════════════════════════════════════════════════════════
-- 15. MEDIA_ASSETS
-- Biblioteca de mídias uploadadas (0 registros — gerenciado pelo bucket).
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE media_assets (
  id                UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename          TEXT    NOT NULL,
  original_filename TEXT    NOT NULL,
  mime_type         TEXT    NOT NULL,
  size_bytes        BIGINT  NOT NULL,
  storage_path      TEXT    NOT NULL,
  public_url        TEXT    NOT NULL,
  width             INTEGER,
  height            INTEGER,
  alt_text          TEXT,
  caption           TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  created_by        UUID,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_assets_mime_type   ON media_assets(mime_type);
CREATE INDEX idx_media_assets_created_at  ON media_assets(created_at DESC);
CREATE INDEX idx_media_assets_created_by  ON media_assets(created_by);

-- ═══════════════════════════════════════════════════════════════════════════
-- 16. KV_STORE_72DA2481
-- Chave-valor genérica (gerenciado pelo sistema Figma Make).
-- ⚠️  NÃO modificar estrutura desta tabela.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE kv_store_72da2481 (
  key   TEXT  PRIMARY KEY,
  value JSONB NOT NULL
);

CREATE INDEX kv_store_72da2481_key_idx ON kv_store_72da2481(key text_pattern_ops);

-- ═══════════════════════════════════════════════════════════════════════════
-- 17. STORAGE BUCKET
-- ═══════════════════════════════════════════════════════════════════════════
-- Bucket: make-72da2481-media (PRIVADO)
-- Conteúdo real (11 arquivos, todos image/png ou image/jpeg):
--   media/1771288519083-nju5arp.png  (419225 bytes)  2026-02-17
--   media/1771284250268-qdgzddz.png  (419225 bytes)  2026-02-16
--   media/1770763484224-b79m3c.png   (419225 bytes)  2026-02-10
--   media/1770760317082-52kpro.png   (133575 bytes)  2026-02-10
--   media/1770717650429-1z6yj9.png   (133575 bytes)  2026-02-10
--   media/1770711267061-6w0xtk.png   (419225 bytes)  2026-02-10
--   media/1770709114943-megqr4.jpg   (228016 bytes)  2026-02-10
--   media/1770708905354-4folil.png   (419225 bytes)  2026-02-10
--   media/1770708855744-ge4cq5.png   (133575 bytes)  2026-02-10
--   media/1770707396027-j5g359j.png  (419225 bytes)  2026-02-10
--   media/1770706158704-ta1go8a.png  (6543 bytes)    2026-02-10
--
-- Nomenclatura: {timestamp_ms}-{random_6chars}.{ext}
-- Signed URLs com validade de 1 ano

-- ═══════════════════════════════════════════════════════════════════════════
-- 18. VIEWS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW v_database_stats AS
SELECT 'design_tokens'          AS tabela, COUNT(*) AS total FROM design_tokens UNION ALL
SELECT 'menu_cards',                        COUNT(*) FROM menu_cards             UNION ALL
SELECT 'menu_items',                        COUNT(*) FROM menu_items             UNION ALL
SELECT 'pages',                             COUNT(*) FROM pages                  UNION ALL
SELECT 'sections',                          COUNT(*) FROM sections               UNION ALL
SELECT 'page_sections',                     COUNT(*) FROM page_sections          UNION ALL
SELECT 'page_versions',                     COUNT(*) FROM page_versions          UNION ALL
SELECT 'section_versions',                  COUNT(*) FROM section_versions       UNION ALL
SELECT 'card_templates',                    COUNT(*) FROM card_templates         UNION ALL
SELECT 'card_filters',                      COUNT(*) FROM card_filters           UNION ALL
SELECT 'template_cards',                    COUNT(*) FROM template_cards         UNION ALL
SELECT 'section_template_cards',            COUNT(*) FROM section_template_cards UNION ALL
SELECT 'site_config',                       COUNT(*) FROM site_config            UNION ALL
SELECT 'footer_config',                     COUNT(*) FROM footer_config          UNION ALL
SELECT 'media_assets',                      COUNT(*) FROM media_assets
ORDER BY tabela;

CREATE OR REPLACE VIEW v_pages_with_sections AS
SELECT
  p.id           AS page_id,
  p.name         AS page_name,
  p.slug,
  p.published    AS page_published,
  COUNT(ps.id)   AS sections_count,
  ARRAY_AGG(s.name ORDER BY ps.order_index) FILTER (WHERE s.name IS NOT NULL) AS section_names
FROM pages p
LEFT JOIN page_sections ps ON ps.page_id = p.id
LEFT JOIN sections s       ON s.id = ps.section_id
GROUP BY p.id, p.name, p.slug, p.published
ORDER BY p.slug;

CREATE OR REPLACE VIEW v_orphan_sections AS
SELECT s.id, s.name, s.type, s.global, s.published, s.created_at
FROM sections s
WHERE NOT EXISTS (
  SELECT 1 FROM page_sections ps WHERE ps.section_id = s.id
)
AND s.global = false
ORDER BY s.created_at DESC;

-- ── VIEW v_database_stats — resultado real (2026-02-19 Bloco 8) ───────────
-- table_name        total_records
-- card_filters      4
-- card_templates    2
-- design_tokens     38
-- menu_cards        22
-- menu_items        4
-- page_sections     10
-- pages             2
-- sections          10
-- template_cards    7
-- (footer_config, page_versions, section_template_cards, section_versions,
--  site_config, media_assets não aparecem na view — omitidos ou zero)

-- ═══════════════════════════════════════════════════════════════════════════
-- 19. TRIGGERS (updated_at automático)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_design_tokens_updated_at    BEFORE UPDATE ON design_tokens    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at       BEFORE UPDATE ON menu_items       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_cards_updated_at       BEFORE UPDATE ON menu_cards       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_card_templates_updated_at   BEFORE UPDATE ON card_templates   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at            BEFORE UPDATE ON pages            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sections_updated_at         BEFORE UPDATE ON sections         FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_config_updated_at      BEFORE UPDATE ON site_config      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_config_updated_at    BEFORE UPDATE ON footer_config    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_assets_updated_at     BEFORE UPDATE ON media_assets     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_template_cards_updated_at   BEFORE UPDATE ON template_cards   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- 20. FUNÇÕES UTILITÁRIAS
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION get_next_page_version_number(p_page_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE((SELECT MAX(version_number) FROM page_versions WHERE page_id = p_page_id), 0) + 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_next_section_version_number(p_section_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE((SELECT MAX(version_number) FROM section_versions WHERE section_id = p_section_id), 0) + 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cleanup_old_versions(keep_last INTEGER DEFAULT 10)
RETURNS void AS $$
BEGIN
  DELETE FROM page_versions
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY page_id ORDER BY created_at DESC) AS rn
      FROM page_versions WHERE restore_point = false
    ) sub WHERE rn > keep_last
  );
  DELETE FROM section_versions
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY section_id ORDER BY created_at DESC) AS rn
      FROM section_versions WHERE restore_point = false
    ) sub WHERE rn > keep_last
  );
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════
-- 21. FOREIGN KEYS — RESUMO COMPLETO (31 FKs confirmadas via Bloco 4)
-- ═══════════════════════════════════════════════════════════════════════════
-- card_filters.template_id          → card_templates.id   CASCADE
-- card_templates.card_bg_color_token → design_tokens.id   SET NULL
-- card_templates.card_border_color_token → design_tokens.id SET NULL
-- card_templates.filter_active_bg_color_token → design_tokens.id SET NULL
-- card_templates.filter_active_text_color_token → design_tokens.id SET NULL
-- card_templates.filter_button_bg_color_token → design_tokens.id SET NULL
-- card_templates.filter_button_text_color_token → design_tokens.id SET NULL
-- card_templates.icon_color_token    → design_tokens.id   SET NULL
-- card_templates.link_text_color_token → design_tokens.id SET NULL
-- card_templates.subtitle_color_token → design_tokens.id  SET NULL
-- card_templates.subtitle_font_size  → design_tokens.id   SET NULL
-- card_templates.title_color_token   → design_tokens.id   SET NULL
-- card_templates.title_font_size     → design_tokens.id   SET NULL
-- menu_cards.bg_color_token          → design_tokens.id   SET NULL
-- menu_cards.border_color_token      → design_tokens.id   SET NULL
-- menu_cards.icon_color_token        → design_tokens.id   SET NULL
-- menu_cards.subtitle_color_token    → design_tokens.id   SET NULL
-- menu_cards.subtitle_font_size      → design_tokens.id   SET NULL
-- menu_cards.tab_bg_color_token      → design_tokens.id   SET NULL
-- menu_cards.tab_border_color_token  → design_tokens.id   SET NULL
-- menu_cards.title_color_token       → design_tokens.id   SET NULL
-- menu_cards.title_font_size         → design_tokens.id   SET NULL
-- menu_items.label_color_token       → design_tokens.id   SET NULL
-- page_sections.page_id              → pages.id           CASCADE
-- page_sections.section_id           → sections.id        CASCADE
-- page_versions.page_id              → pages.id           CASCADE
-- section_template_cards.section_id  → sections.id        CASCADE
-- section_template_cards.template_id → card_templates.id  CASCADE
-- section_versions.section_id        → sections.id        CASCADE
-- template_cards.filter_id           → card_filters.id    SET NULL
-- template_cards.template_id         → card_templates.id  CASCADE

-- ═══════════════════════════════════════════════════════════════════════════
-- 22. ERROS CONHECIDOS — COLUNAS QUE NÃO EXISTEM
--     (confirmados via information_schema em 2026-02-19)
-- ═══════════════════════════════════════════════════════════════════════════
-- ❌ card_templates.display_mode  → não existe  (usar columns_desktop/tablet/mobile)
-- ❌ card_templates.cols          → não existe  (usar columns_desktop)
-- ❌ card_filters.name            → não existe  (usar card_filters.label)
-- ❌ template_cards.order         → não existe  (usar template_cards.order_index)
-- ❌ template_cards.published     → não existe
--
-- ── TABELAS QUE NÃO EXISTEM (referenciadas em arquivos desatualizados) ────
-- ❌ cards                  → removida/nunca criada; usar template_cards
-- ❌ section_cards          → removida; usar section_template_cards
-- ❌ section_templates      → não existe
-- ❌ page_sections_old      → não existe (backup antigo)
-- ❌ design_tokens_backup   → não existe no schema público
-- ❌ dt_count, ma_count, mc_count, mi_count, p_count, s_count → não existem

-- ═══════════════════════════════════════════════════════════════════════════
-- FIM DO SCHEMA OFICIAL V2.0
-- ═══════════════════════════════════════════════════════════════════════════