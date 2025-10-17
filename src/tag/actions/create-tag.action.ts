import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";


interface CreateTagDto {
  name: string;
}

@Injectable()
export class CreateTagAction {
  constructor(private prisma: PrismaService) { }

  async execute(data: CreateTagDto) {
    return await this.prisma.tag.create({
      data: {
        name: data.name
      },
    });
  }
}

