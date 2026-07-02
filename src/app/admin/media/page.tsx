import type { Metadata } from "next";
import MediaPage from "@/components/admin/MediaPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MediaPage />;
}
