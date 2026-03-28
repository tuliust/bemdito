# 🚀 Executar Migration: Adicionar Descrições nos Megamenus

## 📋 Resumo

Esta migration adiciona **descrições** nos 3 megamenus existentes:
1. **Chama a gente!** (Contato)
2. **Ajustes** (Sobre a BemDito)
3. **Tendências e Inspiração**

---

## ⚡ Execução Rápida (Copiar e Colar)

### 1. Abrir SQL Editor no Supabase

```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
```

### 2. Copiar Conteúdo da Migration

Arquivo: `/migrations/2026-03-05_v2_add_descriptions_all_menus.sql`

### 3. Executar

Clique em **"Run"** ou `Ctrl+Enter`

### 4. Verificar Resultados

Você deve ver:
```
✅ Tokens encontrados:
   body-base: uuid...
   body-small: uuid...
   dark: uuid...
   muted: uuid...

✅ Descrição adicionada: Chama a gente!
✅ Descrição adicionada: Ajustes
✅ Descrição adicionada: Tendências e Inspiração
```

E uma tabela mostrando os 3 itens com descrições preenchidas.

---

## 📝 Descrições Adicionadas

### 1. Chama a gente!
```
ENTRE EM CONTATO
Tire suas dúvidas, solicite um orçamento ou agende uma conversa com nosso time
Conectar, colaborar e construir algo incrível
```

### 2. Ajustes
```
SOBRE A BEMDITO
Descubra como transformamos ideias em soluções digitais inovadoras
Conheça nossa história
```

### 3. Tendências e Inspiração
```
TENDÊNCIAS E INSPIRAÇÃO
Explore insights e tendências do mercado digital para se manter sempre atualizado
Artigos e novidades para impulsionar seu trabalho
```

---

## 🎨 Estilos Aplicados

| Campo | Token Usado | Valor |
|-------|-------------|-------|
| **Tamanho da Fonte** | `body-small` | 0.875rem (14px) |
| **Cor** | `muted` ou `dark` | #e7e8e8 ou #020105 |

---

## ✅ Validação Pós-Execução

### Query 1: Ver Descrições
```sql
SELECT 
  label,
  megamenu_config->'column'->>'description' as descricao
FROM menu_items
WHERE megamenu_config->>'enabled' = 'true'
ORDER BY label;
```

**Resultado esperado:**
```
| label                   | descricao                                                                 |
| ----------------------- | ------------------------------------------------------------------------- |
| Ajustes                 | Descubra como transformamos ideias em soluções digitais inovadoras        |
| Chama a gente!          | Tire suas dúvidas, solicite um orçamento ou agende uma conversa...        |
| Tendências e Inspiração | Explore insights e tendências do mercado digital para se manter atualizado |
```

### Query 2: Ver Estrutura Completa de um Item
```sql
SELECT 
  label,
  jsonb_pretty(megamenu_config->'column') as estrutura
FROM menu_items
WHERE label = 'Ajustes';
```

**Resultado esperado:**
```json
{
  "id": "col1",
  "title": "SOBRE A BEMDITO",
  "description": "Descubra como transformamos ideias em soluções digitais inovadoras",
  "descriptionColor": "uuid-muted-token",
  "descriptionFontSize": "uuid-body-small-token",
  "mainTitle": "Conheça nossa história",
  ...
}
```

---

## 🧪 Teste Visual

### 1. Interface Admin
```
http://localhost:3000/admin/menu-manager
```

1. Clique em **"Ajustes"**
2. Vá para aba **"Geral"**
3. Veja o card **"Descrição"** com o texto preenchido
4. Expanda o card (chevron) para ver os seletores

### 2. Preview
1. Vá para aba **"Preview"**
2. A descrição deve aparecer:
   ```
   SOBRE A BEMDITO
   Descubra como transformamos...  ← AQUI
   Conheça nossa história
   ```

### 3. Site Público
```
http://localhost:3000
```

1. Passe o mouse sobre **"Ajustes"** (ou outro menu)
2. O megamenu deve exibir a descrição

---

## 🔄 Rollback (Se Necessário)

Se quiser remover as descrições:

```sql
UPDATE menu_items
SET megamenu_config = megamenu_config #- '{column,description}' #- '{column,descriptionColor}' #- '{column,descriptionFontSize}'
WHERE megamenu_config->>'enabled' = 'true';
```

---

## ⚠️ Troubleshooting

### "Token 'body-small' não encontrado"

**Causa:** Token não existe no banco  
**Solução:** Criar token ou usar `body-base`:

```sql
-- Ver tokens disponíveis
SELECT name FROM design_tokens WHERE category = 'typography' ORDER BY name;

-- Se body-small não existe, a migration usará body-base automaticamente
```

### Descrição não aparece no preview

**Causa:** Cache do navegador  
**Solução:** 
1. Recarregar a página com `Ctrl+Shift+R`
2. Limpar cache do navegador
3. Fechar e reabrir a aba

### Estilos estranhos

**Causa:** Tokens inválidos  
**Solução:** Verificar se os tokens existem:

```sql
SELECT id, name, category FROM design_tokens 
WHERE name IN ('body-small', 'body-base', 'dark', 'muted');
```

---

## 📊 Resultado Final Esperado

### Tabela de Validação
```
| label                   | descricao                                  | fonte       | cor   |
| ----------------------- | ------------------------------------------ | ----------- | ----- |
| Ajustes                 | Descubra como transformamos ideias...      | body-small  | muted |
| Chama a gente!          | Tire suas dúvidas, solicite um orçamento... | body-small  | muted |
| Tendências e Inspiração | Explore insights e tendências...           | body-small  | muted |
```

---

## ✅ Checklist Final

- [ ] Migration executada sem erros
- [ ] Query de validação retorna 3 linhas com descrições
- [ ] Interface admin mostra descrições nos cards
- [ ] Aba Preview renderiza descrições
- [ ] Site público exibe descrições nos megamenus

---

**🎉 Pronto para executar!**

**Tempo estimado:** 2 minutos  
**Dificuldade:** Fácil (apenas copiar e colar SQL)
