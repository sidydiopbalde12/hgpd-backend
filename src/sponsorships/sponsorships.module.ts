import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorshipsService } from './sponsorships.service';
import { SponsorshipsController } from './sponsorships.controller';
import { Sponsorship } from './entities/sponsorship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sponsorship])],
  providers: [SponsorshipsService],
  controllers: [SponsorshipsController],
  exports: [SponsorshipsService],
})
export class SponsorshipsModule {}
