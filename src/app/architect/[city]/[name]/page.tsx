import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArchitectProfilePageClient from "@/components/ArchitectProfilePageClient";

export async function generateMetadata({ params }: { params: Promise<{ city: string, name: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/contractor/seo/architect/${encodeURIComponent(resolvedParams.city)}/${encodeURIComponent(resolvedParams.name)}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const architect = data?.contractor || data;
    if (!architect || !architect.name) return { title: "Architect Profile | HousePlanFiles" };
    
    const imageUrl = architect.photoUrl;
    const ogImage = imageUrl 
      ? (imageUrl.startsWith("http") ? imageUrl : `${BACKEND_URL}/${imageUrl.replace(/\\/g, "/")}`) 
      : "https://www.houseplanfiles.com/logo1.png";

    const urlPath = `/architect/${resolvedParams.city}/${resolvedParams.name}`;

    return {
      title: `${architect.name} - ${architect.city || "India"} Architect | HousePlanFiles`,
      description: `View the profile of ${architect.name}${architect.city ? ` based in ${architect.city}` : ""}. Connect for architectural services.`,
      openGraph: {
        title: `${architect.name} | HousePlanFiles Architect`,
        description: `Architectural services by ${architect.name}.`,
        url: `https://www.houseplanfiles.com${urlPath}`,
        images: [{ url: ogImage, width: 800, height: 600, alt: architect.name }],
      },
      alternates: { canonical: `https://www.houseplanfiles.com${urlPath}` },
    };
  } catch { return { title: "Architect Profile | HousePlanFiles" }; }
}

export default async function ArchitectProfilePage({ params }: { params: Promise<{ city: string, name: string }> }) {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
  let architect = null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/contractor/seo/architect/${encodeURIComponent(resolvedParams.city)}/${encodeURIComponent(resolvedParams.name)}`, { next: { revalidate: 3600 } });
    if (!res.ok) notFound();
    const data = await res.json();
    architect = data?.contractor || data;
    if (!architect || !architect.name) notFound();
  } catch {
    notFound();
  }
  return (
    <>
      <main>
        <ArchitectProfilePageClient initialArchitect={architect} />
      </main>
    </>
  );
}