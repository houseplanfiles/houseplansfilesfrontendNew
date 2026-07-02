import type { Metadata } from "next";
import SellerSEOListPage from "@/components/admin/SellerSEOListPage";

export const metadata: Metadata = {
  title: "Seller SEO Management | Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SellerSEOListPage />;
}
