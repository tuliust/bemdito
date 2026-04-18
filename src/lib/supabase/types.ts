/**
 * Supabase Database Types
 *
 * This file is still a hand-maintained approximation of the real schema.
 * The goal here is to keep client-side table access aligned with the snake_case
 * database contract used by the current CMS runtime and admin editor.
 */

import type {
  NavigationMenu,
  NavigationItem,
  MediaAsset,
  BlogPost,
  Testimonial,
  Award,
  FAQGroup,
  FAQItem,
} from '@/types/cms';

type Json = Record<string, any>;

export interface DbPageRow {
  id: string;
  site_id: string;
  title: string;
  slug: string;
  status: string;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_image?: string | null;
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
  visible: boolean;
  content: Json;
  content_config?: Json | null;
  style_config?: Json | null;
  layout_config?: Json | null;
  behavior_config?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbSectionTemplateRow {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  preview_image?: string | null;
  schema?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbSectionVariantRow {
  id: string;
  template_id: string;
  name: string;
  slug: string;
  description?: string | null;
  preview_image?: string | null;
  config_overrides?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbSectionItemRow {
  id: string;
  section_id: string;
  order_index: number;
  visible: boolean;
  content: Json;
  created_at?: string;
  updated_at?: string;
}

export interface DbSectionBreakpointOverrideRow {
  id: string;
  section_id: string;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  visible?: boolean | null;
  config_overrides?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbGlobalBlockRow {
  id: string;
  site_id: string;
  type: 'header' | 'footer' | 'menu_overlay' | 'support_modal' | 'floating_button';
  name: string;
  slug: string;
  visible: boolean;
  content: Json;
  config: Json;
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
  site_id?: string | null;
  name: string;
  slug: string;
  variant: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'link';
  size: 'sm' | 'md' | 'lg' | 'xl';
  style_config?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbInputPresetRow {
  id: string;
  site_id?: string | null;
  name: string;
  slug: string;
  variant: 'default' | 'filled' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  style_config?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbTypographyStyleRow {
  id: string;
  site_id?: string | null;
  name: string;
  slug: string;
  role: 'display' | 'heading' | 'title' | 'body' | 'label' | 'caption';
  size: string;
  weight: string;
  line_height?: string | null;
  letter_spacing?: string | null;
  font_family?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbAnimationPresetRow {
  id: string;
  site_id?: string | null;
  name: string;
  slug: string;
  type: string;
  config: Json;
  created_at?: string;
  updated_at?: string;
}

export interface DbMediaAssetRow {
  id: string;
  site_id?: string | null;
  filename: string;
  original_filename?: string | null;
  mime_type: string;
  size_bytes?: number | null;
  width?: number | null;
  height?: number | null;
  url: string;
  thumbnail_url?: string | null;
  alt_text?: string | null;
  caption?: string | null;
  folder?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbBlogPostRow {
  id: string;
  site_id?: string | null;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: Json | null;
  featured_image?: string | null;
  category?: string | null;
  tags?: string[] | null;
  author_name?: string | null;
  author_avatar?: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at?: string | null;
  views?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbTestimonialRow {
  id: string;
  site_id?: string | null;
  content: string;
  author_name: string;
  author_role?: string | null;
  author_company?: string | null;
  author_avatar?: string | null;
  rating?: number | null;
  featured?: boolean | null;
  status?: 'draft' | 'published' | 'archived' | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbAwardRow {
  id: string;
  site_id?: string | null;
  title: string;
  organization: string;
  year?: number | null;
  logo_url?: string | null;
  description?: string | null;
  order_index?: number | null;
  status?: 'draft' | 'published' | 'archived' | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbFaqGroupRow {
  id: string;
  site_id?: string | null;
  name: string;
  slug: string;
  description?: string | null;
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
        Row: NavigationMenu;
        Insert: Omit<NavigationMenu, 'id'>;
        Update: Partial<Omit<NavigationMenu, 'id'>>;
      };
      navigation_items: {
        Row: NavigationItem;
        Insert: Omit<NavigationItem, 'id'>;
        Update: Partial<Omit<NavigationItem, 'id'>>;
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
