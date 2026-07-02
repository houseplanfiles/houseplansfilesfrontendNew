"use client";
import Link from "next/link";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { motion } from "framer-motion";
import { Gavel } from "lucide-react"; // An icon for legal pages

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="bg-soft-teal min-h-screen">
        {/* Page Header */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="py-5 text-center bg-background"
        >
          <div className="container mx-auto px-4">
            <Gavel className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
              Terms & Conditions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Last updated: 27/05/2026
            </p>
          </div>
        </motion.section>

        {/* Main Content */}
        <main className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card p-8 md:p-12 rounded-2xl shadow-lg space-y-8 prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary hover:prose-a:underline"
            >
              <p>
                <strong>Terms & Conditions for Architects & Engineers Listing Services</strong><br/>
                These Terms & Conditions govern the listing, promotion, and lead generation services offered by HousePlanFiles.com for architects, civil engineers, interior designers, contractors, and related professionals.
              </p>

              <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
              <p>
                By registering, subscribing, or listing your business on HousePlanFiles.com, you agree to comply with these Terms & Conditions and all applicable laws and regulations.
              </p>

              <h2 className="text-2xl font-bold">2. Eligibility</h2>
              <p>The listing services are available only to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Licensed Architects</li>
                <li>Civil Engineers</li>
                <li>Structural Engineers</li>
                <li>Interior Designers</li>
                <li>Building Contractors</li>
                <li>Construction Consultants</li>
                <li>Home Decor Professionals</li>
                <li>Building Material Suppliers</li>
              </ul>
              <p>Users must provide accurate and authentic business information during registration.</p>

              <h2 className="text-2xl font-bold">3. Listing Services</h2>
              <p>HousePlanFiles.com may provide the following services:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Business profile listing</li>
                <li>Contact display</li>
                <li>WhatsApp inquiry button</li>
                <li>Portfolio showcase</li>
                <li>SEO optimization</li>
                <li>Lead generation</li>
                <li>Featured or premium placement</li>
                <li>Marketplace/store listing</li>
                <li>Profile management support</li>
              </ul>
              <p>Features may vary according to the selected plan.</p>

              <h2 className="text-2xl font-bold">4. Subscription Plans & Payments</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>Free, Standard, Premium, or Marketplace plans are subject to periodic pricing updates.</li>
                <li>Subscription fees are non-refundable unless otherwise approved by HousePlanFiles.com.</li>
                <li>Failure to pay renewal charges may result in suspension or removal of the listing.</li>
                <li>Premium visibility is provided only during the active subscription period.</li>
              </ul>

              <h2 className="text-2xl font-bold">5. Verification Policy</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>HousePlanFiles.com reserves the right to verify business details, licenses, certifications, and contact information.</li>
                <li>Verified badges may be removed if incorrect or misleading information is found.</li>
                <li>Fake, duplicate, or misleading profiles may be rejected or permanently removed without prior notice.</li>
              </ul>

              <h2 className="text-2xl font-bold">6. User Responsibilities</h2>
              <p>Listed professionals agree:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>To provide genuine and updated information.</li>
                <li>Not to upload copyrighted or unauthorized content.</li>
                <li>Not to misuse the platform for spam, fraud, or misleading promotions.</li>
                <li>To respond professionally to customer inquiries generated through the platform.</li>
                <li>To maintain ethical business practices.</li>
              </ul>

              <h2 className="text-2xl font-bold">7. Portfolio & Content Usage</h2>
              <p>By uploading images, plans, logos, videos, or portfolio content, you grant HousePlanFiles.com permission to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Display your content on the website</li>
                <li>Use content for promotional activities</li>
                <li>Share listings on social media and marketing campaigns</li>
                <li>Optimize listing pages for SEO and search visibility</li>
              </ul>
              <p>The user confirms ownership or authorization of uploaded content.</p>

              <h2 className="text-2xl font-bold">8. Intellectual Property</h2>
              <p>
                All website designs, branding elements, graphics, platform structure, and proprietary content of HousePlanFiles.com remain the intellectual property of the company. Unauthorized copying or reproduction is prohibited.
              </p>

              <h2 className="text-2xl font-bold">9. Lead Generation Disclaimer</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>HousePlanFiles.com does not guarantee a fixed number of leads, sales, or business conversions.</li>
                <li>Lead quality may vary depending on market demand, location, competition, and profile quality.</li>
                <li>The platform acts only as a promotional and listing medium between customers and professionals.</li>
              </ul>

              <h2 className="text-2xl font-bold">10. Ranking & Visibility</h2>
              <p>Search rankings and featured positions may depend on:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Subscription type</li>
                <li>Profile completeness</li>
                <li>Portfolio quality</li>
                <li>Customer engagement</li>
                <li>SEO performance</li>
                <li>Platform algorithms</li>
                <li>Your updates and activity on platform</li>
              </ul>
              <p>HousePlanFiles.com reserves the right to modify ranking systems at any time.</p>

              <h2 className="text-2xl font-bold">11. Prohibited Activities</h2>
              <p>Users shall not:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Post fake reviews or misleading claims</li>
                <li>Upload offensive or illegal content</li>
                <li>Impersonate another professional or company</li>
                <li>Share false project details</li>
                <li>Use the platform for unauthorized advertising</li>
                <li>Use AI generated content</li>
              </ul>
              <p>Violation may lead to immediate suspension or permanent ban.</p>

              <h2 className="text-2xl font-bold">12. Suspension & Termination</h2>
              <p>HousePlanFiles.com reserves the right to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Reject or remove any listing</li>
                <li>Suspend accounts violating policies</li>
                <li>Terminate services without refund in case of serious misconduct</li>
              </ul>

              <h2 className="text-2xl font-bold">13. Limitation of Liability</h2>
              <p>HousePlanFiles.com shall not be responsible for:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Any disputes between customers and listed professionals</li>
                <li>Construction defects or project failures</li>
                <li>Financial losses arising from client interactions</li>
                <li>Delays, technical interruptions, or temporary platform downtime</li>
              </ul>
              <p>Users are solely responsible for their services and commitments.</p>

              <h2 className="text-2xl font-bold">14. Privacy & Data Usage</h2>
              <p>
                Business information submitted may be publicly displayed for promotional and lead generation purposes. Personal data handling will be governed according to the platform’s privacy practices.
              </p>

              <h2 className="text-2xl font-bold">15. Modification of Terms</h2>
              <p>
                HousePlanFiles.com reserves the right to update or modify these Terms & Conditions at any time without prior notice. Continued use of the platform constitutes acceptance of updated terms.
              </p>

              <h2 className="text-2xl font-bold">16. Governing Law</h2>
              <p>
                These Terms & Conditions shall be governed under the laws of India. Any disputes shall fall under the jurisdiction of Madhya Pradesh, India.
              </p>

              <h2 className="text-2xl font-bold">17. Contact Information</h2>
              <p>For listing support, verification, or business inquiries, you can reach out to us:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Email:</strong> houseplansdesignsfile@gmail.com</li>
                <li><strong>Phone:</strong> +91 9755248864</li>
              </ul>

              <h2 className="text-2xl font-bold">18. Design Selling Split</h2>
              <p>
                Profit split in Readymade home design & interior design selling will be <strong>70% to 30%</strong>.<br/> 
                70% to the designer, 30% will be platform charges + 2% gateway fees extra.
              </p>

              <p className="pt-4 border-t border-border mt-8">
                If you have any questions or concerns about these Terms and
                Conditions, please reach out to us via our{" "}
                <Link href="/contact" className="font-semibold">Contact Us</Link> page.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
