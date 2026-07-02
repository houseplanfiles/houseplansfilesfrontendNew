import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
import ForgotPasswordPageClient from "@/components/ForgotPasswordPageClient";
export default function Page() { return <ForgotPasswordPageClient />; }