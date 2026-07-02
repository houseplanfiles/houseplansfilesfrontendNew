import type { Metadata } from "next";
import ArchitectProfilePageClient from "@/components/ArchitectProfilePageClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/contractor/${resolvedParams.id}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const arch = data?.architect || data;
    if (!arch || !arch.name) return { title: "Architect Profile | HousePlanFiles" };
    
    const imageUrl = arch.photoUrl || arch.shopImageUrl;
    const ogImage = imageUrl 
      ? (imageUrl.startsWith("http") ? imageUrl : `${BACKEND_URL}/${imageUrl.replace(/\\/g, "/")}`) 
      : "https://www.houseplanfiles.com/logo1.png";

    return {
      title: `${arch.name} - ${arch.city || "India"} Architect | HousePlanFiles`,
      description: `View portfolio and projects of ${arch.name}${arch.companyName ? `, ${arch.companyName}` : ""}${arch.city ? ` based in ${arch.city}` : ""}. Contact for custom house plans and design services.`,
      openGraph: {
        title: `${arch.name} | HousePlanFiles Architect`,
        description: `View portfolio and projects of ${arch.name}. Contact for custom house plans and design services.`,
        url: `https://www.houseplanfiles.com/architects/${resolvedParams.id}`,
        images: [{ url: ogImage, width: 800, height: 600, alt: arch.name }],
      },
      alternates: { canonical: `https://www.houseplanfiles.com/architects/${resolvedParams.id}` },
    };
  } catch { return { title: "Architect Profile | HousePlanFiles" }; }
}

export default async function ArchitectProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" },
      { "@type": "ListItem", position: 2, name: "Architects", item: "https://www.houseplanfiles.com/architects" },
      { "@type": "ListItem", position: 3, name: "Architect Profile", item: `https://www.houseplanfiles.com/architects/${resolvedParams.id}` },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
<main>
        <ArchitectProfilePageClient />
      </main>
</>
  );
}
