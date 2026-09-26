import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SellerStorePageClient from "@/components/SellerStorePageClient";
import { getSellerStoreUrl } from "@/utils/profileUrls";

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return { title: "Seller Store | HousePlanFiles" };

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfilesbackend-new.vercel.app";

  try {
    let seller = null;
    if (slug.length === 1 && slug[0].match(/^[0-9a-fA-F]{24}$/)) {
      const res = await fetch(`${BACKEND_URL}/api/users/store/${slug[0]}`, { next: { revalidate: 3600 } });
      seller = await res.json();
    } else {
      const targetSlug = slug[slug.length - 1]; // name is at the end
      const citySlug = slug.length > 1 ? slug[0] : "";
      const fetchUrl = citySlug
        ? `${BACKEND_URL}/api/users/store/seo/${encodeURIComponent(citySlug)}/${encodeURIComponent(targetSlug)}`
        : `${BACKEND_URL}/api/users/store/seo/${encodeURIComponent(targetSlug)}`;
      const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });
      const data = await res.json();
      seller = data?.seller || data;
    }

    if (!seller || (!seller.businessName && !seller.companyName && !seller.name)) {
      return { title: "Seller Store | HousePlanFiles" };
    }

    const businessName = seller.companyName || seller.businessName || seller.name;
    const title = seller.seoTitle || `${businessName} | HousePlanFiles Marketplace`;
    const description = seller.seoDescription || `Explore ${businessName} on HousePlanFiles. Browse verified building materials and connect directly.`;
    const canonicalPath = getSellerStoreUrl(seller);
    const imageUrl = seller.shopImageUrl || seller.photoUrl;
    const ogImage = imageUrl
      ? (imageUrl.startsWith("http") ? imageUrl : `${BACKEND_URL}/${imageUrl.replace(/\\/g, "/")}`)
      : "https://www.houseplanfiles.com/logo1.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.houseplanfiles.com${canonicalPath}`,
        images: [{ url: ogImage, width: 800, height: 600, alt: businessName }],
      },
      alternates: { canonical: `https://www.houseplanfiles.com${canonicalPath}` },
    };
  } catch {
    return { title: "Seller Store | HousePlanFiles" };
  }
}

export default async function SellerShopPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (!slug || slug.length === 0) notFound();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfilesbackend-new.vercel.app";

  // Check if accessed via 24-character ObjectId
  if (slug.length === 1 && slug[0].match(/^[0-9a-fA-F]{24}$/)) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/store/${slug[0]}`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const seller = await res.json();
        if (seller && (seller.businessName || seller.companyName || seller.name)) {
          // Immediately redirect to clean SEO URL so no ID is in browser address bar
          redirect(getSellerStoreUrl(seller));
        }
      }
    } catch {
      notFound();
    }
    notFound();
  }

  // Name is at the last
  const targetSlug = slug[slug.length - 1];
  const citySlug = slug.length > 1 ? slug[0] : "";
  const fetchUrl = citySlug
    ? `${BACKEND_URL}/api/users/store/seo/${encodeURIComponent(citySlug)}/${encodeURIComponent(targetSlug)}`
    : `${BACKEND_URL}/api/users/store/seo/${encodeURIComponent(targetSlug)}`;

  let seller = null;
  try {
    const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });
    if (!res.ok) notFound();
    const data = await res.json();
    seller = data?.seller || data;
    if (!seller || (!seller.businessName && !seller.companyName && !seller.name)) {
      notFound();
    }
  } catch {
    notFound();
  }

  return (
    <main>
      <SellerStorePageClient initialSeller={seller} sellerId={seller?._id} />
    </main>
  );
}
