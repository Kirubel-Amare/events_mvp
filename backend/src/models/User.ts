import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { PersonalProfile } from './PersonalProfile';
import { OrganizerProfile } from './OrganizerProfile';
import { Plan } from './Plan';
import { Application } from './Application';
import { Report } from './Report';
import { OrganizerApplication } from './OrganizerApplication';
import { Notification } from './Notification';

export enum UserRole {
  USER = 'user',
  ORGANIZER = 'organizer',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar', select: false })
  passwordHash!: string;

  @Column({ type: 'varchar', nullable: true })
  name: string | null = null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  username: string | null = null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole = UserRole.USER;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean = false;

  @Column({ type: 'boolean', default: false })
  isOrganizer: boolean = false;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean = false;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date | null = null;

  @OneToOne(() => PersonalProfile, (profile) => profile.user, {
    cascade: true,
  })
  personalProfile!: PersonalProfile;

  @OneToOne(() => OrganizerProfile, (profile) => profile.user, {
    nullable: true,
    cascade: true,
  })
  organizerProfile!: OrganizerProfile | null;

  @OneToMany(() => Plan, (plan) => plan.creator)
  plans!: Plan[];

  @OneToMany(() => Application, (application) => application.user)
  applications!: Application[];

  @OneToMany(() => Report, (report) => report.reporter)
  reports!: Report[];

  @OneToMany(() => OrganizerApplication, (application) => application.user)
  organizerApplications!: OrganizerApplication[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor() {
  }
}