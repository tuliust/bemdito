-- =============================================================================
-- Migration v1.18 -- Fase 3: Tokens Unificados de Cor
-- Data: 2026-02-22
-- Paleta oficial: #2E2240, #EA526E, #ED9331, #F6F6F6
-- Fonte exclusiva: Poppins (100-900)
--
-- OBJETIVO:
--   Substituir o sistema antigo (tokens 'color' avulsos + tokens 'admin-ui'
--   de cor p-*) por 49 tokens unificados com category='color' organizados
--   em 8 grupos semanticos (Brand, Text, Backgrounds, Borders, States,
--   Semantic, Buttons, Inputs).
--
-- PRE-REQUISITO:
--   - AdminThemeProvider.tsx ja reescrito com ADMIN_ALIAS_MAP + TAILWIND_MAP
--   - Migrations v1.15-v1.17 ja executadas (limpeza + primitivos)
--   - A pagina /admin/design-system ja unificada
--
-- IMPACTO:
--   - Deleta TODOS os tokens antigos de category='color'
--   - Deleta TODOS os tokens admin-ui que sao puro hex (p-*, sidebar-bg, etc.)
--   - Insere 49 novos tokens com category='color'
--   - CSS vars geradas: 49 diretas + ~57 aliases + ~12 Tailwind = ~118
--   - Visual: ZERO mudanca (aliases + TAILWIND_MAP mantêm compatibilidade)
--
-- ROLLBACK:
--   Re-inserir tokens antigos via backup ou re-executar v1.6-v1.17
-- =============================================================================


-- =============================================================================
-- PARTE 1: Deletar TODOS os tokens antigos de category='color'
-- =============================================================================
-- Tokens antigos: primary, secondary, background, accent, muted, dark,
-- foreground, card, border, destructive, input-background, muted-foreground,
-- popover, popover-foreground, primary-foreground, accent-foreground,
-- switch-background, etc.

DELETE FROM design_tokens
WHERE category = 'color';
-- Esperado: ~20-37 linhas deletadas (depende de quantos existiam)


-- =============================================================================
-- PARTE 2: Deletar tokens admin-ui que sao puro hex
-- =============================================================================
-- Isso remove: p-white, p-gray-50..900, p-brand, p-brand-dark, p-danger*,
-- sidebar-bg, tab-border, list-item-selected-bg/border, modal-bg, modal-border,
-- e quaisquer outros tokens hex remanescentes.
-- NAO afeta: tokens de tipografia, icone ou valor (que tem size/weight/value).

DELETE FROM design_tokens
WHERE category = 'admin-ui'
  AND value ? 'hex'
  AND NOT value ? 'size';
-- Esperado: ~16-25 linhas deletadas (p-* + cores unicas remanescentes)


-- =============================================================================
-- PARTE 3: Inserir 49 tokens unificados (category='color')
-- =============================================================================
-- Organizados em 8 grupos com order sequencial por grupo.
-- ON CONFLICT: upsert por (category, name) para idempotencia.

INSERT INTO design_tokens (category, name, label, value, "order")
VALUES
  -- =========================================================================
  -- GRUPO 1: Marca (3 tokens) -- order 100-102
  -- =========================================================================
  ('color', 'brand-primary',  'Roxo Principal',   '{"hex":"#2E2240"}'::jsonb, 100),
  ('color', 'brand-pink',     'Rosa',             '{"hex":"#EA526E"}'::jsonb, 101),
  ('color', 'brand-orange',   'Laranja',          '{"hex":"#ED9331"}'::jsonb, 102),

  -- =========================================================================
  -- GRUPO 2: Texto (7 tokens) -- order 200-206
  -- =========================================================================
  ('color', 'text-primary',   'Texto Principal',         '{"hex":"#111827"}'::jsonb, 200),
  ('color', 'text-secondary', 'Texto Secundario',        '{"hex":"#374151"}'::jsonb, 201),
  ('color', 'text-muted',     'Texto Atenuado',          '{"hex":"#6B7280"}'::jsonb, 202),
  ('color', 'text-disabled',  'Texto Desativado',        '{"hex":"#9CA3AF"}'::jsonb, 203),
  ('color', 'text-inverse',   'Texto Inverso (Branco)',  '{"hex":"#FFFFFF"}'::jsonb, 204),
  ('color', 'text-on-dark',   'Texto sobre Fundo Escuro','{"hex":"#FFFFFF"}'::jsonb, 205),
  ('color', 'text-on-light',  'Texto sobre Fundo Claro', '{"hex":"#111827"}'::jsonb, 206),

  -- =========================================================================
  -- GRUPO 3: Fundos (4 tokens) -- order 300-303
  -- =========================================================================
  ('color', 'bg-base',     'Fundo Base',             '{"hex":"#F6F6F6"}'::jsonb, 300),
  ('color', 'bg-surface',  'Superficie (Cards)',      '{"hex":"#FFFFFF"}'::jsonb, 301),
  ('color', 'bg-subtle',   'Fundo Sutil',            '{"hex":"#F5F3FF"}'::jsonb, 302),
  ('color', 'bg-disabled', 'Fundo Desativado',       '{"hex":"#F3F4F6"}'::jsonb, 303),

  -- =========================================================================
  -- GRUPO 4: Bordas (4 tokens) -- order 400-403
  -- =========================================================================
  ('color', 'border-soft',    'Borda Suave',     '{"hex":"#ECEAF1"}'::jsonb, 400),
  ('color', 'border-default', 'Borda Padrao',    '{"hex":"#E5E7EB"}'::jsonb, 401),
  ('color', 'border-strong',  'Borda Forte',     '{"hex":"#D1D5DB"}'::jsonb, 402),
  ('color', 'border-focus',   'Borda de Foco',   '{"hex":"#A78BFA"}'::jsonb, 403),

  -- =========================================================================
  -- GRUPO 5: Estados (5 tokens) -- order 500-504
  -- =========================================================================
  ('color', 'state-hover-neutral',      'Hover Neutro',         '{"hex":"#F3F4F6"}'::jsonb, 500),
  ('color', 'state-hover-brand-subtle', 'Hover Marca Sutil',    '{"hex":"#FFF1F3"}'::jsonb, 501),
  ('color', 'state-selected-bg',        'Selecionado BG',       '{"hex":"#FDF2F8"}'::jsonb, 502),
  ('color', 'state-selected-border',    'Selecionado Borda',    '{"hex":"#FBCFE8"}'::jsonb, 503),
  ('color', 'state-focus-ring',         'Anel de Foco',         '{"hex":"#A78BFA"}'::jsonb, 504),

  -- =========================================================================
  -- GRUPO 6: Semantica (16 tokens) -- order 600-615
  -- =========================================================================
  -- Sucesso
  ('color', 'semantic-success-base',   'Sucesso Base',   '{"hex":"#16A34A"}'::jsonb, 600),
  ('color', 'semantic-success-bg',     'Sucesso BG',     '{"hex":"#F0FDF4"}'::jsonb, 601),
  ('color', 'semantic-success-border', 'Sucesso Borda',  '{"hex":"#BBF7D0"}'::jsonb, 602),
  ('color', 'semantic-success-text',   'Sucesso Texto',  '{"hex":"#14532D"}'::jsonb, 603),
  -- Alerta
  ('color', 'semantic-warning-base',   'Alerta Base',    '{"hex":"#D97706"}'::jsonb, 604),
  ('color', 'semantic-warning-bg',     'Alerta BG',      '{"hex":"#FFFBEB"}'::jsonb, 605),
  ('color', 'semantic-warning-border', 'Alerta Borda',   '{"hex":"#FDE68A"}'::jsonb, 606),
  ('color', 'semantic-warning-text',   'Alerta Texto',   '{"hex":"#78350F"}'::jsonb, 607),
  -- Erro
  ('color', 'semantic-error-base',     'Erro Base',      '{"hex":"#DC2626"}'::jsonb, 608),
  ('color', 'semantic-error-bg',       'Erro BG',        '{"hex":"#FEF2F2"}'::jsonb, 609),
  ('color', 'semantic-error-border',   'Erro Borda',     '{"hex":"#FCA5A5"}'::jsonb, 610),
  ('color', 'semantic-error-text',     'Erro Texto',     '{"hex":"#B91C1C"}'::jsonb, 611),
  -- Informacao
  ('color', 'semantic-info-base',      'Info Base',      '{"hex":"#2563EB"}'::jsonb, 612),
  ('color', 'semantic-info-bg',        'Info BG',        '{"hex":"#EFF6FF"}'::jsonb, 613),
  ('color', 'semantic-info-border',    'Info Borda',     '{"hex":"#BFDBFE"}'::jsonb, 614),
  ('color', 'semantic-info-text',      'Info Texto',     '{"hex":"#1E3A5F"}'::jsonb, 615),

  -- =========================================================================
  -- GRUPO 7: Botoes (5 tokens) -- order 700-704
  -- =========================================================================
  ('color', 'button-primary-bg',    'Botao Primario BG',     '{"hex":"#2E2240"}'::jsonb, 700),
  ('color', 'button-primary-text',  'Botao Primario Texto',  '{"hex":"#FFFFFF"}'::jsonb, 701),
  ('color', 'button-primary-hover', 'Botao Primario Hover',  '{"hex":"#241A33"}'::jsonb, 702),
  ('color', 'button-ghost-border',  'Botao Ghost Borda',     '{"hex":"#E5E7EB"}'::jsonb, 703),
  ('color', 'button-ghost-hover',   'Botao Ghost Hover',     '{"hex":"#FEF2F2"}'::jsonb, 704),

  -- =========================================================================
  -- GRUPO 8: Inputs (5 tokens) -- order 800-804
  -- =========================================================================
  ('color', 'input-bg',           'Input BG',          '{"hex":"#FFFFFF"}'::jsonb, 800),
  ('color', 'input-text',         'Input Texto',       '{"hex":"#2E2240"}'::jsonb, 801),
  ('color', 'input-placeholder',  'Input Placeholder', '{"hex":"#9CA3AF"}'::jsonb, 802),
  ('color', 'input-border',       'Input Borda',       '{"hex":"#D1D5DB"}'::jsonb, 803),
  ('color', 'input-border-focus', 'Input Borda Foco',  '{"hex":"#A78BFA"}'::jsonb, 804)

ON CONFLICT (category, name)
DO UPDATE SET
  value      = EXCLUDED.value,
  label      = EXCLUDED.label,
  "order"    = EXCLUDED."order",
  updated_at = now();
-- Esperado: 49 rows inserted/updated


-- =============================================================================
-- VERIFICACAO
-- =============================================================================

-- 1. Confirmar que os 49 tokens unificados existem
SELECT name, label, value->>'hex' AS hex, "order"
FROM design_tokens
WHERE category = 'color'
ORDER BY "order";
-- Esperado: 49 linhas

-- 2. Confirmar que NAO existem mais tokens antigos de cor
SELECT name FROM design_tokens
WHERE category = 'color'
  AND name IN ('primary', 'secondary', 'background', 'accent', 'muted',
               'dark', 'foreground', 'card', 'border', 'destructive');
-- Esperado: 0 linhas (nomes antigos nao existem)

-- 3. Confirmar que NAO existem mais tokens p-* em admin-ui
SELECT name FROM design_tokens
WHERE category = 'admin-ui' AND name LIKE 'p-%';
-- Esperado: 0 linhas

-- 4. Confirmar que NAO existem mais admin-ui hex puros
SELECT name, value->>'hex' AS hex
FROM design_tokens
WHERE category = 'admin-ui'
  AND value ? 'hex'
  AND NOT value ? 'size';
-- Esperado: 0 linhas

-- 5. Confirmar que tokens admin-ui de tipografia/icone/valor permanecem
SELECT COUNT(*) AS admin_ui_remaining
FROM design_tokens
WHERE category = 'admin-ui';
-- Esperado: ~40-50 linhas (tipografia, icones, valores)

-- 6. Contagem final por categoria
SELECT
  category,
  COUNT(*) AS total
FROM design_tokens
GROUP BY category
ORDER BY category;
-- Esperado:
--   admin-ui:   ~40-50 (tipografia/icone/valor)
--   color:      49 (tokens unificados)
--   radius:     N
--   spacing:    N
--   transition: N
--   typography: N

-- 7. Conferir distribuicao dos 49 tokens por grupo
SELECT
  CASE
    WHEN name LIKE 'brand-%'    THEN '1. Marca'
    WHEN name LIKE 'text-%'     THEN '2. Texto'
    WHEN name LIKE 'bg-%'       THEN '3. Fundos'
    WHEN name LIKE 'border-%'   THEN '4. Bordas'
    WHEN name LIKE 'state-%'    THEN '5. Estados'
    WHEN name LIKE 'semantic-%' THEN '6. Semantica'
    WHEN name LIKE 'button-%'   THEN '7. Botoes'
    WHEN name LIKE 'input-%'    THEN '8. Inputs'
    ELSE '9. Outro'
  END AS grupo,
  COUNT(*) AS total
FROM design_tokens
WHERE category = 'color'
GROUP BY grupo
ORDER BY grupo;
-- Esperado:
--   1. Marca:     3
--   2. Texto:     7
--   3. Fundos:    4
--   4. Bordas:    4
--   5. Estados:   5
--   6. Semantica: 16
--   7. Botoes:    5
--   8. Inputs:    5
--   Total:        49
