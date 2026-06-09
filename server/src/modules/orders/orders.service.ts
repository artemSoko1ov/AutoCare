import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import type { UserDto } from '@shared/contracts/auth';
import type {
  CreateOrderBody,
  OrderDto,
  UpdateOrderBody,
} from '@shared/contracts/orders';
import {
  orderDtoSelect,
  type OrderDtoSource,
  toOrderDto,
} from '../../common/mappers/order-dto.mapper';

const activeServiceSelect = {
  id: true,
  title: true,
  category: true,
  iconPath: true,
  priceFrom: true,
  durationLabel: true,
} as const;

const ownedCarSelect = {
  id: true,
  brand: true,
  model: true,
  year: true,
  mileage: true,
  licensePlate: true,
  photoUrl: true,
} as const;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrders(userId: string): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
      select: orderDtoSelect,
    });

    return orders.map(toOrderDto);
  }

  async getOrderById(userId: string, orderId: string): Promise<OrderDto> {
    const order = await this.findOwnedOrderOrThrow(userId, orderId);
    return toOrderDto(order);
  }

  async getAdminOrders(): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: [{ createdAt: 'desc' }],
      select: orderDtoSelect,
    });

    return orders.map(toOrderDto);
  }

  async getAdminOrderById(orderId: string): Promise<OrderDto> {
    const order = await this.findOrderOrThrow(orderId);
    return toOrderDto(order);
  }

  async createOrder(user: UserDto, data: CreateOrderBody): Promise<OrderDto> {
    const [car, service] = await Promise.all([
      this.findOwnedCarOrThrow(user.id, data.carId),
      this.findActiveServiceOrThrow(data.serviceId),
    ]);

    const order = await this.prisma.$transaction(async (transaction) => {
      const carSnapshot = await transaction.carSnapshot.create({
        data: {
          sourceCarId: car.id,
          brand: car.brand,
          model: car.model,
          year: car.year,
          mileage: car.mileage,
          plateNumber: car.licensePlate,
          photoUrl: car.photoUrl,
        },
        select: {
          id: true,
        },
      });

      return transaction.order.create({
        data: {
          userId: user.id,
          serviceId: service.id,
          carSnapshotId: carSnapshot.id,
          customerName: user.username,
          customerEmail: user.email,
          customerPhone: user.phone,
          serviceTitle: service.title,
          serviceCategory: service.category,
          serviceIconPath: service.iconPath,
          servicePriceFrom: service.priceFrom,
          serviceDurationLabel: service.durationLabel,
          notes: data.notes ?? null,
          scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
          quotedPrice: null,
        },
        select: orderDtoSelect,
      });
    });

    return toOrderDto(order);
  }

  async updateOrder(orderId: string, data: UpdateOrderBody): Promise<OrderDto> {
    await this.findOrderOrThrow(orderId);

    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.quotedPrice !== undefined
          ? { quotedPrice: data.quotedPrice }
          : {}),
        ...(data.scheduledFor !== undefined
          ? {
              scheduledFor: data.scheduledFor
                ? new Date(data.scheduledFor)
                : null,
            }
          : {}),
      },
      select: orderDtoSelect,
    });

    return toOrderDto(order);
  }

  async deleteOrder(orderId: string): Promise<OrderDto> {
    const order = await this.findOrderOrThrow(orderId);

    await this.prisma.$transaction(async (transaction) => {
      await transaction.order.delete({
        where: { id: orderId },
      });

      await transaction.carSnapshot.delete({
        where: { id: order.carSnapshot.id },
      });
    });

    return toOrderDto(order);
  }

  private async findOwnedCarOrThrow(userId: string, carId: string) {
    const car = await this.prisma.car.findFirst({
      where: {
        id: carId,
        userId,
      },
      select: ownedCarSelect,
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  private async findActiveServiceOrThrow(serviceId: string) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        status: 'active',
      },
      select: activeServiceSelect,
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  private async findOwnedOrderOrThrow(
    userId: string,
    orderId: string,
  ): Promise<OrderDtoSource> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      select: orderDtoSelect,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  private async findOrderOrThrow(orderId: string): Promise<OrderDtoSource> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: orderDtoSelect,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
