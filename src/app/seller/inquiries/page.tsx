import ProtectedRoute from "@/components/ProtectedRoute";
import SellerInquiriesPage from "@/components/seller/SellerInquiriesPage";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <SellerInquiriesPage />
    </ProtectedRoute>
  );
}
