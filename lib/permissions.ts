export const ROLES = {
  USER: 'USER',
  POWER_USER: 'POWER_USER',
  ADMIN: 'ADMIN'
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const hasPermission = (userRole: string, requiredRole: Role): boolean => {
  const roleHierarchy = {
    [ROLES.USER]: 1,
    [ROLES.POWER_USER]: 2,
    [ROLES.ADMIN]: 3
  }
  
  return roleHierarchy[userRole as Role] >= roleHierarchy[requiredRole]
}

export const canCreateBlog = (role: string) => hasPermission(role, ROLES.POWER_USER)
export const canEditBlog = (role: string) => hasPermission(role, ROLES.POWER_USER)
export const canDeleteBlog = (role: string) => hasPermission(role, ROLES.ADMIN)
export const canPublishBlog = (role: string) => hasPermission(role, ROLES.POWER_USER)
export const canAccessAdmin = (role: string) => hasPermission(role, ROLES.POWER_USER)
export const canManageUsers = (role: string) => hasPermission(role, ROLES.ADMIN)
export const canViewStats = (role: string) => hasPermission(role, ROLES.POWER_USER)