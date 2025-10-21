import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { AirdropPostController } from './api/airdrop-post.controller';
import { AirdropPostQuery } from './queries/airdrop-post.query';

@Module({
  controllers: [AirdropPostController],
  providers: [AirdropPostQuery, PrismaService],
})
export class AirdropPostModule { }
