import { Body, Controller, Get, Post } from '@nestjs/common';
import { AirdropQuery } from '../queries/airdrop.query';
import { CreateAirdropDto } from './dtos/create-airdrop.dto';

@Controller('airdrop')
export class AirdropController {
  constructor(private airdropQuery: AirdropQuery) { }

  @Get()
  async getAllAirdrops() {
    const airdrops = await this.airdropQuery.findAll();

    return airdrops.map(item => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      content: item.content,
      avatar: item.avatar,
      status: item.status,
      totalRaise: item.total_raise,
      category: item.category?.name ?? null,
      createdBy: item.author?.name ?? null,
      createdAt: item.created_at,
    }));
  }

  @Post()
  async createAirdrop(@Body() dto: CreateAirdropDto) {
    const newAirdrop = await this.airdropQuery.create(dto);
    return {
      message: 'Airdrop created successfully!',
      data: newAirdrop,
    };
  }
}
