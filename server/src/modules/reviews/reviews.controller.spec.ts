import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: jest.Mocked<ReviewsService>;

  beforeEach(() => {
    service = {
      getPublicReviews: jest.fn(),
      getUserReviews: jest.fn(),
      getAdminReviews: jest.fn(),
      createReview: jest.fn(),
      updateUserReview: jest.fn(),
      deleteUserReview: jest.fn(),
      updateAdminReview: jest.fn(),
      deleteAdminReview: jest.fn(),
    } as unknown as jest.Mocked<ReviewsService>;

    controller = new ReviewsController(service);
  });

  it('delegates public list request to service', async () => {
    service.getPublicReviews.mockResolvedValue([] as never);

    await expect(
      controller.getReviews({ serviceId: 'service-1', limit: 5 }),
    ).resolves.toEqual([]);
    expect(service.getPublicReviews).toHaveBeenCalledWith({
      serviceId: 'service-1',
      limit: 5,
    });
  });

  it('delegates current user reviews request to service', async () => {
    service.getUserReviews.mockResolvedValue([] as never);

    await expect(
      controller.getMyReviews({ id: 'user-1' } as never),
    ).resolves.toEqual([]);
    expect(service.getUserReviews).toHaveBeenCalledWith('user-1');
  });

  it('delegates create request to service', async () => {
    service.createReview.mockResolvedValue({ id: 'review-1' } as never);

    await expect(
      controller.createReview({ id: 'user-1' } as never, {
        orderId: 'order-1',
        rating: 5,
        comment: 'Подробный и полезный отзыв о работе сервиса.',
      }),
    ).resolves.toEqual({
      id: 'review-1',
    });
    expect(service.createReview).toHaveBeenCalledWith('user-1', {
      orderId: 'order-1',
      rating: 5,
      comment: 'Подробный и полезный отзыв о работе сервиса.',
    });
  });

  it('delegates update request to service', async () => {
    service.updateUserReview.mockResolvedValue({ id: 'review-1' } as never);

    await expect(
      controller.updateReview({ id: 'user-1' } as never, 'review-1', {
        rating: 4,
        comment: 'Обновленный отзыв после повторного визита.',
      }),
    ).resolves.toEqual({
      id: 'review-1',
    });
    expect(service.updateUserReview).toHaveBeenCalledWith(
      'user-1',
      'review-1',
      {
        rating: 4,
        comment: 'Обновленный отзыв после повторного визита.',
      },
    );
  });

  it('delegates delete request to service', async () => {
    service.deleteUserReview.mockResolvedValue({ id: 'review-1' } as never);

    await expect(
      controller.deleteReview({ id: 'user-1' } as never, 'review-1'),
    ).resolves.toEqual({
      id: 'review-1',
    });
    expect(service.deleteUserReview).toHaveBeenCalledWith('user-1', 'review-1');
  });
});
