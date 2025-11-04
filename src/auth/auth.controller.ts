import { Controller, Post, Body, Res, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res() res: any,
    ) {
        const result = await this.authService.login(email, password, res);
        return res.json(result);
    }

    @Post('logout')
    async logout(@Res() res: any) {
        const result = await this.authService.logout(res);
        return res.json(result);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard) // bảo vệ route, chỉ ai có token hợp lệ mới truy cập được
    async getMe(@Req() req: any) {
        // req.user được set trong JwtStrategy.validate()
        return this.authService.getProfile(req.user);
    }
}
