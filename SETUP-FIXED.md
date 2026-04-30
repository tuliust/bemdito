# ✅ Correção do Setup - Execute Isto

## 🐛 Problema Identificado

O seed data original (`database-seed.sql`) não estava compatível com o schema do Supabase (`docs/SUPABASE_SCHEMA.sql`) que você executou primeiro.

## ✅ Solução

Criei um novo seed data corrigido: **`database-seed-fixed.sql`**

## 📋 Execute Este SQL

1. Acesse o Supabase SQL Editor: https://supabase.com/dashboard/project/ttxaaagqtihwapvtgxtc/sql

2. **Copie e execute** o conteúdo de `database-seed-fixed.sql`

## 🔧 Diferenças Corrigidas

### Sites
- ❌ Antes: Tentava usar coluna `slug` que não existe
- ✅ Agora: Usa apenas `name`, `domain`, `status`

### Section Variants  
- ❌ Antes: Usava `config_overrides` 
- ✅ Agora: Usa `schema_overrides` e `style_preset`

### Page Sections
- ❌ Antes: Usava `style_config`, `layout_config` separadas
- ✅ Agora: Usa apenas `config` (JSONB unificado)

### Section Items
- ❌ Antes: Não tinha coluna `type`
- ✅ Agora: Tem `type` obrigatório ('stat', 'benefit', 'feature', 'logo', 'testimonial', 'faq')

### UUIDs
- ❌ Antes: Formato incorreto causando erros
- ✅ Agora: Formato válido compatível com PostgreSQL

## 📊 Dados que Serão Inseridos

✅ **1 Site**
- Plataforma de Bem-Estar Corporativo

✅ **12 Templates**
- hero_section
- stats_cards_section
- feature_showcase_section
- icon_feature_list_section
- logo_marquee_section
- newsletter_capture_section
- featured_article_section
- testimonials_section
- faq_section
- closing_cta_section
- lead_capture_section
- awards_section

✅ **3 Variants**
- feature_showcase_section.analytics_dashboard
- feature_showcase_section.wellness_routine
- feature_showcase_section.single_feature_promo

✅ **1 Home Page (/)**
- Com 12 seções na ordem correta

✅ **12 Seções**
1. Hero
2. Stats (3 items)
3. Feature Showcase A - Analytics (3 benefits)
4. Feature Showcase B - Wellness (3 benefits)
5. Icon Features (6 features)
6. Logo Marquee (5 logos)
7. Single Feature Promo (1 benefit)
8. Featured Article
9. Testimonials (3 testimonials)
10. FAQ (5 FAQs)
11. Closing CTA
12. Newsletter Capture

✅ **5 Global Blocks**
- Header (main-header)
- Menu Overlay (mobile-menu)
- Footer (main-footer)
- Support Modal (support-modal)
- Floating Button (support-button)

## 🎯 Após Executar

1. Execute `pnpm run build` no terminal
2. Verifique o preview
3. Deve ver a home carregando do banco com todas as 12 seções

## ⚠️ Se Ainda Houver Erro

Compartilhe a mensagem de erro completa para que eu possa corrigir.

## 📝 Arquivos para Ignorar

Você pode ignorar estes arquivos (eram incompatíveis):
- ❌ `database-schema.sql` (use apenas `docs/SUPABASE_SCHEMA.sql`)
- ❌ `database-seed.sql` (use apenas `database-seed-fixed.sql`)
