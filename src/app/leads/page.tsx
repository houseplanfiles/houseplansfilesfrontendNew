import type { Metadata } from "next";
import { Suspense } from "react";
import LeadsPageClient from "@/components/LeadsPageClient";

export const metadata: Metadata = {
  title: "Project Leads Board | Find verified local projects | HousePlanFiles",
  description: "Browse direct customer inquiries and project requirements. Pay a small fee to unlock contact information and get new business instantly.",
};

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
        </div>
      }
    >
      <LeadsPageClient />
    </Suspense>
  );
}
