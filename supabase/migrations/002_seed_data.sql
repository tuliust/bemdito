-- =====================================================
-- SEED DATA - Conteúdo Fictício BemDito
-- Execute APÓS o schema principal (001_initial_schema.sql)
-- =====================================================

-- =====================================================
-- CONFIGURAÇÃO DO SITE (Header + Footer)
-- =====================================================

UPDATE site_config SET
  header = '{
    "logo": {
      "url": "/assets/logo-bemdito.svg",
      "alt": "BemDito",
      "link": "/"
    },
    "menu_items": [
      {
        "id": "menu-1",
        "label": "Muito prazer!",
        "icon": "Heart",
        "url": "/",
        "has_dropdown": false
      },
      {
        "id": "menu-2",
        "label": "Tendências e inspiração",
        "icon": "TrendingUp",
        "url": "/tendencias",
        "has_dropdown": true
      },
      {
        "id": "menu-3",
        "label": "Chama a gente",
        "icon": "MessageCircle",
        "url": "/contato",
        "has_dropdown": true
      },
      {
        "id": "menu-4",
        "label": "Ajustes",
        "icon": "Settings",
        "url": "/ajustes",
        "has_dropdown": false
      }
    ],
    "cta": {
      "label": "Entrar",
      "icon": "LogIn",
      "url": "/entrar"
    },
    "sticky": true
  }'::jsonb,
  footer = '{
    "columns": [
      {
        "title": "BemDito",
        "links": [
          {"label": "Sobre nós", "url": "/sobre"},
          {"label": "Cases", "url": "/cases"},
          {"label": "Blog", "url": "/blog"}
        ]
      },
      {
        "title": "Serviços",
        "links": [
          {"label": "Branding", "url": "/servicos/branding"},
          {"label": "Estratégia", "url": "/servicos/estrategia"},
          {"label": "Conteúdo", "url": "/servicos/conteudo"}
        ]
      },
      {
        "title": "Contato",
        "links": [
          {"label": "Fale conosco", "url": "/contato"},
          {"label": "Trabalhe conosco", "url": "/carreiras"}
        ]
      }
    ],
    "social": [
      {"network": "Instagram", "url": "https://instagram.com/bemdito"},
      {"network": "LinkedIn", "url": "https://linkedin.com/company/bemdito"}
    ],
    "copyright": "© 2026 BemDito. Todos os direitos reservados."
  }'::jsonb,
  published = true;

-- =====================================================
-- CARDS FICTÍCIOS
-- =====================================================

DO $$
DECLARE
  token_primary UUID;
  token_secondary UUID;
  token_accent UUID;
  token_background UUID;
  token_dark UUID;
BEGIN
  -- Obter IDs dos tokens
  SELECT id INTO token_primary FROM design_tokens WHERE name = 'primary' AND category = 'color';
  SELECT id INTO token_secondary FROM design_tokens WHERE name = 'secondary' AND category = 'color';
  SELECT id INTO token_accent FROM design_tokens WHERE name = 'accent' AND category = 'color';
  SELECT id INTO token_background FROM design_tokens WHERE name = 'background' AND category = 'color';
  SELECT id INTO token_dark FROM design_tokens WHERE name = 'dark' AND category = 'color';

  -- Cards de Serviços (para megamenu)
  INSERT INTO menu_cards (name, bg_color_token, border_color_token, icon, icon_color_token, title, title_color_token, subtitle, subtitle_color_token, url, url_type, is_global) VALUES
    ('card-branding', token_background, token_primary, 'Palette', token_primary, 'Branding', token_secondary, 'Construa uma marca memorável', token_dark, '/servicos/branding', 'internal', true),
    ('card-estrategia', token_background, token_secondary, 'Target', token_secondary, 'Estratégia', token_secondary, 'Planejamento que gera resultados', token_dark, '/servicos/estrategia', 'internal', true),
    ('card-conteudo', token_background, token_accent, 'FileText', token_accent, 'Conteúdo', token_secondary, 'Histórias que conectam', token_dark, '/servicos/conteudo', 'internal', true),
    ('card-alcance', token_background, token_primary, 'TrendingUp', token_primary, 'Alcance', token_secondary, 'Amplifique sua mensagem', token_dark, '/servicos/alcance', 'internal', true);

  -- Cards de Contato
  INSERT INTO menu_cards (name, bg_color_token, border_color_token, icon, icon_color_token, title, title_color_token, subtitle, subtitle_color_token, url, url_type, is_global) VALUES
    ('card-projeto', token_background, token_primary, 'Briefcase', token_primary, 'Novo Projeto', token_secondary, 'Vamos criar algo incrível juntos', token_dark, '/contato?tipo=projeto', 'internal', true),
    ('card-parceria', token_background, token_accent, 'Users', token_accent, 'Parceria', token_secondary, 'Colabore com a gente', token_dark, '/contato?tipo=parceria', 'internal', true);

  -- Cards para seções com abas
  INSERT INTO menu_cards (name, bg_color_token, border_color_token, icon, icon_color_token, title, title_color_token, subtitle, subtitle_color_token, url, url_type, tabs, active_tab_id, is_global) VALUES
    ('card-identidade', token_background, token_primary, 'Sparkles', token_primary, 'Identidade Visual', token_secondary, 'Logo, cores, tipografia e mais', token_dark, '/servicos/branding/identidade', 'internal', '[{"id": "branding", "label": "Branding"}]'::jsonb, 'branding', true),
    ('card-naming', token_background, token_primary, 'MessageCircle', token_primary, 'Naming', token_secondary, 'O nome perfeito para sua marca', token_dark, '/servicos/branding/naming', 'internal', '[{"id": "branding", "label": "Branding"}]'::jsonb, 'branding', true),
    ('card-posicionamento', token_background, token_secondary, 'Target', token_secondary, 'Posicionamento', token_secondary, 'Encontre seu espaço no mercado', token_dark, '/servicos/estrategia/posicionamento', 'internal', '[{"id": "estrategia", "label": "Estratégia"}]'::jsonb, 'estrategia', true),
    ('card-pesquisa', token_background, token_secondary, 'Search', token_secondary, 'Pesquisa de Mercado', token_secondary, 'Dados que orientam decisões', token_dark, '/servicos/estrategia/pesquisa', 'internal', '[{"id": "estrategia", "label": "Estratégia"}]'::jsonb, 'estrategia', true),
    ('card-copywriting', token_background, token_accent, 'Pencil', token_accent, 'Copywriting', token_secondary, 'Textos que vendem e encantam', token_dark, '/servicos/conteudo/copywriting', 'internal', '[{"id": "conteudo", "label": "Conteúdo"}]'::jsonb, 'conteudo', true),
    ('card-social', token_background, token_accent, 'Share2', token_accent, 'Social Media', token_secondary, 'Presença digital estratégica', token_dark, '/servicos/conteudo/social-media', 'internal', '[{"id": "conteudo", "label": "Conteúdo"}]'::jsonb, 'conteudo', true),
    ('card-ads', token_background, token_primary, 'Zap', token_primary, 'Tráfego Pago', token_secondary, 'Anúncios que convertem', token_dark, '/servicos/alcance/ads', 'internal', '[{"id": "alcance", "label": "Alcance"}]'::jsonb, 'alcance', true),
    ('card-seo', token_background, token_primary, 'TrendingUp', token_primary, 'SEO', token_secondary, 'Apareça nas buscas certas', token_dark, '/servicos/alcance/seo', 'internal', '[{"id": "alcance", "label": "Alcance"}]'::jsonb, 'alcance', true);

  -- Cards de Cases
  INSERT INTO menu_cards (name, bg_color_token, border_color_token, icon, icon_color_token, title, title_color_token, subtitle, subtitle_color_token, url, url_type, is_global) VALUES
    ('card-case-1', token_background, token_primary, 'Award', token_primary, 'Rebranding Café Central', token_secondary, 'Transformação completa de marca', token_dark, '/cases/cafe-central', 'internal', true),
    ('card-case-2', token_background, token_accent, 'Coffee', token_accent, 'Lançamento FreshBrew', token_secondary, 'Do zero ao sucesso em 6 meses', token_dark, '/cases/freshbrew', 'internal', true),
    ('card-case-3', token_background, token_secondary, 'ShoppingCart', token_secondary, 'E-commerce ModaViva', token_secondary, '300% de crescimento em vendas', token_dark, '/cases/modaviva', 'internal', true);

  -- Cards genéricos
  INSERT INTO menu_cards (name, bg_color_token, border_color_token, icon, icon_color_token, title, title_color_token, subtitle, subtitle_color_token, url, url_type, is_global) VALUES
    ('card-cta-1', token_primary, NULL, 'ArrowRight', token_background, 'Vamos começar?', token_background, 'Fale com nosso time hoje', token_background, '/contato', 'internal', true),
    ('card-info-1', token_background, token_accent, 'Info', token_accent, 'Saiba mais', token_secondary, 'Conheça nossa metodologia', token_dark, '/sobre', 'internal', true);

END $$;

-- =====================================================
-- TEMPLATES DE SEÇÕES
-- =====================================================

INSERT INTO section_templates (name, description, thumbnail_url, config, is_global) VALUES
  (
    'Hero com CTA',
    'Seção hero fullscreen com título, subtítulo e botão de ação',
    '/thumbnails/hero-cta.jpg',
    '{"height": "100vh", "background": {"type": "image", "overlay": {"enabled": true, "opacity": 0.5}}, "layout": {"mode": "single", "alignment": "center"}}'::jsonb,
    true
  ),
  (
    'Cards Grid 2x2',
    'Grid 2x2 de cards com ícone, título e descrição',
    '/thumbnails/cards-grid.jpg',
    '{"height": "auto", "background": {"type": "color"}, "layout": {"mode": "grid", "columns": 2, "gap": "lg"}}'::jsonb,
    true
  ),
  (
    'Seção com Tabs',
    'Seção com abas (Branding, Estratégia, Conteúdo, Alcance) e cards filtrados',
    '/thumbnails/tabs-section.jpg',
    '{"height": "auto", "background": {"type": "color"}, "layout": {"mode": "tabs"}}'::jsonb,
    true
  ),
  (
    'Hero com Mídia + Texto',
    'Layout 50/50 com mídia à esquerda e texto à direita',
    '/thumbnails/hero-split.jpg',
    '{"height": "100vh", "background": {"type": "color"}, "layout": {"mode": "double", "split": "50-50"}}'::jsonb,
    true
  ),
  (
    'CTA Fullwidth',
    'Seção CTA com fundo colorido e botão destacado',
    '/thumbnails/cta-full.jpg',
    '{"height": "50vh", "background": {"type": "color"}, "layout": {"mode": "single", "alignment": "center"}}'::jsonb,
    true
  ),
  (
    'Vídeo com Overlay',
    'Seção com vídeo de fundo e texto sobreposto',
    '/thumbnails/video-overlay.jpg',
    '{"height": "100vh", "background": {"type": "video", "overlay": {"enabled": true, "opacity": 0.6}}, "layout": {"mode": "single", "alignment": "center"}}'::jsonb,
    true
  );

-- =====================================================
-- PÁGINAS FICTÍCIAS
-- =====================================================

INSERT INTO pages (slug, title, meta_title, meta_description, status) VALUES
  ('/', 'Home', 'BemDito - Branding e Estratégia Digital', 'Transforme sua marca com nossa expertise em branding, estratégia e conteúdo.', 'published'),
  ('/tendencias', 'Tendências e Inspiração', 'Tendências - BemDito', 'Descubra as últimas tendências em branding e marketing digital.', 'published'),
  ('/contato', 'Chama a gente', 'Contato - BemDito', 'Vamos conversar sobre o seu projeto? Entre em contato conosco.', 'published'),
  ('/ajustes', 'Ajustes', 'Configurações - BemDito', 'Personalize sua experiência no BemDito.', 'published'),
  ('/modelo', 'Página Modelo', 'Modelo - BemDito', 'Página de exemplo para demonstração do CMS.', 'draft');

-- =====================================================
-- SEÇÕES DAS PÁGINAS
-- =====================================================

DO $$
DECLARE
  page_home_id UUID;
  page_tendencias_id UUID;
  page_contato_id UUID;
  page_modelo_id UUID;
  token_primary UUID;
  token_background UUID;
  token_dark UUID;
BEGIN
  -- Obter IDs
  SELECT id INTO page_home_id FROM pages WHERE slug = '/';
  SELECT id INTO page_tendencias_id FROM pages WHERE slug = '/tendencias';
  SELECT id INTO page_contato_id FROM pages WHERE slug = '/contato';
  SELECT id INTO page_modelo_id FROM pages WHERE slug = '/modelo';
  
  SELECT id INTO token_primary FROM design_tokens WHERE name = 'primary' AND category = 'color';
  SELECT id INTO token_background FROM design_tokens WHERE name = 'background' AND category = 'color';
  SELECT id INTO token_dark FROM design_tokens WHERE name = 'dark' AND category = 'color';

  -- SEÇÕES DA HOME
  INSERT INTO sections (page_id, type, config, "order", status) VALUES
    (page_home_id, 'hero', 
      format('{
        "height": "100vh",
        "background": {"type": "image", "url": "/assets/home-hero.jpg", "overlay": {"enabled": true, "color_token": "%s", "opacity": 0.5}},
        "layout": {"mode": "single", "alignment": "center", "blocks": [
          {"type": "text", "variant": "minorTitle", "text": "Bem-vindo ao BemDito", "color_token": "%s"},
          {"type": "text", "variant": "mainTitle", "text": "Transforme sua marca", "color_token": "%s"},
          {"type": "text", "variant": "subtitle", "text": "Branding, estratégia e conteúdo que fazem a diferença", "color_token": "%s"},
          {"type": "button", "label": "Conheça nossos serviços", "url": "#servicos"}
        ]}
      }', token_dark, token_background, token_background, token_background)::jsonb,
      0, 'published'),
    
    (page_home_id, 'tabs',
      '{
        "height": "auto",
        "padding": {"top": "2xl", "bottom": "2xl"},
        "layout": {"mode": "tabs", "title": "Nossos Serviços", "tabs": [
          {"id": "branding", "label": "Branding"},
          {"id": "estrategia", "label": "Estratégia"},
          {"id": "conteudo", "label": "Conteúdo"},
          {"id": "alcance", "label": "Alcance"}
        ]}
      }'::jsonb,
      1, 'published'),
    
    (page_home_id, 'cards_grid',
      '{
        "height": "auto",
        "padding": {"top": "xl", "bottom": "xl"},
        "layout": {"title": "Cases de Sucesso", "subtitle": "Projetos que nos orgulham", "mode": "grid", "columns": 3, "gap": "lg"}
      }'::jsonb,
      2, 'published'),
    
    (page_home_id, 'cta',
      format('{
        "height": "50vh",
        "background": {"type": "color", "color_token": "%s"},
        "layout": {"mode": "single", "alignment": "center", "blocks": [
          {"type": "text", "variant": "mainTitle", "text": "Vamos criar algo incrível juntos?", "color_token": "%s"},
          {"type": "text", "variant": "subtitle", "text": "Entre em contato e comece seu projeto hoje", "color_token": "%s"},
          {"type": "button", "label": "Falar com especialista", "url": "/contato", "variant": "white"}
        ]}
      }', token_primary, token_background, token_background)::jsonb,
      3, 'published');

  -- SEÇÕES DE TENDÊNCIAS
  INSERT INTO sections (page_id, type, config, "order", status) VALUES
    (page_tendencias_id, 'hero',
      format('{
        "height": "100vh",
        "background": {"type": "video", "url": "/assets/tendencias-hero.mp4", "overlay": {"enabled": true, "color_token": "%s", "opacity": 0.4}},
        "layout": {"mode": "single", "alignment": "center", "blocks": [
          {"type": "text", "variant": "minorTitle", "text": "Inspiração", "color_token": "%s"},
          {"type": "text", "variant": "mainTitle", "text": "Tendências que moldam o futuro", "color_token": "%s"},
          {"type": "button", "label": "Explore", "url": "#conteudo"}
        ]}
      }', token_dark, token_background, token_background)::jsonb,
      0, 'published'),
    
    (page_tendencias_id, 'cards_grid',
      '{
        "height": "auto",
        "padding": {"top": "xl", "bottom": "xl"},
        "layout": {"title": "Últimas tendências", "mode": "grid", "columns": 2, "gap": "lg"}
      }'::jsonb,
      1, 'published');

  -- SEÇÕES DE CONTATO
  INSERT INTO sections (page_id, type, config, "order", status) VALUES
    (page_contato_id, 'hero_split',
      '{
        "height": "100vh",
        "layout": {"mode": "double", "split": "50-50", "left": [{"type": "media", "url": "/assets/contato-image.jpg"}], "right": [
          {"type": "text", "variant": "minorTitle", "text": "Contato"},
          {"type": "text", "variant": "mainTitle", "text": "Vamos conversar?"},
          {"type": "text", "variant": "subtitle", "text": "Escolha como prefere falar com a gente"}
        ]}
      }'::jsonb,
      0, 'published'),
    
    (page_contato_id, 'cards_grid',
      '{
        "height": "auto",
        "padding": {"top": "lg", "bottom": "lg"},
        "layout": {"mode": "grid", "columns": 2, "gap": "lg"}
      }'::jsonb,
      1, 'published');

  -- SEÇÕES DA PÁGINA MODELO (Draft)
  INSERT INTO sections (page_id, type, config, "order", status) VALUES
    (page_modelo_id, 'hero',
      '{
        "height": "100vh",
        "background": {"type": "image", "url": "/assets/modelo-hero.jpg", "overlay": {"enabled": true, "opacity": 0.3}},
        "layout": {"mode": "single", "alignment": "center", "blocks": [
          {"type": "text", "variant": "mainTitle", "text": "Página de Modelo"},
          {"type": "text", "variant": "subtitle", "text": "Esta é uma página de exemplo em modo draft"},
          {"type": "button", "label": "Voltar", "url": "/"}
        ]}
      }'::jsonb,
      0, 'draft'),
    
    (page_modelo_id, 'mixed_content',
      '{
        "height": "auto",
        "padding": {"top": "xl", "bottom": "xl"},
        "layout": {"title": "Demonstração de Componentes", "mode": "grid", "columns": 3, "gap": "lg"}
      }'::jsonb,
      1, 'draft');

END $$;

-- =====================================================
-- ASSOCIAR MEGAMENU AOS MENU ITEMS
-- =====================================================

DO $$
DECLARE
  card_branding_id UUID;
  card_estrategia_id UUID;
  card_conteudo_id UUID;
  card_alcance_id UUID;
  card_projeto_id UUID;
  card_parceria_id UUID;
  token_primary UUID;
  token_secondary UUID;
  token_background UUID;
  token_muted UUID;
BEGIN
  -- Obter IDs
  SELECT id INTO card_branding_id FROM menu_cards WHERE name = 'card-branding';
  SELECT id INTO card_estrategia_id FROM menu_cards WHERE name = 'card-estrategia';
  SELECT id INTO card_conteudo_id FROM menu_cards WHERE name = 'card-conteudo';
  SELECT id INTO card_alcance_id FROM menu_cards WHERE name = 'card-alcance';
  SELECT id INTO card_projeto_id FROM menu_cards WHERE name = 'card-projeto';
  SELECT id INTO card_parceria_id FROM menu_cards WHERE name = 'card-parceria';
  
  SELECT id INTO token_primary FROM design_tokens WHERE name = 'primary' AND category = 'color';
  SELECT id INTO token_secondary FROM design_tokens WHERE name = 'secondary' AND category = 'color';
  SELECT id INTO token_background FROM design_tokens WHERE name = 'background' AND category = 'color';
  SELECT id INTO token_muted FROM design_tokens WHERE name = 'muted' AND category = 'color';

  -- Criar menu items com megamenu
  INSERT INTO menu_items (label, icon, "order", megamenu_config) VALUES
    ('Muito prazer!', 'Heart', 0, '{}'::jsonb),
    
    ('Tendências e inspiração', 'TrendingUp', 1, 
      format('{
        "enabled": true,
        "layout": "50-50",
        "media": {"type": "image", "url": "/assets/megamenu-tendencias.jpg", "position": "left"},
        "content": {"title": "Explore nossos serviços", "title_color_token": "%s", "bg_color_token": "%s", "cards": ["%s", "%s", "%s", "%s"]}
      }', token_primary, token_background, card_branding_id, card_estrategia_id, card_conteudo_id, card_alcance_id)::jsonb
    ),
    
    ('Chama a gente', 'MessageCircle', 2,
      format('{
        "enabled": true,
        "layout": "50-50",
        "media": {"type": "image", "url": "/assets/megamenu-contato.jpg", "position": "right"},
        "content": {"title": "Como podemos ajudar?", "title_color_token": "%s", "bg_color_token": "%s", "cards": ["%s", "%s"]}
      }', token_secondary, token_muted, card_projeto_id, card_parceria_id)::jsonb
    ),
    
    ('Ajustes', 'Settings', 3, '{}'::jsonb);

END $$;

-- =====================================================
-- VERIFICAR TOTAIS
-- =====================================================

SELECT 
  'design_tokens' as tabela, COUNT(*) as total FROM design_tokens
UNION ALL
SELECT 'menu_items', COUNT(*) FROM menu_items
UNION ALL
SELECT 'menu_cards', COUNT(*) FROM menu_cards
UNION ALL
SELECT 'pages', COUNT(*) FROM pages
UNION ALL
SELECT 'sections', COUNT(*) FROM sections
UNION ALL
SELECT 'section_templates', COUNT(*) FROM section_templates;

-- =====================================================
-- COMPLETE! Seed data criado com sucesso
-- =====================================================
