import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ActivitiesService } from '../activities/activities.service';
import { ActivityAction, RedisKey } from 'src/common/enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Utils } from 'src/common/utils';
import { RedisAdapter } from 'src/common/redis.service';
import { JWT_EXPIRES_IN } from 'src/config/environtment';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private activitiesService: ActivitiesService,
    ) { }

    async signup(payload: SignupDto) {
        const existing = await this.usersService.findByEmail(payload.email);
        if (existing) throw new BadRequestException('Email already registered');

        const hashed = await Utils.hashPassword(payload.password);
        await this.usersService.create({
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            password: hashed,
        } as CreateUserDto);


        return { message: 'Signup successful' };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);
        await RedisAdapter.set(`${RedisKey.AUTH}:${user.id}`, token, Utils.parseExpirationToSeconds(JWT_EXPIRES_IN));
        await this.activitiesService.create({ action: ActivityAction.LOGIN, userId: user.id });

        return { access_token: token }
    }

    async logout(userId: number) {
        await RedisAdapter.delete(`${RedisKey.AUTH}:${userId}`);
        await this.activitiesService.create({ action: ActivityAction.LOGOUT, userId });
    }

    async me(userId: number) {
        return this.usersService.findById(userId);
    }
}