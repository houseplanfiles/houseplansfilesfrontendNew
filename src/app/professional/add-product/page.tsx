import ProtectedRoute from "@/components/ProtectedRoute";
import AddProductPage from "@/components/professional/AddProductPage";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["professional", "admin"]}>
      <AddProductPage />
    </ProtectedRoute>
  );
}
