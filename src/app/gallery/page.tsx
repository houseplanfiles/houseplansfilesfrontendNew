import type { Metadata } from "next";
import GalleryPageClient from "@/components/GalleryPageClient";
export const metadata: Metadata = {
  title: "House Design Gallery | 3D Elevations & Floor Plans | HousePlanFiles",
  description: "Browse our gallery of beautiful house designs, 3D elevations, floor plans and architectural renders. Get inspired for your dream home design.",
  openGraph: { title: "House Design Gallery | HousePlanFiles", description: "Browse beautiful house designs, 3D elevations and floor plans.", url: "https://www.houseplanfiles.com/gallery", images: [{ url: "/3d.webp", width: 1200, height: 630, alt: "House Design Gallery India" }] },
  twitter: { card: "summary_large_image", title: "House Design Gallery | HousePlanFiles", description: "Browse beautiful house designs, 3D elevations and floor plans.", images: ["/3d.webp"] },
  alternates: { canonical: "https://www.houseplanfiles.com/gallery" },
};
const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" }, { "@type": "ListItem", position: 2, name: "Gallery", item: "https://www.houseplanfiles.com/gallery" }] };
export default function GalleryPage() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <main>
      <GalleryPageClient />
    </main>
</>);
}
