import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TokensModule } from '../tokens/tokens.module';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  imports: [TokensModule],
  controllers: [CarsController],
  providers: [CarsService, JwtAuthGuard],
})
export class CarsModule {}
