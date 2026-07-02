import type { Metadata } from "next";
import SellerStorePageClient from "@/components/SellerStorePageClient";

export async function generateMetadata({ params }: { params: Promise<{ sellerId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/store/${resolvedParams.sellerId}`, { next: { revalidate: 3600 } });
    const seller = await res.json();
    
    if (!seller || !seller.businessName) {
      return {
        title: "Seller Store | HousePlanFiles",
        description: "Explore verified building material stores and interior showrooms on HousePlanFiles Marketplace.",
      };
    }

    // Use custom SEO if admin has set it, else auto-generate
    const autoTitle = `${seller.businessName} | HousePlanFiles Marketplace`;
    const materialInfo = seller.materialType ? ` Specializing in ${seller.materialType}.` : "";
    const locationInfo = seller.city ? ` Located in ${seller.city}.` : "";
    const autoDescription = `${seller.businessName} – verified building material store on HousePlanFiles.${materialInfo}${locationInfo} Browse products, get quotes and connect directly.`;

    const title = seller.seoTitle || autoTitle;
    const description = seller.seoDescription || autoDescription;
    const keywords = seller.seoKeywords || `${seller.businessName}, ${seller.category || ""}, ${seller.city || ""}, building materials, houseplanfiles marketplace`;

    const canonicalUrl = `https://www.houseplanfiles.com/seller-shop/${resolvedParams.sellerId}`;
    
    const imagePath = seller.shopImageUrl || seller.photoUrl;
    const imageUrl = imagePath
      ? (imagePath.startsWith("http") ? imagePath : `${BACKEND_URL}/${imagePath.replace(/^\//, "")}`)
      : "https://www.houseplanfiles.com/logo1.png";

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "profile",
        images: [{ url: imageUrl, width: 800, height: 600, alt: `${seller.businessName} Store` }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
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

export default async function SellerShopPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const resolvedParams = await params;
  return (
    <>
      <main>
        <SellerStorePageClient />
      </main>
    </>
  );
}
