import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsClient from "@/components/ProductsClient";

export const metadata: Metadata = {
  title: "Readymade House Plans in India | Floor Plans & Home Designs",
  description: "Browse 1000+ readymade house plans in India. Find 2BHK, 3BHK, duplex, village house plans by plot size — 20x40, 30x40, 30x50, 40x60 and more. Download instantly.",
  keywords: ["readymade house plans", "house plans india", "floor plans", "2bhk house plan", "3bhk house plan", "duplex house plans"],
  openGraph: {
    title: "Readymade House Plans in India | HousePlanFiles",
    description: "Browse 1000+ readymade house plans. 2BHK, 3BHK, duplex, village & vastu house plans.",
    url: "https://www.houseplanfiles.com/house-plans",
    images: [{ url: "/floorplan.jpg", width: 1200, height: 630, alt: "Readymade House Plans India" }],
  },
  alternates: { canonical: "https://www.houseplanfiles.com/house-plans" },
};

export default function HousePlansPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading house plans...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
