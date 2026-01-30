import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Demand } from './entities/demand.entity';
import { DemandProvider } from './entities/demand-provider.entity';
import { DemandBudget } from './entities/demand-budget.entity';
import { Provider } from '../providers/entities/provider.entity';
import { Organizer } from '../organizers/entities/organizer.entity';
import { ProviderCategory } from '../providers/entities/provider-category.entity';
import { DemandStatus } from '../common/enums';
import {
  CreateDemandDto,
  UpdateDemandDto,
  AssignProviderDto,
  UpdateDemandProviderDto,
} from './dto';
import { MailService } from '../mail/mail.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

const MAX_PROVIDERS_PER_DEMAND = 5;

@Injectable()
export class DemandsService {
  private readonly logger = new Logger(DemandsService.name);

  constructor(
    @InjectRepository(Demand)
    private readonly demandRepository: Repository<Demand>,
    @InjectRepository(DemandProvider)
    private readonly demandProviderRepository: Repository<DemandProvider>,
    @InjectRepository(DemandBudget)
    private readonly demandBudgetRepository: Repository<DemandBudget>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(Organizer)
    private readonly organizerRepository: Repository<Organizer>,
    @InjectRepository(ProviderCategory)
    private readonly providerCategoryRepository: Repository<ProviderCategory>,
    private readonly mailService: MailService,
    private readonly whatsAppService: WhatsAppService,
  ) {}

  // Demands CRUD
  async create(dto: CreateDemandDto): Promise<Demand> {
    const { providerIds, categoryBudgets, ...demandData } = dto;

    // Valider les prestataires si fournis
    if (providerIds && providerIds.length > 0) {
      await this.validateProvidersHaveBudget(providerIds, categoryBudgets);
    }

    const demand = this.demandRepository.create(demandData);
    const savedDemand = await this.demandRepository.save(demand);

    // Sauvegarder les budgets par catégorie
    await this.saveCategoryBudgets(savedDemand.id, categoryBudgets);

    // Récupérer les budgets sauvegardés avec les relations (catégories)
    const savedBudgets = await this.demandBudgetRepository.find({
      where: { demandId: savedDemand.id },
      relations: ['category'],
    });

    // Récupérer l'organisateur pour les notifications
    const organizer = await this.organizerRepository.findOne({
      where: { id: savedDemand.organizerId },
    });

    // Envoyer email de confirmation à l'organisateur
    if (organizer) {
      await this.mailService.sendDemandConfirmationToOrganizer(organizer, savedDemand, savedBudgets);
    }

    if (providerIds && providerIds.length > 0) {
      await this.assignMultipleProvidersAndNotify(savedDemand, providerIds, organizer, savedBudgets);
    } else {
      // Envoyer les notifications admin meme si aucun prestataire n'est assigne
      if (organizer) {
        await this.mailService.sendDemandNotificationToAdmin(savedDemand, organizer, [], savedBudgets);
        await this.whatsAppService.sendDemandNotificationToAdmin(savedDemand, organizer, []);
      }
    }

    return this.findById(savedDemand.id);
  }

  private async assignMultipleProvidersAndNotify(
    demand: Demand,
    providerIds: string[],
    organizer: Organizer | null,
    demandBudgets?: DemandBudget[],
  ): Promise<void> {
    const providers = await this.providerRepository.find({
      where: { id: In(providerIds) },
    });

    if (providers.length === 0) {
      this.logger.warn(`No valid providers found for IDs: ${providerIds.join(', ')}`);
      // Envoyer les notifications admin meme sans prestataires
      if (organizer) {
        await this.mailService.sendDemandNotificationToAdmin(demand, organizer, [], demandBudgets);
        await this.whatsAppService.sendDemandNotificationToAdmin(demand, organizer, []);
      }
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

    // Récupérer les catégories de tous les prestataires pour le mail
    const providerCategories = await this.providerCategoryRepository.find({
      where: { providerId: In(providerIds) },
    });

    // Créer une map providerId -> categoryIds[]
    const providerCategoriesMap = new Map<string, number[]>();
    for (const pc of providerCategories) {
      if (!providerCategoriesMap.has(pc.providerId)) {
        providerCategoriesMap.set(pc.providerId, []);
      }
      providerCategoriesMap.get(pc.providerId)!.push(pc.categoryId);
    }

    // Send email notifications to all providers
    const emailResults = await this.mailService.sendDemandNotificationToMultipleProviders(
      providers,
      demand,
      demandBudgets,
      providerCategoriesMap,
    );

    this.logger.log(
      `Email notifications sent - Success: ${emailResults.success.length}, Failed: ${emailResults.failed.length}`,
    );

    // Send WhatsApp notifications to all providers
    const whatsAppResults = await this.whatsAppService.sendDemandNotificationToMultipleProviders(
      providers,
      demand,
    );

    this.logger.log(
      `WhatsApp notifications sent - Success: ${whatsAppResults.success.length}, Failed: ${whatsAppResults.failed.length}`,
    );

    // Send admin notifications (email + WhatsApp) with all details
    if (organizer) {
      await this.mailService.sendDemandNotificationToAdmin(demand, organizer, providers, demandBudgets);
      await this.whatsAppService.sendDemandNotificationToAdmin(demand, organizer, providers);
    }
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
        'demandBudgets',
        'demandBudgets.category',
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
    const demand = await this.findById(demandId);

    // Vérifier la limite de prestataires
    const currentProviderCount = await this.demandProviderRepository.count({
      where: { demandId },
    });

    if (currentProviderCount >= MAX_PROVIDERS_PER_DEMAND) {
      throw new BadRequestException(
        `Cette demande a déjà atteint la limite de ${MAX_PROVIDERS_PER_DEMAND} prestataires`,
      );
    }

    const existing = await this.demandProviderRepository.findOne({
      where: { demandId, providerId: dto.providerId },
    });
    if (existing) {
      return existing;
    }

    // Vérifier que le prestataire a un budget correspondant à sa catégorie
    await this.validateProviderHasBudgetForDemand(dto.providerId, demandId);

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
    const previousStatus = dp.status;

    Object.assign(dp, dto);
    const savedDp = await this.demandProviderRepository.save(dp);

    // Envoyer email au prestataire si statut passe a MISSION_CONFIRMED
    if (
      dto.status === DemandStatus.MISSION_CONFIRMED &&
      previousStatus !== DemandStatus.MISSION_CONFIRMED
    ) {
      await this.sendMissionConfirmedNotification(savedDp);
    }

    return savedDp;
  }

  private async sendMissionConfirmedNotification(dp: DemandProvider): Promise<void> {
    try {
      // Charger les relations necessaires si pas deja chargees
      const demandProvider = await this.demandProviderRepository.findOne({
        where: { id: dp.id },
        relations: ['demand', 'demand.organizer', 'provider'],
      });

      if (!demandProvider?.demand?.organizer || !demandProvider?.provider) {
        this.logger.warn(
          `Cannot send mission confirmed email: missing demand, organizer or provider for DemandProvider ${dp.id}`,
        );
        return;
      }

      await this.mailService.sendMissionConfirmedEmail(
        demandProvider.provider,
        demandProvider.demand,
        demandProvider.demand.organizer,
      );

      this.logger.log(
        `Mission confirmed email sent for DemandProvider ${dp.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send mission confirmed email for DemandProvider ${dp.id}: ${error.message}`,
      );
      // Ne pas faire echouer la mise a jour si l'email echoue
    }
  }

  async unlockContact(demandProviderId: string): Promise<DemandProvider> {
    const dp = await this.getDemandProviderById(demandProviderId);
    dp.contactUnlockedAt = new Date();
    return this.demandProviderRepository.save(dp);
  }

  // Budget par catégorie - méthodes privées
  private async saveCategoryBudgets(
    demandId: string,
    categoryBudgets: { categoryId: number; amount: number }[],
  ): Promise<void> {
    const budgetEntities = categoryBudgets.map((cb) =>
      this.demandBudgetRepository.create({
        demandId,
        categoryId: cb.categoryId,
        amount: cb.amount,
      }),
    );
    await this.demandBudgetRepository.save(budgetEntities);
  }

  private async validateProvidersHaveBudget(
    providerIds: string[],
    categoryBudgets: { categoryId: number; amount: number }[],
  ): Promise<void> {
    const budgetCategoryIds = new Set(categoryBudgets.map((cb) => cb.categoryId));

    // Récupérer les catégories de tous les prestataires
    const providerCategories = await this.providerCategoryRepository.find({
      where: { providerId: In(providerIds) },
    });

    // Grouper par prestataire
    const categoriesByProvider = new Map<string, number[]>();
    for (const pc of providerCategories) {
      if (!categoriesByProvider.has(pc.providerId)) {
        categoriesByProvider.set(pc.providerId, []);
      }
      categoriesByProvider.get(pc.providerId)!.push(pc.categoryId);
    }

    // Vérifier que chaque prestataire a au moins une catégorie avec un budget
    for (const providerId of providerIds) {
      const providerCategoryIds = categoriesByProvider.get(providerId) || [];
      const hasBudget = providerCategoryIds.some((catId) => budgetCategoryIds.has(catId));

      if (!hasBudget) {
        // Récupérer le nom du prestataire pour un message d'erreur plus clair
        const provider = await this.providerRepository.findOne({
          where: { id: providerId },
        });
        const providerName = provider
          ? `${provider.firstName} ${provider.lastName}`
          : providerId;

        throw new BadRequestException(
          `Le prestataire "${providerName}" n'a pas de budget défini pour sa catégorie. ` +
            `Veuillez ajouter un budget pour au moins une de ses catégories.`,
        );
      }
    }
  }

  private async validateProviderHasBudgetForDemand(
    providerId: string,
    demandId: string,
  ): Promise<void> {
    // Récupérer les catégories du prestataire
    const providerCategories = await this.providerCategoryRepository.find({
      where: { providerId },
    });

    if (providerCategories.length === 0) {
      throw new BadRequestException(
        `Le prestataire n'a aucune catégorie assignée`,
      );
    }

    const providerCategoryIds = providerCategories.map((pc) => pc.categoryId);

    // Récupérer les budgets de la demande
    const demandBudgets = await this.demandBudgetRepository.find({
      where: { demandId },
    });

    const budgetCategoryIds = new Set(demandBudgets.map((db) => db.categoryId));

    // Vérifier qu'au moins une catégorie du prestataire a un budget
    const hasBudget = providerCategoryIds.some((catId) => budgetCategoryIds.has(catId));

    if (!hasBudget) {
      const provider = await this.providerRepository.findOne({
        where: { id: providerId },
      });
      const providerName = provider
        ? `${provider.firstName} ${provider.lastName}`
        : providerId;

      throw new BadRequestException(
        `Le prestataire "${providerName}" n'a pas de budget défini pour sa catégorie dans cette demande.`,
      );
    }
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
