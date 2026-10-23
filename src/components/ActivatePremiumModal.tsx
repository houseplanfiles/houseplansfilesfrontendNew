"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  X,
  CheckCircle2,
  Loader2,
  MapPin,
  Building,
  Globe2,
  PhoneCall,
  MessageCircle,
  Share2,
  Bell,
  BadgeCheck,
} from "lucide-react";
import { State, City } from "country-state-city";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { toast } from "sonner";

interface ActivatePremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess?: (updatedUser?: any) => void;
}

const stateOptions = (State.getStatesOfCountry("IN") || []).map((s) => ({
  value: s.name,
  label: s.name,
}));

const cityOptions = (City.getCitiesOfCountry("IN") || []).map((c) => ({
  value: c.name,
  label: `${c.name}, ${c.stateCode}`,
}));

export default function ActivatePremiumModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: ActivatePremiumModalProps) {
  // Normalize user's existing cities/states
  const initialCities: string[] = useMemo(() => {
    if (!user) return [];
    if (Array.isArray(user.city)) return user.city;
    if (typeof user.city === "string" && user.city.trim()) {
      return user.city.split(",").map((c: string) => c.trim()).filter(Boolean);
    }
    return [];
  }, [user]);

  const initialStates: string[] = useMemo(() => {
    if (!user) return [];
    if (Array.isArray(user.selectedStates)) return user.selectedStates;
    if (typeof user.state === "string" && user.state.trim()) {
      return [user.state.trim()];
    }
    return [];
  }, [user]);

  const [selectedStates, setSelectedStates] = useState<string[]>(initialStates);
  const [selectedCities, setSelectedCities] = useState<string[]>(initialCities);
  const [isPanIndia, setIsPanIndia] = useState<boolean>(Boolean(user?.isPanIndia));
  const [selectedPlanId, setSelectedPlanId] = useState<string>("City_3M");
  const [isPaying, setIsPaying] = useState(false);

  // Sync state when user prop changes or modal opens
  useEffect(() => {
    if (isOpen && user) {
      setSelectedStates(initialStates);
      setSelectedCities(initialCities);
      setIsPanIndia(Boolean(user.isPanIndia));
      if (user.isPanIndia) {
        if (user.role === "seller") setSelectedPlanId("Seller_Pan_India");
        else if (user.role === "industrial") setSelectedPlanId("Industrial_Pan_India");
        else setSelectedPlanId("Pan_India_1Y");
      } else {
        if (user.role === "seller") setSelectedPlanId("Seller_City");
        else if (user.role === "industrial") setSelectedPlanId("Industrial_City");
        else setSelectedPlanId("City_3M");
      }
    }
  }, [isOpen, user, initialCities, initialStates]);

  const userRole = (user?.role || "professional").toLowerCase();

  // Plan Definitions matching Register page
  const plans = useMemo(() => {
    const cityCount = selectedCities.length > 0 ? selectedCities.length : 1;
    const stateCount = selectedStates.length > 0 ? selectedStates.length : 1;

    if (userRole === "seller") {
      return [
        {
          id: "Seller_City",
          name: "City Shop (1 Year)",
          duration: "1 Year",
          basePrice: 2999 * cityCount,
          note: cityCount > 1 ? `${cityCount} Cities (₹2,999/city)` : "Per City Shop Listing",
          badge: "City Level",
          isPanIndia: false,
        },
        {
          id: "Seller_State",
          name: "State Listing (1 Year)",
          duration: "1 Year",
          basePrice: 4999 * stateCount,
          note: stateCount > 1 ? `${stateCount} States (₹4,999/state)` : "Entire State Coverage",
          badge: "State Level",
          isPanIndia: false,
        },
        {
          id: "Seller_Pan_India",
          name: "PAN INDIA (1 Year)",
          duration: "1 Year",
          basePrice: 9999,
          note: "All India Coverage",
          badge: "Most Popular",
          isPanIndia: true,
        },
      ];
    }

    if (userRole === "industrial") {
      return [
        {
          id: "Industrial_City",
          name: "City Level (1 Year)",
          duration: "1 Year",
          basePrice: 4999 * cityCount,
          note: cityCount > 1 ? `${cityCount} Cities (₹4,999/city)` : "City Level Listing",
          badge: "City Level",
          isPanIndia: false,
        },
        {
          id: "Industrial_State",
          name: "State Level (1 Year)",
          duration: "1 Year",
          basePrice: 14999 * stateCount,
          note: stateCount > 1 ? `${stateCount} States (₹14,999/state)` : "State Level Listing",
          badge: "State Level",
          isPanIndia: false,
        },
        {
          id: "Industrial_Pan_India",
          name: "PAN INDIA (1 Year)",
          duration: "1 Year",
          basePrice: 24999,
          note: "All India Full Coverage",
          badge: "Top Priority",
          isPanIndia: true,
        },
      ];
    }

    // Default for Architect, Contractor, Other Services
    return [
      {
        id: "City_3M",
        name: "City (3 Months)",
        duration: "3 Months",
        basePrice: 999 * cityCount,
        note: cityCount > 1 ? `${cityCount} Cities (₹999/city)` : "Starter City Listing",
        badge: "Quarterly",
        isPanIndia: false,
      },
      {
        id: "City_6M",
        name: "City (6 Months)",
        duration: "6 Months",
        basePrice: 1999 * cityCount,
        note: cityCount > 1 ? `${cityCount} Cities (₹1,999/city)` : "Verified Profile",
        badge: "Half Yearly",
        isPanIndia: false,
      },
      {
        id: "City_1Y",
        name: "City (1 Year)",
        duration: "1 Year",
        basePrice: 2999 * cityCount,
        note: cityCount > 1 ? `${cityCount} Cities (₹2,999/city)` : "Annual City Listing",
        badge: "Best Value",
        isPanIndia: false,
      },
      {
        id: "State_1Y",
        name: "State (1 Year)",
        duration: "1 Year",
        basePrice: 4999 * stateCount,
        note: stateCount > 1 ? `${stateCount} States (₹4,999/state)` : "Entire State-wide Coverage",
        badge: "State Level",
        isPanIndia: false,
      },
      {
        id: "Pan_India_1Y",
        name: "PAN INDIA (1 Year)",
        duration: "1 Year",
        basePrice: 9999,
        note: "All India Top Listing",
        badge: "Maximum Visibility",
        isPanIndia: true,
      },
    ];
  }, [userRole, selectedCities.length, selectedStates.length]);

  const activePlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const itemsPrice = useMemo(() => {
    return activePlan.basePrice;
  }, [activePlan]);

  const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100;
  const totalPrice = itemsPrice + taxPrice;

  // Handle Pan India toggle with mutual exclusion
  const handlePanIndiaToggle = (checked: boolean) => {
    setIsPanIndia(checked);
    if (checked) {
      setSelectedCities([]);
      setSelectedStates([]);
      if (userRole === "seller") setSelectedPlanId("Seller_Pan_India");
      else if (userRole === "industrial") setSelectedPlanId("Industrial_Pan_India");
      else setSelectedPlanId("Pan_India_1Y");
    } else {
      if (userRole === "seller") setSelectedPlanId("Seller_City");
      else if (userRole === "industrial") setSelectedPlanId("Industrial_City");
      else setSelectedPlanId("City_3M");
    }
  };

  // Handle plan select
  const handleSelectPlan = (plan: (typeof plans)[0]) => {
    setSelectedPlanId(plan.id);
    if (plan.isPanIndia) {
      setIsPanIndia(true);
    } else {
      setIsPanIndia(false);
    }
  };

  // Payment Execution
  const handlePay = async () => {
    if (!user) return;
    setIsPaying(true);

    try {
      // 1. Load Razorpay script if needed
      if (!(window as any).Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      }

      // 2. Prepare Order Payload
      const orderData = {
        userId: user._id,
        orderItems: [
          {
            name: `${activePlan.name} [${isPanIndia ? "PAN INDIA" : selectedCities.join(", ") || "City Listing"}]`,
            price: itemsPrice,
          },
        ],
        shippingAddress: {
          name: user.name || user.businessName || "User",
          email: user.email || "",
          phone: user.phone || "",
          location: isPanIndia ? "PAN India" : selectedCities.join(", ") || "India",
        },
        paymentMethod: "Razorpay",
        itemsPrice: itemsPrice,
        taxPrice: taxPrice,
        shippingPrice: 0,
        totalPrice: totalPrice,
        orderType: "subscription",
        selectedStates: selectedStates,
        selectedCities: selectedCities,
        isPanIndia: isPanIndia,
      };

      const tokenHeader = user.token ? { Authorization: `Bearer ${user.token}` } : {};

      // 3. Create backend order
      const { data: createdOrder } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
        orderData,
        { headers: tokenHeader }
      );

      // 4. Create Razorpay order
      const { data: razorpayOrderData } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${createdOrder._id}/create-razorpay-order`,
        {},
        { headers: tokenHeader }
      );

      // 5. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: "HousePlanFiles",
        description: `Upgrade to Premium - ${activePlan.name}`,
        order_id: razorpayOrderData.orderId,
        handler: async (response: any) => {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${createdOrder._id}/verify-payment`,
              response,
              { headers: tokenHeader }
            );

            toast.success("Payment successful! Your account is now Premium Verified.");

            if (onSuccess) {
              onSuccess({
                paymentStatus: "Paid",
                contractorType: "Premium",
                isApproved: true,
                status: "Approved",
                selectedPlan: activePlan.name,
                isPanIndia: isPanIndia,
                selectedStates: selectedStates,
                city: selectedCities,
              });
            }
            onClose();
          } catch (err) {
            toast.error("Payment verification failed. Please contact HousePlanFiles support.");
          }
        },
        prefill: {
          name: user.name || user.businessName || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#ea580c",
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        toast.error(response.error?.description || "Payment Failed");
        setIsPaying(false);
      });
      rzp.open();
    } catch (error: any) {
      console.error("Upgrade error:", error);
      toast.error(error.response?.data?.message || "Failed to start payment. Try again.");
      setIsPaying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[700px] w-full max-h-[92vh] overflow-y-auto p-0 rounded-2xl border-none shadow-2xl bg-white text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 p-5 md:p-6 text-white relative sticky top-0 z-20 shadow-md">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-extrabold tracking-tight flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-amber-200" /> Activate Premium Account
            </DialogTitle>
          </DialogHeader>
          <p className="text-orange-100 font-medium mt-1 text-xs md:text-sm">
            Activate your profile, unlock client leads, and get verified on HousePlanFiles.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* 1. SELECT OPERATING REGION */}
          <div className="bg-orange-50/70 p-4 md:p-5 rounded-xl border border-orange-200/80">
            <div className="mb-3">
              <h4 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-600" /> Select Operating Region
              </h4>
              <p className="text-[11px] text-slate-500">
                Select your operating area to view suitable listing plans.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* 1. City selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-semibold text-slate-700 block">
                    City* <span className="text-[10px] text-gray-400 font-normal">(select multiple)</span>
                  </Label>
                  {selectedCities.length > 1 && !isPanIndia && selectedStates.length === 0 && (
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">
                      {selectedCities.length} Cities Selected
                    </span>
                  )}
                </div>
                <CreatableSelect
                  isMulti
                  options={cityOptions}
                  value={selectedCities.map((c) => ({ value: c, label: c }))}
                  onChange={(vals: any) => {
                    const newCities = vals ? vals.map((v: any) => v.value) : [];
                    setSelectedCities(newCities);
                    if (newCities.length > 0) {
                      setSelectedStates([]);
                      setIsPanIndia(false);
                      if (userRole === "seller") setSelectedPlanId("Seller_City");
                      else if (userRole === "industrial") setSelectedPlanId("Industrial_City");
                      else setSelectedPlanId("City_3M");
                    }
                  }}
                  placeholder={
                    isPanIndia
                      ? "Locked (PAN India is active)"
                      : selectedStates.length > 0
                      ? "Locked (State selection is active)"
                      : "Search or select city name..."
                  }
                  className="text-xs"
                  formatCreateLabel={(input: string) => `Add "${input}"`}
                  isDisabled={isPanIndia || selectedStates.length > 0}
                />
                {(isPanIndia || selectedStates.length > 0) && (
                  <p className="text-[10px] text-gray-400 mt-1">Locked: Clear State / PAN India to select City.</p>
                )}
              </div>

              {/* 2. State selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-semibold text-slate-700 block">
                    State* <span className="text-[10px] text-gray-400 font-normal">(select multiple)</span>
                  </Label>
                  {selectedStates.length > 1 && !isPanIndia && selectedCities.length === 0 && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                      {selectedStates.length} States Selected
                    </span>
                  )}
                </div>
                <CreatableSelect
                  isMulti
                  options={stateOptions}
                  value={selectedStates.map((s) => ({ value: s, label: s }))}
                  onChange={(vals: any) => {
                    const newStates = vals ? vals.map((v: any) => v.value) : [];
                    setSelectedStates(newStates);
                    if (newStates.length > 0) {
                      setSelectedCities([]);
                      setIsPanIndia(false);
                      if (userRole === "seller") setSelectedPlanId("Seller_State");
                      else if (userRole === "industrial") setSelectedPlanId("Industrial_State");
                      else setSelectedPlanId("State_1Y");
                    }
                  }}
                  placeholder={
                    isPanIndia
                      ? "Locked (PAN India is active)"
                      : selectedCities.length > 0
                      ? "Locked (City selection is active)"
                      : "Search or select state..."
                  }
                  className="text-xs"
                  formatCreateLabel={(input: string) => `Add "${input}"`}
                  isDisabled={isPanIndia || selectedCities.length > 0}
                />
                {(isPanIndia || selectedCities.length > 0) && (
                  <p className="text-[10px] text-gray-400 mt-1">Locked: Clear City / PAN India to select State.</p>
                )}
              </div>

              {/* 3. Serve PAN India below */}
              <div className="pt-1">
                <label
                  htmlFor="modal_pan_india"
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    selectedCities.length > 0 || selectedStates.length > 0
                      ? "bg-gray-100/70 border-gray-200 opacity-60 cursor-not-allowed"
                      : isPanIndia
                      ? "bg-orange-50 border-orange-400 shadow-sm cursor-pointer"
                      : "bg-white border-orange-200 hover:border-orange-300 cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    id="modal_pan_india"
                    className="w-4 h-4 rounded border-orange-400 text-orange-600 focus:ring-orange-500 cursor-pointer disabled:cursor-not-allowed"
                    checked={isPanIndia}
                    disabled={selectedCities.length > 0 || selectedStates.length > 0}
                    onChange={(e) => {
                      if (selectedCities.length > 0 || selectedStates.length > 0) return;
                      handlePanIndiaToggle(e.target.checked);
                    }}
                  />
                  <div>
                    <span className="text-xs md:text-sm font-bold text-orange-800 block">
                      Serve PAN India (₹9,999)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {selectedCities.length > 0 || selectedStates.length > 0
                        ? "Locked: Clear City or State selection to enable PAN India."
                        : "Expand coverage nationwide across all cities and states with top-tier ranking."}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 2. CHOOSE YOUR LISTING PLAN */}
          <div>
            <div className="mb-3">
              <h4 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-orange-600" /> Choose your Listing Plan
              </h4>
              <p className="text-[11px] text-slate-500">
                Hierarchy: City, State, or PAN India coverage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {plans.map((p) => {
                const isSelected = selectedPlanId === p.id;
                return (
                  <div
                    key={p.id}
                    role="button"
                    onClick={() => handleSelectPlan(p)}
                    className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/60 shadow-md ring-2 ring-orange-400/50"
                        : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            isSelected
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {p.badge}
                        </span>
                        {p.isPanIndia && (
                          <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1 rounded flex items-center gap-0.5">
                            <Globe2 className="w-2.5 h-2.5" /> All India
                          </span>
                        )}
                      </div>

                      <h5 className="font-extrabold text-xs md:text-sm text-slate-900 mb-0.5">
                        {p.name}
                      </h5>
                      <p className="text-[10px] text-slate-500 mb-2">{p.note}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-sm md:text-base font-black text-slate-900">
                          ₹{p.basePrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium"> +18% GST</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-orange-600 bg-orange-600" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. TOTAL INVESTMENT BREAKDOWN */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-700">Selected Plan</span>
              <span className="font-extrabold text-[#ea580c]">
                {activePlan.name}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-slate-200/60 pb-2">
              <span className="text-slate-600">Base Investment</span>
              <div className="text-right">
                <span className="font-bold text-slate-800 block">
                  ₹{itemsPrice.toLocaleString("en-IN")}
                </span>
                {selectedCities.length > 0 && selectedStates.length > 0 && !isPanIndia && (
                  <span className="text-[10px] text-orange-600 font-semibold block">
                    ({selectedCities.length} Cities + {selectedStates.length} States)
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-slate-200/60 pb-2">
              <span className="text-slate-600">GST (18%)</span>
              <span className="font-bold text-slate-800">
                ₹{taxPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs md:text-sm font-extrabold text-slate-900">Total Investment</span>
              <span className="text-base md:text-lg font-black text-slate-900">
                ₹{totalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* 4. WHAT YOU GET WITH PREMIUM (Exact 6 Points) */}
          <div className="space-y-2.5 bg-orange-50/40 p-4 rounded-xl border border-orange-100">
            <p className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" /> What You Get With Premium:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1- Verified Golden Profile Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2- WhatsApp Button</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>3- Call Button</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>4- Social Media Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>5- Profile Sharing Option</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>6- Direct Customer Enquiry Notification</span>
              </div>
            </div>
          </div>

          {/* 5. CTA BUTTON */}
          <Button
            onClick={handlePay}
            disabled={isPaying}
            className="w-full h-12 md:h-14 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm md:text-base font-extrabold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 border-none cursor-pointer"
          >
            {isPaying ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>Pay with Razorpay &amp; Activate (₹{totalPrice.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })})</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
