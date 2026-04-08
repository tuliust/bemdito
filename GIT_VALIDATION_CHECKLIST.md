# ✅ Checklist de Validação - Git e Github Configurado

**Data:** 2026-02-27  
**Conta Github:** BemDito (https://github.com/tuliust/bemdito)  
**Repositório:** bemdito

---

## 📋 Execute os Comandos de Validação

Copie e cole os comandos abaixo no terminal para validar a configuração:

```bash
# 1. Verificar remote atualizado
echo "=== 1. Remote atual ==="
git remote -v

# 2. Verificar configuração do usuário
echo -e "\n=== 2. Configuração do usuário ==="
git config user.name
git config user.email

# 3. Verificar branch atual
echo -e "\n=== 3. Branch e status ==="
git branch -a
git status

# 4. Verificar último commit
echo -e "\n=== 4. Último commit ==="
git log --oneline -1

# 5. Verificar .gitignore
echo -e "\n=== 5. Arquivos ignorados ==="
cat .gitignore | head -10
```

---

## ✅ Resultados Esperados

**1. Remote atual:**
```
origin  https://github.com/tuliust/bemdito.git (fetch)
origin  https://github.com/tuliust/bemdito.git (push)
```
✅ **CORRETO:** URL usa "BemDito" com B maiúsculo

**2. Configuração do usuário:**
```
BemDito
tuliust@gmail.com
```
✅ **CORRETO:** Nome "BemDito" e email configurados

**3. Branch e status:**
```
* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/main

On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```
✅ **CORRETO:** Branch main ativa e sincronizada

**4. Último commit:**
```
debf974 (HEAD -> main, origin/main, origin/HEAD) feat: descrição da mudança
```
✅ **CORRETO:** Commit mais recente visível

**5. Arquivos ignorados:**
```
node_modules/
npm-debug.log*
...
.env
.env.local
```
✅ **CORRETO:** .gitignore configurado com arquivos sensíveis

---

## 🚀 Fazer Push para Validar Conexão

Agora vamos fazer um push de teste para confirmar que tudo está funcionando:

```bash
# 1. Criar um commit de teste
echo "# BemDito CMS" > README.md
git add README.md
git commit -m "docs: adicionar README inicial"

# 2. Fazer push
git push

# 3. Verificar se apareceu no Github
echo "Acesse: https://github.com/tuliust/bemdito"
```

---

## ⚠️ Se o Push Falhar

**Erro possível:** "Updates were rejected"

**Causa:** O repositório remoto tem commits que você não tem localmente.

**Solução:**
```bash
# Opção A - Fazer pull com rebase (recomendado)
git pull --rebase

# Opção B - Fazer pull normal
git pull

# Depois fazer push novamente
git push
```

---

## 🔐 Autenticação (se solicitado)

Se o Git pedir usuário e senha ao fazer push:

**Username:** `BemDito`  
**Password:** Use um **Personal Access Token** (NÃO a senha da conta)

**Como criar token:**
1. Acesse: https://github.com/settings/tokens
2. "Generate new token" → "Generate new token (classic)"
3. Nome: "BemDito CMS - Git Access"
4. Marque: `repo` (full control)
5. "Generate token"
6. **COPIE O TOKEN** (você só verá uma vez!)
7. Use como "senha" no Git

---

## 📊 Verificar no Github

Após o push, valide no navegador:

1. **Acesse:** https://github.com/tuliust/bemdito
2. **Verifique:**
   - [ ] ✅ Repositório existe
   - [ ] ✅ Commits aparecem no histórico
   - [ ] ✅ Arquivo `.gitignore` está presente
   - [ ] ✅ Arquivo `.env` **NÃO** está presente (foi ignorado)
   - [ ] ✅ README.md aparece (após push de teste)

---

## 📝 Próximos Commits

A partir de agora, use este workflow:

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar mudanças
git add .

# 3. Commit com mensagem descritiva
git commit -m "feat: adicionar nova funcionalidade"
# ou
git commit -m "fix: corrigir bug no componente X"
# ou
git commit -m "docs: atualizar documentação"

# 4. Enviar para Github
git push
```

---

## 🎯 Padrões de Mensagens de Commit (Conventional Commits)

Use estes prefixos:

| Prefixo | Descrição | Exemplo |
|---------|-----------|---------|
| `feat:` | Nova funcionalidade | `feat: adicionar campo de upload de mídia` |
| `fix:` | Correção de bug | `fix: corrigir renderização de cards` |
| `docs:` | Documentação | `docs: atualizar README com instruções` |
| `style:` | Formatação/estilo | `style: ajustar espaçamento do header` |
| `refactor:` | Refatoração | `refactor: simplificar lógica do SectionRenderer` |
| `test:` | Testes | `test: adicionar testes do CardRenderer` |
| `chore:` | Tarefas gerais | `chore: atualizar dependências` |

---

## 🔄 Sincronizar com Github (trabalho em múltiplos locais)

Se trabalhar em mais de um computador/ambiente:

```bash
# Antes de começar a trabalhar
git pull

# Fazer suas mudanças...

# Ao terminar
git add .
git commit -m "feat: sua mudança"
git push
```

---

## ✅ Status Final

Após executar os comandos de validação acima, você deve ver:

- ✅ Remote aponta para `https://github.com/tuliust/bemdito.git`
- ✅ Usuário configurado como "BemDito"
- ✅ Email configurado como "tuliust@gmail.com"
- ✅ Branch `main` sincronizada
- ✅ `.gitignore` configurado
- ✅ Push funciona corretamente

**Tudo certo?** ✅ Configuração completa!

---

## 🆘 Problemas Comuns

**1. "Permission denied"**
- **Solução:** Usar Personal Access Token ao invés de senha

**2. "Repository not found"**
- **Solução:** Verificar se a URL está correta com `git remote -v`

**3. "Updates were rejected"**
- **Solução:** `git pull` antes de `git push`

**4. Commit aparece com nome/email errado**
- **Solução:** 
  ```bash
  # Corrigir último commit
  git commit --amend --author="BemDito <tuliust@gmail.com>"
  git push --force
  ```

---

**🎉 Parabéns!** Repositório vinculado ao Github com sucesso!

**Próximos passos:**
1. Executar comandos de validação acima
2. Fazer push de teste
3. Verificar no Github
4. Começar a usar o workflow diário

