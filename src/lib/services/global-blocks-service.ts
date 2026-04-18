/**
 * Global Blocks Service
 *
 * Handles all global block operations (header, footer, modals, etc.)
 */

import { db } from '../supabase/client';

export interface GlobalBlock {
  id: string;
  site_id: string;
  type: 'header' | 'footer' | 'menu_overlay' | 'support_modal' | 'floating_button';
  name: string;
  slug: string;
  visible: boolean;
  content: Record<string, any>;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const GLOBAL_BLOCK_DISPLAY_ORDER: Record<GlobalBlock['type'], number> = {
  header: 0,
  footer: 1,
  menu_overlay: 2,
  support_modal: 3,
  floating_button: 4,
};

export function sortGlobalBlocks(blocks: GlobalBlock[]) {
  return [...blocks].sort((a, b) => {
    const typeOrder =
      (GLOBAL_BLOCK_DISPLAY_ORDER[a.type] ?? Number.MAX_SAFE_INTEGER) -
      (GLOBAL_BLOCK_DISPLAY_ORDER[b.type] ?? Number.MAX_SAFE_INTEGER);

    if (typeOrder !== 0) return typeOrder;

    return a.name.localeCompare(b.name);
  });
}

/**
 * Get all visible global blocks for a site
 */
export async function getGlobalBlocks(siteId?: string) {
  let query = db.globalBlocks().select('*').eq('visible', true);

  if (siteId) {
    query = query.eq('site_id', siteId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching global blocks:', error);
    return [];
  }

  return sortGlobalBlocks((data || []) as GlobalBlock[]);
}

/**
 * Get a specific global block by type
 */
export async function getGlobalBlockByType(type: GlobalBlock['type'], siteId?: string) {
  let query = db.globalBlocks().select('*').eq('type', type).eq('visible', true);

  if (siteId) {
    query = query.eq('site_id', siteId);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error(`Error fetching ${type} block:`, error);
    return null;
  }

  return data as GlobalBlock;
}

/**
 * Get a global block by slug
 */
export async function getGlobalBlockBySlug(slug: string, siteId?: string) {
  let query = db.globalBlocks().select('*').eq('slug', slug);

  if (siteId) {
    query = query.eq('site_id', siteId);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error('Error fetching global block:', error);
    return null;
  }

  return data as GlobalBlock;
}

/**
 * Update a global block
 */
export async function updateGlobalBlock(id: string, updates: Partial<GlobalBlock>) {
  const { data, error } = await db.globalBlocks().update(updates).eq('id', id).select().single();

  if (error) {
    console.error('Error updating global block:', error);
    throw error;
  }

  return data;
}

/**
 * Update global block content
 */
export async function updateGlobalBlockContent(id: string, content: Record<string, any>) {
  return updateGlobalBlock(id, { content });
}

/**
 * Update global block config
 */
export async function updateGlobalBlockConfig(id: string, config: Record<string, any>) {
  return updateGlobalBlock(id, { config });
}

/**
 * Toggle global block visibility
 */
export async function toggleGlobalBlockVisibility(id: string, visible: boolean) {
  return updateGlobalBlock(id, { visible });
}

/**
 * Get header block
 */
export async function getHeader(siteId?: string) {
  return getGlobalBlockByType('header', siteId);
}

/**
 * Get footer block
 */
export async function getFooter(siteId?: string) {
  return getGlobalBlockByType('footer', siteId);
}

/**
 * Get menu overlay block
 */
export async function getMenuOverlay(siteId?: string) {
  return getGlobalBlockByType('menu_overlay', siteId);
}

/**
 * Get support modal block
 */
export async function getSupportModal(siteId?: string) {
  return getGlobalBlockByType('support_modal', siteId);
}

/**
 * Get floating button block
 */
export async function getFloatingButton(siteId?: string) {
  return getGlobalBlockByType('floating_button', siteId);
}