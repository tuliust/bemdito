/**
 * Supabase Database Types
 *
 * Hand-maintained to match the real public schema currently running in Supabase.
 */

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface DbPageRow {
  id: string;
  site_id: string;
  title: string;
  slug: string;
  description?: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
}

export interface DbPageSectionRow {
  id: string;
  page_id: string;
  template_id: string;
  variant_id?: string | null;
  order_index: number;
  content: Json;
  config: Json;
  visible?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbSectionTemplateRow {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  description?: string | null;
  schema: Json;
  default_config?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbSectionVariantRow {
  id: string;
  template_id: string;
  name: string;
  slug: string;
  description?: string | null;
  schema_overrides?: Json | null;
  style_preset?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbSectionItemRow {
  id: string;
  section_id: string;
  type: string;
  order_index: number;
  content: Json;
  config?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbSectionBreakpointOverrideRow {
  id: string;
  section_id: string;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  config: Json;
  visible?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbGlobalBlockRow {
  id: string;
  site_id: string;
  type: 'header' | 'footer' | 'menu_overlay' | 'support_modal' | 'floating_button';
  slug: string;
  name: string;
  content: Json;
  config: Json;
  visible?: boolean | null;
  position?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbNavigationMenuRow {
  id: string;
  site_id: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbNavigationItemRow {
  id: string;
  menu_id: string;
  parent_id?: string | null;
  label: string;
  type: string;
  target?: string | null;
  icon?: string | null;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbDesignTokenRow {
  id: string;
  site_id?: string | null;
  category: 'color' | 'typography' | 'spacing' | 'radius' | 'shadow' | 'animation';
  name: string;
  slug: string;
  value: Json;
  created_at?: string;
  updated_at?: string;
}

export interface DbButtonPresetRow {
  id: string;
  site_id: string;
  name: string;
  variant: string;
  size: string;
  style: Json;
  created_at?: string;
  updated_at?: string;
}

export interface DbInputPresetRow {
  id: string;
  site_id: string;
  name: string;
  variant: string;
  size: string;
  style: Json;
  created_at?: string;
  updated_at?: string;
}

export interface DbTypographyStyleRow {
  id: string;
  site_id: string;
  name: string;
  slot: string;
  font_family_id?: string | null;
  font_size: string;
  font_weight: number;
  line_height: string;
  letter_spacing?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbAnimationPresetRow {
  id: string;
  site_id: string;
  name: string;
  type: string;
  config: Json;
  created_at?: string;
  updated_at?: string;
}

export interface DbMediaAssetRow {
  id: string;
  site_id: string;
  folder_id?: string | null;
  filename: string;
  alt_text?: string | null;
  caption?: string | null;
  url: string;
  mime_type: string;
  size: number;
  width?: number | null;
  height?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbBlogPostRow {
  id: string;
  site_id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string | null;
  category?: string | null;
  author_name: string;
  author_avatar?: string | null;
  published_at?: string | null;
  views?: number | null;
  status: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface DbTestimonialRow {
  id: string;
  site_id: string;
  name: string;
  company?: string | null;
  role?: string | null;
  avatar?: string | null;
  content: string;
  rating?: number | null;
  featured?: boolean | null;
  order_index?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbAwardRow {
  id: string;
  site_id: string;
  title: string;
  organization: string;
  year: number;
  logo?: string | null;
  description?: string | null;
  order_index?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbFaqGroupRow {
  id: string;
  site_id: string;
  name: string;
  order_index?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbFaqItemRow {
  id: string;
  group_id: string;
  question: string;
  answer: string;
  order_index?: number | null;
  created_at?: string;
  updated_at?: string;
}

export type Database = {
  public: {
    Tables: {
      pages: {
        Row: DbPageRow;
        Insert: Omit<DbPageRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbPageRow, 'id'>>;
      };
      page_sections: {
        Row: DbPageSectionRow;
        Insert: Omit<DbPageSectionRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbPageSectionRow, 'id'>>;
      };
      section_templates: {
        Row: DbSectionTemplateRow;
        Insert: Omit<DbSectionTemplateRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbSectionTemplateRow, 'id'>>;
      };
      section_variants: {
        Row: DbSectionVariantRow;
        Insert: Omit<DbSectionVariantRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbSectionVariantRow, 'id'>>;
      };
      section_items: {
        Row: DbSectionItemRow;
        Insert: Omit<DbSectionItemRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbSectionItemRow, 'id'>>;
      };
      section_breakpoint_overrides: {
        Row: DbSectionBreakpointOverrideRow;
        Insert: Omit<DbSectionBreakpointOverrideRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbSectionBreakpointOverrideRow, 'id'>>;
      };
      global_blocks: {
        Row: DbGlobalBlockRow;
        Insert: Omit<DbGlobalBlockRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbGlobalBlockRow, 'id'>>;
      };
      navigation_menus: {
        Row: DbNavigationMenuRow;
        Insert: Omit<DbNavigationMenuRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbNavigationMenuRow, 'id'>>;
      };
      navigation_items: {
        Row: DbNavigationItemRow;
        Insert: Omit<DbNavigationItemRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbNavigationItemRow, 'id'>>;
      };
      media_assets: {
        Row: DbMediaAssetRow;
        Insert: Omit<DbMediaAssetRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbMediaAssetRow, 'id'>>;
      };
      design_tokens: {
        Row: DbDesignTokenRow;
        Insert: Omit<DbDesignTokenRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbDesignTokenRow, 'id'>>;
      };
      button_presets: {
        Row: DbButtonPresetRow;
        Insert: Omit<DbButtonPresetRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbButtonPresetRow, 'id'>>;
      };
      input_presets: {
        Row: DbInputPresetRow;
        Insert: Omit<DbInputPresetRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbInputPresetRow, 'id'>>;
      };
      typography_styles: {
        Row: DbTypographyStyleRow;
        Insert: Omit<DbTypographyStyleRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbTypographyStyleRow, 'id'>>;
      };
      animation_presets: {
        Row: DbAnimationPresetRow;
        Insert: Omit<DbAnimationPresetRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbAnimationPresetRow, 'id'>>;
      };
      blog_posts: {
        Row: DbBlogPostRow;
        Insert: Omit<DbBlogPostRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbBlogPostRow, 'id'>>;
      };
      testimonials: {
        Row: DbTestimonialRow;
        Insert: Omit<DbTestimonialRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbTestimonialRow, 'id'>>;
      };
      awards: {
        Row: DbAwardRow;
        Insert: Omit<DbAwardRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbAwardRow, 'id'>>;
      };
      faq_groups: {
        Row: DbFaqGroupRow;
        Insert: Omit<DbFaqGroupRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbFaqGroupRow, 'id'>>;
      };
      faq_items: {
        Row: DbFaqItemRow;
        Insert: Omit<DbFaqItemRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbFaqItemRow, 'id'>>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
