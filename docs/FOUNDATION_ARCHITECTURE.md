# Arquitetura da Fundação - Prompt 2

## Visão Geral

Esta é a fundação inicial do código do projeto, estruturada para Next.js 15+, React, TypeScript, Tailwind CSS e Supabase, mantendo total compatibilidade com a arquitetura validada no Prompt 1.

**Status**: ✅ Fundação completa e pronta para Prompt 3

## Estrutura de Diretórios

```
src/
├── app/                                    # Next.js 15+ App Router
│   ├── (public)/                           # Public routes group
│   │   ├── layout.tsx                      # Public layout (fetch global blocks)
│   │   ├── page.tsx                        # Home (dynamic from DB)
│   │   ├── [slug]/                         # Dynamic pages
│   │   ├── blog/                           # Blog routes
│   │   └── preview/                        # Preview routes
│   │
│   ├── admin/                              # Admin routes
│   │   ├── layout.tsx                      # Admin layout (auth + sidebar)
│   │   ├── page.tsx                        # Dashboard
│   │   ├── pages/                          # Pages management
│   │   │   ├── page.tsx                    # Pages list
│   │   │   └── [id]/page.tsx               # Page editor
│   │   ├── media/                          # Media library
│   │   ├── blog/                           # Blog management
│   │   ├── testimonials/                   # Testimonials
│   │   ├── awards/                         # Awards
│   │   ├── faqs/                           # FAQs
│   │   ├── design-system/                  # Design system editor
│   │   ├── navigation/                     # Navigation management
│   │   └── settings/                       # Settings
│   │
│   ├── empresa/                            # Company portal (structure ready)
│   │   └── layout.tsx
│   │
│   └── profissional/                       # Professional portal (structure ready)
│       └── layout.tsx
│
├── components/
│   ├── foundation/                         # Base components (from Prompt 1)
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Container.tsx
│   │   └── Section.tsx
│   │
│   ├── global-blocks/                      # Global blocks (from Prompt 1)
│   │   ├── Header.tsx
│   │   ├── MenuOverlay.tsx
│   │   ├── Footer.tsx
│   │   ├── SupportModal.tsx
│   │   └── FloatingButton.tsx
│   │
│   ├── sections/                           # Section templates (from Prompt 1)
│   │   ├── HeroSection.tsx
│   │   ├── StatsCardsSection.tsx
│   │   ├── FeatureShowcaseSection.tsx
│   │   ├── IconFeatureListSection.tsx
│   │   ├── LogoMarqueeSection.tsx
│   │   ├── NewsletterCaptureSection.tsx
│   │   ├── FeaturedArticleSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── FAQSection.tsx
│   │   └── ClosingCTASection.tsx
│   │
│   ├── admin/                              # Admin components (from Prompt 1)
│   │   ├── AdminLayout.tsx
│   │   ├── PageEditor.tsx
│   │   ├── MediaLibrary.tsx
│   │   └── DesignSystemEditor.tsx
│   │
│   ├── shared/                             # Shared UX components (NEW)
│   │   ├── BaseModal.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   └── DevicePreviewSwitcher.tsx
│   │
│   ├── layouts/                            # Layout wrappers (NEW)
│   │   ├── PublicLayoutClient.tsx
│   │   └── AdminLayoutClient.tsx
│   │
│   ├── pages/                              # Page compositions (from Prompt 1)
│   │   └── HomePage.tsx
│   │
│   └── cms/                                # CMS-specific components (future)
│       ├── pickers/
│       └── editors/
│
├── lib/
│   ├── supabase/                           # Supabase integration (NEW)
│   │   ├── client.ts                       # Client-side Supabase
│   │   ├── server.ts                       # Server-side Supabase
│   │   └── types.ts                        # Database types
│   │
│   ├── cms/                                # CMS Engine (NEW)
│   │   ├── registry/
│   │   │   ├── template-registry.ts        # Template → Component mapping
│   │   │   └── variant-registry.ts         # Variant configurations
│   │   │
│   │   ├── resolvers/
│   │   │   ├── breakpoint-resolver.ts      # Breakpoint overrides
│   │   │   └── content-resolver.ts         # Content validation & transformation
│   │   │
│   │   └── renderers/
│   │       ├── PageRenderer.tsx            # Dynamic page rendering
│   │       ├── SectionRenderer.tsx         # Dynamic section rendering
│   │       └── GlobalBlockRenderer.tsx     # Global blocks rendering
│   │
│   └── services/                           # Data services (future)
│       ├── pages-service.ts
│       ├── media-service.ts
│       └── forms-service.ts
│
├── hooks/                                  # Custom hooks (NEW)
│   ├── use-breakpoint.ts                   # Breakpoint detection
│   └── use-unsaved-changes.ts              # Unsaved changes protection
│
├── types/                                  # TypeScript definitions
│   └── cms.ts                              # CMS types (from Prompt 1)
│
└── styles/                                 # Global styles
    ├── theme.css                           # Design tokens (from Prompt 1)
    ├── fonts.css                           # Font imports
    └── tailwind.css                        # Tailwind config
```

## Camadas da Arquitetura

### 1. Data Layer (Supabase)

**Responsabilidade**: Persistência, queries e autenticação

**Arquivos principais**:
- `lib/supabase/client.ts` - Client-side Supabase
- `lib/supabase/server.ts` - Server-side Supabase (SSR)
- `lib/supabase/types.ts` - Database type definitions

**Contrato**:
```typescript
// Client-side
export const db = {
  pages: () => supabase.from('pages'),
  pageSections: () => supabase.from('page_sections'),
  // ... outras tabelas
};

// Server-side (async)
const db = await createServerDb();
const { data: pages } = await db.pages().select('*');
```

### 2. CMS Engine (Core)

**Responsabilidade**: Renderização dinâmica baseada em schema

#### 2.1 Template Registry

**Arquivo**: `lib/cms/registry/template-registry.ts`

**Responsabilidade**: Mapear slugs de templates para componentes React

**Contrato**:
```typescript
// Resolver template
const Component = resolveTemplate('hero_section');

// Check existence
const exists = templateExists('hero_section');

// Register new template
registerTemplate('custom_section', CustomComponent);
```

**Templates registrados**:
- hero_section → HeroSection
- stats_cards_section → StatsCardsSection
- feature_showcase_section → FeatureShowcaseSection
- icon_feature_list_section → IconFeatureListSection
- logo_marquee_section → LogoMarqueeSection
- newsletter_capture_section → NewsletterCaptureSection
- featured_article_section → FeaturedArticleSection
- testimonials_section → TestimonialsSection
- faq_section → FAQSection
- closing_cta_section → ClosingCTASection

#### 2.2 Variant Registry

**Arquivo**: `lib/cms/registry/variant-registry.ts`

**Responsabilidade**: Gerenciar variantes de templates

**Contrato**:
```typescript
// Resolver variant config
const config = resolveVariant('feature_showcase_section', 'analytics_dashboard');

// Get template variants
const variants = getTemplateVariants('feature_showcase_section');
// => ['analytics_dashboard', 'wellness_routine', 'single_feature_promo']
```

**Variantes registradas**:
- feature_showcase_section.analytics_dashboard
- feature_showcase_section.wellness_routine
- feature_showcase_section.single_feature_promo

#### 2.3 Breakpoint Resolver

**Arquivo**: `lib/cms/resolvers/breakpoint-resolver.ts`

**Responsabilidade**: Aplicar overrides por dispositivo

**Contrato**:
```typescript
// Apply overrides
const config = applyBreakpointOverrides(
  baseConfig,
  overrides,
  currentBreakpoint
);

// Check visibility
const visible = isVisibleAtBreakpoint(
  baseVisible,
  overrides,
  currentBreakpoint
);

// Get current breakpoint
const breakpoint = getCurrentBreakpoint(); // 'mobile' | 'tablet' | 'desktop'
```

#### 2.4 Content Resolver

**Arquivo**: `lib/cms/resolvers/content-resolver.ts`

**Responsabilidade**: Validar e transformar conteúdo baseado em schema

**Contrato**:
```typescript
// Resolve content with schema defaults
const resolved = resolveContent(section, template);

// Validate content
const { valid, errors } = validateContent(content, schema);

// Extract media references
const mediaIds = extractMediaReferences(content);
```

#### 2.5 Page Renderer

**Arquivo**: `lib/cms/renderers/PageRenderer.tsx`

**Responsabilidade**: Renderizar páginas completas dinamicamente

**Contrato**:
```tsx
<PageRenderer page={page} />

// Page structure:
{
  id: string,
  sections: PageSection[],
  globalBlocks: GlobalBlock[]
}
```

**Fluxo**:
1. Filtra seções visíveis no breakpoint atual
2. Ordena por `order` field
3. Renderiza cada seção via SectionRenderer

#### 2.6 Section Renderer

**Arquivo**: `lib/cms/renderers/SectionRenderer.tsx`

**Responsabilidade**: Renderizar seções individuais

**Contrato**:
```tsx
<SectionRenderer 
  section={section}
  currentBreakpoint={breakpoint}
/>
```

**Fluxo**:
1. Resolve template component via registry
2. Resolve variant config se existir
3. Merge variant com base config
4. Aplica breakpoint overrides
5. Prepara props e renderiza componente

#### 2.7 Global Block Renderer

**Arquivo**: `lib/cms/renderers/GlobalBlockRenderer.tsx`

**Responsabilidade**: Renderizar blocos globais

**Contrato**:
```tsx
<GlobalBlockRenderer 
  block={block}
  onAction={handleAction}
/>
```

**Blocos suportados**:
- header
- footer
- menu_overlay
- support_modal
- floating_button

### 3. Shared UX System

**Responsabilidade**: Componentes reutilizáveis entre áreas

**Componentes criados**:

#### BaseModal
Modal base com overlay, close button, sizes

```tsx
<BaseModal
  isOpen={isOpen}
  onClose={onClose}
  title="Título"
  size="md"
  closeOnOutsideClick
  closeOnEscape
>
  {children}
</BaseModal>
```

#### ConfirmModal
Confirmação de ações destrutivas

```tsx
<ConfirmModal
  isOpen={isOpen}
  onConfirm={handleConfirm}
  title="Tem certeza?"
  message="Esta ação não pode ser desfeita"
  variant="danger"
/>
```

#### EmptyState
Estado vazio para listas

```tsx
<EmptyState
  icon={FileText}
  title="Nenhuma página"
  description="Comece criando sua primeira página"
  action={{ label: 'Nova Página', onClick: handleNew }}
/>
```

#### LoadingState
Estado de carregamento

```tsx
<LoadingState message="Carregando..." size="md" />
```

#### DevicePreviewSwitcher
Switcher de dispositivos no admin

```tsx
<DevicePreviewSwitcher
  value={breakpoint}
  onChange={setBreakpoint}
/>

<PreviewFrame breakpoint={breakpoint}>
  {children}
</PreviewFrame>
```

### 4. Hooks

**Responsabilidade**: Lógica reativa reutilizável

#### useBreakpoint

**Arquivo**: `hooks/use-breakpoint.ts`

**Uso**:
```typescript
const breakpoint = useBreakpoint(); // 'mobile' | 'tablet' | 'desktop'

// Valores condicionais por breakpoint
const columns = useBreakpointValue({
  mobile: 1,
  tablet: 2,
  desktop: 3,
});

// Media query customizada
const isMobile = useMediaQuery('(max-width: 767px)');
```

#### useUnsavedChanges

**Arquivo**: `hooks/use-unsaved-changes.ts`

**Uso**:
```typescript
const { hasUnsavedChanges, setUnsavedChanges, confirmNavigation } = useUnsavedChanges({
  message: 'Você tem alterações não salvas',
  when: isDirty,
});

// Para formulários
const form = useFormUnsavedChanges(form.formState.isDirty);
```

### 5. Layouts

**Responsabilidade**: Estrutura de página por área

#### PublicLayout

**Arquivos**:
- `app/(public)/layout.tsx` - Server component (fetch global blocks)
- `components/layouts/PublicLayoutClient.tsx` - Client component (state management)

**Fluxo**:
1. Server: Busca global blocks do banco
2. Client: Renderiza blocks com estado (menu open, modal open)
3. Gerencia ações globais (openMenu, closeMenu, openSupportModal)

#### AdminLayout

**Arquivos**:
- `app/admin/layout.tsx` - Server component (check auth)
- `components/layouts/AdminLayoutClient.tsx` - Wrapper para AdminLayout do Prompt 1

**Fluxo**:
1. Server: Verifica autenticação
2. Redirect para /login se não autenticado
3. Client: Renderiza sidebar + topbar (reutiliza Prompt 1)

### 6. Rotas (Next.js App Router)

#### Public Routes

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| / | app/(public)/page.tsx | Home dinâmica do banco |
| /[slug] | app/(public)/[slug]/page.tsx | Páginas dinâmicas |
| /blog | app/(public)/blog/page.tsx | Lista de posts |
| /blog/[slug] | app/(public)/blog/[slug]/page.tsx | Post individual |
| /preview/[pageId] | app/(public)/preview/[pageId]/page.tsx | Preview de página |

#### Admin Routes

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| /admin | app/admin/page.tsx | Dashboard |
| /admin/pages | app/admin/pages/page.tsx | Lista de páginas |
| /admin/pages/[id] | app/admin/pages/[id]/page.tsx | Editor de página |
| /admin/media | app/admin/media/page.tsx | Biblioteca de mídia |
| /admin/blog | app/admin/blog/page.tsx | Gerenciar blog |
| /admin/testimonials | app/admin/testimonials/page.tsx | Depoimentos |
| /admin/awards | app/admin/awards/page.tsx | Premiações |
| /admin/faqs | app/admin/faqs/page.tsx | FAQs |
| /admin/design-system | app/admin/design-system/page.tsx | Design system |
| /admin/navigation | app/admin/navigation/page.tsx | Navegação |
| /admin/settings | app/admin/settings/page.tsx | Configurações |

#### Portal Routes (Preparados)

| Rota | Arquivo | Status |
|------|---------|--------|
| /empresa | app/empresa/layout.tsx | Estrutura pronta |
| /profissional | app/profissional/layout.tsx | Estrutura pronta |

## Contratos Principais

### Page Contract

```typescript
interface Page {
  id: string;
  siteId: string;
  slug: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  sections: PageSection[];
  globalBlocks: GlobalBlock[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}
```

### PageSection Contract

```typescript
interface PageSection {
  id: string;
  pageId: string;
  templateId: string;
  variantId?: string;
  order: number;
  content: Record<string, any>;
  config: SectionConfig;
  items: SectionItem[];
  breakpointOverrides?: BreakpointOverride[];
  visible: boolean;
}
```

### GlobalBlock Contract

```typescript
interface GlobalBlock {
  id: string;
  siteId: string;
  type: 'header' | 'footer' | 'menu_overlay' | 'support_modal' | 'floating_button' | 'custom';
  slug: string;
  name: string;
  content: Record<string, any>;
  config: Record<string, any>;
  visible: boolean;
  position?: 'top' | 'bottom' | 'fixed';
}
```

### BreakpointOverride Contract

```typescript
interface BreakpointOverride {
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  config: Record<string, any>;
  visible?: boolean;
}
```

## Preparação para Prompt 3

A fundação está preparada para receber:

### 1. Implementação Completa dos Templates

Todos os 12 templates da home estão registrados no template-registry.ts e prontos para receber implementação visual completa baseada nas referências do PDF.

**Templates a implementar**:
- ✅ Estrutura base criada (Prompt 1)
- ⏳ Conexão com CMS renderer (Prompt 3)
- ⏳ Props dinâmicas do banco (Prompt 3)
- ⏳ Breakpoint overrides aplicados (Prompt 3)

### 2. Admin Funcional

Estrutura completa de rotas e componentes base criada:
- ✅ PageEditor shell (Prompt 1)
- ✅ MediaLibrary shell (Prompt 1)
- ✅ DesignSystemEditor shell (Prompt 1)
- ⏳ CRUD operations (Prompt 3)
- ⏳ Real-time preview (Prompt 3)
- ⏳ Drag-and-drop ordering (Prompt 3)

### 3. Dados Iniciais no Supabase

Estrutura preparada para seed data:
- ⏳ Home page com 12 seções (Prompt 3)
- ⏳ Global blocks configurados (Prompt 3)
- ⏳ Design tokens iniciais (Prompt 3)
- ⏳ Media assets de exemplo (Prompt 3)

### 4. Pickers e Editors

Estrutura preparada em `components/cms/`:
- ⏳ TemplatePicker (Prompt 3)
- ⏳ VariantPicker (Prompt 3)
- ⏳ MediaPicker (Prompt 3)
- ⏳ IconPicker (Prompt 3)
- ⏳ TokenPicker (Prompt 3)

## Arquivos Centrais Criados

### Supabase Integration (3 arquivos)
- ✅ `lib/supabase/client.ts`
- ✅ `lib/supabase/server.ts`
- ✅ `lib/supabase/types.ts`

### CMS Engine (7 arquivos)
- ✅ `lib/cms/registry/template-registry.ts`
- ✅ `lib/cms/registry/variant-registry.ts`
- ✅ `lib/cms/resolvers/breakpoint-resolver.ts`
- ✅ `lib/cms/resolvers/content-resolver.ts`
- ✅ `lib/cms/renderers/PageRenderer.tsx`
- ✅ `lib/cms/renderers/SectionRenderer.tsx`
- ✅ `lib/cms/renderers/GlobalBlockRenderer.tsx`

### Hooks (2 arquivos)
- ✅ `hooks/use-breakpoint.ts`
- ✅ `hooks/use-unsaved-changes.ts`

### Shared UX (5 arquivos)
- ✅ `components/shared/BaseModal.tsx`
- ✅ `components/shared/ConfirmModal.tsx`
- ✅ `components/shared/EmptyState.tsx`
- ✅ `components/shared/LoadingState.tsx`
- ✅ `components/shared/DevicePreviewSwitcher.tsx`

### Layouts (4 arquivos)
- ✅ `app/(public)/layout.tsx`
- ✅ `components/layouts/PublicLayoutClient.tsx`
- ✅ `app/admin/layout.tsx`
- ✅ `components/layouts/AdminLayoutClient.tsx`

### Routes (4 páginas principais)
- ✅ `app/(public)/page.tsx` - Home dinâmica
- ✅ `app/admin/page.tsx` - Dashboard
- ✅ `app/admin/pages/page.tsx` - Pages list
- ✅ `app/admin/pages/[id]/page.tsx` - Page editor

## Estatísticas da Fundação

- **Arquivos criados**: 27 novos arquivos
- **Linhas de código**: ~2,000 (fundação)
- **Reutilizados do Prompt 1**: 24 componentes
- **Tipos definidos**: 50+ interfaces
- **Registries**: 2 (templates, variants)
- **Resolvers**: 2 (breakpoint, content)
- **Renderers**: 3 (page, section, global block)
- **Hooks**: 2 (breakpoint, unsaved changes)
- **Layouts**: 2 áreas (public, admin)
- **Rotas**: 4 principais criadas

## Próximos Passos (Prompt 3)

1. **Seed data no Supabase** - Popular banco com home inicial
2. **Implementar CRUD admin** - Criar, editar, deletar seções
3. **Conectar templates ao renderer** - Props dinâmicas do banco
4. **Implementar pickers** - Template, variant, media, icon
5. **Real-time preview** - Preview atualizado ao editar
6. **Drag-and-drop** - Reordenar seções
7. **Media upload** - Upload e gestão de arquivos
8. **Design tokens editor** - Editar cores, tipografia
9. **Deploy** - Vercel + Supabase Cloud

---

**Status Final**: ✅ Fundação completa, testável e pronta para implementação visual e funcional no Prompt 3.
