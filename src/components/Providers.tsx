"use client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/lib/store";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import ScrollToTop from "@/components/ScrollToTop";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const VoiceNavigation = dynamic(() => import("@/components/VoiceNavigation"), { ssr: false });
const WhatsAppWidget = dynamic(() => import("@/components/WhatsAppWidget"), { ssr: false });
const FloatingCurrencySwitcher = dynamic(() => import("@/components/FloatingCurrencySwitcher"), { ssr: false });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 1 },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [loadWidgets, setLoadWidgets] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoadWidgets(true), 6000); // 6s delay for Lighthouse
    const handleInteraction = () => setLoadWidgets(true);
    
    window.addEventListener("scroll", handleInteraction, { once: true });
    window.addEventListener("mousemove", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollToTop />
              {children}
              {loadWidgets && (
                <>
                  <WhatsAppWidget />
                  <VoiceNavigation />
                  <FloatingCurrencySwitcher />
                </>
              )}
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </QueryClientProvider>
    </Provider>
  );
}