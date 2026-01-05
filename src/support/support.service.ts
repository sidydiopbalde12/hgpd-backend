import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportRequest } from './entities/support-request.entity';
import { SupportStatus } from '../common/enums';
import { CreateSupportRequestDto, UpdateSupportRequestDto } from './dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportRequest)
    private readonly supportRepository: Repository<SupportRequest>,
  ) {}

  async create(dto: CreateSupportRequestDto): Promise<SupportRequest> {
    const request = this.supportRepository.create(dto);
    return this.supportRepository.save(request);
  }

  async findAll(options?: {
    providerId?: string;
    status?: SupportStatus;
  }): Promise<SupportRequest[]> {
    const query = this.supportRepository
      .createQueryBuilder('support')
      .leftJoinAndSelect('support.provider', 'provider');

    if (options?.providerId) {
      query.andWhere('support.providerId = :providerId', {
        providerId: options.providerId,
      });
    }

    if (options?.status) {
      query.andWhere('support.status = :status', { status: options.status });
    }

    return query.orderBy('support.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<SupportRequest> {
    const request = await this.supportRepository.findOne({
      where: { id },
      relations: ['provider'],
    });
    if (!request) {
      throw new NotFoundException(`Support request with ID ${id} not found`);
    }
    return request;
  }

  async findByProvider(providerId: string): Promise<SupportRequest[]> {
    return this.supportRepository.find({
      where: { providerId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    dto: UpdateSupportRequestDto,
  ): Promise<SupportRequest> {
    const request = await this.findById(id);

    if (dto.status === SupportStatus.RESOLVED && !request.resolvedAt) {
      request.resolvedAt = new Date();
    }

    Object.assign(request, dto);
    return this.supportRepository.save(request);
  }

  async resolve(id: string): Promise<SupportRequest> {
    const request = await this.findById(id);
    request.status = SupportStatus.RESOLVED;
    request.resolvedAt = new Date();
    return this.supportRepository.save(request);
  }

  async close(id: string): Promise<SupportRequest> {
    const request = await this.findById(id);
    request.status = SupportStatus.CLOSED;
    return this.supportRepository.save(request);
  }

  async remove(id: string): Promise<void> {
    const request = await this.findById(id);
    await this.supportRepository.remove(request);
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  }> {
    const total = await this.supportRepository.count();
    const pending = await this.supportRepository.count({
      where: { status: SupportStatus.PENDING },
    });
    const inProgress = await this.supportRepository.count({
      where: { status: SupportStatus.IN_PROGRESS },
    });
    const resolved = await this.supportRepository.count({
      where: { status: SupportStatus.RESOLVED },
    });

    return { total, pending, inProgress, resolved };
  }
}
