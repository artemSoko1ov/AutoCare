import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: jest.Mocked<ServicesService>;

  beforeEach(() => {
    service = {
      getPublicServices: jest.fn(),
    } as unknown as jest.Mocked<ServicesService>;

    controller = new ServicesController(service);
  });

  it('delegates public list request to service', async () => {
    service.getPublicServices.mockResolvedValue([] as never);

    await expect(controller.getServices()).resolves.toEqual([]);
    expect(service.getPublicServices).toHaveBeenCalledTimes(1);
  });
});
