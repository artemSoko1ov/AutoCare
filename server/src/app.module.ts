import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from '@prisma/prisma.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TokensModule } from './modules/tokens/tokens.module';

@Module({
  imports: [AuthModule, PrismaModule, ProfileModule, TokensModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
