Agora gere a fundação inicial do código do projeto, compatível com Next.js 15+, React, TypeScript, Tailwind CSS, shadcn/ui e Supabase, respeitando exatamente a arquitetura já validada no Prompt 1.

CONTEXTO
A arquitetura visual e estrutural do Prompt 1 já foi validada e deve ser tratada como base consolidada.
A home atual validada possui 12 seções principais de conteúdo, sem Editorial intro, com closing_cta_section e newsletter_capture_section no fechamento, e com awards_section e lead_capture_section mantidos como templates oficiais do sistema, porém fora da composição inicial obrigatória da home.

ARQUIVO DE REFERÊNCIA VISUAL ANEXADO
As referências visuais estarão anexadas em um PDF, contendo versões mobile e desktop das seções e blocos globais. Nesta etapa, não redesenhe o sistema. Apenas garanta que a fundação do código fique coerente com a arquitetura já validada e preparada para sustentar fielmente essas referências.

Dentro do PDF, as referências estão organizadas pelos seguintes títulos:
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

OBJETIVO DESTA ETAPA
Quero a fundação inicial do código do projeto, pronta para:
- crescimento sem refatoração estrutural
- renderização por schema
- integração com Supabase
- edição visual futura no admin
- composição da home atual validada
- expansão futura para novas páginas, novas variantes, novos templates e novas áreas

NÃO É OBJETIVO DESTA ETAPA
- redesenhar a home
- mudar a ordem da home
- reabrir decisões de Prompt 1
- criar implementação superficial hardcoded
- simular CMS com arrays soltos
- criar apenas mock visual desconectado da arquitetura

PRINCÍPIOS OBRIGATÓRIOS
- Zero hardcode funcional ou visual relevante.
- Nada de home fixa com props soltas.
- Nada de admin fake.
- Nada de componentes isolados sem vínculo com schema.
- Prefira fundação sólida e expansível em vez de implementação superficial.
- A base deve nascer compatível com Public Web, Admin Portal, Company Portal, Professional Portal e Shared Core.
- O resultado deve ser coerente com a arquitetura validada no Prompt 1.

CLÁUSULA OBRIGATÓRIA DE GERENCIAMENTO VIA ADMIN
Todo conteúdo, layout, estilo, tipografia, espaçamento, presets visuais, links, mídias, ícones, comportamento, ordem, visibilidade e configurações por breakpoint que sejam relevantes para a operação do site devem ser gerenciáveis via painel admin e persistidos no banco, preferencialmente por schemas, tokens, presets, slots e configurações estruturadas, evitando hardcode e evitando edição livre irrestrita de CSS.

ORDEM DE PRIORIDADE DESTA ETAPA
Siga esta lógica:
1. foundation / core
2. banco e integração base
3. shared UX system
4. cms renderer
5. shells públicos e admin
6. estrutura pronta para expansão futura

Não priorize ainda implementação profunda dos portais empresa e profissional. Deixe apenas a estrutura preparada para eles.

GERE NESTA ETAPA

1. Estrutura inicial de pastas compatível com:
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

2. Rotas macro
- /
- /[slug]
- /blog
- /blog/[slug]
- /preview/[pageId]
- /admin
- /admin/pages
- /admin/pages/[id]
- /admin/navigation
- /admin/footer
- /admin/media
- /admin/forms
- /admin/blog
- /admin/testimonials
- /admin/awards
- /admin/faqs
- /admin/design-system
- /admin/settings
- /empresa
- /profissional

3. Layouts base
- PublicLayout
- AdminLayout
- CompanyLayout
- ProfessionalLayout

4. Camadas de componentes
- foundation
- shared
- cms
- public
- admin
- company
- professional

5. Tipos principais
- Page
- PageSection
- SectionTemplate
- SectionVariant
- SectionItem
- GlobalBlock
- NavigationMenu
- NavigationItem
- DesignToken
- ButtonPreset
- InputPreset
- TypographyStyle
- MediaAsset
- Form
- FormField
- AnimationPreset
- HeaderConfig
- FooterConfig
- SupportModalConfig
- FloatingButtonConfig

6. Contratos de schema
- content_config
- style_config
- behavior_config
- breakpoint overrides
- section items
- global block config
- template registry contract
- variant registry contract
- page resolver contract
- media reference contract
- form reference contract
- token reference contract

7. CMS engine base
- TemplateRegistry
- VariantRegistry
- PageRenderer
- SectionRenderer
- SectionVariantRenderer
- SectionItemRenderer
- GlobalBlockRenderer
- ContentResolver
- StyleResolver
- BehaviorResolver
- BreakpointResolver
- VisibilityResolver
- LayoutResolver
- TokenResolver

8. Shared UX System base
- BaseModal
- ConfirmDiscardModal
- FormFeedbackModal
- useUnsavedChanges
- SortableList
- SortableItem
- DragHandle
- TextField
- EmailField
- PhoneField
- AddressAutocompleteField
- DatePickerField
- CheckboxField
- TextareaField
- SelectField
- SectionTabs
- DevicePreviewSwitcher
- EmptyState
- LoadingState
- SuccessState
- ErrorState

9. Blocos globais base
- PublicHeader
- PublicMenuOverlay
- PublicFooter
- FloatingSupportButton
- SupportModal

10. Design system base
- tokens iniciais
- theme contract
- tipografia base
- presets iniciais
- integração com Lucide
- suporte a button presets, input presets e animation presets
- utilitários para slots tipográficos
- suporte a spacing, border, radius, opacity e z-index por token/preset

11. Setup inicial do Supabase
- client
- server helpers
- type placeholders
- services base
- contratos compatíveis com:
  - pages
  - page_sections
  - section_items
  - global_blocks
  - design_tokens
  - media_assets
  - forms
  - navigation_menus
  - navigation_items
  - section_breakpoint_overrides
  - section_item_breakpoint_overrides
  - button_presets
  - input_presets
  - typography_styles
  - animation_presets

12. Estrutura inicial do admin
- AdminLayout
- AdminSidebar
- AdminTopbar
- Dashboard shell
- PageEditor shell
- PreviewFrame
- InspectorPanel
- Sortable editor list shell
- TemplatePicker
- VariantPicker
- MediaPicker
- IconPicker
- TokenPicker
- TypographyPicker
- ButtonPresetPicker
- InputPresetPicker
- AnimationPresetPicker
- PageLinkPicker
- FormPicker

13. Preparação visual e estrutural para os templates da home atual validada
Crie a base estrutural necessária para suportar:
- hero_section baseado em 02-hero-section
- stats_cards_section baseado em 03-stats-cards-section
- feature_showcase_section.analytics_dashboard baseado em 04-feature-showcase-analytics-dashboard
- feature_showcase_section.wellness_routine baseado em 05-feature-showcase-wellness-routine
- feature_showcase_section.single_feature_promo baseado em 08-single-feature-promo-section
- icon_feature_list_section baseado em 06-icon-feature-list-section
- logo_marquee_section baseado em 07-logo-marquee-section
- newsletter_capture_section baseado em 09-newsletter-capture-section
- featured_article_section baseado em 10-featured-article-section
- testimonials_section baseado em 11-testimonials-section
- faq_section baseado em 13-faq-section
- closing_cta_section baseado em 14-closing-cta-section
- footer_newsletter_navigation baseado em 15-footer-global
- menu_overlay baseado em 16-menu-overlay-global-open
- support_modal baseado em 01-support-modal-global

14. Templates oficiais que devem continuar existindo na arquitetura, mesmo fora da composição inicial obrigatória da home
- lead_capture_section
- awards_section

15. Preparação para preview e edição por breakpoint
A base deve suportar:
- mobile
- tablet
- desktop
- override por breakpoint para layout, estilo, ordem, tipografia, mídia e visibilidade
- preview responsivo no admin
- persistência desses overrides no schema

16. Regras de documentação da entrega
Além do código e da estrutura, entregue também:
- árvore de pastas final
- explicação curta das responsabilidades de cada camada
- lista dos arquivos centrais
- contrato dos tipos principais
- contrato do renderer
- contrato dos global blocks
- contrato dos breakpoint overrides
- observações sobre como a etapa atual prepara o Prompt 3

REGRAS IMPORTANTES
- Não implemente ainda o conteúdo completo da home.
- Não reabra decisões de Prompt 1.
- Não hardcode as seções finais.
- Não simule o CMS com arrays fixos sem camada de schema.
- Organize tudo para crescer sem retrabalho.
- Gere código real quando suportado.
- Quando não for possível detalhar um arquivo por completo, gere pelo menos o esqueleto correto com nomes, responsabilidades e contratos.
- Deixe company/professional como estrutura preparada, não como foco de implementação profunda nesta etapa.
- A fundação precisa suportar exatamente a home validada com 12 seções.

SAÍDA ESPERADA
Quero:
- árvore de pastas
- arquivos principais
- código inicial dos arquivos centrais
- tipos
- registries
- renderers base
- shared UX base
- blocos globais base
- admin shell
- contratos iniciais compatíveis com Supabase
- base consistente para a próxima etapa de implementação da home e do admin funcional