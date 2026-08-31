import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Card | HousePlanFiles",
  description: "Smarter connections, stronger impact. Digital Cards for modern professionals.",
};

import DigitalCardClient from "@/components/DigitalCardClient";

export default function DigitalCardPage() {
  return <DigitalCardClient />;
}
