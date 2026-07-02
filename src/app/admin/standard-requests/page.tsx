import type { Metadata } from "next";
import StandardRequestsPage from "@/components/admin/StandardRequestsPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <StandardRequestsPage />;
}
