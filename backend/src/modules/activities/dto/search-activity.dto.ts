import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsEmail, IsInt, Min, IsDate } from 'class-validator';

export enum ActionType {
    LOGIN = 'login',
    LOGOUT = 'logout',
    SEARCH = 'search',
}

export class ActivityQueryDto {
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;

    @IsOptional()
    @IsString()
    name?: string; // partial match cho first_name hoặc last_name

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    actions?: string; // hỗ trợ nhiều action, ví dụ ?actions=login&actions=logout

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number = 10;

    @IsOptional()
    @IsString()
    sortBy: string = 'created_at';

    @IsOptional()
    @IsString()
    order: 'ASC' | 'DESC' = 'DESC';
}
