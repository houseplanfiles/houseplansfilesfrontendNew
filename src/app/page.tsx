import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HomeServicesCategoriesSection from "@/components/HomeServicesCategoriesSection";
import TopArchitectsSection from "@/components/TopArchitectsSection";
import ConstructionPartnersSection from "@/components/ConstructionPartnersSection";
import SellersSection from "@/components/SellersSection";
import RegionalPlansSection from "@/components/RegionalPlansSection";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import CityExplorer from "@/components/CityExplorer";
import WhyChooseUs from "@/components/WhyChooseUs";
import JourneyProcess from "@/components/JourneyProcess";
import LeadBoardHowItWorks from "@/components/LeadBoardHowItWorks";
import RegistrationPrompts from "@/components/RegistrationPrompts";

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
          <HomeServicesCategoriesSection />
          <WhyChooseUs />
          <CityExplorer />
          <JourneyProcess />

          <section className="bg-white py-10 md:py-16">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
                  Kuch Khaas <span className="text-orange-600">Aapke Liye</span>
                </h2>
                <p className="text-lg text-gray-500 font-medium">
                  Explore our top professionals, contractors, and shops
                </p>
              </div>
              <TopArchitectsSection />
              <ConstructionPartnersSection />
              <SellersSection />
              
              {/* Added Lead Board How it Works per client feedback */}
              <LeadBoardHowItWorks />
            </div>
          </section>

          {/* Added Registration Prompts per client feedback */}
          <RegistrationPrompts />

          <RegionalPlansSection />

          <Testimonials />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
