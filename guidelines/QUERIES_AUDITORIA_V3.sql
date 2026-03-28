-- ═══════════════════════════════════════════════════════════════════════════
-- 📋 QUERIES_AUDITORIA_V3.sql — BemDito CMS
-- ═══════════════════════════════════════════════════════════════════════════
-- Arquivo PERMANENTE — não alterar (somente leitura).
-- Para executar: copie o bloco desejado para o EXECUTE_SQL.sql e rode no
-- SQL Editor do Supabase.
--
-- Versão:    3.2
-- Extraído:  2026-02-19 (auditoria V3.0→V3.2 finalizada — banco 100% limpo)
-- Referência: /guidelines/SCHEMA_OFICIAL_V3.0.sql
-- Resultados: veja /guidelines/SCHEMA_OFICIAL_V3.0.sql (comentários DATA)
--
-- ÍNDICE:
--   Bloco  1 — Seções: overview completo
--   Bloco  2 — Contagem de registros (alternativa sem a view)
--   Bloco  3 — Tabelas e Views existentes
--   Bloco  4 — Foreign keys
--   Bloco  5 — Índices personalizados (excluindo PKs)
--   Bloco  6 — Colunas das tabelas principais
--   Bloco  7 — Conteúdo JSONB das seções
--   Bloco  8 — Card templates e filtros
--   Bloco  9 — Validar colunas inexistentes / estrutura esperada
--   Bloco 10 — Template_cards e card_filters (dados reais)
--   Bloco 11 — Site_config e footer_config
--   Bloco 12 — Menu_items e menu_cards
--   Bloco 13 — Funções e triggers
--   Bloco 14 — Diagnóstico de integridade (checks)
--   Bloco 15 — v_database_stats diagnóstico (V3.1)
-- ═══════════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 1 — Seções: overview completo
-- Esperado: 10 seções, type='unico', global=true, published=true
-- ───────────────────────────────────────────────────────────────────────────
SELECT
  ps.order_index                               AS "order",
  LEFT(s.id::text, 8)                          AS "id",
  s.name,
  s.config->>'gridCols'                        AS "cols",
  s.config->>'gridRows'                        AS "rows",
  s.layout->'desktop'->>'text'                 AS "pos_text",
  s.layout->'desktop'->>'media'                AS "pos_media",
  s.layout->'desktop'->>'cards'                AS "pos_cards",
  s.styling->>'height'                         AS "height",
  (s.elements->>'hasMedia')::boolean           AS "media",
  (s.elements->>'hasCards')::boolean           AS "cards",
  LEFT(s.config->>'cardTemplateId', 8)         AS "cardTemplateId",
  s.type,
  s.global,
  s.published
FROM sections s
LEFT JOIN page_sections ps ON ps.section_id = s.id
ORDER BY ps.order_index NULLS LAST, s.name;


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 2 — Contagem de registros em todas as tabelas
-- ⚠️ Use esta query direta — v_database_stats pode ter coluna errada no Studio
--    Executar /migrations/2026-02-19_v3.2_corrections.sql para corrigir a view
-- ───────────────────────────────────────────────────────────────────────────
SELECT 'card_filters'           AS tabela, COUNT(*)::int AS total FROM card_filters          UNION ALL
SELECT 'card_templates',                   COUNT(*)      FROM card_templates                 UNION ALL
SELECT 'design_tokens',                    COUNT(*)      FROM design_tokens                  UNION ALL
SELECT 'footer_config',                    COUNT(*)      FROM footer_config                  UNION ALL
SELECT 'media_assets',                     COUNT(*)      FROM media_assets                   UNION ALL
SELECT 'menu_cards',                       COUNT(*)      FROM menu_cards                     UNION ALL
SELECT 'menu_items',                       COUNT(*)      FROM menu_items                     UNION ALL
SELECT 'page_sections',                    COUNT(*)      FROM page_sections                  UNION ALL
SELECT 'page_versions',                    COUNT(*)      FROM page_versions                  UNION ALL
SELECT 'pages',                            COUNT(*)      FROM pages                          UNION ALL
SELECT 'section_template_cards',           COUNT(*)      FROM section_template_cards         UNION ALL
SELECT 'section_versions',                 COUNT(*)      FROM section_versions               UNION ALL
SELECT 'sections',                         COUNT(*)      FROM sections                       UNION ALL
SELECT 'site_config',                      COUNT(*)      FROM site_config                    UNION ALL
SELECT 'template_cards',                   COUNT(*)      FROM template_cards
ORDER BY tabela;

-- Valores confirmados V3.2 (2026-02-19 — definitivos):
--   card_filters=4, card_templates=2, design_tokens=37, footer_config=1
--   media_assets=0, menu_cards=22, menu_items=4, page_sections=10
--   page_versions=181, pages=2, section_template_cards=0
--   section_versions=0, sections=10, site_config=1, template_cards=7


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 3 — Tabelas e Views existentes
-- Esperado: 16 BASE TABLEs + 3 VIEWs = 19 total
-- ───────────────────────────────────────────────────────────────────────────
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name NOT LIKE 'pg_%'
ORDER BY table_type DESC, table_name;

-- Views confirmadas: v_database_stats, v_orphan_sections, v_pages_with_sections


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 4 — Foreign keys (31 confirmadas V3.0)
-- ───────────────────────────────────────────────────────────────────────────
SELECT
  tc.table_name   AS "tabela_origem",
  kcu.column_name AS "coluna",
  ccu.table_name  AS "tabela_destino",
  rc.delete_rule  AS "on_delete"
FROM information_schema.table_constraints      AS tc
JOIN information_schema.key_column_usage       AS kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
JOIN information_schema.referential_constraints AS rc  ON tc.constraint_name = rc.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = rc.unique_constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 5 — Índices personalizados (46 = 47 total - 1 pkey)
-- ⚠️ kv_store tem 5 índices idênticos (idx, idx1-idx4) — sistema Figma Make, não remover
-- ───────────────────────────────────────────────────────────────────────────
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname NOT LIKE '%_pkey'
ORDER BY tablename, indexname;


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 6 — Colunas das tabelas principais
-- ───────────────────────────────────────────────────────────────────────────

-- 6a. sections (11 colunas — elements/layout/styling são NULLABLE)
SELECT ordinal_position AS pos, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name='sections' ORDER BY ordinal_position;

-- 6b. card_templates (43 colunas — ⚠️ NÃO existe display_mode nem cols)
SELECT ordinal_position AS pos, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name='card_templates' ORDER BY ordinal_position;

-- 6c. card_filters (7 colunas — ⚠️ use "label" e "order_index", NÃO "name" nem "order")
SELECT ordinal_position AS pos, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name='card_filters' ORDER BY ordinal_position;

-- 6d. template_cards (14 colunas — ⚠️ NÃO existe "order" nem "published")
SELECT ordinal_position AS pos, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name='template_cards' ORDER BY ordinal_position;

-- 6e. menu_cards (24 colunas — pos 23=subtitle_font_size, 24=subtitle_font_weight)
SELECT ordinal_position AS pos, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name='menu_cards' ORDER BY ordinal_position;

-- 6f. pages (12 colunas — posição ordinal 6 ausente: coluna deletada no passado)
SELECT ordinal_position AS pos, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name='pages' ORDER BY ordinal_position;

-- 6g. page_sections (5 colunas — posição ordinal 4 ausente: config foi dropada)
SELECT ordinal_position AS pos, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name='page_sections' ORDER BY ordinal_position;


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 7 — Conteúdo JSONB das seções
-- ───────────────────────────────────────────────────────────────────────────

-- 7a. Spacing
SELECT
  LEFT(s.id::text,8) AS "id", s.name,
  s.styling->'spacing'->>'top'    AS "top",
  s.styling->'spacing'->>'bottom' AS "bot",
  s.styling->'spacing'->>'left'   AS "left",
  s.styling->'spacing'->>'right'  AS "right",
  s.styling->'spacing'->>'gap'    AS "gap",
  s.styling->'spacing'->>'rowGap' AS "rowGap",
  s.styling->>'height'            AS "height"
FROM sections s
LEFT JOIN page_sections ps ON ps.section_id = s.id
ORDER BY ps.order_index NULLS LAST;

-- 7b. fitMode das seções com mídia
-- ✅ Valores corretos no banco pós-V3.0 Bloco D:
--    APP         → adaptada (sem alteração)
--    Melhores    → cobrir   (corrigido de 'cover')
--    Monte Proj. → adaptada (sem alteração)
--    Prazer      → alinhada (corrigido de 'contain', alignX=right, alignY=bottom)
SELECT
  LEFT(s.id::text,8) AS "id", s.name,
  s.config->'media'->>'fitMode' AS "fitMode",
  s.config->'media'->>'alignX' AS "alignX",
  s.config->'media'->>'alignY' AS "alignY"
FROM sections s
WHERE s.elements->>'hasMedia' = 'true'
ORDER BY s.name;

-- 7c. Posições do layout (confirmar que são STRINGS, não objetos)
SELECT
  LEFT(s.id::text,8) AS "id", s.name,
  jsonb_typeof(s.layout->'desktop'->'text')  AS "text_type",
  jsonb_typeof(s.layout->'desktop'->'media') AS "media_type",
  jsonb_typeof(s.layout->'desktop'->'cards') AS "cards_type",
  s.layout->'desktop'->>'text'  AS "text_pos",
  s.layout->'desktop'->>'media' AS "media_pos",
  s.layout->'desktop'->>'cards' AS "cards_pos"
FROM sections s ORDER BY s.name;

-- 7d. Confirmar gridCols/gridRows em config (não em layout)
SELECT
  LEFT(s.id::text,8) AS "id", s.name,
  s.config->>'gridCols' AS "config_cols",
  s.config->>'gridRows' AS "config_rows",
  s.layout->>'gridCols' AS "layout_cols",  -- ❌ deve ser null
  s.layout->>'gridRows' AS "layout_rows"   -- ❌ deve ser null
FROM sections s ORDER BY s.name;


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 8 — Card templates (visão geral)
-- ───────────────────────────────────────────────────────────────────────────
SELECT
  ct.id, ct.name,
  ct.columns_desktop, ct.columns_tablet, ct.columns_mobile, ct.gap,
  ct.has_filters, ct.filters_position, ct.has_icon, ct.has_title,
  ct.has_subtitle, ct.has_media, ct.has_link, ct.media_opacity,
  COUNT(DISTINCT cf.id) AS filtros,
  COUNT(DISTINCT tc.id) AS cards
FROM card_templates ct
LEFT JOIN card_filters  cf ON cf.template_id = ct.id
LEFT JOIN template_cards tc ON tc.template_id = ct.id
GROUP BY ct.id, ct.name, ct.columns_desktop, ct.columns_tablet, ct.columns_mobile,
         ct.gap, ct.has_filters, ct.filters_position, ct.has_icon, ct.has_title,
         ct.has_subtitle, ct.has_media, ct.has_link, ct.media_opacity
ORDER BY ct.name;


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 9 — Validar colunas inexistentes / estrutura esperada
-- ───────────────────────────────────────────────────────────────────────────

-- 9a. display_mode e cols NÃO devem existir em card_templates (só 'name' deve retornar)
SELECT column_name FROM information_schema.columns
WHERE table_schema='public' AND table_name='card_templates'
  AND column_name IN ('display_mode','cols','name');

-- 9b. order e published NÃO devem existir em template_cards (só 'order_index')
SELECT column_name FROM information_schema.columns
WHERE table_schema='public' AND table_name='template_cards'
  AND column_name IN ('order','published','order_index');

-- 9c. name NÃO deve existir em card_filters (label e order_index devem retornar)
SELECT column_name FROM information_schema.columns
WHERE table_schema='public' AND table_name='card_filters'
  AND column_name IN ('name','label','order','order_index');

-- 9d. Verificar trigger de section_template_cards (deve retornar 0 após V3.0)
--     ✅ V3.1: confirmado 0 linhas — trigger removida intencionalmente (Bloco B)
--     ⚠️ Nota: updated_at EXISTE na tabela — a trigger era válida, removida por simplificação
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_schema='public'
  AND event_object_table='section_template_cards';

-- 9e. Confirmar estrutura real de section_template_cards (6 colunas: id, section_id, template_id, order_index, created_at, updated_at)
-- ✅ V3.1: updated_at EXISTE (contradiz doc anterior que dizia "sem updated_at")
SELECT ordinal_position AS pos, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema='public' AND table_name='section_template_cards'
ORDER BY ordinal_position;
-- Esperado (6 colunas): id, section_id, template_id, order_index, created_at, updated_at

-- 9f. Confirmar que test-token foi removido (deve retornar 0 linhas)
-- ✅ V3.1: confirmado 0 linhas — test-token removido
SELECT id, name, label, value FROM design_tokens WHERE name = 'test-token';


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 10 — Template_cards e card_filters
-- ───────────────────────────────────────────────────────────────────────────

-- 10a. Filtros
SELECT cf.id, ct.name AS "template", cf.label, cf.slug, cf.icon, cf.order_index
FROM card_filters cf
JOIN card_templates ct ON ct.id = cf.template_id
ORDER BY ct.name, cf.order_index;

-- 10b. Cards com template e filtro
SELECT
  tc.id, ct.name AS "template", cf.label AS "filtro",
  tc.title, tc.subtitle, tc.icon, tc.order_index, tc.media_opacity,
  LEFT(tc.media_url,60) AS "media_url", tc.link_url, tc.link_type
FROM template_cards tc
JOIN card_templates ct ON ct.id = tc.template_id
LEFT JOIN card_filters cf ON cf.id = tc.filter_id
ORDER BY ct.name, tc.order_index;

-- 10c. Cards órfãos (deve retornar 0 linhas)
SELECT tc.id, tc.title FROM template_cards tc
LEFT JOIN card_templates ct ON ct.id = tc.template_id
WHERE ct.id IS NULL;

-- 10d. Seção ↔ card_template (somente hasCards=true)
SELECT
  LEFT(s.id::text,8) AS "section_id", s.name,
  s.config->>'cardTemplateId' AS "cardTemplateId",
  ct.name AS "template_name",
  (s.elements->>'hasCards')::boolean AS "hasCards"
FROM sections s
LEFT JOIN card_templates ct ON ct.id::text = s.config->>'cardTemplateId'
WHERE s.elements->>'hasCards' = 'true'
ORDER BY s.name;


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 11 — Site_config e footer_config
-- ───────────────────────────────────────────────────────────────────────────

-- 11a. Discrepância de footers
-- ✅ V3.1: site_config.footer.columns[*].title = "BemDito" (corrigido de "BemDitoo")
--    Fonte primária do footer continua sendo footer_config (footer_manager)
SELECT
  'site_config.footer'             AS fonte,
  jsonb_array_length(footer->'columns') AS colunas,
  footer->'columns'->0->>'title'   AS primeira_coluna
FROM site_config
UNION ALL
SELECT
  'footer_config.config',
  jsonb_array_length(config->'columns'),
  config->'columns'->0->>'title'
FROM footer_config;
-- Esperado V3.1: site_config → 3 colunas, primeira_coluna="BemDito"

-- 11b. header da site_config
SELECT id, published, updated_at, jsonb_pretty(header) AS header_json FROM site_config;


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 12 — Menu_items e menu_cards
-- ───────────────────────────────────────────────────────────────────────────

-- 12a. Menu items
SELECT mi.id, mi.label, mi.icon, mi."order",
       mi.megamenu_config->>'bgColor'       AS bg_color,
       mi.megamenu_config->>'mediaPosition' AS media_pos,
       jsonb_array_length(mi.megamenu_config->'columns') AS colunas
FROM menu_items mi ORDER BY mi."order";

-- 12b. Menu cards (24 colunas — verificar garbage text em subtitles)
SELECT mc.id, mc.name, mc.icon, mc.icon_size,
       mc.title, mc.title_font_weight,
       mc.subtitle, mc.subtitle_font_weight,
       mc.url, mc.url_type, mc.is_global
FROM menu_cards mc ORDER BY mc.name;

-- 12c. Design tokens por categoria
SELECT category, name, label, "order", value
FROM design_tokens ORDER BY category, "order", name;


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 13 — Funções (8) e Triggers (10 pós-V3.0)
-- ───────────────────────────────────────────────────────────────────────────

-- 13a. Funções
SELECT routine_name, data_type AS return_type
FROM information_schema.routines
WHERE routine_schema='public' AND routine_type='FUNCTION'
ORDER BY routine_name;

-- 13b. Triggers (10 esperados após remoção intencional da trigger de section_template_cards)
--      ✅ V3.1 confirmado: card_templates, design_tokens, footer_config, media_assets,
--         menu_cards, menu_items, pages, sections, site_config, template_cards
SELECT trigger_name, event_object_table AS tabela, event_manipulation AS evento, action_timing AS timing
FROM information_schema.triggers
WHERE trigger_schema='public'
ORDER BY event_object_table, trigger_name;


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 14 — Diagnóstico de integridade (checks — todos devem retornar 0 linhas)
-- ✅ V3.1: todos os 5 checks passaram (linhas_problema=0)
-- ───────────────────────────────────────────────────────────────────────────

-- 14a. Posições como objetos (deve ser 0 linhas)
SELECT LEFT(id::text,8) AS id, name,
  jsonb_typeof(layout->'desktop'->'text')  AS text_type,
  jsonb_typeof(layout->'desktop'->'media') AS media_type,
  jsonb_typeof(layout->'desktop'->'cards') AS cards_type
FROM sections
WHERE jsonb_typeof(layout->'desktop'->'text')  = 'object'
   OR jsonb_typeof(layout->'desktop'->'media') = 'object'
   OR jsonb_typeof(layout->'desktop'->'cards') = 'object';

-- 14b. gridCols/gridRows em layout (deve ser 0 linhas)
SELECT LEFT(id::text,8) AS id, name, layout->>'gridCols', layout->>'gridRows'
FROM sections WHERE layout ? 'gridCols' OR layout ? 'gridRows';

-- 14c. Seção em mais de 1 página (deve ser 0 linhas)
SELECT LEFT(section_id::text,8), COUNT(DISTINCT page_id) AS paginas
FROM page_sections GROUP BY section_id HAVING COUNT(DISTINCT page_id) > 1;

-- 14d. Template_cards órfãos (deve ser 0 linhas)
SELECT tc.id, tc.title FROM template_cards tc
LEFT JOIN card_templates ct ON ct.id = tc.template_id WHERE ct.id IS NULL;

-- 14e. Page_sections com FK inválida (deve ser 0 linhas)
SELECT ps.id, ps.section_id, ps.page_id FROM page_sections ps
WHERE NOT EXISTS (SELECT 1 FROM sections s WHERE s.id = ps.section_id)
   OR NOT EXISTS (SELECT 1 FROM pages p WHERE p.id = ps.page_id);

-- 14f. Verificar se v_database_stats tem coluna "tabela" ou "table_name"
-- ✅ V3.2 CORRIGIDO — colunas: tabela (text) + total (integer)
--    Antiga view (pré-V3.2) tinha: table_name (text) + total_records (bigint)
--    Corrigido via DROP + CREATE em /migrations/2026-02-19_v3.2_corrections.sql Bloco F
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'v_database_stats'
ORDER BY ordinal_position;
-- Esperado V3.2: tabela (text), total (integer)


-- ───────────────────────────────────────────────────────────────────────────
-- BLOCO 15 — v_database_stats: teste funcional (V3.2)
-- ✅ V3.2 CONFIRMADO: view funciona com ORDER BY no Studio
-- ───────────────────────────────────────────────────────────────────────────

-- 15a. Colunas da view (confirmar nome correto)
-- ✅ V3.2: "tabela" (text), "total" (integer)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'v_database_stats'
ORDER BY ordinal_position;

-- 15b. SELECT com ORDER BY (funciona no Studio sem erro 42703)
-- ✅ V3.2: retorna 15 linhas ordenadas
SELECT * FROM v_database_stats ORDER BY tabela;
-- Resultados confirmados V3.2:
--   card_filters=4, card_templates=2, design_tokens=37, footer_config=1
--   media_assets=0, menu_cards=22, menu_items=4, page_sections=10
--   page_versions=181, pages=2, section_template_cards=0
--   section_versions=0, sections=10, site_config=1, template_cards=7

-- 15c. Cross-check com Bloco 2 (totais devem ser idênticos)
SELECT
  (SELECT total FROM v_database_stats WHERE tabela='sections')          AS sections,
  (SELECT total FROM v_database_stats WHERE tabela='design_tokens')     AS design_tokens,
  (SELECT total FROM v_database_stats WHERE tabela='menu_cards')        AS menu_cards,
  (SELECT total FROM v_database_stats WHERE tabela='template_cards')    AS template_cards;
-- Confirmado V3.2: sections=10, design_tokens=37, menu_cards=22, template_cards=7