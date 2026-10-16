import type { Metadata } from "next";
import TutorialsPageClient from "@/components/TutorialsPageClient";

export const metadata: Metadata = {
  title: "Video Tutorials & Architectural Walkthroughs | HousePlanFiles",
  description:
    "Watch our expert architecture, house construction, floor planning, and 3D walkthrough video tutorials to guide your dream home journey.",
  openGraph: {
    title: "Video Tutorials | HousePlanFiles",
    description:
      "Watch our expert architecture, house construction, floor planning, and 3D walkthrough video tutorials.",
    url: "https://www.houseplanfiles.com/tutorials",
  },
  alternates: {
    canonical: "https://www.houseplanfiles.com/tutorials",
  },
};

export default function TutorialsPage() {
  return <TutorialsPageClient />;
}
