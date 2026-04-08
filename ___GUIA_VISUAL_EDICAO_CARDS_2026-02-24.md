# 🎨 Guia Visual: Como Editar Cores e Transparência dos Cards

**Data:** 2026-02-24  
**Localização:** `/admin/menu-manager` → Aba "Cards Globais"

---

## 📍 **Passo a Passo para Encontrar os Campos:**

### **1️⃣ Navegue até a Página Correta**

```
URL: http://localhost:3000/admin/menu-manager
```

### **2️⃣ Selecione a Aba "Cards Globais"**

No topo da página, você verá **4 abas**:
- Itens do Menu
- Header
- **Cards Globais** ← **CLIQUE AQUI**
- Histórico de Versões

### **3️⃣ Localize um Card no Grid**

Você verá um **grid com 3 colunas** mostrando todos os 22 cards.

Cada card exibe:
- 📋 **Preview** (ícone + título + subtítulo)
- 📝 **Nome interno** (ex: "Branding & Identidade")
- 🔗 **URL** (se configurado)

### **4️⃣ Passe o Mouse Sobre o Card**

Ao **passar o mouse** sobre qualquer card, aparecerão **5 botões** na parte inferior:

```
┌─────────────────────────────────────────┐
│  Card Preview                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  Branding & Identidade                  │
│  🔗 /servicos/branding                  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ [Editar] [Duplicar] [🗑️] [🎨]    │  │ ← Botões aparecem ao passar mouse
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Ordem dos Botões (da esquerda para direita):**
1. ✏️ **Editar** (lápis) - Editar conteúdo (título, subtítulo, URL)
2. 📋 **Duplicar** (cópia) - Criar cópia do card
3. 🗑️ **Excluir** (lixeira) - Deletar o card
4. 🎨 **PALETTE** (paleta de cores) ← **ESTE É O BOTÃO QUE VOCÊ PROCURA!**

### **5️⃣ Clique no Botão 🎨 Palette**

Ao clicar no **último botão** (ícone de paleta), abrirá o modal:

```
┌───────────────────────────────────────────────────────┐
│ Editar Visual do Card                      [X]        │
├───────────────────────────────────────────────────────┤
│                                                       │
│ Cor de Fundo                                          │
│ [Seletor de Cor] ◄── Escolha uma cor do Design Token │
│                                                       │
│ Opacidade do Fundo                                    │
│ [━━━━━━━━●──────] 75% ◄── Arraste o slider           │
│                                                       │
│ ──────────────────────────────────────────────        │
│                                                       │
│ Cor da Borda                                          │
│ [Seletor de Cor] ◄── Escolha uma cor do Design Token │
│                                                       │
│ Opacidade da Borda                                    │
│ [━━━━━━━━━●─────] 90% ◄── Arraste o slider           │
│                                                       │
│ ┌─────────────────────────────────────────────────┐  │
│ │ Preview                                         │  │
│ │ ┌─────────────────────────────────────────────┐ │  │
│ │ │      Exemplo de Card                        │ │  │
│ │ └─────────────────────────────────────────────┘ │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
│                       [Cancelar] [Salvar]             │
└───────────────────────────────────────────────────────┘
```

---

## 🎯 **Troubleshooting: "Não Vejo os Botões"**

### **Possível Causa 1: Não Passou o Mouse**
**Solução:** Os botões ficam **invisíveis** até você **passar o mouse** sobre o card.

### **Possível Causa 2: Está na Aba Errada**
**Solução:** Certifique-se de estar na aba **"Cards Globais"** (3ª aba).

### **Possível Causa 3: Tela Muito Pequena (Mobile)**
**Solução:** Em telas pequenas, os botões podem estar empilhados. Tente usar um monitor desktop.

### **Possível Causa 4: Cache do Navegador**
**Solução:** 
1. Pressione **CTRL + SHIFT + R** (Windows/Linux)
2. Ou **CMD + SHIFT + R** (Mac)
3. Isso recarrega a página ignorando cache

### **Possível Causa 5: Código Não Foi Salvo/Compilado**
**Solução:**
1. Verifique o terminal se há erros de compilação
2. Reinicie o servidor: `npm run dev` ou similar
3. Aguarde compilação completa (sem erros)

---

## 🔍 **Como Confirmar que o Botão Está Lá (Inspeção):**

1. Abra **DevTools** (F12)
2. Vá na aba **Console**
3. Digite:
```javascript
document.querySelectorAll('button').length
```
4. Você deve ver um número grande (muitos botões na página)

5. Agora filtre especificamente pelo botão Palette:
```javascript
Array.from(document.querySelectorAll('button')).filter(b => b.querySelector('svg[data-lucide="palette"]')).length
```
6. Isso deve retornar **22** (um botão por card)

---

## 📊 **Verificação do Estado Atual:**

### **Banco de Dados:**
```sql
-- Verificar se as colunas existem
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'menu_cards' 
  AND column_name IN ('bg_opacity', 'border_opacity');
```
**Esperado:** 2 linhas (bg_opacity, border_opacity)

### **Código:**
```bash
# Verificar se o botão está no código
grep -n "Palette" /src/app/admin/menu-manager/MegamenuCardsTab.tsx
```
**Esperado:** 2 linhas (import + uso no JSX)

### **Runtime:**
Abra o Console do navegador e digite:
```javascript
console.log('Botões Palette:', document.querySelectorAll('[data-lucide="palette"]').length);
```
**Esperado:** 22 (se houver 22 cards na página)

---

## 🎨 **Campos Disponíveis no Modal:**

| Campo | Tipo | Range | Default |
|-------|------|-------|---------|
| **Cor de Fundo** | ColorTokenPicker | Tokens do DS | #ffffff |
| **Opacidade do Fundo** | Slider | 0-100% | 100% |
| **Cor da Borda** | ColorTokenPicker | Tokens do DS | #e5e7eb |
| **Opacidade da Borda** | Slider | 0-100% | 100% |

---

## ✅ **Exemplo de Uso:**

### **Cenário: Card Semi-Transparente com Borda Vermelha**

1. Clique no botão 🎨 Palette de um card
2. **Cor de Fundo:** Selecione "Branco" (white)
3. **Opacidade do Fundo:** Ajuste para **50%**
4. **Cor da Borda:** Selecione "Destructive" (vermelho)
5. **Opacidade da Borda:** Mantenha **100%**
6. Veja o preview em tempo real
7. Clique em **Salvar**
8. Toast de sucesso aparece
9. Abra o megamenu no site público
10. Card está semi-transparente com borda vermelha sólida! ✨

---

## 🚨 **Se Ainda Não Conseguir Ver:**

**Por favor, forneça:**
1. Screenshot da aba "Cards Globais"
2. Screenshot do Console (F12 → Console)
3. Resultado da query SQL de verificação
4. Resultado do `grep` no código

Com essas informações, posso diagnosticar exatamente o problema!

---

**Última atualização:** 2026-02-24  
**Autor:** AI Assistant  
**Status:** ✅ Implementado e Testado

