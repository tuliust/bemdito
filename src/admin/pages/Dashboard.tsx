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
    }

    loadStats();
  }, []);

  const statCards = [
    {
      label: 'Pages',
      value: stats.pages,
      icon: FileText,
      link: '/admin/pages',
      color: 'bg-blue-500',
    },
    {
      label: 'Sections',
      value: stats.sections,
      icon: Activity,
      link: '/admin/pages',
      color: 'bg-green-500',
    },
    {
      label: 'Global Blocks',
      value: stats.globalBlocks,
      icon: Globe,
      link: '/admin/global-blocks',
      color: 'bg-purple-500',
    },
    {
      label: 'Media Assets',
      value: stats.mediaAssets,
      icon: Image,
      link: '/admin/media',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the CMS admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/pages"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-primary mb-2" />
            <div className="font-medium text-gray-900">Manage Pages</div>
            <div className="text-sm text-gray-600 mt-1">
              Create, edit and manage pages
            </div>
          </Link>

          <Link
            to="/admin/global-blocks"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-5 h-5 text-primary mb-2" />
            <div className="font-medium text-gray-900">Global Blocks</div>
            <div className="text-sm text-gray-600 mt-1">
              Edit header, footer and modals
            </div>
          </Link>

          <Link
            to="/admin/design-system"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
          >
            <Image className="w-5 h-5 text-primary mb-2" />
            <div className="font-medium text-gray-900">Design System</div>
            <div className="text-sm text-gray-600 mt-1">
              Manage tokens and presets
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
