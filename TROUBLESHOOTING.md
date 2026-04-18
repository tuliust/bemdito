# 🔍 Troubleshooting Guide

## Error: "Home page not found in database"

Este erro significa que a home page não foi inserida no banco de dados ou não está acessível.

### ✅ Checklist de Diagnóstico

Execute estas queries no Supabase SQL Editor para diagnosticar:

#### 1. Verificar se as tabelas existem

```sql
SELECT table_name 
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
  )
ORDER BY table_name;
```

**Resultado esperado**: 7 linhas (todas as tabelas listadas)

---

#### 2. Verificar se há algum site

```sql
SELECT id, name, domain, status, created_at
FROM sites
LIMIT 5;
```

**Resultado esperado**: 1 site ("Plataforma de Bem-Estar Corporativo")

**Se vazio**: Execute `database-seed-fixed.sql` primeiro

---

#### 3. Verificar se os templates foram criados

```sql
SELECT slug, name, category
FROM section_templates
ORDER BY slug;
```

**Resultado esperado**: 12 templates

**Se vazio**: Execute `database-seed-fixed.sql`

---

#### 4. Verificar se a home page existe

```sql
SELECT id, title, slug, status, site_id, created_at
FROM pages
WHERE slug = '/';
```

**Resultado esperado**: 1 página com status "published"

**Se vazio**: O INSERT da página falhou. Veja diagnóstico abaixo.

---

#### 5. Verificar quantas seções a home tem

```sql
SELECT 
  ps.id,
  ps.order_index,
  st.slug as template_slug,
  sv.slug as variant_slug,
  ps.visible
FROM page_sections ps
JOIN pages p ON p.id = ps.page_id
JOIN section_templates st ON st.id = ps.template_id
LEFT JOIN section_variants sv ON sv.id = ps.variant_id
WHERE p.slug = '/'
ORDER BY ps.order_index;
```

**Resultado esperado**: 12 seções (order_index de 1 a 12)

---

#### 6. Verificar os global blocks

```sql
SELECT type, slug, name, visible
FROM global_blocks
ORDER BY type;
```

**Resultado esperado**: 5 global blocks

---

## 🔧 Soluções Comuns

### Problema: Tabelas não existem

**Solução**: Execute o schema primeiro

1. Abra: https://supabase.com/dashboard/project/ttxaaagqtihwapvtgxtc/sql
2. Copie e execute: `docs/SUPABASE_SCHEMA.sql`
3. Depois execute: `database-seed-fixed.sql`

---

### Problema: Tabelas existem mas site não foi criado

**Causa**: O INSERT pode ter falhado por constraint violation

**Solução**: Delete tudo e reinsira

```sql
-- Limpar dados existentes
TRUNCATE TABLE 
  section_item_breakpoint_overrides,
  section_items,
  section_breakpoint_overrides,
  page_sections,
  pages,
  section_variants,
  section_templates,
  global_blocks,
  navigation_items,
  navigation_menus,
  site_settings,
  sites
CASCADE;

-- Agora execute database-seed-fixed.sql novamente
```

---

### Problema: Home page existe mas erro persiste

**Causa possível**: A query está procurando em site errado ou status incorreto

**Debug**: Veja exatamente o que está no banco

```sql
SELECT 
  p.id,
  p.title,
  p.slug,
  p.status,
  p.site_id,
  s.name as site_name,
  (SELECT COUNT(*) FROM page_sections WHERE page_id = p.id) as section_count
FROM pages p
LEFT JOIN sites s ON s.id = p.site_id
WHERE p.slug = '/';
```

Se `status != 'published'`, atualize:

```sql
UPDATE pages 
SET status = 'published', published_at = NOW()
WHERE slug = '/';
```

---

### Problema: Tudo existe mas ainda não carrega

**Causa possível**: Problema de permissões RLS no Supabase

**Solução**: Desabilite RLS temporariamente para diagnóstico

```sql
-- APENAS PARA DIAGNÓSTICO - NÃO USE EM PRODUÇÃO
ALTER TABLE sites DISABLE ROW LEVEL SECURITY;
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE section_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE section_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE section_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_blocks DISABLE ROW LEVEL SECURITY;
```

Agora teste novamente. Se funcionar, o problema é RLS.

---

## 🎯 Script Completo de Reset

Se quiser começar do zero:

```sql
-- 1. Limpar tudo
TRUNCATE TABLE 
  section_item_breakpoint_overrides,
  section_items,
  section_breakpoint_overrides,
  page_sections,
  pages,
  section_variants,
  section_templates,
  global_blocks,
  navigation_items,
  navigation_menus,
  media_variants,
  media_assets,
  media_folders,
  site_settings,
  sites
CASCADE;

-- 2. Desabilitar RLS (apenas para desenvolvimento)
ALTER TABLE sites DISABLE ROW LEVEL SECURITY;
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE section_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE section_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE section_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_blocks DISABLE ROW LEVEL SECURITY;

-- 3. Agora execute database-seed-fixed.sql

-- 4. Verifique
SELECT 
  (SELECT COUNT(*) FROM sites) as sites_count,
  (SELECT COUNT(*) FROM section_templates) as templates_count,
  (SELECT COUNT(*) FROM section_variants) as variants_count,
  (SELECT COUNT(*) FROM pages) as pages_count,
  (SELECT COUNT(*) FROM page_sections) as sections_count,
  (SELECT COUNT(*) FROM section_items) as items_count,
  (SELECT COUNT(*) FROM global_blocks) as blocks_count;
```

**Resultado esperado**:
- sites_count: 1
- templates_count: 12
- variants_count: 3
- pages_count: 1
- sections_count: 12
- items_count: ~30
- blocks_count: 5

---

## 📞 Ainda Com Problema?

Se após seguir todos os passos o erro persistir:

1. Copie o resultado da query de verificação:
```sql
SELECT 
  (SELECT COUNT(*) FROM sites) as sites_count,
  (SELECT COUNT(*) FROM section_templates) as templates_count,
  (SELECT COUNT(*) FROM pages WHERE slug = '/') as home_page_count,
  (SELECT COUNT(*) FROM page_sections ps JOIN pages p ON p.id = ps.page_id WHERE p.slug = '/') as home_sections_count;
```

2. Copie as mensagens de erro do console do browser (F12 → Console)

3. Compartilhe essas informações para análise detalhada
