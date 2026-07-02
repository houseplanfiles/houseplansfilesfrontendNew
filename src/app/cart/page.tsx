import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
import CartClient from "@/components/CartClient";
export default function Page() { return <CartClient />; }
