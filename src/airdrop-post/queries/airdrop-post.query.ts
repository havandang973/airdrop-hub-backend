import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { UpdateAirdropPostDto } from '../api/dtos/update-airdrop-post.dto';
import { CreateAirdropPostDto } from '../api/dtos/create-airdrop-post.dto';

@Injectable()
export class AirdropPostQuery {
  constructor(private prisma: PrismaService) { }

  async findAll(filters?: {
    name?: string;
    status?: string;
    date?: string;
    airdropId?: number;
    page?: number;
    size?: number;
  }) {
    const page = Number(filters?.page) || 1;
    const size = Number(filters?.size) || 10;

    const where: any = {
      deletedAt: null,
      ...(filters?.name && { name: { contains: filters.name, mode: 'insensitive' } }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.date && { date: new Date(filters.date) }),
      ...(filters?.airdropId && { airdropId: filters.airdropId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.airdropPost.findMany({
        where,
        include: {
          airdrop: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * size,
        take: size,
      }),

      this.prisma.airdropPost.count({ where }), // đếm tổng bản ghi
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
      },
    };
  }


  async create(dto: CreateAirdropPostDto) {
    console.log('📦 DTO nhận được trong AirdropPostQuery.create:', dto);
    return await this.prisma.airdropPost.create({
      data: {
        name: dto.name,
        status: dto.status,
        date: dto.date ? new Date(dto.date) : undefined,
        content: dto.content,
        visibility: dto.visibility ?? true,
        pin: dto.pin ?? false,
        tagId: dto.tagId,
        createdBy: dto.createdBy,
        airdropId: dto.airdropId,
      },
    });
  }

  async update(id: number, dto: UpdateAirdropPostDto) {
    const post = await this.prisma.airdropPost.findUnique({
      where: { id: Number(id) },
    });

    if (!post) throw new NotFoundException('Airdrop Post not found');
    return this.prisma.airdropPost.update({
      where: { id: Number(id) },
      data: {
        name: dto.name,
        status: dto.status,
        date: dto.date ? new Date(dto.date) : undefined,
        content: dto.content,
        visibility: dto.visibility ?? true,
        pin: dto.pin ?? false,
        tagId: dto.tagId,
        airdropId: dto.airdropId,
      },
    });
  }


  async findById(id: number) {
    return this.prisma.airdropPost.findUnique({
      where: { id: Number(id) },
      include: {
        airdrop: true,
      },
    });
  }

  async delete(id: number) {
    const post = await this.prisma.airdropPost.findUnique({
      where: { id: Number(id) },
    });

    if (!post) throw new NotFoundException('Airdrop Post not found');

    return this.prisma.airdropPost.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  }

}
