import ProtectedRoute from "@/components/ProtectedRoute";
import SellerProfile from "@/components/seller/profile";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <SellerProfile />
    </ProtectedRoute>
  );
}
