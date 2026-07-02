import type { Metadata } from "next";
import AddressesPage from "@/components/Userdashboard/AddressesPage";

export const metadata: Metadata = {
  title: "My Addresses | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AddressesPage />;
}
