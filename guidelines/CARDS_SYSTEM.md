# 🎴 Sistema de Cards - BemDito CMS

**Versão:** 1.0  
**Data:** 2026-02-17  
**Status:** 📘 Documentação Canônica

---

## 🎯 Visão Geral

Sistema completo de cards para seções do site, incluindo toggle de visibilidade, templates reutilizáveis, persistência de configurações e sincronização de estado entre admin e página pública.

**Arquivos Consolidados:**
- `__CARDS_TOGGLE_ATOMIC_UPDATE_FIX_2026-02-17.md` ⭐ Principal
- `__CARDS_TOGGLE_COMPLETE_FIX_2026-02-17.md`
- `__CARDS_TOGGLE_SYNC_FIX_2026-02-17.md`
- `__FIX_CARDS_TOGGLE_RESPECT_2026-02-17.md`

---

## 🔴 PROBLEMA CRÍTICO: Toggle "Cards" Não Era Respeitado

### Sintomas

- ✅ Usuário desliga toggle "Cards" no admin
- ❌ Cards continuam aparecendo na página pública
- ❌ Configurações eram zeradas ao desligar toggle
- ❌ Campos de gerenciamento não apareciam ao religar

### Causa Raiz (4 Problemas Identificados)

#### Problema 1: SectionRenderer sobrescrevia toggle

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx`

```typescript
// ❌ ANTES (INCORRETO)
const hasCards = (elements.hasCards !== undefined ? elements.hasCards : false) 
  || sectionCards.length > 0;  // ← Forçava TRUE se havia cards no banco

// ✅ DEPOIS (CORRETO)
const hasCards = elements.hasCards !== undefined ? elements.hasCards : false;
// ← Respeita APENAS o valor do toggle no banco
```

**Por que estava errado:**
- Lógica assumia: "se existem cards no banco → deve exibir"
- Ignorava intenção explícita do usuário (toggle desligado)

---

#### Problema 2: SectionBuilder zerava configurações

**Arquivo:** `/src/app/admin/sections-manager/SectionBuilder.tsx`

```typescript
// ❌ ANTES (INCORRETO)
updateElements({ 
  hasCards,
  cardCount: hasCards ? 3 : 0  // ← Zerava ao desligar
});

// ✅ DEPOIS (CORRETO)
updateElements({ 
  hasCards  // ← Apenas visibilidade, configurações persistem
});
```

**Por que estava errado:**
- Ao desligar toggle, apagava `cardCount`, `cardTemplateId`, etc
- Usuário perdia configurações ao esconder temporariamente

---

#### Problema 3: Estado local não sincronizava

**Arquivo:** `/src/app/admin/sections-manager/SectionBuilder.tsx`

```typescript
// ❌ ANTES (SEM SINCRONIZAÇÃO)
const [elements, setElements] = useState<SectionElements>(initialElements || defaultElements);
// Quando prop mudava, estado local NÃO atualizava!

// ✅ DEPOIS (COM SINCRONIZAÇÃO)
const [elements, setElements] = useState<SectionElements>(initialElements || defaultElements);

useEffect(() => {
  if (initialElements) {
    setElements(initialElements);
  }
}, [initialElements]);
```

**Por que estava errado:**
- Estado local criado no mount nunca atualizava quando prop mudava
- Campos de gerenciamento não apareciam ao ligar toggle

---

#### Problema 4: Race Condition - Duas chamadas consecutivas

**Arquivo:** `/src/app/admin/sections-manager/SectionBuilder.tsx`

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

**Por que estava errado:**
- Primeira chamada atualiza `hasCards: true`
- React faz batch update (estado local ainda não mudou)
- Segunda chamada lê estado ANTIGO (`hasCards: false`)
- Resultado: toggle volta para desligado!

---

## ✅ Solução Completa Implementada

### Correção 1: SectionRenderer - Respeitar Toggle

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linha ~800)

```typescript
// ✅ SOLUÇÃO: Respeitar APENAS elements.hasCards
const hasCards = elements.hasCards !== undefined ? elements.hasCards : false;

console.log('🔍 [hasCards] Validação:', {
  fromElements: elements.hasCards,
  cardsInDB: sectionCards.length,
  final: hasCards
});
```

---

### Correção 2: SectionBuilder - Persistir Configurações

**Arquivo:** `/src/app/admin/sections-manager/SectionBuilder.tsx` (linha ~869)

```typescript
// ✅ SOLUÇÃO: Não zerar configurações
const handleToggleChange = (field: keyof SectionElements, value: boolean) => {
  updateElements({ [field]: value });  // ← Apenas visibilidade
  // cardTemplateId, cardCount permanecem intactos
};
```

---

### Correção 3: SectionBuilder - Sincronizar Estado

**Arquivo:** `/src/app/admin/sections-manager/SectionBuilder.tsx` (linha ~547)

```typescript
// ✅ SOLUÇÃO: useEffect para sincronizar
const [elements, setElements] = useState<SectionElements>(initialElements || defaultElements);

useEffect(() => {
  if (initialElements) {
    console.log('🔄 [SectionBuilder] Sincronizando elements:', initialElements);
    setElements(initialElements);
  }
}, [initialElements]);
```

---

### Correção 4: SectionBuilder - Atualização Atômica

**Arquivo:** `/src/app/admin/sections-manager/SectionBuilder.tsx` (linha ~869)

```typescript
// ✅ SOLUÇÃO: Uma única chamada onChange
const handleToggleChange = (field: keyof SectionElements, value: boolean) => {
  // 1. Criar NOVOS estados ANTES de chamar onChange
  const newElements = { ...elements, [field]: value };
  
  // 2. Atualizar layout SE necessário
  const newLayout = (field === 'hasCards' && value && !layout.desktop?.cards)
    ? { ...layout, desktop: { ...layout.desktop, cards: 'bottom-center' } }
    : layout;
  
  // 3. Atualizar estados locais
  setElements(newElements);
  setLayout(newLayout);
  
  // 4. UMA ÚNICA chamada onChange com valores corretos
  onChange(newElements, newLayout, styling);
};
```

---

## 🔄 Fluxo Completo (Antes vs Depois)

### ❌ ANTES (Bugado)

```
1. Usuário liga toggle "Cards"
   ↓
2. handleToggleChange chamado
   ↓
3. updateElements({ hasCards: true })  ← 1ª chamada onChange
   ↓ (estado local ainda não mudou)
   ↓
4. if (hasCards && !layout.desktop.cards) {  ← lê estado ANTIGO
     updateLayout({ desktop: { cards: 'bottom-center' } })  ← 2ª chamada onChange
     ↑ Passa elements ANTIGO (hasCards: false) ❌
   }
   ↓
5. Toggle volta para desligado ❌
```

### ✅ DEPOIS (Correto)

```
1. Usuário liga toggle "Cards"
   ↓
2. handleToggleChange chamado
   ↓
3. Criar novos estados:
   newElements = { ...elements, hasCards: true }
   newLayout = { ...layout, desktop: { cards: 'bottom-center' } }
   ↓
4. Atualizar estados locais:
   setElements(newElements)
   setLayout(newLayout)
   ↓
5. UMA ÚNICA chamada onChange:
   onChange(newElements, newLayout, styling) ✅
   ↓
6. Toggle permanece ligado ✅
   Campos de gerenciamento aparecem ✅
```

---

## 📋 Regras Obrigatórias

### ✅ SEMPRE

1. **SEMPRE** respeitar o valor de `elements.hasCards` do banco
2. **SEMPRE** usar toggle como fonte única da verdade
3. **SEMPRE** permitir esconder elementos sem deletar dados
4. **SEMPRE** persistir configurações (cardTemplateId, cardCount) independente do toggle
5. **SEMPRE** condicionar visibilidade de campos com `{hasCards && (`
6. **SEMPRE** consolidar múltiplas atualizações em UMA ÚNICA chamada `onChange`
7. **SEMPRE** criar novos estados ANTES de chamar `onChange`
8. **SEMPRE** sincronizar estado local quando prop muda (useEffect)

### ❌ NUNCA

1. **NUNCA** sobrescrever toggle com lógica baseada em dados externos
2. **NUNCA** assumir que "existe no banco" = "deve ser exibido"
3. **NUNCA** ignorar intenção explícita do usuário (toggle desligado)
4. **NUNCA** zerar configurações ao desligar toggle
5. **NUNCA** chamar `updateElements()` seguido de `updateLayout()` (race condition)
6. **NUNCA** confiar que o React já atualizou o estado entre chamadas
7. **NUNCA** usar `||` para forçar `hasCards = true` se há cards no banco

---

## 🐛 Troubleshooting

### Problema: Cards aparecem com toggle desligado

**Diagnóstico:**
```typescript
// Console deve mostrar:
🔍 [hasCards] Validação:
  fromElements: false  ← Toggle está desligado
  cardsInDB: 5         ← Existem 5 cards no banco
  final: false         ← ✅ Correto: respeita toggle
```

**Solução:**
- Verificar se SectionRenderer usa `elements.hasCards` (não `sectionCards.length`)
- Arquivo: `/src/app/public/components/SectionRenderer.tsx` linha ~800

---

### Problema: Configurações perdidas ao desligar toggle

**Diagnóstico:**
- Desligar toggle → `cardTemplateId` vira `null`
- Religar toggle → template precisa ser selecionado novamente

**Solução:**
- `updateElements({ hasCards })` não deve incluir `cardCount: 0`
- Arquivo: `/src/app/admin/sections-manager/SectionBuilder.tsx` linha ~869

---

### Problema: Campos não aparecem ao ligar toggle

**Diagnóstico:**
```typescript
// Console deve mostrar:
🔄 [SectionBuilder] Sincronizando elements: { hasCards: true, ... }
```

**Se NÃO aparece:**
- useEffect de sincronização não está implementado
- Arquivo: `/src/app/admin/sections-manager/SectionBuilder.tsx` linha ~547

---

### Problema: Toggle liga e desliga sozinho (race condition)

**Diagnóstico:**
- Múltiplas chamadas `onChange` consecutivas
- Estado local não atualizado entre chamadas

**Solução:**
- Consolidar atualizações em UMA chamada
- Criar novos estados ANTES de chamar onChange
- Arquivo: `/src/app/admin/sections-manager/SectionBuilder.tsx` linha ~869

---

## 📊 Benefícios da Correção

✅ **Toggle funciona conforme esperado**
- Liga → cards aparecem
- Desliga → cards somem

✅ **Persistência de configurações**
- Template selecionado permanece salvo
- Quantidade de cards permanece salva
- Esconder não é deletar

✅ **UX melhorada**
- Campos aparecem/somem baseado no toggle
- Sem perda de trabalho ao esconder temporariamente

✅ **Consistência total**
- Admin e página pública sempre sincronizados

✅ **Zero race conditions**
- Uma única chamada onChange com valores corretos

---

## 🔗 Arquivos Relacionados

### Código Principal

- `/src/app/public/components/SectionRenderer.tsx` (linha ~800)
  - Renderização condicional de cards
  - Validação de `elements.hasCards`

- `/src/app/admin/sections-manager/SectionBuilder.tsx` (linhas ~547, ~869)
  - Toggle de cards
  - Sincronização de estado
  - Atualização atômica

- `/src/app/admin/pages-manager/UnifiedSectionConfigModal.tsx`
  - Modal de configuração
  - Salvamento no banco

### Documentação Histórica

Arquivada em `/docs/99-arquivo/cards/`:
- `CARDS_FIELDS_DEBUG_2026-02-17.md` - Debug de campos ausentes
- `CARDS_MARKETING_DIAGNOSTIC_2026-02-17.md` - Diagnóstico seção Marketing
- `CARDS_TOGGLE_FINAL_STATUS_2026-02-17.md` - Status final
- `DEBUG_CARDS_DISAPPEARING_2026-02-17.md` - Cards desaparecendo
- `FINAL_DIAGNOSIS_CARDS_2026-02-17.md` - Diagnóstico final

---

## 📚 Referências

- **Guidelines Principal:** `/guidelines/Guidelines.md#correção-crítica-toggle-cards`
- **Decision Log:** `/CLEANUP_DECISION_LOG.md#cards`
- **Índice de Correções:** `/__INDICE_CORRECOES_2026-02-17.md#cards`

---

**Mantido por:** Equipe BemDito CMS  
**Última atualização:** 2026-02-17  
**Versão:** 1.0

