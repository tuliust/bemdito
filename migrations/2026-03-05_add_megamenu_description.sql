-- Migration: Adicionar campo de descrição no megamenu
-- Data: 2026-03-05
-- Descrição: Adiciona description, descriptionColor e descriptionFontSize 
--            na coluna do megamenu (entre title e mainTitle)

-- ============================================================
-- EXEMPLO: Adicionar descrição no primeiro item de menu
-- ============================================================

-- 1. Buscar o primeiro item de menu com megamenu ativo
DO $$
DECLARE
  first_menu_item_id UUID;
  current_config JSONB;
  updated_config JSONB;
  body_base_token_id UUID;
  dark_token_id UUID;
BEGIN
  -- Buscar primeiro item com megamenu
  SELECT id, megamenu_config INTO first_menu_item_id, current_config
  FROM menu_items
  WHERE megamenu_config->>'enabled' = 'true'
  LIMIT 1;

  -- Se não encontrou, sair
  IF first_menu_item_id IS NULL THEN
    RAISE NOTICE 'Nenhum item de menu com megamenu ativo encontrado.';
    RETURN;
  END IF;

  -- Buscar UUIDs dos tokens necessários
  SELECT id INTO body_base_token_id
  FROM design_tokens
  WHERE name = 'body-base' AND category = 'typography'
  LIMIT 1;

  SELECT id INTO dark_token_id
  FROM design_tokens
  WHERE name = 'dark' AND category = 'color'
  LIMIT 1;

  -- Atualizar config com descrição
  updated_config := jsonb_set(
    jsonb_set(
      jsonb_set(
        current_config,
        '{column,description}',
        '"Texto descritivo que aparece entre a chamada e o título principal"',
        true
      ),
      '{column,descriptionFontSize}',
      to_jsonb(body_base_token_id),
      true
    ),
    '{column,descriptionColor}',
    to_jsonb(dark_token_id),
    true
  );

  -- Salvar
  UPDATE menu_items
  SET megamenu_config = updated_config
  WHERE id = first_menu_item_id;

  RAISE NOTICE '✅ Descrição adicionada ao item de menu: %', first_menu_item_id;
END $$;

-- ============================================================
-- QUERY DE VALIDAÇÃO
-- ============================================================

-- Ver estrutura completa do megamenu com descrição
SELECT 
  id,
  label,
  megamenu_config->'column'->>'title' as chamada,
  megamenu_config->'column'->>'description' as descricao,
  megamenu_config->'column'->>'mainTitle' as titulo_principal,
  megamenu_config->'column'->>'descriptionFontSize' as fonte_descricao,
  megamenu_config->'column'->>'descriptionColor' as cor_descricao
FROM menu_items
WHERE megamenu_config->>'enabled' = 'true';

-- ============================================================
-- ROLLBACK (Se necessário)
-- ============================================================

-- Remover campos de descrição
-- UPDATE menu_items
-- SET megamenu_config = megamenu_config #- '{column,description}' #- '{column,descriptionColor}' #- '{column,descriptionFontSize}'
-- WHERE megamenu_config->>'enabled' = 'true';
