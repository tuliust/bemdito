-- =====================================================
-- MIGRATION 004: Media Library & Versioning
-- =====================================================
-- Este script adiciona suporte para upload de mídia e versionamento

-- =====================================================
-- 1. TABELA DE MÍDIA (Media Library)
-- =====================================================

CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_assets_mime_type ON media_assets(mime_type);
CREATE INDEX idx_media_assets_created_at ON media_assets(created_at DESC);
CREATE INDEX idx_media_assets_created_by ON media_assets(created_by);

-- Trigger para updated_at
CREATE TRIGGER update_media_assets_updated_at 
  BEFORE UPDATE ON media_assets 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. TABELA DE VERSIONAMENTO (Pages)
-- =====================================================

CREATE TABLE page_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  restore_point BOOLEAN DEFAULT false,
  UNIQUE(page_id, version_number)
);

CREATE INDEX idx_page_versions_page_id ON page_versions(page_id);
CREATE INDEX idx_page_versions_created_at ON page_versions(created_at DESC);

-- =====================================================
-- 3. TABELA DE VERSIONAMENTO (Sections)
-- =====================================================

CREATE TABLE section_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  restore_point BOOLEAN DEFAULT false,
  UNIQUE(section_id, version_number)
);

CREATE INDEX idx_section_versions_section_id ON section_versions(section_id);
CREATE INDEX idx_section_versions_created_at ON section_versions(created_at DESC);

-- =====================================================
-- 4. FUNÇÃO PARA AUTO-INCREMENTAR VERSION_NUMBER
-- =====================================================

CREATE OR REPLACE FUNCTION get_next_page_version_number(p_page_id UUID)
RETURNS INTEGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM page_versions
  WHERE page_id = p_page_id;
  
  RETURN next_version;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_next_section_version_number(p_section_id UUID)
RETURNS INTEGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM section_versions
  WHERE section_id = p_section_id;
  
  RETURN next_version;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. RLS (Row Level Security)
-- =====================================================

-- Media Assets
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read media_assets" 
  ON media_assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert media_assets" 
  ON media_assets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update media_assets" 
  ON media_assets FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete media_assets" 
  ON media_assets FOR DELETE TO authenticated USING (true);

-- Acesso público para leitura
CREATE POLICY "Public can read media_assets" 
  ON media_assets FOR SELECT TO anon USING (true);

-- Page Versions
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read page_versions" 
  ON page_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert page_versions" 
  ON page_versions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update page_versions" 
  ON page_versions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete page_versions" 
  ON page_versions FOR DELETE TO authenticated USING (true);

-- Section Versions
ALTER TABLE section_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read section_versions" 
  ON section_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert section_versions" 
  ON section_versions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update section_versions" 
  ON section_versions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete section_versions" 
  ON section_versions FOR DELETE TO authenticated USING (true);

-- Políticas públicas para desenvolvimento
CREATE POLICY "Public can read page_versions" 
  ON page_versions FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read section_versions" 
  ON section_versions FOR SELECT TO anon USING (true);

-- =====================================================
-- 6. FUNÇÃO PARA LIMPAR VERSÕES ANTIGAS
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_old_versions(keep_last INTEGER DEFAULT 10)
RETURNS void AS $$
BEGIN
  -- Limpar versões de páginas (manter últimas N)
  DELETE FROM page_versions
  WHERE id IN (
    SELECT id
    FROM (
      SELECT 
        id,
        ROW_NUMBER() OVER (PARTITION BY page_id ORDER BY created_at DESC) as rn
      FROM page_versions
      WHERE restore_point = false
    ) sub
    WHERE rn > keep_last
  );

  -- Limpar versões de seções (manter últimas N)
  DELETE FROM section_versions
  WHERE id IN (
    SELECT id
    FROM (
      SELECT 
        id,
        ROW_NUMBER() OVER (PARTITION BY section_id ORDER BY created_at DESC) as rn
      FROM section_versions
      WHERE restore_point = false
    ) sub
    WHERE rn > keep_last
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE media_assets IS 'Biblioteca de mídia - imagens e vídeos uploadados';
COMMENT ON TABLE page_versions IS 'Histórico de versões de páginas';
COMMENT ON TABLE section_versions IS 'Histórico de versões de seções';
COMMENT ON FUNCTION cleanup_old_versions IS 'Limpa versões antigas, mantendo apenas as últimas N (exceto restore_points)';