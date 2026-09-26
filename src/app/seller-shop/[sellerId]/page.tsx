import { redirect, notFound } from "next/navigation";
import { getSellerStoreUrl } from "@/utils/profileUrls";

export default async function SellerShopByIdPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfilesbackend-new.vercel.app";
  let seller = null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/store/${resolvedParams.sellerId}`, { next: { revalidate: 3600 } });
    if (!res.ok) notFound();
    seller = await res.json();
    if (!seller || (!seller.businessName && !seller.companyName && !seller.name)) notFound();
  } catch {
    notFound();
  }

  // Redirect immediately so that no ID is ever visible in the browser address bar
  redirect(getSellerStoreUrl(seller));
}
