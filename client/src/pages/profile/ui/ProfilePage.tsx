import { useEffect, useState } from "react";
import { useAppSelector } from "@app/providers/store/hooks";
import axiosInstance from "@/shared/api/axiosInstance.ts";
import type { UserDto } from "@shared/contracts/auth";

const ProfilePage = () => {
  const sessionUser = useAppSelector((state) => state.session.user);
  const [user, setUser] = useState<UserDto | null>(sessionUser);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setStatus("loading");

      try {
        const response = await axiosInstance.get<UserDto>("/auth/me");

        if (!isMounted) {
          return;
        }

        setUser(response.data);
        setStatus("idle");
      } catch {
        if (!isMounted) {
          return;
        }

        setStatus("error");
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!user && status === "loading") {
    return <div>Загрузка профиля...</div>;
  }

  if (!user && status === "error") {
    return <div>Не удалось загрузить профиль.</div>;
  }

  if (!user) {
    return <div>Пользователь не найден.</div>;
  }

  return (
    <section>
      <h1>Профиль</h1>
      <p>Email: {user.email}</p>
      <p>Имя: {user.username}</p>
      <p>Создан: {new Date(user.createdAt).toLocaleString("ru-RU")}</p>
    </section>
  );
};

export default ProfilePage;
