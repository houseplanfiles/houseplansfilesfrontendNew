"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ShieldCheck, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useExternalScripts from "@/hooks/usePaymentGateway";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutSubscriptionClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { loaded: isRazorpayLoaded } = useExternalScripts([
    "https://checkout.razorpay.com/v1/checkout.js",
  ]);

  // Read URL parameters
  const userId = searchParams.get("userId");
  const plan = searchParams.get("plan") || "Basic";
  const profileCreation = searchParams.get("profileCreation") === "true";
  const management = searchParams.get("management") || "None";

  // Form states
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Fetch user info to pre-fill billing details
  useEffect(() => {
    if (!userId) {
      toast.error("User session not found. Please register again.");
      router.push("/register");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`
        );
        if (data) {
          setBillingInfo({
            name: data.name || data.businessName || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        }
      } catch (err) {
        console.error("Failed to load user info:", err);
      }
    };
    fetchUserInfo();
  }, [userId, router]);

  // Billing calculation
  const billingSummary = useMemo(() => {
    let planPrice = 999;
    let planName = "Basic Listing";

    switch (plan) {
      case "Standard":
        planPrice = 1499;
        planName = "Standard Listing";
        break;
      case "Premium":
        planPrice = 1999;
        planName = "Premium Listing (6 Month)";
        break;
      case "Premium+":
        planPrice = 2999;
        planName = "Premium+ Listing (12 Month)";
        break;
      case "Industrial_and_Infra_Services":
        planPrice = 4999;
        planName = "Industrial & Infra Services";
        break;
      default:
        planPrice = 999;
        planName = "Basic Listing";
    }

    const items = [{ name: planName, price: planPrice }];

    if (profileCreation) {
      items.push({ name: "Profile Creation Addon", price: 499 });
    }

    if (management === "6_Month") {
      items.push({ name: "6-Month Profile & Store Management", price: 999 });
    } else if (management === "1_Year") {
      items.push({ name: "1-Year Profile & Store Management", price: 1499 });
    }

    const subtotal = items.reduce((acc, curr) => acc + curr.price, 0);
    const taxPrice = Math.round(subtotal * 0.18 * 100) / 100;
    const totalPrice = subtotal + taxPrice;

    return { items, subtotal, taxPrice, totalPrice };
  }, [plan, profileCreation, management]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRazorpayPayment = async (order: any) => {
    if (!isRazorpayLoaded) {
      toast.error("Payment Gateway is loading. Please wait a moment.");
      return;
    }
    try {
      // Create Razorpay Order
      const { data: razorpayOrderData } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${order._id}/create-razorpay-order`,
        {}
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: "Houseplanfiles",
        order_id: razorpayOrderData.orderId,
        handler: async (response: any) => {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${order._id}/verify-payment`,
              response
            );
            toast.success("Payment successful! Your listing is now active.");
            router.push("/login");
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: billingInfo.name,
          email: billingInfo.email,
          contact: billingInfo.phone,
        },
        theme: {
          color: "#ea580c", // Orange color accent
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error("Failed to initiate payment gateway.");
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error("Please agree to the Terms and Conditions.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        userId,
        orderItems: billingSummary.items,
        shippingAddress: {
          name: billingInfo.name,
          email: billingInfo.email,
          phone: billingInfo.phone,
          location: "",
        },
        paymentMethod: "Razorpay",
        itemsPrice: billingSummary.subtotal,
        taxPrice: billingSummary.taxPrice,
        shippingPrice: 0,
        totalPrice: billingSummary.totalPrice,
        orderType: "subscription",
      };

      const { data: createdOrder } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
        orderData
      );

      if (createdOrder && createdOrder._id) {
        await handleRazorpayPayment(createdOrder);
      } else {
        throw new Error("Could not create listing subscription order");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/register")}
              className="bg-white hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Complete Listing Setup</h1>
              <p className="text-slate-500 text-sm mt-1">Please pay to activate your professional listing.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Billing Information Form */}
            <div className="md:col-span-3 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Billing Contact Info</h2>
                <form onSubmit={handleCheckoutSubmit} className="space-y-4" id="subscription-checkout-form">
                  <div>
                    <Label htmlFor="name">Full Name / Business Name</Label>
                    <Input
                      id="name"
                      required
                      value={billingInfo.name}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={billingInfo.email}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={billingInfo.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </form>
              </div>

              {/* Secure Payment Note */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex gap-3 text-emerald-800">
                <ShieldCheck className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-600" />
                <div>
                  <span className="font-bold text-xs block">100% Safe & Secure Payment</span>
                  <span className="text-[11px] opacity-90 block mt-0.5">
                    Your payment details are encrypted using industry-standard secure gateway networks.
                  </span>
                </div>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Listing Order Summary</h2>
                  <p className="text-slate-400 text-[11px] mt-0.5">Summary of your listing selections</p>
                </div>

                <div className="space-y-3">
                  {billingSummary.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-50 pb-3">
                      <div>
                        <span className="font-semibold text-slate-800 block">{item.name}</span>
                        <span className="text-[10px] text-slate-400">Qty: 1</span>
                      </div>
                      <span className="font-bold text-slate-800">₹{item.price.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 text-xs font-medium">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{billingSummary.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (18%)</span>
                    <span>₹{billingSummary.taxPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="border-t border-slate-100 my-4"></div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-orange-600">₹{billingSummary.totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Terms Acceptance */}
                <div className="flex items-start space-x-2 pt-2 border-t border-slate-50">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 accent-orange-600"
                  />
                  <label htmlFor="terms-checkbox" className="text-[11px] text-slate-500 cursor-pointer">
                    I agree to the HousePlanFiles listing terms and payment guidelines.
                  </label>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  form="subscription-checkout-form"
                  className="w-full btn-primary bg-orange-600 hover:bg-orange-700 py-3 text-sm font-bold shadow-lg"
                  disabled={isSubmitting || !isRazorpayLoaded}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Pay & Activate Listing"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutSubscriptionClient;
