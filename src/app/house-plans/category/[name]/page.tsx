import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsClientWrapper from "@/components/ProductsClientWrapper";

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const rawName = decodeURIComponent(name).replace(/-/g, " ");
  const displayName = rawName.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const canonicalUrl = `https://www.houseplanfiles.com/house-plans/category/${name}`;
  return {
    title: `${displayName} House Plans | Download PDF | HousePlanFiles`,
    description: `Browse readymade ${displayName} house plans in India. Download verified floor plans with elevation, vastu layout & specifications. Designed by expert architects.`,
    keywords: [`${rawName} house plan`, `${rawName} floor plan`, `${rawName} house design india`, "readymade house plans india", "download house plan pdf"],
    openGraph: { title: `${displayName} House Plans | HousePlanFiles`, description: `Browse ${displayName} house plans in India.`, url: canonicalUrl, images: [{ url: "/floorplan.jpg", width: 1200, height: 630, alt: `${displayName} House Plans` }] },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const rawName = decodeURIComponent(name).replace(/-/g, " ");
  const displayName = rawName.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" },
      { "@type": "ListItem", position: 2, name: "House Plans", item: "https://www.houseplanfiles.com/house-plans" },
      { "@type": "ListItem", position: 3, name: `${displayName} House Plans`, item: `https://www.houseplanfiles.com/house-plans/category/${name}` },
    ],
  };

  // Header rendered below our Navbar — passed as headerSlot so ProductsClient hides its own Navbar/Footer
  const header = (
    <div className="bg-white border-b border-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/house-plans" className="hover:text-orange-500 transition-colors">House Plans</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-orange-500 font-medium">{displayName} House Plans</li>
          </ol>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{displayName} House Plans</h1>
        <p className="mt-2 text-gray-600 max-w-2xl text-sm md:text-base">
          Browse our collection of readymade {displayName.toLowerCase()} house plans. Download verified floor plans with elevation, vastu layout, and complete architectural specifications.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="min-h-screen">
        <TopBar />
        <Navbar />
        <main>
          <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading {displayName} house plans...</div>}>
            <ProductsClientWrapper category={rawName} headerSlot={header} />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}