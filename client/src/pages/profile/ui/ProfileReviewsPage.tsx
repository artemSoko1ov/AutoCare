import clsx from "clsx";
import { createProfileReviewsPageData, useMyReviewsQuery } from "@/entities/review";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import ProfileReviews from "@/widgets/profile-reviews";
import styles from "./ProfileReviewsPage.module.scss";

const ProfileReviewsPage = () => {
  const reviewsQuery = useMyReviewsQuery();
  const pageData = createProfileReviewsPageData(reviewsQuery.data ?? []);

  return (
    <div className={styles.page}>
      {!reviewsQuery.isPending && !reviewsQuery.isError && pageData.stats.length > 0 ? (
        <div className={styles.stats}>
          {pageData.stats.map((item) => (
            <article className={clsx("surface", "surface--glass", styles.statCard)} key={item.id}>
              <span className={clsx(styles.statIcon, styles[`statIcon--${item.accent}`])}>
                <Icon name={item.icon} />
              </span>

              <div className={styles.statBody}>
                <span className={styles.statValue}>{item.value}</span>
                <span className={styles.statLabel}>{item.label}</span>
                <span className={styles.statDescription}>{item.description}</span>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <ProfileReviews
        errorMessage={reviewsQuery.isError ? "Не удалось загрузить список ваших отзывов." : null}
        isLoading={reviewsQuery.isPending}
        onRetry={() => {
          void reviewsQuery.refetch();
        }}
        section={pageData.section}
      />

      {reviewsQuery.isError ? (
        <div className={styles.retryWrap}>
          <Button
            leftIcon={<Icon name="star" />}
            onClick={() => {
              void reviewsQuery.refetch();
            }}
            size="sm"
            variant="secondary"
          >
            Повторить загрузку
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileReviewsPage;
