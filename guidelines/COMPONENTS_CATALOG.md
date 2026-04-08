# 📚 BemDito CMS — Catálogo de Componentes

**Versão:** 1.4  
**Data:** 2026-02-21 (v1.4 — AdminActionButtons/AdminGridCard tokenizados na doc; AdminDropdownMenu §1c adicionado; sistema data-slot documentado; ADMIN_COLORS marcado deprecated na auditoria; v1.3 — Master Quick Reference; v1.2 — Label; swatch; v1.1 — AdminEmptyState + AdminThemeProvider)  
**Status:** 📘 Documentação Oficial

---

## 🔒 Lei Fundamental

> **Antes de criar qualquer componente novo, consulte este catálogo.**  
> Se o componente já existir, use-o. Se precisar de ajuste, estenda-o via props.  
> Nunca duplique funcionalidade existente.

---

## ⚡ Master Quick Reference — Todos os Componentes

### 🪟 Modais e Diálogos — Camada 2 (compartilhados)

| Componente | Caminho | Quando usar |
|---|---|---|
| `BaseModal` | `/src/app/components/admin/BaseModal.tsx` | Qualquer modal com campos de formulário/edição |
| `ConfirmDeleteDialog` | `/src/app/components/admin/ConfirmDeleteDialog.tsx` | Confirmação de exclusão de qualquer entidade |
| `ConfirmDialog` | `/src/app/components/admin/ConfirmDialog.tsx` | Confirmações não-destrutivas (publicar, mover) |
| `AlertMessageDialog` | `/src/app/components/admin/AlertMessageDialog.tsx` | Substituto de `window.alert()` |
| `UnsavedChangesDialog` | `/src/app/components/admin/UnsavedChangesDialog.tsx` | **Uso interno do BaseModal** — nunca instanciar |
| `PositionConflictDialog` | `/src/app/components/admin/PositionConflictDialog.tsx` | Aviso de conflito de posição no grid 2×2 |

### 🪟 Modais de Feature — Camada 3

| Componente | Caminho | Quando usar |
|---|---|---|
| `VersionHistoryModal` | `/src/app/admin/components/VersionHistoryModal.tsx` | Histórico de versões de página/seção |
| `MenuItemEditorModal` | `/src/app/admin/menu-manager/MenuItemEditorModal.tsx` | Editar item de menu e megamenu |
| `UnifiedSectionConfigModal` | `/src/app/admin/pages-manager/UnifiedSectionConfigModal.tsx` | Configurar seção dentro de uma página |
| `TemplateEditorModal` | `/src/app/admin/cards-manager/TemplateEditorModal.tsx` | Editar template de cards |
| `CreateSectionModal` | `/src/app/admin/sections-manager/CreateSectionModal.tsx` | Criar nova seção na biblioteca |

### 🎨 Seleção de Cor

| Componente | Caminho | Quando usar |
|---|---|---|
| `ColorTokenPicker` | `/src/app/components/ColorTokenPicker.tsx` | Selecionar token de cor do DS — salva UUID |
| Swatch clicável (padrão inline) | — | Editar hex diretamente — ver §2 |

### 🔤 Seleção de Tipografia

| Componente | Caminho | Quando usar |
|---|---|---|
| `TypeScalePicker` | `/src/app/components/admin/TypeScalePicker.tsx` | Selecionar escala tipográfica — salva UUID |
| `ResponsiveText` | `/src/app/components/ResponsiveText.tsx` | Texto com token no site público |

### 🎯 Seleção de Ícone

| Componente | Caminho | Quando usar |
|---|---|---|
| `IconPicker` | `/src/app/components/admin/IconPicker.tsx` | Selecionar ícone Lucide — salva nome string |
| `IconPickerGrid` | `/src/app/components/admin/IconPickerGrid.tsx` | Grade de ícones (uso interno do `IconPicker`) |
| `getLucideIcon()` | `/src/lib/utils/icons.tsx` | Renderizar ícone salvo como string |

### 📁 Upload e Mídia

| Componente | Caminho | Quando usar |
|---|---|---|
| `MediaUploader` | `/src/app/components/admin/MediaUploader.tsx` | Upload inline com biblioteca integrada |
| `MediaPicker` | `/src/app/components/MediaPicker.tsx` | Seletor de mídia via modal separado |
| `ImageFieldWithPicker` | `/src/app/components/ImageFieldWithPicker.tsx` | Campo URL + botão seleção da biblioteca |
| `ImageUploadOnly` | `/src/app/components/ImageUploadOnly.tsx` | Upload/seleção sem input de URL manual |
| `UniversalMediaUpload` | `/src/app/components/UniversalMediaUpload.tsx` | **Uso interno** — base do `MediaPicker` |

### 🔘 Campos de Design / Configuração

| Componente | Caminho | Quando usar |
|---|---|---|
| `RadiusPicker` | `/src/app/components/admin/RadiusPicker.tsx` | Border-radius (token DS) |
| `TransitionPicker` | `/src/app/components/admin/TransitionPicker.tsx` | Velocidade de animação |
| `AlignXYControl` | `/src/app/components/admin/AlignXYControl.tsx` | Par de selects horizontal + vertical |
| `OpacitySlider` | `/src/app/components/admin/OpacitySlider.tsx` | Slider de opacidade 0–100% |
| `MediaFitModePicker` | `/src/app/components/admin/MediaFitModePicker.tsx` | Modo de exibição de mídia (5 opções) |
| `CornerPositionSelector` | `/src/app/components/admin/CornerPositionSelector.tsx` | Posição no grid 2×2 (4 cantos) |
| `PageAnchorPicker` | `/src/app/components/PageAnchorPicker.tsx` | Selecionar página + âncora de seção |
| `Label` (shadcn) | `/src/app/components/ui/label.tsx` | Label de campo — token `item-tertiary` automático |

### 🔵 Botões

| Componente | Caminho | Quando usar |
|---|---|---|
| `AdminPrimaryButton` | `/src/app/components/admin/AdminPrimaryButton.tsx` | CTA primário do painel — substitui `bg-primary` |
| `AdminActionButtons` | `/src/app/components/admin/AdminActionButtons.tsx` | Editar/Duplicar/Excluir em linhas de lista |
| `UnsavedHeaderActions` | `/src/app/components/admin/UnsavedHeaderActions.tsx` | Indicador ⚠️ + Salvar no `headerActions` |
| `ResponsiveButton` | `/src/app/components/ResponsiveButton.tsx` | Qualquer botão no site público |
| `Button` (shadcn) | `/src/app/components/ui/button.tsx` | Botões genéricos do painel admin |

### 🏗️ Layout Admin

| Componente | Caminho | Quando usar |
|---|---|---|
| `AdminPageLayout` | `/src/app/components/admin/AdminPageLayout.tsx` | Raiz obrigatória de toda página `/admin/*` |
| `AdminListItem` | `/src/app/components/admin/AdminListItem.tsx` | Container de linha de lista |
| `AdminGridCard` | `/src/app/components/admin/AdminGridCard.tsx` | Card de grid visual (seções, templates) |
| `AdminEmptyState` | `/src/app/components/admin/AdminEmptyState.tsx` | Estado vazio padronizado |
| `TabSectionHeader` | `/src/app/components/admin/TabSectionHeader.tsx` | Cabeçalho padronizado de aba (ícone + título) |
| `AdminThemeProvider` + `adminVar()` | `/src/app/components/admin/AdminThemeProvider.tsx` | Tema dinâmico via CSS vars |

### ⚙️ Controles de Seção Admin

| Componente | Caminho | Quando usar |
|---|---|---|
| `SectionBuilder` | `/src/app/admin/sections-manager/SectionBuilder.tsx` | Editor de estrutura de seção (elementos, layout, styling) |
| `GridLayoutEditor` | `/src/app/admin/sections-manager/GridLayoutEditor.tsx` | Editor visual de posição no grid 2×2 |
| `CompactFieldEditor` | `/src/app/admin/sections-manager/CompactFieldEditor.tsx` | Campos compactos: ícone, texto, botão, título |
| `SectionHeightAndAlignmentControls` | `/src/app/admin/pages-manager/SectionHeightAndAlignmentControls.tsx` | Altura, padding, gap, modo de mídia |
| `SectionLayoutControls` | `/src/app/admin/pages-manager/SectionLayoutControls.tsx` | Template de cards, URL de botão |
| `DraggableSectionItem` | `/src/app/admin/pages-manager/DraggableSectionItem.tsx` | Item de seção reordenável na página |

### 🗂️ Menu / Megamenu

| Componente | Caminho | Quando usar |
|---|---|---|
| `MegamenuContent` | `/src/app/components/megamenu/MegamenuContent.tsx` | Conteúdo do megamenu — público + preview admin |
| `MegamenuCardItem` | `/src/app/components/megamenu/MegamenuCardItem.tsx` | Card individual do megamenu |
| `MegamenuConfigurator` | `/src/app/admin/menu-manager/MegamenuConfigurator.tsx` | Editor visual do megamenu no admin |
| `MegamenuCardsTab` | `/src/app/admin/menu-manager/MegamenuCardsTab.tsx` | Aba de gestão de cards do megamenu |
| `useMenuHover` | `/src/lib/hooks/useMenuHover.ts` | Hook de hover com grace period (1000ms) |

### 🏠 Header / Footer

| Componente | Caminho | Contexto |
|---|---|---|
| `Header` | `/src/app/public/components/Header.tsx` | Site público — carrega do Supabase |
| `HeaderPreview` | `/src/app/admin/menu-manager/HeaderPreview.tsx` | Admin — espelho fiel do Header público |
| `Footer` | `/src/app/public/components/Footer.tsx` | Site público — carrega do Supabase |

### 🍞 Toast / Notificações

| Componente | Caminho | Quando usar |
|---|---|---|
| `toast` (Sonner) | `import { toast } from 'sonner'` | Notificações de sucesso/erro após operações |
| `Toaster` (UI wrapper) | `/src/app/components/ui/sonner.tsx` | Montado na raiz do app — não instanciar novamente |

### 🌐 Renderização Pública

| Componente | Caminho | Quando usar |
|---|---|---|
| `SectionRenderer` | `/src/app/public/components/SectionRenderer.tsx` | Renderizador de seções — nunca duplicar |
| `CardRenderer` | `/src/app/public/components/CardRenderer.tsx` | Renderizador de cards — nunca duplicar |
| `ResponsiveContainer` | `/src/app/components/ResponsiveContainer.tsx` | Container responsivo |
| `ResponsiveImage` | `/src/app/components/ResponsiveImage.tsx` | Imagem responsiva |
| `ResponsiveCard` | `/src/app/components/ResponsiveCard.tsx` | Card responsivo |
| `ResponsiveSection` | `/src/app/components/ResponsiveSection.tsx` | Seção responsiva |

---

## 📐 Arquitetura em Camadas

```
CAMADA 1 — Primitivas shadcn/ui  (NUNCA importar em features)
  dialog.tsx · alert-dialog.tsx · sheet.tsx · popover.tsx · ...

CAMADA 2 — Wrappers do Projeto  (únicos a usar Camada 1 diretamente)
  BaseModal · ConfirmDeleteDialog · ConfirmDialog
  AlertMessageDialog · UnsavedChangesDialog

CAMADA 3 — Componentes de Campo  (usam Camada 2 quando necessário)
  ColorTokenPicker · TypeScalePicker · IconPicker
  MediaUploader · MediaPicker · ImageFieldWithPicker
  RadiusPicker · TransitionPicker

CAMADA 4 — Features / Páginas  (nunca importam Camada 1)
  SectionBuilder · UnifiedSectionConfigModal
  MegamenuConfigurator · TemplateEditorModal · ...
```

**Regra absoluta:** Camada 4 nunca importa Camada 1. Camada 3 nunca importa `dialog.tsx` ou `alert-dialog.tsx` diretamente.

---

## 🪟 1. Componentes de Modal

### `BaseModal` — Modal de Formulário/Edição
**Caminho:** `/src/app/components/admin/BaseModal.tsx`

```tsx
import { BaseModal } from '@/app/components/admin/BaseModal';

<BaseModal
  open={open}                           // boolean — obrigatório
  onOpenChange={setOpen}                // (open: boolean) => void — obrigatório
  title="Título do Modal"               // string | ReactNode — obrigatório
  description="Descrição opcional"      // string — opcional
  size="default"                        // 'default' | 'large' | 'full' — padrão: 'default'
  onSave={handleSave}                   // () => void — mostra botão "Salvar"
  onCancel={() => setOpen(false)}       // () => void — mostra botão "Cancelar"
  saveLabel="Salvar"                    // string — padrão: 'Salvar'
  cancelLabel="Cancelar"               // string — padrão: 'Cancelar'
  saving={false}                        // boolean — desabilita botão durante save
  hasUnsavedChanges={hasChanges}        // boolean — exibe UnsavedChangesDialog ao fechar
>
  {/* conteúdo */}
</BaseModal>
```

**Quando usar:** Formulários, editores, qualquer modal com campos de entrada.  
**Fecha com:** X, ESC, clique no overlay — com guard de `UnsavedChangesDialog` quando `hasUnsavedChanges=true`.  
**Tamanhos:** `default` (~1000px), `large` (~1300px), `full` (95vw).

---

### `ConfirmDeleteDialog` — Confirmação de Exclusão
**Caminho:** `/src/app/components/admin/ConfirmDeleteDialog.tsx`

```tsx
import { ConfirmDeleteDialog } from '@/app/components/admin/ConfirmDeleteDialog';

// Estado:
const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

// Trigger:
<button onClick={() => setItemToDelete(item)}>Excluir</button>

// Diálogo:
<ConfirmDeleteDialog
  open={!!itemToDelete}
  onConfirm={confirmDelete}             // () => void
  onCancel={() => setItemToDelete(null)} // () => void
  itemName={itemToDelete?.name}         // string — para mensagem automática
  // OU:
  title="Excluir seção"
  description="Esta ação não pode ser desfeita."
/>
```

**Quando usar:** Exclusão de qualquer entidade (seção, card, coluna, arquivo, etc.).  
**NÃO usar:** `window.confirm()` — proibido pelas Guidelines.  
**Não fecha:** Com overlay/ESC — é `AlertDialog` intencional.

---

### `ConfirmDialog` — Confirmação Genérica
**Caminho:** `/src/app/components/admin/ConfirmDialog.tsx`

```tsx
import { ConfirmDialog } from '@/app/components/admin/ConfirmDialog';

<ConfirmDialog
  open={open}
  onConfirm={handleAction}
  onCancel={() => setOpen(false)}
  title="Publicar página?"
  description="A página ficará visível para todos."
  confirmLabel="Publicar"
  cancelLabel="Cancelar"
  confirmVariant="primary"  // 'default' | 'destructive' | 'primary'
/>
```

**Quando usar:** Confirmações não-destrutivas (publicar, mover, aplicar, etc.).  
**Para exclusões:** Use `ConfirmDeleteDialog` (já tem defaults corretos).

---

### `AlertMessageDialog` — Substituto para `alert()`
**Caminho:** `/src/app/components/admin/AlertMessageDialog.tsx`

```tsx
import { AlertMessageDialog } from '@/app/components/admin/AlertMessageDialog';

// Estado:
const [alertMsg, setAlertMsg] = useState<{ title?: string; message: string } | null>(null);

// Exibir:
setAlertMsg({ title: 'Atenção', message: 'Campo obrigatório.' });

// Diálogo:
<AlertMessageDialog
  open={!!alertMsg}
  message={alertMsg?.message ?? ''}
  title={alertMsg?.title}
  onClose={() => setAlertMsg(null)}
  actionLabel="OK"  // padrão: 'OK'
/>
```

**Quando usar:** Mensagens de erro/aviso ao usuário.  
**NÃO usar:** `window.alert()` — proibido pelas Guidelines.

---

### `UnsavedChangesDialog` — Alterações Não Salvas
**Caminho:** `/src/app/components/admin/UnsavedChangesDialog.tsx`

**USO INTERNO APENAS** — gerenciado automaticamente pelo `BaseModal` via prop `hasUnsavedChanges`.  
**Nunca instancie manualmente dentro de um `BaseModal`.**

---

### `PositionConflictDialog` — Conflito de Posição no Grid
**Caminho:** `/src/app/components/admin/PositionConflictDialog.tsx`

```tsx
import { PositionConflictDialog } from '@/app/components/admin/PositionConflictDialog';

<PositionConflictDialog
  open={conflictDialogOpen}
  onOpenChange={setConflictDialogOpen}
  conflicts={[
    {
      element1: 'Texto',
      element2: 'Mídia',
      position1: 'top-left',
      position2: 'top-left',
      description: 'Texto e Mídia estão na mesma posição',
    }
  ]}
  onContinue={() => { performSave(); setConflictDialogOpen(false); }}
/>
```

**Quando usar:** Antes de salvar configuração de seção — verificar se elementos colidem no grid 2×2.  
**Herda de:** `BaseModal` — fecha com X/ESC/overlay.  
**Exibe:** Lista de conflitos com labels legíveis (ex: "Topo Esquerda").

---

## 🪟 1d. Modais de Feature

### `VersionHistoryModal` — Histórico de Versões
**Caminho:** `/src/app/admin/components/VersionHistoryModal.tsx`

```tsx
import { VersionHistoryModal } from '@/app/admin/components/VersionHistoryModal';

<VersionHistoryModal
  open={versionHistoryOpen}
  onOpenChange={setVersionHistoryOpen}
  entityId={page.id}                     // UUID da página ou seção
  entityType="page"                      // 'page' | 'section'
  currentData={currentPageData}          // Dados atuais (para criar versão manual)
  onRestore={async (data) => {           // Chamado ao restaurar versão
    await restorePage(data);
  }}
/>
```

**Quando usar:** Botão "Histórico" nas páginas `pages-manager` e `sections-manager`.  
**Funcionalidades:** Listar versões, marcar como restore point (⭐), restaurar, excluir.

---

### `MenuItemEditorModal` — Editor de Item de Menu
**Caminho:** `/src/app/admin/menu-manager/MenuItemEditorModal.tsx`

```tsx
import { MenuItemEditorModal } from '@/app/admin/menu-manager/MenuItemEditorModal';

<MenuItemEditorModal
  open={editorOpen}
  onOpenChange={setEditorOpen}
  menuItem={itemToEdit ?? null}          // null = criar novo
  onSave={async (data) => {
    await saveMenuItem(data);
    setEditorOpen(false);
  }}
  saving={saving}
/>
```

**Abas:** "Geral" (label, ícone, cor) e "Megamenu" (configurador visual).  
**Internamente usa:** `IconPicker`, `ColorTokenPicker`, `MegamenuConfigurator`.

---

### `UnifiedSectionConfigModal` — Configuração de Seção na Página
**Caminho:** `/src/app/admin/pages-manager/UnifiedSectionConfigModal.tsx`

Usado no `editor.tsx` do `pages-manager`. Não instanciar em outro contexto.

**Abas:** Layout, Design, Preview, Seção.  
**Internamente usa:** `SectionBuilder`, `GridLayoutEditor`, `CornerPositionSelector`, `ColorTokenPicker`, `TypeScalePicker`, `ImageUploadOnly`, `OpacitySlider`, `AlignXYControl`, `MediaFitModePicker`.

---

### `TemplateEditorModal` — Editor de Template de Cards
**Caminho:** `/src/app/admin/cards-manager/TemplateEditorModal.tsx`

Usado no `cards-manager/page.tsx`. Modal de tamanho `large` com múltiplas abas.

**Abas:** Geral, Design, Cards, Filtros.  
**Internamente usa:** `ColorTokenPicker`, `TypeScalePicker`, `MediaUploader`, `IconPicker`, `OpacitySlider`.

---

### `CreateSectionModal` — Criar Seção na Biblioteca
**Caminho:** `/src/app/admin/sections-manager/CreateSectionModal.tsx`

```tsx
import { CreateSectionModal } from '@/app/admin/sections-manager/CreateSectionModal';

<CreateSectionModal
  open={createOpen}
  onOpenChange={setCreateOpen}
  onCreated={(newSection) => {
    setSections(prev => [...prev, newSection]);
    setCreateOpen(false);
  }}
/>
```

**Campos:** Nome, toggle Published, `SectionBuilder` para configurar estrutura inicial.

---

### `AdminPageLayout` — Layout de Página Admin
**Caminho:** `/src/app/components/admin/AdminPageLayout.tsx`

```tsx
import { AdminPageLayout } from '@/app/components/admin/AdminPageLayout';

// Com tabs:
<AdminPageLayout
  title="Menu"
  description="Gerencie o menu principal"
  headerActions={<UnsavedHeaderActions ... />}
  tabs={[
    {
      value: 'items',
      label: 'Itens',
      icon: <MenuIcon className="h-4 w-4" />,
      content: <div>...</div>
    }
  ]}
  defaultTab="items"
/>

// Sem tabs, com container branco automático:
<AdminPageLayout
  title="Config"
  description="..."
  contentClassName="bg-white border-2 border-gray-200 rounded-2xl p-6"
>
  <FormFields />
</AdminPageLayout>
```

**Props:**
| Prop | Tipo | Descrição |
|---|---|---|
| `title` | `string` | Título da página (H1) |
| `description` | `string` | Descrição abaixo do título |
| `headerActions` | `ReactNode` | Área direita do header (botões, indicadores) |
| `tabs` | `Tab[]` | Tabs da página — se omitido, renderiza `children` diretamente |
| `defaultTab` | `string` | Tab aberta por padrão |
| `contentClassName` | `string?` | Quando fornecido (sem tabs), envolve `children` nesse container |
| `children` | `ReactNode?` | Conteúdo (quando sem tabs) ou Dialogs adicionais (quando com tabs) |

**Quando usar:** TODAS as páginas `/admin/*` devem usar este layout.  
**Não criar:** Headers, Tabs ou containers de página manualmente.

---

## 🧱 1b. Componentes de Lista Admin (C2–C5)

> Criados na auditoria de 2026-02-20 para eliminar padrões manuais repetidos.

### `AdminListItem` — Container de Linha de Lista
**Caminho:** `/src/app/components/admin/AdminListItem.tsx`

```tsx
import { AdminListItem } from '@/app/components/admin/AdminListItem';

// Lista de páginas (p-6, layout topo-início):
<AdminListItem className="p-6">
  <div className="flex items-start justify-between">
    <div className="flex-1">{/* conteúdo esquerdo */}</div>
    <AdminActionButtons onEdit={handleEdit} onDelete={handleDelete} />
  </div>
</AdminListItem>

// Lista de menu (p-4, flex horizontal):
<AdminListItem className="p-4 flex items-center gap-4 hover:border-gray-300">
  {/* ícones de reordenação + conteúdo + ações */}
</AdminListItem>
```

**Garante:** `bg-white border-2 border-gray-200 rounded-xl transition:none`.  
**Padding e layout:** gerenciados por `className` — o componente não impõe nenhum.  
**Não usar em:** Grids de cards (seções, templates) que têm estrutura visual própria.

---

### `AdminEmptyState` — Estado Vazio Padronizado
**Caminho:** `/src/app/components/admin/AdminEmptyState.tsx`  
**Atualizado:** 2026-02-21 — nova interface `title`/`description`, `cta` aceita ReactNode, tipografia tokenizada.

```tsx
import { AdminEmptyState } from '@/app/components/admin/AdminEmptyState';

// ✅ Modo novo (recomendado):
<AdminEmptyState
  title="Nenhuma seção criada"
  description="Clique em 'Nova Seção' para começar."
  cta={{ label: 'Nova Seção', onClick: handleCreate }}
/>

// ✅ cta como ReactNode arbitrário (ex: bloco de código, link):
<AdminEmptyState
  title="Tokens não encontrados"
  description="Execute o SQL de migration para criar os tokens do painel."
  cta={
    <div className="font-mono text-xs bg-gray-900 text-green-400 rounded p-4">
      /migrations/2026-02-21_system_manager_tokens.sql
    </div>
  }
/>

// ✅ Modo legado (compatível — message assume papel de title):
<AdminEmptyState
  message="Nenhuma seção criada ainda"
  cta={{ label: 'Criar Primeira Seção', onClick: handleCreate }}
/>

// ✅ Em grid (span de colunas):
<AdminEmptyState
  title="Nenhum template"
  cta={{ label: 'Novo Template', onClick: handleCreate }}
  className="col-span-full"
/>

// ✅ Sem CTA:
<AdminEmptyState title="Nenhum resultado encontrado" />
```

**Props:**
| Prop | Tipo | Descrição |
|---|---|---|
| `title` | `string?` | Título em destaque — token `item-title-grid` |
| `description` | `string?` | Subtítulo descritivo — token `item-description` |
| `message` | `string?` | ⚠️ Legado — se omitido `title`, assume papel de título |
| `cta` | `{ label, onClick, icon? } \| ReactNode` | Botão ou conteúdo customizado |
| `className` | `string?` | Classes extras (ex: `col-span-full`) |

**Garante:** `text-center py-12 border-2 border-dashed border-gray-300 rounded-xl`.  
**Ícone padrão:** `<Plus>` quando `cta` é objeto — substituível via `cta.icon`.  
**Tipografia:** controlada por tokens `admin-ui` — não hardcoded.

---

### `AdminActionButtons` — Botões de Ação em Linha
**Caminho:** `/src/app/components/admin/AdminActionButtons.tsx`

```tsx
import { AdminActionButtons } from '@/app/components/admin/AdminActionButtons';

// Editar + Excluir + Duplicar:
<AdminActionButtons
  onEdit={() => handleEdit(item)}
  onDelete={() => handleDelete(item)}
  onDuplicate={() => handleDuplicate(item)}
/>

// Apenas Editar + Excluir:
<AdminActionButtons
  onEdit={() => handleEdit(item)}
  onDelete={() => handleDelete(item)}
/>

// Com labels customizados:
<AdminActionButtons
  onEdit={handleEdit}
  editLabel="Configurar"
  onDelete={handleDelete}
  deleteLabel="Remover"
/>
```

**Ordem fixa:** [Editar] → [Duplicar] → [Excluir]  
**Ícones fixos:** `Edit` · `Copy` · `Trash2`  
**Tokenização:** Editar/Duplicar usam `--admin-btn-action-*`; Excluir usa `--admin-delete-btn-*` — tudo via `style` inline com `onMouseEnter/Leave` (zero classes Tailwind de cor).  
**Não usar em:** DropdownMenu (sections-manager e cards-manager usam `AdminDropdownMenu` com `MoreVertical` — padrão diferente para grids).

---

### `UnsavedHeaderActions` — Indicador + Salvar no Header
**Caminho:** `/src/app/components/admin/UnsavedHeaderActions.tsx`

```tsx
import { UnsavedHeaderActions } from '@/app/components/admin/UnsavedHeaderActions';

// Uso básico:
<AdminPageLayout
  headerActions={
    <UnsavedHeaderActions
      hasUnsavedChanges={hasUnsavedChanges}
      saving={saving}
      onSave={handleSave}
    />
  }
/>

// Com label customizado:
<UnsavedHeaderActions
  hasUnsavedChanges={hasUnsavedChanges}
  saving={saving}
  onSave={handleSaveHeaderConfig}
  saveLabel="Salvar Configurações"
/>

// Com ação extra à esquerda (ex: Preview):
<UnsavedHeaderActions
  hasUnsavedChanges={hasUnsavedChanges}
  saving={saving}
  onSave={handleSave}
  extraActions={
    <Button variant="outline" onClick={() => window.open('/', '_blank')}>
      <Eye className="h-4 w-4 mr-2" /> Preview
    </Button>
  }
/>
```

**Regra:** Indicador ⚠️ e botão Salvar **sempre juntos** no `headerActions` — nunca dentro de tabs ou seções.  
**Renderiza (E→D):** `[extraActions]` → `[⚠️ Indicador]` → `[Salvar]`  
**Usa:** `useUnsavedChangesGuard` nas páginas para fornecer `hasUnsavedChanges`.

---

### `AdminThemeProvider` + `adminVar()` — Tema Dinâmico do Painel
**Caminho:** `/src/app/components/admin/AdminThemeProvider.tsx`  
**Adicionado:** 2026-02-21

**Montagem:** Já presente na raiz do layout admin (`/src/app/admin/layout.tsx`). **Não instanciar** em features.

```tsx
// ── Consumo em componentes (mais comum) ─────────────────────────
import { adminVar } from '@/app/components/admin/AdminThemeProvider';

// Em inline styles:
<h4 style={{
  fontSize:   adminVar('item-title-grid', 'size'),    // → var(--admin-item-title-grid-size)
  fontWeight: adminVar('item-title-grid', 'weight'),  // → var(--admin-item-title-grid-weight)
  color:      adminVar('item-title-grid', 'color'),   // → var(--admin-item-title-grid-color)
}}>
  {name}
</h4>

// Token de cor (sem sub-prop):
<div style={{ borderColor: adminVar('card-border', '') }} />  // → var(--admin-card-border)

// ── Hook (somente em pages que lêem/salvam tokens) ───────────────
import { useAdminTheme } from '@/app/components/admin/AdminThemeProvider';

const { adminTokens, colorTokens, refreshTheme, loading } = useAdminTheme();
// Após salvar um token no banco:
await supabase.from('design_tokens').update({ value }).eq('id', id);
await refreshTheme(); // re-injeta CSS vars no <head>
```

**Assinatura de `adminVar`:**
```typescript
adminVar(tokenName: string, prop: 'size' | 'weight' | 'color' | 'font' | ''): string
// prop '' → var(--admin-{tokenName})
// prop X  → var(--admin-{tokenName}-{X})
```

**Tokens disponíveis:** Ver tabela completa em **Guidelines.md § Sistema de Tema Dinâmico do Painel Admin**.

**Regras:**
- ✅ **SEMPRE** usar `adminVar()` em `style={{}}` para tipografia admin
- ✅ **SEMPRE** fornecer fallback: `var(--admin-page-title-size, 1.5rem)` quando CSS var puder não estar definida
- ✅ **SEMPRE** chamar `refreshTheme()` após salvar token no banco
- ❌ **NUNCA** montar `AdminThemeProvider` em features (já está no layout)
- ❌ **NUNCA** usar classes Tailwind hardcoded de tipografia em novos componentes admin
- ❌ **NUNCA** importar `COLOR_CSS_VAR_MAP` fora do provider

---

---

## 🏷️ 1b. Componentes de Campo — Primitivas UI

### `Label` — Label de Campo Admin
**Caminho:** `/src/app/components/ui/label.tsx`  
**Adicionado:** 2026-02-21

O `Label` aplica automaticamente o token `item-tertiary` como tipografia padrão. **Não adicionar classes de tipografia** — elas sobrescrevem o token global.

```tsx
import { Label } from '@/app/components/ui/label';

// ✅ CORRETO — apenas classes estruturais
<Label className="mb-1">Nome do Campo</Label>
<Label className="block mb-2">Cor do Botão</Label>
<Label className="flex items-center gap-2 cursor-pointer">
  <Switch /> Ativar opção
</Label>

// ✅ Exceção: decorativas (uppercase/tracking) são permitidas
<Label className="uppercase tracking-wide mb-1">URL</Label>

// ❌ ERRADO — sobrescreve token
<Label className="text-sm font-medium text-gray-700">Nome</Label>
<Label className="text-xs font-semibold">Cor</Label>
```

**CSS vars aplicadas automaticamente (via `style` interno):**
```
fontSize:   var(--admin-item-tertiary-size,   0.875rem)
fontWeight: var(--admin-item-tertiary-weight, 500)
color:      var(--admin-item-tertiary-color,  inherit)
```

**Controlado por:** token `item-tertiary` em `/admin/system-manager → Painel Admin → Níveis Tipográficos`.

**Regras:**
- ✅ **SEMPRE** usar `<Label>` para labels de campos em todas as páginas `/admin/*`
- ✅ **NUNCA** adicionar `text-sm`, `font-medium`, `text-gray-*` em `<Label>`
- ✅ **MANTER** apenas classes estruturais: `mb-*`, `block`, `cursor-pointer`, `flex`, `gap-*`
- ✅ **PERMITIDO**: `uppercase tracking-wide` quando for design intencional do label

---

### Padrão de Swatch de Cor Clicável
**Adicionado:** 2026-02-21  
**Usado em:** `ColorTokenEditor`, `ColorSystemCard`, `TypographyTokenEditor`, `IconTokenEditor`

```tsx
{/* ✅ PADRÃO ÚNICO — swatch arredondado + input invisível sobreposto */}
<div className="relative h-10 w-10 flex-shrink-0 cursor-pointer">
  <div
    className="h-10 w-10 rounded-lg border border-gray-200"
    style={{ backgroundColor: hex }}
  />
  <input
    type="color"
    value={hex}
    onChange={(e) => onChange(e.target.value)}
    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
  />
</div>
```

**Tamanhos por contexto:**

| Contexto | Classes |
|---|---|
| Card de lista | `h-10 w-10 rounded-lg` |
| Campo inline | `h-8 w-10 rounded-lg` |

**Regras:**
- ✅ **SEMPRE** usar `rounded-lg` no swatch (não `rounded` nem `rounded-md`)
- ✅ **SEMPRE** usar `absolute inset-0 opacity-0 cursor-pointer w-full h-full` no input
- ✅ **SEMPRE** usar `relative` no container pai
- ❌ **NUNCA** exibir dois seletores lado a lado (swatch visual + input visível)
- ❌ **NUNCA** usar `<input type="color">` com `p-0.5` visível — padrão antigo proibido

---

## 🎨 2. Componentes de Seleção de Cor

### `ColorTokenPicker` — Seletor de Tokens de Cor
**Caminho:** `/src/app/components/ColorTokenPicker.tsx`

```tsx
import { ColorTokenPicker } from '@/app/components/ColorTokenPicker';

<ColorTokenPicker
  value={formData.color_token}          // string | null — UUID do token
  onChange={(id) => setFormData({...formData, color_token: id})}
  label="Cor do Título"
  allowNone={true}                       // permite "sem cor" — padrão: true
  disabled={false}
  layout="default"                       // 'default' | 'horizontal'
/>
```

**Fonte de dados:** `design_tokens` table (category = 'color') — lida via `useDesignTokens('color')`.  
**Salva:** UUID do token no banco — **nunca salva hex diretamente**.  
**Para resolver token → hex:** Use `getColorValue(token)` de `useDesignTokens`.

---

### `useDesignTokens` — Hook de Tokens
**Caminho:** `/src/lib/hooks/useDesignTokens.ts`

```tsx
import { useDesignTokens, getColorValue } from '@/lib/hooks/useDesignTokens';

const { tokens, loading } = useDesignTokens('color');        // cores
const { tokens, loading } = useDesignTokens('typography');   // tipografia
const { tokens, loading } = useDesignTokens('transition');   // transições

// Resolver token para valor CSS:
const hexColor = getColorValue(token);  // ex: '#ea526e'
```

---

## 🔤 3. Componentes de Tipografia

### `TypeScalePicker` — Seletor de Escala Tipográfica
**Caminho:** `/src/app/components/admin/TypeScalePicker.tsx`

```tsx
import { TypeScalePicker } from '@/app/components/admin/TypeScalePicker';

<TypeScalePicker
  value={formData.font_size_token}      // string — UUID do token tipográfico
  onChange={(id) => setFormData({...formData, font_size_token: id})}
  label="Tamanho do Título"
  allowedTypes={['heading-1', 'heading-2', 'heading-3']}  // filtro opcional
  placeholder="Selecione um tamanho"
/>
```

**Fonte de dados:** `design_tokens` table (category = 'typography').  
**Salva:** UUID do token — **nunca salva `px` ou `rem` diretamente**.  
**Fonte exclusiva:** Poppins — nenhuma outra fonte é suportada.

### `ResponsiveText` — Texto com Token Tipográfico (Público)
**Caminho:** `/src/app/components/ResponsiveText.tsx`

```tsx
import { ResponsiveText } from '@/app/components/ResponsiveText';

<ResponsiveText tokenName="heading-1" as="h1">
  Título da Seção
</ResponsiveText>

<ResponsiveText tokenName="menu" as="span">
  Item de Menu
</ResponsiveText>
```

**Quando usar:** Todo texto do site público que deve seguir o Design System.

---

## 🎯 4. Componentes de Ícone

### `IconPicker` — Seletor de Ícone Lucide
**Caminho:** `/src/app/components/admin/IconPicker.tsx`

```tsx
import { IconPicker } from '@/app/components/admin/IconPicker';

<IconPicker
  value={formData.icon}                  // string — nome do ícone ('Heart', 'Star', ...)
  onChange={(iconName) => setFormData({...formData, icon: iconName})}
  label="Ícone"
  placeholder="Selecione um ícone"
/>
```

**Lista disponível:** `/src/lib/constants/lucideIcons.ts` (`AVAILABLE_LUCIDE_ICONS`).  
**Família exclusiva:** Lucide React — nenhuma outra biblioteca de ícones.  
**Salva:** Nome string do ícone (ex: `'Heart'`).

### `getLucideIcon` — Renderizar Ícone por Nome (Utilitário)
**Caminho:** `/src/lib/utils/icons.tsx`

```tsx
import { getLucideIcon } from '@/lib/utils/icons';

// Dentro de componentes:
const icon = getLucideIcon('Heart');               // <Heart className="h-4 w-4" />
const icon = getLucideIcon('Settings', 'h-6 w-6'); // <Settings className="h-6 w-6" />
const icon = getLucideIcon(null);                  // null (sem erro)
```

**Quando usar:** Sempre que precisar renderizar um ícone salvo como string no banco.  
**Não usar:** `(LucideIcons as any)[name]` diretamente em features — use este utilitário.

#### ⚠️ Exceções Legítimas para `import * as LucideIcons`

Os seguintes componentes **precisam** de `import * as LucideIcons` porque instanciam o componente de ícone para passar props dinâmicas (`size`, `style`) que `getLucideIcon` não suporta. Estes usos são aceitos e documentados:

| Arquivo | Motivo |
|---|---|
| `IconPicker.tsx` | Renderiza grid completo de todos os ícones disponíveis |
| `IconPickerGrid.tsx` | Componente base do picker — renderiza N ícones |
| `CompactFieldEditor.tsx` | Preview do ícone selecionado com tamanho customizado |
| `MegamenuContent.tsx` | Renderiza ícones dos cards com `size` e `color` dinâmicos via token |
| `MegamenuCardItem.tsx` | Idem — `size` e `color` vindos do banco |
| `CardRenderer.tsx` | Resolução de ícones com aliases legados e fallbacks |

**Regra:** Todo uso de `(LucideIcons as any)[name]` **fora** destas exceções documentadas deve ser substituído por `getLucideIcon()`.

---

## 📁 5. Componentes de Mídia / Upload

### `MediaUploader` — Upload Inline
**Caminho:** `/src/app/components/admin/MediaUploader.tsx`

```tsx
import { MediaUploader } from '@/app/components/admin/MediaUploader';

<MediaUploader
  label="Mídia (Imagem/Vídeo)"
  value={formData.mediaUrl}
  onChange={(url) => setFormData({...formData, mediaUrl: url})}
  accept="image/*,video/*"
  maxSizeMB={10}
/>
```

**Quando usar:** Campo de mídia dentro de formulários (upload inline, sem modal separado).  
**Bucket:** `make-72da2481-media` — usa Supabase Storage diretamente com signed URLs.  
**Biblioteca:** Grid de thumbnails expansível abaixo do campo.

---

### `MediaPicker` — Seletor de Mídia via Modal
**Caminho:** `/src/app/components/MediaPicker.tsx`

```tsx
import { MediaPicker } from '@/app/components/MediaPicker';

const [pickerOpen, setPickerOpen] = useState(false);

<Button onClick={() => setPickerOpen(true)}>Selecionar Mídia</Button>

<MediaPicker
  open={pickerOpen}
  onOpenChange={setPickerOpen}
  onSelect={(url) => { setMediaUrl(url); setPickerOpen(false); }}
  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
  title="Selecionar Imagem"
  maxSizeMB={20}
/>
```

**Quando usar:** Quando o picker precisa ser aberto via botão separado (não inline).  
**Internamente usa:** `UniversalMediaUpload` + `BaseModal`.

---

### `ImageFieldWithPicker` — Campo URL + Botão de Seleção
**Caminho:** `/src/app/components/ImageFieldWithPicker.tsx`

```tsx
import { ImageFieldWithPicker } from '@/app/components/ImageFieldWithPicker';

<ImageFieldWithPicker
  value={formData.imageUrl}
  onChange={(url) => setFormData({...formData, imageUrl: url})}
  placeholder="https://..."
/>
```

**Quando usar:** Campos onde o usuário pode digitar URL **ou** selecionar da biblioteca.  
**Mostra:** Input de texto + botão "Selecionar" + preview da imagem selecionada.

---

### `ImageUploadOnly` — Upload Sem URL Manual
**Caminho:** `/src/app/components/ImageUploadOnly.tsx`

```tsx
import { ImageUploadOnly } from '@/app/components/ImageUploadOnly';

<ImageUploadOnly
  label="Imagem do Logo"
  helperText="Recomendado: 200×60px, fundo transparente"
  value={logoUrl}
  onChange={(url) => setLogoUrl(url)}
/>
```

**Props:** `value`, `onChange`, `label?`, `helperText?`, `className?`  
**Quando usar:** Quando não se quer oferecer input de URL manual — apenas upload/seleção via `MediaPicker`.

---

### `UniversalMediaUpload` — Componente Base de Upload
**Caminho:** `/src/app/components/UniversalMediaUpload.tsx`

**USO INTERNO** — componente base usado pelo `MediaPicker`.  
**Não instanciar diretamente** em features — use `MediaPicker` ou `MediaUploader`.

---

## 🔘 6. Componentes de Campos de Design

### `RadiusPicker` — Seletor de Border-Radius
**Caminho:** `/src/app/components/admin/RadiusPicker.tsx`

```tsx
import { RadiusPicker } from '@/app/components/admin/RadiusPicker';

<RadiusPicker
  value={formData.radius_token}
  onChange={(id) => setFormData({...formData, radius_token: id})}
  label="Arredondamento"
/>
```

**Padrão recomendado:** Token `2xl` (1.5rem / 24px) para cards e modais.

---

### `TransitionPicker` — Seletor de Transição/Animação
**Caminho:** `/src/app/components/admin/TransitionPicker.tsx`

```tsx
import { TransitionPicker } from '@/app/components/admin/TransitionPicker';

<TransitionPicker
  value={formData.transition_token}
  onChange={(id) => setFormData({...formData, transition_token: id})}
  label="Velocidade da Animação"
/>
```

**Preview:** Animação ao passar mouse sobre as opções.

---

### `AlignXYControl` — Controle de Alinhamento X/Y
**Caminho:** `/src/app/components/admin/AlignXYControl.tsx`

```tsx
import { AlignXYControl } from '@/app/components/admin/AlignXYControl';

<AlignXYControl
  valueX={config.media?.alignX ?? 'center'}   // string — valor atual horizontal
  valueY={config.media?.alignY ?? 'middle'}   // string — valor atual vertical
  onChangeX={(v) => onUpdateConfig('media', { ...config.media, alignX: v })}
  onChangeY={(v) => onUpdateConfig('media', { ...config.media, alignY: v })}
  labelX="Alinhamento Horizontal"   // opcional
  labelY="Alinhamento Vertical"     // opcional
/>
```

**Props corretas:** `valueX`/`valueY` (não `alignX`/`alignY`).  
**Valores padrão:** horizontal: `left/center/right`; vertical: `top/middle/bottom`.

---

### `OpacitySlider` — Controle de Opacidade
**Caminho:** `/src/app/components/admin/OpacitySlider.tsx`

```tsx
import { OpacitySlider } from '@/app/components/admin/OpacitySlider';

<OpacitySlider
  value={template.media_opacity}     // 0–100
  onChange={(v) => update({ media_opacity: v })}
  label="Opacidade da Mídia"
/>
```

---

### `MediaFitModePicker` — Seletor de Modo de Exibição de Mídia
**Caminho:** `/src/app/components/admin/MediaFitModePicker.tsx`

```tsx
import { MediaFitModePicker } from '@/app/components/admin/MediaFitModePicker';

<MediaFitModePicker
  value={config.media?.fitMode}
  onChange={(mode) => update({ media: { ...config.media, fitMode: mode }})}
/>
```

**Modos:** `cobrir` | `ajustada` | `contida` | `adaptada` | `alinhada`.

---

### `CornerPositionSelector` — Seletor de Posição no Grid 2×2
**Caminho:** `/src/app/components/admin/CornerPositionSelector.tsx`

```tsx
import { CornerPositionSelector } from '@/app/components/admin/CornerPositionSelector';

<CornerPositionSelector
  title="Posição do Texto"
  value={layout?.desktop?.text}        // aceita string ou { position: string }
  onChange={(pos) => updateLayout({ desktop: { ...layout.desktop, text: pos }})}
/>
```

---

## 🔵 7. Componentes de Botão

### `ResponsiveButton` — Botão do Site Público
**Caminho:** `/src/app/components/ResponsiveButton.tsx`

```tsx
import { ResponsiveButton, PrimaryButton } from '@/app/components/ResponsiveButton';

// Botão com variante e ícones:
<ResponsiveButton
  variant="outline"           // 'default' | 'outline' | 'ghost' | 'link'
  size="md"                   // 'sm' | 'md' | 'lg'
  leftIcon={getLucideIcon('ArrowRight')}
  rightIcon={getLucideIcon('ExternalLink')}
  onClick={handleClick}
>
  Saiba Mais
</ResponsiveButton>

// Atalho para botão primário:
<PrimaryButton>Falar com a Gente</PrimaryButton>
```

**Quando usar:** TODO botão no site público. Nunca usar `<button>` plain no site público.  
**Cores:** Vêm do Design System — **nunca hardcode**.

---

### `Button` do shadcn/ui — Botão do Painel Admin
**Caminho:** `/src/app/components/ui/button.tsx`

```tsx
import { Button } from '@/app/components/ui/button';

<Button variant="outline" size="sm" onClick={handleClick}>
  Ação
</Button>
```

**Quando usar:** Botões dentro do painel `/admin/*`.  
**Variantes:** `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`.

---

### `AdminPrimaryButton` — Botão CTA Primário do Painel
**Caminho:** `/src/app/components/admin/AdminPrimaryButton.tsx`

```tsx
import { AdminPrimaryButton } from '@/app/components/admin/AdminPrimaryButton';

// No headerActions de AdminPageLayout:
<AdminPageLayout
  headerActions={
    <AdminPrimaryButton onClick={handleCreate}>
      <Plus className="h-4 w-4 mr-2" /> Nova Seção
    </AdminPrimaryButton>
  }
/>

// Com loading:
<AdminPrimaryButton disabled={saving} onClick={handleSave}>
  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
  Salvar
</AdminPrimaryButton>
```

**Tokens usados:**
- `--admin-btn-primary-bg` → fundo normal
- `--admin-btn-primary-text` → cor do texto/ícone
- `--admin-btn-primary-hover-bg` → fundo no hover

**Regras:**
- ✅ **SEMPRE** usar no lugar de `<Button className="bg-primary hover:bg-primary/90">`
- ✅ Aceita todas as props do `Button` shadcn/ui
- ❌ **NUNCA** usar `bg-primary` hardcoded em botões de ação primária do painel

---

### `AdminDropdownMenu` — Menu de Ações Tokenizado
**Caminho:** `/src/app/components/admin/AdminDropdownMenu.tsx`  
**Adicionado:** 2026-02-21 (v1.14)

```tsx
import { AdminDropdownMenu } from '@/app/components/admin/AdminDropdownMenu';
import { Edit, Copy, Trash2 } from 'lucide-react';

// Em grids (sections-manager, cards-manager):
<AdminDropdownMenu
  actions={[
    { label: 'Editar',    icon: <Edit />,   onClick: () => handleEdit(item) },
    { label: 'Duplicar',  icon: <Copy />,   onClick: () => handleDuplicate(item) },
    { label: 'Excluir',   icon: <Trash2 />, onClick: () => handleDelete(item), variant: 'destructive' },
  ]}
/>

// Com alinhamento customizado:
<AdminDropdownMenu actions={actions} align="start" />

// Com trigger customizado:
<AdminDropdownMenu actions={actions} trigger={<Settings className="h-4 w-4" />} />
```

**Props:**
| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `actions` | `AdminDropdownAction[]` | — | Lista de ações do menu |
| `align` | `'start' \| 'center' \| 'end'` | `'end'` | Alinhamento do painel |
| `trigger` | `ReactNode?` | `<MoreVertical>` | Substitui o ícone padrão |

**Interface `AdminDropdownAction`:**
```typescript
{
  label: string;
  icon?: ReactElement;     // Cor aplicada automaticamente via cloneElement
  onClick: () => void;
  variant?: 'default' | 'destructive';  // destructive usa delete-btn-* tokens
}
```

**Tokens consumidos:**
- `dropdown-bg`, `dropdown-border` → fundo e borda do painel
- `dropdown-item-text-*` → tipografia dos itens
- `dropdown-item-icon-*` → ícones dos itens normais
- `dropdown-item-hover-bg` → hover dos itens normais
- `dropdown-trigger-hover-bg` → hover do botão trigger
- `delete-btn-text`, `delete-btn-hover-bg` → itens `variant="destructive"`

**Regras:**
- ✅ **SEMPRE** usar em grids admin (sections-manager, cards-manager) em vez de `DropdownMenu` direto
- ✅ Ícones do item são estilizados automaticamente via `cloneElement` (não passar `className` no ícone)
- ❌ **NUNCA** importar `DropdownMenu` de `ui/dropdown-menu.tsx` em features — usar este wrapper

---

### `TabSectionHeader` — Cabeçalho de Aba
**Caminho:** `/src/app/components/admin/TabSectionHeader.tsx`

```tsx
import { TabSectionHeader } from '@/app/components/admin/TabSectionHeader';
import { Palette, Settings, List } from 'lucide-react';

// Uso básico (título com ícone tokenizado):
<TabSectionHeader
  icon={<Palette />}
  title="Paleta de Cores"
/>

// Dentro do conteúdo de uma aba:
const colorsTabContent = (
  <div className="space-y-6">
    <TabSectionHeader icon={<Palette />} title="Paleta de Cores" />
    {/* ... campos */}
  </div>
);
```

**Tokens aplicados automaticamente:**
- `section-header` → tamanho/peso/cor do `<h3>`
- `section-header-icon` → tamanho/cor do ícone

**Regras:**
- ✅ **SEMPRE** usar este componente no início do conteúdo de TODA aba admin
- ✅ Ícone estilizado automaticamente — não passar `className` no ícone
- ❌ **NUNCA** criar `<h3 className="flex items-center gap-2">` manual — usar este componente
- ℹ️ `subtitle` está deprecated — não usar

---

## 🗂️ 6b. Controles de Seção Admin

### `SectionBuilder` — Editor de Estrutura de Seção
**Caminho:** `/src/app/admin/sections-manager/SectionBuilder.tsx`

Componente de configuração completa de uma seção (elementos, layout, styling).  
**Usado em:** `CreateSectionModal` e `UnifiedSectionConfigModal`.

```tsx
import { SectionBuilder } from '@/app/admin/sections-manager/SectionBuilder';

<SectionBuilder
  elements={elements}
  layout={layout}
  styling={styling}
  initialElements={section.elements}
  initialLayout={section.layout}
  initialStyling={section.styling}
  onChange={(newElements, newLayout, newStyling) => {
    setElements(newElements);
    setLayout(newLayout);
    setStyling(newStyling);
  }}
/>
```

**Seções exibidas:** Elementos da Seção (toggles), Grid (1/2 cols, 1/2 linhas), Configuração de Mídia.

---

### `GridLayoutEditor` — Editor Visual de Grid
**Caminho:** `/src/app/admin/sections-manager/GridLayoutEditor.tsx`

Editor visual de posicionamento dos elementos (texto, mídia, cards) no grid 2×2.

```tsx
import { GridLayoutEditor } from '@/app/admin/sections-manager/GridLayoutEditor';

<GridLayoutEditor
  elements={{ hasText: true, hasMedia: true, hasCards: false, mediaType: 'image' }}
  layout={{ text: 'top-left', media: 'top-right' }}
  onChange={(newLayout) => setLayout(newLayout)}
/>
```

**Posições válidas:** `top-left`, `top-center`, `top-right`, `middle-left`, `center`, `middle-right`, `bottom-left`, `bottom-center`, `bottom-right`.  
**Aceita:** String direta ou objeto `{ position: string }`.

---

### `CompactFieldEditor` — Campos Compactos de Seção
**Caminho:** `/src/app/admin/sections-manager/CompactFieldEditor.tsx`

Conjunto de sub-componentes para edição inline de campos de seção:

| Sub-componente | Props chave | Uso |
|---|---|---|
| `IconField` | `icon`, `iconColor`, `iconSize`, `onIconChange`, `onColorChange`, `onSizeChange` | Campo de ícone com cor e tamanho |
| `TextField` | `value`, `placeholder`, `fontSize`, `onValueChange`, `onFontChange?` | Campo de texto com seletor de fonte opcional |
| `TitleField` | `text`, `fontSize`, `fontWeight`, `colorToken`, `onTextChange`, `onFontChange`, `onWeightChange`, `onColorChange` | Campo de título com tipografia completa |
| `ButtonField` | `label`, `url`, `onLabelChange`, `onUrlChange` | Campo de botão CTA |

---

### `SectionHeightAndAlignmentControls` — Altura e Espaçamento
**Caminho:** `/src/app/admin/pages-manager/SectionHeightAndAlignmentControls.tsx`

```tsx
import { SectionHeightAndAlignmentControls } from '@/app/admin/pages-manager/SectionHeightAndAlignmentControls';

<SectionHeightAndAlignmentControls
  config={sectionConfig}
  hasMedia={elements.hasMedia}
  hasCards={elements.hasCards}
  onUpdateConfig={(key, value) => updateConfigField(key, value)}
/>
```

**Controles incluídos:** Altura (auto/25vh/50vh/100vh), padding top/bottom/left/right (0–200px × 25px), gap entre colunas/linhas, modo de mídia (`MediaFitModePicker`), alinhamento XY (`AlignXYControl`).

---

### `SectionLayoutControls` — Template e Botão
**Caminho:** `/src/app/admin/pages-manager/SectionLayoutControls.tsx`

```tsx
import { SectionLayoutControls } from '@/app/admin/pages-manager/SectionLayoutControls';

<SectionLayoutControls
  config={sectionConfig}
  hasMedia={elements.hasMedia}
  hasCards={elements.hasCards}
  hasButton={elements.hasButton}
  onUpdateConfig={updateConfigField}
  selectedTemplateId={selectedTemplateId}
  cardTemplates={cardTemplates}
  onTemplateChange={handleTemplateChange}
  pages={pages}
  selectedPageId={selectedPageId}
  pageSections={pageSections}
  selectedSectionId={selectedSectionId}
  onPageIdChange={setSelectedPageId}
  onSectionIdChange={setSelectedSectionId}
/>
```

**Controles incluídos:** Seletor de template de cards, URL do botão CTA com seleção de página/âncora, modo de mídia e alinhamento.

---

### `DraggableSectionItem` — Item de Seção na Página
**Caminho:** `/src/app/admin/pages-manager/DraggableSectionItem.tsx`

```tsx
import { DraggableSectionItem } from '@/app/admin/pages-manager/DraggableSectionItem';

<DraggableSectionItem
  section={pageSection}
  index={index}
  totalSections={pageSections.length}
  onEdit={() => openConfigModal(pageSection)}
  onDelete={() => setToDelete(pageSection)}
  onMoveUp={() => moveSection(index, 'up')}
  onMoveDown={() => moveSection(index, 'down')}
/>
```

**Funcionalidades:** Exibição do nome/tipo da seção, botões ↑↓ reordenação, botão Editar, botão Excluir (tokenizado via `delete-btn-*`).

---

### `PageAnchorPicker` — Seletor de Página e Âncora
**Caminho:** `/src/app/components/PageAnchorPicker.tsx`

```tsx
import { PageAnchorPicker } from '@/app/components/PageAnchorPicker';

<PageAnchorPicker
  value={config.ctaUrl}
  onChange={(url) => updateConfigField('ctaUrl', url)}
  label="URL do Botão"
/>
```

**Quando usar:** Campo de URL de botão CTA — permite navegação interna (página ou âncora) ou URL externa.  
**Fonte de dados:** Busca páginas e seções do Supabase.

---

## 🔀 15. Padrões de Reordenação de Listas (3.2)

### Regra oficial: ChevronUp / ChevronDown

O padrão de reordenação do projeto é **sempre** usar botões `ChevronUp`/`ChevronDown`, nunca drag-and-drop via `react-dnd`.

**Motivo:** Consistência entre todas as páginas admin. O drag-and-drop via `react-dnd` foi removido do `TypographyManager` em 2026-02-20 por ser o único outlier.

**Padrão de implementação:**

```tsx
// ✅ Estado local (cópia mutable da lista)
const [localItems, setLocalItems] = useState(items);

// ✅ Sincronizar quando prop muda
useEffect(() => { setLocalItems(items); }, [items]);

// ✅ Funções de reordenação
const handleMoveUp = (index: number) => {
  if (index === 0) return;
  const updated = [...localItems];
  [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
  setLocalItems(updated);
  onReorder(updated); // persistir imediatamente
};

const handleMoveDown = (index: number) => {
  if (index === localItems.length - 1) return;
  const updated = [...localItems];
  [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
  setLocalItems(updated);
  onReorder(updated);
};

// ✅ Botões na linha da lista
<div className="flex flex-col gap-0.5">
  <button
    onClick={() => handleMoveUp(index)}
    disabled={index === 0 || saving}
    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
    style={{ transition: 'none' }}
    title="Mover para cima"
  >
    <ChevronUp className="h-4 w-4 text-gray-500" />
  </button>
  <button
    onClick={() => handleMoveDown(index)}
    disabled={index === localItems.length - 1 || saving}
    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
    style={{ transition: 'none' }}
    title="Mover para baixo"
  >
    <ChevronDown className="h-4 w-4 text-gray-500" />
  </button>
</div>
```

**Páginas que seguem este padrão:**
- `menu-manager/page.tsx` — itens do menu
- `footer-manager/page.tsx` — colunas e links
- `TypographyManager.tsx` — tokens de tipografia

**Regras obrigatórias:**

✅ **SEMPRE** usar ChevronUp/ChevronDown para reordenação  
✅ **SEMPRE** desabilitar o botão Up no index 0 e Down no último  
✅ **SEMPRE** adicionar `style={{ transition: 'none' }}` nos botões  
✅ **SEMPRE** persistir a nova ordem imediatamente via `onReorder`  
❌ **NUNCA** usar `react-dnd` em páginas admin  
❌ **NUNCA** usar `GripVertical` sem botões funcionais (ícone decorativo confunde)

---

## 🖱️ 16. Padrões de Botões por Contexto (3.3)

### Tabela de contextos

| Contexto | Formato | Variante | Tamanho | Exemplo |
|---|---|---|---|---|
| **Header da página** (acção primária de criar) | ícone + texto | `default` ou `bg-primary` | `default` | `<Plus /> Criar Seção` |
| **Header da página** (acção secundária) | ícone + texto | `outline` | `default` | `<Eye /> Preview` |
| **Header da página** (guardar alterações) | `UnsavedHeaderActions` | — | — | Ver componente |
| **Linha de lista** (editar/duplicar/excluir) | ícone apenas | `ghost` | `sm` (h-8 w-8 p-0) | `AdminActionButtons` |
| **Header de secção dentro de tab** (adicionar sub-item) | ícone + texto | `default` | `sm` | `<Plus /> Adicionar Coluna` |
| **Dentro de linha de lista** (acção inline destrutiva) | ícone apenas | `ghost` com `text-red-600` | `sm` (h-8 w-8 p-0) | `<Trash2 />` |
| **Dentro de linha de lista** (acção inline neutra) | ícone apenas | `ghost` | `sm` (h-8 w-8 p-0) | `<Pencil />` |
| **Footer de modal** (acção primária) | texto | `default` ou `bg-primary` | `default` | `Salvar` |
| **Footer de modal** (acção secundária) | texto | `outline` | `default` | `Cancelar` |
| **Dropdown de acções** (MoreVertical trigger) | ícone apenas | `ghost` | `sm` (h-8 w-8 p-0) | `<MoreVertical />` |

### Regras obrigatórias

✅ **SEMPRE** usar `AdminActionButtons` para editar/duplicar/excluir em linhas de lista  
✅ **SEMPRE** usar `UnsavedHeaderActions` para estado de "guardar pendente" nas páginas  
✅ **SEMPRE** usar `ConfirmDeleteDialog` (nunca `window.confirm`) para exclusões  
✅ **SEMPRE** `style={{ transition: 'none' }}` em botões com `hover:*` classes  
✅ **SEMPRE** texto + ícone para botões no header da página (acções primárias visíveis)  
✅ **SEMPRE** ícone apenas para acções inline dentro de listas (não poluir visualmente)  
❌ **NUNCA** misturar formatos no mesmo contexto (ex: alguns icon-only, outros text+icon na mesma lista)  
❌ **NUNCA** criar botões de acção inline fora do `AdminActionButtons` sem razão documentada  
❌ **NUNCA** usar `size="icon"` + texto (contradição de tamanho)

### AdminGridCard — Card de Grelha Visual

**Caminho:** `/src/app/components/admin/AdminGridCard.tsx`

```tsx
import { AdminGridCard } from '@/app/components/admin/AdminGridCard';

<AdminGridCard
  preview={<Layout className="h-12 w-12 text-white opacity-50" />}
  badge={
    <span
      className="px-2 py-1 rounded"
      style={{
        fontSize: 'var(--admin-badge-label-size, 0.75rem)',
        fontWeight: 'var(--admin-badge-label-weight, 500)',
        color: 'var(--admin-badge-label-color, #ffffff)',
        backgroundColor: item.published
          ? 'var(--primary, #ea526e)'
          : 'var(--admin-field-placeholder, #9ca3af)',
      }}
    >
      {item.published ? 'Publicado' : 'Rascunho'}
    </span>
  }
  name={item.name}
  meta={
    <>
      <p className="text-xs text-gray-500 mt-0.5">{typeInfo?.label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{thirdLine}</p>
    </>
  }
  actions={<AdminDropdownMenu actions={[...]} />}
/>
```

**Quando usar:** Grelhas visuais de biblioteca — `sections-manager` e `cards-manager`.  
**Garante:** `bg-white · border-2 border-gray-200 · rounded-xl · overflow-hidden · transition:none` em ambas as páginas.  
**Props:** `preview` (área preta aspect-video), `badge?` (sobreposto top-right), `name`, `meta?`, `actions`.  
**Badge:** ⚠️ **SEMPRE renderizar** — nunca usar `condition && <span>`. Usar `style` com tokens: `var(--primary)` para "Publicado", `var(--admin-field-placeholder)` para "Rascunho" (ver Guidelines §7.3).  
**Meta:** Padrão de **3 linhas** — linha 1 = nome (prop `name`), linha 2 = tipo/variante, linha 3 = info complementar (contagens, global/local, etc.).  
**Nunca duplicar:** Se precisar de uma grelha nova, usar este componente.

---

## 🗂️ 8. Componentes de Menu / Megamenu

### `MegamenuContent` — Conteúdo do Megamenu (Público + Admin Preview)
**Caminho:** `/src/app/components/megamenu/MegamenuContent.tsx`

```tsx
import { MegamenuContent } from '@/app/components/megamenu/MegamenuContent';

// No Header público (com navegação):
<MegamenuContent
  config={item.megamenu_config as any}   // megamenu_config do menu_item
  cards={allCards}                        // MenuCard[] — todos os cards do banco
  onCardClick={(url) => navigate(url)}    // callback de navegação
/>

// No HeaderPreview admin (sem navegação):
<MegamenuContent
  config={item.megamenu_config as any}
  cards={allCards}
  // onCardClick omitido → cards não são clicáveis no preview
/>
```

**Props:**
| Prop | Tipo | Descrição |
|---|---|---|
| `config` | `MegamenuConfig` | Objeto `megamenu_config` do `menu_item` |
| `cards` | `MenuCard[]` | Lista completa de cards (filtrada internamente por `card_ids`) |
| `onCardClick` | `(url: string) => void` | Opcional — omitir no preview admin |

**Estrutura do `MegamenuConfig`:**
```typescript
type MegamenuConfig = {
  enabled: boolean;
  bgColor?: string;               // Hex — cor de fundo do painel
  mediaPosition?: 'left' | 'right';
  columns?: MegamenuColumn[];     // Máx. 4 colunas
  footer?: { text: string; url: string; };
};
```

**Regras:**
- ✅ **SEMPRE** usar este componente tanto no Header público quanto no HeaderPreview
- ✅ Resolve `card_ids` → cards reais internamente (filtra de `cards` prop)
- ❌ **NUNCA** duplicar a lógica de renderização do megamenu em outro componente

---

### `MegamenuCardItem` — Card Individual do Megamenu
**Caminho:** `/src/app/components/megamenu/MegamenuCardItem.tsx`

```tsx
import { MegamenuCardItem } from '@/app/components/megamenu/MegamenuCardItem';

// Normalmente usado por MegamenuContent internamente.
// Pode ser usado diretamente quando necessário:
<MegamenuCardItem
  card={menuCard}                          // MenuCardData
  onClick={() => navigate(card.url ?? '/')} // opcional
/>
```

**Renderiza:** ícone (`getLucideIcon`), título, subtítulo — todos com tokens de cor do DS.  
**Clicável:** Quando `onClick` é fornecido — cursor-pointer + handler.  
**Substitui:** `renderCard()` que era duplicado em `Header.tsx` e `HeaderPreview.tsx`.

---

### `MegamenuConfigurator` — Editor Visual do Megamenu
**Caminho:** `/src/app/admin/menu-manager/MegamenuConfigurator.tsx`

Componente de preview interativo do megamenu com edição inline via modais.

```tsx
// Usado internamente pelo MenuItemEditorModal — não instanciar diretamente.
```

**Funcionalidades:**
- Preview fiel do megamenu (usa `MegamenuContent`)
- Clique em qualquer elemento abre modal de edição específico
- Edição de título pequeno, título principal, mídia (Unsplash), cards (ícone/título/subtítulo)
- Salva diretamente no banco via `menu_items.update` e `menu_cards.update`

**Modais internos (em `MegamenuEditModals.tsx`):**
| Modal | Elemento editável |
|---|---|
| `EditTextModal` | Título pequeno, título principal |
| `EditMediaModal` | Imagem da coluna (busca Unsplash) |
| `EditCardIconModal` | Ícone + tamanho + cor do card |
| `EditCardTextModal` | Texto + fonte + peso + cor + URL do card |

---

### `MegamenuCardsTab` — Aba de Cards do Megamenu
**Caminho:** `/src/app/admin/menu-manager/MegamenuCardsTab.tsx`

Gerencia a lista de `menu_cards` globais — criação, edição, exclusão.  
**Usado como aba "Cards"** dentro de `/admin/menu-manager`.

---

### `useMenuHover` — Hook de Hover com Grace Period
**Caminho:** `/src/lib/hooks/useMenuHover.ts`

```tsx
import { useMenuHover } from '@/lib/hooks/useMenuHover';

// Na raiz do Header / HeaderPreview:
const { hoveredItem, openItem, scheduleClose, clearTimer, closeImmediate } = useMenuHover(1000);

// Ao entrar em um item de menu:
onMouseEnter={() => {
  openItem(item.id);      // abre imediatamente + cancela qualquer timer pendente
}}

// Ao sair de um item de menu:
onMouseLeave={() => {
  scheduleClose(item.id); // agenda fechamento após 1000ms (cancelável)
}}

// Ao entrar no painel do megamenu:
onMouseEnter={() => clearTimer()} // cancela o fechamento agendado

// Verificar se item está aberto:
const isOpen = hoveredItem === item.id;
```

**API:**
| Função | Descrição |
|---|---|
| `openItem(id)` | Abre o megamenu do item — cancela timer pendente |
| `scheduleClose(id)` | Agenda fechamento após N ms (passado no construtor) |
| `clearTimer()` | Cancela timer pendente (usar no `onMouseEnter` do megamenu) |
| `closeImmediate()` | Fecha imediatamente sem timeout |
| `hoveredItem` | ID do item atualmente aberto — `null` se nenhum |

**Por que 1000ms:** Permite ao usuário mover o mouse lentamente do botão para o painel sem fechar.  
**Regra:** `Header.tsx` e `HeaderPreview.tsx` devem usar **exatamente o mesmo hook** — nunca reimplementar a lógica de timeout.

---

## 🏠 9. Componentes de Header

### `Header` — Header Público
**Caminho:** `/src/app/public/components/Header.tsx`

Componente auto-suficiente — carrega todos os dados do Supabase internamente.

**Fontes de dados:**
- `site_config` → logo (texto + URL de imagem), botão CTA, sticky mode
- `menu_items` → itens do menu (order, label, icon, megamenu_config)
- `menu_cards` → cards para os megamenus

**Dependências internas:**
- `useMenuHover(1000)` — hover com 1000ms de grace period
- `MegamenuContent` — renderiza o painel do megamenu
- `MegamenuCardItem` — renderiza cards no menu mobile
- `ResponsiveButton` — botão CTA do header
- `ResponsiveText` — labels dos itens de menu
- `getLucideIcon()` — ícones dos itens

**Comportamentos:**
- Desktop: menu horizontal com megamenus em `position: fixed`
- Mobile: hambúrguer → drawer lateral com itens empilhados
- Sticky: aplica `position: sticky top-0 z-50` quando configurado em `site_config`

**Regras:**
- ✅ **NUNCA** duplicar lógica de carregamento de menu — este componente é a única fonte
- ✅ **SEMPRE** atualizar `HeaderPreview` junto quando a estrutura mudar
- ❌ **NUNCA** passar dados por props — o Header carrega seus próprios dados

---

### `HeaderPreview` — Preview do Header no Admin
**Caminho:** `/src/app/admin/menu-manager/HeaderPreview.tsx`

```tsx
import { HeaderPreview } from '@/app/admin/menu-manager/HeaderPreview';

<HeaderPreview
  menuItems={menuItems}       // MenuItem[] — do estado do page.tsx
  allCards={allCards}         // MenuCard[] — do estado do page.tsx
  logoText={config.logoText}  // string — texto do logo
  logoUrl={config.logoUrl}    // string — URL da imagem do logo
/>
```

**Fidelidade obrigatória ao Header público:**
| Elemento | Regra |
|---|---|
| Cores de fundo | Tokens via `useDesignSystem()` |
| Links | Texto simples — sem ícone de corrente |
| Ícones sociais | `getLucideIcon()` — mesma lógica do público |
| CTA button | `ResponsiveButton` — mesmo componente do público |
| Megamenu | `MegamenuContent` — mesmo componente do público |
| Hover behavior | `useMenuHover(1000)` — mesmo hook do público |

**Regras:**
- ✅ **SEMPRE** usar os mesmos componentes internos que o `Header` público
- ✅ Recebe dados por props (não busca do Supabase diretamente)
- ❌ **NUNCA** divergir estruturalmente do Header público sem documentar

---

## 🦶 10. Componentes de Footer

### `Footer` — Footer Público
**Caminho:** `/src/app/public/components/Footer.tsx`

Componente auto-suficiente — carrega dados de `site_config.footer` do Supabase.

**Estrutura do `site_config.footer` (JSONB):**
```typescript
type FooterConfig = {
  copyright?: string;           // Texto de copyright
  columns?: FooterColumn[];     // Colunas de links
  social?: SocialLink[];        // Links de redes sociais
};

type FooterColumn = {
  id: string;
  title: string;
  links: { id: string; label: string; url: string; }[];
};

type SocialLink = {
  id: string;
  platform: string;
  icon: string;       // Nome do ícone Lucide
  url: string;
};
```

**Dependências internas:**
- `getLucideIcon()` — ícones de redes sociais
- `useDesignSystem()` — cores via tokens
- `ResponsiveText` — textos com tokens tipográficos

**Regras:**
- ✅ **SEMPRE** usar `getLucideIcon()` para ícones sociais — **nunca** `LucideIcons[name]` diretamente
- ✅ Colunas e ícones vêm do banco — editáveis em `/admin/footer-manager`
- ✅ Normalizar IDs ao carregar do banco (ver §1 das Guidelines — normalização de dados)

---

## 🍞 11. Toast / Notificações

### `toast` do Sonner
**Importação:** `import { toast } from 'sonner';`

```tsx
toast.success('Card salvo com sucesso!');
toast.error('Erro ao salvar. Tente novamente.');
toast.warning('Alterações não salvas!');
toast.info('Carregando...');

// Com ícone:
toast.success('Card criado!', {
  icon: <CheckCircle className="h-4 w-4" />,
});
```

**Quando usar:** Toda notificação de sucesso/erro após operações assíncronas.  
**Não usar:** `window.alert()` (proibido) nem `AlertMessageDialog` para notificações de sucesso — toast é suficiente.  
**`AlertMessageDialog` é para:** Mensagens que requerem leitura consciente do usuário (validações bloqueantes).

**Tabela de uso por tipo de feedback:**

| Situação | Componente correto |
|---|---|
| Salvo com sucesso | `toast.success('...')` |
| Erro de rede / banco | `toast.error('...')` |
| Validação bloqueante (campo obrigatório) | `AlertMessageDialog` |
| Confirmação de exclusão | `ConfirmDeleteDialog` |
| Confirmação de ação irreversível | `ConfirmDialog` |
| Aviso de alterações não salvas ao fechar modal | `hasUnsavedChanges` no `BaseModal` |

---

### `Toaster` — Componente de Montagem
**Caminho:** `/src/app/components/ui/sonner.tsx`

```tsx
// ✅ Já montado em /src/app/App.tsx — não instanciar novamente
import { Toaster } from '@/app/components/ui/sonner';

// Na raiz do app:
<Toaster />
```

**CSS vars customizadas no componente:**
```
--normal-bg      → var(--popover)
--normal-text    → var(--popover-foreground)
--normal-border  → var(--border)
```

**Regras:**
- ✅ **NUNCA** adicionar `<Toaster />` em páginas individuais — já está na raiz
- ✅ **SEMPRE** importar `toast` de `'sonner'` (função, não do wrapper)
- ❌ **NUNCA** usar `react-hot-toast`, `react-toastify` ou similar — sonner é a única biblioteca de toast do projeto

---

## 🪝 12. Hooks Utilitários

### `useUnsavedChangesGuard`
**Caminho:** `/src/lib/hooks/useUnsavedChangesGuard.ts`

```tsx
const { hasUnsavedChanges, setUnsavedChanges, markAsSaved } = useUnsavedChangesGuard();

// Marcar como modificado:
setUnsavedChanges(true);

// Marcar como salvo:
markAsSaved();

// ou:
setUnsavedChanges(false);
```

**Quando usar:** Páginas (não modais) com estado de "salvar pendente" — ex: `footer-manager`, `menu-manager`.  
**Em modais:** Use a prop `hasUnsavedChanges` do `BaseModal` — não use este hook dentro de modais.

### `useConfirmDialog`
**Caminho:** `/src/lib/hooks/useConfirmDialog.ts`

```tsx
const { isOpen, confirm, handleConfirm, handleCancel } = useConfirmDialog();

async function handleDelete() {
  const confirmed = await confirm();
  if (confirmed) {
    await deleteItem();
  }
}
```

**Alternativa a:** Gerenciar estado manual de `open` + `ConfirmDialog`.

---

## 🌐 13. Componentes de Layout Público

### `SectionRenderer`
**Caminho:** `/src/app/public/components/SectionRenderer.tsx`

Renderizador principal de seções — nunca duplicar lógica de renderização.  
Gerencia: grid, mídia, cards, filtros, posicionamento, espaçamento.

### `CardRenderer`
**Caminho:** `/src/app/public/components/CardRenderer.tsx`

Renderiza cards individuais de templates — sempre usar este componente.

### `ResponsiveContainer`, `ResponsiveCard`, `ResponsiveSection`, `ResponsiveImage`
**Caminho:** `/src/app/components/Responsive*.tsx`

Containers responsivos — usar em novas seções públicas.

---

## 🧭 14. Utilitários de Design Tokens no Site Público

### `useDesignSystem` — Context do Design System Público
**Caminho:** `/src/lib/contexts/DesignSystemContext.tsx`

```tsx
import { useDesignSystem } from '@/lib/contexts/DesignSystemContext';

const { getColor, getTypography, getSpacing, isMobile, isTablet, isDesktop } = useDesignSystem();

const primaryColor = getColor('primary');  // '#ea526e'
const h1Style = getTypography('heading-1');
```

**Quando usar:** Qualquer componente do site público que precisa de tokens dinâmicos.  
**Não usar no admin:** O admin usa tokens estáticos do CSS + `useDesignTokens`.

---

## 📋 17. Primitivas UI (shadcn/ui) — Campos de Formulário

Estas primitivas são usadas diretamente em todas as páginas admin. São a Camada 1 do sistema.

| Primitiva | Caminho | Quando usar |
|---|---|---|
| `Input` | `/src/app/components/ui/input.tsx` | Campo de texto de linha única |
| `Textarea` | `/src/app/components/ui/textarea.tsx` | Campo de texto multilinha |
| `Select` + `SelectItem` | `/src/app/components/ui/select.tsx` | Dropdown de seleção (use `style` para tokens — não Tailwind) |
| `Switch` | `/src/app/components/ui/switch.tsx` | Toggle on/off |
| `Checkbox` | `/src/app/components/ui/checkbox.tsx` | Caixa de seleção |
| `Slider` | `/src/app/components/ui/slider.tsx` | Deslizador de valor numérico |
| `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent` | `/src/app/components/ui/tabs.tsx` | Sistema de abas (tokens via `AdminPageLayout`) |
| `Collapsible` + `CollapsibleTrigger` + `CollapsibleContent` | `/src/app/components/ui/collapsible.tsx` | Seção expansível (tokens `collapsible-*`) |
| `Popover` + `PopoverContent` + `PopoverTrigger` | `/src/app/components/ui/popover.tsx` | Painel flutuante (usado em pickers) |
| `Separator` | `/src/app/components/ui/separator.tsx` | Linha divisória (tokenizado via `sidebar-separator`) |
| `Badge` | `/src/app/components/ui/badge.tsx` | Rótulo de status (preferir `style` com tokens a esta primitiva) |
| `Card` + `CardHeader` + `CardContent` | `/src/app/components/ui/card.tsx` | Card estrutural (preferir `style` com `--admin-card-*` tokens) |
| `Tooltip` + `TooltipContent` | `/src/app/components/ui/tooltip.tsx` | Dica ao passar o mouse |
| `DropdownMenu` | `/src/app/components/ui/dropdown-menu.tsx` | Menu de ações (MoreVertical em grids) |
| `ScrollArea` | `/src/app/components/ui/scroll-area.tsx` | ⚠️ Usar com cautela — pode causar erros de parsing de cor; preferir scroll nativo |

**Regra para `Select` nativo:**
```tsx
// ❌ Classes Tailwind NÃO funcionam com CSS vars em <select>
<select className="bg-white border-gray-200">

// ✅ CORRETO — inline style para tokens
<select
  style={{
    backgroundColor: 'var(--admin-field-bg,     #ffffff)',
    color:           'var(--admin-field-text,    #111827)',
    borderColor:     'var(--admin-field-border,  #e5e7eb)',
  }}
>
```

---

## ❌ Proibições Absolutas

| Proibido | Use em vez disso |
|---|---|
| `window.confirm()` | `ConfirmDeleteDialog` ou `ConfirmDialog` |
| `window.alert()` | `AlertMessageDialog` ou `toast.error()` |
| `import * as LucideIcons` sem uso | Imports nomeados ou `getLucideIcon()` |
| `'use client'` em arquivos `.tsx` | Não existe Next.js neste projeto (Vite) |
| `transition-all` em elementos com shadow | `style={{ transition: 'none' }}` |
| `transition-colors` com `border-primary` | `style={{ transition: 'none' }}` |
| `grid-cols-${n}` dinâmico (Tailwind JIT) | Mapa estático `gridColsMap[n]` |
| `isOpen` + `onClose` no `BaseModal` | `open` + `onOpenChange` (API única) |
| Dialog primitivo em features | `BaseModal` ou diálogos de Camada 2 |
| `UnsavedChangesDialog` dentro de `BaseModal` | Prop `hasUnsavedChanges` no `BaseModal` |
| Cores hex hardcoded em features | `ColorTokenPicker` + `getColor()` |
| `fontSize: '24px'` hardcoded | `TypeScalePicker` + `getTypography()` |
| Botão com `confirm()` inline | Estado + `ConfirmDeleteDialog` |
| `react-hot-toast` ou `react-toastify` | `toast` de `'sonner'` |
| `<Toaster />` em páginas individuais | Já está na raiz — não instanciar novamente |
| `bg-primary hover:bg-primary/90` em botão | `AdminPrimaryButton` |
| `<h3 className="flex items-center gap-2">` manual em aba | `TabSectionHeader` |
| `import { Dialog }` em feature | `BaseModal` (Camada 2) |
| `import { AlertDialog }` em feature | `ConfirmDeleteDialog` / `ConfirmDialog` / `AlertMessageDialog` |

---

## ✅ Checklist para Criação de Novas Features

### Nova Página Admin `/admin/xxx`

```
IMPORTS
[ ] React + todos os hooks usados em uma única linha
[ ] AdminPrimaryButton importado se usar <AdminPrimaryButton>
[ ] adminVar importado se usar adminVar()
[ ] supabase importado de '../../../lib/supabase/client'
[ ] useNavigate/useParams de 'react-router' (não react-router-dom)
[ ] Nenhum import direto de Dialog/AlertDialog/Sheet

ESTRUTURA
[ ] AdminPageLayout como container raiz
[ ] Botão primário de criar no headerActions (não dentro da aba)
[ ] TabSectionHeader no início do conteúdo de TODA aba
[ ] Loading guard antes do JSX principal
[ ] hasLoaded.current = true ao final do loadData() se houver auto-save
[ ] AdminEmptyState para estado vazio (nunca div manual)

AÇÕES
[ ] Botão "Novo" usa AdminPrimaryButton
[ ] Exclusão usa ConfirmDeleteDialog
[ ] Confirmação não-destrutiva usa ConfirmDialog
[ ] Mensagens de erro usam toast.error() ou AlertMessageDialog
[ ] Notificações de sucesso usam toast.success()

TOKENIZAÇÃO
[ ] Badges de status: var(--primary) / var(--admin-field-placeholder) via style
[ ] Botão Excluir inline: delete-btn-* tokens via style (não text-red-*)
[ ] Botões ação inline: btn-action-* tokens via style
[ ] Cards internos: var(--admin-card-bg/border/radius) via style
[ ] Labels: <Label> sem classes tipográficas (token global via item-tertiary)

CAMPOS
[ ] Cor → ColorTokenPicker
[ ] Tipografia → TypeScalePicker
[ ] Ícone → IconPicker
[ ] Imagem → ImageFieldWithPicker (com URL) ou MediaUploader (inline)
[ ] Vídeo/Mídia → MediaUploader ou MediaPicker
[ ] Border-radius → RadiusPicker
[ ] Animação → TransitionPicker
[ ] Posição no grid → CornerPositionSelector
[ ] Alinhamento X/Y → AlignXYControl
[ ] Opacidade → OpacitySlider
[ ] Modo de exibição de mídia → MediaFitModePicker
[ ] URL de página/âncora → PageAnchorPicker
[ ] Estado de "unsaved" → useUnsavedChangesGuard + UnsavedHeaderActions
```

### Novo Modal

```
[ ] Usa BaseModal (nunca Dialog diretamente)
[ ] Controla abertura por estado (open + onOpenChange)
[ ] Nunca renderiza UnsavedChangesDialog manualmente
[ ] Se tem campos editáveis: passa hasUnsavedChanges ao BaseModal
[ ] onCancel apenas chama onOpenChange(false)
[ ] Título do modal via adminVar('modal-title', ...) ou token via style
[ ] Footer tokenizado: modal-footer-bg/border, btn-cancel-*
[ ] Seções colapsíveis: collapsible-* tokens via onMouseEnter/Leave
[ ] Itens de lista dentro: list-item-* tokens via handlers de mouse
```

### Novo Componente Público

```
[ ] Textos usam ResponsiveText com tokenName
[ ] Botões usam ResponsiveButton ou PrimaryButton
[ ] Cores vêm do useDesignSystem() — nunca hardcoded
[ ] Ícones via getLucideIcon() — nunca LucideIcons[name]
[ ] Mídia nunca usa figma:asset/ em runtime
[ ] style={{ transition: 'none' }} em elementos com hover de cor
[ ] Header/Footer: nunca recriar — usar componentes existentes
```

---

## 🗂️ Índice de Caminhos por Categoria

| Categoria | Arquivo |
|---|---|
| **Modal base** | `/src/app/components/admin/BaseModal.tsx` |
| **Confirmação de exclusão** | `/src/app/components/admin/ConfirmDeleteDialog.tsx` |
| **Confirmação genérica** | `/src/app/components/admin/ConfirmDialog.tsx` |
| **Alerta informativo** | `/src/app/components/admin/AlertMessageDialog.tsx` |
| **Alterações não salvas** | `/src/app/components/admin/UnsavedChangesDialog.tsx` |
| **Conflito de posição grid** | `/src/app/components/admin/PositionConflictDialog.tsx` |
| **Histórico de versões** | `/src/app/admin/components/VersionHistoryModal.tsx` |
| **Editor de item de menu** | `/src/app/admin/menu-manager/MenuItemEditorModal.tsx` |
| **Config de seção na página** | `/src/app/admin/pages-manager/UnifiedSectionConfigModal.tsx` |
| **Editor de template de cards** | `/src/app/admin/cards-manager/TemplateEditorModal.tsx` |
| **Criar seção na biblioteca** | `/src/app/admin/sections-manager/CreateSectionModal.tsx` |
| **Layout de página admin** | `/src/app/components/admin/AdminPageLayout.tsx` |
| **Linha de lista admin** | `/src/app/components/admin/AdminListItem.tsx` |
| **Card de grid admin** | `/src/app/components/admin/AdminGridCard.tsx` |
| **Estado vazio admin** | `/src/app/components/admin/AdminEmptyState.tsx` |
| **Cabeçalho de aba admin** | `/src/app/components/admin/TabSectionHeader.tsx` |
| **Tema dinâmico admin** | `/src/app/components/admin/AdminThemeProvider.tsx` |
| **Botão primário admin** | `/src/app/components/admin/AdminPrimaryButton.tsx` |
| **Botões de ação (editar/excluir)** | `/src/app/components/admin/AdminActionButtons.tsx` |
| **Indicador unsaved + salvar** | `/src/app/components/admin/UnsavedHeaderActions.tsx` |
| **Seletor de cor** | `/src/app/components/ColorTokenPicker.tsx` |
| **Seletor de tipografia** | `/src/app/components/admin/TypeScalePicker.tsx` |
| **Seletor de ícone** | `/src/app/components/admin/IconPicker.tsx` |
| **Grade de ícones** | `/src/app/components/admin/IconPickerGrid.tsx` |
| **Upload inline** | `/src/app/components/admin/MediaUploader.tsx` |
| **Picker de mídia via modal** | `/src/app/components/MediaPicker.tsx` |
| **Campo URL + picker** | `/src/app/components/ImageFieldWithPicker.tsx` |
| **Upload apenas (sem URL)** | `/src/app/components/ImageUploadOnly.tsx` |
| **Upload base (uso interno)** | `/src/app/components/UniversalMediaUpload.tsx` |
| **Border-radius** | `/src/app/components/admin/RadiusPicker.tsx` |
| **Transição/animação** | `/src/app/components/admin/TransitionPicker.tsx` |
| **Modo de exibição de mídia** | `/src/app/components/admin/MediaFitModePicker.tsx` |
| **Posição no grid 2×2** | `/src/app/components/admin/CornerPositionSelector.tsx` |
| **Alinhamento XY** | `/src/app/components/admin/AlignXYControl.tsx` |
| **Opacidade** | `/src/app/components/admin/OpacitySlider.tsx` |
| **Página + âncora de seção** | `/src/app/components/PageAnchorPicker.tsx` |
| **Editor de estrutura de seção** | `/src/app/admin/sections-manager/SectionBuilder.tsx` |
| **Editor visual de grid** | `/src/app/admin/sections-manager/GridLayoutEditor.tsx` |
| **Campos compactos de seção** | `/src/app/admin/sections-manager/CompactFieldEditor.tsx` |
| **Altura e espaçamento** | `/src/app/admin/pages-manager/SectionHeightAndAlignmentControls.tsx` |
| **Template e URL de botão** | `/src/app/admin/pages-manager/SectionLayoutControls.tsx` |
| **Item de seção reordenável** | `/src/app/admin/pages-manager/DraggableSectionItem.tsx` |
| **Megamenu (conteúdo)** | `/src/app/components/megamenu/MegamenuContent.tsx` |
| **Megamenu (card item)** | `/src/app/components/megamenu/MegamenuCardItem.tsx` |
| **Megamenu (configurador admin)** | `/src/app/admin/menu-manager/MegamenuConfigurator.tsx` |
| **Megamenu (aba de cards)** | `/src/app/admin/menu-manager/MegamenuCardsTab.tsx` |
| **Botão público** | `/src/app/components/ResponsiveButton.tsx` |
| **Texto público** | `/src/app/components/ResponsiveText.tsx` |
| **Imagem pública** | `/src/app/components/ResponsiveImage.tsx` |
| **Card público** | `/src/app/components/ResponsiveCard.tsx` |
| **Container público** | `/src/app/components/ResponsiveContainer.tsx` |
| **Seção pública** | `/src/app/components/ResponsiveSection.tsx` |
| **Header público** | `/src/app/public/components/Header.tsx` |
| **Header preview admin** | `/src/app/admin/menu-manager/HeaderPreview.tsx` |
| **Footer público** | `/src/app/public/components/Footer.tsx` |
| **Seção renderer** | `/src/app/public/components/SectionRenderer.tsx` |
| **Card renderer** | `/src/app/public/components/CardRenderer.tsx` |
| **Toast (função)** | `import { toast } from 'sonner'` |
| **Toast (montagem)** | `/src/app/components/ui/sonner.tsx` |
| **Hook de hover de menu** | `/src/lib/hooks/useMenuHover.ts` |
| **Hook unsaved changes** | `/src/lib/hooks/useUnsavedChangesGuard.ts` |
| **Hook confirm dialog** | `/src/lib/hooks/useConfirmDialog.ts` |
| **Hook design tokens** | `/src/lib/hooks/useDesignTokens.ts` |
| **Context DS público** | `/src/lib/contexts/DesignSystemContext.tsx` |
| **Utilitário de ícones** | `/src/lib/utils/icons.tsx` |
| **Utilitário de cores** | `/src/lib/utils/colors.ts` |
| **Constante de ícones Lucide** | `/src/lib/constants/lucideIcons.ts` |
| **Constante de temas admin** | `/src/lib/constants/theme.ts` |

---

## 🔍 Auditoria 2026-02-20 — Resultado e Correções Aplicadas

### Auditoria A — Sprint B (anterior)

| # | Severidade | Arquivo | Problema | Correção |
|---|---|---|---|---|
| 1 | 🔴 Crítico | `Header.tsx` | `import * as LucideIcons` apenas para `ChevronDown` | Substituído por `import { ChevronDown }` |
| 2 | 🔴 Crítico | `sections-manager/page.tsx` | `text-[#ea526e]`, `bg-[#ea526e] hover:bg-[#d94860]` hardcoded | `text-primary`, `bg-primary hover:bg-primary/90` |
| 3 | 🔴 Crítico | `sections-manager/page.tsx` | Sem `AdminPageLayout` — layout custom próprio | Envolvido em `AdminPageLayout` |
| 4 | 🔴 Crítico | `pages-manager/page.tsx` | `text-[#ea526e]`, `bg-[#ea526e] hover:bg-[#d94860]` hardcoded | `text-primary`, `bg-primary hover:bg-primary/90` |
| 5 | 🔴 Crítico | `footer-manager/page.tsx` | Sem `AdminPageLayout` — layout custom próprio | Envolvido em `AdminPageLayout` |
| 6 | 🟡 Médio | `pages-manager/page.tsx` | `hover:border-[#ea526e] transition-colors` — cor hardcoded + transition proibida | Removido `transition-colors`, removida cor hardcoded |
| 7 | 🟡 Médio | `sections-manager/page.tsx` | `hover:shadow-md transition-opacity` — classe errada | Removido, substituído por `style={{ transition: 'none' }}` |
| 8 | 🟡 Médio | `Footer.tsx` | `className="transition-colors hover:text-white"` nos links | Substituído por `onMouseEnter/Leave` com `style` inline |
| 9 | 🟡 Médio | `Header.tsx` | `transition-transform` no `ChevronDown` mobile | Substituído por `style={{ transition: 'none' }}` |
| 10 | 🟢 Baixo | `footer-manager/page.tsx` | `transition-opacity` no botão de salvar | Removido, `style={{ transition: 'none' }}` |

---

### Auditoria B — Sprint C (2026-02-20 — C1–C5 + auditoria técnica completa)

#### Novos componentes criados (C1–C5)

| Componente | Arquivo | Propósito |
|---|---|---|
| `AdminEmptyState` | `components/admin/AdminEmptyState.tsx` | Estado vazio padronizado com mensagem + CTA opcional |
| `AdminListItem` | `components/admin/AdminListItem.tsx` | Container de linha de lista (`border-2 rounded-xl`) |
| `AdminActionButtons` | `components/admin/AdminActionButtons.tsx` | Botões Editar/Duplicar/Excluir com ordem e ícones fixos |
| `UnsavedHeaderActions` | `components/admin/UnsavedHeaderActions.tsx` | Indicador ⚠️ + botão Salvar no `headerActions` |
| `contentClassName` prop | `AdminPageLayout` (existente) | Container automático quando sem tabs |

#### Violações corrigidas

| # | Sev. | Arquivo | Problema | Correção |
|---|---|---|---|---|
| 11 | 🔴 | `CreateSectionModal.tsx` | `<Checkbox>` usado onde deveria ser `<Switch>` | Substituído por `<Switch>` |
| 12 | 🔴 | `CreateSectionModal.tsx` | `config.iconColor = '#ea526e'` hardcoded | `ADMIN_COLORS.primary.DEFAULT` |
| 13 | 🔴 | `MegamenuConfigurator.tsx` | `getColor('primary') \|\|` e `getColor('dark') \|\|` | `??` (nullish coalescing) |
| 14 | 🔴 | `DraggableSectionItem.tsx` | `getColor('primary/secondary/accent/muted') \|\|` × 4 | `??` em todos |
| 15 | 🔴 | `Header.tsx` (público) | `getColor('primary/dark/muted') \|\|` × 3 | `??` em todos |
| 16 | 🔴 | `Footer.tsx` (público) | `getColor('secondary/muted') \|\|` × 2 | `??` em ambos |
| 17 | 🔴 | `SectionRenderer.tsx` | `getColor() \|\|` × 7 instâncias | `??` em todas |
| 18 | 🟡 | `UnifiedSectionConfigModal.tsx` | `text-[#ea526e]` em ícone de CardTitle | `text-primary` |
| 19 | 🟡 | `SectionBuilder.tsx` | `text-[#ea526e]` em ícone Grid2X2 | `text-primary` |
| 20 | 🟡 | `ResponsivePreview.tsx` | `text-[#ea526e]` × 2 (spinner, ícone) | `text-primary` |
| 21 | 🟡 | `UniversalMediaUpload.tsx` | `text-[#ea526e]` × 2 (spinners) | `text-primary` |
| 22 | 🟡 | `DynamicPage.tsx` | `text-[#ea526e]` no spinner de loading | `text-primary` |
| 23 | 🟡 | `Home.tsx` | `text-[#ea526e]` no spinner + link | `text-primary` |
| 24 | 🟡 | `AdminLayout` | `name: 'Design'` no sidebar | `name: 'Design System'` (consistência com título da página) |
| 25 | 🟡 | `SectionHeightAndAlignmentControls.tsx` | `SPACING_SIDES` e `SPACING_GAP` com incrementos não-padronizados (8/16/24…) | Unificados em `[0, 25, 50, 75, 100, 125, 150, 175, 200]` conforme DS v6.14+ |
| 26 | 🟡 | `ImageUploadOnly.tsx` | `label` e `helperText` não existiam no tipo — menu-manager passava props silenciosamente ignoradas | Props adicionadas ao tipo e renderizadas |
| 27 | 🟢 | `COMPONENTS_CATALOG.md` | `AlignXYControl` documentada com props `alignX`/`alignY` (erradas) | Corrigido para `valueX`/`valueY` |
| 28 | 🟢 | `COMPONENTS_CATALOG.md` | `ImageUploadOnly` sem documentação de `label`/`helperText` | Atualizado |

#### Situações aceitas (não são violações)

| Arquivo | Situação | Justificativa |
|---|---|---|
| `CardRenderer.tsx` — `text-[#2e2240]`, `fill-[#ea526e]` | Aceito | Renderer público sem `useDesignSystem` — refactoring futuro separado |
| `Home.tsx` — `bg-[#ea526e]` no botão de fallback | Aceito | Estado de "nenhuma página" mostrado apenas a developers, não a usuários finais |
| `ResponsivePreview.tsx` — `bg-[#ea526e]` nos botões de viewport | Aceito | Chrome de UI interna do admin (preview), sem impacto no DS público |
| `UniversalMediaUpload.tsx` — `bg-[#ea526e]`, `border-[#ea526e]` em badge/drag | Aceito | UI fixos de upload sem contexto de DS — refactoring futuro |
| `import * as LucideIcons` em arquivos documentados | Aceito | Ver lista em §4 (IconPicker, CompactFieldEditor, MegamenuContent, CardRenderer, etc.) |

---

### Páginas Admin — Status pós-auditoria B

| Página | `AdminPageLayout` | `ConfirmDeleteDialog` | `toast` | Cores via tokens | Lista com `AdminListItem` | Empty state padronizado |
|---|---|---|---|---|---|---|
| `/admin/pages-manager` | ✅ | ✅ | ✅ | ✅ | ✅ C2 | ✅ C3 |
| `/admin/sections-manager` | ✅ | ✅ | ✅ | ✅ | n/a (grid) | ✅ C3 |
| `/admin/cards-manager` | ✅ | ✅ | ✅ | ✅ | n/a (grid) | ✅ C3 |
| `/admin/menu-manager` | ✅ | ✅ | ✅ | ✅ | ✅ C2 | ✅ C3 |
| `/admin/footer-manager` | ✅ | ✅ | ✅ | ✅ | n/a | ✅ C3 (×2) |
| `/admin/design-system` | ✅ | ✅ | ✅ | ✅ | n/a | ✅ |

### Componentes Públicos — Status pós-auditoria B

| Componente | `getLucideIcon()` | `??` (não `\|\|`) | `transition:none` |
|---|---|---|---|
| `Header.tsx` | ✅ | ✅ corrigido | ✅ |
| `Footer.tsx` | ✅ | ✅ corrigido | ✅ |
| `SectionRenderer.tsx` | ✅ | ✅ corrigido | ✅ |
| `CardRenderer.tsx` | ✅ (exceção) | n/a | ✅ |

---

### Auditoria C — 2026-02-21 (Padronização de Grids Admin)

#### Correções aplicadas

| # | Sev. | Arquivo | Problema | Correção |
|---|---|---|---|---|
| 29 | 🟡 | `sections-manager/page.tsx` | Badge só renderizava quando `published` — rascunhos não tinham indicador visual | Badge sempre renderizado: verde `bg-green-500` "Publicado" / cinza `bg-gray-500` "Rascunho" |
| 30 | 🟡 | `sections-manager/page.tsx` | `meta` com 1 linha apenas (tipo) | Padronizado para 3 linhas: nome (prop `name`) + tipo + "Seção Global/Local" |
| 31 | 🟡 | `cards-manager/page.tsx` | Badge só renderizava quando `published` | Badge sempre renderizado: verde "Publicado" / cinza "Rascunho" (meta 3 linhas já existia) |
| 32 | 🟢 | `menu-manager/page.tsx` | Aba "Header" iniciava directamente com secções de formulário sem título/subtítulo | Adicionado header de tab: `<h3> Configurações do Header </h3>` + `<p>` descritiva, consistente com aba "Itens do Menu" |
| 33 | 🟢 | `pages-manager/page.tsx` | Ícone `<FileText>` inline no título do card de página | Removido — layout limpo sem ícone (consistente com outros AdminListItem) |
| 34 | 🟢 | `pages-manager/page.tsx` | Ícone `<ExternalLink>` inline no slug do card | Removido — slug exibido como texto puro |
| 35 | 🟢 | `COMPONENTS_CATALOG.md` | `AdminGridCard` documentado com badge condicional (`condition && <span>`) e meta de 1 linha | Actualizado para badge sempre renderizado e meta de 3 linhas |

#### Regra consolidada — Badge em AdminGridCard

```tsx
// ✅ SEMPRE renderizar badge com tokens (nunca condition && <span>)
badge={
  <span
    className="px-2 py-1 rounded"
    style={{
      fontSize: 'var(--admin-badge-label-size, 0.75rem)',
      fontWeight: 'var(--admin-badge-label-weight, 500)',
      color: 'var(--admin-badge-label-color, #ffffff)',
      backgroundColor: item.published
        ? 'var(--primary, #ea526e)'
        : 'var(--admin-field-placeholder, #9ca3af)',
    }}
  >
    {item.published ? 'Publicado' : 'Rascunho'}
  </span>
}

// ❌ NUNCA — classes Tailwind de cor hardcoded
badge={<span className="bg-green-500 text-white ...">Publicado</span>}
// ❌ NUNCA — renderização condicional
badge={item.published && <span>...</span>}
```

#### Regra consolidada — Meta 3 linhas em AdminGridCard

| Linha | `sections-manager` | `cards-manager` |
|---|---|---|
| **1** (prop `name`) | Nome da seção | Nome do template |
| **2** (`text-xs text-gray-500`) | Tipo (`Hero`, `CTA`, `Seção`…) | Variante + colunas (`grid • 3 colunas`) |
| **3** (`text-xs text-gray-400`) | `Seção Global` ou `Seção Local` | N filtros + N cards |

---

**Última atualização:** 2026-02-21  
**Mantido por:** Equipe BemDito CMS
