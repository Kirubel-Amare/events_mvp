import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity('personal_profiles')
export class PersonalProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null = null;

  @Column({ nullable: true })
  profilePhoto: string | null = null;

  @Column('text', { array: true, default: [] })
  additionalImages: string[] = [];

  @Column({ nullable: true })
  city: string | null = null;

  @OneToOne(() => User, (user) => user.personalProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor() {
    this.additionalImages = [];
  }
}