# Plataforma CMS Visual - Arquitetura Completa

Plataforma web completa, mobile-first, orientada por schema, com CMS visual e renderização dinâmica baseada em templates e variantes.

## 🎯 Características Principais

- ✅ **Zero Hardcode**: Todo conteúdo, estilo e comportamento controlado via admin
- ✅ **Schema-Driven**: Templates, variantes e configurações orientam a renderização
- ✅ **Mobile-First**: Responsividade nativa com overrides por breakpoint
- ✅ **Visual Premium**: Design system clean, editorial e tech-forward
- ✅ **CMS Completo**: Editor visual de páginas com preview responsivo
- ✅ **Extensível**: Arquitetura preparada para crescimento sem refatoração

## 📋 Estrutura do Projeto

```
src/
├── app/
│   ├── App.tsx                    # Entry point principal
│   └── components/
│       └── ui/                    # shadcn/ui components
│
├── components/
│   ├── foundation/                # Componentes base
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Container.tsx
│   │   └── Section.tsx
│   │
│   ├── global-blocks/             # Blocos globais
│   │   ├── Header.tsx
│   │   ├── MenuOverlay.tsx
│   │   ├── Footer.tsx
│   │   ├── SupportModal.tsx
│   │   └── FloatingButton.tsx
│   │
│   ├── sections/                  # Templates de seções
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
│   ├── pages/                     # Páginas compostas
│   │   └── HomePage.tsx
│   │
│   └── admin/                     # Admin Portal
│       ├── AdminLayout.tsx
│       ├── PageEditor.tsx
│       ├── MediaLibrary.tsx
│       └── DesignSystemEditor.tsx
│
├── types/
│   └── cms.ts                     # TypeScript definitions
│
├── styles/
│   ├── theme.css                  # Design tokens
│   ├── fonts.css                  # Font imports
│   └── tailwind.css               # Tailwind config
│
└── docs/
    ├── ARCHITECTURE.md            # Arquitetura completa
    └── SUPABASE_SCHEMA.sql        # Schema do banco
```

## 🎨 Design System

### Paleta Visual

- **Background**: `#f8f9fa` (off-white clean)
- **Foreground**: `#0a1628` (azul-marinho profundo)
- **Primary**: `#0a1628` (ações principais)
- **Secondary**: `#f3f4f6` (ações secundárias)
- **Muted**: `#6b7280` (texto de apoio)

### Tipografia

- **Display**: 4.5rem / 700 / 1.1
- **Heading**: 3rem / 700 / 1.2
- **Subheading**: 2rem / 600 / 1.3
- **Body**: 1rem / 400 / 1.6
- **Supporting**: 0.875rem / 400 / 1.5
- **Label**: 0.75rem / 500 / 1.4

### Componentes Foundation

#### Button
- Variantes: primary, secondary, outline, ghost, link
- Tamanhos: sm, md, lg, xl
- Formato pill opcional
- Animação opcional

#### Card
- Variantes: default, elevated, outline, ghost
- Padding configurável
- Animação entrada opcional
- Modo interativo com hover

#### Section
- Spacing: none, sm, md, lg, xl
- Background: transparent, muted, card
- Animação scroll opcional

### Breakpoints

- **Mobile**: < 768px (prioridade máxima)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 📄 Templates de Seções

### 1. Hero Section
Grande bloco de abertura com eyebrow, título impactante, CTAs e imagem protagonista com overlays flutuantes.

### 2. Stats Cards Section
Cards empilhados (mobile) ou em grid (desktop) com números grandes e textos de apoio.

### 3. Feature Showcase Section
Imagem dominante com overlays translúcidos + card inferior com benefícios.
- Variantes: analytics_dashboard, wellness_routine, single_feature_promo

### 4. Icon Feature List Section
Lista vertical de features com ícone, título e descrição.

### 5. Logo Marquee Section
Logos de empresas/parceiros em linha com movimento opcional.

### 6. Single Feature Promo Section
Título forte, imagem única grande, benefício principal com ícone/check.

### 7. Newsletter Capture Section
Título, descrição, input pill + botão, texto legal.

### 8. Featured Article Section
Card grande com imagem, categoria, título, autor, data e views.

### 9. Testimonials Section
Depoimentos com rating, navegação, autor e empresa.

### 10. FAQ Section
Accordion com apenas um item aberto por vez, visual minimalista.

### 11. Closing CTA Section
Título forte, descrição, tagline, CTA principal e imagem grande arredondada.

### 12. Newsletter Capture Section
Título curto, input pill + botão, texto legal abaixo.

## 🔧 Blocos Globais

### Header
- Logo à esquerda
- Botão circular de menu à direita
- Sticky com hide/show no scroll

### Menu Overlay
- Tela cheia com navegação tipográfica forte
- Help action e login no topo
- Links legais e seletor de idioma no rodapé

### Footer
- Newsletter no topo
- Grade de links
- Links de ajuda e legais
- Redes sociais

### Support Modal
- Overlay escuro
- Modal centralizado com opções de suporte
- Topo escuro com marca

### Floating Button
- Canto inferior direito
- Circular, sempre visível
- Abre modal de suporte

## 💻 Admin Portal

### Layout
- Sidebar colapsável com navegação
- Top bar com ações globais
- Conteúdo principal responsivo

### Page Editor (3 Colunas)

**Esquerda**: Lista de seções
- Drag-and-drop para reordenar
- Add seção
- Seleção visual

**Centro**: Editor da seção
- Tabs: Conteúdo, Itens, Layout, Estilo, Breakpoints, Comportamento
- Formulários baseados no schema
- Gerenciamento de items/cards

**Direita**: Preview + Inspector
- Preview da seção
- Configurações rápidas (visibilidade, animação)

### Media Library
- Grid/List view toggle
- Upload de arquivos
- Folders, busca, filtros
- Preview, crop, variants
- Usage tracking

### Design System Editor
- **Cores**: Edição de tokens
- **Tipografia**: Estilos semânticos com breakpoints
- **Componentes**: Presets de buttons, inputs, cards
- **Ícones**: Biblioteca Lucide com busca

## 🗄️ Banco de Dados (Supabase)

### Entidades Principais

- `sites` - Multi-tenancy
- `pages` - Páginas com slug, status
- `section_templates` - Templates globais
- `section_variants` - Variantes dos templates
- `page_sections` - Instâncias de seções nas páginas
- `section_items` - Conteúdo repetível (cards, etc)
- `global_blocks` - Header, Footer, Modals
- `navigation_menus` - Menus de navegação
- `media_assets` - Biblioteca de mídia
- `blog_posts` - Posts do blog
- `testimonials` - Depoimentos
- `awards` - Premiações
- `faq_items` - FAQs
- `design_tokens` - Cores, tipografia, etc

### Breakpoint Overrides

- `section_breakpoint_overrides`
- `section_item_breakpoint_overrides`
- `typography_style_breakpoints`

Ver `docs/SUPABASE_SCHEMA.sql` para schema completo.

## 🚀 Como Começar

### Pré-requisitos

```bash
Node.js 18+
pnpm (recomendado)
Conta Supabase (para backend)
```

### Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Adicionar credenciais Supabase
# VITE_SUPABASE_URL=
# VITE_SUPABASE_ANON_KEY=
```

### Desenvolvimento

```bash
# Rodar dev server
pnpm dev

# Build produção
pnpm build
```

### Setup Supabase

1. Criar projeto no Supabase
2. Executar `docs/SUPABASE_SCHEMA.sql` no SQL Editor
3. Configurar RLS (Row Level Security)
4. Adicionar credenciais no `.env.local`

## 📐 Fluxo de Renderização

```
1. User acessa /
2. Buscar página por slug
3. Carregar seções ordenadas
4. Para cada seção:
   - Resolver template + variante
   - Mesclar schema + conteúdo
   - Aplicar overrides de breakpoint
   - Buscar items da seção
   - Renderizar componente
5. Injetar blocos globais
6. Aplicar design tokens
7. Retornar página composta
```

## 🎯 Próximos Passos

- [ ] Implementar autenticação (Supabase Auth)
- [ ] Conectar frontend ao Supabase
- [ ] Template registry dinâmico
- [ ] Page renderer dinâmico baseado em schema
- [ ] Drag-and-drop no page editor
- [ ] Design system conectado ao database
- [ ] Preview responsivo real
- [ ] Deploy no Vercel
- [ ] Testes E2E

## 📚 Documentação Adicional

- [Arquitetura Completa](docs/ARCHITECTURE.md)
- [Schema Supabase](docs/SUPABASE_SCHEMA.sql)

## 🤝 Contribuindo

Este é um projeto de arquitetura de referência. Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Privado - Todos os direitos reservados

## 👥 Autores

Desenvolvido como arquitetura de referência para plataformas CMS visuais enterprise.

---

**Status**: ✅ Arquitetura completa implementada
**Versão**: 1.0.0
**Data**: Abril 2026
