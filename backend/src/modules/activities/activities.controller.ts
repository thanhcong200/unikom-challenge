import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ActivityQueryDto } from './dto/search-activity.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('activities')
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateActivityDto) {
        return this.activitiesService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@User('sub') userId: number, @Query() query: ActivityQueryDto) {
        return this.activitiesService.findAll(userId, query);
    }
}
