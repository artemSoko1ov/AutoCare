import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from '@prisma/prisma.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { CarsModule } from './modules/cars/cars.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ServicesModule } from './modules/services/services.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [AuthModule, PrismaModule, ProfileModule, TokensModule, CarsModule, ReviewsModule, ServicesModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
