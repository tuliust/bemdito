/**
 * Admin Pages List
 *
 * Lista de todas as páginas do sistema.
 */

import { Card, Button } from '@/components/foundation';
import { Plus, FileText } from 'lucide-react';
import { createServerDb } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminPagesPage() {
  const db = await createServerDb();

  const { data: pages } = await db.pages().select('*').order('updated_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Páginas</h1>
          <p className="text-muted-foreground mt-1">Gerencie as páginas do site</p>
        </div>
        <Button variant="primary" pill>
          <Plus className="w-4 h-4" />
          Nova Página
        </Button>
      </div>

      {pages && pages.length > 0 ? (
        <div className="grid gap-4">
          {pages.map((page) => (
            <Link key={page.id} href={`/admin/pages/${page.id}`}>
              <Card padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">/{page.slug}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      page.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {page.status}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card padding="xl">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma página</h3>
            <p className="text-muted-foreground mb-4">Comece criando sua primeira página</p>
            <Button variant="primary" pill>
              <Plus className="w-4 h-4" />
              Nova Página
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
