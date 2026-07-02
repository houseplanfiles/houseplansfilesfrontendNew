import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
import ThankYouClient from "@/components/ThankYouClient";
export default function Page() { return <ThankYouClient />; }
