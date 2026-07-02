import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Readymade Floor Plans in India | 2BHK, 3BHK, Duplex House Plans",
  description: "Browse 1000+ readymade floor plans in India. Find 2BHK, 3BHK, duplex, village house plans by plot size. Download instantly.",
  keywords: ["floor plans india", "readymade floor plans", "house floor plans", "2bhk floor plan", "3bhk floor plan"],
  openGraph: {
    title: "Readymade Floor Plans in India | HousePlanFiles",
    description: "Browse 1000+ readymade floor plans in India.",
    url: "https://www.houseplanfiles.com/floor-plans",
    images: [{ url: "/floorplan.jpg", width: 1200, height: 630, alt: "Floor Plans India" }],
  },
  alternates: { canonical: "https://www.houseplanfiles.com/floor-plans" },
};

const BrowseProductsPageClient = dynamic(
  () => import("@/components/BrowseProductsPageClient"),
  { ssr: false }
);

export default function FloorPlansPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    }>
      <BrowseProductsPageClient />
    </Suspense>
  );
}