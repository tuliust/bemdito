Crie a estrutura visual e arquitetural de uma plataforma web totalmente responsiva, mobile-first, com CMS visual, painel admin completo e renderização por schema, usando como referência estética principal as telas anexadas.

ARQUIVO DE REFERÊNCIA VISUAL ANEXADO
As referências visuais estarão anexadas em um PDF, contendo versões mobile e desktop das seções e blocos globais que devem orientar a direção estética, proporções, espaçamento, tipografia, overlays, cards, CTAs e comportamento visual da interface.

Dentro desse PDF, as referências estão organizadas pelos seguintes títulos:
- 01-support-modal-global
- 02-hero-section
- 03-stats-cards-section
- 04-feature-showcase-analytics-dashboard
- 05-feature-showcase-wellness-routine
- 06-icon-feature-list-section
- 07-logo-marquee-section
- 08-single-feature-promo-section
- 09-newsletter-capture-section
- 10-featured-article-section
- 11-testimonials-section
- 12-awards-section
- 13-faq-section
- 14-closing-cta-section
- 15-footer-global
- 16-menu-overlay-global-open

CONTEXTO DE ESCOPO
Este projeto já possui uma arquitetura-base formalizada, orientada por configuração, templates, variantes, seções, items, blocos globais, tokens e Supabase. Além disso, novas referências visuais foram anexadas posteriormente para refinar a composição da home, do footer, do menu overlay e do modal do botão flutuante.

OVERRIDE DE ESCOPO DA HOME
Considere que:
- os templates oficiais do sistema continuam incluindo lead_capture_section e awards_section
- awards_section permanece como template oficial do sistema, mas deixa de ser obrigatório na composição inicial atual da home
- lead_capture_section continua existindo como template reutilizável no sistema
- a composição inicial atualizada da home passa a incorporar closing_cta_section e newsletter_capture_section como blocos finais prioritários, com base nas novas referências visuais

OBJETIVO CENTRAL
Quero um sistema que nasça como plataforma expansível, não como site fixo com admin acoplado depois. A home inicial é apenas o primeiro caso de uso. A base deve sustentar:
- novas páginas
- novas áreas
- novos templates
- novas variantes
- novos cards
- novos fluxos
- novos tipos de usuários
- novas integrações
- novos painéis

sem exigir refatoração estrutural no futuro.

A referência visual anexada deve guiar:
- proporções
- espaçamento
- ritmo entre seções
- estilo de cards
- tamanho e impacto tipográfico
- arredondamentos
- aparência dos botões
- composição mobile
- sobreposição de overlays nas imagens
- atmosfera limpa, premium e contemporânea

PRINCÍPIOS OBRIGATÓRIOS
- Zero hardcode funcional ou visual relevante.
- Conteúdo, estilos e comportamento relevantes devem ser controláveis por banco/admin.
- O sistema deve ser orientado por templates, variantes, seções, cards, tokens e configurações por breakpoint.
- A home não pode ser tratada como página fixa.
- O admin não pode ser um CRUD textual simples.
- O sistema deve nascer preparado para área pública, admin, empresa e profissional.
- Responsividade nativa para mobile, tablet e desktop.
- Estrutura preparada para Supabase.
- Integração futura prevista com GitHub + Vercel.

CLÁUSULA OBRIGATÓRIA DE GERENCIAMENTO VIA ADMIN
Todo conteúdo, layout, estilo, tipografia, espaçamento, presets visuais, links, mídias, ícones, comportamento, ordem, visibilidade e configurações por breakpoint que sejam relevantes para a operação do site devem ser gerenciáveis via painel admin e persistidos no banco, preferencialmente por schemas, tokens, presets, slots e configurações estruturadas, evitando hardcode e evitando edição livre irrestrita de CSS.

ESTILO VISUAL A SEGUIR
Use como direção principal o visual das imagens anexadas.

Características obrigatórias:
- estética clean, premium e editorial
- composição mobile-first
- fundo claro levemente acinzentado
- tipografia grande, elegante e de alto impacto
- títulos muito presentes e com quebra de linha bonita
- textos de apoio em cinza suave
- alto contraste entre títulos e fundo
- botões arredondados em formato pill
- CTA principal com fundo azul-marinho profundo
- CTA secundário com fundo claro e borda sutil
- cards muito arredondados
- seções com bastante respiro vertical
- uso de imagens grandes e protagonistas
- overlays sobre imagens com aparência de UI flutuante
- bordas suaves e poucas sombras
- visual tecnológico, confiável e minimalista
- sensação de produto real, não de landing page genérica

PALETA VISUAL INICIAL
- fundo principal: off-white / cinza muito claro
- texto principal: azul-marinho profundo
- texto secundário: cinza médio suave
- botão principal: azul-marinho
- botão secundário: fundo claro com borda cinza clara
- superfícies de cards: cinza muito claro, levemente distinto do fundo
- overlays: translúcidos, claros e suaves
- bordas: cinza claro fino
- poucos acentos de cor

TIPOGRAFIA VISUAL
- headlines muito grandes
- títulos com linhas longas e quebra elegante
- força visual alta, sem parecer pesada
- corpo de texto com ótima legibilidade
- sensação editorial + produto tech premium
- hierarquia muito clara entre heading, subheading, supporting text, label e metadata

STACK ALVO
Considere compatibilidade com:
- Next.js 15+
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Swiper ou Embla
- React Hook Form + Zod
- Supabase
- Vercel
- GitHub

MODELO ESTRUTURAL DO PRODUTO
Trate o sistema como plataforma com estas áreas:
1. Public Web
2. Admin Portal
3. Company Portal
4. Professional Portal
5. Shared Core / Design System / Infra

CAMADAS DA SOLUÇÃO
1. Design System Runtime
2. Shared UX System
3. CMS / Renderer Engine
4. Public Web
5. Admin Portal
6. Company Portal
7. Professional Portal
8. Integrações externas

MODELO DE CONSTRUÇÃO
Quero arquitetura visual orientada por:
- pages
- section_templates
- section_variants
- page_sections
- section_items
- global_blocks
- tokens
- presets
- configurações por breakpoint

Quero:
- estrutura de page builder
- templates registráveis
- variantes registráveis
- conteúdo configurável
- estilo configurável
- comportamento configurável
- preview por dispositivo
- edição visual estruturada por domínio

ROTAS
- Público: /, /:slug, /blog, /blog/:slug, /preview/:pageId
- Admin: /admin, /admin/pages, /admin/pages/:id, /admin/navigation, /admin/footer, /admin/media, /admin/forms, /admin/blog, /admin/testimonials, /admin/awards, /admin/faqs, /admin/design-system, /admin/settings
- Empresa: /empresa/...
- Profissional: /profissional/...

ESTRUTURA CONCEITUAL
A proposta deve ser compatível com:
src/
app/
(public)/
admin/
empresa/
profissional/
api/
components/
foundation/
shared/
cms/
public/
admin/
company/
professional/
features/
auth/
pages/
sections/
navigation/
media/
forms/
blog/
testimonials/
awards/
faq/
design-system/
settings/
companies/
professionals/
projects/
lib/
supabase/
config/
schemas/
resolvers/
services/
utils/
hooks/
types/
constants/

HOME INICIAL ATUALIZADA
Crie:
- 1 header global
- 1 menu overlay global
- 12 seções principais de conteúdo
- 1 botão flutuante global
- 1 modal global de suporte
- 1 footer global

ORDEM FINAL DA HOME ATUALIZADA
1. Header global
2. Menu overlay global
3. Hero
4. Stats cards
5. Feature showcase A
6. Feature showcase B
7. Icon feature list
8. Logo marquee
9. Single feature promo
10. Featured article / blog
11. Testimonials
12. FAQ
13. Closing CTA section
14. Newsletter capture section
15. Footer global
16. Floating support button
17. Support modal global

DIREÇÃO VISUAL DAS SEÇÕES COM BASE NO PDF ANEXADO
- Hero: 02-hero-section
- Stats cards: 03-stats-cards-section
- Feature showcase A: 04-feature-showcase-analytics-dashboard
- Feature showcase B: 05-feature-showcase-wellness-routine
- Icon feature list: 06-icon-feature-list-section
- Logo marquee: 07-logo-marquee-section
- Single feature promo: 08-single-feature-promo-section
- Newsletter capture: 09-newsletter-capture-section
- Featured article: 10-featured-article-section
- Testimonials: 11-testimonials-section
- Awards: 12-awards-section
- FAQ: 13-faq-section
- Closing CTA: 14-closing-cta-section
- Footer: 15-footer-global
- Menu overlay aberto: 16-menu-overlay-global-open
- Support modal: 01-support-modal-global

TEMPLATES OFICIAIS DO SISTEMA
- hero_section
- stats_cards_section
- feature_showcase_section
- icon_feature_list_section
- logo_marquee_section
- lead_capture_section
- newsletter_capture_section
- featured_article_section
- testimonials_section
- awards_section
- faq_section
- closing_cta_section
- menu_overlay
- support_modal
- footer_newsletter_navigation

VARIANTES INICIAIS
- feature_showcase_section.analytics_dashboard
- feature_showcase_section.wellness_routine
- feature_showcase_section.single_feature_promo

DESCRIÇÃO DAS SEÇÕES

SEÇÃO 1 — HERO
Referência no PDF: 02-hero-section
- grande bloco de abertura
- eyebrow acima do título
- título enorme quebrado em várias linhas
- dois CTAs pill lado a lado
- botão principal escuro
- botão secundário claro com borda
- imagem protagonista abaixo
- overlays sobre a mídia simulando pequenos cards de dashboard
- altura muito impactante no mobile
- espaçamento generoso

SEÇÃO 2 — STATS CARDS
Referência no PDF: 03-stats-cards-section
- cards empilhados no mobile
- blocos grandes
- superfície clara
- radius alto
- número em destaque enorme
- texto de apoio abaixo
- aparência institucional premium

SEÇÃO 3 — FEATURE SHOWCASE A
Referência no PDF: 04-feature-showcase-analytics-dashboard
- imagem dominante grande
- overlays translúcidos sobre a imagem
- card inferior com título e benefícios
- benefícios em lista com ícone circular pequeno
- usar item_type para overlays e benefit items

SEÇÃO 4 — FEATURE SHOWCASE B
Referência no PDF: 05-feature-showcase-wellness-routine
- imagem grande com chips e labels flutuantes
- card textual abaixo
- lista de benefícios
- sensação leve
- mesma família estrutural da seção 3 com variante distinta

SEÇÃO 5 — ICON FEATURE LIST
Referência no PDF: 06-icon-feature-list-section
- lista vertical no mobile
- ícone em container quadrado arredondado
- título do item
- descrição curta
- layout respirado
- repetição via section_items

SEÇÃO 6 — LOGO MARQUEE
Referência no PDF: 07-logo-marquee-section
- logos em linha
- movimento opcional
- baixo contraste
- aparência premium e discreta

SEÇÃO 7 — SINGLE FEATURE PROMO
Referência no PDF: 08-single-feature-promo-section
- título forte
- imagem única grande
- benefício principal com ícone/check
- texto descritivo abaixo
- aparência clean e de campanha premium

SEÇÃO 8 — FEATURED ARTICLE / BLOG
Referência no PDF: 10-featured-article-section
- título da seção
- imagem grande
- chip/categoria pill
- título do artigo
- autor
- data
- views
- card grande com radius alto
- aparência editorial premium

SEÇÃO 9 — TESTIMONIALS
Referência no PDF: 11-testimonials-section
- badge ou rating acima
- título grande
- card grande com depoimento
- estrelas
- nome
- subtítulo ou empresa
- controles circulares de navegação
- aparência leve e sofisticada

SEÇÃO 10 — FAQ
Referência no PDF: 13-faq-section
- bloco claro
- itens com excelente espaçamento
- interação suave
- apenas um aberto por vez inicialmente
- visual minimalista e premium

SEÇÃO 11 — CLOSING CTA SECTION
Referência no PDF: 14-closing-cta-section
- título grande e muito forte
- texto de apoio abaixo
- frase final curta de reforço
- CTA principal em formato pill escuro
- imagem grande e arredondada abaixo
- forte respiro vertical

SEÇÃO 12 — NEWSLETTER CAPTURE SECTION
Referência no PDF: 09-newsletter-capture-section
- título curto forte
- texto de apoio em cinza suave
- input pill grande
- botão escuro acoplado ao input
- texto legal abaixo
- visual extremamente limpo
- separadores sutis

SEÇÃO OPCIONAL — AWARDS SECTION
Referência no PDF: 12-awards-section
- deve existir no sistema
- pode ficar fora da composição inicial obrigatória da home
- visual limpo, institucional e coerente com testimonials

BLOCOS GLOBAIS

HEADER GLOBAL
Baseado no topo visto nas referências de hero e desktop do PDF
- logo à esquerda
- botão circular grande de menu à direita
- borda suave
- fundo claro
- sticky
- esconder no scroll down
- reaparecer no scroll up
- padding generoso

MENU OVERLAY GLOBAL
Referência no PDF: 16-menu-overlay-global-open
- tela cheia
- topo com help action
- botão pill de login
- botão circular de fechar
- navegação principal em tipografia muito forte
- links legais inferiores
- seletor de idioma no canto inferior direito
- fundo claro
- animação suave
- composição editorial minimalista

BOTÃO FLUTUANTE GLOBAL
Visto em várias referências do PDF
- canto inferior direito
- circular
- escuro
- sempre visível
- ícone centralizado
- ação principal: abrir modal de suporte

MODAL GLOBAL DE SUPORTE
Referência no PDF: 01-support-modal-global
- overlay escuro suave
- modal grande centralizado
- topo escuro com marca centralizada
- botão de fechar no canto superior direito
- lista vertical de cards internos claros
- cada card com título, descrição curta e seta lateral
- muito espaço em branco abaixo dos cards
- radius alto
- itens iniciais:
  - quiz rápido
  - wellness gifts
  - dúvida / contato

FOOTER GLOBAL
Referência no PDF: 15-footer-global
Estrutura:
1. newsletter no topo
2. divisor horizontal
3. grade de links principais
4. divisor horizontal
5. bloco de ajuda / links legais
6. linha de redes sociais em botões com borda sutil

PAINEL ADMIN
Crie um painel admin completo como CMS visual orientado por domínio.

O admin deve controlar:
- páginas
- templates
- variantes
- seções
- cards
- blocos globais
- navegação
- blog
- depoimentos
- premiações
- FAQs
- formulários
- mídia
- aparência do site
- usuários e permissões
- publicação
- preview responsivo

O admin deve usar:
- linguagem clara em português
- miniaturas
- cards
- seletores visuais
- pickers
- previews
- edição por abas
- experiência amigável

EDIÇÃO DE PÁGINA
Estrutura em 3 colunas:
- esquerda: lista de seções
- centro: editor da seção
- direita: preview ou inspector

Cada seção deve ter abas:
- Conteúdo
- Itens / Cards
- Layout
- Estilo
- Breakpoints
- Comportamento
- Dados vinculados
- Preview

BIBLIOTECA DE MÍDIA
- grid de mídias
- upload
- busca
- filtros
- preview
- crop
- ajuste de proporção
- salvar variações por contexto
- rastrear usos da mídia

DESIGN SYSTEM / APARÊNCIA
Área editável para:
- tokens de cor
- tipografia
- fontes
- presets de botão
- presets de input
- spacing
- border
- radius
- shadow
- opacity
- z-index
- animações
- ícones Lucide com busca, filtro e preview

REGRAS DE CONFIGURAÇÃO
- seletor de cor via tokens
- tipografia por slots
- ajustes por breakpoint
- botões e inputs por preset
- animações discretas
- ícones organizados por tema
- tudo preparado para edição sem código

SUPABASE — COMPATIBILIDADE ESTRUTURAL
A proposta visual precisa ser compatível com entidades como:
- sites
- site_settings
- pages
- section_templates
- section_variants
- page_sections
- section_breakpoint_overrides
- section_items
- section_item_breakpoint_overrides
- navigation_menus
- navigation_items
- global_blocks
- header_configs
- footer_configs
- support_modal_configs
- floating_button_configs
- design_tokens
- color_palettes
- palette_colors
- font_families
- typography_styles
- typography_style_breakpoints
- button_presets
- input_presets
- animation_presets
- media_folders
- media_assets
- media_variants
- media_usage
- forms
- form_fields
- form_submissions
- leads
- blog_posts
- testimonials
- awards
- faq_groups
- faq_items
- roles
- permissions
- audit_logs

RESPONSIVIDADE
- mobile como prioridade absoluta
- tablet como expansão natural
- desktop como continuidade editável
- visualização por breakpoint
- override por dispositivo
- layout, estilo, mídia, ordem, tipografia e visibilidade editáveis por breakpoint

PADRÕES GLOBAIS
- modais fecham ao clicar fora
- se houver alteração não salva, pedir confirmação
- formulários com feedback visual
- checkbox e consentimentos claros
- drag and drop para ordenação
- preview responsivo real

RESULTADO ESPERADO
Gere:
1. Arquitetura visual do produto
2. Estrutura da home inicial atualizada
3. Estrutura completa do painel admin
4. Estrutura do design system
5. Estrutura da mídia
6. Estrutura dos templates e variantes
7. Fluxo de edição das páginas, seções, itens e blocos globais
8. Organização preparada para Supabase e evolução futura
9. Sistema coerente com a referência visual enviada
10. Um produto com cara de sistema real, premium, modular e pronto para implementação

IMPORTANTE
- Use o PDF anexado como referência visual principal.
- Não copie literalmente a marca ou o conteúdo da referência.
- Traduza a referência em um sistema administrável e expansível.
- Priorize fidelidade visual às referências mobile e desktop, mas sempre traduza cada bloco em estrutura administrável por CMS, com templates, variantes, tokens, blocos globais e edição por breakpoint.