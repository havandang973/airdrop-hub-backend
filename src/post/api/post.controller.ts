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
import { PostQuery } from '../queries/post.query';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postQuery: PostQuery) { }

  // ✅ GET /news — lấy danh sách tất cả bài viết
  @Get()
  @UseGuards(ApiKeyGuard)
  async getAll() {
    const posts = await this.postQuery.findAll();
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      thumbnail: post.thumbnail,
      content: post.content,
      visibility: post.visibility,
      view: post.view,
      pin: post.pin,
      pin_to_home: post.pin_to_home,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      category: post.category
        ? { id: post.category.id, name: post.category.name }
        : null,
      createdBy: post.createdByUser
        ? { id: post.createdByUser.id, name: post.createdByUser.name }
        : null,
      postTags: post.postTags?.map((t) => t.tag?.name) ?? [],
    }));
  }
  @Get(':identifier')
  async findByIdOrSlug(@Param('identifier') identifier: string) {
    const isNumeric = /^\d+$/.test(identifier);

    const post = isNumeric
      ? await this.postQuery.findById(Number(identifier))
      : await this.postQuery.findBySlug(identifier);

    if (!post) {
      throw new NotFoundException(`Post with "${identifier}" not found`);
    }

    return post;
  }

  // ✅ POST /news — tạo mới bài viết
  @Post()
  async createNews(@Body() dto: CreatePostDto) {
    const newPost = await this.postQuery.create(dto as any);
    return {
      message: 'News created successfully!',
      data: newPost,
    };
  }

  // ✅ PUT /news/:id — cập nhật bài viết
  @Put(':id')
  async updateNews(@Param('id') id: number, @Body() dto: UpdatePostDto) {
    const updated = await this.postQuery.update(id, dto as any);
    return {
      message: 'News updated successfully!',
      data: updated,
    };
  }

  // ✅ DELETE /news/:id — xóa bài viết
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.postQuery.delete(Number(id));
    return { message: 'News deleted successfully' };
  }
}
