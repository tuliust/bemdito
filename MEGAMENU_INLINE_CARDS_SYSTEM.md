# ✨ Sistema de Cards Inline do Megamenu

## 🎯 Mudanças Implementadas

### ❌ Sistema Antigo (Removido)
- Cards vinham da tabela `menu_cards` (banco de dados)
- Sistema de seleção de cards existentes
- Formatação individual por card
- Limite de 4 cards via `card_ids: string[]`

### ✅ Sistema Novo (Cards Inline)
- Cards criados diretamente no megamenu (sem banco)
- Sistema progressivo (Card 2 só aparece se Card 1 foi preenchido)
- **Formatação compartilhada** para todos os cards
- Limite de 4 cards via validação progressiva

---

## 🏗️ Estrutura de Dados

### Interface InlineCard

```typescript
interface InlineCard {
  id: string;       // UUID gerado automaticamente
  icon: string;     // Nome do ícone Lucide (ex: "Star")
  title: string;    // Título do card
  subtitle: string; // Subtítulo do card
  url: string;      // URL de destino
}
```

### Interface SharedCardFormatting

```typescript
interface SharedCardFormatting {
  titleFontSize?: string;      // UUID do token de tipografia (título)
  titleColor?: string;         // UUID do token de cor (título)
  subtitleFontSize?: string;   // UUID do token de tipografia (subtítulo)
  iconSize?: string;           // UUID do token de tipografia (ícone)
  iconColor?: string;          // UUID do token de cor (ícone)
  bgColor?: string;            // UUID do token de cor de fundo
  borderColor?: string;        // UUID do token de cor da borda
}
```

### MegamenuColumn (Atualizada)

```typescript
interface MegamenuColumn {
  id: string;
  title: string;
  titleColor?: string;
  titleFontSize?: string;
  description?: string;
  descriptionColor?: string;
  descriptionFontSize?: string;
  mainTitle?: string;
  mainTitleColor?: string;
  mainTitleFontSize?: string;
  media_url?: string;
  
  // ✨ NOVOS CAMPOS
  inlineCards?: InlineCard[];                    // Array de cards inline (máx 4)
  cardFormatting?: SharedCardFormatting;         // Formatação compartilhada
}
```

---

## 📊 Fluxo de Criação Progressiva

### Etapa 1: Formatação Compartilhada

```
┌──────────────────────────────────────────────────────┐
│ Formatação dos Cards                                 │
├──────────────────────────────────────────────────────┤
│ Esta formatação será aplicada em todos os cards      │
│                                                      │
│ [Tamanho do Título]     [Cor do Título]             │
│ [Tamanho do Subtítulo]  [Tamanho do Ícone]          │
│ [Cor do Ícone]          [Cor de Fundo]              │
│ [Cor da Borda]          [ ]                          │
└──────────────────────────────────────────────────────┘
```

**Campos (7 total):**
- **Tamanho do Título** → TypeScalePicker (body-base, heading-4, etc)
- **Cor do Título** → ColorTokenPicker (primary, dark, etc)
- **Tamanho do Subtítulo** → TypeScalePicker (body-small, body-base, etc)
- **Tamanho do Ícone** → TypeScalePicker (heading-3, heading-4, etc)
- **Cor do Ícone** → ColorTokenPicker (primary, accent, etc)
- **Cor de Fundo** → ColorTokenPicker (background, muted, etc)
- **Cor da Borda** → ColorTokenPicker (border, muted, etc)

---

### Etapa 2: Card 1 (Sempre Visível)

```
┌──────────────────────────────────────────┐
│ ⭐ Card 1                          [X]   │
├──────────────────────────────────────────┤
│ [Expandir/Recolher ▼]                   │
│                                          │
│ Ícone: [Seletor de Ícone]               │
│ Título: [Input]                          │
│ Subtítulo: [Input]                       │
│ URL: [Input]                             │
└──────────────────────────────────────────┘
```

**Estado:** Sempre visível (mesmo vazio)

---

### Etapa 3: Card 2 (Progressivo)

```
Condição: Só aparece se Card 1.title foi preenchido

┌──────────────────────────────────────────┐
│ ⭐ Card 2                          [X]   │
├──────────────────────────────────────────┤
│ ... mesma estrutura ...                  │
└──────────────────────────────────────────┘

OU

┌──────────────────────────────────────────┐
│ [+ Adicionar Card 2]                     │
└──────────────────────────────────────────┘
```

---

### Etapa 4: Card 3 (Progressivo)

```
Condição: Só aparece se Card 2.title foi preenchido

... mesma lógica ...
```

---

### Etapa 5: Card 4 (Progressivo)

```
Condição: Só aparece se Card 3.title foi preenchido

... mesma lógica ...
```

---

## 🎨 Lógica de Exibição Progressiva

### Código de Validação

```tsx
{/* Card 1 - Sempre visível */}
{renderInlineCard(0)}

{/* Card 2 - Só aparece se Card 1 foi preenchido */}
{inlineCards.length > 0 && inlineCards[0].title && renderInlineCard(1)}

{/* Card 3 - Só aparece se Card 2 foi preenchido */}
{inlineCards.length > 1 && inlineCards[1].title && renderInlineCard(2)}

{/* Card 4 - Só aparece se Card 3 foi preenchido */}
{inlineCards.length > 2 && inlineCards[2].title && renderInlineCard(3)}

{/* Botão adicionar (se não houver card na posição) */}
{inlineCards.length < 4 && (
  <Button onClick={handleAddCard}>
    <Plus /> Adicionar Card {inlineCards.length + 1}
  </Button>
)}
```

---

## 🔄 Fluxo Completo de Edição

### 1️⃣ Usuário Abre Aba "Cards"

```
Estado inicial:
- Formatação compartilhada: campos vazios
- Card 1: visível (vazio)
- Cards 2-4: não visíveis
- Botão "Adicionar Card 2": não visível
```

---

### 2️⃣ Usuário Configura Formatação

```
1. Seleciona "Tamanho do Título" → body-base
2. Seleciona "Cor do Título" → primary
3. Seleciona "Tamanho do Subtítulo" → body-small
4. Seleciona "Tamanho do Ícone" → heading-4
5. Seleciona "Cor do Ícone" → accent
6. Seleciona "Cor de Fundo" → muted
7. Seleciona "Cor da Borda" → border

✅ Formatação salva em column.cardFormatting
```

---

### 3️⃣ Usuário Cria Card 1

```
1. Clica em Card 1 → Expande
2. Seleciona ícone → "Star"
3. Preenche título → "Sobre Nós"
4. Preenche subtítulo → "Conheça nossa equipe"
5. Preenche URL → "/sobre"

✅ Card 1 criado
✅ Botão "Adicionar Card 2" aparece
```

---

### 4️⃣ Usuário Adiciona Card 2

```
1. Clica em "Adicionar Card 2"
   ↓
2. Card 2 aparece (vazio, recolhido)
   ↓
3. Usuário expande e preenche
   ↓
4. ✅ Card 2 criado
5. ✅ Botão "Adicionar Card 3" aparece
```

---

### 5️⃣ Usuário Remove Card 2

```
1. Clica no [X] do Card 2
   ↓
2. Card 2 é removido
   ↓
3. Card 3 e 4 (se existiam) também são removidos
   ↓
4. ✅ Botão "Adicionar Card 2" reaparece
```

---

## 📝 Estrutura no Banco de Dados

### Antes (card_ids)

```json
{
  "megamenu_config": {
    "column": {
      "card_ids": [
        "uuid-card-1",
        "uuid-card-2",
        "uuid-card-3"
      ]
    }
  }
}
```

### Depois (inlineCards)

```json
{
  "megamenu_config": {
    "column": {
      "inlineCards": [
        {
          "id": "card-1709123456789",
          "icon": "Star",
          "title": "Sobre Nós",
          "subtitle": "Conheça nossa equipe",
          "url": "/sobre"
        },
        {
          "id": "card-1709123457890",
          "icon": "Briefcase",
          "title": "Portfólio",
          "subtitle": "Veja nossos projetos",
          "url": "/portfolio"
        }
      ],
      "cardFormatting": {
        "titleFontSize": "uuid-body-base",
        "titleColor": "uuid-primary",
        "subtitleFontSize": "uuid-body-small",
        "iconSize": "uuid-heading-4",
        "iconColor": "uuid-accent",
        "bgColor": "uuid-muted",
        "borderColor": "uuid-border"
      }
    }
  }
}
```

---

## 🎨 Renderização no Site Público

### Aplicação da Formatação Compartilhada

```tsx
// Cada card inline usa a formatação compartilhada
const cardStyle = {
  backgroundColor: getTokenColor(column.cardFormatting?.bgColor, '#ffffff'),
  borderColor: getTokenColor(column.cardFormatting?.borderColor, '#e5e7eb'),
};

const titleStyle = {
  color: getTokenColor(column.cardFormatting?.titleColor, '#000000'),
  ...getTypographyFromTokenId(column.cardFormatting?.titleFontSize),
};

// Renderizar cada card
column.inlineCards?.map((card) => (
  <div key={card.id} style={cardStyle}>
    {getLucideIcon(card.icon)}
    <h4 style={titleStyle}>{card.title}</h4>
    <p>{card.subtitle}</p>
  </div>
))
```

---

## ✅ Benefícios do Sistema Novo

| Antes | Depois |
|-------|--------|
| ❌ Dependência da tabela `menu_cards` | ✅ Dados inline (autocontido) |
| ❌ Seleção de cards existentes (confuso) | ✅ Criação direta (intuitivo) |
| ❌ Formatação individual por card | ✅ Formatação compartilhada (consistente) |
| ❌ Todos os 4 cards visíveis sempre | ✅ Sistema progressivo (UX melhor) |
| ❌ Precisa gerenciar biblioteca | ✅ Autocontido no megamenu |

---

## 🔧 Funções Principais

### handleAddCard()
Adiciona novo card inline com ID único baseado em timestamp

```typescript
const handleAddCard = () => {
  const newCard: InlineCard = {
    id: `card-${Date.now()}`,
    icon: 'Star',
    title: '',
    subtitle: '',
    url: '',
  };
  handleUpdateColumn({
    inlineCards: [...inlineCards, newCard],
  });
};
```

### handleUpdateCard()
Atualiza card inline específico por ID

```typescript
const handleUpdateCard = (cardId: string, updates: Partial<InlineCard>) => {
  const updatedCards = inlineCards.map((card) =>
    card.id === cardId ? { ...card, ...updates } : card
  );
  handleUpdateColumn({ inlineCards: updatedCards });
};
```

### handleRemoveCard()
Remove card inline por ID

```typescript
const handleRemoveCard = (cardId: string) => {
  handleUpdateColumn({
    inlineCards: inlineCards.filter((card) => card.id !== cardId),
  });
};
```

### handleUpdateFormatting()
Atualiza formatação compartilhada

```typescript
const handleUpdateFormatting = (updates: Partial<SharedCardFormatting>) => {
  handleUpdateColumn({
    cardFormatting: {
      ...cardFormatting,
      ...updates,
    },
  });
};
```

---

## 🎯 Checklist de Validação

### Interface Admin

- [ ] Aba "Cards" existe
- [ ] Seção "Formatação dos Cards" aparece no topo
- [ ] 4 campos de formatação (tamanho, cor título, bg, borda)
- [ ] Card 1 sempre visível (mesmo vazio)
- [ ] Card 2 só aparece se Card 1.title preenchido
- [ ] Card 3 só aparece se Card 2.title preenchido
- [ ] Card 4 só aparece se Card 3.title preenchido
- [ ] Botão "Adicionar Card X" aparece quando apropriado
- [ ] Botão [X] remove o card corretamente
- [ ] Expandir/recolher funciona

### Preview

- [ ] Cards inline aparecem no megamenu
- [ ] Formatação compartilhada é aplicada
- [ ] Ícones renderizam corretamente
- [ ] Links funcionam

---

## 📁 Arquivos Modificados

1. **Componente principal:**
   - `/src/app/admin/menu-manager/MegamenuConfigurator.tsx`
   - Sistema completo de cards inline implementado

2. **Documentação:**
   - `/MEGAMENU_INLINE_CARDS_SYSTEM.md` (este arquivo)

---

## 🔄 Migration Necessária (Próximo Passo)

Para migrar dados existentes de `card_ids` para `inlineCards`:

```sql
-- Exemplo de migration (estrutura)
UPDATE menu_items
SET megamenu_config = jsonb_set(
  megamenu_config,
  '{column,inlineCards}',
  '[]'::jsonb
)
WHERE megamenu_config->'column'->>'card_ids' IS NOT NULL;
```

**Nota:** Dados antigos em `card_ids` serão ignorados (sistema novo não usa).

---

**✅ Sistema de Cards Inline implementado com sucesso!**

**Próximos passos:**
1. Testar interface admin
2. Implementar renderização no `MegamenuContent.tsx`
3. Criar migration SQL (se necessário)
4. Documentar no `Guidelines.md`
