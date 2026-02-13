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

  @Column({ type: 'varchar', nullable: true })
  city: string | null = null;

  @Column({ type: 'text', nullable: true })
  description: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  contactInfo: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  website: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  instagram: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  twitter: string | null = null;

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