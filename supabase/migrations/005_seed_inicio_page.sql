-- =====================================================
-- Script SQL: Popular página /inicio com dados reais
-- Versão: 005
-- Data: Fevereiro 2026
-- =====================================================

-- =====================================================
-- PARTE 1: CRIAR TABELAS NECESSÁRIAS
-- =====================================================

-- 1.1 Criar tabela CARDS (para conteúdo reutilizável)
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('service', 'testimonial', 'feature', 'team', 'portfolio', 'blog', 'custom')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  global BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cards_type ON cards(type);
CREATE INDEX IF NOT EXISTS idx_cards_global ON cards(global);
CREATE INDEX IF NOT EXISTS idx_cards_published ON cards(published);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at 
  BEFORE UPDATE ON cards 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 1.2 Criar tabela SECTION_CARDS (vincular cards às seções)
CREATE TABLE IF NOT EXISTS section_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_section_cards_section_id ON section_cards(section_id);
CREATE INDEX IF NOT EXISTS idx_section_cards_card_id ON section_cards(card_id);
CREATE INDEX IF NOT EXISTS idx_section_cards_order ON section_cards(order_index);

-- =====================================================
-- PARTE 2: RLS (Row Level Security)
-- =====================================================

-- Cards
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read cards" ON cards;
CREATE POLICY "Authenticated users can read cards" 
  ON cards FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert cards" ON cards;
CREATE POLICY "Authenticated users can insert cards" 
  ON cards FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update cards" ON cards;
CREATE POLICY "Authenticated users can update cards" 
  ON cards FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete cards" ON cards;
CREATE POLICY "Authenticated users can delete cards" 
  ON cards FOR DELETE TO authenticated USING (true);

-- Acesso público apenas para cards globais e publicados
DROP POLICY IF EXISTS "Public can read published cards" ON cards;
CREATE POLICY "Public can read published cards" 
  ON cards FOR SELECT TO anon USING (published = true);

-- Section Cards
ALTER TABLE section_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read section_cards" ON section_cards;
CREATE POLICY "Authenticated users can read section_cards" 
  ON section_cards FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert section_cards" ON section_cards;
CREATE POLICY "Authenticated users can insert section_cards" 
  ON section_cards FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update section_cards" ON section_cards;
CREATE POLICY "Authenticated users can update section_cards" 
  ON section_cards FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete section_cards" ON section_cards;
CREATE POLICY "Authenticated users can delete section_cards" 
  ON section_cards FOR DELETE TO authenticated USING (true);

-- Acesso público para section_cards de seções publicadas
DROP POLICY IF EXISTS "Public can read section_cards of published sections" ON section_cards;
CREATE POLICY "Public can read section_cards of published sections" 
  ON section_cards FOR SELECT TO anon 
  USING (
    EXISTS (
      SELECT 1 FROM sections 
      WHERE sections.id = section_cards.section_id 
      AND sections.published = true
    )
  );

-- =====================================================
-- PARTE 3: SEED DE DADOS
-- =====================================================

-- 3.1 Criar página /inicio se não existir
INSERT INTO pages (name, slug, title, meta_title, meta_description, published)
VALUES (
  'Início',
  '/inicio',
  'Bem-vindo ao Nosso Site',
  'Início - Soluções Inovadoras',
  'Descubra nossas soluções inovadoras e transforme seu negócio com tecnologia de ponta',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  published = EXCLUDED.published;

-- 3.2 Criar seção Hero para /inicio
INSERT INTO sections (name, type, config, global, published)
VALUES (
  'Hero Início',
  'hero',
  '{
    "title": "Transforme Seu Negócio com Tecnologia",
    "subtitle": "Soluções inovadoras para empresas que querem crescer no mundo digital",
    "backgroundImage": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
    "ctaLabel": "Saiba Mais",
    "ctaUrl": "/contato"
  }'::jsonb,
  false,
  true
)
ON CONFLICT DO NOTHING;

-- 3.3 Criar seção Text+Image para /inicio
INSERT INTO sections (name, type, config, global, published)
VALUES (
  'Sobre Nós - Início',
  'text_image',
  '{
    "title": "Quem Somos",
    "text": "Somos uma empresa dedicada a fornecer soluções tecnológicas de ponta para empresas de todos os tamanhos. Com mais de 10 anos de experiência no mercado, nossa equipe de especialistas está pronta para ajudar você a alcançar seus objetivos digitais.",
    "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    "imagePosition": "right"
  }'::jsonb,
  false,
  true
)
ON CONFLICT DO NOTHING;

-- 3.4 Criar seção Cards Grid para /inicio
INSERT INTO sections (name, type, config, global, published)
VALUES (
  'Nossos Serviços',
  'cards_grid',
  '{
    "title": "Nossos Serviços",
    "subtitle": "Soluções completas para o seu negócio",
    "columns": 3
  }'::jsonb,
  false,
  true
)
ON CONFLICT DO NOTHING;

-- 3.5 Criar cards de serviços
INSERT INTO cards (name, type, config, global, published)
VALUES 
(
  'Desenvolvimento Web',
  'service',
  '{
    "title": "Desenvolvimento Web",
    "description": "Criamos sites modernos e responsivos que convertem visitantes em clientes",
    "image": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
    "icon": "Code",
    "link": "/servicos/web"
  }'::jsonb,
  false,
  true
),
(
  'Marketing Digital',
  'service',
  '{
    "title": "Marketing Digital",
    "description": "Estratégias eficazes para aumentar sua presença online e gerar mais vendas",
    "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    "icon": "TrendingUp",
    "link": "/servicos/marketing"
  }'::jsonb,
  false,
  true
),
(
  'Consultoria',
  'service',
  '{
    "title": "Consultoria",
    "description": "Análise profunda do seu negócio e recomendações estratégicas personalizadas",
    "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    "icon": "Briefcase",
    "link": "/servicos/consultoria"
  }'::jsonb,
  false,
  true
),
(
  'Suporte Técnico',
  'service',
  '{
    "title": "Suporte Técnico",
    "description": "Equipe disponível 24/7 para resolver qualquer problema rapidamente",
    "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    "icon": "Headphones",
    "link": "/servicos/suporte"
  }'::jsonb,
  false,
  true
),
(
  'Design UX/UI',
  'service',
  '{
    "title": "Design UX/UI",
    "description": "Interfaces intuitivas que proporcionam a melhor experiência para seus usuários",
    "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    "icon": "Palette",
    "link": "/servicos/design"
  }'::jsonb,
  false,
  true
),
(
  'Cloud & DevOps',
  'service',
  '{
    "title": "Cloud & DevOps",
    "description": "Infraestrutura escalável e automatização para máxima eficiência",
    "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    "icon": "Cloud",
    "link": "/servicos/cloud"
  }'::jsonb,
  false,
  true
)
ON CONFLICT DO NOTHING;

-- 3.6 Criar seção de Depoimentos
INSERT INTO sections (name, type, config, global, published)
VALUES (
  'Depoimentos - Início',
  'testimonials',
  '{
    "title": "O Que Nossos Clientes Dizem",
    "subtitle": "Veja o feedback de empresas que confiaram em nós"
  }'::jsonb,
  false,
  true
)
ON CONFLICT DO NOTHING;

-- 3.7 Criar cards de depoimentos
INSERT INTO cards (name, type, config, global, published)
VALUES 
(
  'Depoimento - Maria Silva',
  'testimonial',
  '{
    "name": "Maria Silva",
    "role": "CEO, TechStart",
    "text": "A equipe transformou completamente nossa presença digital. Os resultados superaram todas as expectativas!",
    "avatar": "https://i.pravatar.cc/150?img=5",
    "rating": 5
  }'::jsonb,
  false,
  true
),
(
  'Depoimento - João Santos',
  'testimonial',
  '{
    "name": "João Santos",
    "role": "Diretor de Marketing, InovaCorp",
    "text": "Profissionais extremamente competentes e atenciosos. O projeto foi entregue no prazo e com qualidade excepcional.",
    "avatar": "https://i.pravatar.cc/150?img=12",
    "rating": 5
  }'::jsonb,
  false,
  true
),
(
  'Depoimento - Ana Costa',
  'testimonial',
  '{
    "name": "Ana Costa",
    "role": "Gerente de TI, GlobalTech",
    "text": "O suporte técnico é impecável. Sempre prontos para ajudar e resolver qualquer problema rapidamente.",
    "avatar": "https://i.pravatar.cc/150?img=9",
    "rating": 5
  }'::jsonb,
  false,
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PARTE 4: ASSOCIAR SEÇÕES À PÁGINA /inicio
-- =====================================================

DO $$
DECLARE
  v_page_id uuid;
  v_hero_id uuid;
  v_text_image_id uuid;
  v_cards_grid_id uuid;
  v_testimonials_id uuid;
BEGIN
  -- Obter IDs
  SELECT id INTO v_page_id FROM pages WHERE slug = '/inicio';
  SELECT id INTO v_hero_id FROM sections WHERE name = 'Hero Início';
  SELECT id INTO v_text_image_id FROM sections WHERE name = 'Sobre Nós - Início';
  SELECT id INTO v_cards_grid_id FROM sections WHERE name = 'Nossos Serviços';
  SELECT id INTO v_testimonials_id FROM sections WHERE name = 'Depoimentos - Início';

  -- Limpar associações existentes
  DELETE FROM page_sections WHERE page_id = v_page_id;

  -- Inserir nova ordem
  INSERT INTO page_sections (page_id, section_id, config, order_index)
  VALUES 
    (v_page_id, v_hero_id, '{}'::jsonb, 0),
    (v_page_id, v_text_image_id, '{}'::jsonb, 1),
    (v_page_id, v_cards_grid_id, '{}'::jsonb, 2),
    (v_page_id, v_testimonials_id, '{}'::jsonb, 3);
END $$;

-- =====================================================
-- PARTE 5: ASSOCIAR CARDS ÀS SEÇÕES
-- =====================================================

-- 5.1 Associar cards de serviços à seção Cards Grid
DO $$
DECLARE
  v_section_id uuid;
  v_card_web_id uuid;
  v_card_marketing_id uuid;
  v_card_consultoria_id uuid;
  v_card_suporte_id uuid;
  v_card_design_id uuid;
  v_card_cloud_id uuid;
BEGIN
  -- Obter IDs
  SELECT id INTO v_section_id FROM sections WHERE name = 'Nossos Serviços';
  SELECT id INTO v_card_web_id FROM cards WHERE name = 'Desenvolvimento Web';
  SELECT id INTO v_card_marketing_id FROM cards WHERE name = 'Marketing Digital';
  SELECT id INTO v_card_consultoria_id FROM cards WHERE name = 'Consultoria';
  SELECT id INTO v_card_suporte_id FROM cards WHERE name = 'Suporte Técnico';
  SELECT id INTO v_card_design_id FROM cards WHERE name = 'Design UX/UI';
  SELECT id INTO v_card_cloud_id FROM cards WHERE name = 'Cloud & DevOps';

  -- Limpar associações existentes
  DELETE FROM section_cards WHERE section_id = v_section_id;

  -- Inserir nova ordem
  INSERT INTO section_cards (section_id, card_id, config, order_index)
  VALUES 
    (v_section_id, v_card_web_id, '{}'::jsonb, 0),
    (v_section_id, v_card_marketing_id, '{}'::jsonb, 1),
    (v_section_id, v_card_consultoria_id, '{}'::jsonb, 2),
    (v_section_id, v_card_suporte_id, '{}'::jsonb, 3),
    (v_section_id, v_card_design_id, '{}'::jsonb, 4),
    (v_section_id, v_card_cloud_id, '{}'::jsonb, 5);
END $$;

-- 5.2 Associar cards de depoimentos à seção Testimonials
DO $$
DECLARE
  v_section_id uuid;
  v_card_maria_id uuid;
  v_card_joao_id uuid;
  v_card_ana_id uuid;
BEGIN
  -- Obter IDs
  SELECT id INTO v_section_id FROM sections WHERE name = 'Depoimentos - Início';
  SELECT id INTO v_card_maria_id FROM cards WHERE name = 'Depoimento - Maria Silva';
  SELECT id INTO v_card_joao_id FROM cards WHERE name = 'Depoimento - João Santos';
  SELECT id INTO v_card_ana_id FROM cards WHERE name = 'Depoimento - Ana Costa';

  -- Limpar associações existentes
  DELETE FROM section_cards WHERE section_id = v_section_id;

  -- Inserir nova ordem
  INSERT INTO section_cards (section_id, card_id, config, order_index)
  VALUES 
    (v_section_id, v_card_maria_id, '{}'::jsonb, 0),
    (v_section_id, v_card_joao_id, '{}'::jsonb, 1),
    (v_section_id, v_card_ana_id, '{}'::jsonb, 2);
END $$;

-- =====================================================
-- RESUMO FINAL
-- =====================================================
-- ✅ Tabelas criadas: cards, section_cards
-- ✅ Página /inicio criada e publicada
-- ✅ 4 seções: Hero, Text+Image, Cards Grid, Testimonials
-- ✅ 6 cards de serviços
-- ✅ 3 cards de depoimentos
-- ✅ Tudo associado e ordenado corretamente
-- ✅ RLS configurado
-- =====================================================
