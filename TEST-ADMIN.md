# ✅ Como Testar o Admin CMS

## 🚀 Quick Start

1. **Build do projeto**:
   ```bash
   pnpm run build
   ```

2. **Abra o preview** no Figma Make

3. **Teste estas URLs**:
   - Home pública: `/`
   - Admin dashboard: `/admin`
   - Pages list: `/admin/pages`

## 🧪 Testes Funcionais

### ✅ Home Pública (/)
**O que testar**:
- [ ] Página carrega do Supabase sem erros
- [ ] Mostra 12 seções na ordem correta
- [ ] Header aparece no topo
- [ ] Footer aparece no final
- [ ] Botão de ajuda flutuante aparece
- [ ] Menu mobile funciona (se abrir/fechar)
- [ ] Support modal funciona (se clicar no botão de ajuda)

**Se der erro**:
- Verifique se executou `database-seed-fixed.sql`
- Verifique se RLS está desabilitado
- Veja [QUICK-FIX.md](./QUICK-FIX.md)

---

### ✅ Admin Dashboard (/admin)
**O que testar**:
- [ ] Dashboard carrega
- [ ] Mostra 4 cards com estatísticas:
  - Pages count
  - Sections count
  - Global Blocks count
  - Media Assets count (0 por enquanto)
- [ ] Cards são clicáveis e navegam
- [ ] Quick Actions aparecem
- [ ] Sidebar está visível
- [ ] Topbar aparece
- [ ] Botão "View Site" leva para home

**Estatísticas esperadas**:
- Pages: 1 (a home)
- Sections: 12
- Global Blocks: 5

---

### ✅ Pages List (/admin/pages)
**O que testar**:
- [ ] Lista aparece com a home page
- [ ] Mostra título, slug, status, última atualização
- [ ] Status badge está verde (published)
- [ ] Botão "Edit" navega para `/admin/pages/{id}`
- [ ] Botão "Publish/Unpublish" funciona:
  - Clique no ícone de olho
  - Status muda para "draft"
  - Badge fica amarelo
  - Clique novamente
  - Status volta para "published"
  - Badge fica verde
- [ ] Botão "Delete" funciona:
  - Clique no ícone de lixeira
  - Aparece confirmação
  - Se cancelar, nada acontece
  - Se confirmar, página é deletada
  - **ATENÇÃO**: Se deletar a home, vai dar erro no site público!

**Se a lista estiver vazia**:
- Execute `database-seed-fixed.sql` novamente
- Verifique a tabela `pages` no Supabase

---

### ⏳ Page Editor (/admin/pages/{id})
**Status**: Placeholder - mostra "Page Editor (Coming Soon)"

**Próxima implementação**: 
- Editor com 3 colunas
- Lista de seções com drag-and-drop
- Section editor com tabs
- Preview responsivo

---

### ⏳ Outras Rotas
**Status**: Placeholders

- `/admin/global-blocks` - "Global Blocks (Coming Soon)"
- `/admin/media` - "Media Library (Coming Soon)"
- `/admin/design-system` - "Design System (Coming Soon)"
- `/admin/settings` - "Settings (Coming Soon)"

---

## 🎨 UI/UX Features

### Sidebar
- [ ] Abre/fecha ao clicar no ícone de menu (topbar)
- [ ] Ícone muda de X para Menu ao abrir/fechar
- [ ] Rotas ativas ficam com background azul
- [ ] Hover nos items muda cor

### Navigation
- [ ] Todas as rotas do sidebar funcionam
- [ ] URL atualiza ao navegar
- [ ] Botão "View Site" volta para home pública
- [ ] Voltar/avançar do browser funciona

### Responsividade
- [ ] Admin funciona em desktop
- [ ] Sidebar colapsa em mobile
- [ ] Tabelas são scrollable em mobile

---

## 🐛 Problemas Conhecidos

### 1. Page Editor não implementado
- Ao clicar em "Edit" na pages list, mostra placeholder
- **Solução**: Implementar page editor (próxima etapa)

### 2. Sem unsaved changes warning
- Se editar e sair, perde mudanças sem aviso
- **Solução**: Implementar useUnsavedChanges hook

### 3. Sem toast notifications
- Ações (publish/delete) não mostram feedback visual
- **Solução**: Adicionar toast library (sonner)

### 4. Delete da home quebra o site
- Se deletar a página home, site público dá erro
- **Solução**: Adicionar proteção contra deletar home

---

## 📊 Checklist de Validação

Use este checklist para validar a implementação:

**Estrutura**:
- [x] React Router instalado
- [x] Rotas públicas funcionam
- [x] Rotas admin funcionam
- [x] Layout admin estruturado

**Dashboard**:
- [x] Carrega estatísticas do banco
- [x] Cards clicáveis
- [x] Quick actions funcionam

**Pages List**:
- [x] Lista páginas do banco
- [x] Publicar/despublicar funciona
- [x] Delete funciona (com confirmação)
- [x] Navega para editor

**Pendente**:
- [ ] Page Editor funcional
- [ ] Section CRUD
- [ ] Drag-and-drop
- [ ] Pickers
- [ ] Global blocks editor
- [ ] Media library
- [ ] Design system editor

---

## 🎯 Próximo Passo

Se tudo acima funcionou, você validou a **fundação do Admin CMS**.

Para continuar a implementação, veja [ADMIN-STATUS.md](./ADMIN-STATUS.md) para detalhes do que falta e estimativas de tempo.

**Opções**:
1. **MVP rápido** (2-3 dias): Page editor básico + Section editor simples
2. **Admin completo** (8-12 dias): Tudo conforme spec original
3. **Incremental**: Ir adicionando features conforme necessidade
