import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { LegalService } from './legal.service';
import { LegalDocumentType } from './entities/legal-document.entity';
import {
  CreateLegalDocumentDto,
  UpdateLegalDocumentDto,
  AcceptLegalDocumentDto,
} from './dto';

@Controller('legal')
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  // ==================== DOCUMENTS ENDPOINTS ====================

  @Post('documents')
  createDocument(@Body() dto: CreateLegalDocumentDto) {
    return this.legalService.createDocument(dto);
  }

  @Get('documents')
  findAllDocuments(@Query('type') type?: LegalDocumentType) {
    return this.legalService.findAllDocuments(type);
  }

  @Get('documents/active/:type')
  findActiveDocument(@Param('type') type: LegalDocumentType) {
    return this.legalService.findActiveDocument(type);
  }

  @Get('documents/:id')
  findDocumentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.legalService.findDocumentById(id);
  }

  @Put('documents/:id')
  updateDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLegalDocumentDto,
  ) {
    return this.legalService.updateDocument(id, dto);
  }

  @Patch('documents/:id/activate')
  activateDocument(@Param('id', ParseUUIDPipe) id: string) {
    return this.legalService.activateDocument(id);
  }

  @Delete('documents/:id')
  deleteDocument(@Param('id', ParseUUIDPipe) id: string) {
    return this.legalService.deleteDocument(id);
  }

  // ==================== ACCEPTANCES ENDPOINTS ====================

  @Post('acceptances')
  acceptDocument(@Body() dto: AcceptLegalDocumentDto, @Req() req: Request) {
    // Enrichir avec les informations de la requete
    const enrichedDto: AcceptLegalDocumentDto = {
      ...dto,
      ipAddress: dto.ipAddress || req.ip || req.socket.remoteAddress,
      userAgent: dto.userAgent || req.headers['user-agent'],
    };

    return this.legalService.acceptDocument(enrichedDto);
  }

  @Get('acceptances/document/:documentId')
  findAcceptancesByDocument(
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ) {
    return this.legalService.findAcceptancesByDocument(documentId);
  }

  @Get('acceptances/provider/:providerId')
  findAcceptancesByProvider(
    @Param('providerId', ParseUUIDPipe) providerId: string,
  ) {
    return this.legalService.findAcceptancesByProvider(providerId);
  }

  @Get('acceptances/provider/:providerId/status')
  checkProviderAcceptanceStatus(
    @Param('providerId', ParseUUIDPipe) providerId: string,
  ) {
    return this.legalService.hasProviderAcceptedActiveDocuments(providerId);
  }

  @Get('acceptances/stats/:documentId')
  getAcceptanceStats(@Param('documentId', ParseUUIDPipe) documentId: string) {
    return this.legalService.getAcceptanceStats(documentId);
  }
}
