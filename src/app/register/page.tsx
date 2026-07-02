import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | HousePlanFiles",
  description: "Create your HousePlanFiles account. Register as a homeowner, architect, professional, or material seller.",
  robots: { index: false, follow: false },
};

import MultiRoleRegisterPageClient from "@/components/MultiRoleRegisterPageClient";

export default function RegisterPage() {
  return <MultiRoleRegisterPageClient />;
}
