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

/**
 * Get sections for a page
 */
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

/**
 * Get a single section by ID
 */
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

/**
 * Create a new section
 */
export async function createSection(section: Partial<PageSection>) {
  const { data, error } = await db.pageSections().insert(section).select().single();

  if (error) {
    console.error('Error creating section:', error);
    throw error;
  }

  return data;
}

/**
 * Update a section
 */
export async function updateSection(id: string, updates: Partial<PageSection>) {
  const { data, error } = await db.pageSections().update(updates).eq('id', id).select().single();

  if (error) {
    console.error('Error updating section:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a section
 */
export async function deleteSection(id: string) {
  const { error } = await db.pageSections().delete().eq('id', id);

  if (error) {
    console.error('Error deleting section:', error);
    throw error;
  }

  return true;
}

/**
 * Duplicate a section
 */
export async function duplicateSection(id: string) {
  const section = await getSectionById(id);
  if (!section) {
    throw new Error('Section not found');
  }

  // Remove id and adjust order
  const { id: _id, created_at, updated_at, ...sectionData } = section;

  const newSection = await createSection({
    ...sectionData,
    order_index: sectionData.order_index + 1,
  });

  return newSection;
}

/**
 * Reorder sections
 */
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

/**
 * Toggle section visibility
 */
export async function toggleSectionVisibility(id: string, visible: boolean) {
  return updateSection(id, { visible });
}

/**
 * Update section content
 */
export async function updateSectionContent(id: string, content: Record<string, any>) {
  return updateSection(id, { content });
}

/**
 * Update section config
 */
export async function updateSectionConfig(
  id: string,
  configType: 'content_config' | 'style_config' | 'layout_config' | 'behavior_config',
  config: Record<string, any>
) {
  return updateSection(id, { [configType]: config });
}
