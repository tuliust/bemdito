/**
 * Templates Service
 *
 * Handles section templates and variants
 */

import { db } from '../supabase/client';

export interface SectionTemplate {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  preview_image?: string;
  schema: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SectionVariant {
  id: string;
  template_id: string;
  name: string;
  slug: string;
  description?: string;
  preview_image?: string;
  config_overrides: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Get all section templates
 */
export async function getTemplates() {
  const { data, error } = await db.sectionTemplates().select('*').order('name');

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return data || [];
}

/**
 * Get template by slug
 */
export async function getTemplateBySlug(slug: string) {
  const { data, error } = await db.sectionTemplates().select('*').eq('slug', slug).single();

  if (error) {
    console.error('Error fetching template:', error);
    return null;
  }

  return data as SectionTemplate;
}

/**
 * Get variants for a template
 */
export async function getVariantsByTemplate(templateId: string) {
  const { data, error } = await db.sectionVariants().select('*').eq('template_id', templateId);

  if (error) {
    console.error('Error fetching variants:', error);
    return [];
  }

  return data || [];
}

/**
 * Get variant by slug
 */
export async function getVariantBySlug(templateSlug: string, variantSlug: string) {
  const template = await getTemplateBySlug(templateSlug);
  if (!template) return null;

  const { data, error } = await db
    .sectionVariants()
    .select('*')
    .eq('template_id', template.id)
    .eq('slug', variantSlug)
    .single();

  if (error) {
    console.error('Error fetching variant:', error);
    return null;
  }

  return data as SectionVariant;
}

/**
 * Get templates grouped by category
 */
export async function getTemplatesByCategory() {
  const templates = await getTemplates();

  return templates.reduce(
    (acc, template) => {
      const category = template.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(template);
      return acc;
    },
    {} as Record<string, SectionTemplate[]>
  );
}
