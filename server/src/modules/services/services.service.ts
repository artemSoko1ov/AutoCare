import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import type {
  CreateServiceBody,
  ServiceDto,
  UpdateServiceBody,
} from '@shared/contracts/services';
import {
  serviceDtoSelect,
  type ServiceDtoSource,
  toServiceDto,
} from '../../common/mappers/service-dto.mapper';
import { createServiceSlug } from './service-slug.util';

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

  async getPublicServiceById(serviceId: string): Promise<ServiceDto> {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        status: 'active',
      },
      select: serviceDtoSelect,
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return toServiceDto(service);
  }

  async getAdminServices(): Promise<ServiceDto[]> {
    const services = await this.prisma.service.findMany({
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      select: serviceDtoSelect,
    });

    return services.map(toServiceDto);
  }

  async createService(data: CreateServiceBody): Promise<ServiceDto> {
    const slug = createServiceSlug(data.title, data.category);
    const existingService = await this.prisma.service.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingService) {
      throw new ConflictException(
        'Service with the same title and category already exists',
      );
    }

    const service = await this.prisma.service.create({
      data: {
        ...data,
        slug,
      },
      select: serviceDtoSelect,
    });

    return toServiceDto(service);
  }

  async updateService(
    serviceId: string,
    data: UpdateServiceBody,
  ): Promise<ServiceDto> {
    await this.findServiceOrThrow(serviceId);

    const service = await this.prisma.service.update({
      where: { id: serviceId },
      data,
      select: serviceDtoSelect,
    });

    return toServiceDto(service);
  }

  async deleteService(serviceId: string): Promise<ServiceDto> {
    const service = await this.findServiceOrThrow(serviceId);

    await this.prisma.service.delete({
      where: { id: serviceId },
    });

    return toServiceDto(service);
  }

  private async findServiceOrThrow(
    serviceId: string,
  ): Promise<ServiceDtoSource> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: serviceDtoSelect,
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }
}
