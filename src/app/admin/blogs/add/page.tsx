import type { Metadata } from "next";
import AdminAddEditBlogPage from "@/components/admin/AdminAddEditBlogPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminAddEditBlogPage />;
}
