import type { Metadata } from "next";
import BecomeASellerClient from "@/components/BecomeASellerClient";
export const metadata: Metadata = {
  title: "Become a Seller | Sell House Plans & Building Materials | HousePlanFiles",
  description: "Join HousePlanFiles as a seller. List your house plans, building materials or construction products and reach thousands of homeowners across India.",
  openGraph: { title: "Become a Seller | HousePlanFiles", description: "Sell house plans and building materials to thousands of Indian homeowners.", url: "https://www.houseplanfiles.com/become-a-seller" },
  twitter: { card: "summary", title: "Become a Seller | HousePlanFiles", description: "Sell house plans and building materials on HousePlanFiles." },
  alternates: { canonical: "https://www.houseplanfiles.com/become-a-seller" },
};
export default function BecomeASellerPage() {
  return (<>
<main><BecomeASellerClient /></main>
</>);
}
