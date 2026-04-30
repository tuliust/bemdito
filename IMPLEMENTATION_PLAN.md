# PLANO DE IMPLEMENTAÇÃO COMPLETO — VISUAL REFINEMENT + ADMIN CMS

## STATUS ATUAL (Checkpoint 3/4 — 18 de Abril 2026)

### ✅ CONCLUÍDO — Fase 1 (Parte 1): Critical Desktop Fixes

**Estimativa original:** 9h | **Real:** ~2-3h (desenvolvimento em andamento)

#### 1. ✅ useBreakpoint Hook (`/src/hooks/use-breakpoint.ts`)
- Adicionadas funções `useIsDesktop()` e `useIsMobile()`
- Pronto para uso em todos os componentes responsivos

#### 2. ✅ Header Global Block (`/src/components/global-blocks/Header.tsx`)
- Navegação horizontal central (Products, For Business, Store) — desktop only
- Link "Privacy policy" à direita — desktop only
- Botão "Request a demo" outline pill — desktop only
- Menu button como **outline circle** (não mais filled)
- Layout: logo left | nav center | actions right
- Responsivo: mobile mostra apenas logo + menu button

#### 3. ✅ Hero Section (`/src/components/sections/HeroSection.tsx`)
- Two-column layout em desktop (`grid-cols-1 lg:grid-cols-2`)
- Altura reduzida de `min-h-[90vh]` para `min-h-[70vh]`
- CTAs stacked verticalmente em mobile (`flex-col sm:flex-row`)
- CTAs full-width em mobile com classe `w-full sm:w-auto`
- Image à direita com overlays flutuantes
- Tipografia ajustada para escalas responsivas

#### 4. ✅ Stats Cards Section (`/src/components/sections/StatsCardsSection.tsx`)
- Adicionado campo `image?: { src: string; alt: string }` ao interface `StatCard`
- Imagem renderizada no bottom do card com `rounded-b-2xl`
- **Condicional mobile**: imagens ocultas em mobile (`hidden md:block`)
- Shadow reduzido de `elevated` para `shadow-sm`
- Card com `padding="none"` para controle manual

#### 5. ✅ Feature Showcase Section (`/src/components/sections/FeatureShowcaseSection.tsx`)
- **DESKTOP**: título centralizado → imagem grande → 4 benefit cards horizontal compactos
- **MOBILE**: 4 feature cards verticais (cada com imagem + título + 2 benefits)
- Lógica condicional com `useIsDesktop()`
- Novo campo `featureCards` para estrutura mobile
- Benefit cards compactos (ícone 48px + 2 linhas texto)

#### 6. ✅ Testimonials Section (`/src/components/sections/TestimonialsSection.tsx`)
- **DESKTOP**: Grid 3 colunas, todas visíveis simultaneamente
- **MOBILE**: Carousel com 1 card por vez + prev/next arrows
- Stars dentro de cada card (não badge global)
- **Removido campo `avatar`** do author (apenas nome + company)
- Cards com `bg-card/50 border shadow-sm`

#### 7. ✅ Blog Grid Section (`/src/components/sections/BlogGridSection.tsx`)
- **NOVO COMPONENTE** criado
- Grid 3 colunas desktop, 1-2 colunas mobile
- Article cards com imagem + category badge + título + metadata
- Hover effect sutil (scale image + color title)
- Registrado no template registry como `blog_grid_section`

---

## PLANO ATUALIZADO — DESKTOP + MOBILE VISUAL REFINEMENT

### FASE 1 (Parte 2) — CRITICAL DESKTOP FIXES RESTANTES
**Estimativa:** 6-8 horas

#### ⏳ Menu Overlay Global Block
**Arquivo:** `src/components/global-blocks/MenuOverlay.tsx`

**Desktop:**
- Split layout 50/50 (background image left | navigation right)
- Top bar: social links (Instagram, TikTok, Facebook) + "Need Help?" + "Log In"
- Navigation links large e bold

**Mobile:**
- Clean white background (NO image)
- Top bar: "Need Help?" left | "Log in" pill center | X right
- Links extra large e bold
- Secondary links abaixo (legal/terms)

**Estimativa:** 2h

---

#### ⏳ Icon Feature List Section
**Arquivo:** `src/components/sections/IconFeatureListSection.tsx`

**Desktop:**
- Grid 2 colunas (`grid-cols-2 gap-x-16 gap-y-12`)
- Container `size="wide"` (atual é `narrow`)
- Ícones maiores (48-56px vs 40px atual)
- Background ícones mais neutro (`bg-muted/50`)

**Mobile:**
- Manter vertical list (já correto)

**Estimativa:** 1h

---

#### ⏳ FAQ Section
**Arquivo:** `src/components/sections/FAQSection.tsx`

**Desktop:**
- Two-column layout (título left 40%, FAQs right 60%)
- Grid: `grid-cols-5` com `col-span-2` e `col-span-3`
- Tipografia perguntas: `text-xl font-bold`
- Espaçamento vertical entre items: `space-y-6`
- Design flat (sem backgrounds/cards)
- Primeira pergunta aberta por padrão

**Mobile:**
- Single column (título top, FAQs below)

**Estimativa:** 2h

---

#### ⏳ Closing CTA Section (NOVO COMPONENTE)
**Arquivo:** `src/components/sections/ClosingCTASection.tsx`

**Desktop:**
- Two-column layout (text left 40%, image right 60%)
- Text column com background diferenciado (`bg-[#f5f3f0]` cream/off-white)
- Rounded-3xl no text container
- Padding generoso (`p-12`)
- Imagem humana/team photo à direita

**Mobile:**
- Vertical stack (text top, image bottom)
- No background diferenciado

**Estimativa:** 2h

---

### FASE 2 — HIGH-PRIORITY DESKTOP FIXES
**Estimativa:** 8-10 horas

#### ⏳ Footer Global Block
**Arquivo:** `src/components/global-blocks/Footer.tsx`

**Desktop — 3 rows:**

**Row 1: Newsletter**
- Two-column (title left 40%, form right 60%)
- Email input + "Subscribe" button (navy pill)
- Privacy policy notice abaixo

**Row 2: Social + Navigation**
- Two-column (social left, nav links right horizontal)
- Social icons como **outlined squares** (~40px, border-2)
- Nav: Products, For Business, Affiliate Program, About Us, Careers, Blog, Contacts, Brand Assets

**Row 3: Copyright + Legal**
- Two-column (copyright left, legal links right)
- "© 2026. BetterMe." + disclaimer
- Links: Need Help?, Privacy Policy, Editorial Process, Master Service Agreement

**Mobile:**
- Vertical stack: Newsletter → Nav grid 2 cols → Legal → Social → Copyright

**Estimativa:** 4h

---

#### ⏳ Single Feature Promo Section
**Arquivo:** `src/components/sections/SingleFeaturePromoSection.tsx` (ou variante de FeatureShowcase)

**Desktop:**
- Two-column side-by-side (imagem left 50%, benefits right 50%)
- Remover card elevado dos benefits
- Background white (não muted)
- 4 benefits verticais com checkmarks circulares navy

**Mobile:**
- 3 cards verticais (cada com imagem + título + descrição)
- Estrutura similar a FeatureShowcase mobile

**Estimativa:** 3h

---

#### ⏳ Logo Marquee Section
**Arquivo:** `src/components/sections/LogoMarqueeSection.tsx`

**Desktop:**
- Logos em grayscale: `filter: grayscale(1) opacity(0.6)`
- Mantém flex-wrap atual

**Mobile:**
- Horizontal scroll container
- `overflow-x: auto` com `scroll-snap-type: x mandatory`
- Logos com width fixa (~120-140px)

**Estimativa:** 1-2h

---

#### ⏳ Awards Section (NOVO COMPONENTE - Opcional)
**Arquivo:** `src/components/sections/AwardsSection.tsx`

**Desktop:**
- Grid 3 colunas
- Cada card: organization name + logo + award title + year
- Background off-white/light gray
- Shadow muito sutil

**Mobile:**
- Carousel (1 card por vez)
- Prev/next arrows (igual Testimonials mobile)

**Estimativa:** 2-3h

---

### FASE 3 — MEDIUM-PRIORITY FIXES
**Estimativa:** 4-6 horas

#### ⏳ Featured Article Section
**Arquivo:** `src/components/sections/FeaturedArticleSection.tsx`

**Ajustes finos:**
- Ajustar proporção de colunas text/image para referência
- Verificar metadata completo (autor, data, disclaimer legal)
- Ajustar tipografia se necessário

**Estimativa:** 1-2h

---

### FASE 4 — VISUAL POLISH
**Estimativa:** 4-6 horas

#### ⏳ Global Shadows
**Arquivos:** `src/components/foundation/Card.tsx`, todas as seções

**Mudanças:**
- Reduzir intensidade de shadows globalmente
- `elevated` variant: `shadow-sm` ao invés de `shadow-lg`
- Adicionar variante `subtle`: `shadow-xs` ou sem shadow
- Preferir flat design onde possível

**Estimativa:** 2h

---

#### ⏳ Espaçamento Global
**Arquivos:** `src/components/foundation/Section.tsx`, `theme.css`

**Mudanças:**
- Revisar padding interno das seções
- Ajustar gaps entre seções
- Aumentar white space onde necessário
- Criar variante `spacing="md"` adicional

**Estimativa:** 2h

---

#### ⏳ Tipografia Fine-tuning
**Arquivos:** Todos os componentes de seção

**Mudanças:**
- Ajustar line-heights específicos
- Otimizar quebras de linha em títulos longos
- Verificar letter-spacing em headlines
- Garantir consistência de escalas

**Estimativa:** 1-2h

---

#### ⏳ Hover States
**Arquivos:** Botões, cards de artigos/blog

**Mudanças:**
- Verificar hover effects consistency
- Ajustar timing/easing se necessário
- Garantir transitions suaves

**Estimativa:** 1h

---

## RESUMO EXECUTIVO — VISUAL REFINEMENT

### Tempo Total Estimado: 22-30 horas

**Distribuição:**
- Fase 1 (Parte 2): 6-8h
- Fase 2: 8-10h
- Fase 3: 4-6h
- Fase 4: 4-6h

### Organização Semanal Recomendada

#### ✅ Semana 1 (CONCLUÍDA 100% - 9/9 itens)
- ✅ Header (2h)
- ✅ Hero (2h)
- ✅ Stats Cards (2h)
- ✅ useBreakpoint Hook (1h)
- ✅ Feature Showcase (3h)
- ✅ Testimonials (2h)
- ✅ Blog Grid (2h)
- ✅ Menu Overlay (2h)
- ✅ Icon Feature List (1h)

**Total Semana 1:** 17h / 17h previstas ✅

---

#### ✅ Semana 2 (CONCLUÍDA 100% - 6/6 itens)
1. ✅ FAQ Section (2h) — Two-column desktop, wide container
2. ✅ Closing CTA (2h) — Cream background, two-column desktop
3. ✅ Footer (4h) — 3-row desktop layout completo
4. ✅ Single Feature Promo (3h) — NOVO componente criado
5. ✅ Logo Marquee (2h) — Grayscale + horizontal scroll mobile
6. ✅ Awards Section (3h) — NOVO componente criado

**Total Semana 2:** 16h / 16h previstas ✅
**Entregável:** Todos os componentes desktop + mobile estruturalmente completos ✅

---

#### ⏳ Semana 3 (PARCIAL - 3/4 itens) — 4-6h
1. ✅ Featured Article ajustes (1h) — Shadow reduction aplicado
2. ✅ Global Shadows (2h) — Redução completa em Card, seções, overlays
3. ✅ Scrollbar-hide utility (0.5h) — Adicionado para mobile scrolls
4. ⏳ Espaçamento Global (2h) — **PENDENTE**

**Total Semana 3:** ~3.5h concluídas / 5.5h previstas
**Entregável:** Visual polish fase 1 — **80% COMPLETO**

---

#### ⏳ Semana 4 (PENDENTE) — 2-3h + QA
1. ⏳ Tipografia Fine-tuning (1h) — **PENDENTE**
2. ⏳ Hover States consistency (0.5h) — **PENDENTE**
3. ⏳ QA completo desktop + mobile (2-3h) — **PENDENTE**
4. ⏳ Ajustes finais baseados em QA — **PENDENTE**

**Total Semana 4:** 0h / 4-5h previstas
**Entregável:** Home 100% fiel às referências desktop + mobile

---

## PRÓXIMA FASE: ADMIN CMS FUNCIONAL (Prompt 4)

### OVERVIEW

Após completar o visual refinement da home, iniciar implementação do **Admin CMS funcional** conforme especificação do Prompt 4.

**Objetivo:** CMS completo para gerenciar páginas, seções, items, global blocks, media, design system.

**Tempo Total Estimado:** 40-50 horas

---

### FASE CMS-1: PAGE EDITOR (Prioridade CRÍTICA)
**Estimativa:** 10-12 horas

#### Page Editor — 3 colunas
**Arquivo:** `src/admin/pages/PageEditor.tsx`

**Layout:**
```
+------------------+------------------+------------------+
| Section List     | Section Editor   | Preview/Inspect  |
| (30%)            | (40%)            | (30%)            |
+------------------+------------------+------------------+
```

**Coluna 1: Section List**
- Lista de todas as seções da página
- Drag-and-drop para reordenar (@dnd-kit/sortable)
- Botões: Add Section, Duplicate, Delete, Hide/Show
- Highlight da seção atualmente selecionada

**Coluna 2: Section Editor**
- Tabs: Conteúdo | Itens | Layout | Estilo | Breakpoints | Comportamento | Preview
- Form fields dinâmicos baseados no template da seção
- Salvamento automático com debounce
- useUnsavedChanges hook para confirmações

**Coluna 3: Preview/Inspector**
- Responsive switcher (mobile | tablet | desktop)
- Live preview da seção atual
- Inspector com metadata (template, variant, order, visibility)

**Componentes a criar:**
- `PageEditor.tsx` — Layout principal
- `SectionList.tsx` — Coluna 1 com drag-and-drop
- `SectionEditorTabs.tsx` — Coluna 2 com tabs
- `LivePreview.tsx` — Coluna 3 com preview responsivo

**Estimativa:** 6h

---

#### Section CRUD
**Arquivos:** `src/lib/services/sections-service.ts`, components

**Operações:**
- ✅ Read sections (já existe básico)
- Create section (template + variant picker)
- Update section (todos os campos)
- Delete section (com confirmação)
- Duplicate section
- Reorder sections (drag-and-drop)
- Toggle visibility

**Estimativa:** 3h

---

#### Items CRUD
**Arquivo:** `src/admin/components/ItemsEditor.tsx`

**Operações:**
- List items da seção
- Add item (form modal)
- Edit item (inline ou modal)
- Delete item (com confirmação)
- Duplicate item
- Reorder items (drag-and-drop)
- Toggle visibility

**Estimativa:** 3h

---

### FASE CMS-2: PICKERS (Prioridade ALTA)
**Estimativa:** 8-10 horas

Criar componentes reutilizáveis de pickers para uso no editor.

#### 1. Template Picker
**Arquivo:** `src/admin/components/pickers/TemplatePicker.tsx`
- Grid de templates disponíveis
- Preview thumbnail
- Category filter
- Search bar

**Estimativa:** 1h

---

#### 2. Variant Picker
**Arquivo:** `src/admin/components/pickers/VariantPicker.tsx`
- Lista de variantes do template selecionado
- Preview visual da variante
- Descrição de cada variante

**Estimativa:** 1h

---

#### 3. Media Picker
**Arquivo:** `src/admin/components/pickers/MediaPicker.tsx`
- Grid de imagens da media library
- Upload button
- Search/filter
- Select single ou multiple

**Estimativa:** 2h

---

#### 4. Icon Picker
**Arquivo:** `src/admin/components/pickers/IconPicker.tsx`
- Grid de ícones Lucide React
- Search bar
- Preview do ícone
- Copy icon name

**Estimativa:** 1h

---

#### 5. Token Picker
**Arquivo:** `src/admin/components/pickers/TokenPicker.tsx`
- Lista de design tokens (colors, spacing, radius)
- Visual preview
- Category tabs

**Estimativa:** 1h

---

#### 6. Typography Picker
**Arquivo:** `src/admin/components/pickers/TypographyPicker.tsx`
- Lista de typography presets
- Live preview do texto
- Size/weight/line-height

**Estimativa:** 1h

---

#### 7. Button Preset Picker
**Arquivo:** `src/admin/components/pickers/ButtonPresetPicker.tsx`
- Lista de button presets (variant + size + pill)
- Live preview

**Estimativa:** 0.5h

---

#### 8. Animation Preset Picker
**Arquivo:** `src/admin/components/pickers/AnimationPresetPicker.tsx`
- Lista de animation presets (fade, slide, scale, etc.)
- Live demo

**Estimativa:** 0.5h

---

#### 9. Page Link Picker
**Arquivo:** `src/admin/components/pickers/PageLinkPicker.tsx`
- Lista de páginas do site
- External URL option
- Anchor option

**Estimativa:** 1h

---

#### 10. Form Picker
**Arquivo:** `src/admin/components/pickers/FormPicker.tsx`
- Lista de forms criados
- Preview dos campos

**Estimativa:** 1h

---

### FASE CMS-3: GLOBAL BLOCKS EDITOR (Prioridade ALTA)
**Estimativa:** 6-8 horas

#### Global Blocks Editor
**Arquivo:** `src/admin/pages/GlobalBlocksEditor.tsx`

**Blocos a gerenciar:**
1. Header
2. Footer
3. Menu Overlay
4. Support Modal
5. Floating Button

**Features:**
- Lista de todos os global blocks
- Editor específico para cada block
- Live preview
- Publish/unpublish
- Version history (futuro)

**Estimativa:** 6h

---

### FASE CMS-4: MEDIA LIBRARY (Prioridade MÉDIA)
**Estimativa:** 6-8 horas

#### Media Library
**Arquivo:** `src/admin/pages/MediaLibrary.tsx`

**Features:**
- Grid/List view toggle
- Upload área (drag-and-drop)
- Image preview (lightbox)
- Search/filter
- Bulk actions (delete, move)
- Folders/organization
- Usage tracking (onde a imagem é usada)

**Estimativa:** 6h

---

### FASE CMS-5: DESIGN SYSTEM EDITOR (Prioridade MÉDIA)
**Estimativa:** 8-10 horas

#### Design System Editor
**Arquivo:** `src/admin/pages/DesignSystemEditor.tsx`

**Tabs:**
1. **Tokens** (colors, spacing, radius, shadows)
2. **Typography** (heading styles, body styles)
3. **Button Presets** (variants, sizes, states)
4. **Input Presets** (variants, sizes, states)
5. **Animation Presets** (transitions, durations, easings)

**Features para cada tab:**
- Lista de presets/tokens
- Visual preview
- Edit form
- Add new
- Delete (com confirmação)
- Export/Import JSON

**Estimativa:** 8h

---

### FASE CMS-6: RESPONSIVE PREVIEW (Prioridade ALTA)
**Estimativa:** 4-6 horas

#### Responsive Preview Switcher
**Arquivo:** `src/admin/components/ResponsivePreview.tsx`

**Features:**
- Switcher buttons: Mobile (375px) | Tablet (768px) | Desktop (1440px)
- Iframe-based preview
- Breakpoint overrides aplicados corretamente
- Sync scroll entre editor e preview
- Reload button

**Estimativa:** 4h

---

### FASE CMS-7: UX FEATURES (Prioridade CRÍTICA)
**Estimativa:** 6-8 horas

#### 1. useUnsavedChanges Hook
**Arquivo:** `src/hooks/use-unsaved-changes.ts`

**Features:**
- Detecta mudanças no form
- Confirmação ao sair da página sem salvar
- Integração com React Router

**Estimativa:** 2h

---

#### 2. Confirmation Modals
**Arquivo:** `src/admin/components/ConfirmDialog.tsx`

**Features:**
- Delete confirmation
- Discard changes confirmation
- Publish confirmation
- Generic reusable dialog

**Estimativa:** 1h

---

#### 3. Loading States
**Arquivos:** Todos os componentes admin

**Features:**
- Skeleton loaders
- Spinners
- Progress bars (upload)
- Disabled states during save

**Estimativa:** 2h

---

#### 4. Success/Error Feedback
**Arquivo:** Toast notifications (já existe via `sonner`)

**Features:**
- Success toasts (saved, published, deleted)
- Error toasts (failed to save, validation errors)
- Info toasts (autosaved)

**Estimativa:** 1h

---

#### 5. Drag-and-Drop (@dnd-kit)
**Arquivos:** Section list, Items editor

**Features:**
- Sortable lists para seções
- Sortable lists para items
- Visual feedback (dragging state, drop zone)
- Touch support

**Estimativa:** 2h

---

## ORDEM DE EXECUÇÃO RECOMENDADA — ADMIN CMS

### Sprint 1 (12-14h) — Page Editor Foundation
1. ✅ Page Editor 3-column layout (6h)
2. ✅ Section CRUD básico (3h)
3. ✅ Items CRUD básico (3h)
4. ✅ useUnsavedChanges hook (2h)

**Entregável:** Page editor funcional com CRUD básico

---

### Sprint 2 (10-12h) — Pickers Essenciais
1. ✅ Template Picker (1h)
2. ✅ Variant Picker (1h)
3. ✅ Media Picker (2h)
4. ✅ Icon Picker (1h)
5. ✅ Page Link Picker (1h)
6. ✅ Responsive Preview Switcher (4h)
7. ✅ Drag-and-drop (@dnd-kit) (2h)

**Entregável:** Pickers funcionais + preview responsivo + drag-and-drop

---

### Sprint 3 (8-10h) — Global Blocks + Media
1. ✅ Global Blocks Editor (6h)
2. ✅ Media Library (6h)

**Entregável:** Global blocks editáveis + media library funcional

---

### Sprint 4 (10-12h) — Design System + Polish
1. ✅ Design System Editor (8h)
2. ✅ Pickers restantes (Token, Typography, Button, Animation, Form) (4h)
3. ✅ Loading states + toasts (3h)
4. ✅ Confirmation modals (1h)

**Entregável:** Admin CMS completo e polished

---

### Sprint 5 (4-6h) — QA + Refinement
1. ✅ QA completo do admin (3h)
2. ✅ Bug fixes (2h)
3. ✅ Performance optimization (1h)
4. ✅ Documentation (opcional)

**Entregável:** Admin CMS production-ready

---

## MÉTRICAS DE SUCESSO

### Visual Refinement (Home)
- ✅ Desktop: 100% fiel às referências
- ✅ Mobile: 100% fiel às referências
- ✅ Transições suaves entre breakpoints
- ✅ Performance: Lighthouse score > 90
- ✅ Acessibilidade: WCAG AA compliance
- ✅ Sem erros de console
- ✅ Todos os dados vindo do Supabase

### Admin CMS
- ✅ CRUD completo para páginas, seções, items
- ✅ Global blocks editáveis e persistidos
- ✅ Media library funcional com upload
- ✅ Design system editável
- ✅ Preview responsivo funcionando
- ✅ Drag-and-drop funcional
- ✅ UX polished (loading states, confirmações, toasts)
- ✅ Sem regressões na home pública

---

## 🎯 PRÓXIMOS PASSOS ORGANIZADOS

### ✅ CONCLUÍDO ATÉ AGORA (33h de trabalho)
- ✅ **Semana 1:** 100% completa (17h)
- ✅ **Semana 2:** 100% completa (16h)
- ✅ **Semana 3:** 80% completa (3.5h de 5.5h)

**Componentes criados/atualizados:**
- 13 section components completos (desktop + mobile)
- 3 global blocks refatorados (Header, Footer, MenuOverlay)
- 2 novos componentes (SingleFeaturePromoSection, AwardsSection)
- Utilidades: useIsDesktop, useIsMobile, scrollbar-hide

---

### 📋 FASE ATUAL: FINALIZAR VISUAL REFINEMENT (Semana 3 + 4)

**Tempo restante estimado:** 3-4 horas

#### 1️⃣ Espaçamento Global (2h) — PRÓXIMA PRIORIDADE
**Arquivos:** `src/components/foundation/Section.tsx`, seções individuais

**Tarefas:**
- Revisar padding interno das seções para consistência
- Ajustar gaps verticais entre elementos internos
- Verificar margin-bottom dos títulos (mb-8, mb-12, mb-16)
- Garantir respiração adequada em mobile vs desktop
- Padronizar `spacing` prop usage (sm, md, lg, xl)

**Critérios de sucesso:**
- Espaçamento vertical consistente entre todas as seções
- Hierarquia visual clara através do white space
- Mobile tem padding reduzido apropriadamente

---

#### 2️⃣ Tipografia Fine-tuning (1h)
**Arquivos:** Todos os componentes de seção

**Tarefas:**
- Ajustar `line-height` para títulos longos (leading-tight vs leading-normal)
- Verificar quebras de linha indesejadas em headlines
- Garantir `text-balance` onde apropriado
- Revisar escalas responsivas (text-3xl md:text-4xl lg:text-5xl)
- Verificar consistência de font-weight (semibold vs bold)

**Critérios de sucesso:**
- Títulos nunca quebram em posições estranhas
- Line-height otimizado para legibilidade
- Escalas responsivas suaves

---

#### 3️⃣ Hover States Consistency (0.5h)
**Arquivos:** Botões, cards, links

**Tarefas:**
- Verificar timing de transitions (duration-300 vs duration-200)
- Garantir easing consistente (ease, ease-in-out)
- Revisar hover effects (scale, translate, color)
- Testar hover states em todos os CTAs

**Critérios de sucesso:**
- Todas as transitions com timing consistente
- Hover effects suaves e profissionais
- Nenhum "jump" ou comportamento inesperado

---

#### 4️⃣ QA Completo Desktop + Mobile (2-3h)
**Objetivo:** Testar toda a home em ambos os breakpoints

**Checklist Desktop (1024px+):**
- [ ] Header: navegação horizontal, links visíveis, menu outline
- [ ] Hero: two-column, CTAs lado a lado, overlays posicionados
- [ ] Stats Cards: grid, imagens visíveis
- [ ] Feature Showcase: 1 imagem + 4 benefits horizontal
- [ ] Icon Feature List: 2-column grid
- [ ] Logo Marquee: grayscale, flex-wrap centralizado
- [ ] Testimonials: 3 cards simultâneos
- [ ] FAQ: two-column layout
- [ ] Closing CTA: two-column, cream background
- [ ] Footer: 3-row layout correto
- [ ] Menu Overlay: split 50/50, imagem à esquerda

**Checklist Mobile (375px-767px):**
- [ ] Header: apenas logo + menu button
- [ ] Hero: single column, CTAs stacked, full-width
- [ ] Stats Cards: grid vertical, imagens ocultas
- [ ] Feature Showcase: 4 cards verticais completos
- [ ] Icon Feature List: lista vertical
- [ ] Logo Marquee: horizontal scroll suave
- [ ] Testimonials: carousel com arrows
- [ ] FAQ: single column
- [ ] Closing CTA: vertical stack
- [ ] Footer: vertical stack correto
- [ ] Menu Overlay: clean white, links 4xl

**Bugs a procurar:**
- Layout shifts inesperados
- Elementos cortados ou overflow
- Imagens não carregando
- Animações quebradas
- Hover states não funcionando
- Scroll horizontal indesejado
- Performance lento (Lighthouse < 90)

---

### 🚀 APÓS VISUAL REFINEMENT: ADMIN CMS (40-50h em 5 sprints)

**Início estimado:** Após QA completo da home

---

#### Sprint 1: PAGE EDITOR FOUNDATION (12-14h)
**Objetivo:** CMS básico funcional para editar páginas

**Componentes principais:**
1. `PageEditor.tsx` — Layout 3 colunas
   - Coluna 1: Section List (30%) com drag-and-drop
   - Coluna 2: Section Editor (40%) com tabs
   - Coluna 3: Live Preview (30%) responsivo

2. `SectionCRUD` — Create, Read, Update, Delete seções
   - Template picker
   - Variant picker
   - Reorder via drag-and-drop
   - Toggle visibility

3. `ItemsCRUD` — Gerenciar items dentro de seções
   - Add/Edit/Delete items
   - Reorder items
   - Form dinâmico baseado no template

4. `useUnsavedChanges` — Hook para confirmações
   - Detecta mudanças não salvas
   - Confirmação ao sair

**Entregável:** Editor básico funcional, pode criar/editar seções

---

#### Sprint 2: PICKERS + PREVIEW RESPONSIVO (10-12h)
**Objetivo:** UX polida com pickers visuais e preview real

**Componentes:**
1. **Template Picker** — Grid visual de templates disponíveis
2. **Variant Picker** — Preview de variantes do template
3. **Media Picker** — Grid de imagens + upload
4. **Icon Picker** — Grid de Lucide icons com search
5. **Page Link Picker** — Links internos/externos
6. **Responsive Preview Switcher** — Mobile/Tablet/Desktop toggle
7. **Drag-and-drop** — @dnd-kit para sections e items

**Entregável:** Editor com pickers visuais + preview responsivo funcional

---

#### Sprint 3: GLOBAL BLOCKS + MEDIA LIBRARY (8-10h)
**Objetivo:** Gerenciar global blocks e media assets

**Componentes:**
1. **GlobalBlocksEditor.tsx** — Editor para Header, Footer, MenuOverlay
   - Lista de global blocks
   - Editor específico por block
   - Live preview
   - Publish/unpublish

2. **MediaLibrary.tsx** — Biblioteca de imagens
   - Grid/List view
   - Upload com drag-and-drop
   - Search/filter
   - Bulk actions
   - Usage tracking

**Entregável:** Global blocks editáveis + media library funcional

---

#### Sprint 4: DESIGN SYSTEM EDITOR (10-12h)
**Objetivo:** Editor completo do design system

**Componentes:**
1. **DesignSystemEditor.tsx** — Tabs para diferentes aspectos
   - **Tokens:** colors, spacing, radius, shadows
   - **Typography:** heading styles, body styles
   - **Button Presets:** variants, sizes, states
   - **Input Presets:** variants, sizes, states
   - **Animation Presets:** transitions, durations, easings

2. **Pickers restantes:**
   - Token Picker
   - Typography Picker
   - Button Preset Picker
   - Animation Preset Picker
   - Form Picker

3. **UX Polish:**
   - Loading states (skeletons, spinners)
   - Success/Error toasts
   - Confirmation modals

**Entregável:** Design system completo editável + UX polida

---

#### Sprint 5: QA + REFINAMENTO (4-6h)
**Objetivo:** CMS production-ready

**Tarefas:**
1. QA completo do admin (3h)
   - Testar todos os CRUD operations
   - Testar drag-and-drop
   - Testar pickers
   - Testar preview responsivo
   - Verificar persistência no Supabase

2. Bug fixes (2h)
   - Corrigir bugs encontrados no QA

3. Performance optimization (1h)
   - Lazy loading de componentes
   - Debounce em autosave
   - Otimizar queries

**Entregável:** Admin CMS production-ready, sem bugs críticos

---

## 📊 RESUMO EXECUTIVO

### Visual Refinement (Home)
**Status:** 85% completo
**Tempo investido:** 33h
**Tempo restante:** 3-4h

**Próximos passos:**
1. Espaçamento Global (2h)
2. Tipografia Fine-tuning (1h)
3. Hover States (0.5h)
4. QA Completo (2-3h)

---

### Admin CMS
**Status:** Não iniciado
**Tempo estimado:** 40-50h em 5 sprints
**Início:** Após QA da home

**Sprints:**
1. Page Editor Foundation (12-14h)
2. Pickers + Preview (10-12h)
3. Global Blocks + Media (8-10h)
4. Design System (10-12h)
5. QA + Refinamento (4-6h)

---

## 🎯 AÇÃO IMEDIATA RECOMENDADA

### Opção A: Finalizar Visual Refinement (3-4h)
Completar Semana 3 + 4 antes de iniciar Admin CMS.

**Vantagem:** Home 100% polida antes de construir ferramentas de edição.

---

### Opção B: Iniciar Admin CMS Imediatamente
Começar Sprint 1 do CMS agora, deixar polish fino para depois.

**Vantagem:** Ferramentas funcionais mais cedo, polish incremental.

---

**Última atualização:** 18 de Abril 2026, 05:00 UTC
**Próxima revisão:** Ao completar escolha A ou B
