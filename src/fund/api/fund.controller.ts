import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
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
  async getAllFunds(
    @Query('name') name?: string,
    @Query('fund') fund?: string,
    @Query('minRaise') minRaise?: string,
    @Query('maxRaise') maxRaise?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('size') size?: number
  ) {

    const { data, pagination } = await this.fundQuery.findAll({
      name,
      fund,
      minRaise: Number(minRaise),
      maxRaise: Number(maxRaise),
      status,
      startDate,
      endDate,
      page: Number(page),
      size: Number(size)
    });

    const formattedData = data.map((fund) => ({
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

    return {
      data: formattedData,
      pagination,
    };
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
  @Get(':identifier')
  async findByIdOrSlug(
    @Param('identifier') identifier: string,
    @Query('name') name?: string,
    @Query('minRaise') minRaise?: string,
    @Query('maxRaise') maxRaise?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('size') size?: number
  ) {
    const isNumeric = /^\d+$/.test(identifier);

    const fund: any = isNumeric
      ? await this.fundQuery.findById(Number(identifier))
      : await this.fundQuery.findBySlug(identifier, { name, minRaise: Number(minRaise), maxRaise: Number(maxRaise), status, startDate, endDate, page: Number(page), size: Number(size) });

    if (!fund) {
      throw new NotFoundException(`Fund with "${identifier}" not found`);
    }

    return {
      id: fund?.data?.id,
      name: fund?.data?.name,
      logo: fund?.data?.logo,
      description: fund?.data?.description,
      createdAt: fund?.data?.createdAt,
      updatedAt: fund?.data?.updatedAt,
      airdrops: fund?.data?.airdrops?.map((a) => a.airdrop) || [],
      pagination: fund?.pagination
    };
  }


  // ✅ Cập nhật Fund theo ID
  @Put(':id')
  async updateFund(
    @Param('id') id: number,
    @Body() updateDto: UpdateFundDto,
  ) {
    const fund = await this.fundQuery.findById(id);
    if (!fund) {
      throw new NotFoundException(`Fund with id "${id}" not found`);
    }

    const updated = await this.fundQuery.updateById(id, updateDto);
    return {
      message: 'Fund updated successfully!',
      data: updated,
    };
  }

  // ✅ Xóa mềm Fund (set deletedAt)
  @Delete(':id')
  async deleteFund(@Param('id') id: number) {
    const fund = await this.fundQuery.findById(id);
    if (!fund) {
      throw new NotFoundException(`Fund with Id "${id}" not found`);
    }

    await this.fundQuery.softDeleteById(id);
    return { message: 'Fund deleted successfully!' };
  }
}
