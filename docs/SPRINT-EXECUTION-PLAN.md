# Sprint Execution Plan

Last updated: 2026-04-18

## Purpose

This document reorganizes the next sprints based on the code that is actually active today, not only on the product roadmap.

It also prepares Sprint 3 execution so implementation can start without increasing duplication between the public CMS runtime and the admin area.

## Current Reality Check

The project has two important truths at the same time:

1. The public site already renders dynamically from Supabase through:
   - `src/app/PublicHome.tsx`
   - `src/lib/services/pages-service.ts`
   - `src/lib/services/global-blocks-service.ts`
   - `src/lib/cms/renderers/PageRenderer.tsx`
   - `src/lib/cms/renderers/GlobalBlockRenderer.tsx`

2. The admin area is partially functional, but some active editor flows still point to an older table model:
   - `src/admin/pages/PageEditor.tsx` uses `sections` and `templates`
   - the public runtime uses `page_sections` and `section_templates`

Because of this, Sprint 3 should avoid touching the page editor architecture first. The safest path is to implement Global Blocks Editor directly on top of the already active `global_blocks` service and renderer flow.

## Recommended Sprint Order

### Sprint 3

Global Blocks Editor

Reason:
- Lowest-risk next delivery
- Uses an already active data model (`global_blocks`)
- Improves the public site immediately
- Avoids deep refactor of the current page editor

### Sprint 4

Admin data alignment

Reason:
- Before expanding editors further, align admin with the same schema used by the public runtime
- Reduce divergence between `sections/templates` and `page_sections/section_templates`

Scope:
- audit active admin data model
- migrate or adapt `PageEditor`
- normalize types and table usage

### Sprint 5

Media Library standalone

Reason:
- Reuses MediaPicker work
- Independent enough after admin alignment starts
- Valuable for both section editing and global blocks

### Sprint 6

Design System Editor basic

Reason:
- Depends on a more stable admin foundation
- Should sit on top of normalized services and types

### Sprint 7

Advanced section editing

Scope:
- Layout tab
- Style tab
- Breakpoint overrides
- Behavior tab

### Sprint 8

Content management modules

Scope:
- Blog
- Testimonials
- Awards
- FAQs

### Sprint 9

Auth, permissions, and RLS

Reason:
- Better after admin modules are stable enough to protect

### Sprint 10

Hardening and polish

Scope:
- unsaved changes flow
- accessibility
- error boundaries
- tests
- performance

### Sprint 11

Company and Professional portals

Reason:
- should build on a stable CMS/admin core

## Sprint 3 Objective

Implement `/admin/global-blocks` as the first complete editor outside the page editor.

The module should allow editing:
- Header
- Footer
- Menu Overlay
- Support Modal
- Floating Button

The module must persist to Supabase using the current `global_blocks` table and reflect immediately in the public runtime.

## Sprint 3 Boundaries

### In scope

- Real page at `/admin/global-blocks`
- Load all global blocks from Supabase
- Select and edit one block at a time
- Save `content`, `config`, `visible`, `name`, and `slug`
- Live preview using existing block components
- Toast feedback
- Loading and empty states

### Out of scope

- Full navigation management module
- reusable token pickers
- design system editor
- auth and permission gates
- refactor of page editor tables

## Sprint 3 Technical Strategy

### Source of truth

Use these existing files as the foundation:
- `src/lib/services/global-blocks-service.ts`
- `src/lib/cms/renderers/GlobalBlockRenderer.tsx`
- `src/components/global-blocks/Header.tsx`
- `src/components/global-blocks/Footer.tsx`
- `src/components/global-blocks/MenuOverlay.tsx`
- `src/components/global-blocks/SupportModal.tsx`
- `src/components/global-blocks/FloatingButton.tsx`

### Route integration

Update:
- `src/app/App.tsx`

Replace the placeholder route:
- `/admin/global-blocks`

With a real page component from:
- `src/admin/pages/GlobalBlocksPage.tsx`

### New admin module shape

Recommended files:

- `src/admin/pages/GlobalBlocksPage.tsx`
- `src/admin/components/global-blocks/GlobalBlocksList.tsx`
- `src/admin/components/global-blocks/GlobalBlockEditor.tsx`
- `src/admin/components/global-blocks/GlobalBlockPreview.tsx`
- `src/admin/components/global-blocks/forms/HeaderBlockForm.tsx`
- `src/admin/components/global-blocks/forms/FooterBlockForm.tsx`
- `src/admin/components/global-blocks/forms/MenuOverlayBlockForm.tsx`
- `src/admin/components/global-blocks/forms/SupportModalBlockForm.tsx`
- `src/admin/components/global-blocks/forms/FloatingButtonBlockForm.tsx`

### UI pattern

Follow the page editor mental model, but keep Sprint 3 simpler:

1. Left column:
   - list of global blocks
   - visibility badge
   - type
   - quick select

2. Center column:
   - form editor for the selected block
   - save and cancel
   - JSON advanced editor fallback

3. Right column:
   - live preview
   - interactive preview for menu and support modal

## Data Shape Notes

Seed data already suggests the expected block structure:

### Header

`content` includes:
- `logo`
- `navigation`
- `cta`

`config` includes:
- `sticky`
- `transparent`

### Menu Overlay

`content` includes:
- navigation/menu items
- CTA

### Footer

`content` includes:
- `logo`
- `description`
- grouped navigation
- social links

### Support Modal

`content` includes:
- `title`
- `options`

### Floating Button

`content` includes:
- `icon`
- `label`

`config` includes:
- `position`
- `color`

## Sprint 3 Implementation Sequence

### Step 1

Create the route and page shell.

Deliverable:
- page loads all blocks from Supabase
- empty and loading states work

### Step 2

Create left-column list and selection state.

Deliverable:
- user can select any block
- selected state persists while editing

### Step 3

Create generic editor shell with:
- block metadata
- visible toggle
- JSON fallback

Deliverable:
- any block can already be edited in raw form

### Step 4

Add typed forms in this order:
1. Floating Button
2. Support Modal
3. Header
4. Menu Overlay
5. Footer

Reason:
- smallest shapes first
- faster validation loop

### Step 5

Add live preview with existing runtime components.

Deliverable:
- preview reflects unsaved local state
- save reflects persisted state

### Step 6

Add Sonner toasts, save states, and retry/error handling.

### Step 7

Smoke test against the public page.

Deliverable:
- editing a block in admin changes runtime behavior on `/`

## Acceptance Criteria

Sprint 3 is done when:

- `/admin/global-blocks` is a real page
- all 5 block types are listed
- each block can be edited without raw database access
- save persists to `global_blocks`
- preview works for each block
- visibility toggle persists
- the public home reflects saved changes

## Risks

### Risk 1

Component prop mismatch between stored JSON and current component interfaces.

Mitigation:
- adapt editor payloads to current component props
- keep JSON fallback available

### Risk 2

Some components still expose hardcoded defaults not represented in the seed structure.

Mitigation:
- do not refactor all block components in Sprint 3
- only expose fields the current components already support safely

### Risk 3

The admin and public layers already diverge in pages/sections architecture.

Mitigation:
- keep Sprint 3 isolated to `global_blocks`
- schedule admin data alignment next

## After Sprint 3

Immediately start Sprint 4:

Admin data alignment

Main goal:
- make admin editing use the same schema family as the public renderer

Priority files to audit first:
- `src/admin/pages/PageEditor.tsx`
- `src/admin/components/page-editor/*`
- `src/lib/services/pages-service.ts`
- `src/lib/services/sections-service.ts`
- `src/types/cms.ts`
- `src/lib/supabase/types.ts`

## Delivery Rule

For the next implementation cycle:

- do not add new parallel admin architectures
- do not build Sprint 3 on legacy `sections/templates` tables
- do not introduce unrelated design system work into this sprint

Sprint 3 should be treated as a clean, isolated, production-facing admin module for `global_blocks`.
