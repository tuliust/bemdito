/**
 * Home Page
 *
 * Página inicial renderizada dinamicamente do banco.
 */

import { createServerDb } from '@/lib/supabase/server';
import { PageRenderer } from '@/lib/cms/renderers/PageRenderer';
import { normalizePage } from '@/lib/services/cms-admin-service';
import { notFound } from 'next/navigation';

export default async function HomePage() {
  const db = await createServerDb();

  // Fetch home page with all sections, items, and overrides
  const { data: page } = await db
    .pages()
    .select(
      `
      *,
      sections:page_sections(
        *,
        template:section_templates(*),
        variant:section_variants(*),
        items:section_items(*),
        breakpointOverrides:section_breakpoint_overrides(*)
      )
    `
    )
    .eq('slug', '/')
    .eq('status', 'published')
    .single();

  if (!page) {
    notFound();
  }

  return <PageRenderer page={normalizePage(page)} />;
}
