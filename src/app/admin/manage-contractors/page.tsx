import type { Metadata } from "next";
import AdminContractorsPage from "@/components/admin/AdminContractorsPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminContractorsPage />;
}
