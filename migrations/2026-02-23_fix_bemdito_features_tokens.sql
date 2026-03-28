-- =========================================================
-- FIX: Resolver tokens NULL no template BemDito Features
-- Problema: subqueries usavam nomes exatos (case-sensitive)
-- mas os tokens podem ter capitalização diferente
-- =========================================================


-- =========================================================
-- BLOCO 0: DIAGNOSTICO — listar TODOS os tokens de cor
-- Execute primeiro para ver os nomes reais
-- =========================================================
SELECT id, category, name, label, value::text
FROM design_tokens
WHERE category = 'color'
ORDER BY name;


-- =========================================================
-- BLOCO 1: DIAGNOSTICO — buscar tokens específicos
-- Verifica se existem com case-insensitive
-- =========================================================
SELECT name, id
FROM design_tokens
WHERE category = 'color'
  AND lower(name) IN ('primary', 'background', 'white', 'branco', 'accent', 'dark', 'preto', 'muted-foreground', 'foreground');


-- =========================================================
-- BLOCO 2: ATUALIZAR TEMPLATE com busca case-insensitive
-- Usa lower(name) para garantir match
-- =========================================================
UPDATE card_templates
SET
  card_bg_color_token = (
    SELECT id FROM design_tokens
    WHERE category = 'color' AND lower(name) = 'primary'
    LIMIT 1
  ),
  icon_color_token = COALESCE(
    (SELECT id FROM design_tokens WHERE category = 'color' AND lower(name) IN ('white', 'branco') LIMIT 1),
    (SELECT id FROM design_tokens WHERE category = 'color' AND lower(name) = 'background' LIMIT 1)
  ),
  icon_bg_color_token = (
    SELECT id FROM design_tokens
    WHERE category = 'color' AND lower(name) = 'accent'
    LIMIT 1
  ),
  title_color_token = COALESCE(
    (SELECT id FROM design_tokens WHERE category = 'color' AND lower(name) = 'dark' LIMIT 1),
    (SELECT id FROM design_tokens WHERE category = 'color' AND lower(name) = 'preto' LIMIT 1)
  ),
  subtitle_color_token = COALESCE(
    (SELECT id FROM design_tokens WHERE category = 'color' AND lower(name) = 'dark' LIMIT 1),
    (SELECT id FROM design_tokens WHERE category = 'color' AND lower(name) = 'preto' LIMIT 1)
  )
WHERE id = '6c96c503-5858-46a0-aa34-35e6f7b74991';


-- =========================================================
-- BLOCO 3: VALIDACAO — tokens devem estar preenchidos
-- =========================================================
SELECT
  ct.name AS template_name,
  ct.card_bg_color_token,
  d1.name AS bg_token, d1.value::text AS bg_value,
  ct.icon_color_token,
  d2.name AS icon_token, d2.value::text AS icon_value,
  ct.icon_bg_color_token,
  d3.name AS icon_bg_token, d3.value::text AS icon_bg_value,
  ct.title_color_token,
  d4.name AS title_token, d4.value::text AS title_value,
  ct.subtitle_color_token,
  d5.name AS subtitle_token, d5.value::text AS subtitle_value
FROM card_templates ct
LEFT JOIN design_tokens d1 ON d1.id = ct.card_bg_color_token
LEFT JOIN design_tokens d2 ON d2.id = ct.icon_color_token
LEFT JOIN design_tokens d3 ON d3.id = ct.icon_bg_color_token
LEFT JOIN design_tokens d4 ON d4.id = ct.title_color_token
LEFT JOIN design_tokens d5 ON d5.id = ct.subtitle_color_token
WHERE ct.id = '6c96c503-5858-46a0-aa34-35e6f7b74991';
