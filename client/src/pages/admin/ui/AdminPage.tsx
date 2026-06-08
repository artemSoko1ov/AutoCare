import { Outlet } from "react-router-dom";
import clsx from "clsx";
import Section from "@/shared/ui/Section";
import AdminSidebar from "@/widgets/admin-sidebar";
import styles from "./AdminPage.module.scss";

const AdminPage = () => {
  return (
    <Section
      bodyClassName={styles.content}
      className={clsx("page-shell", styles.page)}
      title="Админ-панель"
      titleAs="h1"
      titleSize="h1"
    >
      <div className={styles.layout}>
        <AdminSidebar />

        <div className={styles.main}>
          <Outlet />
        </div>
      </div>
    </Section>
  );
};

export default AdminPage;
