import { Controller, Get, Param } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  getServices() {
    return this.servicesService.getPublicServices();
  }

  @Get(':serviceId')
  getService(@Param('serviceId') serviceId: string) {
    return this.servicesService.getPublicServiceById(serviceId);
  }
}
