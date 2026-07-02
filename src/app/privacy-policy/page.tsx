import type { Metadata } from "next";
import PrivacyPolicyClient from "@/components/PrivacyPolicyClient";
export const metadata: Metadata = { title: "PrivacyPolicy | HousePlanFiles", description: "HousePlanFiles privacy-policy.", alternates: { canonical: "https://www.houseplanfiles.com/privacy-policy" } };
export default function Page() { return (<>
<main><PrivacyPolicyClient /></main>
</>); }
