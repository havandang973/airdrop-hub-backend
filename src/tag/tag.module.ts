import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { TagController } from './api/tag.controller';
import { TagQuery } from './queries/tag.query';

@Module({
  controllers: [TagController],
  providers: [TagQuery, PrismaService],
})
export class TagModule { }
