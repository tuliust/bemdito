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
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed top-0 left-0 h-screen bg-card border-r border-border z-40 flex flex-col',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          {isSidebarOpen && (
            <motion.div
              className="font-bold text-lg text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              CMS Admin
            </motion.div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
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
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative',
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
                      <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              AD
            </div>
            {isSidebarOpen && (
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-sm font-medium text-foreground truncate">Admin</div>
                <div className="text-xs text-muted-foreground truncate">admin@example.com</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className={cn('flex-1 transition-all', isSidebarOpen ? 'ml-64' : 'ml-20')}
        style={{ transitionDuration: '300ms' }}
      >
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Visualizar site
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
