import { Injectable } from '@nestjs/common';
import { CreateFundDto } from '../api/dtos/create-fund.dto';
import { UpdateFundDto } from '../api/dtos/update-fund.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import slugify from 'slugify';

@Injectable()
export class FundQuery {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.funds.findMany({
      where: { deletedAt: null },
      include: {
        airdrops: {
          include: {
            airdrop: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.funds.findUnique({
      where: { slug },
      include: {
        airdrops: {
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

  async updateBySlug(slug: string, dto: UpdateFundDto) {
    return this.prisma.funds.update({
      where: { slug },
      data: {
        name: dto.name,
        logo: dto.logo,
        description: dto.description,
        updatedAt: new Date(),
      },
    });
  }

  async softDeleteBySlug(slug: string) {
    return this.prisma.funds.update({
      where: { slug },
      data: { deletedAt: new Date() },
    });
  }
}
