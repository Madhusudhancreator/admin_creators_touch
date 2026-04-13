export const ROLES = {
  EMPLOYEE: 'employee',
  STANDARD: 'standard',
  PREMIUM: 'premium',
  MASTER: 'master',
};

export const ROLE_LABELS = {
  employee: 'Employee',
  standard: 'Standard Admin',
  premium: 'Premium Admin',
  master: 'Master Admin',
};

export const ROLE_COLORS = {
  employee: '#0977a8',
  standard: '#6366f1',
  premium: '#cc0066',
  master: '#f59e0b',
};

export const ADMIN_ROLES = ['standard', 'premium', 'master'];

export function isAdmin(role) {
  return ADMIN_ROLES.includes(role);
}

export function canAccess(userRole, requiredRole) {
  const order = ['employee', 'standard', 'premium', 'master'];
  return order.indexOf(userRole) >= order.indexOf(requiredRole);
}
