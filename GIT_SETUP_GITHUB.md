# 🔗 Guia de Configuração Git e Github

**Conta Github:** BemDito (antiga: Bemdito2026)  
**Data:** 2026-02-27

---

## ✅ Passo 1: Verificar Estado Atual do Git

Abra o terminal na raiz do projeto e execute:

```bash
# Verificar se já é um repositório Git
git status

# Verificar configuração atual
git config --list

# Verificar repositório remoto (se existir)
git remote -v
```

---

## 🔧 Passo 2: Configurar Git com Nova Conta

Execute os comandos abaixo para configurar sua identidade:

```bash
# Configurar nome de usuário (global)
git config --global user.name "BemDito"

# Configurar email (use o email da sua conta Github)
git config --global user.email "seu-email@exemplo.com"

# Verificar configuração
git config --list | grep user
```

---

## 🆕 Passo 3: Inicializar Repositório (se necessário)

Se o projeto ainda não é um repositório Git:

```bash
# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Criar commit inicial
git commit -m "Initial commit - BemDito CMS"
```

---

## 🌐 Passo 4: Criar Repositório no Github

1. **Acesse:** https://github.com/BemDito
2. **Clique em:** "New repository" (botão verde)
3. **Preencha:**
   - **Repository name:** `` (ou o nome que preferir)
   - **Description:** "CMS responsivo com painel admin e design tokens dinâmicos"
   - **Visibilidade:** Private (ou Public, conforme sua preferência)
   - ⚠️ **NÃO marque:** "Initialize this repository with a README" (já temos arquivos locais)
4. **Clique em:** "Create repository"

---

## 🔗 Passo 5: Vincular Repositório Local ao Github

Após criar o repositório no Github, copie a URL que aparece (algo como `https://github.com/BemDito/bemdito.git`) e execute:

```bash
# Adicionar repositório remoto
git remote add origin https://github.com/BemDito/bemdito.git

# Verificar se foi adicionado corretamente
git remote -v

# Renomear branch para 'main' (se ainda estiver como 'master')
git branch -M main

# Fazer push inicial
git push -u origin main
```

---

## 🔐 Passo 6: Autenticação (se necessário)

**Opção A - Token de Acesso Pessoal (Recomendado):**

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Preencha:
   - **Note:** "BemDito - Git Push"
   - **Expiration:** 90 days (ou o que preferir)
   - **Scopes:** Marque `repo` (full control)
4. Clique em "Generate token"
5. **COPIE O TOKEN** (você não verá novamente!)
6. Ao fazer `git push`, use o token como senha

**Opção B - SSH (Alternativa):**

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no Github:
# https://github.com/settings/keys → New SSH key
# Colar a chave pública copiada

# Trocar URL do remote para SSH
git remote set-url origin git@github.com:BemDito/bemdito-cms.git
```

---

## 📝 Passo 7: Criar .gitignore

Certifique-se de que o arquivo `.gitignore` está configurado corretamente:

```bash
# Verificar se existe
cat .gitignore

# Se não existir, criar:
cat > .gitignore << 'EOF'
# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build
dist/
build/
.cache/

# Environment
.env
.env.local
.env.production
.env.development

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Supabase
.supabase/

# Tests
coverage/
EOF
```

---

## 🚀 Passo 8: Workflow de Uso Diário

Após a configuração inicial, use estes comandos regularmente:

```bash
# 1. Verificar status
git status

# 2. Adicionar mudanças
git add .

# 3. Criar commit
git commit -m "feat: descrição da mudança"

# 4. Enviar para Github
git push

# 5. Baixar mudanças (se trabalhar em múltiplos locais)
git pull
```

---

## 📦 Passo 9: Comandos Úteis

```bash
# Ver histórico de commits
git log --oneline

# Ver diferenças não commitadas
git diff

# Desfazer mudanças não commitadas
git restore arquivo.tsx

# Desfazer último commit (mantendo mudanças)
git reset --soft HEAD~1

# Ver branches
git branch -a

# Criar nova branch
git checkout -b nome-da-branch

# Voltar para main
git checkout main

# Deletar branch local
git branch -d nome-da-branch
```

---

## ⚠️ Arquivos Sensíveis

**NUNCA commite:**

- ❌ `.env` (credenciais do Supabase)
- ❌ Tokens de API
- ❌ Senhas
- ❌ Chaves privadas

**Sempre adicione ao `.gitignore` ANTES de fazer commit!**

---

## 🔄 Atualizar Repositório Existente (se já tinha configurado com conta antiga)

Se você já tinha um repositório configurado com a conta "Bemdito2026":

```bash
# Remover remote antigo
git remote remove origin

# Adicionar novo remote
git remote add origin https://github.com/BemDito/bemdito.git

# Atualizar configuração do usuário
git config user.name "BemDito"
git config user.email "tuliust@gmail.com"

# Fazer push forçado (CUIDADO: sobrescreve histórico remoto)
git push -u origin main --force
```

---

## 📋 Checklist de Validação

Após seguir os passos, valide:

- [ ] ✅ `git status` funciona
- [ ] ✅ `git remote -v` mostra URL do Github
- [ ] ✅ `git config user.name` retorna "BemDito"
- [ ] ✅ `git push` envia commits para o Github
- [ ] ✅ Repositório visível em https://github.com/BemDito
- [ ] ✅ Arquivo `.gitignore` está no repositório
- [ ] ✅ `.env` NÃO está no Github

---

## 🆘 Troubleshooting

**Erro: "remote: Repository not found"**
- **Causa:** URL do repositório incorreta ou conta sem permissão
- **Solução:** Verificar URL com `git remote -v` e corrigir com `git remote set-url origin URL_CORRETA`

**Erro: "Permission denied (publickey)"**
- **Causa:** SSH não configurado ou chave não adicionada no Github
- **Solução:** Usar HTTPS ao invés de SSH ou configurar SSH corretamente

**Erro: "Updates were rejected"**
- **Causa:** Histórico local diverge do remoto
- **Solução:** `git pull --rebase` ou `git push --force` (cuidado!)

**Erro: "fatal: not a git repository"**
- **Causa:** Não está na pasta do projeto ou não foi inicializado
- **Solução:** `cd` para a pasta correta ou executar `git init`

---

## 📚 Recursos Adicionais

- **Github Docs:** https://docs.github.com/pt
- **Git Book:** https://git-scm.com/book/pt-br/v2
- **Interactive Tutorial:** https://learngitbranching.js.org/

---

**Status:** ✅ Pronto para uso  
**Última atualização:** 2026-02-27  
**Próximos passos:** Seguir Passo 1 e executar comandos no terminal
