import type { Metadata } from "next";
import MarketPlaceClient from "@/components/MarketPlaceClient";
export const metadata: Metadata = {
  title: "Marketplace | Building material supplier , construction and home decor products",
  description: "Browse building material suppliers construction and home decor products find verified sellers on houseplanfiles marketplace",
  openGraph: { title: "Marketplace | Building material supplier , construction and home decor products | HousePlanFiles", description: "Browse building material suppliers construction and home decor products find verified sellers on houseplanfiles marketplace", url: "https://www.houseplanfiles.com/marketplace", images: [{ url: "/marketplace.webp", width: 1200, height: 630, alt: "Building Materials Marketplace India" }] },
  twitter: { card: "summary_large_image", title: "Marketplace | Building material supplier , construction and home decor products | HousePlanFiles", description: "Browse building material suppliers construction and home decor products find verified sellers on houseplanfiles marketplace", images: ["/marketplace.webp"] },
  alternates: { canonical: "https://www.houseplanfiles.com/marketplace" },
};
const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" }, { "@type": "ListItem", position: 2, name: "Marketplace", item: "https://www.houseplanfiles.com/marketplace" }] };
export default function MarketplacePage() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <main>
      <MarketPlaceClient />
    </main>
</>);
}
