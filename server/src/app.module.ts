import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaConnectionExceptionFilter } from './common/filters/prisma-connection-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from '@prisma/prisma.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { CarsModule } from './modules/cars/cars.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ServicesModule } from './modules/services/services.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ProfileModule,
    TokensModule,
    CarsModule,
    ReviewsModule,
    ServicesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaConnectionExceptionFilter,
    },
  ],
})
export class AppModule {}
