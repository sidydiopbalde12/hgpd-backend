import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentStatus } from '../common/enums';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...dto,
      currency: dto.currency || 'XOF',
    });
    return this.paymentRepository.save(payment);
  }

  async findAll(options?: {
    providerId?: string;
    status?: PaymentStatus;
  }): Promise<Payment[]> {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.provider', 'provider')
      .leftJoinAndSelect('payment.demandProvider', 'demandProvider');

    if (options?.providerId) {
      query.andWhere('payment.providerId = :providerId', {
        providerId: options.providerId,
      });
    }

    if (options?.status) {
      query.andWhere('payment.status = :status', { status: options.status });
    }

    return query.orderBy('payment.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['provider', 'demandProvider'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByWaveTransactionId(waveTransactionId: string): Promise<Payment | null> {
    return this.paymentRepository.findOne({
      where: { waveTransactionId },
      relations: ['provider', 'demandProvider'],
    });
  }

  async findByProvider(providerId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { providerId },
      relations: ['demandProvider'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findById(id);

    if (dto.status === PaymentStatus.COMPLETED && !payment.paidAt) {
      payment.paidAt = new Date();
    }

    Object.assign(payment, dto);
    return this.paymentRepository.save(payment);
  }

  async markAsCompleted(
    id: string,
    waveTransactionId?: string,
  ): Promise<Payment> {
    const payment = await this.findById(id);
    payment.status = PaymentStatus.COMPLETED;
    payment.paidAt = new Date();
    if (waveTransactionId) {
      payment.waveTransactionId = waveTransactionId;
    }
    return this.paymentRepository.save(payment);
  }

  async markAsFailed(id: string): Promise<Payment> {
    const payment = await this.findById(id);
    payment.status = PaymentStatus.FAILED;
    return this.paymentRepository.save(payment);
  }

  async refund(id: string): Promise<Payment> {
    const payment = await this.findById(id);
    payment.status = PaymentStatus.REFUNDED;
    return this.paymentRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findById(id);
    await this.paymentRepository.remove(payment);
  }

  async getProviderTotalRevenue(providerId: string): Promise<number> {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.providerId = :providerId', { providerId })
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .getRawOne();

    return parseFloat(result?.total) || 0;
  }

  async getStats(): Promise<{
    totalRevenue: number;
    totalPayments: number;
    pendingPayments: number;
    completedPayments: number;
  }> {
    const totalPayments = await this.paymentRepository.count();
    const pendingPayments = await this.paymentRepository.count({
      where: { status: PaymentStatus.PENDING },
    });
    const completedPayments = await this.paymentRepository.count({
      where: { status: PaymentStatus.COMPLETED },
    });

    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .getRawOne();

    return {
      totalRevenue: parseFloat(result?.total) || 0,
      totalPayments,
      pendingPayments,
      completedPayments,
    };
  }
}
