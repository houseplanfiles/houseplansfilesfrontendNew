import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilePage from "@/components/professional/ProfilePage";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["professional", "contractor", "Contractor", "architect", "Architect", "admin"]}>
      <ProfilePage />
    </ProtectedRoute>
  );
}
