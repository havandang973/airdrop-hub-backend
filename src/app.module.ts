import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirdropModule } from './airdrop/airdrop.module';
import { ConfigModule } from '@nestjs/config';
import { AirdropPostModule } from './airdrop-post/airdrop-post.module';
import { FundModule } from './fund/fund.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    AirdropModule,
    AirdropPostModule,
    FundModule,
    PostModule,
    ConfigModule.forRoot({
      isGlobal: true, // để dùng được ở mọi nơi
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
