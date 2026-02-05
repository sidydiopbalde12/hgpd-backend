import * as crypto from 'crypto';

// Make crypto globally available for TypeORM
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = crypto as any;
}

import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

import databaseConfig from '../../config/database.config';

// Import all entities
import { User } from '../../users/entities/users.entities';
import { Category } from '../../categories/entities/category.entity';
import { SubCategory } from '../../categories/entities/sub-category.entity';
import { Provider } from '../../providers/entities/provider.entity';
import { ProviderPhoto } from '../../providers/entities/provider-photo.entity';
import { ProviderVideo } from '../../providers/entities/provider-video.entity';
import { ProviderCategory } from '../../providers/entities/provider-category.entity';
import { ProviderStats } from '../../providers/entities/provider-stats.entity';
import { Organizer } from '../../organizers/entities/organizer.entity';
import { Demand } from '../../demands/entities/demand.entity';
import { DemandBudget } from '../../demands/entities/demand-budget.entity';
import { DemandProvider } from '../../demands/entities/demand-provider.entity';
import { Review } from '../../reviews/entities/review.entity';
import { SupportRequest } from '../../support/entities/support-request.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Sponsorship } from '../../sponsorships/entities/sponsorship.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('database');
        if (!dbConfig) {
          throw new Error('Database configuration not found');
        }
        return {
          ...dbConfig,
          entities: [
            User,
            Category,
            SubCategory,
            Provider,
            ProviderPhoto,
            ProviderVideo,
            ProviderCategory,
            ProviderStats,
            Organizer,
            Demand,
            DemandBudget,
            DemandProvider,
            Review,
            SupportRequest,
            Payment,
            Subscription,
            Sponsorship,
            Notification,
          ],
        };
      },
    }),
    SeederModule,
  ],
})
class SeedModule {}

async function bootstrap() {
  const args = process.argv.slice(2);
  const shouldClear = args.includes('--clear') || args.includes('-c');
  const shouldFresh = args.includes('--fresh') || args.includes('-f');

  console.log('🌱 HGPD Database Seeder');
  console.log('========================\n');

  try {
    const app = await NestFactory.createApplicationContext(SeedModule);
    const seederService = app.get(SeederService);

    if (shouldFresh || shouldClear) {
      console.log('🗑️  Clearing database...\n');
      await seederService.clear();
    }

    if (!shouldClear || shouldFresh) {
      console.log('🌱 Seeding database...\n');
      await seederService.seed();
    }

    await app.close();

    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

bootstrap();
