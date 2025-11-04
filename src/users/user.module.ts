import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserQuery } from './queries/user.query';

@Module({
  controllers: [],
  providers: [UserQuery, PrismaService],
})
export class UserModule { }
