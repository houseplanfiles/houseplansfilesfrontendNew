import type { Metadata } from "next";
import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsClientWrapper from "@/components/ProductsClientWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ regionName: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const rawRegion = decodeURIComponent(resolvedParams.regionName).replace(/-/g, " ");
  const displayRegion = rawRegion
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const title = `House Plans in ${displayRegion} | Readymade Floor Plans | HousePlanFiles`;
  const description = `Browse readymade house plans popular in ${displayRegion}. Download verified floor plans, duplex designs & home blueprints suited for ${displayRegion} style and climate.`;
  const canonicalUrl = `https://www.houseplanfiles.com/house-plans/region/${resolvedParams.regionName}`;

  return {
    title,
    description,
    keywords: [
      `house plans ${rawRegion}`,
      `${rawRegion} house design`,
      `${rawRegion} home plans india`,
      "readymade house plans india",
      "regional house plans",
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [{ url: "/floorplan.jpg", width: 1200, height: 630, alt: `House Plans in ${displayRegion}` }],
    },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ regionName: string }>;
}) {
  const resolvedParams = await params;
  const rawRegion = decodeURIComponent(resolvedParams.regionName).replace(/-/g, " ");
  const displayRegion = rawRegion
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" },
      { "@type": "ListItem", position: 2, name: "House Plans", item: "https://www.houseplanfiles.com/house-plans" },
      {
        "@type": "ListItem",
        position: 3,
        name: `${displayRegion} House Plans`,
        item: `https://www.houseplanfiles.com/house-plans/region/${resolvedParams.regionName}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen">
        <TopBar />
        <Navbar />
        <main>
          <div className="bg-white border-b border-gray-100 py-6 px-4">
            <div className="max-w-7xl mx-auto">
              <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2">
                  <li>
                    <a href="/" className="hover:text-orange-500 transition-colors">Home</a>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li>
                    <a href="/house-plans" className="hover:text-orange-500 transition-colors">House Plans</a>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li className="text-orange-500 font-medium">{displayRegion} House Plans</li>
                </ol>
              </nav>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                House Plans in {displayRegion}
              </h1>
              <p className="mt-2 text-gray-600 max-w-2xl">
                Explore readymade house plans popular in {displayRegion}. Download verified floor
                plans with elevation views and complete architectural specifications suited for{" "}
                {displayRegion.toLowerCase()} style and climate.
              </p>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="py-20 text-center text-gray-500">
                Loading {displayRegion} house plans...
              </div>
            }
          >
            <ProductsClientWrapper region={rawRegion} hideNavbar />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
