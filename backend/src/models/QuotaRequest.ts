import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './User';

export enum QuotaRequestType {
    EVENT = 'event',
    PLAN = 'plan',
}

export enum QuotaRequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity('quota_requests')
export class QuotaRequest {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, (user) => user.quotaRequests, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({
        type: 'enum',
        enum: QuotaRequestType,
    })
    type!: QuotaRequestType;

    @Column({ type: 'int' })
    requestedValue!: number;

    @Column({ type: 'text' })
    reason!: string;

    @Column({
        type: 'enum',
        enum: QuotaRequestStatus,
        default: QuotaRequestStatus.PENDING,
    })
    status: QuotaRequestStatus = QuotaRequestStatus.PENDING;

    @Column({ type: 'text', nullable: true })
    adminComment: string | null = null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
