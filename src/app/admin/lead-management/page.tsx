import type { Metadata } from "next";
import AdminLeadManagement from "@/components/admin/AdminLeadManagement";

export const metadata: Metadata = {
  title: "Lead Management | Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminLeadManagement />;
}
