import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { UpdateAirdropDto } from '../api/dtos/update-airdrop-post.dto';
import { CreateAirdropPostDto } from '../api/dtos/create-airdrop-post.dto';

@Injectable()
export class AirdropPostQuery {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.airdropPost.findMany({
      include: {
        airdrop: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        deletedAt: null,
      }
    });
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


  async findById(id: number) {
    return this.prisma.airdropPost.findUnique({
      where: { id },
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
