import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { UpdateAirdropDto } from '../api/dtos/update-airdrop.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AirdropQuery {
  constructor(private prisma: PrismaService) { }

  async findAll(filters?: {
    name?: string;
    status?: string;
    fund?: string;
    minRaise?: number;
    maxRaise?: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }) {
    const page = Number(filters?.page) || 1;
    const size = Number(filters?.size) || 10;

    const where: Prisma.AirdropWhereInput = {
      deletedAt: null,

      ...(filters?.name && {
        name: { contains: filters.name },
      }),

      ...(filters?.status && { status: filters.status }),

      ...(filters?.minRaise || filters?.maxRaise
        ? {
          raise: {
            gte: filters?.minRaise || undefined,
            lte: filters?.maxRaise || undefined,
          },
        }
        : {}),

      ...(filters?.startDate || filters?.endDate
        ? {
          date: {
            gte: filters?.startDate ? new Date(filters.startDate) : undefined,
            lte: filters?.endDate ? new Date(filters.endDate) : undefined,
          },
        }
        : {}),

      ...(filters?.fund && {
        funds: {
          some: {
            fund: {
              name: { contains: filters.fund },
            },
          },
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.airdrop.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: {
          createdByUser: true,
          posts: true,
          tags: true,
          funds: {
            where: { fund: { deletedAt: null } },
            include: { fund: true },
          },
        },
      }),
      this.prisma.airdrop.count({ where }),
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

  async create(data: {
    name: string;
    slug: string;
    logo?: string;
    description?: string;
    raise?: number;
    status?: string;
    date?: Date;
    createdBy: number;
    fundIds: number[];
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
        funds: {
          create: data.fundIds.map((id: number) => ({ fundId: id })),
        },
      },
      include: {
        createdByUser: true,
        funds: true
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
        funds: {
          where: {
            fund: {
              deletedAt: null,
            }
          },
          include: {
            fund: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.airdrop.findUnique({
      where: { id: Number(id) },
      include: {
        createdByUser: true,
        posts: true,
        tags: true,
        funds: true,
      },
    });
  }

  async updateById(id: number, updateDto: UpdateAirdropDto) {
    const airdrop = await this.prisma.airdrop.findUnique({ where: { id: Number(id) } });
    if (!airdrop) return null;

    return this.prisma.airdrop.update({
      where: { id: Number(id) },
      data: {
        name: updateDto.name ?? airdrop.name,
        logo: updateDto.logo ?? airdrop.logo,
        description: updateDto.description ?? airdrop.description,
        raise: updateDto.raise ?? airdrop.raise,
        status: updateDto.status ?? airdrop.status,
        date: updateDto.date ? new Date(updateDto.date) : airdrop.date,
        slug: updateDto.slug ?? airdrop.slug,
        funds: updateDto.fundIds
          ? {
            deleteMany: {}, // Xóa tất cả các liên kết hiện tại
            create: updateDto.fundIds.map((id: number) => ({ fundId: id })),
          }
          : undefined,
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
    return this.prisma.airdrop.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
    });
  }


  async findOneWithPosts(id: number) {
    if (!id) throw new Error('airdropId is required');

    return this.prisma.airdrop.findUnique({
      where: { id: Number(id) },
      include: {
        posts: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

}
