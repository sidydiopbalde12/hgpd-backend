import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

// Charger les variables d'environnement AVANT de créer le DataSource
const envFile =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../../.env.production')
    : path.join(__dirname, '../../.env.development');
dotenv.config({ path: envFile });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'hgpd',
  entities: [__dirname + '/../**/**/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
  logging: false,
});

export default AppDataSource;
