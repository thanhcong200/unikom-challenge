import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@Req() req) {
        return this.authService.logout(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() req) {
        return this.authService.me(req.user.sub);
    }
}