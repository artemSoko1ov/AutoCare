import Section from "@/shared/ui/Section";
import PageBreadcrumbs from "@/widgets/page-breadcrumbs";

const NotFoundPage = () => {
  return (
    <Section
      breadcrumbs={<PageBreadcrumbs />}
      description="Такой страницы сейчас нет. Проверьте адрес или вернитесь на главную."
      title="Страница не найдена"
      titleAs="h1"
      titleSize="h1"
    />
  );
};

export default NotFoundPage;
