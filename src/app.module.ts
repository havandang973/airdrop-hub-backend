import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirdropModule } from './airdrop/airdrop.module';
import { ConfigModule } from '@nestjs/config';
import { AirdropPostModule } from './airdrop-post/airdrop-post.module';
import { FundModule } from './fund/fund.module';

@Module({
  imports: [
    AirdropModule,
    AirdropPostModule,
    FundModule,
    ConfigModule.forRoot({
      isGlobal: true, // để dùng được ở mọi nơi
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
