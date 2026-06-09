import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import type {
  CreateReviewBody,
  GetReviewsQuery,
  ReviewDto,
  UpdateReviewBody,
} from '@shared/contracts/reviews';
import {
  reviewDtoSelect,
  type ReviewDtoSource,
  toReviewDto,
} from '../../common/mappers/review-dto.mapper';

const completedOwnedOrderSelect = {
  id: true,
  userId: true,
  serviceId: true,
  status: true,
} as const;

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicReviews(query: GetReviewsQuery): Promise<ReviewDto[]> {
    const reviews = await this.prisma.review.findMany({
      where: {
        ...(query.serviceId ? { serviceId: query.serviceId } : {}),
        service: {
          is: {
            status: 'active',
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      take: query.limit,
      select: reviewDtoSelect,
    });

    return reviews.map(toReviewDto);
  }

  async getUserReviews(userId: string): Promise<ReviewDto[]> {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
      select: reviewDtoSelect,
    });

    return reviews.map(toReviewDto);
  }

  async getAdminReviews(): Promise<ReviewDto[]> {
    const reviews = await this.prisma.review.findMany({
      orderBy: [{ createdAt: 'desc' }],
      select: reviewDtoSelect,
    });

    return reviews.map(toReviewDto);
  }

  async createReview(userId: string, data: CreateReviewBody): Promise<ReviewDto> {
    const order = await this.findCompletedOwnedOrderOrThrow(userId, data.orderId);

    if (!order.serviceId) {
      throw new ConflictException('Service is unavailable for review');
    }

    await this.assertReviewAvailableForOrder(order.id);

    const review = await this.prisma.review.create({
      data: {
        userId,
        serviceId: order.serviceId,
        orderId: order.id,
        rating: data.rating,
        comment: data.comment.trim(),
      },
      select: reviewDtoSelect,
    });

    return toReviewDto(review);
  }

  async updateUserReview(
    userId: string,
    reviewId: string,
    data: UpdateReviewBody,
  ): Promise<ReviewDto> {
    await this.findOwnedReviewOrThrow(userId, reviewId);

    const review = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        comment: data.comment.trim(),
      },
      select: reviewDtoSelect,
    });

    return toReviewDto(review);
  }

  async deleteUserReview(userId: string, reviewId: string): Promise<ReviewDto> {
    const review = await this.findOwnedReviewOrThrow(userId, reviewId);

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    return toReviewDto(review);
  }

  async updateAdminReview(
    reviewId: string,
    data: UpdateReviewBody,
  ): Promise<ReviewDto> {
    await this.findReviewOrThrow(reviewId);

    const review = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        comment: data.comment.trim(),
      },
      select: reviewDtoSelect,
    });

    return toReviewDto(review);
  }

  async deleteAdminReview(reviewId: string): Promise<ReviewDto> {
    const review = await this.findReviewOrThrow(reviewId);

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    return toReviewDto(review);
  }

  private async findCompletedOwnedOrderOrThrow(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        status: 'completed',
      },
      select: completedOwnedOrderSelect,
    });

    if (!order) {
      throw new NotFoundException('Completed order not found');
    }

    return order;
  }

  private async findOwnedReviewOrThrow(
    userId: string,
    reviewId: string,
  ): Promise<ReviewDtoSource> {
    const review = await this.prisma.review.findFirst({
      where: {
        id: reviewId,
        userId,
      },
      select: reviewDtoSelect,
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  private async findReviewOrThrow(reviewId: string): Promise<ReviewDtoSource> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: reviewDtoSelect,
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  private async assertReviewAvailableForOrder(orderId: string): Promise<void> {
    const existingReview = await this.prisma.review.findUnique({
      where: { orderId },
      select: { id: true },
    });

    if (existingReview) {
      throw new ConflictException('Review for this order already exists');
    }
  }
}
