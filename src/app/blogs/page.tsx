import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogsPageClient from "@/components/BlogsPageClient";

export const metadata: Metadata = {
  title: "Blog | Home Design Tips, Architecture Insights | HousePlanFiles",
  description: "Read expert articles on house plans, home design ideas, architectural tips, construction guides, and interior design inspiration. Stay updated with the latest trends in Indian home design.",
  keywords: ["house design blog", "architecture blog india", "home design tips", "construction guide india", "interior design ideas", "house plan tips"],
  openGraph: {
    title: "Blog | Home Design Tips & Architecture Insights | HousePlanFiles",
    description: "Expert articles on house plans, home design, architecture, and construction for Indian homes.",
    url: "https://www.houseplanfiles.com/blogs",
    images: [{ url: "/logo1.png", width: 1200, height: 630, alt: "HousePlanFiles Blog" }],
  },
  alternates: { canonical: "https://www.houseplanfiles.com/blogs" },
};

export default function BlogsPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <BlogsPageClient />
      <Footer />
    </>
  );
}
