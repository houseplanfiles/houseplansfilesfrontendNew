import ProtectedRoute from "@/components/ProtectedRoute";
import ContractorEnquiriesPage from "@/components/professional/ContractorEnquiriesPage";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["contractor", "architect", "professional", "admin"]}>
      <ContractorEnquiriesPage />
    </ProtectedRoute>
  );
}
