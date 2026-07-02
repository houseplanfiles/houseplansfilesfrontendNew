import ProtectedRoute from "@/components/ProtectedRoute";
import AddProduct from "@/components/seller/addProduct";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <AddProduct />
    </ProtectedRoute>
  );
}
