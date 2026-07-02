import type { Metadata } from "next";
import AboutUs from "@/components/AboutUs";

export const metadata: Metadata = {
  title: "About Us - HousePlanFiles | India's Leading House Plan Platform",
  description: "Learn about HousePlanFiles — India's leading platform for readymade house plans, founded by Himanshu Vyas. Connecting homeowners with expert architects and contractors across India.",
  openGraph: {
    title: "About HousePlanFiles | India's Leading House Plan Platform",
    description: "India's leading platform for readymade house plans, founded by Himanshu Vyas.",
    url: "https://www.houseplanfiles.com/about",
    images: [{ url: "/founder.jpg", width: 800, height: 600, alt: "Himanshu Vyas - Founder HousePlanFiles" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About HousePlanFiles",
    description: "India's leading platform for readymade house plans.",
    images: ["/founder.jpg"],
  },
  alternates: { canonical: "https://www.houseplanfiles.com/about" },
};

// ✅ EEAT: Founder + Organization schema — signals real people behind the site
const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Himanshu Vyas",
  jobTitle: "Founder & CEO",
  worksFor: {
    "@type": "Organization",
    name: "HousePlanFiles",
    url: "https://www.houseplanfiles.com",
  },
  image: "https://www.houseplanfiles.com/founder.jpg",
  url: "https://www.houseplanfiles.com/about",
  sameAs: [
    "https://www.linkedin.com/company/105681541/",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" },
    { "@type": "ListItem", position: 2, name: "About Us", item: "https://www.houseplanfiles.com/about" },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
<main>
        {/* ✅ SEO H1 with breadcrumb */}
        <div className="bg-white border-b border-gray-100 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li><a href="/" className="hover:text-orange-500 transition-colors">Home</a></li>
                <li className="text-gray-400">/</li>
                <li className="text-orange-500 font-medium">About Us</li>
              </ol>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">About HousePlanFiles</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              India&apos;s leading platform for readymade house plans, connecting homeowners with expert architects, contractors, and building material suppliers.
            </p>
          </div>
        </div>
        <AboutUs />
      </main>
</>
  );
}
