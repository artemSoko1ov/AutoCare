import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  UpdateProfileBodySchema,
  type UpdateProfileBody,
  type UserDto,
} from '@shared/contracts/auth';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@CurrentUser() user: UserDto) {
    return this.profileService.getProfile(user.id);
  }

  @Patch()
  updateProfile(
    @CurrentUser() user: UserDto,
    @Body(new ZodValidationPipe(UpdateProfileBodySchema))
    data: UpdateProfileBody,
  ) {
    return this.profileService.updateProfile(user.id, data);
  }
}
