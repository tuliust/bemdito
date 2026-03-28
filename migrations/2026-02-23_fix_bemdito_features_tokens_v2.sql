-- =========================================================
-- FIX V2: Resolver tokens do template BemDito Features
-- Agora com os nomes REAIS dos tokens do banco:
--   brand-pink   (#EA526E) → fundo do card
--   brand-orange (#ED9331) → fundo do ícone
--   text-inverse (#FFFFFF) → cor do ícone (branco)
--   text-primary (#111827) → título
--   text-secondary (#374151) → subtítulo
-- =========================================================


-- =========================================================
-- BLOCO 1: ATUALIZAR TEMPLATE com IDs diretos
-- =========================================================
UPDATE card_templates
SET
  card_bg_color_token  = 'c33989ab-cab0-4d8b-9b41-1352e1c203ba',  -- brand-pink (#EA526E)
  icon_color_token     = '6242795d-841d-465d-b7f2-462591521e94',  -- text-inverse (#FFFFFF)
  icon_bg_color_token  = '88cb432b-0834-45ed-944c-069eb23f95f0',  -- brand-orange (#ED9331)
  title_color_token    = '8ca0082b-cb7e-4981-87fb-a6b579e70f5e',  -- text-primary (#111827)
  subtitle_color_token = 'fc2afa74-571f-4f0f-ae58-da18fb98d67f'   -- text-secondary (#374151)
WHERE id = '6c96c503-5858-46a0-aa34-35e6f7b74991';


-- =========================================================
-- BLOCO 2: VALIDACAO — todos os campos devem estar preenchidos
-- =========================================================
SELECT
  ct.name AS template_name,
  d1.name AS bg_token,      d1.value::text AS bg_value,
  d2.name AS icon_token,    d2.value::text AS icon_value,
  d3.name AS icon_bg_token, d3.value::text AS icon_bg_value,
  d4.name AS title_token,   d4.value::text AS title_value,
  d5.name AS subtitle_token,d5.value::text AS subtitle_value
FROM card_templates ct
LEFT JOIN design_tokens d1 ON d1.id = ct.card_bg_color_token
LEFT JOIN design_tokens d2 ON d2.id = ct.icon_color_token
LEFT JOIN design_tokens d3 ON d3.id = ct.icon_bg_color_token
LEFT JOIN design_tokens d4 ON d4.id = ct.title_color_token
LEFT JOIN design_tokens d5 ON d5.id = ct.subtitle_color_token
WHERE ct.id = '6c96c503-5858-46a0-aa34-35e6f7b74991';


-- =========================================================
-- RESULTADO ESPERADO (zero NULLs):
-- bg_token:       brand-pink    → {"hex": "#EA526E"}
-- icon_token:     text-inverse  → {"hex": "#FFFFFF"}
-- icon_bg_token:  brand-orange  → {"hex": "#ED9331"}
-- title_token:    text-primary  → {"hex": "#111827"}
-- subtitle_token: text-secondary→ {"hex": "#374151"}
-- =========================================================
