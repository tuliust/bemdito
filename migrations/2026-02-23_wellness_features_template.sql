-- =========================================================
-- WELLNESS FEATURES TEMPLATE
-- =========================================================
-- INSTRUCAO: Execute CADA bloco separadamente no SQL Editor
-- do Supabase (copie e cole um bloco por vez)
-- =========================================================


-- =========================================================
-- BLOCO 0: DIAGNOSTICO — quais colunas existem?
-- Execute primeiro para saber se precisa do BLOCO 1
-- =========================================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'card_templates'
ORDER BY ordinal_position;


-- =========================================================
-- BLOCO 1: ADICIONAR COLUNAS (se nao existirem)
-- Execute APENAS se o BLOCO 0 nao mostrou essas colunas
-- =========================================================
-- 1a) icon_position (padrao 'top')
ALTER TABLE card_templates
  ADD COLUMN IF NOT EXISTS icon_position TEXT DEFAULT 'top';

-- 1b) columns_desktop / tablet / mobile
ALTER TABLE card_templates
  ADD COLUMN IF NOT EXISTS columns_desktop INTEGER DEFAULT 3;
ALTER TABLE card_templates
  ADD COLUMN IF NOT EXISTS columns_tablet INTEGER DEFAULT 2;
ALTER TABLE card_templates
  ADD COLUMN IF NOT EXISTS columns_mobile INTEGER DEFAULT 1;

-- 1c) gap entre cards
ALTER TABLE card_templates
  ADD COLUMN IF NOT EXISTS gap TEXT DEFAULT 'lg';


-- =========================================================
-- BLOCO 2: INSERIR TEMPLATE
-- Usa subqueries para resolver tokens por nome
-- =========================================================
INSERT INTO card_templates (
  id, name, variant, config, is_global,
  columns_desktop, columns_tablet, columns_mobile, gap,
  card_bg_color_token, card_border_color_token,
  card_border_radius, card_padding, card_shadow, card_border_width,
  has_icon, icon_size, icon_color_token, icon_position,
  has_title, title_font_size, title_font_weight, title_color_token,
  has_subtitle, subtitle_font_size, subtitle_font_weight, subtitle_color_token,
  has_media, media_position, media_aspect_ratio, media_border_radius,
  has_link, link_style, link_text_color_token,
  has_filters, filters_position,
  media_opacity
) VALUES (
  gen_random_uuid(),
  'Wellness Features',
  'grid',
  '{}',
  true,
  4, 2, 1,
  'md',
  (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'background' LIMIT 1),
  NULL,
  '2xl',
  'md',
  'none',
  0,
  true,
  32,
  COALESCE(
    (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'muted-foreground' LIMIT 1),
    (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'muted' LIMIT 1)
  ),
  'left',
  true,
  (SELECT id FROM design_tokens WHERE category = 'typography' AND name = 'body-base' LIMIT 1),
  600,
  (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'dark' LIMIT 1),
  true,
  (SELECT id FROM design_tokens WHERE category = 'typography' AND name = 'body-small' LIMIT 1),
  400,
  COALESCE(
    (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'muted-foreground' LIMIT 1),
    (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'muted' LIMIT 1)
  ),
  false, NULL, NULL, NULL,
  false, NULL, NULL,
  false, NULL,
  100
);


-- =========================================================
-- BLOCO 3: VERIFICAR TEMPLATE CRIADO
-- Confirme que retorna 1 linha antes de continuar
-- =========================================================
SELECT id, name, icon_position, columns_desktop, gap
FROM card_templates
WHERE name = 'Wellness Features';


-- =========================================================
-- BLOCO 4: INSERIR 8 CARDS
-- Usa subquery para pegar o template_id pelo nome
-- =========================================================
INSERT INTO template_cards (id, template_id, icon, title, subtitle, media_url, link_url, link_type, filter_id, order_index)
VALUES
  (gen_random_uuid(),
   (SELECT id FROM card_templates WHERE name = 'Wellness Features' LIMIT 1),
   'BarChart3', 'Engagement dashboard', 'Monitor team activity & wellness progress',
   NULL, NULL, 'internal', NULL, 0),

  (gen_random_uuid(),
   (SELECT id FROM card_templates WHERE name = 'Wellness Features' LIMIT 1),
   'Zap', 'Workouts', 'Short, energizing sessions for all fitness levels',
   NULL, NULL, 'internal', NULL, 1),

  (gen_random_uuid(),
   (SELECT id FROM card_templates WHERE name = 'Wellness Features' LIMIT 1),
   'Heart', 'Nutrition guidance', 'Expert-backed healthy eating tips',
   NULL, NULL, 'internal', NULL, 2),

  (gen_random_uuid(),
   (SELECT id FROM card_templates WHERE name = 'Wellness Features' LIMIT 1),
   'Timer', 'Fasting program', 'Support for intermittent fasting goals',
   NULL, NULL, 'internal', NULL, 3),

  (gen_random_uuid(),
   (SELECT id FROM card_templates WHERE name = 'Wellness Features' LIMIT 1),
   'Footprints', 'Step tracker', 'Monitor daily movement & activity',
   NULL, NULL, 'internal', NULL, 4),

  (gen_random_uuid(),
   (SELECT id FROM card_templates WHERE name = 'Wellness Features' LIMIT 1),
   'Flame', 'Calorie & water tracker', 'Log and monitor daily intake',
   NULL, NULL, 'internal', NULL, 5),

  (gen_random_uuid(),
   (SELECT id FROM card_templates WHERE name = 'Wellness Features' LIMIT 1),
   'Leaf', 'Meditation & mindfulness', 'Guided relaxation, focus techniques',
   NULL, NULL, 'internal', NULL, 6),

  (gen_random_uuid(),
   (SELECT id FROM card_templates WHERE name = 'Wellness Features' LIMIT 1),
   'Moon', 'Sleep stories & sounds', 'Relaxing audios for better sleep',
   NULL, NULL, 'internal', NULL, 7);


-- =========================================================
-- BLOCO 5: VALIDACAO FINAL
-- =========================================================

-- Template
SELECT
  ct.id AS template_id,
  ct.name,
  ct.icon_position,
  ct.columns_desktop,
  ct.columns_tablet,
  ct.columns_mobile,
  ct.gap,
  ct.card_border_width,
  ct.card_shadow
FROM card_templates ct
WHERE ct.name = 'Wellness Features';

-- Cards (deve retornar 8 linhas)
SELECT
  tc.order_index,
  tc.icon,
  tc.title,
  tc.subtitle
FROM template_cards tc
JOIN card_templates ct ON ct.id = tc.template_id
WHERE ct.name = 'Wellness Features'
ORDER BY tc.order_index;
