import ProtectedRoute from "@/components/ProtectedRoute";
import MyProductPage from "@/components/seller/MyProductpage";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <MyProductPage />
    </ProtectedRoute>
  );
}
