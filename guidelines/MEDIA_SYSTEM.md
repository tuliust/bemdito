# 🖼️ Sistema de Mídia - BemDito CMS

**Versão:** 1.1  
**Data:** 2026-02-17  
**Atualizado:** 2026-02-19 (adicionado modo 4: Adaptada; modo Alinhada passa a ser 5)  
**Status:** 📘 Documentação Canônica

---

## 🎯 Visão Geral

Sistema completo de exibição de mídia (imagens/vídeos) nas seções, incluindo **5 modos de exibição**, alinhamento configurável, persistência de configurações e correção de bugs críticos.

**Arquivos Consolidados:**
- `__MIDIA_WIDTH_ZERO_FIX_2026-02-16.md` ⭐ Principal
- `__CORRECAO_MIDIA_ALINHADA_COMPLETA_2026-02-16.md`
- `__MEDIA_ALIGN_MISSING_FIX_2026-02-16.md`
- `__FIX_MEDIA_CONFIG_PERSIST_2026-02-17.md`
- `__RELATORIO_REGRAS_MIDIA_COMPLETO_2026-02-16.md`

---

## 🎨 Modos de Exibição Disponíveis

### 1️⃣ Cover (Expandida / Cobrir)

- **Valor real no banco:** `"cover"` ← valor em inglês no banco
- **Bordas:** Quadradas (`border-radius: 0`)
- **Padding:** Nenhum (`p-0`)
- **Comportamento:** `object-cover` (preenche área, pode cortar)
- **Quando usar:** Backgrounds, banners fullwidth
- **Seção usando:** Melhores Profissionais (alignX=center, alignY=bottom)

### 2️⃣ Contain (Ajustada) - PADRÃO

- **Valor real no banco:** `"contain"` ← valor em inglês no banco
- **Bordas:** 2XL (`border-radius: 1.5rem / 24px`)
- **Padding:** Nenhum (`p-0`)
- **Comportamento:** `object-contain` (exibe completo, pode ter espaço vazio)
- **Quando usar:** Imagens de produtos, fotos promocionais (padrão recomendado)
- **Seção usando:** Prazer, somos a BemDito! (alignX=right, alignY=bottom)

### 3️⃣ Natural (Contida)

- **Valor real no banco:** `"natural"` ou `"contida"` (não há seção usando este modo — valor a confirmar)
- **Bordas:** Quadradas (`border-radius: 0`)
- **Padding:** Nenhum (`p-0`)
- **Comportamento:** `object-contain` (tamanho natural)
- **Quando usar:** Screenshots, infográficos, diagramas técnicos

### 4️⃣ Adaptada ✨ (adicionada 2026-02-17)

- **Valor real no banco:** `"adaptada"` ← valor em português no banco
- **Bordas:** Quadradas (`border-radius: 0`)
- **Padding:** Nenhum (`p-0`)
- **Comportamento:** `object-contain` (se adapta à **altura do texto**)
- **Tamanho:** `height: 100%` (da linha do grid), `width: auto` (proporcional)
- **Quando usar:** Mídia deve acompanhar a altura do texto na mesma linha do grid 2×2
- **Seções usando:** APP (c4865f37) e Monte seu Projeto (e735eafe) — ambas grid 2×2 com height=auto

### 5️⃣ Alinhada ✨

- **Valor real no banco:** `"alinhada"` ← valor em português no banco
- **Bordas:** Quadradas (`border-radius: 0`)
- **Padding:** Nenhum (`p-0`)
- **Comportamento:** `object-contain` (sem cortes, mantém proporção)
- **Tamanho:** 100% da área disponível (`maxWidth/maxHeight: 100%`)
- **Alinhamento:** Usa `config.media.alignX` e `config.media.alignY`
- **Quando usar:** Mídia deve **colar perfeitamente nas bordas** configuradas
- **Campos obrigatórios:** `alignX` e `alignY` (NULL = mídia invisível!)
- **Seções usando:** 0 seções ativas no banco (suportado mas não configurado)

### ⚠️ Atenção: Valores Reais do Banco

| Modo UI | Valor no banco | Confirmado? |
|---------|---------------|-------------|
| Cobrir / Expandida | `"cover"` | ✅ Melhores Profissionais |
| Ajustada / Contain | `"contain"` | ✅ Prazer, somos a BemDito! |
| Contida / Natural | `"natural"` ou `"contida"` | ⚠️ Nenhuma seção usando — confirmar |
| Adaptada | `"adaptada"` | ✅ APP, Monte seu Projeto |
| Alinhada | `"alinhada"` | ✅ Suportado, 0 seções ativas |

> ⚠️ **NÃO usar** os nomes em português como se fossem os valores do banco: `"cobrir"`, `"ajustada"` não aparecem em nenhuma seção real.

---

## 🔴 PROBLEMA CRÍTICO: Mídia com Width: 0 no Modo "Alinhada"

### Sintomas

- ✅ Modo "alinhada" configurado no admin
- ✅ Campos `alignX` e `alignY` preenchidos
- ❌ **Mídia invisível** na página pública
- ❌ Inspetor: `width: 0px`

### Causa Raiz

**`position: absolute` + `width: auto` = colapso para 0px**

Elementos com `position: absolute` **saem do fluxo normal do documento**. Sem dimensões explícitas, o navegador não consegue calcular o tamanho, resultando em `width: 0`.

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

---

### Solução Implementada

**Forçar dimensões explícitas no inline style:**

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx` (linhas 1428-1446)

```typescript
// ✅ CORREÇÃO: width e height 100%
<img 
  style={{
    width: '100%',           // ← Preenche container relativo
    height: '100%',          // ← Preenche container relativo
    objectFit: 'contain',    // ← Mantém proporção
    position: 'absolute',
    // Alinhamento via left/right/top/bottom
    ...(() => {
      const alignXMap = { left: { left: 0 }, center: { left: '50%', transform: 'translateX(-50%)' }, right: { right: 0 } };
      const alignYMap = { top: { top: 0 }, center: { top: '50%', transform: 'translateY(-50%)' }, bottom: { bottom: 0 } };
      return { ...alignXMap[mediaAlignX], ...alignYMap[mediaAlignY] };
    })(),
  }}
/>
```

---

### Por Que Funciona

1. **`width: 100%` e `height: 100%`** forçam a imagem a ocupar todo o container relativo
2. **`objectFit: contain`** garante que a proporção seja mantida (não distorce)
3. **`maxWidth: 100%` e `maxHeight: 100%`** limitam o tamanho máximo
4. **`position: absolute`** + propriedades de alinhamento posicionam corretamente

---

### Comparação Visual

**❌ ANTES (BUG):**
```html
<img style="width: auto; height: auto; position: absolute;" />
<!-- Resultado: width calculado = 0px (invisível) -->
```

**✅ DEPOIS (CORRETO):**
```html
<img style="width: 100%; height: 100%; position: absolute; object-fit: contain;" />
<!-- Resultado: Imagem preenche área, mantém proporção, cola nas bordas -->
```

---

## ⚠️ PROBLEMA: Campos alignX/alignY Faltando

### Problema

Seções com `fitMode = "alinhada"` mas **sem** os campos `config.media.alignX` e `alignY` resultam em mídia invisível ou posicionamento incorreto.

### Sintomas

- Mídia não aparece na seção (width: 0 ou position incorreto)
- Warning no console: `⚠️ [AUTO-FIX] gridRows ajustado de 1 para 2`
- Seção renderiza parcialmente (apenas texto visível)

### Solução SQL

**Arquivo:** `/migrations/2026-02-16_v6.13_fix_media_align_section_667ab5d5.sql`

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

### Valores Possíveis

- **alignX:** `"left"` | `"center"` | `"right"`
- **alignY:** `"top"` | `"center"` | `"bottom"`

### Exemplo Completo

```json
{
  "media": {
    "fitMode": "alinhada",
    "alignX": "right",      // ← Obrigatório quando fitMode = "alinhada"
    "alignY": "bottom"      // ← Obrigatório quando fitMode = "alinhada"
  }
}
```

---

## 🟡 PROBLEMA: Column-Gap com Mídia Alinhada

### Problema

Grid com `column-gap` impede mídia no modo "alinhada" de colar nas bordas direita/esquerda da seção.

### Causa

O `column-gap` cria espaçamento entre colunas, fazendo a coluna da direita terminar antes da borda da seção.

```typescript
// ❌ PROBLEMA
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '32px', // ← Coluna 2 termina em ~96%, não 100%
};
```

### Solução

**Arquivo:** `/src/app/public/components/SectionRenderer.tsx`

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

## ✨ NOVO: Interface Admin com Campos de Mídia

### Como Acessar

1. Abra `/admin/pages-manager` → Editar Seção
2. Ative o toggle **"Mídia"** na seção "2. Elementos da Seção"
3. Nova seção **"2.5 Configuração de Mídia"** aparece automaticamente

### Campos Disponíveis

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Mídia (Imagem/Vídeo)** | MediaUploader | Upload, biblioteca e preview |
| **Modo de Exibição** | Dropdown | cobrir / ajustada / contida / alinhada |
| **Alinhamento Horizontal** | 3 botões | left / center / right (apenas modo "alinhada") |
| **Alinhamento Vertical** | 3 botões | top / center / bottom (apenas modo "alinhada") |

### Lógica Condicional

Campos `alignX` e `alignY` **SOMENTE aparecem** se `fitMode = "alinhada"`.

### Mapeamento de Campos

```typescript
// Interface salva em config.media
config.mediaUrl           // URL da mídia (via MediaUploader)
config.media.fitMode      // cobrir | ajustada | contida | alinhada
config.media.alignX       // left | center | right (opcional)
config.media.alignY       // top | center | bottom (opcional)
```

---

## 🔄 Persistência de Configurações

### Problema Resolvido

Ao editar mídia no modal de seção e salvar, os campos não permaneciam preenchidos ao reabrir o modal.

### Causa Raiz

O estado local `pageSections` era atualizado após o save, mas o React não detectava a mudança porque o objeto era atualizado **por referência** no array.

### Solução

**Arquivo:** `/src/app/admin/pages-manager/editor.tsx` (linha 358)

```typescript
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

---

## 📋 Regras Obrigatórias

### ✅ SEMPRE

1. **SEMPRE** usar `width: 100%` e `height: 100%` com `position: absolute`
2. **SEMPRE** forçar `width: 100%` e `height: 100%` no container com `position: relative`
3. **SEMPRE** incluir `objectFit: contain` para manter proporção
4. **SEMPRE** usar `maxWidth` e `maxHeight` para limitar tamanho
5. **SEMPRE** definir `alignX` e `alignY` quando `fitMode = "alinhada"`
6. **SEMPRE** remover `column-gap` quando mídia alinhada nas bordas
7. **SEMPRE** recarregar seções após salvar (persistência)
8. **SEMPRE** selecionar o modo adequado ao tipo de conteúdo

### ❌ NUNCA

1. **NUNCA** usar `width: auto` com `position: absolute`
2. **NUNCA** usar `width: auto` no container relativo (shrink-to-fit ao conteúdo)
3. **NUNCA** assumir que elementos absolute calculam dimensões automaticamente
4. **NUNCA** deixar `alignX` ou `alignY` como NULL no modo "alinhada"
5. **NUNCA** assumir que valores padrão funcionam sem os campos
6. **NUNCA** adicionar padding/margin à mídia (sempre `p-0`)
7. **NUNCA** usar gap fixo quando mídia precisa colar nas bordas

---

## 🐛 Troubleshooting

### Problema: Mídia invisível no modo "alinhada"

**Diagnóstico:**
- Inspetor mostra `width: 0px`
- CSS mostra `width: auto` + `position: absolute`

**Solução:**
- Forçar `width: 100%` e `height: 100%`
- Arquivo: `/src/app/public/components/SectionRenderer.tsx` linha 1428

---

### Problema: Mídia não cola nas bordas

**Diagnóstico:**
- Espaço vazio entre mídia e borda da seção
- `column-gap` presente no grid

**Solução:**
- Remover `column-gap` quando `mediaDisplayMode === 'alinhada'`
- Arquivo: `/src/app/public/components/SectionRenderer.tsx`

---

### Problema: Campos alignX/Y ausentes

**Diagnóstico:**
```sql
-- Verificar no banco
SELECT 
  config->'media'->>'fitMode' as fit_mode,      -- "alinhada"
  config->'media'->>'alignX' as align_x,        -- NULL ❌
  config->'media'->>'alignY' as align_y         -- NULL ❌
FROM sections
WHERE id = '...';
```

**Solução:**
- Executar migration SQL
- Arquivo: `/migrations/2026-02-16_v6.13_fix_media_align_section_667ab5d5.sql`

---

### Problema: Config não persiste ao reabrir modal

**Diagnóstico:**
- Salvar → fechar → reabrir → campos vazios

**Solução:**
- Recarregar seções após salvar
- Arquivo: `/src/app/admin/pages-manager/editor.tsx` linha 358

---

## 🎨 Exemplos de Alinhamento

### Exemplo 1: Canto Inferior Direito

```json
{
  "media": {
    "fitMode": "alinhada",
    "alignX": "right",
    "alignY": "bottom"
  }
}
```

**Resultado:** Mídia cola no canto inferior direito (SEM espaço).

---

### Exemplo 2: Centro

```json
{
  "media": {
    "fitMode": "alinhada",
    "alignX": "center",
    "alignY": "center"
  }
}
```

**Resultado:** Mídia centralizada (SEM espaço vazio).

---

### Exemplo 3: Topo Esquerdo

```json
{
  "media": {
    "fitMode": "alinhada",
    "alignX": "left",
    "alignY": "top"
  }
}
```

**Resultado:** Mídia cola no canto superior esquerdo.

---

## 📊 Casos de Teste

### Caso 1: Modo Cover

**Configuração:**
- `fitMode: "cobrir"`
- Imagem: 1920×1080

**Resultado Esperado:**
- ✅ Imagem preenche 100% da área (pode cortar)
- ✅ Sem espaço vazio

---

### Caso 2: Modo Alinhada - Inferior Direita

**Configuração:**
- `fitMode: "alinhada"`
- `alignX: "right"`
- `alignY: "bottom"`

**Resultado Esperado:**
- ✅ Imagem cola nas bordas direita e inferior
- ✅ 0px de espaço vazio
- ✅ Proporção mantida

---

### Caso 3: Modo Contain com Grid 2×2

**Configuração:**
- `fitMode: "ajustada"`
- Grid 2×2 com texto à esquerda

**Resultado Esperado:**
- ✅ Imagem exibida completa (pode ter espaço vazio)
- ✅ Border-radius 1.5rem
- ✅ maxHeight 500px

---

## 🔗 Arquivos Relacionados

### Código Principal

- `/src/app/public/components/SectionRenderer.tsx`
  - Linhas 737: `getMediaStyles()`
  - Linhas 1428-1446: Renderização de mídia alinhada
  - Linhas 1268-1280: Column-gap condicional
  - Linhas 1393: Padding condicional

- `/src/app/admin/sections-manager/SectionBuilder.tsx`
  - Linhas 35, 920-925: MediaUploader integrado

- `/src/app/admin/pages-manager/editor.tsx`
  - Linha 358: Reload após save

### Documentação Histórica

Arquivada em `/docs/99-arquivo/midia/`:
- `ANALISE_ESPACAMENTOS_MIDIA_2026-02-16.md`
- `DIAGNOSTICO_MIDIA_NAO_ALINHA_2026-02-16.md`
- `IMPLEMENTACAO_MODO_ALINHADA_2026-02-16.md`
- `MEDIA_ALIGNMENT_DIAGNOSTIC_2026-02-17.md`
- `MIDIA_NAO_ALINHA_BORDAS_2026-02-16.md`

### Documentação Útil (Mantida)

- `MIDIA_INDIVIDUAL_POR_CARD_DOCUMENTACAO.md` - Mídia por card
- `POSICAO_VERTICAL_MIDIA_DOCUMENTACAO.md` - Posição vertical

---

## 📚 Referências

- **Guidelines Principal:** `/guidelines/Guidelines.md#sistema-de-exibição-de-mídia`
- **Decision Log:** `/CLEANUP_DECISION_LOG.md#mídia`
- **Índice de Correções:** `/__INDICE_CORRECOES_2026-02-17.md#mídia`

---

**Mantido por:** Equipe BemDito CMS  
**Última atualização:** 2026-02-17  
**Versão:** 1.0