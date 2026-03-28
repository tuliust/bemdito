-- =====================================================
-- Migration 008: Correção de Consistência de Dados
-- =====================================================
-- Data: 2026-02-05
-- Descrição: Corrige inconsistências entre migrations, 
--            remove duplicatas e garante integridade
-- =====================================================

-- =====================================================
-- PARTE 1: CORREÇÃO DE PÁGINAS DUPLICADAS
-- =====================================================

-- 1.1 Identificar e manter apenas a versão mais recente de cada slug
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  -- Contar duplicatas antes
  SELECT COUNT(*) - COUNT(DISTINCT slug) INTO duplicate_count
  FROM pages;
  
  IF duplicate_count > 0 THEN
    RAISE NOTICE '⚠️  Encontradas % páginas duplicadas', duplicate_count;
    
    -- Manter apenas o registro mais recente de cada slug
    DELETE FROM pages p1
    WHERE EXISTS (
      SELECT 1 FROM pages p2
      WHERE p2.slug = p1.slug
      AND p2.created_at > p1.created_at
    );
    
    RAISE NOTICE '✅ Duplicatas removidas';
  ELSE
    RAISE NOTICE '✅ Nenhuma duplicata encontrada';
  END IF;
END $$;

-- 1.2 Garantir que a página home (/) existe e está correta
INSERT INTO pages (name, slug, title, meta_title, meta_description, meta_keywords, published)
VALUES (
  'Página Inicial',
  '/',
  'BemDito - Transformando Ideias em Realidade',
  'BemDito - Soluções Digitais Inovadoras',
  'Transforme sua marca com nossa expertise em branding, estratégia e conteúdo digital.',
  'branding, marketing digital, estratégia, conteúdo',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  published = EXCLUDED.published,
  updated_at = NOW();

-- =====================================================
-- PARTE 2: VERIFICAR E LIMPAR REFERÊNCIAS ÓRFÃS
-- =====================================================

-- 2.1 Remover page_sections que referenciam seções inexistentes
DO $$
DECLARE
  orphan_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO orphan_count
  FROM page_sections ps
  WHERE NOT EXISTS (
    SELECT 1 FROM sections s WHERE s.id = ps.section_id
  );
  
  IF orphan_count > 0 THEN
    RAISE NOTICE '⚠️  Encontradas % page_sections órfãs', orphan_count;
    
    DELETE FROM page_sections ps
    WHERE NOT EXISTS (
      SELECT 1 FROM sections s WHERE s.id = ps.section_id
    );
    
    RAISE NOTICE '✅ page_sections órfãs removidas';
  ELSE
    RAISE NOTICE '✅ Nenhuma page_section órfã';
  END IF;
END $$;

-- 2.2 Remover page_sections que referenciam páginas inexistentes
DO $$
DECLARE
  orphan_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO orphan_count
  FROM page_sections ps
  WHERE NOT EXISTS (
    SELECT 1 FROM pages p WHERE p.id = ps.page_id
  );
  
  IF orphan_count > 0 THEN
    RAISE NOTICE '⚠️  Encontradas % page_sections órfãs (página inexistente)', orphan_count;
    
    DELETE FROM page_sections ps
    WHERE NOT EXISTS (
      SELECT 1 FROM pages p WHERE p.id = ps.page_id
    );
    
    RAISE NOTICE '✅ page_sections órfãs removidas';
  ELSE
    RAISE NOTICE '✅ Nenhuma page_section órfã por página';
  END IF;
END $$;

-- 2.3 Remover section_cards que referenciam seções inexistentes
DO $$
DECLARE
  orphan_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO orphan_count
  FROM section_cards sc
  WHERE NOT EXISTS (
    SELECT 1 FROM sections s WHERE s.id = sc.section_id
  );
  
  IF orphan_count > 0 THEN
    RAISE NOTICE '⚠️  Encontradas % section_cards órfãs', orphan_count;
    
    DELETE FROM section_cards sc
    WHERE NOT EXISTS (
      SELECT 1 FROM sections s WHERE s.id = sc.section_id
    );
    
    RAISE NOTICE '✅ section_cards órfãs removidas';
  ELSE
    RAISE NOTICE '✅ Nenhuma section_card órfã';
  END IF;
END $$;

-- 2.4 Remover section_cards que referenciam cards inexistentes
DO $$
DECLARE
  orphan_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO orphan_count
  FROM section_cards sc
  WHERE NOT EXISTS (
    SELECT 1 FROM cards c WHERE c.id = sc.card_id
  );
  
  IF orphan_count > 0 THEN
    RAISE NOTICE '⚠️  Encontradas % section_cards órfãs (card inexistente)', orphan_count;
    
    DELETE FROM section_cards sc
    WHERE NOT EXISTS (
      SELECT 1 FROM cards c WHERE c.id = sc.card_id
    );
    
    RAISE NOTICE '✅ section_cards órfãs removidas';
  ELSE
    RAISE NOTICE '✅ Nenhuma section_card órfã por card';
  END IF;
END $$;

-- =====================================================
-- PARTE 3: VERIFICAR INTEGRIDADE DE MENU
-- =====================================================

-- 3.1 Garantir que menu_items não têm duplicatas de 'order'
DO $$
DECLARE
  item_record RECORD;
  new_order INTEGER := 0;
BEGIN
  -- Reordenar todos os itens sequencialmente
  FOR item_record IN (
    SELECT id FROM menu_items ORDER BY "order", created_at
  )
  LOOP
    UPDATE menu_items 
    SET "order" = new_order 
    WHERE id = item_record.id;
    new_order := new_order + 1;
  END LOOP;
  
  RAISE NOTICE '✅ Menu items reordenados (% itens)', new_order;
END $$;

-- =====================================================
-- PARTE 4: VERIFICAR DESIGN TOKENS
-- =====================================================

-- 4.1 Garantir que não há tokens duplicados
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) - COUNT(DISTINCT (category, name)) INTO duplicate_count
  FROM design_tokens;
  
  IF duplicate_count > 0 THEN
    RAISE NOTICE '⚠️  Encontrados % tokens duplicados', duplicate_count;
    
    -- Manter apenas o mais recente de cada (category, name)
    DELETE FROM design_tokens t1
    WHERE EXISTS (
      SELECT 1 FROM design_tokens t2
      WHERE t2.category = t1.category
      AND t2.name = t1.name
      AND t2.created_at > t1.created_at
    );
    
    RAISE NOTICE '✅ Tokens duplicados removidos';
  ELSE
    RAISE NOTICE '✅ Nenhum token duplicado';
  END IF;
END $$;

-- =====================================================
-- PARTE 5: CRIAR VIEWS ÚTEIS PARA DIAGNÓSTICO
-- =====================================================

-- 5.1 View para contar registros em todas as tabelas
CREATE OR REPLACE VIEW v_database_stats AS
SELECT 'design_tokens' as tabela, COUNT(*) as total FROM design_tokens
UNION ALL
SELECT 'menu_cards', COUNT(*) FROM menu_cards
UNION ALL
SELECT 'menu_items', COUNT(*) FROM menu_items
UNION ALL
SELECT 'pages', COUNT(*) FROM pages
UNION ALL
SELECT 'sections', COUNT(*) FROM sections
UNION ALL
SELECT 'cards', COUNT(*) FROM cards
UNION ALL
SELECT 'page_sections', COUNT(*) FROM page_sections
UNION ALL
SELECT 'section_cards', COUNT(*) FROM section_cards
UNION ALL
SELECT 'media_assets', COUNT(*) FROM media_assets
ORDER BY tabela;

-- 5.2 View para listar páginas com suas seções
CREATE OR REPLACE VIEW v_pages_with_sections AS
SELECT 
  p.id as page_id,
  p.name as page_name,
  p.slug,
  p.published as page_published,
  COUNT(ps.id) as sections_count,
  ARRAY_AGG(s.name ORDER BY ps.order_index) FILTER (WHERE s.name IS NOT NULL) as section_names
FROM pages p
LEFT JOIN page_sections ps ON ps.page_id = p.id
LEFT JOIN sections s ON s.id = ps.section_id
GROUP BY p.id, p.name, p.slug, p.published
ORDER BY p.slug;

-- 5.3 View para listar seções órfãs (não usadas em nenhuma página)
CREATE OR REPLACE VIEW v_orphan_sections AS
SELECT 
  s.id,
  s.name,
  s.type,
  s.global,
  s.published,
  s.created_at
FROM sections s
WHERE NOT EXISTS (
  SELECT 1 FROM page_sections ps WHERE ps.section_id = s.id
)
AND s.global = false
ORDER BY s.created_at DESC;

-- =====================================================
-- PARTE 6: ESTATÍSTICAS FINAIS
-- =====================================================

DO $$
DECLARE
  stats_record RECORD;
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'ESTATÍSTICAS DO BANCO DE DADOS:';
  RAISE NOTICE '==============================================';
  
  FOR stats_record IN (SELECT * FROM v_database_stats)
  LOOP
    RAISE NOTICE '  %-20s: %', stats_record.tabela, stats_record.total;
  END LOOP;
  
  RAISE NOTICE '==============================================';
END $$;

-- Mostrar páginas com suas seções
DO $$
DECLARE
  page_record RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'PÁGINAS E SUAS SEÇÕES:';
  RAISE NOTICE '==============================================';
  
  FOR page_record IN (SELECT * FROM v_pages_with_sections)
  LOOP
    RAISE NOTICE 'Página: % (slug: %) - % seções', 
      page_record.page_name, 
      page_record.slug,
      COALESCE(page_record.sections_count, 0);
  END LOOP;
  
  RAISE NOTICE '==============================================';
END $$;

-- Verificar seções órfãs
DO $$
DECLARE
  orphan_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO orphan_count FROM v_orphan_sections;
  
  RAISE NOTICE '';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'VERIFICAÇÃO DE INTEGRIDADE:';
  RAISE NOTICE '==============================================';
  
  IF orphan_count > 0 THEN
    RAISE NOTICE '⚠️  % seções não-globais sem uso encontradas', orphan_count;
  ELSE
    RAISE NOTICE '✅ Nenhuma seção órfã encontrada';
  END IF;
  
  RAISE NOTICE '==============================================';
END $$;

-- =====================================================
-- PARTE 7: MENSAGEM FINAL
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '✅ MIGRATION 008 CONCLUÍDA COM SUCESSO!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Correções aplicadas:';
  RAISE NOTICE '  ✓ Páginas duplicadas removidas';
  RAISE NOTICE '  ✓ Referências órfãs limpas';
  RAISE NOTICE '  ✓ Menu items reordenados';
  RAISE NOTICE '  ✓ Design tokens verificados';
  RAISE NOTICE '  ✓ Views de diagnóstico criadas';
  RAISE NOTICE '';
  RAISE NOTICE 'Views disponíveis para consulta:';
  RAISE NOTICE '  - v_database_stats';
  RAISE NOTICE '  - v_pages_with_sections';
  RAISE NOTICE '  - v_orphan_sections';
  RAISE NOTICE '==============================================';
END $$;
