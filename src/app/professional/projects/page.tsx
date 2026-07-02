import ProtectedRoute from "@/components/ProtectedRoute";
import ProjectsPage from "@/components/professional/ProjectsPage";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["contractor", "architect", "professional", "admin"]}>
      <ProjectsPage />
    </ProtectedRoute>
  );
}
