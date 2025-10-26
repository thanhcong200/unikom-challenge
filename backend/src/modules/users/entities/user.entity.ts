import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Activity } from '../../activities/entities/activity.entity';
import { BaseSoftDeleteEntity } from 'src/common/base-entity/base-soft-delete.entity';

@Entity({ name: 'users' })
export class User extends BaseSoftDeleteEntity {
    @Column({ nullable: false })
    first_name: string;

    @Column({ nullable: false })
    last_name: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    @OneToMany(() => Activity, (activity) => activity.user)
    activities: Activity[];
}
