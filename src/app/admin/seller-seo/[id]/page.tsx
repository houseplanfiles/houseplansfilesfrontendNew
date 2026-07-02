import type { Metadata } from "next";
import SellerSEOPage from "@/components/admin/SellerSEOPage";

export const metadata: Metadata = {
  title: "Seller SEO | Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SellerSEOPage />;
}
