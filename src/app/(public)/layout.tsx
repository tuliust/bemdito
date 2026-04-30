/**
 * Public Layout
 *
 * Layout para área pública do site.
 * Renderiza blocos globais (header, footer, modals) dinamicamente.
 */

import { ReactNode } from 'react';
import { createServerDb } from '@/lib/supabase/server';
import { PublicLayoutClient } from '@/components/layouts/PublicLayoutClient';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  // Fetch global blocks from database
  const db = await createServerDb();

  const { data: globalBlocks } = await db
    .globalBlocks()
    .select('*')
    .eq('visible', true);

  return <PublicLayoutClient globalBlocks={globalBlocks || []}>{children}</PublicLayoutClient>;
}
