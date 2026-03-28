/**
 * PageAnchorPicker Component
 * 
 * Dropdown para selecionar páginas existentes ou seções específicas (âncoras).
 * Permite navegação interna no site.
 * 
 * USO:
 * ```tsx
 * <PageAnchorPicker 
 *   value={config.ctaUrl} 
 *   onChange={(url) => updateConfigField('ctaUrl', url)}
 *   label="URL do Botão"
 * />
 * ```
 */

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Loader2, Hash } from 'lucide-react';
import { Label } from './ui/label';

type Page = {
  id: string;
  name: string;
  slug: string;
};

type Section = {
  id: string;
  name: string;
  type: string;
};

type PageSection = {
  id: string;
  page_id: string;
  section_id: string;
  section?: Section;
};

type PageAnchorPickerProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

export function PageAnchorPicker({ 
  value, 
  onChange, 
  label = 'URL' 
}: PageAnchorPickerProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [pageSectionsMap, setPageSectionsMap] = useState<Record<string, PageSection[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('');

  useEffect(() => {
    loadPagesAndSections();
  }, []);

  async function loadPagesAndSections() {
    try {
      const { data: pagesData } = await supabase
        .from('pages')
        .select('id, name, slug')
        .eq('published', true)
        .order('name');

      if (!pagesData || pagesData.length === 0) {
        setPages([]);
        setLoading(false);
        return;
      }

      setPages(pagesData);

      // ✅ Single query for ALL page_sections (replaced N+1 pattern)
      const pageIds = pagesData.map((p) => p.id);
      const { data: allSectionsData } = await supabase
        .from('page_sections')
        .select(`
          id,
          page_id,
          section_id,
          section:sections (id, name, type)
        `)
        .in('page_id', pageIds)
        .order('order_index');

      // Group by page_id client-side
      const sectionsMap: Record<string, PageSection[]> = {};
      for (const ps of allSectionsData || []) {
        if (!sectionsMap[ps.page_id]) {
          sectionsMap[ps.page_id] = [];
        }
        sectionsMap[ps.page_id].push(ps as PageSection);
      }
      setPageSectionsMap(sectionsMap);
    } catch (error) {
      console.error('Error loading pages and sections:', error);
    } finally {
      setLoading(false);
    }
  }

  // Parse valor atual para determinar página selecionada
  useEffect(() => {
    if (value && pages.length > 0) {
      const urlParts = value.split('#');
      const slug = urlParts[0].replace(/^\/+/, ''); // Remove todas as barras iniciais
      const anchor = urlParts[1] || ''; // Extrai anchor se existir
      
      const page = pages.find(p => {
        const pageSlug = p.slug.replace(/^\\/+/, ''); // Remove barras do slug da página também
        return pageSlug === slug;
      });
      
      if (page) {
        setSelectedPage(page.id);
      } else {
        // Se não encontrou página, limpar seleção
        setSelectedPage('');
      }
    } else if (!value) {
      setSelectedPage('');
    }
  }, [value, pages]);

  const handlePageChange = (pageId: string) => {
    setSelectedPage(pageId);
    const page = pages.find(p => p.id === pageId);
    if (page) {
      // Normalizar slug: remover barras iniciais/finais e garantir uma barra no início
      const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
      const newUrl = `/${normalizedSlug}`;
      onChange(newUrl);
    }
  };

  const handleSectionChange = (sectionId: string) => {
    const page = pages.find(p => p.id === selectedPage);
    if (page) {
      const section = pageSectionsMap[selectedPage]?.find(ps => ps.section_id === sectionId);
      if (section?.section) {
        // Criar âncora usando o nome da seção (normalizado)
        const anchor = section.section.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        // Normalizar slug: remover barras iniciais/finais e garantir uma barra no início
        const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
        const newUrl = `/${normalizedSlug}#${anchor}`;
        onChange(newUrl);
      }
    }
  };

  const currentPageId = selectedPage || pages.find(p => value.includes(p.slug))?.id;
  const currentSections = currentPageId ? pageSectionsMap[currentPageId] || [] : [];

  const sectionSelectValue = value.includes('#') ? value.split('#')[1] : '';

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}

      {loading ? (
        <div className="flex items-center justify-center py-4 border-2 border-gray-200 rounded-lg">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">Carregando páginas...</span>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <Label className="mb-1 block">Página</Label>
            <select
              value={currentPageId || ''}
              onChange={(e) => handlePageChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="">Selecione uma página...</option>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>

          {currentPageId && currentSections.length > 0 && (
            <div>
              <Label className="mb-1 flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Seção
              </Label>
              <select
                value={sectionSelectValue}
                onChange={(e) => {
                  if (e.target.value) {
                    const foundSection = currentSections.find(s =>
                      s.section?.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '') === e.target.value
                    );
                    handleSectionChange(foundSection?.section_id || '');
                  } else {
                    const page = pages.find(p => p.id === currentPageId);
                    if (page) {
                      const normalizedSlug = page.slug.replace(/^\\/+|\\/+$/g, '');
                      onChange(`/${normalizedSlug}`);
                    }
                  }
                }}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">Nenhuma (ir para o topo da página)</option>
                {currentSections
                  .filter(ps => ps.section)
                  .map((ps) => {
                    const anchor = ps.section!.name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-|-$/g, '');
                    return (
                      <option key={ps.id} value={anchor}>
                        {ps.section!.name}
                      </option>
                    );
                  })}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}