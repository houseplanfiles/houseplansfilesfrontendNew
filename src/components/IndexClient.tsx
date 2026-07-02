"use client";


import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

import RegionalPlansSection from "@/components/RegionalPlansSection";
import ReadymadePlansSection from "../components/ReadymadePlansSection";
import CustomDesignSection from "../components/CustomDesignSection";
import SellersSection from "@/components/SellersSection";
import ConstructionPartnersSection from "@/components/ConstructionPartnersSection";
import TopArchitectsSection from "@/components/TopArchitectsSection";
import TopBar from "@/components/TopBar";

import Services from "@/components/Services";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* --- Helmet Tag for SEO --- */}


      <TopBar />
      <Navbar />
      <Hero />
      <ReadymadePlansSection />
      <CustomDesignSection />

      {/* ✅ Top Architects Section */}
      <TopArchitectsSection />

      {/* ✅ Construction Partners (Headings only) */}
      <ConstructionPartnersSection />

      {/* ✅ Marketplace (Sellers Section) */}
      <SellersSection />

      {/* ✅ Services Section */}
      <Services />

      <RegionalPlansSection />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
