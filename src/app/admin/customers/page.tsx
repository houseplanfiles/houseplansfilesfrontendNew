import type { Metadata } from "next";
import CustomersPage from "@/components/admin/CustomersPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CustomersPage />;
}
