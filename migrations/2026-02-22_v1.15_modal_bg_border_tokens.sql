-- ═══════════════════════════════════════════════════════════════════════════
-- Migration v1.15 — Tokens modal-bg e modal-border (admin-ui)
-- Data: 2026-02-22
-- Descrição: Adiciona 2 tokens de cor para o fundo e borda do BaseModal.
--            Antes, var(--admin-modal-bg) e var(--admin-modal-border) eram
--            referenciados no código mas não existiam no banco, fazendo o
--            modal herdar bg-background (Tailwind) ao invés de branco.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Inserir modal-bg (Fundo do Modal)
INSERT INTO design_tokens (category, name, label, value, "order")
VALUES (
  'admin-ui',
  'modal-bg',
  'Fundo do Modal',
  '{"hex": "#ffffff"}'::jsonb,
  700
)
ON CONFLICT (category, name)
DO UPDATE SET
  label      = EXCLUDED.label,
  value      = EXCLUDED.value,
  updated_at = now();

-- 2. Inserir modal-border (Borda do Modal)
INSERT INTO design_tokens (category, name, label, value, "order")
VALUES (
  'admin-ui',
  'modal-border',
  'Borda do Modal',
  '{"hex": "#e5e7eb"}'::jsonb,
  701
)
ON CONFLICT (category, name)
DO UPDATE SET
  label      = EXCLUDED.label,
  value      = EXCLUDED.value,
  updated_at = now();

-- ─── Verificação ────────────────────────────────────────────────────────────
SELECT name, label, value
FROM design_tokens
WHERE category = 'admin-ui'
  AND name IN ('modal-bg', 'modal-border')
ORDER BY name;
-- Esperado: 2 linhas (modal-bg #ffffff, modal-border #e5e7eb)
