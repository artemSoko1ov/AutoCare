import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import type { UserDto } from '@shared/contracts/auth';
import {
  CreateOrderBodySchema,
  type CreateOrderBody,
} from '@shared/contracts/orders';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { OrdersService } from './orders.service';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders(@CurrentUser() user: UserDto) {
    return this.ordersService.getOrders(user.id);
  }

  @Get(':id')
  getOrderById(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return this.ordersService.getOrderById(user.id, id);
  }

  @Post()
  createOrder(
    @CurrentUser() user: UserDto,
    @Body(new ZodValidationPipe(CreateOrderBodySchema)) data: CreateOrderBody,
  ) {
    return this.ordersService.createOrder(user, data);
  }
}
