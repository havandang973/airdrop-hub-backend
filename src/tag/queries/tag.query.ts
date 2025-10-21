import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateTagDto } from '../api/dtos/create-tag.dto';
import { UpdateTagDto } from '../api/dtos/update-tag.dto';

@Injectable()
export class TagQuery {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.tag.findMany({});
  }

  findById(id: number) {
    return this.prisma.tag.findUnique({
      where: { id }
    });
  }

  create(data: CreateTagDto) {
    return this.prisma.tag.create({
      data,
    });
  }

  updateById(id: number, data: UpdateTagDto) {
    return this.prisma.tag.update({
      where: { id },
      data
    });
  }

  deleteById(id: number) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
