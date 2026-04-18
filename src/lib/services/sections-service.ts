/**
 * Sections Service
 *
 * Handles all section-related database operations
 */

import { db } from '../supabase/client';
import { normalizePageSection, toSectionUpdatePayload } from './cms-admin-service';
import type { PageSection } from '@/types/cms';

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

  return (data || []).map(normalizePageSection);
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

  return data ? normalizePageSection(data) : null;
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

  return normalizePageSection(data);
}

/**
 * Update a section
 */
export async function updateSection(id: string, updates: Partial<PageSection>) {
  const breakpointOverrides =
    updates.breakpointOverrides ?? updates.breakpoint_overrides ?? undefined;

  const { data, error } = await db.pageSections().update(toSectionUpdatePayload(updates)).eq('id', id);

  if (error) {
    console.error('Error updating section:', error);
    throw error;
  }

  if (breakpointOverrides) {
    const deleteResult = await db.sectionBreakpointOverrides().delete().eq('section_id', id);
    if (deleteResult.error) {
      console.error('Error clearing breakpoint overrides:', deleteResult.error);
      throw deleteResult.error;
    }

    const validOverrides = breakpointOverrides.filter((override) => override?.breakpoint);
    if (validOverrides.length > 0) {
      const insertResult = await db.sectionBreakpointOverrides().insert(
        validOverrides.map((override) => ({
          section_id: id,
          breakpoint: override.breakpoint,
          visible: override.visible,
          config_overrides: override.config_overrides ?? override.config ?? {},
        }))
      );

      if (insertResult.error) {
        console.error('Error saving breakpoint overrides:', insertResult.error);
        throw insertResult.error;
      }
    }
  }

  const refreshed = await getSectionById(id);
  if (!refreshed) {
    throw new Error('Section could not be reloaded after update');
  }

  return refreshed;
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
