import { Suspense } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";

const DownloadsPageClient = dynamic(
  () => import("@/components/DownloadsPageClient"),
);

async function getInitialDownloadProducts() {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
    const res = await fetch(
      `${BACKEND_URL}/api/products?pageNumber=1&limit=12&category=Digital Downloads`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export default async function Page() {
  const initialData = await getInitialDownloadProducts();

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
      <DownloadsPageClient initialData={initialData} />
    </Suspense>
  );
}
