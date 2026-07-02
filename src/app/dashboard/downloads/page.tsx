import type { Metadata } from "next";
import DownloadsPage from "@/components/Userdashboard/DownloadsPage";

export const metadata: Metadata = {
  title: "My Downloads | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DownloadsPage />;
}
