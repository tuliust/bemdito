# 🔲 Sistema de Grid 2×2 - BemDito CMS

**Versão:** 1.0  
**Data:** 2026-02-17  
**Status:** 📘 Documentação Canônica

---

## 🎯 Visão Geral

Sistema completo de grid 2×2 para seções, incluindo auto-fix de gridRows, altura auto com linha 2 visível, posicionamento de elementos, e correção de grid duplicado.

**Arquivos Consolidados:**
- `__GRID_AUTO_HEIGHT_ROW2_FIX_2026-02-17.md` ⭐ Principal
- `__AUTO_FIX_GRIDROWS_2026-02-15.md`
- `__GRID_DUPLICADO_FIX_2026-02-16.md`
- `__FIX_GRID_2X2_CARDS_POSITION_2026-02-17.md`
- `__FIX_GRID_2X2_THREE_ELEMENTS_2026-02-17.md`

---

## 🔴 PROBLEMA CRÍTICO 1: Seções com Altura Auto - Linha 2 Não Aparecia

### Sintomas

- ✅ Grid configurado: `grid-template-rows: auto auto`
- ✅ Elementos posicionados: `grid-area: 1/1` (texto), `grid-area: 2/1` (mídia)
- ❌ **Linha 2 não aparecia** na página pública
- ❌ Inspetor: `height: 0px` ou elemento fora da área visível

### Causa Raiz (5 Wrappers com overflow: hidden)

**Problema:** 5 wrappers com `height: 100%` + `overflow: hidden` impediam crescimento vertical natural em modo auto.

```html
<section style="height: auto;">  ← Seção pode crescer ✅
  <div style="height: 100%; overflow: hidden;">  ← ❌ Wrapper força 100%
    <div style="height: 100%;">  ← ❌ Grid limitado
      <div style="grid-area: 1/1;">Texto ✅</div>
      <div style="grid-area: 2/1;">Mídia ❌ CORTADA</div>
    </div>
  </div>
</section>
```

---

### Solução: 5 Correções Implementadas

#### Correção 1: Grid Container

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linha 1299)

```typescript
// ❌ ANTES
overflow: 'hidden',

// ✅ DEPOIS
overflow: heightMode !== 'auto' ? 'hidden' : 'visible',
```

---

#### Correção 2: Wrapper Externo

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linhas 2108-2110)

```typescript
// ❌ ANTES
style={{
  height: '100%',
  overflow: 'hidden',
}}

// ✅ DEPOIS
style={{
  height: heightMode !== 'auto' ? '100%' : 'auto',
  overflow: heightMode !== 'auto' ? 'hidden' : 'visible',
}}
```

---

#### Correção 3: Wrapper Interno

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linha 2117)

```typescript
// ❌ ANTES
height: '100%',

// ✅ DEPOIS
height: heightMode !== 'auto' ? '100%' : 'auto',
```

---

#### Correção 4: Coluna de Texto - maxHeight

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linhas 1314-1322)

```typescript
// ❌ ANTES
height: '100%',
maxHeight: '100%',

// ✅ DEPOIS
height: heightMode !== 'auto' ? '100%' : 'auto',
maxHeight: heightMode !== 'auto' ? '100%' : 'none',
```

---

#### Correção 5: Wrapper Interno do Texto

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linha 1349)

```typescript
// ❌ ANTES
height: '100%',

// ✅ DEPOIS
height: heightMode !== 'auto' ? '100%' : 'auto',
```

---

### Comportamento Esperado

#### Seções com Altura FIXA (50vh, 100vh)

| Elemento | height | overflow | maxHeight |
|----------|--------|----------|-----------|
| Grid container | `100%` | `hidden` | - |
| Wrapper externo | `100%` | `hidden` | - |
| Wrapper interno | `100%` | - | - |
| Texto | `100%` | `auto` | `100%` |

#### Seções com Altura AUTO

| Elemento | height | overflow | maxHeight |
|----------|--------|----------|-----------|
| Grid container | `auto` | `visible` | - |
| Wrapper externo | `auto` | `visible` | - |
| Wrapper interno | `auto` | - | - |
| Texto | `auto` | `auto` | `none` |

---

## 🔴 PROBLEMA CRÍTICO 2: Auto-Fix de gridRows

### Problema

Seções com posições verticais (`center`, `middle-left`, `middle-right`) mas `gridRows = 1` não renderizavam.

### Solução: Validação Automática

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linha ~464)

```typescript
// ✅ AUTO-FIX: Calcular gridRows correto
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
      `⚠️ [AUTO-FIX] gridRows ajustado de 1 para 2 (posições verticais detectadas)`
    );
    return 2;
  }

  return configGridRows;
};
```

### Regras de Validação

| Posição | Requer 2 Linhas | Descrição |
|---------|-----------------|-----------|
| `top-left`, `top-right`, `top-center` | ❌ Não | Linha superior |
| `bottom-left`, `bottom-right`, `bottom-center` | ❌ Não | Linha inferior |
| `middle-left`, `middle-right` | ✅ **SIM** | Ocupa ambas as linhas |
| `center` | ✅ **SIM** | Grid completo 2×2 |

---

## 🔴 PROBLEMA CRÍTICO 3: Grid Duplicado em Seções 2×2

### Problema

Seções com grid 2×2 + mídia ocupavam apenas **50-66% da largura** ao invés de 100% (fullwidth).

### Causa Raiz

**Grid duplicado** sendo criado:
- Grid **externo** com `gap: 2rem` (linha 1631)
- Grid **interno** com conteúdo (linha 993)

O grid interno estava **dentro de 1 das 4 células** do grid externo, desperdiçando 75% do espaço.

### Solução: Remover Grid Externo

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linhas 1627-1674)

```typescript
// ❌ REMOVIDO: Grid externo duplicado
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

### Benefícios

- ✅ Seções com grid 2×2 ocupam **100% da largura**
- ✅ Performance melhorada (-2 elementos DOM, -50% cálculos de layout)
- ✅ Correção **global** (afeta todas as páginas automaticamente)

---

## 🟡 PROBLEMA: Posicionamento de Cards em Grid 2×2

### Problema 1: Cards em Colunas Verticais Separadas

Seções com grid 2×2 configuradas com texto e cards em **colunas verticais separadas** renderizavam incorretamente.

**Configuração esperada:**
- Texto: `middle-left` (coluna esquerda, 2 linhas)
- Cards: `middle-right` (coluna direita, 2 linhas)

**Comportamento incorreto:**
- Texto: Linha superior completa (2 colunas)
- Cards: Linha inferior completa (2 colunas)

### Problema 2: Cards COM Mídia + Texto (Grid 2×2)

Seções com **mídia + texto na row 1** + **cards na row 2** não renderizavam os cards.

### Solução: 3 Cenários Suportados

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx`

```typescript
// ✅ CORREÇÃO: 3 cenários suportados
const hasCardsInSeparateColumn = hasCards && content.customContent && (() => {
  // CENÁRIO 1: Cards SEM mídia (substituem mídia)
  if (!hasMedia) {
    const textPos = getGridPosition(textPosition);
    const cardsPos = getGridPosition(cardsPosition);
    
    // Detectar colunas diferentes
    if (textPos !== cardsPos && gridCols === 2) return true;
    
    // Detectar alinhamento horizontal diferente
    const textAlign = textPosition?.split('-')[1] || 'center';
    const cardsAlign = cardsPosition?.split('-')[1] || 'center';
    if (textAlign !== cardsAlign && gridCols === 2) return true;
    
    return false;
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

---

## 🟡 PROBLEMA: Alinhamento Vertical de Cards

### Problema

Cards configurados com alinhamento vertical "middle" apareciam sempre no final (`justify-end`) do container.

### Causa Raiz

Código não extraia `config.cards.alignY` do banco. Usava apenas alinhamento **horizontal**.

### Solução

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linhas 994-1001)

```typescript
// ✅ CORREÇÃO: Extrair alinhamento VERTICAL
const cardsAlignY = sectionConfig.cards?.alignY || 'middle';
const cardsVerticalAlignClass = {
  'top': 'justify-start',
  'middle': 'justify-center',  // ← "middle" mapeia para "justify-center"
  'bottom': 'justify-end',
}[cardsAlignY] || 'justify-center';

// ✅ Aplicar no container (linha 1507)
<div className={`flex flex-col ${cardsVerticalAlignClass} ...`}>
```

---

## 📋 Regras Obrigatórias

### ✅ SEMPRE

1. **SEMPRE** usar `height: auto` + `overflow: visible` quando `heightMode === 'auto'`
2. **SEMPRE** usar `height: 100%` + `overflow: hidden` quando altura fixa (50vh, 100vh)
3. **SEMPRE** aplicar lógica condicional em TODOS os wrappers
4. **SEMPRE** testar com grid 2×1 após mudanças em altura
5. **SEMPRE** validar gridRows automaticamente (auto-fix)
6. **SEMPRE** usar `getGridPosition()` para extrair posições
7. **SEMPRE** suportar mídia + texto + cards em grid 2×2
8. **SEMPRE** extrair `config.cards.alignY` para alinhamento vertical

### ❌ NUNCA

1. **NUNCA** forçar `height: 100%` quando seção é `auto`
2. **NUNCA** usar `overflow: hidden` quando seção é `auto`
3. **NUNCA** usar `maxHeight: 100%` quando seção é `auto`
4. **NUNCA** assumir que grid com 2 linhas funciona sem testar
5. **NUNCA** criar grid externo duplicado
6. **NUNCA** assumir que alinhamento horizontal é suficiente para grid 2×2
7. **NUNCA** usar `!hasMedia` para detectar cards separados (bloqueia cenário 2)

---

## 🐛 Troubleshooting

### Problema: Linha 2 do grid não aparece

**Diagnóstico:**
```typescript
// Console deve mostrar:
🔍 [TEXTO height] { heightMode: 'auto', result: 'auto' }
```

**Se mostra `result: '100%'`:**
- Lógica condicional não está implementada
- Arquivo: `/src/app/public/components/SectionRenderer.tsx` linha 1314-1322

**Solução:**
- Aplicar 5 correções de altura auto

---

### Problema: Seção não renderiza (posições verticais)

**Diagnóstico:**
```typescript
// Console deve mostrar:
⚠️ [AUTO-FIX] gridRows ajustado de 1 para 2
```

**Se NÃO aparece:**
- Auto-fix não está implementado
- Arquivo: `/src/app/public/components/SectionRenderer.tsx` linha ~464

**Solução:**
- Implementar `calculateGridRows()`

---

### Problema: Seção ocupa 50% da largura

**Diagnóstico:**
- Inspetor mostra DOIS grids aninhados
- Grid externo com `gap: 2rem`

**Solução:**
- Remover grid externo duplicado
- Arquivo: `/src/app/public/components/SectionRenderer.tsx` linhas 1627-1674

---

### Problema: Cards não aparecem em grid 2×2 com mídia

**Diagnóstico:**
```typescript
// Verificar lógica de detecção
const hasCardsInSeparateColumn = ...
console.log('hasCardsInSeparateColumn:', hasCardsInSeparateColumn);
```

**Se retorna `false` mas deveria ser `true`:**
- Cenário 2 não implementado (mídia + texto + cards)
- Arquivo: `/src/app/public/components/SectionRenderer.tsx`

---

## 📊 Casos de Teste

### Caso 1: Grid 2×1 com Altura Auto

**Configuração:**
- `height: auto`
- `gridRows: 2`, `gridCols: 1`
- Linha 1: Texto
- Linha 2: Mídia

**Resultado Esperado:**
- ✅ Ambas as linhas visíveis
- ✅ Seção cresce verticalmente

---

### Caso 2: Grid 2×2 com 3 Elementos

**Configuração:**
- `height: auto`
- `gridRows: 2`, `gridCols: 2`
- Row 1: Texto (left) + Mídia (right)
- Row 2: Cards (center, span 2)

**Resultado Esperado:**
- ✅ Linha 1: Texto e mídia lado a lado
- ✅ Linha 2: Cards ocupando largura completa
- ✅ Seção cresce verticalmente

---

### Caso 3: Texto Center em Grid 2×2

**Configuração:**
- `textPosition: 'center'`
- `gridRows: 2`, `gridCols: 2`
- SEM mídia, SEM cards

**Resultado Esperado:**
- ✅ Texto centralizado ocupando grid completo (span 2 × span 2)

---

## 🔗 Arquivos Relacionados

### Código Principal

- `/src/app/public/components/SectionRenderer.tsx`
  - Linhas 464: `calculateGridRows()`
  - Linhas 994-1001: Alinhamento vertical de cards
  - Linhas 1299: Grid container overflow
  - Linhas 1314-1322: Coluna de texto height/maxHeight
  - Linhas 1349: Wrapper interno do texto
  - Linhas 1627-1674: Grid externo (removido)
  - Linhas 2108-2110: Wrapper externo
  - Linhas 2117: Wrapper interno

### Documentação Histórica

Arquivada em `/docs/99-arquivo/grid/`:
- `FIX_ALTURA_GRID_INTERNO_2026-02-13.md`
- `FIX_GRID_BUTTONS_2026-02-14.md`
- `GRID_NORMALIZATION_FINAL_2026-02-15.md`
- `FIX_TEXT_CENTER_GRID_2X2_2026-02-15.md`
- `FIX_VERTICAL_ALIGNMENT_2026-02-15.md`

---

## 📚 Referências

- **Guidelines Principal:** `/guidelines/Guidelines.md#sistema-de-grid`
- **Decision Log:** `/CLEANUP_DECISION_LOG.md#grid`
- **Índice de Correções:** `/__INDICE_CORRECOES_2026-02-17.md#grid`

---

**Mantido por:** Equipe BemDito CMS  
**Última atualização:** 2026-02-17  
**Versão:** 1.0
