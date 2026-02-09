import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
import { Plan } from './Plan';
import { Event } from './Event';

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus = ApplicationStatus.PENDING;

  @Column({ type: 'text', nullable: true })
  message: string | null = null;

  @ManyToOne(() => User, (user) => user.applications, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => Plan, (plan) => plan.applications, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  plan: Plan | null = null;

  @Column({ nullable: true })
  planId: string | null = null;

  @ManyToOne(() => Event, (event) => event.applications, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  event: Event | null = null;

  @Column({ nullable: true })
  eventId: string | null = null;

  @CreateDateColumn()
  appliedAt!: Date;
}