-- ═══════════════════════════════════════════════════════════════════════════
-- 🔍 ENCONTRAR TOKEN COM 6REM
-- ═══════════════════════════════════════════════════════════════════════════

SELECT 
  id,
  name,
  label,
  value,
  category
FROM design_tokens
WHERE category = 'typography'
  AND value::text ILIKE '%6rem%';

-- ═══════════════════════════════════════════════════════════════════════════
-- 📋 LISTAR TODOS OS TOKENS DE TIPOGRAFIA (ordenados por tamanho)
-- ═══════════════════════════════════════════════════════════════════════════

SELECT 
  id,
  name,
  label,
  value->'size' as font_size,
  value
FROM design_tokens
WHERE category = 'typography'
ORDER BY (value->>'size')::text DESC;
