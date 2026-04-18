/**
 * Public Layout
 *
 * Layout para área pública do site.
 * Renderiza blocos globais (header, footer, modals) dinamicamente.
 */

import { ReactNode } from 'react';
import { createServerDb } from '@/lib/supabase/server';
import { PublicLayoutClient } from '@/components/layouts/PublicLayoutClient';
import { getGlobalBlocks } from '@/lib/services/global-blocks-service';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  await createServerDb();
  const globalBlocks = await getGlobalBlocks();

  return <PublicLayoutClient globalBlocks={globalBlocks}>{children}</PublicLayoutClient>;
}
