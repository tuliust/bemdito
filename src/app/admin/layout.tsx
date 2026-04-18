/**
 * Admin Layout
 *
 * Layout para área administrativa.
 * Inclui sidebar, topbar e proteção de autenticação.
 */

import { ReactNode } from 'react';
import { AdminLayoutClient } from '@/components/layouts/AdminLayoutClient';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // TODO: Check user role/permissions

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
