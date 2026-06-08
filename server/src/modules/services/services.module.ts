import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { AdminGuard } from '../../common/guards/admin.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TokensModule } from '../tokens/tokens.module';
import { AdminServicesController } from './admin-services.controller';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';

@Module({
  imports: [PrismaModule, TokensModule],
  controllers: [ServicesController, AdminServicesController],
  providers: [ServicesService, JwtAuthGuard, AdminGuard],
})
export class ServicesModule {}
