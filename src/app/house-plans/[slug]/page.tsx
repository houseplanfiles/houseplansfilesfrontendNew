import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/slug/${slug}`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return {
      title: "House Plan Not Found",
      description: "The house plan you are looking for could not be found.",
    };
  }

  const seoTitle =
    product.seo?.title ||
    `${product.name} | Download House Plan PDF | HousePlanFiles`;
  const seoDescription =
    product.seo?.description ||
    `Download ${product.name}. ${product.rooms ? `${product.rooms} BHK` : ""} ${product.plotSize ? `${product.plotSize} plot size` : ""} ${product.direction ? `${product.direction} facing` : ""} house plan. Designed by expert architects. Instant download available.`;
  const seoKeywords = product.seo?.keywords?.length
    ? product.seo.keywords
    : [
        product.name,
        product.plotSize && `${product.plotSize} house plan`,
        product.rooms && `${product.rooms} bhk house plan`,
        product.direction && `${product.direction.toLowerCase()} facing house plan`,
        "readymade house plan india",
        "house plan download",
      ].filter(Boolean);
  const imageUrl = product.mainImage 
    ? (product.mainImage.startsWith("http") ? product.mainImage : `${BACKEND_URL}/${product.mainImage.replace(/^\//, '')}`)
    : "https://www.houseplanfiles.com/floorplan.jpg";
  const imageAlt = product.seo?.altText || `${product.name} - Floor Plan Image`;
  const canonicalUrl = `https://www.houseplanfiles.com/house-plans/${resolvedParams.slug}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      type: "website",
      images: [{ url: imageUrl, width: 800, height: 600, alt: imageAlt }],
    },
    twitter: { card: "summary_large_image", title: seoTitle, description: seoDescription, images: [imageUrl] },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function HousePlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const imageUrl = product.mainImage 
    ? (product.mainImage.startsWith("http") ? product.mainImage : `${BACKEND_URL}/${product.mainImage.replace(/^\//, '')}`)
    : "https://www.houseplanfiles.com/floorplan.jpg";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} - Readymade house plan designed by expert architects.`,
    image: imageUrl,
    sku: product.productNo || product._id,
    brand: { "@type": "Brand", name: "HousePlanFiles" },
    offers: {
      "@type": "Offer",
      url: `https://www.houseplanfiles.com/house-plans/${resolvedParams.slug}`,
      priceCurrency: "INR",
      price: product.salePrice || product.price || 0,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "HousePlanFiles" },
    },
    additionalProperty: [
      product.plotSize && { "@type": "PropertyValue", name: "Plot Size", value: product.plotSize },
      product.rooms && { "@type": "PropertyValue", name: "Bedrooms", value: product.rooms },
      product.direction && { "@type": "PropertyValue", name: "Facing Direction", value: product.direction },
      product.floors && { "@type": "PropertyValue", name: "Floors", value: product.floors },
    ].filter(Boolean),
    ...(product.reviews?.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating || 4.5,
        reviewCount: product.numReviews || product.reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" },
      { "@type": "ListItem", position: 2, name: "House Plans", item: "https://www.houseplanfiles.com/house-plans" },
      { "@type": "ListItem", position: 3, name: product.name, item: `https://www.houseplanfiles.com/house-plans/${resolvedParams.slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is included in the ${product.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${product.name} includes detailed floor plan layout${product.rooms ? `, ${product.rooms} bedrooms` : ""}${product.bathrooms ? `, ${product.bathrooms} bathrooms` : ""}, elevation views, and complete architectural specifications. Instant PDF download available.`,
        },
      },
      {
        "@type": "Question",
        name: "What is the plot size for this house plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: product.plotSize
            ? `This house plan is designed for a ${product.plotSize} plot size.`
            : "Please check the plan details for the specific plot size information.",
        },
      },
      {
        "@type": "Question",
        name: "Can I customize this house plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all house plans on HousePlanFiles can be customized to suit your specific requirements. Contact our team for customization options.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
