import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirdropModule } from './airdrop/airdrop.module';
import { ConfigModule } from '@nestjs/config';
import { AirdropPostModule } from './airdrop-post/airdrop-post.module';
import { FundModule } from './fund/fund.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    AirdropModule,
    AirdropPostModule,
    FundModule,
    PostModule,
    CategoryModule,
    TagModule,
    ConfigModule.forRoot({
      isGlobal: true, // để dùng được ở mọi nơi
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
