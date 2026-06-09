import { z } from 'zod';
import { carBrandValues } from '../cars/car-catalog';

export const orderStatusValues = [
  'new',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export const orderStatusSchema = z.enum(orderStatusValues);

export const orderCustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
});

export const orderServiceSchema = z.object({
  id: z.string().nullable(),
  title: z.string(),
  category: z.string(),
  iconPath: z.string(),
  priceFrom: z.number().int(),
  durationLabel: z.string(),
});

export const orderCarSnapshotSchema = z.object({
  id: z.string(),
  brand: z.enum(carBrandValues),
  model: z.string(),
  year: z.number().int(),
  mileage: z.number().int(),
  plateNumber: z.string(),
  photoUrl: z.string().nullable(),
  createdAt: z.string(),
});

export const orderDtoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: orderStatusSchema,
  notes: z.string().nullable(),
  scheduledFor: z.string().nullable(),
  quotedPrice: z.number().int().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  customer: orderCustomerSchema,
  service: orderServiceSchema,
  carSnapshot: orderCarSnapshotSchema,
});

export const getOrdersResponseSchema = z.array(orderDtoSchema);
export const getOrderResponseSchema = orderDtoSchema;
export const deleteOrderResponseSchema = orderDtoSchema;

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderCustomer = z.infer<typeof orderCustomerSchema>;
export type OrderService = z.infer<typeof orderServiceSchema>;
export type OrderCarSnapshot = z.infer<typeof orderCarSnapshotSchema>;
export type OrderDto = z.infer<typeof orderDtoSchema>;
export type GetOrdersResponse = z.infer<typeof getOrdersResponseSchema>;
export type GetOrderResponse = z.infer<typeof getOrderResponseSchema>;
export type DeleteOrderResponse = z.infer<typeof deleteOrderResponseSchema>;
