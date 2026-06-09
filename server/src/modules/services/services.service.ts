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

type ServiceIdentitySource = {
  id: string;
  title: string;
  category: string;
};

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
    await this.assertServiceSlugAvailable(slug);

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
    const currentService = await this.findServiceIdentityOrThrow(serviceId);
    const nextSlug = createServiceSlug(
      data.title ?? currentService.title,
      data.category ?? currentService.category,
    );

    await this.assertServiceSlugAvailable(nextSlug, serviceId);

    const service = await this.prisma.service.update({
      where: { id: serviceId },
      data: {
        ...data,
        slug: nextSlug,
      },
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

  private async findServiceIdentityOrThrow(
    serviceId: string,
  ): Promise<ServiceIdentitySource> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        title: true,
        category: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  private async assertServiceSlugAvailable(
    slug: string,
    ignoredServiceId?: string,
  ): Promise<void> {
    const existingService = await this.prisma.service.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingService && existingService.id !== ignoredServiceId) {
      throw new ConflictException(
        'Service with the same title and category already exists',
      );
    }
  }
}
