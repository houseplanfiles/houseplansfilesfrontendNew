import ProtectedRoute from "@/components/ProtectedRoute";
import PortfolioPage from "@/components/professional/PortfolioPage";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["contractor", "architect", "professional", "admin"]}>
      <PortfolioPage />
    </ProtectedRoute>
  );
}
