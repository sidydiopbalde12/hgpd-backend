import { locations } from './providers.data';

// Prénoms et noms sénégalais
const firstNames = [
  'Moussa',
  'Fatou',
  'Amadou',
  'Aissatou',
  'Ibrahima',
  'Mariama',
  'Ousmane',
  'Aminata',
  'Cheikh',
  'Khady',
  'Mamadou',
  'Awa',
  'Abdoulaye',
  'Ndèye',
  'Modou',
  'Coumba',
  'Pape',
  'Diary',
  'Serigne',
  'Adama',
  'Babacar',
  'Sokhna',
  'Alioune',
  'Rama',
  'Youssou',
];
const lastNames = [
  'Diop',
  'Fall',
  'Ndiaye',
  'Sow',
  'Ba',
  'Diallo',
  'Sy',
  'Gueye',
  'Sarr',
  'Mbaye',
  'Faye',
  'Kane',
  'Thiam',
  'Diouf',
  'Seck',
  'Niang',
  'Cissé',
  'Touré',
  'Diagne',
  'Ndoye',
  'Samb',
  'Ly',
  'Diaw',
  'Sène',
  'Ngom',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone(): string {
  const prefixes = ['77', '78', '76', '70', '75'];
  const prefix = randomItem(prefixes);
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `+221${prefix}${number}`;
}

export interface OrganizerSeedData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  department: string;
  commune: string;
}

export function generateOrganizers(count: number = 30): OrganizerSeedData[] {
  const organizers: OrganizerSeedData[] = [];
  const usedPhones = new Set<string>();

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const location = randomItem(locations);
    const commune = randomItem(location.communes);

    // Générer un téléphone unique
    let phone = generatePhone();
    while (usedPhones.has(phone)) {
      phone = generatePhone();
    }
    usedPhones.add(phone);

    // 70% ont un email
    const hasEmail = Math.random() > 0.3;
    const email = hasEmail
      ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`
      : undefined;

    organizers.push({
      firstName,
      lastName,
      phone,
      email,
      department: location.department,
      commune,
    });
  }

  return organizers;
}
