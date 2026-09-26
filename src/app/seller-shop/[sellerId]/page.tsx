import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SellerStorePageClient from "@/components/SellerStorePageClient";
import { getSellerStoreUrl } from "@/utils/profileUrls";

export async function generateMetadata({ params }: { params: Promise<{ sellerId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfilesbackend-new.vercel.app";
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/store/${resolvedParams.sellerId}`, { next: { revalidate: 3600 } });
    const seller = await res.json();
    
    if (!seller || (!seller.businessName && !seller.companyName && !seller.name)) {
      return {
        title: "Seller Store | HousePlanFiles",
        description: "Explore verified building material stores and interior showrooms on HousePlanFiles Marketplace.",
      };
    }

    const businessName = seller.companyName || seller.businessName || seller.name;
    const autoTitle = `${businessName} | HousePlanFiles Marketplace`;
    const materialInfo = seller.materialType ? ` Specializing in ${seller.materialType}.` : "";
    const locationInfo = seller.city ? ` Located in ${seller.city}.` : "";
    const autoDescription = `${businessName} – verified building material store on HousePlanFiles.${materialInfo}${locationInfo} Browse products, get quotes and connect directly.`;

    const title = seller.seoTitle || autoTitle;
    const description = seller.seoDescription || autoDescription;
    const canonicalPath = getSellerStoreUrl(seller);
    const canonicalUrl = `https://www.houseplanfiles.com${canonicalPath}`;
    
    const imagePath = seller.shopImageUrl || seller.photoUrl;
    const imageUrl = imagePath
      ? (imagePath.startsWith("http") ? imagePath : `${BACKEND_URL}/${imagePath.replace(/^\//, "")}`)
      : "https://www.houseplanfiles.com/logo1.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "profile",
        images: [{ url: imageUrl, width: 800, height: 600, alt: `${businessName} Store` }],
      },
      alternates: { canonical: canonicalUrl },
    };
  } catch {
    return {
      title: "Seller Store | HousePlanFiles",
      description: "Explore verified building material stores and interior showrooms on HousePlanFiles Marketplace.",
    };
  }
}

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

  return (
    <>
      <main>
        <SellerStorePageClient sellerId={resolvedParams.sellerId} initialSeller={seller} />
      </main>
    </>
  );
}
