import type { Metadata } from "next";
import OrdersPage from "@/components/admin/OrdersPage";

export const metadata: Metadata = {
  title: "Admin | HousePlanFiles",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrdersPage />;
}
