import ProtectedRoute from "@/components/ProtectedRoute";
import PackagesPage from "@/components/professional/PackagesPage";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["contractor", "architect", "professional", "admin"]}>
      <PackagesPage />
    </ProtectedRoute>
  );
}
