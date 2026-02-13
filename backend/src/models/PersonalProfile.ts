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

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  username!: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  profilePhoto: string | null = null;

  @Column('text', { array: true, default: [] })
  additionalImages!: string[];

  @Column({ type: 'varchar', nullable: true })
  city: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  website: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  instagram: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  twitter: string | null = null;

  @OneToOne(() => User, (user) => user.personalProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}