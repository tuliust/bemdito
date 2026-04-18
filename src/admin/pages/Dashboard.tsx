import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Globe, Image, Activity } from 'lucide-react';
import { db } from '@/lib/supabase/client';

export function Dashboard() {
  const [stats, setStats] = useState({
    pages: 0,
    sections: 0,
    globalBlocks: 0,
    mediaAssets: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [pages, sections, blocks] = await Promise.all([
          db.pages().select('id', { count: 'exact', head: true }),
          db.pageSections().select('id', { count: 'exact', head: true }),
          db.globalBlocks().select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          pages: pages.count || 0,
          sections: sections.count || 0,
          globalBlocks: blocks.count || 0,
          mediaAssets: 0,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas do dashboard:', error);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    {
      label: 'Páginas',
      value: stats.pages,
      icon: FileText,
      link: '/admin/pages',
      color: 'bg-blue-500',
    },
    {
      label: 'Seções',
      value: stats.sections,
      icon: Activity,
      link: '/admin/pages',
      color: 'bg-green-500',
    },
    {
      label: 'Blocos globais',
      value: stats.globalBlocks,
      icon: Globe,
      link: '/admin/global-blocks',
      color: 'bg-purple-500',
    },
    {
      label: 'Arquivos de mídia',
      value: stats.mediaAssets,
      icon: Image,
      link: '/admin/media',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Painel</h1>
        <p className="mt-2 text-gray-600">Bem-vindo ao painel administrativo do CMS</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="mb-1 text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Ações rápidas</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            to="/admin/pages"
            className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary hover:bg-gray-50"
          >
            <FileText className="mb-2 h-5 w-5 text-primary" />
            <div className="font-medium text-gray-900">Gerenciar páginas</div>
            <div className="mt-1 text-sm text-gray-600">
              Criar, editar e organizar as páginas do site
            </div>
          </Link>

          <Link
            to="/admin/global-blocks"
            className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary hover:bg-gray-50"
          >
            <Globe className="mb-2 h-5 w-5 text-primary" />
            <div className="font-medium text-gray-900">Blocos globais</div>
            <div className="mt-1 text-sm text-gray-600">
              Editar header, footer, overlays e elementos reutilizáveis
            </div>
          </Link>

          <Link
            to="/admin/media"
            className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary hover:bg-gray-50"
          >
            <Image className="mb-2 h-5 w-5 text-primary" />
            <div className="font-medium text-gray-900">Biblioteca de mídia</div>
            <div className="mt-1 text-sm text-gray-600">
              Gerenciar imagens e outros arquivos do projeto
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}