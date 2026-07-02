import type { Metadata } from "next";
import DashboardPage from "@/components/Userdashboard/DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardPage />;
}
