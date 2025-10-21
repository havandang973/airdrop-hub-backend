import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";
import { CreateFundDto } from "../api/dtos/create-fund.dto";

@Injectable()
export class CreateFundAction {
  constructor(private prisma: PrismaService) { }

  async execute(data: CreateFundDto) {

  }
}

