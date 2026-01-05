import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import {
  SupportSubject,
  SupportStatus,
  PreferredContact,
} from '../../common/enums';
import { Provider } from '../../providers/entities/provider.entity';

@Entity('support_requests')
@Index(['providerId'])
@Index(['status'])
@Index(['createdAt'])
export class SupportRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  @Column({
    type: 'enum',
    enum: SupportSubject,
  })
  subject: SupportSubject;

  @Column({ type: 'text' })
  description: string;

  @Column({
    name: 'preferred_contact',
    type: 'enum',
    enum: PreferredContact,
  })
  preferredContact: PreferredContact;

  @Column({
    type: 'enum',
    enum: SupportStatus,
    default: SupportStatus.PENDING,
  })
  status: SupportStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({
    name: 'resolved_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  resolvedAt: Date;

  // Relations
  @ManyToOne(() => Provider, (provider) => provider.supportRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;
}