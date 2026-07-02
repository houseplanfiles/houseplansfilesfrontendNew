import type { Metadata } from "next";
import SellerLayout from "@/components/seller/SellerLayout";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SellerLayout>{children}</SellerLayout>;
}
