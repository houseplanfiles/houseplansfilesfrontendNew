import type { Metadata } from "next";
import SellerEnquirypage from "@/components/admin/SellerEnquirypage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SellerEnquirypage />;
}