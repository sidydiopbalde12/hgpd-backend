import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Demand } from './entities/demand.entity';
import { DemandProvider } from './entities/demand-provider.entity';
import { Provider } from '../providers/entities/provider.entity';
import { DemandStatus } from '../common/enums';
import {
  CreateDemandDto,
  UpdateDemandDto,
  AssignProviderDto,
  UpdateDemandProviderDto,
} from './dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class DemandsService {
  private readonly logger = new Logger(DemandsService.name);

  constructor(
    @InjectRepository(Demand)
    private readonly demandRepository: Repository<Demand>,
    @InjectRepository(DemandProvider)
    private readonly demandProviderRepository: Repository<DemandProvider>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    private readonly mailService: MailService,
  ) {}

  // Demands CRUD
  async create(dto: CreateDemandDto): Promise<Demand> {
    const { providerIds, ...demandData } = dto;

    // Create and save the demand
    const demand = this.demandRepository.create(demandData);
    const savedDemand = await this.demandRepository.save(demand);

    // If providerIds are provided, assign providers and send notifications
    if (providerIds && providerIds.length > 0) {
      await this.assignMultipleProvidersAndNotify(savedDemand, providerIds);
    }

    // Return demand with relations
    return this.findById(savedDemand.id);
  }

  private async assignMultipleProvidersAndNotify(
    demand: Demand,
    providerIds: string[],
  ): Promise<void> {
    // Fetch all providers
    const providers = await this.providerRepository.find({
      where: { id: In(providerIds) },
    });

    if (providers.length === 0) {
      this.logger.warn(`No valid providers found for IDs: ${providerIds.join(', ')}`);
      return;
    }

    // Create DemandProvider entries for each provider
    const demandProviders = providers.map((provider) =>
      this.demandProviderRepository.create({
        demandId: demand.id,
        providerId: provider.id,
      }),
    );
    await this.demandProviderRepository.save(demandProviders);

    this.logger.log(
      `Assigned ${providers.length} providers to demand ${demand.id}`,
    );

    // Send email notifications to all providers
    const emailResults = await this.mailService.sendDemandNotificationToMultipleProviders(
      providers,
      demand,
    );

    this.logger.log(
      `Email notifications sent - Success: ${emailResults.success.length}, Failed: ${emailResults.failed.length}`,
    );
  }

  async findAll(options?: {
    organizerId?: string;
    status?: DemandStatus;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<Demand[]> {
    const query = this.demandRepository
      .createQueryBuilder('demand')
      .leftJoinAndSelect('demand.organizer', 'organizer')
      .leftJoinAndSelect('demand.demandProviders', 'dp')
      .leftJoinAndSelect('dp.provider', 'provider');

    if (options?.organizerId) {
      query.andWhere('demand.organizerId = :organizerId', {
        organizerId: options.organizerId,
      });
    }

    if (options?.status) {
      query.andWhere('demand.status = :status', { status: options.status });
    }

    if (options?.fromDate) {
      query.andWhere('demand.eventDate >= :fromDate', {
        fromDate: options.fromDate,
      });
    }

    if (options?.toDate) {
      query.andWhere('demand.eventDate <= :toDate', { toDate: options.toDate });
    }

    return query.orderBy('demand.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Demand> {
    const demand = await this.demandRepository.findOne({
      where: { id },
      relations: [
        'organizer',
        'demandProviders',
        'demandProviders.provider',
        'demandProviders.payment',
      ],
    });
    if (!demand) {
      throw new NotFoundException(`Demand with ID ${id} not found`);
    }
    return demand;
  }

  async update(id: string, dto: UpdateDemandDto): Promise<Demand> {
    const demand = await this.findById(id);
    Object.assign(demand, dto);
    return this.demandRepository.save(demand);
  }

  async updateStatus(id: string, status: DemandStatus): Promise<Demand> {
    const demand = await this.findById(id);
    demand.status = status;
    return this.demandRepository.save(demand);
  }

  async remove(id: string): Promise<void> {
    const demand = await this.findById(id);
    await this.demandRepository.remove(demand);
  }

  // DemandProvider operations
  async assignProvider(
    demandId: string,
    dto: AssignProviderDto,
  ): Promise<DemandProvider> {
    await this.findById(demandId);

    const existing = await this.demandProviderRepository.findOne({
      where: { demandId, providerId: dto.providerId },
    });
    if (existing) {
      return existing;
    }

    const dp = this.demandProviderRepository.create({
      demandId,
      providerId: dto.providerId,
    });
    return this.demandProviderRepository.save(dp);
  }

  async findDemandsByProvider(
    providerId: string,
    status?: DemandStatus,
  ): Promise<DemandProvider[]> {
    const query = this.demandProviderRepository
      .createQueryBuilder('dp')
      .leftJoinAndSelect('dp.demand', 'demand')
      .leftJoinAndSelect('demand.organizer', 'organizer')
      .where('dp.providerId = :providerId', { providerId });

    if (status) {
      query.andWhere('dp.status = :status', { status });
    }

    return query.orderBy('demand.createdAt', 'DESC').getMany();
  }

  async getDemandProvider(
    demandId: string,
    providerId: string,
  ): Promise<DemandProvider> {
    const dp = await this.demandProviderRepository.findOne({
      where: { demandId, providerId },
      relations: ['demand', 'provider', 'payment', 'review'],
    });
    if (!dp) {
      throw new NotFoundException(`DemandProvider not found`);
    }
    return dp;
  }

  async getDemandProviderById(id: string): Promise<DemandProvider> {
    const dp = await this.demandProviderRepository.findOne({
      where: { id },
      relations: ['demand', 'demand.organizer', 'provider', 'payment', 'review'],
    });
    if (!dp) {
      throw new NotFoundException(`DemandProvider with ID ${id} not found`);
    }
    return dp;
  }

  async updateDemandProvider(
    id: string,
    dto: UpdateDemandProviderDto,
  ): Promise<DemandProvider> {
    const dp = await this.getDemandProviderById(id);
    Object.assign(dp, dto);
    return this.demandProviderRepository.save(dp);
  }

  async unlockContact(demandProviderId: string): Promise<DemandProvider> {
    const dp = await this.getDemandProviderById(demandProviderId);
    dp.contactUnlockedAt = new Date();
    return this.demandProviderRepository.save(dp);
  }

  async removeProvider(demandId: string, providerId: string): Promise<void> {
    const dp = await this.getDemandProvider(demandId, providerId);
    await this.demandProviderRepository.remove(dp);
  }

  // Stats
  async getProviderStats(providerId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
  }> {
    const total = await this.demandProviderRepository.count({
      where: { providerId },
    });

    const completed = await this.demandProviderRepository.count({
      where: { providerId, convertedToMission: true },
    });

    const pending = await this.demandProviderRepository.count({
      where: { providerId, status: DemandStatus.NEW_REQUEST },
    });

    return { total, completed, pending };
  }
}
