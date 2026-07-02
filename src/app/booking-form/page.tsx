import { Suspense } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";

const BookingPageClient = dynamic(
  () => import("@/components/BookingPageClient"),
  { ssr: false }
);

export default function Page() {
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
      <BookingPageClient />
    </Suspense>
  );
}
