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
        Row: MediaAsset;
        Insert: Omit<MediaAsset, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<MediaAsset, 'id'>>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, 'id'>;
        Update: Partial<Omit<BlogPost, 'id'>>;
      };
      testimonials: {
        Row: Testimonial;
        Insert: Omit<Testimonial, 'id'>;
        Update: Partial<Omit<Testimonial, 'id'>>;
      };
      awards: {
        Row: Award;
        Insert: Omit<Award, 'id'>;
        Update: Partial<Omit<Award, 'id'>>;
      };
      faq_groups: {
        Row: FAQGroup;
        Insert: Omit<FAQGroup, 'id'>;
        Update: Partial<Omit<FAQGroup, 'id'>>;
      };
      faq_items: {
        Row: FAQItem;
        Insert: Omit<FAQItem, 'id'>;
        Update: Partial<Omit<FAQItem, 'id'>>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
