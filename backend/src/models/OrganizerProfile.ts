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

  @Column()
  name!: string;

  @Column({ nullable: true })
  profileImage: string | null = null;

  @Column()
  city!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  contactInfo!: string;

  @Column({ default: false })
  isVerified: boolean = false;

  @Column({ nullable: true })
  verifiedAt: Date | null = null;

  @Column({ default: false })
  isActive: boolean = false;

  @OneToOne(() => User, (user) => user.organizerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

  @Column()
  userId!: string;

  @OneToMany(() => Event, (event) => event.organizer)
  events!: Event[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor() {
    this.events = [];
  }
}