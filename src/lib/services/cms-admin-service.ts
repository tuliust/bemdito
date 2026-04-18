import type {
  BreakpointOverride,
  Page,
  PageSection,
  SectionConfig,
  SectionItem,
  SectionTemplate,
  SectionVariant,
} from '@/types/cms';

export interface CmsEditorSnapshot {
  page: Page;
  sections: PageSection[];
}

function normalizeSectionConfig(raw: any): SectionConfig & Record<string, any> {
  const source = raw?.config ?? raw ?? {};
  const layout = source.layout ?? raw?.layout_config ?? {};
  const style = source.style ?? raw?.style_config ?? {};
  const behavior = source.behavior ?? raw?.behavior_config ?? {};

  return {
    ...(source || {}),
    layout,
    style,
    behavior,
  };
}

export function normalizePage(raw: any): Page {
  return {
    id: raw.id,
    site_id: raw.site_id ?? raw.siteId,
    siteId: raw.site_id ?? raw.siteId,
    slug: raw.slug,
    title: raw.title ?? raw.name ?? 'Untitled page',
    name: raw.name ?? raw.title,
    description: raw.description ?? undefined,
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
    default_config: source.default_config ?? undefined,
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
    schema_overrides: source.schema_overrides ?? source.config_overrides ?? undefined,
    schemaOverrides: source.schema_overrides ?? source.config_overrides ?? undefined,
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
    sectionId: raw.section_id,
    breakpoint: raw.breakpoint,
    config: raw.config ?? raw.config_overrides ?? {},
    visible: raw.visible,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

export function normalizePageSection(raw: any): PageSection {
  const config = normalizeSectionConfig(raw);
  const breakpointOverrides = Array.isArray(raw.breakpointOverrides)
    ? raw.breakpointOverrides.map(normalizeBreakpointOverride)
    : Array.isArray(raw.breakpoint_overrides)
    ? raw.breakpoint_overrides.map(normalizeBreakpointOverride)
    : [];

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
    config,
    content_config: raw.content_config ?? {},
    style_config: config.style ?? {},
    layout_config: config.layout ?? {},
    behavior_config: config.behavior ?? {},
    items: Array.isArray(raw.items) ? raw.items.map(normalizeSectionItem) : [],
    breakpointOverrides,
    breakpoint_overrides: breakpointOverrides,
    visible: raw.visible ?? raw.is_visible ?? true,
    template: normalizeTemplate(raw.template),
    variant: normalizeVariant(raw.variant),
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

export function toSectionUpdatePayload(section: Partial<PageSection>) {
  const config = normalizeSectionConfig({
    config: section.config,
    layout_config: section.layout_config,
    style_config: section.style_config,
    behavior_config: section.behavior_config,
  });

  return {
    content: section.content,
    visible: section.visible,
    config,
    variant_id: section.variant_id ?? section.variantId ?? null,
  };
}
