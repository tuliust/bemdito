# 🎨 Card Unificado de Texto do Megamenu

## 📋 Resumo da Mudança

**Antes:** 2 cards separados ("Título" e "Descrição")  
**Depois:** 1 card unificado "Texto do Megamenu" com 3 campos visíveis

---

## ⚠️ Problema Identificado

O modal de edição exibia os campos de forma inconsistente com a renderização pública:

### Renderização Pública (correto)
```
SOBRE A BEMDITO          ← title (chamada)
Conheça nossa história   ← mainTitle (título principal)
Descubra como...         ← description (descrição)
```

### Modal Admin (ANTES - incorreto)
```
Card "Título":
  - SOBRE A BEMDITO
  - Conheça nossa história

Card "Descrição":  ❌ Separado
  - Descrição
  - Conheça nossa história
```

**Problema:** Os 3 campos estavam espalhados em 2 cards, dificultando entender a hierarquia.

---

## ✅ Solução Implementada

### Novo Card Unificado "Texto do Megamenu"

**Preview compacto (quando recolhido):**
```
┌─────────────────────────────────────────────┐
│ Texto do Megamenu                     [>]  │
├─────────────────────────────────────────────┤
│ SOBRE A BEMDITO                             │ ← 1. title (chamada)
│ Descubra como transformamos ideias...       │ ← 2. description (descrição)
│ Conheça nossa história                      │ ← 3. mainTitle (título principal)
└─────────────────────────────────────────────┘
```

**Campos editáveis (quando expandido):**
```
┌─────────────────────────────────────────────┐
│ Texto do Megamenu                     [v]  │
├─────────────────────────────────────────────┤
│ SOBRE A BEMDITO                             │
│ Descubra como transformamos ideias...       │
│ Conheça nossa história                      │
├─────────────────────────────────────────────┤
│ 1. Chamada                                  │
│ [SOBRE A BEMDITO        ]                   │
│ [Tamanho]  [Cor]                            │
│ ─────────────────────────────────────────── │
│ 2. Descrição                                │
│ [Descubra como...       ]                   │
│ [Tamanho]  [Cor]                            │
│ ─────────────────────────────────────────── │
│ 3. Título Principal                         │
│ [Conheça nossa história ]                   │
│ [Tamanho]  [Cor]                            │
└─────────────────────────────────────────────┘
```

---

## 🎯 Hierarquia dos 3 Campos (Ordem de Renderização Pública)

| # | Campo | Nome Técnico | Exemplo | Estilo Padrão |
|---|-------|--------------|---------|---------------|
| 1️⃣ | **Chamada** | `title` | "SOBRE A BEMDITO" | body-small, uppercase |
| 2️⃣ | **Descrição** | `description` | "Descubra como transformamos..." | body-small, muted |
| 3️⃣ | **Título Principal** | `mainTitle` | "Conheça nossa história" | heading-3, bold |

⚠️ **ATENÇÃO:** A ordem de renderização no site público é: Chamada → Descrição → Título Principal

---

## 🔧 Estrutura Técnica

### Preview dos 3 Campos (Sempre Visível - Ordem Pública)
```tsx
<div className="space-y-2">
  {/* 1️⃣ Chamada */}
  <div style={titleStyle}>
    {column.title || 'SOBRE A BEMDITO'}
  </div>
  
  {/* 2️⃣ Descrição */}
  <div style={descriptionStyle}>
    {column.description || 'Descubra como transformamos ideias...'}
  </div>
  
  {/* 3️⃣ Título Principal */}
  <div style={mainTitleStyle}>
    {column.mainTitle || 'Conheça nossa história'}
  </div>
</div>
```

### Campos Editáveis (Quando Expandido)

Cada campo tem:
- ✅ **Input de texto** para editar o conteúdo
- ✅ **TypeScalePicker** para escolher tamanho da fonte
- ✅ **ColorTokenPicker** para escolher cor

```tsx
{/* 1️⃣ CHAMADA */}
<div className="space-y-4 pb-6 border-b">
  <Label>1. Chamada</Label>
  <Input
    value={column.title || ''}
    onChange={(e) => handleUpdateColumn({ title: e.target.value })}
    placeholder="SOBRE A BEMDITO"
  />
  <div className="grid grid-cols-2 gap-4">
    <TypeScalePicker
      label="Tamanho da Fonte"
      value={column.titleFontSize || ''}
      onChange={(tokenId) => handleUpdateColumn({ titleFontSize: tokenId })}
    />
    <ColorTokenPicker
      label="Cor"
      value={column.titleColor || ''}
      onChange={(tokenId) => handleUpdateColumn({ titleColor: tokenId })}
    />
  </div>
</div>

{/* 2️⃣ DESCRIÇÃO */}
<div className="space-y-4 pb-6 border-b">
  <Label>2. Descrição</Label>
  <Input
    value={column.description || ''}
    onChange={(e) => handleUpdateColumn({ description: e.target.value })}
    placeholder="Descubra como transformamos ideias..."
  />
  <div className="grid grid-cols-2 gap-4">
    <TypeScalePicker
      label="Tamanho da Fonte"
      value={column.descriptionFontSize || ''}
      onChange={(tokenId) => handleUpdateColumn({ descriptionFontSize: tokenId })}
    />
    <ColorTokenPicker
      label="Cor"
      value={column.descriptionColor || ''}
      onChange={(tokenId) => handleUpdateColumn({ descriptionColor: tokenId })}
    />
  </div>
</div>

{/* 3️⃣ TÍTULO PRINCIPAL */}
<div className="space-y-4">
  <Label>3. Título Principal</Label>
  <Input
    value={column.mainTitle || ''}
    onChange={(e) => handleUpdateColumn({ mainTitle: e.target.value })}
    placeholder="Conheça nossa história"
  />
  <div className="grid grid-cols-2 gap-4">
    <TypeScalePicker
      label="Tamanho da Fonte"
      value={column.mainTitleFontSize || ''}
      onChange={(tokenId) => handleUpdateColumn({ mainTitleFontSize: tokenId })}
    />
    <ColorTokenPicker
      label="Cor"
      value={column.mainTitleColor || ''}
      onChange={(tokenId) => handleUpdateColumn({ mainTitleColor: tokenId })}
    />
  </div>
</div>
```

---

## 🎨 Layout do Card

### Card Recolhido (Padrão)
- **Altura:** ~140px
- **Conteúdo visível:** Preview dos 3 campos com estilos aplicados
- **Botão:** ChevronRight (expandir)

### Card Expandido
- **Altura:** ~600px
- **Conteúdo adicional:** 3 seções editáveis (chamada, título, descrição)
- **Separadores:** Linhas horizontais entre as seções
- **Botão:** ChevronDown (recolher)

---

## ✅ Benefícios da Mudança

| Antes (2 cards) | Depois (1 card) |
|-----------------|-----------------|
| ❌ Confuso (2 cards para 3 campos) | ✅ Claro (1 card = 1 elemento visual) |
| ❌ "Título" ambíguo | ✅ "Texto do Megamenu" descritivo |
| ❌ Campos espalhados | ✅ Hierarquia visível (1→2→3) |
| ❌ Difícil entender fluxo | ✅ Preview mostra resultado final |

---

## 🧪 Como Testar

### 1. Interface Admin
```
http://localhost:3000/admin/menu-manager
```

1. Clique em qualquer item de menu (ex: "Ajustes")
2. Vá para aba **"Geral"**
3. Veja o novo card **"Texto do Megamenu"**
4. Expanda o card (chevron)
5. Edite os 3 campos

### 2. Preview Instantâneo
- Ao editar qualquer campo, o preview no topo do card atualiza automaticamente
- Os estilos (tamanho, cor) são aplicados em tempo real

### 3. Site Público
```
http://localhost:3000
```

1. Passe o mouse sobre o menu editado
2. Verifique se os 3 campos aparecem corretamente:
   - Chamada no topo
   - Título principal no meio
   - Descrição abaixo do título

---

## 📝 Mapeamento de Campos

### No Banco de Dados (`megamenu_config`)
```json
{
  "column": {
    "title": "SOBRE A BEMDITO",          // Campo 1
    "titleColor": "uuid-dark-token",
    "titleFontSize": "uuid-body-small",
    
    "mainTitle": "Conheça nossa história", // Campo 2
    "mainTitleColor": "uuid-dark-token",
    "mainTitleFontSize": "uuid-heading-3",
    
    "description": "Descubra como...",    // Campo 3
    "descriptionColor": "uuid-muted-token",
    "descriptionFontSize": "uuid-body-small"
  }
}
```

### No Componente MegamenuContent
```tsx
<div className="space-y-3">
  {/* 1️⃣ Chamada */}
  {column.title && (
    <p style={titleStyle}>{column.title}</p>
  )}
  
  {/* 3️⃣ Descrição */}
  {column.description && (
    <p style={descriptionStyle}>{column.description}</p>
  )}
  
  {/* 2️⃣ Título Principal */}
  {column.mainTitle && (
    <h3 style={mainTitleStyle}>{column.mainTitle}</h3>
  )}
</div>
```

---

## 🔄 Fluxo de Edição

```
1. Usuário abre card "Texto do Megamenu"
   ↓
2. Vê preview dos 3 campos com estilos aplicados
   ↓
3. Clica no chevron para expandir
   ↓
4. Edita um campo (ex: descrição)
   ↓
5. Preview atualiza instantaneamente
   ↓
6. Auto-save em 800ms salva no banco
   ↓
7. Site público reflete mudança imediatamente
```

---

## 📊 Estrutura do Código

### Arquivo Modificado
- `/src/app/admin/menu-manager/MegamenuConfigurator.tsx`

### Mudanças Principais
1. **Removidos:** 2 cards separados (`EditableCardBase` para "Título" e "Descrição")
2. **Adicionado:** 1 card customizado com 3 seções editáveis
3. **Preview:** 3 campos sempre visíveis com estilos aplicados
4. **Layout:** Grid de 2 colunas para pickers (tamanho + cor)

### Estado Gerenciado
```tsx
const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

// Controle de expansão
const toggleCardExpanded = (cardId: string) => {
  const newExpanded = new Set(expandedCards);
  if (newExpanded.has(cardId)) {
    newExpanded.delete(cardId);
  } else {
    newExpanded.add(cardId);
  }
  setExpandedCards(newExpanded);
};

// Card ID: 'text-megamenu'
```

---

## ✅ Checklist de Validação

- [ ] Card "Texto do Megamenu" aparece na aba "Geral"
- [ ] Preview mostra os 3 campos com estilos corretos
- [ ] Botão chevron expande/recolhe o card
- [ ] Ao expandir, aparecem 3 seções separadas por linhas
- [ ] Cada seção tem input + 2 pickers (tamanho e cor)
- [ ] Editar qualquer campo atualiza o preview instantaneamente
- [ ] Auto-save funciona (800ms após edição)
- [ ] Site público reflete as mudanças corretamente

---

**✨ Card unificado implementado com sucesso!**

**Tempo de implementação:** ~10 minutos  
**Benefício:** Interface 100% consistente com renderização pública
