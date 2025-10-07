import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { Platform } from "src/common/lib/enums/platform";
import { KycStatus } from "../enums/kyc-status";
import { EncodeService } from "src/common/encode";
import { PaginationRequest } from "src/common/pagination/pagination.request";
import { PrismaService } from "src/common/services/prisma.service";

@Injectable()
export class UserQuery {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encode: EncodeService,
  ) { }

  async getById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getByPlatform(platform: string, platformId: string): Promise<User> {
    if (!platform || !platformId) {
      return null;
    }

    return await this.prisma.user.findFirst({
      where: {
        platform: platform, platformId: platformId
      }
    });
  }

  async getByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: { email }
    })
  }

  async getByReferralCode(code: string) {
    if (!code) {
      return null;
    }

    const [platform, encodedId] = code.split('_');

    if (!encodedId) {
      return null;
    }

    const userId = this.encode.decodeId(encodedId);

    if (userId) {
      return await this.getById(userId);
    }

    return await this.getByPlatform(Platform.Telegram, encodedId)
  }

  async findFriendsByUser(
    user: User,
    pagination: PaginationRequest
  ) {
    const conditions: any = {
      where: {
        referredBy: user.id
      }
    }

    const total = await this.prisma.user.count(conditions)

    const users = await this.prisma.user.findMany({
      ...conditions,
      orderBy: {
        id: 'desc'
      },
      skip: (pagination.page - 1) * pagination.size,
      take: pagination.size
    })

    return {
      data: users,
      total,
      size: pagination.size,
      currentPage: pagination.page,
      lastPage: Math.ceil(total / pagination.size)
    }
  }

  async markAsKycStatus(user: User, status: KycStatus) {
    return await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        kycStatus: status,
        updatedAt: new Date,
      }
    })
  }
}
