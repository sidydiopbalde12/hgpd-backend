import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';
import { SubscriptionStatus } from '../common/enums';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = this.subscriptionRepository.create(dto);
    return this.subscriptionRepository.save(subscription);
  }

  async findAll(providerId?: string): Promise<Subscription[]> {
    const query = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.provider', 'provider');

    if (providerId) {
      query.where('subscription.providerId = :providerId', { providerId });
    }

    return query.orderBy('subscription.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['provider'],
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }

  async findActiveByProvider(providerId: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: {
        providerId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['provider'],
    });
  }

  async update(id: string, dto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.findOne(id);
    Object.assign(subscription, dto);
    return this.subscriptionRepository.save(subscription);
  }

  async cancel(id: string): Promise<Subscription> {
    const subscription = await this.findOne(id);
    subscription.status = SubscriptionStatus.CANCELLED;
    return this.subscriptionRepository.save(subscription);
  }

  async remove(id: string): Promise<void> {
    const subscription = await this.findOne(id);
    await this.subscriptionRepository.remove(subscription);
  }

  async checkExpiredSubscriptions(): Promise<void> {
    const today = new Date();
    await this.subscriptionRepository
      .createQueryBuilder()
      .update(Subscription)
      .set({ status: SubscriptionStatus.EXPIRED })
      .where('status = :status', { status: SubscriptionStatus.ACTIVE })
      .andWhere('endDate < :today', { today })
      .execute();
  }
}
