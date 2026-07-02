import type { Metadata } from "next";
import ProfessionalLayout from "@/components/professional/ProfessionalLayout";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProfessionalLayout>{children}</ProfessionalLayout>;
}
