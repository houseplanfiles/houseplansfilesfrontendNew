import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
import LoginClient from "@/components/LoginClient";
export default function Page() { return <LoginClient />; }
