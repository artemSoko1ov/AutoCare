import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import BookingCta from "@/widgets/booking-cta/ui/BookingCta.tsx";
import HomeHero from "@/widgets/home-hero";
import HomeReviews from "@/widgets/home-reviews";
import HomeServices from "@/widgets/home-services";

const HomePage = () => {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeReviews />
      <BookingCta
        action={
          <Button leftIcon={<Icon name="phone" />} size="lg">
            Позвонить нам
          </Button>
        }
        description="Получите бесплатную консультацию и рекомендации от наших специалистов."
        icon={<Icon name="support" />}
        title="Нужна консультация по обслуживанию авто?"
      />
    </>
  );
};

export default HomePage;
