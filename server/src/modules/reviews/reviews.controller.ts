import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { UserDto } from '@shared/contracts/auth';
import {
  CreateReviewBodySchema,
  GetReviewsQuerySchema,
  UpdateReviewBodySchema,
  type CreateReviewBody,
  type GetReviewsQuery,
  type UpdateReviewBody,
} from '@shared/contracts/reviews';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getReviews(
    @Query(new ZodValidationPipe(GetReviewsQuerySchema)) query: GetReviewsQuery,
  ) {
    return this.reviewsService.getPublicReviews(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyReviews(@CurrentUser() user: UserDto) {
    return this.reviewsService.getUserReviews(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createReview(
    @CurrentUser() user: UserDto,
    @Body(new ZodValidationPipe(CreateReviewBodySchema)) data: CreateReviewBody,
  ) {
    return this.reviewsService.createReview(user.id, data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateReview(
    @CurrentUser() user: UserDto,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateReviewBodySchema)) data: UpdateReviewBody,
  ) {
    return this.reviewsService.updateUserReview(user.id, id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteReview(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return this.reviewsService.deleteUserReview(user.id, id);
  }
}
