import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase } from '../../../lib/supabase/client';
import type { Page, Section, PageSection } from '@/types/database';
import { SectionRenderer } from '../components/SectionRenderer';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * 🎯 Deep merge de objetos - merge correto de configs aninhados
 * Garante que page_sections.config sobrescreva sections.config corretamente
 */
function deepMerge(target: any, source: any): any {
  if (!source) return target;
  if (!target) return source;
  
  const output = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(output[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  
  return output;
}

export function DynamicPage() {
  const { '*': slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
  }, [slug]);

  async function loadPage() {
    try {
      setLoading(true);
      setError(null);

      const pageSlug = '/' + (slug || '');

      // Carregar página — usa maybeSingle() para evitar 406 quando página não existe
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', pageSlug)
        .eq('published', true)
        .maybeSingle();

      if (pageError) {
        console.error('Erro ao carregar página:', pageError);
        setError('Erro ao carregar página');
        return;
      }

      if (!pageData) {
        // Página não existe ou não está publicada — sem 406, sem throw
        setError('Página não encontrada');
        return;
      }

      setPage(pageData);

      // Atualizar meta tags
      if (pageData.meta_title) {
        document.title = pageData.meta_title;
      } else if (pageData.title) {
        document.title = pageData.title;
      }

      if (pageData.meta_description) {
        updateMetaTag('description', pageData.meta_description);
      }

      if (pageData.meta_keywords) {
        updateMetaTag('keywords', pageData.meta_keywords);
      }

      // Carregar seções da página
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*, section:sections!inner(*)')
        .eq('page_id', pageData.id)
        .order('order_index', { ascending: true });

      if (sectionsError) {
        console.error('Error loading sections:', sectionsError);
        throw sectionsError;
      }

      setPageSections(sectionsData || []);
    } catch (error) {
      console.error('Error loading dynamic page:', error);
      setError('Erro ao carregar página');
    } finally {
      setLoading(false);
    }
  }

  function updateMetaTag(name: string, content: string) {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {error || 'Página não encontrada'}
        </h1>
        <p className="text-gray-600 mb-4">
          A página que você está procurando não existe ou não está publicada.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#ea526e] text-white rounded-lg hover:bg-[#d94860]"
          style={{ transition: 'none' }}
        >
          Voltar para Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {pageSections.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{page.name}</h1>
          <p className="text-gray-600">
            Esta página ainda não possui seções configuradas.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {pageSections.map((pageSection) => {
            if (!pageSection.section) {
              console.warn(
                `Section not found for page_section: ${pageSection.id}. This orphaned reference will be cleaned up automatically.`
              );
              return null;
            }

            // Merge configs: section template config + page-specific override
            const mergedConfig = deepMerge(
              pageSection.section.config,
              pageSection.config
            );
            
            // Merge styling: section template styling + page-specific override
            const mergedStyling = deepMerge(
              pageSection.section.styling || {},
              pageSection.styling || {}
            );
            
            // ✅ FIX 2026-02-14: Merge layout (seção base + override da página)
            const mergedLayout = deepMerge(
              pageSection.section.layout || {},
              pageSection.layout || {}
            );
            
            // Gerar ID da seção baseado no nome (para âncoras funcionarem)
            const sectionAnchorId = pageSection.section.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '');

            return (
              <SectionRenderer
                key={pageSection.id}
                type={pageSection.section.type}
                config={mergedConfig}
                styling={mergedStyling}
                layout={mergedLayout} // ✅ FIX 2026-02-14: Passar layout!
                sectionId={pageSection.section_id}
                sectionAnchorId={sectionAnchorId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}