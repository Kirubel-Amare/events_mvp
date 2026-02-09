import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

export enum ReportType {
  USER = 'user',
  EVENT = 'event',
  PLAN = 'plan',
  COMMENT = 'comment',
  OTHER = 'other',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  type!: ReportType;

  @Column()
  contentId!: string;

  @Column({ type: 'text' })
  reason!: string;

  @Column({ type: 'text', nullable: true })
  details: string | null = null;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus = ReportStatus.PENDING;

  @Column({ nullable: true })
  resolvedAt: Date | null = null;

  @Column({ nullable: true })
  resolvedBy: string | null = null;

  @ManyToOne(() => User, (user) => user.reports, {
    onDelete: 'CASCADE',
  })
  reporter!: User;

  @Column()
  reporterId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}