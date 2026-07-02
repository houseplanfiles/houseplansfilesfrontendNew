import type { Metadata } from "next";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfessionalDashboardPage from "@/components/professional/DashboardPage";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function ProfessionalPage() {
  return (
    <ProtectedRoute allowedRoles={["professional", "contractor", "Contractor", "architect", "Architect"]}>
      <ProfessionalDashboardPage />
    </ProtectedRoute>
  );
}
