# 📏 Sistema de Spacing e Padding - BemDito CMS

**Versão:** 1.0  
**Data:** 2026-02-17  
**Status:** 📘 Documentação Canônica

---

## 🎯 Visão Geral

Sistema completo de espaçamento (padding, margin, gaps), incluindo função parseSpacing híbrida, operador `??` vs `||`, regras de padding de seções vs elementos, e tokens do design system.

**Arquivos Consolidados:**
- `__PADDING_FIX_COMPLETE_2026-02-17.md` ⭐ Principal
- `__PADDING_SECTION_FIX_2026-02-16.md`

---

## 🔴 PROBLEMA CRÍTICO: Função parseSpacing Não Aceitava Valores em px

### Sintomas

- ✅ Modal admin salva `spacing.top = "0px"` no banco
- ❌ SectionRenderer renderiza `<section style="padding-top: 24px">`
- ❌ Padding de 0px virava 24px no HTML

### Causa Raiz

Função `parseSpacing` **SOMENTE aceitava tokens** (none, xs, sm, md, lg, xl, 2xl), mas o banco armazenava **valores em px** ("0px", "32px", etc.).

```typescript
// ❌ ANTES (SÓ TOKENS)
const parseSpacing = (value: string | number | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  if (typeof value === 'number') return value;
  
  // Só tentava spacingMap
  return spacingMap[value] || defaultValue;  // ❌ "0px" não está no map!
};
```

---

### Solução: Parsing Híbrido

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linha 461)

```typescript
// ✅ CORREÇÃO: Aceita TOKENS E PX
const parseSpacing = (value: string | number | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  if (typeof value === 'number') return value;
  
  // 1. Tentar spacingMap primeiro (tokens: none, xs, sm, md, lg, xl, 2xl)
  if (spacingMap[value] !== undefined) {
    return spacingMap[value];
  }
  
  // 2. Fallback: extrair número de string px ("0px" → 0, "32px" → 32)
  const parsed = parseInt(value.replace('px', ''));
  return !isNaN(parsed) ? parsed : defaultValue;  // ✅ Validação explícita
};
```

### Formatos Aceitos

| Formato | Exemplo | Resultado |
|---------|---------|-----------|
| **Tokens** | `"none"`, `"md"`, `"xl"` | 0, 24, 48 (via spacingMap) |
| **Valores em px** | `"0px"`, `"32px"`, `"128px"` | 0, 32, 128 (parsed) |
| **Valores numéricos** | `0`, `24`, `48` | 0, 24, 48 (direto) |

---

## 🔴 PROBLEMA CRÍTICO: Operador `||` com Valores Numéricos

### Problema

Usar `||` (OR) com valores numéricos que podem ser `0` causa fallback incorreto.

### Exemplo do Bug

```typescript
const spacingMap = { 'none': 0, 'md': 24 };
const padding = spacingMap['none'] || 24;  // ❌ Retorna 24 (0 é falsy!)

// ⚠️ PROBLEMA CRÍTICO no parseSpacing():
return parseInt("0px".replace('px', '')) || 24;  // ❌ Retorna 24!

// Passo a passo:
// 1. parseInt("0") → 0
// 2. 0 || 24 → 24 (porque 0 é falsy!)
// 3. padding-top: 0px do banco vira padding-top: 24px no HTML ❌
```

### Solução: Operador `??` ou Validação Explícita

```typescript
// ✅ OPÇÃO 1: Nullish coalescing (recomendado)
const padding = spacingMap['none'] ?? 24;  // Retorna 0 (0 não é nullish)

// ✅ OPÇÃO 2: Validação explícita (usado no parseSpacing)
const parsed = parseInt(value.replace('px', ''));
return !isNaN(parsed) ? parsed : defaultValue;  // 0 é válido!
```

### Diferença entre `||` e `??`

| Operador | Retorna segundo valor quando primeiro é... |
|----------|-------------------------------------------|
| `||` | **Falsy** (`false`, `0`, `''`, `null`, `undefined`, `NaN`) |
| `??` | **Nullish** (`null`, `undefined`) ✅ Recomendado |

---

## 🎨 Tokens de Spacing

### Mapa Completo

```typescript
const spacingMap: Record<string, number> = {
  'none': 0,     // 0px
  'xs': 8,       // 0.5rem
  'sm': 16,      // 1rem
  'md': 24,      // 1.5rem
  'lg': 32,      // 2rem
  'xl': 48,      // 3rem
  '2xl': 64,     // 4rem
};
```

### Uso

| Token | Valor | Uso |
|-------|-------|-----|
| **none** | 0px | Sem espaçamento |
| **xs** | 8px | Padding interno de botões, gaps pequenos |
| **sm** | 16px | Espaçamento entre elementos próximos |
| **md** | 24px | Padding de cards, margens padrão |
| **lg** | 32px | Separação entre seções |
| **xl** | 48px | Espaçamento grande entre blocos |
| **2xl** | 64px | Separação máxima, hero sections |

---

## 📦 Hierarquia de Paddings

### 3 Níveis Independentes

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

---

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

---

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

---

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

---

## 🔧 Column-Gap Condicional

### Problema

Grid com `column-gap` impede mídia no modo "alinhada" de colar nas bordas direita/esquerda.

### Solução

```typescript
// ✅ Remover gap quando mídia alinhada nas bordas
const shouldRemoveGap = mediaDisplayMode === 'alinhada' 
  && hasMedia 
  && (mediaAlign === 'left' || mediaAlign === 'right');

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: shouldRemoveGap ? '0px' : '32px', // ✅ Condicional
};
```

---

## 🎛️ Valores dos Controlos de Spacing no Admin (v6.14+ / 2026-02-20)

### Fonte de Verdade: `SectionHeightAndAlignmentControls.tsx`

Todos os 6 campos de spacing (Top, Bottom, Left, Right, Column Gap, Row Gap) usam **exclusivamente incrementos de 25 px**:

```typescript
// SectionHeightAndAlignmentControls.tsx
const SPACING_TOP_BOTTOM = [0, 25, 50, 75, 100, 125, 150, 175, 200];
const SPACING_SIDES      = [0, 25, 50, 75, 100, 125, 150, 175, 200];  // ✅ Corrigido em 2026-02-20
const SPACING_GAP        = [0, 25, 50, 75, 100, 125, 150, 175, 200];  // ✅ Corrigido em 2026-02-20
```

**Antes de 2026-02-20**, `SPACING_SIDES` e `SPACING_GAP` usavam valores legados (8, 16, 24, 32, 48, 64, 80, 96, 128), inconsistentes com a tabela top/bottom. Ambos foram unificados.

### Padrão de Valores

| Valor | Label | Uso Recomendado |
|-------|-------|-----------------|
| `0px` | 0px | Sem espaçamento |
| `25px` | 25px | Espaçamento mínimo |
| **`50px`** | **50px** | **PADRÃO** (quando campo vazio no banco) |
| `75px` | 75px | Espaçamento médio |
| `100px` | 100px | Espaçamento grande |
| `125px` | 125px | Espaçamento maior |
| `150px` | 150px | Espaçamento extra grande |
| `175px` | 175px | Espaçamento muito grande |
| `200px` | 200px | Espaçamento máximo |

### Regras

✅ **SEMPRE** usar múltiplos de 25px nos controlos  
✅ **SEMPRE** usar 50px como fallback padrão (`parseSpacing(value, 50)`)  
❌ **NUNCA** adicionar valores fora desta lista (não aparecem no dropdown)  
❌ **NUNCA** hardcoded valores de spacing em código (usar os dropdowns)

---

## 📋 Regras Obrigatórias

### ✅ SEMPRE

1. **SEMPRE** usar `parseSpacing` para todos os spacings
2. **SEMPRE** aceitar tokens E valores em px
3. **SEMPRE** manter retrocompatibilidade
4. **SEMPRE** usar `??` (nullish coalescing) para valores que podem ser 0
5. **SEMPRE** usar `!isNaN(parsed) ? parsed : default` ao parsear números
6. **SEMPRE** aplicar padding da section via modal (configurável)
7. **SEMPRE** aplicar 10px de padding no wrapper de texto
8. **SEMPRE** manter 0px de padding na mídia
9. **SEMPRE** usar `box-sizing: border-box` em elementos com padding
10. **SEMPRE** remover `column-gap` quando mídia alinhada nas bordas

### ❌ NUNCA

1. **NUNCA** usar parsing diferente para top/bottom vs. left/right
2. **NUNCA** usar `||` quando `0`, `false` ou `''` são valores válidos
3. **NUNCA** assumir que `0` não é um valor válido
4. **NUNCA** usar `parseInt(value) || default` (0 vira default!)
5. **NUNCA** aplicar padding na mídia (quebra alinhamento)
6. **NUNCA** remover padding interno do texto (perde respiro)
7. **NUNCA** usar gap fixo quando mídia precisa colar nas bordas

---

## 🐛 Troubleshooting

### Problema: Padding de 0px vira 24px

**Diagnóstico:**
```typescript
// Console deve mostrar:
const result = parseSpacing("0px", 24);
console.log(result); // Deve ser 0, não 24
```

**Se mostra 24:**
- `||` sendo usado ao invés de `??` ou `!isNaN`
- Arquivo: `/src/app/public/components/SectionRenderer.tsx` linha 461

---

### Problema: Token não reconhecido

**Diagnóstico:**
```typescript
// Verificar se token existe
const value = parseSpacing("2xl", 24);
console.log(value); // Deve ser 64
```

**Se retorna 24:**
- Token não está no `spacingMap`
- Adicionar token ao mapa

---

### Problema: Mídia não cola nas bordas

**Diagnóstico:**
- `column-gap` presente no grid
- Mídia com padding

**Solução:**
- Remover gap quando `mediaDisplayMode === 'alinhada'`
- Garantir padding 0 na mídia

---

## 📊 Casos de Uso

### Caso 1: Padding com Token

```json
{
  "styling": {
    "spacing": {
      "top": "none",    // 0px
      "bottom": "md",   // 24px
      "left": "xl",     // 48px
      "right": "sm"     // 16px
    }
  }
}
```

**Resultado:**
```html
<section style="padding: 0px 16px 24px 48px;">
```

---

### Caso 2: Padding com Valores em px

```json
{
  "styling": {
    "spacing": {
      "top": "0px",
      "bottom": "32px",
      "left": "128px",
      "right": "16px"
    }
  }
}
```

**Resultado:**
```html
<section style="padding: 0px 16px 32px 128px;">
```

---

### Caso 3: Padding Misto (Tokens + px)

```json
{
  "styling": {
    "spacing": {
      "top": "none",    // Token: 0px
      "bottom": "0px",  // Valor: 0px
      "left": "xl",     // Token: 48px
      "right": "16px"   // Valor: 16px
    }
  }
}
```

**Resultado:**
```html
<section style="padding: 0px 16px 0px 48px;">
```

---

## 🔗 Arquivos Relacionados

### Código Principal

- `/src/app/public/components/SectionRenderer.tsx`
  - Linha 461: `parseSpacing()` híbrido
  - Linha 1128: Padding do wrapper de texto (10px)
  - Linha 1362: Padding da mídia (0px)

### Documentação Histórica

Arquivada em `/docs/99-arquivo/padding/`:
- `PADDING_LOGIC_IMPLEMENTATION_COMPLETE_2026-02-17.md`
- `PADDING_LOGIC_REFACTOR_2026-02-17.md`
- `PADDING_PROBLEMS_DIAGNOSTIC_2026-02-17.md`
- `MARGENS_LATERAIS_GAP_2026-02-16.md`

---

## 📚 Referências

- **Guidelines Principal:** `/guidelines/Guidelines.md#espaçamento`
- **Decision Log:** `/CLEANUP_DECISION_LOG.md#padding`
- **Índice de Correções:** `/__INDICE_CORRECOES_2026-02-17.md#padding`

---

**Mantido por:** Equipe BemDito CMS  
**Última atualização:** 2026-02-20  
**Versão:** 1.1

