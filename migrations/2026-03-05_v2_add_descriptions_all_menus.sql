-- Migration: Adicionar descrições nos 3 megamenus existentes
-- Data: 2026-03-05
-- Versão: 2.0 - Completa com os 3 itens
-- Descrição: Adiciona description, descriptionColor e descriptionFontSize 
--            em TODOS os itens de menu com megamenu ativo

-- ============================================================
-- BUSCAR TOKENS NECESSÁRIOS
-- ============================================================

DO $$
DECLARE
  body_base_token UUID;
  body_small_token UUID;
  dark_token UUID;
  muted_token UUID;
BEGIN
  -- Buscar tokens tipográficos
  SELECT id INTO body_base_token FROM design_tokens WHERE name = 'body-base' AND category = 'typography' LIMIT 1;
  SELECT id INTO body_small_token FROM design_tokens WHERE name = 'body-small' AND category = 'typography' LIMIT 1;
  
  -- Buscar tokens de cor
  SELECT id INTO dark_token FROM design_tokens WHERE name = 'dark' AND category = 'color' LIMIT 1;
  SELECT id INTO muted_token FROM design_tokens WHERE name = 'muted' AND category = 'color' LIMIT 1;

  -- Validar que os tokens foram encontrados
  IF body_base_token IS NULL THEN
    RAISE EXCEPTION 'Token "body-base" não encontrado!';
  END IF;
  IF dark_token IS NULL THEN
    RAISE EXCEPTION 'Token "dark" não encontrado!';
  END IF;

  RAISE NOTICE '✅ Tokens encontrados:';
  RAISE NOTICE '   body-base: %', body_base_token;
  RAISE NOTICE '   body-small: %', body_small_token;
  RAISE NOTICE '   dark: %', dark_token;
  RAISE NOTICE '   muted: %', muted_token;

  -- ============================================================
  -- 1. CHAMA A GENTE! (Contato)
  -- ============================================================
  UPDATE menu_items
  SET megamenu_config = jsonb_set(
    jsonb_set(
      jsonb_set(
        megamenu_config,
        '{column,description}',
        '"Tire suas dúvidas, solicite um orçamento ou agende uma conversa com nosso time"',
        true
      ),
      '{column,descriptionFontSize}',
      to_jsonb(body_small_token),
      true
    ),
    '{column,descriptionColor}',
    to_jsonb(COALESCE(muted_token, dark_token)),
    true
  )
  WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  RAISE NOTICE '✅ Descrição adicionada: Chama a gente!';

  -- ============================================================
  -- 2. AJUSTES (Sobre a BemDito)
  -- ============================================================
  UPDATE menu_items
  SET megamenu_config = jsonb_set(
    jsonb_set(
      jsonb_set(
        megamenu_config,
        '{column,description}',
        '"Descubra como transformamos ideias em soluções digitais inovadoras"',
        true
      ),
      '{column,descriptionFontSize}',
      to_jsonb(body_small_token),
      true
    ),
    '{column,descriptionColor}',
    to_jsonb(COALESCE(muted_token, dark_token)),
    true
  )
  WHERE id = '5892d326-3495-4597-b317-4b0c1f624849';

  RAISE NOTICE '✅ Descrição adicionada: Ajustes';

  -- ============================================================
  -- 3. TENDÊNCIAS E INSPIRAÇÃO
  -- ============================================================
  UPDATE menu_items
  SET megamenu_config = jsonb_set(
    jsonb_set(
      jsonb_set(
        megamenu_config,
        '{column,description}',
        '"Explore insights e tendências do mercado digital para se manter sempre atualizado"',
        true
      ),
      '{column,descriptionFontSize}',
      to_jsonb(body_small_token),
      true
    ),
    '{column,descriptionColor}',
    to_jsonb(COALESCE(muted_token, dark_token)),
    true
  )
  WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

  RAISE NOTICE '✅ Descrição adicionada: Tendências e Inspiração';

END $$;

-- ============================================================
-- QUERY DE VALIDAÇÃO - Ver resultados
-- ============================================================

SELECT 
  id,
  label,
  megamenu_config->'column'->>'title' as chamada,
  megamenu_config->'column'->>'description' as descricao,
  megamenu_config->'column'->>'mainTitle' as titulo_principal,
  (SELECT name FROM design_tokens WHERE id::text = (megamenu_config->'column'->>'descriptionFontSize')) as fonte_descricao,
  (SELECT name FROM design_tokens WHERE id::text = (megamenu_config->'column'->>'descriptionColor')) as cor_descricao
FROM menu_items
WHERE megamenu_config->>'enabled' = 'true'
ORDER BY label;

-- ============================================================
-- QUERY DETALHADA - Ver estrutura completa de um item
-- ============================================================

-- Descomentar para ver JSON completo de um item específico
-- SELECT 
--   label,
--   jsonb_pretty(megamenu_config->'column') as estrutura_column
-- FROM menu_items
-- WHERE label = 'Ajustes';

-- ============================================================
-- ROLLBACK (Se necessário)
-- ============================================================

-- Remover descrições de todos os itens
-- UPDATE menu_items
-- SET megamenu_config = megamenu_config #- '{column,description}' #- '{column,descriptionColor}' #- '{column,descriptionFontSize}'
-- WHERE megamenu_config->>'enabled' = 'true';

-- ============================================================
-- NOTAS
-- ============================================================

-- ✅ Usa body-small para descrições (menor que body-base)
-- ✅ Usa muted (se disponível) ou dark para cor mais suave
-- ✅ Adiciona descrições contextuais para cada megamenu
-- ✅ Descrições têm ~60-80 caracteres (1 linha no megamenu)
