import { UserRole,Region  } from '../types';

 ['global_admin', 'regional_admin', 'sending_partner', 'receiving_partner']
// Role hierarchy and permissions
export const ROLE_PERMISSIONS = {
  'global_admin': {
    canViewAllRegions: true,
    canManageUsers: true,
    canViewAllTransactions: true,
    canViewAllAuditLogs: true,
    canModifySettings: true,
    canApproveTransactions: true,
  },
  'regional_admin': {
    canViewAllRegions: false,
    canManageUsers: true,
    canViewAllTransactions: false,
    canViewAllAuditLogs: true,
    canModifySettings: true,
    canApproveTransactions: true,
  },
  'sending_partner': {
    canViewAllRegions: false,
    canManageUsers: false,
    canViewAllTransactions: false,
    canViewAllAuditLogs: false,
    canModifySettings: false,
    canApproveTransactions: false,
  },
  'receiving_partner': {
    canViewAllRegions: false,
    canManageUsers: false,
    canViewAllTransactions: false,
    canViewAllAuditLogs: false,
    canModifySettings: false,
    canApproveTransactions: false,
  },
} as const;

export const hasPermission = (role: UserRole, permission: keyof typeof ROLE_PERMISSIONS['global_admin']): boolean => {
  return ROLE_PERMISSIONS[role][permission];
};

export const canAccessRoute = (role: UserRole, route: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[role];
  
  switch (route) {
    case '/dashboard':
      return true;
    case '/kyc':
      return ['global_admin', 'regional_admin'].includes(role);
    case '/transactions':
      return true;
    case '/audit-logs':
      return rolePermissions.canViewAllAuditLogs || role !== 'Sending Partner' && role !== 'Receiving Partner';
    case '/settings':
      return true;
    default:
      return true;
  }
};

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'global_admin' as UserRole:
      return 'bg-primary text-primary-foreground';
    case 'regional_admin' as UserRole:
      return 'bg-success text-success-foreground';
    case 'sending_partner' as UserRole:
      return 'bg-warning text-warning-foreground';
    case 'receiving_partner' as UserRole:
      return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const filterDataByRole = <T extends { region?: string }>(
  data: T[],
  role: UserRole,
  userRegion?: string
): T[] => {
  if (hasPermission(role, 'canViewAllRegions')) {
    return data;
  }
  
  if (role === 'regional_admin' as UserRole && userRegion) {
    return data.filter(item => item.region === userRegion);
  }
  
  return data;
};




export function getRegionLabel(region: Region): string {
  switch (region) {
    case Region.MENA:
      return "Middle East and North Africa";
    case Region.EU:
      return "European Union";
    case Region.NA:
      return "North America";
    case Region.SA:
      return "South America";
    case Region.APAC:
      return "Asia-Pacific";
    case Region.SSA:
      return "Sub-Saharan Africa";
    case Region.GLOBAL:
      return "Global";
    default:
      return region;
  }
}
