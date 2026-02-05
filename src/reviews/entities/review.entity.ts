import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Index,
  Check,
} from 'typeorm';
import { DemandProvider } from '../../demands/entities/demand-provider.entity';
import { Organizer } from '../../organizers/entities/organizer.entity';
import { Provider } from '../../providers/entities/provider.entity';

@Entity('reviews')
@Index(['providerId'])
@Index(['globalRating'])
@Index(['wouldRecommend'])
@Check(`"global_rating" BETWEEN 1 AND 5`)
@Check(`"punctuality" IN (0, 1)`)
@Check(`"respect_communication" IN (0, 1)`)
@Check(`"request_compliance" IN (0, 1)`)
@Check(`"service_quality" IN (0, 1)`)
@Check(`"regrettable_incident" IN (0, 1)`)
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'demand_provider_id', type: 'uuid', unique: true })
  demandProviderId: string;

  @Column({ name: 'organizer_id', type: 'uuid' })
  organizerId: string;

  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  // Note globale
  @Column({ name: 'global_rating', type: 'int' })
  globalRating: number;

  // Critères binaires
  @Column({ type: 'smallint' })
  punctuality: number;

  @Column({ name: 'respect_communication', type: 'smallint' })
  respectCommunication: number;

  @Column({ name: 'request_compliance', type: 'smallint' })
  requestCompliance: number;

  @Column({ name: 'service_quality', type: 'smallint' })
  serviceQuality: number;

  @Column({ name: 'regrettable_incident', type: 'smallint' })
  regrettableIncident: number;

  // Recommandation
  @Column({ name: 'would_recommend', type: 'boolean' })
  wouldRecommend: boolean;

  // Commentaire
  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  // Relations
  @OneToOne(() => DemandProvider, (dp) => dp.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'demand_provider_id' })
  demandProvider: DemandProvider;

  @ManyToOne(() => Organizer, (organizer) => organizer.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizer_id' })
  organizer: Organizer;

  @ManyToOne(() => Provider, (provider) => provider.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;
}
