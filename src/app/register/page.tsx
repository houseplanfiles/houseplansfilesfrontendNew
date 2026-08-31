import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | HousePlanFiles",
  description: "Create your HousePlanFiles account. Register as a homeowner, architect, professional, or material seller.",
  robots: { index: false, follow: false },
};

import React from "react";\nimport MultiRoleRegisterPageClient from "@/components/MultiRoleRegisterPageClient";

export default function RegisterPage() {
  return <React.Suspense fallback={<div>Loading...</div>}><MultiRoleRegisterPageClient /></React.Suspense>;
}
