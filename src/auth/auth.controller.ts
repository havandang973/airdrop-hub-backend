import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

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
}
