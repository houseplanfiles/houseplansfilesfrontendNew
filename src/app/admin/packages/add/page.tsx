import type { Metadata } from "next";
import PackageEditPage from "@/components/admin/PackageEditPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PackageEditPage />;
}
