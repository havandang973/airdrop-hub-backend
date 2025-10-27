import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CategoryController } from './api/category.controller';
import { CategoryQuery } from './queries/category.query';

@Module({
  controllers: [CategoryController],
  providers: [CategoryQuery, PrismaService],
})
export class CategoryModule { }
