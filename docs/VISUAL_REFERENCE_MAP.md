# Mapa Visual de Referências

Este documento mapeia cada seção criada com sua referência visual correspondente do PDF.

## Referências do PDF

As referências visuais estão organizadas em 16 blocos no PDF:
- 01 a 16: Seções e blocos globais

## Mapeamento Completo

### Blocos Globais

| # | Nome do PDF | Componente | Arquivo | Descrição |
|---|-------------|------------|---------|-----------|
| 01 | support-modal-global | SupportModal | `components/global-blocks/SupportModal.tsx` | Modal centralizado com opções de ajuda |
| 15 | footer-global | Footer | `components/global-blocks/Footer.tsx` | Footer com newsletter, links, social |
| 16 | menu-overlay-global-open | MenuOverlay | `components/global-blocks/MenuOverlay.tsx` | Menu full-screen com navegação tipográfica |
| - | header (visto em hero) | Header | `components/global-blocks/Header.tsx` | Header sticky com logo e menu button |
| - | floating button | FloatingButton | `components/global-blocks/FloatingButton.tsx` | Botão circular fixo inferior direito |

### Seções de Conteúdo

| # | Nome do PDF | Componente | Arquivo | Ordem na Home |
|---|-------------|------------|---------|---------------|
| 02 | hero-section | HeroSection | `components/sections/HeroSection.tsx` | 1 |
| 03 | stats-cards-section | StatsCardsSection | `components/sections/StatsCardsSection.tsx` | 2 |
| 04 | feature-showcase-analytics-dashboard | FeatureShowcaseSection (variant A) | `components/sections/FeatureShowcaseSection.tsx` | 3 |
| 05 | feature-showcase-wellness-routine | FeatureShowcaseSection (variant B) | `components/sections/FeatureShowcaseSection.tsx` | 4 |
| 06 | icon-feature-list-section | IconFeatureListSection | `components/sections/IconFeatureListSection.tsx` | 5 |
| 07 | logo-marquee-section | LogoMarqueeSection | `components/sections/LogoMarqueeSection.tsx` | 6 |
| 08 | single-feature-promo-section | FeatureShowcaseSection (variant C) | `components/sections/FeatureShowcaseSection.tsx` | 7 |
| 09 | newsletter-capture-section | NewsletterCaptureSection | `components/sections/NewsletterCaptureSection.tsx` | 12 |
| 10 | featured-article-section | FeaturedArticleSection | `components/sections/FeaturedArticleSection.tsx` | 8 |
| 11 | testimonials-section | TestimonialsSection | `components/sections/TestimonialsSection.tsx` | 9 |
| 12 | awards-section | AwardsSection | (template exists, not in home) | - |
| 13 | faq-section | FAQSection | `components/sections/FAQSection.tsx` | 10 |
| 14 | closing-cta-section | ClosingCTASection | `components/sections/ClosingCTASection.tsx` | 11 |

## Ordem Final da Home

```
┌──────────────────────────────────────────┐
│         Header Global (sticky)           │
├──────────────────────────────────────────┤
│                                          │
│  1. Hero Section (02)                    │
│     - Eyebrow                            │
│     - Título gigante                     │
│     - 2 CTAs pill                        │
│     - Imagem + overlays                  │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  2. Stats Cards (03)                     │
│     - 3 cards grandes                    │
│     - Número + label + descrição         │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  3. Feature Showcase A (04)              │
│     - Imagem grande                      │
│     - Overlays analytics                 │
│     - Card benefícios                    │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  4. Feature Showcase B (05)              │
│     - Imagem grande                      │
│     - Chips flutuantes                   │
│     - Card benefícios                    │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  5. Icon Feature List (06)               │
│     - Lista vertical                     │
│     - Ícone + título + descrição         │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  6. Logo Marquee (07)                    │
│     - Logos em linha                     │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  7. Single Feature Promo (08)            │
│     - Título forte                       │
│     - Imagem única grande                │
│     - Benefício principal                │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  8. Featured Article (10)                │
│     - Card grande                        │
│     - Imagem + categoria                 │
│     - Autor + data + views               │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  9. Testimonials (11)                    │
│     - Badge/rating                       │
│     - Card depoimento                    │
│     - Estrelas + autor                   │
│     - Navegação circular                 │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  10. FAQ (13)                            │
│     - Accordion                          │
│     - Um aberto por vez                  │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  11. Closing CTA (14)                    │
│      - Título forte                      │
│      - Descrição + tagline               │
│      - CTA pill                          │
│      - Imagem grande arredondada         │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  12. Newsletter Capture (09)             │
│      - Título curto                      │
│      - Input pill + botão                │
│      - Texto legal                       │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│         Footer Global (15)               │
│         - Newsletter                     │
│         - Links grid                     │
│         - Legal links                    │
│         - Social icons                   │
│                                          │
└──────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  Menu Overlay (16)                     │
│  - Tela cheia quando aberto            │
│  - Navegação grande tipográfica        │
│  - Help + Login no topo                │
│  - Legais + idioma no rodapé           │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  Support Modal (01)                    │
│  - Overlay escuro                      │
│  - Modal centralizado                  │
│  - Topo escuro com marca               │
│  - Cards de opções de ajuda            │
└────────────────────────────────────────┘

        ┌──────────┐
        │ Floating │
        │  Button  │
        │   (help) │
        └──────────┘
        Canto inferior direito
```

## Características Visuais Principais

### Tipografia
- **Display**: Títulos muito grandes (4.5rem desktop, 3rem mobile)
- **Hierarquia**: Clara entre heading, subheading, body, supporting
- **Quebras**: Linhas longas com quebra elegante
- **Peso**: Bold para títulos, regular para corpo

### Cores
- **Primary**: `#0a1628` (azul-marinho profundo)
- **Background**: `#f8f9fa` (off-white)
- **Muted**: `#6b7280` (textos de apoio)
- **Cards**: `#ffffff` (branco puro)
- **Borders**: `#e5e7eb` (cinza claro)

### Espaçamento
- **Section vertical**: 5rem desktop, 3rem mobile
- **Card padding**: 3rem (XL)
- **Gap entre elementos**: generoso (1.5-2rem)
- **Container padding**: 2rem mobile, 3rem desktop

### Arredondamentos
- **Cards**: 3rem (rounded-3xl)
- **Buttons pill**: 9999px (totalmente redondo)
- **Inputs pill**: 9999px
- **Imagens**: 1.5-3rem dependendo do contexto

### Animações
- **Entrance**: fade-up com delay sequencial
- **Scroll**: opacity + translate Y
- **Hover**: scale 1.05, sombra aumenta
- **Transitions**: 0.3-0.6s com easing custom

### Shadows
- **Cards**: shadow-lg com opacity baixa
- **Elevated**: shadow-2xl
- **Floating**: shadow-xl
- **Subtileza**: sempre black/5 ou black/10

## Breakpoint Behavior

### Mobile (< 768px)
- **Layout**: Pilhas verticais
- **Typography**: Reduzida (3rem headings)
- **Spacing**: Reduzido (3rem sections)
- **Cards**: Full width menos padding
- **Images**: Aspect ratios mantidos
- **CTAs**: Stack vertical

### Tablet (768px - 1024px)
- **Layout**: 2 colunas onde faz sentido
- **Typography**: Intermediária
- **Spacing**: Intermediário
- **Cards**: Grid 2 colunas
- **Images**: Maiores
- **CTAs**: Lado a lado

### Desktop (> 1024px)
- **Layout**: 3-4 colunas
- **Typography**: Full scale (4.5rem)
- **Spacing**: Full (5rem sections)
- **Cards**: Grid completo
- **Images**: Hero size
- **CTAs**: Lado a lado com generoso gap

## Templates e Variantes no Banco

```sql
-- Templates
hero_section
stats_cards_section
feature_showcase_section
icon_feature_list_section
logo_marquee_section
newsletter_capture_section
featured_article_section
testimonials_section
awards_section
faq_section
closing_cta_section

-- Variantes
feature_showcase_section.analytics_dashboard  (04)
feature_showcase_section.wellness_routine     (05)
feature_showcase_section.single_feature_promo (08)
```

## Blocos Globais no Banco

```sql
header              (visto em hero/desktop)
footer              (15)
menu_overlay        (16)
support_modal       (01)
floating_button     (visto em várias refs)
```

## Admin Areas Correspondentes

### Page Editor
- Lista esquerda: Todas as seções ordenadas
- Centro: Tabs de edição (Conteúdo, Itens, Layout, Estilo, Breakpoints)
- Direita: Preview + Inspector

### Media Library
- Grid/List toggle
- Upload, folders
- Usage tracking

### Design System Editor
- Cores: Paleta editável
- Tipografia: Slots semânticos
- Componentes: Presets
- Ícones: Biblioteca Lucide

### Outras Áreas
- Navegação
- Blog
- Depoimentos
- Premiações
- FAQ
- Formulários
- Usuários

---

Este mapa permite correlacionar cada componente implementado com sua referência visual original, garantindo fidelidade ao design especificado.
