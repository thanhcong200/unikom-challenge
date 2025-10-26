import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ActivityAction } from 'src/common/enum';
import { BaseSoftDeleteEntity } from 'src/common/base-entity/base-soft-delete.entity';
import { IsDate } from 'class-validator';
import { TIMESTAMP_TYPE } from 'src/common/base-entity/base-column.entity';


@Entity({ name: 'activities' })
export class Activity extends BaseSoftDeleteEntity {

    @Column({ nullable: true })
    user_id: number;
    @ManyToOne(() => User, (user) => user.activities, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'enum', enum: ActivityAction })
    action: ActivityAction;

    @Column({ type: TIMESTAMP_TYPE, default: () => 'CURRENT_TIMESTAMP' })
    @CreateDateColumn({ type: TIMESTAMP_TYPE })
    @IsDate()
    public timestamp: Date;

    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;
}