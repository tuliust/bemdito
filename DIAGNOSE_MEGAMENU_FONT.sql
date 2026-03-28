-- ═══════════════════════════════════════════════════════════════════════════
-- 🔍 DIAGNÓSTICO: Verificar mainTitleFontSize no menu_items
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Ver o megamenu_config completo do item "Sobre a BemDito"
SELECT 
  id,
  label,
  megamenu_config
FROM menu_items
WHERE label ILIKE '%sobre%';

-- 2. Extrair APENAS a coluna (mais legível)
SELECT 
  label,
  megamenu_config->'column' AS column_config
FROM menu_items
WHERE label ILIKE '%sobre%';

-- 3. Ver valores específicos de tipografia
SELECT 
  label,
  megamenu_config->'column'->>'mainTitleFontSize' AS main_title_font_size,
  megamenu_config->'column'->>'mainTitle' AS main_title_text
FROM menu_items
WHERE label ILIKE '%sobre%';

-- 4. Verificar se o UUID do token existe na tabela design_tokens
SELECT 
  dt.id,
  dt.name,
  dt.label,
  dt.value,
  dt.category
FROM design_tokens dt
WHERE dt.id = (
  SELECT (megamenu_config->'column'->>'mainTitleFontSize')::uuid
  FROM menu_items
  WHERE label ILIKE '%sobre%'
  LIMIT 1
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ✅ Se o token aparecer com name e value corretos:
--    → O problema está no MegamenuContent.tsx (verificar logs do console)
--
-- ❌ Se o token não existir ou tiver UUID incorreto:
--    → Execute o UPDATE abaixo para forçar o token correto
-- ═══════════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════════════════════
-- 🔧 LISTAR TODOS OS TOKENS DE TIPOGRAFIA DISPONÍVEIS
-- ═══════════════════════════════════════════════════════════════════════════

SELECT 
  id,
  name,
  label,
  value
FROM design_tokens
WHERE category = 'typography'
ORDER BY "order";
