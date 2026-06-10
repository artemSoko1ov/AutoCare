import { Prisma } from '@prisma/client';
import type { ReviewDto } from '@shared/contracts/reviews';
import { isCarBrand } from '@shared/contracts/cars';

export const reviewDtoSelect = {
  id: true,
  userId: true,
  serviceId: true,
  orderId: true,
  rating: true,
  comment: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      username: true,
      avatarUrl: true,
    },
  },
  service: {
    select: {
      id: true,
      title: true,
      category: true,
      iconPath: true,
    },
  },
  order: {
    select: {
      id: true,
      status: true,
      scheduledFor: true,
      createdAt: true,
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
    },
  },
} satisfies Prisma.ReviewSelect;

export type ReviewDtoSource = Prisma.ReviewGetPayload<{
  select: typeof reviewDtoSelect;
}>;

export const toReviewDto = (review: ReviewDtoSource): ReviewDto => {
  if (!isCarBrand(review.order.carSnapshot.brand)) {
    throw new Error(
      `Unsupported car brand in review order snapshot: ${review.order.carSnapshot.brand}`,
    );
  }

  return {
    id: review.id,
    userId: review.userId,
    serviceId: review.serviceId,
    orderId: review.orderId,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
    author: {
      id: review.user.id,
      name: review.user.username,
      avatarUrl: review.user.avatarUrl,
    },
    service: {
      id: review.service.id,
      title: review.service.title,
      category: review.service.category,
      iconPath: review.service.iconPath,
    },
    order: {
      id: review.order.id,
      status: review.order.status,
      scheduledFor: review.order.scheduledFor?.toISOString() ?? null,
      createdAt: review.order.createdAt.toISOString(),
      carSnapshot: {
        id: review.order.carSnapshot.id,
        brand: review.order.carSnapshot.brand,
        model: review.order.carSnapshot.model,
        year: review.order.carSnapshot.year,
        mileage: review.order.carSnapshot.mileage,
        plateNumber: review.order.carSnapshot.plateNumber,
        photoUrl: review.order.carSnapshot.photoUrl,
        createdAt: review.order.carSnapshot.createdAt.toISOString(),
      },
    },
  };
};
