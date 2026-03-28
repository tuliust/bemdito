-- ═══════════════════════════════════════════════════════════════════════════
-- 🔧 CRIAR TOKEN TIPOGRÁFICO DE 6REM (Super Título)
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Verificar se já existe um token com 6rem
SELECT id, name, label, value
FROM design_tokens
WHERE category = 'typography'
  AND value::text ILIKE '%6rem%';

-- Se não existir, criar novo token:

INSERT INTO design_tokens (
  id,
  category,
  name,
  label,
  value,
  "order",
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'typography',
  'super-title',  -- Nome único
  'Super Título (6rem)',
  jsonb_build_object(
    'size', '6rem',
    'weight', 700,
    'lineHeight', 1.1,
    'fontFamily', 'Poppins'
  ),
  1,  -- Primeiro na lista (maior tamanho)
  now(),
  now()
)
ON CONFLICT (category, name) DO UPDATE SET
  value = EXCLUDED.value,
  label = EXCLUDED.label,
  updated_at = now()
RETURNING id, name, label, value;

-- ═══════════════════════════════════════════════════════════════════════════
-- ✅ Após executar, copie o UUID retornado e use-o para atualizar o megamenu:
--
-- UPDATE menu_items
-- SET megamenu_config = jsonb_set(
--   megamenu_config,
--   '{column,mainTitleFontSize}',
--   '"UUID_AQUI"'::jsonb
-- )
-- WHERE label ILIKE '%prazer%';
-- ═══════════════════════════════════════════════════════════════════════════
