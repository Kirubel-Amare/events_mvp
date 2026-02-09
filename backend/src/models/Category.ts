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

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  icon: string | null = null;

  @Column({ default: true })
  isActive: boolean = true;

  @OneToMany(() => Event, (event) => event.category)
  events!: Event[];

  @CreateDateColumn()
  createdAt!: Date;

  constructor() {
    this.events = [];
  }
}