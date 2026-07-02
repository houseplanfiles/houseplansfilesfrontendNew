import type { Metadata } from "next";
import AddGalleryImagePage from "@/components/admin/AddGalleryImagePage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AddGalleryImagePage />;
}
