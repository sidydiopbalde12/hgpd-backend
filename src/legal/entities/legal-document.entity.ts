import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { LegalAcceptance } from './legal-acceptance.entity';

export enum LegalDocumentType {
  CGU = 'CGU',
  CGV = 'CGV',
}

@Entity('legal_documents')
@Index(['type', 'version'], { unique: true })
@Index(['type', 'isActive'])
export class LegalDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LegalDocumentType,
  })
  type: LegalDocumentType;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 50 })
  version: string;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @Column({
    name: 'published_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  publishedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => LegalAcceptance, (acceptance) => acceptance.legalDocument)
  acceptances: LegalAcceptance[];
}
