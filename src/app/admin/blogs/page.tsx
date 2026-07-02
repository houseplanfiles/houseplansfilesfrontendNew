import type { Metadata } from "next";
import AdminBlogsPage from "@/components/admin/AdminBlogsPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminBlogsPage />;
}
