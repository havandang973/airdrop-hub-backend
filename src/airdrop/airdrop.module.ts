import { Module } from '@nestjs/common';
import { AirdropQuery } from './queries/airdrop.query';
import { PrismaService } from 'src/common/services/prisma.service';
import { AirdropController } from './api/airdrop.controller';

@Module({
  controllers: [AirdropController],
  providers: [AirdropQuery, PrismaService],
})
export class AirdropModule { }
