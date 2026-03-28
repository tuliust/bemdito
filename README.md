# 🎨 BemDito CMS

**Sistema completo de gerenciamento de conteúdo para sites responsivos**

![Tests](https://github.com/SEU_USERNAME/SEU_REPO/actions/workflows/tests.yml/badge.svg)
![Code Quality](https://github.com/SEU_USERNAME/SEU_REPO/actions/workflows/quality.yml/badge.svg)
[![codecov](https://codecov.io/gh/SEU_USERNAME/SEU_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/SEU_USERNAME/SEU_REPO)

**Versão:** 2.0.4  
**Status:** ✅ **Supabase Linter: 0 ERRORs | 0 WARNs functions | 16 WARNs RLS**  
**Data:** 20 de fevereiro de 2026

> **⚠️ NOTA:** Substitua `SEU_USERNAME` e `SEU_REPO` nos badges acima com seus dados reais do GitHub

---

## 🚀 **INÍCIO RÁPIDO**

### **👋 Novo no Projeto?**

**Leia primeiro:** [guidelines/Guidelines.md](./guidelines/Guidelines.md) ← **COMECE AQUI!**

### **Instalação Rápida (5 minutos):**

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env
# Criar arquivo .env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# 3. Iniciar desenvolvimento
npm run dev

# 4. Acessar admin
# http://localhost:3000/admin
```

---

## 📊 **STATUS ATUAL DO PROJETO**

### **✅ ESTADO ATUAL (2026-02-20)**

**Supabase Linter — Resultado Final**

| Check | Antes | Depois | Status |
|-------|-------|--------|--------|
| **ERRORs** (security_definer_view) | 3 | **0** | ✅ V3.3 |
| **WARNs** (function_search_path) | 8 | **0** | ✅ V3.3 |
| **WARNs RLS** (always_true) | 64 | **16** | ✅ V3.4 |

**Banco de Dados**

| Métrica | Valor | Status |
|---------|-------|--------|
| **Tabelas** | 16 + 3 views | ✅ 100% íntegras |
| **Políticas RLS** | 16 (1 por tabela) | ✅ Consolidadas |
| **page_versions** | 11 (cleanup executado) | ✅ |
| **Checks de integridade** | 8/9 = 0 problemas | ✅ |
| **Schema oficial** | V3.0 (2026-02-19) | ✅ |

**Documentação:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

### **📊 Métricas Gerais**

#### **Database (2026-02-20):**
- ✅ **16 tabelas + 3 views** — 100% íntegras
- ✅ **0 ERRORs, 0 WARNs functions** — Supabase Linter limpo
- ✅ **16 políticas RLS** — 1 por tabela (V3.4 consolidado)
- ✅ **16/16 tabelas** — Com RLS + policies
- ✅ **Schema V3.0** — DDL oficial em `/guidelines/SCHEMA_OFICIAL_V3.0.sql`

#### **Código:**
- ✅ Sistema de grid 2×2 funcional
- ✅ Sistema de altura automática
- ✅ Design system centralizado (0 cores hardcoded em produção)
- ✅ Componentes 100% reutilizáveis
- ✅ Validação automática de gridRows implementada
- ✅ 84 testes automatizados (47 unitários + 37 integração)

#### **Documentação:**
- ✅ Guidelines.md V3.4 atualizado
- ✅ DATABASE_SCHEMA.md V3.4 atualizado
- ✅ CHANGELOG.md com histórico completo
- ✅ Migrations rastreadas e documentadas

---

## 📚 **DOCUMENTAÇÃO PRINCIPAL**

### **Documentos Essenciais:**

| Documento | Descrição | Público |
|-----------|-----------|---------|
| **[guidelines/Guidelines.md](./guidelines/Guidelines.md)** | ⭐ Regras do design system | TODOS |
| **[README.md](./README.md)** | 📖 Este arquivo (overview) | TODOS |
| **[CHANGELOG.md](./CHANGELOG.md)** | 📝 Histórico de versões | Dev/Admin |
| **[EXECUTE_SQL.sql](./EXECUTE_SQL.sql)** | 🗄️ Scripts SQL e migrations | DBA |
| **[ATTRIBUTIONS.md](./ATTRIBUTIONS.md)** | ⚖️ Atribuições legais | Todos |

### **Documentação Técnica:**

| Documento | Descrição | Público |
|-----------|-----------|---------|
| **[guidelines/SCHEMA_OFICIAL_V3.0.sql](./guidelines/SCHEMA_OFICIAL_V3.0.sql)** | ⭐ Schema oficial V3.0 (2026-02-19, somente leitura) | DBA/Dev |
| **[guidelines/DATABASE_SCHEMA.md](./guidelines/DATABASE_SCHEMA.md)** | Documentação do schema | DBA/Dev |
| **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | Arquitetura do sistema | Arquiteto |
| **[docs/PREVIEW_SYSTEM.md](./docs/PREVIEW_SYSTEM.md)** | Sistema de preview | Dev/Frontend |
| **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** | Guia de diagnóstico | Dev |

### **Sub-Guidelines:**

| Guia | Descrição |
|------|-----------|
| **[guidelines/CARDS_SYSTEM.md](./guidelines/CARDS_SYSTEM.md)** | Sistema de cards e templates |
| **[guidelines/CSS_GUIDELINES.md](./guidelines/CSS_GUIDELINES.md)** | Regras de CSS e Tailwind |
| **[guidelines/GRID_SYSTEM.md](./guidelines/GRID_SYSTEM.md)** | Sistema de grid 2×2 |
| **[guidelines/MEDIA_SYSTEM.md](./guidelines/MEDIA_SYSTEM.md)** | Sistema de mídia |
| **[guidelines/SECTIONS_SYSTEM.md](./guidelines/SECTIONS_SYSTEM.md)** | Sistema de seções |
| **[guidelines/SPACING_SYSTEM.md](./guidelines/SPACING_SYSTEM.md)** | Tokens de espaçamento |
| **[guides/SQL_GUIDE.md](./guides/SQL_GUIDE.md)** | Guia SQL para migrações |

---

## 🎯 **SISTEMA UNIFICADO DE SEÇÕES**

### **Conceito:**

**1 SEÇÃO = 1 TIPO (`unico`)** determinado por `elements + layout + styling + config`

### **Grid 2×2 Drag-and-Drop:**

```
┌──────────┬──────────┐
│ top-left │top-right │
├──────────┼──────────┤
│bottom-   │bottom-   │
│left      │right     │
└──────────┴──────────┘
```

**Posições disponíveis:**
- `top-left`, `top-right`, `top-center` (2 cols)
- `middle-left`, `middle-right` (2 rows)
- `bottom-left`, `bottom-right`, `bottom-center` (2 cols)
- `center` (fullscreen 2×2)

**Detalhes:** Ver seção "Sistema de Layout Avançado" em [guidelines/Guidelines.md](./guidelines/Guidelines.md)

---

## 🗄️ **BANCO DE DADOS**

### **Schema:**

**16 Tabelas Principais:**
1. `design_tokens` - Tokens de design (cores, tipografia, etc)
2. `pages` - Páginas do site
3. `sections` - Seções reutilizáveis
4. `page_sections` - Relação página-seção
5. `menu_items` - Itens do menu header
6. `menu_cards` - Cards do megamenu
7. `card_templates` - Templates de cards
8. `card_filters` - Filtros/tabs de cards
9. `template_cards` - Cards individuais
10. `section_template_cards` - Relação seção-template
11. `page_versions` - Versionamento de páginas
12. `section_versions` - Versionamento de seções
13. `media_assets` - Assets de mídia
14. `site_config` - Configurações gerais
15. `footer_config` - Configuração do rodapé
16. `kv_store_72da2481` - Key-value store

**Ver schema completo:** [guidelines/SCHEMA_OFICIAL_V3.0.sql](./guidelines/SCHEMA_OFICIAL_V3.0.sql) ← oficial atual  
**Schema anterior (referência histórica):** [guidelines/SCHEMA_OFICIAL_V2.0.sql](./guidelines/SCHEMA_OFICIAL_V2.0.sql)

### **Migrations Executadas:**

**Supabase (/supabase/migrations):**
1. ✅ `001_initial_schema.sql`
2. ✅ `002_populate_megamenu_data.sql`
3. ✅ `002_seed_data.sql`
4. ✅ `003_fix_ajustes_menu.sql`
5. ✅ `003_update_schema_for_cms_managers.sql`
6. ✅ `004_media_and_versioning.sql`
7. ✅ `005_seed_inicio_page.sql`
8. ✅ `006_fix_sql_queries.sql`
9. ✅ `007_fix_constraints_and_comments.sql`
10. ✅ `008_fix_data_consistency.sql`
11. ✅ `verify_database.sql` - Validação

**Auxiliares (/migrations):**
- Scripts auxiliares em `/migrations/` (executados via Supabase SQL Editor)

**FASE 5 (executadas 2026-02-13):**
- ✅ Otimizações (remoção de índices duplicados)
- ✅ Complementar (consolidação de policies)
- ✅ Correção final (og_image, RLS)
- ✅ VACUUM (limpeza de dead rows)

---

## 📋 **ESTRUTURA DO PROJETO**

```
bemdito-cms/
├── 📚 DOCUMENTAÇÕES (raiz)
│   ├── README.md                     📖 Este arquivo
│   ├── CHANGELOG.md                  📝 Histórico
│   ├── EXECUTE_SQL.sql               🗄️ Scripts SQL
│   └── ATTRIBUTIONS.md               ⚖️ Atribuições
│
├── 📚 DOCUMENTAÇÕES (guidelines/)
│   ├── Guidelines.md                 ⭐ Regras do sistema
│   ├── SCHEMA_OFICIAL_V3.0.sql       🗄️ ⭐ Schema oficial atual
│   ├── SCHEMA_OFICIAL_V2.0.sql       🗄️ ⛔ Supersedido (histórico)
│   ├── DATABASE_SCHEMA.md            📋 Docs do schema
│   └── (CARDS/CSS/GRID/MEDIA/SECTIONS/SPACING).md
│
├── 📁 CÓDIGO FONTE
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/               # Painel administrativo
│   │   │   ├── public/              # Site público
│   │   │   └── components/          # Componentes compartilhados
│   │   ├── lib/                     # Utils, hooks, contexts
│   │   └── styles/                  # CSS global (theme.css)
│   │
│   ├── supabase/
│   │   ├── migrations/              # Migrations oficiais
│   │   └── functions/server/        # Edge Functions (Hono)
│   │
│   └── migrations/                  # Migrations auxiliares
│
├── 📁 DIRETÓRIOS AUXILIARES
│   ├── docs/                        # Documentação especializada
│   ├── guides/                      # Guias técnicos
│   ├── scripts/                     # Scripts de automação
│   ├── templates/                   # Templates de componentes
│   └── temporarios/                 # Arquivos temporários
│
└── 📦 CONFIGURAÇÃO
    ├── package.json
    ├── vite.config.ts
    ├── postcss.config.mjs
    └── .env (criar)
```

---

## ⚡ **QUICK START**

### **1. Acessar Painel Admin:**
```
http://localhost:3000/admin
```

### **2. Gerenciar Design System:**
```
http://localhost:3000/admin/design-system
```

### **3. Criar Seções:**
```
http://localhost:3000/admin/sections-manager
```

### **4. Editar Páginas:**
```
http://localhost:3000/admin/pages-manager
```

### **5. Configurar Menu:**
```
http://localhost:3000/admin/menu-manager
```

### **6. Gerenciar Cards:**
```
http://localhost:3000/admin/cards-manager
```

---

## 🔧 **TROUBLESHOOTING**

### **Seção não aparece no site:**
```sql
-- 1. Verificar se seção existe
SELECT * FROM sections WHERE id = 'SECTION_ID';

-- 2. Verificar vínculo com página
SELECT * FROM page_sections WHERE section_id = 'SECTION_ID';

-- 3. Verificar página publicada
SELECT published FROM pages WHERE id = 'PAGE_ID';
```

### **Validar banco completo:**
```sql
-- Execute no Supabase SQL Editor
\i supabase/migrations/verify_database.sql
```

### **Logs do sistema:**
```bash
# Console do navegador (F12)
# Procurar por erros com prefixos:
# 🔴 [Erro]
# 🟠 [Aviso]
# 🟢 [Sucesso]
# 🔵 [Info]
```

---

## 🎯 **PRÓXIMOS PASSOS**

### **📋 Planejamento Completo:**
Itens pendentes listados abaixo (Sprint 1–4).

### **Pendente — Conteúdo (antes de produção):**
- [x] ~~Adicionar imagens nos 6 cards do template "Serviços BemDito"~~ — **Não necessário:** toggle "Exibir Mídia nos Cards" está desativado no template (intencional)
- [ ] Validar página pública `/` visualmente (mobile + desktop)

### **Opcional — Melhorias futuras:**
- [ ] Criar Schema Oficial V4.0 (após próxima auditoria)
- [ ] Preencher SEO (meta_title, meta_description, og_image)
- [ ] Criar testes E2E (Playwright)

---

## 🔗 **LINKS ÚTEIS**

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Lucide Icons](https://lucide.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)

---

## 📖 **CHANGELOG RECENTE**

### **v2.0.4 - Segurança + RLS Consolidation (2026-02-20)**
- ✅ Supabase Linter: 0 ERRORs | 0 WARNs functions | 16 WARNs RLS
- ✅ V3.3: 3 views SECURITY INVOKER + 8 funções search_path
- ✅ V3.4: Políticas RLS: 64 → 16 (redução 75%)
- ✅ Bug 406 corrigido (DynamicPage.tsx)

### **v2.0.3 - Auditoria V3.0 (2026-02-19)**
- ✅ Schema oficial V3.0 criado e verificado
- ✅ 7 correções A–G aplicadas
- ✅ page_versions: 181 → 10 (cleanup)

**Ver completo:** [CHANGELOG.md](./CHANGELOG.md)

---

## 🆘 **PRECISA DE AJUDA?**

1. **📖 Leia:** [guidelines/Guidelines.md](./guidelines/Guidelines.md)
2. **🎯 Consulte:** [guidelines/Guidelines.md](./guidelines/Guidelines.md) → seção relevante
3. **🔍 Busque:** Documento específico na lista acima
4. **📊 Valide:** Execute `/supabase/migrations/verify_database.sql`
5. **📝 Veja:** [CHANGELOG.md](./CHANGELOG.md) para histórico de correções

---

## ✅ **CONCLUSÃO**

### **Sistema está:**
- ✅ **100% Funcional** - Todas features implementadas
- ✅ **100% Consolidado** - Database otimizado
- ✅ **100% Documentado** - 28 documentações essenciais
- ✅ **Pronto para Sprint 1** - Validações e testes

### **Score Atual:**
- 🟢 **Database:** 100% íntegro
- 🟢 **Código:** Funcional (falta testes)
- 🟢 **Documentação:** Consolidada
- 🟡 **Testes:** Pendente (Sprint 2)

---

**Mantido por:** Equipe BemDito CMS  
**Versão:** 2.0.4  
**Última Atualização:** 2026-02-20  
**Supabase Linter:** 0 ERRORs | 0 WARNs functions | 16 WARNs RLS ✅