import ProtectedRoute from "@/components/ProtectedRoute";
import OrdersPage from "@/components/professional/OrdersPage";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["professional", "admin"]}>
      <OrdersPage />
    </ProtectedRoute>
  );
}
