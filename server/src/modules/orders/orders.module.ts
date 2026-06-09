import { Module } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TokensModule } from '../tokens/tokens.module';
import { AdminOrdersController } from './admin-orders.controller';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TokensModule],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService, JwtAuthGuard, AdminGuard],
})
export class OrdersModule {}
