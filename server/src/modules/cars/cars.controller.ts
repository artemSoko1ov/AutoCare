import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateCarBodySchema,
  UpdateCarBodySchema,
  type CreateCarBody,
  type UpdateCarBody,
} from '@shared/contracts/cars';
import type { UserDto } from '@shared/contracts/auth';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CarsService } from './cars.service';

@Controller('cars')
@UseGuards(JwtAuthGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  getCars(@CurrentUser() user: UserDto) {
    return this.carsService.getCars(user.id);
  }

  @Get(':id')
  getCarById(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return this.carsService.getCarById(user.id, id);
  }

  @Post()
  createCar(
    @CurrentUser() user: UserDto,
    @Body(new ZodValidationPipe(CreateCarBodySchema)) data: CreateCarBody,
  ) {
    return this.carsService.createCar(user.id, data);
  }

  @Patch(':id')
  updateCar(
    @CurrentUser() user: UserDto,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCarBodySchema)) data: UpdateCarBody,
  ) {
    return this.carsService.updateCar(user.id, id, data);
  }

  @Delete(':id')
  deleteCar(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return this.carsService.deleteCar(user.id, id);
  }
}
