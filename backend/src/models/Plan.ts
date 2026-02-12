import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Application } from './Application';

export enum PlanStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar' })
  location!: string;

  @Column({ type: 'varchar', nullable: true })
  image: string | null = null;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ type: 'varchar', nullable: true })
  externalLink: string | null = null;

  @Column({
    type: 'enum',
    enum: PlanStatus,
    default: PlanStatus.ACTIVE,
  })
  status: PlanStatus = PlanStatus.ACTIVE;

  @ManyToOne(() => User, (user) => user.plans, {
    onDelete: 'CASCADE',
  })
  creator!: User;

  @Column({ type: 'uuid' })
  creatorId!: string;

  @OneToMany(() => Application, (application) => application.plan)
  applications!: Application[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor() {
  }
}