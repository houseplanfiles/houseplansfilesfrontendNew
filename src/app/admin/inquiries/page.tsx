import type { Metadata } from "next";
import AllInquiriesPage from "@/components/admin/AllInquiriesPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AllInquiriesPage />;
}
