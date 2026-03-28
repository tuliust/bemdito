-- =====================================================
-- MIGRATION 003: Update Schema for CMS Managers (Phases 1-6)
-- =====================================================
-- Este script ajusta o schema para suportar todas as 6 fases do CMS

-- =====================================================
-- 1. AJUSTAR TABELA SECTIONS
-- =====================================================
-- A tabela 'sections' atual está vinculada a pages (page_id)
-- Mas o Sections Manager precisa de uma tabela de TEMPLATES globais
-- Vamos renomear a tabela atual e criar novas estruturas

-- Renomear tabela sections atual para page_sections (histórico de seções em páginas)
ALTER TABLE sections RENAME TO page_sections_old;

-- Criar nova tabela 'sections' para TEMPLATES de seções (Sections Manager)
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hero', 'cta', 'tabs', 'cards_grid', 'text_image', 'testimonials')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  global BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sections_type ON sections(type);
CREATE INDEX idx_sections_global ON sections(global);
CREATE INDEX idx_sections_published ON sections(published);

-- Criar tabela 'page_sections' para vincular seções às páginas (Pages Manager)
CREATE TABLE page_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_sections_page_id ON page_sections(page_id);
CREATE INDEX idx_page_sections_section_id ON page_sections(section_id);
CREATE INDEX idx_page_sections_order ON page_sections(order_index);

-- =====================================================
-- 2. AJUSTAR TABELA PAGES
-- =====================================================
-- Adicionar campos que faltam para o Pages Manager

-- Renomear campo 'status' para 'published' (boolean é mais simples)
ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_status_check;
ALTER TABLE pages ADD COLUMN published BOOLEAN DEFAULT false;
UPDATE pages SET published = (status = 'published');
ALTER TABLE pages DROP COLUMN status;

-- Adicionar campo 'name' (nome amigável da página)
ALTER TABLE pages ADD COLUMN name TEXT;
UPDATE pages SET name = title WHERE name IS NULL;
ALTER TABLE pages ALTER COLUMN name SET NOT NULL;

-- Adicionar campo 'meta_keywords'
ALTER TABLE pages ADD COLUMN meta_keywords TEXT;

-- =====================================================
-- 3. ADICIONAR TRIGGERS
-- =====================================================

CREATE TRIGGER update_sections_updated_at 
  BEFORE UPDATE ON sections 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. ATUALIZAR RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS nas novas tabelas
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- Policies para 'sections' (templates)
CREATE POLICY "Authenticated users can read sections" 
  ON sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sections" 
  ON sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sections" 
  ON sections FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete sections" 
  ON sections FOR DELETE TO authenticated USING (true);

-- Acesso público apenas para seções globais e publicadas
CREATE POLICY "Public can read published sections" 
  ON sections FOR SELECT TO anon USING (global = true AND published = true);

-- Policies para 'page_sections'
CREATE POLICY "Authenticated users can read page_sections" 
  ON page_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert page_sections" 
  ON page_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update page_sections" 
  ON page_sections FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete page_sections" 
  ON page_sections FOR DELETE TO authenticated USING (true);

-- Acesso público para page_sections de páginas publicadas
CREATE POLICY "Public can read page_sections of published pages" 
  ON page_sections FOR SELECT TO anon 
  USING (
    EXISTS (
      SELECT 1 FROM pages 
      WHERE pages.id = page_sections.page_id 
      AND pages.published = true
    )
  );

-- Atualizar policy de pages para usar 'published' em vez de 'status'
DROP POLICY IF EXISTS "Public can read published pages" ON pages;
CREATE POLICY "Public can read published pages" 
  ON pages FOR SELECT TO anon USING (published = true);

-- =====================================================
-- 5. SEED: Templates de Seções Iniciais
-- =====================================================

INSERT INTO sections (name, type, config, global, published) VALUES
  -- Hero
  (
    'Hero Principal',
    'hero',
    '{
      "title": "Bem-vindo ao BemDito",
      "subtitle": "Transformamos ideias em realidade",
      "backgroundImage": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200",
      "ctaLabel": "Saiba Mais",
      "ctaUrl": "/sobre"
    }'::jsonb,
    true,
    true
  ),
  
  -- CTA
  (
    'CTA Conversão',
    'cta',
    '{
      "title": "Pronto para começar?",
      "description": "Entre em contato conosco hoje mesmo",
      "primaryLabel": "Começar Agora",
      "primaryUrl": "/contato"
    }'::jsonb,
    true,
    true
  ),
  
  -- Tabs
  (
    'Nossos Serviços - Tabs',
    'tabs',
    '{
      "title": "Nossos Serviços"
    }'::jsonb,
    true,
    true
  ),
  
  -- Cards Grid
  (
    'Destaques - Grid 3 Colunas',
    'cards_grid',
    '{
      "title": "Nossos Destaques",
      "columns": 3
    }'::jsonb,
    true,
    true
  ),
  
  -- Text + Image
  (
    'Sobre Nós - Texto e Imagem',
    'text_image',
    '{
      "title": "Sobre Nós",
      "text": "Somos uma empresa focada em inovação e qualidade, criando soluções digitais que transformam negócios.",
      "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
      "imagePosition": "right"
    }'::jsonb,
    true,
    true
  ),
  
  -- Testimonials
  (
    'Depoimentos de Clientes',
    'testimonials',
    '{
      "title": "O que dizem nossos clientes"
    }'::jsonb,
    true,
    true
  );

-- =====================================================
-- 6. SEED: Página Home Exemplo
-- =====================================================

-- Criar página Home
INSERT INTO pages (name, slug, title, meta_title, meta_description, meta_keywords, published)
VALUES (
  'Página Inicial',
  '/',
  'BemDito - Transformando Ideias em Realidade',
  'BemDito - Soluções Digitais Inovadoras',
  'Empresa especializada em branding, estratégia e conteúdo digital',
  'bemdito, branding, estratégia, digital',
  true
);

-- Adicionar seções à página Home
DO $$
DECLARE
  home_page_id UUID;
  hero_section_id UUID;
  tabs_section_id UUID;
  cta_section_id UUID;
BEGIN
  -- Buscar IDs
  SELECT id INTO home_page_id FROM pages WHERE slug = '/';
  SELECT id INTO hero_section_id FROM sections WHERE name = 'Hero Principal';
  SELECT id INTO tabs_section_id FROM sections WHERE name = 'Nossos Serviços - Tabs';
  SELECT id INTO cta_section_id FROM sections WHERE name = 'CTA Conversão';
  
  -- Adicionar seções
  INSERT INTO page_sections (page_id, section_id, config, order_index) VALUES
    (home_page_id, hero_section_id, '{}'::jsonb, 0),
    (home_page_id, tabs_section_id, '{}'::jsonb, 1),
    (home_page_id, cta_section_id, '{}'::jsonb, 2);
END $$;

-- =====================================================
-- 7. CLEANUP: Remover tabela antiga (CUIDADO!)
-- =====================================================
-- DESCOMENTE APENAS SE TIVER CERTEZA QUE NÃO PRECISA DOS DADOS ANTIGOS
-- DROP TABLE page_sections_old;

-- Remover tabelas não utilizadas pelas 6 fases
DROP TABLE IF EXISTS section_templates CASCADE;
DROP TABLE IF EXISTS card_templates CASCADE;

-- =====================================================
-- MIGRATION COMPLETA!
-- =====================================================
-- Agora o banco está 100% compatível com:
-- ✅ Fase 1: Header Público
-- ✅ Fase 2: SectionRenderer
-- ✅ Fase 3: Site Config Manager
-- ✅ Fase 4: Footer Manager
-- ✅ Fase 5: Sections Manager
-- ✅ Fase 6: Pages Manager
-- =====================================================
