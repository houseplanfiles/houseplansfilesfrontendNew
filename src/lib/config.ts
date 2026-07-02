/**
 * Central environment config.
 * In Next.js, browser-accessible vars must be NEXT_PUBLIC_.
 * We map them from NEXT_PUBLIC_ here — your .env.local uses NEXT_PUBLIC_ names.
 *
 * Original VITE_ mapping:
 *   VITE_BACKEND_URL        → NEXT_PUBLIC_BACKEND_URL
 *   VITE_SHARE_BACKEND_URL  → NEXT_PUBLIC_SHARE_BACKEND_URL
 *   VITE_RAZORPAY_KEY_ID    → NEXT_PUBLIC_RAZORPAY_KEY_ID
 *   PAYPAL_CLIENT_ID        → NEXT_PUBLIC_PAYPAL_CLIENT_ID
 *   VITE_AISENSY_API_KEY    → NEXT_PUBLIC_AISENSY_API_KEY
 */
export const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  shareBackendUrl: process.env.NEXT_PUBLIC_SHARE_BACKEND_URL || "https://houseplansfiles-backend.vercel.app",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  aisensyApiKey: process.env.NEXT_PUBLIC_AISENSY_API_KEY || "",
} as const;
