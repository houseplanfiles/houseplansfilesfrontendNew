import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SellerStorePageClient from "@/components/SellerStorePageClient";

export async function generateMetadata({ params }: { params: Promise<{ role: string, businessName: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/store/seo/${encodeURIComponent(resolvedParams.role)}/${encodeURIComponent(resolvedParams.businessName)}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const seller = data?.seller || data;
    if (!seller || !seller.companyName) return { title: "Seller Store | HousePlanFiles" };
    
    const imageUrl = seller.shopImageUrl || seller.photoUrl;
    const ogImage = imageUrl 
      ? (imageUrl.startsWith("http") ? imageUrl : `${BACKEND_URL}/${imageUrl.replace(/\\/g, "/")}`) 
      : "https://www.houseplanfiles.com/logo1.png";

    const urlPath = `/seller/${resolvedParams.businessName}/${resolvedParams.role}`;

    return {
      title: `${seller.companyName} - ${seller.city || "India"} Seller | HousePlanFiles`,
      description: `Shop from ${seller.companyName}${seller.city ? ` based in ${seller.city}` : ""}. Explore their building materials and products.`,
      openGraph: {
        title: `${seller.companyName} | HousePlanFiles Seller`,
        description: `Building materials by ${seller.companyName}.`,
        url: `https://www.houseplanfiles.com${urlPath}`,
        images: [{ url: ogImage, width: 800, height: 600, alt: seller.companyName }],
      },
      alternates: { canonical: `https://www.houseplanfiles.com${urlPath}` },
    };
  } catch { return { title: "Seller Store | HousePlanFiles" }; }
}

export default async function SellerStorePage({ params }: { params: Promise<{ role: string, businessName: string }> }) {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
  let seller = null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/store/seo/${encodeURIComponent(resolvedParams.role)}/${encodeURIComponent(resolvedParams.businessName)}`, { next: { revalidate: 3600 } });
    if (!res.ok) notFound();
    const data = await res.json();
    seller = data?.seller || data;
    if (!seller || !seller.companyName) notFound();
  } catch {
    notFound();
  }
  return (
    <>
      <main>
        <SellerStorePageClient initialSeller={seller} />
      </main>
    </>
  );
}