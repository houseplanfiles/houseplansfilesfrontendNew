"use client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/lib/store";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import VoiceNavigation from "@/components/VoiceNavigation";
import FloatingCurrencySwitcher from "@/components/FloatingCurrencySwitcher";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 1 },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollToTop />
              {children}
              <WhatsAppWidget />
              <VoiceNavigation />
              <FloatingCurrencySwitcher />
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </QueryClientProvider>
    </Provider>
  );
}