import AdminReviewsTable from "@/widgets/admin-reviews-table";
import { adminReviews } from "@/entities/admin/model";

const AdminReviewsPage = () => {
  return <AdminReviewsTable reviews={adminReviews} />;
};

export default AdminReviewsPage;
