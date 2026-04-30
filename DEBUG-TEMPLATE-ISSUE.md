# Debug: Template Resolution Issue

## Problema

O SectionRenderer não está conseguindo resolver os templates porque está recebendo UUIDs ao invés de slugs.

## O Que Fizemos

1. ✅ Ajustamos o SectionRenderer para buscar o slug do objeto `template` relacionado
2. ✅ Adicionamos fallbacks para arrays (caso o Supabase retorne como array)
3. ✅ Adicionamos mensagens de erro visuais com detalhes

## Como Testar Agora

1. **Build do projeto**:
   ```bash
   pnpm run build
   ```

2. **Acesse a home**: `/`

3. **Abra o console do browser** (F12)

4. **Procure por logs**:
   - Se ainda houver erro, você verá logs detalhados no console
   - Ou verá cards visuais de erro na página

## Possíveis Causas

### Causa 1: Query do Supabase não traz template como objeto

**Sintoma**: Ver no console `template: null` ou `template: undefined`

**Solução**: A query precisa fazer join corretamente. Verificar se:
```sql
SELECT * FROM page_sections 
WHERE id = 'a1000000-0000-0000-0000-000000000001'
```

Deve retornar algo como:
```json
{
  "id": "...",
  "template_id": "70000000-...",
  "template": {
    "id": "70000000-...",
    "slug": "hero_section",
    "name": "Hero Section"
  }
}
```

### Causa 2: Supabase retorna template como array

**Sintoma**: Ver no console `template: [...]` (array)

**Solução**: Já tratado no código com `Array.isArray(sectionAny.template)`

### Causa 3: RLS bloqueando leitura de section_templates

**Sintoma**: `template: null` mesmo com query correta

**Solução**: Verificar se RLS está desabilitado em `section_templates`:

```sql
ALTER TABLE section_templates DISABLE ROW LEVEL SECURITY;
```

## Verificação Manual no Supabase

Execute esta query no SQL Editor para ver exatamente o que está no banco:

```sql
SELECT 
  ps.id as section_id,
  ps.template_id,
  ps.variant_id,
  st.slug as template_slug,
  st.name as template_name,
  sv.slug as variant_slug,
  sv.name as variant_name
FROM page_sections ps
JOIN section_templates st ON st.id = ps.template_id
LEFT JOIN section_variants sv ON sv.id = ps.variant_id
WHERE ps.page_id = (SELECT id FROM pages WHERE slug = '/')
ORDER BY ps.order_index;
```

**Resultado esperado**: 12 linhas com template_slug preenchido (hero_section, stats_cards_section, etc.)

**Se template_slug estiver NULL**: Os templates não foram inseridos corretamente. Execute `database-seed-fixed.sql` novamente.

## Próximo Passo

Após o build, compartilhe:
1. O que aparece na tela (erro visual ou home carregando?)
2. Os logs do console (se houver)
3. O resultado da query de verificação acima

Com essas informações, podemos diagnosticar e corrigir precisamente.
