import type { Metadata } from "next";
import AddNewUserPage from "@/components/admin/AddNewUserPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AddNewUserPage />;
}
