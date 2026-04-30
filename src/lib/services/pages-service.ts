/**
 * Pages Service
 *
 * Handles all page-related database operations
 */

import { db } from '../supabase/client';

export interface PageWithSections {
  id: string;
  site_id: string;
  title: string;
  slug: string;
  status: string;
  meta_title?: string;
  meta_description?: string;
  meta_image?: string;
  sections?: any[];
  created_at: string;
  updated_at: string;
  published_at?: string;
}

/**
 * Get page by slug with all sections, items, and overrides
 */
export async function getPageBySlug(slug: string) {
  const { data, error } = await db
    .pages()
    .select(`
      *,
      sections:page_sections!inner(
        *,
        template:section_templates!inner(id, slug, name, category),
        variant:section_variants(id, slug, name),
        items:section_items(*)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('Error fetching page:', error);
    return null;
  }

  if (!data) {
    console.warn(`Page not found with slug: ${slug}`);
    return null;
  }

  // Debug: Log the structure to see how Supabase returns it
  if (data.sections && data.sections.length > 0) {
    console.log('Sample section structure:', {
      id: data.sections[0].id,
      template_id: data.sections[0].template_id,
      template: data.sections[0].template,
      template_type: typeof data.sections[0].template,
      template_is_array: Array.isArray(data.sections[0].template),
      items: data.sections[0].items,
      items_type: typeof data.sections[0].items,
      items_is_array: Array.isArray(data.sections[0].items),
      items_count: data.sections[0].items?.length || 0,
    });

    // Log sections with items
    const sectionsWithItems = data.sections.filter((s: any) => s.items && s.items.length > 0);
    console.log(`Sections with items: ${sectionsWithItems.length}/${data.sections.length}`);
    if (sectionsWithItems.length > 0) {
      console.log('First section with items:', {
        template: sectionsWithItems[0].template,
        items_count: sectionsWithItems[0].items.length,
        first_item: sectionsWithItems[0].items[0],
      });
    }
  }

  return data as PageWithSections;
}

/**
 * Get page by ID with all sections, items, and overrides
 */
export async function getPageById(id: string) {
  const { data, error } = await db
    .pages()
    .select(`
      *,
      sections:page_sections(
        *,
        template:section_templates(*),
        variant:section_variants(*),
        items:section_items(*),
        breakpointOverrides:section_breakpoint_overrides(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching page:', error);
    return null;
  }

  return data as PageWithSections;
}

/**
 * List all pages for a site
 */
export async function listPages(siteId?: string) {
  let query = db.pages().select('*').order('updated_at', { ascending: false });

  if (siteId) {
    query = query.eq('site_id', siteId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error listing pages:', error);
    return [];
  }

  return data || [];
}

/**
 * Create a new page
 */
export async function createPage(page: Partial<PageWithSections>) {
  const { data, error } = await db.pages().insert(page).select().single();

  if (error) {
    console.error('Error creating page:', error);
    throw error;
  }

  return data;
}

/**
 * Update a page
 */
export async function updatePage(id: string, updates: Partial<PageWithSections>) {
  const { data, error } = await db.pages().update(updates).eq('id', id).select().single();

  if (error) {
    console.error('Error updating page:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a page
 */
export async function deletePage(id: string) {
  const { error } = await db.pages().delete().eq('id', id);

  if (error) {
    console.error('Error deleting page:', error);
    throw error;
  }

  return true;
}

/**
 * Publish a page
 */
export async function publishPage(id: string) {
  return updatePage(id, {
    status: 'published',
    published_at: new Date().toISOString(),
  });
}

/**
 * Unpublish a page
 */
export async function unpublishPage(id: string) {
  return updatePage(id, {
    status: 'draft',
  });
}
