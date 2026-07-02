import type { Metadata } from "next";
import VideoUploadPage from "@/components/admin/VideoUploadPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <VideoUploadPage />;
}
