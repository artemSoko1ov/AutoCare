import { Outlet } from "react-router-dom";
import Header from "@/widgets/header/ui/Header.tsx";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="content">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
