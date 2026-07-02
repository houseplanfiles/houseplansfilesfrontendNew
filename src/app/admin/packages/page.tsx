import type { Metadata } from "next";
import PackageListPage from "@/components/admin/PackageListPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PackageListPage />;
}
