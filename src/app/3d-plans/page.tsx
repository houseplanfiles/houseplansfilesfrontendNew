import { Suspense } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Floor Plans + 3D Elevation | HousePlanFiles",
  description: "Browse floor plans paired with stunning 3D elevations. Visualize your future home from every angle.",
  alternates: { canonical: "https://www.houseplanfiles.com/3d-plans" },
};

const ThreeDPlansPageClient = dynamic(
  () => import("@/components/ThreeDPlansPageClient")
);

async function getInitial3DPlans() {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
    const res = await fetch(
      `${BACKEND_URL}/api/products?pageNumber=1&limit=12&category=3D Elevation`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export default async function ThreeDPlansPage() {
  const initialData = await getInitial3DPlans();

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
      <ThreeDPlansPageClient initialData={initialData} />
    </Suspense>
  );
}