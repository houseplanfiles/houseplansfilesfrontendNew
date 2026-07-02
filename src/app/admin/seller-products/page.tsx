import type { Metadata } from "next";
import SellerProductPage from "@/components/admin/SellerProductPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SellerProductPage />;
}
