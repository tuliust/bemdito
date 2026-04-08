# 🎨 Regras e Boas Práticas CSS - BemDito CMS

**Versão:** 1.1  
**Data:** 2026-02-21  
**Status:** 📘 Documentação Canônica

---

## 🎯 Visão Geral

Regras críticas de CSS, incluindo correção de erros de parsing de transições, sistema de scroll nativo, validação de corner selector, e conflitos de posicionamento.

**Arquivos Consolidados:**
- `__CSS_TRANSITIONS_FIX_2026-02-14.md` ⭐ Principal
- `__FIX_CORNER_SELECTOR_ERRORS_2026-02-14.md`
- `__POSITION_CONFLICT_VALIDATION_2026-02-14.md`

---

## 🔴 PROBLEMA CRÍTICO: Erros de Parsing de Transições CSS

### Sintomas

- ❌ Erros no console: `Error parsing color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1)...`
- ❌ Erros no console: `Error parsing color: oklab(0.145 ...)`
- ❌ Componentes com transições quebrando

### Causa Raiz

**Transições CSS tentando interpolar propriedades incompatíveis:**
- `box-shadow` com múltiplos valores
- `border-color` em tokens oklab (Tailwind v4)
- Classes `transition-all` e `transition-colors`

---

### Solução Padrão Implementada

#### Para Botões e Elementos Interativos

```tsx
// ❌ ERRADO - Causa erro de parsing
<button className="transition-all hover:shadow-lg">

// ❌ ERRADO - Causa erro de parsing
<button className="transition-colors hover:border-primary">

// ✅ CORRETO - Sem transições + CSS vars de tokens (nunca hex diretamente)
<button 
  className="hover:bg-primary/90"
  style={{
    transition: 'none',
    animation: 'none',
    boxShadow: 'none',
    borderColor: isSelected ? 'var(--primary, #ea526e)' : 'var(--admin-field-border, #e5e7eb)',
    backgroundColor: isSelected ? 'color-mix(in srgb, var(--primary, #ea526e) 10%, transparent)' : 'transparent',
  }}
>
```

---

#### Para Containers com Scroll

```tsx
// ❌ ERRADO - ScrollArea com transições internas
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

---

### Checklist de Correção

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

4. **Usar CSS vars de tokens (nunca hex diretamente)**
   ```tsx
   // Em componentes admin — usar tokens --admin-* ou --primary:
   style={{
     borderColor: isActive ? 'var(--primary, #ea526e)' : 'var(--admin-field-border, #e5e7eb)',
     backgroundColor: isActive ? 'color-mix(in srgb, var(--primary, #ea526e) 10%, transparent)' : 'transparent',
     // ✅ CSS vars com fallbacks hex
     // ❌ NUNCA escrever '#ea526e' diretamente sem fallback de var()
   }}
   ```

   > ⚠️ **ADMIN_COLORS removido (2026-02-21):** A constante `ADMIN_COLORS` em `theme.ts` está **deprecated** — zero referências em `.tsx`. Usar CSS vars `var(--primary)`, `var(--admin-*)` com fallbacks hex.

5. **Para ScrollArea problemático, usar scroll nativo**
   - Ver seção abaixo "Sistema de Scroll Nativo"

---

## 🖱️ Sistema de Scroll Nativo

### Quando Usar

- ✅ Sempre que o `ScrollArea` do shadcn/ui causar erros de parsing
- ✅ Quando precisar de scroll com mouse wheel garantido
- ✅ Em modais, popovers e componentes com altura fixa

### Implementação Padrão

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

### Propriedades PopoverContent

```tsx
<PopoverContent 
  onOpenAutoFocus={(e) => e.preventDefault()} // Previne bloqueio de scroll
>
```

### Por Que Funciona

- `overflow-y: auto` - Scroll nativo do navegador (performance máxima)
- `scrollbarWidth: 'thin'` - Scrollbar fina no Firefox
- `scrollbarColor` - Customização de cor no Firefox
- `onWheel` + `stopPropagation` - Garante scroll com mouse wheel
- `onOpenAutoFocus` - Previne que Radix UI bloqueie eventos

---

## 🔧 Correção de Corner Selector

### Problema

`CornerPositionSelector` recebendo objetos com estrutura `{ position: "middle-right", verticalAlign: "bottom" }` ao invés de strings simples como `"top-left"`.

### Erro

```
❌ Invalid position for media: { "position": "middle-right", "verticalAlign": "bottom" }
⚠️ Combinação inválida de cantos: top-right, bottom-right, top-left
```

### Solução: Validação Robusta

**Arquivo:** `/src/app/components/admin/CornerPositionSelector.tsx` (linhas 33-75)

```tsx
// ✅ VALIDAÇÃO ROBUSTA: Extrair string de qualquer formato
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

### Interface Atualizada

```tsx
interface CornerPositionSelectorProps {
  value: GridPosition | { position: GridPosition; [key: string]: any }; // ✅ Aceita ambos
  onChange: (position: GridPosition) => void;
  // ... outros props
}
```

---

## ⚠️ Conflitos de Posicionamento

### Problema

Validação de conflitos de posição em grid 2×2 não estava implementada.

### Solução: Modal de Validação

**Componente:** `PositionConflictDialog`

```tsx
interface PositionConflict {
  element1: string;
  element2: string;
  position: GridPosition;
}

<PositionConflictDialog
  open={hasConflict}
  conflicts={conflicts}
  onResolve={(resolution) => {
    // Aplicar resolução automática
  }}
  onCancel={() => {
    // Reverter mudanças
  }}
/>
```

### Regras de Validação

- ❌ **Dois elementos não podem ocupar a mesma posição**
- ❌ **Elementos não podem sobrepor no grid**
- ✅ **Validação em tempo real ao mover elementos**

---

## 📋 Regras Obrigatórias

### ✅ SEMPRE

1. **SEMPRE** usar inline styles com `transition: 'none'` em elementos interativos
2. **SEMPRE** usar scroll nativo ao invés de `ScrollArea` quando houver erros
3. **SEMPRE** adicionar `onWheel` + `stopPropagation` em containers scrolláveis
4. **SEMPRE** usar CSS vars de tokens (`var(--primary)`, `var(--admin-*)`) — nunca hex diretamente
5. **SEMPRE** adicionar `onOpenAutoFocus={(e) => e.preventDefault()}` em popovers com scroll
6. **SEMPRE** validar formato de position (string ou objeto)
7. **SEMPRE** aceitar tanto `{row, horizontal}` quanto `{position}`
8. **SEMPRE** validar conflitos de posicionamento

### ❌ NUNCA

1. **NUNCA** usar `transition-all` (tenta animar TODAS as propriedades)
2. **NUNCA** usar `transition-colors` em elementos com `box-shadow`
3. **NUNCA** confiar apenas em classes CSS para desabilitar transições
4. **NUNCA** usar `ScrollArea` sem testar se causa erros de parsing
5. **NUNCA** assumir que value é apenas string (pode ser objeto)
6. **NUNCA** fazer spread de strings (`...currentText` quando currentText é string)
7. **NUNCA** permitir dois elementos na mesma posição

---

## 🐛 Troubleshooting

### Erro: `Error parsing color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1)...`

**Causa:** Transição tentando interpolar `box-shadow` com múltiplos valores

**Solução:** Adicionar `transition: 'none'` e `boxShadow: 'none'` em inline styles

---

### Erro: `Error parsing color: oklab(0.145 ...)`

**Causa:** Classes CSS Tailwind v4 usando espaço de cor oklab + transições

**Solução:** Forçar cores hex em inline styles com maior especificidade

---

### Scroll com mouse wheel não funciona

**Causa:** Evento `onWheel` sendo bloqueado por container pai (Popover)

**Solução:** Adicionar `onWheel={(e) => e.stopPropagation()}` e `onOpenAutoFocus={(e) => e.preventDefault()}`

---

### ScrollArea causa erro mesmo sem transições

**Causa:** Componente interno tem transições hardcoded no Radix UI

**Solução:** Substituir por scroll nativo conforme padrão acima

---

### Corner Selector mostra "Invalid position"

**Causa:** Value é objeto, não string

**Solução:** Validação robusta já implementada (aceita ambos os formatos)

---

## 📊 Arquivos Corrigidos (2026-02-14)

| Arquivo | Componente | Correção Aplicada |
|---------|-----------|-------------------|
| `/src/app/components/ui/scroll-area.tsx` | `ScrollBar` | Inline styles de proteção |
| `/src/app/components/admin/IconPicker.tsx` | Grid de ícones | Scroll nativo + inline styles |
| `/src/app/components/admin/CardRenderer.tsx` | Card hover | `transition-colors` removido |
| `/src/app/public/Header.tsx` | Menu items | `transition-colors` removido |
| `/src/app/public/components/SectionRenderer.tsx` | Media hover | `transition-colors` removido |
| `/src/app/components/admin/CornerPositionSelector.tsx` | Position selector | Validação robusta |

---

## 🔗 Arquivos Relacionados

### Código Principal

- `/src/app/components/ui/scroll-area.tsx` - ScrollBar com proteção
- `/src/app/components/admin/IconPicker.tsx` - Scroll nativo
- `/src/app/components/admin/CornerPositionSelector.tsx` - Validação
- `/src/app/components/admin/PositionConflictDialog.tsx` - Conflitos

### Documentação Histórica

Arquivada em `/docs/99-arquivo/css/`:
- `FIX_POSITION_ERRORS_2026-02-16.md`

### Removidos (já em Guidelines.md)

- `CODE_SNIPPETS_CSS_TRANSITIONS.md`
- `DOCUMENTATION_INDEX_CSS_FIX.md`
- `EXECUTIVE_SUMMARY_CSS_FIX.md`
- `__START_HERE_CSS_FIX.md`

---

## 📚 Referências

- **Guidelines Principal:** `/guidelines/Guidelines.md#regras-críticas-de-transições-css`
- **Decision Log:** `/CLEANUP_DECISION_LOG.md#css`
- **Índice de Correções:** `/__INDICE_CORRECOES_2026-02-17.md#css`
- **README CSS:** `/src/app/components/README_CSS_TRANSITIONS.md`

---

**Mantido por:** Equipe BemDito CMS  
**Última atualização:** 2026-02-21  
**Versão:** 1.1
