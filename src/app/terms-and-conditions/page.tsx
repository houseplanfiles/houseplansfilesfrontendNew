import type { Metadata } from "next";
import TermsAndConditionsClient from "@/components/TermsAndConditionsClient";
export const metadata: Metadata = { title: "TermsAndConditions | HousePlanFiles", description: "HousePlanFiles terms-and-conditions.", alternates: { canonical: "https://www.houseplanfiles.com/terms-and-conditions" } };
export default function Page() { return (<>
<main><TermsAndConditionsClient /></main>
</>); }
