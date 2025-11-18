import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { MarketController } from './api/market.controller';

@Module({
  controllers: [MarketController],
  providers: [PrismaService],
})
export class MarketModule { }
