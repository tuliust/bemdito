-- ═══════════════════════════════════════════════════════════════════════════
-- Migration: Adicionar Campos de Opacidade aos Cards do Megamenu
-- Data: 2026-02-24
-- Descrição: Adiciona campos bg_opacity e border_opacity à tabela menu_cards
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- 1. Adicionar colunas de opacidade
-- ─────────────────────────────────────────────────────────────────────────

-- Opacidade do background (0-100%)
ALTER TABLE menu_cards 
ADD COLUMN IF NOT EXISTS bg_opacity INTEGER DEFAULT 100;

-- Opacidade da borda (0-100%)
ALTER TABLE menu_cards 
ADD COLUMN IF NOT EXISTS border_opacity INTEGER DEFAULT 100;

-- ─────────────────────────────────────────────────────────────────────────
-- 2. Adicionar constraints de validação
-- ─────────────────────────────────────────────────────────────────────────

-- Validar range de bg_opacity (0-100)
ALTER TABLE menu_cards
ADD CONSTRAINT menu_cards_bg_opacity_range 
CHECK (bg_opacity >= 0 AND bg_opacity <= 100);

-- Validar range de border_opacity (0-100)
ALTER TABLE menu_cards
ADD CONSTRAINT menu_cards_border_opacity_range 
CHECK (border_opacity >= 0 AND border_opacity <= 100);

-- ─────────────────────────────────────────────────────────────────────────
-- 3. Comentários explicativos
-- ─────────────────────────────────────────────────────────────────────────

COMMENT ON COLUMN menu_cards.bg_opacity IS 
'Opacidade do background do card (0-100%). Combinado com bg_color_token para criar rgba().';

COMMENT ON COLUMN menu_cards.border_opacity IS 
'Opacidade da borda do card (0-100%). Combinado com border_color_token para criar rgba().';

-- ─────────────────────────────────────────────────────────────────────────
-- 4. Verificação pós-migration
-- ─────────────────────────────────────────────────────────────────────────

-- Verificar se as colunas foram criadas
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'menu_cards' 
  AND column_name IN ('bg_opacity', 'border_opacity')
ORDER BY ordinal_position;

-- Verificar constraints
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'menu_cards' 
  AND constraint_name LIKE '%opacity%';

-- Verificar contagem de cards
SELECT COUNT(*) as total_cards FROM menu_cards;

-- ═══════════════════════════════════════════════════════════════════════════
-- FIM DA MIGRATION
-- ═══════════════════════════════════════════════════════════════════════════
