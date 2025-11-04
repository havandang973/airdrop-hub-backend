import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserQuery } from 'src/users/queries/user.query';

@Injectable()
export class AuthService {
    constructor(
        private usersQuery: UserQuery,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersQuery.findByEmail(email);
        if (!user) throw new UnauthorizedException('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid password');

        return user;
    }

    async login(email: string, password: string, res: Response) {
        const user = await this.validateUser(email, password);

        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);

        // ✅ Lưu token vào HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000, // 1h
        });

        return { message: 'Login successful', user };
    }

    async logout(res: Response) {
        res.clearCookie('token');
        return { message: 'Logout successful' };
    }

    async getProfile(user: any) {
        console.log("user", user)
        return this.usersQuery.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
    }
}
