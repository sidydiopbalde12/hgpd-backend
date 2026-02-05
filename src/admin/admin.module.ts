import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from '../auth/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../auth/entities/admin.entity';
import { User } from '../users/entities/users.entities';
import { Provider } from '../providers/entities/provider.entity';
import { Demand } from '../demands/entities/demand.entity';
import { ProvidersModule } from '../providers/providers.module';
import { DemandsModule } from '../demands/demands.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { LegalModule } from '../legal/legal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User, Provider, Demand]),
    ProvidersModule,
    DemandsModule,
    ReviewsModule,
    LegalModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
