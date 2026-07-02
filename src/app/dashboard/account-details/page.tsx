import type { Metadata } from "next";
import AccountDetailsPage from "@/components/Userdashboard/AccountDetailsPage";

export const metadata: Metadata = {
  title: "Account Details | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountDetailsPage />;
}
