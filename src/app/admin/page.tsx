/**
 * Admin Dashboard
 *
 * Dashboard principal do admin com métricas e ações rápidas.
 */

import { Card } from '@/components/foundation';
import { FileText, Image, MessageSquare, Users } from 'lucide-react';
import { createServerDb } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const db = await createServerDb();

  // Fetch stats
  const [pagesCount, mediaCount, blogCount, usersCount] = await Promise.all([
    db.pages().select('count'),
    db.mediaAssets().select('count'),
    db.blogPosts().select('count'),
    // db.users().select('count'), // Requires user table
  ]);

  const stats = [
    {
      label: 'Páginas',
      value: pagesCount.count || 0,
      icon: FileText,
      href: '/admin/pages',
    },
    {
      label: 'Mídia',
      value: mediaCount.count || 0,
      icon: Image,
      href: '/admin/media',
    },
    {
      label: 'Posts',
      value: blogCount.count || 0,
      icon: MessageSquare,
      href: '/admin/blog',
    },
    {
      label: 'Usuários',
      value: 0, // usersCount.count || 0,
      icon: Users,
      href: '/admin/users',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a key={stat.label} href={stat.href}>
              <Card padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </Card>
            </a>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-foreground mb-4">Atividade Recente</h2>
        <p className="text-muted-foreground">Nenhuma atividade recente</p>
      </Card>
    </div>
  );
}
