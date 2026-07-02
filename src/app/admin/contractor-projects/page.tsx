import type { Metadata } from "next";
import ContractorProjectsPage from "@/components/admin/ContractorProjectsPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ContractorProjectsPage />;
}
