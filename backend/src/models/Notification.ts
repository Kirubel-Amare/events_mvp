import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { User } from './User';

export enum NotificationType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
    user!: User;

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.INFO,
    })
    type!: NotificationType;

    @Column({ type: 'varchar' })
    title!: string;

    @Column({ type: 'text' })
    message!: string;

    @Column({ type: 'boolean', default: false })
    isRead: boolean = false;

    @Column({ type: 'varchar', nullable: true })
    link: string | null = null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
