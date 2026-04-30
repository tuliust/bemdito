/**
 * Supabase Database Types
 *
 * Este arquivo será gerado automaticamente pelo Supabase CLI:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 *
 * Por enquanto, definimos um placeholder type-safe que mapeia
 * para os tipos já definidos em src/types/cms.ts
 */

import type {
  Page,
  PageSection,
  SectionTemplate,
  SectionVariant,
  SectionItem,
  GlobalBlock,
  NavigationMenu,
  NavigationItem,
  MediaAsset,
  BlogPost,
  Testimonial,
  Award,
  FAQGroup,
  FAQItem,
} from '@/types/cms';

export type Database = {
  public: {
    Tables: {
      pages: {
        Row: Page;
        Insert: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Page, 'id'>>;
      };
      page_sections: {
        Row: PageSection;
        Insert: Omit<PageSection, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<PageSection, 'id'>>;
      };
      section_templates: {
        Row: SectionTemplate;
        Insert: Omit<SectionTemplate, 'id'>;
        Update: Partial<Omit<SectionTemplate, 'id'>>;
      };
      section_variants: {
        Row: SectionVariant;
        Insert: Omit<SectionVariant, 'id'>;
        Update: Partial<Omit<SectionVariant, 'id'>>;
      };
      section_items: {
        Row: SectionItem;
        Insert: Omit<SectionItem, 'id'>;
        Update: Partial<Omit<SectionItem, 'id'>>;
      };
      global_blocks: {
        Row: GlobalBlock;
        Insert: Omit<GlobalBlock, 'id'>;
        Update: Partial<Omit<GlobalBlock, 'id'>>;
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
      // Adicionar outras tabelas conforme necessário
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
