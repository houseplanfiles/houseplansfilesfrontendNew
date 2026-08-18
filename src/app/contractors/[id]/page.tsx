import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContractorProfilePageClient from "@/components/ContractorProfilePageClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/contractor/${resolvedParams.id}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const contractor = data?.contractor || data;
    if (!contractor || !contractor.name) return { title: "Contractor Profile | HousePlanFiles" };
    
    const imageUrl = contractor.photoUrl || contractor.shopImageUrl;
    const ogImage = imageUrl 
      ? (imageUrl.startsWith("http") ? imageUrl : `${BACKEND_URL}/${imageUrl.replace(/\\/g, "/")}`) 
      : "https://www.houseplanfiles.com/logo1.png";

    return {
      title: `${contractor.name} - ${contractor.city || "India"} Contractor | HousePlanFiles`,
      description: `View the profile of ${contractor.name}${contractor.companyName ? `, ${contractor.companyName}` : ""}${contractor.city ? ` based in ${contractor.city}` : ""}. Connect for construction services.`,
      openGraph: {
        title: `${contractor.name} | HousePlanFiles Contractor`,
        description: `Construction services by ${contractor.name}.`,
        url: `https://www.houseplanfiles.com/contractors/${resolvedParams.id}`,
        images: [{ url: ogImage, width: 800, height: 600, alt: contractor.name }],
      },
      alternates: { canonical: `https://www.houseplanfiles.com/contractors/${resolvedParams.id}` },
    };
  } catch { return { title: "Contractor Profile | HousePlanFiles" }; }
}

export default async function ContractorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/contractor/${resolvedParams.id}`, { next: { revalidate: 3600 } });
    if (!res.ok) notFound();
    const data = await res.json();
    const contractor = data?.contractor || data;
    if (!contractor || !contractor.name) notFound();
  } catch {
    notFound();
  }
  return (
    <>
<main>
<ContractorProfilePageClient />
      </main>
</>
  );
}
