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
import { FundQuery } from '../queries/fund.query';
import { CreateFundDto } from './dtos/create-fund.dto';
import { UpdateFundDto } from './dtos/update-fund.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Controller('funds')
export class FundController {
  constructor(private readonly fundQuery: FundQuery) { }

  // ✅ Lấy danh sách tất cả Funds
  @Get()
  @UseGuards(ApiKeyGuard)
  async getAllFunds() {

    const funds = await this.fundQuery.findAll();
    return funds.map((fund) => ({
      id: fund.id,
      name: fund.name,
      logo: fund.logo,
      slug: fund.slug,
      description: fund.description,
      createdAt: fund.createdAt,
      updatedAt: fund.updatedAt,
      airdrops: fund.airdrops?.map((a) => ({
        id: a.airdrop.id,
        name: a.airdrop.name,
        logo: a.airdrop.logo,
      })) || [],
    }));
  }

  // ✅ Tạo mới Fund
  @Post()
  async createFund(@Body() dto: CreateFundDto) {
    const newFund = await this.fundQuery.create(dto);
    return {
      message: 'Fund created successfully!',
      data: newFund,
    };
  }

  // ✅ Lấy chi tiết Fund theo ID
  @Get(':slug')
  async findByslug(@Param('slug') slug: string) {
    const fund = await this.fundQuery.findBySlug(slug);
    if (!fund) {
      throw new NotFoundException(`Fund with slug "${slug}" not found`);
    }

    return {
      id: fund.id,
      name: fund.name,
      logo: fund.logo,
      description: fund.description,
      createdAt: fund.createdAt,
      updatedAt: fund.updatedAt,
      airdrops: fund.airdrops?.map((a) => a.airdrop) || [],
    };
  }

  // ✅ Cập nhật Fund theo ID
  @Put(':slug')
  async updateFund(
    @Param('slug') slug: string,
    @Body() updateDto: UpdateFundDto,
  ) {
    const fund = await this.fundQuery.findBySlug(slug);
    if (!fund) {
      throw new NotFoundException(`Fund with slug "${slug}" not found`);
    }

    const updated = await this.fundQuery.updateBySlug(slug, updateDto);
    return {
      message: 'Fund updated successfully!',
      data: updated,
    };
  }

  // ✅ Xóa mềm Fund (set deletedAt)
  @Delete(':slug')
  async deleteFund(@Param('slug') slug: string) {
    const fund = await this.fundQuery.findBySlug(slug);
    if (!fund) {
      throw new NotFoundException(`Fund with slug "${slug}" not found`);
    }

    await this.fundQuery.softDeleteBySlug(slug);
    return { message: 'Fund deleted successfully!' };
  }
}
