import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PaymentStatus } from '../../common/enums';
import { Provider } from '../../providers/entities/provider.entity';
import { DemandProvider } from '../../demands/entities/demand-provider.entity';

@Entity('payments')
@Index(['providerId'])
@Index(['demandProviderId'])
@Index(['waveTransactionId'])
@Index(['status'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  @Column({ name: 'demand_provider_id', type: 'uuid', nullable: true })
  demandProviderId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'XOF' })
  currency: string;

  @Column({
    name: 'wave_transaction_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  waveTransactionId: string;

  @Column({
    name: 'wave_payment_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  wavePaymentUrl: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ name: 'paid_at', type: 'timestamp with time zone', nullable: true })
  paidAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Provider, (provider) => provider.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @ManyToOne(() => DemandProvider, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'demand_provider_id' })
  demandProvider: DemandProvider;
}
