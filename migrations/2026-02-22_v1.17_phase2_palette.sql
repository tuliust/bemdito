-- ═══════════════════════════════════════════════════════════════════════════
-- Migration v1.17 — Fase 2: Paleta Primitiva com Aliases
-- Data: 2026-02-22
-- Descrição: Substitui ~59 tokens hex duplicados por 16 primitivos.
--            O AdminThemeProvider gera os CSS vars antigos como aliases.
--
-- INSERIDOS: 16 tokens primitivos (p-*)
-- DELETADOS: 59 tokens hex agora cobertos pelos aliases
--
-- IMPACTO: 105 → 62 tokens admin-ui no banco
--          ~60 CSS vars continuam funcionando (geradas via ALIAS_MAP no código)
-- RISCO: Baixo — código já tem ALIAS_MAP; aliases são retrocompatíveis
-- PRÉ-REQUISITO: AdminThemeProvider.tsx já deve ter o ALIAS_MAP
-- ═══════════════════════════════════════════════════════════════════════════


-- ─── PARTE 1: Inserir 16 tokens primitivos ────────────────────────────────────

INSERT INTO design_tokens (id, category, name, value, label, "order")
VALUES
  (gen_random_uuid(), 'admin-ui', 'p-white',         '{"hex":"#ffffff"}'::jsonb, 'Branco',                    1),
  (gen_random_uuid(), 'admin-ui', 'p-gray-50',       '{"hex":"#f9fafb"}'::jsonb, 'Cinza 50 (quase-branco)',   2),
  (gen_random_uuid(), 'admin-ui', 'p-gray-100',      '{"hex":"#f3f4f6"}'::jsonb, 'Cinza 100 (hover)',         3),
  (gen_random_uuid(), 'admin-ui', 'p-gray-200',      '{"hex":"#e5e7eb"}'::jsonb, 'Cinza 200 (bordas)',        4),
  (gen_random_uuid(), 'admin-ui', 'p-gray-300',      '{"hex":"#d1d5db"}'::jsonb, 'Cinza 300 (bordas fortes)', 5),
  (gen_random_uuid(), 'admin-ui', 'p-gray-400',      '{"hex":"#9ca3af"}'::jsonb, 'Cinza 400 (texto mudo)',    6),
  (gen_random_uuid(), 'admin-ui', 'p-gray-500',      '{"hex":"#6b7280"}'::jsonb, 'Cinza 500 (secundário)',    7),
  (gen_random_uuid(), 'admin-ui', 'p-gray-600',      '{"hex":"#4b5563"}'::jsonb, 'Cinza 600 (sutil)',         8),
  (gen_random_uuid(), 'admin-ui', 'p-gray-700',      '{"hex":"#374151"}'::jsonb, 'Cinza 700 (texto base)',    9),
  (gen_random_uuid(), 'admin-ui', 'p-gray-900',      '{"hex":"#111827"}'::jsonb, 'Cinza 900 (texto forte)',  10),
  (gen_random_uuid(), 'admin-ui', 'p-brand',         '{"hex":"#ea526e"}'::jsonb, 'Marca (Primary)',          11),
  (gen_random_uuid(), 'admin-ui', 'p-brand-dark',    '{"hex":"#d94460"}'::jsonb, 'Marca Hover',              12),
  (gen_random_uuid(), 'admin-ui', 'p-danger',        '{"hex":"#dc2626"}'::jsonb, 'Perigo (Vermelho)',        13),
  (gen_random_uuid(), 'admin-ui', 'p-danger-dark',   '{"hex":"#b91c1c"}'::jsonb, 'Perigo Hover',             14),
  (gen_random_uuid(), 'admin-ui', 'p-danger-light',  '{"hex":"#fef2f2"}'::jsonb, 'Perigo Superfície',        15),
  (gen_random_uuid(), 'admin-ui', 'p-danger-border', '{"hex":"#fca5a5"}'::jsonb, 'Perigo Borda',             16)
ON CONFLICT DO NOTHING;
-- Esperado: 16 rows inserted


-- ─── PARTE 2: Deletar 59 tokens agora cobertos por aliases ───────────────────

DELETE FROM design_tokens
WHERE category = 'admin-ui'
  AND name IN (
    -- Aliases de p-white (12)
    'card-bg', 'modal-bg', 'list-item-bg',
    'btn-action-bg', 'btn-cancel-bg', 'btn-outline-bg',
    'mono-toggle-bg', 'tab-active-bg',
    'action-menu-icon', 'btn-primary-text',
    'dropdown-border', 'sidebar-active-text',
    -- Aliases de p-gray-50 (7)
    'page-bg', 'collapsible-bg', 'editor-preview-bg',
    'modal-footer-bg', 'upload-empty-bg',
    'btn-outline-hover-bg', 'btn-action-border',
    -- Aliases de p-gray-100 (3)
    'collapsible-hover-bg', 'editor-preview-border', 'field-bg',
    -- Aliases de p-gray-200 (9)
    'card-border', 'collapsible-border', 'list-item-border',
    'modal-border', 'modal-footer-border', 'btn-cancel-border',
    'mono-toggle-border', 'swatch-border', 'field-placeholder',
    -- Aliases de p-gray-300 (3)
    'btn-outline-border', 'list-item-hover-border', 'sub-nav-separator',
    -- Aliases de p-gray-400 (3)
    'field-text', 'inline-empty-text', 'badge-draft-bg',
    -- Aliases de p-gray-500 (1)
    'sub-nav-back-text',
    -- Aliases de p-gray-600 (2)
    'mono-toggle-text', 'upload-x-icon',
    -- Aliases de p-gray-700 (3)
    'btn-cancel-text', 'btn-outline-text', 'btn-action-text',
    -- Aliases de p-gray-900 (6)
    'btn-action-hover-bg', 'btn-action-hover-text',
    'sub-nav-back-hover', 'tab-active-text',
    'upload-x-bg', 'field-border',
    -- Aliases de p-brand (3)
    'btn-primary-bg', 'sidebar-active', 'badge-published-bg',
    -- Aliases de p-brand-dark (1)
    'btn-primary-hover-bg',
    -- Aliases de p-danger (2)
    'delete-btn-text', 'icon-action',
    -- Aliases de p-danger-dark (1)
    'delete-btn-hover-text',
    -- Aliases de p-danger-light (2)
    'delete-btn-hover-bg', 'btn-reorder-hover',
    -- Aliases de p-danger-border (1)
    'delete-btn-hover-border'
  );
-- Esperado: 59 rows deleted


-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICAÇÃO
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Confirmar 16 primitivos existem
SELECT name, value->>'hex' AS hex, label
FROM design_tokens
WHERE category = 'admin-ui' AND name LIKE 'p-%'
ORDER BY "order";
-- Esperado: 16 linhas

-- 2. Confirmar que tokens aliasados foram removidos
SELECT name FROM design_tokens
WHERE category = 'admin-ui'
  AND name IN ('card-bg', 'modal-bg', 'btn-primary-bg', 'sidebar-active', 'field-border');
-- Esperado: 0 linhas

-- 3. Contagem final
SELECT
  COUNT(*) FILTER (WHERE category = 'admin-ui') AS admin_ui,
  COUNT(*) FILTER (WHERE category = 'admin-ui' AND name LIKE 'p-%') AS primitivos,
  COUNT(*) AS total
FROM design_tokens;
-- Esperado: admin_ui ≈ 62, primitivos = 16, total ≈ 112
