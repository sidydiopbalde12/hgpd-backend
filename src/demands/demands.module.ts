import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandsService } from './demands.service';
import { DemandsController } from './demands.controller';
import { Demand } from './entities/demand.entity';
import { DemandProvider } from './entities/demand-provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Demand, DemandProvider])],
  providers: [DemandsService],
  controllers: [DemandsController],
  exports: [DemandsService],
})
export class DemandsModule {}
