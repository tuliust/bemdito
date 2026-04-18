import type {
  BreakpointOverride,
  Page,
  PageSection,
  SectionItem,
  SectionTemplate,
  SectionVariant,
} from '@/types/cms';

export interface CmsEditorSnapshot {
  page: Page;
  sections: PageSection[];
}

export function normalizePage(raw: any): Page {
  return {
    id: raw.id,
    site_id: raw.site_id ?? raw.siteId,
    siteId: raw.site_id ?? raw.siteId,
    slug: raw.slug,
    title: raw.title ?? raw.name ?? 'Untitled page',
    name: raw.name ?? raw.title,
    description: raw.description ?? raw.meta_description ?? undefined,
    meta_title: raw.meta_title ?? undefined,
    meta_description: raw.meta_description ?? undefined,
    meta_image: raw.meta_image ?? undefined,
    status: raw.status ?? 'draft',
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    published_at: raw.published_at ?? undefined,
    sections: Array.isArray(raw.sections) ? raw.sections.map(normalizePageSection) : undefined,
  };
}

export function normalizeTemplate(raw: any): SectionTemplate | undefined {
  if (!raw) return undefined;

  const source = Array.isArray(raw) ? raw[0] : raw;
  if (!source) return undefined;

  return {
    id: source.id,
    name: source.name,
    slug: source.slug,
    category: source.category ?? undefined,
    description: source.description ?? undefined,
    schema: source.schema ?? undefined,
    preview_image: source.preview_image ?? undefined,
    created_at: source.created_at,
    updated_at: source.updated_at,
  };
}

export function normalizeVariant(raw: any): SectionVariant | undefined {
  if (!raw) return undefined;

  const source = Array.isArray(raw) ? raw[0] : raw;
  if (!source) return undefined;

  return {
    id: source.id,
    template_id: source.template_id ?? source.templateId,
    templateId: source.template_id ?? source.templateId,
    name: source.name,
    slug: source.slug,
    description: source.description ?? undefined,
    config_overrides: source.config_overrides ?? undefined,
    schemaOverrides: source.schema_overrides ?? undefined,
    stylePreset: source.style_preset ?? undefined,
    preview_image: source.preview_image ?? undefined,
    created_at: source.created_at,
    updated_at: source.updated_at,
  };
}

export function normalizeSectionItem(raw: any): SectionItem {
  return {
    id: raw.id,
    section_id: raw.section_id ?? raw.sectionId,
    sectionId: raw.section_id ?? raw.sectionId,
    type: raw.type ?? undefined,
    order_index: raw.order_index ?? raw.order ?? 0,
    order: raw.order_index ?? raw.order ?? 0,
    visible: raw.visible ?? true,
    content: raw.content ?? {},
    config: raw.config ?? {},
    breakpointOverrides: raw.breakpointOverrides ?? raw.breakpoint_overrides ?? [],
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

export function normalizeBreakpointOverride(raw: any): BreakpointOverride {
  return {
    id: raw.id,
    section_id: raw.section_id,
    breakpoint: raw.breakpoint,
    config: raw.config ?? raw.config_overrides ?? {},
    config_overrides: raw.config_overrides ?? raw.config ?? {},
    visible: raw.visible,
  };
}

export function normalizePageSection(raw: any): PageSection {
  return {
    id: raw.id,
    page_id: raw.page_id ?? raw.pageId,
    pageId: raw.page_id ?? raw.pageId,
    template_id: raw.template_id ?? raw.templateId,
    templateId: raw.template_id ?? raw.templateId,
    variant_id: raw.variant_id ?? raw.variantId,
    variantId: raw.variant_id ?? raw.variantId,
    order_index: raw.order_index ?? raw.order ?? 0,
    order: raw.order_index ?? raw.order ?? 0,
    content: raw.content ?? {},
    config: raw.config ?? {
      layout: raw.layout_config ?? {},
      style: raw.style_config ?? {},
      behavior: raw.behavior_config ?? {},
    },
    content_config: raw.content_config ?? {},
    style_config: raw.style_config ?? {},
    layout_config: raw.layout_config ?? {},
    behavior_config: raw.behavior_config ?? {},
    items: Array.isArray(raw.items) ? raw.items.map(normalizeSectionItem) : [],
    breakpointOverrides: Array.isArray(raw.breakpointOverrides)
      ? raw.breakpointOverrides.map(normalizeBreakpointOverride)
      : Array.isArray(raw.breakpoint_overrides)
      ? raw.breakpoint_overrides.map(normalizeBreakpointOverride)
      : [],
    breakpoint_overrides: Array.isArray(raw.breakpoint_overrides)
      ? raw.breakpoint_overrides.map(normalizeBreakpointOverride)
      : Array.isArray(raw.breakpointOverrides)
      ? raw.breakpointOverrides.map(normalizeBreakpointOverride)
      : [],
    visible: raw.visible ?? raw.is_visible ?? true,
    template: normalizeTemplate(raw.template),
    variant: normalizeVariant(raw.variant),
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

export function toSectionUpdatePayload(section: Partial<PageSection>) {
  return {
    content: section.content,
    visible: section.visible,
    content_config: section.content_config,
    style_config: section.style_config,
    layout_config: section.layout_config,
    behavior_config: section.behavior_config,
    variant_id: section.variant_id ?? section.variantId ?? null,
  };
}
