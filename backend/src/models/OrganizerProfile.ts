import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Event } from './Event';

@Entity('organizer_profiles')
export class OrganizerProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  organizationName!: string;

  @Column({ type: 'varchar', nullable: true })
  profilePhoto: string | null = null;

  @Column({ type: 'varchar' })
  city!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar' })
  contactInfo!: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean = false;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date | null = null;

  @Column({ type: 'boolean', default: false })
  isActive: boolean = false;

  @OneToOne(() => User, (user) => user.organizerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @OneToMany(() => Event, (event) => event.organizer)
  events!: Event[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor() {
  }
}