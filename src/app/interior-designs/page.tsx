import { Suspense } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interior Design Plans | Modern Home Interiors | HousePlanFiles",
  description: "Browse premium interior design plans — modern, contemporary & traditional home interior designs. Find the perfect interior plan for every room.",
  alternates: { canonical: "https://www.houseplanfiles.com/interior-designs" },
};

const InteriorDesignsPageClient = dynamic(
  () => import("@/components/InteriorDesignsPageClient")
);

async function getInitialInteriorProducts(pageNumber: number = 1) {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
    const res = await fetch(
      `${BACKEND_URL}/api/products?pageNumber=${pageNumber}&limit=12&category=Interior Design`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const pageNumber = Number(searchParams?.page) || 1;
  const initialData = await getInitialInteriorProducts(pageNumber);

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
      <InteriorDesignsPageClient initialData={initialData} />
    </Suspense>
  );
}
