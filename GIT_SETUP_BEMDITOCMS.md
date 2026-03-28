# 🚀 Configuração Rápida - Repositório Bemditocms

**Novo Repositório:** https://github.com/bemdito/Bemditocms  
**Data:** 2026-02-27

---

## ⚡ Comandos de Configuração (Execute em Ordem)

```bash
# 1. Verificar se há remote antigo
git remote -v

# 2. Remover remote antigo (se existir)
git remote remove origin

# 3. Adicionar novo remote
git remote add origin https://github.com/bemdito/Bemditocms.git

# 4. Verificar se foi adicionado corretamente
git remote -v

# 5. Verificar quantos arquivos estão prontos para commit
git status

# 6. Se houver arquivos não rastreados, adicionar todos
git add .

# 7. Verificar novamente
git status

# 8. Criar commit inicial (se necessário)
git commit -m "feat: código completo do BemDito CMS

- Sistema de seções responsivas com SectionRenderer
- Sistema de cards com templates e filtros  
- Painel admin completo (/admin/*)
- Design tokens dinâmicos (AdminThemeProvider)
- Componentes públicos (Header, Footer, CardRenderer)
- Migrations SQL e schema do Supabase
- Documentação completa em /guidelines
- Configuração Vite + React + TypeScript"

# 9. Fazer push inicial
git push -u origin main

# 10. Verificar quantos arquivos foram enviados
git ls-files | wc -l
```

---

## ✅ Resultado Esperado

Após executar os comandos, você deve ver:

**Passo 4 - Remote configurado:**
```
origin  https://github.com/bemdito/Bemditocms.git (fetch)
origin  https://github.com/bemdito/Bemditocms.git (push)
```

**Passo 9 - Push bem-sucedido:**
```
Enumerating objects: 250, done.
Counting objects: 100% (250/250), done.
...
To https://github.com/bemdito/Bemditocms.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

**Passo 10 - Arquivos no repositório:**
```
150+  (deve mostrar 100+ arquivos)
```

---

## 🌐 Validar no Github

Acesse: **https://github.com/bemdito/Bemditocms**

Você deve ver:
- ✅ Pastas: `src/`, `guidelines/`, `migrations/`, `supabase/`
- ✅ Arquivos: `package.json`, `vite.config.ts`, `README.md`
- ✅ Commit recente com todo o código

---

## 🔐 Checklist de Segurança

```bash
# Verificar que .env NÃO foi enviado
git check-ignore .env
# Deve retornar: .env

# Verificar que .gitignore existe e está correto
cat .gitignore | grep -E "(node_modules|\.env|dist)"
# Deve mostrar essas linhas
```

---

## ⚠️ Se Algo Der Errado

**Erro: "fatal: not a git repository"**
```bash
git init
git add .
git commit -m "Initial commit"
# Depois voltar ao passo 3
```

**Erro: "Updates were rejected"**
```bash
git pull --rebase
git push
```

**Erro: "Permission denied"**
- Use Personal Access Token como senha
- Gerar em: https://github.com/settings/tokens

---

## 📊 Comando Único (Copie Tudo de Uma Vez)

Se preferir, copie e cole TUDO de uma vez:

```bash
git remote remove origin 2>/dev/null; \
git remote add origin https://github.com/bemdito/Bemditocms.git; \
git remote -v; \
git add .; \
git status; \
git commit -m "feat: código completo do BemDito CMS" || echo "Commit já existe"; \
git push -u origin main; \
git ls-files | wc -l
```

---

## ✅ Pronto!

Após executar, seu projeto estará em:
**https://github.com/bemdito/Bemditocms** 🎉
