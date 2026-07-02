import type { Metadata } from "next";
import PackageEditPage from "@/components/admin/PackageEditPage";

export const metadata: Metadata = {
  title: "Edit Package | Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PackageEditPage />;
}
