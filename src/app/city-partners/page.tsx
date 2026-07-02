import type { Metadata } from "next";
import { Suspense } from "react";
import CityPartnersPageClient from "@/components/CityPartnersPageClient";

export const metadata: Metadata = {
  title: "City Contractors | Verified Construction Partners Across India | HousePlanFiles",
  description: "Find verified city contractors and construction partners across India. Connect with trusted professionals for quality home construction projects.",
  openGraph: { title: "City Contractors | HousePlanFiles", description: "Verified construction partners across India for quality home construction.", url: "https://www.houseplanfiles.com/city-partners", images: [{ url: "/contractor.jpeg", width: 1200, height: 630, alt: "City Contractors India" }] },
  twitter: { card: "summary_large_image", title: "City Contractors | HousePlanFiles", description: "Verified construction partners across India.", images: ["/contractor.jpeg"] },
  alternates: { canonical: "https://www.houseplanfiles.com/city-partners" },
};

const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" }, { "@type": "ListItem", position: 2, name: "City Contractors", item: "https://www.houseplanfiles.com/city-partners" }] };

export default function CityPartnersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div>}>
          <CityPartnersPageClient />
        </Suspense>
      </main>
    </>
  );
}
