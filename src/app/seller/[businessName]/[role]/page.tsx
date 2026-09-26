import { redirect, notFound } from "next/navigation";
import { getSellerStoreUrl } from "@/utils/profileUrls";

export default async function SellerLegacyRedirectPage({ params }: { params: Promise<{ role: string, businessName: string }> }) {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfilesbackend-new.vercel.app";
  let seller = null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/store/seo/${encodeURIComponent(resolvedParams.role)}/${encodeURIComponent(resolvedParams.businessName)}`, { next: { revalidate: 3600 } });
    if (!res.ok) notFound();
    const data = await res.json();
    seller = data?.seller || data;
    if (!seller || (!seller.businessName && !seller.companyName && !seller.name)) notFound();
  } catch {
    notFound();
  }

  // Redirect to new clean SEO store URL where seller name is at the end
  redirect(getSellerStoreUrl(seller));
}