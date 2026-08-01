import AdminAnalyticsReportPage from "@/components/admin/AdminAnalyticsReportPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Report | Admin Dashboard | HousePlanFiles",
  description: "Detailed analytics report for professionals and sellers",
};

export default function Page() {
  return <AdminAnalyticsReportPage />;
}
