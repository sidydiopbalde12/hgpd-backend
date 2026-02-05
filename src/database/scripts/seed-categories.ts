import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { Category } from '../../categories/entities/category.entity';
import { SubCategory } from '../../categories/entities/sub-category.entity';

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

const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/'/g, '-') // Remplace les apostrophes par des tirets
    .replace(/[^\w\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .trim();
};

const CATEGORIES_DATA = [
  {
    name: "Lieux d'événements",
    description: 'Trouvez le lieu parfait pour votre événement',
    icon: 'MapPin',
    displayOrder: 1,
    subCategories: [
      { name: 'Tout', isDefault: true, displayOrder: 0 },
      { name: "Salle d'événements", isDefault: false, displayOrder: 1 },
      { name: 'Restaurant', isDefault: false, displayOrder: 2 },
      { name: 'Hotel', isDefault: false, displayOrder: 3 },
      { name: 'Auberge', isDefault: false, displayOrder: 4 },
      { name: 'Villa', isDefault: false, displayOrder: 5 },
      { name: 'Plage', isDefault: false, displayOrder: 6 },
    ],
  },
  {
    name: 'Matériel',
    description: 'Équipement et matériel pour vos événements',
    icon: 'Zap',
    displayOrder: 2,
    subCategories: [
      { name: 'Tout', isDefault: true, displayOrder: 0 },
      { name: 'Photos & Vidéos', isDefault: false, displayOrder: 1 },
      { name: 'Musique et Sonorisation', isDefault: false, displayOrder: 2 },
      { name: 'Eclairage', isDefault: false, displayOrder: 3 },
      { name: 'Chaise', isDefault: false, displayOrder: 4 },
      { name: 'Bâches & tonnelles', isDefault: false, displayOrder: 5 },
    ],
  },
  {
    name: 'Traiteur',
    description: 'Services de restauration et catering',
    icon: 'UtensilsCrossed',
    displayOrder: 3,
    subCategories: [
      { name: 'Tout', isDefault: true, displayOrder: 0 },
      { name: 'Cuisine du monde', isDefault: false, displayOrder: 1 },
      { name: 'Apéro et cocktail', isDefault: false, displayOrder: 2 },
      { name: 'Cuisine Sénégalaise', isDefault: false, displayOrder: 3 },
      { name: 'Gâteaux et sucrées', isDefault: false, displayOrder: 4 },
      { name: 'Fast Food', isDefault: false, displayOrder: 5 },
      { name: 'Stands et Food truck', isDefault: false, displayOrder: 6 },
    ],
  },
  {
    name: 'Décoration',
    description: 'Services de décoration pour vos événements',
    icon: 'Sparkles',
    displayOrder: 4,
    subCategories: [
      { name: 'Tout', isDefault: true, displayOrder: 0 },
      { name: 'Décoration de salle', isDefault: false, displayOrder: 1 },
      {
        name: 'Scénographie événementielle',
        isDefault: false,
        displayOrder: 2,
      },
      { name: 'Décoration Florale', isDefault: false, displayOrder: 3 },
      { name: 'Décoration de table', isDefault: false, displayOrder: 4 },
      { name: 'Décoration extérieur', isDefault: false, displayOrder: 5 },
      { name: 'Décoration de fonds', isDefault: false, displayOrder: 6 },
      {
        name: 'Objets et mobiliers personnalisés',
        isDefault: false,
        displayOrder: 7,
      },
    ],
  },
  {
    name: 'Transports',
    description: 'Services de transport et véhicules',
    icon: 'Car',
    displayOrder: 5,
    subCategories: [
      { name: 'Tout', isDefault: true, displayOrder: 0 },
      { name: 'Voiture', isDefault: false, displayOrder: 1 },
      { name: 'Voiture Prestige', isDefault: false, displayOrder: 2 },
      { name: 'Bus', isDefault: false, displayOrder: 3 },
      { name: 'Chauffeurs privés', isDefault: false, displayOrder: 4 },
    ],
  },
  {
    name: 'Personnels',
    description: 'Personnel spécialisé pour votre événement',
    icon: 'Users',
    displayOrder: 6,
    subCategories: [
      { name: 'Tout', isDefault: true, displayOrder: 0 },
      { name: 'Serveurs', isDefault: false, displayOrder: 1 },
      { name: 'Cuisiniers', isDefault: false, displayOrder: 2 },
      { name: 'Animateurs', isDefault: false, displayOrder: 3 },
    ],
  },
  {
    name: 'Pour Elle',
    description: 'Services de beauté et bien-être',
    icon: 'Heart',
    displayOrder: 7,
    subCategories: [
      { name: 'Tout', isDefault: true, displayOrder: 0 },
      { name: 'Coiffure', isDefault: false, displayOrder: 1 },
      { name: 'Maquillage', isDefault: false, displayOrder: 2 },
      { name: 'Massage & Spa', isDefault: false, displayOrder: 3 },
      { name: 'Vêtements & Accessoires', isDefault: false, displayOrder: 4 },
    ],
  },
  {
    name: 'Animation',
    description: "Services d'animation et divertissement",
    icon: 'Music',
    displayOrder: 8,
    subCategories: [
      { name: 'Tout', isDefault: true, displayOrder: 0 },
      { name: 'DJ & Sonorisation', isDefault: false, displayOrder: 1 },
      { name: 'Musiciens & Chanteurs', isDefault: false, displayOrder: 2 },
      { name: 'Jeux & Divertissement', isDefault: false, displayOrder: 3 },
    ],
  },
];

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
  synchronize: false,
});

async function seedCategories() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Connexion à la base de données établie');

    // Vérifier et ajouter les colonnes manquantes
    const queryRunner = AppDataSource.createQueryRunner();

    try {
      // Ajouter display_order à sub_categories s'il n'existe pas
      await queryRunner.query(`
        ALTER TABLE sub_categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0
      `);
      console.log('✅ Colonne display_order ajoutée (ou déjà existante)');
    } catch (e) {
      console.log('⏭️  Colonne display_order déjà existante');
    }

    try {
      // Ajouter isActive à sub_categories s'il n'existe pas
      await queryRunner.query(`
        ALTER TABLE sub_categories ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true
      `);
      console.log('✅ Colonne isActive ajoutée (ou déjà existante)');
    } catch (e) {
      console.log('⏭️  Colonne isActive déjà existante');
    }

    try {
      // Ajouter isDefault à sub_categories s'il n'existe pas
      await queryRunner.query(`
        ALTER TABLE sub_categories ADD COLUMN IF NOT EXISTS "isDefault" BOOLEAN DEFAULT false
      `);
      console.log('✅ Colonne isDefault ajoutée (ou déjà existante)');
    } catch (e) {
      console.log('⏭️  Colonne isDefault déjà existante');
    }

    const categoryRepo = AppDataSource.getRepository(Category);
    const subCategoryRepo = AppDataSource.getRepository(SubCategory);

    console.log('\n🌱 Début du seeding des catégories...\n');

    let totalCreated = 0;

    for (const catData of CATEGORIES_DATA) {
      // Vérifier si la catégorie existe (par name ou slug)
      const slug = toSlug(catData.name);
      const existingCategory = await categoryRepo
        .createQueryBuilder('category')
        .where('category.name = :name', { name: catData.name })
        .orWhere('category.slug = :slug', { slug })
        .getOne();

      let category = existingCategory;

      if (!category) {
        category = categoryRepo.create({
          name: catData.name,
          slug: slug,
          description: catData.description,
          icon: catData.icon,
          displayOrder: catData.displayOrder,
          isActive: true,
        });
        await categoryRepo.save(category);
        console.log(`✅ Catégorie créée: "${catData.name}"`);
      } else {
        // Mettre à jour le slug si nécessaire
        if (category.slug !== slug) {
          category.slug = slug;
          await categoryRepo.save(category);
          console.log(
            `🔄 Slug mis à jour pour "${catData.name}": ${category.slug}`,
          );
        } else {
          console.log(`⏭️  Catégorie existante: "${catData.name}"`);
        }
      }

      // Créer les sous-catégories
      for (const subCatData of catData.subCategories) {
        const subSlug = toSlug(subCatData.name);
        const existingSub = await subCategoryRepo
          .createQueryBuilder('sub')
          .where('sub.categoryId = :categoryId', { categoryId: category.id })
          .andWhere('sub.slug = :slug', { slug: subSlug })
          .getOne();

        if (!existingSub) {
          const subCategory = subCategoryRepo.create({
            category: category,
            categoryId: category.id,
            name: subCatData.name,
            slug: subSlug,
            displayOrder: subCatData.displayOrder,
            isDefault: subCatData.isDefault,
            isActive: true,
          });
          await subCategoryRepo.save(subCategory);
          totalCreated++;
        }
      }
    }

    console.log(`\n✅ Seeding terminé!`);
    console.log(`   - ${CATEGORIES_DATA.length} catégories`);
    console.log(`   - ${totalCreated} sous-catégories créées`);

    await AppDataSource.destroy();
    console.log('🔌 Connexion fermée');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  }
}

seedCategories();
