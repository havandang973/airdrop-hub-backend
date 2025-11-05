import { Injectable } from '@nestjs/common';
import { CreateFundDto } from '../api/dtos/create-fund.dto';
import { UpdateFundDto } from '../api/dtos/update-fund.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import slugify from 'slugify';

@Injectable()
export class FundQuery {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(filters: {
    name?: string;
    minRaise?: number;
    maxRaise?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }) {
    const {
      name,
      minRaise,
      maxRaise,
      status,
      startDate,
      endDate,
      page = 1,
      size = 10,
    } = filters;

    // Điều kiện lọc cho fund
    const whereFund: any = {
      deletedAt: null,
    };

    // Điều kiện lọc cho các airdrop trong fund
    const airdropWhere: any = {
      airdrop: {
        deletedAt: null,
        ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
        ...(status ? { status } : {}),
        ...(minRaise || maxRaise
          ? {
            raise: {
              ...(minRaise ? { gte: minRaise } : {}),
              ...(maxRaise ? { lte: maxRaise } : {}),
            },
          }
          : {}),
        ...(startDate || endDate
          ? {
            date: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
          : {}),
      },
    };

    const skip = (page - 1) * size;
    const take = size;

    // Lấy data & total song song
    const [data, total] = await Promise.all([
      this.prisma.funds.findMany({
        where: whereFund,
        include: {
          airdrops: {
            where: airdropWhere,
            include: { airdrop: true },
            orderBy: {
              airdrop: { createdAt: "desc" },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(take),
      }),

      this.prisma.funds.count({
        where: whereFund,
      }),
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



  async findBySlug(
    slug: string,
    filters: {
      name?: string;
      minRaise?: number;
      maxRaise?: number;
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      size?: number;
    },
  ) {
    const {
      name,
      minRaise,
      maxRaise,
      status,
      startDate,
      endDate,
      page = 1,
      size = 10,
    } = filters;

    // ✅ Điều kiện where cho airdrops
    const airdropWhere: any = {
      airdrop: {
        deletedAt: null,
        ...(name ? { name: { contains: name } } : {}),
        ...(status ? { status } : {}),
        ...(minRaise || maxRaise
          ? {
            raise: {
              ...(minRaise ? { gte: minRaise } : {}),
              ...(maxRaise ? { lte: maxRaise } : {}),
            },
          }
          : {}),
        ...(startDate || endDate
          ? {
            date: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
          : {}),
      },
    };

    const skip = (page - 1) * size;
    const take = size;

    // ✅ Lấy fund (chỉ 1)
    const fund = await this.prisma.funds.findUnique({
      where: { slug },
      include: {
        airdrops: {
          where: airdropWhere,
          include: { airdrop: true },
          orderBy: {
            airdrop: {
              createdAt: 'desc',
            },
          },
          skip,
          take,
        },
      },
    });

    if (!fund) return null;

    // ✅ Đếm tổng record để phân trang
    const total = await this.prisma.airdropFund.count({
      where: {
        fund: { slug },
        ...airdropWhere,
      },
    });

    return {
      data: fund,
      pagination: {
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
      },
    };
  }


  async findById(id: number) {
    return this.prisma.funds.findUnique({
      where: { id: Number(id) },
      include: {
        airdrops: {
          where: { airdrop: { deletedAt: null } },
          include: { airdrop: true },
        },
      },
    });
  }

  async create(dto: CreateFundDto) {
    return this.prisma.funds.create({
      data: {
        name: dto.name,
        logo: dto.logo,
        slug: slugify(dto.name, { lower: true, strict: true }),
        description: dto.description,
      },
    });
  }

  async updateById(id: number, dto: UpdateFundDto) {
    return this.prisma.funds.update({
      where: { id: Number(id) },
      data: {
        name: dto.name,
        logo: dto.logo,
        description: dto.description,
        updatedAt: new Date(),
      },
    });
  }

  async softDeleteById(id: number) {
    return this.prisma.funds.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  }
}
