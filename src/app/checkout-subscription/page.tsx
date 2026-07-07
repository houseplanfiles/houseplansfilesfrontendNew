"use client";

import React, { Suspense } from "react";
import CheckoutSubscriptionClient from "@/components/CheckoutSubscriptionClient";
import { Loader2 } from "lucide-react";

export default function CheckoutSubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <span className="text-sm font-medium text-slate-500">Loading Checkout...</span>
        </div>
      </div>
    }>
      <CheckoutSubscriptionClient />
    </Suspense>
  );
}
