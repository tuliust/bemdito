/**
 * Page Renderer
 *
 * Renderiza páginas dinamicamente baseado em schema do banco.
 * Core do sistema CMS.
 */

'use client';

import { useMemo } from 'react';
import type { Page } from '@/types/cms';
import { SectionRenderer } from './SectionRenderer';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { isVisibleAtBreakpoint } from '../resolvers/breakpoint-resolver';

export interface PageRendererProps {
  page: Page;
}

export function PageRenderer({ page }: PageRendererProps) {
  const currentBreakpoint = useBreakpoint();

  // Sort and filter sections
  const visibleSections = useMemo(() => {
    if (!page.sections) return [];

    return page.sections
      .filter((section: any) =>
        isVisibleAtBreakpoint(
          section.visible,
          section.breakpointOverrides || section.breakpoint_overrides,
          currentBreakpoint
        )
      )
      .sort((a: any, b: any) => (a.order_index || a.order || 0) - (b.order_index || b.order || 0));
  }, [page.sections, currentBreakpoint]);

  if (!page) {
    return null;
  }

  return (
    <div className="page-container">
      {visibleSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          currentBreakpoint={currentBreakpoint}
        />
      ))}
    </div>
  );
}
