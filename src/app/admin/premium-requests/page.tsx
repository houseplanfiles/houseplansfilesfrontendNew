import type { Metadata } from "next";
import PremiumRequestsPage from "@/components/admin/PremiumRequestsPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PremiumRequestsPage />;
}
