import type { Metadata } from "next";
import ContactUsClient from "@/components/ContactUsClient";

export const metadata: Metadata = {
  title: "Contact Us | HousePlanFiles - House Plans & Architecture",
  description: "Contact HousePlanFiles for house plan queries, architect connections or custom design requests. Call +91 9755248864 or email us.",
  openGraph: {
    title: "Contact HousePlanFiles",
    description: "Get in touch for house plan queries and custom design requests.",
    url: "https://www.houseplanfiles.com/contact",
    images: [{ url: "/logo1.png", width: 800, height: 600, alt: "Contact HousePlanFiles" }],
  },
  twitter: { card: "summary", title: "Contact HousePlanFiles", description: "Get in touch for house plan queries." },
  alternates: { canonical: "https://www.houseplanfiles.com/contact" },
};

const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" }, { "@type": "ListItem", position: 2, name: "Contact Us", item: "https://www.houseplanfiles.com/contact" }] };

export default function ContactPage() {
  return (<>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <main>
      <ContactUsClient />
    </main>
</>);
}
