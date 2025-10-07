import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // constructor() {
  //   super({
  //     log: [
  //       { emit: 'stdout', level: 'query' },
  //       { emit: 'stdout', level: 'info' },
  //       { emit: 'stdout', level: 'warn' },
  //       { emit: 'stdout', level: 'error' },
  //     ],
  //   });
  // }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // static async transaction(prisma: PrismaService, callback) {
  //   try {
  //     await prisma.$transaction(async (tx) => {
  //       await callback(tx);
  //       throw new Error("Rollback");
  //     });
  //   } catch (error) {
  //     console.log("Catch error: " + error.message);
  //   }
  // };
}
