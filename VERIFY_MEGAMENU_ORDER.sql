-- ============================================================
-- VERIFICAÇÃO: Ordem dos Cards em Todos os Megamenus
-- Data: 2026-02-28
-- ============================================================

-- 1️⃣ Ver todos os menu items com megamenu e suas configurações
SELECT 
  mi.id,
  mi.label as menu_label,
  mi.megamenu_config->'column'->>'title' as megamenu_title,
  mi.megamenu_config->'column'->'card_ids' as card_ids_array,
  jsonb_array_length(mi.megamenu_config->'column'->'card_ids') as total_cards
FROM menu_items mi
WHERE mi.megamenu_config IS NOT NULL
  AND mi.megamenu_config->'column'->'card_ids' IS NOT NULL
ORDER BY mi.order;

-- 2️⃣ Ver os cards de cada megamenu na ordem salva
SELECT 
  mi.label as menu_label,
  mc.title as card_title,
  mc.subtitle as card_subtitle,
  ordinality as posicao_na_ordem
FROM menu_items mi
CROSS JOIN LATERAL jsonb_array_elements_text(mi.megamenu_config->'column'->'card_ids') WITH ORDINALITY AS card_id
JOIN menu_cards mc ON mc.id = card_id::uuid
WHERE mi.megamenu_config IS NOT NULL
ORDER BY mi.order, ordinality;

-- 3️⃣ Verificar se há algum card_ids vazio ou NULL
SELECT 
  mi.label,
  mi.megamenu_config->'column'->'card_ids' as card_ids,
  CASE 
    WHEN mi.megamenu_config->'column'->'card_ids' IS NULL THEN '❌ NULL'
    WHEN jsonb_array_length(mi.megamenu_config->'column'->'card_ids') = 0 THEN '⚠️ Vazio'
    ELSE '✅ OK'
  END as status
FROM menu_items mi
WHERE mi.megamenu_config IS NOT NULL;

-- 4️⃣ Verificar estrutura do megamenu_config
SELECT 
  mi.label,
  mi.megamenu_config ? 'column' as tem_column,
  mi.megamenu_config ? 'columns' as tem_columns_deprecated,
  mi.megamenu_config->>'bgColor' as bg_color,
  mi.megamenu_config->>'mediaPosition' as media_position,
  CASE 
    WHEN mi.megamenu_config ? 'column' THEN '✅ Estrutura nova (column)'
    WHEN mi.megamenu_config ? 'columns' THEN '⚠️ Estrutura antiga (columns)'
    ELSE '❌ Sem coluna'
  END as tipo_estrutura
FROM menu_items mi
WHERE mi.megamenu_config IS NOT NULL;

-- 5️⃣ Exemplo de UPDATE para corrigir ordem manualmente (se necessário)
-- DESCOMENTE E AJUSTE os IDs conforme necessário:
/*
UPDATE menu_items
SET megamenu_config = jsonb_set(
  megamenu_config,
  '{column,card_ids}',
  '["id-card-1", "id-card-2", "id-card-3", "id-card-4"]'::jsonb
)
WHERE label = 'Nome do Menu Item';
*/
