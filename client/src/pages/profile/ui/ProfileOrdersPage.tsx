import { createProfileOrdersPageSection, useOrdersQuery } from "@/entities/order";
import ProfileOrdersPageSection from "@/widgets/profile-orders-page";

const ProfileOrdersPage = () => {
  const ordersQuery = useOrdersQuery();
  const section = createProfileOrdersPageSection(ordersQuery.data ?? []);

  const handleRetry = () => {
    void ordersQuery.refetch();
  };

  return (
    <ProfileOrdersPageSection
      errorMessage={ordersQuery.isError ? "Не удалось загрузить список ваших заказов." : null}
      isLoading={ordersQuery.isPending}
      onRetry={handleRetry}
      section={section}
    />
  );
};

export default ProfileOrdersPage;
