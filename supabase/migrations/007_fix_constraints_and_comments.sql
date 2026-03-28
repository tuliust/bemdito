-- =====================================================
-- Migration 007: Corrigir Comentários e Constraints
-- =====================================================
-- Data: 2026-02-05
-- Descrição: Correção dos erros da migration 006
-- =====================================================

-- 1. Adicionar comentários nas colunas corretas de menu_cards
-- As colunas corretas são tab_bg_color_token e tab_border_color_token (não tabs_*)
COMMENT ON COLUMN menu_cards.tab_bg_color_token IS 'UUID referenciando design_tokens.id (não o name)';
COMMENT ON COLUMN menu_cards.tab_border_color_token IS 'UUID referenciando design_tokens.id (não o name)';

-- 2. Adicionar constraints de unicidade (sintaxe correta para PostgreSQL)
-- PostgreSQL não suporta IF NOT EXISTS em ADD CONSTRAINT
-- Precisamos verificar primeiro se a constraint já existe

-- Constraint para slug único em pages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_page_slug'
  ) THEN
    ALTER TABLE pages ADD CONSTRAINT unique_page_slug UNIQUE (slug);
    RAISE NOTICE 'Constraint unique_page_slug criada com sucesso';
  ELSE
    RAISE NOTICE 'Constraint unique_page_slug já existe';
  END IF;
END $$;

-- Constraint para (name, category) único em design_tokens
-- Nota: Esta já existe pela definição UNIQUE(category, name) na tabela
-- Mas vamos verificar e criar com nome explícito se necessário
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_token_name_category'
  ) THEN
    -- Verifica se já existe constraint com outro nome
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      WHERE t.relname = 'design_tokens' 
      AND c.contype = 'u'
      AND array_length(c.conkey, 1) = 2
    ) THEN
      ALTER TABLE design_tokens 
      ADD CONSTRAINT unique_token_name_category UNIQUE (name, category);
      RAISE NOTICE 'Constraint unique_token_name_category criada com sucesso';
    ELSE
      RAISE NOTICE 'Constraint de unicidade (name, category) já existe com outro nome';
    END IF;
  ELSE
    RAISE NOTICE 'Constraint unique_token_name_category já existe';
  END IF;
END $$;

-- 3. Verificar estrutura da tabela menu_cards
-- Esta query apenas mostra informações, não altera nada
DO $$
DECLARE
  col_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_name = 'menu_cards'
  AND column_name LIKE '%color_token';
  
  RAISE NOTICE 'Tabela menu_cards possui % colunas *_color_token', col_count;
END $$;

-- 4. Listar todas as colunas de menu_cards (apenas para verificação)
DO $$
DECLARE
  col_record RECORD;
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'COLUNAS DA TABELA menu_cards:';
  RAISE NOTICE '==============================================';
  
  FOR col_record IN (
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'menu_cards'
    ORDER BY ordinal_position
  )
  LOOP
    RAISE NOTICE '- %: %', col_record.column_name, col_record.data_type;
  END LOOP;
  
  RAISE NOTICE '==============================================';
END $$;

-- 5. Verificar constraints existentes
DO $$
DECLARE
  constraint_record RECORD;
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'CONSTRAINTS CRIADAS:';
  RAISE NOTICE '==============================================';
  
  FOR constraint_record IN (
    SELECT 
      tc.table_name,
      tc.constraint_name,
      tc.constraint_type
    FROM information_schema.table_constraints tc
    WHERE tc.table_schema = 'public'
    AND tc.table_name IN ('pages', 'design_tokens')
    AND tc.constraint_type IN ('UNIQUE', 'PRIMARY KEY')
    ORDER BY tc.table_name, tc.constraint_name
  )
  LOOP
    RAISE NOTICE '- %.%: %', 
      constraint_record.table_name, 
      constraint_record.constraint_name, 
      constraint_record.constraint_type;
  END LOOP;
  
  RAISE NOTICE '==============================================';
END $$;

-- 6. Verificar índices criados na migration 006
DO $$
DECLARE
  index_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%';
  
  RAISE NOTICE 'Total de índices criados: %', index_count;
END $$;

-- =====================================================
-- Verificações Finais e Estatísticas
-- =====================================================

DO $$
DECLARE
  dt_count INTEGER;
  mc_count INTEGER;
  mi_count INTEGER;
  p_count INTEGER;
  s_count INTEGER;
  ma_count INTEGER;
  idx_count INTEGER;
BEGIN
  -- Contagem de registros
  SELECT COUNT(*) INTO dt_count FROM design_tokens;
  SELECT COUNT(*) INTO mc_count FROM menu_cards;
  SELECT COUNT(*) INTO mi_count FROM menu_items;
  SELECT COUNT(*) INTO p_count FROM pages;
  SELECT COUNT(*) INTO s_count FROM sections;
  SELECT COUNT(*) INTO ma_count FROM media_assets;
  
  -- Contagem de índices
  SELECT COUNT(*) INTO idx_count
  FROM pg_indexes
  WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%';
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'ESTATÍSTICAS FINAIS - MIGRATION 007:';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Registros:';
  RAISE NOTICE '  - Design Tokens: %', dt_count;
  RAISE NOTICE '  - Menu Cards: %', mc_count;
  RAISE NOTICE '  - Menu Items: %', mi_count;
  RAISE NOTICE '  - Pages: %', p_count;
  RAISE NOTICE '  - Sections: %', s_count;
  RAISE NOTICE '  - Media Assets: %', ma_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Infraestrutura:';
  RAISE NOTICE '  - Índices personalizados: %', idx_count;
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Migration 007 concluída com sucesso! ✓';
  RAISE NOTICE '==============================================';
END $$;

-- =====================================================
-- FINAL
-- =====================================================
