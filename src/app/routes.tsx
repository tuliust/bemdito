import { createBrowserRouter, Navigate } from 'react-router';
import { AdminLayout } from './admin/layout';
import { PublicLayout } from './public/layout';
import { HomePage } from './public/pages/Home';
import { DynamicPage } from './public/pages/DynamicPage';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// ✅ OTIMIZAÇÃO 2026-02-18: Importação HÍBRIDA
// CardsManagerPage: ESTÁTICO (página padrão, precisa ser instantânea)
import CardsManagerPage from './admin/cards-manager/page';

// Outras páginas: LAZY (carregadas sob demanda)
const LoginPage = lazy(() => import('./admin/auth/login').then(m => ({ default: m.LoginPage })));
const DesignSystemPage = lazy(() => import('./admin/design-system/page').then(m => ({ default: m.DesignSystemPage })));
const MenuManagerPage = lazy(() => import('./admin/menu-manager/page').then(m => ({ default: m.MenuManagerPage })));
const FooterManagerPage = lazy(() => import('./admin/footer-manager/page').then(m => ({ default: m.FooterManagerPage })));
const SectionsManagerPage = lazy(() => import('./admin/sections-manager/page').then(m => ({ default: m.SectionsManagerPage })));
const PagesManagerPage = lazy(() => import('./admin/pages-manager/page').then(m => ({ default: m.PagesManagerPage })));
const PageEditorPage = lazy(() => import('./admin/pages-manager/editor').then(m => ({ default: m.PageEditorPage })));
const MobileManagerPage = lazy(() => import('./admin/mobile-manager/page').then(m => ({ default: m.MobileManagerPage })));
const SystemPage = lazy(() => import('./admin/system/page'));  // ← NOVO: Página Sistema

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Wrapper para adicionar Suspense em cada rota
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter(
  [
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/admin/cards-manager" replace />,
        },
        { path: 'login', element: withSuspense(LoginPage) },
        { path: 'cards-manager', element: <CardsManagerPage /> },
        { path: 'design-system', element: withSuspense(DesignSystemPage) },
        { path: 'menu-manager', element: withSuspense(MenuManagerPage) },
        { path: 'footer-manager', element: withSuspense(FooterManagerPage) },
        { path: 'sections-manager', element: withSuspense(SectionsManagerPage) },
        { path: 'pages-manager', element: withSuspense(PagesManagerPage) },
        { path: 'pages-manager/editor/:pageId', element: withSuspense(PageEditorPage) },
        { path: 'mobile-manager', element: withSuspense(MobileManagerPage) },
        { path: 'system', element: withSuspense(SystemPage) },  // ← CORRIGIDO: /admin/system
        { path: 'system-manager', element: <Navigate to="/admin/design-system" replace /> },  // ← Redirect legado
      ],
    },
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        // Redirects para a home
        {
          path: 'inicio',
          element: <Navigate to="/" replace />,
        },
        {
          path: 'home',
          element: <Navigate to="/" replace />,
        },
        {
          path: '*',
          element: <DynamicPage />,
        },
      ],
    },
  ],
);