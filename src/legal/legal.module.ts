import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalService } from './legal.service';
import { LegalController } from './legal.controller';
import { LegalDocument } from './entities/legal-document.entity';
import { LegalAcceptance } from './entities/legal-acceptance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LegalDocument, LegalAcceptance])],
  providers: [LegalService],
  controllers: [LegalController],
  exports: [LegalService],
})
export class LegalModule {}
