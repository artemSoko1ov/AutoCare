import { AdminReviewsController } from './admin-reviews.controller';
import { ReviewsService } from './reviews.service';

describe('AdminReviewsController', () => {
  let controller: AdminReviewsController;
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

    controller = new AdminReviewsController(service);
  });

  it('delegates admin list request to service', async () => {
    service.getAdminReviews.mockResolvedValue([] as never);

    await expect(controller.getReviews()).resolves.toEqual([]);
    expect(service.getAdminReviews).toHaveBeenCalledTimes(1);
  });

  it('delegates admin update request to service', async () => {
    service.updateAdminReview.mockResolvedValue({ id: 'review-1' } as never);

    await expect(
      controller.updateReview('review-1', {
        rating: 4,
        comment: 'Комментарий обновлен администратором.',
      }),
    ).resolves.toEqual({
      id: 'review-1',
    });
    expect(service.updateAdminReview).toHaveBeenCalledWith('review-1', {
      rating: 4,
      comment: 'Комментарий обновлен администратором.',
    });
  });

  it('delegates admin delete request to service', async () => {
    service.deleteAdminReview.mockResolvedValue({ id: 'review-1' } as never);

    await expect(controller.deleteReview('review-1')).resolves.toEqual({
      id: 'review-1',
    });
    expect(service.deleteAdminReview).toHaveBeenCalledWith('review-1');
  });
});
