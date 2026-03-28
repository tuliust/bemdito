import { supabase } from './client';

/**
 * Auto-save version when saving a page
 */
export async function savePageVersion(
  pageId: string,
  pageData: any,
  userId?: string
): Promise<void> {
  try {
    // Get next version number
    const { data: nextVersionData } = await supabase
      .rpc('get_next_page_version_number', { p_page_id: pageId });

    const versionNumber = nextVersionData || 1;

    // Insert new version
    const { error } = await supabase
      .from('page_versions')
      .insert({
        page_id: pageId,
        version_number: versionNumber,
        data: pageData,
        created_by: userId || null,
        restore_point: false,
      });

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Auto-save version when saving a section
 */
export async function saveSectionVersion(
  sectionId: string,
  sectionData: any,
  userId?: string
): Promise<void> {
  try {
    // Get next version number
    const { data: nextVersionData } = await supabase
      .rpc('get_next_section_version_number', { p_section_id: sectionId });

    const versionNumber = nextVersionData || 1;

    // Insert new version
    const { error } = await supabase
      .from('section_versions')
      .insert({
        section_id: sectionId,
        version_number: versionNumber,
        data: sectionData,
        created_by: userId || null,
        restore_point: false,
      });

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Load all versions for a page
 */
export async function loadPageVersions(pageId: string) {
  const { data, error } = await supabase
    .from('page_versions')
    .select('*')
    .eq('page_id', pageId)
    .order('version_number', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Load all versions for a section
 */
export async function loadSectionVersions(sectionId: string) {
  const { data, error } = await supabase
    .from('section_versions')
    .select('*')
    .eq('section_id', sectionId)
    .order('version_number', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Restore a page from a version
 */
export async function restorePageVersion(
  pageId: string,
  versionData: any
): Promise<void> {
  try {
    const { error } = await supabase
      .from('pages')
      .update(versionData)
      .eq('id', pageId);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
}

/**
 * Restore a section from a version
 */
export async function restoreSectionVersion(
  sectionId: string,
  versionData: any
): Promise<void> {
  try {
    const { error } = await supabase
      .from('sections')
      .update(versionData)
      .eq('id', sectionId);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
}