import { redirect, notFound } from "next/navigation";
import { getArchitectProfileUrl } from "@/utils/profileUrls";

export default async function ArchitectProfileByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfilesbackend-new.vercel.app";
  let arch = null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/contractor/${resolvedParams.id}`, { next: { revalidate: 3600 } });
    if (!res.ok) notFound();
    const data = await res.json();
    arch = data?.architect || data;
    if (!arch || !arch.name) notFound();
  } catch {
    notFound();
  }

  // Redirect to clean SEO URL so no ID is ever visible in the browser address bar
  redirect(getArchitectProfileUrl(arch));
}
