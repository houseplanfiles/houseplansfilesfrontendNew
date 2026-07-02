import type { Metadata } from "next";
import ReportsPage from "@/components/admin/ReportsPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ReportsPage />;
}
