-- ============================================================================
-- DATABASE VERIFICATION SCRIPT
-- Run this to check if seed data was loaded correctly
-- ============================================================================

-- Check if tables exist
SELECT
  '✅ Tables Check' as check_type,
  COUNT(*) as table_count,
  'Expected: 7' as expected
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'sites',
    'pages',
    'page_sections',
    'section_templates',
    'section_variants',
    'section_items',
    'global_blocks'
  );

-- Check data counts
SELECT
  '📊 Data Counts' as check_type,
  (SELECT COUNT(*) FROM sites) as sites,
  (SELECT COUNT(*) FROM section_templates) as templates,
  (SELECT COUNT(*) FROM section_variants) as variants,
  (SELECT COUNT(*) FROM pages) as pages,
  (SELECT COUNT(*) FROM page_sections) as sections,
  (SELECT COUNT(*) FROM section_items) as items,
  (SELECT COUNT(*) FROM global_blocks) as blocks;

-- Check home page specifically
SELECT
  '🏠 Home Page Check' as check_type,
  p.id,
  p.title,
  p.slug,
  p.status,
  s.name as site_name,
  (SELECT COUNT(*) FROM page_sections WHERE page_id = p.id) as sections_count,
  CASE
    WHEN p.status = 'published' THEN '✅'
    ELSE '❌ NOT PUBLISHED'
  END as status_check
FROM pages p
LEFT JOIN sites s ON s.id = p.site_id
WHERE p.slug = '/';

-- List all sections of home page
SELECT
  '📑 Home Sections' as check_type,
  ps.order_index,
  st.slug as template,
  COALESCE(sv.slug, 'default') as variant,
  (SELECT COUNT(*) FROM section_items WHERE section_id = ps.id) as items_count,
  ps.visible
FROM page_sections ps
JOIN pages p ON p.id = ps.page_id
JOIN section_templates st ON st.id = ps.template_id
LEFT JOIN section_variants sv ON sv.id = ps.variant_id
WHERE p.slug = '/'
ORDER BY ps.order_index;

-- Check global blocks
SELECT
  '🌐 Global Blocks' as check_type,
  type,
  slug,
  name,
  visible
FROM global_blocks
ORDER BY type;

-- Final summary
SELECT
  '📝 Summary' as check_type,
  CASE
    WHEN (SELECT COUNT(*) FROM sites) >= 1
     AND (SELECT COUNT(*) FROM section_templates) >= 12
     AND (SELECT COUNT(*) FROM pages WHERE slug = '/' AND status = 'published') = 1
     AND (SELECT COUNT(*) FROM page_sections ps JOIN pages p ON p.id = ps.page_id WHERE p.slug = '/') >= 12
     AND (SELECT COUNT(*) FROM global_blocks) >= 5
    THEN '✅ ALL CHECKS PASSED - Database is ready!'
    ELSE '❌ ISSUES FOUND - Check results above'
  END as result;
