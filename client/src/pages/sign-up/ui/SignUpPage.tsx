import Section from "@/shared/ui/Section";
import RegisterForm from "@/features/auth/register";
import PageBreadcrumbs from "@/widgets/page-breadcrumbs";

const SignUpPage = () => {
  return (
    <Section
      breadcrumbs={<PageBreadcrumbs />}
      description="Создайте аккаунт, чтобы сохранять обращения и пользоваться возможностями сервиса."
      title="Регистрация"
      titleAs="h1"
      titleSize="h1"
    >
      <RegisterForm />
    </Section>
  );
};

export default SignUpPage;
