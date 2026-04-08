# 📄 Sistema de Seções - BemDito CMS

**Versão:** 1.0  
**Data:** 2026-02-17  
**Status:** 📘 Documentação Canônica

---

## 🎯 Visão Geral

Sistema completo de seções do site, incluindo overflow controlado, funcionalidades Editar/Salvar Como, regras de vinculação 1 seção = 1 página, e caso de estudo da seção 667ab5d5.

**Arquivos Consolidados:**
- `__SECTION_OVERFLOW_FIX_2026-02-13.md` ⭐ Principal
- `__SECTIONS_MANAGER_EDIT_SAVEAS_2026-02-13.md`
- `__SECTIONS_NOT_RENDERING_FIX_2026-02-15.md`
- `__SECTION_667AB5D5_COMPLETE_DOCUMENTATION_2026-02-17.md` (Caso de estudo)

---

## 🔒 Sistema de Overflow e Truncamento

### Objetivo

Garantir que **seções sempre mantenham a altura definida** sem scroll vertical externo. Textos longos são truncados, cards têm scroll interno, e mídias se ajustam automaticamente.

### Classes CSS Disponíveis

**Arquivo:** `/src/styles/theme.css`

```css
.line-clamp-2  /* Trunca em 2 linhas com ... */
.line-clamp-3  /* Trunca em 3 linhas com ... */
.line-clamp-4  /* Trunca em 4 linhas com ... */
```

### Comportamento por Elemento

#### Container da Seção
- ✅ `overflow: hidden` - Conteúdo nunca ultrapassa

#### Textos
- ✅ **Chamada:** `line-clamp-2 flex-shrink-0` (máx 2 linhas)
- ✅ **Título:** `line-clamp-3 flex-shrink-0` (máx 3 linhas)
- ✅ **Subtítulo:** `line-clamp-4` (máx 4 linhas)

#### Hierarquia de Prioridade
- ✅ **Nunca comprimem:** Ícone, Chamada, Título, Botão (`flex-shrink-0`)
- 🟡 **Podem comprimir:** Subtítulo, Custom Content

#### Cards e Tabs
- ✅ `overflow-y-auto flex-1 min-h-0` - Scroll interno

#### Mídia
- **Grid 50/50:** `maxHeight: 100%`
- **Layout vertical:** `maxHeight: 50%`

### Documentação Completa

Consulte `/guidelines/Guidelines.md` — seção "Sistema de Overflow e Truncamento" para detalhes completos.

---

## ✏️ Sistema de Editar e Salvar Como

### Regra Fundamental: 1 Seção = 1 Página

Cada seção pode estar vinculada a **NO MÁXIMO 1 página**. Isso garante:
- ✅ Edições não afetam páginas não relacionadas
- ✅ Zero conflitos de configuração
- ✅ Rastreabilidade total (qual página usa qual seção)

### Funcionalidade "Editar"

**Local:** `/admin/sections-manager`

**Comportamento:**
1. **Seção NÃO vinculada:** Edita diretamente sem restrições
2. **Seção vinculada:** Mostra modal de aviso com página afetada

**Modal de Aviso:**
```
⚠️ Esta seção está sendo usada em 1 página:
   - Home

✏️ Editar afetará esta página.
💡 Use "Salvar Como" para criar uma cópia.

[Cancelar] [Continuar Editando]
```

---

### Funcionalidade "Salvar Como"

**Comportamento:**
1. Duplica a seção com novo `id`
2. Adiciona sufixo " (Cópia)" ao nome
3. Remove vinculações (nova seção em 0 páginas)
4. Abre modal de edição da nova seção

**Fluxo:**
```
Seção Original (id: 123, em 1 página)
       ↓ [Salvar Como]
Seção Cópia (id: 456, em 0 páginas)
       ↓ [Editar livremente]
```

### Validações

**Backend:** `GET /make-server-72da2481/sections/:id/usage`  
**Frontend:** Verificação antes de editar

### Documentação Completa

Consulte `/guidelines/Guidelines.md` — seção "Sistema de Editar e Salvar Como" para detalhes completos.

---

## 🔍 Seções Não Renderizando

### Problema

Seções com **posições verticais** (`center`, `middle-left`, `middle-right`) mas `gridRows = 1` não renderizavam.

### Causa Raiz

Banco de dados tinha `gridRows = 1` mas posições requeriam `gridRows = 2`.

### Solução: Auto-Fix + Migration

**Auto-Fix em Runtime:**
```typescript
// SectionRenderer valida e corrige automaticamente
const calculateGridRows = (layout: any, configGridRows: number): number => {
  const positions = [layout?.desktop?.text, layout?.desktop?.media, layout?.desktop?.cards];
  const requiresTwoRows = positions.some(pos =>
    ['middle-left', 'middle-right', 'center'].includes(pos)
  );

  if (requiresTwoRows && configGridRows === 1) {
    console.warn(`⚠️ [AUTO-FIX] gridRows ajustado de 1 para 2`);
    return 2;
  }

  return configGridRows;
};
```

**Migration SQL Permanente:**
```sql
-- Arquivo: /migrations/2026-02-15_v6.11_fix_all_gridrows_conflicts.sql
UPDATE sections
SET config = jsonb_set(config, '{gridRows}', '2', false)
WHERE 
  (layout->'desktop'->>'text' IN ('middle-left', 'middle-right', 'center')
   OR layout->'desktop'->>'media' IN ('middle-left', 'middle-right', 'center')
   OR layout->'desktop'->>'cards' IN ('middle-left', 'middle-right', 'center'))
  AND config->>'gridRows' = '1';
```

### Documentação Completa

👉 [/___SECTIONS_NOT_RENDERING_FIX_2026-02-15.md](/___SECTIONS_NOT_RENDERING_FIX_2026-02-15.md) (arquivado)

---

## 📚 Caso de Estudo: Seção 667ab5d5 "Prazer, somos a BemDito!"

### Visão Geral

Seção hero da Home com **5 problemas estruturais críticos** que foram corrigidos sequencialmente.

**ID:** `667ab5d5-7a31-43e5-8a48-432f24ca2d01`  
**Nome:** "Prazer, somos a BemDito!"  
**Tipo:** Hero section com grid 2×2

### Configuração Final

```json
{
  "config": {
    "gridRows": 2,
    "gridCols": 2,
    "media": {
      "fitMode": "alinhada",
      "alignX": "right",
      "alignY": "bottom"
    }
  },
  "layout": {
    "desktop": {
      "text": "middle-left",   // ← String direta (não objeto)
      "media": "middle-right"  // ← String direta (não objeto)
    }
  },
  "styling": {
    "height": "50vh",
    "spacing": {
      "top": "0px",
      "bottom": "0px",
      "left": "xl",      // ← Token (48px)
      "right": "16px"    // ← Valor em px
    }
  }
}
```

### Problemas Corrigidos

#### Problema 1: layout.desktop com Objetos

**Antes:**
```json
"layout": {
  "desktop": {
    "text": {"position": "middle-left"},  // ❌ Objeto
    "media": {"position": "middle-right"} // ❌ Objeto
  }
}
```

**Depois:**
```json
"layout": {
  "desktop": {
    "text": "middle-left",   // ✅ String direta
    "media": "middle-right"  // ✅ String direta
  }
}
```

---

#### Problema 2: config.config Aninhado

**Antes:**
```json
"config": {
  "config": {          // ❌ Aninhamento duplicado
    "gridRows": 2,
    "media": {...}
  }
}
```

**Depois:**
```json
"config": {
  "gridRows": 2,       // ✅ Nível raiz
  "media": {...}
}
```

---

#### Problema 3: styling.height Incorreto

**Antes:**
```json
"styling": {
  "height": "50vh"     // ❌ Não ideal para hero
}
```

**Depois:**
```json
"styling": {
  "height": "100vh"    // ✅ Hero fullscreen
}
```

---

#### Problema 4: spacing com Valores Hardcoded

**Antes:**
```json
"styling": {
  "spacing": {
    "left": "128px"    // ❌ Hardcoded
  }
}
```

**Depois:**
```json
"styling": {
  "spacing": {
    "left": "xl"       // ✅ Token (48px)
  }
}
```

---

#### Problema 5: Campos de Mídia Ausentes

**Antes:**
```json
"config": {
  "media": {
    "fitMode": "alinhada"
    // ❌ alignX e alignY ausentes
  }
}
```

**Depois:**
```json
"config": {
  "media": {
    "fitMode": "alinhada",
    "alignX": "right",     // ✅ Adicionado
    "alignY": "bottom"     // ✅ Adicionado
  }
}
```

### Lições Aprendidas

1. **Layout deve SEMPRE usar strings diretas** (não objetos)
2. **Evitar aninhamento duplicado** em JSONB (`config.config`)
3. **SEMPRE usar tokens** ao invés de valores fixos
4. **Validar estrutura** antes de aplicar migrations
5. **Modo "alinhada" requer** `alignX` e `alignY` obrigatórios

### Documentação Completa

👉 `/docs/99-arquivo/sections/case-study-667ab5d5.md` (consolidado)

---

## 📋 Regras Obrigatórias

### ✅ SEMPRE

1. **SEMPRE** validar tipo de `layout.desktop.*` (string, não objeto)
2. **SEMPRE** usar tokens ao invés de valores fixos
3. **SEMPRE** verificar aninhamento duplicado em JSONB
4. **SEMPRE** usar auto-fix + migration para correções permanentes
5. **SEMPRE** mostrar modal de aviso ao editar seção vinculada
6. **SEMPRE** usar "Salvar Como" para criar variações sem afetar original
7. **SEMPRE** aplicar `overflow: hidden` no container da seção
8. **SEMPRE** usar `line-clamp-*` para truncar textos longos

### ❌ NUNCA

1. **NUNCA** usar `jsonb_build_object` em campo que já é objeto
2. **NUNCA** hardcoded de spacing (usar tokens)
3. **NUNCA** permitir edição de seção vinculada sem aviso
4. **NUNCA** deletar seção em uso
5. **NUNCA** adicionar seção já vinculada a outra página
6. **NUNCA** assumir que layout tem formato correto (sempre validar)

---

## 🐛 Troubleshooting

### Problema: Seção não renderiza

**Diagnóstico:**
```typescript
// Console deve mostrar:
⚠️ [AUTO-FIX] gridRows ajustado de 1 para 2
```

**Se NÃO aparece:**
- Auto-fix não implementado
- Executar migration SQL permanente

---

### Problema: Layout.desktop é objeto (não string)

**Diagnóstico:**
```sql
SELECT 
  layout->'desktop'->'text' as text_pos  -- Retorna objeto ❌
FROM sections
WHERE id = '...';
```

**Solução:**
```sql
-- Converter objeto para string
UPDATE sections
SET layout = jsonb_set(
  layout,
  '{desktop,text}',
  to_jsonb((layout->'desktop'->'text'->>'position'))
)
WHERE jsonb_typeof(layout->'desktop'->'text') = 'object';
```

---

### Problema: config.config aninhado

**Diagnóstico:**
```sql
SELECT 
  config->'config'->>'gridRows' as grid_rows  -- Retorna valor ❌
FROM sections;
```

**Solução:**
```sql
-- Mover campos para nível raiz
UPDATE sections
SET config = config->'config'
WHERE config ? 'config';
```

---

### Problema: Texto ultrapassa altura da seção

**Diagnóstico:**
- Seção com scroll vertical
- Texto não truncado

**Solução:**
- Aplicar `line-clamp-*` nos elementos de texto
- Arquivo: `/src/app/public/components/SectionRenderer.tsx`

---

## 🔗 Arquivos Relacionados

### Código Principal

- `/src/app/public/components/SectionRenderer.tsx`
  - Sistema de overflow
  - Auto-fix de gridRows
  - Renderização de seções

- `/src/app/admin/sections-manager/page.tsx`
  - Lista de seções
  - Botões Editar/Salvar Como

- `/src/app/admin/sections-manager/SectionBuilder.tsx`
  - Modal de edição
  - Validações

### Migrations

- `/migrations/2026-02-15_v6.11_fix_all_gridrows_conflicts.sql`
- `/migrations/2026-02-16_v6.13_fix_media_align_section_667ab5d5.sql`
- `/migrations/2026-02-17_fix_layout_position_objects.sql`

### Documentação Histórica

Arquivada em `/docs/99-arquivo/sections/`:
- `HOME_SECTIONS_ANALYSIS_2026-02-16.md`
- `PAGES_MANAGER_UI_UPDATES_2026-02-13.md`
- `MARKETING_DIGITAL_FIX_2026-02-17.md`
- `case-study-667ab5d5.md` (consolidado)

---

## 📚 Referências

- **Guidelines Principal:** `/guidelines/Guidelines.md#sistema-de-seções`
- **Decision Log:** `/CLEANUP_DECISION_LOG.md#seções`
- **Índice de Correções:** `/__INDICE_CORRECOES_2026-02-17.md#seções`

---

**Mantido por:** Equipe BemDito CMS  
**Última atualização:** 2026-02-17  
**Versão:** 1.0
