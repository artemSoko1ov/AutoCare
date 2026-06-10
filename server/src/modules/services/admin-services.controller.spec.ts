import { AdminServicesController } from './admin-services.controller';
import { ServicesService } from './services.service';

describe('AdminServicesController', () => {
  let controller: AdminServicesController;
  let service: jest.Mocked<ServicesService>;

  beforeEach(() => {
    service = {
      getAdminServices: jest.fn(),
      createService: jest.fn(),
      updateService: jest.fn(),
      deleteService: jest.fn(),
    } as unknown as jest.Mocked<ServicesService>;

    controller = new AdminServicesController(service);
  });

  it('delegates admin list request to service', async () => {
    service.getAdminServices.mockResolvedValue([] as never);

    await expect(controller.getServices()).resolves.toEqual([]);
    expect(service.getAdminServices).toHaveBeenCalledTimes(1);
  });

  it('delegates create request to service', async () => {
    const payload = {
      title: 'Диагностика перед покупкой',
      category: 'Диагностика',
      summary: 'Проверим кузов, технику и историю автомобиля перед сделкой.',
      iconPath: '/icons/services/magnifying-glass-plus.svg',
      priceFrom: 3500,
      durationLabel: '2 часа',
      includedItems: [
        'Проверка кузова и лакокрасочного покрытия.',
        'Диагностика основных электронных систем.',
        'Рекомендации по рискам перед покупкой.',
      ],
      workflowSteps: [
        'Сначала уточняем, какой автомобиль планируете смотреть.',
        'Потом проводим диагностику и фиксируем замечания.',
        'В конце выдаем понятное заключение по состоянию авто.',
      ],
      status: 'active' as const,
    };

    service.createService.mockResolvedValue({ id: 'service-1' } as never);

    await expect(controller.createService(payload)).resolves.toEqual({
      id: 'service-1',
    });
    expect(service.createService).toHaveBeenCalledWith(payload);
  });

  it('delegates update request to service', async () => {
    service.updateService.mockResolvedValue({ id: 'service-1' } as never);

    await expect(
      controller.updateService('service-1', {
        status: 'hidden',
      }),
    ).resolves.toEqual({ id: 'service-1' });
    expect(service.updateService).toHaveBeenCalledWith('service-1', {
      status: 'hidden',
    });
  });

  it('delegates delete request to service', async () => {
    service.deleteService.mockResolvedValue({ id: 'service-1' } as never);

    await expect(controller.deleteService('service-1')).resolves.toEqual({
      id: 'service-1',
    });
    expect(service.deleteService).toHaveBeenCalledWith('service-1');
  });
});
