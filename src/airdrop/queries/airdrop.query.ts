import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { UpdateAirdropDto } from '../api/dtos/update-airdrop.dto';

@Injectable()
export class AirdropQuery {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.airdrop.findMany({
      include: {
        createdByUser: true, // Quan hệ với User (người tạo)
        posts: true,         // Danh sách các AirdropPost trong airdrop
        tags: true,          // Danh sách tag (qua bảng trung gian)
        funds: true,         // Danh sách fund (qua bảng trung gian)
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    logo?: string;
    description?: string;
    raise?: number;
    status?: string;
    date?: Date;
    createdBy: number;
  }) {
    return this.prisma.airdrop.create({
      data: {
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        description: data.description,
        raise: data.raise ?? 0,
        status: data.status,
        date: data.date ? new Date(data.date) : undefined,
        createdBy: data.createdBy,
      },
      include: {
        createdByUser: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.airdrop.findUnique({
      where: { slug },
      include: {
        createdByUser: true,
        posts: true,
        tags: true,
        funds: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.airdrop.findUnique({
      where: { id },
      include: {
        createdByUser: true,
        posts: true,
        tags: true,
        funds: true,
      },
    });
  }

  async updateBySlug(slug: string, updateDto: UpdateAirdropDto) {
    const airdrop = await this.prisma.airdrop.findUnique({ where: { slug } });
    if (!airdrop) return null;

    return this.prisma.airdrop.update({
      where: { slug },
      data: {
        name: updateDto.name ?? airdrop.name,
        logo: updateDto.logo ?? airdrop.logo,
        description: updateDto.description ?? airdrop.description,
        raise: updateDto.raise ?? airdrop.raise,
        status: updateDto.status ?? airdrop.status,
        date: updateDto.date ? new Date(updateDto.date) : airdrop.date,
      },
      include: {
        createdByUser: true,
        posts: true,
        tags: true,
        funds: true,
      },
    });
  }

  async deleteById(id: number) {
    return this.prisma.airdrop.delete({
      where: { id },
    });
  }
}
