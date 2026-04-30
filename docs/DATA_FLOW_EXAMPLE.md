# Exemplo de Fluxo de Dados - Home Page

Este documento ilustra como os dados fluem do Supabase até a renderização final da home.

## 1. Estrutura da Home no Banco

### Tabela `pages`
```sql
INSERT INTO pages (id, site_id, slug, title, status) VALUES
('uuid-home', 'uuid-site', '/', 'Home', 'published');
```

### Tabela `page_sections`
```sql
-- Hero Section
INSERT INTO page_sections (id, page_id, template_id, order_index, content, config) VALUES (
  'uuid-section-1',
  'uuid-home',
  'hero_section',
  0,
  '{
    "eyebrow": "Bem-estar corporativo",
    "title": "Transforme a saúde e produtividade da sua equipe",
    "description": "Plataforma completa de gestão...",
    "primaryCTA": {"label": "Começar agora", "href": "/cadastro"},
    "secondaryCTA": {"label": "Ver demonstração", "href": "/demo"},
    "image": {"src": "...", "alt": "..."}
  }',
  '{
    "layout": {"container": "wide", "spacing": {"top": "xl", "bottom": "xl"}},
    "style": {"background": "transparent"},
    "behavior": {"animation": "fade-up"}
  }'
);

-- Stats Cards Section
INSERT INTO page_sections (id, page_id, template_id, order_index, content, config) VALUES (
  'uuid-section-2',
  'uuid-home',
  'stats_cards_section',
  1,
  '{}',
  '{
    "layout": {"container": "wide"},
    "style": {"background": "muted"}
  }'
);
```

### Tabela `section_items` (para Stats Cards)
```sql
INSERT INTO section_items (id, section_id, type, order_index, content) VALUES
('uuid-item-1', 'uuid-section-2', 'stat_card', 0, '{
  "value": "94%",
  "label": "Taxa de engajamento",
  "description": "Usuários ativos mensalmente"
}'),
('uuid-item-2', 'uuid-section-2', 'stat_card', 1, '{
  "value": "2.5x",
  "label": "Aumento de produtividade",
  "description": "Medido nos primeiros 3 meses"
}'),
('uuid-item-3', 'uuid-section-2', 'stat_card', 2, '{
  "value": "500+",
  "label": "Empresas confiaram",
  "description": "Em todo o Brasil"
}');
```

### Tabela `section_breakpoint_overrides`
```sql
-- Override mobile para Hero
INSERT INTO section_breakpoint_overrides (section_id, breakpoint, config) VALUES (
  'uuid-section-1',
  'mobile',
  '{
    "layout": {"spacing": {"top": "md", "bottom": "md"}},
    "style": {"fontSize": "2rem"}
  }'
);
```

## 2. Query de Fetch

```typescript
// Buscar página com todas as seções e items
const { data: page } = await supabase
  .from('pages')
  .select(`
    *,
    sections:page_sections(
      *,
      template:section_templates(*),
      variant:section_variants(*),
      items:section_items(*),
      breakpoint_overrides:section_breakpoint_overrides(*)
    )
  `)
  .eq('slug', '/')
  .eq('status', 'published')
  .single();

// Resultado:
{
  id: 'uuid-home',
  slug: '/',
  title: 'Home',
  sections: [
    {
      id: 'uuid-section-1',
      template: { slug: 'hero_section', schema: {...} },
      content: { eyebrow: '...', title: '...', ... },
      config: { layout: {...}, style: {...} },
      breakpoint_overrides: [
        { breakpoint: 'mobile', config: {...} }
      ]
    },
    {
      id: 'uuid-section-2',
      template: { slug: 'stats_cards_section', schema: {...} },
      items: [
        { type: 'stat_card', content: { value: '94%', ... } },
        { type: 'stat_card', content: { value: '2.5x', ... } },
        { type: 'stat_card', content: { value: '500+', ... } }
      ]
    },
    // ... outras seções
  ]
}
```

## 3. Template Registry

```typescript
// lib/cms/template-registry.ts
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsCardsSection } from '@/components/sections/StatsCardsSection';
// ... outros imports

export const TEMPLATE_REGISTRY = {
  hero_section: HeroSection,
  stats_cards_section: StatsCardsSection,
  feature_showcase_section: FeatureShowcaseSection,
  icon_feature_list_section: IconFeatureListSection,
  logo_marquee_section: LogoMarqueeSection,
  newsletter_capture_section: NewsletterCaptureSection,
  featured_article_section: FeaturedArticleSection,
  testimonials_section: TestimonialsSection,
  faq_section: FAQSection,
  closing_cta_section: ClosingCTASection,
};

export function resolveTemplate(templateSlug: string) {
  return TEMPLATE_REGISTRY[templateSlug];
}
```

## 4. Page Renderer

```typescript
// components/cms/PageRenderer.tsx
import { resolveTemplate } from '@/lib/cms/template-registry';
import { applyBreakpointOverrides } from '@/lib/cms/breakpoint-resolver';

interface PageRendererProps {
  page: Page;
}

export function PageRenderer({ page }: PageRendererProps) {
  const currentBreakpoint = useBreakpoint(); // mobile | tablet | desktop

  return (
    <>
      {page.sections
        .filter(section => section.visible)
        .sort((a, b) => a.order_index - b.order_index)
        .map((section) => {
          // Resolver template
          const Component = resolveTemplate(section.template.slug);
          
          if (!Component) {
            console.error(`Template not found: ${section.template.slug}`);
            return null;
          }

          // Aplicar overrides de breakpoint
          const config = applyBreakpointOverrides(
            section.config,
            section.breakpoint_overrides,
            currentBreakpoint
          );

          // Preparar props
          const props = {
            ...section.content,
            config,
            items: section.items,
          };

          return <Component key={section.id} {...props} />;
        })}
    </>
  );
}
```

## 5. Breakpoint Resolver

```typescript
// lib/cms/breakpoint-resolver.ts
export function applyBreakpointOverrides(
  baseConfig: any,
  overrides: BreakpointOverride[],
  currentBreakpoint: Breakpoint
): any {
  const override = overrides.find(o => o.breakpoint === currentBreakpoint);
  
  if (!override) {
    return baseConfig;
  }

  // Deep merge
  return {
    ...baseConfig,
    ...override.config,
    layout: {
      ...baseConfig.layout,
      ...override.config.layout,
    },
    style: {
      ...baseConfig.style,
      ...override.config.style,
    },
  };
}
```

## 6. Hook de Breakpoint

```typescript
// hooks/useBreakpoint.ts
import { useState, useEffect } from 'react';

export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}
```

## 7. HomePage Dinâmica

```typescript
// components/pages/DynamicHomePage.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PageRenderer } from '@/components/cms/PageRenderer';
import { Header, Footer, MenuOverlay, SupportModal, FloatingButton } from '@/components/global-blocks';

export function DynamicHomePage() {
  const [page, setPage] = useState(null);
  const [globalBlocks, setGlobalBlocks] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // Fetch page
      const { data: pageData } = await supabase
        .from('pages')
        .select(`
          *,
          sections:page_sections(
            *,
            template:section_templates(*),
            variant:section_variants(*),
            items:section_items(*),
            breakpoint_overrides:section_breakpoint_overrides(*)
          )
        `)
        .eq('slug', '/')
        .eq('status', 'published')
        .single();

      setPage(pageData);

      // Fetch global blocks
      const { data: blocks } = await supabase
        .from('global_blocks')
        .select('*')
        .eq('visible', true);

      setGlobalBlocks(blocks);
    }

    fetchData();
  }, []);

  if (!page) return <div>Carregando...</div>;

  const headerBlock = globalBlocks.find(b => b.type === 'header');
  const footerBlock = globalBlocks.find(b => b.type === 'footer');

  return (
    <div className="min-h-screen bg-background">
      {headerBlock && (
        <Header
          {...headerBlock.content}
          onMenuToggle={() => setIsMenuOpen(true)}
        />
      )}

      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <FloatingButton onClick={() => setIsSupportOpen(true)} />

      <main>
        <PageRenderer page={page} />
      </main>

      {footerBlock && <Footer {...footerBlock.content} />}
    </div>
  );
}
```

## 8. Design Tokens Runtime

```typescript
// lib/cms/design-token-provider.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function DesignTokenProvider({ children }) {
  useEffect(() => {
    async function loadTokens() {
      // Fetch color palette
      const { data: colors } = await supabase
        .from('palette_colors')
        .select('*, palette:color_palettes!inner(*)')
        .eq('palette.is_default', true);

      // Fetch typography styles
      const { data: typography } = await supabase
        .from('typography_styles')
        .select('*, breakpoints:typography_style_breakpoints(*)');

      // Apply to CSS variables
      const root = document.documentElement;
      
      colors?.forEach(color => {
        root.style.setProperty(`--color-${color.name}`, color.value);
      });

      typography?.forEach(style => {
        root.style.setProperty(`--text-${style.slot}`, style.font_size);
        root.style.setProperty(`--weight-${style.slot}`, style.font_weight);
        root.style.setProperty(`--leading-${style.slot}`, style.line_height);
      });
    }

    loadTokens();
  }, []);

  return <>{children}</>;
}
```

## 9. Admin Page Editor - Save Flow

```typescript
// components/admin/PageEditor.tsx (save action)
async function handleSaveSection(section: PageSection) {
  const { error } = await supabase
    .from('page_sections')
    .update({
      content: section.content,
      config: section.config,
      updated_at: new Date().toISOString(),
    })
    .eq('id', section.id);

  if (!error) {
    toast.success('Seção atualizada com sucesso!');
  }
}

async function handleReorderSections(sections: PageSection[]) {
  const updates = sections.map((section, index) => ({
    id: section.id,
    order_index: index,
  }));

  const { error } = await supabase
    .from('page_sections')
    .upsert(updates);

  if (!error) {
    toast.success('Ordem atualizada!');
  }
}
```

## 10. Media Upload Flow

```typescript
// components/admin/MediaLibrary.tsx (upload)
async function handleUpload(file: File) {
  // 1. Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(`${Date.now()}-${file.name}`, file);

  if (uploadError) {
    toast.error('Erro no upload');
    return;
  }

  // 2. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(uploadData.path);

  // 3. Create asset record
  const { data: asset } = await supabase
    .from('media_assets')
    .insert({
      filename: file.name,
      url: publicUrl,
      mime_type: file.type,
      size: file.size,
    })
    .select()
    .single();

  // 4. Generate variants (thumb, medium, large)
  // This would typically be done by a Supabase Edge Function
  // triggered by the insert above

  toast.success('Upload completo!');
  return asset;
}
```

## Resumo do Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│                        SUPABASE                              │
├─────────────────────────────────────────────────────────────┤
│  pages → page_sections → section_items                      │
│  section_templates → section_variants                       │
│  section_breakpoint_overrides                               │
│  global_blocks                                               │
│  design_tokens, typography_styles                           │
│  media_assets → media_variants                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    FETCH & RESOLVE                          │
├─────────────────────────────────────────────────────────────┤
│  1. Query page + sections + items                           │
│  2. Resolve breakpoint overrides                            │
│  3. Apply design tokens                                     │
│  4. Match templates to components                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                  PAGE RENDERER                              │
├─────────────────────────────────────────────────────────────┤
│  for each section:                                          │
│    Component = TEMPLATE_REGISTRY[template_slug]             │
│    <Component {...content} config={config} items={items} /> │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                 RENDERED PAGE                               │
├─────────────────────────────────────────────────────────────┤
│  <Header />                                                 │
│  <HeroSection {...} />                                      │
│  <StatsCardsSection {...} />                                │
│  <FeatureShowcaseSection {...} />                           │
│  ...                                                         │
│  <Footer />                                                 │
│  <MenuOverlay />                                            │
│  <SupportModal />                                           │
│  <FloatingButton />                                         │
└─────────────────────────────────────────────────────────────┘
```

Este fluxo demonstra como a arquitetura orientada por schema permite:
- Conteúdo totalmente editável via admin
- Renderização dinâmica baseada em templates
- Breakpoints com overrides granulares
- Design system runtime aplicado
- Zero hardcode na apresentação
