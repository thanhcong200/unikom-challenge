import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { User } from '../users/entities/user.entity';
import { Utils } from 'src/common/utils';
import { ActivityQueryDto } from './dto/search-activity.dto';
import { ActivityAction } from 'src/common/enum';
import { BaseResponse } from 'src/common/response';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(dto: CreateActivityDto): Promise<Activity> {
        const { userId, action, metadata } = dto;
        const safeMeta = Utils.sanitizeObject(metadata);
        const activity = this.activityRepository.create({
            action,
            user_id: userId,
            metadata: safeMeta
        })
        return this.activityRepository.save(activity)

    }
    async findAll(userId: number, query: ActivityQueryDto): Promise<BaseResponse> {
        const {
            page = 1,
            limit = 10,
            startDate,
            endDate,
            name,
            email,
            actions,
            order = 'DESC',
        } = query;
        await this.create({ userId, action: ActivityAction.SEARCH, metadata: query })
        const qb = this.activityRepository
            .createQueryBuilder('activity')
            .leftJoinAndSelect('activity.user', 'user')
            .orderBy('activity.timestamp', order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');

        if (startDate) {
            qb.andWhere('activity.timestamp >= :startDate', { startDate });
        }

        if (endDate) {
            qb.andWhere('activity.timestamp <= :endDate', { endDate });
        }

        if (name) {
            qb.andWhere('(user.first_name ILIKE :name OR user.last_name ILIKE :name)', {
                name: `%${name}%`,
            });
        }

        if (email) {
            qb.andWhere('user.email ILIKE :email', { email: `%${email}%` });
        }

        if (actions && actions.length > 0) {
            const inActions = actions.split(',').filter(e => e.trim());
            qb.andWhere('activity.action IN (:...actions)', { actions: inActions });
        }

        const skip = (page - 1) * limit;
        qb.skip(skip).take(limit);

        const [data, total] = await qb.getManyAndCount();
        return {
            data: data.map(e => this.formatActivity(e)),
            meta: Utils.buildPagination(total, page, limit),
        };
    }

    formatActivity(activity) {
        return {
            id: activity.id,
            user: {
                first_name: activity.user.first_name,
                last_name: activity.user.last_name,
                email: activity.user.email
            },
            action: activity.action,
            timestamp: activity.timestamp,
            metadata: activity.metadata
        }
    }
}
