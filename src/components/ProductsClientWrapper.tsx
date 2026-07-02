"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface ProductsClientWrapperProps {
  category?: string;
  plotSize?: string;
  region?: string;
  headerSlot?: React.ReactNode;
  showFooter?: boolean;
  hideNavbar?: boolean;
}

export default function ProductsClientWrapper({
  category,
  plotSize,
  region,
  headerSlot,
  showFooter = true,
  hideNavbar,
}: ProductsClientWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    let changed = false;

    if (category && params.get("category") !== category) {
      params.set("category", category);
      changed = true;
    }

    if (plotSize && params.get("plotSize") !== plotSize) {
      params.set("plotSize", plotSize);
      changed = true;
    }

    // city pages: clear unrelated filters and set city as search term
    if (region) {
      if (params.get("search") !== region) {
        params.delete("category");
        params.delete("plotSize");
        params.set("search", region);
        changed = true;
      }
    }

    if (changed) {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [category, plotSize, region, router, pathname, searchParams]);

  const ProductsClient = require("@/components/ProductsClient").default;

  return (
    <ProductsClient
      headerSlot={headerSlot}
      showFooter={showFooter}
    />
  );
}