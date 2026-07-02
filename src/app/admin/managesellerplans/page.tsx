import type { Metadata } from "next";
import AdminManagePlansPage from "@/components/admin/AdminManagePlansPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminManagePlansPage />;
}
