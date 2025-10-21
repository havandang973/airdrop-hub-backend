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
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { AirdropPostQuery } from '../queries/airdrop-post.query';
import { CreateAirdropDto } from 'src/airdrop/api/dtos/create-airdrop.dto';
import { CreateAirdropPostDto } from './dtos/create-airdrop-post.dto';

@Controller('airdrop-posts')
export class AirdropPostController {
  constructor(private readonly airdropPostQuery: AirdropPostQuery) { }

  // ✅ Lấy danh sách tất cả Airdrop
  @Get()
  @UseGuards(ApiKeyGuard)
  async getAll() {
    const posts = await this.airdropPostQuery.findAll();
    return posts.map((post) => ({
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
  }

  // GET /airdrop-posts/:id
  @Get(':id')
  async getById(@Param('id') id: string) {
    const post = await this.airdropPostQuery.findById(Number(id));
    if (!post) throw new NotFoundException('Airdrop Post not found');
    return post;
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
