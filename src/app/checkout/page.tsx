import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
import CheckoutClient from "@/components/CheckoutClient";
export default function Page() { return <CheckoutClient />; }
