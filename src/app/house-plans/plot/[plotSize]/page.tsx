import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsClientWrapper from "@/components/ProductsClientWrapper";

const PLOT_SIZE_DATA: Record<string, {
  display: string; sqft: string;
  variants: { label: string; href: string }[];
  faqs: { q: string; a: string }[];
  description: string;
}> = {
  "30x40": {
    display: "30x40", sqft: "1200 sq ft",
    description: "30x40 house plans are one of the most popular plot sizes in India, ideal for a comfortable 2BHK or 3BHK home with parking and open space. A 30x40 plot gives you 1200 sq ft of area to build a well-designed home with proper ventilation, vastu compliance, and modern elevation.",
    variants: [
      { label: "East Facing", href: "/house-plans/category/30x40-east-facing" },
      { label: "West Facing", href: "/house-plans/category/30x40-west-facing" },
      { label: "North Facing", href: "/house-plans/category/30x40-north-facing" },
      { label: "South Facing", href: "/house-plans/category/30x40-south-facing" },
      { label: "Duplex", href: "/house-plans/category/30x40-duplex" },
      { label: "3 BHK", href: "/house-plans/category/30x40-3bhk" },
      { label: "2 BHK", href: "/house-plans/category/30x40-2bhk" },
      { label: "G+1 Floor", href: "/house-plans/category/30x40-g-plus-1" },
      { label: "With Parking", href: "/house-plans/category/30x40-parking" },
      { label: "Vastu", href: "/house-plans/category/30x40-vastu" },
    ],
    faqs: [
      { q: "How many rooms can I fit in a 30x40 house plan?", a: "A 30x40 plot (1200 sq ft) can comfortably accommodate 2 to 3 bedrooms, 2 bathrooms, a hall, kitchen, and parking space on the ground floor. Adding a first floor (G+1) allows 4-5 bedrooms total." },
      { q: "What is the construction cost for a 30x40 house in India?", a: "Construction cost for a 30x40 house in India typically ranges from ₹15–35 lakhs depending on the city, materials, and finish level. In tier-2 cities like Bhopal or Indore, basic construction starts around ₹1200–1500 per sq ft." },
      { q: "Which direction is best for a 30x40 house as per vastu?", a: "East and North facing are considered most auspicious for a 30x40 house as per vastu shastra. East facing allows morning sunlight into the main entrance, while North facing is ideal for business owners." },
      { q: "Can I build a duplex on a 30x40 plot?", a: "Yes, a 30x40 duplex plan is very popular and practical. You can build a duplex with separate entries for two families, making it an excellent investment property." },
    ],
  },
  "20x40": {
    display: "20x40", sqft: "800 sq ft",
    description: "20x40 house plans are perfect for narrow urban plots, offering smart space utilisation with modern design. An 800 sq ft plot can be developed into a well-planned 2BHK home with proper ventilation and vastu compliance.",
    variants: [
      { label: "East Facing", href: "/house-plans/category/20x40-east-facing" },
      { label: "West Facing", href: "/house-plans/category/20x40-west-facing" },
      { label: "North Facing", href: "/house-plans/category/20x40-north-facing" },
      { label: "Duplex", href: "/house-plans/category/20x40-duplex" },
      { label: "2 BHK", href: "/house-plans/category/20x40-2bhk" },
      { label: "3 BHK", href: "/house-plans/category/20x40-3bhk" },
      { label: "With Parking", href: "/house-plans/category/20x40-parking" },
      { label: "Vastu", href: "/house-plans/category/20x40-vastu" },
    ],
    faqs: [
      { q: "How many rooms in a 20x40 house plan?", a: "A 20x40 plot (800 sq ft) can fit 2 bedrooms, 1-2 bathrooms, living area, kitchen, and a small parking area on the ground floor. A G+1 plan adds another 2 bedrooms." },
      { q: "What is the construction cost for a 20x40 house?", a: "A 20x40 house construction costs approximately ₹10–20 lakhs in most Indian cities at basic to medium finish. Premium finish can go up to ₹28 lakhs." },
    ],
  },
  "30x50": {
    display: "30x50", sqft: "1500 sq ft",
    description: "30x50 house plans offer generous 1500 sq ft of ground floor area — one of the most versatile plot sizes for building a spacious 3BHK or 4BHK home with garden, parking, and full vastu compliance.",
    variants: [
      { label: "East Facing", href: "/house-plans/category/30x50-east-facing" },
      { label: "West Facing", href: "/house-plans/category/30x50-west-facing" },
      { label: "Duplex", href: "/house-plans/category/30x50-duplex" },
      { label: "3 BHK", href: "/house-plans/category/30x50-3bhk" },
      { label: "4 BHK", href: "/house-plans/category/30x50-4bhk" },
      { label: "G+2 Floor", href: "/house-plans/category/30x50-g-plus-2" },
      { label: "Vastu", href: "/house-plans/category/30x50-vastu" },
    ],
    faqs: [
      { q: "How many rooms can fit in a 30x50 house plan?", a: "A 30x50 plot (1500 sq ft) can easily fit 3-4 bedrooms, 2-3 bathrooms, a large hall, modular kitchen, study room, and 2-car parking on the ground floor." },
      { q: "What is the construction cost of a 30x50 house?", a: "Construction of a 30x50 house in India costs ₹18–45 lakhs depending on city and finish. In central India, basic construction starts around ₹1200/sq ft." },
    ],
  },
  "40x60": {
    display: "40x60", sqft: "2400 sq ft",
    description: "40x60 house plans are considered premium plot sizes in India, offering 2400 sq ft of ground area to build luxurious 4BHK or 5BHK homes with garden, car porch, and all modern amenities.",
    variants: [
      { label: "East Facing", href: "/house-plans/category/40x60-east-facing" },
      { label: "West Facing", href: "/house-plans/category/40x60-west-facing" },
      { label: "Duplex", href: "/house-plans/category/40x60-duplex" },
      { label: "4 BHK", href: "/house-plans/category/40x60-4bhk" },
      { label: "5 BHK", href: "/house-plans/category/40x60-5bhk" },
      { label: "G+2 Floor", href: "/house-plans/category/40x60-g-plus-2" },
      { label: "Bungalow Style", href: "/house-plans/category/40x60-bungalow" },
      { label: "Vastu", href: "/house-plans/category/40x60-vastu" },
    ],
    faqs: [
      { q: "What can I build on a 40x60 plot?", a: "A 40x60 plot gives you 2400 sq ft of ground coverage. You can build a luxury bungalow, a duplex villa, a 4-5 bedroom home with garage, or a G+2 apartment building for investment." },
      { q: "What is the construction cost for a 40x60 house?", a: "A 40x60 house construction costs approximately ₹30–70 lakhs in India depending on the city and finish level. Premium luxury construction can exceed ₹1 crore." },
    ],
  },
  "20x60": {
    display: "20x60", sqft: "1200 sq ft",
    description: "20x60 house plans are popular for narrow but deep urban plots. Despite the 20-foot frontage, the 60-foot depth allows for excellent room layouts with separate living, dining, and bedroom zones.",
    variants: [
      { label: "East Facing", href: "/house-plans/category/20x60-east-facing" },
      { label: "West Facing", href: "/house-plans/category/20x60-west-facing" },
      { label: "Duplex", href: "/house-plans/category/20x60-duplex" },
      { label: "3 BHK", href: "/house-plans/category/20x60-3bhk" },
      { label: "2 BHK", href: "/house-plans/category/20x60-2bhk" },
      { label: "Vastu", href: "/house-plans/category/20x60-vastu" },
    ],
    faqs: [
      { q: "Is a 20x60 plot good for a 3 BHK house?", a: "Yes, a 20x60 plot with 1200 sq ft footprint is ideal for a 3BHK if built as G+1. The depth of 60 feet allows separate bedroom zones, a spacious hall, and dedicated kitchen area." },
    ],
  },
  "25x50": {
    display: "25x50", sqft: "1250 sq ft",
    description: "25x50 house plans offer a balanced 1250 sq ft footprint — a sweet spot between compact and spacious. Ideal for a 3BHK home with good ventilation, vastu compliance, and modern elevation design.",
    variants: [
      { label: "East Facing", href: "/house-plans/category/25x50-east-facing" },
      { label: "West Facing", href: "/house-plans/category/25x50-west-facing" },
      { label: "Duplex", href: "/house-plans/category/25x50-duplex" },
      { label: "3 BHK", href: "/house-plans/category/25x50-3bhk" },
      { label: "2 BHK", href: "/house-plans/category/25x50-2bhk" },
      { label: "Vastu", href: "/house-plans/category/25x50-vastu" },
    ],
    faqs: [
      { q: "What is the best layout for a 25x50 house?", a: "For a 25x50 plot, a 3BHK layout with hall, kitchen, 2 bathrooms, and staircase for G+1 is the most efficient use. Leave some front space for parking or a small garden." },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ plotSize: string }> }): Promise<Metadata> {
  const { plotSize } = await params;
  const data = PLOT_SIZE_DATA[plotSize];
  const display = data?.display ?? plotSize.toUpperCase();
  const sqft = data?.sqft ?? "";
  const title = `${display} House Plans${sqft ? ` | ${sqft}` : ""} | Download Floor Plans India | HousePlanFiles`;
  const description = data?.description ?? `Browse readymade ${display} house plans in India. Download verified floor plans with vastu layout, elevation, and complete architectural specifications.`;
  return {
    title, description,
    keywords: [`${display} house plan`, `${display} floor plan`, `${display} house design india`, `${display} duplex house plan`, `${display} east facing house plan`, `${display} 3bhk house plan`, "readymade house plans india"],
    openGraph: { title, description, url: `https://www.houseplanfiles.com/house-plans/plot/${plotSize}`, images: [{ url: "/floorplan.jpg", width: 1200, height: 630, alt: `${display} House Plan India` }] },
    alternates: { canonical: `https://www.houseplanfiles.com/house-plans/plot/${plotSize}` },
  };
}

export default async function PlotSizePillarPage({ params }: { params: Promise<{ plotSize: string }> }) {
  const { plotSize } = await params;
  const data = PLOT_SIZE_DATA[plotSize];
  const display = data?.display ?? plotSize.toUpperCase();
  const sqft = data?.sqft ?? "";
  const variants = data?.variants ?? [];
  const faqs = data?.faqs ?? [];

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" },
      { "@type": "ListItem", position: 2, name: "House Plans", item: "https://www.houseplanfiles.com/house-plans" },
      { "@type": "ListItem", position: 3, name: `${display} House Plans`, item: `https://www.houseplanfiles.com/house-plans/plot/${plotSize}` },
    ],
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  } : null;

  // This renders BELOW the Navbar inside ProductsClient
  const header = (
    <div className="bg-white border-b border-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/house-plans" className="hover:text-orange-500 transition-colors">House Plans</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-orange-500 font-medium">{display} House Plans</li>
          </ol>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {display} House Plans{sqft ? ` (${sqft})` : ""}
        </h1>
        {data?.description && (
          <p className="mt-2 text-gray-600 max-w-3xl leading-relaxed text-sm md:text-base">{data.description}</p>
        )}

        {/* Variant links — the core cannibalization fix */}
        {variants.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Browse {display} plans by type:</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <Link key={v.href} href={v.href}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors">
                  {display} {v.label} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {sqft && (
          <div className="mt-4 flex flex-wrap gap-4">
            {[`Plot area: ${sqft}`, "Styles: Duplex · G+1 · G+2 · Bungalow", "Vastu compliant options available"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />{t}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <div className="min-h-screen">
        <TopBar />
        <Navbar />
        <main>
          <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading {display} house plans...</div>}>
            <ProductsClientWrapper plotSize={display} headerSlot={header} />
          </Suspense>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
              Frequently asked questions about {display} house plans
            </h2>
            <div className="space-y-5">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 text-base mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cross-link to other pillar pages */}
      <section className="bg-white border-t border-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Explore other popular plot sizes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(PLOT_SIZE_DATA).filter(([key]) => key !== plotSize).map(([key, val]) => (
              <Link key={key} href={`/house-plans/plot/${key}`}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-center group">
                <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{val.display}</span>
                <span className="text-xs text-gray-500 mt-1">{val.sqft}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
        </main>
        <Footer />
      </div>
    </>
  );
}