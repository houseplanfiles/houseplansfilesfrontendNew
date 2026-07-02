import type { Metadata } from "next";
import { Suspense } from "react";
import CityPartnersPageClient from "@/components/CityPartnersPageClient";

export const metadata: Metadata = {
  title: "Hire best contractor building and interior in your city",
  description: "Find best contractors of building and interior work in your city available, chose right contractor for your dream home",
  keywords: ["city contractors india", "construction partners", "builders near me", "verified contractors", "house construction india"],
  openGraph: {
    title: "Hire best contractor building and interior in your city | HousePlanFiles",
    description: "Find best contractors of building and interior work in your city available, chose right contractor for your dream home",
    url: "https://www.houseplanfiles.com/contractors",
    images: [{ url: "/contractor.jpeg", width: 1200, height: 630, alt: "City Contractors India" }],
  },
  alternates: { canonical: "https://www.houseplanfiles.com/contractors" },
};

export default function ContractorsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading contractors...</div>}>
      <CityPartnersPageClient />
    </Suspense>
  );
}
