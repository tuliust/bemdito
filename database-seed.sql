-- ============================================================================
-- SEED DATA FOR CMS PLATFORM
-- Initial data for home page with 12 sections + global blocks
-- ============================================================================

-- ============================================================================
-- 1. CREATE MAIN SITE
-- ============================================================================

INSERT INTO sites (id, name, domain, slug, status)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'Plataforma de Bem-Estar Corporativo',
  'wellnesscorp.com',
  'main',
  'active'
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. CREATE SECTION TEMPLATES
-- ============================================================================

INSERT INTO section_templates (id, name, slug, description, category, schema)
VALUES
  -- Hero Section
  ('t0000000-0000-0000-0000-000000000001'::uuid, 'Hero Section', 'hero_section', 'Main hero banner with title, description, CTAs and image', 'hero', '{}'::jsonb),

  -- Stats Cards Section
  ('t0000000-0000-0000-0000-000000000002'::uuid, 'Stats Cards Section', 'stats_cards_section', 'Statistics cards in a grid layout', 'stats', '{}'::jsonb),

  -- Feature Showcase Section
  ('t0000000-0000-0000-0000-000000000003'::uuid, 'Feature Showcase Section', 'feature_showcase_section', 'Feature presentation with image and benefits list', 'features', '{}'::jsonb),

  -- Icon Feature List Section
  ('t0000000-0000-0000-0000-000000000004'::uuid, 'Icon Feature List Section', 'icon_feature_list_section', 'Grid of features with icons', 'features', '{}'::jsonb),

  -- Logo Marquee Section
  ('t0000000-0000-0000-0000-000000000005'::uuid, 'Logo Marquee Section', 'logo_marquee_section', 'Scrolling logos carousel', 'social-proof', '{}'::jsonb),

  -- Newsletter Capture Section
  ('t0000000-0000-0000-0000-000000000006'::uuid, 'Newsletter Capture Section', 'newsletter_capture_section', 'Email subscription form', 'forms', '{}'::jsonb),

  -- Featured Article Section
  ('t0000000-0000-0000-0000-000000000007'::uuid, 'Featured Article Section', 'featured_article_section', 'Blog article highlight', 'content', '{}'::jsonb),

  -- Testimonials Section
  ('t0000000-0000-0000-0000-000000000008'::uuid, 'Testimonials Section', 'testimonials_section', 'Customer testimonials carousel', 'social-proof', '{}'::jsonb),

  -- FAQ Section
  ('t0000000-0000-0000-0000-000000000009'::uuid, 'FAQ Section', 'faq_section', 'Frequently asked questions accordion', 'content', '{}'::jsonb),

  -- Closing CTA Section
  ('t0000000-0000-0000-0000-00000000000a'::uuid, 'Closing CTA Section', 'closing_cta_section', 'Final call-to-action with image', 'cta', '{}'::jsonb),

  -- Lead Capture Section
  ('t0000000-0000-0000-0000-00000000000b'::uuid, 'Lead Capture Section', 'lead_capture_section', 'Contact form for leads', 'forms', '{}'::jsonb),

  -- Awards Section
  ('t0000000-0000-0000-0000-00000000000c'::uuid, 'Awards Section', 'awards_section', 'Awards and recognitions grid', 'social-proof', '{}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. CREATE SECTION VARIANTS
-- ============================================================================

INSERT INTO section_variants (id, template_id, name, slug, description, config_overrides)
VALUES
  -- Feature Showcase - Analytics Dashboard
  (
    'v0000000-0000-0000-0000-000000000001'::uuid,
    't0000000-0000-0000-0000-000000000003'::uuid,
    'Analytics Dashboard',
    'analytics_dashboard',
    'Analytics dashboard variant with stat overlays',
    '{"layout": "image-right", "overlay_style": "stat", "icon_style": "check"}'::jsonb
  ),

  -- Feature Showcase - Wellness Routine
  (
    'v0000000-0000-0000-0000-000000000002'::uuid,
    't0000000-0000-0000-0000-000000000003'::uuid,
    'Wellness Routine',
    'wellness_routine',
    'Wellness routine variant with chip overlays',
    '{"layout": "image-left", "overlay_style": "chip", "icon_style": "circle"}'::jsonb
  ),

  -- Feature Showcase - Single Feature Promo
  (
    'v0000000-0000-0000-0000-000000000003'::uuid,
    't0000000-0000-0000-0000-000000000003'::uuid,
    'Single Feature Promo',
    'single_feature_promo',
    'Single feature promotional variant',
    '{"layout": "centered", "show_overlays": false, "icon_style": "check"}'::jsonb
  )
ON CONFLICT (template_id, slug) DO NOTHING;

-- ============================================================================
-- 4. CREATE HOME PAGE
-- ============================================================================

INSERT INTO pages (id, site_id, title, slug, status, meta_title, meta_description, published_at)
VALUES (
  'p0000000-0000-0000-0000-000000000001'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'Home',
  '/',
  'published',
  'Plataforma de Bem-Estar Corporativo | Transforme sua empresa',
  'Plataforma completa de gestão de bem-estar com analytics em tempo real, rotinas personalizadas e acompanhamento integrado.',
  NOW()
) ON CONFLICT (site_id, slug) DO NOTHING;

-- ============================================================================
-- 5. CREATE PAGE SECTIONS FOR HOME (12 sections in order)
-- ============================================================================

-- SECTION 1: Hero Section
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-000000000001'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-000000000001'::uuid,
  NULL,
  1,
  true,
  '{
    "eyebrow": "Bem-estar corporativo",
    "title": "Transforme a saúde e produtividade da sua equipe",
    "description": "Plataforma completa de gestão de bem-estar com analytics em tempo real, rotinas personalizadas e acompanhamento integrado.",
    "primaryCTA": {"label": "Começar agora", "href": "/cadastro"},
    "secondaryCTA": {"label": "Ver demonstração", "href": "/demo"},
    "image": {"src": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop", "alt": "Equipe colaborando"}
  }'::jsonb,
  '{"background": "gradient", "textAlign": "left"}'::jsonb,
  '{"container": "wide", "padding": "large"}'::jsonb
) ON CONFLICT DO NOTHING;

-- SECTION 2: Stats Cards Section
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-000000000002'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-000000000002'::uuid,
  NULL,
  2,
  true,
  '{}'::jsonb,
  '{"background": "white", "cardStyle": "elevated"}'::jsonb,
  '{"container": "standard", "columns": 3, "gap": "large"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Stats items
INSERT INTO section_items (section_id, order_index, content)
VALUES
  ('s0000000-0000-0000-0000-000000000002'::uuid, 0, '{"value": "94%", "label": "Taxa de engajamento", "description": "Usuários ativos mensalmente"}'::jsonb),
  ('s0000000-0000-0000-0000-000000000002'::uuid, 1, '{"value": "2.5x", "label": "Aumento de produtividade", "description": "Medido nos primeiros 3 meses"}'::jsonb),
  ('s0000000-0000-0000-0000-000000000002'::uuid, 2, '{"value": "500+", "label": "Empresas confiaram", "description": "Em todo o Brasil"}'::jsonb);

-- SECTION 3: Feature Showcase A - Analytics Dashboard
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-000000000003'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-000000000003'::uuid,
  'v0000000-0000-0000-0000-000000000001'::uuid,
  3,
  true,
  '{
    "title": "Dashboard de analytics em tempo real",
    "description": "Acompanhe métricas de bem-estar, engajamento e produtividade com visualizações intuitivas e insights acionáveis.",
    "image": {"src": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop", "alt": "Analytics Dashboard"},
    "overlays": [
      {"type": "stat", "content": "87% engajamento", "position": {"top": "10%", "right": "10%"}},
      {"type": "label", "content": "Atualizado agora", "position": {"bottom": "15%", "left": "10%"}}
    ]
  }'::jsonb,
  '{"imagePosition": "right"}'::jsonb,
  '{"container": "standard", "split": "50/50"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Benefits for Analytics Dashboard
INSERT INTO section_items (section_id, order_index, content)
VALUES
  ('s0000000-0000-0000-0000-000000000003'::uuid, 0, '{"text": "Visualização em tempo real de todas as métricas", "icon": "check"}'::jsonb),
  ('s0000000-0000-0000-0000-000000000003'::uuid, 1, '{"text": "Relatórios automáticos semanais e mensais", "icon": "check"}'::jsonb),
  ('s0000000-0000-0000-0000-000000000003'::uuid, 2, '{"text": "Insights personalizados baseados em IA", "icon": "check"}'::jsonb);

-- SECTION 4: Feature Showcase B - Wellness Routine
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-000000000004'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-000000000003'::uuid,
  'v0000000-0000-0000-0000-000000000002'::uuid,
  4,
  true,
  '{
    "title": "Rotinas de bem-estar personalizadas",
    "description": "Crie e acompanhe rotinas personalizadas para cada colaborador com lembretes inteligentes e gamificação.",
    "image": {"src": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop", "alt": "Wellness Routine"},
    "overlays": [
      {"type": "chip", "content": "Meditação", "position": {"top": "15%", "left": "15%"}},
      {"type": "chip", "content": "Exercícios", "position": {"top": "30%", "right": "20%"}},
      {"type": "chip", "content": "Hidratação", "position": {"bottom": "20%", "left": "25%"}}
    ]
  }'::jsonb,
  '{"imagePosition": "left"}'::jsonb,
  '{"container": "standard", "split": "50/50"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Benefits for Wellness Routine
INSERT INTO section_items (section_id, order_index, content)
VALUES
  ('s0000000-0000-0000-0000-000000000004'::uuid, 0, '{"text": "Rotinas adaptadas ao perfil de cada colaborador", "icon": "circle"}'::jsonb),
  ('s0000000-0000-0000-0000-000000000004'::uuid, 1, '{"text": "Lembretes automáticos via app e email", "icon": "circle"}'::jsonb),
  ('s0000000-0000-0000-0000-000000000004'::uuid, 2, '{"text": "Sistema de pontos e recompensas", "icon": "circle"}'::jsonb);

-- SECTION 5: Icon Feature List Section
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-000000000005'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-000000000004'::uuid,
  NULL,
  5,
  true,
  '{"title": "Recursos completos para gestão de bem-estar"}'::jsonb,
  '{"background": "subtle"}'::jsonb,
  '{"container": "standard", "columns": 3, "gap": "large"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Icon features
INSERT INTO section_items (section_id, order_index, content)
VALUES
  ('s0000000-0000-0000-0000-000000000005'::uuid, 0, '{"icon": "Activity", "title": "Monitoramento de saúde", "description": "Acompanhe indicadores de saúde física e mental com integrações com dispositivos wearables."}'::jsonb),
  ('s0000000-0000-0000-0000-000000000005'::uuid, 1, '{"icon": "Users", "title": "Gestão de equipes", "description": "Organize colaboradores em grupos, defina metas coletivas e acompanhe o progresso de cada time."}'::jsonb),
  ('s0000000-0000-0000-0000-000000000005'::uuid, 2, '{"icon": "Calendar", "title": "Agendamento integrado", "description": "Agende consultas, atividades e eventos de bem-estar com calendário sincronizado."}'::jsonb),
  ('s0000000-0000-0000-0000-000000000005'::uuid, 3, '{"icon": "Award", "title": "Programas de incentivo", "description": "Crie campanhas de incentivo com metas, recompensas e reconhecimento público."}'::jsonb),
  ('s0000000-0000-0000-0000-000000000005'::uuid, 4, '{"icon": "MessageCircle", "title": "Suporte 24/7", "description": "Chat ao vivo com especialistas em bem-estar, nutrição e psicologia corporativa."}'::jsonb),
  ('s0000000-0000-0000-0000-000000000005'::uuid, 5, '{"icon": "Shield", "title": "Conformidade LGPD", "description": "Dados protegidos com criptografia de ponta a ponta e conformidade total com LGPD."}'::jsonb);

-- SECTION 6: Logo Marquee Section
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-000000000006'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-000000000005'::uuid,
  NULL,
  6,
  true,
  '{"title": "Empresas que confiam em nossa plataforma"}'::jsonb,
  '{"animation": "marquee", "speed": "medium"}'::jsonb,
  '{"container": "wide"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Logo items
INSERT INTO section_items (section_id, order_index, content)
VALUES
  ('s0000000-0000-0000-0000-000000000006'::uuid, 0, '{"src": "https://via.placeholder.com/120x40/0a1628/ffffff?text=Logo+1", "alt": "Logo 1"}'::jsonb),
  ('s0000000-0000-0000-0000-000000000006'::uuid, 1, '{"src": "https://via.placeholder.com/120x40/0a1628/ffffff?text=Logo+2", "alt": "Logo 2"}'::jsonb),
  ('s0000000-0000-0000-0000-000000000006'::uuid, 2, '{"src": "https://via.placeholder.com/120x40/0a1628/ffffff?text=Logo+3", "alt": "Logo 3"}'::jsonb),
  ('s0000000-0000-0000-0000-000000000006'::uuid, 3, '{"src": "https://via.placeholder.com/120x40/0a1628/ffffff?text=Logo+4", "alt": "Logo 4"}'::jsonb),
  ('s0000000-0000-0000-0000-000000000006'::uuid, 4, '{"src": "https://via.placeholder.com/120x40/0a1628/ffffff?text=Logo+5", "alt": "Logo 5"}'::jsonb);

-- SECTION 7: Single Feature Promo
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-000000000007'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-000000000003'::uuid,
  'v0000000-0000-0000-0000-000000000003'::uuid,
  7,
  true,
  '{
    "title": "Alcance seus objetivos com acompanhamento inteligente",
    "description": "Nossa plataforma utiliza inteligência artificial para sugerir ações personalizadas e acompanhar o progresso individual e coletivo em tempo real.",
    "image": {"src": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop", "alt": "Acompanhamento inteligente"}
  }'::jsonb,
  '{"layout": "centered"}'::jsonb,
  '{"container": "standard"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Single benefit
INSERT INTO section_items (section_id, order_index, content)
VALUES
  ('s0000000-0000-0000-0000-000000000007'::uuid, 0, '{"text": "Sugestões personalizadas baseadas em padrões de comportamento e preferências", "icon": "check"}'::jsonb);

-- SECTION 8: Featured Article Section
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-000000000008'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-000000000007'::uuid,
  NULL,
  8,
  true,
  '{
    "title": "Últimas novidades",
    "article": {
      "image": {"src": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop", "alt": "Artigo em destaque"},
      "category": "Bem-estar corporativo",
      "title": "5 estratégias comprovadas para aumentar o engajamento em programas de bem-estar",
      "author": {"name": "Ana Silva", "avatar": "https://i.pravatar.cc/150?img=1"},
      "publishedAt": "15 de março, 2026",
      "views": 2847,
      "href": "/blog/estrategias-engajamento"
    }
  }'::jsonb,
  '{"cardStyle": "featured"}'::jsonb,
  '{"container": "standard"}'::jsonb
) ON CONFLICT DO NOTHING;

-- SECTION 9: Testimonials Section
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-000000000009'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-000000000008'::uuid,
  NULL,
  9,
  true,
  '{
    "badge": "⭐ 4.9/5 avaliação média",
    "title": "O que nossos clientes dizem"
  }'::jsonb,
  '{"cardStyle": "elevated", "showRating": true}'::jsonb,
  '{"container": "standard", "columns": 3}'::jsonb
) ON CONFLICT DO NOTHING;

-- Testimonial items
INSERT INTO section_items (section_id, order_index, content)
VALUES
  ('s0000000-0000-0000-0000-000000000009'::uuid, 0, '{"content": "A plataforma transformou completamente a cultura de bem-estar na nossa empresa. Os colaboradores estão mais engajados e produtivos.", "author": {"name": "Carlos Mendes", "role": "Diretor de RH", "company": "TechCorp", "avatar": "https://i.pravatar.cc/150?img=12"}, "rating": 5}'::jsonb),
  ('s0000000-0000-0000-0000-000000000009'::uuid, 1, '{"content": "Implementação super fácil e suporte excepcional. Nossos indicadores de satisfação aumentaram 40% em apenas 3 meses.", "author": {"name": "Mariana Costa", "role": "CEO", "company": "StartupX", "avatar": "https://i.pravatar.cc/150?img=5"}, "rating": 5}'::jsonb),
  ('s0000000-0000-0000-0000-000000000009'::uuid, 2, '{"content": "Os relatórios e analytics são incríveis. Finalmente conseguimos medir o ROI dos nossos programas de bem-estar.", "author": {"name": "Roberto Lima", "role": "Gerente de Pessoas", "company": "InnovaCorp", "avatar": "https://i.pravatar.cc/150?img=8"}, "rating": 5}'::jsonb);

-- SECTION 10: FAQ Section
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-00000000000a'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-000000000009'::uuid,
  NULL,
  10,
  true,
  '{"title": "Perguntas frequentes"}'::jsonb,
  '{"accordionStyle": "minimal"}'::jsonb,
  '{"container": "narrow"}'::jsonb
) ON CONFLICT DO NOTHING;

-- FAQ items
INSERT INTO section_items (section_id, order_index, content)
VALUES
  ('s0000000-0000-0000-0000-00000000000a'::uuid, 0, '{"question": "Como funciona a implementação da plataforma?", "answer": "A implementação é simples e rápida. Nossa equipe faz todo o setup inicial em até 48 horas, incluindo integração com seus sistemas existentes, configuração de usuários e treinamento da equipe."}'::jsonb),
  ('s0000000-0000-0000-0000-00000000000a'::uuid, 1, '{"question": "A plataforma é compatível com dispositivos wearables?", "answer": "Sim! Integramos com os principais dispositivos do mercado como Apple Watch, Fitbit, Garmin e outros. Os dados são sincronizados automaticamente e aparecem no dashboard em tempo real."}'::jsonb),
  ('s0000000-0000-0000-0000-00000000000a'::uuid, 2, '{"question": "Como é feita a proteção dos dados dos colaboradores?", "answer": "Levamos a privacidade muito a sério. Todos os dados são criptografados de ponta a ponta, armazenados em servidores seguros no Brasil e estamos em total conformidade com a LGPD. Cada colaborador tem controle total sobre seus próprios dados."}'::jsonb),
  ('s0000000-0000-0000-0000-00000000000a'::uuid, 3, '{"question": "Qual é o custo da plataforma?", "answer": "Oferecemos planos flexíveis baseados no número de colaboradores e recursos necessários. Entre em contato com nossa equipe comercial para receber uma proposta personalizada para sua empresa."}'::jsonb),
  ('s0000000-0000-0000-0000-00000000000a'::uuid, 4, '{"question": "Posso testar antes de contratar?", "answer": "Sim! Oferecemos um período de teste gratuito de 14 dias com acesso completo a todos os recursos premium. Não é necessário cartão de crédito para começar."}'::jsonb);

-- SECTION 11: Closing CTA Section
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-00000000000b'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-00000000000a'::uuid,
  NULL,
  11,
  true,
  '{
    "title": "Pronto para transformar o bem-estar na sua empresa?",
    "description": "Junte-se a centenas de empresas que já estão investindo no que realmente importa: pessoas.",
    "tagline": "Comece grátis hoje mesmo",
    "cta": {"label": "Iniciar teste gratuito", "href": "/cadastro"},
    "image": {"src": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop", "alt": "Equipe feliz"}
  }'::jsonb,
  '{"background": "brand", "textColor": "white"}'::jsonb,
  '{"container": "wide", "split": "60/40"}'::jsonb
) ON CONFLICT DO NOTHING;

-- SECTION 12: Newsletter Capture Section
INSERT INTO page_sections (id, page_id, template_id, variant_id, order_index, visible, content, style_config, layout_config)
VALUES (
  's0000000-0000-0000-0000-00000000000c'::uuid,
  'p0000000-0000-0000-0000-000000000001'::uuid,
  't0000000-0000-0000-0000-000000000006'::uuid,
  NULL,
  12,
  true,
  '{
    "title": "Fique atualizado",
    "description": "Receba insights semanais sobre bem-estar corporativo, produtividade e cultura organizacional."
  }'::jsonb,
  '{"background": "subtle", "formStyle": "inline"}'::jsonb,
  '{"container": "narrow"}'::jsonb
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. CREATE GLOBAL BLOCKS
-- ============================================================================

-- Header
INSERT INTO global_blocks (id, site_id, type, name, slug, visible, content, config)
VALUES (
  'g0000000-0000-0000-0000-000000000001'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'header',
  'Main Header',
  'main-header',
  true,
  '{
    "logo": {"src": "/logo.svg", "alt": "WellnessCorp"},
    "navigation": [
      {"label": "Recursos", "href": "/recursos"},
      {"label": "Preços", "href": "/precos"},
      {"label": "Blog", "href": "/blog"},
      {"label": "Contato", "href": "/contato"}
    ],
    "cta": {"label": "Começar grátis", "href": "/cadastro"}
  }'::jsonb,
  '{"sticky": true, "transparent": false}'::jsonb
) ON CONFLICT (site_id, slug) DO NOTHING;

-- Menu Overlay
INSERT INTO global_blocks (id, site_id, type, name, slug, visible, content, config)
VALUES (
  'g0000000-0000-0000-0000-000000000002'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'menu_overlay',
  'Mobile Menu',
  'mobile-menu',
  true,
  '{
    "navigation": [
      {"label": "Recursos", "href": "/recursos"},
      {"label": "Preços", "href": "/precos"},
      {"label": "Blog", "href": "/blog"},
      {"label": "Sobre", "href": "/sobre"},
      {"label": "Contato", "href": "/contato"}
    ],
    "cta": {"label": "Começar grátis", "href": "/cadastro"}
  }'::jsonb,
  '{"animation": "slide-right"}'::jsonb
) ON CONFLICT (site_id, slug) DO NOTHING;

-- Footer
INSERT INTO global_blocks (id, site_id, type, name, slug, visible, content, config)
VALUES (
  'g0000000-0000-0000-0000-000000000003'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'footer',
  'Main Footer',
  'main-footer',
  true,
  '{
    "logo": {"src": "/logo.svg", "alt": "WellnessCorp"},
    "description": "Plataforma completa de gestão de bem-estar corporativo",
    "navigation": {
      "product": [
        {"label": "Recursos", "href": "/recursos"},
        {"label": "Preços", "href": "/precos"},
        {"label": "Demonstração", "href": "/demo"}
      ],
      "company": [
        {"label": "Sobre", "href": "/sobre"},
        {"label": "Blog", "href": "/blog"},
        {"label": "Contato", "href": "/contato"}
      ],
      "legal": [
        {"label": "Privacidade", "href": "/privacidade"},
        {"label": "Termos", "href": "/termos"}
      ]
    },
    "social": [
      {"platform": "linkedin", "href": "https://linkedin.com"},
      {"platform": "twitter", "href": "https://twitter.com"},
      {"platform": "instagram", "href": "https://instagram.com"}
    ],
    "newsletter": {
      "title": "Newsletter",
      "description": "Insights semanais no seu email"
    }
  }'::jsonb,
  '{"background": "dark"}'::jsonb
) ON CONFLICT (site_id, slug) DO NOTHING;

-- Support Modal
INSERT INTO global_blocks (id, site_id, type, name, slug, visible, content, config)
VALUES (
  'g0000000-0000-0000-0000-000000000004'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'support_modal',
  'Support Modal',
  'support-modal',
  true,
  '{
    "title": "Como podemos ajudar?",
    "options": [
      {"icon": "MessageCircle", "label": "Chat ao vivo", "description": "Fale com nossa equipe agora", "action": "chat"},
      {"icon": "Mail", "label": "Enviar email", "description": "contato@wellnesscorp.com", "action": "email"},
      {"icon": "Phone", "label": "Ligar", "description": "(11) 1234-5678", "action": "phone"},
      {"icon": "Book", "label": "Base de conhecimento", "description": "Encontre respostas rápidas", "action": "kb"}
    ]
  }'::jsonb,
  '{"animation": "fade-scale"}'::jsonb
) ON CONFLICT (site_id, slug) DO NOTHING;

-- Floating Support Button
INSERT INTO global_blocks (id, site_id, type, name, slug, visible, content, config)
VALUES (
  'g0000000-0000-0000-0000-000000000005'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'floating_button',
  'Support Button',
  'support-button',
  true,
  '{
    "icon": "MessageCircle",
    "label": "Ajuda"
  }'::jsonb,
  '{"position": "bottom-right", "color": "primary"}'::jsonb
) ON CONFLICT (site_id, slug) DO NOTHING;
