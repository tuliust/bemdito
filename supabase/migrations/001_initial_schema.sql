-- =====================================================
-- CMS SCHEMA - Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DESIGN TOKENS
-- =====================================================
CREATE TABLE design_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('color', 'typography', 'spacing', 'radius', 'transition')),
  name TEXT NOT NULL,
  value JSONB NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, name)
);

CREATE INDEX idx_design_tokens_category ON design_tokens(category);

-- =====================================================
-- MENU ITEMS (Header Navigation)
-- =====================================================
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  icon TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  megamenu_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_items_order ON menu_items("order");

-- =====================================================
-- MENU CARDS (Reusable cards for megamenu and sections)
-- =====================================================
CREATE TABLE menu_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  
  -- Visual properties
  bg_color_token UUID REFERENCES design_tokens(id) ON DELETE SET NULL,
  border_color_token UUID REFERENCES design_tokens(id) ON DELETE SET NULL,
  icon TEXT,
  icon_color_token UUID REFERENCES design_tokens(id) ON DELETE SET NULL,
  
  -- Content
  title TEXT,
  title_color_token UUID REFERENCES design_tokens(id) ON DELETE SET NULL,
  subtitle TEXT,
  subtitle_color_token UUID REFERENCES design_tokens(id) ON DELETE SET NULL,
  
  -- Action
  url TEXT,
  url_type TEXT CHECK (url_type IN ('internal', 'external', 'anchor')),
  
  -- Tabs (optional)
  tabs JSONB DEFAULT '[]'::jsonb,
  active_tab_id TEXT,
  tab_bg_color_token UUID REFERENCES design_tokens(id) ON DELETE SET NULL,
  tab_border_color_token UUID REFERENCES design_tokens(id) ON DELETE SET NULL,
  
  -- Metadata
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_cards_global ON menu_cards(is_global);
CREATE INDEX idx_menu_cards_active_tab ON menu_cards(active_tab_id);

-- =====================================================
-- SECTION TEMPLATES
-- =====================================================
CREATE TABLE section_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_section_templates_global ON section_templates(is_global);

-- =====================================================
-- CARD TEMPLATES
-- =====================================================
CREATE TABLE card_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  variant TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_card_templates_global ON card_templates(is_global);
CREATE INDEX idx_card_templates_variant ON card_templates(variant);

-- =====================================================
-- PAGES
-- =====================================================
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);

-- =====================================================
-- SECTIONS (Belongs to Pages)
-- =====================================================
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  "order" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sections_page_id ON sections(page_id);
CREATE INDEX idx_sections_order ON sections("order");
CREATE INDEX idx_sections_status ON sections(status);

-- =====================================================
-- SITE CONFIG (Global settings)
-- =====================================================
CREATE TABLE site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  header JSONB DEFAULT '{}'::jsonb,
  footer JSONB DEFAULT '{}'::jsonb,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site config
INSERT INTO site_config (header, footer, published) VALUES (
  '{}'::jsonb,
  '{}'::jsonb,
  false
);

-- =====================================================
-- TRIGGERS for updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_design_tokens_updated_at BEFORE UPDATE ON design_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_cards_updated_at BEFORE UPDATE ON menu_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_section_templates_updated_at BEFORE UPDATE ON section_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_card_templates_updated_at BEFORE UPDATE ON card_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE design_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all data
CREATE POLICY "Authenticated users can read design_tokens" ON design_tokens FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read menu_items" ON menu_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read menu_cards" ON menu_cards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read section_templates" ON section_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read card_templates" ON card_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read pages" ON pages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read sections" ON sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read site_config" ON site_config FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can insert design_tokens" ON design_tokens FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update design_tokens" ON design_tokens FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete design_tokens" ON design_tokens FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert menu_items" ON menu_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update menu_items" ON menu_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete menu_items" ON menu_items FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert menu_cards" ON menu_cards FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update menu_cards" ON menu_cards FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete menu_cards" ON menu_cards FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert section_templates" ON section_templates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update section_templates" ON section_templates FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete section_templates" ON section_templates FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert card_templates" ON card_templates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update card_templates" ON card_templates FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete card_templates" ON card_templates FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert pages" ON pages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update pages" ON pages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete pages" ON pages FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert sections" ON sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sections" ON sections FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete sections" ON sections FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can update site_config" ON site_config FOR UPDATE TO authenticated USING (true);

-- Allow public (anon) to read published content
CREATE POLICY "Public can read published pages" ON pages FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Public can read published sections" ON sections FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Public can read design_tokens" ON design_tokens FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read menu_items" ON menu_items FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read menu_cards" ON menu_cards FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read published site_config" ON site_config FOR SELECT TO anon USING (published = true);

-- =====================================================
-- SEED DATA: Initial Design Tokens
-- =====================================================
INSERT INTO design_tokens (category, name, value, label) VALUES
  -- CORES
  ('color', 'primary', '{"hex": "#ea526e"}'::jsonb, 'Primary'),
  ('color', 'secondary', '{"hex": "#2e2240"}'::jsonb, 'Secondary'),
  ('color', 'background', '{"hex": "#f6f6f6"}'::jsonb, 'Background'),
  ('color', 'accent', '{"hex": "#ed9331"}'::jsonb, 'Accent'),
  ('color', 'muted', '{"hex": "#e7e8e8"}'::jsonb, 'Muted'),
  ('color', 'dark', '{"hex": "#020105"}'::jsonb, 'Dark'),
  
  -- TIPOGRAFIA (Poppins apenas)
  ('typography', 'font-family', '{"family": "Poppins", "weights": [300, 400, 500, 600, 700]}'::jsonb, 'Font Family'),
  ('typography', 'minor-title', '{"size": "1rem", "weight": 500, "lineHeight": 1.5}'::jsonb, 'Minor Title'),
  ('typography', 'main-title', '{"size": "2.5rem", "weight": 700, "lineHeight": 1.2}'::jsonb, 'Main Title'),
  ('typography', 'subtitle', '{"size": "1.25rem", "weight": 400, "lineHeight": 1.6}'::jsonb, 'Subtitle'),
  ('typography', 'body', '{"size": "1rem", "weight": 400, "lineHeight": 1.6}'::jsonb, 'Body'),
  ('typography', 'button', '{"size": "0.875rem", "weight": 600, "lineHeight": 1.4}'::jsonb, 'Button'),
  ('typography', 'menu', '{"size": "0.875rem", "weight": 500, "lineHeight": 1.5}'::jsonb, 'Menu'),
  
  -- ESPAÇAMENTO
  ('spacing', 'xs', '{"value": "0.5rem"}'::jsonb, 'Extra Small'),
  ('spacing', 'sm', '{"value": "1rem"}'::jsonb, 'Small'),
  ('spacing', 'md', '{"value": "1.5rem"}'::jsonb, 'Medium'),
  ('spacing', 'lg', '{"value": "2rem"}'::jsonb, 'Large'),
  ('spacing', 'xl', '{"value": "3rem"}'::jsonb, 'Extra Large'),
  ('spacing', '2xl', '{"value": "4rem"}'::jsonb, '2X Large'),
  
  -- BORDER RADIUS (2xl como padrão)
  ('radius', 'none', '{"value": "0"}'::jsonb, 'None'),
  ('radius', 'sm', '{"value": "0.25rem"}'::jsonb, 'Small'),
  ('radius', 'md', '{"value": "0.5rem"}'::jsonb, 'Medium'),
  ('radius', 'lg', '{"value": "0.75rem"}'::jsonb, 'Large'),
  ('radius', 'xl', '{"value": "1rem"}'::jsonb, 'Extra Large'),
  ('radius', '2xl', '{"value": "1.5rem"}'::jsonb, '2X Large (Padrão)'),
  ('radius', 'full', '{"value": "9999px"}'::jsonb, 'Full (Circular)'),
  
  -- TRANSITIONS/EFEITOS
  ('transition', 'fast', '{"duration": "150ms", "easing": "ease-in-out"}'::jsonb, 'Fast'),
  ('transition', 'normal', '{"duration": "300ms", "easing": "ease-in-out"}'::jsonb, 'Normal'),
  ('transition', 'slow', '{"duration": "500ms", "easing": "ease-in-out"}'::jsonb, 'Slow'),
  ('transition', 'bounce', '{"duration": "300ms", "easing": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"}'::jsonb, 'Bounce'),
  ('transition', 'smooth', '{"duration": "400ms", "easing": "cubic-bezier(0.4, 0, 0.2, 1)"}'::jsonb, 'Smooth');

-- =====================================================
-- COMPLETE!
-- =====================================================
