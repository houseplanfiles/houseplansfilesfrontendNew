import type { Metadata } from "next";
import AddProductPage from "@/components/admin/AddProductPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AddProductPage />;
}
