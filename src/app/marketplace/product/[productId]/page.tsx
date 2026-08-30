import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SellerProductDetailPageClient from "@/components/SellerProductDetailPageClient";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";

async function getProduct(productId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/seller/products/public/${productId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.productId);
  if (!product) return { title: "Product Not Found | HousePlanFiles" };

  const title = `${product.name} | HousePlanFiles`;
  const description = product.description || `Buy ${product.name} at HousePlanFiles.`;
  const imageUrl = product.mainImage 
    ? (product.mainImage.startsWith("http") ? product.mainImage : `${BACKEND_URL}/${product.mainImage}`)
    : "https://www.houseplanfiles.com/logo1.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.houseplanfiles.com/marketplace/product/${resolvedParams.productId}`,
      images: [{ url: imageUrl }],
    },
    alternates: { canonical: `https://www.houseplanfiles.com/marketplace/product/${resolvedParams.productId}` },
  };
}

export default async function Page({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.productId);
  
  if (!product) {
    notFound();
  }

  const imageUrl = product.mainImage 
    ? (product.mainImage.startsWith("http") ? product.mainImage : `${BACKEND_URL}/${product.mainImage}`)
    : "https://www.houseplanfiles.com/logo1.png";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: imageUrl,
    sku: product.productNo || resolvedParams.productId,
    offers: {
      "@type": "Offer",
      url: `https://www.houseplanfiles.com/marketplace/product/${resolvedParams.productId}`,
      priceCurrency: "INR",
      price: product.salePrice || product.price || 0,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: product.user?.name || "HousePlanFiles" },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" },
      { "@type": "ListItem", position: 2, name: "Marketplace", item: "https://www.houseplanfiles.com/marketplace" },
      { "@type": "ListItem", position: 3, name: product.name, item: `https://www.houseplanfiles.com/marketplace/product/${resolvedParams.productId}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SellerProductDetailPageClient initialProduct={product} />
    </>
  );
}
