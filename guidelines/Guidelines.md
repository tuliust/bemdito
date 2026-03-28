# 🎨 BemDito CMS - Design System Guidelines

**Versão:** 2.6  
**Data:** 2026-02-24 (v2.6 — Auditoria e correção do sistema de Card Templates: 4 bugs corrigidos — (1) FK constraint `icon_bg_color_token → design_tokens` ausente no banco [SQL abaixo]; (2) interface `CardTemplate` em `TemplateEditorModal.tsx` adicionado `icon_bg_color_token` e `variant` union type corrigido para incluir `'scroll-reveal'`; (3) UI Admin: seção Ícone no Design tab agora exibe `ColorTokenPicker` para `icon_bg_color_token`; (4) `media_opacity` do template agora é default ao criar novo card + `CardRenderer` usa fallback `card.media_opacity ?? template.media_opacity ?? 100`; `section_template_cards` dropada com CASCADE após view `v_database_stats` recriada sem ela — 7 tabelas no total. SQL a executar: `ALTER TABLE card_templates ADD CONSTRAINT fk_card_templates_icon_bg_color_token FOREIGN KEY (icon_bg_color_token) REFERENCES design_tokens(id) ON DELETE SET NULL;`; v2.5 — REGRA ABSOLUTA: Zero scrollbar em seções/colunas públicas — `overflow: hidden` obrigatório em TODOS os containers do `SectionRenderer.tsx`; removidos 6 pontos de `overflow: visible/auto/scroll`; estratégia: auto-fit texto → ajustar mídia → reduzir cards → clip; v2.4 — DATABASE_SCHEMA.md atualizado para V3.5: design_tokens **143** total, **93** admin-ui confirmados via SQL real, /migrations limpa, EXECUTE_SQL.sql atualizado com checks de integridade V3.5; v2.3 — Seção §7 adicionada: "Checklist Obrigatório para Novas Páginas e Modais Admin" com 10 sub-seções cobrindo imports, estrutura, badges de status, botões Excluir/Ação/Primário, cards internos, estado vazio, mapa completo de tokens e anti-patterns; `DraggableSectionItem.tsx`: botão Excluir tokenizado via `delete-btn-*`, `useRef` adicionado, `hexToRgba` duplicado removido; `sections-manager/page.tsx`: `AdminPrimaryButton` importado (ausência causava `ReferenceError`), badge Publicado/Rascunho tokenizada via `var(--primary)` / `var(--admin-field-placeholder)`; v2.2 — `footer-manager/page.tsx` 100% tokenizado: imports `React`/hooks + `AdminPrimaryButton` adicionados; v2.1 — Migration v1.12: token `sidebar-separator` (1 novo token `admin-ui`); banco com **76 tokens `admin-ui`**; 2 `<Separator>` em `layout.tsx` tokenizados via `var(--admin-sidebar-separator)`; v2.0 — Migration v1.11 executada: 22 novos tokens `admin-ui` para modais (`modal-*`), colapsíveis (`collapsible-*`), itens de lista (`list-item-*`), sub-navegação (`sub-nav-*`), sub-labels (`sub-label`) e botão cancelar (`btn-cancel-*`); banco com **75 tokens `admin-ui`**; `BaseModal`, `TemplateEditorModal` e `UnifiedSectionConfigModal` 100% tokenizados — zero hardcodes restantes; ✅ `Ctrl+Shift+R` necessário; v1.9 — 53 tokens `admin-ui` finalizados; v1.8 — Migration v1.10: 14 novos tokens `admin-ui`; v1.7 — Label tokenizado via `item-tertiary`; v1.6 — AdminThemeProvider)  
**Status:** 📘 Documentação Oficial

---

## 🎯 Overview

Este documento define as regras, padrões e tokens do Design System usado no BemDito CMS. Siga estas diretrizes para manter consistência visual em todo o projeto.

> 📚 **Catálogo completo de componentes:** [`/guidelines/COMPONENTS_CATALOG.md`](./COMPONENTS_CATALOG.md)  
> Consulte-o **OBRIGATORIAMENTE** antes de criar qualquer componente novo — modal, botão, campo de formulário, upload de mídia, picker de cor/tipografia/ícone, etc.

---

## 🔒 ARQUIVOS PROTEGIDOS — SOMENTE LEITURA (2026-02-19)

Os arquivos abaixo são fontes de verdade e **não devem ser editados diretamente**.  
Para atualizá-los: execute o processo de migration/auditoria e substitua com nova versão numerada.

| Arquivo | Motivo |
|---------|--------|
| `/guidelines/SCHEMA_OFICIAL_V3.0.sql` | ⭐ **Schema oficial** — DDL confirmado via auditoria V3.0 em 2026-02-19. Somente leitura. |
| `/guidelines/DATABASE_SCHEMA.md` | Documentação oficial do schema (V3.5) — atualizar junto com o SQL |
| `/guidelines/QUERIES_AUDITORIA_V3.sql` | ⭐ Queries permanentes de auditoria (Blocos 1-15) |
| `/supabase/functions/server/kv_store.tsx` | Sistema interno Figma Make |
| `/utils/supabase/info.tsx` | Configuração do projeto Figma Make |

**Regras obrigatórias:**

✅ **SEMPRE** consultar `/guidelines/SCHEMA_OFICIAL_V3.0.sql` antes de escrever queries SQL  
✅ **SEMPRE** verificar a tabela "Colunas que NÃO Existem" em `DATABASE_SCHEMA.md` antes de qualquer query  
✅ **PARA ATUALIZAR** o schema oficial: execute migration → re-execute `/guidelines/QUERIES_AUDITORIA_V3.sql` → crie `SCHEMA_OFICIAL_V4.0.sql`  
❌ **NUNCA** editar o schema oficial diretamente  
❌ **NUNCA** usar colunas inexistentes: `display_mode`, `cols`, `card_filters.name`, `template_cards.order`, `template_cards.published`  
❌ **NUNCA** assumir que `section_template_cards` não tem `id` ou `updated_at` — tem ambos (6 colunas, confirmado V3.1)  
❌ **NUNCA** usar `supabase` em componente sem importar: `import { supabase } from '../../../lib/supabase/client'` — causa `ReferenceError: supabase is not defined`

> ℹ️ **V3.5 (2026-02-21):** Pasta `/migrations` foi **limpa**. Todas as migrations V3.0–V3.4 (schema/segurança/RLS) e V1.7–V1.13 (tokens admin-ui) foram aplicadas ao banco e documentadas em `/guidelines/DATABASE_SCHEMA.md`. Scripts de verificação disponíveis em `/EXECUTE_SQL.sql`.

---

## ✅ CONFIGURAÇÃO FIGMA: Exportação de Assets (2026-02-19)

### Status: ✅ **RESOLVIDO E VALIDADO**

**Problema Resolvido:**
- Arquivo `.vscode/settings.json` estava incompleto (faltavam 2 linhas)
- Branch local divergiu do GitHub
- Extensão Figma lia configuração de camada errada (Remote ao invés de Workspace)

**Configuração Correta:**
```json
{
  "figma.assetExportDirectory": "public/images",
  "figma.assetPublicPath": "/images",
  "figma.autocompleteBlocks": false,
  "figma.autocompleteProperties": true
}
```

**Estrutura de Pastas:**
```
/workspaces/Bemdito2026ok/
├── .vscode/
│   └── settings.json          ← Configuração completa (4 linhas)
├── public/
│   └── images/                ← Pasta para assets exportados
│       └── .gitkeep          ← Mantém pasta no Git
```

**Validação Final (2026-02-19 02:30):**
- ✅ Git Status: `On branch main, up to date with origin/main`
- ✅ Arquivo: 4 linhas completas
- ✅ Pasta: Criada e commitada
- ✅ Commits: Local sincronizado com GitHub (commit `9642319`)
- ✅ Extensão: `figma.figma-vscode-extension` instalada e ativa
- ✅ Comandos: 6 comandos Figma disponíveis via Command Palette
- ✅ Teste: Imagem baixada em `public/images/test-image.jpg` (8319 bytes)
- ✅ Componente: React criado usando `/images/` (não `figma:asset/`)

**Regras Obrigatórias:**
- ✅ **SEMPRE** usar `public/images/` para assets do Figma
- ✅ **SEMPRE** importar assets como `/images/nome-arquivo.png`
- ✅ **SEMPRE** manter `.gitkeep` na pasta `public/images/`
- ✅ **SEMPRE** usar MediaUploader para upload de assets (recomendado)
- ❌ **NUNCA** usar `figma:asset/` em código React (só funciona em imports estáticos)
- ❌ **NUNCA** hardcoded paths absolutos (`/workspaces/...`)

**Comandos Figma Disponíveis (Ctrl+Shift+P):**
- `Figma: Inspect designs` - Abrir painel de inspeção
- `Figma: Open Design File` - Conectar arquivo do Figma
- `Figma: Go to Linked Design` - Abrir no Figma
- `Figma: Focus on Files View` - Navegar arquivos
- `Figma: Log Out` - Desconectar conta

**Testes Aprovados (5/5):**
1. ✅ Extensão instalada
2. ✅ Configuração correta (4 linhas)
3. ✅ Pasta criada e acessível
4. ✅ Comandos disponíveis
5. ✅ Componente React funcional

**Documentação Completa:** 
- `/SUCESSO_CONFIGURACAO_FIGMA_FINAL.md` (Resolução)
- `/VALIDACAO_FIGMA_100_APROVADA.md` (Testes aprovados)

---

## ✅ CORREÇÃO CRÍTICA: Texto em Grid 1 Coluna com Posição "Left" (2026-02-18)

### Problema Resolvido
Seções com **`gridCols = 1`** mas **posição de texto contendo "left"** (top-left, middle-left, bottom-left) renderizavam texto ocupando **100% da largura** ao invés de apenas **50% (coluna esquerda)**.

### Sintomas
- Seções: Portfólio, Como funciona?, Blog, Orçamento
- `effectiveGridCols: 1`
- `textPosition: "top-left"` ou `"middle-left"`
- `useGrid: false` ❌ → Layout vertical
- Texto ocupa largura total (100%)

### Causa Raiz
A lógica do `useGrid` não considerava seções SEM mídia/cards mas com posição "left":

```typescript
// ❌ ANTES (INCORRETO)
const useGrid = hasMedia || hasCardsInSeparateColumn || isSingleElementInGrid2x2;
// Quando todas são false → useGrid = false → layout vertical → texto 100%
```

### Solução Implementada

**Detecção de Texto Apenas na Esquerda:**
```typescript
// ✅ NOVO 2026-02-18: Detectar texto que deve ficar apenas na esquerda
const isTextOnlyLeft = effectiveGridCols === 1 && 
                       !hasMedia && 
                       !hasCardsInSeparateColumn && 
                       (textPosition?.includes('left') || textPosition?.includes('center'));
```

**Forçar Grid de 2 Colunas:**
```typescript
// ✅ NOVO 2026-02-18: Incluir isTextOnlyLeft
const useGrid = hasMedia || hasCardsInSeparateColumn || isSingleElementInGrid2x2 || isTextOnlyLeft;

// ✅ NOVO 2026-02-18: Forçar 2 colunas quando texto apenas na esquerda
gridTemplateColumns: (effectiveGridCols === 2 || isTextOnlyLeft) ? '1fr 1fr' : '1fr',
```

### Comportamento Esperado

**ANTES (Problema):**
```
┌─────────────────────────────────────┐
│ CLIENTES                            │
│                                     │
│ Quem já fala bem                    │ ← Texto ocupa 100%
│                                     │
│ Ainda não há posts...               │
└─────────────────────────────────────┘
```

**DEPOIS (Correto):**
```
┌─────────────────────────────────────┐
│ CLIENTES          │                 │
│                   │                 │
│ Quem já fala bem  │                 │ ← Texto ocupa 50% (esquerda)
│                   │                 │
│ Ainda não há...   │                 │
└─────────────────────────────────────┘
```

### Seções Afetadas

| Seção | gridCols | gridRows | text_pos | Status |
|-------|----------|----------|----------|--------|
| Portfólio | 1 | 2 | top-left | ✅ CORRIGIDO |
| Como funciona? | 1 | 2 | top-left | ✅ CORRIGIDO |
| Blog | 1 | 2 | middle-left | ✅ CORRIGIDO |
| Orçamento | 1 | 1 | top-left | ✅ CORRIGIDO |

**Total:** 4 seções corrigidas automaticamente (correção no código, sem migration SQL necessária)

### Regras Obrigatórias

✅ **SEMPRE** que `gridCols = 1` E posição contém "left", criar grid de 2 colunas  
✅ **SEMPRE** forçar `gridTemplateColumns: '1fr 1fr'` quando `isTextOnlyLeft = true`  
✅ **SEMPRE** deixar coluna direita vazia (disponível para expansão futura)  
❌ **NUNCA** usar layout vertical quando posição indica intenção de ocupar apenas uma coluna

**Arquivo Modificado:**
- `/src/app/public/components/SectionRenderer.tsx` (linhas 1206-1223, 1273)

**Status Atual (2026-02-18):**
- ✅ Código: Correção implementada
- ✅ Seções: 4/4 renderizam corretamente (50% esquerda)
- ✅ Grid: Forçado 2 colunas quando `isTextOnlyLeft = true`
- ⏳ Validação: Aguardando teste visual no navegador

---

## ⚠️ ATUALIZAÇÃO: Novas Opções de Spacing (2026-02-17)

### Mudança Implementada
Os dropdowns de **Padding Superior**, **Padding Inferior**, **Margem Esquerda**, **Margem Direita**, **Gap (entre colunas)** e **Gap (entre linhas)** agora oferecem valores padronizados em incrementos de 25px.

### Novas Opções Disponíveis
Todos os 6 campos agora usam as mesmas opções:
- **0px** - Sem espaçamento
- **25px** - Espaçamento mínimo
- **50px** - **PADRÃO** (recomendado)
- **75px** - Espaçamento médio
- **100px** - Espaçamento grande
- **125px** - Espaçamento maior
- **150px** - Espaçamento extra grande
- **175px** - Espaçamento muito grande
- **200px** - Espaçamento máximo

### Valor Padrão
Todos os campos têm **50px como padrão** quando não configurados.

### Migration Aplicada
**Arquivo:** `/migrations/2026-02-17_v6.14_update_spacing_to_50px.sql`

Todos os valores legados (8px, 10px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px) foram **migrados para 50px** automaticamente.

### Onde Configurar
- **Painel Admin:** `/admin/sections-manager` → Editar Seção → Aba "Design" → Seção "1. Altura da Seção"
- **Editor de Páginas:** `/admin/pages-manager` → Configurar Seção → Aba "Layout"

### Renderização
O `SectionRenderer.tsx` lê os valores de `styling.spacing.{top,bottom,left,right,gap,rowGap}` e aplica corretamente via função `parseSpacing()` que aceita:
- ✅ Tokens legados (none, xs, sm, md, lg, xl, 2xl)
- ✅ Valores em px (0px, 25px, 50px, etc)
- ✅ Valores numéricos (0, 25, 50, etc)

**Como funciona:**
```typescript
// SectionRenderer.tsx (linhas 545-550)
const paddingTopConfig = parseSpacing(sectionStyling.spacing?.top, 50);
const paddingBottomConfig = parseSpacing(sectionStyling.spacing?.bottom, 50);
const paddingLeftConfig = parseSpacing(sectionStyling.spacing?.left, 50);
const paddingRightConfig = parseSpacing(sectionStyling.spacing?.right, 50);
const columnGapConfig = parseSpacing(sectionStyling.spacing?.gap, 50); // ✅ Gap entre colunas
const rowGapConfig = parseSpacing(sectionStyling.spacing?.rowGap, 50); // ✅ Gap entre linhas

// Aplicação no grid (linha 1264-1265)
columnGap: shouldRemoveGap ? '0px' : `${columnGapConfig}px`, // ✅ Aplicado quando gridCols = 2
rowGap: `${rowGapConfig}px`, // ✅ Aplicado quando gridRows = 2
```

**Quando o Column Gap é aplicado:**
- ✅ Seções com **2 colunas** (grid 1×2 ou 2×2)
- ✅ Seções com texto + mídia lado a lado
- ✅ Seções com cards em colunas múltiplas
- ❌ **NÃO é aplicado** quando `mediaDisplayMode = "alinhada"` E mídia está nas bordas (left/right)

**Quando o Row Gap é aplicado:**
- ✅ Seções com **2 linhas** (grid 2×1 ou 2×2)
- ✅ Seções com texto na linha 1 + cards na linha 2
- ✅ Seções com mídia na linha 1 + conteúdo na linha 2
- ✅ **SEMPRE aplicado** quando há 2 linhas (sem condicional)

### Arquivos Modificados
- `/src/app/admin/sections-manager/SectionBuilder.tsx` (6 dropdowns implementados)
- `/src/app/public/components/SectionRenderer.tsx` (rowGap adicionado)
- `/migrations/2026-02-17_v6.14_update_spacing_to_50px.sql` (migration SQL)
- `/migrations/2026-02-17_v6.14.1_fix_md_tokens.sql` (correção token "md")
- `/EXECUTE_SQL.sql` (scripts de validação)
- `/guidelines/Guidelines.md` (esta documentação)

### Validação SQL (2026-02-17)
**Status:** ✅ 100% Validado pelo usuário

```sql
-- Resultado da validação:
-- ✅ 10 seções no banco
-- ✅ 7 seções com gridRows = 2 (rowGap aplicado)
-- ✅ 2 seções com grid 2×2 (columnGap + rowGap aplicados)
-- ✅ UPDATE teste executado com sucesso (seção "Monte seu Projeto": rowGap = 75px)
-- ✅ Fallback para 50px funciona quando rowGap é NULL
```

### 🐛 Correção Crítica: rowGap Hardcoded (2026-02-17)

**Problema:** Campo "Gap entre linhas" configurado no modal não renderizava na página pública.

**Causa:** Linha 1303 do `SectionRenderer.tsx` tinha `rowGap: 0` hardcoded que sobrescrevia o valor configurado.

**Solução:** Removida linha `rowGap: 0` do style inline (o valor já vem correto do `gridStyle`).

**Status:** ✅ **RESOLVIDO**

**Documentação:** `/___ROWGAP_BUGFIX_2026-02-17.md`

### 🐛 Correção Crítica: Posições Salvas como Objetos (2026-02-18)

**Problema:** Texto ocupava 2 colunas em grid 1×1 ao invés de apenas a coluna esquerda.

**Causa:** Modal salvava `layout.desktop.text = {position: "top-left"}` (objeto) ao invés de `"top-left"` (string).

**Solução:** 
1. Código corrigido (3 lugares: texto, mídia, cards) para salvar string direta
2. Migration SQL v6.15 para converter objetos existentes em strings

**Status:** ✅ **TOTALMENTE RESOLVIDO** (Código + SQL executada - 10/10 seções corrigidas)

**Documentação:** `/___LAYOUT_POSITION_OBJECT_FIX_2026-02-18.md`

### Regras Obrigatórias
✅ **SEMPRE** usar valores múltiplos de 25px (0, 25, 50, 75, 100, etc)  
✅ **SEMPRE** usar 50px como padrão ao criar novas seções  
✅ **SEMPRE** considerar responsividade (valores muito grandes podem quebrar mobile)  
❌ **NUNCA** usar valores fora da lista (não aparecem no dropdown)  
❌ **NUNCA** hardcoded valores em código (usar dropdowns)

---

## ⚠️ CORREÇÃO CRÍTICA: Toggle "Cards" Não Era Respeitado (2026-02-17)

### Problema Resolvido
O toggle "Cards" no painel admin podia ser desligado, mas os cards continuavam aparecendo na página pública.

### Causa Raiz
O `SectionRenderer.tsx` tinha lógica que **forçava `hasCards = true`** se houvesse cards no banco ou `customContent`, ignorando o valor de `elements.hasCards`.

```typescript
// ❌ ANTES (INCORRETO)
const hasCards = (elements.hasCards !== undefined ? elements.hasCards : false) || sectionCards.length > 0;
//                                                                               ^^^^^^^^^^^^^^^^^^^^^^^^
// Problema: Forçava TRUE se houvesse cards no banco, ignorando toggle
```

### Solução Implementada

```typescript
// ✅ CORREÇÃO 2026-02-17: Respeitar APENAS o toggle
const hasCards = elements.hasCards !== undefined ? elements.hasCards : false;
```

### Correção Adicional: Persistência de Configurações

O `SectionBuilder.tsx` estava **zerando** `cardCount` ao desligar o toggle, removendo as configurações salvas.

```typescript
// ❌ ANTES (INCORRETO)
updateElements({ 
  hasCards,
  cardCount: hasCards ? 3 : 0  // Zerava ao desligar
});

// ✅ DEPOIS (CORRETO)
updateElements({ 
  hasCards  // Apenas visibilidade, configurações persistem
});
```

### Correção Crítica: Sincronização de Estado

O `SectionBuilder.tsx` **NÃO sincronizava** o estado local `elements` quando a prop `initialElements` mudava, causando campos de gerenciamento não aparecerem ao ligar o toggle.

```typescript
// ❌ ANTES (SEM SINCRONIZAÇÃO)
const [elements, setElements] = useState<SectionElements>(initialElements || defaultElements);
// Quando prop mudava, estado local não atualizava!

// ✅ DEPOIS (COM SINCRONIZAÇÃO)
const [elements, setElements] = useState<SectionElements>(initialElements || defaultElements);

useEffect(() => {
  if (initialElements) {
    setElements(initialElements);
  }
}, [initialElements]);
```

### Correção Crítica: Atualização Atômica do Toggle (2026-02-17)

O toggle de Cards fazia **DUAS chamadas consecutivas** do `onChange`, causando reversão do estado:

```typescript
// ❌ ANTES (DUAS CHAMADAS - BUGADO)
updateElements({ hasCards: true });  // 1ª chamada ✅
// React ainda não atualizou o estado local...

if (hasCards && !layout.desktop.cards) {
  updateLayout({ desktop: { cards: 'bottom-center' } });  // 2ª chamada ❌
  // ↑ Internamente passa elements ANTIGO (hasCards: false)
}

// ✅ DEPOIS (UMA CHAMADA ATÔMICA - CORRETO)
const newElements = { ...elements, hasCards };
const newLayout = hasCards && !layout.desktop.cards 
  ? { ...layout, desktop: { ...layout.desktop, cards: 'bottom-center' } }
  : layout;

setElements(newElements);
setLayout(newLayout);
onChange(newElements, newLayout, styling);  // ← UMA VEZ, com valores corretos
```

**Por que a 2ª chamada zerava o toggle?**  
A função `updateLayout()` internamente chama `onChange(elements, ...)` com o estado local ANTIGO (porque o React batch updates), então passava `hasCards: false` novamente.

### Benefícios
- ✅ Toggle funciona conforme esperado
- ✅ Cards podem ser escondidos temporariamente sem deletar do banco
- ✅ Configurações persistem (template, quantidade) mesmo com toggle desligado
- ✅ Campos de gerenciamento aparecem/somem baseado no toggle
- ✅ Controle visual total sobre exibição de cards
- ✅ Consistência entre admin e página pública

### Regras Obrigatórias

✅ **SEMPRE** respeitar o valor de `elements.hasCards` do banco  
✅ **SEMPRE** usar toggle como fonte única da verdade  
✅ **SEMPRE** permitir esconder elementos sem deletar dados  
✅ **SEMPRE** persistir configurações (cardTemplateId, cardCount) independente do toggle  
✅ **SEMPRE** condicionar visibilidade de campos com `{hasCards && (`  
✅ **SEMPRE** consolidar múltiplas atualizações em UMA ÚNICA chamada `onChange`  
✅ **SEMPRE** criar novos estados ANTES de chamar `onChange`  
❌ **NUNCA** sobrescrever toggle com lógica baseada em dados externos  
❌ **NUNCA** assumir que "existe no banco" = "deve ser exibido"  
❌ **NUNCA** ignorar intenção explícita do usuário (toggle desligado)  
❌ **NUNCA** zerar configurações ao desligar toggle  
❌ **NUNCA** chamar `updateElements()` seguido de `updateLayout()` (race condition)  
❌ **NUNCA** confiar que o React já atualizou o estado entre chamadas

**Documentação:** 
- `/___FIX_CARDS_TOGGLE_RESPECT_2026-02-17.md` (correção inicial - SectionRenderer)
- `/___CARDS_TOGGLE_COMPLETE_FIX_2026-02-17.md` (persistência - SectionBuilder toggle)
- `/___CARDS_TOGGLE_SYNC_FIX_2026-02-17.md` (sincronização de estado + salvamento)
- `/___CARDS_TOGGLE_ATOMIC_UPDATE_FIX_2026-02-17.md` (atualização atômica - correção final) ✅

---

## ✅ CORREÇÃO: Redeclaração de `elements` Causava Sobrescrita (2026-02-17)

### Problema Resolvido
A variável `elements` era extraída no topo do componente mas **redeclarada** na linha 623, sobrescrevendo os dados do banco com `sectionConfig.elements` (vazio).

**Sintomas:**
```
⚠️ [hasCards] Nenhum valor válido encontrado, usando false
   elements.hasCards: undefined
```

**Erro de estrutura circular:**
```
TypeError: Converting circular structure to JSON
   at console.log('   desktopLayout.text (raw):', desktopLayout.text)
```

### Causa Raiz

**Linha 59 (CORRETA):**
```typescript
const elements = props.section?.elements || props.elements || {};
// Lê do banco: { hasCards: true, hasMedia: false, ... }
```

**Linha 623 (SOBRESCREVIA - INCORRETO):**
```typescript
const elements = sectionConfig.elements || {};
// Sobrescreve com objeto vazio! hasCards vira undefined
```

### Solução Implementada

**Código Corrigido:**
```typescript
// ✅ Linha 59: Extrair LOGO NO INÍCIO
const elements = props.section?.elements || props.elements || {};
console.log('🔍 [elements] Valores do banco:', {
  hasCards: elements.hasCards,
  cardTemplateId: sectionConfig.cardTemplateId
});

// ❌ Linha 623: REMOVER redeclaração
// const elements = sectionConfig.elements || {}; // REMOVIDO
```

**Log com estrutura circular REMOVIDO:**
```typescript
// ❌ ANTES (causava erro)
console.log('   desktopLayout.text (raw):', desktopLayout.text);

// ✅ DEPOIS (removido)
```

### Benefícios

✅ `elements.hasCards` sempre lê do banco corretamente  
✅ Fallback para `cardTemplateId` funciona quando `hasCards` está undefined  
✅ Sem erros de estrutura circular no console  
✅ Cards renderizam automaticamente quando toggle ativado

### Regras Obrigatórias

✅ **SEMPRE** extrair `elements` LOGO NO INÍCIO do componente  
✅ **SEMPRE** logar valores simples (boolean, string) ao invés de objetos complexos  
✅ **SEMPRE** verificar se objetos React podem causar estrutura circular antes de logar  
❌ **NUNCA** redeclarar variáveis já extraídas no topo  
❌ **NUNCA** logar objetos com `_context` ou propriedades React  
❌ **NUNCA** usar `console.log(desktopLayout.text)` (pode conter React Context)

**Arquivo Modificado:**
- `/src/app/public/components/SectionRenderer.tsx` (linhas 59, 623, 1190)

**Status Atual (2026-02-17):**
- ✅ Extração de `elements` corrigida
- ✅ Logs seguros sem estrutura circular
- ✅ hasCards lê do banco corretamente
- ✅ Fallback para cardTemplateId funcional

---

## ✅ CORREÇÃO: Filtros de Cards Usavam Campos Incorretos (2026-02-17)

### Problema Resolvido
Os botões de filtro (abas) dos cards estavam buscando cores em campos que não existiam (`sectionConfig.tabActiveBgColor`), ignorando as configurações do template.

### Causa Raiz
O código buscava cores em:
- ❌ `sectionConfig.tabActiveBgColor` (não existe)
- ❌ `sectionConfig.tabActiveTextColor` (não existe)

Mas os campos corretos estão no **template**:
- ✅ `filter_button_bg_color_token` (cor de fundo botão inativo)
- ✅ `filter_button_text_color_token` (cor de texto botão inativo)
- ✅ `filter_active_bg_color_token` (cor de fundo botão ativo)
- ✅ `filter_active_text_color_token` (cor de texto botão ativo)
- ✅ `filters_position` ('top' ou 'bottom')

### Solução Implementada

**Extração das configurações do template:**
```typescript
// ✅ Extrair template do primeiro card (todos compartilham o mesmo template)
const cardTemplate = sectionCards[0]?._template;
const filtersPosition = cardTemplate?.filters_position || 'top';
const filterButtonBgColor = cardTemplate?.filter_button_bg_color_token;
const filterButtonTextColor = cardTemplate?.filter_button_text_color_token;
const filterActiveBgColor = cardTemplate?.filter_active_bg_color_token;
const filterActiveTextColor = cardTemplate?.filter_active_text_color_token;
```

**Renderização condicional por posição:**
```typescript
// ✅ Filtros só aparecem se position === 'top'
{(hasFilterIds && filters.length > 1 && filtersPosition === 'top') && (
  <div className="flex flex-wrap justify-center gap-3 mb-12">
    {/* Botões de filtro */}
  </div>
)}
```

**Cores dos botões:**
```typescript
// Botão ATIVO
style={{
  backgroundColor: getTokenValue(filterActiveBgColor, primaryColor),
  color: getTokenValue(filterActiveTextColor, '#ffffff'),
}}

// Botão INATIVO
style={{
  backgroundColor: getTokenValue(filterButtonBgColor, '#ffffff'),
  color: getTokenValue(filterButtonTextColor, '#6b7280'),
  borderColor: getTokenValue(filterActiveBgColor, primaryColor),
}}
```

### Benefícios

✅ Filtros respeitam configuração do template  
✅ Cores vêm do Design System via tokens  
✅ Posição configurável (top/bottom)  
✅ Botões ativos e inativos com estilos diferentes  
✅ Fallbacks garantem funcionamento mesmo sem tokens

### Regras Obrigatórias

✅ **SEMPRE** extrair configurações do `_template` anexado aos cards  
✅ **SEMPRE** usar campos `filter_*` do template, não `tab_*` do config  
✅ **SEMPRE** respeitar `filters_position` do template  
✅ **SEMPRE** aplicar estilos diferentes para botões ativos e inativos  
❌ **NUNCA** buscar cores de filtros em `sectionConfig`  
❌ **NUNCA** assumir que filtros sempre aparecem (verificar posição)

**Arquivo Modificado:**
- `/src/app/public/components/SectionRenderer.tsx` (linhas 1768-1873)

**Status Atual (2026-02-17):**
- ✅ Filtros renderizam na posição correta (top)
- ✅ Cores vêm do template
- ✅ Botões ativos destacados corretamente
- ✅ Suporte a position bottom (implementado, não usado ainda)
- ✅ Layout vertical correto (filtros acima, cards abaixo)

### Correção Adicional: Layout Vertical dos Cards

**Problema:** Filtros apareciam ao lado dos cards (layout horizontal) ao invés de acima.

**Causa:** Container dos cards usava `flex items-center` (horizontal) ao invés de `flex flex-col` (vertical).

**Solução:**
```typescript
// ❌ ANTES (layout horizontal)
<div className={`flex items-center ${cardsJustifyClass} ...`}>

// ✅ DEPOIS (layout vertical)
<div className={`flex flex-col ${cardsJustifyClass} ...`}>
```

**Resultado:**
```
┌─────────────────────────────────────┐
│  Linha 1: Texto | Mídia             │
├─────────────────────────────────────┤
│  Linha 2: Cards (2 colunas)         │
│  ┌────────────────────────────���┐    │
│  │ Filtros (acima)             │    │
│  │ [Todos] [Marketing] etc     │    │
│  ├─────────────────────────────┤    │
│  │ Cards Grid (abaixo)         │    │
│  │ ■ ■ ■                       │    │
│  │ ■ ■ ■                       │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Arquivo Modificado:**
- `/src/app/public/components/SectionRenderer.tsx` (linha 1479)

### ⚠️ CORREÇÃO: Alinhamento Vertical dos Cards Não Era Respeitado (2026-02-17)

**Problema:** Cards configurados com alinhamento vertical "middle" no modal apareciam sempre no final (`justify-end`) do container.

**Causa Raiz:**
O código não estava extraindo `config.cards.alignY` do banco de dados. A variável `cardsJustifyClass` usava apenas `cardsAlign` (alinhamento **horizontal**), ignorando completamente o alinhamento **vertical**.

**Banco de dados correto:**
```json
"config": {
  "cards": {
    "alignY": "middle"  ✅ Configurado corretamente
  }
}
```

**Código ANTES (incorreto):**
```typescript
// ❌ Só extraía alinhamento horizontal
const cardsJustifyClass = {
  'left': 'justify-start',
  'center': 'justify-center',
  'right': 'justify-end',
}[cardsAlign] || 'justify-center';

// ❌ Container usava cardsJustifyClass (horizontal)
<div className={`flex flex-col ${cardsJustifyClass} ...`}>
```

**Solução Implementada:**

**1. Extrair alinhamento vertical:**
```typescript
// ✅ NOVO 2026-02-17: Alinhamento VERTICAL dos cards
const cardsAlignY = sectionConfig.cards?.alignY || 'middle';
const cardsVerticalAlignClass = {
  'top': 'justify-start',
  'middle': 'justify-center',  // ✅ "middle" mapeia para "justify-center"
  'bottom': 'justify-end',
}[cardsAlignY] || 'justify-center';
```

**2. Aplicar no container:**
```typescript
// ✅ Usar cardsVerticalAlignClass (vertical)
<div className={`flex flex-col ${cardsVerticalAlignClass} ...`}>
```

**Mapeamento:**
| Valor no Banco | Classe CSS | Resultado Visual |
|----------------|-----------|------------------|
| `"top"` | `justify-start` | Cards no topo |
| `"middle"` | `justify-center` | Cards centralizados ✅ |
| `"bottom"` | `justify-end` | Cards no final |

**Benefícios:**
- ✅ Modal admin funciona corretamente (configuração persiste)
- ✅ Cards respeitam alinhamento vertical configurado
- ✅ Alinhamento horizontal (`cardsAlign`) continua funcionando
- ✅ Fallback para "middle" se não configurado

**Regras Obrigatórias:**
- ✅ **SEMPRE** extrair `config.cards.alignY` para alinhamento vertical
- ✅ **SEMPRE** usar `cardsVerticalAlignClass` no container flex-col
- ✅ **SEMPRE** manter `cardsJustifyClass` para uso em flex-row (horizontal)
- ❌ **NUNCA** usar `cardsJustifyClass` em containers flex-col
- ❌ **NUNCA** ignorar configurações de alinhamento do banco

**Arquivos Modificados:**
- `/src/app/public/components/SectionRenderer.tsx` (linhas 994-1001, 1507)

**Status Atual (2026-02-17):**
- ✅ Alinhamento vertical dos cards implementado
- ✅ Cards centralizam quando `alignY = "middle"`
- ✅ Compatível com todos os valores (top/middle/bottom)

### ⚠️ CORREÇÃO: Mídia Não Respeitava Altura do Texto em Seções Auto (2026-02-17)

**Problema:** Em seções com `height: 'auto'` + grid 2×2, a mídia ocupava 50% da altura total da seção ao invés de se ajustar à altura natural do texto na mesma linha.

**Sintomas:**
- Mídia excessivamente grande (celular gigante)
- Texto ocupando apenas ~25% da altura
- Mídia não proporcional ao conteúdo
- Linhas do grid com 50% de altura fixa (mesmo em modo auto)

**Causa Raiz:**
1. Grid 2×2 sempre usava `grid-template-rows: 1fr 1fr` (50% + 50%), **mesmo em modo auto**
2. Mídia usava `alignSelf: stretch`, forçando a linha a crescer até acomodar a mídia inteira

**Código ANTES (incorreto):**
```typescript
// Problema 1: Grid template rows fixo
gridTemplateRows: effectiveGridRows === 2 ? '1fr 1fr' : ...
// ❌ Sempre força 50% + 50%, mesmo em altura auto

// Problema 2: Mídia sempre estique
alignSelf: 'stretch'
// ❌ Força linha a crescer até acomodar mídia
```

**Solução Implementada:**

```typescript
// ✅ CORREÇÃO 1: Grid template rows condicional (linha 1256)
gridTemplateRows: effectiveGridRows === 2 
  ? (heightMode === 'auto' ? 'auto auto' : '1fr 1fr')  // ← Auto: linhas ajustam ao conteúdo
  : (heightMode === 'auto' ? 'min-content' : '1fr'),

// ✅ CORREÇÃO 2: Mídia não estique em grid 2×2 auto (linha 1421)
alignSelf: (effectiveGridRows === 2 && heightMode === 'auto') ? 'start' : 'stretch',
// ← Linha 1 ajusta ao texto (menor elemento)
```

**Comportamento Esperado:**

**Seções com altura FIXA (50vh, 100vh):**
- ✅ `grid-template-rows: 1fr 1fr` - Linhas ocupam 50% cada
- ✅ `alignSelf: stretch` - Mídia preenche 100% da linha

**Seções com altura AUTO + Grid 2×2:**
- ✅ `grid-template-rows: auto auto` - Linhas ajustam ao conteúdo
- ✅ `alignSelf: start` - Mídia não força crescimento da linha
- ✅ **Linha 1: Altura do elemento de texto** (menor elemento, não 50% fixo)
- ✅ Linha 2: Altura dos cards
- ✅ Mídia proporcional ao texto adjacente

**Resultado Visual (altura auto + grid 2×2):**
```
ANTES:                          DEPOIS:
┌─────────────────────────┐    ┌─────────────────────────┐
│ Texto   │ ┌──────────┐  │    │ Texto   │ ┌──────────┐ │
│ pequeno │ │          │  │    │ ────    │ │  Celular │ │
│         │ │ Celular  │  │    │ Título  │ │  propor. │ │
│         │ │ GIGANTE  │  │    │ Subtít. │ └──────────┘ │
│         │ │ (50%)    │  │    │         │              │
│         │ └──────────┘  │    ├─────────────────────────┤
├─────────────────────────┤    │ Cards                   │
│ Cards (50%)             │    └─────────────────────────┘
└─────────────────────────┘
```

**Benefícios:**
- ✅ Mídia proporcional ao texto adjacente
- ✅ Sem espaço vazio desnecessário nas linhas
- ✅ Layout mais harmonioso
- ✅ Comportamento diferenciado por tipo de altura (auto vs fixa)
- ✅ **Correção cirúrgica** - Não afeta outras seções

**Regras Obrigatórias:**
- ✅ **SEMPRE** usar `auto auto` em grid 2×2 quando `heightMode === 'auto'`
- ✅ **SEMPRE** usar `alignSelf: start` na mídia em grid 2×2 auto (linha ajusta ao texto)
- ✅ **SEMPRE** manter `1fr 1fr` + `alignSelf: stretch` quando altura fixa (50vh, 100vh)
- ✅ **SEMPRE** testar seções com grid 2×2 após mudanças
- ❌ **NUNCA** forçar `1fr 1fr` em modo auto (linhas ficam 50% fixo)
- ❌ **NUNCA** usar `alignSelf: stretch` na mídia em grid 2×2 auto (linha cresce até acomodar mídia)

**Arquivos Modificados:**
- `/src/app/public/components/SectionRenderer.tsx` (linhas 1256, 1421)

**Status Atual (2026-02-17):**
- ✅ Grid 2×2 com altura auto ajusta linhas ao conteúdo
- ✅ Mídia proporcional ao texto na mesma linha
- ✅ Outras seções não afetadas (correção cirúrgica)
- ✅ Modo "ajustada" funciona corretamente

---

## ⚠️ CORREÇÃO CRÍTICA: Altura Auto e Padding em Seções (2026-02-17)

### Problema Resolvido
Seções com `height: 'auto'` apresentavam **3 problemas críticos**:

1. **Altura excessiva:** Grid esticava linhas mesmo sem altura fixa de referência
2. **Mídia não colava na borda:** Padding interno impedia mídia de alcançar margem direita
3. **Proporção incorreta:** Linhas esticavam 50/50 ao invés de ajustar ao conteúdo

### Causa Raiz

**Problema 1: Altura forçada 100%**
```typescript
// ❌ ANTES (INCORRETO)
style={{
  height: '100%',         // Forçava altura mesmo em modo auto
  minHeight: '100%',
  maxHeight: '100%',
  alignContent: 'stretch' // Esticava linhas verticalmente
}}
```

**Problema 2: Padding incondicional na mídia**
```typescript
// ❌ ANTES (INCORRETO)
paddingRight: `${paddingRightConfig}px`,  // Sempre aplicava padding
```

**Problema 3: Altura fixa na coluna de mídia**
```typescript
// ❌ ANTES (INCORRETO)
height: '100%',  // Forçava altura mesmo em modo auto
```

### Solução Implementada

**Correção 1: Altura condicional no grid container**
```typescript
// ✅ CORREÇÃO 2026-02-17: Altura auto quando seção é auto
style={{
  height: heightMode !== 'auto' ? '100%' : 'auto',
  minHeight: heightMode !== 'auto' ? '100%' : 'auto',
  maxHeight: heightMode !== 'auto' ? '100%' : 'none',
  alignContent: heightMode !== 'auto' ? 'stretch' : 'flex-start',  // Não estica em modo auto
}}
```

**Correção 2: Padding condicional na mídia**
```typescript
// ✅ CORREÇÃO 2026-02-17: SEM padding quando mídia deve colar nas bordas
paddingRight: mediaDisplayMode === 'alinhada' ? 0 : `${paddingRightConfig}px`,
```

**Correção 3: Altura condicional na coluna de mídia**
```typescript
// ✅ CORREÇÃO 2026-02-17: Auto quando seção é auto
height: heightMode !== 'auto' ? '100%' : 'auto',
```

### Comportamento Esperado

**Modo `height: 'auto'`:**
- ✅ Grid tem `height: auto` (cresce com conteúdo)
- ✅ Linhas têm `alignContent: flex-start` (não esticam)
- ✅ Linha 1 (texto): altura do conteúdo do texto
- ✅ Linha 2 (mídia): altura da proporção natural da imagem
- ✅ Mídia sem padding quando `mediaDisplayMode === 'alinhada'`

**Modo `height: '50vh'` ou `'100vh'` (fixa):**
- ✅ Grid tem `height: 100%` (preenche altura da section)
- ✅ Linhas têm `alignContent: stretch` (esticam proporcionalmente)
- ✅ Ambas as linhas ocupam 50% da altura (em grid 2×2)

### Benefícios

✅ **Seções auto** ajustam altura naturalmente ao conteúdo  
✅ **Mídia no modo alinhada** cola perfeitamente nas bordas configuradas  
✅ **Linhas do grid** não esticam desnecessariamente em modo auto  
✅ **Performance** melhorada (navegador não força cálculo de 100%)

### Regras Obrigatórias

✅ **SEMPRE** usar `height: auto` no grid quando seção tem `height: 'auto'`  
✅ **SEMPRE** remover padding da mídia quando `mediaDisplayMode === 'alinhada'`  
✅ **SEMPRE** usar `alignContent: flex-start` em modo auto (não stretch)  
✅ **SEMPRE** usar `height: auto` na coluna de mídia em modo auto  
❌ **NUNCA** forçar `height: 100%` quando seção é `auto`  
❌ **NUNCA** aplicar `alignContent: stretch` em modo auto  
❌ **NUNCA** aplicar padding na mídia quando ela deve colar nas bordas

**Arquivo Modificado:**
- `/src/app/public/components/SectionRenderer.tsx` (linhas 1268-1280, 1395-1402)

**Status Atual (2026-02-17):**
- ✅ Código: Correções aplicadas
- ⚠️ Banco de dados: **Requer migration** para aplicar `fitMode: 'alinhada'`
- 🔍 Diagnóstico: Seção não tinha `config.media.fitMode` configurado

### ⚠️ AÇÃO NECESSÁRIA: Configurar fitMode no Banco

**Problema Identificado:**
O código está correto, mas o **banco de dados não tem** `config.media.fitMode = "alinhada"` configurado na seção "Prazer, somos a BemDito!".

**Console mostra:**
```
fromConfigMedia: undefined  ❌ (deveria ser "alinhada")
fromElements: undefined
final: "ajustada"  ❌ (fallback padrão)
```

**Solução:**

1. **Execute a migration:**
   ```bash
   # Arquivo: /migrations/2026-02-17_fix_media_alinhada_prazer_bemdito.sql
   ```

2. **Ou execute manualmente:**
   ```sql
   UPDATE sections
   SET config = jsonb_set(
     jsonb_set(
       jsonb_set(
         config,
         '{media,fitMode}',
         '"alinhada"',
         true
       ),
       '{media,alignX}',
       '"right"',
       true
     ),
     '{media,alignY}',
     '"bottom"',
     true
   )
   WHERE name ILIKE '%prazer%' OR name ILIKE '%bemdito%';
   ```

3. **Recarregue a página** (CTRL+SHIFT+R)

**Arquivos Envolvidos:**
- Migration: `/migrations/2026-02-17_fix_media_alinhada_prazer_bemdito.sql`
- SQL: `/EXECUTE_SQL.sql`
- Código: `/src/app/public/components/SectionRenderer.tsx` (linhas 1268-1280, 1393)

---

## ⚠️ DIAGNÓSTICO: Cards Não Renderizam Após Salvar (2026-02-17)

### Problema Reportado
Usuário ativa toggle "Cards", seleciona template no modal, clica em "Salvar", mas os cards **não aparecem** na página pública.

### Fluxo Completo Validado

| Etapa | Status | Arquivo | Linha |
|-------|--------|---------|-------|
| 1. Toggle ativa `hasCards` | ✅ OK | `SectionBuilder.tsx` | 869 |
| 2. Campos aparecem no modal | ✅ OK | `UnifiedSectionConfigModal.tsx` | 794-819 |
| 3. Template selecionado → `updateConfigField` | ✅ OK | `UnifiedSectionConfigModal.tsx` | 806 |
| 4. `performSave` envia ao banco | ✅ OK | `UnifiedSectionConfigModal.tsx` | 416-496 |
| 5. `handleUpdateConfig` salva no Supabase | ✅ OK | `editor.tsx` | 307-377 |
| 6. `loadPageSections` recarrega | ✅ OK | `editor.tsx` | 370 |
| 7. `loadSectionCards` busca cards | ❓ VERIFICAR | `SectionRenderer.tsx` | 213-291 |
| 8. `customContent` criado | ❓ VERIFICAR | `SectionRenderer.tsx` | ~1050 |
| 9. Cards renderizados no HTML | ❓ VERIFICAR | `SectionRenderer.tsx` | 1361 |

### Logs de Diagnóstico Adicionados

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linha 219-239)

```typescript
console.log('🔍 [loadSectionCards] DIAGNÓSTICO INICIAL...');
console.log('   sectionId:', sectionId);
console.log('   sectionConfig:', sectionConfig);
console.log('   sectionConfig.cardTemplateId:', cardTemplateId);
console.log('   elements:', elements);
console.log('   elements?.hasCards:', elements?.hasCards);
console.log('   layout?.desktop?.cards:', layout?.desktop?.cards);
```

### Cenários Possíveis

#### Cenário A: Dados NÃO foram salvos no banco
- **Sintoma:** `cardTemplateId` é NULL no console
- **Causa:** Payload não incluiu `config.cardTemplateId` no UPDATE
- **Solução:** Verificar logs em `handleUpdateConfig` (editor.tsx linha 353)

#### Cenário B: Template não encontrado
- **Sintoma:** `❌ Erro ao carregar template`
- **Causa:** UUID incorreto ou template deletado
- **Solução:** Executar query SQL verificando `card_templates`

#### Cenário C: Cards não associados ao template
- **Sintoma:** `⚠️ data é null ou undefined`
- **Causa:** Template existe mas tabela `template_cards` está vazia
- **Solução:** Verificar se template tem cards via `/admin/cards-manager`

#### Cenário D: `hasCardsInSeparateColumn` falso
- **Sintoma:** Cards carregados mas `customContent` não criado
- **Causa:** Lógica de detecção de coluna separada falhou
- **Solução:** Verificar cálculo em `SectionRenderer.tsx` (~linha 800)

### Script de Diagnóstico SQL

**Arquivo:** `/EXECUTE_SQL.sql`

Execute para verificar:
- ✅ `config->>'cardTemplateId'` retorna UUID válido
- ✅ `elements->>'hasCards'` retorna `'true'`
- ✅ `layout->'desktop'->>'cards'` retorna posição (ex: `'bottom-center'`)
- ✅ Template existe e tem cards associados

### Documentação Completa

**Arquivo:** `/___CARDS_MARKETING_DIAGNOSTIC_2026-02-17.md`

Inclui:
- Checklist de validação completo
- Passos de diagnóstico via console
- Cenários detalhados com soluções
- Logs esperados em cada etapa

### Próximos Passos (Usuário)

1. **Abrir console do navegador** na página pública
2. **Procurar por logs** `🔍 [loadSectionCards]`
3. **Identificar o cenário** (A, B, C ou D) baseado nos logs
4. **Executar script SQL** para validar dados no banco
5. **Reportar resultados** para correção específica

---

## ⚠️ CORREÇÃO: Objetos Vazios no Layout.desktop (2026-02-17)

### Problema Resolvido
Warning no console ao abrir SectionBuilder:
```
⚠️ [SectionBuilder] Posição legada inválida (campos ausentes): {}
```

### Causa Raiz
Algumas seções no banco têm objetos vazios `{}` em `layout.desktop.text`, `layout.desktop.media`, etc. A função `migrateLayoutToGrid` tentava converter esses objetos vazios mas falhava porque não tinham os campos `row` e `horizontal`.

### Solução Implementada

**Código (SectionBuilder.tsx - linhas 488-507):**
```typescript
// ANTES (quebrava com objeto vazio)
for (const [key, value] of Object.entries(layout.desktop || {})) {
  if (typeof value === 'object' && value !== null) {
    const legacyPos = value as { row: string; horizontal: string };
    const gridPos = convertLegacyToGrid(legacyPos); // ❌ Falhava com {}
  }
}

// DEPOIS (valida objeto vazio + aceita formato {position: "..."})
for (const [key, value] of Object.entries(layout.desktop || {})) {
  if (typeof value === 'object' && value !== null) {
    const legacyPos = value as { row?: string; horizontal?: string; position?: string };
    
    // ✅ Se objeto vazio, pular
    if (Object.keys(legacyPos).length === 0) {
      console.warn(`⚠️ [SectionBuilder] Objeto vazio em layout.desktop.${key}, pulando migração`);
      continue;
    }
    
    // ✅ Se tem campo "position", usar diretamente
    if (legacyPos.position) {
      console.log(`✅ [SectionBuilder] Objeto com campo "position" detectado em ${key}:`, legacyPos.position);
      (migratedLayout.desktop as any)[key] = legacyPos.position;
      continue;
    }
    
    const gridPos = convertLegacyToGrid(legacyPos);
  }
}
```

### Correção SQL (Converter Objetos para Strings)

**Migration:** `/migrations/2026-02-17_fix_layout_position_objects.sql`

Converte:
- `{"position": "middle-left"}` → `"middle-left"`
- `{"position": "middle-right"}` → `"middle-right"`

**Execute:**
```sql
-- Converter layout.desktop.text
UPDATE sections
SET layout = jsonb_set(
  layout,
  '{desktop,text}',
  to_jsonb((layout->'desktop'->'text'->>'position'))
)
WHERE 
  jsonb_typeof(layout->'desktop'->'text') = 'object'
  AND layout->'desktop'->'text'->>'position' IS NOT NULL;

-- Converter layout.desktop.cards
UPDATE sections
SET layout = jsonb_set(
  layout,
  '{desktop,cards}',
  to_jsonb((layout->'desktop'->'cards'->>'position'))
)
WHERE 
  jsonb_typeof(layout->'desktop'->'cards') = 'object'
  AND layout->'desktop'->'cards'->>'position' IS NOT NULL;
```

### Benefícios

✅ **Validação de objetos vazios** - Não quebra mais ao encontrar `{}`  
✅ **Suporte a formato {position}** - Aceita objetos com campo `position`  
✅ **Warnings informativos** - Console mostra exatamente qual campo tem problema  
✅ **Migration SQL** - Corrige dados existentes no banco

### Regras Obrigatórias

✅ **SEMPRE** validar se objeto não está vazio antes de processar  
✅ **SEMPRE** aceitar tanto `{row, horizontal}` quanto `{position}`  
✅ **SEMPRE** usar strings diretas para posições (não objetos)  
❌ **NUNCA** assumir que objeto tem campos específicos sem validar  
❌ **NUNCA** usar objetos em `layout.desktop.*` (apenas strings)

**Arquivos Modificados:**
- `/src/app/admin/sections-manager/SectionBuilder.tsx` (linhas 488-507)
- `/migrations/2026-02-17_fix_layout_position_objects.sql` (novo)
- `/EXECUTE_SQL.sql` (queries de correção)

**Status Atual (2026-02-17):**
- ✅ Código aceita ambos os formatos (retrocompatível)
- ✅ Migration SQL criada para corrigir banco
- 🔍 Execute `/EXECUTE_SQL.sql` para aplicar correções

---

## ⚠️ CORREÇÃO CRÍTICA: Grid 2×2 com Cards em Posição Errada (2026-02-17)

### Problema 1: Cards em Colunas Verticais Separadas
Seções com **grid 2×2** configuradas com texto e cards em **colunas verticais separadas** renderizavam incorretamente com elementos ocupando **linhas horizontais completas**.

**Configuração esperada:**
- Grid 2×2 (2 colunas, 2 linhas)
- Texto: `middle-left` (coluna esquerda, ocupando 2 linhas)
- Cards: `middle-right` (coluna direita, ocupando 2 linhas)

**Comportamento incorreto:**
- Texto: Linha superior completa (2 colunas)
- Cards: Linha inferior completa (2 colunas)

**Causa:** Lógica só verificava alinhamento horizontal (`left` vs `right`), ignorando posições completas (`middle-left` vs `middle-right`).

**Documentação:** `/___FIX_GRID_2X2_CARDS_POSITION_2026-02-17.md`

---

### Problema 2: Cards COM Mídia + Texto (Grid 2×2)
Seções com **grid 2×2** + **mídia + texto na row 1** + **cards na row 2** não renderizavam os cards.

**Configuração esperada:**
- Grid 2×2 (2 colunas, 2 linhas)
- Row 1: Mídia (top-left) + Texto (top-right)
- Row 2: Cards (bottom-center) - ocupando 2 colunas

**Comportamento incorreto:**
- Cards **não apareciam** na página ❌

**Causa:** Lógica exigia `!hasMedia` (sem mídia), impedindo cards quando mídia e cards coexistem.

**Solução Implementada:**

```typescript
// ✅ CORREÇÃO 2026-02-17: 3 cenários suportados
const hasCardsInSeparateColumn = hasCards && content.customContent && (() => {
  // CENÁRIO 1: Cards SEM mídia (substituem mídia)
  if (!hasMedia) {
    // Lógica original mantida
  }
  
  // CENÁRIO 2: Cards COM mídia em grid 2×2 ✨ NOVO
  if (hasMedia && effectiveGridCols === 2 && effectiveGridRows === 2) {
    // Detectar cards em linha inferior (bottom-*)
    if (cardsPos === 'bottom-center') return true;
    
    // Detectar texto+mídia em row 1, cards em row 2
    const textInRow1 = textPos?.includes('top');
    const mediaInRow1 = mediaPos?.includes('top');
    const cardsInRow2 = cardsPos?.includes('bottom');
    if (textInRow1 && mediaInRow1 && cardsInRow2) return true;
    
    return false;
  }
  
  return false;
})();
```

**Documentação:** `/___FIX_GRID_2X2_THREE_ELEMENTS_2026-02-17.md`

---

### Regras Obrigatórias

✅ **SEMPRE** usar `getGridPosition()` para extrair posições do layout  
✅ **SEMPRE** comparar posições completas em grid 2×2 (não apenas alinhamento)  
✅ **SEMPRE** suportar mídia + texto + cards em grid 2×2  
✅ **SEMPRE** testar seções com 3 elementos após mudanças  
❌ **NUNCA** assumir que alinhamento horizontal é suficiente para grid 2×2  
❌ **NUNCA** ignorar posições verticais (`middle-*`, `bottom-*`)  
❌ **NUNCA** usar `!hasMedia` para detectar cards separados (bloqueia cenário 2)

---

## ⚠️ CORREÇÃO CRÍTICA: Seção 667ab5d5 - Estrutura de Dados (2026-02-17)

### Problema Resolvido
Seção "Prazer, somos a BemDito!" tinha **5 problemas estruturais críticos** que impediam validação e renderização correta.

### Problemas Identificados

| # | Gravidade | Campo | Problema | Impacto |
|---|-----------|-------|----------|---------|
| 1 | 🔴 CRÍTICO | `layout.desktop.text` | Objeto ao invés de string | Quebrava validação |
| 2 | 🔴 CRÍTICO | `layout.desktop.media` | Objeto ao invés de string | Quebrava validação |
| 3 | 🟠 ALTO | `config.config` | Aninhamento duplicado | Dados incorretos |
| 4 | 🟡 MÉDIO | `styling.height` | 50vh ao invés de 100vh | Layout não ideal |
| 5 | 🟡 MÉDIO | `styling.spacing.left` | 128px hardcoded | Não segue DS |

### Lições Aprendidas

**1. Layout deve SEMPRE usar strings diretas:**
```typescript
// ❌ ERRADO
layout.desktop.text = {"position": "middle-left"}

// ✅ CORRETO
layout.desktop.text = "middle-left"
```

**2. Evitar aninhamento duplicado em JSONB:**
```sql
-- ❌ ERRADO: config.config
UPDATE sections SET config = config || jsonb_build_object('config', {...})

-- ✅ CORRETO: campos no nível raiz
UPDATE sections SET config = config || jsonb_build_object('field', value)
```

**3. SEMPRE usar tokens do design system:**
```json
// ❌ ERRADO: "spacing": {"left": "128px"}
// ✅ CORRETO: "spacing": {"left": "xl"}  // 48px
```

### Regras Obrigatórias

✅ **SEMPRE** validar tipo de `layout.desktop.*` (string, não objeto)  
✅ **SEMPRE** usar tokens ao invés de valores fixos  
✅ **SEMPRE** verificar aninhamento duplicado em JSONB  
❌ **NUNCA** usar `jsonb_build_object` em campo que já é objeto

**Documentação:** `/___SECTION_667AB5D5_CORRECTION_COMPLETE_2026-02-17.md`

---

## ⚠️ CORREÇÃO CRÍTICA: Função parseSpacing Híbrida (2026-02-17)

### Problema Resolvido
Paddings superior e inferior **sempre retornavam 24px** ao invés de **0px**, mesmo quando configurado corretamente no modal.

### Causa Raiz
Código usava `spacingMap` que **SOMENTE aceitava tokens** (none, xs, sm, md, lg, xl, 2xl), mas o banco armazenava **valores em px** ("0px", "32px", etc.).

### Solução Implementada

**Função Híbrida `parseSpacing`:**
```typescript
const parseSpacing = (value: string | number | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  if (typeof value === 'number') return value;
  
  // 1. Tentar spacingMap primeiro (tokens: none, xs, sm, md, lg, xl, 2xl)
  if (spacingMap[value] !== undefined) {
    return spacingMap[value];
  }
  
  // 2. Fallback: extrair número de string px ("0px" → 0, "32px" → 32)
  return parseInt(value.replace('px', '')) || defaultValue;
};
```

**Aceita 3 Formatos:**
- ✅ Tokens: `"none"`, `"xs"`, `"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`
- ✅ Valores em px: `"0px"`, `"32px"`, `"48px"`, `"100px"`
- ✅ Valores numéricos: `0`, `24`, `48`

### Impacto

**Seção 667ab5d5 (Exemplo):**
```
ANTES:
  spacing.top = "0px" → parseSpacing("0px") = 24 ❌ (fallback)

DEPOIS:
  spacing.top = "0px" → parseSpacing("0px") = 0  ✅ (correto)
```

**Resultado Visual:**
- ✅ Mídia cola perfeitamente na borda direita
- ✅ Mídia cola perfeitamente na borda inferior
- ✅ SEM espaçamento superior ou inferior indesejado

### Regras Obrigatórias

✅ **SEMPRE** usar `parseSpacing` para todos os spacings  
✅ **SEMPRE** aceitar tokens E valores em px  
✅ **SEMPRE** manter retrocompatibilidade  
❌ **NUNCA** usar parsing diferente para top/bottom vs. left/right

**Documentação Completa:**
- 📖 Detalhes técnicos: `/___PADDING_FIX_COMPLETE_2026-02-17.md`
- 📋 Consolidado de todos ajustes: `/___CONSOLIDADO_AJUSTES_2026-02-17.md`

---

## ✅ REGRA: Paddings de Seções vs Elementos (2026-02-17)

### Hierarquia de Paddings

O sistema usa **3 níveis de padding** independentes:

#### 1️⃣ Padding da Section (Configurável via Modal)
```typescript
// Aplicado na <section> pai
<section style={{
  paddingTop: '0px',      // ← Modal: "Padding Superior"
  paddingBottom: '0px',   // ← Modal: "Padding Inferior"
  paddingLeft: '128px',   // ← Modal: "Padding Esquerda"
  paddingRight: '16px',   // ← Modal: "Padding Direita"
}}>
```

**Quando usar:**
- Espaçamento externo da seção inteira
- Margens de segurança nas bordas

#### 2️⃣ Padding do Elemento de Texto (Fixo: 10px)
```typescript
// Wrapper interno do texto
<div style={{ padding: '10px', boxSizing: 'border-box' }}>
  {/* Ícone, títulos, subtítulo, botão */}
</div>
```

**Características:**
- ✅ Sempre 10px em todos os lados
- ✅ `box-sizing: border-box` (não afeta dimensões externas)
- ✅ Aplicado em layout grid E layout vertical
- ✅ Garante respiro interno do texto

#### 3️⃣ Padding do Elemento de Mídia (Fixo: 0px)
```typescript
// Container da mídia
<div style={{ padding: 0 }}>
  <img />
</div>
```

**Características:**
- ✅ Sempre 0px
- ✅ Permite mídia colar nas bordas
- ✅ Essencial para modo "alinhada"

### Regras Obrigatórias

✅ **SEMPRE** aplicar padding da section via modal (configurável)  
✅ **SEMPRE** aplicar 10px de padding no wrapper de texto  
✅ **SEMPRE** manter 0px de padding na mídia  
✅ **SEMPRE** usar `box-sizing: border-box` em elementos com padding  
❌ **NUNCA** aplicar padding na mídia (quebra alinhamento)  
❌ **NUNCA** remover padding interno do texto (perde respiro)

### Exemplo Completo (Seção 667ab5d5)

```html
<!-- 1️⃣ Padding da Section: 0px top/bottom, 128px left, 16px right -->
<section style="padding: 0px 16px 0px 128px; height: 50vh;">
  
  <!-- Grid Container -->
  <div style="display: grid; grid-template-columns: 1fr 1fr;">
    
    <!-- 2️⃣ Coluna de Texto: Padding interno 10px -->
    <div>
      <div style="padding: 10px; box-sizing: border-box;">
        <h2>Prazer, somos a BemDito!</h2>
        <p>Subtítulo...</p>
      </div>
    </div>
    
    <!-- 3️⃣ Coluna de Mídia: Padding 0px -->
    <div>
      <div style="padding: 0;">
        <img src="..." />
      </div>
    </div>
    
  </div>
  
</section>
```

### Visual Comparativo

```
┌─────────────────────────────────────────────────┐ ← Section (128px left, 16px right)
│                                                 │
│  ┌──────────────────┐  ┌────────────────────┐  │
│  │  ▓▓ 10px ▓▓      │  │                    │  │
│  │  ┌────────────┐  │  │  Mídia (0px)       │  │ ← Texto (10px) vs Mídia (0px)
│  │  │   Texto    │  │  │  Cola nas bordas   │  │
│  │  └────────────┘  │  │                    │  │
│  │  ▓▓ 10px ▓▓      │  │                    │  │
│  └──────────────────┘  └────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Arquivos Modificados:**
- `/src/app/public/components/SectionRenderer.tsx` (linhas 1128, 1362)

---

## ⚠️ CORREÇÃO CRÍTICA: Operador `??` vs `||` em Valores Numéricos (2026-02-16)

**Problema:** Usar `||` (OR) com valores numéricos que podem ser `0` causa fallback incorreto.

**Exemplo do Bug:**
```typescript
const spacingMap = { 'none': 0, 'md': 24 };
const padding = spacingMap['none'] || 24;  // ❌ Retorna 24 (0 é falsy)

// ⚠️ PROBLEMA CRÍTICO descoberto em 2026-02-17 no parseSpacing():
return parseInt("0px".replace('px', '')) || 24;  // ❌ Retorna 24!
// Passo a passo:
// 1. parseInt("0px".replace('px', '')) → parseInt("0") → 0
// 2. 0 || 24 → 24 (porque 0 é falsy!)
// 3. padding-top: 0px do banco vira padding-top: 24px no HTML ❌
```

**Solução:**
```typescript
const padding = spacingMap['none'] ?? 24;  // ✅ Retorna 0 (0 não é nullish)

// ✅ CORREÇÃO 2026-02-17: Verificação explícita ao invés de ||
const parsed = parseInt(value.replace('px', ''));
return !isNaN(parsed) ? parsed : defaultValue;  // ✅ 0 é válido!
```

**Regras:**
- ✅ **SEMPRE** usar `??` (nullish coalescing) para valores numéricos que podem ser `0`
- ✅ **SEMPRE** usar `??` para valores booleanos que podem ser `false`
- ✅ **SEMPRE** usar `??` para strings que podem ser `''` (vazio)
- ✅ **SEMPRE** usar `!isNaN(parsed) ? parsed : default` ao parsear números
- ❌ **NUNCA** usar `||` quando `0`, `false` ou `''` são valores válidos
- ❌ **NUNCA** assumir que `0` não é um valor válido
- ❌ **NUNCA** usar `parseInt(value) || default` (0 vira default!)

**Diferença:**
- `||` retorna o segundo valor se o primeiro for **falsy** (`false`, `0`, `''`, `null`, `undefined`, `NaN`)
- `??` retorna o segundo valor **APENAS** se o primeiro for `null` ou `undefined`

**Casos de Uso:**
```typescript
// ✅ CORRETO: ?? permite 0 como válido
const opacity = config.opacity ?? 100;        // 0 é válido
const padding = spacingMap[spacing] ?? 24;    // 0 é válido
const columns = config.columns ?? 1;          // 0 é válido

// ✅ CORRETO: Parsing explícito de números
const parsed = parseInt(value);
const result = !isNaN(parsed) ? parsed : defaultValue;

// ❌ ERRADO: || trata 0 como inválido
const opacity = config.opacity || 100;        // 0 vira 100!
const padding = spacingMap[spacing] || 24;    // 0 vira 24!
const parsed = parseInt(value) || default;    // 0 vira default!
```

**Caso Real - SectionRenderer.tsx (linha 461):**
```typescript
// ❌ ANTES (BUG):
const parseSpacing = (value: string | number | undefined, defaultValue: number): number => {
  // ... código ...
  return parseInt(value.replace('px', '')) || defaultValue;  
  // 0px → 0 → 24 ❌ (banco tinha 0px mas renderizava 24px!)
};

// ✅ DEPOIS (CORRETO):
const parseSpacing = (value: string | number | undefined, defaultValue: number): number => {
  // ... código ...
  const parsed = parseInt(value.replace('px', ''));
  return !isNaN(parsed) ? parsed : defaultValue;  
  // 0px → 0 → 0 ✅ (banco com 0px renderiza 0px corretamente!)
};
```

**Impacto Real:**
- Seção 667ab5d5 ("Prazer, somos a BemDito!") tinha `styling.spacing.top = "0px"` no banco
- Mas renderizava `<section style="padding-top: 24px">` no HTML
- Mídia não colava nas bordas porque o padding consumia 48px da altura (24px top + 24px bottom)
- **CORREÇÃO:** Após fix, `"0px"` → `0` → mídia cola perfeitamente!

**Documentação:** `/___PADDING_SECTION_FIX_2026-02-16.md` (atualizado em 2026-02-17)

---

## ⚠️ CORREÇÃO CRÍTICA: Column-Gap com Mídia Alinhada nas Bordas (2026-02-16)

**Problema:** Grid com `column-gap` impede mídia no modo "alinhada" de colar nas bordas direita/esquerda da seção.

**Causa:** O `column-gap` cria espaçamento entre colunas, fazendo a coluna da direita terminar antes da borda da seção.

**Exemplo do Bug:**
```typescript
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '32px', // ← Coluna 2 termina em ~96%, não 100%
};
```

**Solução:**
```typescript
// ✅ Remover gap quando mídia alinhada nas bordas
const shouldRemoveGap = mediaDisplayMode === 'alinhada' && hasMedia && (mediaAlign === 'left' || mediaAlign === 'right');

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: shouldRemoveGap ? '0px' : '32px', // ✅ Condicional
};
```

**Regras:**
- ✅ **SEMPRE** remover `column-gap` quando mídia em modo "alinhada" + alinhamento nas bordas
- ✅ **SEMPRE** manter `column-gap` em outros modos (cobrir, ajustada, contida)
- ✅ **SEMPRE** validar se mídia está realmente colando nas bordas visualmente
- ❌ **NUNCA** usar gap fixo quando mídia precisa colar nas bordas

**Documentação:** `/___PADDING_SECTION_FIX_2026-02-16.md`

---

## ⚠️ CORREÇÃO CRÍTICA: Sistema Auto-Fix de gridRows (2026-02-15)

### Problema Resolvido
Seções não renderizavam quando tinham **posições verticais** (`center`, `middle-left`, `middle-right`) com **`gridRows = 1`**.

### Solução Implementada

**Auto-fix em Runtime:**
O `SectionRenderer.tsx` agora calcula automaticamente o `gridRows` correto baseado nas posições dos elementos:

```typescript
// ✅ AUTO-FIX: Validação automática
const calculateGridRows = (layout: any, configGridRows: number): number => {
  const positions = [
    layout?.desktop?.text,
    layout?.desktop?.media,
    layout?.desktop?.cards,
  ];

  const requiresTwoRows = positions.some(pos =>
    ['middle-left', 'middle-right', 'center'].includes(pos)
  );

  if (requiresTwoRows && configGridRows === 1) {
    console.warn(
      `⚠️ [AUTO-FIX] Seção: gridRows ajustado de 1 para 2 (posições verticais detectadas)`
    );
    return 2;
  }

  return configGridRows;
};
```

**Regras de Validação:**

| Posição | Requer 2 Linhas | Descrição |
|---------|-----------------|-----------|
| `top-left`, `top-right`, `top-center` | ❌ Não | Posições superiores funcionam com 1 linha |
| `bottom-left`, `bottom-right`, `bottom-center` | ❌ Não | Posições inferiores funcionam com 1 linha |
| `middle-left`, `middle-right` | ✅ **SIM** | Ocupam ambas as linhas verticalmente |
| `center` | ✅ **SIM** | Ocupa grid completo (2x2) |

**Benefícios:**
- ✅ Site **NUNCA quebra** mesmo com dados inconsistentes
- ✅ Correção automática em runtime (fallback seguro)
- ✅ Warnings no console indicam dados que precisam correção no banco
- ✅ Migrations corrigem permanentemente no banco

**Arquivos Envolvidos:**
- Código: `/src/app/public/components/SectionRenderer.tsx`
- Migration: `/migrations/2026-02-15_v6.11_fix_all_gridrows_conflicts.sql`
- Documentação: `/___AUTO_FIX_GRIDROWS_2026-02-15.md`
- Status Final: `/___SECTIONS_NOT_RENDERING_FIX_2026-02-15.md`

**Status Atual (2026-02-15):**
- ✅ Banco de dados: 100% correto (todas as migrations executadas)
- ✅ Código: Auto-fix implementado
- ✅ Site: Funcionando perfeitamente
- 🟡 Warnings no console: Cache antigo (requer CTRL+SHIFT+R)

### ⚠️ CORREÇÃO ADICIONAL: Texto Center em Grid 2x2 (2026-02-15)

**Problema:** Seções com `text = "center"` + `gridCols = 2` + `gridRows = 2` SEM mídia/cards não renderizavam corretamente.

**Solução:**
```typescript
// ✅ Detectar texto center em grid 2x2 e usar grid mesmo sem mídia
const isTextCenterInGrid2x2 = textPosition === 'center' && gridCols === 2 && gridRows === 2;
const useGrid = hasMedia || hasCardsInSeparateColumn || isTextCenterInGrid2x2;

// Fazer texto ocupar grid completo (2x2)
style={{
  gridColumn: isTextCenterInGrid2x2 ? 'span 2' : undefined,
  gridRow: isTextCenterInGrid2x2 ? 'span 2' : undefined,
}}
```

**Documentação:** `/___FIX_TEXT_CENTER_GRID_2X2_2026-02-15.md`

---

## ⚠️ CORREÇÃO CRÍTICA: Grid Duplicado em Seções 2×2 (2026-02-16)

### Problema Resolvido
Seções com **grid 2×2 + mídia** renderizavam conteúdo ocupando apenas **50-66% da largura** da tela ao invés de **100%** (fullwidth).

### Causa Raiz
**Grid duplicado** sendo criado no código:
- Grid **externo** com `gap: 2rem` (linha 1631 do SectionRenderer)
- Grid **interno** com conteúdo (linha 993)

O grid interno estava **dentro de 1 das 4 células** do grid externo, desperdiçando 75% do espaço disponível.

### Solução Implementada

**Remoção do Grid Externo:**
```typescript
// ❌ REMOVIDO: Grid externo que causava duplicação
// const useGridLayout = gridRows > 1 || gridCols > 1;
// const gridContainerStyle: React.CSSProperties = useGridLayout ? {
//   display: 'grid',
//   gridTemplateRows: ...,
//   gridTemplateColumns: ...,
//   gap: '2rem', // ❌ Causava espaço vazio
// } : {};

// ✅ AGORA: Sem grid externo
const gridContainerStyle: React.CSSProperties = {};
```

**Estrutura Corrigida:**
```html
<!-- ✅ Container simples (sem grid externo) -->
<div style="height: 100%;">
  <!-- ✅ Grid ÚNICO (fullwidth) -->
  <div style="display: grid; grid-template-columns: 1fr 1fr;">
    <div>Texto (50% da tela)</div>
    <div>Mídia (50% da tela)</div>
  </div>
</div>
```

**Benefícios:**
- ✅ Seções com grid 2×2 agora ocupam **100% da largura**
- ✅ Correção **global** (afeta todas as páginas automaticamente)
- ✅ **Sem necessidade de migrations SQL** (correção no código)
- ✅ Performance melhorada (-2 elementos DOM, 50% menos cálculos de layout)

**Seções Afetadas:**
- Apenas seções com `gridCols = 2` + `gridRows = 2` + `hasMedia = true`
- Exemplo: Seção "Prazer, somos a BemDito!" (ID: `667ab5d5`)

**Arquivos Envolvidos:**
- Código: `/src/app/public/components/SectionRenderer.tsx` (linhas 1627-1674)
- Documentação Completa: `/___GRID_DUPLICADO_FIX_2026-02-16.md`
- Auditoria: `/migrations/2026-02-16_QUICK_CHECK_HOME.sql`
- Análise: `/___HOME_SECTIONS_ANALYSIS_2026-02-16.md`

**Status Atual (2026-02-16):**
- ✅ Código: Grid externo removido
- ✅ Seções: 100% funcionais (1 seção corrigida, 9 não afetadas)
- ✅ Validação: Confirmada pelo usuário
- ✅ Documentação: Completa

**Como Diagnosticar Problemas Similares:**
1. **Visual:** Seção ocupa menos de 90% da largura → possível grid duplicado
2. **Inspetor:** Procurar por DOIS elementos com `display: grid` aninhados
3. **Console:** Verificar log `✅ FIX: Grid externo removido`
4. **SQL:** Executar `/migrations/2026-02-16_QUICK_CHECK_HOME.sql`

---

## ⚠️ CORREÇÃO CRÍTICA: Mídia com Width: 0 no Modo "Alinhada" (2026-02-16)

### Problema Resolvido
Seções com **modo "alinhada"** (mídia colada nas bordas) renderizavam imagens com **`width: 0`**, tornando-as invisíveis.

### Causa Raiz
**`width: auto` + `position: absolute` = colapso para 0px**

O código usava:
```typescript
// ❌ PROBLEMA (getMediaStyles, linha 737)
case 'alinhada':
  return {
    imgStyle: { 
      width: 'auto',   // ← Com position:absolute, colapsa para 0
      height: 'auto',
    }
  };
```

Elementos com `position: absolute` **saem do fluxo normal do documento**. Sem dimensões explícitas, o navegador não consegue calcular o tamanho, resultando em `width: 0`.

### Solução Implementada

**Forçar dimensões explícitas no inline style:**
```typescript
// ✅ CORREÇÃO (renderização, linha 1207)
<img 
  style={{
    width: '100%',   // ← Preenche container relativo
    height: '100%',
    objectFit: 'contain',  // ← Mantém proporção
    position: 'absolute',
    // Alinhamento via left/right/top/bottom
  }}
/>
```

**Por que funciona:**
- `width: 100%` e `height: 100%` forçam a imagem a ocupar todo o container relativo
- `objectFit: contain` garante que a proporção seja mantida (não distorce)
- `maxWidth: 100%` e `maxHeight: 100%` limitam o tamanho máximo
- `position: absolute` + propriedades de alinhamento (`left`, `right`, `top`, `bottom`) posicionam corretamente

### Comparação Visual

**Antes (BUG):**
```html
<img style="width: auto; height: auto; position: absolute;" />
<!-- Resultado: width calculado = 0px (invisível) -->
```

**Depois (CORRETO):**
```html
<img style="width: 100%; height: 100%; position: absolute; object-fit: contain;" />
<!-- Resultado: Imagem preenche área disponível, mantém proporção, cola nas bordas -->
```

### Benefícios
- ✅ Imagens no modo "alinhada" **sempre visíveis**
- ✅ **Proporção mantida** (não distorce)
- ✅ **Cola perfeitamente nas bordas** configuradas (ex: inferior direita)
- ✅ Funciona em **todas as combinações** de `alignX` e `alignY`

### Seções Afetadas
- Apenas seções com `config.media.fitMode = "alinhada"`
- Exemplo: Seção "Prazer, somos a BemDito!" (ID: `667ab5d5`)

### Arquivos Envolvidos
- Código: `/src/app/public/components/SectionRenderer.tsx` (linhas 1202-1220)
- Documentação: Este documento (`Guidelines.md`)

### Status Atual (2026-02-16)
- ✅ Código: `width: 100%` e `height: 100%` forçados
- ✅ Mídia: 100% visível e posicionada corretamente
- ✅ Proporção: Mantida via `objectFit: contain`
- ✅ Validação: Confirmada pelo usuário

### Regras Técnicas

✅ **SEMPRE** usar `width: 100%` e `height: 100%` com `position: absolute`  
✅ **SEMPRE** forçar `width: 100%` e `height: 100%` no container com `position: relative`  
✅ **SEMPRE** incluir `objectFit: contain` para manter proporção  
✅ **SEMPRE** usar `maxWidth` e `maxHeight` para limitar tamanho  
❌ **NUNCA** usar `width: auto` com `position: absolute`  
❌ **NUNCA** usar `width: auto` no container relativo (shrink-to-fit ao conteúdo)  
❌ **NUNCA** assumir que elementos absolute calculam dimensões automaticamente

**⚠️ IMPORTANTE:** Container com `position: relative` DEVE ter `width: 100%` explícito, caso contrário ele shrink-to-fit ao conteúdo (que está fora do fluxo se for absolute), causando espaçamento indesejado nas bordas.

### ⚠️ CORREÇÃO CRÍTICA: Campos alignX/alignY Faltando no Modo Alinhada (2026-02-16)

**Problema:** Seções com `fitMode = "alinhada"` mas sem os campos `config.media.alignX` e `alignY` resultam em mídia invisível ou posicionamento incorreto.

**Causa Raiz:**
O código do `SectionRenderer.tsx` lê `sectionConfig.media?.alignX` e `alignY` para posicionar a mídia quando `fitMode = "alinhada"`. Se esses campos estão NULL, a mídia não renderiza corretamente.

**Sintomas:**
- Mídia não aparece na seção (width: 0 ou position incorreto)
- Warning no console: `⚠️ [AUTO-FIX] gridRows ajustado de 1 para 2`
- Seção renderiza parcialmente (apenas texto visível)

**Solução:**
```sql
-- ✅ Adicionar alignX
UPDATE sections 
SET config = jsonb_set(config, '{media,alignX}', '"right"', true)
WHERE id = '667ab5d5-7a31-43e5-8a48-432f24ca2d01';

-- ✅ Adicionar alignY
UPDATE sections 
SET config = jsonb_set(config, '{media,alignY}', '"bottom"', true)
WHERE id = '667ab5d5-7a31-43e5-8a48-432f24ca2d01';
```

**Valores Possíveis:**
- `alignX`: `"left"` | `"center"` | `"right"`
- `alignY`: `"top"` | `"center"` | `"bottom"`

**Exemplo Completo:**
```json
{
  "media": {
    "fitMode": "alinhada",
    "alignX": "right",      // ← Obrigatório quando fitMode = "alinhada"
    "alignY": "bottom"      // ← Obrigatório quando fitMode = "alinhada"
  }
}
```

**Arquivos Envolvidos:**
- Migration: `/migrations/2026-02-16_v6.13_fix_media_align_section_667ab5d5.sql`
- Código: `/src/app/public/components/SectionRenderer.tsx` (linhas 1198-1204)
- SQL: `/EXECUTE_SQL.sql`

**Status Atual (2026-02-16):**
- ✅ Correção SQL executada e validada no banco
- ✅ Código valida e usa os campos corretamente
- ✅ Seção 667ab5d5 ("Prazer, somos a BemDito!") 100% funcional
- ✅ Mídia renderiza no canto inferior direito conforme esperado
- ⚠️ **Limpeza de cache necessária:** Execute `CTRL+SHIFT+R` no navegador

**Query de Validação Final:**
```sql
SELECT 
  config->'media'->>'fitMode' as fit_mode,      -- "alinhada" ✅
  config->'media'->>'alignX' as align_x,        -- "right" ✅
  config->'media'->>'alignY' as align_y,        -- "bottom" ✅
  config->>'gridRows' as grid_rows              -- "2" ✅
FROM sections
WHERE id = '667ab5d5-7a31-43e5-8a48-432f24ca2d01';
```

**Problema Adicional Descoberto:**
Durante a correção, identificamos que o `config` tinha uma estrutura aninhada incorreta (`config.config.media`). A solução usando `jsonb_build_object` com merge (`||`) corrigiu ambos os problemas:
- ✅ Criou o objeto `media` no nível correto
- ✅ Preencheu `fitMode`, `alignX` e `alignY`

**Regras Obrigatórias:**
- ✅ **SEMPRE** definir `alignX` e `alignY` quando `fitMode = "alinhada"`
- ✅ **SEMPRE** validar que os campos existem antes de publicar seção
- ✅ **SEMPRE** usar migration SQL para corrigir dados existentes
- ❌ **NUNCA** deixar `alignX` ou `alignY` como NULL no modo "alinhada"
- ❌ **NUNCA** assumir que valores padrão funcionam sem os campos

### ✨ ATUALIZAÇÃO: Interface Admin com Campos de Mídia (2026-02-17)

**Novidade:** Agora o `SectionBuilder.tsx` possui campos para configurar mídia diretamente na interface!

**Como Acessar:**
1. Abra `/admin/pages-manager` → Editar Seção
2. Ative o toggle **"Mídia"** na seção "2. Elementos da Seção"
3. Nova seção **"2.5 Configuração de Mídia"** aparece automaticamente

**Campos Disponíveis:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Mídia (Imagem/Vídeo)** | MediaUploader | Upload, biblioteca e preview de mídia |
| **Modo de Exibição** | Dropdown | cobrir / ajustada / contida / alinhada |
| **Alinhamento Horizontal** | 3 botões | left / center / right (apenas modo "alinhada") |
| **Alinhamento Vertical** | 3 botões | top / center / bottom (apenas modo "alinhada") |

**Lógica Condicional:**
- Campos `alignX` e `alignY` **SOMENTE aparecem** se `fitMode = "alinhada"`
- Preview em tempo real mostra configuração atual

**Mapeamento de Campos:**
```typescript
// Interface salva em config.media
config.mediaUrl           // URL da mídia (via MediaUploader)
config.media.fitMode      // cobrir | ajustada | contida | alinhada
config.media.alignX       // left | center | right (opcional)
config.media.alignY       // top | center | bottom (opcional)
```

**Arquivo Modificado:**
- `/src/app/admin/sections-manager/SectionBuilder.tsx` (linhas 35, 920-925)

**Benefícios:**
- ✅ Upload direto no Supabase Storage
- ✅ Biblioteca de mídias com thumbnails
- ✅ Preview em tempo real
- ✅ Drag-and-drop funcional
- ✅ Validação de tamanho (10MB)
- ✅ Campos condicionais (alignX/Y só no modo "alinhada")

### ⚠️ CORREÇÃO CRÍTICA: Sincronização de Estado ao Reabrir Modal (2026-02-17)

**Problema:** Ao editar mídia no modal de seção e salvar, os campos não permaneciam preenchidos ao reabrir o modal.

**Causa Raiz:**
O estado local `pageSections` era atualizado após o save, mas o React não detectava a mudança porque o objeto era atualizado **por referência** no array. Quando o modal reabria, o `useEffect` no `UnifiedSectionConfigModal` não era triggerado (pageSection não mudava).

**Solução:**
Recarregar as seções diretamente do banco após salvar:

```typescript
// Arquivo: /src/app/admin/pages-manager/editor.tsx (linha 358)
supabase
  .from('sections')
  .update({ config, elements, layout, styling })
  .eq('id', sectionId)
  .then(({ error }) => {
    if (error) {
      toast.error(`Erro ao salvar seção: ${error.message}`);
    } else {
      toast.success('Seção atualizada com sucesso!');
      
      // ✅ CORREÇÃO 2026-02-17: Recarregar seções do banco
      loadPageSections().then(() => {
        console.log('✅ Seções recarregadas após salvamento!');
      });
      
      setUnsavedChanges(true);
    }
  });
```

**Benefícios:**
- ✅ Modal sempre abre com dados atualizados do banco
- ✅ Campos de mídia (URL, fitMode, alignX, alignY) persistem corretamente
- ✅ Sincronização garantida entre salvamento e reabertura
- ✅ Resolve problema de detecção de mudanças do React

**Arquivos Modificados:**
- `/src/app/admin/sections-manager/SectionBuilder.tsx` (linhas 35, 920-925) - MediaUploader integrado
- `/src/app/admin/pages-manager/editor.tsx` (linha 358) - Reload após save
- `/guidelines/Guidelines.md` - Esta documentação

**Status Atual (2026-02-17):**
- ✅ MediaUploader funcionando no modal de seção
- ✅ Valores persistem ao reabrir o modal
- ✅ Upload de mídia via Supabase Storage
- ✅ Biblioteca de mídias com preview

### ⚠️ CORREÇÃO CRÍTICA: Mídia com Width: 0 no Modo "Alinhada" (2026-02-17)

**Problema Resolvido:**
Seções com **modo "alinhada"** (mídia colada nas bordas) renderizavam imagens com **`width: 0`**, tornando-as invisíveis.

**Causa Raiz:**
**`width: auto` + `position: absolute` = colapso para 0px**

O código usava:
```typescript
// ❌ PROBLEMA (getMediaStyles, linha 737)
case 'alinhada':
  return {
    imgStyle: { 
      width: 'auto',   // ← Com position:absolute, colapsa para 0
      height: 'auto',
    }
  };
```

Elementos com `position: absolute` **saem do fluxo normal do documento**. Sem dimensões explícitas, o navegador não consegue calcular o tamanho, resultando em `width: 0`.

**Solução Implementada:**

**Forçar dimensões explícitas no inline style:**
```typescript
// ✅ CORREÇÃO (renderização, linha 1428)
<img 
  style={{
    width: '100%',   // ← Preenche container relativo
    height: '100%',
    objectFit: 'contain',  // ← Mantém proporção
    position: 'absolute',
    // Alinhamento via left/right/top/bottom
  }}
/>
```

**Por que funciona:**
- `width: 100%` e `height: 100%` forçam a imagem a ocupar todo o container relativo
- `objectFit: contain` garante que a proporção seja mantida (não distorce)
- `maxWidth: 100%` e `maxHeight: 100%` limitam o tamanho máximo
- `position: absolute` + propriedades de alinhamento (`left`, `right`, `top`, `bottom`) posicionam corretamente

**Comparação Visual:**

**Antes (BUG):**
```html
<img style="width: auto; height: auto; position: absolute;" />
<!-- Resultado: width calculado = 0px (invisível) -->
```

**Depois (CORRETO):**
```html
<img style="width: 100%; height: 100%; position: absolute; object-fit: contain;" />
<!-- Resultado: Imagem preenche área disponível, mantém proporção, cola nas bordas -->
```

**Benefícios:**
- ✅ Imagens no modo "alinhada" **sempre visíveis**
- ✅ **Proporção mantida** (não distorce)
- ✅ **Cola perfeitamente nas bordas** configuradas (ex: inferior direita)
- ✅ Funciona em **todas as combinações** de `alignX` e `alignY`

**Seções Afetadas:**
- Apenas seções com `config.media.fitMode = "alinhada"`
- Exemplo: Seção "Prazer, somos a BemDito!" (ID: `667ab5d5`)

**Arquivos Envolvidos:**
- Código: `/src/app/public/components/SectionRenderer.tsx` (linhas 1428-1446)
- Documentação: Este documento (`Guidelines.md`)

**Status Atual (2026-02-17):**
- ✅ Código: `width: 100%` e `height: 100%` forçados
- ✅ Mídia: 100% visível e posicionada corretamente
- ✅ Proporção: Mantida via `objectFit: contain`
- ✅ Validação: Confirmada pelo usuário

**Regras Técnicas:**

✅ **SEMPRE** usar `width: 100%` e `height: 100%` com `position: absolute`  
✅ **SEMPRE** forçar `width: 100%` e `height: 100%` no container com `position: relative`  
✅ **SEMPRE** incluir `objectFit: contain` para manter proporção  
✅ **SEMPRE** usar `maxWidth` e `maxHeight` para limitar tamanho  
❌ **NUNCA** usar `width: auto` com `position: absolute`  
❌ **NUNCA** usar `width: auto` no container relativo (shrink-to-fit ao conteúdo)  
❌ **NUNCA** assumir que elementos absolute calculam dimensões automaticamente

**⚠️ IMPORTANTE:** Container com `position: relative` DEVE ter `width: 100%` explícito, caso contrário ele shrink-to-fit ao conteúdo (que está fora do fluxo se for absolute), causando espaçamento indesejado nas bordas.

### ⚠️ CORREÇÃO: Objetos Vazios no Layout.desktop (2026-02-17)

**Problema:** Warning no console ao abrir SectionBuilder:
```
⚠️ [SectionBuilder] Posição legada inválida (campos ausentes): {}
```

**Causa Raiz:**
Algumas seções no banco têm objetos vazios `{}` em `layout.desktop.text`, `layout.desktop.media`, etc. A função `migrateLayoutToGrid` tentava converter esses objetos vazios mas falhava porque não tinham os campos `row` e `horizontal`.

**Solução:**
```typescript
// ANTES (quebrava com objeto vazio)
for (const [key, value] of Object.entries(layout.desktop || {})) {
  if (typeof value === 'object' && value !== null) {
    const legacyPos = value as { row: string; horizontal: string };
    const gridPos = convertLegacyToGrid(legacyPos); // ❌ Falhava com {}
  }
}

// DEPOIS (valida objeto vazio)
for (const [key, value] of Object.entries(layout.desktop || {})) {
  if (typeof value === 'object' && value !== null) {
    const legacyPos = value as { row?: string; horizontal?: string };
    
    // ✅ Se objeto vazio, pular
    if (Object.keys(legacyPos).length === 0) {
      console.warn(`⚠️ [SectionBuilder] Objeto vazio em layout.desktop.${key}, pulando migração`);
      continue;
    }
    
    const gridPos = convertLegacyToGrid(legacyPos);
  }
}
```

**Diagnóstico SQL:**
Execute `/migrations/2026-02-17_diagnostic_empty_layout_objects.sql` ou `/EXECUTE_SQL.sql` para identificar seções com objetos vazios.

**Correção SQL (se necessário):**
```sql
-- Remover campos vazios do layout.desktop
UPDATE sections
SET layout = jsonb_set(
  layout,
  '{desktop}',
  (
    SELECT jsonb_object_agg(key, value)
    FROM jsonb_each(layout->'desktop')
    WHERE value != '{}'::jsonb
  )
)
WHERE 
  (
    layout->'desktop'->'text' = '{}'::jsonb OR
    layout->'desktop'->'media' = '{}'::jsonb OR
    layout->'desktop'->'cards' = '{}'::jsonb
  )
  AND layout->'desktop' IS NOT NULL;
```

**Arquivos Modificados:**
- `/src/app/admin/sections-manager/SectionBuilder.tsx` (linhas 488-500, 507)
- `/migrations/2026-02-17_diagnostic_empty_layout_objects.sql` (novo)
- `/EXECUTE_SQL.sql` (query diagnóstica adicionada)

**Status Atual (2026-02-17):**
- ✅ Validação de objetos vazios implementada
- ✅ Warnings informativos no console
- ✅ Migration não quebra mais ao encontrar objetos vazios
- 🔍 Query diagnóstica disponível para identificar seções afetadas

### ⚠️ CORREÇÃO CRÍTICA: Column-Gap com Mídia Alinhada nas Bordas (2026-02-16)

**Problema:** Grid com `column-gap` impede mídia no modo "alinhada" de colar nas bordas direita/esquerda da seção.

**Causa:** O `column-gap` cria espaçamento entre colunas, fazendo a coluna da direita terminar antes da borda da seção.

**Exemplo do Bug:**
```typescript
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '32px', // ← Coluna 2 termina em ~96%, não 100%
};
```

**Solução:**
```typescript
// ✅ Remover gap quando mídia alinhada nas bordas
const shouldRemoveGap = mediaDisplayMode === 'alinhada' && hasMedia && (mediaAlign === 'left' || mediaAlign === 'right');

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: shouldRemoveGap ? '0px' : '32px', // ✅ Condicional
};
```

**Regras:**
- ✅ **SEMPRE** remover `column-gap` quando mídia em modo "alinhada" + alinhamento nas bordas
- ✅ **SEMPRE** manter `column-gap` em outros modos (cobrir, ajustada, contida)
- ✅ **SEMPRE** validar se mídia está realmente colando nas bordas visualmente
- ❌ **NUNCA** usar gap fixo quando mídia precisa colar nas bordas

**Documentação:** `/___PADDING_SECTION_FIX_2026-02-16.md`

---

## ✅ PADRÕES OBRIGATÓRIOS DO PAINEL ADMIN (2026-02-21)

### 1. Normalização de Dados ao Carregar do Banco

**Problema:** Dados antigos carregados do banco podem não ter `id` em itens de arrays (colunas, links, redes sociais, etc.), causando falha silenciosa em callbacks de update/delete.

**Solução obrigatória:** Criar função `normalizeXxx()` no `loadConfig` / `loadData` para garantir IDs em todos os itens:

```typescript
function normalizeFooter(raw: any): FooterConfig {
  const ts = Date.now();
  return {
    copyright: raw.copyright || '',
    columns: (raw.columns || []).map((col: any, ci: number) => ({
      id: col.id || `col-${ts}-${ci}`,          // ← sempre garantido
      title: col.title || '',
      links: (col.links || []).map((lnk: any, li: number) => ({
        id: lnk.id || `link-${ts}-${ci}-${li}`, // ← sempre garantido
        label: lnk.label || '',
        url: lnk.url || '',
      })),
    })),
    social: (raw.social || []).map((s: any, si: number) => ({
      id: s.id || `social-${ts}-${si}`,          // ← sempre garantido
      platform: s.platform || '',
      icon: s.icon || 'Globe',
      url: s.url || '',
    })),
  };
}
```

**Fallback adicional em botões de ação:**
```tsx
// Nos callbacks, usar fallback no key e no id passado ao setState
onClick={() => setColumnToDelete(column.id || `col-${colIndex}`)}
```

**Regras obrigatórias:**

✅ **SEMPRE** normalizar arrays JSONB do banco na função de carregamento  
✅ **SEMPRE** gerar `id` com `Date.now()` + índice quando ausente  
✅ **SEMPRE** usar fallback `item.id || \`prefix-${index}\`` em `key` e em callbacks  
❌ **NUNCA** assumir que itens de arrays JSONB carregados do banco possuem `id`  
❌ **NUNCA** passar `undefined` como `id` para funções de update/delete

---

### 2. Auto-Save com Debounce (Padrão Admin)

**Padrão obrigatório** para todas as páginas do painel que salvam configuração:

```typescript
const hasLoaded = useRef(false);

useEffect(() => { loadConfig(); }, []);

// Auto-save disparado em qualquer mudança de estado, com debounce 800ms
useEffect(() => {
  if (!hasLoaded.current) return;       // ← evita salvar no carregamento inicial
  const timer = setTimeout(async () => {
    await supabase.from('minha_tabela').update({ campo: valor }).eq('id', id);
  }, 800);
  return () => clearTimeout(timer);     // ← cancela se mudar antes dos 800ms
}, [valorQueDeveDisparar]);

// No final do loadConfig, marcar como carregado:
hasLoaded.current = true;
```

**Regras obrigatórias:**

✅ **SEMPRE** usar `useRef(false)` como guard para não salvar no mount  
✅ **SEMPRE** usar debounce de **800ms** (padrão do projeto)  
✅ **SEMPRE** retornar o `clearTimeout` no `useEffect` (cleanup)  
✅ **SEMPRE** marcar `hasLoaded.current = true` ao final do `loadConfig`  
❌ **NUNCA** usar botão "Salvar" manual em páginas de configuração do admin  
❌ **NUNCA** usar `useUnsavedChangesGuard` / `UnsavedHeaderActions` em páginas com auto-save  
❌ **NUNCA** salvar durante o carregamento inicial (guard obrigatório)

---

### 3. Posicionamento de Botões de Ação Primária

**Regra:** O botão de ação principal (criar/adicionar) de cada página admin **SEMPRE** vai no `headerActions` do `AdminPageLayout`, **nunca** duplicado dentro do conteúdo da aba.

```tsx
// ✅ CORRETO
<AdminPageLayout
  title="Rodapé"
  headerActions={
    <Button onClick={addColumn}>
      <Plus className="h-4 w-4 mr-2" /> Adicionar Coluna
    </Button>
  }
  tabs={[...]}
/>

// ❌ INCORRETO — botão duplicado dentro da aba
const columnsTabContent = (
  <>
    <div className="flex justify-between">
      <h3>Colunas de Links</h3>
      <Button onClick={addColumn}>Adicionar Coluna</Button> {/* duplicado! */}
    </div>
    ...
  </>
);
```

**Exceção permitida:** Botão secundário *dentro* da aba para estado vazio (`AdminEmptyState`) ou para ações de escopo local (ex: "Adicionar Link" dentro de uma coluna específica).

**Regras obrigatórias:**

✅ **SEMPRE** colocar o botão primário de criação no `headerActions`  
✅ **SEMPRE** usar `AdminEmptyState` com `cta` para estado vazio na aba  
❌ **NUNCA** ter o mesmo botão em `headerActions` E dentro do conteúdo da aba simultaneamente  
❌ **NUNCA** usar `headerActions={null}` quando existe ação primária para a página

---

### 4. Preview no Admin — Fidelidade ao Componente Público

**Regra:** O preview de qualquer página admin (footer, header, seções) deve ser **estruturalmente idêntico** ao componente público correspondente.

**Checklist de fidelidade:**

| Elemento | Regra |
|---|---|
| Cores de fundo | Usar tokens via `useDesignTokens()` — `secondaryColor`, `primaryColor` |
| Links | Sem ícone de corrente (🔗) — texto simples ou span |
| Ícones sociais | Usar `getLucideIcon()` — mesma lógica do público |
| Copyright | Centralizado, linha separada, sem borda inferior extra |
| Títulos de colunas | Sem `uppercase` / `tracking-wide` extra se o público não usa |
| Borda separadora | Apenas onde o público tem (`border-b` + `mb-8 pb-8`) |

**Itens proibidos no preview:**

❌ **NUNCA** adicionar card de "💡 Dica" abaixo do preview  
❌ **NUNCA** adicionar botão "Preview" no `headerActions` (preview é uma aba, não ação)  
❌ **NUNCA** divergir a estrutura HTML/CSS do componente público sem justificativa documentada

---

### 5. Padrão Visual de Cards Internos nas Abas (2026-02-21)

Aplica-se a **qualquer card de configuração** exibido dentro de uma aba do painel (ex.: cards "Logo", "Botão de Ação (CTA)", "Header Sticky" em `/admin/menu-manager`).

#### Estrutura obrigatória do card

```tsx
<div className="bg-white border-2 border-gray-200 rounded-2xl p-6 space-y-4">
  {/* Apenas o título — sem ícone, sem subtítulo descritivo */}
  <div>
    <h3 className="text-lg font-semibold text-gray-900">
      Nome do Card
    </h3>
  </div>
  {/* Campos de formulário diretamente abaixo */}
</div>
```

#### O que NÃO deve aparecer no `<h3>` do card

| Elemento proibido | Motivo |
|---|---|
| Ícone Lucide ao lado do título (`<Zap>`, `<Pin>`, `<ImageIcon>`, etc.) | Poluição visual — o título já identifica o card |
| Classes de layout no `<h3>` quando não há ícone (`flex items-center gap-2`) | Código morto — só faz sentido com ícone |
| Subtítulo/descrição em `<p>` dentro do card | Redundante com o label dos próprios campos |
| Texto auxiliar em `<p>` abaixo de inputs (ex.: "URL para onde o logo navega ao clicar") | Redundante com o `placeholder` do campo |

#### O que NÃO deve aparecer no componente `ImageUploadOnly`

O parâmetro `helperText` **permanece na interface TypeScript** para compatibilidade, mas o bloco de renderização foi removido:

```tsx
// ❌ REMOVIDO — não renderizar helperText
{helperText && (
  <p className="text-xs text-gray-500 mt-1">{helperText}</p>
)}

// ✅ CORRETO — helperText existe na interface mas não é exibido
// O placeholder do <input> assume o papel de guia para o utilizador
```

**Regras obrigatórias:**

✅ **SEMPRE** usar `<h3>` limpo (apenas texto) nos cards internos de aba  
✅ **SEMPRE** remover `flex items-center gap-2` do `<h3>` quando não houver ícone  
✅ **SEMPRE** deixar os `placeholder` dos inputs assumirem o papel de descrição auxiliar  
❌ **NUNCA** adicionar ícone Lucide dentro do `<h3>` de um card interno de aba  
❌ **NUNCA** adicionar `<p>` descritivo abaixo do `<h3>` de um card interno de aba  
❌ **NUNCA** usar o parâmetro `helperText` do `ImageUploadOnly` (renderização desabilitada)  
❌ **NUNCA** adicionar `<p>` com texto auxiliar abaixo de inputs individuais dentro de cards

**Arquivos referência:**
- `/src/app/admin/menu-manager/page.tsx` — cards Logo, CTA, Sticky (padrão correto)
- `/src/app/components/ImageUploadOnly.tsx` — `helperText` na interface, sem renderização

---

### 6. Cabeçalho de Conteúdo de Aba — Tab Content Header (2026-02-21)

**Cada aba** do painel deve começar com um bloco de cabeçalho padronizado (ícone + título + subtítulo) imediatamente antes do primeiro conteúdo.

#### Estrutura obrigatória

```tsx
{/* Tab content header — obrigatório em TODAS as abas */}
<div>
  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
    <AlgumIcone className="h-5 w-5 text-primary" />
    Título da Aba
  </h3>
  <p className="text-sm text-gray-500 mt-0.5">Breve descrição do conteúdo desta aba</p>
</div>
```

#### Tokens exatos — não variar

| Elemento | Classe obrigatória | Notas |
|---|---|---|
| `<h3>` container | `text-lg font-semibold text-gray-900 flex items-center gap-2` | Imutável |
| Ícone | `h-5 w-5 text-primary` | Cor **rosa** do DS — não usar `text-gray-500` |
| `<p>` subtítulo | `text-sm text-gray-500 mt-0.5` | Não usar `text-gray-600` nem `mt-1` |

#### Inventário de cabeçalhos por página (estado 2026-02-21)

**`/admin/design-system`**

| Aba | Ícone | Título | Subtítulo |
|---|---|---|---|
| Cores | `<Palette />` | Paleta de Cores | Defina a paleta de cores do site. Estas cores serão usadas em todos os componentes. |
| Tipografia | `<Type />` | Tipografia | Configure os tamanhos e pesos da tipografia Poppins. Use os botões para reordenar. |
| Espaçamento | `<Ruler />` | Espaçamento | Configure os valores de espaçamento utilizados no site. |
| Border Radius | `<Circle />` | Border Radius | Configure os valores de border radius para elementos arredondados. |
| Transições | `<Sparkles />` | Transições | Configure as transições e animações do site. |

**`/admin/menu-manager`**

| Aba | Ícone | Título | Subtítulo |
|---|---|---|---|
| Itens do Menu | `<Menu />` | Itens do Menu | Gerencie os itens e a ordem do menu de navegação |
| Header | `<Settings />` | Configurações do Header | Configure o logo, botão de ação e comportamento do cabeçalho do site. |

**`/admin/footer-manager`**

| Aba | Ícone | Título | Subtítulo |
|---|---|---|---|
| Colunas | `<List />` | Colunas de Links | Configure as colunas e links do footer |
| Redes Sociais | `<Share2 />` | Redes Sociais | Configure os links para redes sociais |
| Preview | `<Eye />` | Preview do Footer | Visualização aproximada do rodapé no site |

#### Histórico de correções aplicadas (2026-02-21)

| Arquivo | Correção |
|---|---|
| `design-system/page.tsx` (4 abas) | ícones `text-gray-500` → `text-primary`; subtítulos `text-gray-600 mt-1` → `text-gray-500 mt-0.5` |
| `design-system/TypographyManager.tsx` | ícone `text-gray-500` → `text-primary`; subtítulo `text-gray-600 mt-1` → `text-gray-500 mt-0.5` |
| `menu-manager/page.tsx` aba "Itens do Menu" | cabeçalho adicionado (antes ausente) |
| `menu-manager/page.tsx` aba "Header" | ícone e subtítulo corrigidos |
| `footer-manager/page.tsx` | já estava correto — sem alterações |

**Regras obrigatórias:**

✅ **SEMPRE** incluir o bloco de cabeçalho no início de toda aba  
✅ **SEMPRE** usar `text-primary` no ícone (rosa da paleta)  
✅ **SEMPRE** usar exatamente `text-sm text-gray-500 mt-0.5` no subtítulo  
✅ **SEMPRE** consultar a tabela de inventário acima ao criar nova aba  
❌ **NUNCA** omitir o cabeçalho de aba (aba sem header viola o padrão)  
❌ **NUNCA** usar `text-gray-500` no ícone do cabeçalho de aba  
❌ **NUNCA** usar `text-gray-600` ou `mt-1` no subtítulo  
❌ **NUNCA** adicionar `flex items-center gap-2` no `<h3>` sem um ícone junto

---

### 7. Checklist Obrigatório para Novas Páginas e Modais Admin (2026-02-21)

Esta seção consolida **todos os padrões obrigatórios** que DEVEM ser aplicados ao criar qualquer nova página `/admin/*`, modal ou componente de lista no painel. Consultar este checklist antes de qualquer implementação nova.

---

#### 7.1 Imports obrigatórios em toda página admin

```tsx
// ── React ──────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Incluir APENAS os hooks que o arquivo de fato usa.
// NUNCA omitir useRef se o código usar ref = useRef(...)

// ── Roteamento ─────────────────────────────────────────────────────────────
import { useNavigate, useParams } from 'react-router';
// ⚠️ SEMPRE 'react-router', NUNCA 'react-router-dom'

// ── Supabase ───────────────────────────────────────────────────────────────
import { supabase } from '../../../lib/supabase/client';
// NUNCA usar supabase sem este import — causa ReferenceError

// ── Layout Admin (OBRIGATÓRIO em toda página /admin/*) ─────────────────────
import { AdminPageLayout }    from '../../components/admin/AdminPageLayout';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import { AdminEmptyState }    from '../../components/admin/AdminEmptyState';
import { AdminListItem }      from '../../components/admin/AdminListItem';        // se usar lista
import { AdminGridCard }      from '../../components/admin/AdminGridCard';        // se usar grid
import { AdminActionButtons } from '../../components/admin/AdminActionButtons';   // se usar editar/duplicar/excluir

// ── Modais (Camada 2 — NUNCA importar Dialog/AlertDialog diretamente) ──────
import { BaseModal }           from '../../components/admin/BaseModal';
import { ConfirmDeleteDialog } from '../../components/admin/ConfirmDeleteDialog';
import { ConfirmDialog }       from '../../components/admin/ConfirmDialog';       // se necessário
import { AlertMessageDialog }  from '../../components/admin/AlertMessageDialog';  // se necessário

// ── Tokens de design ───────────────────────────────────────────────────────
import { adminVar } from '../../components/admin/AdminThemeProvider';
// Usar adminVar() em QUALQUER style={{ }} que precise de token admin-ui

// ── Toast ──────────────────────────────────────────────────────────────────
import { toast } from 'sonner';
```

**Checklist de imports — antes de salvar o arquivo:**

- [ ] `React` + todos os hooks usados (useState, useEffect, useRef, useCallback…) em uma única linha
- [ ] `AdminPrimaryButton` importado se o arquivo usar `<AdminPrimaryButton>`
- [ ] `adminVar` importado se o arquivo usar `adminVar()`
- [ ] `supabase` importado se o arquivo fizer queries
- [ ] `useNavigate` / `useParams` importados de `'react-router'` (não `react-router-dom`)
- [ ] Nenhum import de `Dialog`, `AlertDialog` ou `Sheet` diretamente das primitivas

---

#### 7.2 Estrutura padrão de uma página admin

```tsx
export function MinhaFeaturePage() {
  // 1. Estado e hooks
  const [items, setItems]     = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded             = useRef(false); // guard de auto-save

  // 2. Carregamento inicial
  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    const { data, error } = await supabase.from('minha_tabela').select('*');
    if (error) { console.error(error); toast.error('Erro ao carregar'); return; }
    setItems(data || []);
    hasLoaded.current = true; // ← SEMPRE ao final do loadItems
  }

  // 3. Auto-save com debounce 800ms (apenas em páginas de configuração)
  useEffect(() => {
    if (!hasLoaded.current) return;
    const t = setTimeout(async () => {
      await supabase.from('minha_tabela').update({ campo: valor }).eq('id', id);
    }, 800);
    return () => clearTimeout(t);
  }, [valoresQueDisparamSave]);

  // 4. Loading guard
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  // 5. Layout
  return (
    <AdminPageLayout
      title="Nome da Feature"
      description="Descrição breve"
      headerActions={
        <AdminPrimaryButton onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" /> Criar Item
        </AdminPrimaryButton>
      }
    >
      {/* Conteúdo */}
    </AdminPageLayout>
  );
}
```

**Regras:**

✅ **SEMPRE** `AdminPageLayout` como raiz de toda página `/admin/*`  
✅ **SEMPRE** botão primário de criação no `headerActions` — nunca duplicado no corpo  
✅ **SEMPRE** `hasLoaded.current = true` ao final de `loadItems()` quando houver auto-save  
✅ **SEMPRE** loading guard antes do `return` do JSX  
❌ **NUNCA** usar `<Button className="bg-primary ...">` para botão primário — usar `AdminPrimaryButton`

---

#### 7.3 Padrão de badge de status (Publicado / Rascunho)

Usar inline `style` com CSS vars. **Nunca** usar classes Tailwind `bg-green-*` ou `bg-gray-*`.

```tsx
// ✅ CORRETO
<span
  className="px-2 py-1 rounded"
  style={{
    fontSize:        'var(--admin-badge-label-size,   0.75rem)',
    fontWeight:      'var(--admin-badge-label-weight, 500)',
    color:           'var(--admin-badge-label-color,  #ffffff)',
    backgroundColor: item.published
      ? 'var(--primary, #ea526e)'                   // publicado: cor primária do DS
      : 'var(--admin-field-placeholder, #9ca3af)',  // rascunho: cinza muted
  }}
>
  {item.published ? 'Publicado' : 'Rascunho'}
</span>

// ❌ ERRADO — não usar
<span className={`px-2 py-1 rounded ${item.published ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs`}>
  ...
</span>
```

**Tabela de mapeamento por estado:**

| Estado | Token CSS | Fallback | Visual |
|---|---|---|---|
| Publicado / Ativo | `var(--primary)` | `#ea526e` | Rosa da marca |
| Rascunho / Inativo | `var(--admin-field-placeholder)` | `#9ca3af` | Cinza neutro |
| Erro / Excluído | `var(--destructive)` | `#dc2626` | Vermelho |
| Destaque / Novo | `var(--accent)` | `#ed9331` | Laranja |

---

#### 7.4 Padrão de botão Excluir (sem AdminActionButtons)

Quando o botão Excluir não for servido por `AdminActionButtons` (ex: dentro de cards inline, dentro de listas em modais):

```tsx
// Variante com <Button> (tamanho médio):
const [deleteHovered, setDeleteHovered] = useState(false);

<Button
  variant="outline"
  size="sm"
  onClick={() => handleDelete(item.id)}
  style={{
    transition:      'none',
    color:           deleteHovered
      ? 'var(--admin-delete-btn-hover-text,   #b91c1c)'
      : 'var(--admin-delete-btn-text,         #dc2626)',
    backgroundColor: deleteHovered
      ? 'var(--admin-delete-btn-hover-bg,     #fef2f2)'
      : 'transparent',
    borderColor: deleteHovered
      ? 'var(--admin-delete-btn-hover-border, #fca5a5)'
      : 'var(--admin-btn-action-border,       #e5e7eb)',
  }}
  onMouseEnter={() => setDeleteHovered(true)}
  onMouseLeave={() => setDeleteHovered(false)}
>
  <Trash2 className="h-4 w-4" />
</Button>

// Variante icon-only inline (sem <Button> wrapper):
<button
  className="h-7 w-7 flex items-center justify-center rounded"
  style={{ color: 'var(--admin-delete-btn-text, #6b7280)', transition: 'none' }}
  onMouseEnter={(e) => {
    const el = e.currentTarget as HTMLButtonElement;
    el.style.backgroundColor = 'var(--admin-delete-btn-hover-bg,   #fef2f2)';
    el.style.color           = 'var(--admin-delete-btn-hover-text, #ef4444)';
  }}
  onMouseLeave={(e) => {
    const el = e.currentTarget as HTMLButtonElement;
    el.style.backgroundColor = 'transparent';
    el.style.color           = 'var(--admin-delete-btn-text, #6b7280)';
  }}
  onClick={() => handleDelete(item.id)}
  title="Excluir"
>
  <Trash2 className="h-3.5 w-3.5" />
</button>
```

❌ **NUNCA** usar `className="text-red-600 hover:text-red-700 hover:bg-red-50"` — hardcoded proibido

---

#### 7.5 Padrão de botão Ação (Editar / Duplicar / Configurar) sem AdminActionButtons

```tsx
const [actionHovered, setActionHovered] = useState(false);

<Button
  variant="outline"
  size="sm"
  onClick={handleAction}
  style={{
    transition:      'none',
    backgroundColor: actionHovered
      ? 'var(--admin-btn-action-hover-bg,   #f9fafb)'
      : 'var(--admin-btn-action-bg,         #ffffff)',
    color: actionHovered
      ? 'var(--admin-btn-action-hover-text, #111827)'
      : 'var(--admin-btn-action-text,       #374151)',
    borderColor: 'var(--admin-btn-action-border, #e5e7eb)',
  }}
  onMouseEnter={() => setActionHovered(true)}
  onMouseLeave={() => setActionHovered(false)}
>
  <Settings className="h-4 w-4 mr-1" />
  Configurar
</Button>
```

---

#### 7.6 Padrão de card de conteúdo interno (dentro de abas)

```tsx
// ✅ Estrutura canônica — imutável
<div
  className="rounded-2xl p-6 space-y-4"
  style={{
    backgroundColor: 'var(--admin-card-bg,     #ffffff)',
    border:          '2px solid var(--admin-card-border, #e5e7eb)',
    borderRadius:    'var(--admin-card-radius,  1.5rem)',
  }}
>
  {/* Apenas título — sem ícone Lucide, sem <p> descritivo */}
  <h3 className="text-lg font-semibold text-gray-900">
    Nome do Card
  </h3>

  <div className="space-y-4">
    <div>
      <Label className="mb-1">Nome do Campo</Label>
      <Input placeholder="Descrição no placeholder, não em parágrafo abaixo" />
    </div>
  </div>
</div>
```

**Proibido dentro de cards:**
❌ Ícone Lucide no `<h3>`  
❌ `<p>` descritivo abaixo do `<h3>`  
❌ `<p>` auxiliar abaixo de `<Input>`  
❌ `className="bg-white border-2 border-gray-200 rounded-2xl"` — usar `style` com tokens

---

#### 7.7 Padrão de estado vazio

```tsx
// Com CTA:
<AdminEmptyState
  title="Nenhum item encontrado"
  description="Clique em 'Criar' para adicionar o primeiro."
  cta={{ label: 'Criar', onClick: handleCreate }}
/>

// Sem CTA (busca sem resultado):
<AdminEmptyState
  title="Nenhum resultado"
  description="Tente outro termo de busca."
/>
```

❌ **NUNCA** criar `<div>` manual de estado vazio — usar `AdminEmptyState`

---

#### 7.8 Mapa completo de tokens por elemento visual

| Elemento | CSS var (com fallback) |
|---|---|
| Fundo de card | `var(--admin-card-bg, #ffffff)` |
| Borda de card | `var(--admin-card-border, #e5e7eb)` |
| Border-radius de card | `var(--admin-card-radius, 1.5rem)` |
| Fundo da página | `var(--admin-page-bg, #f9fafb)` |
| Título item (lista) | `adminVar('item-title-list', 'size/weight/color')` |
| Título item (grid) | `adminVar('item-title-grid', 'size/weight/color')` |
| Descrição de item | `adminVar('item-description', 'size/weight/color')` |
| Texto terciário | `adminVar('item-tertiary', 'size/weight/color')` |
| Badge tipografia | `var(--admin-badge-label-size/weight/color)` |
| Badge BG publicado | `var(--primary, #ea526e)` |
| Badge BG rascunho | `var(--admin-field-placeholder, #9ca3af)` |
| Botão primário BG | `var(--admin-btn-primary-bg, var(--primary))` |
| Botão primário texto | `var(--admin-btn-primary-text, #ffffff)` |
| Botão ação BG | `var(--admin-btn-action-bg, #ffffff)` |
| Botão ação texto | `var(--admin-btn-action-text, #374151)` |
| Botão ação borda | `var(--admin-btn-action-border, #e5e7eb)` |
| Botão ação hover BG | `var(--admin-btn-action-hover-bg, #f9fafb)` |
| Botão ação hover texto | `var(--admin-btn-action-hover-text, #111827)` |
| Botão cancelar BG | `var(--admin-btn-cancel-bg, #ffffff)` |
| Botão cancelar borda | `var(--admin-btn-cancel-border, #e5e7eb)` |
| Botão cancelar texto | `var(--admin-btn-cancel-text, #374151)` |
| Excluir cor normal | `var(--admin-delete-btn-text, #dc2626)` |
| Excluir hover BG | `var(--admin-delete-btn-hover-bg, #fef2f2)` |
| Excluir hover texto | `var(--admin-delete-btn-hover-text, #b91c1c)` |
| Excluir hover borda | `var(--admin-delete-btn-hover-border, #fca5a5)` |
| Ícone ação secundária | `var(--admin-icon-action, #6b7280)` |
| Ícone MoreVertical | `var(--admin-action-menu-icon, #6b7280)` |
| Campo BG | `var(--admin-field-bg, #ffffff)` |
| Campo texto | `var(--admin-field-text, #111827)` |
| Campo placeholder | `var(--admin-field-placeholder, #9ca3af)` |
| Campo borda | `var(--admin-field-border, #e5e7eb)` |
| Aba inativa label | `var(--admin-tab-label-size/weight/color)` |
| Aba ativa BG | `var(--admin-tab-active-bg, #ffffff)` |
| Aba ativa texto | `var(--admin-tab-active-text, #111827)` |
| Container abas BG | `var(--admin-tab-list-bg, #f3f4f6)` |
| Modal título | `adminVar('modal-title', 'size/weight/color')` |
| Modal footer BG | `var(--admin-modal-footer-bg, #f9fafb)` |
| Modal footer borda | `var(--admin-modal-footer-border, #e5e7eb)` |
| Colapsível BG | `var(--admin-collapsible-bg, #f9fafb)` |
| Colapsível borda | `var(--admin-collapsible-border, #e5e7eb)` |
| Item lista BG | `var(--admin-list-item-bg, #ffffff)` |
| Item lista borda | `var(--admin-list-item-border, #e5e7eb)` |

---

#### 7.9 Anti-patterns — O que NUNCA fazer

| ❌ Anti-pattern | ✅ Substituto correto |
|---|---|
| `className="bg-green-500"` em badge | `style={{ backgroundColor: 'var(--primary, #ea526e)' }}` |
| `className="bg-gray-500"` em badge | `style={{ backgroundColor: 'var(--admin-field-placeholder, #9ca3af)' }}` |
| `className="text-red-600 hover:bg-red-50"` em excluir | Inline `delete-btn-*` com handlers de mouse |
| `className="bg-primary hover:bg-primary/90"` em botão primário | `<AdminPrimaryButton>` |
| `import React from 'react'` sem declarar hooks usados | `import React, { useState, useRef, ... } from 'react'` |
| `useRef(...)` sem importar `useRef` | Adicionar `useRef` ao import de React |
| `supabase.from(...)` sem import do client | `import { supabase } from '../../../lib/supabase/client'` |
| `import { Dialog }` em feature | Usar `BaseModal` (Camada 2) |
| `import { AlertDialog }` em feature | Usar `ConfirmDeleteDialog` / `ConfirmDialog` |
| `<Button variant="outline">Cancelar</Button>` sem tokens | Tokens `btn-cancel-*` via `style` |
| `className="bg-white border-2 border-gray-200 rounded-2xl"` | `style` com `var(--admin-card-bg/border/radius)` |
| `font-medium text-sm text-gray-700` em `<Label>` | `<Label>` sem classes tipográficas (token global) |
| Botão "+ Criar X" dentro do corpo da aba | No `headerActions` do `AdminPageLayout` |
| Estado vazio com `<div>` manual | `<AdminEmptyState>` |
| `window.alert()` ou `window.confirm()` | `AlertMessageDialog` / `ConfirmDialog` |

---

#### 7.10 Checklist final antes de commitar nova página/modal admin

```
IMPORTS
[ ] React + todos os hooks usados na mesma linha de import
[ ] AdminPrimaryButton importado se <AdminPrimaryButton> for usado
[ ] adminVar importado se adminVar() for usado
[ ] supabase importado se queries forem feitas
[ ] useNavigate/useParams de 'react-router' (não react-router-dom)
[ ] Nenhum import direto de Dialog/AlertDialog/Sheet

ESTRUTURA
[ ] AdminPageLayout como raiz
[ ] Botão primário no headerActions (não duplicado no corpo)
[ ] Loading guard antes do JSX principal
[ ] hasLoaded.current = true ao final do loadItems() se houver auto-save
[ ] AdminEmptyState para estado vazio

TOKENIZAÇÃO
[ ] Badges de status: var(--primary) / var(--admin-field-placeholder) via style
[ ] Botão Excluir: delete-btn-* tokens via style (não classes Tailwind red-*)
[ ] Botões ação: btn-action-* tokens via style
[ ] Cards internos: var(--admin-card-bg/border/radius) via style
[ ] Labels: sem classes tipográficas (font-medium text-sm text-gray-*)
[ ] Nenhum bg-green-* bg-red-* bg-gray-* hardcoded em elementos interativos
[ ] Nenhum text-red-* text-green-* hardcoded em botões de estado
```

---

## ✅ PADRONIZAÇÃO: Campos de Label e Seletores de Cor do Painel Admin (2026-02-21)

### 1. Token Global para Labels de Campos

**Arquivo modificado:** `/src/app/components/ui/label.tsx`

O componente `Label` (shadcn/ui) foi atualizado para aplicar automaticamente o token `item-tertiary` via CSS vars, **sem necessidade de classe Tailwind**:

```tsx
// /src/app/components/ui/label.tsx — estado atual
function Label({ className, style, ...props }) {
  return (
    <LabelPrimitive.Root
      style={{
        fontSize:   'var(--admin-item-tertiary-size,   0.875rem)',
        fontWeight: 'var(--admin-item-tertiary-weight, 500)',
        color:      'var(--admin-item-tertiary-color,  inherit)',
        ...style,  // ← overrides pontuais via prop style ainda funcionam
      }}
      className={cn(
        'flex items-center gap-2 leading-none select-none ...',
        className,  // ← classes estruturais via prop className ainda funcionam
      )}
      {...props}
    />
  );
}
```

**Resultado:** Toda instância de `<Label>` no painel admin responde automaticamente ao token configurado em `/admin/system-manager`.

**Regras obrigatórias:**

✅ **SEMPRE** usar `<Label>` (shadcn/ui) para labels de campos em páginas admin  
✅ **NUNCA** adicionar classes de tipografia (`text-sm`, `font-medium`, `text-gray-*`) em `<Label>` — o token já cuida disso  
✅ **MANTER** apenas classes estruturais: `mb-*`, `block`, `cursor-pointer`, `flex`, `gap-*`  
✅ **USAR** `style={{ fontSize, fontWeight, color }}` apenas quando precisar de override pontual legítimo  
❌ **NUNCA** duplicar `text-sm font-medium` em `<Label>` — cria conflito com o token global

---

### 2. Padrão de Swatch de Cor Clicável

**Aplicado em:** `ColorTokenEditor`, `ColorSystemCard`, `TypographyTokenEditor`, `IconTokenEditor`

Todos os seletores de cor do painel seguem agora o **mesmo padrão visual e funcional**:

```tsx
{/* ✅ PADRÃO CORRETO — swatch arredondado + input invisível sobreposto */}
<div className="relative h-10 w-10 flex-shrink-0 cursor-pointer">
  {/* Camada visual: swatch arredondado */}
  <div
    className="h-10 w-10 rounded-lg border border-gray-200"
    style={{ backgroundColor: hex }}
  />
  {/* Camada funcional: input invisível sobreposto */}
  <input
    type="color"
    value={hex}
    onChange={(e) => handleChange(e.target.value)}
    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
  />
</div>

{/* ❌ PADRÃO ANTIGO — NÃO USAR */}
<div className="h-10 w-10 rounded-lg border" style={{ backgroundColor: hex }} /> {/* não clicável */}
<input type="color" className="h-10 w-10 rounded border cursor-pointer p-0.5" /> {/* quadrado visível */}
```

**Tamanhos padronizados por contexto:**

| Contexto | Tamanho | Classe |
|---|---|---|
| Card de lista (`ColorSystemCard`) | 40 × 40 px | `h-10 w-10 rounded-lg` |
| Campo inline (`ColorTokenEditor`) | 32 × 40 px | `h-8 w-10 rounded-lg` |
| Campo de tipografia (`TypographyTokenEditor`) | 32 × 40 px | `h-8 w-10 rounded-lg` |
| Preview de ícone (`IconTokenEditor`) | 40 × 40 px | `h-10 w-10 rounded-lg` |
| Campo de cor de ícone (`IconTokenEditor`) | 32 × 40 px | `h-8 w-10 rounded-lg` |

**Por que `opacity-0 absolute inset-0` funciona:**
- O `<input type="color">` nativo do browser fica invisível mas completamente clicável
- O `div` swatch arredondado é apenas visual — o clique passa para o input sobreposto
- Nenhum JavaScript customizado necessário — o browser abre o color picker nativamente

**Regras obrigatórias:**

✅ **SEMPRE** usar o padrão de swatch com input invisível sobreposto em seletores de cor  
✅ **SEMPRE** usar `rounded-lg` no swatch (nunca `rounded` ou `rounded-md`)  
✅ **SEMPRE** usar `absolute inset-0 opacity-0 cursor-pointer w-full h-full` no input invisível  
✅ **SEMPRE** usar `relative` no container pai  
❌ **NUNCA** exibir dois seletores de cor lado a lado (swatch + input visível quadrado)  
❌ **NUNCA** usar `<input type="color">` visível com `p-0.5 rounded` — padrão antigo, proibido  
❌ **NUNCA** usar `borderRadius` inline nos swatches — usar `rounded-lg` como classe Tailwind

---

### 3. Limpeza de Overrides Tipográficos em Labels

**Problema:** Labels com classes como `text-xs font-medium text-gray-700` sobrescrevem o token global e criam inconsistência visual.

**Solução aplicada:** Remoção de classes tipográficas nos elementos `<Label>`, mantendo apenas classes estruturais.

```tsx
// ❌ ANTES (sobrescreve token)
<Label className="text-sm font-medium text-gray-700 mb-1">Nome</Label>

// ✅ DEPOIS (respeita token)
<Label className="mb-1">Nome</Label>
```

**Classes estruturais permitidas em `<Label>`:**

| Classe | Tipo | Permitida |
|---|---|---|
| `mb-1`, `mb-2`, `mt-*` | Espaçamento | ✅ |
| `block` | Display | ✅ |
| `cursor-pointer` | Interação | ✅ |
| `flex`, `items-center`, `gap-*` | Layout | ✅ |
| `text-sm`, `text-xs`, `text-base` | Tipografia | ❌ |
| `font-medium`, `font-semibold` | Tipografia | ❌ |
| `text-gray-*`, `text-gray-700` | Cor | ❌ |
| `uppercase`, `tracking-wide` | Decorativa* | ✅ (exceção) |

*Exceção: classes puramente decorativas (`uppercase`, `tracking-wide`) que **não** controlam tamanho, peso ou cor base são permitidas quando fazem parte do design intencional do label.

---

### 4. Remoção de Ruído Visual em Cards de Cor

**Arquivos afetados:** `ColorTokenEditor`, `ColorSystemCard`

**Removidos:**
- `<p>` com CSS var técnica: `--admin-{token.name}` (em `ColorTokenEditor`)
- `<Badge>` com `{cssVar}` (em `ColorSystemCard`)

**Mantidos:**
- Label do token
- Input de HEX editável
- Swatch de cor clicável

**Motivo:** Informação técnica de CSS vars está disponível na aba "CSS Variables" do System Manager — duplicá-la em cada card é ruído visual sem valor para o usuário final do painel.

---

### 5. Unificação da Paleta Adicional

**Arquivo afetado:** `/src/app/admin/system-manager/page.tsx` — `SystemColorsTab`

**Antes:** Dois blocos separados — "Variáveis CSS Ativas" (mapped) e "Paleta Adicional" (unmapped, cards simples não-editáveis).

**Depois:** Grid único em "Variáveis CSS Ativas" com `[...mapped, ...unmapped]`, todos usando `ColorSystemCard` (editáveis via swatch clicável).

```tsx
// ✅ ESTADO ATUAL
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {[...mapped, ...unmapped].map((token) => (
    <ColorSystemCard key={token.id} token={token} onSave={onSave} />
  ))}
</div>

// ❌ REMOVIDO — bloco "Paleta Adicional" separado
{unmapped.length > 0 && (
  <div>...</div>  // bloco simples, não-editável
)}
```

**Cores incluídas:** Dark, Preto, Branco, Roxo Escuro — agora totalmente editáveis no mesmo padrão das demais.

---

### 6. Textos Auxiliares Redundantes — Regra de Remoção

**Regra:** Textos descritivos dentro de cards de campo (ex.: "Exibido na base do rodapé do site") são redundantes com o próprio label do campo e devem ser removidos.

**Exceções permitidas:**

- `placeholder` de inputs (`placeholder="https://..."`) — guia contextual, não ruído
- Texto em `AdminEmptyState.description` — componente específico para estado vazio
- Texto em `TabSectionHeader.subtitle` — cabeçalho de aba, não campo individual

✅ **SEMPRE** usar `placeholder` para guiar o usuário dentro de `<Input>`  
❌ **NUNCA** adicionar `<p>` descritivo abaixo de inputs individuais dentro de cards

---

## 🎨 Sistema de Tema Dinâmico do Painel Admin (2026-02-21)

### Diagnóstico de Origem

Antes desta implementação, a tipografia do painel admin era definida exclusivamente como **classes Tailwind utilitárias no JSX** de cada componente (ex.: `text-xl font-semibold text-gray-900`). Não existia nenhuma definição centralizada global para esses valores.

O arquivo `/src/styles/theme.css` continha apenas:
- Variáveis CSS globais do site público (`--primary`, `--secondary`, etc.)
- Estilos base de elementos HTML (`h1–h4`, `body`, `input`)
- Utilitários customizados (`.line-clamp-2`, `.scrollbar-thin`, `.painel-admin-title-card`)

**Conclusão:** Os níveis tipográficos citados na documentação existiam como padrão documentado — não como definição global centralizada. O objetivo desta implementação é torná-los gerenciáveis via painel.

---

### Arquitetura: AdminThemeProvider

**Arquivo:** `/src/app/components/admin/AdminThemeProvider.tsx`

O `AdminThemeProvider` é um **React Context Provider** montado na raiz do layout admin (`/src/app/admin/layout.tsx`). Ele:

1. Carrega tokens da tabela `design_tokens` (categorias `color` e `admin-ui`)
2. Converte os valores em CSS custom properties via `buildCSS()`
3. Injeta uma `<style id="admin-theme-dynamic">` no `<head>` do documento
4. Disponibiliza `adminTokens`, `colorTokens` e `refreshTheme()` via Context

```tsx
// Importação — somente em componentes admin que consomem CSS vars
import { adminVar } from '@/app/components/admin/AdminThemeProvider';
import { useAdminTheme } from '@/app/components/admin/AdminThemeProvider';

// Helper principal: retorna a CSS var correspondente
adminVar('item-title-list', 'size')    // → 'var(--admin-item-title-list-size)'
adminVar('item-title-list', 'weight')  // → 'var(--admin-item-title-list-weight)'
adminVar('item-title-list', 'color')   // → 'var(--admin-item-title-list-color)'
adminVar('card-border', '')            // → 'var(--admin-card-border)'

// Hook — para páginas que precisam ler/atualizar tokens (ex: system-manager)
const { adminTokens, colorTokens, refreshTheme, loading } = useAdminTheme();
```

**Fluxo completo:**
```
design_tokens (admin-ui + color)
  → AdminThemeProvider.refreshTheme()
    → buildCSS()
      → <style id="admin-theme-dynamic"> no <head>
        → CSS vars --admin-* e --primary/--secondary/etc disponíveis globalmente
          → componentes consomem via adminVar() ou var(--admin-*) diretamente
```

---

### Tokens admin-ui (tabela design_tokens)

Os tokens são armazenados em `design_tokens` com `category = 'admin-ui'`.

#### Formato de valor JSONB

**Token tipográfico:**
```json
{ "size": "1.25rem", "weight": 600, "color": "#111827" }
// Com mono: { "size": "0.75rem", "weight": 400, "color": "#9ca3af", "mono": true }
```

**Token de cor:**
```json
{ "hex": "#e5e7eb" }
```

#### Inventário completo de tokens admin-ui

| `name` | `label` | CSS vars geradas |
|---|---|---|
| `page-title` | Título da Página | `--admin-page-title-size/weight/color` |
| `page-description` | Descrição da Página | `--admin-page-description-size/weight/color` |
| `section-header` | Cabeçalho de Seção (Aba) | `--admin-section-header-size/weight/color` |
| `section-header-icon` | Ícone de Cabeçalho de Aba | `--admin-section-header-icon-size/color` |
| `section-subheader` | Subtítulo de Seção (Aba) | `--admin-section-subheader-size/weight/color` |
| `item-title-list` | Título de Item – Lista (Nível 1) | `--admin-item-title-list-size/weight/color` |
| `item-title-grid` | Título de Item – Grid (Nível 1) | `--admin-item-title-grid-size/weight/color` |
| `item-identifier` | Identificador do Item (Nível 2) | `--admin-item-identifier-size/weight/color` |
| `item-slug` | Slug / Path (Nível 2, Mono) | `--admin-item-slug-size/weight/color/font` |
| `item-description` | Descrição do Item (Nível 3) | `--admin-item-description-size/weight/color` |
| `item-tertiary` | Texto Terciário (Nível 4) | `--admin-item-tertiary-size/weight/color` |
| `item-token` | Token Técnico (Nível 4, Mono) | `--admin-item-token-size/weight/color/font` |
| `card-border` | Borda de Card Admin | `--admin-card-border` |
| `card-bg` | Fundo de Card Admin | `--admin-card-bg` |
| `page-bg` | Fundo da Página Admin | `--admin-page-bg` |
| `sidebar-bg` | Fundo da Sidebar | `--admin-sidebar-bg` |
| `sidebar-active` | Item Ativo da Sidebar | `--admin-sidebar-active` |
| `sidebar-separator` | Linha Divisória da Sidebar (superior + inferior) *(v1.12)* | `--admin-sidebar-separator` |
| `editor-preview-bg` | BG da Área de Preview (Editor de Token) | `--admin-editor-preview-bg` |
| `editor-preview-border` | Borda da Área de Preview (Editor de Token) | `--admin-editor-preview-border` |
| `icon-action` | Ícone de Ação Secundária (ChevronUp/Down, X) | `--admin-icon-action` |
| `btn-reorder-hover` | Hover BG do Botão de Reposicionamento | `--admin-btn-reorder-hover` |
| `delete-btn-text` | Texto/Ícone do Botão Excluir (normal) | `--admin-delete-btn-text` |
| `delete-btn-hover-bg` | Hover BG do Botão Excluir | `--admin-delete-btn-hover-bg` |
| `delete-btn-hover-text` | Hover Texto/Ícone do Botão Excluir | `--admin-delete-btn-hover-text` |
| `delete-btn-hover-border` | Hover Borda do Botão Excluir | `--admin-delete-btn-hover-border` |
| `upload-empty-bg` | BG do Estado Vazio do Upload de Imagem | `--admin-upload-empty-bg` |
| `upload-x-bg` | BG do Botão Remover Imagem (×) | `--admin-upload-x-bg` |
| `upload-x-icon` | Ícone do Botão Remover Imagem (×) | `--admin-upload-x-icon` |
| `tab-label` | Label das Abas — fonte, peso e cor inativa *(v1.10)* | `--admin-tab-label-size/weight/color` |
| `tab-list-bg` | BG do Contêiner das Abas (TabsList) *(v1.10)* | `--admin-tab-list-bg` |
| `tab-active-bg` | BG da Aba Ativa (TabsTrigger active) *(v1.10)* | `--admin-tab-active-bg` |
| `tab-active-text` | Cor do Texto da Aba Ativa *(v1.10)* | `--admin-tab-active-text` |
| `tab-border` | Borda da Aba Ativa *(v1.10)* | `--admin-tab-border` |
| `field-bg` | BG dos Campos de Formulário (Input/Select) *(v1.10)* | `--admin-field-bg` |
| `field-text` | Texto dos Campos de Formulário *(v1.10)* | `--admin-field-text` |
| `field-placeholder` | Placeholder dos Campos e Ícone de Busca *(v1.10)* | `--admin-field-placeholder` |
| `field-border` | Borda dos Campos de Formulário *(v1.10)* | `--admin-field-border` |
| `btn-action-bg` | BG Normal — Botão Editar / Duplicar *(v1.10)* | `--admin-btn-action-bg` |
| `btn-action-text` | Texto e Ícone Normal — Botão Editar / Duplicar *(v1.10)* | `--admin-btn-action-text` |
| `btn-action-border` | Borda Normal — Botão Editar / Duplicar *(v1.10)* | `--admin-btn-action-border` |
| `btn-action-hover-bg` | Hover BG — Botão Editar / Duplicar *(v1.10)* | `--admin-btn-action-hover-bg` |
| `btn-action-hover-text` | Hover Texto — Botão Editar / Duplicar *(v1.10)* | `--admin-btn-action-hover-text` |
| `modal-title` | Título do Modal — tipografia *(v1.11)* | `--admin-modal-title-size/weight/color` |
| `modal-footer-bg` | BG do Rodapé do Modal *(v1.11)* | `--admin-modal-footer-bg` |
| `modal-footer-border` | Borda Superior do Rodapé do Modal *(v1.11)* | `--admin-modal-footer-border` |
| `collapsible-bg` | BG da Seção Colapsável *(v1.11)* | `--admin-collapsible-bg` |
| `collapsible-border` | Borda da Seção Colapsável *(v1.11)* | `--admin-collapsible-border` |
| `collapsible-hover-bg` | Hover BG do Trigger Colapsável *(v1.11)* | `--admin-collapsible-hover-bg` |
| `collapsible-label` | Label do Trigger Colapsável — tipografia *(v1.11)* | `--admin-collapsible-label-size/weight/color` |
| `list-item-bg` | BG Normal do Item de Lista *(v1.11)* | `--admin-list-item-bg` |
| `list-item-border` | Borda Normal do Item de Lista *(v1.11)* | `--admin-list-item-border` |
| `list-item-hover-border` | Borda Hover do Item de Lista *(v1.11)* | `--admin-list-item-hover-border` |
| `list-item-title` | Título do Item de Lista — tipografia *(v1.11)* | `--admin-list-item-title-size/weight/color` |
| `list-item-meta` | Metadado do Item de Lista — tipografia *(v1.11)* | `--admin-list-item-meta-size/weight/color` |
| `list-item-selected-border` | Borda do Item Selecionado *(v1.11)* | `--admin-list-item-selected-border` |
| `list-item-selected-bg` | BG do Item Selecionado *(v1.11)* | `--admin-list-item-selected-bg` |
| `sub-nav-back-text` | Cor do Botão Voltar na Sub-view *(v1.11)* | `--admin-sub-nav-back-text` |
| `sub-nav-back-hover` | Cor Hover do Botão Voltar *(v1.11)* | `--admin-sub-nav-back-hover` |
| `sub-nav-separator` | Separador `\|` na Sub-view *(v1.11)* | `--admin-sub-nav-separator` |
| `sub-nav-title` | Título da Sub-view — tipografia *(v1.11)* | `--admin-sub-nav-title-size/weight/color` |
| `sub-label` | Sub-label de Grupo — tipografia *(v1.11)* | `--admin-sub-label-size/weight/color` |
| `btn-cancel-bg` | BG Normal — Botão Cancelar *(v1.11)* | `--admin-btn-cancel-bg` |
| `btn-cancel-border` | Borda Normal — Botão Cancelar *(v1.11)* | `--admin-btn-cancel-border` |
| `btn-cancel-text` | Texto — Botão Cancelar *(v1.11)* | `--admin-btn-cancel-text` |
| `btn-primary-bg` | BG Normal — Botão CTA Primário *(v1.13)* | `--admin-btn-primary-bg` |
| `btn-primary-text` | Texto/Ícone — Botão CTA Primário *(v1.13)* | `--admin-btn-primary-text` |
| `btn-primary-hover-bg` | Hover BG — Botão CTA Primário *(v1.13)* | `--admin-btn-primary-hover-bg` |
| `dropdown-bg` | Fundo do Menu Suspenso (Dropdown) *(v1.14)* | `--admin-dropdown-bg` |
| `dropdown-border` | Borda do Menu Suspenso *(v1.14)* | `--admin-dropdown-border` |
| `dropdown-item-text` | Texto dos Itens do Dropdown *(v1.14)* | `--admin-dropdown-item-text-size/weight/color` |
| `dropdown-item-icon` | Ícone dos Itens do Dropdown (não destrutivos) *(v1.14)* | `--admin-dropdown-item-icon-size/color` |
| `dropdown-item-hover-bg` | Hover BG dos Itens do Dropdown *(v1.14)* | `--admin-dropdown-item-hover-bg` |
| `dropdown-trigger-hover-bg` | Hover BG do Botão Acionador (3 Pontinhos) *(v1.14)* | `--admin-dropdown-trigger-hover-bg` |
| `modal-description` | Descrição/Subtítulo do Modal *(v1.14)* | `--admin-modal-description-size/weight/color` |
| `card-radius` | Arredondamento de Cards Admin *(v1.8)* | `--admin-card-radius` |
| `nav-item` | Item de Navegação da Sidebar *(v1.8)* | `--admin-nav-item-size/weight/color` |
| `badge-label` | Label de Badge / Status *(v1.8)* | `--admin-badge-label-size/weight/color` |
| `accordion-header` | Cabeçalho de Accordion *(v1.8)* | `--admin-accordion-header-size/weight/color` |
| `field-button` | Botão de Campo (picker interno) *(v1.8)* | `--admin-field-button-size/weight/color` |
| `field-hint` | Texto de Dica de Campo *(v1.8)* | `--admin-field-hint-size/weight/color` |
| `sidebar-title` | Título da Sidebar ("Ajustes") *(v1.9)* | `--admin-sidebar-title-size/weight/color` |
| `sidebar-active-text` | Texto/Ícone do Item Ativo na Sidebar *(v1.9)* | `--admin-sidebar-active-text` |
| `sidebar-hover` | Hover BG dos Itens de Navegação da Sidebar *(v1.9)* | `--admin-sidebar-hover` |
| `grid-preview-content` | Texto/Ícone no Preview do AdminGridCard *(v1.9)* | `--admin-grid-preview-content-size/weight/color` |
| `action-menu-icon` | Ícone do Botão de Menu de Ações (MoreVertical) *(v1.9)* | `--admin-action-menu-icon` |

> **Total documentado:** 79 tokens `admin-ui` via migrations V1.6–V1.13 | **Confirmado via SQL: 93** (diferença de 14 tokens provenientes de sessões anteriores não documentadas)

#### Hierarquia tipográfica: 4 níveis de item

| Nível | Token | Uso típico |
|---|---|---|
| **Nível 1 (Lista)** | `item-title-list` | Nome principal em `AdminListItem` |
| **Nível 1 (Grid)** | `item-title-grid` | Nome em `AdminGridCard` |
| **Nível 2** | `item-identifier` / `item-slug` | Categoria, tipo, path |
| **Nível 3** | `item-description` | Descrição detalhada |
| **Nível 4** | `item-tertiary` / `item-token` | IDs, UUIDs, metadados técnicos |

---

### Página /admin/system-manager

**Arquivo:** `/src/app/admin/system-manager/page.tsx`

Interface de gestão com **4 abas**:

| Aba | Conteúdo |
|---|---|
| **Painel Admin** | Edição de todos os 53 tokens `admin-ui` organizados em grupos, com preview inline e auto-save (800ms) |
| **Cores do Sistema** | Tokens de cor com mapeamento para CSS vars Tailwind (`--primary`, `--secondary`, etc.) — grid unificado `[...mapped, ...unmapped]` |
| **CSS Variables** | Referência completa de todas as vars geradas — tabela + bloco de código (inclui tokens tipo `value`) |
| **Preview** | Visualização ao vivo de todos os elementos tipográficos com os tokens atuais |

#### Grupos da aba "Painel Admin" (estado v1.10.2)

| # | Grupo | Tokens |
|---|---|---|
| 1 | Tipografia Geral da Página | `page-title`, `page-description` |
| 2 | Cabeçalhos de Aba | `section-header`, `section-header-icon`, `section-subheader` |
| 3 | Hierarquia de Itens — Listas | `item-title-list`, `item-identifier`, `item-slug`, `item-description`, `item-tertiary`, `item-token` |
| 4 | Hierarquia de Itens — Grid | `item-title-grid` |
| 5 | Estrutura de Cards | `card-border`, `card-bg`, `card-radius` |
| 6 | Fundos de Página e Editor | `page-bg`, `editor-preview-bg`, `editor-preview-border` |
| 7 | Sidebar — Identidade Visual | `sidebar-title`, `sidebar-active-text`, `sidebar-hover` |
| 8 | Sidebar — Estrutura | `sidebar-bg`, `sidebar-active` |
| 9 | Navegação Sidebar | `nav-item` |
| 10 | Componentes de Interface | `badge-label`, `field-button`, `field-hint`, `grid-preview-content`, `action-menu-icon` |
| 11 | Modais e Accordions | `accordion-header` |
| 12 | Ícones e Reposicionamento | `icon-action`, `btn-reorder-hover` |
| 13 | Botão Excluir | `delete-btn-text`, `delete-btn-hover-bg`, `delete-btn-hover-text`, `delete-btn-hover-border` |
| 14 | Upload de Imagem | `upload-empty-bg`, `upload-x-bg`, `upload-x-icon` |
| 15 | Abas de Navegação *(v1.10)* | `tab-label`, `tab-list-bg`, `tab-active-bg`, `tab-active-text`, `tab-border` |
| 16 | Campos de Formulário *(v1.10)* | `field-bg`, `field-text`, `field-placeholder`, `field-border` |
| 17 | Botões Editar / Duplicar *(v1.10)* | `btn-action-bg`, `btn-action-text`, `btn-action-border`, `btn-action-hover-bg`, `btn-action-hover-text` |
| 18 | Modal — Estrutura *(v1.11)* | `modal-title`, `modal-footer-bg`, `modal-footer-border` |
| 19 | Seções Colapsáveis *(v1.11)* | `collapsible-bg`, `collapsible-border`, `collapsible-hover-bg`, `collapsible-label` |
| 20 | Itens de Lista em Modais *(v1.11)* | `list-item-bg`, `list-item-border`, `list-item-hover-border`, `list-item-title`, `list-item-meta`, `list-item-selected-border`, `list-item-selected-bg` |
| 21 | Sub-navegação de Card *(v1.11)* | `sub-nav-back-text`, `sub-nav-back-hover`, `sub-nav-separator`, `sub-nav-title` |
| 22 | Sub-labels de Grupo *(v1.11)* | `sub-label` |
| 23 | Botão Cancelar *(v1.11)* | `btn-cancel-bg`, `btn-cancel-border`, `btn-cancel-text` |

#### ValueTokenEditor — tipo `value` (v1.9+)

O `AdminThemeProvider.buildCSS()` suporta um 4º tipo de token além de cor, tipografia e ícone:

```json
{ "value": "rgba(255,255,255,0.08)" }
{ "value": "0.75rem" }
```

**CSS var gerada:** `--admin-{name}: {value}`

**Casos de uso:**
- `sidebar-hover` → `{"value":"rgba(255,255,255,0.08)"}` (hover translúcido)
- `card-radius` → `{"value":"0.75rem"}` (border-radius de card)

**Detecção automática no `system-manager`:**

```typescript
// Lógica de detecção de tipo de token
if ('hex' in val)                    → ColorTokenEditor
if ('size' in val && 'color' in val && !('weight' in val)) → IconTokenEditor  
if ('size' in val && 'weight' in val) → TypographyTokenEditor
if ('value' in val)                  → ValueTokenEditor
```

#### Aba "Cores do Sistema" — Grid Unificado

Antes: dois blocos separados — "Variáveis CSS Ativas" (mapeadas) + "Paleta Adicional" (não mapeadas, não editáveis).

Após v1.7: um único grid `[...mapped, ...unmapped]` onde **todas as cores** usam `ColorSystemCard` e são editáveis. A seção "Paleta Adicional" foi removida completamente (mas a variável `unmapped` permanece para alimentar o grid unificado).

#### Aba "CSS Variables" — Tokens `value` incluídos

A `CSSVariablesTab` foi atualizada para listar também tokens do tipo `{"value":"..."}`, garantindo que `card-radius`, `sidebar-hover` e similares apareçam na referência técnica da aba.

---

### Componentes atualizados para consumir CSS vars

#### AdminGridCard.tsx — `h4` do nome

```tsx
// ❌ ANTES
<h4 className="font-medium text-gray-900 truncate">{name}</h4>

// ✅ DEPOIS
<h4
  className="truncate"
  style={{
    fontSize:   adminVar('item-title-grid', 'size'),
    fontWeight: adminVar('item-title-grid', 'weight'),
    color:      adminVar('item-title-grid', 'color'),
  }}
>
  {name}
</h4>
```

#### AdminEmptyState.tsx — reescrito

Nova interface (mantém `message` para compatibilidade):

```tsx
// Modo novo (recomendado)
<AdminEmptyState
  title="Nenhuma página criada"
  description="Clique em 'Nova Página' para começar."
  cta={{ label: 'Nova Página', onClick: handleCreate }}
/>

// cta como ReactNode arbitrário
<AdminEmptyState
  title="Tokens não encontrados"
  description="Execute o SQL de migration."
  cta={<div className="font-mono text-xs">...</div>}
/>

// Modo legado (ainda funciona)
<AdminEmptyState
  message="Nenhuma seção criada ainda"
  cta={{ label: 'Criar', onClick: handleCreate }}
/>
```

Tipografia tokenizada:
- `title` → `item-title-grid` (Nível 1 Grid)
- `description` → `item-description` (Nível 3)

#### layout.tsx — sidebar "Ajustes"

```tsx
// ❌ ANTES
<h1 className="text-2xl font-bold">Ajustes</h1>
<p className="text-sm text-gray-400 mt-1">{user?.email}</p>

// ✅ DEPOIS — tamanho e peso via token, cor fixa branca (fundo escuro)
<h1 style={{
  fontSize:   'var(--admin-page-title-size,   1.5rem)',
  fontWeight: 'var(--admin-page-title-weight, 700)',
  color:      '#ffffff',
}}>Ajustes</h1>
<p style={{
  fontSize: 'var(--admin-page-description-size, 0.875rem)',
  color:    'rgba(255,255,255,0.5)',
}}>
  {user?.email}
</p>
```

> **Nota:** As CSS vars de cor (`--admin-page-title-color`) têm valor `#111827` (escuro), adequado ao fundo branco das páginas. Na sidebar de fundo escuro, a cor é sobreposta por `#ffffff` / `rgba(255,255,255,0.5)` inline — apenas tamanho e peso são herdados dos tokens.

---

### Mapeamento de cores para CSS vars do Tailwind

O `AdminThemeProvider` também atualiza as CSS vars do sistema público (`--primary`, `--secondary`, etc.) ao carregar, usando o `COLOR_CSS_VAR_MAP`:

```typescript
export const COLOR_CSS_VAR_MAP: Record<string, string> = {
  primary:            '--primary',
  secondary:          '--secondary',
  background:         '--background',
  muted:              '--muted',
  accent:             '--accent',
  foreground:         '--foreground',
  card:               '--card',
  border:             '--border',
  destructive:        '--destructive',
  'input-background': '--input-background',
  'muted-foreground': '--muted-foreground',
};
```

---

### Regras Obrigatórias

✅ **SEMPRE** importar `adminVar` de `AdminThemeProvider` ao usar CSS vars `--admin-*` em componentes  
✅ **SEMPRE** usar `adminVar('token-name', 'prop')` em `style={{}}` — nunca hardcoded  
✅ **SEMPRE** fornecer fallback inline quando o CSS var puder não estar disponível: `var(--admin-page-title-size, 1.5rem)`  
✅ **SEMPRE** manter `color: '#ffffff'` ou `rgba(255,255,255,*)` na sidebar (fundo escuro)  
✅ **SEMPRE** chamar `refreshTheme()` após salvar um token no banco  
✅ **SEMPRE** usar `cta={{ label, onClick }}` para botões simples, `cta={<ReactNode>}` para conteúdo customizado  
✅ **SEMPRE** usar `{"value":"..."}` para tokens de valor único (radius, rgba, etc.) — o `buildCSS()` suporta esse tipo  
✅ **SEMPRE** validar tipo com `'value' in val` antes de renderizar `ValueTokenEditor`  
✅ **SEMPRE** usar `adminVar('modal-title', 'size')` para o título de qualquer modal baseado em `BaseModal`  
✅ **SEMPRE** usar `var(--admin-collapsible-bg/border/hover-bg)` em seções colapsáveis com `onMouseEnter`/`onMouseLeave` (não classes Tailwind hover)  
✅ **SEMPRE** usar `var(--admin-list-item-bg/border/hover-border)` + handlers de mouse em itens de lista inline  
✅ **SEMPRE** usar `var(--admin-btn-cancel-bg/border/text)` em botões Cancelar — nunca `variant="outline"` hardcoded  
✅ **SEMPRE** aplicar tokens `field-*` via `style={{}}` em `<select>` nativos (classes Tailwind não suportam CSS vars)  
❌ **NUNCA** usar classes Tailwind hardcoded para tipografia em novos componentes admin  
❌ **NUNCA** usar `bg-gray-50`, `border-gray-200`, `hover:bg-gray-100`, `text-gray-700` em modais — usar tokens `collapsible-*`  
❌ **NUNCA** usar `bg-white hover:border-gray-300 border-gray-200` em itens de lista — usar tokens `list-item-*`  
❌ **NUNCA** instanciar `AdminThemeProvider` diretamente em features — ele já está no layout  
❌ **NUNCA** adicionar nova categoria ao `design_tokens` sem atualizar o CHECK constraint via migration SQL  
❌ **NUNCA** usar `COLOR_CSS_VAR_MAP` em componentes de feature — ele é interno ao `AdminThemeProvider`  
❌ **NUNCA** deixar token com valor `#ffdd00` em produção — é marcador de validação, não valor final

---

## 🏗️ Estado Consolidado de Migrations de Tokens (v1.6–v1.10.2)

### Histórico de Rodadas

| Rodada | Data | Tokens adicionados | Categoria | Notas |
|---|---|---|---|---|
| **v1.6** | 2026-02-20 | `page-title`, `page-description`, `section-header`, `section-header-icon`, `section-subheader`, `item-*` (7), `card-border`, `card-bg`, `page-bg`, `sidebar-bg`, `sidebar-active` | `admin-ui` | Base do AdminThemeProvider |
| **v1.7** | 2026-02-21 | `editor-preview-bg`, `editor-preview-border`, `icon-action`, `btn-reorder-hover`, `delete-btn-*` (4), `upload-*` (3) | `admin-ui` | Upload, delete e editor |
| **v1.8** | 2026-02-21 | `card-radius`, `nav-item`, `badge-label`, `accordion-header`, `field-button`, `field-hint` | `admin-ui` | Componentes de interface |
| **v1.9** | 2026-02-21 | `sidebar-title`, `sidebar-active-text`, `sidebar-hover`, `grid-preview-content`, `action-menu-icon` + `popover`, `popover-foreground`, `primary-foreground`, `accent-foreground` | `admin-ui` + `color` | Sidebar identity + foregrounds |
| **v1.10** | 2026-02-21 | `tab-*` (5), `field-*` (4), `btn-action-*` (5) | `admin-ui` | Abas, campos, botões ação |
| **v1.10.1** | 2026-02-21 | Upsert de 11 tokens auxiliares + `switch-background` | `admin-ui` + `color` | Normalização v2.0 |
| **v1.10.2** | 2026-02-21 | Atualização de 9 tokens com `#ffdd00` → valores de produção | `admin-ui` + `color` | Finalização completa |
| **v1.11** | 2026-02-21 | 22 novos tokens: `modal-*`, `collapsible-*`, `list-item-*`, `sub-nav-*`, `sub-label`, `btn-cancel-*` | `admin-ui` | Tokenização completa dos modais |
| **v1.12** | 2026-02-21 | 1 novo token: `sidebar-separator` (linhas divisórias da sidebar) | `admin-ui` | `layout.tsx` zero hardcodes |
| **v1.13** | 2026-02-21 | 3 novos tokens: `btn-primary-bg`, `btn-primary-text`, `btn-primary-hover-bg` | `admin-ui` | `AdminPrimaryButton.tsx` criado; 14 ocorrências de `bg-primary hover:bg-primary/90` removidas em 11 arquivos |
| **v1.14** | 2026-02-21 | 7 novos tokens: `dropdown-bg`, `dropdown-border`, `dropdown-item-text`, `dropdown-item-icon`, `dropdown-item-hover-bg`, `dropdown-trigger-hover-bg`, `modal-description` | `admin-ui` | `AdminDropdownMenu.tsx` criado; `dialog.tsx` tokenizado (DialogDescription + botão X); `BaseModal.tsx` usa `AdminPrimaryButton`; select em `cards-manager/page.tsx` usa `field-*` |

### Estado Final (2026-02-21, v1.13 + footer-manager)

```
✅ 100 tokens admin-ui esperados após execução do BLOCO 8 em EXECUTE_SQL.sql (93 confirmados + 7 de v1.14)
✅ 150 design_tokens total esperados (143 confirmados + 7 de v1.14)
✅ Tokens color: popover, popover-foreground, primary-foreground, accent-foreground, switch-background
✅ 0 tokens com valor #ffdd00 no banco
✅ BaseModal.tsx — título e footer 100% tokenizados (modal-title, modal-footer-bg/border, btn-cancel-*)
✅ TemplateEditorModal.tsx — tab bar, collapsibles, list-items, sub-nav, selects, sub-labels 100% tokenizados
✅ UnifiedSectionConfigModal.tsx — tab bar 100% tokenizada via tokens tab-*
✅ layout.tsx — 2 <Separator> tokenizados via sidebar-separator (rgba(255,255,255,0.12))
✅ AdminPrimaryButton.tsx — componente criado; btn-primary-bg/text/hover-bg aplicados em 14 pontos (11 arquivos)
✅ footer-manager/page.tsx — 100% tokenizado (imports React/hooks/AdminPrimaryButton corrigidos;
   card-bg/border/radius, btn-action-*, AdminPrimaryButton, delete-btn-*, icon-action,
   btn-reorder-hover, item-tertiary — zero hardcodes restantes)
✅ pages-manager/DraggableSectionItem.tsx — botão Excluir tokenizado (delete-btn-*);
   useRef adicionado; hexToRgba duplicado removido
✅ sections-manager/page.tsx — AdminPrimaryButton importado (ausência causava ReferenceError);
   badge Publicado/Rascunho tokenizada: bg var(--primary) / var(--admin-field-placeholder)
✅ CSS vars re-injetadas via AdminThemeProvider (requer Ctrl+Shift+R após execução de SQL)
```

### Regras para Novas Migrations de Tokens

✅ **SEMPRE** criar migration em `/migrations/YYYY-MM-DD_vX.X_descricao.sql`  
✅ **SEMPRE** usar `#ffdd00` como valor de validação visual ao inserir novos tokens  
✅ **SEMPRE** executar a migration de finalização (substituindo `#ffdd00` por valores de produção) na mesma sessão  
✅ **SEMPRE** validar com `SELECT ... WHERE value::text LIKE '%ffdd00%'` → deve retornar 0 linhas  
✅ **SEMPRE** chamar `Ctrl+Shift+R` no navegador após executar o SQL  
❌ **NUNCA** publicar com tokens `#ffdd00` ativos (amarelo canário indica token incompleto)

---

## 🎯 Padrões para Novos Desenvolvimentos no Painel Admin

### Regras de Ouro

**Tipografia e Labels:**
- ✅ **NUNCA** hardcodar tipografia em labels, títulos e descrições de UI admin quando houver token correspondente
- ✅ **PREFERIR** token global em primitivas (`Label`, botões compartilhados, cards compartilhados) em vez de aplicar por página
- ✅ **USAR** `adminVar('token-name', 'prop')` em `style={{}}` — nunca classes Tailwind para tipografia

**Seletores de Cor:**
- ✅ Para qualquer seletor de cor no admin: **swatch arredondado visível** + `<input type="color">` invisível sobreposto
- ✅ Estrutura canônica: `<div className="relative h-10 w-10">` → div swatch → input `absolute inset-0 opacity-0`
- ❌ **NUNCA** exibir `<input type="color">` visível (quadrado nativo do browser)
- ❌ **NUNCA** ter dois elementos de seleção de cor lado a lado

**Novos Tokens:**
- ✅ Novos estilos recorrentes devem virar `design_tokens` antes de proliferar em vários arquivos
- ✅ Usar `#ffdd00` como valor de validação ao inserir, depois substituir com migration de finalização
- ✅ Adicionar novo token ao inventário em `Guidelines.md` na mesma sessão

**Ruído Visual:**
- ✅ **REMOVER** textos técnicos (CSS vars, UUIDs) da UI operacional
- ✅ **MANTER** detalhes técnicos na aba "CSS Variables" do system-manager
- ✅ **USAR** `placeholder` de inputs como guia contextual (não `<p>` auxiliares abaixo de campos)

### Tipos de Token Suportados no `design_tokens`

| Tipo | Estrutura JSON | CSS vars geradas | Usado em |
|---|---|---|---|
| **Cor** | `{"hex":"#xxxxxx"}` | `--admin-{name}: #xxx` | Fundos, bordas, ícones monocromáticos |
| **Tipografia** | `{"size":"1rem","weight":600,"color":"#xxx"}` | `--admin-{name}-size/weight/color` | Títulos, labels, textos |
| **Ícone** | `{"size":"1.25rem","color":"#xxx"}` | `--admin-{name}-size/color` | Ícones com tamanho + cor (sem weight) |
| **Valor simples** | `{"value":"rgba(...)"}` ou `{"value":"0.75rem"}` | `--admin-{name}: {value}` | Border-radius, hovers rgba, valores únicos |

### Detecção Automática de Tipo no system-manager

```typescript
// Ordem de prioridade na detecção:
const isColor      = 'hex' in val;
const isIcon       = 'size' in val && 'color' in val && !('weight' in val);
const isTypography = 'size' in val && 'weight' in val;
const isValue      = 'value' in val;
```

### Classes Permitidas vs. Proibidas em `<Label>`

| Classe | Tipo | Permitida |
|---|---|---|
| `mb-*`, `mt-*`, `pt-*` | Espaçamento | ✅ |
| `block` | Display | ✅ |
| `cursor-pointer` | Interação | ✅ |
| `flex`, `items-center`, `gap-*` | Layout | ✅ |
| `uppercase`, `tracking-wide` | Decorativa | ✅ (exceção) |
| `text-sm`, `text-xs`, `text-base` | **Tipografia** | ❌ |
| `font-medium`, `font-semibold` | **Tipografia** | ❌ |
| `text-gray-*` | **Cor** | ❌ |

> O componente `Label` (shadcn/ui) aplica automaticamente `item-tertiary` via CSS vars — classes tipográficas em `<Label>` criam conflito com o token global.

### Padrão Visual de Cards Internos (revisão)

- **Card container:** `bg-white border-2 border-gray-200 rounded-2xl p-6 space-y-4`
- **Título do card:** `<h3 className="text-lg font-semibold text-gray-900">` — **sem ícone, sem subtítulo**
- **Campos:** `<Label>` tokenizado + `<Input>` com `placeholder` descritivo
- **Ação primária:** sempre no `headerActions` do `AdminPageLayout`, nunca duplicado dentro da aba

---

## 🗺️ Rotas do Painel Admin

### Principais Páginas do CMS

| Rota | Descrição | Atalho |
|------|-----------|--------|
| `/admin/pages-manager` | **Editor de Páginas** - Gerenciar páginas e suas seções | 📄 |
| `/admin/sections-manager` | **Biblioteca de Seções** - Criar/editar templates de seções reutilizáveis | 📦 |
| `/admin/cards-manager` | **Templates de Cards** - Gerenciar templates e cards individuais | 🎴 |
| `/admin/menu-manager` | **Editor de Menu** - Configurar header, megamenus e itens de navegação | 🍔 |
| `/admin/footer-manager` | **Editor de Rodapé** - Configurar footer do site | 👣 |
| `/admin/design-system` | **Design System Manager** - Gerenciar tokens (cores, tipografia, espaçamento) | 🎨 |
| `/admin/system-manager` | **System Manager** - Gerenciar CSS vars e tokens de interface do painel admin | ⚙️ |

### ⚠️ Nomenclatura Importante

**CORRETO:**
- ✅ `/admin/pages-manager` (Editor de Páginas)
- ✅ `/admin/sections-manager` (Biblioteca de Seções)
- ✅ `/admin/cards-manager` (Templates de Cards)

**INCORRETO:**
- ❌ `/admin/pages-editor` (NÃO EXISTE)
- ❌ `/admin/sections-editor` (NÃO EXISTE)
- ❌ `/admin/cards-editor` (NÃO EXISTE)

**Regra:** Todas as páginas principais seguem o padrão `*-manager`, não `*-editor`.

---

## 🎨 Cores Oficiais

### Site Público (Gerenciado em /admin/design-system)

| Nome | Hex | Uso | Exemplo |
|------|-----|-----|---------|
| **Primary** | `#ea526e` | Ações principais, CTAs, links | Botões "Saiba Mais", hovers |
| **Secondary** | `#2e2240` | Elementos secundários, backgrounds alternativos | Fundo de cards, rodapés |
| **Background** | `#f6f6f6` | Fundo de seções, containers | Seções com conteúdo |
| **Accent** | `#ed9331` | Destaques, badges, notificações | Novidades, promoções |
| **Muted** | `#e7e8e8` | Bordas, texto secundário | Legendas, separadores |
| **Dark** | `#020105` | Texto principal, headers | Títulos, parágrafos |

### Como Usar em Componentes

**Site Público** (React Context):
```tsx
import { useDesignSystem } from '@/lib/contexts/DesignSystemContext';

function MyComponent() {
  const { getColor } = useDesignSystem();
  const primaryColor = getColor('primary'); // #ea526e
  
  return <div style={{ color: primaryColor }}>Texto em rosa</div>;
}
```

**Painel Admin** (Tailwind Classes):
```tsx
function AdminComponent() {
  return <div className="bg-primary text-primary-foreground">Admin Panel</div>;
}
```

---

## 📝 Tipografia

### Fonte Principal

- **Família**: `Poppins`
- **Fonte**: Google Fonts
- **Pesos disponíveis**: 300, 400, 500, 600, 700
- **Fallback**: `sans-serif`

### Escalas Tipográficas

| Nome | Tamanho | Peso | Uso |
|------|---------|------|-----|
| **heading-1** | 3rem (48px) | 700 | Títulos de página, hero sections |
| **heading-2** | 2.5rem (40px) | 700 | Subtítulos principais |
| **heading-3** | 2rem (32px) | 600 | Títulos de seção |
| **heading-4** | 1.5rem (24px) | 600 | Títulos de cards |
| **heading-5** | 1.25rem (20px) | 600 | Subtítulos de cards |
| **heading-6** | 1rem (16px) | 600 | Cabeçalhos pequenos |
| **body-large** | 1.125rem (18px) | 400 | Destaque em parágrafos |
| **body-base** | 1rem (16px) | 400 | Texto padrão |
| **body-small** | 0.875rem (14px) | 400 | Legendas, notas de rodapé |

### Como Usar

```tsx
const { getTypography } = useDesignSystem();
const h1Style = getTypography('heading-1');

return <h1 style={h1Style}>Título Principal</h1>;
```

### Regras Tipográficas

- ✅ **Sempre** usar Poppins (já configurada globalmente)
- ✅ **Títulos**: heading-1 a heading-6
- ✅ **Corpo de texto**: body-large, body-base, body-small
- ❌ **Nunca** usar outras fontes sem aprovação
- ❌ **Nunca** hardcoded font-size (`fontSize: '24px'`)

---

## 📏 Espaçamento

### Tokens de Spacing

| Nome | Valor | Uso |
|------|-------|-----|
| **xs** | 0.5rem (8px) | Padding interno de botões, gaps pequenos |
| **sm** | 1rem (16px) | Espaçamento entre elementos próximos |
| **md** | 1.5rem (24px) | Padding de cards, margens padrão |
| **lg** | 2rem (32px) | Separação entre seções |
| **xl** | 3rem (48px) | Espaçamento grande entre blocos |
| **2xl** | 4rem (64px) | Separação máxima, hero sections |

### Como Usar

```tsx
const { getSpacing } = useDesignSystem();
const mediumSpacing = getSpacing('md'); // 1.5rem

return <div style={{ padding: mediumSpacing }}>Conteúdo</div>;
```

---

## ⭕ Border Radius

### Tokens de Radius

| Nome | Valor | Uso |
|------|-------|-----|
| **sm** | 0.375rem (6px) | Badges, tags pequenas |
| **md** | 0.5rem (8px) | Botões, inputs |
| **lg** | 0.75rem (12px) | Cards pequenos |
| **xl** | 1rem (16px) | Cards médios |
| **2xl** | 1.5rem (24px) | **PADRÃO** - Modais, cards principais |

### Regra de Ouro

- ✅ **Sempre usar `2xl` (1.5rem)** para modais, cards principais e containers grandes
- ✅ Componentes shadcn/ui seguem automaticamente
- ❌ Evitar border-radius personalizado

---

## ⚡ Transições

### Tokens de Transition

| Nome | Duração | Uso |
|------|---------|-----|
| **fast** | 150ms | Hovers de botões, pequenas animações |
| **normal** | 300ms | Animações padrão, transições de estado |
| **slow** | 500ms | Animações complexas, modais |

### Easing Padrão

- `ease-in-out` - Para a maioria das transições

### Como Usar

```tsx
const { getTransition } = useDesignSystem();
const normalTransition = getTransition('normal'); // 300ms

return <button style={{ transition: `all ${normalTransition} ease-in-out` }}>Hover me</button>;
```

### ⚠️ Regra Crítica: Sincronização de Estado em Componentes (2026-02-14)

**PROBLEMA:** Botões de grid (1/2 Colunas, 1/2 Linhas) no `SectionBuilder` não selecionavam visualmente após clicar.

**CAUSA:** Componente tinha estado local `layout` mas não sincronizava quando prop `initialLayout` mudava.

**SOLUÇÃO:**
```tsx
// ✅ useEffect para sincronizar estado local com prop
useEffect(() => {
  const newMigratedLayout = migrateLayoutToGrid(initialLayout);
  setLayout(newMigratedLayout);
}, [initialLayout]);
```

**Regras:**
- ✅ **SEMPRE** usar `useEffect` para sincronizar estado local com props mutáveis
- ✅ **SEMPRE** logar mudanças para debug
- ❌ **NUNCA** assumir que componente re-renderiza quando prop pai muda

**Arquivo:** `/src/app/admin/sections-manager/SectionBuilder.tsx` (linha 547)

---

### ⚠️ Regras Críticas de Transições CSS (2026-02-14)

**PROBLEMA IDENTIFICADO:** Erros de parsing de cores em formato `rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1)...` e `oklab(0.145 ...)` causados por transições CSS tentando interpolar propriedades incompatíveis como `box-shadow`.

#### Solução Padrão Implementada

**Para botões e elementos interativos:**

```tsx
// ❌ ERRADO - Causa erro de parsing
<button className="transition-all hover:shadow-lg">

// ❌ ERRADO - Causa erro de parsing
<button className="transition-colors hover:border-primary">

// ✅ CORRETO - Sem transições + inline styles
<button 
  className="hover:bg-primary/90"
  style={{
    transition: 'none',
    animation: 'none',
    boxShadow: 'none',
    borderColor: isSelected ? '#ea526e' : '#e5e7eb',
    backgroundColor: isSelected ? '#fef2f2' : 'transparent',
  }}
>
```

**Para containers com scroll:**

```tsx
// ❌ ERRADO - Componente ScrollArea com transições internas
<ScrollArea>
  <div>Conteúdo</div>
</ScrollArea>

// ✅ CORRETO - Scroll nativo do navegador
<div 
  className="h-[320px] overflow-y-auto overflow-x-hidden"
  style={{
    scrollbarWidth: 'thin',
    scrollbarColor: '#d1d5db #f3f4f6',
  }}
  onWheel={(e) => {
    e.stopPropagation(); // Garante scroll com mouse wheel
  }}
>
  <div>Conteúdo</div>
</div>
```

#### Checklist de Correção

Ao encontrar erros de parsing de cor, siga esta ordem:

1. **Remover classe `transition-all`**
   - Substituir por `transition-none` ou remover completamente

2. **Remover classe `transition-colors`**
   - Esta classe tenta animar `border-color`, `background-color`, etc

3. **Adicionar inline styles de proteção**
   ```tsx
   style={{
     transition: 'none',
     animation: 'none',
     boxShadow: 'none',
   }}
   ```

4. **Forçar cores em hex ao invés de tokens CSS**
   ```tsx
   style={{
     borderColor: isActive ? '#ea526e' : '#e5e7eb',
     backgroundColor: isActive ? '#fef2f2' : 'transparent',
   }}
   ```

5. **Para ScrollArea problemático, usar scroll nativo**
   - Ver seção abaixo "Sistema de Scroll Nativo"

#### Sistema de Scroll Nativo

**Quando usar:**
- Sempre que o `ScrollArea` do shadcn/ui causar erros de parsing
- Quando precisar de scroll com mouse wheel garantido
- Em modais, popovers e componentes com altura fixa

**Implementação padrão:**

```tsx
<div 
  className="h-[320px] overflow-y-auto overflow-x-hidden"
  style={{
    scrollbarWidth: 'thin',           // Firefox
    scrollbarColor: '#d1d5db #f3f4f6', // Firefox (track + thumb)
  }}
  onWheel={(e) => {
    e.stopPropagation(); // Impede propagação para containers pais
  }}
>
  <div className="p-3">
    {/* Conteúdo scrollável */}
  </div>
</div>
```

**Propriedades PopoverContent:**

```tsx
<PopoverContent 
  onOpenAutoFocus={(e) => e.preventDefault()} // Previne bloqueio de scroll
>
```

**Por que funciona:**
- `overflow-y: auto` - Scroll nativo do navegador (performance máxima)
- `scrollbarWidth: 'thin'` - Scrollbar fina no Firefox
- `scrollbarColor` - Customização de cor no Firefox
- `onWheel` + `stopPropagation` - Garante scroll com mouse wheel
- `onOpenAutoFocus` - Previne que Radix UI bloqueie eventos

#### Arquivos Corrigidos (2026-02-14)

| Arquivo | Componente | Correção Aplicada |
|---------|-----------|-------------------|
| `/src/app/components/ui/scroll-area.tsx` | `ScrollBar` | Inline styles de proteção |
| `/src/app/components/admin/IconPicker.tsx` | Grid de ícones | Scroll nativo + inline styles |
| `/src/app/components/admin/CardRenderer.tsx` | Card hover | `transition-colors` removido |
| `/src/app/public/Header.tsx` | Menu items | `transition-colors` removido |
| `/src/app/public/components/SectionRenderer.tsx` | Media hover | `transition-colors` removido |

#### Regras Obrigatórias

✅ **SEMPRE** usar inline styles com `transition: 'none'` em elementos interativos  
✅ **SEMPRE** usar scroll nativo ao invés de `ScrollArea` quando houver erros  
✅ **SEMPRE** adicionar `onWheel` + `stopPropagation` em containers scrolláveis  
✅ **SEMPRE** usar cores hex em inline styles ao invés de tokens CSS  
✅ **SEMPRE** adicionar `onOpenAutoFocus={(e) => e.preventDefault()}` em popovers com scroll  
❌ **NUNCA** usar `transition-all` (tenta animar TODAS as propriedades)  
❌ **NUNCA** usar `transition-colors` em elementos com `box-shadow`  
❌ **NUNCA** confiar apenas em classes CSS para desabilitar transições  
❌ **NUNCA** usar `ScrollArea` sem testar se causa erros de parsing

#### Troubleshooting

**Erro: `Error parsing color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1)...`**
- **Causa:** Transição tentando interpolar `box-shadow` com múltiplos valores
- **Solução:** Adicionar `transition: 'none'` e `boxShadow: 'none'` em inline styles

**Erro: `Error parsing color: oklab(0.145 ...)`**
- **Causa:** Classes CSS Tailwind v4 usando espaço de cor oklab + transições
- **Solução:** Forçar cores hex em inline styles com maior especificidade

**Scroll com mouse wheel não funciona**
- **Causa:** Evento `onWheel` sendo bloqueado por container pai (Popover)
- **Solução:** Adicionar `onWheel={(e) => e.stopPropagation()}` e `onOpenAutoFocus={(e) => e.preventDefault()}`

**ScrollArea causa erro mesmo sem transições**
- **Causa:** Componente interno tem transições hardcoded no Radix UI
- **Solução:** Substituir por scroll nativo conforme padrão acima

---

## 📱 Breakpoints e Responsividade

### Breakpoints Oficiais

| Nome | Range | Descrição |
|------|-------|-----------|
| **Mobile** | ≤ 767px | Smartphones (iPhone 12, Samsung Galaxy) |
| **Tablet** | 768px - 1023px | Tablets (iPad, iPad Pro) |
| **Desktop** | ≥ 1024px | Desktops, laptops |

### Como Usar

```tsx
import { useDesignSystem } from '@/lib/contexts/DesignSystemContext';

function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop } = useDesignSystem();
  
  return (
    <div>
      {isMobile && <p>Mobile view</p>}
      {isTablet && <p>Tablet view</p>}
      {isDesktop && <p>Desktop view</p>}
    </div>
  );
}
```

### Tailwind Media Queries

```css
/* Mobile first (padrão) */
.container {
  padding: 1rem; /* Mobile */
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

---

## 🧩 Componentes e Padrões

### Botões

#### Variantes

1. **Primary** - Ação principal (rosa #ea526e)
   ```tsx
   <button className="bg-primary text-white hover:bg-primary/90">
     Ação Principal
   </button>
   ```

2. **Secondary** - Ação secundária (roxo #2e2240)
   ```tsx
   <button className="bg-secondary text-white hover:bg-secondary/90">
     Ação Secundária
   </button>
   ```

3. **Outline** - Ação terciária
   ```tsx
   <button className="border border-primary text-primary hover:bg-primary hover:text-white">
     Ver Mais
   </button>
   ```

#### Tamanhos

- **sm**: padding `0.5rem 1rem`, font-size `0.875rem`
- **md**: padding `0.75rem 1.5rem`, font-size `1rem` (padrão)
- **lg**: padding `1rem 2rem`, font-size `1.125rem`

### Cards

#### Estrutura Padrão

```tsx
<div className="bg-white rounded-2xl shadow-md p-6">
  <h3 className="text-xl font-semibold mb-2">Título do Card</h3>
  <p className="text-muted">Descrição do card...</p>
</div>
```

#### Regras

- ✅ **Sempre** usar `rounded-2xl` (border-radius 1.5rem)
- ✅ **Sempre** ter padding mínimo de `1.5rem` (md)
- ✅ Usar shadow para destacar: `shadow-sm`, `shadow-md`, `shadow-lg`

### Modais

#### Componente Base

Sempre use `BaseModal` do componente oficial:

```tsx
import { BaseModal } from '@/app/components/admin/BaseModal';

function MyFeature() {
  const [open, setOpen] = useState(false);
  
  return (
    <BaseModal
      open={open}
      onOpenChange={setOpen}
      title="Título do Modal"
      description="Descrição opcional"
    >
      <div>Conteúdo do modal</div>
    </BaseModal>
  );
}
```

#### Regras

- ✅ **Sempre** usar `BaseModal` (border-radius 2xl obrigatório)
- ✅ Botão X no canto superior direito
- ✅ Fecha ao clicar fora (overlay)
- ✅ Fecha com tecla ESC

---

## ✅ Regras de Governança

### Sempre Fazer

- ✅ Usar tokens do Design System via `useDesignSystem()`
- ✅ Consultar `/admin/design-system` antes de adicionar cores
- ✅ Usar componentes oficiais de `/src/app/components/admin/`
- ✅ Testar em 3 breakpoints (mobile/tablet/desktop)
- ✅ Manter consistência entre páginas
- ✅ Adicionar `import React from 'react'` no topo de arquivos TSX
- ✅ TypeScript 100% (sem `any`)

### Nunca Fazer

- ❌ **NUNCA** hardcoded de cores (`#ea526e` direto no código)
- ❌ **NUNCA** usar hex/rgb sem passar pelos tokens
- ❌ **NUNCA** criar novas escalas tipográficas sem documentar
- ❌ **NUNCA** ignorar breakpoints responsivos
- ❌ **NUNCA** usar outras fontes além de Poppins
- ❌ **NUNCA** copiar/colar código de seleção de tokens ou modais
- ❌ **NUNCA** usar valores hardcoded (px, rem direto)

### Checklist Antes de Commitar

- [ ] ✅ Executei `npm run validate` (obrigatório)
- [ ] ✅ Corrigi TODOS os erros e warnings
- [ ] ✅ Teste visual em 3 breakpoints (375px, 768px, 1440px)
- [ ] ✅ Console sem erros
- [ ] ✅ Usei apenas componentes de `@/app/components`
- [ ] ✅ **ZERO** cores hardcoded
- [ ] ✅ **ZERO** tamanhos hardcoded

---

## 🏗️ Arquitetura de Modais — 3 Camadas (2026-02-20)

### Visão Geral

O projeto usa uma arquitetura rígida de **3 camadas** para todos os modais e diálogos. Essa separação garante consistência visual, evita double-dialogs e centraliza toda a lógica de UX de fechamento em um único lugar (`BaseModal`).

```
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 1 — Primitivas shadcn/ui  (NUNCA importar em features)│
│  dialog.tsx · alert-dialog.tsx · sheet.tsx                  │
└─────────────────────────────────────────────────────────────┘
                              ↓ usadas somente por
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 2 — Wrappers do projeto  (únicos a usar Camada 1)   │
│  BaseModal                                                  │
│  AlertMessageDialog · ConfirmDeleteDialog                   │
│  ConfirmDialog · UnsavedChangesDialog                       │
└─────────────────────────────────────────────────────────────┘
                              ↓ usadas somente por
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 3 — Features  (NUNCA importam Camada 1 diretamente) │
│  VersionHistoryModal · UnifiedSectionConfigModal            │
│  TemplateEditorModal · MenuItemEditorModal · ...            │
└─────────────────────────────────────────────────────────────┘
```

### Quando usar cada wrapper da Camada 2

| Componente | Primitiva | Fechável pelo overlay/ESC | Quando usar |
|---|---|---|---|
| **BaseModal** | `Dialog` | ✅ Sim (com guard de unsaved) | Formulários, editores, modais grandes |
| **ConfirmDeleteDialog** | `AlertDialog` | ❌ Não | Confirmação de exclusão com `itemName` |
| **ConfirmDialog** | `AlertDialog` | ❌ Não | Confirmação genérica (sim/não) |
| **AlertMessageDialog** | `AlertDialog` | ❌ Não | Mensagens de alerta/erro ao usuário |
| **UnsavedChangesDialog** | `AlertDialog` | ❌ Não | **Uso interno do BaseModal apenas** |

### Padrão de Alterações Não Salvas

**BaseModal** gerencia automaticamente o `UnsavedChangesDialog` quando `hasUnsavedChanges={true}`.  
**Nunca renderize `UnsavedChangesDialog` manualmente dentro de `BaseModal`** — causa double-dialog.

```tsx
// ✅ CORRETO — BaseModal cuida do diálogo de confirmação
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

<BaseModal
  open={open}
  onOpenChange={onOpenChange}
  hasUnsavedChanges={hasUnsavedChanges}  // ← BaseModal gerencia o UnsavedChangesDialog
  onSave={handleSave}
  onCancel={() => onOpenChange(false)}    // ← chamado APÓS o usuário confirmar o descarte
>
  {/* conteúdo */}
  {/* ❌ NÃO adicionar <UnsavedChangesDialog> aqui */}
</BaseModal>

// ❌ INCORRETO — double-dialog
<BaseModal hasUnsavedChanges={true} ...>
  <UnsavedChangesDialog open={confirmOpen} ... /> {/* duplicado! */}
</BaseModal>
```

### Padrão para `onCancel` no BaseModal

O `onCancel` é chamado pelo `BaseModal` em dois cenários:

| Cenário | Quando | O que `onCancel` deve fazer |
|---|---|---|
| **Sem alterações** | Usuário clica em "Cancelar" | `onOpenChange(false)` diretamente |
| **Com alterações confirmadas** | Usuário confirmou descarte | `onOpenChange(false)` — BaseModal já mostrou o diálogo |

Por isso, `onCancel` deve **sempre** apenas fechar o modal:
```tsx
onCancel={() => onOpenChange(false)}
// ou
const handleCancel = () => { onOpenChange(false); };
```

### `DialogTrigger` e `AlertDialogTrigger`

Todos os modais e diálogos do projeto são **controlados por estado** (`open` prop).  
Os componentes `DialogTrigger` e `AlertDialogTrigger` são exportados pelos primitivos mas **não devem ser usados em features**.

```tsx
// ❌ NUNCA usar DialogTrigger em features
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild><Button>Abrir</Button></DialogTrigger>
  <DialogContent>...</DialogContent>
</Dialog>

// ✅ SEMPRE controlar por estado
<Button onClick={() => setOpen(true)}>Abrir</Button>
<BaseModal open={open} onOpenChange={setOpen} ...>...</BaseModal>
```

### `Sheet`

O componente `Sheet` (de `sheet.tsx`) é uma variação do `Dialog` deslizante lateral.  
No projeto BemDito, é usado **exclusivamente pelo `sidebar.tsx`** (componente shadcn/ui interno).  
Nenhuma feature deve importar `Sheet` diretamente.

### Regras Obrigatórias

✅ **SEMPRE** usar `BaseModal` para modais de formulário/edição  
✅ **SEMPRE** usar `ConfirmDeleteDialog` / `ConfirmDialog` / `AlertMessageDialog` para confirmações  
✅ **SEMPRE** controlar abertura/fechamento de modais por estado (`open` prop)  
✅ **SEMPRE** delegar o guard de unsaved changes ao `BaseModal` via `hasUnsavedChanges`  
✅ **SEMPRE** que `onCancel` for chamado pelo BaseModal, apenas executar `onOpenChange(false)`  
❌ **NUNCA** importar `dialog.tsx` ou `alert-dialog.tsx` em arquivos de feature  
❌ **NUNCA** renderizar `UnsavedChangesDialog` manualmente dentro de `BaseModal`  
❌ **NUNCA** usar `DialogTrigger` ou `AlertDialogTrigger` em features  
❌ **NUNCA** usar `useUnsavedChangesGuard`'s `confirmDialogOpen`/`requestDiscard` — o BaseModal já gerencia isso  

---

## 🔧 Componentes Oficiais Reutilizáveis

> 📚 **Lista completa com exemplos de código:** [`/guidelines/COMPONENTS_CATALOG.md`](./COMPONENTS_CATALOG.md) — fonte de verdade.  
> Esta tabela é um resumo de referência rápida. Sempre consultar o catálogo antes de criar qualquer componente.

### Admin — Modais e Diálogos (Camada 2)

| Componente | Localização | Uso |
|------------|-------------|-----|
| **BaseModal** | `/src/app/components/admin/BaseModal.tsx` | ⚠️ **OBRIGATÓRIO** — base para todos os modais de formulário/edição |
| **ConfirmDeleteDialog** | `/src/app/components/admin/ConfirmDeleteDialog.tsx` | ⚠️ **OBRIGATÓRIO** — qualquer exclusão de entidade |
| **ConfirmDialog** | `/src/app/components/admin/ConfirmDialog.tsx` | Confirmação genérica (publicar, mover, etc.) |
| **AlertMessageDialog** | `/src/app/components/admin/AlertMessageDialog.tsx` | Substituto de `window.alert()` |
| **UnsavedChangesDialog** | `/src/app/components/admin/UnsavedChangesDialog.tsx` | Uso **interno do BaseModal** — nunca instanciar manualmente |

### Admin — Layout e Listas

| Componente | Localização | Uso |
|------------|-------------|-----|
| **AdminPageLayout** | `/src/app/components/admin/AdminPageLayout.tsx` | ⚠️ **OBRIGATÓRIO** — container raiz de TODAS as páginas `/admin/*` |
| **AdminListItem** | `/src/app/components/admin/AdminListItem.tsx` | Container de linha de lista (`border-2 rounded-xl`) |
| **AdminEmptyState** | `/src/app/components/admin/AdminEmptyState.tsx` | Estado vazio padronizado com CTA opcional |
| **AdminActionButtons** | `/src/app/components/admin/AdminActionButtons.tsx` | Botões Editar/Duplicar/Excluir com ordem fixa |
| **UnsavedHeaderActions** | `/src/app/components/admin/UnsavedHeaderActions.tsx` | Indicador ⚠️ + botão Salvar no `headerActions` |
| **AdminPrimaryButton** | `/src/app/components/admin/AdminPrimaryButton.tsx` | ⚠️ **OBRIGATÓRIO** — substitui `<Button className="bg-primary …">` em todo o painel |
| **AdminDropdownMenu** | `/src/app/components/admin/AdminDropdownMenu.tsx` | ⚠️ **OBRIGATÓRIO** — substitui uso direto de `DropdownMenu` nas features; totalmente tokenizado |

### Admin — Seletores de Campo

| Componente | Localização | Uso |
|------------|-------------|-----|
| **ColorTokenPicker** | `/src/app/components/ColorTokenPicker.tsx` | Seletor de cores do DS — salva UUID do token |
| **TypeScalePicker** | `/src/app/components/admin/TypeScalePicker.tsx` | Seletor de tipografia — salva UUID do token |
| **IconPicker** | `/src/app/components/admin/IconPicker.tsx` | Seletor de ícones Lucide — salva nome string |
| **RadiusPicker** | `/src/app/components/admin/RadiusPicker.tsx` | Seletor de border-radius — padrão: token `2xl` |
| **TransitionPicker** | `/src/app/components/admin/TransitionPicker.tsx` | Seletor de velocidade de animação |
| **CornerPositionSelector** | `/src/app/components/admin/CornerPositionSelector.tsx` | Posição no grid 2×2 — aceita string ou `{ position }` |
| **AlignXYControl** | `/src/app/components/admin/AlignXYControl.tsx` | Alinhamento XY — props corretas: `valueX`/`valueY` |
| **OpacitySlider** | `/src/app/components/admin/OpacitySlider.tsx` | Opacidade 0–100 |
| **MediaFitModePicker** | `/src/app/components/admin/MediaFitModePicker.tsx` | Modo de exibição de mídia (cobrir/ajustada/contida/adaptada/alinhada) |

### Admin — Upload e Mídia

| Componente | Localização | Uso |
|------------|-------------|-----|
| **MediaUploader** | `/src/app/components/admin/MediaUploader.tsx` | Upload inline com biblioteca e drag-and-drop |
| **MediaPicker** | `/src/app/components/MediaPicker.tsx` | Seletor de mídia via modal separado |
| **ImageFieldWithPicker** | `/src/app/components/ImageFieldWithPicker.tsx` | Campo URL + botão de seleção da biblioteca |
| **ImageUploadOnly** | `/src/app/components/ImageUploadOnly.tsx` | Upload sem input manual de URL — props: `label`, `helperText` |

### Site Público

| Componente | Localização | Uso |
|------------|-------------|-----|
| **ResponsiveContainer** | `/src/app/components/ResponsiveContainer.tsx` | Container responsivo |
| **ResponsiveText** | `/src/app/components/ResponsiveText.tsx` | Texto com token tipográfico |
| **ResponsiveImage** | `/src/app/components/ResponsiveImage.tsx` | Imagem responsiva |
| **ResponsiveButton** | `/src/app/components/ResponsiveButton.tsx` | Botão público — ⚠️ nunca usar `<button>` plain no site |
| **ResponsiveCard** | `/src/app/components/ResponsiveCard.tsx` | Card responsivo |
| **SectionRenderer** | `/src/app/public/components/SectionRenderer.tsx` | Renderizador principal de seções — nunca duplicar |
| **CardRenderer** | `/src/app/public/components/CardRenderer.tsx` | Renderiza cards de template — nunca duplicar |

---

## 📊 Ícones

### Biblioteca Oficial

- **Lucide React** - Única biblioteca permitida
- **Instalação**: Já incluída no projeto
- **Importação**: `import { Icon } from 'lucide-react'`

### Uso no Admin (IconPicker)

O componente `IconPicker` gerencia a seleção de ícones. A lista oficial de ícones disponíveis está em:

```typescript
// Lista completa em /src/lib/constants/lucideIcons.ts
export const AVAILABLE_LUCIDE_ICONS: string[] = [
  'Home', 'User', 'Users', 'Settings', 'Mail', 'Phone', 'MapPin',
  // ... 100+ ícones
];
```

### ✅ Renderização de Ícones por Nome (Público)

Sempre usar `getLucideIcon()` para renderizar ícones salvos como string no banco:

```tsx
import { getLucideIcon } from '@/lib/utils/icons';

// Dentro de componentes públicos:
const IconEl = getLucideIcon('Heart', 'h-12 w-12');  // retorna <Heart className="h-12 w-12" />
const IconEl2 = getLucideIcon(config.icon);           // null-safe
```

**Nunca usar** `(LucideIcons as any)[name]` diretamente em features — use `getLucideIcon()`.  
Exceções documentadas (IconPicker, MegamenuContent, CardRenderer) estão listadas em `COMPONENTS_CATALOG.md §4`.

**Benefícios:**
- ✅ **100% dos ícones do admin funcionam** (usa mesma lista)
- ✅ **Fallback automático** (nunca quebra)
- ✅ **Warning no console** se ícone não encontrado
- ✅ **Retrocompatibilidade** com dados existentes

### Uso Manual

```tsx
import { Heart, MessageCircle, Settings } from 'lucide-react';

function MyComponent() {
  return (
    <div>
      <Heart size={24} color="#ea526e" />
      <MessageCircle size={20} />
      <Settings size={16} />
    </div>
  );
}
```

### Tamanhos Padrão

- **16px** - Ícones pequenos (badges, tags)
- **20px** - Ícones médios (botões)
- **24px** - Ícones grandes (cards, headers)
- **32px** - Ícones muito grandes (hero sections)
- **48px** - Ícones em seções (h-12 w-12)

---

## 🎯 Acessibilidade

### Contraste de Cores

- ✅ **Mínimo WCAG AA**: 4.5:1 para texto normal
- ✅ **Mínimo WCAG AA**: 3:1 para texto grande (≥24px)
- ✅ Testar com ferramentas: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Combinações Aprovadas

| Fundo | Texto | Contraste |
|-------|-------|-----------|
| `#ea526e` (Primary) | `#ffffff` (White) | ✅ 4.8:1 |
| `#2e2240` (Secondary) | `#ffffff` (White) | ✅ 12.6:1 |
| `#f6f6f6` (Background) | `#020105` (Dark) | ✅ 18.2:1 |
| `#ed9331` (Accent) | `#ffffff` (White) | ✅ 3.1:1 (somente texto ≥24px) |

### Outros Requisitos

- ✅ Foco visível em elementos interativos
- ✅ Labels em todos os inputs
- ✅ Alt text em todas as imagens
- ✅ Navegação por teclado funcional

---

## 📚 Recursos Adicionais

- **[COMPONENTS_CATALOG.md](./COMPONENTS_CATALOG.md)** ⭐ - **Catálogo oficial de todos os componentes** — consultar ANTES de criar qualquer coisa nova
- **[SECTIONS_SYSTEM.md](./SECTIONS_SYSTEM.md)** - Sistema de seções (overflow, Editar/Salvar Como, auto-fix gridRows)
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Schema oficial do banco de dados (V3.4)
- **[CARDS_SYSTEM.md](./CARDS_SYSTEM.md)** - Sistema de card templates
- **[MEDIA_SYSTEM.md](./MEDIA_SYSTEM.md)** - Sistema de mídia e upload
- **[GRID_SYSTEM.md](./GRID_SYSTEM.md)** - Sistema de grid de seções
- **[SPACING_SYSTEM.md](./SPACING_SYSTEM.md)** - Sistema de espaçamento
- **[CSS_GUIDELINES.md](./CSS_GUIDELINES.md)** - Regras de CSS e Tailwind

---

## 🔒 Sistema de Overflow e Truncamento (2026-02-21 — REGRA ABSOLUTA)

### ⚠️ REGRA ABSOLUTA: Zero Scrollbar em Seções e Colunas

**NUNCA** deve ser exibida barra de rolagem (horizontal ou vertical) em seções ou colunas de uma página pública.

**Quando o conteúdo não cabe:**

| Prioridade | Estratégia | Descrição |
|---|---|---|
| 1ª | **Redimensionar texto** | Auto-fit escala proporcionalmente todos os sub-elementos de texto (ícone, chamada, título, subtítulo, botão) |
| 2ª | **Ajustar mídia** | Mídia se adapta conforme configuração (grid, posição, alinhamento, mediaDisplayMode) |
| 3ª | **Reduzir cards** | Exibir menos filtros e/ou menos cards no template |
| 4ª | **Clip (fallback)** | `overflow: hidden` corta o conteúdo que excede — é o fallback obrigatório |

**Proibições absolutas:**

❌ **NUNCA** `overflow: 'visible'` em qualquer container de seção, coluna ou grid  
❌ **NUNCA** `overflow: 'auto'` ou `overflow: 'scroll'` em qualquer nível da seção  
❌ **NUNCA** `overflow-y-auto`, `overflow-x-auto`, `overflow-y-scroll`, `overflow-x-scroll` em classes Tailwind  
❌ **NUNCA** elementos vazando para seções adjacentes (acima ou abaixo)

**Regra CSS obrigatória:**

```typescript
// ✅ CORRETO — SEMPRE usar hidden em todos os containers
overflow: 'hidden'

// ❌ ERRADO — NUNCA usar
overflow: 'visible'   // Conteúdo vaza para outras seções
overflow: 'auto'      // Cria scrollbar quando conteúdo excede
overflowY: 'auto'     // Cria scrollbar vertical
overflowX: 'auto'     // Cria scrollbar horizontal
```

**Pontos de aplicação no `SectionRenderer.tsx` (2026-02-21):**

| Container | Regra |
|---|---|
| `<section>` (raiz) | `overflow: hidden` via `boxSizing + clip` |
| Content wrapper (`.relative.z-10`) | `overflow: 'hidden'` |
| Grid container | `overflow: 'hidden'` |
| Coluna de texto (text container) | `overflow: 'hidden'` |
| Coluna de cards (separate column) | `overflow-hidden` (classe Tailwind) |
| CustomContent wrapper (dentro de texto) | `overflow-hidden` (classe Tailwind) |
| CustomContent wrapper (layout vertical) | `overflow-hidden` (classe Tailwind) |
| Layout vertical container | `overflow: 'hidden'` |

### Visão Geral

O sistema garante que **seções sempre mantenham a altura definida** sem scroll — nem vertical, nem horizontal. Textos são redimensionados via auto-fit, e o clip é o fallback final.

### Classes CSS Disponíveis

Arquivo: `/src/styles/theme.css`

```css
.line-clamp-2  /* Trunca em 2 linhas com ... */
.line-clamp-3  /* Trunca em 3 linhas com ... */
.line-clamp-4  /* Trunca em 4 linhas com ... */
```

### Comportamento por Elemento

**Container da Seção:**
- ✅ `overflow: hidden` — Conteúdo nunca ultrapassa

**Textos:**
- ✅ Chamada: `line-clamp-2 flex-shrink-0` (máx 2 linhas)
- ✅ Título: `line-clamp-3 flex-shrink-0` (máx 3 linhas)
- ✅ Subtítulo: `line-clamp-4` (máx 4 linhas)

**Hierarquia:**
- ✅ Nunca comprimem: Ícone, Chamada, Título, Botão (`flex-shrink-0`)
- 🟡 Podem comprimir: Subtítulo, Custom Content

**Cards e Tabs:**
- ✅ `overflow-hidden flex-1 min-h-0` — Clip quando excede

**Mídia:**
- Grid 50/50: `maxHeight: 100%`
- Layout vertical: `maxHeight: 50%`

### Documentação Completa

👉 Consulte `/guidelines/SECTIONS_SYSTEM.md` — seção "Sistema de Overflow e Truncamento" para detalhes completos.

---

## ✏️ Sistema de Editar e Salvar Como (2026-02-13)

### Funcionalidade "Editar"

**Local:** `/admin/sections-manager`

**Comportamento:**
1. **Seção NÃO vinculada:** Edita diretamente sem restrições
2. **Seção vinculada:** Mostra modal de aviso com páginas afetadas

**Modal de Aviso:**
```
⚠️ Esta seção está sendo usada em 3 páginas:
   - Home, Sobre, Contato

✏️ Editar afetará TODAS estas páginas.
💡 Use "Salvar Como" para criar uma cópia.

[Cancelar] [Continuar Editando]
```

### Funcionalidade "Salvar Como"

**Comportamento:**
1. Duplica a seção com novo `id`
2. Adiciona sufixo " (Cópia)" ao nome
3. Remove vinculações (nova seção em 0 páginas)
4. Abre modal de edição da nova seção

**Fluxo:**
```
Seção Original (id: 123, em 3 páginas)
       ↓ [Salvar Como]
Seção Cópia (id: 456, em 0 páginas)
       ↓ [Editar livremente]
```

### Validações

**Backend:** `GET /make-server-72da2481/sections/:id/usage`
**Frontend:** Verificação antes de editar

### Documentação Completa

👉 Consulte `/guidelines/SECTIONS_SYSTEM.md` — seção "Sistema de Editar e Salvar Como" para detalhes completos.

---

## ⚠️ Notas Importantes

### Dois Sistemas Independentes

**ATENÇÃO**: O projeto possui dois sistemas de design:

1. **Site Público** - Usa tokens do banco de dados (dinâmico)
2. **Painel Admin** - Usa `/src/styles/theme.css` (estático)

**Para sincronizar**, veja: [DESIGN_SYSTEM_SYNC.md](../DESIGN_SYSTEM_SYNC.md)

### 🗄️ Estrutura do Schema PostgreSQL (Tabela sections)

#### Visão Geral (atualizado V3.2 — 2026-02-19)

A tabela `sections` possui **3 colunas JSONB principais** que armazenam diferentes tipos de dados:

| Coluna | Tipo | Conteúdo | Caminho de Acesso |
|--------|------|----------|-------------------|
| **`config`** | JSONB | Configurações gerais (gridRows, gridCols, cores, textos) | `config->>'gridRows'` |
| **`layout`** | JSONB | Posições dos elementos no grid (text, media, cards) | `layout->'desktop'->>'text'` |
| **`styling`** | JSONB | Espaçamento, tipografia, altura da seção | `styling->'spacing'->>'top'` |

**⚠️ IMPORTANTE: Posições são Strings Diretas**

As posições **NÃO são objetos**, são **strings diretas**:

```sql
-- ❌ ERRADO (tentando acessar .position)
layout->'desktop'->'text'->>'position'  -- Retorna NULL

-- ✅ CORRETO (posição é string direta)
layout->'desktop'->>'text'              -- Retorna "middle-left"
```

**Regra de Ouro:**
- ✅ **gridRows/gridCols** → Leia de `config`
- ✅ **Posições (text/media/cards)** → Leia de `layout`
- ✅ **Espaçamento** → Leia de `styling`
- ❌ **NUNCA** leia de `config.layout` (não existe mais desde v6.0)

**✅ DESCOBERTA V3.1 + CORREÇÃO V3.2 (2026-02-19) — Estado Final:**  
- `section_template_cards` tem **6 colunas**: `id`, `section_id`, `template_id`, `order_index`, `created_at`, `updated_at`. A coluna `updated_at` **EXISTE** (audit V3.0 a classificou incorretamente). A trigger removida no Bloco B era válida — removida por simplificação intencional.  
- `v_database_stats` view **recriada** em V3.2: colunas `tabela` (text) + `total` (integer). Anteriormente tinha `table_name` + `total_records` (bigint).  
- **Banco 100% limpo** — 9/9 checks de integridade = 0 problemas. Contagens: design_tokens=37, sections=10, menu_cards=22, template_cards=7, page_versions=11 (pós-cleanup V3.0 + sessão V3.3).  
Consulte sempre `/guidelines/DATABASE_SCHEMA.md` (V3.4) para o estado atual completo.

**⚠️ ATUALIZAÇÃO 2026-02-15: Localização de gridCols/gridRows**

**PROBLEMA IDENTIFICADO:**  
Algumas seções antigas têm `gridCols` e/ou `gridRows` em **`layout`** ao invés de **`config`**.

**ONDE DEVEM ESTAR:**
```sql
-- ✅ CORRETO (em 'config')
config->>'gridRows'  -- 1 ou 2
config->>'gridCols'  -- 1 ou 2

-- ❌ INCORRETO (em 'layout' - legado)
layout->>'gridRows'  -- CAMPO DUPLICADO!
layout->>'gridCols'  -- LOCAL ERRADO!
```

**STATUS DA NORMALIZAÇÃO:**
- ✅ Migration v6.8.1: Seção 667ab5d5 normalizada (2026-02-15)
- ✅ Migration v6.8.2: TODAS as 10 seções normalizadas (2026-02-15)

**QUERY DE DIAGNÓSTICO:**
```sql
-- Verificar seções com gridCols/gridRows em local incorreto
SELECT 
  id, name,
  config->>'gridCols' as config_cols,
  config->>'gridRows' as config_rows,
  layout->>'gridCols' as layout_cols,  -- Não deveria existir
  layout->>'gridRows' as layout_rows   -- Não deveria existir
FROM sections
WHERE layout ? 'gridCols' OR layout ? 'gridRows';
```

**CORREÇÃO AUTOMÁTICA:**
Execute: `/migrations/2026-02-15_fix_grid_location_all.sql`

**POR QUE O CÓDIGO FUNCIONA MESMO ASSIM?**  
O `SectionRenderer.tsx` tem **fallback de retrocompatibilidade**:
```tsx
// Linha 464: Tenta layout primeiro, depois config
const gridCols = Math.min(2, Math.max(1, 
  sectionLayout.gridCols ||  // ⚠️ Fallback para dados legados
  sectionConfig.gridCols ||  // ✅ Local correto
  1
));
```

**Documentação Completa:**  
👉 [/migrations/2026-02-14_DIAGNOSTIC_RESULTS.md](../migrations/2026-02-14_DIAGNOSTIC_RESULTS.md)  
👉 [/___CORRECTIONS_LOG_2026-02-14.md](../___CORRECTIONS_LOG_2026-02-14.md)  
👉 [/migrations/2026-02-15_diagnostic_grid_location.sql](../migrations/2026-02-15_diagnostic_grid_location.sql)

---

## 🎛️ Sistema de Layout Avançado (Seções)

### Seleção de Posição por Cantos (2026-02-14) ✨ NOVO

O sistema de posicionamento foi **simplificado** para usar apenas **4 botões de canto** ao invés de 9 posições complexas.

**Como Funciona:**
- 4 botões representando os cantos do grid 2×2 (Topo Esquerda, Topo Direita, Baixo Esquerda, Baixo Direita)
- Seleção múltipla determina automaticamente o tamanho e posição do elemento
- Validação automática de combinações inválidas

**Lógica de Seleção:**
```
1 canto selecionado       → Célula específica (1×1)
2 cantos horizontais      → Linha completa (2×1)
2 cantos verticais        → Coluna completa (1×2)
4 cantos selecionados     → Grid completo (2×2)
```

**Mapeamento Automático:**
| Seleção | GridPosition | Tamanho |
|---------|--------------|---------|
| Topo Esquerda | `top-left` | 1×1 |
| Topo Direita | `top-right` | 1×1 |
| Baixo Esquerda | `bottom-left` | 1×1 |
| Baixo Direita | `bottom-right` | 1×1 |
| Topo Esq + Topo Dir | `top-center` | 2×1 |
| Baixo Esq + Baixo Dir | `bottom-center` | 2×1 |
| Topo Esq + Baixo Esq | `middle-left` | 1×2 |
| Topo Dir + Baixo Dir | `middle-right` | 1×2 |
| Todos os 4 | `center` | 2×2 |

**Componente:**
```tsx
import { CornerPositionSelector } from '@/app/components/admin/CornerPositionSelector';

<CornerPositionSelector
  title="Posição do Texto/Ícone"
  description="Escolha onde o conteúdo aparecerá"
  value={layout?.desktop?.text?.position || 'top-left'}
  onChange={(position) => {
    // Atualizar layout com nova posição
  }}
/>
```

**Onde Encontrar:**
- `/admin/pages-manager` → Configurar Seção → Aba "Preview"
- 3 cards disponíveis: Texto/Ícone, Mídia, Cards

**⚠️ ATUALIZAÇÃO DA INTERFACE (2026-02-14):**

Na aba "Layout" do modal de configuração de seções, foram **removidos** os seguintes campos redundantes:
- ❌ Cards "Posição do Texto/Ícone" (agora apenas na aba "Preview")
- ❌ Cards "Posição da Mídia" (agora apenas na aba "Preview")
- ❌ Cards "Posição dos Cards" (agora apenas na aba "Preview")
- ❌ Campo "Alinhamento Vertical do Texto" (já existe na aba "Design")
- ❌ Campo "Alinhamento Interno do Texto" (já existe na aba "Design")

**Mantidos na aba "Layout":**
- ✅ Configuração do Grid (1/2 Colunas, 1/2 Linhas)
- ✅ Ponto Focal da Mídia (posição vertical da imagem)

**Componente Descontinuado:**
- 🔶 `GridPositionSelector` - Componente comentado em `/src/app/admin/sections-manager/SectionBuilder.tsx` (linhas 293-460)
- Mantido no código caso precise ser restaurado no futuro
- Substituído pelo `CornerPositionSelector` na aba "Preview"

---

### 🔧 Validação Robusta de Posições (2026-02-14) ✨ CORREÇÃO

**Problema Identificado:**

O `CornerPositionSelector` estava recebendo objetos com estrutura `{ position: "middle-right", verticalAlign: "bottom" }` ao invés de strings simples como `"top-left"`, causando erros:

```
❌ Invalid position for media: { "position": "middle-right", "verticalAlign": "bottom" }
⚠️ Combinação inválida de cantos: top-right, bottom-right, top-left
```

**Solução Implementada:**

O componente agora aceita **ambos os formatos**:

1. **String direta**: `"top-left"`
2. **Objeto com position**: `{ position: "top-left", verticalAlign: "bottom" }`

**Código da Validação:**

```tsx
// ✅ VALIDAÇÃO ROBUSTA: Extrair string de posição de qualquer formato
let validatedValue: GridPosition = 'top-left';

// Caso 1: value é um objeto com campo "position"
if (value && typeof value === 'object' && 'position' in value) {
  const positionValue = (value as any).position;
  if (typeof positionValue === 'string') {
    validatedValue = positionValue as GridPosition;
    console.log(`✅ Extraído position de objeto: "${positionValue}"`);
  }
}
// Caso 2: value é uma string direta
else if (typeof value === 'string') {
  validatedValue = value as GridPosition;
  console.log(`✅ Valor string válido: "${value}"`);
}
// Caso 3: value é inválido (fallback para 'top-left')
else {
  console.warn(`⚠️ Tipo inválido, usando padrão "top-left"`);
}
```

**Interface Atualizada:**

```tsx
interface CornerPositionSelectorProps {
  value: GridPosition | { position: GridPosition; [key: string]: any }; // ✅ Aceita ambos
  onChange: (position: GridPosition) => void;
  // ... outros props
}
```

**Benefícios:**

✅ **Retrocompatibilidade** - Dados antigos do banco continuam funcionando  
✅ **Flexibilidade** - Aceita objetos com campos extras (verticalAlign, textAlign, etc)  
✅ **Validação automática** - Sempre valida se a posição é uma das 9 posições válidas  
✅ **Fallback seguro** - Se inválido, usa 'top-left' ao invés de quebrar

**Regras:**

✅ **SEMPRE** passa o valor direto do banco para o componente (não precisa extrair manualmente)  
✅ **SEMPRE** permite objetos com campos extras além de `position`  
✅ **SEMPRE** valida se a string é uma GridPosition válida  
❌ **NUNCA** assumir que value é apenas string (pode ser objeto)  
❌ **NUNCA** fazer spread de strings (`...currentText` quando currentText é string)

**Arquivo Corrigido:**

- `/src/app/components/admin/CornerPositionSelector.tsx` (linhas 33-75)

---

### Posicionamento Drag and Drop (Grid 2×2) 🔶 LEGADO

O sistema de layout das seções usa um **grid 2×2 interativo** onde cada elemento pode ser arrastado e redimensionado:

#### Interface Drag and Drop

**Como funciona:**
1. **Arrastar**: Clique e segure um elemento para movê-lo
2. **Drop**: Solte o elemento em qualquer célula do grid 2×2
3. **Redimensionar**: Clique no elemento e use os botões no canto inferior direito
4. **Feedback visual**: Células de destino ficam destacadas durante o drag

#### Configuração de Tamanho

Cada elemento pode ocupar:
- **1 coluna** ou **2 colunas** (largura)
- **1 linha** ou **2 linhas** (altura)

**Combinações possíveis:**
- `1 × 1` - Uma célula (padrão)
- `2 × 1` - Duas colunas, uma linha (horizontal)
- `1 × 2` - Uma coluna, duas linhas (vertical)
- `2 × 2` - Grid completo (fullscreen)

#### Mapeamento de Posições

| GridPosition | Colunas | Linhas | Início (Col, Row) |
|--------------|---------|--------|-------------------|
| `top-left` | 1 | 1 | (1, 1) |
| `top-right` | 1 | 1 | (2, 1) |
| `top-center` | 2 | 1 | (1, 1) |
| `bottom-left` | 1 | 1 | (1, 2) |
| `bottom-right` | 1 | 1 | (2, 2) |
| `bottom-center` | 2 | 1 | (1, 2) |
| `middle-left` | 1 | 2 | (1, 1) |
| `middle-right` | 1 | 2 | (2, 1) |
| `center` | 2 | 2 | (1, 1) |

#### Controles Visuais

**Ícone de Drag** (canto superior esquerdo):
- 🔘 `GripVertical` - Indica que o elemento é arrastável

**Botões de Redimensionamento** (canto inferior direito, quando selecionado):
- 📏 **Colunas**: Alterna entre 1 e 2 colunas (visual: duas barras verticais)
- 📏 **Linhas**: Alterna entre 1 e 2 linhas (visual: duas barras horizontais)

#### Exemplo Prático

**Cenário:** Hero com Texto à esquerda (2 linhas) e Mídia à direita (1x1)

1. Ativar "Texto" e "Mídia" na seção de elementos
2. Arrastar "Texto" para célula top-left
3. Clicar em "Texto" para selecionar
4. Clicar no botão de linhas → `middle-left` (1 col, 2 linhas)
5. Arrastar "Mídia" para célula top-right
6. Mídia fica em `top-right` (1x1 padrão)

**Resultado:**
```
┌──────────┬──────────┐
│          │          │
│  Texto   │  Mídia   │
│  (1×2)   │  (1×1)   │
│          ├──────────┤
│          │  (vazio) │
└──────────┴──────────┘
```

#### Biblioteca react-dnd

O sistema usa **react-dnd** com HTML5 backend:
- ✅ Já instalado (`react-dnd@16.0.1` e `react-dnd-html5-backend@16.0.1`)
- ✅ Suporte nativo a drag and drop
- ✅ Feedback visual durante o drag
- ✅ Validação automática de sobreposição

---

### Posicionamento por Linha e Coluna (LEGADO)

**⚠️ DESCONTINUADO:** Este sistema será substituído pelo Grid 2×2 acima.

O sistema de layout das seções suporta posicionamento granular no desktop:

#### Estrutura de Layout

```typescript
layout: {
  desktop: {
    text: { 
      row: 'top' | 'bottom' | 'both' | 'single',
      horizontal: 'left' | 'center' | 'right',
      textAlign?: 'left' | 'center' | 'right'  // ✅ NOVO: Alinhamento interno do texto
    },
    media: { 
      row: ..., 
      horizontal: ...,
      verticalAlign?: 'top' | 'center' | 'bottom'  // ✅ NOVO: Ponto focal da imagem
    },
    cards: { row: ..., horizontal: ... },
    container: { row: ..., horizontal: ... }
  },
  mobile: {
    textAlign: 'left' | 'center' | 'right',
    stack: 'vertical' | 'horizontal'
  }
}
```

#### ✨ NOVOS CONTROLES DE ALINHAMENTO

##### 1️⃣ Alinhamento Interno do Texto (`text.textAlign`)

**O que faz:**
- Define como o texto é alinhado **DENTRO** do container
- Independente da posição do elemento na grid (`horizontal`)

**Diferença entre `horizontal` e `textAlign`:**
```
┌─────────────────────────────────────┐
│  [ Elemento - Centro ]              │ ← horizontal: 'center' (posição na grid)
│  ┌───────────────────────────────┐  │
│  │ Título à esquerda              │  │ ← textAlign: 'left' (alinhamento interno)
│  │ Subtítulo também               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Quando usar:**
- ✅ Texto centralizado na grid MAS alinhado à esquerda internamente
- ✅ Criar layouts assimétricos (ex: título à direita, subtítulo à esquerda)
- ✅ Melhorar legibilidade de textos longos

**Valores padrão:**
- Se não definido, usa o valor de `horizontal`

---

### 🎯 Sistema de Alinhamento de Sub-elementos (2026-02-12)

#### Visão Geral

Os **sub-elementos de texto** (ícone, chamada, título principal, subtítulo e botão) funcionam como um **elemento integrado** e SEMPRE compartilham o mesmo alinhamento horizontal e vertical.

**Sub-elementos:**
1. 🎨 **Ícone** (topo)
2. 📣 **Chamada** (smallTitle)
3. 📰 **Título Principal** (title)
4. 📝 **Subtítulo** (subtitle)
5. 🔘 **Botão CTA** (rodapé)

#### Regras de Alinhamento

**CRITICAL:** Todos os sub-elementos seguem `textAlignInternal` (não `textAlign`).

| Campo | Descrição | Uso |
|-------|-----------|-----|
| `textAlign` | Posição do elemento **NA GRID** | Define onde o bloco de texto fica (esquerda/centro/direita) |
| `textAlignInternal` | Alinhamento **DENTRO DO ELEMENTO** | Define como o conteúdo é alinhado internamente |

**Exemplo:**
```tsx
// textAlign = 'center' (bloco no centro da grid)
// textAlignInternal = 'left' (conteúdo alinhado à esquerda DENTRO do bloco)

┌─────────────────────────────────────┐
│         [ Bloco Central ]           │ ← textAlign: 'center'
│  ┌───────────────────────────────┐  │
│  │ Ícone à esquerda               │  │
│  │ Título à esquerda              │  │ ← textAlignInternal: 'left'
│  │ Subtítulo à esquerda           │  │
│  │ [Botão à esquerda]             │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### Implementação Técnica (SectionRenderer.tsx)

##### Variáveis de Alinhamento

```tsx
// ✅ Alinhamento INTERNO do texto
const textAlignInternal = desktopLayout.textAlign || desktopLayout.text?.textAlign || textAlign;

// ✅ Classe de alinhamento de texto (text-left, text-center, text-right)
const textAlignInternalClass = {
  'left': 'text-left',
  'center': 'text-center',
  'right': 'text-right',
}[textAlignInternal] || 'text-center';

// ✅ Classe de justificação (para ícone e botão em flex)
const textJustifyClass = {
  'left': 'justify-start',
  'center': 'justify-center',
  'right': 'justify-end',
}[textAlignInternal] || 'justify-center';

// ✅ Classe para alinhar o ELEMENTO em si (não apenas o texto)
const elementAlignClass = {
  'left': '',           // Alinhamento padrão à esquerda
  'center': 'mx-auto',  // Centraliza o elemento com margin auto
  'right': 'ml-auto',   // Alinha à direita com margin-left auto
}[textAlignInternal] || '';

// ✅ Largura máxima do subtítulo
const subtitleWidthClass = 'w-full max-w-4xl';
```

##### Aplicação nos Sub-elementos

**Container Principal:**
```tsx
<div className={`flex flex-col ${textAlignInternalClass}`} style={{ gap: '1rem' }}>
```

**Ícone:**
```tsx
<div className={`flex ${textJustifyClass} ${elementAlignClass}`}>
  <IconComponent className="h-12 w-12" />
</div>
```

**Chamada, Título, Subtítulo:**
```tsx
<p className={elementAlignClass}>Chamada</p>
<h2 className={elementAlignClass}>Título</h2>
<p className={`${subtitleWidthClass} ${elementAlignClass}`}>Subtítulo</p>
```

**Botão:**
```tsx
<div className={`flex ${textJustifyClass} ${elementAlignClass}`}>
  <ResponsiveButton>CTA</ResponsiveButton>
</div>
```

#### Por que `elementAlignClass`?

**Antes (INCORRETO):**
```tsx
<p className="text-center max-w-2xl">Subtítulo</p>
```
- ✅ Texto centralizado (`text-center`)
- ❌ Elemento alinhado à esquerda (falta `mx-auto`)

**Depois (CORRETO):**
```tsx
<p className="w-full max-w-4xl mx-auto text-center">Subtítulo</p>
```
- ✅ Texto centralizado (`text-center`)
- ✅ Elemento centralizado (`mx-auto`)

#### Paddings e Espaçamento

**Layout Grid:**
```tsx
<div className="px-8 lg:px-16 py-8" style={{ gap: '1rem' }}>
```

**Layout Vertical:**
```tsx
<div className="px-4 py-8" style={{ gap: '1rem' }}>
```

#### Regras Obrigatórias

✅ **SEMPRE** usar `textAlignInternal` para calcular classes de alinhamento  
✅ **SEMPRE** aplicar `elementAlignClass` em sub-elementos  
✅ **SEMPRE** usar `gap: 1rem` entre sub-elementos  
✅ **SEMPRE** usar `subtitleWidthClass` para subtítulos  
❌ **NUNCA** usar `textAlign` para alinhamento interno  
❌ **NUNCA** esquecer `mx-auto` ao centralizar elementos  

---

##### 2️⃣ Alinhamento Vertical da Mídia (`media.verticalAlign`)

**O que faz:**
- Define o **ponto focal** da imagem (qual parte fica visível)
- Usado quando a imagem é maior que o container

**Opções:**
- `top` - Foca no topo (útil para fotos com céu, cabeçalhos)
- `center` - Foca no centro (padrão, recomendado)
- `bottom` - Foca no rodapé (útil para fotos com texto embaixo, CTAs)

**Quando usar:**
- ✅ Imagens com ponto de interesse específico (rosto no topo, texto no rodapé)
- ✅ Fotos de produtos (foco no centro)
- ✅ Banners com texto sobreposto (foco onde o texto não está)

**Valor padrão:**
- Se não definido, usa `center`

**Exemplo técnico:**
```typescript
// Foto de pessoa com rosto no topo
media: { 
  row: 'single', 
  horizontal: 'center',
  verticalAlign: 'top'  // ← Foca no rosto
}

// Banner com CTA no rodapé
media: { 
  row: 'single', 
  horizontal: 'center',
  verticalAlign: 'bottom'  // ← Mostra o botão
}
```

#### Agrupamento de Elementos

**"Texto"** agrupa automaticamente:
- ✅ Ícone (acima de todos)
- ✅ Chamada
- ✅ Título Principal
- ✅ Subtítulo
- ✅ Botão (abaixo de todos)

Todos seguem o posicionamento definido em `layout.desktop.text`.

#### Regras de Posicionamento

| Altura da Seção | Linhas Horizontais | Opções de Linha Disponíveis |
|-----------------|-------------------|----------------------------|
| **100vh** | 2 linhas | Superior, Inferior, Ambas |
| **100vh** | 1 linha | Linha Única |
| **50vh ou 25vh** | - | Linha Única (forçado) |
| **Auto** | - | Superior, Inferior, Ambas |

**Opções Horizontais** (sempre disponíveis):
- Esquerda
- Centro  
- Direita

**⚠️ IMPORTANTE:** Não pode haver esquerda + centro + direita na mesma linha. Apenas uma posição horizontal por linha para cada elemento.

#### Exemplos de Configuração

**Exemplo 1: Hero com Texto à Esquerda e Mídia à Direita**
```json
{
  "sectionHeight": "100vh",
  "horizontalLines": "one",
  "layout": {
    "desktop": {
      "text": { "row": "single", "horizontal": "left" },
      "media": { "row": "single", "horizontal": "right" }
    }
  }
}
```

**Exemplo 2: Seção de Cards com Título no Topo**
```json
{
  "sectionHeight": "auto",
  "layout": {
    "desktop": {
      "text": { "row": "top", "horizontal": "center" },
      "cards": { "row": "bottom", "horizontal": "center" }
    }
  }
}
```

**Exemplo 3: Seção com Container Decorativo em Ambas as Linhas**
```json
{
  "sectionHeight": "100vh",
  "horizontalLines": "two",
  "layout": {
    "desktop": {
      "text": { "row": "top", "horizontal": "center" },
      "container": { "row": "both", "horizontal": "center" }
    }
  }
}
```

### Como Usar no SectionBuilder

```tsx
import { SectionBuilder } from '@/app/admin/sections-manager/SectionBuilder';

<SectionBuilder
  elements={elements}
  layout={layout}
  styling={styling}
  sectionHeight="100vh"  // Vem de config
  horizontalLines="two"  // Vem de config
  onChange={handleBuilderChange}
/>
```

O componente automaticamente:
- ✅ Mostra apenas elementos selecionados
- ✅ Restringe opções de linha baseado em altura/linhas
- ✅ Valida posições automaticamente
- ✅ Agrupa elementos de texto

---

## 🎨 Sistema Unificado de Rendering (SectionRenderer)

### Visão Geral

Todas as seções do site público usam o **sistema unificado de renderização** via função `renderUnifiedLayout()` no componente `SectionRenderer.tsx`. Isso garante:

✅ **Consistência total** - Mesmo comportamento em todas as seções  
✅ **Zero duplicação** - Um único ponto de controle  
✅ **Manutenção simplificada** - Mudanças globais em um só lugar  
✅ **Flexibilidade máxima** - Suporta todos os layouts possíveis

### Tipos de Seção Suportados

⚠️ **IMPORTANTE:** O campo `type` na tabela `sections` foi **UNIFICADO** para `type = 'unico'`. O comportamento da seção é totalmente determinado por:
- **elements**: quais elementos estão visíveis (ícone, título, mídia, cards, etc)
- **layout**: como os elementos são posicionados (linha, alinhamento horizontal)
- **config**: conteúdo e estilos específicos (cores, tipografia, textos)

Todos os tipos antigos (`hero`, `cta`, `text_image`, `testimonials`, `tabs`, `cards_grid`) agora são renderizados pelo **mesmo sistema unificado** via função `renderUnifiedLayout()`.

✅ **Sistema totalmente unificado**  
✅ **Zero duplicação de código**  
✅ **Manutenção simplificada**  
✅ **100% flexível** - Suporta qualquer combinação de elementos

### Estrutura da Função renderUnifiedLayout

```typescript
renderUnifiedLayout({
  // Elementos visíveis na seção
  elements: {
    hasIcon: boolean,
    hasMinorTitle: boolean,      // Chamada
    hasMainTitle: boolean,        // Título principal
    hasSubtitle: boolean,
    hasButton: boolean,
    hasMedia: boolean,
    hasCards: boolean,
    hasContainer: boolean         // Container decorativo
  },
  
  // Configuração de layout
  layout: {
    desktop: {
      text: { 
        row: 'top' | 'bottom' | 'both' | 'single',
        horizontal: 'left' | 'center' | 'right',
        textAlign?: 'left' | 'center' | 'right'  // ✅ NOVO: Alinhamento interno do texto
      },
      media: { 
        row: ..., 
        horizontal: ...,
        verticalAlign?: 'top' | 'center' | 'bottom'  // ✅ NOVO: Ponto focal da imagem
      },
      cards: { row: ..., horizontal: ... }
    },
    mobile: {
      stack: 'vertical' | 'horizontal',
      textAlign: 'left' | 'center' | 'right'
    }
  },
  
  // Conteúdo a renderizar
  content: {
    icon?: string,                // Nome do ícone Lucide
    iconColor?: string,           // Hex ou token UUID
    smallTitle?: string,          // Chamada
    smallTitleStyle?: CSSProperties,
    title?: string,               // Título principal
    titleStyle?: CSSProperties,
    subtitle?: string,
    subtitleStyle?: CSSProperties,
    ctaLabel?: string,            // Texto do botão
    ctaUrl?: string,
    ctaStyle?: CSSProperties,
    mediaUrl?: string,            // URL da imagem/vídeo
    customContent?: ReactNode     // Tabs, cards, etc
  },
  
  // Número de linhas horizontais
  sectionLines: 'one' | 'two'
})
```

### Modos de Renderização

O sistema automaticamente escolhe o modo ideal baseado na configuração:

#### 1️⃣ **Layout de Duas Linhas** (`sectionLines === 'two'`)

Usado quando a seção precisa de **linha superior + linha inferior**:

```
┌─────────────────────────────────────────────┐
│  LINHA SUPERIOR (50vh)                      │
│  ┌──────────────┐  ┌──────────────┐         │
│  │   Texto      │  │    Mídia     │         │
│  │  (direita)   │  │  (esquerda)  │         │
│  └──────────────┘  └──────────────┘         │
│                                             │
│  LINHA INFERIOR                             │
│  ┌────────────────────────────────────────┐ │
│  │         Cards (centro)                  │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Quando usar:**
- Seções com `horizontalLines: 'two'`
- Texto e mídia no topo, cards/tabs embaixo
- Exemplo: "Monte seu Projeto" (CTA com cards)

#### 2️⃣ **Layout em Grid 50/50** (`sectionLines === 'one'` + mídia)

Usado para **texto + mídia lado a lado**:

```
┌─────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐         │
│  │              │  │              │         │
│  │   Texto      │  │    Mídia     │         │
│  │  (50%)       │  │   (50%)      │         │
│  │              │  │              │         │
│  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────┘
```

**Quando usar:**
- Seções Hero com mídia
- Seções Texto + Imagem
- Seções Tabs com mídia lateral

#### 3️⃣ **Layout Vertical** (padrão)

Usado quando **não há mídia** ou em **mobile**:

```
┌─────────────────────────────────────────────┐
│              Ícone                           │
│             Chamada                          │
│       Título Principal                       │
│           Subtítulo                          │
│                                              │
│      ┌──────────────────┐                   │
│      │   Custom Content │                   │
│      │  (tabs/cards)    │                   │
│      └──────────────────┘                   │
│                                              │
│           [ Botão CTA ]                      │
└─────────────────────────────────────────────┘
```

**Quando usar:**
- Seções sem mídia
- Cards Grid
- Testimonials
- Mobile (todos os layouts)

### Suporte a Cards Dinâmicos

Todas as seções podem ter **cards** associados via `section_cards`:

```typescript
// O sistema automaticamente carrega cards do banco
useEffect(() => {
  if (sectionId) {
    loadSectionCards(); // Carrega para QUALQUER tipo
  }
}, [sectionId]);

// Passa cards via customContent
const cardsCustomContent = hasCards && sectionCards.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {sectionCards.map((card) => (
      <CardRenderer key={card.id} card={card} />
    ))}
  </div>
) : null;

renderUnifiedLayout({
  elements: { hasCards: true },
  content: { customContent: cardsCustomContent },
  // ...
});
```

### Agrupamento de Elementos

O sistema agrupa automaticamente elementos relacionados:

**Grupo "Texto"** (renderizado junto):
1. Ícone (topo)
2. Chamada (`smallTitle`)
3. Título Principal (`title`)
4. Subtítulo (`subtitle`)
5. Botão CTA (rodapé)

Todos seguem o mesmo alinhamento definido em `layout.desktop.text.horizontal`.

### Responsividade Automática

O sistema garante que TODAS as seções sejam 100% responsivas:

```typescript
// Desktop: Grid 50/50
<div className="grid grid-cols-1 lg:grid-cols-2">
  <div className="px-8 lg:px-16 py-8">Texto</div>
  <div className="px-8 lg:px-16 py-8">Mídia</div>
</div>

// Mobile: Stack vertical
<div className="lg:hidden px-8 py-8">
  {/* Mídia abaixo do texto */}
</div>
```

### Regras Obrigatórias

✅ **SEMPRE** usar `renderUnifiedLayout()` para novas seções  
✅ **SEMPRE** passar `elements`, `layout`, `content`, `sectionLines`  
✅ **SEMPRE** mapear campos do config para content (smallTitle, title, etc)  
✅ **SEMPRE** preparar `customContent` para cards/tabs  
❌ **NUNCA** duplicar código de renderização  
❌ **NUNCA** hardcoded de layout (usar config do banco)

### Exemplo Completo: Tipo CTA

```typescript
if (sectionType === 'cta') {
  // 1. Extrair config
  const smallTitle = config.smallTitle || '';
  const title = config.title || '';
  const subtitle = config.subtitle || '';
  const ctaLabel = config.ctaButton?.label || '';
  const ctaUrl = config.ctaButton?.url || '';
  const mediaUrl = config.mediaUrl || '';
  
  // 2. Preparar estilos
  const titleStyle = {
    color: getTokenValue(config.titleColor, darkColor),
    ...getTypographyStyle(config.titleFontSize),
  };
  
  // 3. Preparar cards (se houver)
  const cardsCustomContent = config.elements?.hasCards ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sectionCards.map((card) => <CardRenderer key={card.id} card={card} />)}
    </div>
  ) : null;
  
  // 4. Renderizar via sistema unificado
  return renderUnifiedLayout({
    elements: config.elements,
    layout: config.layout,
    content: {
      icon: config.icon,
      iconColor: getTokenValue(config.iconColor, primaryColor),
      smallTitle,
      smallTitleStyle,
      title,
      titleStyle,
      subtitle,
      subtitleStyle,
      ctaLabel,
      ctaUrl,
      ctaStyle: buttonStyle,
      mediaUrl,
      customContent: cardsCustomContent,
    },
    sectionLines: config.horizontalLines,
  });
}
```

### Benefícios Técnicos

| Antes (Código Duplicado) | Depois (Sistema Unificado) |
|---------------------------|----------------------------|
| 6 funções separadas (renderHeroContent, renderCTAContent, etc) | 1 função (`renderUnifiedLayout`) |
| ~800 linhas de código | ~300 linhas |
| Inconsistências entre tipos | 100% consistente |
| Difícil manutenção | Fácil manutenção |
| Bugs isolados por tipo | Correção global |

---

## 📱 Sistema de Exibição de Mídia

### Modos de Exibição Disponíveis

As mídias (imagens/vídeos) dentro das seções podem ser exibidas em **5 modos diferentes**:

#### 1️⃣ Cobrir (Cover)
- **Bordas**: Quadradas (`border-radius: 0`)
- **Padding**: Nenhum (`p-0`)
- **Comportamento**: `object-cover` (preenche área completa, **pode cortar**)
- **Quando usar**: Banners fullwidth, backgrounds decorativos onde cortes são aceitáveis

#### 2️⃣ Ajustada (Contain) - PADRÃO
- **Bordas**: 2XL (`border-radius: 1.5rem / 24px`)
- **Padding**: Nenhum (`p-0`)
- **Comportamento**: `object-contain` (exibe imagem completa, **mantém proporção**)
- **Tamanho**: `width: 100%`, `height: auto`
- **Quando usar**: Maioria dos casos, imagens de produtos, fotos promocionais (padrão recomendado)

#### 3️⃣ Contida (Natural)
- **Bordas**: Quadradas (`border-radius: 0`)
- **Padding**: Nenhum (`p-0`)
- **Comportamento**: `object-contain` (tamanho natural da imagem)
- **Quando usar**: Screenshots, infográficos, diagramas técnicos onde tamanho original importa

#### 4️⃣ Adaptada ✨ **NOVO** (2026-02-17)
- **Bordas**: Quadradas (`border-radius: 0`)
- **Padding**: Nenhum (`p-0`)
- **Comportamento**: `object-contain` (se adapta à **altura do elemento de texto**)
- **Tamanho**: `height: 100%` (da linha do grid), `width: auto` (proporcional)
- **Quando usar**: Quando a **mídia deve acompanhar a altura do texto** (não o contrário)
- **Exemplo**: Grid 2×2 com texto grande à esquerda e mídia à direita que deve ter a mesma altura

#### 5️⃣ Alinhada (2026-02-16)
- **Bordas**: Quadradas (`border-radius: 0`)
- **Padding**: Nenhum (`p-0`)
- **Comportamento**: `object-contain` (sem cortes, **mantém proporção**)
- **Tamanho**: ✅ **100% da área disponível** (`maxWidth/maxHeight: 100%`) - **CORRIGIDO**
- **Alinhamento**: Usa `config.media.alignX` e `config.media.alignY` para posicionar
- **Quando usar**: Quando precisar que a mídia **cole perfeitamente nas bordas** configuradas (ex: inferior direita)

**Exemplos de Alinhamento:**
| alignX | alignY | Resultado |
|--------|--------|-----------|
| right | bottom | ✅ Mídia cola no canto inferior direito (SEM espaço) |
| left | top | ✅ Mídia cola no canto superior esquerdo (SEM espaço) |
| center | center | ✅ Mídia centralizada (SEM espaço) |

**⚠️ CORREÇÃO APLICADA (2026-02-16):**
- **Antes:** `maxHeight: 90%` → Deixava 10% de espaço vazio
- **Depois:** `maxHeight: 100%` → Cola perfeitamente nas bordas

**⚠️ IMPORTANTE:** 
- Modos 1-3 **sempre preenchem 100%** da área (w-full h-full)
- Modo 4 "Alinhada" **também preenche 100%** mas usa flex para alinhar nas bordas (SEM espaço vazio)

### Como Configurar

No modal de edição de seção (SectionBuilder):

1. Ative o toggle **"Exibir Mídia"**
2. Selecione o modo de exibição desejado:
   - 📦 **Cobrir** - Preenche área, com cortes
   - 🖼️ **Ajustada** - Exibe imagem inteira, pode ter espaço vazio (padrão)
   - 🎯 **Contida** - Tamanho real da imagem
   - 📐 **Adaptada** - Se adapta à altura do texto ✨ **NOVO**
   - ✨ **Alinhada** - Cola nas bordas configuradas (alignX/alignY)

### Estrutura no Banco de Dados

```json
{
  "elements": {
    "hasMedia": true,
    "mediaType": "image",
    "mediaDisplayMode": "alinhada"  // ou "expandida" (cover) | "ajustada" (contain) | "contida" (natural)
  },
  "config": {
    "media": {
      "fitMode": "alinhada",  // ✅ Interface usa este campo
      "alignX": "right",      // left | center | right
      "alignY": "bottom"      // top | center | bottom
    }
  }
}
```

**Mapeamento fitMode → mediaDisplayMode:**
- `fitMode: 'cobrir'` → `mediaDisplayMode: 'cobrir'` (cover)
- `fitMode: 'ajustada'` → `mediaDisplayMode: 'ajustada'` (contain) - **PADRÃO**
- `fitMode: 'contida'` → `mediaDisplayMode: 'contida'` (natural)
- `fitMode: 'adaptada'` → `mediaDisplayMode: 'adaptada'` (se adapta à altura do texto) ✨ **NOVO 2026-02-17**
- `fitMode: 'alinhada'` → `mediaDisplayMode: 'alinhada'` (cola nas bordas)

### Compatibilidade

✅ **Seções antigas** sem o campo `mediaDisplayMode` usam automaticamente o modo **"retrato"** (padrão)  
✅ **Não é necessário migrar** dados existentes  
✅ O modo pode ser alterado a qualquer momento via interface admin

### Regras de Uso

- ✅ **SEMPRE** selecionar o modo adequado ao tipo de conteúdo
- ✅ **Modo Cobrir** quando quiser preencher 100% da área (pode ter cortes)
- ✅ **Modo Ajustada** (padrão) quando quiser exibir imagem completa (pode ter espaço vazio)
- ✅ **Modo Contida** para tamanho real da imagem
- ✅ **Modo Adaptada** ✨ quando a **mídia deve ter a altura do texto** (grid 2×2 com texto à esquerda)
- ✅ **Modo Alinhada** quando quiser colar a mídia em bordas específicas (inferior, direita, etc)
- ✅ **Proporção SEMPRE mantida** - todos os modos usam `object-contain` ou `object-cover`
- ❌ **NUNCA** adicionar padding/margin à mídia (sempre `p-0`)

### Exemplo de Uso: Modo Adaptada

**Cenário:** Seção com grid 2×2, texto grande à esquerda, mídia à direita

**Configuração:**
1. Grid: 2 colunas, 2 linhas
2. Altura: `auto`
3. Texto: `top-left`
4. Mídia: `top-right`
5. **Modo de Exibição:** `adaptada` ✨

**Resultado:**
- ✅ Texto define a altura da linha 1
- ✅ Mídia se adapta à altura do texto (não o contrário)
- ✅ Largura da mídia é proporcional à imagem original
- ✅ Seção tem altura total = texto + linha 2 (se houver)

---

## 📋 Sistema de Menu e Megamenu (Header)

### Visão Geral

O sistema de menu é composto por **3 tabelas principais**:

1. **`menu_items`** - Itens do menu principal (header)
2. **`menu_cards`** - Cards reutilizáveis exibidos nos megamenus
3. **`design_tokens`** - Tokens de cores e tipografia

### Estrutura: `menu_items` (Header Principal)

| Campo | Tipo | Descrição | Editável |
|-------|------|-----------|----------|
| `id` | UUID | Identificador único | ❌ |
| `label` | TEXT | Texto do botão do menu | ✅ |
| `label_color_token` | UUID | Cor do label (FK → design_tokens) | ✅ |
| `icon` | TEXT | Nome do ícone Lucide (opcional) | ✅ |
| `order` | INTEGER | Ordem de exibição (drag-and-drop) | ✅ |
| `megamenu_config` | JSONB | Configuração completa do megamenu | ✅ |
| `created_at` | TIMESTAMP | Data de criação | ❌ |
| `updated_at` | TIMESTAMP | Data de atualização | ❌ |

#### Estrutura do `megamenu_config` (JSONB)

```json
{
  "enabled": true,
  "bgColor": "#e5d4d4",
  "mediaPosition": "left",
  "columns": [
    {
      "id": "col1",
      "title": "SOBRE A BEMDITO",
      "titleColor": "dark",
      "titleFontSize": "body-small",
      "titleFontWeight": 600,
      "mainTitle": "Conheça nossa história",
      "mainTitleColor": "dark",
      "mainTitleFontSize": "heading-3",
      "mainTitleFontWeight": 700,
      "media_url": "https://images.unsplash.com/...",
      "card_ids": [
        "44444444-4444-4444-4444-444444444441",
        "44444444-4444-4444-4444-444444444442"
      ]
    }
  ],
  "footer": {
    "text": "Ver todos os serviços →",
    "url": "/servicos"
  }
}
```

⚠️ **ATUALIZAÇÃO 2026-02-08:** `bgColor` e `mediaPosition` foram movidos para o **nível raiz** do config (aplicados a todo o megamenu). Colunas individuais não têm mais esses campos, exceto `mediaPosition` que pode sobrescrever a posição global opcionalmente.

**Campos do Megamenu Config:**

| Campo | Tipo | Descrição | Editável |
|-------|------|-----------|----------|
| `enabled` | boolean | Sempre true (megamenus sempre ativos) | ❌ |
| `bgColor` | string (hex) | Cor de fundo do megamenu | ✅ (Aba "Geral") |
| `mediaPosition` | 'left' \| 'right' | Posição padrão da mídia | ✅ (Aba "Geral") |
| `columns` | Array | Colunas do megamenu (max 4) | ✅ |
| `columns[].id` | string | ID da coluna | ❌ |
| `columns[].title` | string | Título pequeno (chamada) | ✅ (Modal) |
| `columns[].titleColor` | string (UUID) | Cor do título pequeno | ✅ (Modal) |
| `columns[].titleFontSize` | string (UUID) | Tamanho da fonte do título pequeno | ✅ (Modal) |
| `columns[].titleFontWeight` | number | Peso da fonte do título pequeno | ✅ (Modal) |
| `columns[].mainTitle` | string | Título principal | ✅ (Modal) |
| `columns[].mainTitleColor` | string (UUID) | Cor do título principal | ✅ (Modal) |
| `columns[].mainTitleFontSize` | string (UUID) | Tamanho da fonte do título principal | ✅ (Modal) |
| `columns[].mainTitleFontWeight` | number | Peso da fonte do título principal | ✅ (Modal) |
| `columns[].media_url` | string | URL da imagem/vídeo | ✅ (Modal) |
| `columns[].card_ids` | Array<UUID> | IDs dos cards associados | ✅ (Seletor) |
| `footer` | object | Footer opcional | ✅ |
| `footer.text` | string | Texto do link | ✅ |
| `footer.url` | string | URL do link | ✅ |

### Estrutura: `menu_cards` (Cards do Megamenu)

| Campo | Tipo | Descrição | Editável |
|-------|------|-----------|----------|
| **Identificação** ||||
| `id` | UUID | Identificador único | ❌ |
| `name` | TEXT | Nome interno do card | ✅ |
| `is_global` | BOOLEAN | Se é reutilizável (padrão: true) | ✅ |
| **Ícone** ||||
| `icon` | TEXT | Nome do ícone Lucide | ✅ (Modal) |
| `icon_size` | INTEGER | Tamanho em pixels (padrão: 28) | ✅ (Modal) |
| `icon_color_token` | UUID | Cor do ícone (FK → design_tokens) | ✅ (Modal) |
| **Título** ||||
| `title` | TEXT | Texto do título | ✅ (Modal) |
| `title_font_size` | UUID | Tamanho da fonte (FK → design_tokens) | ✅ (Modal) |
| `title_font_weight` | INTEGER | Peso da fonte (padrão: 600) | ✅ (Modal) |
| `title_color_token` | UUID | Cor do título (FK → design_tokens) | ✅ (Modal) |
| **Subtítulo** ||||
| `subtitle` | TEXT | Texto do subtítulo | ✅ (Modal) |
| `subtitle_font_size` | UUID | Tamanho da fonte (FK → design_tokens) | ✅ (Modal) |
| `subtitle_font_weight` | INTEGER | Peso da fonte (padrão: 400) | ✅ (Modal) |
| `subtitle_color_token` | UUID | Cor do subtítulo (FK → design_tokens) | ✅ (Modal) |
| **Link** ||||
| `url` | TEXT | URL de destino | ✅ (Modal) |
| `url_type` | TEXT | 'internal' \| 'external' | ✅ (Modal) |
| **Visual** ||||
| `bg_color_token` | UUID | Cor de fundo (opcional) | ✅ |
| `border_color_token` | UUID | Cor da borda (opcional) | ✅ |
| **Tabs (opcional)** ||||
| `tabs` | JSONB | Array de tabs (padrão: []) | ✅ |
| `active_tab_id` | TEXT | ID da tab ativa | ✅ |
| `tab_bg_color_token` | UUID | Cor de fundo das tabs | ✅ |
| `tab_border_color_token` | UUID | Cor da borda das tabs | ✅ |
| **Metadata** ||||
| `created_at` | TIMESTAMP | Data de criação | ❌ |
| `updated_at` | TIMESTAMP | Data de atualização | ❌ |

### Valores Padrão (Migration SQL)

**Menu Cards:**
```sql
icon_size: 28
title_font_weight: 600
subtitle_font_weight: 400
title_font_size: → UUID do token "body-base"
subtitle_font_size: → UUID do token "body-small"
```

**Megamenu Columns:**
```json
{
  "titleFontWeight": 600,
  "mainTitleFontWeight": 700,
  "titleFontSize": "body-small",
  "mainTitleFontSize": "heading-3",
  "bgColor": "#e5d4d4",
  "mediaPosition": "left"
}
```

### Sistema de Edição Inline (Megamenu Configurator)

**Como funciona:**
1. Usuário clica em qualquer elemento do preview (título, ícone, mídia, etc)
2. Modal específico abre com campos editáveis
3. Usuário edita os valores
4. Clica em **"Salvar"**
5. Sistema salva no banco via `UPDATE`
6. Recarrega os dados com `loadCards()`
7. Preview atualiza automaticamente

**Elementos Clicáveis:**
- ✏️ **Título Pequeno** (chamada) → `EditTextModal`
- ✏️ **Título Principal** → `EditTextModal`
- ✏️ **Mídia** → `EditMediaModal` (Unsplash search)
- ✏️ **Ícone do Card** → `EditCardIconModal` (ícone + tamanho + cor)
- ✏️ **Título do Card** → `EditCardTextModal` (texto + fonte + peso + cor + URL)
- ✏️ **Subtítulo do Card** → `EditCardTextModal` (texto + fonte + peso + cor + URL)

**Arquivos Principais:**
- `/src/app/admin/menu-manager/MegamenuConfigurator.tsx` - Preview e lógica
- `/src/app/admin/menu-manager/MegamenuEditModals.tsx` - Modais de edição

### Fluxo de Salvamento (Com Logs)

```typescript
// 1. Modal abre com estado local
useEffect(() => {
  if (open) {
    console.log('🔵 [Modal] Abriu com valores:', value);
    setLocalValue(value);
  }
}, [open, value]);

// 2. Usuário edita campos
onChange={(newValue) => {
  console.log('🟡 [Modal] Campo alterado:', newValue);
  setLocalValue({ ...localValue, [field]: newValue });
}}

// 3. Usuário clica em "Salvar"
const handleSave = async () => {
  console.log('🟢 [Modal] handleSave chamado!');
  console.log('🟢 [Modal] localValue:', localValue);
  
  // 4. Chama onChange passado como prop
  await onChange(localValue);
  
  console.log('✅ [Modal] onChange completou!');
  onOpenChange(false);
};

// 5. MegamenuConfigurator recebe onChange
onChange={async (updates) => {
  console.log('🟠 [Configurator] onChange chamado!');
  console.log('🟠 [Configurator] Updates:', updates);
  
  // 6. Atualiza no banco
  await handleUpdateCard(cardId, {
    icon: updates.icon,
    icon_color_token: updates.iconColor,
    icon_size: updates.iconSize,
  });
}}

// 7. handleUpdateCard salva no Supabase
const handleUpdateCard = async (cardId: string, updates: Partial<MenuCard>) => {
  console.log('🔷 [Configurator] handleUpdateCard chamado!');
  console.log('🔷 Card ID:', cardId);
  console.log('🔷 Updates:', updates);
  
  const { error } = await supabase
    .from('menu_cards')
    .update(updates)
    .eq('id', cardId);

  if (error) {
    console.error('❌ Erro:', error);
  } else {
    console.log('✅ Card atualizado!');
    await loadCards(); // Recarrega cards
    console.log('✅ Cards recarregados!');
  }
};
```

### Regras de Uso

✅ **SEMPRE** usar modais para edição inline  
✅ **SEMPRE** salvar no banco antes de fechar o modal  
✅ **SEMPRE** recarregar dados após salvamento (`loadCards()`)  
✅ **SEMPRE** usar tokens UUID ao invés de cores hardcoded  
✅ **SEMPRE** validar que as colunas `icon_size`, `title_font_size`, etc existem no banco  
❌ **NUNCA** editar múltiplos campos sem salvar entre eles  
❌ **NUNCA** fechar o modal sem salvar (usar botão "Cancelar" para descartar)  
❌ **NUNCA** usar `type` no lugar de `category` ao buscar tokens tipográficos

### Troubleshooting

**Erro: "Could not find the 'icon_size' column"**
- **Causa**: Coluna não existe na tabela `menu_cards`
- **Solução**: Executar migration SQL em `/EXECUTE_SQL.sql`

**Erro: "column 'type' does not exist"**
- **Causa**: Tentativa de buscar token com `WHERE type = 'typography'`
- **Solução**: Usar `WHERE category = 'typography'`

**Preview não atualiza após salvar**
- **Causa**: `loadCards()` não foi chamado após `UPDATE`
- **Solução**: Adicionar `await loadCards()` após salvamento

**Cores não aparecem**
- **Causa**: Token UUID inválido ou token deletado
- **Solução**: Verificar se token existe em `design_tokens`

---

## 🎯 Sistema de Hover e Timeout do Megamenu

### Visão Geral

O megamenu no header desktop usa um sistema inteligente de hover com **timeout de 1000ms (1 segundo)** para garantir excelente UX mesmo com movimentos lentos do mouse.

### Funcionamento Técnico

#### Timeout Inteligente com Closure

O sistema usa **JavaScript closure** para capturar o ID do item no momento do evento e só fecha o megamenu se aquele item específico ainda estiver ativo:

```tsx
onMouseLeave={() => {
  const currentItemId = item.id; // ✅ Captura ID no momento do evento
  if (leaveTimeout) clearTimeout(leaveTimeout);
  setLeaveTimeout(setTimeout(() => {
    // ✅ Só fecha se o item atual ainda é o mesmo
    setHoveredItem(prev => prev === currentItemId ? null : prev);
  }, 1000)); // 1 segundo de tolerância
}}
```

#### Cancelamento de Timeout em 3 Pontos

**1️⃣ No Container do Item de Menu**
```tsx
onMouseEnter={() => {
  if (hasMegamenu) {
    setHoveredItem(item.id);
    // ✅ Cancelar timeout se existir
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
      setLeaveTimeout(null);
    }
  }
}}
```

**2️⃣ No Botão do Menu**
```tsx
onMouseEnter={(e) => {
  e.currentTarget.style.color = primaryColor;
  // ✅ Cancelar timeout também ao entrar no botão
  if (leaveTimeout) {
    clearTimeout(leaveTimeout);
    setLeaveTimeout(null);
  }
}}
```

**3️⃣ No Container do Megamenu**
```tsx
onMouseEnter={() => {
  if (leaveTimeout) {
    clearTimeout(leaveTimeout);
    setLeaveTimeout(null);
  }
}}
```

### Fluxo Completo

```
1. Mouse entra no botão "Serviços"
   ↓ Timeout cancelado (se existia)
   ↓ hoveredItem = "servicos-id"
   ↓
2. Megamenu abre (renderizado via position: fixed)
   ↓
3. Mouse sai do botão
   ↓ Timeout iniciado (1000ms) para fechar "servicos-id"
   ↓
4. Mouse entra no megamenu
   ↓ Timeout cancelado
   ↓
5. Usuário clica em um card
   ↓ ✅ Navegação funciona perfeitamente
   ↓
6. Mouse sai do megamenu
   ↓ Novo timeout iniciado (1000ms)
   ↓
7. Mouse entra em "Sobre"
   ↓ hoveredItem = "sobre-id"
   ↓ Timeout antigo executa mas falha a condição
   ↓ (prev = "sobre-id" ≠ "servicos-id")
   ↓ ✅ Megamenu de "Sobre" permanece aberto
```

### Cenários Cobertos

| Cenário | Comportamento | Status |
|---------|---------------|--------|
| Mouse no botão (parado) | Megamenu permanece aberto | ✅ |
| Mouse no botão (movendo) | Megamenu permanece aberto | ✅ |
| Mouse no megamenu | Megamenu permanece aberto | ✅ |
| Mouse entre botão e megamenu | Tolerância de 1s | ✅ |
| Troca rápida de botões | Novo megamenu abre corretamente | ✅ |
| Mouse sai de tudo | Megamenu fecha após 1s | ✅ |
| Clicar em card | Navegação funciona | ✅ |

### Regras de Implementação

✅ **SEMPRE** usar closure para capturar `item.id` no momento do evento  
✅ **SEMPRE** cancelar timeout ao entrar no botão, container ou megamenu  
✅ **SEMPRE** usar comparação condicional no callback do timeout  
✅ **SEMPRE** usar `position: fixed` no megamenu (fora do fluxo DOM)  
✅ **SEMPRE** testar troca rápida entre múltiplos botões  
❌ **NUNCA** usar `setHoveredItem(null)` direto sem verificar ID  
❌ **NUNCA** esquecer de cancelar timeout ao entrar em área interativa  
❌ **NUNCA** usar timeouts menores que 800ms (UX ruim)

### Troubleshooting

**Problema: Megamenu fecha ao ficar parado no botão**
- **Causa**: Falta `clearTimeout` no `onMouseEnter` do botão
- **Solução**: Adicionar cancelamento de timeout no botão

**Problema: Megamenu fecha ao trocar de botão**
- **Causa**: Timeout não verifica ID antes de fechar
- **Solução**: Usar closure + comparação condicional

**Problema: Megamenu não fecha ao sair**
- **Causa**: Timeout não está sendo iniciado no `onMouseLeave`
- **Solução**: Verificar se `setTimeout` está sendo chamado

**Problema: Click em card não funciona**
- **Causa**: Timeout fecha megamenu antes do click
- **Solução**: Adicionar `clearTimeout` no `onMouseEnter` do megamenu

### Valor do Timeout

**Configuração atual:** `1000ms` (1 segundo)

**Histórico de valores testados:**
- `200ms` - ❌ Muito rápido (impossível acessar megamenu)
- `400ms` - 🟡 Melhor mas ainda insuficiente
- `600ms` - 🟢 Bom mas pode ser mais confortável
- `1000ms` - ✅ **IDEAL** (UX profissional)

**Por que 1000ms é ideal:**
- ✅ Usuários com movimentos lentos conseguem acessar
- ✅ Não parece "travado" (fecha rápido ao sair)
- ✅ Permite navegação tranquila entre botões
- ✅ Padrão usado por sites profissionais (Amazon, GitHub, etc)

---

## 📁 Sistema de Upload de Mídia

### Visão Geral

O componente **MediaUploader** gerencia upload, listagem e seleção de imagens e vídeos integrado ao Supabase Storage no bucket privado `make-72da2481-media`.

### Funcionalidades

✅ **Drag-and-Drop** - Arraste arquivos diretamente para upload  
✅ **Biblioteca de Mídias** - Visualize thumbnails de todos os arquivos  
✅ **Preview em Tempo Real** - Veja a mídia selecionada antes de salvar  
✅ **Signed URLs** - URLs privadas com validade de 1 ano  
✅ **Exclusão de Arquivos** - Remova mídias não utilizadas  
✅ **Validação de Tamanho** - Limite configurável (padrão: 10MB)  
✅ **Suporte a Imagens e Vídeos** - jpg, png, gif, mp4, webm, ogg

### Como Usar

```tsx
import { MediaUploader } from '@/app/components/admin/MediaUploader';

function MyComponent() {
  const [mediaUrl, setMediaUrl] = useState('');

  return (
    <MediaUploader
      label="Mídia (Imagem/Vídeo)"
      value={mediaUrl}
      onChange={(url) => setMediaUrl(url)}
      accept="image/*,video/*"
      maxSizeMB={10}
    />
  );
}
```

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `label` | string | "Mídia (Imagem/Vídeo)" | Label do campo |
| `value` | string | "" | URL atual da mídia |
| `onChange` | (url: string) => void | - | Callback ao selecionar/fazer upload |
| `accept` | string | "image/*,video/*" | Tipos de arquivo aceitos |
| `maxSizeMB` | number | 10 | Tamanho máximo em MB |

### Estrutura do Bucket

```
make-72da2481-media/
└── media/
    ├── 1707427427899-jluvsc.png
    ├── 1707427450123-abc123.jpg
    └── 1707427500987-xyz789.mp4
```

**Nomenclatura:** `{timestamp}-{randomStr}.{ext}`

### Fluxo de Upload

1. **Usuário** arrasta arquivo ou clica para selecionar
2. **Validação** de tamanho (máx: 10MB padrão)
3. **Upload** para `make-72da2481-media/media/{filename}`
4. **Geração** de signed URL (válida por 1 ano)
5. **Callback** `onChange(url)` com a signed URL
6. **Atualização** da biblioteca automaticamente

### Fluxo de Seleção

1. **Usuário** clica em "Escolher da Biblioteca"
2. **Biblioteca** carrega thumbnails do bucket
3. **Usuário** clica em um arquivo
4. **Callback** `onChange(url)` com a signed URL existente
5. **Preview** é exibido imediatamente

### Fluxo de Exclusão

1. **Usuário** passa mouse sobre thumbnail
2. **Botão deletar** aparece (ícone lixeira)
3. **Confirmação** "Tem certeza?"
4. **Exclusão** do arquivo no bucket via `.remove()`
5. **Atualização** da biblioteca automaticamente

### Regras de Uso

✅ **SEMPRE** usar `MediaUploader` ao invés de `<Input type="text">` para URLs de mídia  
✅ **SEMPRE** validar que o bucket existe antes do deploy (ver `/EXECUTE_SQL.sql`)  
✅ **SEMPRE** usar signed URLs (bucket é privado)  
✅ **SEMPRE** passar `onChange` para capturar a URL selecionada  
❌ **NUNCA** usar URLs públicas diretas (bucket é privado)  
❌ **NUNCA** fazer upload sem validação de tamanho  
❌ **NUNCA** deletar arquivos sem confirmação do usuário

### Políticas de Storage

**Bucket:** `make-72da2481-media` (privado)

**Políticas:**
```sql
-- Permitir uploads com chave anônima (frontend)
CREATE POLICY "Permitir uploads públicos" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'make-72da2481-media');

-- Permitir leitura com chave anônima
CREATE POLICY "Permitir leitura pública" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'make-72da2481-media');

-- Permitir exclusão com chave anônima
CREATE POLICY "Permitir exclusão pública" ON storage.objects
FOR DELETE TO anon
USING (bucket_id = 'make-72da2481-media');

-- Fallback para usuários autenticados
CREATE POLICY "Permitir uploads autenticados v2" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'make-72da2481-media');

CREATE POLICY "Permitir leitura autenticada v2" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'make-72da2481-media');

CREATE POLICY "Permitir exclusão autenticada v2" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'make-72da2481-media');
```

### Troubleshooting

**Erro: "Bucket does not exist"**
- **Causa**: Bucket `make-72da2481-media` não foi criado
- **Solução**: Executar migration SQL em `/EXECUTE_SQL.sql`

**Erro: "Row level security policy violation"**
- **Causa**: Políticas de RLS não configuradas
- **Solução**: Verificar se as 3 políticas foram criadas (INSERT, SELECT, DELETE)

**Upload falha silenciosamente**
- **Causa**: Arquivo maior que limite configurado
- **Solução**: Verificar console browser, aumentar `maxSizeMB` se necessário

**Thumbnails não carregam**
- **Causa**: Signed URLs expiradas ou inválidas
- **Solução**: Componente regenera signed URLs automaticamente ao abrir biblioteca

### Exemplo: Integração com Megamenu

```tsx
<MediaUploader
  label="URL da Mídia (Imagem/Vídeo)"
  value={column.media_url}
  onChange={(url) => handleUpdateColumn({ media_url: url })}
  accept="image/*,video/*"
  maxSizeMB={10}
/>
```

### Tipos de Arquivo Suportados

**Imagens:**
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.svg`

**Vídeos:**
- `.mp4`
- `.webm`
- `.ogg`

---

## 📦 Sistema de Card Templates (para Seções)

### Visão Geral

O sistema de **Card Templates** permite criar conjuntos reutilizáveis de cards com formatação consistente para usar nas seções do site. Diferente dos cards do megamenu (que têm estrutura fixa), os card templates são completamente customizáveis.

**Diferenças-chave:**
- **Menu Cards** (megamenu): 1 coluna fixa com 4 cards + 1 mídia
- **Template Cards** (seções): Grid responsivo, filtros/tabs, formatação customizável

---

### ✅ Estado Atual do Schema (Auditoria 2026-02-24)

#### Tabelas Ativas (v_database_stats)

| tabela | total | notas |
|---|---|---|
| card_filters | 4 | filtros do template "Serviços BemDito" |
| card_templates | 3 | BemDito Features, Marketing Digital Cards, Serviços BemDito |
| template_cards | 15 | cards dos 3 templates |
| design_tokens | 114 | tokens de cor, tipografia e admin-ui |
| menu_cards | 22 | cards do megamenu (sistema separado) |
| menu_items | 4 | itens do menu principal |
| sections | 10 | seções das páginas públicas |

> ⚠️ A tabela `section_template_cards` foi **removida** em 2026-02-24 (estava vazia e sem uso). A view `v_database_stats` foi recriada sem ela.

---

#### Schema de `card_templates` (54 colunas confirmadas 2026-02-24)

| Grupo | Coluna | Tipo | Default | FK |
|---|---|---|---|---|
| **ID** | id | uuid | uuid_generate_v4() | — |
| | name | text | — | — |
| | variant | text | — | grid \| list \| masonry \| scroll-reveal \| carousel |
| | config | jsonb | {} | — |
| | is_global | boolean | false | — |
| | created_at | timestamptz | now() | — |
| | updated_at | timestamptz | now() | — |
| **Grid** | columns_desktop | integer | 3 | — |
| | columns_tablet | integer | 2 | — |
| | columns_mobile | integer | 1 | — |
| | gap | text | 'md' | — |
| **Card visual** | card_bg_color_token | uuid | null | design_tokens.id ✅ |
| | card_border_color_token | uuid | null | design_tokens.id ✅ |
| | card_border_radius | text | '2xl' | — |
| | card_border_width | integer | 1 | — |
| | card_padding | text | 'md' | — |
| | card_shadow | text | 'md' | — |
| **Ícone** | has_icon | boolean | true | — |
| | icon_size | integer | 32 | — |
| | icon_color_token | uuid | null | design_tokens.id ✅ |
| | icon_bg_color_token | uuid | null | design_tokens.id ✅ |
| | icon_position | text | 'top' | top \| left |
| **Título** | has_title | boolean | true | — |
| | title_font_size | uuid | null | design_tokens.id ✅ |
| | title_font_weight | integer | 600 | — |
| | title_color_token | uuid | null | design_tokens.id ✅ |
| **Subtítulo** | has_subtitle | boolean | true | — |
| | subtitle_font_size | uuid | null | design_tokens.id ✅ |
| | subtitle_font_weight | integer | 400 | — |
| | subtitle_color_token | uuid | null | design_tokens.id ✅ |
| **Mídia** | has_media | boolean | false | — |
| | media_position | text | 'top' | top \| left \| right |
| | media_aspect_ratio | text | '16/9' | — |
| | media_border_radius | text | '2xl' | — |
| | media_opacity | integer | 100 | 0–100 (CHECK) |
| | example_media_url | text | null | — |
| **Link** | has_link | boolean | true | — |
| | link_style | text | 'card' | — |
| | link_text_color_token | uuid | null | design_tokens.id ✅ |
| **Filtros** | has_filters | boolean | false | — |
| | filters_position | text | 'top' | top \| left |
| | filter_button_bg_color_token | uuid | null | design_tokens.id ✅ |
| | filter_button_text_color_token | uuid | null | design_tokens.id ✅ |
| | filter_button_border_color_token | uuid | null | design_tokens.id ✅ |
| | filter_active_bg_color_token | uuid | null | design_tokens.id ✅ |
| | filter_active_text_color_token | uuid | null | design_tokens.id ✅ |
| | filter_active_border_color_token | uuid | null | design_tokens.id ✅ |

#### Schema de `card_filters` (7 colunas)

| Coluna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| template_id | uuid | FK → card_templates.id |
| label | text | nome exibido nos botões |
| slug | text | identificador (UNIQUE com template_id) |
| icon | text | ícone Lucide opcional |
| order_index | integer | default 0 |
| created_at | timestamptz | — |

> ⚠️ `card_filters` **não tem `updated_at`** (diferente de `card_templates` e `template_cards`). Não é crítico mas é uma inconsistência.

#### Schema de `template_cards` (13 colunas)

| Coluna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| template_id | uuid | FK → card_templates.id |
| icon | text | nome Lucide |
| title | text | — |
| subtitle | text | — |
| media_url | text | Supabase Storage ou URL externa |
| media_opacity | integer | 0–100, **override por card** |
| link_url | text | — |
| link_type | text | internal \| external |
| filter_id | uuid | FK → card_filters.id |
| filter_tags | text[] | array multi-filtro (não usado atualmente) |
| order_index | integer | default 0 |
| created_at / updated_at | timestamptz | — |

---

### ✅ SQL Executado — 2026-02-24

```sql
-- ✅ EXECUTADO COM SUCESSO em 2026-02-24
ALTER TABLE card_templates
ADD CONSTRAINT fk_card_templates_icon_bg_color_token
FOREIGN KEY (icon_bg_color_token) REFERENCES design_tokens(id) ON DELETE SET NULL;
```

Todas as 14 colunas UUID de tokens em `card_templates` agora possuem FK constraint para `design_tokens(id)`.

---

### Hierarquia de `media_opacity` (ordem de precedência)

```
card.media_opacity          → valor específico do card
  ?? card._template.media_opacity   → default do template
    ?? 100                          → fallback global
```

- **`card_templates.media_opacity`** → define o padrão para **novos cards** criados naquele template
- **`template_cards.media_opacity`** → override por card individual
- **`CardRenderer.tsx`** aplica: `card.media_opacity ?? card._template?.media_opacity ?? 100`

---

### Regras Obrigatórias do Sistema de Card Templates

✅ **SEMPRE** executar o SQL da FK constraint acima antes de usar `icon_bg_color_token`  
✅ **SEMPRE** configurar `icon_bg_color_token` via aba Design → Ícone → "Cor de Fundo do Ícone"  
✅ **SEMPRE** que `icon_position = 'left'`, o `CardRenderer` usa `iconBgColor` como fundo arredondado do ícone  
✅ **SEMPRE** lembrar que `card_filters` não tem `updated_at` — não incluir em queries de comparação temporal  
✅ **SEMPRE** usar `variant: 'scroll-reveal'` para templates com efeito de entrada sequencial  
✅ **SEMPRE** usar `media_opacity` no template para definir o default herdado pelos novos cards  
❌ **NUNCA** usar `figma:asset/` em `media_url` de cards (não funciona em runtime — usar Supabase Storage)  
❌ **NUNCA** adicionar `section_template_cards` de volta — foi removida, não é mais usada  
❌ **NUNCA** assumir que `card.media_opacity` sempre tem valor — usar o fallback de 3 níveis

### ⚠️ LIMITAÇÃO IMPORTANTE: URLs de Mídia

**Tipos de URL suportados:**
- ✅ **Supabase Storage** (signed URLs via MediaUploader)
- ✅ **URLs Externas** (Unsplash, CDNs públicos)
- ❌ **figma:asset/** (NÃO SUPORTADO - apenas para imports estáticos)

**Por que figma:asset não funciona em runtime?**

O esquema `figma:asset/` é um **módulo virtual do build system** que só funciona em imports estáticos no TypeScript:

```tsx
// ✅ CORRETO (import estático)
import img from "figma:asset/abc123.png";
<img src={img} />

// ❌ INCORRETO (URL dinâmica do banco)
<img src="figma:asset/abc123.png" /> // ERR_UNKNOWN_URL_SCHEME
```

**Solução:**

1. **Use MediaUploader** para fazer upload da imagem no Supabase Storage
2. O componente gera automaticamente uma **signed URL válida**
3. Salve essa URL no banco de dados

**Exemplo:**
```tsx
// No modal de edição do card
<MediaUploader
  label="Mídia do Card"
  value={card.media_url}
  onChange={(url) => handleUpdate({ media_url: url })}
  accept="image/*,video/*"
  maxSizeMB={10}
/>
```

**Tratamento de Erros:**

O `CardRenderer.tsx` detecta automaticamente URLs inválidas e exibe mensagem amigável:

```tsx
// ✅ Validação automática
{card.media_url?.startsWith('figma:asset/') ? (
  <div className="bg-gray-100 rounded-2xl p-4">
    ⚠️ Mídia não disponível
    <span className="text-xs">Use Supabase Storage ou URLs externas</span>
  </div>
) : (
  <img src={card.media_url} alt={card.title} />
)}
```

**Console Warning:**

Quando detectado, o sistema loga warning detalhado:

```
⚠️ [CardRenderer] Card contém URL figma:asset que não é suportada em runtime:
   Card ID: ef57406e-3230-4d0a-9994-f8cd422e173d
   Title: 3.2 bilhões
   Media URL: figma:asset/ebd534cd23cc73b3dcc2b08a18b900851929785f.png
   Solução: Use MediaUploader para fazer upload no Supabase Storage ou use URLs externas.
```

### Arquitetura (4 Tabelas)

1. **`card_templates`** - Define formatação/estilo compartilhado
2. **`card_filters`** - Filtros/tabs para categorizar cards
3. **`template_cards`** - Cards individuais que pertencem a um template
4. **`section_template_cards`** - Vincula templates às seções

### 🎨 Sistema de 3 Camadas para Renderização de Cards

**ATUALIZAÇÃO 2026-02-10:** Cards agora renderizam mídia como **background** ao invés de elemento separado.

#### Estrutura de Camadas (de trás para frente):

```tsx
<div className="relative min-h-[300px]">
  {/* 🔵 CAMADA 1: Cor de fundo sólida (atrás de tudo) */}
  <div 
    className="absolute inset-0 rounded-[1.5rem]"
    style={{ backgroundColor: bgColor }} // Token UUID do template
  />
  
  {/* 🖼️ CAMADA 2: Mídia com opacidade configurável */}
  <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden">
    <img
      src={card.media_url}
      style={{ opacity: mediaOpacity / 100 }} // 0-100%
      className="w-full h-full object-cover"
    />
  </div>
  
  {/* 📝 CAMADA 3: Conteúdo (texto, ícone) acima de tudo */}
  <div className="relative z-10 p-6">
    {/* Ícone, título, subtítulo */}
  </div>
</div>
```

#### Campo `media_opacity` (Templates)

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `media_opacity` | INTEGER | 100 | Opacidade da mídia de background (0-100%) |

**Valores:**
- **100%** - Imagem totalmente opaca (cobre cor de fundo)
- **50%** - Imagem semi-transparente (cor de fundo visível por trás)
- **0%** - Apenas cor de fundo (imagem invisível)

**Onde configurar:**
- Interface: `/admin/cards-manager`
- Modal: Editar Template → Tab "Design" → Seção "Mídia" → Slider "Opacidade da Mídia"

**Migration SQL:**
```sql
ALTER TABLE card_templates ADD COLUMN media_opacity INTEGER DEFAULT 100;
ALTER TABLE card_templates ADD CONSTRAINT media_opacity_range CHECK (media_opacity >= 0 AND media_opacity <= 100);
```

#### Regras de Uso

✅ **SEMPRE** definir `card_bg_color_token` (camada 1 - cor de fundo)  
✅ **SEMPRE** usar `media_url` para imagens de background (camada 2)  
✅ **SEMPRE** ajustar `media_opacity` para controlar visibilidade da cor de fundo  
✅ **SEMPRE** garantir contraste suficiente entre background e texto (camada 3)  
❌ **NUNCA** usar `figma:asset/` em URLs (não funciona em runtime)  
❌ **NUNCA** hardcoded cores de fundo (usar tokens)

#### Exemplo Prático

**Cenário:** Card com fundo roxo e imagem semi-transparente

1. **Configurar no Admin:**
   - Cor de fundo: Token "Secondary" (#2e2240)
   - Mídia: Upload via MediaUploader
   - Opacidade: 60% (para ver o roxo através da imagem)

2. **Resultado Visual:**
   ```
   🔵 Fundo roxo sólido (#2e2240)
   ↓
   🖼️ Imagem com 60% de opacidade (deixa roxo aparecer)
   ↓
   📝 Texto branco com z-10 (sempre visível)
   ```

### Interface: /admin/cards-manager

Acesse: [http://localhost:3000/admin/cards-manager](http://localhost:3000/admin/cards-manager)

**Funcionalidades:**
- ✅ Criar/editar/duplicar/excluir templates
- ✅ Gerenciar filtros (tabs/categorias)
- ✅ Gerenciar cards individuais
- ✅ Preview em tempo real com filtros funcionais
- ✅ Drag-and-drop para reordenar (próxima implementação)

### Dados de Exemplo (Seed Executado)

**Template:** "Marketing Digital Cards" (grid, 3 colunas)  
**Filtros:** Todos, Marketing Digital, Branding, Conteúdo  
**Cards:** 9 cards distribuídos entre os filtros

Para documentação completa do schema (42 colunas), consulte: [/EXECUTE_SQL.sql](/EXECUTE_SQL.sql)

---

**Última atualização:** 2026-02-08  
**Mantido por:** Equipe BemDito CMS  
**Versão do Design System:** 1.0