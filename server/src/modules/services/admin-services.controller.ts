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
  CreateServiceBodySchema,
  UpdateServiceBodySchema,
  type CreateServiceBody,
  type UpdateServiceBody,
} from '@shared/contracts/services';
import { AdminGuard } from '../../common/guards/admin.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ServicesService } from './services.service';

@Controller('admin/services')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  getServices() {
    return this.servicesService.getAdminServices();
  }

  @Post()
  createService(
    @Body(new ZodValidationPipe(CreateServiceBodySchema))
    data: CreateServiceBody,
  ) {
    return this.servicesService.createService(data);
  }

  @Patch(':id')
  updateService(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateServiceBodySchema))
    data: UpdateServiceBody,
  ) {
    return this.servicesService.updateService(id, data);
  }

  @Delete(':id')
  deleteService(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }
}
