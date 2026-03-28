-- =====================================================
-- Migration: Adicionar logo, endereço e telefone no footer
-- Data: 2026-03-01
-- Descrição: Adiciona campos logo_url, address e phone no site_config.footer
-- =====================================================

-- ✅ PASSO 1: Verificar estrutura atual
SELECT 
  id,
  jsonb_pretty(footer) as footer_atual
FROM site_config
LIMIT 1;

-- ✅ PASSO 2: Adicionar campos ao footer (preservando dados existentes)
UPDATE site_config
SET footer = jsonb_set(
  jsonb_set(
    jsonb_set(
      COALESCE(footer, '{}'::jsonb),
      '{logo_url}',
      'null'::jsonb,
      true
    ),
    '{address}',
    '""'::jsonb,
    true
  ),
  '{phone}',
  '""'::jsonb,
  true
)
WHERE id IS NOT NULL;

-- ✅ PASSO 3: Verificar resultado
SELECT 
  id,
  footer->>'logo_url' as logo_url,
  footer->>'address' as address,
  footer->>'phone' as phone,
  footer->>'copyright' as copyright
FROM site_config
LIMIT 1;

-- ✅ PASSO 4: Validação
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM site_config
  WHERE footer ? 'logo_url' 
    AND footer ? 'address' 
    AND footer ? 'phone';
  
  IF v_count > 0 THEN
    RAISE NOTICE '✅ Migration concluída com sucesso! Campos adicionados: logo_url, address, phone';
  ELSE
    RAISE EXCEPTION '❌ Migration falhou! Campos não foram adicionados corretamente.';
  END IF;
END $$;
