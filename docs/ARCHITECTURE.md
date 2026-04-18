# Arquitetura da Plataforma CMS

## Visão Geral

Plataforma web completa, mobile-first, orientada por schema, com CMS visual e renderização dinâmica baseada em templates e variantes.

## Princípios Fundamentais

1. **Zero Hardcode**: Todo conteúdo, estilo e comportamento relevante é controlado via banco/admin
2. **Schema-Driven**: Templates, variantes e configurações orientam a renderização
3. **Breakpoint-First**: Configurações específicas por dispositivo (mobile, tablet, desktop)
4. **Extensível**: Sistema preparado para crescer sem refatoração estrutural

## Camadas da Solução

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  Public Web  │  Admin Portal  │  Company  │  Professional      │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     CMS / RENDERER ENGINE                       │
├─────────────────────────────────────────────────────────────────┤
│  • Template Registry                                            │
│  • Variant Resolution                                           │
│  • Breakpoint Overrides                                         │
│  • Dynamic Rendering                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     SHARED UX SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│  • Global Blocks (Header, Footer, Modals)                      │
│  • Section Templates (Hero, Stats, Features, etc)              │
│  • Foundation Components (Button, Card, Input)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     DESIGN SYSTEM RUNTIME                       │
├─────────────────────────────────────────────────────────────────┤
│  • Tokens (Colors, Typography, Spacing)                        │
│  • Presets (Buttons, Inputs, Animations)                       │
│  • Theme Provider                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  Supabase (PostgreSQL + Auth + Storage)                        │
└─────────────────────────────────────────────────────────────────┘
```

## Modelo de Dados

### Core Entities

#### Sites
- Multi-tenancy base
- Cada site tem suas próprias configurações, páginas, mídia

#### Pages
- Compostas por seções ordenadas
- Status: draft, published, archived
- SEO metadata

#### Section Templates
- Registros globais de templates disponíveis
- Schema define estrutura de conteúdo
- Exemplos: hero_section, stats_cards_section, testimonials_section

#### Section Variants
- Variações de um template
- Herdam schema base com overrides
- Exemplos: feature_showcase.analytics_dashboard, feature_showcase.wellness_routine

#### Page Sections
- Instância de um template/variante em uma página
- Content: dados específicos (título, descrição, CTAs)
- Config: layout, estilo, comportamento
- Breakpoint overrides: ajustes por dispositivo

#### Section Items
- Conteúdo repetível dentro de seções
- Exemplos: cards em stats, benefícios em features, FAQs
- Também suportam breakpoint overrides

### Global Blocks

#### Header, Footer, Menu Overlay, Support Modal, Floating Button
- Blocos reutilizáveis entre páginas
- Configuração centralizada
- Posição e visibilidade controladas

### Design System

#### Color Palettes
- Múltiplas paletas por site
- Roles: primary, secondary, accent, neutral, semantic

#### Typography Styles
- Slots semânticos: display, heading, subheading, body, supporting, label
- Breakpoint-specific overrides

#### Component Presets
- Buttons: variants (primary, secondary), sizes, estilos
- Inputs: variants (pill, default), validações
- Animations: entrance, exit, hover, scroll

### Content Management

#### Blog Posts
- Título, conteúdo, categoria
- Featured image, author
- Views tracking

#### Testimonials
- Nome, empresa, cargo
- Rating, avatar
- Featured flag, ordering

#### Awards
- Organização, ano, logo
- Ordenável

#### FAQs
- Agrupados
- Ordenáveis

### Media Library

#### Media Assets
- Upload, folders
- Variants (crops, formatos)
- Usage tracking (onde a mídia é usada)

## Fluxo de Renderização

```
1. User requests page → /
2. Fetch page by slug
3. Load page sections (ordered)
4. For each section:
   a. Resolve template + variant
   b. Merge schema + content
   c. Apply breakpoint overrides
   d. Fetch section items
   e. Render component
5. Inject global blocks (header, footer, modals)
6. Apply design tokens from database
7. Return composed page
```

## Admin CMS

### Page Editor

**3-Column Layout**:
- **Left**: Lista de seções (drag-and-drop ordering)
- **Center**: Editor da seção selecionada (tabs: Conteúdo, Itens, Layout, Estilo, Breakpoints, Comportamento)
- **Right**: Preview + Inspector

### Tabs do Section Editor

1. **Conteúdo**: Campos baseados no schema (título, descrição, CTAs)
2. **Itens**: Gerenciar cards/items dentro da seção
3. **Layout**: Container size, alignment, spacing
4. **Estilo**: Background, cores, borders, shadows
5. **Breakpoints**: Overrides por mobile/tablet/desktop
6. **Comportamento**: Animações, sticky, parallax

### Media Library

- Grid/List view
- Upload, folders
- Search, filters
- Crop, variants
- Usage tracking

### Design System Editor

- **Cores**: Paleta editável, tokens nomeados
- **Tipografia**: Slots semânticos, font families, weights, sizes
- **Componentes**: Presets de buttons, inputs, cards
- **Ícones**: Biblioteca Lucide com busca e preview

### Outras Áreas do Admin

- **Navegação**: Menus primary, footer, mobile, legal
- **Blog**: CRUD de posts, categorias
- **Depoimentos**: Gerenciar testimonials
- **Premiações**: CRUD de awards
- **FAQ**: Grupos e itens
- **Formulários**: Builder visual, submissions
- **Usuários**: Roles, permissões

## Stack Técnico

### Frontend
- React 18+
- TypeScript
- Tailwind CSS v4
- Motion (Framer Motion)
- Lucide React (icons)
- React Hook Form + Zod
- shadcn/ui components

### Backend
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Realtime subscriptions
- Storage para mídia

### Deployment
- Vercel (frontend)
- Supabase Cloud (backend)
- GitHub Actions (CI/CD)

## Responsividade

### Breakpoints
- **Mobile**: < 768px (prioridade)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Override System
- Cada seção/item pode ter config específica por breakpoint
- Campos override: layout, style, visibility, order, typography, media

## Extensibilidade Futura

### Novos Templates
1. Criar entrada em `section_templates`
2. Definir schema
3. Criar componente React correspondente
4. Registrar no template registry
5. Disponível no admin imediatamente

### Novas Variantes
1. Criar entrada em `section_variants` linkada ao template
2. Definir schema overrides
3. Ajustar componente React para suportar variante
4. Disponível para uso

### Novos Breakpoints
- Adicionar ao enum
- Sistema automaticamente oferece override UI

### Novas Áreas (Company, Professional)
- Compartilham design system
- Compartilham foundation components
- Podem ter templates específicos
- RLS do Supabase controla acesso

## Performance

### Otimizações
- Lazy loading de seções
- Image optimization (variants)
- Prefetch de dados críticos
- Cache de templates/variants
- Memoization de componentes pesados

### Métricas
- Lighthouse score > 90
- FCP < 1.5s
- LCP < 2.5s
- CLS < 0.1

## Segurança

- RLS no Supabase
- Validação de schemas (Zod)
- Sanitização de inputs
- LGPD compliance
- Audit logs de mudanças críticas
- 2FA para admin

## Testes

- Unit: Foundation components, utils
- Integration: Template rendering, data fetching
- E2E: Admin workflows, public page rendering
- Visual regression: Seções renderizadas

## Próximos Passos

1. Implementar autenticação (Supabase Auth)
2. Conectar frontend ao Supabase (client setup)
3. Implementar template registry dinâmico
4. Criar page renderer dinâmico
5. Implementar drag-and-drop no page editor
6. Conectar design system ao database
7. Implementar preview responsivo real
8. Deploy inicial no Vercel
9. Testes com usuários reais
10. Iterar baseado em feedback
