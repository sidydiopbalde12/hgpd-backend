import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsorship } from './entities/sponsorship.entity';
import { CreateSponsorshipDto, UpdateSponsorshipDto } from './dto';
import { SponsorshipStatus } from '../common/enums';

@Injectable()
export class SponsorshipsService {
  constructor(
    @InjectRepository(Sponsorship)
    private readonly sponsorshipRepository: Repository<Sponsorship>,
  ) {}

  async create(dto: CreateSponsorshipDto): Promise<Sponsorship> {
    const sponsorship = this.sponsorshipRepository.create(dto);
    return this.sponsorshipRepository.save(sponsorship);
  }

  async findAll(
    providerId?: string,
    categoryId?: number,
  ): Promise<Sponsorship[]> {
    const query = this.sponsorshipRepository
      .createQueryBuilder('sponsorship')
      .leftJoinAndSelect('sponsorship.provider', 'provider')
      .leftJoinAndSelect('sponsorship.category', 'category');

    if (providerId) {
      query.andWhere('sponsorship.providerId = :providerId', { providerId });
    }

    if (categoryId) {
      query.andWhere('sponsorship.categoryId = :categoryId', { categoryId });
    }

    return query.orderBy('sponsorship.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Sponsorship> {
    const sponsorship = await this.sponsorshipRepository.findOne({
      where: { id },
      relations: ['provider', 'category'],
    });
    if (!sponsorship) {
      throw new NotFoundException(`Sponsorship with ID ${id} not found`);
    }
    return sponsorship;
  }

  async findActiveByCategory(categoryId: number): Promise<Sponsorship[]> {
    return this.sponsorshipRepository.find({
      where: {
        categoryId,
        status: SponsorshipStatus.ACTIVE,
      },
      relations: ['provider', 'category'],
      order: { budget: 'DESC' },
    });
  }

  async findActiveByProvider(providerId: string): Promise<Sponsorship[]> {
    return this.sponsorshipRepository.find({
      where: {
        providerId,
        status: SponsorshipStatus.ACTIVE,
      },
      relations: ['provider', 'category'],
    });
  }

  async update(id: string, dto: UpdateSponsorshipDto): Promise<Sponsorship> {
    const sponsorship = await this.findOne(id);
    Object.assign(sponsorship, dto);
    return this.sponsorshipRepository.save(sponsorship);
  }

  async pause(id: string): Promise<Sponsorship> {
    const sponsorship = await this.findOne(id);
    sponsorship.status = SponsorshipStatus.PAUSED;
    return this.sponsorshipRepository.save(sponsorship);
  }

  async resume(id: string): Promise<Sponsorship> {
    const sponsorship = await this.findOne(id);
    sponsorship.status = SponsorshipStatus.ACTIVE;
    return this.sponsorshipRepository.save(sponsorship);
  }

  async remove(id: string): Promise<void> {
    const sponsorship = await this.findOne(id);
    await this.sponsorshipRepository.remove(sponsorship);
  }

  async checkExpiredSponsorships(): Promise<void> {
    const today = new Date();
    await this.sponsorshipRepository
      .createQueryBuilder()
      .update(Sponsorship)
      .set({ status: SponsorshipStatus.EXPIRED })
      .where('status = :status', { status: SponsorshipStatus.ACTIVE })
      .andWhere('endDate < :today', { today })
      .execute();
  }
}
