import type { Metadata } from "next";
import OrdersPage from "@/components/Userdashboard/OrdersPage";

export const metadata: Metadata = {
  title: "My Orders | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrdersPage />;
}
