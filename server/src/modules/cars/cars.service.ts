import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import type {
  CarDto,
  CreateCarBody,
  UpdateCarBody,
} from '@shared/contracts/cars';
import {
  carDtoSelect,
  type CarDtoSource,
  toCarDto,
} from '../../common/mappers/car-dto.mapper';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCars(userId: string): Promise<CarDto[]> {
    const cars = await this.prisma.car.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
      select: carDtoSelect,
    });

    return cars.map(toCarDto);
  }

  async getCarById(userId: string, carId: string): Promise<CarDto> {
    const car = await this.findOwnedCar(userId, carId);
    return toCarDto(car);
  }

  async createCar(userId: string, data: CreateCarBody): Promise<CarDto> {
    try {
      const car = await this.prisma.car.create({
        data: {
          userId,
          brand: data.brand,
          model: data.model,
          year: data.year,
          licensePlate: data.licensePlate,
          vin: data.vin,
          mileage: data.mileage,
          photoUrl: data.photoUrl,
        },
        select: carDtoSelect,
      });

      return toCarDto(car);
    } catch (error) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  async updateCar(
    userId: string,
    carId: string,
    data: UpdateCarBody,
  ): Promise<CarDto> {
    await this.findOwnedCar(userId, carId);

    try {
      const car = await this.prisma.car.update({
        where: { id: carId },
        data,
        select: carDtoSelect,
      });

      return toCarDto(car);
    } catch (error) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  async deleteCar(userId: string, carId: string): Promise<CarDto> {
    const car = await this.findOwnedCar(userId, carId);

    await this.prisma.car.delete({
      where: { id: carId },
    });

    return toCarDto(car);
  }

  private async findOwnedCar(
    userId: string,
    carId: string,
  ): Promise<CarDtoSource> {
    const car = await this.prisma.car.findFirst({
      where: {
        id: carId,
        userId,
      },
      select: carDtoSelect,
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  private handleUniqueConstraintError(error: unknown): never | void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const rawTarget = error.meta?.target;
      const target = Array.isArray(rawTarget)
        ? rawTarget
            .filter((field): field is string => typeof field === 'string')
            .join(', ')
        : typeof rawTarget === 'string'
          ? rawTarget
          : '';

      if (target.includes('licensePlate')) {
        throw new ConflictException(
          'Car with this license plate already exists',
        );
      }

      if (target.includes('vin')) {
        throw new ConflictException('Car with this VIN already exists');
      }

      throw new ConflictException('Car with these fields already exists');
    }
  }
}
