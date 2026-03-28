# 🔧 TROUBLESHOOTING - BemDito CMS

**Versão:** 1.1  
**Data:** 2026-02-21 (v1.1 — seção "Problemas de Tema Admin" adicionada)  
**Última atualização:** 2026-02-21

---

## 🎯 Índice Rápido

- [Problemas de Renderização](#problemas-de-renderização)
- [Problemas de Grid e Layout](#problemas-de-grid-e-layout)
- [Problemas de Mídia](#problemas-de-mídia)
- [Problemas de Cards](#problemas-de-cards)
- [Problemas de Spacing](#problemas-de-spacing)
- [Problemas de UI](#problemas-de-ui)
- [Problemas de Tema Admin (AdminThemeProvider)](#problemas-de-tema-admin-adminthemeprovider)
- [Problemas de Banco de Dados](#problemas-de-banco-de-dados)

---

## 🚨 Problemas de Renderização

### Seção não aparece na página

**Sintomas:**
- Seção está vinculada mas não renderiza
- Console sem erros
- Dados existem no banco

**Causas possíveis:**

#### 1. gridRows inconsistente com posições

**Diagnóstico:**
```sql
SELECT 
  id, name,
  config->>'gridRows' as grid_rows,
  layout->'desktop'->>'text' as text_pos
FROM sections
WHERE id = 'SEU_ID_AQUI';
```

**Solução:**
- Se `text_pos` = `'middle-left'` ou `'center'` → `grid_rows` DEVE ser `2`
- Execute migration de normalização

**Arquivo:** `SectionRenderer.tsx` (auto-fix implementado)

---

#### 2. Posições salvas como objetos

**Diagnóstico:**
```sql
SELECT 
  layout->'desktop'->'text' as text_field
FROM sections
WHERE id = 'SEU_ID_AQUI';
```

Se retornar `{"position": "middle-left"}` ao invés de `"middle-left"`:

**Solução:**
```sql
-- Converter para string
UPDATE sections
SET layout = jsonb_set(
  layout,
  '{desktop,text}',
  to_jsonb((layout->'desktop'->'text'->>'position'))
)
WHERE id = 'SEU_ID_AQUI';
```

**Arquivo:** Migration v6.15

---

### Texto ocupa 100% da largura ao invés de 50%

**Sintomas:**
- Seção com `gridCols = 1`
- Posição contém "left" (`top-left`, `middle-left`)
- Texto não fica apenas na coluna esquerda

**Causa:** Lógica `useGrid` não detectava texto que deve ficar apenas na esquerda.

**Solução:** Já corrigida no `SectionRenderer.tsx` (linha 1206-1223).

**Validação:**
```typescript
const isTextOnlyLeft = effectiveGridCols === 1 && 
                       !hasMedia && 
                       (textPosition?.includes('left'));
```

**Arquivo:** `SectionRenderer.tsx`

---

## 🎨 Problemas de Grid e Layout

### Grid duplicado (conteúdo ocupa só 50% da tela)

**Sintomas:**
- Seção 2×2 com mídia
- Conteúdo centralizado mas não fullwidth
- Espaço vazio nas laterais

**Causa:** Grid externo desnecessário.

**Solução:** Já corrigida (grid externo removido).

**Validação:** Inspecionar elemento - deve haver **APENAS 1** `display: grid` na seção.

**Arquivo:** `SectionRenderer.tsx` (linhas 1627-1674)

---

### Botões de grid não selecionam visualmente

**Sintomas:**
- Clicar em "2 Colunas" não destaca o botão
- Valor é salvo mas UI não atualiza

**Causa:** Estado local não sincroniza com prop.

**Solução:** Já corrigida (useEffect adicionado).

**Validação:**
```typescript
useEffect(() => {
  if (initialLayout) {
    setLayout(initialLayout);
  }
}, [initialLayout]);
```

**Arquivo:** `SectionBuilder.tsx` (linha 547)

---

### Mídia não respeita altura do texto em seções auto

**Sintomas:**
- Seção com `height: 'auto'` + grid 2×2
- Mídia muito grande (celular gigante)
- Texto ocupa só ~25% da altura

**Causa:** Grid template rows forçava 50% + 50% mesmo em modo auto.

**Solução:** Já corrigida.

**Código correto:**
```typescript
gridTemplateRows: effectiveGridRows === 2 
  ? (heightMode === 'auto' ? 'auto auto' : '1fr 1fr')
  : (heightMode === 'auto' ? 'min-content' : '1fr'),
```

**Arquivo:** `SectionRenderer.tsx` (linha 1256)

---

## 🖼️ Problemas de Mídia

### Mídia invisível (width: 0)

**Sintomas:**
- Modo de exibição: "alinhada"
- Imagem não aparece
- Inspecionar mostra `width: 0px`

**Causa:** `width: auto` + `position: absolute` = colapso.

**Solução:** Já corrigida.

**Código correto:**
```typescript
style={{
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  position: 'absolute',
}}
```

**Arquivo:** `SectionRenderer.tsx` (linhas 1428-1446)

---

### Mídia não cola nas bordas (modo "alinhada")

**Sintomas:**
- `fitMode = "alinhada"`
- `alignX = "right"`, `alignY = "bottom"`
- Imagem não cola na borda inferior direita

**Causas possíveis:**

#### 1. Campos alignX/alignY faltando

**Diagnóstico:**
```sql
SELECT 
  config->'media'->>'fitMode' as fit_mode,
  config->'media'->>'alignX' as align_x,
  config->'media'->>'alignY' as align_y
FROM sections
WHERE id = 'SEU_ID_AQUI';
```

Se `align_x` ou `align_y` são NULL:

**Solução:**
```sql
UPDATE sections 
SET config = jsonb_set(
  jsonb_set(
    config,
    '{media,alignX}',
    '"right"',
    true
  ),
  '{media,alignY}',
  '"bottom"',
  true
)
WHERE id = 'SEU_ID_AQUI';
```

---

#### 2. Column-gap impedindo cola nas bordas

**Diagnóstico:** Verificar se `columnGap > 0` no grid.

**Solução:** Já corrigida (gap removido automaticamente em modo alinhada).

**Código:**
```typescript
const shouldRemoveGap = mediaDisplayMode === 'alinhada' && 
                        hasMedia && 
                        (mediaAlign === 'left' || mediaAlign === 'right');
columnGap: shouldRemoveGap ? '0px' : '32px',
```

**Arquivo:** `SectionRenderer.tsx`

---

### Mídia não carrega (figma:asset)

**Sintomas:**
- URL começa com `figma:asset/`
- Erro: `ERR_UNKNOWN_URL_SCHEME`

**Causa:** `figma:asset/` só funciona em imports estáticos, não URLs dinâmicas.

**Solução:**
1. Fazer upload da mídia via `MediaUploader`
2. Usar a signed URL gerada pelo Supabase Storage

**Arquivo:** `CardRenderer.tsx` (validação automática)

---

## 🎴 Problemas de Cards

### Toggle "Cards" desligado mas cards aparecem

**Sintomas:**
- Toggle desligado no modal
- Cards continuam aparecendo na página
- `elements.hasCards = false` no banco

**Causa:** Lógica forçava `hasCards = true` se houvesse cards no banco.

**Solução:** Já corrigida.

**Código correto:**
```typescript
const hasCards = elements.hasCards !== undefined ? elements.hasCards : false;
```

**Arquivo:** `SectionRenderer.tsx`

---

### Cards não aparecem após salvar

**Sintomas:**
- Toggle ativado
- Template selecionado
- "Salvar" → cards não renderizam

**Diagnóstico:**

**1. Verificar se dados foram salvos:**
```sql
SELECT 
  elements->>'hasCards' as has_cards,
  config->>'cardTemplateId' as template_id,
  layout->'desktop'->>'cards' as cards_pos
FROM sections
WHERE id = 'SEU_ID_AQUI';
```

**2. Verificar se template tem cards:**
```sql
SELECT COUNT(*) as total_cards
FROM template_cards
WHERE template_id = 'UUID_DO_TEMPLATE';
```

**3. Verificar logs do console:**
```
🔍 [loadSectionCards] DIAGNÓSTICO INICIAL...
   sectionId: ...
   cardTemplateId: ...
```

**Soluções:**

- Se `has_cards` é NULL → Modal não salvou, verificar `onChange`
- Se `template_id` é NULL → Template não selecionado
- Se `total_cards` = 0 → Template vazio, adicionar cards
- Se logs não aparecem → Seção não está vinculada à página

**Arquivo:** `SectionRenderer.tsx` (linha 219-239)

---

### Filtros de cards usam cores erradas

**Sintomas:**
- Botões de filtro sem cor
- Cores não mudam ao clicar

**Causa:** Código buscava cores em campos incorretos (`tabActiveBgColor` ao invés de `filter_active_bg_color_token`).

**Solução:** Já corrigida (extrai cores do template).

**Código correto:**
```typescript
const cardTemplate = sectionCards[0]?._template;
const filterActiveBgColor = cardTemplate?.filter_active_bg_color_token;
```

**Arquivo:** `SectionRenderer.tsx` (linhas 1768-1873)

---

## 📏 Problemas de Spacing

### Padding de 0px vira 24px

**Sintomas:**
- Campo configurado: "0px"
- Renderização: 24px

**Causa:** Operador `||` trata `0` como falsy.

**Solução:** Já corrigida.

**Código correto:**
```typescript
const parsed = parseInt(value.replace('px', ''));
return !isNaN(parsed) ? parsed : defaultValue;  // ✅ 0 é válido
```

**Arquivo:** `SectionRenderer.tsx` (função `parseSpacing`)

---

### Gap entre linhas não funciona

**Sintomas:**
- Campo "Gap entre linhas" configurado
- Seção renderiza sem gap

**Causa:** `rowGap: 0` hardcoded sobrescrevia config.

**Solução:** Já corrigida (linha hardcoded removida).

**Validação:**
```sql
SELECT 
  styling->'spacing'->>'rowGap' as row_gap
FROM sections
WHERE config->>'gridRows' = '2';
```

**Arquivo:** `SectionRenderer.tsx` (linha 1303)

---

## 🎨 Problemas de UI

### Erros de parsing de cor no console

**Sintomas:**
```
Error parsing color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1)...
Error parsing color: oklab(0.145 ...)
```

**Causa:** Transições CSS tentando interpolar `box-shadow` ou cores oklab.

**Solução:** Já corrigida em 5 componentes.

**Código correto:**
```typescript
style={{
  transition: 'none',
  animation: 'none',
  boxShadow: 'none',
}}
```

**Arquivos:**
- `scroll-area.tsx`
- `IconPicker.tsx`
- `CardRenderer.tsx`
- `Header.tsx`
- `SectionRenderer.tsx`

---

### Scroll com mouse wheel não funciona

**Sintomas:**
- ScrollArea dentro de Popover
- Scroll só funciona arrastando scrollbar

**Causa:** Evento `onWheel` bloqueado por container pai.

**Solução:** Já corrigida (scroll nativo implementado).

**Código correto:**
```typescript
<div 
  className="h-[320px] overflow-y-auto"
  onWheel={(e) => e.stopPropagation()}
>
  {/* Conteúdo */}
</div>
```

**Arquivo:** `IconPicker.tsx`

---

## 🎛️ Problemas de Tema Admin (AdminThemeProvider)

### Tipografia do painel não atualiza após salvar token

**Sintomas:**
- Editou um token `admin-ui` no `/admin/system-manager`
- Clicou Salvar
- Painel continua com o estilo antigo

**Causa:** `refreshTheme()` não foi chamado após o salvamento no banco.

**Solução:** Certifique-se de que o código chama `refreshTheme()` após o update:
```typescript
const { refreshTheme } = useAdminTheme();

await supabase.from('design_tokens').update({ value: newValue }).eq('id', tokenId);
await refreshTheme(); // ← obrigatório
```

---

### CSS vars `--admin-*` não existem no browser

**Sintomas:**
- `var(--admin-page-title-size)` retorna valor vazio
- Tipografia do admin usa fallback (ou nenhum estilo)
- `document.querySelector('#admin-theme-dynamic')` retorna `null`

**Causas possíveis:**

#### 1. `AdminThemeProvider` não está montado

**Diagnóstico:** Verifique se o layout admin importa e usa o provider:
```typescript
// /src/app/admin/layout.tsx
import { AdminThemeProvider } from '@/app/components/admin/AdminThemeProvider';

// JSX deve envolver children:
<AdminThemeProvider>
  {children}
</AdminThemeProvider>
```

#### 2. Tokens `admin-ui` não existem no banco

**Diagnóstico:**
```sql
SELECT COUNT(*) FROM design_tokens WHERE category = 'admin-ui';
-- Se retornar 0 → migration não foi executada
```

**Solução:** Execute `/migrations/2026-02-21_system_manager_tokens.sql` no Supabase SQL Editor.

#### 3. CHECK constraint não aceita `admin-ui`

**Sintoma:** Erro ao inserir tokens:
```
ERROR: new row for relation "design_tokens" violates check constraint "design_tokens_category_check"
```

**Diagnóstico:**
```sql
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'design_tokens_category_check';
```

**Solução:** A migration deve ter alterado o constraint. Se não foi executada:
```sql
ALTER TABLE design_tokens DROP CONSTRAINT design_tokens_category_check;
ALTER TABLE design_tokens ADD CONSTRAINT design_tokens_category_check
  CHECK (category IN ('color','typography','spacing','radius','transition','admin-ui'));
```

---

### `adminVar()` importado mas retorna string errada

**Sintomas:**
- `adminVar('item-title-grid', 'size')` retorna `'var(--admin-item-title-grid-size)'` (correto como string)
- Mas o valor final no browser não é aplicado

**Causa:** CSS var é usada em `style={{}}` mas a var em si não está definida no `:root`.

**Diagnóstico:** No DevTools do browser:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--admin-item-title-grid-size')
// Se retornar '' → var não foi injetada → AdminThemeProvider com problema
```

**Solução:** Verificar causas 1-3 acima.

---

## 💾 Problemas de Banco de Dados

### Foreign key constraint violated

**Sintomas:**
```
ERROR: update or delete on table "design_tokens" violates foreign key constraint
```

**Causa:** Tentativa de deletar token que está sendo usado.

**Diagnóstico:**
```sql
-- Verificar onde o token é usado
SELECT 
  'card_templates' as tabela,
  COUNT(*) as usos
FROM card_templates
WHERE card_bg_color_token = 'UUID_DO_TOKEN'
UNION ALL
SELECT 
  'menu_cards',
  COUNT(*)
FROM menu_cards
WHERE icon_color_token = 'UUID_DO_TOKEN';
```

**Solução:**
1. Substituir token em todas as tabelas que o usam
2. Depois deletar o token

---

### JSONB query retorna NULL

**Sintomas:**
```sql
SELECT layout->'desktop'->'text'->>'position' FROM sections;
-- Retorna NULL mas dados existem
```

**Causa:** Posição está armazenada como string direta, não objeto.

**Solução correta:**
```sql
-- ✅ CORRETO
SELECT layout->'desktop'->>'text' FROM sections;

-- ❌ INCORRETO
SELECT layout->'desktop'->'text'->>'position' FROM sections;
```

**Documentação:** `/guidelines/DATABASE_SCHEMA.md`

---

### Migration não aplica

**Sintomas:**
- SQL executado no Supabase SQL Editor
- Sem erros
- Mas dados não mudam

**Causas possíveis:**

#### 1. Transação sem COMMIT

**Solução:** Adicionar `COMMIT;` no final do SQL.

---

#### 2. WHERE clause não bate

**Diagnóstico:**
```sql
-- Contar quantos registros serão afetados
SELECT COUNT(*) FROM sections
WHERE config->>'gridRows' = '1'
  AND layout->'desktop'->>'text' LIKE '%middle%';
```

Se retornar 0 → WHERE clause incorreta.

---

## 📞 Suporte

**Documentação principal:**
- [Guidelines.md](/guidelines/Guidelines.md) - Documento canônico do Design System
- [Architecture](/docs/ARCHITECTURE.md) - Decisões arquiteturais
- [EXECUTE_SQL.sql](/EXECUTE_SQL.sql) - Scripts SQL centralizados

---

**Última atualização:** 2026-02-21  
**Mantido por:** Equipe BemDito CMS