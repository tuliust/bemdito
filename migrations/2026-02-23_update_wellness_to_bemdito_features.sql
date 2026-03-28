-- =========================================================
-- ATUALIZAR TEMPLATE "Wellness Features" → conteúdo BemDito
-- Baseado no anexo: 6 cards, 3 colunas, fundo rosa,
-- ícones brancos sobre círculo dourado
-- =========================================================
-- INSTRUCAO: Execute CADA bloco separadamente no SQL Editor


-- =========================================================
-- BLOCO 0: DIAGNOSTICO — confirmar estado atual
-- =========================================================
SELECT tc.order_index, tc.id, tc.icon, tc.title
FROM template_cards tc
WHERE tc.template_id = '6c96c503-5858-46a0-aa34-35e6f7b74991'
ORDER BY tc.order_index;


-- =========================================================
-- BLOCO 1: ADICIONAR COLUNA icon_bg_color_token (se nao existir)
-- Permite cor de fundo sólida para o ícone (ao invés de 10% opacity)
-- =========================================================
ALTER TABLE card_templates
  ADD COLUMN IF NOT EXISTS icon_bg_color_token UUID;


-- =========================================================
-- BLOCO 2: ATUALIZAR TEMPLATE — cores e colunas
-- 3 colunas desktop, fundo rosa, ícone branco, bg ícone dourado
-- =========================================================
UPDATE card_templates
SET
  name = 'BemDito Features',
  columns_desktop = 3,
  columns_tablet = 2,
  columns_mobile = 1,
  gap = 'md',
  card_bg_color_token = (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'primary' LIMIT 1),
  card_border_width = 0,
  card_shadow = 'none',
  card_border_radius = '2xl',
  card_padding = 'lg',
  icon_position = 'left',
  icon_size = 28,
  icon_color_token = COALESCE(
    (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'white' LIMIT 1),
    (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'background' LIMIT 1)
  ),
  icon_bg_color_token = (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'accent' LIMIT 1),
  title_color_token = (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'dark' LIMIT 1),
  title_font_weight = 700,
  subtitle_color_token = (SELECT id FROM design_tokens WHERE category = 'color' AND name = 'dark' LIMIT 1),
  subtitle_font_weight = 400
WHERE id = '6c96c503-5858-46a0-aa34-35e6f7b74991';


-- =========================================================
-- BLOCO 3: DELETAR os 2 cards extras (order_index 6 e 7)
-- O design mostra 6 cards, não 8
-- =========================================================
DELETE FROM template_cards
WHERE template_id = '6c96c503-5858-46a0-aa34-35e6f7b74991'
  AND order_index >= 6;


-- =========================================================
-- BLOCO 4: ATUALIZAR os 6 cards com conteúdo em português
-- =========================================================

-- Card 0: Projeto Sob Medida (ícone Layers)
UPDATE template_cards
SET icon = 'Layers', title = 'Projeto Sob Medida', subtitle = 'Monte apenas o que precisa, sem pacotes engessados.'
WHERE template_id = '6c96c503-5858-46a0-aa34-35e6f7b74991' AND order_index = 0;

-- Card 1: Agendamento Flexível (ícone CalendarCheck)
UPDATE template_cards
SET icon = 'CalendarCheck', title = 'Agendamento Flexível', subtitle = 'Agende qualquer tipo de serviço de comunicação em poucos cliques.'
WHERE template_id = '6c96c503-5858-46a0-aa34-35e6f7b74991' AND order_index = 1;

-- Card 2: Time Especialista (ícone Users)
UPDATE template_cards
SET icon = 'Users', title = 'Time Especialista', subtitle = 'Encontre profissionais qualificados em diferentes áreas da comunicação.'
WHERE template_id = '6c96c503-5858-46a0-aa34-35e6f7b74991' AND order_index = 2;

-- Card 3: Chat Integrado (ícone MessageCircle)
UPDATE template_cards
SET icon = 'MessageCircle', title = 'Chat Integrado', subtitle = 'Converse com os profissionais e receba suporte direto.'
WHERE template_id = '6c96c503-5858-46a0-aa34-35e6f7b74991' AND order_index = 3;

-- Card 4: Histórico e Arquivos (ícone ClipboardList)
UPDATE template_cards
SET icon = 'ClipboardList', title = 'Histórico e Arquivos', subtitle = 'Acesse entregas, histórico completo e crie novas tarefas.'
WHERE template_id = '6c96c503-5858-46a0-aa34-35e6f7b74991' AND order_index = 4;

-- Card 5: Resultados e Relatórios (ícone BarChart3)
UPDATE template_cards
SET icon = 'BarChart3', title = 'Resultados e Relatórios', subtitle = 'Acompanhe métricas, análises e relatórios de desempenho.'
WHERE template_id = '6c96c503-5858-46a0-aa34-35e6f7b74991' AND order_index = 5;


-- =========================================================
-- BLOCO 5: VALIDACAO FINAL
-- =========================================================

-- Template atualizado
SELECT
  id, name, columns_desktop, icon_position, icon_size,
  card_shadow, card_border_width, card_padding,
  icon_bg_color_token IS NOT NULL AS has_icon_bg
FROM card_templates
WHERE id = '6c96c503-5858-46a0-aa34-35e6f7b74991';

-- Cards (deve retornar 6 linhas)
SELECT order_index, icon, title, subtitle
FROM template_cards
WHERE template_id = '6c96c503-5858-46a0-aa34-35e6f7b74991'
ORDER BY order_index;

-- Tokens resolvidos (verificar que não são NULL)
SELECT
  ct.name AS template_name,
  d1.name AS bg_token,  d1.value::text AS bg_value,
  d2.name AS icon_token, d2.value::text AS icon_value,
  d3.name AS icon_bg_token, d3.value::text AS icon_bg_value,
  d4.name AS title_token, d4.value::text AS title_value
FROM card_templates ct
LEFT JOIN design_tokens d1 ON d1.id = ct.card_bg_color_token
LEFT JOIN design_tokens d2 ON d2.id = ct.icon_color_token
LEFT JOIN design_tokens d3 ON d3.id = ct.icon_bg_color_token
LEFT JOIN design_tokens d4 ON d4.id = ct.title_color_token
WHERE ct.id = '6c96c503-5858-46a0-aa34-35e6f7b74991';
