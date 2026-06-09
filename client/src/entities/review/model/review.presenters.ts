import type { ReviewDto } from "@shared/contracts/reviews";
import type { IconName } from "@/shared/ui/Icon";
import { formatReviewDate } from "./review.formatters";

type ReviewAccent = "blue" | "green" | "amber" | "violet" | "rose" | "slate";

export type ServiceReviewCardItem = {
  id: string;
  author: string;
  car: string;
  date: string;
  rating: number;
  text: string;
};

export type ProfileReviewItem = {
  id: string;
  title: string;
  date: string;
  rating: number;
  text: string;
  icon: IconName;
  accent: ReviewAccent;
  to: string;
};

export type ProfileReviewsSection = {
  title: string;
  actionLabel?: string;
  actionTo?: string;
  items: ProfileReviewItem[];
};

export type ProfileReviewsPageStatItem = {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: IconName;
  accent: ReviewAccent;
};

export type ProfileReviewsPageData = {
  title: string;
  description: string;
  stats: ProfileReviewsPageStatItem[];
  section: ProfileReviewsSection;
};

const accents: ReviewAccent[] = ["amber", "blue", "slate", "green", "violet", "rose"];

const getAccent = (index: number): ReviewAccent => {
  return accents[index % accents.length] ?? "amber";
};

const getCarLabel = (review: ReviewDto) =>
  `${review.order.carSnapshot.brand} ${review.order.carSnapshot.model}, ${review.order.carSnapshot.year}`;

const getServiceIcon = (): IconName => "wrench";

const getAverageRating = (reviews: ReviewDto[]) => {
  if (reviews.length === 0) {
    return "0.0";
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1);
};

export const createServiceReviewItems = (reviews: ReviewDto[]): ServiceReviewCardItem[] => {
  return reviews.map((review) => ({
    id: review.id,
    author: review.author.name,
    car: getCarLabel(review),
    date: formatReviewDate(review.createdAt),
    rating: review.rating,
    text: review.comment,
  }));
};

export const createProfileReviewsSection = (reviews: ReviewDto[]): ProfileReviewsSection => {
  return {
    title: "Последние отзывы",
    actionLabel: "Все отзывы",
    actionTo: "/profile/reviews",
    items: reviews.slice(0, 3).map((review, index) => ({
      id: review.id,
      title: review.service.title,
      date: formatReviewDate(review.createdAt),
      rating: review.rating,
      text: review.comment,
      icon: getServiceIcon(),
      accent: getAccent(index),
      to: `/profile/requests/${review.order.id}`,
    })),
  };
};

export const createProfileReviewsPageData = (reviews: ReviewDto[]): ProfileReviewsPageData => {
  const fiveStarCount = reviews.filter((review) => review.rating === 5).length;

  return {
    title: "Мои отзывы",
    description:
      "Здесь собраны все ваши отзывы по завершенным заявкам. В карточке можно быстро перейти к исходной заявке и при необходимости обновить комментарий.",
    stats: [
      {
        id: "reviews-total",
        value: String(reviews.length),
        label: "Отзывов всего",
        description: "Все оценки и комментарии, оставленные из профиля",
        icon: "star",
        accent: "violet",
      },
      {
        id: "reviews-average",
        value: getAverageRating(reviews),
        label: "Средняя оценка",
        description: "Средний рейтинг по вашим завершенным обращениям",
        icon: "check-circle",
        accent: "green",
      },
      {
        id: "reviews-five-star",
        value: String(fiveStarCount),
        label: "Оценок 5 из 5",
        description: "Количество максимальных оценок в истории отзывов",
        icon: "heart",
        accent: "amber",
      },
    ],
    section: {
      title: "Список отзывов",
      items: reviews.map((review, index) => ({
        id: review.id,
        title: review.service.title,
        date: formatReviewDate(review.createdAt),
        rating: review.rating,
        text: review.comment,
        icon: getServiceIcon(),
        accent: getAccent(index),
        to: `/profile/requests/${review.order.id}`,
      })),
    },
  };
};
