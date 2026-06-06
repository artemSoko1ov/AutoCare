import Section from "@/shared/ui/Section";
import LoginForm from "@/features/auth/login";

const LoginPage = () => {
  return (
    <Section
      description="Войдите, чтобы управлять профилем, заявками и историей обслуживания."
      title="Вход"
      titleAs="h1"
      titleSize="h1"
    >
      <LoginForm />
    </Section>
  );
};

export default LoginPage;
