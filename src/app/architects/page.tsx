import type { Metadata } from "next";
import { Suspense } from "react";
import ArchitectsPageClient from "@/components/ArchitectsPageClient";

export const metadata: Metadata = {
  title: "Hire top architect interior designer in your city",
  description: "Find verified architects, interior designers, civil engineers, and structural engineers across India. View portfolios and connect with the right professional for your home design.",
  keywords: ["architects india", "interior designers india", "civil engineer india", "structural engineer india", "architect near me", "hire architect india"],
  openGraph: {
    title: "Hire top architect interior designer in your city | HousePlanFiles",
    description: "Find verified architects and interior designers across India. View portfolios and get in touch.",
    url: "https://www.houseplanfiles.com/architects",
    images: [{ url: "/architect_hero.webp", width: 1200, height: 630, alt: "Architects and Interior Designers India" }],
  },
  twitter: { card: "summary_large_image", title: "Hire top architect interior designer in your city | HousePlanFiles", images: ["/architect_hero.webp"] },
  alternates: { canonical: "https://www.houseplanfiles.com/architects" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" },
    { "@type": "ListItem", position: 2, name: "Architects & Interior Designers", item: "https://www.houseplanfiles.com/architects" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I hire an architect through HousePlanFiles?", acceptedAnswer: { "@type": "Answer", text: "Browse verified architect profiles, view their portfolios and past projects, then send a direct inquiry or WhatsApp message." } },
    { "@type": "Question", name: "Are the architects on HousePlanFiles verified?", acceptedAnswer: { "@type": "Answer", text: "Yes. All architects and interior designers are verified by our team. Verified profiles show a blue checkmark and Premium members show a PREMIUM badge." } },
    { "@type": "Question", name: "What types of professionals are available?", acceptedAnswer: { "@type": "Answer", text: "HousePlanFiles lists Architects, Civil Design Engineers, Structural Engineers, Interior Designers, Site Engineers, and MEP Consultants across India." } },
  ],
};

export default function ArchitectsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading architects...</div>}>
        <ArchitectsPageClient />
      </Suspense>
    </>
  );
}
