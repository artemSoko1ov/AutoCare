import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { AdminGuard } from '../../common/guards/admin.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TokensModule } from '../tokens/tokens.module';
import { AdminReviewsController } from './admin-reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [PrismaModule, TokensModule],
  controllers: [ReviewsController, AdminReviewsController],
  providers: [ReviewsService, JwtAuthGuard, AdminGuard],
})
export class ReviewsModule {}
