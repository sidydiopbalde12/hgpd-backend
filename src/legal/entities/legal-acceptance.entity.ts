import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LegalDocument } from './legal-document.entity';
import { Provider } from '../../providers/entities/provider.entity';

@Entity('legal_acceptances')
@Index(['providerId', 'legalDocumentId'], { unique: true })
@Index(['providerId'])
@Index(['legalDocumentId'])
export class LegalAcceptance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  @Column({ name: 'legal_document_id', type: 'uuid' })
  legalDocumentId: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'accepted_at', type: 'timestamp with time zone' })
  acceptedAt: Date;

  @ManyToOne(() => Provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @ManyToOne(() => LegalDocument, (doc) => doc.acceptances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'legal_document_id' })
  legalDocument: LegalDocument;
}
