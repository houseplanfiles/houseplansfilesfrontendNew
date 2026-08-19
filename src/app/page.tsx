import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

// Dynamic Imports for below-the-fold components to improve LCP/FCP
const ReadymadePlansSection = dynamic(() => import("@/components/ReadymadePlansSection"));
const TopArchitectsSection = dynamic(() => import("@/components/TopArchitectsSection"));
const ConstructionPartnersSection = dynamic(() => import("@/components/ConstructionPartnersSection"));
const SellersSection = dynamic(() => import("@/components/SellersSection"));
const RegionalPlansSection = dynamic(() => import("@/components/RegionalPlansSection"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const CTA = dynamic(() => import("@/components/CTA"));

export const metadata: Metadata = {
  title: "Readymade houseplans, Architects, interior designer, contractor, Building material and Home decor",
  description: "Explore 1000+ readymade house plans, floor plans, duplex designs & home blueprints in India. Download verified architectural plans by expert architects. Trusted contractors & building materials.",
  keywords: ["readymade house plans india", "house plans", "floor plans india", "home design india", "duplex house plans", "3bhk house plan", "2bhk floor plan", "village house plans", "vastu house plans india", "architects india"],
  openGraph: {
    title: "Readymade House Plans in India | HousePlanFiles",
    description: "Explore 1000+ readymade house plans, floor plans, duplex designs & home blueprints in India.",
    url: "https://www.houseplanfiles.com",
    type: "website",
    images: [{ url: "/b11.jpg", width: 1200, height: 630, alt: "Readymade House Plans India - HousePlanFiles" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Readymade House Plans in India | HousePlanFiles",
    description: "1000+ readymade house plans, duplex designs & floor plans by expert architects.",
    images: ["/b11.jpg"],
    creator: "@files22844",
  },
  alternates: { canonical: "https://www.houseplanfiles.com" },
};

const homeFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What types of house plans are available on HousePlanFiles?", acceptedAnswer: { "@type": "Answer", text: "HousePlanFiles offers 1000+ readymade house plans including 2BHK, 3BHK, duplex, village, modern, colonial, bungalow, apartment, and commercial plans for all plot sizes across India." } },
    { "@type": "Question", name: "How much does a readymade house plan cost in India?", acceptedAnswer: { "@type": "Answer", text: "Readymade house plans on HousePlanFiles start from a few hundred rupees. Each plan includes floor plan layouts, elevation views, and detailed architectural specifications." } },
    { "@type": "Question", name: "Can I get a customized house plan?", acceptedAnswer: { "@type": "Answer", text: "Yes, HousePlanFiles offers custom house plan design services. Our expert architects will design a plan tailored to your plot size, budget, and preferences." } },
    { "@type": "Question", name: "Are vastu-compliant house plans available?", acceptedAnswer: { "@type": "Answer", text: "Yes, we offer vastu-compliant house plans for all directions — east facing, west facing, north facing, and south facing plots across India." } },
    { "@type": "Question", name: "Can I find architects and contractors on HousePlanFiles?", acceptedAnswer: { "@type": "Answer", text: "Yes, HousePlanFiles has a directory of verified architects, interior designers, and city contractors across major Indian cities." } },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFAQSchema) }} />
      <div className="min-h-screen">
        <h1 className="sr-only">Readymade House Plans in India — HousePlanFiles</h1>
        <TopBar />
        <Navbar />
        <main>
          <Hero />
          <ConstructionPartnersSection />
          <TopArchitectsSection />
          <SellersSection />
          <ReadymadePlansSection />
          <RegionalPlansSection />

          {/* Browse by City — geo SEO entry point for users */}
          <section className="bg-white border-t border-gray-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">House plans, Architects, contractors. And shops in cities</h2>
                <p className="text-sm text-gray-500 mt-1">Find plans suited to your city's plot sizes, local architects, and construction costs.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { slug: "bhopal",    display: "Bhopal",    state: "Madhya Pradesh" },
                  { slug: "indore",    display: "Indore",    state: "Madhya Pradesh" },
                  { slug: "lucknow",   display: "Lucknow",   state: "Uttar Pradesh"  },
                  { slug: "jaipur",    display: "Jaipur",    state: "Rajasthan"      },
                  { slug: "nagpur",    display: "Nagpur",    state: "Maharashtra"    },
                  { slug: "pune",      display: "Pune",      state: "Maharashtra"    },
                  { slug: "hyderabad", display: "Hyderabad", state: "Telangana"      },
                  { slug: "chennai",   display: "Chennai",   state: "Tamil Nadu"     },
                  { slug: "mumbai",    display: "Mumbai",    state: "Maharashtra"    },
                  { slug: "bengaluru", display: "Bengaluru", state: "Karnataka"      },
                  { slug: "delhi",     display: "Delhi",     state: "Delhi"          },
                  { slug: "kolkata",   display: "Kolkata",   state: "West Bengal"    },
                  { slug: "ahmedabad", display: "Ahmedabad", state: "Gujarat"        },
                  { slug: "chandigarh",display: "Chandigarh",state: "Chandigarh"     },
                  { slug: "patna",     display: "Patna",     state: "Bihar"          },
                  { slug: "ranchi",    display: "Ranchi",    state: "Jharkhand"      },
                ].map((city) => (
                  <Link
                    key={city.slug}
                    href={`/city/${city.slug}`}
                    className="flex flex-col p-5 rounded-xl border border-gray-200 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md transition-all group"
                  >
                    <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{city.display}</span>
                    <span className="text-xs text-gray-500 mt-1">{city.state}</span>
                    <span className="text-xs text-orange-500 mt-3 font-medium group-hover:underline">Plans &amp; architects →</span>
                  </Link>
                ))}
              </div>
              <div className="mt-5">
                <Link href="/city-partners" className="text-sm text-orange-600 hover:underline font-medium">
                  View all city contractors →
                </Link>
              </div>
            </div>
          </section>

          <Testimonials />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
