import type { Metadata } from "next";
import ServicesPageClient from "@/components/ServicesPageClient";
export const metadata: Metadata = {
  title: "Services | Custom House Plans, 3D Elevation & Interior Design | HousePlanFiles",
  description: "Explore HousePlanFiles services: custom house plans, 3D elevations, interior design, vastu consultation, construction services across India.",
  openGraph: { title: "Services | HousePlanFiles", description: "Custom house plans, 3D elevations, interior design and vastu services.", url: "https://www.houseplanfiles.com/services", images: [{ url: "/architect_hero.webp", width: 1200, height: 630, alt: "Architecture Services India" }] },
  twitter: { card: "summary_large_image", title: "Services | HousePlanFiles", description: "Custom house plans, 3D elevations and interior design services.", images: ["/architect_hero.webp"] },
  alternates: { canonical: "https://www.houseplanfiles.com/services" },
};
const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" }, { "@type": "ListItem", position: 2, name: "Services", item: "https://www.houseplanfiles.com/services" }] };
export default function ServicesPage() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
<main><ServicesPageClient /></main>
</>);
}
