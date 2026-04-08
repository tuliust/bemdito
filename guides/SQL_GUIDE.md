# 🗄️ Guia SQL — BemDito CMS

**Última atualização:** 2026-02-20  
**Versão:** 4.2 — Pós-Auditoria V3.4 (Linter: 0 ERRORs + 16 WARNs RLS)  
**Fonte:** SCHEMA_OFICIAL_V3.0.sql + EXECUTE_SQL.sql

---

## ✅ TABELAS REAIS (confirmadas em 2026-02-19 — Bloco 1)

| Tabela | Registros | Descrição |
|--------|-----------|-----------|
| **design_tokens** | 37 | Tokens do Design System |
| **menu_items** | 4 | Itens do header principal |
| **menu_cards** | 22 | Cards dos megamenus (24 colunas) |
| **pages** | 2 | Páginas (`/` e `/ajustes`) |
| **sections** | 10 | Seções type='unico' |
| **page_sections** | 10 | Vínculo página ↔ seção |
| **page_versions** | 11 | Histórico de versões de páginas (cleanup V3.0: 181→10, +1 sessão) |
| **section_versions** | 0 | Versões de seções (não ativado) |
| **card_templates** | 2 | Templates de cards (43 colunas) |
| **card_filters** | 4 | Filtros dos templates |
| **template_cards** | 7 | Cards individuais |
| **section_template_cards** | 0 | Vínculo seção ↔ template (vinculação é via JSONB) |
| **site_config** | 1 | Configuração global (singleton) |
| **footer_config** | 1 | Configuração do footer (singleton) |
| **media_assets** | 0 | Metadados de mídias |
| **kv_store_72da2481** | — | Key-value store do sistema (**PROTEGIDA**) |

**Views:** `v_database_stats`, `v_orphan_sections`, `v_pages_with_sections`

> ⚠️ `v_database_stats` inclui apenas 9 tabelas:
> card_filters, card_templates, design_tokens, menu_cards, menu_items, page_sections, pages, sections, template_cards.
> NÃO inclui: footer_config, site_config, media_assets, page_versions, section_versions, section_template_cards.

---

## ❌ TABELAS QUE NÃO EXISTEM

> Não referenciar estes nomes em nenhum código ou query.

| Nome Errado | Correto / Observação |
|-------------|---------------------|
| `cards` | Não existe — usar `template_cards` |
| `section_cards` | Não existe — usar `section_template_cards` (mas está vazia; vinculação real é via JSONB) |
| `section_templates` | Não existe |
| `page_sections_old` | Não existe |
| `design_tokens_backup` | Não existe |
| `dt_count`, `ma_count`, `mc_count`, `mi_count`, `p_count`, `s_count` | Não existem |

---

## ❌ COLUNAS QUE NÃO EXISTEM

| Tabela | Coluna Errada | Coluna Correta |
|--------|---------------|----------------|
| `card_templates` | `display_mode` | `columns_desktop` / `columns_tablet` / `columns_mobile` |
| `card_templates` | `cols` | `columns_desktop` |
| `card_filters` | `name` | `label` |
| `template_cards` | `order` | `order_index` |
| `template_cards` | `published` | *(não existe — sem campo de publicação)* |
| `card_filters` | `updated_at` | *(não existe — apenas created_at)* |

---

## 🗂️ Dados Reais (2026-02-19)

### Seções (10 registros — todas na Home, ordem 0–9)

| ID (8 chars) | Nome | gridCols | gridRows | Altura | fitMode | pos_texto | pos_mídia |
|-------------|------|----------|----------|--------|---------|-----------|-----------|
| `c4865f37` | APP | 2 | 2 | auto | `adaptada` | top-left | top-right |
| `eb77f650` | Blog | 1 | 2 | auto | — | middle-left | — |
| `c337eba8` | Como funciona? | 1 | 2 | auto | — | top-left | top-center |
| `1b43c00d` | Marketing Digital | 2 | 2 | 100vh | — | middle-left | — |
| `d7dbc95a` | Melhores Profissionais | 1 | 2 | auto | `cover` | top-center | bottom-center |
| `e735eafe` | Monte seu Projeto | 2 | 2 | auto | `adaptada` | top-left | top-right |
| `5f40ff6b` | Orçamento | 1 | 1 | auto | — | top-left | — |
| `236b82f8` | Portfólio | 1 | 2 | auto | — | top-left | top-center |
| `667ab5d5` | Prazer, somos a BemDito! | 2 | 2 | 50vh | `contain` | middle-left | middle-right |
| `1379d0af` | Seção Inicial - Home | 2 | 2 | 100vh | — | top-center | — |

> ⚠️ **fitMode real no banco:** `"cover"`, `"contain"` (inglês), `"adaptada"` (português).
> **NÃO usar:** `"cobrir"`, `"ajustada"`, `"contida"` — não são os valores reais armazenados.

### Card Templates (2 registros)

| ID (8 chars) | Nome | Colunas D/T/M | gap | Filtros | Cards | media_opacity |
|-------------|------|--------------|-----|---------|-------|---------------|
| `035097b0` | Marketing Digital Cards | 1×1×1 | lg | 0 | 1 | 26 |
| `404c526d` | Serviços BemDito | 3×2×1 | lg | 4 | 6 | 100 |

> ⚠️ `columns_desktop` (não `display_mode` nem `cols`)

### Card Filters (4 registros — template Serviços BemDito)

| ID (8 chars) | label | slug | order_index |
|-------------|-------|------|-------------|
| `812581a8` | Todos | todos | 0 |
| `d7e9c602` | Marketing Digital | marketing-digital | 1 |
| `c7990418` | Branding | branding | 2 |
| `bdb2d654` | Conteúdo | conteudo | 3 |

### Menu Items (4 registros)

| ID (8 chars) | label | order | icon | bgColor | mediaPos | Colunas |
|-------------|-------|-------|------|---------|----------|---------|
| `dddddddd` | Muito prazer! | 0 | Heart | #f7c7a6 | right | 1 |
| `cccccccc` | Tendências e Inspiração | 1 | BookOpen | #e5d4d4 | left | 1 |
| `bbbbbbbb` | Chama a gente! | 2 | ThumbsUp | #e5d4d4 | left | 2 |
| `5892d326` | Ajustes | 3 | Settings | #e5d4d4 | left | 1 |

> ⚠️ Diferem levemente de `site_config.header.menu_items` (hardcoded e desatualizado).

---

## 🎯 Queries do Dia a Dia

### Ver todas as seções e seus layouts

```sql
SELECT
  id,
  name,
  config->>'gridCols'           AS grid_cols,
  config->>'gridRows'           AS grid_rows,
  layout->'desktop'->>'text'    AS pos_texto,
  layout->'desktop'->>'media'   AS pos_midia,
  layout->'desktop'->>'cards'   AS pos_cards,
  styling->>'height'            AS altura,
  styling->'spacing'->>'top'    AS pad_top,
  styling->'spacing'->>'bottom' AS pad_bot,
  config->'media'->>'fitMode'   AS fit_mode,   -- "cover" | "contain" | "adaptada" | "alinhada"
  elements->>'hasMedia'         AS has_media,
  elements->>'hasCards'         AS has_cards,
  published
FROM sections
ORDER BY name;
```

### Ver páginas com suas seções (em ordem)

```sql
SELECT
  p.slug,
  p.name        AS page_name,
  ps.order_index,
  s.id          AS section_id,
  s.name        AS section_name,
  s.published   AS sec_pub
FROM pages p
LEFT JOIN page_sections ps ON p.id = ps.page_id
LEFT JOIN sections s       ON ps.section_id = s.id
ORDER BY p.slug, ps.order_index;
```

### Ver card templates com contagens corretas (sem display_mode nem cols!)

```sql
SELECT
  ct.id,
  ct.name,
  ct.columns_desktop,    -- ✅ não é "display_mode" nem "cols"
  ct.columns_tablet,
  ct.columns_mobile,
  ct.gap,
  ct.has_filters,
  ct.filters_position,
  ct.media_opacity,
  COUNT(DISTINCT cf.id) AS total_filtros,
  COUNT(DISTINCT tc.id) AS total_cards
FROM card_templates ct
LEFT JOIN card_filters   cf ON ct.id = cf.template_id
LEFT JOIN template_cards tc ON ct.id = tc.template_id
GROUP BY ct.id, ct.name, ct.columns_desktop, ct.columns_tablet, ct.columns_mobile,
         ct.gap, ct.has_filters, ct.filters_position, ct.media_opacity
ORDER BY ct.name;
```

### Ver filtros de cards (usar label e order_index!)

```sql
SELECT
  cf.id,
  cf.label,          -- ✅ NÃO existe "name"
  cf.slug,
  cf.icon,
  cf.order_index,    -- ✅ NÃO existe "order"
  cf.template_id,
  ct.name AS template_name
FROM card_filters cf
JOIN card_templates ct ON ct.id = cf.template_id
ORDER BY ct.name, cf.order_index;
```

### Ver cards individuais (usar order_index, sem published!)

```sql
SELECT
  tc.id,
  tc.title,
  tc.subtitle,
  tc.icon,
  tc.media_url,
  tc.link_url,
  tc.link_type,
  tc.filter_id,
  tc.order_index,    -- ✅ NÃO existe "order"
  tc.media_opacity,
  tc.template_id
  -- ⚠️ NÃO existe "published" nesta tabela
FROM template_cards tc
ORDER BY tc.template_id, tc.order_index;
```

### Ver design tokens por categoria

```sql
SELECT
  category,
  name,
  label,
  value,
  "order"
FROM design_tokens
WHERE category = 'color'   -- 'color'|'typography'|'spacing'|'radius'|'transition'
ORDER BY category, "order", name;
```

### Ver menu items e colunas do megamenu

```sql
SELECT
  mi.id,
  mi.label,
  mi."order",
  mi.icon,
  mi.megamenu_config->>'bgColor'       AS mm_bg,
  mi.megamenu_config->>'mediaPosition' AS mm_media_pos,
  jsonb_array_length(COALESCE(mi.megamenu_config->'columns', '[]'::jsonb)) AS total_colunas
FROM menu_items mi
ORDER BY mi."order";
```

---

## 🔍 Diagnóstico de Integridade

Use os queries abaixo periodicamente. Resultado esperado: 0 linhas em todos.

```sql
-- 1. Posições salvas como objetos (deve retornar 0 linhas)
SELECT id, name, layout->'desktop'->'text' AS pos_texto_raw
FROM sections
WHERE jsonb_typeof(layout->'desktop'->'text') = 'object';

-- 2. gridCols/gridRows em lugar errado (deve retornar 0 linhas)
SELECT id, name, layout->>'gridCols', layout->>'gridRows'
FROM sections
WHERE layout ? 'gridCols' OR layout ? 'gridRows';

-- 3. Seções em mais de 1 página (regra: 1-seção = 1-página)
SELECT s.id, s.name, COUNT(ps.page_id) AS total_paginas
FROM sections s
JOIN page_sections ps ON s.id = ps.section_id
GROUP BY s.id, s.name
HAVING COUNT(ps.page_id) > 1;

-- 4. Cards sem template válido
SELECT tc.id, tc.title
FROM template_cards tc
WHERE NOT EXISTS (SELECT 1 FROM card_templates ct WHERE ct.id = tc.template_id);

-- 5. page_sections órfãs
SELECT ps.id, ps.page_id, ps.section_id
FROM page_sections ps
WHERE NOT EXISTS (SELECT 1 FROM sections s WHERE s.id = ps.section_id);
```

---

## 📊 Estatísticas Rápidas

```sql
-- Via view (somente 9 tabelas principais)
SELECT * FROM v_database_stats ORDER BY table_name;

-- Completo (inclui todas as tabelas):
SELECT 'sections'       , COUNT(*) FROM sections        UNION ALL
SELECT 'pages'          , COUNT(*) FROM pages            UNION ALL
SELECT 'design_tokens'  , COUNT(*) FROM design_tokens    UNION ALL
SELECT 'menu_items'     , COUNT(*) FROM menu_items        UNION ALL
SELECT 'menu_cards'     , COUNT(*) FROM menu_cards        UNION ALL
SELECT 'card_templates' , COUNT(*) FROM card_templates    UNION ALL
SELECT 'card_filters'   , COUNT(*) FROM card_filters      UNION ALL
SELECT 'template_cards' , COUNT(*) FROM template_cards    UNION ALL
SELECT 'footer_config'  , COUNT(*) FROM footer_config     UNION ALL
SELECT 'site_config'    , COUNT(*) FROM site_config;
```

---

## 🔧 Corrections Úteis

### Converter posições de objeto para string

```sql
UPDATE sections
SET layout = jsonb_set(
  layout,
  '{desktop,text}',
  to_jsonb((layout->'desktop'->'text'->>'position'))
)
WHERE
  jsonb_typeof(layout->'desktop'->'text') = 'object'
  AND layout->'desktop'->'text'->>'position' IS NOT NULL;
```

### Mover gridRows/gridCols do layout para o config

```sql
UPDATE sections
SET
  config = config || jsonb_build_object(
    'gridRows', (layout->>'gridRows')::int,
    'gridCols', (layout->>'gridCols')::int
  ),
  layout = layout - 'gridRows' - 'gridCols'
WHERE layout ? 'gridRows' OR layout ? 'gridCols';
```

---

## ⚠️ Notas Importantes

### Sobre site_config vs footer_config

`site_config.footer` e `footer_config.config` têm **estruturas diferentes**:
- `site_config.footer` → 3 colunas "BemDito" com links para /sobre, /cases, /blog, etc. (mais antigo)
- `footer_config.config` → 2 colunas "Empresa" (Sobre Nós, Contato) + "Recursos" (Blog) + 2 redes sociais

**Use sempre `footer_config`** no footer_manager.

### Sobre site_config.header.menu_items

O campo `header.menu_items` em `site_config` é **hardcoded** e **desatualizado** — labels como
"Tendências e inspiração" (vs "Tendências e Inspiração" na tabela) e "Chama a gente" (vs "Chama a gente!").
O Header dinâmico deve buscar da tabela `menu_items` via API.

### Sobre cardTemplateId

O vínculo seção ↔ template é via `sections.config->>'cardTemplateId'` (UUID),
**não** pela tabela `section_template_cards` (que tem 0 registros).

### Sobre fitMode

Os valores reais de fitMode no banco são em inglês (`"cover"`, `"contain"`) ou português (`"adaptada"`, `"alinhada"`).
**NÃO** usar: `"cobrir"`, `"ajustada"`, `"contida"` — não aparecem em nenhuma seção real.

---

## 📁 Migrations Disponíveis

**Localização:** `/supabase/migrations/`

| Arquivo | Descrição |
|---------|-----------|
| `001_initial_schema.sql` | Schema inicial |
| `002_seed_data.sql` | Dados iniciais do sistema |
| `003_update_schema_for_cms_managers.sql` | Suporte a cards-manager, sections-manager |
| `004_media_and_versioning.sql` | Bucket de mídia e versionamento |
| `005_seed_inicio_page.sql` | Dados da página inicial |
| `006_fix_sql_queries.sql` | Correções de queries |
| `007_fix_constraints_and_comments.sql` | Constraints e comentários |
| `008_fix_data_consistency.sql` | Consistência de dados |

> **Nota:** As migrations cobrem o schema até ~2026-02-05. O banco atual tem tabelas/colunas adicionadas
> via Dashboard que não constam nas migrations. O schema real está em `/guidelines/SCHEMA_OFICIAL_V3.0.sql`.

---

**Mantido por:** Equipe BemDito CMS
**Última revisão:** 2026-02-19
**Próxima revisão:** Após mudanças estruturais no banco
