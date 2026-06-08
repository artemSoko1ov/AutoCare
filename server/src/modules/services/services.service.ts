import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import type { ServiceDto } from '@shared/contracts/services';
import {
  serviceDtoSelect,
  toServiceDto,
} from '../../common/mappers/service-dto.mapper';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicServices(): Promise<ServiceDto[]> {
    const services = await this.prisma.service.findMany({
      where: { status: 'active' },
      orderBy: [{ category: 'asc' }, { priceFrom: 'asc' }, { title: 'asc' }],
      select: serviceDtoSelect,
    });

    return services.map(toServiceDto);
  }
}
