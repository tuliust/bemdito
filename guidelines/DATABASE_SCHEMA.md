# 🗄️ DATABASE SCHEMA - BemDito CMS

**Versão:** 3.5  
**Data:** 2026-02-21 (V3.5 — migrations consolidadas em documentação; /migrations limpa; contagens confirmadas via SQL real)  
**Plataforma:** Supabase (PostgreSQL 15+)

---

## 📌 Arquivos de Referência

| Arquivo | Papel |
|---------|-------|
| **`/guidelines/SCHEMA_OFICIAL_V3.0.sql`** | ⭐ **Schema oficial** — DDL completo corrigido em 2026-02-19. Somente leitura. |
| **`/guidelines/QUERIES_AUDITORIA_V3.sql`** | ⭐ Queries permanentes de auditoria (Blocos 1-15) — copiar para EXECUTE_SQL.sql |
| **`/EXECUTE_SQL.sql`** | Arquivo temporário de trabalho — substituído a cada auditoria |

> ℹ️ **V3.5 (2026-02-21):** Pasta `/migrations` foi limpa após consolidação.  
> Todas as migrations V3.0–V3.4 (schema/segurança/RLS) e V1.7–V1.13 (tokens admin-ui) foram aplicadas ao banco e documentadas abaixo. Os arquivos SQL foram removidos.

---

## ⚠️ Nota Importante sobre Migrations

As migrations em `/supabase/migrations/` (001–008) cobrem o schema até 2026-02-05.  
O schema atual **difere das migrations** — diversas tabelas/colunas foram adicionadas/removidas via Dashboard.  
**O schema real confirmado está em `/guidelines/SCHEMA_OFICIAL_V3.0.sql`.**

---

## 📊 Visão Geral

O sistema usa **PostgreSQL 15+** via Supabase com **16 tabelas + 3 views** (confirmado em 2026-02-19).

---

## 📦 Estrutura de Tabelas (confirmada via information_schema)

### 1️⃣ Gerenciamento de Conteúdo (5 tabelas)

| Tabela | Registros | Descrição |
|--------|-----------|-----------| 
| `pages` | 2 | Páginas do site |
| `sections` | 10 | Seções reutilizáveis (JSONB: config, layout, styling, elements) |
| `page_sections` | 10 | Vínculo página ↔ seção (5 colunas — `config` foi dropada) |
| `page_versions` | **10** (pós-cleanup 2026-02-19) | Histórico de versões de páginas |
| `section_versions` | 0 | Histórico de versões de seções |

### 2️⃣ Sistema de Cards (4 tabelas)

| Tabela | Registros | Descrição |
|--------|-----------|-----------| 
| `card_templates` | 2 | Templates com 43 colunas (formatação) |
| `card_filters` | 4 | Filtros/tabs dos templates |
| `template_cards` | 7 | Cards individuais (14 colunas) |
| `section_template_cards` | 0 | Vínculo seção ↔ template (**6 colunas**: id, section_id, template_id, order_index, created_at, updated_at) |

### 3️⃣ Menu e Navegação (2 tabelas)

| Tabela | Registros | Descrição |
|--------|-----------|-----------|
| `menu_items` | 4 | Itens do header com megamenu |
| `menu_cards` | 22 | Cards reutilizáveis do megamenu (24 colunas) |

### 4️⃣ Design System (1 tabela)

| Tabela | Registros | Descrição |
|--------|-----------|-----------|
| `design_tokens` | **143** (confirmado via SQL 2026-02-21) | color(20), typography(12), spacing(6), radius(7), transition(5), **admin-ui(93)** |

> **Distribuição confirmada via SQL (2026-02-21):**
> - **93 tokens `admin-ui`** — controlam tipografia, cores e espaçamentos do painel admin; consumidos pelo `AdminThemeProvider`
> - **20 tokens `color`** — 7 originais + 7 adicionados em `system_manager_tokens` (foreground, card, border, destructive, input-background, muted-foreground, white) + 5 de sessões anteriores + 1 (switch-background)
> - **Categoria `admin-ui` habilitada via** `ALTER TABLE design_tokens DROP CONSTRAINT ... ADD CONSTRAINT design_tokens_category_check CHECK (category IN ('color', 'typography', 'spacing', 'radius', 'transition', 'admin-ui'))`

### 5️⃣ Configurações (3 tabelas)

| Tabela | Registros | Descrição |
|--------|-----------|-----------|
| `site_config` | 1 | Configuração global (singleton) |
| `footer_config` | 1 | Rodapé (singleton, fonte primária do footer_manager) |
| `media_assets` | 0 | Metadados de mídias (gerenciado pelo bucket) |

### 6️⃣ Backend (1 tabela)

| Tabela | Descrição |
|--------|-----------|
| `kv_store_72da2481` | Chave-valor (sistema Figma Make — não modificar estrutura) |

---

## ❌ Colunas que NÃO Existem (confirmado V3.1 — 2026-02-19)

> **Sempre consulte esta lista antes de escrever queries.**

| Tabela | Coluna Inexistente | Use Em Vez De |
|--------|--------------------|---------------|
| `card_templates` | `display_mode` | `columns_desktop` / `columns_tablet` |
| `card_templates` | `cols` | `columns_desktop` |
| `card_filters` | `name` | `label` |
| `template_cards` | `order` | `order_index` |
| `template_cards` | `published` | *(não existe — sem campo de publicação)* |
| `page_sections` | `config` | *(foi DROPADA — não usar em queries)* |

> ⚠️ **Correção V3.1:** `section_template_cards.updated_at` foi removida desta lista — a coluna **EXISTE** (confirmado B1 da migration V3.1). A trigger removida no Bloco B era válida (coluna existia), mas foi removida intencionalmente.

---

## 🏗️ Arquitetura (confirmada auditoria V3.1)

| Item | Contagem |
|------|---------|
| Tabelas BASE TABLE | 16 |
| Views | 3 (`v_database_stats`, `v_orphan_sections`, `v_pages_with_sections`) |
| Foreign Keys | 31 |
| Índices personalizados | 47 (inclui `sections_pkey1` e 5 duplicatas no kv_store) |
| Funções | 8 |
| Triggers | **10** (pós-V3.0 — trigger de `section_template_cards` removida intencionalmente) |

### Views disponíveis

| View | Uso |
|------|-----|
| `v_database_stats` | Contagem de registros por tabela — ✅ **V3.2 CORRIGIDA**: colunas `tabela` (text) e `total` (integer). Suporta `ORDER BY tabela` no Studio. Antiga view tinha `table_name` + `total_records`. |
| `v_orphan_sections` | Seções sem vínculo com páginas |
| `v_pages_with_sections` | Páginas com suas seções |

### Índices especiais

- `sections_pkey1` — índice único duplicado em `sections.id` (harmless, não remover)
- `kv_store_72da2481_key_idx` a `_key_idx4` — 5 duplicatas (sistema Figma Make, não tocar)

---

## 🔢 Colunas por tabela (posições reais)

### `sections` — 11 colunas

| pos | column | tipo | nullable |
|-----|--------|------|---------|
| 1 | id | uuid | NO |
| 2 | name | text | NO |
| 3 | type | text | NO |
| 4 | config | jsonb | NO |
| 5 | global | boolean | YES |
| 6 | published | boolean | YES |
| 7 | created_at | timestamptz | YES |
| 8 | updated_at | timestamptz | YES |
| 9 | elements | jsonb | **YES** ← nullable (não NOT NULL) |
| 10 | layout | jsonb | **YES** ← nullable (não NOT NULL) |
| 11 | styling | jsonb | **YES** ← nullable (não NOT NULL) |

### `page_sections` — 5 colunas (config foi DROPADA)

| pos | column | tipo |
|-----|--------|------|
| 1 | id | uuid |
| 2 | page_id | uuid |
| 3 | section_id | uuid |
| ~~4~~ | ~~config~~ | ~~dropada~~ |
| 5 | order_index | integer |
| 6 | created_at | timestamptz |

### `template_cards` — 14 colunas

| pos | column | tipo |
|-----|--------|------|
| 1 | id | uuid |
| 2 | template_id | uuid |
| 3 | icon | text |
| 4 | title | text |
| 5 | subtitle | text |
| 6 | media_url | text |
| 7 | link_url | text |
| 8 | link_type | text |
| 9 | filter_id | uuid |
| 10 | filter_tags | ARRAY |
| 11 | order_index | integer |
| 12 | created_at | timestamptz |
| 13 | updated_at | timestamptz |
| 14 | media_opacity | integer |

### `pages` — 12 colunas (posição 6 ausente — coluna deletada no passado)

Colunas: id(1), slug(2), title(3), meta_title(4), meta_description(5), *(gap em 6)*, created_at(7), updated_at(8), published(9), name(10), meta_keywords(11), og_image(12)

---

## 🎯 Estrutura JSONB das Seções

A tabela `sections` usa **4 colunas JSONB** para máxima flexibilidade:

```typescript
interface Section {
  id: UUID;
  name: string;
  type: 'unico';  // Tipo unificado

  config: {
    gridRows: 1 | 2;
    gridCols: 1 | 2;
    title?: string;
    subtitle?: string;
    smallTitle?: string;
    icon?: string;
    iconColor?: string;  // UUID → design_tokens
    mediaUrl?: string;
    cardTemplateId?: string;  // UUID → card_templates
    media?: {
      fitMode: 'cobrir' | 'ajustada' | 'contida' | 'adaptada' | 'alinhada';
      alignX?: 'left' | 'center' | 'right';   // obrigatório quando alinhada
      alignY?: 'top' | 'center' | 'bottom';   // obrigatório quando alinhada
    };
    ctaButton?: { label: string; url: string };
    bgColor?: string;  // UUID → design_tokens
    cards?: { alignY: 'top' | 'middle' | 'bottom' };
  };

  layout: {
    desktop: {
      text:   GridPosition;  // sempre string, nunca objeto
      media?: GridPosition;
      cards?: GridPosition;
    }
  };
  // GridPosition = 'top-left'|'top-right'|'top-center'|'middle-left'|
  //               'middle-right'|'bottom-left'|'bottom-right'|'bottom-center'|'center'

  styling: {
    height: '100vh' | '50vh' | 'auto';
    spacing: {
      top:    '0px'|'25px'|'50px'|'75px'|'100px'|'125px'|'150px'|'175px'|'200px';
      bottom: string;  // mesmas opções
      left:   string;
      right:  string;
      gap:    string;   // gap entre colunas (padrão 50px)
      rowGap?: string;  // gap entre linhas
    };
    bgColor?: string;  // UUID → design_tokens
  };

  // Nullable no banco (is_nullable=YES), mas sempre presente na prática
  elements: {
    hasIcon?:       boolean;
    hasMinorTitle?: boolean;   // Chamada
    hasMainTitle?:  boolean;
    hasSubtitle?:   boolean;
    hasButton?:     boolean;
    hasMedia?:      boolean;
    hasCards?:      boolean;
    hasContainer?:  boolean;
    cardCount?:     number;
    mediaType?:     'image' | 'video' | null;
  };
}
```

> **fitMode no banco (pós-V3.0):** `"cobrir"` (Melhores Profissionais), `"alinhada"` (Prazer BemDito — alignX=right/alignY=bottom), `"adaptada"` (APP, Monte seu Projeto).  
> ⚠️ Antes da V3.0: 'cover' e 'contain' (inglês) — corrigidos pelo Bloco D de `/migrations/2026-02-19_v3.0_corrections.sql`.

---

## 📋 Dados Reais — Seções (confirmado via SQL 2026-02-21)

| id | name | cols | rows | height | text_pos | media_pos | cards_pos | has_cards | has_media | card_template |
|----|------|------|------|--------|----------|-----------|-----------|-----------|-----------|---------------|
| 1379d0af | Seção Inicial - Home | 2 | 2 | 100vh | top-center | null | null | false | false | null |
| 667ab5d5 | Prazer, somos a BemDito! | 2 | 2 | 50vh | middle-left | middle-right | null | false | true | null |
| 1b43c00d | Marketing Digital | 2 | 2 | 100vh | middle-left | null | middle-right | true | false | 035097b0 |
| e735eafe | Monte seu Projeto | 2 | 2 | auto | top-left | top-right | bottom-center | true | true | 404c526d |
| d7dbc95a | Melhores Profissionais | 1 | 2 | auto | top-center | bottom-center | null | false | true | null |
| c337eba8 | Como funciona? | 1 | 2 | auto | top-left | top-center | bottom-center | false | false | null |
| c4865f37 | APP | 2 | 2 | auto | top-left | top-right | bottom-center | true | true | 404c526d |
| 236b82f8 | Portfólio | 1 | 2 | auto | top-left | top-center | bottom-center | false | false | null |
| 5f40ff6b | Orçamento | 1 | 1 | auto | top-left | null | null | false | false | 035097b0* |
| eb77f650 | Blog | 1 | 2 | auto | middle-left | null | null | false | false | 404c526d* |

`*` = cardTemplateId armazenado mas `hasCards=false` (toggle desligado — configuração preservada)

---

## 🎨 Design Tokens Reais (confirmado V3.1 + tokens adicionados até V1.13)

### Cores (**20 tokens** — confirmado via SQL 2026-02-21)

| name | label | hex |
|------|-------|-----|
| primary | Primary | #ea526e |
| secondary | Secondary | #2e2240 |
| background | Background | #f6f6f6 |
| accent | Accent | #ed9331 |
| muted | Muted | #e7e8e8 |
| dark | Dark | #020105 |
| purple-dark | Roxo Escuro | #2e2240 |
| foreground | Foreground (Texto Principal) | #1a1a1a |
| card | Card | #ffffff |
| border | Borda | #e5e7eb |
| destructive | Destrutivo | #d4183d |
| input-background | Fundo de Input | #f3f3f5 |
| muted-foreground | Texto Muted | #717182 |
| white | Branco | #ffffff |
| popover | Popover BG | — |
| popover-foreground | Popover Texto | — |
| primary-foreground | Primary Foreground | — |
| accent-foreground | Accent Foreground | — |
| switch-background | BG do Toggle/Switch (inativo) | #cbced4 |

~~test-token~~ ~~Test~~ ~~#000000~~ — *removido em V3.1*

### Tipografia (12 tokens — ordem real)

| order | name | label | size | weight |
|-------|------|-------|------|--------|
| 1 | body | Corpo do Texto | 1rem | 400 |
| 2 | font-family | Subtítulo Menor | 1.15rem | 400 |
| 3 | heading-medium | Título Médio | 3rem | 700 |
| 4 | body-base | Corpo Base | 1rem | 400 |
| 5 | main-title | Título Maior | 6rem | 700 |
| 6 | menu | Menu | 0.875rem | 500 |
| 7 | minor-title | Chamada | 1.1rem | 600 |
| 8 | subtitle | Subtítulo Maior | 1.3rem | 500 |
| 10 | body-small | Corpo Pequeno | 0.875rem | 400 |
| 999 | button-text | Botão | 1rem | 500 |
| 999 | card-menu-title | Título Card Menu | 1.2rem | 600 |
| 999 | megamenu-title | Título do Megamenu | 2.15rem | 800 |

### Radius (7 tokens) — ⚠️ valores corrigidos em V3.0

| name | label | value |
|------|-------|-------|
| none | None | 0 |
| sm | Small | **0.25rem** ← (não 0.375rem como diz Guidelines.md) |
| md | Medium | 0.5rem |
| lg | Large | 0.75rem |
| xl | Extra Large | 1rem |
| 2xl | 2X Large (Padrão) | 1.5rem |
| full | Full (Circular) | **9999px** ← token confirmado |

### Spacing (6 tokens)

xs=0.5rem, sm=1rem, md=1.5rem, lg=2rem, xl=3rem, 2xl=4rem

### Transition (5 tokens)

| name | duration | easing |
|------|----------|--------|
| fast | 150ms | ease-in-out |
| normal | 300ms | ease-in-out |
| slow | 500ms | ease-in-out |
| smooth | 400ms | cubic-bezier(0.4, 0, 0.2, 1) |
| bounce | 300ms | cubic-bezier(0.68, -0.55, 0.265, 1.55) |

---

## 📋 Dados Reais — Menu Items

| order | id (abrev.) | label | icon | bg_color | media_pos | colunas |
|-------|-------------|-------|------|----------|-----------|---------|
| 0 | dddddddd | Muito prazer! | Heart | #f7c7a6 | right | 1 |
| 1 | cccccccc | Tendências e Inspiração | BookOpen | #e5d4d4 | left | 1 |
| 2 | bbbbbbbb | Chama a gente! | ThumbsUp | #e5d4d4 | left | 2 |
| 3 | 5892d326 | Ajustes | Settings | #e5d4d4 | left | 1 |

---

## 🔧 Funções e Triggers (V3.1)

### Funções (8)

| nome | retorno | descrição |
|------|---------|-----------|
| `cleanup_old_versions` | void | Limpa versões antigas |
| `fix_section_structure` | text | Corrige estrutura de seção |
| `get_next_page_version_number` | integer | Próximo número de versão de página |
| `get_next_section_version_number` | integer | Próximo número de versão de seção |
| `update_updated_at_column` | trigger | Atualiza campo updated_at |
| `validate_section_complete` | record | Valida seção completa |
| `validate_section_full_structure` | record | Valida estrutura completa |
| `validate_section_structure` | record | Valida estrutura básica |

### Triggers (10 ativos — pós-V3.1)

Todas as triggers são BEFORE UPDATE usando `update_updated_at_column()`:

`card_templates`, `design_tokens`, `footer_config`, `media_assets`, `menu_cards`, `menu_items`, `pages`, `sections`, `site_config`, `template_cards`

> ⚠️ **Nota V3.1:** A trigger `update_section_template_cards_updated_at` foi removida (Bloco B). A coluna `updated_at` **existe** na tabela — a remoção foi intencional (simplificação), não por ser órfã.

---

## 🔍 Discrepâncias Conhecidas

| Item | site_config | footer_config | Usar |
|------|-------------|---------------|------|
| Footer colunas | 3 colunas — ~~"BemDitoo"~~ **"BemDito"** (corrigido V3.1 Bloco E) | 2 colunas "Empresa"/"Recursos" | footer_config (footer_manager) |
| Menu items | Hardcoded no JSON | Tabela menu_items | menu_items (menu_manager) |

---

## ⚠️ Achados V3.0 — Issues

| # | Severidade | Problema | Arquivo de Correção |
|---|-----------|----------|---------------------|
| 1 | ✅ CORRIGIDO | Trigger em `section_template_cards` removida intencionalmente (coluna `updated_at` existe, trigger era válida) | `migrations/2026-02-19_v3.0_corrections.sql` Bloco B |
| 2 | ✅ CORRIGIDO | Garbage text "JJJJJ" + `subtitle_font_weight=600` em `Carreiras` menu_card | `migrations/2026-02-19_v3.0_corrections.sql` Bloco A |
| 3 | ✅ CORRIGIDO | `test-token` removido (já estava ausente antes de V3.1 Bloco C) | automático |
| 4 | 📝 DOCS | `radius.sm = 0.25rem` (Guidelines.md dizia 0.375rem) | Guidelines.md corrigido nesta versão |
| 5 | 📝 DOCS | `page_sections.config` foi dropada | client.ts atualizado, schema V3.0 atualizado |
| 6 | 📝 DOCS | `sections.elements/layout/styling` são nullable | Documentado nesta versão |
| 7 | ✅ CORRIGIDO | `fitMode` em inglês ('cover'→'cobrir', 'contain'→'alinhada') | `migrations/2026-02-19_v3.0_corrections.sql` Bloco D |
| 8 | ✅ CORRIGIDO | Typo "BemDitoo" em `site_config.footer.columns[*].title` | `migrations/2026-02-19_v3.1_corrections.sql` Bloco E |
| 9 | ✅ CORRIGIDO | `v_database_stats` view — colunas `table_name`+`total_records` → `tabela`+`total` (DROP+CREATE) | `migrations/2026-02-19_v3.2_corrections.sql` Bloco F |

---

## ✅ Achados V3.1/V3.2 — Issues (todos resolvidos)

| # | Severidade | Problema | Status | Arquivo |
|---|-----------|----------|--------|---------|
| 1 | ✅ CORRIGIDO | `test-token` já estava removido antes da V3.1 | Done | automático |
| 2 | ✅ CORRIGIDO | Typo "BemDitoo" → "BemDito" em `site_config.footer` | Done | `migrations/2026-02-19_v3.1_corrections.sql` Bloco E |
| 3 | 🟡 OPCIONAL | `page_versions` acumulou 181 registros — cleanup opcional via `cleanup_old_versions()` | ✅ EXECUTADO — reduziu de 181 → **10** | `migrations/2026-02-19_v3.1_corrections.sql` Bloco G |
| 4 | ✅ CORRIGIDO | `section_template_cards` tem 6 colunas (id, section_id, template_id, order_index, created_at, **updated_at**) — docs estavam erradas | Done | DATABASE_SCHEMA.md V3.1 |
| 5 | ✅ CORRIGIDO | `v_database_stats` view com colunas erradas (`table_name`+`total_records`) → correto (`tabela`+`total`) | Done | `migrations/2026-02-19_v3.2_corrections.sql` Bloco F |

> **Item 3:** ✅ Executado. page_versions reduziu de 181 para **10** (somente versões da página "/" nos. 278-287 foram preservadas). Comportamento esperado — a função mantém as versões mais recentes.

---

## ✅ Checklist de Integridade V3.2 (confirmado 2026-02-19)

**Todos os 9 checks = 0 problemas:**

| Check | Resultado |
|-------|-----------|
| posicoes_objeto | ✅ 0 |
| gridcols_em_layout | ✅ 0 |
| secao_multiplas_paginas | ✅ 0 |
| template_cards_orfaos | ✅ 0 |
| page_sections_orfas | ✅ 0 |
| trigger_section_template | ✅ 0 |
| fitmode_em_ingles | ✅ 0 |
| garbage_text_jjjjj | ✅ 0 |
| test_token_existe | ✅ 0 |

### Bloco G — cleanup_old_versions() (executado 2026-02-19)

```sql
SELECT cleanup_old_versions();
-- Resultado: void (retorno da função) ✅
-- page_versions ANTES: 181 | DEPOIS: 10
-- Reduziu 171 versões antigas (manteve versões 278-287 da página "/")
-- Distribuição pós-cleanup: slug="/" | total_versoes=10 | versao_min=278 | versao_max=287 | restore_points=0
```

> ℹ️ A função retorna void — sem output é comportamento correto.
> Os 10 registros restantes são as versões mais recentes da página "/".

---

## ✅ Achados V3.3/V3.4 — Issues (todos resolvidos)

| # | Tipo | Problema | Ação | Status |
|---|------|----------|------|--------|
| 1 | ERROR | 3 views com SECURITY DEFINER | `ALTER VIEW ... SET (security_invoker=true)` | ✅ V3.3 Bloco J |
| 2 | WARN | 8 funções com mutable search_path | `ALTER FUNCTION ... SET search_path = public` | ✅ V3.3 Bloco K |
| 3 | WARN | 64 políticas RLS redundantes (sempre true) | DROP duplicatas + 1 `FOR ALL TO public` por tabela | ✅ V3.4 Blocos L-U |
| 4 | BUG | 406 no console (`DynamicPage.tsx`) | `.single()` → `.maybeSingle()` | ✅ Código |
| 5 | BUG | ReferenceError supabase (menu-manager) | import `supabase` adicionado | ✅ Código |

> **Nota V3.4:** As 16 WARNs RLS restantes são **intencionais** — o CMS é um protótipo sem auth de usuários, usando `publicAnonKey`. Corrigir exigiria implementar autenticação completa.

---

## 📅 Histórico de Auditorias

| Data | Versão | Sessão | Issues Encontrados | Issues Corrigidos |
|------|--------|--------|-------------------|-------------------|
| 2026-02-19 | V2.0→V3.0 | Blocos 1-14 + Correções A,B,D | 9 | 7 (A,B,C,D corrigidos; E,F pendentes → resolvidos em V3.1/V3.2) |
| 2026-02-19 | V3.0→V3.1 | Correções C,D,E,Z + descoberta colunas STC | 5 | 4 (E corrigido; F pendente → resolvido em V3.2; G opcional) |
| 2026-02-19 | V3.1→V3.2 | Bloco F (DROP+CREATE v_database_stats) | 1 | 1 (F corrigido — banco 100% limpo) |
| 2026-02-20 | V3.2→V3.3 | Blocos J+K (security_definer views + function search_path) | 11 | 11 (3 ERRORs views + 8 WARNs funções — 0 no Linter) |
| 2026-02-20 | V3.3→V3.4 | Blocos L-U (RLS consolidation) | 64 | 16 (64 → 16 WARNs) |
| 2026-02-21 | V3.4→V3.5 | Migrations de tokens admin-ui V1.7–V1.13 aplicadas; contagens confirmadas via SQL | — | ✅ 93 tokens admin-ui confirmados; design_tokens=143; /migrations limpa |

**Estado final V3.5:** Banco **100% íntegro** — 9 checks de integridade = 0 problemas | Linter: 0 ERRORs + 16 WARNs RLS (intencionais) | **93 tokens admin-ui** (143 design_tokens total) confirmados via SQL.

**Contagens confirmadas definitivamente (SQL 2026-02-21):**

| Tabela | Total |
|--------|-------|
| card_filters | 4 |
| card_templates | 2 |
| design_tokens | **143** |
| footer_config | 1 |
| media_assets | 0 |
| menu_cards | 22 |
| menu_items | 4 |
| page_sections | 10 |
| page_versions | **10** |
| pages | 2 |
| section_template_cards | 0 |
| section_versions | 0 |
| sections | 10 |
| site_config | 1 |
| template_cards | 7 |

**Design tokens por categoria (confirmado via SQL 2026-02-21):**
| category | total |
|---|---|
| admin-ui | **93** |
| color | 20 |
| radius | 7 |
| spacing | 6 |
| transition | 5 |
| typography | 12 |
| **TOTAL** | **143** |

**Tokens admin-ui por rodada:**
| Migration | Tokens adicionados | Total acumulado |
|---|---|---|
| system_manager_tokens | 16 admin-ui + 7 color | 37+23=60 total |
| v1.7 | +1 (section-header-icon) | 61 |
| v1.10 | +14 (tab-*, field-*, btn-action-*) | 75 |
| v1.10.1 | +11 via upsert + 1 color | ~87 |
| v1.11 | +22 (modal-*, collapsible-*, list-item-*, sub-nav-*, sub-label, btn-cancel-*) | ~109 |
| v1.12 | +1 (sidebar-separator) | ~110 |
| v1.13 | +3 (btn-primary-*) | ~113 |

**Pasta /migrations:** ✅ **Limpa em 2026-02-21** — todos os arquivos foram aplicados e removidos.  
**Próxima auditoria:** Executar `/guidelines/QUERIES_AUDITORIA_V3.sql` Blocos 1-15 → comparar contagens acima → criar `SCHEMA_OFICIAL_V4.0.sql` se houver mudanças.

---

*Versão: 3.5 — Auditoria V3.2 finalizada 2026-02-19 | Segurança V3.3 aplicada 2026-02-20 — Supabase Linter: 0 ERRORs ✅*  
*Arquivo de referência: `/guidelines/SCHEMA_OFICIAL_V3.0.sql`*