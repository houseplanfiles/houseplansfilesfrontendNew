import type { Metadata } from "next";
import AllInquiriesSCPage from "@/components/admin/AllInquiriesSCPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AllInquiriesSCPage />;
}
