import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './User';
import { OrganizerProfile } from './OrganizerProfile';
import { Event } from './Event';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reviewerId' })
    reviewer!: User;

    @Column({ type: 'uuid' })
    reviewerId!: string;

    @ManyToOne(() => OrganizerProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organizerId' })
    organizer!: OrganizerProfile;

    @Column({ type: 'uuid' })
    organizerId!: string;

    @ManyToOne(() => Event, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'eventId' })
    event: Event | null = null;

    @Column({ type: 'uuid', nullable: true })
    eventId: string | null = null;

    @Column({ type: 'int' })
    rating!: number;

    @Column({ type: 'text', nullable: true })
    comment: string | null = null;

    @CreateDateColumn()
    createdAt!: Date;
}
