export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export const AdminRoleLabels: Record<AdminRole, string> = {
  [AdminRole.SUPER_ADMIN]: 'Super Administrateur',
  [AdminRole.ADMIN]: 'Administrateur',
  [AdminRole.MODERATOR]: 'Moderateur',
};
