import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
  Check,
} from 'typeorm';
import { DemandStatus } from '../../common/enums';
import { Organizer } from '../../organizers/entities/organizer.entity';
import { DemandProvider } from './demand-provider.entity';

@Entity('demands')
@Index(['organizerId'])
@Index(['eventDate'])
@Index(['status'])
@Index(['createdAt'])
@Check(`"event_date" >= CURRENT_DATE`)
export class Demand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organizer_id', type: 'uuid' })
  organizerId: string;

  // Informations événement
  @Column({ name: 'contact_name', type: 'varchar', length: 200 })
  contactName: string;

  @Column({ name: 'event_nature', type: 'varchar', length: 200 })
  eventNature: string;

  @Column({ name: 'event_date', type: 'date' })
  eventDate: Date;

  @Column({ name: 'approximate_guests', type: 'int', nullable: true })
  approximateGuests: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  location: string;

  @Column({ name: 'geographic_zone', type: 'varchar', length: 100, nullable: true })
  geographicZone: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budget: number;

  @Column({ name: 'additional_info', type: 'text', nullable: true })
  additionalInfo: string;

  // Statut global
  @Column({
    type: 'enum',
    enum: DemandStatus,
    default: DemandStatus.NEW_REQUEST,
  })
  status: DemandStatus;

  // Timestamps
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Organizer, (organizer) => organizer.demands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizer_id' })
  organizer: Organizer;

  @OneToMany(() => DemandProvider, (dp) => dp.demand)
  demandProviders: DemandProvider[];
}