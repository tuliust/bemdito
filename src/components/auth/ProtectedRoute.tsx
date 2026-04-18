import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import type { AppPermission } from '@/lib/auth/permissions';

interface ProtectedRouteProps {
  permission?: AppPermission;
  fallbackPath?: string;
  children?: ReactNode;
}

export function ProtectedRoute({
  permission,
  fallbackPath = '/admin/login',
  children,
}: ProtectedRouteProps) {
  const location = useLocation();
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500">Verificando acesso...</div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to={fallbackPath} replace state={{ from: location }} />;
  }

  if (permission && !auth.can(permission)) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
