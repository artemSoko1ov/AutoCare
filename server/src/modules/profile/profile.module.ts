import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TokensModule } from '../tokens/tokens.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [TokensModule],
  controllers: [ProfileController],
  providers: [ProfileService, JwtAuthGuard],
})
export class ProfileModule {}
