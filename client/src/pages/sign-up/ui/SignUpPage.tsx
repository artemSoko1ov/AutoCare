import Section from "@/shared/ui/Section";
import RegisterForm from "@/features/auth/register";

const SignUpPage = () => {
  return (
    <Section
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
