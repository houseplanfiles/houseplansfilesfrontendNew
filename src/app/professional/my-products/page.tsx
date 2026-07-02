import ProtectedRoute from "@/components/ProtectedRoute";
import MyProductsPage from "@/components/professional/MyProductsPage";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["professional", "admin"]}>
      <MyProductsPage />
    </ProtectedRoute>
  );
}
