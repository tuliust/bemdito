# 🔧 Como Corrigir Erro de Template

## ✅ O Que Foi Feito

1. **Ajustei o SectionRenderer** para buscar corretamente o slug do template
2. **Adicionei logs de debug** para diagnosticar o problema
3. **Melhorei mensagens de erro** visuais

## 🎯 Execute Agora

### Passo 1: Build
```bash
pnpm run build
```

### Passo 2: Abra o Preview

### Passo 3: Abra o Console (F12)

Você deve ver logs como:
```
Sample section structure: {
  id: "...",
  template_id: "...",
  template: { ... },
  template_type: "object",
  template_is_array: false
}

Page loaded successfully: {
  title: "Home",
  sections_count: 12
}

Global blocks loaded: {
  count: 5,
  types: ["header", "menu_overlay", "footer", ...]
}
```

### Passo 4: Verificar Resultado

**Se a home carregar**:
✅ Problema resolvido!

**Se aparecer card de erro na tela**:
📸 Tire screenshot do erro e compartilhe

**Se aparecer erro no console**:
📋 Copie os logs e compartilhe

## 🔍 Diagnóstico Manual (Se ainda houver erro)

Execute esta query no Supabase SQL Editor:

```sql
-- Verificar estrutura das seções
SELECT 
  ps.id,
  ps.order_index,
  ps.template_id,
  st.slug as template_slug,
  st.name as template_name,
  ps.content,
  ps.config
FROM page_sections ps
LEFT JOIN section_templates st ON st.id = ps.template_id
WHERE ps.page_id = (SELECT id FROM pages WHERE slug = '/')
ORDER BY ps.order_index;
```

**Resultado esperado**: 12 linhas com `template_slug` preenchido

**Se template_slug estiver NULL**:
- Templates não foram criados
- Execute `database-seed-fixed.sql` novamente

**Se template_slug estiver preenchido mas ainda dá erro**:
- Problema está na query do Supabase JS
- Compartilhe os logs do console

## 🐛 Checklist de Diagnóstico

- [ ] Build executado sem erros
- [ ] Preview aberto
- [ ] Console aberto (F12)
- [ ] Logs aparecem no console
- [ ] Home carrega ou mostra erro visual
- [ ] Query manual executada no Supabase

## 📊 O Que Compartilhar

Se ainda houver erro, compartilhe:

1. **Screenshot da tela** (se houver erro visual)
2. **Logs do console** (copie e cole)
3. **Resultado da query SQL** acima
4. **Mensagem de erro específica** (se houver)

Com essas informações, posso corrigir o problema exato!
