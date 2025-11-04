import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserQuery } from 'src/users/queries/user.query';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userQuery: UserQuery) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.token,
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        console.log("payload", payload);
        return this.userQuery.findByEmail(payload.email);
    }

    // async validate(payload: any) {
    //     // payload là data trong token
    //     console.log("payload", payload);
    //     return { id: payload.sub, email: payload.email };
    // }


}
