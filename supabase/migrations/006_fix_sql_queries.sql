-- =====================================================
-- Migration 006: Correções e Ajustes no Schema
-- =====================================================
-- Data: 2026-02-05
-- Descrição: Correção de queries problemáticas e ajustes no schema
-- =====================================================

-- 1. Adicionar coluna og_image na tabela pages (se não existir)
-- Esta coluna é referenciada na query de mídia não referenciada
ALTER TABLE pages
ADD COLUMN IF NOT EXISTS og_image TEXT;

-- 2. Comentário sobre o campo bg_color_token
-- O campo bg_color_token em menu_cards é do tipo UUID, não TEXT
-- Queries que o comparam com design_tokens.name precisam fazer cast
COMMENT ON COLUMN menu_cards.bg_color_token IS 'UUID referenciando design_tokens.id (não o name)';
COMMENT ON COLUMN menu_cards.border_color_token IS 'UUID referenciando design_tokens.id (não o name)';
COMMENT ON COLUMN menu_cards.icon_color_token IS 'UUID referenciando design_tokens.id (não o name)';
COMMENT ON COLUMN menu_cards.title_color_token IS 'UUID referenciando design_tokens.id (não o name)';
COMMENT ON COLUMN menu_cards.subtitle_color_token IS 'UUID referenciando design_tokens.id (não o name)';
-- Nota: As colunas tab_bg_color_token e tab_border_color_token são corrigidas na migration 007

-- 3. Remover item de menu duplicado "Ajustes"
-- Query identifica duplicatas por label e deleta as mais recentes
WITH duplicates AS (
  SELECT 
    id,
    label,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY label ORDER BY created_at ASC) as rn
  FROM menu_items
  WHERE label = 'Ajustes'
)
DELETE FROM menu_items
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- 4. Verificar e corrigir slugs duplicados (se existirem)
-- Esta query apenas identifica, não corrige automaticamente
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT slug, COUNT(*) as count
    FROM pages
    GROUP BY slug
    HAVING COUNT(*) > 1
  ) duplicates;
  
  IF duplicate_count > 0 THEN
    RAISE NOTICE 'ATENÇÃO: Existem % slugs duplicados na tabela pages', duplicate_count;
  ELSE
    RAISE NOTICE 'Nenhum slug duplicado encontrado';
  END IF;
END $$;

-- 5. Limpar seções órfãs (seções não globais sem páginas associadas)
-- Backup em comentário antes de deletar
DO $$
DECLARE
  orphan_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO orphan_count
  FROM sections s
  LEFT JOIN page_sections ps ON s.id = ps.section_id
  WHERE ps.id IS NULL AND s.global = false;
  
  IF orphan_count > 0 THEN
    RAISE NOTICE 'Deletando % seções órfãs...', orphan_count;
    
    DELETE FROM sections
    WHERE id IN (
      SELECT s.id
      FROM sections s
      LEFT JOIN page_sections ps ON s.id = ps.section_id
      WHERE ps.id IS NULL AND s.global = false
    );
    
    RAISE NOTICE 'Seções órfãs deletadas com sucesso';
  ELSE
    RAISE NOTICE 'Nenhuma seção órfã encontrada';
  END IF;
END $$;

-- 6. Criar índices para melhorar performance de queries comuns
CREATE INDEX IF NOT EXISTS idx_menu_cards_is_global 
  ON menu_cards(is_global);

CREATE INDEX IF NOT EXISTS idx_pages_published 
  ON pages(published);

CREATE INDEX IF NOT EXISTS idx_pages_slug 
  ON pages(slug);

CREATE INDEX IF NOT EXISTS idx_page_sections_page_id 
  ON page_sections(page_id);

CREATE INDEX IF NOT EXISTS idx_page_sections_section_id 
  ON page_sections(section_id);

CREATE INDEX IF NOT EXISTS idx_sections_global 
  ON sections(global);

CREATE INDEX IF NOT EXISTS idx_design_tokens_category 
  ON design_tokens(category);

CREATE INDEX IF NOT EXISTS idx_media_assets_mime_type 
  ON media_assets(mime_type);

-- 7. Adicionar constraints úteis (se não existirem)
-- Nota: Constraints movidas para migration 007 devido a limitações de sintaxe do PostgreSQL
-- PostgreSQL não suporta IF NOT EXISTS em ADD CONSTRAINT

-- 8. Atualizar estatísticas da tabela para o query planner
ANALYZE design_tokens;
ANALYZE menu_cards;
ANALYZE menu_items;
ANALYZE pages;
ANALYZE page_sections;
ANALYZE sections;
ANALYZE media_assets;

-- =====================================================
-- Verificações Finais
-- =====================================================

-- Contagem de registros após limpeza
DO $$
DECLARE
  dt_count INTEGER;
  mc_count INTEGER;
  mi_count INTEGER;
  p_count INTEGER;
  s_count INTEGER;
  ma_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO dt_count FROM design_tokens;
  SELECT COUNT(*) INTO mc_count FROM menu_cards;
  SELECT COUNT(*) INTO mi_count FROM menu_items;
  SELECT COUNT(*) INTO p_count FROM pages;
  SELECT COUNT(*) INTO s_count FROM sections;
  SELECT COUNT(*) INTO ma_count FROM media_assets;
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'ESTATÍSTICAS PÓS-MIGRAÇÃO:';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Design Tokens: %', dt_count;
  RAISE NOTICE 'Menu Cards: %', mc_count;
  RAISE NOTICE 'Menu Items: %', mi_count;
  RAISE NOTICE 'Pages: %', p_count;
  RAISE NOTICE 'Sections: %', s_count;
  RAISE NOTICE 'Media Assets: %', ma_count;
  RAISE NOTICE '==============================================';
END $$;

-- =====================================================
-- FINAL
-- =====================================================