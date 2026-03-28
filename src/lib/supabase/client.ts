import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      design_tokens: {
        Row: {
          id: string;
          category: 'color' | 'typography' | 'spacing' | 'radius' | 'transition';
          name: string;
          value: any;
          label: string;
          order: number | null;   // pos 8 — ordenação na UI (2026-02-19)
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['design_tokens']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['design_tokens']['Insert']>;
      };
      menu_items: {
        Row: {
          id: string;
          label: string;
          icon: string | null;
          order: number;
          label_color_token: string | null;   // FK → design_tokens.id (2026-02-19)
          megamenu_config: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['menu_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['menu_items']['Insert']>;
      };
      menu_cards: {
        Row: {
          id: string;
          name: string;
          bg_color_token: string | null;
          border_color_token: string | null;
          icon: string | null;
          icon_size: number | null;            // pos 20 — default 28
          icon_color_token: string | null;
          title: string | null;
          title_font_size: string | null;      // pos 21 — UUID → design_tokens
          title_font_weight: number | null;    // pos 22 — default 600
          title_color_token: string | null;
          subtitle: string | null;
          subtitle_font_size: string | null;   // pos 23 — UUID → design_tokens
          subtitle_font_weight: number | null; // pos 24 — default 400
          subtitle_color_token: string | null;
          url: string | null;
          url_type: 'internal' | 'external' | 'anchor' | null;
          tabs: any;
          active_tab_id: string | null;
          tab_bg_color_token: string | null;
          tab_border_color_token: string | null;
          is_global: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['menu_cards']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['menu_cards']['Insert']>;
      };
      pages: {
        Row: {
          id: string;
          name: string;
          slug: string;
          title: string;
          meta_title: string | null;
          meta_description: string | null;
          meta_keywords: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pages']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['pages']['Insert']>;
      };
      sections: {
        Row: {
          id: string;
          name: string;
          type: string;           // Sempre 'unico' (sistema unificado)
          config: any;            // JSONB: gridCols, gridRows, title, mediaUrl…
          elements: any;          // JSONB: hasMedia, hasCards, hasButton…  (2026-02-19)
          layout: any;            // JSONB: desktop.text/media/cards como GridPosition  (2026-02-19)
          styling: any;           // JSONB: height, spacing.top/bottom/left/right/gap/rowGap  (2026-02-19)
          global: boolean;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sections']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['sections']['Insert']>;
      };
      page_sections: {
        Row: {
          id: string;
          page_id: string;
          section_id: string;
          // ⚠️ config foi DROPADA do banco em algum momento — NÃO existe mais
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['page_sections']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['page_sections']['Insert']>;
      };
      card_templates: {
        Row: {
          id: string;
          name: string;
          variant: string | null;
          config: any;
          is_global: boolean;
          // Grid responsivo
          columns_desktop: number | null;
          columns_tablet: number | null;
          columns_mobile: number | null;
          gap: string | null;
          // Visual do card
          card_bg_color_token: string | null;
          card_border_color_token: string | null;
          card_border_radius: string | null;
          card_padding: string | null;
          card_shadow: string | null;
          // Ícone
          has_icon: boolean | null;
          icon_size: number | null;
          icon_color_token: string | null;
          icon_position: string | null;
          // Título
          has_title: boolean | null;
          title_font_size: string | null;
          title_font_weight: number | null;
          title_color_token: string | null;
          // Subtítulo
          has_subtitle: boolean | null;
          subtitle_font_size: string | null;
          subtitle_font_weight: number | null;
          subtitle_color_token: string | null;
          // Mídia
          has_media: boolean | null;
          media_position: string | null;
          media_aspect_ratio: string | null;
          media_border_radius: string | null;
          media_opacity: number | null;
          example_media_url: string | null;
          // Link
          has_link: boolean | null;
          link_style: string | null;
          link_text_color_token: string | null;
          // Filtros / Tabs
          has_filters: boolean | null;
          filters_position: string | null;
          filter_button_bg_color_token: string | null;
          filter_button_text_color_token: string | null;
          filter_active_bg_color_token: string | null;
          filter_active_text_color_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['card_templates']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['card_templates']['Insert']>;
      };
      card_filters: {
        Row: {
          id: string;
          template_id: string;
          label: string;          // ⚠️ NÃO existe coluna "name" — use "label"
          slug: string | null;
          icon: string | null;
          order_index: number;    // ⚠️ NÃO existe coluna "order" — use "order_index"
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['card_filters']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['card_filters']['Insert']>;
      };
      template_cards: {
        Row: {
          id: string;
          template_id: string;
          icon: string | null;
          title: string | null;
          subtitle: string | null;
          media_url: string | null;
          link_url: string | null;
          link_type: string | null;
          filter_id: string | null;
          filter_tags: string[] | null;
          order_index: number;    // ⚠️ NÃO existe coluna "order" — use "order_index"
          media_opacity: number | null;
          created_at: string;
          updated_at: string;
          // Coluna virtual carregada via JOIN (não existe na tabela)
          _template?: Database['public']['Tables']['card_templates']['Row'];
        };
        Insert: Omit<Database['public']['Tables']['template_cards']['Row'], 'id' | 'created_at' | 'updated_at' | '_template'>;
        Update: Partial<Database['public']['Tables']['template_cards']['Insert']>;
      };
      footer_config: {
        Row: {
          id: string;
          config: any;    // { social: [...], columns: [...], copyright: string }
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['footer_config']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['footer_config']['Insert']>;
      };
      media_assets: {
        Row: {
          id: string;
          filename: string;
          original_filename: string;
          mime_type: string;
          size_bytes: number;
          storage_path: string;
          public_url: string;
          width: number | null;
          height: number | null;
          alt_text: string | null;
          caption: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['media_assets']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['media_assets']['Insert']>;
      };
      page_versions: {
        Row: {
          id: string;
          page_id: string;          // FK → pages.id (CASCADE)
          version_number: number;
          data: any;                // JSONB snapshot completo da página
          created_at: string;
          created_by: string | null;
          restore_point: boolean;
        };
        Insert: Omit<Database['public']['Tables']['page_versions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['page_versions']['Insert']>;
      };
      section_versions: {
        Row: {
          id: string;
          section_id: string;       // FK → sections.id (CASCADE)
          version_number: number;
          data: any;                // JSONB snapshot completo da seção
          created_at: string;
          created_by: string | null;
          restore_point: boolean;
        };
        Insert: Omit<Database['public']['Tables']['section_versions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['section_versions']['Insert']>;
      };
      section_template_cards: {
        // ⚠️ Sem coluna 'id' — PK composta (section_id, template_id)
        // ⚠️ 0 registros reais — vinculação feita via sections.config->>'cardTemplateId'
        Row: {
          section_id: string;       // FK → sections.id (CASCADE)
          template_id: string;      // FK → card_templates.id (CASCADE)
        };
        Insert: Database['public']['Tables']['section_template_cards']['Row'];
        Update: Partial<Database['public']['Tables']['section_template_cards']['Row']>;
      };
      site_config: {
        Row: {
          id: string;
          header: any;
          footer: any;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['site_config']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['site_config']['Insert']>;
      };
    };
  };
};