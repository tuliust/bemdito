# 📋 Sistema de Logo, Endereço e Telefone no Footer

**Data:** 2026-03-01  
**Versão:** 1.0  
**Status:** ✅ Implementado

---

## 🎯 Overview

O footer do site agora suporta **3 novos campos configuráveis** via painel admin:

1. **Logo do Footer** - Exibida no topo, acima das colunas de links
2. **Endereço** - Exibido na parte inferior com ícone de localização
3. **Telefone** - Exibido na parte inferior com ícone de telefone

---

## 📊 Estrutura Visual

```
┌─────────────────────────────────────────┐
│           [LOGO DO FOOTER]              │ ← Logo (topo)
├─────────────────────────────────────────┤
│  Coluna 1  │  Coluna 2  │  Coluna 3    │ ← Colunas de links
│  Links...  │  Links...  │  Redes...     │
├─────────────────────────────────────────┤
│  [Redes Sociais]                        │ ← Ícones sociais
├─────────────────────────────────────────┤
│  📍 Rua Exemplo, 123 - São Paulo        │ ← Endereço (novo)
│  📞 (11) 1234-5678                      │ ← Telefone (novo)
│  © 2024 BemDito                         │ ← Copyright
└─────────────────────────────────────────┘
```

---

## 🗄️ Schema do Banco de Dados

### Tabela: `site_config`

**Coluna:** `footer` (JSONB)

**Estrutura:**
```json
{
  "copyright": "© 2026 BemDito. Todos os direitos reservados.",
  "columns": [...],
  "social": [...],
  "logo_url": "https://...",     // ✅ NOVO
  "address": "Rua Exemplo, 123 - São Paulo, SP",  // ✅ NOVO
  "phone": "(11) 1234-5678"      // ✅ NOVO
}
```

### Migration SQL

**Arquivo:** `/migrations/2026-03-01_add_footer_logo_address_phone.sql`

**Execução:**
```sql
-- Adicionar campos ao footer (preservando dados existentes)
UPDATE site_config
SET footer = jsonb_set(
  jsonb_set(
    jsonb_set(
      COALESCE(footer, '{}'::jsonb),
      '{logo_url}',
      'null'::jsonb,
      true
    ),
    '{address}',
    '""'::jsonb,
    true
  ),
  '{phone}',
  '""'::jsonb,
  true
)
WHERE id IS NOT NULL;
```

**Validação:**
```sql
-- Verificar se os campos foram adicionados
SELECT 
  id,
  footer->>'logo_url' as logo_url,
  footer->>'address' as address,
  footer->>'phone' as phone
FROM site_config;
```

---

## ⚙️ Painel Admin

### Localização

`/admin/footer-manager` → Aba "Colunas"

### Campos Adicionados

#### 1️⃣ Logo do Footer

**Componente:** `MediaUploader`

```tsx
<MediaUploader
  label="Logo (Imagem)"
  value={config.footer.logo_url || ''}
  onChange={(url) => updateFooter({ logo_url: url })}
  accept="image/*"
  maxSizeMB={5}
/>
```

**Funcionalidades:**
- ✅ Upload de imagem via Supabase Storage
- ✅ Seleção da biblioteca de mídias
- ✅ Preview em tempo real
- ✅ Drag-and-drop
- ✅ Validação de tamanho (máx 5MB)

#### 2️⃣ Endereço

**Componente:** `Input`

```tsx
<Input
  id="address"
  value={config.footer.address || ''}
  onChange={(e) => updateFooter({ address: e.target.value })}
  placeholder="Rua Exemplo, 123 - São Paulo, SP"
/>
```

#### 3️⃣ Telefone

**Componente:** `Input`

```tsx
<Input
  id="phone"
  value={config.footer.phone || ''}
  onChange={(e) => updateFooter({ phone: e.target.value })}
  placeholder="(11) 1234-5678"
/>
```

### Card de Configuração

**Visual:**
```tsx
<div className="rounded-xl p-5 space-y-4">
  <h3>Informações de Contato</h3>
  
  <div>
    <Label>Endereço</Label>
    <Input placeholder="..." />
  </div>

  <div>
    <Label>Telefone</Label>
    <Input placeholder="..." />
  </div>
</div>
```

---

## 🎨 Componente Footer.tsx (Público)

### Localização

`/src/app/public/components/Footer.tsx`

### Renderização da Logo

```tsx
{/* ✅ Logo do Footer (topo) */}
{config.logo_url && (
  <div className="mb-8 flex justify-center">
    <img 
      src={config.logo_url} 
      alt="Logo" 
      className="h-12 md:h-16 w-auto object-contain"
    />
  </div>
)}
```

**Características:**
- ✅ Centralizada horizontalmente
- ✅ Altura responsiva: **48px (mobile)** → **64px (desktop)**
- ✅ Largura automática (mantém proporção)
- ✅ `object-contain` (não distorce)
- ✅ Margem inferior de **32px**

### Renderização do Endereço

```tsx
{/* ✅ Address */}
{config.address && (
  <div className="flex items-center gap-2 mb-4 justify-center">
    <MapPin className="h-5 w-5" style={{ color: mutedColor }} />
    <ResponsiveText 
      tokenName="menu" 
      as="span"
      style={{ color: mutedColor }}
    >
      {config.address}
    </ResponsiveText>
  </div>
)}
```

**Características:**
- ✅ Ícone `MapPin` (Lucide) - 20px
- ✅ Texto com token `menu` (responsivo)
- ✅ Cor muted (`#9ca3af`)
- ✅ Centralizado horizontalmente
- ✅ Gap de **8px** entre ícone e texto
- ✅ Margem inferior de **16px**

### Renderização do Telefone

```tsx
{/* ✅ Phone */}
{config.phone && (
  <div className="flex items-center gap-2 mb-4 justify-center">
    <Phone className="h-5 w-5" style={{ color: mutedColor }} />
    <ResponsiveText 
      tokenName="menu" 
      as="span"
      style={{ color: mutedColor }}
    >
      {config.phone}
    </ResponsiveText>
  </div>
)}
```

**Características:**
- ✅ Ícone `Phone` (Lucide) - 20px
- ✅ Texto com token `menu` (responsivo)
- ✅ Cor muted (`#9ca3af`)
- ✅ Centralizado horizontalmente
- ✅ Gap de **8px** entre ícone e texto
- ✅ Margem inferior de **16px**

### Ordem de Renderização

1. **Logo** (topo)
2. **Colunas de links** (meio)
3. **Redes sociais** (separador)
4. **Endereço** (inferior)
5. **Telefone** (inferior)
6. **Copyright** (rodapé)

---

## 🔍 Preview no Admin

### Localização

`/admin/footer-manager` → Aba "Preview"

### Implementação

O preview exibe **exatamente** a mesma estrutura do footer público:

```tsx
{/* Logo do Footer (topo) */}
{config.footer.logo_url && (
  <div className="mb-8 flex justify-center">
    <img 
      src={config.footer.logo_url} 
      alt="Logo" 
      className="h-12 md:h-16 w-auto object-contain"
    />
  </div>
)}

{/* ... Colunas e Redes Sociais ... */}

{/* Contact Information */}
{config.footer.address && (
  <div className="flex items-center gap-2 mb-4" style={{ color: '#9ca3af' }}>
    <MapPin className="h-5 w-5" />
    <span className="text-sm">{config.footer.address}</span>
  </div>
)}
{config.footer.phone && (
  <div className="flex items-center gap-2 mb-4" style={{ color: '#9ca3af' }}>
    <Phone className="h-5 w-5" />
    <span className="text-sm">{config.footer.phone}</span>
  </div>
)}

{/* Copyright */}
<div className="text-center">
  <p className="text-sm" style={{ color: '#9ca3af' }}>
    {config.footer.copyright}
  </p>
</div>
```

---

## 📱 Responsividade

### Logo

| Breakpoint | Tamanho | Classes |
|------------|---------|---------|
| Mobile (< 768px) | **48px altura** | `h-12` |
| Desktop (≥ 768px) | **64px altura** | `md:h-16` |

**Largura:** Sempre `auto` (mantém proporção)

### Endereço e Telefone

**Comportamento:**
- ✅ Sempre centralizado (`justify-center`)
- ✅ Fonte responsiva via token `menu`
- ✅ Ícones fixos em **20px** (`h-5 w-5`)
- ✅ Stack vertical natural em mobile (flex)

---

## 🎯 Casos de Uso

### Exemplo 1: Empresa com Escritório Físico

```
Logo: [marca-bemdito.png]
Endereço: Rua das Flores, 123 - Centro, São Paulo - SP
Telefone: (11) 98765-4321
```

### Exemplo 2: Empresa 100% Digital

```
Logo: [marca-digital.png]
Endereço: (vazio)
Telefone: (11) 91234-5678
```

### Exemplo 3: Apenas Logo

```
Logo: [marca-simples.png]
Endereço: (vazio)
Telefone: (vazio)
```

---

## ✅ Checklist de Implementação

### Banco de Dados
- [x] Migration SQL criada (`2026-03-01_add_footer_logo_address_phone.sql`)
- [x] Campos adicionados ao `site_config.footer`
- [x] Validação automática via `DO $$ ... END $$`

### Painel Admin
- [x] `FooterConfig` type atualizado
- [x] Campos de logo, endereço e telefone adicionados
- [x] `MediaUploader` integrado para logo
- [x] `normalizeFooter()` atualizado
- [x] Auto-save funcionando (800ms debounce)
- [x] Preview atualizado com novos campos

### Componente Público
- [x] `FooterConfig` type atualizado
- [x] Logo renderizada no topo
- [x] Endereço e telefone renderizados na parte inferior
- [x] Ícones `MapPin` e `Phone` importados
- [x] Responsividade implementada
- [x] Tokens de design aplicados

### Documentação
- [x] Arquivo `/migrations/2026-03-01_add_footer_logo_address_phone.sql` criado
- [x] Script adicionado ao `/EXECUTE_SQL.sql`
- [x] Este documento criado (`FOOTER_LOGO_ADDRESS_PHONE.md`)

---

## 🚀 Como Usar

### 1️⃣ Executar Migration SQL

```bash
# No Supabase SQL Editor ou pgAdmin
# Executar: /migrations/2026-03-01_add_footer_logo_address_phone.sql
```

**Ou via EXECUTE_SQL.sql:**
```bash
# Abrir /EXECUTE_SQL.sql
# Executar PASSO 2 (UPDATE site_config)
```

### 2️⃣ Configurar no Admin

1. Acesse `/admin/footer-manager`
2. Vá para aba "Colunas"
3. Role até os cards **"Logo do Footer"** e **"Informações de Contato"**
4. Configure:
   - Upload da logo (via MediaUploader)
   - Digite o endereço
   - Digite o telefone
5. Aguarde **auto-save** (800ms)
6. Vá para aba "Preview" para visualizar

### 3️⃣ Verificar no Site Público

1. Acesse a home do site
2. Role até o footer
3. Confirme:
   - ✅ Logo aparece no topo (centralizada)
   - ✅ Endereço aparece com ícone de localização
   - ✅ Telefone aparece com ícone de telefone
   - ✅ Elementos centralizados

---

## 🐛 Troubleshooting

### Logo não aparece

**Possíveis causas:**
1. Campo `logo_url` está vazio no banco
2. URL da imagem está quebrada
3. Imagem não foi feita upload no Supabase Storage

**Solução:**
```sql
-- Verificar valor no banco
SELECT footer->>'logo_url' FROM site_config;

-- Se NULL, fazer upload via MediaUploader no admin
```

### Endereço/Telefone não aparecem

**Possíveis causas:**
1. Campos estão vazios no banco
2. Migration não foi executada

**Solução:**
```sql
-- Verificar valores no banco
SELECT 
  footer->>'address' as address,
  footer->>'phone' as phone
FROM site_config;

-- Se campos não existem, executar migration
```

### Preview não atualiza

**Causa:** Auto-save tem debounce de 800ms

**Solução:** Aguardar 1 segundo após digitar para o auto-save disparar.

---

## 📚 Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `/migrations/2026-03-01_add_footer_logo_address_phone.sql` | **NOVO** - Migration SQL |
| `/EXECUTE_SQL.sql` | Script de migration adicionado |
| `/src/app/admin/footer-manager/page.tsx` | 3 cards adicionados (Logo, Address, Phone) |
| `/src/app/public/components/Footer.tsx` | Renderização de logo, endereço e telefone |
| `/guidelines/FOOTER_LOGO_ADDRESS_PHONE.md` | **NOVO** - Esta documentação |

---

**Última atualização:** 2026-03-01  
**Mantido por:** Equipe BemDito CMS
