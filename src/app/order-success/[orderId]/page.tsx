
import { use } from "react";
import OrderSuccessPageClient from "@/components/OrderSuccessPageClient";

export default function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  return <OrderSuccessPageClient />;
}
