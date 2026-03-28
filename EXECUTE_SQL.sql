-- ═══════════════════════════════════════════════════════════════════════════
-- 🔍 DIAGNOSTICO: Verificar cardStyles no menu_items
-- Execute para ver se os valores de opacidade estão salvos no banco
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Ver o megamenu_config completo do item "Muito prazer!"
SELECT 
  id,
  label,
  megamenu_config
FROM menu_items
WHERE label ILIKE '%prazer%';

-- 2. Extrair APENAS o cardStyles (mais legível)
SELECT 
  label,
  megamenu_config->'cardStyles' AS card_styles
FROM menu_items
WHERE label ILIKE '%prazer%';

-- 3. Ver valores específicos de opacidade
SELECT 
  label,
  megamenu_config->'cardStyles'->>'bgOpacity' AS bg_opacity,
  megamenu_config->'cardStyles'->>'bgColorToken' AS bg_color_token,
  megamenu_config->'cardStyles'->>'borderOpacity' AS border_opacity,
  megamenu_config->'cardStyles'->>'borderColorToken' AS border_color_token
FROM menu_items
WHERE label ILIKE '%prazer%';

-- ═══════════════════════════════════════════════════════════════════════════
-- ✅ Se os valores aparecerem corretos (bgOpacity=5, bgColorToken=UUID):
--    → O problema está no MegamenuContent.tsx (verificar logs do console)
--
-- ❌ Se os valores estiverem NULL ou incorretos:
--    → Execute o UPDATE abaixo para forçar os valores no banco
-- ═══════════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════════════════════
-- 🔧 UPDATE: Forçar valores de cardStyles (SOMENTE se os valores estiverem NULL)
-- ═══════════════════════════════════════════════════════════════════════════

-- ⚠️ ATENÇÃO: Substitua o UUID abaixo pelo token correto!
-- Para descobrir o UUID do token "primary" (cor rosa):
-- SELECT id, name, value FROM design_tokens WHERE name = 'primary';

-- UPDATE menu_items
-- SET megamenu_config = jsonb_set(
--   megamenu_config,
--   '{cardStyles}',
--   jsonb_build_object(
--     'bgColorToken', '88cb432b-0834-45ed-944c-069eb23f95f0',  -- ← CONFIRME ESTE UUID!
--     'bgOpacity', 5,
--     'borderColorToken', '88cb432b-0834-45ed-944c-069eb23f95f0',
--     'borderOpacity', 100
--   ),
--   true
-- )
-- WHERE label ILIKE '%prazer%';

-- Depois do UPDATE, execute novamente a query 3 acima para confirmar.

-- ═══════════════════════════════════════════════════════════════════════════
-- 🆕 MIGRATION: Adicionar logo, endereço e telefone no footer
-- Data: 2026-03-01
-- ═══════════════════════════════════════════════════════════════════════════

-- PASSO 1: Verificar estrutura atual
SELECT 
  id,
  jsonb_pretty(footer) as footer_atual
FROM site_config
LIMIT 1;

-- PASSO 2: Adicionar campos ao footer (preservando dados existentes)
UPDATE site_config
SET footer = jsonb_set(
  jsonb_set(
    jsonb_set(
      COALESCE(footer, '{}'::jsonb),
      '{logo_url}',
      'null'::jsonb,
      true
    ),
    '{address}',
    '""'::jsonb,
    true
  ),
  '{phone}',
  '""'::jsonb,
  true
)
WHERE id IS NOT NULL;

-- PASSO 3: Verificar resultado
SELECT 
  id,
  footer->>'logo_url' as logo_url,
  footer->>'address' as address,
  footer->>'phone' as phone,
  footer->>'copyright' as copyright
FROM site_config
LIMIT 1;

-- PASSO 4: Validação
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM site_config
  WHERE footer ? 'logo_url' 
    AND footer ? 'address' 
    AND footer ? 'phone';
  
  IF v_count > 0 THEN
    RAISE NOTICE '✅ Migration concluída com sucesso! Campos adicionados: logo_url, address, phone';
  ELSE
    RAISE EXCEPTION '❌ Migration falhou! Campos não foram adicionados corretamente.';
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════

-- 🔍 DIAGNOSTICO: Verificar cardStyles no menu_items
-- Execute para ver se os valores de opacidade estão salvos no banco
-- ═══════════════════════════════════════════════════════════════════════════