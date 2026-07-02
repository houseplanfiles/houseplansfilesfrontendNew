import type { Metadata } from "next";
import ManageGalleryPage from "@/components/admin/ManageGalleryPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ManageGalleryPage />;
}
