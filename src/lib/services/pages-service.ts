/**
 * Pages Service
 *
 * Handles all page-related database operations
 */

import { db } from '../supabase/client';
import { normalizePage, normalizePageSection } from './cms-admin-service';
import type { Page } from '@/types/cms';

export type PageWithSections = Page;

function normalizePagePayload(data: any) {
  return normalizePage({
    ...data,
    sections: Array.isArray(data?.sections)
      ? data.sections.map(normalizePageSection)
      : [],
  });
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
        template:section_templates!inner(*),
        variant:section_variants(*),
        items:section_items(*),
        breakpointOverrides:section_breakpoint_overrides(*)
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

  return normalizePagePayload(data);
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

  return normalizePagePayload(data);
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

  return (data || []).map(normalizePage);
}

/**
 * Create a new page
 */
export async function createPage(page: Partial<PageWithSections>) {
  const pagePayload = {
    site_id: page.site_id ?? page.siteId,
    slug: page.slug,
    title: page.title,
    description: page.description ?? null,
    status: page.status,
    published_at: page.published_at ?? null,
  };

  const { data, error } = await db.pages().insert(pagePayload as any).select().single();

  if (error) {
    console.error('Error creating page:', error);
    throw error;
  }

  return normalizePage(data);
}

/**
 * Update a page
 */
export async function updatePage(id: string, updates: Partial<PageWithSections>) {
  const pagePayload = {
    site_id: updates.site_id ?? updates.siteId,
    slug: updates.slug,
    title: updates.title,
    description: updates.description,
    status: updates.status,
    published_at: updates.published_at,
  };

  const sanitizedPayload = Object.fromEntries(
    Object.entries(pagePayload).filter(([, value]) => value !== undefined)
  );

  const { data, error } = await db.pages().update(sanitizedPayload as any).eq('id', id).select().single();

  if (error) {
    console.error('Error updating page:', error);
    throw error;
  }

  return normalizePage(data);
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
