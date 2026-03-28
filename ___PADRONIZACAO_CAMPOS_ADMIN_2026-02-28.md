# ✅ Padronização de Campos do Painel Admin (2026-02-28)

## 🎯 Objetivo

Padronizar a formatação visual de **todos os campos de seleção** do painel admin para terem o **mesmo estilo** do "Botão de Seleção de Ícone", garantindo consistência visual em toda a interface.

---

## 📊 Campos Padronizados

### **1. TypeScalePicker** (Seleção de Fonte)
**Arquivo:** `/src/app/components/admin/TypeScalePicker.tsx`

**Mudanças:**
- ✅ Padding alterado de `px-3 py-2` → `px-4 py-2`
- ✅ Classes padronizadas: `border-2 border-gray-200 rounded-lg bg-white hover:border-primary`
- ✅ Texto agora em **uma única linha**: `"Chamada (1.1rem · Peso 600)"`
- ✅ Removida estrutura de 2 linhas (field-button + field-hint)
- ✅ Adicionado `transition: 'none'` para evitar erros de parsing

**Antes:**
```tsx
<div className="flex flex-col">
  <span data-slot="field-button">Chamada</span>
  <span data-slot="field-hint">1.1rem · Peso 600</span>
</div>
```

**Depois:**
```tsx
<span className="text-sm text-gray-600">
  Chamada (1.1rem · Peso 600)
</span>
```

---

### **2. Select Dropdown** (Espaçamento)
**Arquivo:** `/src/app/admin/sections-manager/SectionBuilder.tsx`

**Campos atualizados:**
- ✅ Padding Superior
- ✅ Padding Inferior
- ✅ Margem Esquerda
- ✅ Margem Direita
- ✅ Gap (entre colunas)
- ✅ Gap (entre linhas)
- ✅ Modo de Exibição de Mídia
- ✅ Efeito do Ícone no Botão
- ✅ Selecionar Página (Link Interno)
- ✅ Selecionar Seção (Anchor)

**Mudanças:**
- ✅ Padding alterado de `px-3 py-2` → `px-4 py-2`
- ✅ Classes padronizadas: `border-2 border-gray-200 rounded-lg bg-white hover:border-primary text-sm text-gray-600`
- ✅ Substituído inline styles por classes Tailwind
- ✅ Adicionado `transition: 'none'`

**Antes:**
```tsx
className="w-full px-3 py-2 rounded-lg"
style={{ 
  backgroundColor: 'var(--admin-field-bg, #ffffff)', 
  border: '2px solid var(--admin-field-border, #e5e7eb)', 
  color: 'var(--admin-field-text, #111827)' 
}}
```

**Depois:**
```tsx
className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-primary text-sm text-gray-600"
style={{ transition: 'none' }}
```

---

## 🎨 Estilo Padrão Final

### **Classes Tailwind Obrigatórias**
```tsx
className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-primary hover:bg-gray-50 text-sm text-gray-600"
```

### **Inline Style Obrigatório**
```tsx
style={{ transition: 'none' }}
```

---

## 📏 Especificações Visuais

| Propriedade | Valor | Descrição |
|------------|-------|-----------|
| **Padding Horizontal** | `1rem` (16px) | `px-4` |
| **Padding Vertical** | `0.5rem` (8px) | `py-2` |
| **Borda** | `2px solid #e5e7eb` | `border-2 border-gray-200` |
| **Borda Hover** | `2px solid var(--primary)` | `hover:border-primary` |
| **Fundo** | `#ffffff` | `bg-white` |
| **Fundo Hover** | `#f9fafb` (Gray-50) | `hover:bg-gray-50` |
| **Border Radius** | `0.5rem` (8px) | `rounded-lg` |
| **Texto** | `0.875rem` (14px) | `text-sm` |
| **Cor do Texto** | `#4b5563` (Gray-600) | `text-gray-600` |
| **Placeholder** | `#9ca3af` (Gray-400) | `text-gray-400` |

---

## ✅ Arquivos Modificados

1. `/src/app/components/admin/TypeScalePicker.tsx`
   - Botão trigger reformatado (linha 54-70)
   - Itens do popover com classes atualizadas (linha 97-140)

2. `/src/app/admin/sections-manager/SectionBuilder.tsx`
   - 10 campos `<select>` padronizados:
     - Padding Superior/Inferior (linha 516-538)
     - Gap entre colunas/linhas (linha 551-565)
     - Modo de exibição de mídia (linha 727-735)
     - Efeito do ícone (linha 1122-1132)
     - Seletor de página (linha 1147-1156)
     - Seletor de seção (linha 1169-1179)

---

## 🎯 Benefícios

- ✅ **Consistência visual total** em todos os campos de seleção
- ✅ **Padding uniforme** (16px horizontal, 8px vertical)
- ✅ **Hover padronizado** (borda rosa + fundo cinza claro ao passar o mouse)
- ✅ **Tipografia consistente** (14px, Gray-600)
- ✅ **Sem erros de parsing** (transition: 'none')
- ✅ **Código mais limpo** (menos inline styles, mais classes Tailwind)

---

## 📝 Regras para Novos Campos

Ao criar **qualquer novo campo de seleção** (select, button picker, etc.) no painel admin:

✅ **SEMPRE** usar as classes padrão: `w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:border-primary hover:bg-gray-50 text-sm text-gray-600`

✅ **SEMPRE** adicionar `style={{ transition: 'none' }}`

✅ **SEMPRE** usar `text-gray-400` para placeholders

❌ **NUNCA** usar `px-3` (sempre `px-4`)

❌ **NUNCA** usar inline styles para cores (usar classes Tailwind)

❌ **NUNCA** omitir `hover:border-primary`

---

## 🔍 Validação Visual

### **Estado Normal**
```
┌────────────────────────────────────────────┐
│  Chamada (1.1rem · Peso 600)               │ ← text-sm text-gray-600
└────────────────────────────────────────────┘
│←─ 16px ─→│                      │←─ 16px ─→│
│                                            │
▲ 8px padding vertical                      ▲
│                                            │
└─ 2px borda #e5e7eb ───────────────────────┘
```

### **Estado Hover**
```
┌────────────────────────────────────────────┐
│  Chamada (1.1rem · Peso 600)               │
└────────────────────────────────────────────┘
└─ 2px borda ROSA (var(--primary)) ──────────┘
└─ fundo cinza claro (#f9fafb) ──────────────┘
```

### **Estado Vazio (Placeholder)**
```
┌────────────────────────────────────────────┐
│  Selecione um tamanho                      │ ← text-sm text-gray-400
└────────────────────────────────────────────┘
```

---

## ✨ Status Final

- ✅ **TypeScalePicker**: 100% padronizado
- ✅ **Select (Espaçamento)**: 6 campos padronizados
- ✅ **Select (Mídia)**: 1 campo padronizado
- ✅ **Select (Botão)**: 1 campo padronizado
- ✅ **Select (Link)**: 2 campos padronizados

**Total:** **11 campos** reformatados para o novo padrão visual! 🎉

---

**Data:** 2026-02-28  
**Versão:** 1.0  
**Status:** ✅ Concluído
