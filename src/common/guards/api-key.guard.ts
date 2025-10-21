import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['x-api-key'];

        // Kiểm tra header tồn tại
        if (!authHeader) {
            throw new UnauthorizedException('Missing API Key');
        }

        const validKey = this.configService.get<string>('API_KEY');

        if (authHeader !== validKey) {
            throw new UnauthorizedException('Invalid API Key');
        }

        return true;

        // // Kiểm tra cú pháp
        // const [type, key] = authHeader.split(' ');
        // if (type !== 'Api-Key' || !key) {
        //     throw new UnauthorizedException('Invalid API Key format');
        // }

        // // Lấy key thật từ biến môi trường
        // const validKey = this.configService.get<string>('API_KEY');

        // if (key !== validKey) {
        //     throw new UnauthorizedException('Invalid API Key');
        // }

        // return true;
    }
}
