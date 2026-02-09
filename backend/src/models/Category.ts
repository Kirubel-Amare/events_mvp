import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Event } from './Event';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  icon: string | null = null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean = true;

  @OneToMany(() => Event, (event) => event.category)
  events!: Event[];

  @CreateDateColumn()
  createdAt!: Date;

  constructor() {
  }
}