import type { UserDto } from '@shared/contracts/auth';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<OrdersService>;

  const user = {
    id: 'user-1',
    email: 'user@example.com',
    username: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    avatarUrl: null,
    role: 'USER',
    createdAt: '2026-06-09T08:00:00.000Z',
    updatedAt: '2026-06-09T08:00:00.000Z',
  } satisfies UserDto;

  beforeEach(() => {
    service = {
      getOrders: jest.fn(),
      getOrderById: jest.fn(),
      getAdminOrders: jest.fn(),
      getAdminOrderById: jest.fn(),
      createOrder: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn(),
    } as unknown as jest.Mocked<OrdersService>;

    controller = new OrdersController(service);
  });

  it('delegates list request to service', async () => {
    service.getOrders.mockResolvedValue([] as never);

    await expect(controller.getOrders(user)).resolves.toEqual([]);
    expect(service.getOrders).toHaveBeenCalledWith('user-1');
  });

  it('delegates get by id request to service', async () => {
    service.getOrderById.mockResolvedValue({ id: 'order-1' } as never);

    await expect(controller.getOrderById(user, 'order-1')).resolves.toEqual({
      id: 'order-1',
    });
    expect(service.getOrderById).toHaveBeenCalledWith('user-1', 'order-1');
  });

  it('delegates create request to service', async () => {
    const payload = {
      serviceId: 'service-1',
      carId: 'car-1',
      notes: 'Нужно проверить автомобиль до выходных',
      scheduledFor: '2026-06-12T09:30:00.000Z',
    };

    service.createOrder.mockResolvedValue({ id: 'order-1' } as never);

    await expect(controller.createOrder(user, payload)).resolves.toEqual({
      id: 'order-1',
    });
    expect(service.createOrder).toHaveBeenCalledWith(user, payload);
  });
});
