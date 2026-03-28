-- ═══════════════════════════════════════════════════════════════════════════
-- 🗄️  SCHEMA OFICIAL V3.0 — BemDito CMS
-- ═══════════════════════════════════════════════════════════════════════════
-- Data:      2026-02-19 (pós-auditoria Blocos 1-14 + aplicação de correções V3.0)
-- Baseado em: SCHEMA_OFICIAL_V2.0.sql + /migrations/2026-02-19_v3.0_corrections.sql
-- Plataforma: Supabase (PostgreSQL 15+)
--
-- ⚠️  ARQUIVO SOMENTE LEITURA — NÃO EDITAR DIRETAMENTE
--     Para atualizar: execute migration → re-execute QUERIES_AUDITORIA_V3.sql
--     → crie SCHEMA_OFICIAL_V4.0.sql
--
-- 📊 Estatísticas confirmadas (2026-02-19 pós-V3.0):
--   card_filters=4, card_templates=2, design_tokens=37 (38 se test-token mantido)
--   footer_config=1, media_assets=0, menu_cards=22, menu_items=4
--   page_sections=10, page_versions=181, pages=2
--   section_template_cards=0, section_versions=0, sections=10
--   site_config=1, template_cards=7
--   kv_store_72da2481 = (sistema Figma Make — não auditado)
--
-- 🏗️  Arquitetura confirmada:
--   16 tabelas BASE TABLE + 3 VIEWs
--   31 foreign keys
--   47 índices (inclui sections_pkey1 + 5 duplicatas kv_store — não remover)
--   8 funções
--   10 triggers (pós-V3.0 — trigger órfã de section_template_cards removida)
--
-- ✅ Diagnóstico de integridade (todos limpos):
--   14a. Posições como objetos:  0 ✅
--   14b. gridCols/Rows em layout: 0 ✅
--   14c. Seção em >1 página:     0 ✅
--   14d. Cards sem template:     0 ✅
--   14e. page_sections órfãs:    0 ✅
--
-- 🔄 Mudanças de V2.0 para V3.0:
--   [A] Garbage text "JJJJJ" removido do card "Carreiras" (menu_cards)
--   [B] Trigger órfã update_section_template_cards_updated_at removida
--   [C] test-token em design_tokens (remoção opcional — pendente)
--   [D] fitMode corrigido: 'cover'→'cobrir', 'contain'→'alinhada'
--   [E] Typo "BemDitoo"→"BemDito" em site_config.footer (opcional)
--   [F] v_database_stats recriada com subquery para ORDER BY funcionar
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. DESIGN_TOKENS (38 registros — 37 se test-token removido)
-- Tokens centralizados: color(8), typography(12), spacing(6), radius(7), transition(5)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE design_tokens (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  category    TEXT        NOT NULL,   -- 'color'|'typography'|'spacing'|'radius'|'transition'
  name        TEXT        NOT NULL,
  value       JSONB       NOT NULL,
  label       TEXT        NOT NULL,
  "order"     INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (category, name)
);
CREATE INDEX idx_design_tokens_category       ON design_tokens(category);
CREATE INDEX idx_design_tokens_category_order ON design_tokens(category, "order");

-- DATA REAL confirmada (2026-02-19):
-- CORES: primary=#ea526e, secondary=#2e2240, background=#f6f6f6,
--        accent=#ed9331, muted=#e7e8e8, dark=#020105,
--        purple-dark=#2e2240, test-token=#000000 (⚠️ dado de teste)
-- TIPOGRAFIA (ordem real por "order"):
--   1=body(1rem/400), 2=font-family(1.15rem/400), 3=heading-medium(3rem/700)
--   4=body-base(1rem/400), 5=main-title(6rem/700), 6=menu(0.875rem/500)
--   7=minor-title(1.1rem/600), 8=subtitle(1.3rem/500), 10=body-small(0.875rem/400)
--   999=button-text(1rem/500), 999=card-menu-title(1.2rem/600),
--       999=megamenu-title(2.15rem/800)
-- RADIUS: none=0, sm=0.25rem, md=0.5rem, lg=0.75rem, xl=1rem, 2xl=1.5rem, full=9999px
-- SPACING: xs=0.5rem, sm=1rem, md=1.5rem, lg=2rem, xl=3rem, 2xl=4rem
-- TRANSITION: fast=150ms, normal=300ms, slow=500ms,
--             smooth=400ms/cubic-bezier(0.4,0,0.2,1),
--             bounce=300ms/cubic-bezier(0.68,-0.55,0.265,1.55)


-- ═══════════════════════════════════════════════════════════════════════════
-- 2. MENU_CARDS (22 registros, 24 colunas)
-- Cards reutilizáveis exibidos nos megamenus do header
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE menu_cards (
  id                    UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT  NOT NULL,
  bg_color_token        UUID  REFERENCES design_tokens(id) ON DELETE SET NULL,
  border_color_token    UUID  REFERENCES design_tokens(id) ON DELETE SET NULL,
  icon                  TEXT,
  icon_color_token      UUID  REFERENCES design_tokens(id) ON DELETE SET NULL,
  title                 TEXT,
  title_color_token     UUID  REFERENCES design_tokens(id) ON DELETE SET NULL,
  subtitle              TEXT,
  subtitle_color_token  UUID  REFERENCES design_tokens(id) ON DELETE SET NULL,
  url                   TEXT,
  url_type              TEXT,                         -- 'internal' | 'external'
  tabs                  JSONB       DEFAULT '[]'::jsonb,
  active_tab_id         TEXT,
  tab_bg_color_token    UUID  REFERENCES design_tokens(id) ON DELETE SET NULL,
  tab_border_color_token UUID REFERENCES design_tokens(id) ON DELETE SET NULL,
  is_global             BOOLEAN     DEFAULT false,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  icon_size             INTEGER     DEFAULT 28,       -- pos 20
  title_font_size       UUID  REFERENCES design_tokens(id) ON DELETE SET NULL, -- pos 21
  title_font_weight     INTEGER     DEFAULT 600,      -- pos 22
  subtitle_font_size    UUID  REFERENCES design_tokens(id) ON DELETE SET NULL, -- pos 23 ✅ confirmado
  subtitle_font_weight  INTEGER     DEFAULT 400       -- pos 24 ✅ confirmado
);
CREATE INDEX idx_menu_cards_is_global  ON menu_cards(is_global);
CREATE INDEX idx_menu_cards_active_tab ON menu_cards(active_tab_id);

-- DATA REAL: 22 cards (todos is_global=true), IDs começando em 11111111/22222222/33333333/44444444/55555555
-- ⚠️ V3.0: subtitle do card "Carreiras" (44444444-4444-4444-4444-444444444443)
--           corrigido de "...expertsJJJJJ" para "...experts"


-- ═══════════════════════════════════════════════════════════════════════════
-- 3. MENU_ITEMS (4 registros)
-- Itens do header principal com configuração de megamenu
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE menu_items (
  id              UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  label           TEXT    NOT NULL,
  label_color_token UUID  REFERENCES design_tokens(id) ON DELETE SET NULL,
  icon            TEXT,
  "order"         INTEGER NOT NULL DEFAULT 0,
  megamenu_config JSONB   DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_menu_items_order ON menu_items("order");

-- DATA REAL (ordem 0-3):
--   0: dddddddd "Muito prazer!"           Heart    bg=#f7c7a6 media_pos=right 1 coluna
--   1: cccccccc "Tendências e Inspiração" BookOpen bg=#e5d4d4 media_pos=left  1 coluna
--   2: bbbbbbbb "Chama a gente!"          ThumbsUp bg=#e5d4d4 media_pos=left  2 colunas
--   3: 5892d326 "Ajustes"                 Settings bg=#e5d4d4 media_pos=left  1 coluna
-- ⚠️ DISCREPÂNCIA: site_config.header.menu_items tem 4 itens hardcoded com labels
--    e IDs diferentes (menu-1..4). O header usa tabela menu_items, não site_config.


-- ═══════════════════════════════════════════════════════════════════════════
-- 4. PAGES (2 registros, 12 colunas — posição ordinal 6 ausente: coluna deletada)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE pages (
  id               UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),  -- pos 1
  slug             TEXT    NOT NULL UNIQUE,                          -- pos 2
  title            TEXT,                                             -- pos 3
  meta_title       TEXT,                                             -- pos 4
  meta_description TEXT,                                             -- pos 5
  -- posição 6 ausente (coluna deletada no passado — gap normal no PostgreSQL)
  created_at       TIMESTAMPTZ DEFAULT NOW(),                        -- pos 7
  updated_at       TIMESTAMPTZ DEFAULT NOW(),                        -- pos 8
  published        BOOLEAN DEFAULT false,                            -- pos 9
  name             TEXT    NOT NULL,                                  -- pos 10
  meta_keywords    TEXT,                                             -- pos 11
  og_image         TEXT                                              -- pos 12
);
CREATE INDEX idx_pages_published ON pages(published);


-- ═══════════════════════════════════════════════════════════════════════════
-- 5. SECTIONS (10 registros, 11 colunas)
-- Seções reutilizáveis — TODAS do tipo 'unico', global=true, published=true
-- 4 colunas JSONB: config, elements, layout, styling
-- ⚠️ elements, layout, styling são NULLABLE (is_nullable=YES) mas sempre presentes
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE sections (
  id        UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),  -- pos 1
  name      TEXT    NOT NULL,                                -- pos 2
  type      TEXT    NOT NULL,                                -- pos 3: sempre 'unico'
  config    JSONB   NOT NULL DEFAULT '{}'::jsonb,            -- pos 4
  global    BOOLEAN DEFAULT false,                           -- pos 5
  published BOOLEAN DEFAULT false,                           -- pos 6
  created_at  TIMESTAMPTZ DEFAULT NOW(),                     -- pos 7
  updated_at  TIMESTAMPTZ DEFAULT NOW(),                     -- pos 8
  elements  JSONB DEFAULT '{}'::jsonb,                       -- pos 9  ← NULLABLE
  layout    JSONB DEFAULT '{}'::jsonb,                       -- pos 10 ← NULLABLE
  styling   JSONB DEFAULT '{}'::jsonb                        -- pos 11 ← NULLABLE
);
CREATE INDEX idx_sections_type      ON sections(type);
CREATE INDEX idx_sections_global    ON sections(global);
CREATE INDEX idx_sections_published ON sections(published);
CREATE INDEX idx_sections_elements  ON sections USING gin(elements);
CREATE INDEX idx_sections_layout    ON sections USING gin(layout);
CREATE INDEX idx_sections_styling   ON sections USING gin(styling);

-- DATA REAL (ordem da Home page, confirmado 2026-02-19):
-- order | id       | name                     | cols×rows | height | media | cards | fitMode
--   0   | 1379d0af | Seção Inicial - Home     | 2×2       | 100vh  | ✗     | ✗     | —
--   1   | 667ab5d5 | Prazer, somos a BemDito! | 2×2       | 50vh   | ✓     | ✗     | alinhada (V3.0: corrigido de 'contain')
--   2   | 1b43c00d | Marketing Digital        | 2×2       | 100vh  | ✗     | ✓     | — (template 035097b0)
--   3   | e735eafe | Monte seu Projeto        | 2×2       | auto   | ✓     | ✓     | adaptada (template 404c526d)
--   4   | d7dbc95a | Melhores Profissionais   | 1×2       | auto   | ✓     | ✗     | cobrir (V3.0: corrigido de 'cover')
--   5   | c337eba8 | Como funciona?           | 1×2       | auto   | ✗     | ✗     | —
--   6   | c4865f37 | APP                      | 2×2       | auto   | ✓     | ✓     | adaptada (template 404c526d)
--   7   | 236b82f8 | Portfólio                | 1×2       | auto   | ✗     | ✗     | —
--   8   | 5f40ff6b | Orçamento                | 1×1       | auto   | ✗     | ✗     | — (template 035097b0 armazenado, hasCards=false)
--   9   | eb77f650 | Blog                     | 1×2       | auto   | ✗     | ✗     | — (template 404c526d armazenado, hasCards=false)
--
-- POSIÇÕES DO LAYOUT (todas confirmadas como strings — 14a ✅):
-- Seção Inicial   : text=top-center
-- Prazer BemDito  : text=middle-left, media=middle-right
-- Marketing Dig.  : text=middle-left, cards=middle-right
-- Monte Projeto   : text=top-left, media=top-right, cards=bottom-center
-- Melhores Prof.  : text=top-center, media=bottom-center
-- Como funciona?  : text=top-left, media=top-center, cards=bottom-center
-- APP             : text=top-left, media=top-right, cards=bottom-center
-- Portfólio       : text=top-left, media=top-center, cards=bottom-center
-- Orçamento       : text=top-left
-- Blog            : text=middle-left
--
-- SPACING (todos os campos = '50px' como padrão, exceções abaixo):
-- Prazer BemDito: top=0px, bottom=0px, right=0px  (media cola nas bordas)
-- Melhores Prof.: bottom=0px, left=0px, right=0px, gap=0px
-- Monte Projeto : rowGap=100px (único com rowGap configurado)


-- ═══════════════════════════════════════════════════════════════════════════
-- 6. PAGE_SECTIONS (10 registros, 5 colunas — config foi DROPADA)
-- Vínculo página ↔ seção com ordem
-- ⚠️ posição ordinal 4 ausente (coluna config deletada — NÃO usar em queries)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE page_sections (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),  -- pos 1
  page_id     UUID    NOT NULL REFERENCES pages(id) ON DELETE CASCADE,    -- pos 2
  section_id  UUID    NOT NULL REFERENCES sections(id) ON DELETE CASCADE, -- pos 3
  -- posição 4 ausente: config foi dropada
  order_index INTEGER NOT NULL DEFAULT 0,                       -- pos 5
  created_at  TIMESTAMPTZ DEFAULT NOW()                         -- pos 6
);
CREATE INDEX idx_page_sections_page_id    ON page_sections(page_id);
CREATE INDEX idx_page_sections_section_id ON page_sections(section_id);
CREATE INDEX idx_page_sections_order      ON page_sections(order_index);
CREATE INDEX idx_page_sections_order_index ON page_sections(page_id, order_index);


-- ═══════════════════════════════════════════════════════════════════════════
-- 7. CARD_TEMPLATES (2 registros, 43 colunas)
-- ⚠️ NÃO EXISTEM: display_mode, cols (use columns_desktop/tablet/mobile)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE card_templates (
  id                             UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),  -- 1
  name                           TEXT    NOT NULL,                                -- 2
  variant                        TEXT,                                            -- 3
  config                         JSONB   NOT NULL DEFAULT '{}'::jsonb,           -- 4
  is_global                      BOOLEAN DEFAULT false,                           -- 5
  created_at                     TIMESTAMPTZ DEFAULT NOW(),                       -- 6
  updated_at                     TIMESTAMPTZ DEFAULT NOW(),                       -- 7
  columns_desktop                INTEGER DEFAULT 3,                               -- 8  ← NÃO é 'cols'
  columns_tablet                 INTEGER DEFAULT 2,                               -- 9
  columns_mobile                 INTEGER DEFAULT 1,                               -- 10
  gap                            TEXT    DEFAULT 'md',                            -- 11
  card_bg_color_token            UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 12
  card_border_color_token        UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 13
  card_border_radius             TEXT    DEFAULT '2xl',                           -- 14
  card_padding                   TEXT    DEFAULT 'md',                            -- 15
  card_shadow                    TEXT    DEFAULT 'md',                            -- 16
  has_icon                       BOOLEAN DEFAULT true,                            -- 17
  icon_size                      INTEGER DEFAULT 32,                              -- 18
  icon_color_token               UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 19
  icon_position                  TEXT    DEFAULT 'top',                           -- 20
  has_title                      BOOLEAN DEFAULT true,                            -- 21
  title_font_size                UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 22
  title_font_weight              INTEGER DEFAULT 600,                             -- 23
  title_color_token              UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 24
  has_subtitle                   BOOLEAN DEFAULT true,                            -- 25
  subtitle_font_size             UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 26
  subtitle_font_weight           INTEGER DEFAULT 400,                             -- 27
  subtitle_color_token           UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 28
  has_media                      BOOLEAN DEFAULT false,                           -- 29
  media_position                 TEXT    DEFAULT 'top',                           -- 30
  media_aspect_ratio             TEXT    DEFAULT '16/9',                          -- 31
  media_border_radius            TEXT    DEFAULT '2xl',                           -- 32
  has_link                       BOOLEAN DEFAULT true,                            -- 33
  link_style                     TEXT    DEFAULT 'card',                          -- 34
  link_text_color_token          UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 35
  has_filters                    BOOLEAN DEFAULT false,                           -- 36
  filters_position               TEXT    DEFAULT 'top',                           -- 37
  filter_button_bg_color_token   UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 38
  filter_button_text_color_token UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 39
  filter_active_bg_color_token   UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 40
  filter_active_text_color_token UUID    REFERENCES design_tokens(id) ON DELETE SET NULL, -- 41
  example_media_url              TEXT,                                            -- 42
  media_opacity                  INTEGER DEFAULT 100                              -- 43
    CONSTRAINT media_opacity_range CHECK (media_opacity >= 0 AND media_opacity <= 100)
);
CREATE INDEX idx_card_templates_name    ON card_templates(name);
CREATE INDEX idx_card_templates_global  ON card_templates(is_global);
CREATE INDEX idx_card_templates_variant ON card_templates(variant);

-- DATA REAL (2 templates):
-- 035097b0 "Marketing Digital Cards": 1×1×1, gap=lg, has_media=true, media_opacity=26,
--          has_filters=false, has_icon=false, total_cards=1
-- 404c526d "Serviços BemDito":        3×2×1, gap=lg, has_media=false, media_opacity=100,
--          has_filters=true, filters_position=top, has_icon=true, total_cards=6, filtros=4


-- ═══════════════════════════════════════════════════════════════════════════
-- 8. CARD_FILTERS (4 registros, 7 colunas)
-- ⚠️ NÃO existe coluna "name" — use "label"
-- ⚠️ NÃO existe coluna "order" — use "order_index"
-- Todos pertencem ao template "Serviços BemDito" (404c526d)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE card_filters (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),     -- 1
  template_id UUID    NOT NULL REFERENCES card_templates(id) ON DELETE CASCADE, -- 2
  label       TEXT    NOT NULL,                                    -- 3 ← NÃO é "name"
  slug        TEXT,                                                -- 4
  icon        TEXT,                                                -- 5
  order_index INTEGER NOT NULL DEFAULT 0,                          -- 6 ← NÃO é "order"
  created_at  TIMESTAMPTZ DEFAULT NOW(),                           -- 7
  UNIQUE (template_id, slug)
);
CREATE INDEX idx_card_filters_template_id ON card_filters(template_id);
CREATE INDEX idx_card_filters_order       ON card_filters(order_index);

-- DATA REAL (template "Serviços BemDito" — 404c526d):
-- 812581a8 label="Todos"             slug="todos"             order=0
-- d7e9c602 label="Marketing Digital" slug="marketing-digital" order=1
-- c7990418 label="Branding"          slug="branding"          order=2
-- bdb2d654 label="Conteúdo"          slug="conteudo"          order=3


-- ═══════════════════════════════════════════════════════════════════════════
-- 9. TEMPLATE_CARDS (7 registros, 14 colunas)
-- ⚠️ NÃO existe coluna "order" — use "order_index"
-- ⚠️ NÃO existe coluna "published"
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE template_cards (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),     -- 1
  template_id   UUID    NOT NULL REFERENCES card_templates(id) ON DELETE CASCADE, -- 2
  icon          TEXT,                                                -- 3
  title         TEXT,                                                -- 4
  subtitle      TEXT,                                                -- 5
  media_url     TEXT,                                                -- 6
  link_url      TEXT,                                                -- 7
  link_type     TEXT    DEFAULT 'internal',                          -- 8
  filter_id     UUID    REFERENCES card_filters(id) ON DELETE SET NULL, -- 9
  filter_tags   TEXT[],                                              -- 10
  order_index   INTEGER NOT NULL DEFAULT 0,                          -- 11 ← NÃO é "order"
  created_at    TIMESTAMPTZ DEFAULT NOW(),                           -- 12
  updated_at    TIMESTAMPTZ DEFAULT NOW(),                           -- 13
  media_opacity INTEGER DEFAULT 100                                  -- 14
);
CREATE INDEX idx_template_cards_template_id ON template_cards(template_id);
CREATE INDEX idx_template_cards_filter_id   ON template_cards(filter_id);
CREATE INDEX idx_template_cards_order       ON template_cards(order_index);

-- DATA REAL (7 cards):
-- ef57406e "3.2 bilhões" (Marketing Digital Cards, sem filtro, order=0, opacity=50)
-- 378a39cd "Gestão de Redes Sociais" (Serviços, filtro=Marketing, order=0, icon=Instagram)
-- a6f21d5b "Tráfego Pago"           (Serviços, filtro=Marketing, order=1, icon=TrendingUp)
-- fff1b463 "SEO e Analytics"         (Serviços, filtro=Marketing, order=2, icon=BarChart3)
-- ab20ea77 "Identidade Visual"       (Serviços, filtro=Branding,  order=3, icon=Palette)
-- 0711c10a "Posicionamento"          (Serviços, filtro=Branding,  order=4, icon=Target)
-- ad44b584 "Brand Book"              (Serviços, filtro=Branding,  order=5, icon=BookOpen)
-- ⚠️ Nenhum card com filtro=Conteúdo ou filtro=Todos


-- ═══════════════════════════════════════════════════════════════════════════
-- 10. SECTION_TEMPLATE_CARDS (0 registros)
-- Vínculo seção ↔ template (PK composta sem coluna id)
-- ⚠️ Vínculo real feito via sections.config->>'cardTemplateId' (JSONB)
-- ⚠️ NÃO existe coluna updated_at (trigger órfã removida em V3.0 — Bloco B)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE section_template_cards (
  section_id  UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES card_templates(id) ON DELETE CASCADE,
  UNIQUE (section_id, template_id)
);
CREATE UNIQUE INDEX unique_section_template         ON section_template_cards(section_id, template_id);
CREATE INDEX idx_section_template_cards_section_id  ON section_template_cards(section_id);
CREATE INDEX idx_section_template_cards_template_id ON section_template_cards(template_id);
-- V3.0: trigger update_section_template_cards_updated_at REMOVIDA (coluna updated_at não existe)


-- ═══════════════════════════════════════════════════════════════════════════
-- 11. PAGE_VERSIONS (181 registros)
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
-- 12. SECTION_VERSIONS (0 registros)
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
-- 13. SITE_CONFIG (1 registro — singleton)
-- ⚠️ site_config.footer.columns[*].title = "BemDitoo" (typo — V3.0 Bloco E)
-- ⚠️ site_config.header.menu_items são hardcoded; usar tabela menu_items
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE site_config (
  id         UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  header     JSONB   DEFAULT '{}'::jsonb,
  footer     JSONB   DEFAULT '{}'::jsonb,
  published  BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- id real: c8af658c-d9b9-4267-9caa-4e7a4f7cb1ce, published=true
-- header.logo.url = https://fxutnvoaygzvseubiytf.supabase.co/storage/v1/object/public/make-72da2481-media/media/1770461868042-g34eri.png
-- header.cta = {url:"/contato", icon:"Link", label:"Orçamento em 3, 2, 1"}
-- header.sticky = true
-- footer = {social:[Instagram,LinkedIn], columns:[3×"BemDitoo"], copyright:"..."}


-- ═══════════════════════════════════════════════════════════════════════════
-- 14. FOOTER_CONFIG (1 registro — singleton, fonte primária do footer_manager)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE footer_config (
  id         UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  config     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_footer_config_config ON footer_config USING gin(config);
-- id real: 9c1054ca-ce27-48f6-8718-88aed69340c6
-- config = {
--   social: [{platform:facebook,...},{platform:instagram,...}],
--   columns: [{id:col1,title:"Empresa",...},{id:col2,title:"Recursos",...}],
--   copyright: "© 2026 BemDito. Todos os direitos reservados."
-- }


-- ═══════════════════════════════════════════════════════════════════════════
-- 15. MEDIA_ASSETS (0 registros — gerenciado pelo bucket)
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
CREATE INDEX idx_media_assets_mime_type  ON media_assets(mime_type);
CREATE INDEX idx_media_assets_created_at ON media_assets(created_at DESC);
CREATE INDEX idx_media_assets_created_by ON media_assets(created_by);
-- Bucket Supabase Storage: make-72da2481-media (privado)
-- 11 arquivos reais (image/png e image/jpeg, 6-419 KB)


-- ═══════════════════════════════════════════════════════════════════════════
-- 16. KV_STORE_72DA2481 (sistema Figma Make — NÃO MODIFICAR)
-- ⚠️ 5 índices idênticos (kv_store_72da2481_key_idx + idx1..idx4) — sistema, não remover
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE kv_store_72da2481 (
  key   TEXT  PRIMARY KEY,
  value JSONB NOT NULL
);
CREATE INDEX kv_store_72da2481_key_idx  ON kv_store_72da2481(key text_pattern_ops);
-- idx1-idx4 são duplicatas do índice acima — sistema Figma Make, não remover


-- ═══════════════════════════════════════════════════════════════════════════
-- 17. VIEWS (3 confirmadas)
-- ═══════════════════════════════════════════════════════════════════════════

-- v_database_stats — recriada em V3.0 com subquery para ORDER BY funcionar no Studio
CREATE OR REPLACE VIEW v_database_stats AS
SELECT tabela, total FROM (
  SELECT 'card_filters'           AS tabela, COUNT(*)::int AS total FROM card_filters     UNION ALL
  SELECT 'card_templates',                   COUNT(*)      FROM card_templates             UNION ALL
  SELECT 'design_tokens',                    COUNT(*)      FROM design_tokens              UNION ALL
  SELECT 'footer_config',                    COUNT(*)      FROM footer_config              UNION ALL
  SELECT 'media_assets',                     COUNT(*)      FROM media_assets               UNION ALL
  SELECT 'menu_cards',                       COUNT(*)      FROM menu_cards                 UNION ALL
  SELECT 'menu_items',                       COUNT(*)      FROM menu_items                 UNION ALL
  SELECT 'page_sections',                    COUNT(*)      FROM page_sections              UNION ALL
  SELECT 'page_versions',                    COUNT(*)      FROM page_versions              UNION ALL
  SELECT 'pages',                            COUNT(*)      FROM pages                      UNION ALL
  SELECT 'section_template_cards',           COUNT(*)      FROM section_template_cards     UNION ALL
  SELECT 'section_versions',                 COUNT(*)      FROM section_versions           UNION ALL
  SELECT 'sections',                         COUNT(*)      FROM sections                   UNION ALL
  SELECT 'site_config',                      COUNT(*)      FROM site_config                UNION ALL
  SELECT 'template_cards',                   COUNT(*)      FROM template_cards
) sub;

-- v_orphan_sections — seções sem vínculo com páginas (definição inferida)
-- CREATE OR REPLACE VIEW v_orphan_sections AS
--   SELECT s.* FROM sections s
--   WHERE NOT EXISTS (SELECT 1 FROM page_sections ps WHERE ps.section_id = s.id);

-- v_pages_with_sections — páginas com suas seções (definição inferida)
-- CREATE OR REPLACE VIEW v_pages_with_sections AS
--   SELECT p.*, json_agg(s.*) AS sections
--   FROM pages p LEFT JOIN page_sections ps ON p.id = ps.page_id
--   LEFT JOIN sections s ON ps.section_id = s.id
--   GROUP BY p.id;


-- ═══════════════════════════════════════════════════════════════════════════
-- 18. FUNÇÕES (8 confirmadas)
-- ═══════════════════════════════════════════════════════════════════════════
-- cleanup_old_versions()                    → void
-- fix_section_structure()                   → text
-- get_next_page_version_number(p_page_id)   → integer
-- get_next_section_version_number(p_section_id) → integer
-- update_updated_at_column()                → trigger  (usada por todos os triggers)
-- validate_section_complete()               → record
-- validate_section_full_structure()         → record
-- validate_section_structure()              → record


-- ═══════════════════════════════════════════════════════════════════════════
-- 19. TRIGGERS (10 ativos — pós-V3.0)
-- Todas são BEFORE UPDATE usando update_updated_at_column()
-- ═══════════════════════════════════════════════════════════════════════════
-- update_card_templates_updated_at   → card_templates
-- update_design_tokens_updated_at    → design_tokens
-- update_footer_config_updated_at    → footer_config
-- update_media_assets_updated_at     → media_assets
-- update_menu_cards_updated_at       → menu_cards
-- update_menu_items_updated_at       → menu_items
-- update_pages_updated_at            → pages
-- ❌ REMOVIDA: update_section_template_cards_updated_at (órfã — coluna updated_at inexistente)
-- update_sections_updated_at         → sections
-- update_site_config_updated_at      → site_config
-- update_template_cards_updated_at   → template_cards
