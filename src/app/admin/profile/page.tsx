import type { Metadata } from "next";
import ProfilePage from "@/components/admin/ProfilePage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ProfilePage />;
}
