import type { Metadata } from "next";
import AdminCustomizationRequestsPage from "@/components/admin/AdminCustomizationRequestsPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminCustomizationRequestsPage />;
}
