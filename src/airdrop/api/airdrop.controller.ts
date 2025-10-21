import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AirdropQuery } from '../queries/airdrop.query';
import { CreateAirdropDto } from './dtos/create-airdrop.dto';
import { UpdateAirdropDto } from './dtos/update-airdrop.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { stat } from 'fs';

@Controller('airdrop')
export class AirdropController {
  constructor(private readonly airdropQuery: AirdropQuery) { }

  // ✅ Lấy danh sách tất cả Airdrop
  @Get()
  @UseGuards(ApiKeyGuard)
  async getAllAirdrops() {
    const airdrops = await this.airdropQuery.findAll();

    return airdrops
  }

  // ✅ Tạo mới Airdrop
  @Post()
  async createAirdrop(@Body() dto: CreateAirdropDto) {
    const newAirdrop = await this.airdropQuery.create(dto as any);
    return {
      message: 'Airdrop created successfully!',
      data: newAirdrop,
    };
  }

  // ✅ Lấy chi tiết Airdrop theo slug
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const airdrop = await this.airdropQuery.findBySlug(slug);

    if (!airdrop) {
      throw new NotFoundException(`Airdrop with slug "${slug}" not found`);
    }

    return {
      id: airdrop.id,
      name: airdrop.name,
      slug: airdrop.slug,
      logo: airdrop.logo,
      description: airdrop.description,
      raise: airdrop.raise,
      status: airdrop.status,
      date: airdrop.date,
      createdBy: airdrop.createdByUser?.name ?? null,
      createdAt: airdrop.createdAt,
      funds: airdrop.funds?.map((item: any) => item.fund) || [],
    };
  }

  // ✅ Cập nhật Airdrop theo slug
  @Put(':slug')
  async updateAirdrop(
    @Param('slug') slug: string,
    @Body() updateDto: UpdateAirdropDto,
  ) {
    const airdrop = await this.airdropQuery.findBySlug(slug);
    if (!airdrop) {
      throw new NotFoundException(`Airdrop with slug "${slug}" not found`);
    }

    const updated = await this.airdropQuery.updateBySlug(slug, updateDto);
    if (!updated) {
      throw new NotFoundException(`Failed to update airdrop with slug "${slug}"`);
    }

    return {
      message: 'Airdrop updated successfully',
      data: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        logo: updated.logo,
        description: updated.description,
        raise: updated.raise,
        status: updated.status,
        date: updated.date,
        createdBy: updated.createdByUser?.name ?? null,
        updatedAt: updated.updatedAt,
      },
    };
  }

  // ✅ Xóa Airdrop theo ID
  @Delete(':id')
  async deleteAirdrop(@Param('id') id: number) {
    const airdrop = await this.airdropQuery.findById(id);
    if (!airdrop) {
      throw new NotFoundException(`Airdrop with id "${id}" not found`);
    }

    await this.airdropQuery.deleteById(id);
    return { message: 'Airdrop deleted successfully' };
  }

  @Get(':id/posts')
  async getAirdropPost(@Param('id') id: string) {
    const airdropId = parseInt(id, 10);

    const airdrop = await this.airdropQuery.findOneWithPosts(airdropId);

    if (!airdrop) {
      throw new NotFoundException('Airdrop not found');
    }

    return {
      id: airdrop.id,
      name: airdrop.name,
      slug: airdrop.slug,
      posts: airdrop.posts,
    };
  }

}
