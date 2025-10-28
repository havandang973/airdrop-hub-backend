import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { PostController } from './api/post.controller';
import { PostQuery } from './queries/post.query';

@Module({
  controllers: [PostController],
  providers: [PostQuery, PrismaService],
})
export class PostModule { }
