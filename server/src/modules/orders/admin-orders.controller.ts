import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  UpdateOrderBodySchema,
  type UpdateOrderBody,
} from '@shared/contracts/orders';
import { AdminGuard } from '../../common/guards/admin.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { OrdersService } from './orders.service';

@Controller('admin/requests')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders() {
    return this.ordersService.getAdminOrders();
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getAdminOrderById(id);
  }

  @Patch(':id')
  updateOrder(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateOrderBodySchema)) data: UpdateOrderBody,
  ) {
    return this.ordersService.updateOrder(id, data);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
