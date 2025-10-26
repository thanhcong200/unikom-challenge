import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ExtractJwt } from 'passport-jwt';
import { RedisKey } from 'src/common/enum';
import { RedisAdapter } from 'src/common/redis.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private authService: AuthService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const can = (await super.canActivate(context)) as boolean;
        if (!can) return false;

        const request = context.switchToHttp().getRequest();
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        const payload = request.user;

        if (!token) throw new UnauthorizedException('Token invalid or expired');
        const storedToken = await RedisAdapter.get(`${RedisKey.AUTH}:${payload.sub}`);
        if (token != storedToken) throw new UnauthorizedException('Token invalid or expired');

        return true;
    }
}
