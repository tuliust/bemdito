import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Globe,
  FolderKanban,
  Image,
  Palette,
  Settings,
  Menu,
  X,
  Home,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/foundation';
import { useAuth } from '@/lib/auth/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: 'cms:pages' | 'cms:content' | 'cms:media' | 'cms:design-system' | 'cms:settings';
}

const navItems: NavItem[] = [
  { label: 'Painel', path: '/admin', icon: LayoutDashboard },
  { label: 'Páginas', path: '/admin/pages', icon: FileText, permission: 'cms:pages' },
  { label: 'Blocos globais', path: '/admin/global-blocks', icon: Globe, permission: 'cms:pages' },
  { label: 'Conteúdo', path: '/admin/content', icon: FolderKanban, permission: 'cms:content' },
  { label: 'Mídia', path: '/admin/media', icon: Image, permission: 'cms:media' },
  {
    label: 'Sistema de design',
    path: '/admin/design-system',
    icon: Palette,
    permission: 'cms:design-system',
  },
  { label: 'Configurações', path: '/admin/settings', icon: Settings, permission: 'cms:settings' },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, role, can, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const allowedItems = navItems.filter((item) => !item.permission || can(item.permission));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-4 rounded-lg p-2 hover:bg-gray-100"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <h1 className="text-lg font-semibold text-gray-900">Painel CMS</h1>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-gray-100 px-3 py-2 md:flex">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wide text-gray-700">
              {role}
            </span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Home className="w-4 h-4" />
            Ver site
          </Link>

          <button
            onClick={() => void signOut()}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            title={user?.email || 'Sair'}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>

      <div
        className={`fixed bottom-0 left-0 top-16 z-20 w-64 border-r border-gray-200 bg-white transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="space-y-1 p-4">
          <div className="mb-4 rounded-2xl bg-gray-50 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Conta</p>
            <p className="mt-2 truncate text-sm font-medium text-gray-900">
              {user?.email || 'usuário autenticado'}
            </p>
            <div className="mt-3">
              <Badge variant="secondary" size="sm">
                {role}
              </Badge>
            </div>
          </div>

          {allowedItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}