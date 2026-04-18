import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AdminLayout } from '@/admin/layouts/AdminLayout';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const PublicHome = lazy(() => import('./PublicHome').then((module) => ({ default: module.PublicHome })));
const Dashboard = lazy(() => import('@/admin/pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const PagesList = lazy(() => import('@/admin/pages/PagesList').then((module) => ({ default: module.PagesList })));
const PageEditor = lazy(() => import('@/admin/pages/PageEditor').then((module) => ({ default: module.PageEditor })));
const GlobalBlocksPage = lazy(() => import('@/admin/pages/GlobalBlocksPage').then((module) => ({ default: module.GlobalBlocksPage })));
const ContentModulesPage = lazy(() => import('@/admin/pages/ContentModulesPage').then((module) => ({ default: module.ContentModulesPage })));
const MediaLibrary = lazy(() => import('@/components/admin/MediaLibrary').then((module) => ({ default: module.MediaLibrary })));
const DesignSystemEditor = lazy(() => import('@/components/admin/DesignSystemEditor').then((module) => ({ default: module.DesignSystemEditor })));
const LoginPage = lazy(() => import('@/admin/pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const CompanyPortalPage = lazy(() => import('@/portal/pages/CompanyPortalPage').then((module) => ({ default: module.CompanyPortalPage })));
const ProfessionalPortalPage = lazy(() => import('@/portal/pages/ProfessionalPortalPage').then((module) => ({ default: module.ProfessionalPortalPage })));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-sm text-gray-500">Carregando modulo...</div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<PublicHome />} />
              <Route path="/admin/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute permission="cms:access" />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="pages" element={<PagesList />} />
                  <Route path="global-blocks" element={<GlobalBlocksPage />} />
                  <Route path="content" element={<ContentModulesPage />} />
                  <Route path="media" element={<MediaLibrary />} />
                  <Route path="design-system" element={<DesignSystemEditor />} />
                  <Route path="settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
                </Route>

                <Route path="/admin/pages/:pageId/edit" element={<PageEditor />} />
              </Route>

              <Route element={<ProtectedRoute permission="portal:company" fallbackPath="/admin/login" />}>
                <Route path="/portal/company" element={<CompanyPortalPage />} />
              </Route>

              <Route element={<ProtectedRoute permission="portal:professional" fallbackPath="/admin/login" />}>
                <Route path="/portal/professional" element={<ProfessionalPortalPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
