import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { AirdropPostQuery } from '../queries/airdrop-post.query';
import { CreateAirdropPostDto } from './dtos/create-airdrop-post.dto';
import { UpdateAirdropPostDto } from './dtos/update-airdrop-post.dto';

@Controller('airdrop-posts')
export class AirdropPostController {
  constructor(private readonly airdropPostQuery: AirdropPostQuery) { }

  // ✅ Lấy danh sách tất cả Airdrop
  @Get()
  @UseGuards(ApiKeyGuard)
  async getAll(
    @Query('name') name?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('airdropId') airdropId?: number,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    const { data, pagination } = await this.airdropPostQuery.findAll({
      name,
      status,
      date,
      airdropId,
      page,
      size,
    });

    const formattedData = data.map((post) => ({
      id: post.id,
      name: post.name,
      content: post.content,
      status: post.status,
      date: post.date,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      airdrop: post.airdrop
        ? { id: post.airdrop.id, name: post.airdrop.name }
        : null,
    }));

    return {
      data: formattedData,
      pagination,
    };
  }

  // GET /airdrop-posts/:id
  @Get(':id')
  async getById(@Param('id') id: number) {
    const post = await this.airdropPostQuery.findById(Number(id));
    if (!post) throw new NotFoundException('Airdrop Post not found');
    return post;
  }

  @Put(':id')
  async updateAirdropPost(
    @Param('id') id: number,
    @Body() dto: UpdateAirdropPostDto,
  ) {
    const updatedAirdrop = await this.airdropPostQuery.update(id, dto as any);
    return {
      message: 'Airdrop post updated successfully!',
      data: updatedAirdrop,
    };
  }

  @Post()
  async createAirdropPost(@Body() dto: CreateAirdropPostDto) {
    const newAirdrop = await this.airdropPostQuery.create(dto as any);
    return {
      message: 'Airdrop post created successfully!',
      data: newAirdrop,
    };
  }

  // DELETE /airdrop-posts/:id
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.airdropPostQuery.delete(Number(id));
    return { message: 'Post deleted successfully' };
  }

}
