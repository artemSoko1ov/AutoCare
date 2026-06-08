import AdminRequestsTable from "@/widgets/admin-requests-table";
import { adminRequests } from "@/entities/admin/model";

const AdminRequestsPage = () => {
  return <AdminRequestsTable requests={adminRequests} />;
};

export default AdminRequestsPage;
