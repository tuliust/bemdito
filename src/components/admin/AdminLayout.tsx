import { ReactNode, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  FileText,
  Menu as MenuIcon,
  Navigation,
  Image,
  MessageSquare,
  Award,
  HelpCircle,
  Palette,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Painel', href: '/admin', icon: LayoutDashboard },
  { label: 'Páginas', href: '/admin/pages', icon: FileText },
  { label: 'Navegação', href: '/admin/navigation', icon: Navigation },
  { label: 'Mídia', href: '/admin/media', icon: Image },
  { label: 'Blog', href: '/admin/blog', icon: MessageSquare },
  { label: 'Depoimentos', href: '/admin/testimonials', icon: MessageSquare },
  { label: 'Premiações', href: '/admin/awards', icon: Award },
  { label: 'FAQ', href: '/admin/faqs', icon: HelpCircle },
  { label: 'Design System', href: '/admin/design-system', icon: Palette },
  { label: 'Usuários', href: '/admin/users', icon: Users },
  { label: 'Configurações', href: '/admin/settings', icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      <motion.aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          {isSidebarOpen && (
            <motion.div
              className="text-lg font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              CMS Admin
            </motion.div>
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-accent"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && (
                      <motion.span
                        className="text-sm font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {item.badge && isSidebarOpen && (
                      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
              AD
            </div>
            {isSidebarOpen && (
              <motion.div
                className="min-w-0 flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="truncate text-sm font-medium text-foreground">Admin</div>
                <div className="truncate text-xs text-muted-foreground">admin@example.com</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>

      <div
        className={cn('flex-1 transition-all', isSidebarOpen ? 'ml-64' : 'ml-20')}
        style={{ transitionDuration: '300ms' }}
      >
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Visualizar site
            </button>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}