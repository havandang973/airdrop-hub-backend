import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateCategoryDto } from '../api/dtos/create-category.dto';
import { UpdateCategoryDto } from '../api/dtos/update-category.dto';

@Injectable()
export class CategoryQuery {
  constructor(private readonly prisma: PrismaService) { }

  // 🟢 Lấy tất cả category
  findAll() {
    return this.prisma.category.findMany({});
  }

  // 🟢 Lấy category theo ID
  findById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  // 🟢 Tạo category mới
  create(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data,
    });
  }

  // 🟡 Cập nhật category
  updateById(id: number, data: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  // 🔴 Xóa category
  deleteById(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
