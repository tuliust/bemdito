-- ═══════════════════════════════════════════════════════════════════════════
-- Migration v1.17 — Fase 2: Paleta Primitiva com Aliases
-- Data: 2026-02-22
-- Paleta oficial: #2e2240, #ea526e, #ed9331, #f6f6f6
--
-- INSERIDOS (16 primitivos):
--   Escala cinza: p-white, p-gray-50/100/200/300/400/500/600/700/900
--   Marca: p-brand (#ea526e), p-brand-dark
--   Perigo: p-danger, p-danger-dark, p-danger-light, p-danger-border
--
-- DELETADOS (~52 tokens de cor individuais):
--   Substituídos por aliases gerados em runtime pelo buildCSS()
--   do AdminThemeProvider. CSS vars --admin-{alias} são recriadas
--   automaticamente como var(--admin-{primitivo}).
--
-- MANTIDOS (cores únicas):
--   sidebar-bg (#2e2240), tab-border, list-item-selected-bg,
--   list-item-selected-border — não seguem a escala cinza.
--
-- IMPACTO:
--   105 → ~69 tokens admin-ui no banco
--   CSS vars geradas: ~69 (do banco) + ~57 (aliases) ≈ 126 totais
--   Visual: ZERO mudança (aliases replicam os valores antigos)
--
-- RISCO: Baixo — aliases mapeiam para os mesmos valores hex que
--   os tokens individuais tinham. Rollback: re-inserir tokens deletados.
-- ═══════════════════════════════════════════════════════════════════════════


-- ─── PARTE 1: Inserir 16 primitivos ──────────────────────────────────────────

INSERT INTO design_tokens (category, name, label, value, "order")
VALUES
  -- Escala cinza
  ('admin-ui', 'p-white',    'Branco',           '{"hex":"#ffffff"}'::jsonb, 1),
  ('admin-ui', 'p-gray-50',  'Cinza 50',         '{"hex":"#f9fafb"}'::jsonb, 2),
  ('admin-ui', 'p-gray-100', 'Cinza 100',        '{"hex":"#f3f4f6"}'::jsonb, 3),
  ('admin-ui', 'p-gray-200', 'Cinza 200',        '{"hex":"#e5e7eb"}'::jsonb, 4),
  ('admin-ui', 'p-gray-300', 'Cinza 300',        '{"hex":"#d1d5db"}'::jsonb, 5),
  ('admin-ui', 'p-gray-400', 'Cinza 400',        '{"hex":"#9ca3af"}'::jsonb, 6),
  ('admin-ui', 'p-gray-500', 'Cinza 500',        '{"hex":"#6b7280"}'::jsonb, 7),
  ('admin-ui', 'p-gray-600', 'Cinza 600',        '{"hex":"#4b5563"}'::jsonb, 8),
  ('admin-ui', 'p-gray-700', 'Cinza 700',        '{"hex":"#374151"}'::jsonb, 9),
  ('admin-ui', 'p-gray-900', 'Cinza 900',        '{"hex":"#111827"}'::jsonb, 10),
  -- Marca
  ('admin-ui', 'p-brand',      'Marca (Primary)',       '{"hex":"#ea526e"}'::jsonb, 11),
  ('admin-ui', 'p-brand-dark', 'Marca Escura (Hover)',  '{"hex":"#d4475f"}'::jsonb, 12),
  -- Perigo / Destrutivo
  ('admin-ui', 'p-danger',        'Perigo',              '{"hex":"#dc2626"}'::jsonb, 13),
  ('admin-ui', 'p-danger-dark',   'Perigo Escuro',       '{"hex":"#b91c1c"}'::jsonb, 14),
  ('admin-ui', 'p-danger-light',  'Perigo Claro (BG)',   '{"hex":"#fef2f2"}'::jsonb, 15),
  ('admin-ui', 'p-danger-border', 'Perigo Borda',        '{"hex":"#fca5a5"}'::jsonb, 16)
ON CONFLICT (category, name) DO UPDATE
  SET value = EXCLUDED.value,
      label = EXCLUDED.label,
      "order" = EXCLUDED."order",
      updated_at = now();
-- Esperado: 16 rows inserted/updated


-- ─── PARTE 2: Deletar tokens de cor agora cobertos por aliases ───────────────

-- Aliases de p-white (#ffffff)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'card-bg', 'list-item-bg', 'btn-action-bg', 'btn-cancel-bg',
  'tab-active-bg', 'btn-primary-text', 'sidebar-active-text',
  'field-bg', 'dropdown-bg'
);

-- Aliases de p-gray-50 (#f9fafb)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'page-bg', 'collapsible-bg', 'editor-preview-bg',
  'modal-footer-bg', 'upload-empty-bg', 'btn-action-hover-bg'
);

-- Aliases de p-gray-100 (#f3f4f6)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'collapsible-hover-bg', 'tab-list-bg', 'editor-preview-border',
  'dropdown-item-hover-bg', 'dropdown-trigger-hover-bg'
);

-- Aliases de p-gray-200 (#e5e7eb)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'card-border', 'collapsible-border', 'list-item-border',
  'modal-footer-border', 'btn-cancel-border',
  'btn-action-border', 'field-border', 'dropdown-border'
);

-- Aliases de p-gray-300 (#d1d5db)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'list-item-hover-border', 'sub-nav-separator'
);

-- Aliases de p-gray-400 (#9ca3af)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'field-placeholder', 'badge-draft-bg'
);

-- Aliases de p-gray-500 (#6b7280)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'sub-nav-back-text', 'action-menu-icon', 'icon-action', 'upload-x-icon'
);

-- Aliases de p-gray-700 (#374151)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'btn-cancel-text', 'btn-action-text'
);

-- Aliases de p-gray-900 (#111827)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'btn-action-hover-text', 'sub-nav-back-hover',
  'tab-active-text', 'upload-x-bg', 'field-text'
);

-- Aliases de p-brand (#ea526e)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'btn-primary-bg', 'sidebar-active', 'badge-published-bg'
);

-- Aliases de p-brand-dark
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'btn-primary-hover-bg'
);

-- Aliases de p-danger (#dc2626)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'delete-btn-text'
);

-- Aliases de p-danger-dark (#b91c1c)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'delete-btn-hover-text'
);

-- Aliases de p-danger-light (#fef2f2)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'delete-btn-hover-bg', 'btn-reorder-hover'
);

-- Aliases de p-danger-border (#fca5a5)
DELETE FROM design_tokens WHERE category = 'admin-ui' AND name IN (
  'delete-btn-hover-border'
);


-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICAÇÃO
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Confirmar que os 16 primitivos existem
SELECT name, value->>'hex' AS hex
FROM design_tokens
WHERE category = 'admin-ui' AND name LIKE 'p-%'
ORDER BY "order";
-- Esperado: 16 linhas

-- 2. Confirmar que os aliases foram deletados
SELECT name FROM design_tokens
WHERE category = 'admin-ui'
  AND name IN ('card-bg', 'page-bg', 'btn-primary-bg', 'delete-btn-text', 'field-border')
ORDER BY name;
-- Esperado: 0 linhas

-- 3. Confirmar que cores únicas permanecem
SELECT name FROM design_tokens
WHERE category = 'admin-ui'
  AND name IN ('sidebar-bg', 'tab-border', 'list-item-selected-bg', 'list-item-selected-border')
ORDER BY name;
-- Esperado: 2-4 linhas (depende de quais existiam)

-- 4. Contagem final
SELECT
  COUNT(*) FILTER (WHERE category = 'admin-ui') AS admin_ui,
  COUNT(*) AS total
FROM design_tokens;
-- Esperado: admin-ui ≈ 69, total ≈ 119
