import type { Metadata } from "next";
import PaymentPolicyClient from "@/components/PaymentPolicyClient";
export const metadata: Metadata = { title: "PaymentPolicy | HousePlanFiles", description: "HousePlanFiles payment-policy.", alternates: { canonical: "https://www.houseplanfiles.com/payment-policy" } };
export default function Page() { return (<>
<main><PaymentPolicyClient /></main>
</>); }
