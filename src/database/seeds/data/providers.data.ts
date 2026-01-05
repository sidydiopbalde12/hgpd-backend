import { IdentityDocType } from '../../../common/enums';

// Départements et communes du Sénégal
export const locations = [
  { department: 'Dakar', communes: ['Plateau', 'Médina', 'Grand Dakar', 'Parcelles Assainies', 'Almadies', 'Ouakam', 'Ngor', 'Yoff'] },
  { department: 'Pikine', communes: ['Pikine Ouest', 'Pikine Est', 'Pikine Nord', 'Guédiawaye', 'Thiaroye'] },
  { department: 'Rufisque', communes: ['Rufisque Ouest', 'Rufisque Est', 'Rufisque Nord', 'Bargny', 'Diamniadio'] },
  { department: 'Thiès', communes: ['Thiès Nord', 'Thiès Est', 'Thiès Ouest', 'Mbour', 'Saly'] },
  { department: 'Saint-Louis', communes: ['Saint-Louis Nord', 'Saint-Louis Sud', 'Sor', 'Ndar Toute'] },
  { department: 'Kaolack', communes: ['Kaolack', 'Ndoffane', 'Kahone'] },
  { department: 'Ziguinchor', communes: ['Ziguinchor', 'Boucotte', 'Kandé'] },
];

// Prénoms et noms sénégalais
const firstNames = ['Moussa', 'Fatou', 'Amadou', 'Aissatou', 'Ibrahima', 'Mariama', 'Ousmane', 'Aminata', 'Cheikh', 'Khady', 'Mamadou', 'Awa', 'Abdoulaye', 'Ndèye', 'Modou', 'Coumba', 'Pape', 'Diary', 'Serigne', 'Adama'];
const lastNames = ['Diop', 'Fall', 'Ndiaye', 'Sow', 'Ba', 'Diallo', 'Sy', 'Gueye', 'Sarr', 'Mbaye', 'Faye', 'Kane', 'Thiam', 'Diouf', 'Seck', 'Niang', 'Cissé', 'Touré', 'Diagne', 'Ndoye'];

// Noms d'entreprises
const companyPrefixes = ['Espace', 'Studio', 'Agence', 'Maison', 'Art', 'Royal', 'Elite', 'Pro', 'Star', 'Golden'];
const companySuffixes = ['Events', 'Production', 'Services', 'Création', 'Design', 'Plus', 'Premium', 'Vision', 'Dreams', 'Prestige'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone(): string {
  const prefixes = ['77', '78', '76', '70', '75'];
  const prefix = randomItem(prefixes);
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `+221${prefix}${number}`;
}

function generateCompanyName(activity: string): string {
  return `${randomItem(companyPrefixes)} ${activity.split(' ')[0]} ${randomItem(companySuffixes)}`;
}

export interface ProviderSeedData {
  firstName: string;
  lastName: string;
  companyName: string;
  activity: string;
  department: string;
  commune: string;
  phone: string;
  email: string;
  password: string;
  identityDocType: IdentityDocType;
  identityDocNumber: string;
  isActive: boolean;
  categorySlug: string;
  subCategorySlug: string;
}

// Activités par catégorie
const activitiesByCategory: Record<string, { activity: string; subCategory: string }[]> = {
  'musique-dj': [
    { activity: 'DJ Professionnel', subCategory: 'dj' },
    { activity: 'Orchestre Moderne', subCategory: 'orchestre' },
    { activity: 'Groupe Mbalax', subCategory: 'groupe-musical' },
    { activity: 'Chanteur Professionnel', subCategory: 'chanteur-chanteuse' },
    { activity: 'Griot Traditionnel', subCategory: 'griot' },
  ],
  'photographie-video': [
    { activity: 'Photographe de Mariage', subCategory: 'photographe' },
    { activity: 'Vidéaste Événementiel', subCategory: 'videaste' },
    { activity: 'Pilote de Drone', subCategory: 'drone' },
    { activity: 'Photo Booth Professionnel', subCategory: 'photo-booth' },
  ],
  'traiteur-restauration': [
    { activity: 'Traiteur Sénégalais', subCategory: 'traiteur-traditionnel' },
    { activity: 'Traiteur International', subCategory: 'traiteur-moderne' },
    { activity: 'Pâtissier Événementiel', subCategory: 'patisserie' },
    { activity: 'Spécialiste Gâteaux de Mariage', subCategory: 'gateau-mariage' },
  ],
  'decoration-fleurs': [
    { activity: 'Décorateur Événementiel', subCategory: 'decorateur-evenementiel' },
    { activity: 'Fleuriste', subCategory: 'fleuriste' },
    { activity: 'Spécialiste Ballons', subCategory: 'ballons-arches' },
    { activity: 'Location de Mobilier', subCategory: 'location-mobilier' },
  ],
  'location-salles': [
    { activity: 'Gérant de Salle de Réception', subCategory: 'salle-reception' },
    { activity: 'Hôtel Événementiel', subCategory: 'hotel' },
    { activity: 'Restaurant avec Salle', subCategory: 'restaurant-salle' },
    { activity: 'Espace Plein Air', subCategory: 'espace-plein-air' },
  ],
  'animation-spectacle': [
    { activity: 'Maître de Cérémonie', subCategory: 'maitre-ceremonie' },
    { activity: 'Animateur Professionnel', subCategory: 'animateur' },
    { activity: 'Troupe de Danse Traditionnelle', subCategory: 'danseurs-traditionnels' },
  ],
  'beaute-mode': [
    { activity: 'Maquilleur Professionnel', subCategory: 'maquilleur' },
    { activity: 'Coiffeur Styliste', subCategory: 'coiffeur' },
    { activity: 'Styliste Mode', subCategory: 'styliste' },
  ],
  'transport': [
    { activity: 'Location de Véhicules', subCategory: 'location-voiture' },
    { activity: 'Service Limousine', subCategory: 'limousine' },
    { activity: 'Transport Groupe', subCategory: 'bus-minibus' },
  ],
  'sonorisation-eclairage': [
    { activity: 'Location Sonorisation', subCategory: 'location-sono' },
    { activity: 'Éclairagiste Professionnel', subCategory: 'eclairage-professionnel' },
    { activity: 'Location Écran LED', subCategory: 'ecran-led' },
  ],
  'organisation-planning': [
    { activity: 'Wedding Planner', subCategory: 'wedding-planner' },
    { activity: 'Organisateur d\'Événements', subCategory: 'organisateur-evenements' },
  ],
};

export function generateProviders(count: number = 50): ProviderSeedData[] {
  const providers: ProviderSeedData[] = [];
  const usedPhones = new Set<string>();
  const usedEmails = new Set<string>();

  const categoryKeys = Object.keys(activitiesByCategory);

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const location = randomItem(locations);
    const commune = randomItem(location.communes);
    const categorySlug = randomItem(categoryKeys);
    const activityData = randomItem(activitiesByCategory[categorySlug]);

    // Générer un téléphone unique
    let phone = generatePhone();
    while (usedPhones.has(phone)) {
      phone = generatePhone();
    }
    usedPhones.add(phone);

    // Générer un email unique
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}${Math.random().toString(36).slice(2, 5)}@example.com`;
    }
    usedEmails.add(email);

    providers.push({
      firstName,
      lastName,
      companyName: generateCompanyName(activityData.activity),
      activity: activityData.activity,
      department: location.department,
      commune,
      phone,
      email,
      password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Zf8O5zPO5qW5OzH.Hxdgy', // "password123" hashé
      identityDocType: randomItem([IdentityDocType.CNI, IdentityDocType.PASSPORT, IdentityDocType.PERMIT]),
      identityDocNumber: `SN${Math.floor(Math.random() * 900000000) + 100000000}`,
      isActive: Math.random() > 0.1, // 90% actifs
      categorySlug,
      subCategorySlug: activityData.subCategory,
    });
  }

  return providers;
}
