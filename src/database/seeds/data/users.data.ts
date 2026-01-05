export interface UserSeedData {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp?: string;
  emailVerifiedAt?: Date;
}

export const usersData: UserSeedData[] = [
  {
    firstName: 'Admin',
    lastName: 'HGPD',
    email: 'admin@hgpd.sn',
    whatsapp: '+221770000001',
    emailVerifiedAt: new Date(),
  },
  {
    firstName: 'Modérateur',
    lastName: 'HGPD',
    email: 'moderateur@hgpd.sn',
    whatsapp: '+221770000002',
    emailVerifiedAt: new Date(),
  },
  {
    firstName: 'Support',
    lastName: 'HGPD',
    email: 'support@hgpd.sn',
    whatsapp: '+221770000003',
    emailVerifiedAt: new Date(),
  },
  {
    firstName: 'Commercial',
    lastName: 'HGPD',
    email: 'commercial@hgpd.sn',
    whatsapp: '+221770000004',
    emailVerifiedAt: new Date(),
  },
  {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@hgpd.sn',
    whatsapp: '+221770000005',
  },
];
