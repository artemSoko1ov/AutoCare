import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

describe('CarsController', () => {
  let controller: CarsController;
  let service: jest.Mocked<CarsService>;

  beforeEach(() => {
    service = {
      getCars: jest.fn(),
      getCarById: jest.fn(),
      createCar: jest.fn(),
      updateCar: jest.fn(),
      deleteCar: jest.fn(),
    } as unknown as jest.Mocked<CarsService>;

    controller = new CarsController(service);
  });

  it('delegates list request to service', async () => {
    service.getCars.mockResolvedValue([]);

    await expect(
      controller.getCars({ id: 'user-1' } as never),
    ).resolves.toEqual([]);
    expect(service.getCars).toHaveBeenCalledWith('user-1');
  });

  it('delegates get by id request to service', async () => {
    service.getCarById.mockResolvedValue({ id: 'car-1' } as never);

    await expect(
      controller.getCarById({ id: 'user-1' } as never, 'car-1'),
    ).resolves.toEqual({ id: 'car-1' });
    expect(service.getCarById).toHaveBeenCalledWith('user-1', 'car-1');
  });

  it('delegates create request to service', async () => {
    service.createCar.mockResolvedValue({ id: 'car-1' } as never);

    await expect(
      controller.createCar(
        { id: 'user-1' } as never,
        {
          brand: 'Toyota',
          model: 'Camry',
          year: 2018,
          licensePlate: 'A123BC77',
          vin: null,
          mileage: 65000,
          photoUrl: null,
        },
      ),
    ).resolves.toEqual({ id: 'car-1' });
    expect(service.createCar).toHaveBeenCalledWith('user-1', {
      brand: 'Toyota',
      model: 'Camry',
      year: 2018,
      licensePlate: 'A123BC77',
      vin: null,
      mileage: 65000,
      photoUrl: null,
    });
  });

  it('delegates update request to service', async () => {
    service.updateCar.mockResolvedValue({ id: 'car-1' } as never);

    await expect(
      controller.updateCar({ id: 'user-1' } as never, 'car-1', {
        mileage: 70000,
      }),
    ).resolves.toEqual({ id: 'car-1' });
    expect(service.updateCar).toHaveBeenCalledWith('user-1', 'car-1', {
      mileage: 70000,
    });
  });

  it('delegates delete request to service', async () => {
    service.deleteCar.mockResolvedValue({ id: 'car-1' } as never);

    await expect(
      controller.deleteCar({ id: 'user-1' } as never, 'car-1'),
    ).resolves.toEqual({ id: 'car-1' });
    expect(service.deleteCar).toHaveBeenCalledWith('user-1', 'car-1');
  });
});
