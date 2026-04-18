export type AppRole =
  | 'anonymous'
  | 'viewer'
  | 'editor'
  | 'admin'
  | 'company'
  | 'professional';

export type AppPermission =
  | 'cms:access'
  | 'cms:pages'
  | 'cms:content'
  | 'cms:media'
  | 'cms:design-system'
  | 'cms:settings'
  | 'portal:company'
  | 'portal:professional';

const rolePermissions: Record<AppRole, AppPermission[]> = {
  anonymous: [],
  viewer: ['cms:access'],
  editor: ['cms:access', 'cms:pages', 'cms:content', 'cms:media'],
  admin: [
    'cms:access',
    'cms:pages',
    'cms:content',
    'cms:media',
    'cms:design-system',
    'cms:settings',
    'portal:company',
    'portal:professional',
  ],
  company: ['portal:company'],
  professional: ['portal:professional'],
};

export function resolveAppRole(user: { app_metadata?: any; user_metadata?: any } | null | undefined): AppRole {
  const roleCandidate =
    user?.app_metadata?.role ??
    user?.user_metadata?.role ??
    user?.user_metadata?.portalRole ??
    'anonymous';

  if (roleCandidate in rolePermissions) {
    return roleCandidate as AppRole;
  }

  return 'anonymous';
}

export function getPermissionsForRole(role: AppRole): AppPermission[] {
  return rolePermissions[role] ?? [];
}

export function hasPermission(role: AppRole, permission: AppPermission) {
  return getPermissionsForRole(role).includes(permission);
}
