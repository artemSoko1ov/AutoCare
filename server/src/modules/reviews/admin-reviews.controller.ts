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
  UpdateReviewBodySchema,
  type UpdateReviewBody,
} from '@shared/contracts/reviews';
import { AdminGuard } from '../../common/guards/admin.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ReviewsService } from './reviews.service';

@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getReviews() {
    return this.reviewsService.getAdminReviews();
  }

  @Patch(':id')
  updateReview(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateReviewBodySchema)) data: UpdateReviewBody,
  ) {
    return this.reviewsService.updateAdminReview(id, data);
  }

  @Delete(':id')
  deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteAdminReview(id);
  }
}
