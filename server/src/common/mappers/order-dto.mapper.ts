import { Prisma } from '@prisma/client';
import type { OrderDto } from '@shared/contracts/orders';
import { isCarBrand } from '@shared/contracts/cars';

export const orderDtoSelect = {
  id: true,
  userId: true,
  status: true,
  notes: true,
  scheduledFor: true,
  quotedPrice: true,
  createdAt: true,
  updatedAt: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  serviceId: true,
  serviceTitle: true,
  serviceCategory: true,
  serviceIconPath: true,
  servicePriceFrom: true,
  serviceDurationLabel: true,
  carSnapshot: {
    select: {
      id: true,
      brand: true,
      model: true,
      year: true,
      mileage: true,
      plateNumber: true,
      photoUrl: true,
      createdAt: true,
    },
  },
} satisfies Prisma.OrderSelect;

export type OrderDtoSource = Prisma.OrderGetPayload<{
  select: typeof orderDtoSelect;
}>;

export const toOrderDto = (order: OrderDtoSource): OrderDto => {
  if (!isCarBrand(order.carSnapshot.brand)) {
    throw new Error(
      `Unsupported car brand in order snapshot: ${order.carSnapshot.brand}`,
    );
  }

  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    notes: order.notes,
    scheduledFor: order.scheduledFor?.toISOString() ?? null,
    quotedPrice: order.quotedPrice,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    customer: {
      id: order.userId,
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
    },
    service: {
      id: order.serviceId,
      title: order.serviceTitle,
      category: order.serviceCategory,
      iconPath: order.serviceIconPath,
      priceFrom: order.servicePriceFrom,
      durationLabel: order.serviceDurationLabel,
    },
    carSnapshot: {
      id: order.carSnapshot.id,
      brand: order.carSnapshot.brand,
      model: order.carSnapshot.model,
      year: order.carSnapshot.year,
      mileage: order.carSnapshot.mileage,
      plateNumber: order.carSnapshot.plateNumber,
      photoUrl: order.carSnapshot.photoUrl,
      createdAt: order.carSnapshot.createdAt.toISOString(),
    },
  };
};
