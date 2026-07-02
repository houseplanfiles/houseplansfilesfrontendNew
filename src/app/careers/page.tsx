import type { Metadata } from "next";
import { Suspense } from "react";
import CareersPageClient from "@/components/CareersPageClient";
export const metadata: Metadata = {
  title: "Careers | Join HousePlanFiles | Architecture & Tech Jobs India",
  description: "Explore career opportunities at HousePlanFiles. Join our growing team of architects, designers and tech professionals building India's best home design platform.",
  openGraph: { title: "Careers at HousePlanFiles", description: "Join our team of architects, designers and tech professionals.", url: "https://www.houseplanfiles.com/careers", images: [{ url: "/logo1.png", width: 800, height: 600, alt: "Careers at HousePlanFiles" }] },
  twitter: { card: "summary", title: "Careers at HousePlanFiles", description: "Join our team of architects and tech professionals." },
  alternates: { canonical: "https://www.houseplanfiles.com/careers" },
};
const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" }, { "@type": "ListItem", position: 2, name: "Careers", item: "https://www.houseplanfiles.com/careers" }] };
export default function CareersPage() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
<main><CareersPageClient /></main>
</>);
}
