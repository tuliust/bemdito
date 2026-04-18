import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import { projectId, publicAnonKey } from '/utils/supabase/info';

/**
 * Supabase Client for Client-Side Usage
 *
 * Used in:
 * - Client components
 * - Browser-side data fetching
 * - Real-time subscriptions
 */
const SUPABASE_URL = `https://${projectId}.supabase.co`;
const SUPABASE_ANON_KEY = publicAnonKey;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Type-safe table access
 */
export const db = {
  pages: () => supabase.from('pages'),
  pageSections: () => supabase.from('page_sections'),
  sectionTemplates: () => supabase.from('section_templates'),
  sectionVariants: () => supabase.from('section_variants'),
  sectionItems: () => supabase.from('section_items'),
  sectionBreakpointOverrides: () => supabase.from('section_breakpoint_overrides'),
  globalBlocks: () => supabase.from('global_blocks'),
  navigationMenus: () => supabase.from('navigation_menus'),
  navigationItems: () => supabase.from('navigation_items'),
  designTokens: () => supabase.from('design_tokens'),
  buttonPresets: () => supabase.from('button_presets'),
  inputPresets: () => supabase.from('input_presets'),
  typographyStyles: () => supabase.from('typography_styles'),
  animationPresets: () => supabase.from('animation_presets'),
  mediaAssets: () => supabase.from('media_assets'),
  blogPosts: () => supabase.from('blog_posts'),
  testimonials: () => supabase.from('testimonials'),
  awards: () => supabase.from('awards'),
  faqGroups: () => supabase.from('faq_groups'),
  faqItems: () => supabase.from('faq_items'),
  forms: () => supabase.from('forms'),
  formFields: () => supabase.from('form_fields'),
  formSubmissions: () => supabase.from('form_submissions'),
  leads: () => supabase.from('leads'),
};
