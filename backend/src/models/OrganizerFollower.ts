import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from './User';
import { OrganizerProfile } from './OrganizerProfile';

@Entity('organizer_followers')
@Unique(['userId', 'organizerId'])
export class OrganizerFollower {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => OrganizerProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organizerId' })
    organizer!: OrganizerProfile;

    @Column({ type: 'uuid' })
    organizerId!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
