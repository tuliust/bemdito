# 📊 Página Sistema - BemDito CMS

## 🎯 Overview

A página `/admin/system` fornece uma interface completa para gerenciar o repositório Git, visualizar estatísticas e acessar documentações do projeto.

---

## 🚀 Funcionalidades

### 1️⃣ Visão Geral

**Estatísticas do Repositório:**
- 📊 **Github (Remoto):** Pastas, arquivos, branch, última atualização
- 💻 **Figma Make (Local):** Pastas, arquivos, branch, última modificação

**Status do Git:**
- ✅ Commits à frente (ahead)
- ⬇️ Commits atrás (behind)
- 📝 Arquivos modificados
- ❓ Arquivos não rastreados
- ✔️ Arquivos staged

**Ações Rápidas:**
- ⬇️ **Baixar Mudanças** - Git pull
- ⬆️ **Enviar Mudanças** - Git push
- 💾 **Criar Commit** - Git commit

### 2️⃣ Histórico

- 📜 Últimos 20 commits
- 👤 Autor de cada commit
- 🕒 Data e hora
- 📝 Mensagem do commit
- 🔢 Hash curto (7 caracteres)

### 3️⃣ Documentação

- 📚 Lista de arquivos `.md` em `/guidelines`
- 📏 Tamanho de cada arquivo
- 🕒 Última modificação
- 🔗 Link para abrir em nova aba

---

## 🔧 Como Usar

### Acessar a Página

```
http://localhost:3000/admin/system
```

Ou clique em **"Sistema"** na sidebar do painel admin.

---

### Sincronizar Tudo (Recomendado)

1. Clique em **"Sincronizar Tudo"** (botão azul no topo)
2. Confirme a ação
3. Aguarde o processo:
   - Cria commit automático com timestamp
   - Faz pull do Github
   - Faz push para Github
4. Receba confirmação de sucesso ✅

**Quando usar:**
- Ao final do dia de trabalho
- Antes de sair do Figma Make
- Antes de abrir em outro Codespace

---

### Baixar Mudanças (Pull)

1. Clique em **"Baixar Mudanças"**
2. Confirme a ação
3. Aguarde download das mudanças do Github
4. Página recarrega automaticamente

**Quando usar:**
- Ao abrir o Figma Make
- Quando outra pessoa fez mudanças no Github
- Antes de começar a trabalhar

---

### Enviar Mudanças (Push)

1. Clique em **"Enviar Mudanças"**
2. Confirme a ação
3. Aguarde envio para o Github
4. Página recarrega automaticamente

**Quando usar:**
- Depois de fazer commit
- Quando houver commits locais (ahead > 0)

---

### Criar Commit

1. Clique em **"Criar Commit"**
2. Confirme a ação
3. Aguarde criação do commit
4. Página recarrega automaticamente

**Quando usar:**
- Depois de fazer mudanças significativas
- Antes de fazer push
- Antes de sincronizar

---

## 📊 Status do Repositório

### Indicadores

| Indicador | Significado | Cor |
|-----------|-------------|-----|
| **À Frente** | Commits locais não enviados ao Github | 🔵 Azul |
| **Atrás** | Commits no Github não baixados | 🟠 Laranja |
| **Modificados** | Arquivos alterados mas não commitados | 🟡 Amarelo |
| **Não Rastreados** | Arquivos novos não adicionados ao Git | 🔴 Vermelho |
| **Staged** | Arquivos prontos para commit | 🟢 Verde |

### Badge de Status

- ✅ **Sincronizado** - Tudo em dia (verde/rosa)
- ⚠️ **Mudanças Pendentes** - Há arquivos modificados (laranja)

---

## 🔄 Workflow Recomendado

### Ao Começar o Dia

```bash
1. Abrir Figma Make
2. Ir em /admin/system
3. Clicar em "Baixar Mudanças"
4. Começar a trabalhar
```

### Durante o Trabalho

```bash
1. Fazer mudanças no código
2. Testar localmente
3. Clicar em "Criar Commit" a cada funcionalidade completa
```

### Ao Final do Dia

```bash
1. Ir em /admin/system
2. Clicar em "Sincronizar Tudo"
3. Aguardar confirmação
4. Sair do Figma Make
```

---

## ⚠️ Avisos Importantes

### Sempre Confirmar

Todas as ações (pull, push, commit, sync) exigem confirmação antes de executar.

### Mudanças Pendentes

Se houver arquivos modificados, o indicador mostrará **"Mudanças Pendentes"**. Crie um commit antes de fazer push.

### Conflitos

Se houver conflitos ao fazer pull, a página mostrará erro. Neste caso:
1. Abra o terminal do Figma Make
2. Execute: `git status`
3. Resolva conflitos manualmente
4. Execute: `git add . && git commit -m "fix: resolver conflitos"`

---

## 🐛 Troubleshooting

### Erro: "No changes to commit"

**Causa:** Não há mudanças para commitar  
**Solução:** Normal, continue trabalhando

### Erro: "failed to push"

**Causa:** Há commits no Github que você não tem localmente  
**Solução:** Clique em "Baixar Mudanças" primeiro

### Erro: "Authentication failed"

**Causa:** Credenciais Git não configuradas  
**Solução:** Execute no terminal:
```bash
git config --global user.email "seu@email.com"
git config --global user.name "Seu Nome"
```

### Página não carrega

**Causa:** Rotas Git não configuradas no servidor  
**Solução:** Certifique-se de que `/supabase/functions/server/git.tsx` existe e está importado em `index.tsx`

---

## 🔐 Segurança

- ✅ Todos os comandos Git são executados no servidor
- ✅ Confirmação obrigatória antes de ações destrutivas
- ✅ Nenhuma senha é armazenada no frontend
- ✅ Logs detalhados no console do servidor

---

## 📝 Logs

Todos os comandos Git são logados no console do servidor (Deno). Para ver:

1. Acesse o Supabase Dashboard
2. Vá em Functions → `make-server-72da2481`
3. Abra a aba "Logs"

Ou no terminal local:
```bash
deno run --allow-all supabase/functions/server/index.tsx
```

---

## 🎨 Design

A página segue todos os padrões do AdminThemeProvider:

- ✅ Tokens CSS vars (`--admin-*`)
- ✅ Componentes oficiais (AdminPageLayout, AdminPrimaryButton)
- ✅ Cores tokenizadas (sem hardcoded)
- ✅ Responsivo
- ✅ Consistent com outras páginas admin

---

## 🚀 Próximas Melhorias

- [ ] Visualização de diff dos commits
- [ ] Histórico filtrado por autor/data
- [ ] Criação de branches
- [ ] Merge de branches
- [ ] Resolução de conflitos visual
- [ ] Estatísticas de contribuições
- [ ] Backup automático
- [ ] Integração com CI/CD

---

## 📚 Referências

- **Documentação Git:** https://git-scm.com/doc
- **React Router:** https://reactrouter.com/
- **Hono (Server):** https://hono.dev/
- **Deno:** https://deno.land/

---

**Última atualização:** 2026-02-27  
**Versão:** 1.0  
**Autor:** BemDito CMS Team
