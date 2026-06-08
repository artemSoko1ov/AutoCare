import AdminStats from "@/widgets/admin-stats";
import { adminStats } from "@/entities/admin/model";

const AdminDashboardPage = () => {
  return <AdminStats items={adminStats} />;
};

export default AdminDashboardPage;
