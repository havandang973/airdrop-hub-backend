import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";
import { CreateAirdropDto } from "../api/dtos/create-airdrop.dto";

@Injectable()
export class CreateAirdropAction {
  constructor(private prisma: PrismaService) { }

  async execute(data: CreateAirdropDto) {
    return await this.prisma.airdrop.create({
      data: {
        name: data.name,
        logo: data.logo ?? "",
        description: data.description ?? "",
        slug: data.slug,
        raise: data.raise ?? 0,
        status: data.status ?? "draft",
        date: data.date ?? new Date(),
        createdBy: data.createdBy,
      },
    });
  }
}

