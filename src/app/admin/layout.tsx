import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Link } from '@/lib/components/Link';
import { useAuth } from '../../lib/hooks/useAuth';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { AlertMessageDialog } from '../components/admin/AlertMessageDialog';
import { ConfirmDeleteDialog } from '../components/admin/ConfirmDeleteDialog';
import { AdminThemeProvider } from '../components/admin/AdminThemeProvider';
import {
  Palette,
  Menu,
  CreditCard,
  FileText,
  LogOut,
  Loader2,
  Layers,
  Layout,
  Smartphone,
  Settings,  // ← NOVO: Ícone para Sistema
} from 'lucide-react';

const navigation = [
  { name: 'Cards',          href: '/admin/cards-manager',   icon: CreditCard },
  { name: 'Design System',  href: '/admin/design-system',   icon: Palette    },
  { name: 'Menu',           href: '/admin/menu-manager',    icon: Menu       },
  { name: 'Mobile',         href: '/admin/mobile-manager',  icon: Smartphone },
  { name: 'Páginas',        href: '/admin/pages-manager',   icon: FileText   },
  { name: 'Rodapé',         href: '/admin/footer-manager',  icon: Layers     },
  { name: 'Seções',         href: '/admin/sections-manager', icon: Layout    },
  { name: 'Sistema',        href: '/admin/system',           icon: Settings   },  // ← NOVO
];

// ── Componente auxiliar para itens de nav tokenizados com hover ──────────────
function SidebarNavLink({
  name,
  href,
  icon: Icon,
  isActive,
}: {
  name: string;
  href: string;
  icon: React.ElementType;
  isActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg"
      style={{
        fontSize:        'var(--admin-nav-item-size,   0.875rem)',
        fontWeight:      'var(--admin-nav-item-weight, 500)',
        color:           isActive
          ? 'var(--admin-sidebar-active-text, #ffffff)'
          : 'var(--admin-nav-item-color, #d1d5db)',
        backgroundColor: isActive
          ? 'var(--admin-sidebar-active, #ea526e)'
          : hovered
          ? 'var(--admin-sidebar-hover, rgba(255,255,255,0.08))'
          : 'transparent',
        transition: 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon className="h-5 w-5" />
      {name}
    </Link>
  );
}

export function AdminLayout() {
  const { isAuthenticated, loading, signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCleaningOrphans, setIsCleaningOrphans] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ title?: string; message: string } | null>(null);
  const showAlert = (message: string, title?: string) => setAlertMsg({ message, title });
  const [showCleanConfirm, setShowCleanConfirm] = useState(false);
  const [signOutHovered, setSignOutHovered] = useState(false);

  // ✅ AUTH DESABILITADA: Site em desenvolvimento — acesso livre ao painel admin.
  // Para reativar, substituir por: const isDevelopment = import.meta.env.DEV;
  const isDevelopment = true;

  useEffect(() => {
    if (!isDevelopment && !loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/inicio');
  };

  const handleCleanOrphans = async () => {
    setShowCleanConfirm(true);
  };

  const doCleanOrphans = async () => {
    setShowCleanConfirm(false);
    setIsCleaningOrphans(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-72da2481/cleanup-orphaned-sections`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();
      
      if (result.success) {
        if (result.deletedCount > 0) {
          showAlert(`Limpeza concluída! ${result.deletedCount} registro(s) órfão(s) removido(s).`, '✅ Sucesso');
        } else {
          showAlert('Nenhum registro órfão encontrado. Banco de dados está limpo!', '✅ Sucesso');
        }
      } else {
        showAlert(`Erro na limpeza: ${result.error}`, '❌ Erro');
      }
    } catch (error) {
      console.error('Erro ao limpar órfãos:', error);
      showAlert('Erro ao executar limpeza. Verifique o console.', '❌ Erro');
    } finally {
      setIsCleaningOrphans(false);
    }
  };

  if (!isDevelopment && loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isDevelopment && !isAuthenticated) {
    return null;
  }

  return (
    <AdminThemeProvider>
      <div className="flex h-screen admin-layout" style={{ backgroundColor: 'var(--admin-page-bg, #f9fafb)' }}>
        {/* Sidebar */}
        <div
          className="w-64 flex flex-col"
          style={{ backgroundColor: 'var(--admin-sidebar-bg, #2e2240)', color: '#ffffff' }}
        >
          <div className="p-6">
            <h1
              style={{
                fontSize:   'var(--admin-sidebar-title-size,   1.5rem)',
                fontWeight: 'var(--admin-sidebar-title-weight, 700)',
                color:      'var(--admin-sidebar-title-color,  #ffffff)',
                lineHeight: 1.2,
              }}
            >
              Ajustes
            </h1>
            <p
              style={{
                fontSize:   'var(--admin-page-description-size,  0.875rem)',
                color:      'rgba(255,255,255,0.5)',
                marginTop:  '0.25rem',
              }}
            >
              {user?.email}
            </p>
          </div>

          {/* Separador superior — tokenizado via sidebar-separator */}
          <Separator style={{ backgroundColor: 'var(--admin-sidebar-separator, rgba(255,255,255,0.12))' }} />

          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== '/admin' && location.pathname.startsWith(item.href + '/'));
                return (
                  <SidebarNavLink
                    key={item.name}
                    name={item.name}
                    href={item.href}
                    icon={item.icon}
                    isActive={isActive}
                  />
                );
              })}
            </nav>
          </ScrollArea>

          {/* Separador inferior — tokenizado via sidebar-separator */}
          <Separator style={{ backgroundColor: 'var(--admin-sidebar-separator, rgba(255,255,255,0.12))' }} />

          <div className="p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              style={{
                fontSize:        'var(--admin-nav-item-size,   0.875rem)',
                fontWeight:      'var(--admin-nav-item-weight, 500)',
                color:           signOutHovered
                  ? 'var(--admin-sidebar-active-text, #ffffff)'
                  : 'var(--admin-nav-item-color, #d1d5db)',
                backgroundColor: signOutHovered
                  ? 'var(--admin-sidebar-hover, rgba(255,255,255,0.08))'
                  : 'transparent',
                transition:      'none',
              }}
              onMouseEnter={() => setSignOutHovered(true)}
              onMouseLeave={() => setSignOutHovered(false)}
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <main
              className="p-8"
              style={{ backgroundColor: 'var(--admin-page-bg, #f9fafb)', minHeight: '100%' }}
            >
              <Outlet />
            </main>
          </div>
        </div>

        {/* Dialogs */}
        <AlertMessageDialog
          open={!!alertMsg}
          title={alertMsg?.title}
          message={alertMsg?.message ?? ''}
          onClose={() => setAlertMsg(null)}
        />
        <ConfirmDeleteDialog
          open={showCleanConfirm}
          title="Limpar Registros Órfãos"
          description="Limpar registros órfãos de seções? Isso removerá referências a seções que foram deletadas."
          onConfirm={doCleanOrphans}
          onCancel={() => setShowCleanConfirm(false)}
        />
      </div>
    </AdminThemeProvider>
  );
}