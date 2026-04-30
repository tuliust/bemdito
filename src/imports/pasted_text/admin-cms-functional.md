Validei a base de dados e a seed:

database-seed-fixed.sql foi executado com sucesso.
Conferência atual:
sites = 1
home = 1
sections = 12

Também desativei RLS temporariamente nas tabelas principais para evitar bloqueios nesta fase:

sites
pages
page_sections
section_templates
section_variants
section_items
global_blocks
Próximo passo

Agora precisamos seguir em duas frentes:

1. Validar a entrega do Prompt 3

Antes de avançar, confirme objetivamente estes 5 pontos:

a home carrega do Supabase sem fallback hardcoded
as 12 seções aparecem na ordem correta
os 5 blocos globais funcionam
lead_capture_section e awards_section continuam previstos no sistema
schema + seed rodam sem erro
2. Avançar para a próxima fase: Admin CMS funcional

A próxima etapa agora é a camada operacional do admin.

Diretriz de implementação

Use React Router, não tabs improvisadas.

Isso precisa preparar o admin para crescer com a seguinte base de rotas:

/admin
/admin/pages
/admin/pages/:id
/admin/navigation
/admin/media
/admin/design-system
/admin/settings
/admin/global-blocks
Escopo da próxima etapa

Agora implemente o Admin CMS funcional sobre a fundação já criada e sobre a home dinâmica já conectada ao Supabase.

Contexto

A arquitetura, a fundação do código e a home dinâmica já foram implementadas.
Não reabra decisões anteriores.
Agora o foco é transformar o painel admin em uma interface realmente operacional para editar a home, as seções, os blocos globais e os dados estruturados.

Ambiente real

Considere o ambiente real do projeto:

Figma Make
Vite + React
Supabase
sem Next.js App Router real
sem Server Components
sem SSR obrigatório

Use a solução mais coerente para esse ambiente.

Objetivo desta etapa

Quero um Admin CMS funcional para operar a home atual e sua estrutura via banco.

Foco desta etapa
layout admin real
routing admin real
pages list funcional
page editor funcional
CRUD de seções
drag-and-drop
edição de items internos
edição de blocos globais
pickers principais
preview responsivo utilizável
persistência no Supabase
Cláusula obrigatória de gerenciamento via admin

Todo conteúdo, layout, estilo, tipografia, espaçamento, presets visuais, links, mídias, ícones, comportamento, ordem, visibilidade e configurações por breakpoint que sejam relevantes para a operação do site devem ser gerenciáveis via painel admin e persistidos no banco, preferencialmente por schemas, tokens, presets, slots e configurações estruturadas, evitando hardcode e evitando edição livre irrestrita de CSS.

Parte A — Estrutura do admin

Implemente:

AdminLayout
AdminSidebar
AdminTopbar
rotas reais com React Router
navegação lateral funcional
área central para telas
loading states
empty states
error states
Módulos que devem funcionar nesta etapa
Dashboard
Pages list
Page editor
Global blocks
Navigation
Media library
Design system
Settings, ao menos como shell funcional
Parte B — Lista de páginas

Quero uma tela funcional em /admin/pages com:

listagem de páginas do Supabase
título
slug
tipo
status
locale
última atualização
ações
Ações
editar
duplicar
publicar / despublicar
arquivar
excluir
Filtros básicos
status
tipo
locale
Parte C — Page editor funcional

Quero o editor em /admin/pages/:id com estrutura em 3 colunas.

Coluna esquerda
lista de seções
template
variante
status
visibilidade
drag handle
ação de duplicar
ação de ocultar/mostrar
ação de excluir
Coluna central
editor da seção selecionada
Coluna direita
preview ou inspector
Abas do editor
Conteúdo
Itens / Cards
Layout
Estilo
Breakpoints
Comportamento
Dados vinculados
Preview
Funcionalidades reais
buscar página do Supabase
buscar seções da página
selecionar seção
salvar mudanças no banco
reordenar seções e persistir
duplicar seção
ocultar/mostrar seção
excluir seção
adicionar nova seção por template e variante
Parte D — Editor de items internos

Quando a seção tiver section_items, permitir:

listar items
adicionar item
editar item
duplicar item
reordenar items
ocultar/mostrar item
excluir item

Isso deve funcionar para casos como:

stats cards
benefit items
overlay chips
logo items
testimonials
FAQ items
support modal items
Parte E — Pickers essenciais

Implemente de forma funcional:

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

Esses pickers não precisam ter acabamento perfeito, mas precisam funcionar e estar conectados à estrutura real.

Parte F — Global blocks editor

Crie edição funcional para:

Header
Menu Overlay
Footer
Floating Button
Support Modal

Quero conseguir editar:

textos
links
menu items
logo
ícones
botões
items do modal
links legais
redes sociais
newsletter do footer
comportamento essencial
Parte G — Media library funcional

Implemente:

listagem de media assets
grid/list
preview
seleção em picker
busca básica
filtros básicos
metadados principais

Se upload completo ainda for pesado, deixe ao menos:

estrutura correta
leitura real do banco
seleção funcional
Parte H — Design system editor funcional

Implemente leitura e edição básica de:

design tokens
typography styles
button presets
input presets
animation presets

Quero ao menos:

listagem
edição básica
persistência
preview simples
Parte I — Preview responsivo

O preview do editor precisa funcionar com:

mobile
tablet
desktop
renderer real
aplicação de overrides por breakpoint

O preview deve refletir a página real, não uma versão paralela fake.

Parte J — Services e persistência

Expanda a camada de serviços existente para suportar:

pages CRUD
sections CRUD
section items CRUD
global blocks update
navigation update
media reads
design system update
Parte K — UX obrigatória

Quero funcionando:

useUnsavedChanges
confirmação ao sair sem salvar
loading states
success/error feedback
drag-and-drop
preview switcher
empty states
comportamento visual consistente
Regras importantes
Não reabrir a arquitetura.
Não reestruturar a home validada.
Não criar admin fake.
Não transformar o admin em formulário gigante cru.
Não usar CSS livre como solução de edição.
Priorizar funcionalidade real no banco e no renderer.
Saída esperada

Quero:

routing real do admin
pages list funcional
page editor funcional
CRUD real de seções
CRUD real de items
global blocks editor funcional
pickers essenciais funcionando
media library básica funcional
design system editor básico funcional
preview responsivo utilizável
persistência no Supabase