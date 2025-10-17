import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirdropModule } from './airdrop/airdrop.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AirdropModule,
    ConfigModule.forRoot({
      isGlobal: true, // để dùng được ở mọi nơi
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
