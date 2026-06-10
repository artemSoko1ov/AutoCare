import Button, { type ButtonProps, type ButtonSize, type ButtonVariant } from "@/shared/ui/Button";
import type { MouseEventHandler } from "react";
import { useLogout } from "../model/useLogout";

type LogoutButtonProps = {
  className?: string;
  onClick?: () => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
} & Pick<ButtonProps, "fullWidth">;

const LogoutButton = ({
  className,
  fullWidth = false,
  onClick,
  size = "sm",
  variant = "secondary",
}: LogoutButtonProps) => {
  const { executeLogout, loading } = useLogout();

  const handleClick: MouseEventHandler<HTMLButtonElement> = async () => {
    onClick?.();
    await executeLogout();
  };

  return (
    <Button
      className={className}
      disabled={loading}
      fullWidth={fullWidth}
      loading={loading}
      onClick={handleClick}
      size={size}
      variant={variant}
    >
      Выйти
    </Button>
  );
};

export default LogoutButton;
