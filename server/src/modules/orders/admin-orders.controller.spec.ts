import { AdminOrdersController } from './admin-orders.controller';
import { OrdersService } from './orders.service';

describe('AdminOrdersController', () => {
  let controller: AdminOrdersController;
  let service: jest.Mocked<OrdersService>;

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

    controller = new AdminOrdersController(service);
  });

  it('delegates admin list request to service', async () => {
    service.getAdminOrders.mockResolvedValue([] as never);

    await expect(controller.getOrders()).resolves.toEqual([]);
    expect(service.getAdminOrders).toHaveBeenCalledTimes(1);
  });

  it('delegates admin get by id request to service', async () => {
    service.getAdminOrderById.mockResolvedValue({ id: 'order-1' } as never);

    await expect(controller.getOrderById('order-1')).resolves.toEqual({
      id: 'order-1',
    });
    expect(service.getAdminOrderById).toHaveBeenCalledWith('order-1');
  });

  it('delegates admin update request to service', async () => {
    service.updateOrder.mockResolvedValue({ id: 'order-1' } as never);

    await expect(
      controller.updateOrder('order-1', {
        status: 'confirmed',
      }),
    ).resolves.toEqual({ id: 'order-1' });
    expect(service.updateOrder).toHaveBeenCalledWith('order-1', {
      status: 'confirmed',
    });
  });

  it('delegates admin delete request to service', async () => {
    service.deleteOrder.mockResolvedValue({ id: 'order-1' } as never);

    await expect(controller.deleteOrder('order-1')).resolves.toEqual({
      id: 'order-1',
    });
    expect(service.deleteOrder).toHaveBeenCalledWith('order-1');
  });
});
