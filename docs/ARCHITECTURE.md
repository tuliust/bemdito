# 🏗️ ARQUITETURA - BemDito CMS

**Versão:** 1.0
**Data:** 2026-02-19
**Última atualização:** 2026-02-19

---

## 🎯 Visão Geral

Este documento registra as **decisões técnicas críticas** tomadas durante o desenvolvimento do BemDito CMS.

---

## 📐 Decisões Arquiteturais

### 1. Sistema Unificado de Seções (2026-02-10)

**Decisão:** Consolidar todos os tipos de seção (`hero`, `cta`, `cards_grid`, etc) em um **tipo único** (`'unico'`).

**Motivação:**
- ❌ **Antes:** 6 funções de renderização separadas (~800 linhas duplicadas)
- ✅ **Depois:** 1 função `renderUnifiedLayout()` (~300 linhas)

**Benefícios:**
- 100% de consistência entre seções
- Mudanças globais em um só lugar
- Redução de bugs (correção afeta tudo)
- Manutenção simplificada

**Impacto:** Sistema inteiro de seções.

**Arquivo:** `SectionRenderer.tsx`

---

### 2. JSONB para Flexibilidade Máxima (2026-02-08)

**Decisão:** Usar **4 colunas JSONB** na tabela `sections` ao invés de 100+ colunas relacionais.

**Estrutura:**
```typescript
sections {
  config: JSONB;    // Configurações gerais (gridRows, gridCols, textos, cores)
  layout: JSONB;    // Posições dos elementos (text, media, cards) — strings diretas
  styling: JSONB;   // Espaçamento, tipografia, altura
  elements: JSONB;  // Elementos visíveis (hasCards, hasMedia, hasButton…)
}
```

**Motivação:**
- ✅ Schema flexível (adicionar campos sem migration)
- ✅ Configurações opcionais/condicionais
- ✅ Versionamento simples (snapshot completo em JSONB)
- ✅ Queries complexas via GIN index

**Trade-offs:**
- ❌ Sem constraints nativos do PostgreSQL
- ❌ Queries JSONB mais verbosas
- ✅ Validação feita no frontend (TypeScript)

**Impacto:** Tabelas `sections`, `card_templates`, `menu_items`, `footer_config`.

**Arquivo:** `/guidelines/SCHEMA_OFICIAL_V3.0.sql` ← oficial atual (V2.0 supersedido em 2026-02-19)

---

### 3. Sistema de Grid 2×2 (2026-02-14)

**Decisão:** Usar **grid CSS de 2 colunas × 2 linhas** para posicionamento de elementos.

**Posições válidas:**
```
┌─────────┬─────────┐
│ top-    │ top-    │
│ left    │ right   │
├─────────┼─────────┤
│ bottom- │ bottom- │
│ left    │ right   │
└─────────┴─────────┘

+ middle-left, middle-right, center
+ top-center, bottom-center
```

**Motivação:**
- ✅ Flexibilidade total de layout
- ✅ Elementos podem ocupar 1×1, 2×1, 1×2 ou 2×2
- ✅ Texto + mídia lado a lado ou empilhados

**Regras críticas:**
- Posições são **strings diretas**, não objetos
- `gridRows/gridCols` em `config`, **não** em `layout`
- Auto-fix em runtime se dados inconsistentes

**Impacto:** Sistema inteiro de seções.

**Arquivo:** `SectionRenderer.tsx`

---

### 4. Spacing em Incrementos de 25px (2026-02-17)

**Decisão:** Padronizar todos os spacings (padding, margin, gap) em **incrementos de 25px**.

**Valores disponíveis:**
```
0px, 25px, 50px, 75px, 100px, 125px, 150px, 175px, 200px
```

**Motivação:**
- ✅ Design System consistente
- ✅ Valores previsíveis e escaláveis
- ✅ Fácil de entender (múltiplos de 25)
- ❌ **Antes:** Valores legados (8px, 16px, 24px, 32px, 48px, 64px, 80px, 96px)

**Implementação:**
- Migration SQL para converter valores antigos
- Dropdowns no admin usam apenas valores padronizados
- `parseSpacing()` aceita tokens legados (retrocompatibilidade)

**Impacto:** Sistema inteiro de spacing.

**Arquivo:** `SectionBuilder.tsx`, `SectionRenderer.tsx`

---

### 5. Auto-Fix de Dados Inconsistentes (2026-02-15)

**Decisão:** Implementar **validação e correção automática em runtime** ao invés de apenas lançar erros.

**Exemplo: gridRows inconsistente**
```typescript
const calculateGridRows = (layout, configGridRows) => {
  const positions = [layout?.desktop?.text, layout?.desktop?.media];
  const requiresTwoRows = positions.some(pos =>
    ['middle-left', 'middle-right', 'center'].includes(pos)
  );

  if (requiresTwoRows && configGridRows === 1) {
    console.warn('⚠️ [AUTO-FIX] gridRows ajustado de 1 para 2');
    return 2;  // ✅ Corrigir automaticamente
  }

  return configGridRows;
};
```

**Motivação:**
- ✅ Site **nunca quebra** por dados inconsistentes
- ✅ Warnings no console indicam onde corrigir permanentemente
- ✅ Melhor UX (funciona mesmo com bugs)

**Trade-off:**
- ❌ Pode mascarar bugs
- ✅ Mas migrations SQL corrigem permanentemente

**Impacto:** `SectionRenderer.tsx`

---

### 6. Mídia como Background ao invés de Elemento Separado (2026-02-10)

**Decisão:** Cards renderizam mídia como **background com opacidade configurável** ao invés de elemento `<img>` separado.

**Estrutura:**
```tsx
<div className="relative min-h-[300px]">
  {/* 🔵 Camada 1: Cor de fundo sólida */}
  <div style={{ backgroundColor: bgColor }} />

  {/* 🖼️ Camada 2: Mídia com opacidade */}
  <img style={{ opacity: mediaOpacity / 100 }} />

  {/* 📝 Camada 3: Conteúdo (texto, ícone) */}
  <div className="relative z-10">{/* Conteúdo */}</div>
</div>
```

**Motivação:**
- ✅ Flexibilidade de design (cor de fundo + imagem)
- ✅ Controle de opacidade (0-100%)
- ✅ Texto sempre legível (z-index maior)

**Impacto:** Sistema de cards.

**Arquivo:** `CardRenderer.tsx`

---

### 7. Operador `??` ao invés de `||` para Valores Numéricos (2026-02-16)

**Decisão:** Usar **nullish coalescing (`??`)** ao invés de OR lógico (`||`) quando `0` é um valor válido.

**Problema:**
```typescript
const padding = parseInt("0px") || 24;  // ❌ Retorna 24 (0 é falsy)
```

**Solução:**
```typescript
const parsed = parseInt("0px");
const padding = !isNaN(parsed) ? parsed : 24;  // ✅ Retorna 0
```

**Motivação:**
- ✅ `0` é um valor válido para padding/spacing
- ✅ Evita bugs sutis (padding-top: 0px virando 24px)

**Regra geral:**
- Use `??` quando `0`, `false` ou `''` são valores válidos
- Use `||` apenas para fallbacks onde falsy = inválido

**Impacto:** Todos os parsers numéricos.

**Arquivo:** `SectionRenderer.tsx` (função `parseSpacing`)

---

### 8. Storage Privado com Signed URLs (2026-02-08)

**Decisão:** Usar bucket **privado** (`make-72da2481-media`) com signed URLs ao invés de público.

**Motivação:**
- ✅ Controle de acesso (futuro: paywalls, login)
- ✅ URLs expiram (segurança)
- ✅ Fácil migrar para privado depois

**Configuração:**
- Validade: 1 ano (suficiente para cache)
- Políticas RLS: INSERT, SELECT, DELETE para `anon`

**Trade-off:**
- ❌ URLs mais longas
- ❌ Precisa regenerar signed URLs periodicamente
- ✅ Mas componente `MediaUploader` gerencia automaticamente

**Impacto:** Sistema de upload de mídias.

**Arquivo:** `MediaUploader.tsx`

---

### 9. Migrations Incrementais ao invés de Recreate (2026-02-08)

**Decisão:** Sempre usar **migrations incrementais** (`ALTER TABLE ADD COLUMN`) ao invés de recriar tabelas.

**Motivação:**
- ✅ Preserva dados existentes
- ✅ Rollback possível
- ✅ Versionamento claro

**Nomenclatura obrigatória:**
```
<número>_<descrição_curta>.sql

Exemplos:
001_initial_schema.sql
002_seed_data.sql
003_update_schema_for_cms_managers.sql
```

**Trade-off:**
- ❌ Acumula migrations ao longo do tempo
- ✅ Mas histórico completo preservado

**Impacto:** Todas as mudanças de schema.

**Pasta:** `/supabase/migrations/`

---

### 10. Tokens UUID ao invés de Valores Hardcoded (2026-02-08)

**Decisão:** Usar **foreign keys para `design_tokens`** ao invés de valores hardcoded.

**Estrutura:**
```sql
card_templates {
  card_bg_color_token UUID → design_tokens.id
  icon_color_token UUID → design_tokens.id
  title_font_size UUID → design_tokens.id
}
```

**Motivação:**
- ✅ Design System centralizado
- ✅ Mudanças globais (ex: trocar cor primária afeta tudo)
- ✅ Consistência garantida (não pode usar cor que não existe)

**Trade-off:**
- ❌ Queries JSONB mais complexas (JOIN necessário)
- ✅ Mas benefício de consistência compensa

**Impacto:** ~25 foreign keys em 5 tabelas.

**Arquivo:** `/guidelines/SCHEMA_OFICIAL_V3.0.sql` ← oficial atual

---

### 11. Sistema de Tema Dinâmico do Painel Admin (2026-02-21)

**Decisão:** Substituir classes Tailwind utilitárias hardcoded no JSX do admin por **CSS custom properties injetadas dinamicamente** via `AdminThemeProvider`.

**Problema anterior:**
- Tipografia do painel (tamanho, peso, cor) estava distribuída em centenas de classes Tailwind (`text-xl font-semibold text-gray-900`) em cada componente
- Impossível alterar globalmente sem editar arquivo por arquivo

**Solução arquitetural:**
```
design_tokens (category='admin-ui', 16 tokens)
  → AdminThemeProvider (montado em /src/app/admin/layout.tsx)
    → buildCSS() → <style id="admin-theme-dynamic"> no <head>
      → CSS vars --admin-* disponíveis globalmente
        → componentes consomem via adminVar() em style={{}}
```

**Novo helper `adminVar()`:**
```typescript
import { adminVar } from '@/app/components/admin/AdminThemeProvider';

// Retorna referência à CSS var — nunca o valor diretamente
adminVar('item-title-grid', 'size')   // → 'var(--admin-item-title-grid-size)'
adminVar('card-border', '')           // → 'var(--admin-card-border)'
```

**Regra de uso:**
- ✅ Componentes admin usam `style={{ fontSize: adminVar('...', 'size') }}`
- ✅ Tema atualiza em runtime sem refresh (`refreshTheme()` após salvar no banco)
- ❌ `theme.css` NÃO contém vars `--admin-*` (são exclusivamente dinâmicas)

**Impacto:** Layout admin, AdminGridCard, AdminEmptyState, AdminPageLayout (tipografia).

**Arquivos:**
- Provider: `/src/app/components/admin/AdminThemeProvider.tsx`
- Gestão: `/src/app/admin/system-manager/page.tsx`
- Layout: `/src/app/admin/layout.tsx`

---

## 🎯 Padrões de Código

### 1. Componentes Reutilizáveis

**Regra:** Sempre criar componente reutilizável ao invés de copiar/colar código.

**Exemplos:**
- `BaseModal` - Base para todos os modais
- `MediaUploader` - Upload com drag-and-drop e biblioteca
- `ColorTokenPicker` - Seletor de cores do DS
- `CornerPositionSelector` - Seletor de posição no grid

**Localização:** `/src/app/components/admin/`

---

### 2. Validação em Camadas

**Camada 1: TypeScript (compile-time)**
```typescript
interface Section {
  layout: SectionLayout;   // desktop.text é GridPosition (string union)
  styling: SectionStyling; // spacing usa px ou tokens legados
}
```

**Camada 2: Runtime (SectionRenderer)**
```typescript
const calculateGridRows = (layout, configGridRows) => {
  // ✅ Auto-fix se dados inconsistentes
  if (requiresTwoRows && configGridRows === 1) {
    return 2;
  }
  return configGridRows;
};
```

**Camada 3: SQL Constraints**
```sql
ALTER TABLE card_templates
ADD CONSTRAINT media_opacity_range
CHECK (media_opacity >= 0 AND media_opacity <= 100);
```

---

### 3. Console Logging Estratégico

**Regra:** Sempre logar informações de debug com prefixo identificável.

**Exemplo:**
```typescript
console.log('🔍 [loadSectionCards] DIAGNÓSTICO INICIAL...');
console.log('   sectionId:', sectionId);
console.log('   cardTemplateId:', cardTemplateId);
console.warn('⚠️ [AUTO-FIX] gridRows ajustado de 1 para 2');
console.error('❌ [SectionRenderer] Erro ao carregar cards:', error);
```

**Benefícios:**
- ✅ Fácil filtrar logs por componente
- ✅ Emojis facilitam identificação visual
- ✅ Hierarquia clara (🔍 info, ⚠️ warning, ❌ error)

---

### 4. Documentação Inline em SQL

**Regra:** Sempre documentar queries complexas com comentários.

**Exemplo:**
```sql
-- ✅ CORREÇÃO 2026-02-17: Converter objetos para strings
UPDATE sections
SET layout = jsonb_set(
  layout,
  '{desktop,text}',
  to_jsonb((layout->'desktop'->'text'->>'position'))  -- Extrai string do objeto
)
WHERE
  jsonb_typeof(layout->'desktop'->'text') = 'object'  -- Só se for objeto
  AND layout->'desktop'->'text'->>'position' IS NOT NULL;
```

---

## 📊 Métricas de Código

| Métrica | Valor |
|---------|-------|
| **Linhas de código** | ~18.000 |
| **Componentes React** | 60+ |
| **Tabelas no banco** | 16 |
| **Migrations SQL** | 8 (numeradas 001–008) |
| **Tokens design_tokens** | 53 (37 pré-existentes + 16 admin-ui adicionados em 2026-02-21) |
| **Correções críticas** | 130+ |
| **Documentação consolidada** | Guidelines.md + /guidelines/*.md |

---

## 🔗 Referências

- [Guidelines.md](/guidelines/Guidelines.md) - Regras do Design System (documento canônico)
- [Schema Oficial V3.0](/guidelines/SCHEMA_OFICIAL_V3.0.sql) - ⭐ DDL oficial atual (2026-02-19)
- [Troubleshooting](/docs/TROUBLESHOOTING.md) - Problemas comuns e soluções
- [Preview System](/docs/PREVIEW_SYSTEM.md) - Especificação do sistema de preview
- [SQL Guide](/guides/SQL_GUIDE.md) - Queries úteis e tabelas reais

---

**Última atualização:** 2026-02-21
**Mantido por:** Equipe BemDito CMS