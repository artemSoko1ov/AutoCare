import AdminServicesTable from "@/widgets/admin-services-table";
import { adminServices } from "@/entities/admin/model";

const AdminServicesPage = () => {
  return <AdminServicesTable services={adminServices} />;
};

export default AdminServicesPage;
