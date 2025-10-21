import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { FundController } from './api/fund.controller';
import { FundQuery } from './queries/fund.query';

@Module({
  controllers: [FundController],
  providers: [FundQuery, PrismaService],
})
export class FundModule { }
