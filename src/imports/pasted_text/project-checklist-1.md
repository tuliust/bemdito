Checklist geral do projeto
Etapa 0 — Alinhamento estratégico

Antes dos prompts, estes pontos precisavam estar fechados.

 Definir que o projeto é uma plataforma expansível, não um site fixo.
 Definir Supabase como base principal de dados.
 Definir arquitetura multiárea:
 Public Web
 Admin Portal
 Company Portal
 Professional Portal
 Shared Core
 Definir que tudo relevante deve ser gerenciável via admin.
 Definir que o sistema será schema-driven.
 Consolidar a linguagem visual:
 clean
 premium
 editorial
 mobile-first
 Consolidar referências visuais mobile.
 Consolidar referências visuais desktop.
 Gerar PDF de referência visual consolidado.
Prompt 1 — Estrutura visual e arquitetural
Objetivo do Prompt 1

Definir:

arquitetura do produto
estrutura da home
templates
variantes
blocos globais
direção visual
estrutura do admin
compatibilidade com Supabase
Checklist do Prompt 1
Escopo e arquitetura
 O projeto foi tratado como plataforma expansível.
 O sistema foi definido como modular e escalável.
 A arquitetura contemplou:
 Public Web
 Admin Portal
 Company Portal
 Professional Portal
 Shared Core / Design System / Infra
 O sistema foi definido como orientado por:
 pages
 section_templates
 section_variants
 page_sections
 section_items
 global_blocks
 tokens
 presets
 breakpoint overrides
Referência visual
 O PDF de referências mobile + desktop foi definido como fonte oficial.
 O mapeamento visual das seções foi fechado.
 O estilo visual foi especificado:
 tipografia grande
 navy + off-white
 CTAs pill
 cards arredondados
 overlays suaves
 visual premium
Home final validada
 A home foi consolidada com 12 seções principais de conteúdo.
 Editorial intro foi removida.
 editorial_content_section foi removido da home atual.
 A ordem final da home foi fechada:
 Hero
 Stats cards
 Feature showcase A
 Feature showcase B
 Icon feature list
 Logo marquee
 Single feature promo
 Featured article / blog
 Testimonials
 FAQ
 Closing CTA section
 Newsletter capture section
Templates oficiais
 Lista oficial de templates foi fechada:
 hero_section
 stats_cards_section
 feature_showcase_section
 icon_feature_list_section
 logo_marquee_section
 lead_capture_section
 newsletter_capture_section
 featured_article_section
 testimonials_section
 awards_section
 faq_section
 closing_cta_section
 menu_overlay
 support_modal
 footer_newsletter_navigation
Templates fora da home inicial
 lead_capture_section permanece no sistema, fora da home atual.
 awards_section permanece no sistema, opcional, fora da home atual.
Variantes
 feature_showcase_section.analytics_dashboard
 feature_showcase_section.wellness_routine
 feature_showcase_section.single_feature_promo
Blocos globais
 Header global
 Menu overlay global
 Footer global
 Floating support button
 Support modal global
Admin — definição macro
 O admin foi definido como CMS visual orientado por domínio.
 O admin deve controlar:
 páginas
 templates
 variantes
 seções
 cards/items
 blocos globais
 navegação
 blog
 depoimentos
 premiações
 FAQs
 formulários
 mídia
 aparência do site
 usuários e permissões
 publicação
 preview responsivo
Regra obrigatória de gerenciamento
 Ficou explícito que devem ser gerenciáveis via admin:
 conteúdo
 layout
 estilo
 tipografia
 espaçamento
 links
 mídias
 ícones
 comportamento
 ordem
 visibilidade
 breakpoints
Prompt 2 — Fundação do código
Objetivo do Prompt 2

Criar a fundação técnica:

estrutura de pastas
layouts
rotas
types
schema contracts
registries
resolvers
renderers
Supabase integration
shared UX
base do admin
Checklist do Prompt 2
Estrutura do projeto
 Estrutura de pastas criada.
 Camadas organizadas:
 foundation
 shared
 cms
 public
 admin
 company
 professional
Supabase
 client.ts
 server.ts adaptado
 types.ts placeholder
 integração preparada para ambiente real
CMS Engine
 Template registry
 Variant registry
 Breakpoint resolver
 Content resolver
 PageRenderer
 SectionRenderer
 GlobalBlockRenderer
Hooks
 use-breakpoint
 use-unsaved-changes
Shared UX System
 BaseModal
 Confirm modal
 Empty state
 Loading state
 Device preview switcher
Layouts e rotas
 Public layout
 Admin layout
 Company layout
 Professional layout
 Rotas públicas preparadas
 Rotas admin preparadas
 Estrutura inicial de /empresa
 Estrutura inicial de /profissional
Templates conectados à home atual
 home atual validada suportada com 12 seções
 single_feature_promo corretamente incluído
 lead_capture_section mantido na arquitetura
 awards_section mantido na arquitetura
Estado do Prompt 2
 Fundação técnica fechada
 Pronta para etapa dinâmica/operacional
Prompt 3 — Home dinâmica + camada de dados
Objetivo do Prompt 3

Implementar:

schema SQL
seed data
services layer
home dinâmica
renderização real via Supabase
blocos globais funcionais
Checklist do Prompt 3
Banco e seed
 database-schema.sql criado
 database-seed.sql criado
 schema com 40+ tabelas
 seed com home + global blocks
 seed corrigida (database-seed-fixed.sql) executada com sucesso
 validação:
 sites = 1
 home = 1
 sections = 12
Home dinâmica
 Home carrega dados do Supabase
 Home renderiza 12 seções
 Ordem correta das seções
 Global blocks conectados
 Renderer adaptado para estrutura do banco
Services layer
 pages-service
 sections-service
 global-blocks-service
 templates-service
Blocos globais
 Header
 Footer
 Menu overlay
 Support modal
 Floating button
Templates fora da home
 lead_capture_section continua previsto
 awards_section continua previsto
Estado do Prompt 3
 Home dinâmica funcionando
 Banco e seed prontos
 Renderer conectado
 Base pronta para admin funcional
Prompt 4 — Admin CMS funcional
Objetivo do Prompt 4

Implementar:

routing real do admin
lista de páginas
editor de página
CRUD de seções
CRUD de items
global blocks editor
media library
design system editor
pickers
preview responsivo
persistência no Supabase
Checklist do Prompt 4
Navegação do admin
 React Router implementado
 Rotas reais:
 /admin
 /admin/pages
 /admin/pages/:id
 /admin/navigation
 /admin/media
 /admin/design-system
 /admin/settings
 /admin/global-blocks
Estrutura do admin
 AdminLayout
 AdminSidebar
 AdminTopbar
 loading states
 empty states
 error states
Dashboard
 Dashboard funcional
Pages list
 Listagem de páginas do Supabase
 filtros
 ações:
 editar
 duplicar
 publicar/despublicar
 arquivar
 excluir
Page editor
 Estrutura em 3 colunas
 Lista de seções
 Editor de seção
 Preview/inspector
 Abas:
 Conteúdo
 Itens / Cards
 Layout
 Estilo
 Breakpoints
 Comportamento
 Dados vinculados
 Preview
CRUD de seções
 Buscar página
 Buscar seções
 Selecionar seção
 Salvar alterações
 Reordenar seções
 Duplicar seção
 Ocultar/mostrar seção
 Excluir seção
 Adicionar nova seção por template e variante
CRUD de items
 Listar items
 Adicionar item
 Editar item
 Duplicar item
 Reordenar item
 Ocultar/mostrar item
 Excluir item
Pickers
 TemplatePicker
 VariantPicker
 MediaPicker
 IconPicker
 TokenPicker
 TypographyPicker
 ButtonPresetPicker
 InputPresetPicker
 AnimationPresetPicker
 PageLinkPicker
 FormPicker
Global blocks editor
 Header editor
 Menu overlay editor
 Footer editor
 Floating button editor
 Support modal editor
Media library
 Listagem de media assets
 grid/list
 preview
 busca
 filtros
 seleção funcional
Design system editor
 design tokens
 typography styles
 button presets
 input presets
 animation presets
 listagem
 edição
 persistência
 preview
Preview responsivo
 mobile
 tablet
 desktop
 renderer real
 breakpoint overrides aplicados
 preview dentro do editor
UX obrigatória
 useUnsavedChanges
 confirmação ao sair sem salvar
 loading states
 success/error feedback
 drag-and-drop
 preview switcher
 empty states
 consistência visual
Persistência
 pages CRUD
 sections CRUD
 section items CRUD
 global blocks update
 navigation update
 media reads
 design system update
Etapas seguintes após o Prompt 4
Etapa 5 — Hardening do CMS
 auditoria
 publicação / draft / archive
 preview por página
 preview por seção
 versionamento / snapshots
 revisão de performance
 revisão de acessibilidade
 revisão de responsividade
 revisão de segurança / RLS
Etapa 6 — Conteúdo dinâmico completo
 blog
 autores
 categorias
 testimonials
 awards
 FAQ groups
 FAQ items
 brand logos
Etapa 7 — Media avançada
 upload real
 crop
 redimensionamento guiado
 variantes de mídia
 rastreamento de uso
 biblioteca por pastas
Etapa 8 — Auth e permissões reais
 login real
 proteção de rotas
 perfis
 papéis:
 super_admin
 editor
 content_manager
 viewer
 permissões por módulo
Etapa 9 — Área empresa
 layout empresa
 dashboard base
 navegação
 perfil da empresa
 placeholders funcionais
 estrutura pronta para módulos futuros
Etapa 10 — Área profissional
 layout profissional
 dashboard base
 navegação
 perfil profissional
 placeholders funcionais
 estrutura pronta para módulos futuros
Checklist mestre de decisão
Pode avançar do Prompt 1 para o 2?
 arquitetura validada
 home com 12 seções
 templates oficiais fechados
 blocos globais definidos
Pode avançar do Prompt 2 para o 3?
 fundação pronta
 renderer pronto
 registries e resolvers prontos
 integração Supabase base pronta
Pode avançar do Prompt 3 para o 4?
 schema pronto
 seed funcionando
 home dinâmica funcionando
 global blocks funcionando
 services layer mínima pronta
Pode avançar após o Prompt 4?
 admin funcional real
 CRUD funcional
 pickers funcionando
 preview responsivo utilizável
 persistência completa no Supabase