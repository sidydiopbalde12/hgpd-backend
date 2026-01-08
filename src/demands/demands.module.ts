import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandsService } from './demands.service';
import { DemandsController } from './demands.controller';
import { Demand } from './entities/demand.entity';
import { DemandProvider } from './entities/demand-provider.entity';
import { Provider } from '../providers/entities/provider.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Demand, DemandProvider, Provider]),
    MailModule,
  ],
  providers: [DemandsService],
  controllers: [DemandsController],
  exports: [DemandsService],
})
export class DemandsModule {}
