import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

// Charger les variables d'environnement
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
const envPath = path.join(__dirname, '../../../', envFile);

if (fs.existsSync(envPath)) {
  config({ path: envPath });
} else {
  console.warn(
    `⚠️  Fichier ${envFile} non trouvé, utilisation des valeurs par défaut`,
  );
}

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'hgpd_dev',
  synchronize: false,
  logging: false,
});

// Données de prestataires à ajouter
const PROVIDERS_DATA = [
  // Lieux d'événements
  {
    firstName: 'Moussa',
    lastName: 'Diallo',
    companyName: 'Salle Prestige Events',
    activity: 'Location de salles',
    phone: '+221771234501',
    email: 'moussa.diallo@salleprestige.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      'Magnifique salle climatisée de 500 places avec parking gratuit',
    categoryNames: ["Lieux d'événements"],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456789',
  },
  {
    firstName: 'Ami',
    lastName: 'Ndiaye',
    companyName: 'Villa Océan Paradis',
    activity: 'Location de villa',
    phone: '+221771234502',
    email: 'ami.ndiaye@villaocean.sn',
    department: 'Thiès',
    commune: 'Mbour',
    shortDescription:
      "Villa luxueuse avec vue sur l'océan, capacité 300 personnes",
    categoryNames: ["Lieux d'événements"],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456790',
  },
  {
    firstName: 'Fatima',
    lastName: 'Ba',
    companyName: 'Restaurant Le Palais',
    activity: 'Restaurant événementiel',
    phone: '+221771234503',
    email: 'fatima.ba@lepalais.sn',
    department: 'Dakar',
    commune: 'Plateau',
    shortDescription:
      'Restaurant avec salle privée pour événements, cuisine variée',
    categoryNames: ["Lieux d'événements"],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456791',
  },

  // Matériel
  {
    firstName: 'Ibrahim',
    lastName: 'Sall',
    companyName: 'ProSound Solutions',
    activity: 'Sonorisation et éclairage',
    phone: '+221771234504',
    email: 'ibrahim.sall@prosound.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      "Équipement audio haute qualité pour tous types d'événements",
    categoryNames: ['Matériel'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456792',
  },
  {
    firstName: 'Sophie',
    lastName: 'Gueye',
    companyName: 'Photo & Video Pro',
    activity: 'Photographe et vidéaste',
    phone: '+221771234505',
    email: 'sophie.gueye@photovideo.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      'Couverture photo et vidéo professionnelle pour mariages et événements',
    categoryNames: ['Matériel'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456793',
  },
  {
    firstName: 'Moustapha',
    lastName: 'Ly',
    companyName: 'Location Équipements PRO',
    activity: 'Location de matériel',
    phone: '+221771234506',
    email: 'moustapha.ly@locationpro.sn',
    department: 'Thiès',
    commune: 'Mbour',
    shortDescription:
      'Chaises, tables, tonnelles et équipements divers pour événements',
    categoryNames: ['Matériel'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456794',
  },

  // Traiteur
  {
    firstName: 'Oumou',
    lastName: 'Sarr',
    companyName: 'Délices Sénégalaises',
    activity: 'Cuisine sénégalaise',
    phone: '+221771234507',
    email: 'oumou.sarr@delicessenegalaises.sn',
    department: 'Kaolack',
    commune: 'Kaolack',
    shortDescription:
      'Thieboudienne, mafé, yassa - plats authentiques sénégalais',
    categoryNames: ['Traiteur'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456795',
  },
  {
    firstName: 'Jean',
    lastName: 'Diallo',
    companyName: 'Saveurs Internationales',
    activity: 'Cuisine du monde',
    phone: '+221771234508',
    email: 'jean.diallo@saveurs.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      'Cuisine italienne, française, asiatique pour vos événements',
    categoryNames: ['Traiteur'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456796',
  },
  {
    firstName: 'Awa',
    lastName: 'Koné',
    companyName: 'Gâteaux & Sucreries',
    activity: 'Pâtissier',
    phone: '+221771234509',
    email: 'awa.kone@gateaux.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      'Gâteaux personnalisés, cupcakes, macarons pour toutes les occasions',
    categoryNames: ['Traiteur'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456797',
  },
  {
    firstName: 'Aliou',
    lastName: 'Sow',
    companyName: 'Food Truck Deluxe',
    activity: 'Food truck',
    phone: '+221771234510',
    email: 'aliou.sow@foodtruck.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      'Burgers gourmet, hot-dogs, frites maison servis en food truck',
    categoryNames: ['Traiteur'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456798',
  },

  // Décoration
  {
    firstName: 'Aïssatou',
    lastName: 'Ndiaye',
    companyName: 'Décor Events Prestige',
    activity: "Décorateur d'événements",
    phone: '+221771234511',
    email: 'aissatou.ndiaye@decorevents.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      'Décoration de salle, scénographie, créations florales sur mesure',
    categoryNames: ['Décoration'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456799',
  },
  {
    firstName: 'Coumba',
    lastName: 'Dia',
    companyName: 'Fleurs de Rêve',
    activity: 'Fleuriste décorateur',
    phone: '+221771234512',
    email: 'coumba.dia@fleursreve.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      "Bouquets, compositions florales et décoration florale d'exception",
    categoryNames: ['Décoration'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456800',
  },
  {
    firstName: 'Khadi',
    lastName: 'Sene',
    companyName: 'Mobiliers Prestige',
    activity: 'Location de mobilier personnalisé',
    phone: '+221771234513',
    email: 'khadi.sene@mobiliersprestige.sn',
    department: 'Thiès',
    commune: 'Mbour',
    shortDescription:
      'Mobiliers et objets décorés personnalisés pour événements',
    categoryNames: ['Décoration'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456801',
  },

  // Transports
  {
    firstName: 'Pape',
    lastName: 'Diouf',
    companyName: 'Taxis Prestige',
    activity: 'Service de taxi',
    phone: '+221771234514',
    email: 'pape.diouf@taxisprestige.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      'Transport de passagers avec chauffeur professionnel et courtois',
    categoryNames: ['Transports'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456802',
  },
  {
    firstName: 'Ousmane',
    lastName: 'Gueye',
    companyName: 'Voitures Prestige VIP',
    activity: 'Location voiture prestige',
    phone: '+221771234515',
    email: 'ousmane.gueye@voiturespretige.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription: 'Mercedes, BMW, Audi avec chauffeur pour événements VIP',
    categoryNames: ['Transports'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456803',
  },
  {
    firstName: 'Mariatou',
    lastName: 'Ba',
    companyName: 'Bus Events',
    activity: 'Location de bus',
    phone: '+221771234516',
    email: 'mariatou.ba@busevents.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      "Bus climatisé, sièges confortables pour groupes d'invités",
    categoryNames: ['Transports'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456804',
  },

  // Personnels
  {
    firstName: 'Salif',
    lastName: 'Ndiaye',
    companyName: 'Serveurs & Staff Pro',
    activity: 'Personnel événementiel',
    phone: '+221771234517',
    email: 'salif.ndiaye@staffpro.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription: 'Serveurs, barmen, cuisiniers pour votre événement',
    categoryNames: ['Personnels'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456805',
  },
  {
    firstName: 'Néné',
    lastName: 'Diop',
    companyName: 'Chef Cuisinier Privé',
    activity: 'Chef cuisinier',
    phone: '+221771234518',
    email: 'nene.diop@chefprive.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      "Chef privé spécialisé en gastronomie pour vos dîners d'exception",
    categoryNames: ['Personnels'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456806',
  },

  // Pour Elle
  {
    firstName: 'Khadija',
    lastName: 'Sall',
    companyName: 'Beauté & Coiffure Prestige',
    activity: 'Coiffeuse maquilleur',
    phone: '+221771234519',
    email: 'khadija.sall@beautecoiffure.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription: 'Coiffure et maquillage pour mariées et événements',
    categoryNames: ['Pour Elle'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456807',
  },
  {
    firstName: 'Hawa',
    lastName: 'Sow',
    companyName: 'Mode & Couture Premium',
    activity: 'Couturière',
    phone: '+221771234520',
    email: 'hawa.sow@modecouture.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      "Confection et retouches de robes pour tous types d'événements",
    categoryNames: ['Pour Elle'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456808',
  },

  // Animation
  {
    firstName: 'Djibril',
    lastName: 'Sene',
    companyName: 'Groupe Musical Sensation',
    activity: 'Musicien',
    phone: '+221771234521',
    email: 'djibril.sene@groupmusic.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      'Groupe de musique live pour mariages, baptêmes et événements',
    categoryNames: ['Animation'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456809',
  },
  {
    firstName: 'Talla',
    lastName: 'Ba',
    companyName: 'DJ Events Master',
    activity: 'DJ',
    phone: '+221771234522',
    email: 'talla.ba@djevents.sn',
    department: 'Dakar',
    commune: 'Dakar',
    shortDescription:
      'DJ professionnel avec équipement haute qualité pour animation',
    categoryNames: ['Animation'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456810',
  },
  {
    firstName: 'Youssouf',
    lastName: 'Diallo',
    companyName: 'Animateurs & Spectacles',
    activity: 'Animateur',
    phone: '+221771234523',
    email: 'youssouf.diallo@animateurs.sn',
    department: 'Thiès',
    commune: 'Mbour',
    shortDescription:
      'Animations variées, jeux, spectacles pour enfants et adultes',
    categoryNames: ['Animation'],
    identityDocType: 'PASSPORT',
    identityDocNumber: 'SN123456811',
  },
];

async function main() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Connexion à la base de données établie');

    // Étape 1: Récupérer les 8 catégories correctes
    console.log('\n📋 Étape 1: Récupération des catégories valides...');
    const categories = await AppDataSource.query(
      'SELECT id, name FROM categories WHERE id BETWEEN 198 AND 205 ORDER BY id',
    );
    console.log(`  ✓ ${categories.length} catégories trouvées`);

    // Créer un mapping nom -> id
    const categoryMap = new Map(categories.map((c) => [c.name, c.id]));
    console.log('  Catégories:', Array.from(categoryMap.keys()).join(', '));

    // Étape 2: Créer les prestataires
    console.log('\n📋 Étape 2: Création des prestataires...');

    let createdCount = 0;
    for (const providerData of PROVIDERS_DATA) {
      const {
        categoryNames,
        identityDocType: docTypeStr,
        ...providerFields
      } = providerData;

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash('Provider@123', 10);
      const providerId = randomUUID();
      const now = new Date();

      // Insérer le prestataire via requête SQL
      await AppDataSource.query(
        `INSERT INTO providers (
          id, first_name, last_name, company_name, activity, 
          department, commune, phone, email,
          password, identity_doc_type, identity_doc_number,
          email_verified_at, phone_verified_at, is_active,
          show_phone_number, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          providerId,
          providerFields.firstName,
          providerFields.lastName,
          providerFields.companyName,
          providerFields.activity,
          providerFields.department,
          providerFields.commune,
          providerFields.phone,
          providerFields.email,
          hashedPassword,
          docTypeStr.toLowerCase(),
          providerFields.identityDocNumber,
          now,
          now,
          true,
          false,
          now,
          now,
        ],
      );

      createdCount++;

      // Ajouter les catégories du prestataire
      for (const categoryName of categoryNames) {
        const categoryId = categoryMap.get(categoryName);
        if (categoryId) {
          await AppDataSource.query(
            `INSERT INTO provider_categories (
              provider_id, category_id, sub_category_id, created_at
            ) VALUES ($1, $2, $3, $4)`,
            [providerId, categoryId, null, now],
          );
        }
      }

      console.log(`  ✓ ${providerFields.companyName} créé`);
    }

    console.log(`\n✅ ${createdCount} prestataires créés avec succès`);

    // Étape 4: Vérification
    console.log('\n📋 Étape 4: Vérification des données...');
    const categoriesCount = await AppDataSource.query(
      'SELECT COUNT(*) FROM categories',
    );
    const providersCount = await AppDataSource.query(
      'SELECT COUNT(*) FROM providers',
    );
    const providerCategoriesCount = await AppDataSource.query(
      'SELECT COUNT(*) FROM provider_categories',
    );

    console.log(`  ✓ Catégories totales: ${categoriesCount[0].count}`);
    console.log(`  ✓ Prestataires créés: ${providersCount[0].count}`);
    console.log(
      `  ✓ Liaisons prestataire-catégorie: ${providerCategoriesCount[0].count}`,
    );

    console.log(
      '\n🎉 Nettoyage et alimentation des prestataires complétés avec succès!',
    );
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
