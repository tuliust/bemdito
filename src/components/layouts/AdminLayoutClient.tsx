/**
 * AdminLayoutClient
 *
 * Client-side admin layout with sidebar, topbar, and navigation.
 * Reutiliza AdminLayout já criado no Prompt 1.
 */

'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';

export interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
