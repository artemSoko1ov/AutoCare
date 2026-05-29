import { Outlet } from "react-router-dom";
import Header from "@/widgets/header/ui/Header.tsx";
import Footer from "@/widgets/footer/ui/Footer.tsx";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
