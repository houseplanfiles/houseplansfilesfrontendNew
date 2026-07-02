import type { Metadata } from "next";
import AllProductsPage from "@/components/admin/AllProductsPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AllProductsPage />;
}
