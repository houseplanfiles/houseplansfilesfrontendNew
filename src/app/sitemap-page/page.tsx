import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sitemap | HousePlanFiles",
  description: "Complete sitemap of HousePlanFiles - find all house plans, architects, blog posts and services.",
  alternates: { canonical: "https://www.houseplanfiles.com/sitemap-page" },
};

const sections = [
  { title: "House Plans", links: [
    { name: "All House Plans", href: "/house-plans" },
    { name: "Modern House Plans", href: "/house-plans/category/modern-home-design" },
    { name: "Duplex House Plans", href: "/house-plans/category/duplex-house-plans" },
    { name: "Village House Plans", href: "/house-plans/category/village-house-plans" },
    { name: "Vastu House Plans", href: "/house-plans/category/vastu-house-plans" },
    { name: "2BHK House Plans", href: "/house-plans/category/2bhk-house-plans" },
    { name: "3BHK House Plans", href: "/house-plans/category/3bhk-house-plans" },
    { name: "Bungalow Plans", href: "/house-plans/category/bungalow-villa-house-plans" },
  ]},
  { title: "Professionals", links: [
    { name: "Architects & Interior Designers", href: "/architects" },
    { name: "City Contractors", href: "/city-partners" },
    { name: "Marketplace", href: "/marketplace" },
  ]},
  { title: "Services", links: [
    { name: "Our Services", href: "/services" },
    { name: "Packages", href: "/packages" },
    { name: "Gallery", href: "/gallery" },
    { name: "Careers", href: "/careers" },
  ]},
  { title: "Company", links: [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Blogs", href: "/blogs" },
    { name: "Become a Seller", href: "/become-a-seller" },
  ]},
  { title: "Legal", links: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Payment Policy", href: "/payment-policy" },
  ]},
];

export default function SitemapPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sitemap</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-orange-600 mb-4 border-b border-orange-100 pb-2">{section.title}</h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
