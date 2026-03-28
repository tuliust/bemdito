-- ═══════════════════════════════════════════════════════════════════════════
-- Migration v1.16 — Fase 1: Limpeza de Tokens Admin-UI
-- Data: 2026-02-22
-- Descrição: Remove 12 tokens inúteis e corrige 3 com valores errados.
--
-- REMOVIDOS (12):
--   11 tokens com #FFFF00 (placeholders nunca integrados ao código)
--   1 duplicata exata (sidebar-divider = sidebar-separator)
--
-- CORRIGIDOS (3):
--   badge-published-bg: #32CD32 → #ea526e (rosa da marca, não verde)
--   badge-draft-bg:     #32CD32 → #9ca3af (cinza muted, não verde)
--   btn-action-text:    #e5e7eb → #374151 (cinza escuro para texto legível)
--
-- IMPACTO: 117 → 105 tokens admin-ui
-- RISCO: Zero — tokens removidos não têm referências no código
-- ═══════════════════════════════════════════════════════════════════════════


-- ─── PARTE 1: Deletar 11 tokens #FFFF00 (placeholders) ────────────────────

DELETE FROM design_tokens
WHERE category = 'admin-ui'
  AND name IN (
    'btn-toggle-off-bg',
    'btn-toggle-off-text',
    'field-selector-bg',
    'field-selector-header-text',
    'height-btn-inactive-bg',
    'height-btn-inactive-border',
    'height-btn-inactive-text',
    'modal-card-number-text',
    'switch-checked-bg',
    'switch-thumb-bg',
    'switch-unchecked-bg'
  );
-- Esperado: 11 rows deleted


-- ─── PARTE 2: Deletar duplicata sidebar-divider ───────────────────────────

DELETE FROM design_tokens
WHERE category = 'admin-ui'
  AND name = 'sidebar-divider';
-- Esperado: 1 row deleted
-- Nota: sidebar-separator (valor idêntico) permanece e é o usado no código


-- ─── PARTE 3: Corrigir badge-published-bg (#32CD32 → #ea526e) ─────────────

UPDATE design_tokens
SET value = '{"hex": "#ea526e"}'::jsonb,
    updated_at = now()
WHERE category = 'admin-ui'
  AND name = 'badge-published-bg';
-- Nota: Rosa da marca (--primary). Fallback no código já era #ea526e.


-- ─── PARTE 4: Corrigir badge-draft-bg (#32CD32 → #9ca3af) ────────────────

UPDATE design_tokens
SET value = '{"hex": "#9ca3af"}'::jsonb,
    updated_at = now()
WHERE category = 'admin-ui'
  AND name = 'badge-draft-bg';
-- Nota: Cinza muted. Fallback no código já era #9ca3af.


-- ─── PARTE 5: Corrigir btn-action-text (#e5e7eb → #374151) ───────────────

UPDATE design_tokens
SET value = '{"hex": "#374151"}'::jsonb,
    updated_at = now()
WHERE category = 'admin-ui'
  AND name = 'btn-action-text';
-- Nota: #e5e7eb era cinza claro (cor de borda, não de texto).
--       Todos os 21 pontos no código já tinham fallback #374151.


-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICAÇÃO
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Confirmar que NÃO existem mais tokens #FFFF00
SELECT name, value
FROM design_tokens
WHERE category = 'admin-ui'
  AND value::text LIKE '%FFFF00%';
-- Esperado: 0 linhas

-- 2. Confirmar que sidebar-divider foi removido
SELECT name FROM design_tokens
WHERE category = 'admin-ui' AND name = 'sidebar-divider';
-- Esperado: 0 linhas

-- 3. Confirmar valores corrigidos
SELECT name, value->>'hex' AS hex
FROM design_tokens
WHERE category = 'admin-ui'
  AND name IN ('badge-published-bg', 'badge-draft-bg', 'btn-action-text')
ORDER BY name;
-- Esperado:
--   badge-draft-bg     | #9ca3af
--   badge-published-bg | #ea526e
--   btn-action-text    | #374151

-- 4. Contagem final
SELECT
  COUNT(*) FILTER (WHERE category = 'admin-ui') AS admin_ui,
  COUNT(*) AS total
FROM design_tokens;
-- Esperado: admin-ui ≈ 105, total ≈ 133
