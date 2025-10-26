import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { ActivityAction } from 'src/common/enum';

export class CreateActivityDto {
    @IsEnum(ActivityAction)
    action: ActivityAction;

    @IsOptional()
    metadata?: any;

    @IsInt()
    userId: number;
}
