import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import type { Page, Section, PageSection } from '@/types/database';
import { SectionRenderer } from '../components/SectionRenderer';
import { Loader2 } from 'lucide-react';

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

export function HomePage() {
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    try {
      // Try multiple possible home page slugs
      const possibleSlugs = ['/', 'home', 'inicio', 'index'];
      
      let page = null;
      
      // Try to find home page with any of the possible slugs
      for (const slug of possibleSlugs) {
        const { data } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .maybeSingle();
        
        if (data) {
          page = data;
          break;
        }
      }

      // If no home page found, try to get the first published page
      if (!page) {
        const { data: firstPage } = await supabase
          .from('pages')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();
        
        page = firstPage;
      }

      if (!page) {
        console.error('No published pages found. Please create a home page in /admin/pages-manager');
        setLoading(false);
        return;
      }

      // Get sections for this page with join
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*, section:sections!inner(*)')
        .eq('page_id', page.id)
        .order('order_index', { ascending: true });

      if (sectionsError) {
        console.error('Error loading sections:', sectionsError);
      }

      if (sectionsData) {
        setPageSections(sectionsData);
      }
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pageSections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-lg px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo ao BemDito
          </h1>
          <p className="text-gray-600 mb-8">
            Nenhuma página home foi encontrada ou configurada ainda.
          </p>
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Como criar sua home page:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Acesse o painel admin em <a href="/admin/pages-manager" className="text-primary hover:underline font-medium">/admin/pages-manager</a></li>
              <li>Crie uma nova página com slug "/" ou "home"</li>
              <li>Adicione seções à sua página</li>
              <li>Publique a página</li>
            </ol>
          </div>
          <div className="mt-6">
            <a
              href="/admin/pages-manager"
              className="inline-block px-8 py-3 bg-[#ea526e] text-white font-medium rounded-lg hover:opacity-90"
              style={{ transition: 'none' }}
            >
              Ir para Pages Manager
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {pageSections.map((pageSection) => {
        if (!pageSection.section) {
          console.warn(
            `Section not found for page_section: ${pageSection.id}. This orphaned reference will be cleaned up automatically.`
          );
          return null;
        }

        // Merge configs: section template config + page-specific override
        const mergedConfig = deepMerge(pageSection.section.config, pageSection.config);
        
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
            section={pageSection.section} // ✅ FIX 2026-02-17: Passar seção completa (inclui elements)
            sectionId={pageSection.section_id}
            sectionAnchorId={sectionAnchorId}
          />
        );
      })}
    </div>
  );
}