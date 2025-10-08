import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class AirdropQuery {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.airdrop.findMany({
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async create(data: {
    title: string;
    slug: string;
    content?: string;
    avatar?: string;
    status?: string;
    total_raise?: number;
    category_id?: number;
    created_by: number;
  }) {
    return this.prisma.airdrop.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        avatar: data.avatar,
        status: data.status,
        total_raise: data.total_raise,
        category_id: data.category_id,
        created_by: data.created_by,
      },
    });
  }
}
