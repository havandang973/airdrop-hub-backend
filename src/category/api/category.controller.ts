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
import { CategoryQuery } from '../queries/category.query';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryQuery: CategoryQuery) { }

  // 🟢 Lấy tất cả category
  @Get()
  @UseGuards(ApiKeyGuard)
  async getAllCategories() {
    const categories = await this.categoryQuery.findAll();

    return categories.map((item) => ({
      id: item.id,
      name: item.name,
      // createdAt: item.created_at,
    }));
  }

  // 🟢 Tạo category mới
  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    const newCategory = await this.categoryQuery.create(dto);
    return {
      message: 'Category created successfully!',
      data: newCategory,
    };
  }

  // 🟢 Lấy category theo id
  @Get(':id')
  async findById(@Param('id') id: string) {
    const category = await this.categoryQuery.findById(Number(id));

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    return {
      id: category.id,
      name: category.name,
      // createdAt: category.created_at,
    };
  }

  // 🟡 Cập nhật category theo id
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryQuery.findById(Number(id));
    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    const updated = await this.categoryQuery.updateById(Number(id), updateDto);

    if (!updated) {
      throw new NotFoundException(`Failed to update category with id "${id}"`);
    }

    return {
      message: 'Category updated successfully!',
      data: {
        id: updated.id,
        name: updated.name,
        // createdBy: updated.author?.name ?? null,
      },
    };
  }

  // 🔴 Xóa category theo id
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    const category = await this.categoryQuery.findById(Number(id));
    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    await this.categoryQuery.deleteById(Number(id));

    return {
      message: 'Category deleted successfully!',
    };
  }
}
