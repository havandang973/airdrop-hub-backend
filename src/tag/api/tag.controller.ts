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
import { TagQuery } from '../queries/tag.query';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';

@Controller('tags')
export class TagController {
  constructor(private readonly tagQuery: TagQuery) { }

  // 🟢 Lấy tất cả tag
  @Get()
  @UseGuards(ApiKeyGuard)
  async getAllTag() {
    const tag = await this.tagQuery.findAll();

    return tag.map((item) => ({
      id: item.id,
      name: item.name,
      // createdAt: item.created_at,
    }));
  }

  // 🟢 Tạo tag mới
  @Post()
  async createTag(@Body() dto: CreateTagDto) {
    const newTag = await this.tagQuery.create(dto);
    return {
      message: 'Tag created successfully!',
      data: newTag,
    };
  }

  // 🟢 Lấy tag theo id
  @Get(':id')
  async findById(@Param('id') id: string) {
    const tag = await this.tagQuery.findById(Number(id));

    if (!tag) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }

    return {
      id: tag.id,
      name: tag.name,
      // createdAt: tag.created_at,
    };
  }

  // 🟡 Cập nhật tag theo id
  @Put(':id')
  async updateTag(
    @Param('id') id: string,
    @Body() updateDto: UpdateTagDto,
  ) {
    const tag = await this.tagQuery.findById(Number(id));
    if (!tag) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }

    const updated = await this.tagQuery.updateById(Number(id), updateDto);

    if (!updated) {
      throw new NotFoundException(`Failed to update tag with id "${id}"`);
    }

    return {
      message: 'Tag updated successfully!',
      data: {
        id: updated.id,
        name: updated.name,
        // createdBy: updated.author?.name ?? null,
      },
    };
  }

  // 🔴 Xóa tag theo id
  @Delete(':id')
  async deleteTag(@Param('id') id: string) {
    const tag = await this.tagQuery.findById(Number(id));
    if (!tag) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }

    await this.tagQuery.deleteById(Number(id));

    return {
      message: 'Tag deleted successfully!',
    };
  }
}
