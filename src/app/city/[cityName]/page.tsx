import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import ProductsClientWrapper from "@/components/ProductsClientWrapper";
import Footer from "@/components/Footer";

const CITY_DATA: Record<string, {
  display: string; state: string; description: string;
  constructionNote: string; plotSizes: string[];
  faqs: { q: string; a: string }[];
}> = {
  bhopal: {
    display: "Bhopal", state: "Madhya Pradesh",
    description: "Browse readymade house plans popular in Bhopal, Madhya Pradesh. Find 2BHK, 3BHK, duplex, and vastu-compliant floor plans suited for Bhopal's plot sizes and local construction style.",
    constructionNote: "Construction costs in Bhopal typically range from ₹1200–1800 per sq ft.",
    plotSizes: ["30x40", "20x40", "30x50"],
    faqs: [
      { q: "How much does house construction cost in Bhopal?", a: "House construction in Bhopal costs approximately ₹1200–1800 per sq ft for basic to medium finish. A 30x40 (1200 sq ft) ground floor costs ₹15–22 lakhs. Premium with interior design can reach ₹2000–2500 per sq ft." },
      { q: "Where can I find verified architects in Bhopal?", a: "HousePlanFiles lists verified architects and civil engineers in Bhopal who can design custom plans or modify readymade ones for your plot and budget." },
      { q: "What are the most popular house plan sizes in Bhopal?", a: "30x40, 25x50, and 40x60 plots are most common in localities like Ayodhya Bypass, Kolar Road, and BHEL areas. East and North facing plans are especially popular." },
    ],
  },
  indore: {
    display: "Indore", state: "Madhya Pradesh",
    description: "Explore readymade house plans popular in Indore. Find 2BHK, 3BHK, duplex, and modern elevation house plans suited for Indore's plot dimensions. Connect with top architects and contractors in Indore.",
    constructionNote: "Construction costs in Indore range from ₹1400–2200 per sq ft.",
    plotSizes: ["30x40", "30x50", "40x60"],
    faqs: [
      { q: "How much does house construction cost in Indore?", a: "Construction in Indore costs ₹1400–2200 per sq ft. Premium RCC framing and quality finishing costs ₹1800–2200/sq ft." },
      { q: "Are there architects available in Indore on HousePlanFiles?", a: "Yes, HousePlanFiles has verified architects and interior designers in Indore. View portfolios and contact them directly." },
    ],
  },
  lucknow: {
    display: "Lucknow", state: "Uttar Pradesh",
    description: "Discover readymade house plans suited for Lucknow plots. From traditional Nawabi-inspired elevations to modern duplex designs, find vastu-compliant floor plans for Lucknow's common plot sizes.",
    constructionNote: "Construction costs in Lucknow range from ₹1100–1700 per sq ft.",
    plotSizes: ["30x40", "25x50", "40x60"],
    faqs: [
      { q: "How much does construction cost in Lucknow?", a: "House construction in Lucknow costs ₹1100–1700 per sq ft. A 30x40 house can be built for ₹13–20 lakhs at basic finish. LDA-approved localities may have additional compliance costs." },
      { q: "Are vastu house plans available for Lucknow?", a: "Yes, vastu-compliant east and north facing plans are available for popular localities like Gomti Nagar, Alambagh, and Vikas Nagar." },
    ],
  },
  jaipur: {
    display: "Jaipur", state: "Rajasthan",
    description: "Find readymade house plans for Jaipur — from traditional Rajasthani elevation styles to modern designs. Browse vastu-compliant 2BHK, 3BHK, and duplex plans.",
    constructionNote: "Construction costs in Jaipur range from ₹1300–2000 per sq ft.",
    plotSizes: ["30x40", "30x50", "40x60"],
    faqs: [
      { q: "How much does construction cost in Jaipur?", a: "Construction in Jaipur costs ₹1300–2000 per sq ft. Premium areas like Jagatpura, Mansarovar, and Tonk Road command higher rates." },
      { q: "What house plan styles are popular in Jaipur?", a: "Traditional Rajasthani elevations with arches and jaali work remain popular, combined with modern open floor plans. East facing vastu plans are especially sought after." },
    ],
  },
  nagpur: {
    display: "Nagpur", state: "Maharashtra",
    description: "Explore readymade house plans popular in Nagpur. Find east facing, vastu-compliant 2BHK, 3BHK, and duplex floor plans for Nagpur's common plot dimensions.",
    constructionNote: "Construction costs in Nagpur range from ₹1300–2000 per sq ft.",
    plotSizes: ["30x40", "20x40", "30x50"],
    faqs: [
      { q: "How much does house construction cost in Nagpur?", a: "In Nagpur, construction costs ₹1300–2000 per sq ft. Areas like Wardha Road, Manish Nagar, and Dharampeth command higher rates due to location premium." },
    ],
  },
  pune: {
    display: "Pune", state: "Maharashtra",
    description: "Browse readymade house plans for Pune's growing residential areas. From compact 2BHK designs for 20x40 plots to spacious bungalow plans. Connect with verified architects in Pune.",
    constructionNote: "Construction costs in Pune range from ₹1600–2800 per sq ft.",
    plotSizes: ["20x40", "30x40", "30x50"],
    faqs: [
      { q: "How much does construction cost in Pune?", a: "Construction in Pune ranges from ₹1600–2800 per sq ft. Areas like Hinjewadi, Baner, and Wakad have higher premiums." },
      { q: "Can I find house plans for small Pune plots?", a: "Yes, HousePlanFiles has 20x30 and 20x40 narrow plot plans ideal for Pune's densely developed areas with smart vertical layouts." },
    ],
  },
  hyderabad: {
    display: "Hyderabad", state: "Telangana",
    description: "Discover house plans for Hyderabad — from compact city homes to spacious G+2 villas. Browse vastu-compliant east and north facing designs for 30x40, 40x60, and larger plots.",
    constructionNote: "Construction costs in Hyderabad range from ₹1500–2500 per sq ft.",
    plotSizes: ["30x40", "40x60", "30x50"],
    faqs: [
      { q: "How much does house construction cost in Hyderabad?", a: "Construction in Hyderabad costs ₹1500–2500 per sq ft. Outskirts like Kompally and Bachupally are lower; Jubilee Hills and Banjara Hills are premium." },
      { q: "What plot sizes are common in Hyderabad?", a: "GHMC layout plots are commonly 200 sq yards (30x60 to 40x60 ft) in areas like Kukatpally, Miyapur, and Uppal." },
    ],
  },
  chennai: {
    display: "Chennai", state: "Tamil Nadu",
    description: "Find house plans for Chennai's plot dimensions and climate. Browse east and north facing vastu plans and ground + floor designs for Chennai's 600–1200 sq ft plots.",
    constructionNote: "Construction costs in Chennai range from ₹1700–2800 per sq ft.",
    plotSizes: ["20x40", "30x40", "30x50"],
    faqs: [
      { q: "What are common plot sizes in Chennai?", a: "Chennai plots typically range 600–1200 sq ft in Tambaram, Velachery, and Anna Nagar. OMR and ECR plots can be 1500–2400 sq ft." },
    ],
  },
  mumbai: {
    display: "Mumbai", state: "Maharashtra",
    description: "Browse readymade house plans and architectural designs for Mumbai. Find space-saving floor plans suited for Mumbai's compact plot sizes and dense urban environments.",
    constructionNote: "Construction costs in Mumbai typically range from ₹2000–3500 per sq ft depending on the locality and foundation requirements.",
    plotSizes: ["15x30", "20x40", "30x40"],
    faqs: [],
  },
  bengaluru: {
    display: "Bengaluru", state: "Karnataka",
    description: "Discover house plans and elevations for Bengaluru. Explore vastu-compliant 3BHK, duplex, and multi-family house plans suited for Bengaluru's standard BDA plot dimensions.",
    constructionNote: "Construction costs in Bengaluru range from ₹1600–2800 per sq ft.",
    plotSizes: ["30x40", "40x60", "30x50"],
    faqs: [],
  },
  delhi: {
    display: "Delhi", state: "Delhi",
    description: "Explore readymade house plans for Delhi NCR. Find builder floor designs, stilt parking layouts, and modern elevations tailored to Delhi's building byelaws.",
    constructionNote: "Construction costs in Delhi range from ₹1800–3000 per sq ft.",
    plotSizes: ["25x50", "30x60", "40x60"],
    faqs: [],
  },
  kolkata: {
    display: "Kolkata", state: "West Bengal",
    description: "Find readymade house plans for Kolkata. Browse east and south-facing vastu designs tailored for Kolkata's climate and soil conditions.",
    constructionNote: "Construction costs in Kolkata range from ₹1400–2200 per sq ft.",
    plotSizes: ["20x40", "30x40", "40x60"],
    faqs: [],
  },
  ahmedabad: {
    display: "Ahmedabad", state: "Gujarat",
    description: "Discover house plans popular in Ahmedabad. Browse modern duplex, bungalow, and vastu-compliant floor plans suited for Gujarat's lifestyle and plot sizes.",
    constructionNote: "Construction costs in Ahmedabad range from ₹1400–2300 per sq ft.",
    plotSizes: ["30x40", "40x60", "50x80"],
    faqs: [],
  },
  chandigarh: {
    display: "Chandigarh", state: "Chandigarh",
    description: "Find readymade house plans for Chandigarh. Explore HUDA-compliant designs, spacious bungalow layouts, and modern architecture suited for the tri-city region.",
    constructionNote: "Construction costs in Chandigarh range from ₹1600–2500 per sq ft.",
    plotSizes: ["10 Marla", "1 Kanal", "30x60"],
    faqs: [],
  },
  patna: {
    display: "Patna", state: "Bihar",
    description: "Browse readymade house plans popular in Patna, Bihar. Find 2BHK, 3BHK, and multi-story floor plans suited for Patna's plot sizes and local construction styles.",
    constructionNote: "Construction costs in Patna typically range from ₹1300–1900 per sq ft.",
    plotSizes: ["20x40", "30x40", "30x50"],
    faqs: [],
  },
  ranchi: {
    display: "Ranchi", state: "Jharkhand",
    description: "Explore readymade house plans for Ranchi. Find east-facing, vastu-compliant designs and duplex elevations suited for Ranchi's terrain and plot sizes.",
    constructionNote: "Construction costs in Ranchi range from ₹1300–1800 per sq ft.",
    plotSizes: ["30x40", "30x50", "40x60"],
    faqs: [],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ cityName: string }> }): Promise<Metadata> {
  const { cityName } = await params;
  const data = CITY_DATA[cityName];
  const displayCity = data?.display ?? cityName.charAt(0).toUpperCase() + cityName.slice(1);
  const state = data?.state ?? "India";
  const title = `House Plans in ${displayCity} | Architects & Floor Plans | HousePlanFiles`;
  const description = data?.description ?? `Browse readymade house plans and connect with verified architects in ${displayCity}, ${state}.`;
  return {
    title, description,
    keywords: [`house plans in ${displayCity}`, `architects in ${displayCity}`, `contractors in ${displayCity}`, `house design ${displayCity}`, `construction cost ${displayCity}`, "readymade house plans india"],
    openGraph: { title, description, url: `https://www.houseplanfiles.com/city/${cityName}`, images: [{ url: "/floorplan.jpg", width: 1200, height: 630, alt: `House Plans in ${displayCity}` }] },
    alternates: { canonical: `https://www.houseplanfiles.com/city/${cityName}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ cityName: string }> }) {
  const { cityName } = await params;
  const data = CITY_DATA[cityName];
  const displayCity = data?.display ?? cityName.charAt(0).toUpperCase() + cityName.slice(1);
  const state = data?.state ?? "India";
  const faqs = data?.faqs ?? [];
  const plotSizes = data?.plotSizes ?? ["30x40", "20x40", "30x50"];

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.houseplanfiles.com" },
      { "@type": "ListItem", position: 2, name: `House Plans in ${displayCity}`, item: `https://www.houseplanfiles.com/city/${cityName}` },
    ],
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  } : null;

  const localCitySchema = {
    "@context": "https://schema.org", "@type": "LocalBusiness",
    name: `HousePlanFiles — ${displayCity}`,
    description: `Readymade house plans and architectural services in ${displayCity}, ${state}`,
    url: `https://www.houseplanfiles.com/city/${cityName}`,
    areaServed: { "@type": "City", name: displayCity, containedInPlace: { "@type": "State", name: state, containedInPlace: { "@type": "Country", name: "India" } } },
    parentOrganization: { "@type": "Organization", name: "HousePlanFiles", url: "https://www.houseplanfiles.com" },
  };

  // Renders below the Navbar that ProductsClient owns
  const header = (
    <div className="bg-white border-b border-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/house-plans" className="hover:text-orange-500 transition-colors">House Plans</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-orange-500 font-medium">House Plans in {displayCity}</li>
          </ol>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          House Plans in {displayCity}, {state}
        </h1>
        {data?.description && (
          <p className="mt-2 text-gray-600 max-w-3xl leading-relaxed text-sm md:text-base">{data.description}</p>
        )}
        {data?.constructionNote && (
          <p className="mt-1 text-sm text-gray-500 italic">{data.constructionNote}</p>
        )}

        {/* CTA buttons */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/architects?city=${displayCity}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">
            Find Architects in {displayCity} →
          </Link>
          <Link href={`/city-partners?city=${displayCity}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-300 text-orange-700 text-sm font-medium hover:bg-orange-50 transition-colors">
            Contractors in {displayCity}
          </Link>
          <Link href="/customize/floor-plans"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
            Get Custom Plan
          </Link>
        </div>

      </div>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localCitySchema) }} />

      {/* ProductsClient owns the Navbar — header renders right below it */}
      <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading house plans for {displayCity}...</div>}>
        <ProductsClientWrapper region={displayCity} headerSlot={header}   showFooter={false} />
      </Suspense>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
              House construction in {displayCity} — frequently asked questions
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

      {/* Cross-link to other cities */}
      <section className="bg-white border-t border-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-5">House plans in other cities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(CITY_DATA).filter(([key]) => key !== cityName).map(([key, val]) => (
              <Link key={key} href={`/city/${key}`}
                className="flex flex-col p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all group">
                <span className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors text-sm">{val.display}</span>
                <span className="text-xs text-gray-500 mt-0.5">{val.state}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}