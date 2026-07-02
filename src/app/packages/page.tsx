import type { Metadata } from "next";
import PackagesPageClient from "@/components/PackagesPageClient";
export const metadata: Metadata = {
  title: "House Plan Packages | Standard, Premium & Corporate | HousePlanFiles",
  description: "Choose from HousePlanFiles standard, premium and corporate packages. Affordable house plan packages for homeowners, architects and contractors across India.",
  openGraph: { title: "House Plan Packages | HousePlanFiles", description: "Standard, premium and corporate packages for house plans and architectural services.", url: "https://www.houseplanfiles.com/packages", images: [{ url: "/logo1.png", width: 800, height: 600, alt: "House Plan Packages India" }] },
  twitter: { card: "summary", title: "House Plan Packages | HousePlanFiles", description: "Affordable packages for house plans and architectural services." },
  alternates: { canonical: "https://www.houseplanfiles.com/packages" },
};
const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" }, { "@type": "ListItem", position: 2, name: "Packages", item: "https://www.houseplanfiles.com/packages" }] };
export default function PackagesPage() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
<main><PackagesPageClient /></main>
</>);
}
