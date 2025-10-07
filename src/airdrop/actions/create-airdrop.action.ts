import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";


interface CreateAirdropDto {
  title: string;
  slug: string;
  content?: string;
  avatar?: string;
  createdBy: number; // user.id
  categoryId?: number;
  status?: string; // draft | published
  totalRaise?: number;
}

@Injectable()
export class CreateAirdropAction {
  constructor(private prisma: PrismaService) { }

  async execute(data: CreateAirdropDto) {
    return await this.prisma.airdrops.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content ?? "",
        avatar: data.avatar ?? "",
        created_by: data.createdBy,
        category_id: data.categoryId ?? null,
        status: data.status,
        total_raise: data.totalRaise ?? 0,
        created_at: new Date()
      },
    });
  }
}


