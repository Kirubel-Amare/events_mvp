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

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  location!: string;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ nullable: true })
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

  @Column()
  creatorId!: string;

  @OneToMany(() => Application, (application) => application.plan)
  applications!: Application[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor() {
    this.applications = [];
  }
}