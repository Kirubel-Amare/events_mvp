import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OrganizerProfile } from './OrganizerProfile';
import { Application } from './Application';
import { Category } from './Category';

export enum EventStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column('text', { array: true, default: [] })
  images: string[] = [];

  @Column({ type: 'varchar', nullable: true })
  mainImage: string | null = null;

  @Column({ type: 'varchar' })
  city!: string;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ type: 'varchar', nullable: true })
  price: string | null = null;

  @Column({ type: 'int', nullable: true })
  capacity: number | null = null;

  @Column({ type: 'varchar', nullable: true })
  externalLink: string | null = null;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean = false;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PENDING,
  })
  status: EventStatus = EventStatus.PENDING;

  @ManyToOne(() => OrganizerProfile, (organizer) => organizer.events, {
    onDelete: 'CASCADE',
  })
  organizer!: OrganizerProfile;

  @Column({ type: 'uuid' })
  organizerId!: string;

  @ManyToOne(() => Category, (category) => category.events, {
    nullable: true,
  })
  category: Category | null = null;

  @Column({ type: 'int', nullable: true })
  categoryId: number | null = null;

  @OneToMany(() => Application, (application) => application.event)
  applications!: Application[];

  @CreateDateColumn()
  createdAt!: Date;

  @CreateDateColumn()
  updatedAt!: Date;

  constructor() {
    this.images = [];
  }
}