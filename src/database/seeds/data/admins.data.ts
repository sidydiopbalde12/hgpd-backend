import { AdminRole } from '../../../common/enums';

export interface AdminSeedData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
}

// Mot de passe par defaut: "Admin@HGPD2024!" (hashe avec bcrypt, 10 rounds)
// IMPORTANT: Changer ce mot de passe en production !
const DEFAULT_PASSWORD_HASH = '$2b$10$4KYvRQXnB061UVJpU6.S6.SyujhPuk3weohwkjea7NXRHPqhMezDS';

export const adminsSeedData: AdminSeedData[] = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@hgpd.com',
    password: DEFAULT_PASSWORD_HASH,
    role: AdminRole.SUPER_ADMIN,
    isActive: true,
  },
  {
    firstName: 'Admin',
    lastName: 'HGPD',
    email: 'admin@hgpd.com',
    password: DEFAULT_PASSWORD_HASH,
    role: AdminRole.ADMIN,
    isActive: true,
  },
  {
    firstName: 'Moderateur',
    lastName: 'HGPD',
    email: 'moderator@hgpd.com',
    password: DEFAULT_PASSWORD_HASH,
    role: AdminRole.MODERATOR,
    isActive: true,
  },
];

export function generateAdmins(): AdminSeedData[] {
  return adminsSeedData;
}
