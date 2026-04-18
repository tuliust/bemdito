/**
 * Sections Service
 *
 * Handles all section-related database operations
 */

import { db } from '../supabase/client';

export interface PageSection {
  id: string;
  page_id: string;
  template_id: string;
  variant_id?: string;
  order_index: number;
  visible: boolean;
  content: Record<string, any>;
  content_config?: Record<string, any>;
  style_config?: Record<string, any>;
  layout_config?: Record<string, any>;
  behavior_config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export async function getSectionsByPageId(pageId: string) {
  const { data, error } = await db
    .pageSections()
    .select(`
      *,
      template:section_templates(*),
      variant:section_variants(*),
      items:section_items(*),
      breakpointOverrides:section_breakpoint_overrides(*)
    `)
    .eq('page_id', pageId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching sections:', error);
    return [];
  }

  return data || [];
}

export async function getSectionById(id: string) {
  const { data, error } = await db
    .pageSections()
    .select(`
      *,
      template:section_templates(*),
      variant:section_variants(*),
      items:section_items(*),
      breakpointOverrides:section_breakpoint_overrides(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching section:', error);
    return null;
  }

  return data;
}

export async function createSection(section: Partial<PageSection>) {
  const { data, error } = await db.pageSections().insert(section).select().single();

  if (error) {
    console.error('Error creating section:', error);
    throw error;
  }

  return data;
}

export async function updateSection(id: string, updates: Partial<PageSection>) {
  const { data, error } = await db.pageSections().update(updates).eq('id', id).select().single();

  if (error) {
    console.error('Error updating section:', error);
    throw error;
  }

  return data;
}

export async function deleteSection(id: string) {
  const { error } = await db.pageSections().delete().eq('id', id);

  if (error) {
    console.error('Error deleting section:', error);
    throw error;
  }

  return true;
}

export async function duplicateSection(id: string) {
  const section = await getSectionById(id);
  if (!section) {
    throw new Error('Section not found');
  }

  const sectionAny = section as any;

  const newSection = await createSection({
    page_id: sectionAny.page_id,
    template_id: sectionAny.template_id,
    variant_id: sectionAny.variant_id || undefined,
    order_index: (sectionAny.order_index || 0) + 1,
    visible: sectionAny.visible ?? true,
    content: sectionAny.content || {},
    content_config: sectionAny.content_config || {},
    style_config: sectionAny.style_config || {},
    layout_config: sectionAny.layout_config || {},
    behavior_config: sectionAny.behavior_config || {},
  });

  return newSection;
}

export async function reorderSections(pageId: string, sectionIds: string[]) {
  const updates = sectionIds.map((id, index) =>
    db.pageSections().update({ order_index: index }).eq('id', id)
  );

  try {
    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error('Error reordering sections:', error);
    throw error;
  }
}

export async function toggleSectionVisibility(id: string, visible: boolean) {
  return updateSection(id, { visible });
}

export async function updateSectionContent(id: string, content: Record<string, any>) {
  return updateSection(id, { content });
}

export async function updateSectionConfig(
  id: string,
  configType: 'content_config' | 'style_config' | 'layout_config' | 'behavior_config',
  config: Record<string, any>
) {
  return updateSection(id, { [configType]: config });
}
