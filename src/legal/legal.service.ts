import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalDocument, LegalDocumentType } from './entities/legal-document.entity';
import { LegalAcceptance } from './entities/legal-acceptance.entity';
import {
  CreateLegalDocumentDto,
  UpdateLegalDocumentDto,
  AcceptLegalDocumentDto,
} from './dto';

@Injectable()
export class LegalService {
  constructor(
    @InjectRepository(LegalDocument)
    private readonly legalDocumentRepository: Repository<LegalDocument>,
    @InjectRepository(LegalAcceptance)
    private readonly legalAcceptanceRepository: Repository<LegalAcceptance>,
  ) {}

  // ==================== LEGAL DOCUMENTS CRUD ====================

  async createDocument(dto: CreateLegalDocumentDto): Promise<LegalDocument> {
    // Verifier si une version existe deja pour ce type
    const existing = await this.legalDocumentRepository.findOne({
      where: { type: dto.type, version: dto.version },
    });

    if (existing) {
      throw new ConflictException(
        `Une version ${dto.version} existe deja pour ${dto.type}`,
      );
    }

    const document = this.legalDocumentRepository.create(dto);

    // Si on active ce document, desactiver les autres du meme type
    if (dto.isActive) {
      await this.deactivateOtherDocuments(dto.type);
      document.publishedAt = new Date();
    }

    return this.legalDocumentRepository.save(document);
  }

  async findAllDocuments(type?: LegalDocumentType): Promise<LegalDocument[]> {
    const query = this.legalDocumentRepository
      .createQueryBuilder('doc')
      .orderBy('doc.type', 'ASC')
      .addOrderBy('doc.createdAt', 'DESC');

    if (type) {
      query.where('doc.type = :type', { type });
    }

    return query.getMany();
  }

  async findDocumentById(id: string): Promise<LegalDocument> {
    const document = await this.legalDocumentRepository.findOne({
      where: { id },
      relations: ['acceptances', 'acceptances.provider'],
    });

    if (!document) {
      throw new NotFoundException(`Document avec l'ID ${id} non trouve`);
    }

    return document;
  }

  async findActiveDocument(type: LegalDocumentType): Promise<LegalDocument> {
    const document = await this.legalDocumentRepository.findOne({
      where: { type, isActive: true },
    });

    if (!document) {
      throw new NotFoundException(`Aucun document ${type} actif trouve`);
    }

    return document;
  }

  async updateDocument(
    id: string,
    dto: UpdateLegalDocumentDto,
  ): Promise<LegalDocument> {
    const document = await this.findDocumentById(id);

    // Si on change la version, verifier qu'elle n'existe pas deja
    if (dto.version && dto.version !== document.version) {
      const existing = await this.legalDocumentRepository.findOne({
        where: { type: document.type, version: dto.version },
      });

      if (existing) {
        throw new ConflictException(
          `La version ${dto.version} existe deja pour ${document.type}`,
        );
      }
    }

    // Si on active ce document, desactiver les autres du meme type
    if (dto.isActive && !document.isActive) {
      await this.deactivateOtherDocuments(document.type);
      document.publishedAt = new Date();
    }

    Object.assign(document, dto);
    return this.legalDocumentRepository.save(document);
  }

  async deleteDocument(id: string): Promise<void> {
    const document = await this.findDocumentById(id);

    // Verifier s'il y a des acceptations
    const acceptanceCount = await this.legalAcceptanceRepository.count({
      where: { legalDocumentId: id },
    });

    if (acceptanceCount > 0) {
      throw new BadRequestException(
        `Impossible de supprimer ce document: ${acceptanceCount} prestataire(s) l'ont accepte`,
      );
    }

    await this.legalDocumentRepository.remove(document);
  }

  async activateDocument(id: string): Promise<LegalDocument> {
    const document = await this.findDocumentById(id);

    await this.deactivateOtherDocuments(document.type);

    document.isActive = true;
    document.publishedAt = new Date();

    return this.legalDocumentRepository.save(document);
  }

  private async deactivateOtherDocuments(type: LegalDocumentType): Promise<void> {
    await this.legalDocumentRepository.update(
      { type, isActive: true },
      { isActive: false },
    );
  }

  // ==================== LEGAL ACCEPTANCES ====================

  async acceptDocument(dto: AcceptLegalDocumentDto): Promise<LegalAcceptance> {
    // Verifier que le document existe et est actif
    const document = await this.legalDocumentRepository.findOne({
      where: { id: dto.legalDocumentId },
    });

    if (!document) {
      throw new NotFoundException('Document non trouve');
    }

    if (!document.isActive) {
      throw new BadRequestException('Ce document n\'est plus actif');
    }

    // Verifier si le prestataire a deja accepte ce document
    const existing = await this.legalAcceptanceRepository.findOne({
      where: {
        providerId: dto.providerId,
        legalDocumentId: dto.legalDocumentId,
      },
    });

    if (existing) {
      throw new ConflictException('Ce prestataire a deja accepte ce document');
    }

    const acceptance = this.legalAcceptanceRepository.create(dto);
    return this.legalAcceptanceRepository.save(acceptance);
  }

  async findAcceptancesByDocument(
    legalDocumentId: string,
  ): Promise<LegalAcceptance[]> {
    return this.legalAcceptanceRepository.find({
      where: { legalDocumentId },
      relations: ['provider'],
      order: { acceptedAt: 'DESC' },
    });
  }

  async findAcceptancesByProvider(providerId: string): Promise<LegalAcceptance[]> {
    return this.legalAcceptanceRepository.find({
      where: { providerId },
      relations: ['legalDocument'],
      order: { acceptedAt: 'DESC' },
    });
  }

  async hasProviderAcceptedActiveDocuments(
    providerId: string,
  ): Promise<{ cgu: boolean; cgv: boolean }> {
    const result = { cgu: false, cgv: false };

    // Trouver les documents actifs
    const activeCgu = await this.legalDocumentRepository.findOne({
      where: { type: LegalDocumentType.CGU, isActive: true },
    });

    const activeCgv = await this.legalDocumentRepository.findOne({
      where: { type: LegalDocumentType.CGV, isActive: true },
    });

    // Verifier les acceptations
    if (activeCgu) {
      const cguAcceptance = await this.legalAcceptanceRepository.findOne({
        where: { providerId, legalDocumentId: activeCgu.id },
      });
      result.cgu = !!cguAcceptance;
    }

    if (activeCgv) {
      const cgvAcceptance = await this.legalAcceptanceRepository.findOne({
        where: { providerId, legalDocumentId: activeCgv.id },
      });
      result.cgv = !!cgvAcceptance;
    }

    return result;
  }

  async getAcceptanceStats(legalDocumentId: string): Promise<{
    total: number;
    document: LegalDocument;
  }> {
    const document = await this.findDocumentById(legalDocumentId);
    const total = await this.legalAcceptanceRepository.count({
      where: { legalDocumentId },
    });

    return { total, document };
  }
}
