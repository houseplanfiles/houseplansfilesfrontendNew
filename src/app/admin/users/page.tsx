import type { Metadata } from "next";
import AllUsersPage from "@/components/admin/AllUsersPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AllUsersPage />;
}
