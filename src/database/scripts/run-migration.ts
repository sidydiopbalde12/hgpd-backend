import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

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
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
  synchronize: false, // Ne pas synchroniser automatiquement lors des migrations
});

AppDataSource.initialize()
  .then(async (dataSource) => {
    console.log('📦 Connexion à la base de données établie');

    // Exécuter les migrations en attente
    const migrations = await dataSource.runMigrations();

    if (migrations.length > 0) {
      console.log(
        `✅ ${migrations.length} migration(s) exécutée(s) avec succès:`,
      );
      migrations.forEach((migration) => {
        console.log(`   - ${migration.name}`);
      });
    } else {
      console.log('✅ Aucune migration en attente');
    }

    await dataSource.destroy();
    console.log('🔌 Connexion fermée');
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur lors de l'exécution des migrations:", error);
    process.exit(1);
  });
