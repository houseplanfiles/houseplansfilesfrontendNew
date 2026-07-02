import type { Metadata } from "next";
import RefundPolicyClient from "@/components/RefundPolicyClient";
export const metadata: Metadata = { title: "RefundPolicy | HousePlanFiles", description: "HousePlanFiles refund-policy.", alternates: { canonical: "https://www.houseplanfiles.com/refund-policy" } };
export default function Page() { return (<>
<main><RefundPolicyClient /></main>
</>); }
