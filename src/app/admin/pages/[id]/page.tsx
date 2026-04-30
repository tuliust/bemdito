/**
 * Admin Page Editor
 *
 * Editor visual de página individual.
 * Reutiliza PageEditor já criado no Prompt 1.
 */

import { PageEditor } from '@/components/admin/PageEditor';
import { createServerDb } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function AdminPageEditorPage({ params }: { params: { id: string } }) {
  const db = await createServerDb();

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
    .eq('id', params.id)
    .single();

  if (!page) {
    notFound();
  }

  return <PageEditor pageId={params.id} />;
}
