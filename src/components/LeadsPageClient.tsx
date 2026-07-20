"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Briefcase,
  Phone,
  Mail,
  User,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Loader2,
  DollarSign,
  ChevronRight,
} from "lucide-react";

import { RootState } from "@/lib/store";
import useExternalScripts from "@/hooks/usePaymentGateway";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface LeadType {
  _id: string;
  title: string;
  category: string;
  city: string;
  budget: string;
  requirements: string;
  price: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  status: "Available" | "Sold";
  buyer: string | null;
  createdAt: string;
}

const LeadsPageClient = () => {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { loaded: isRazorpayLoaded } = useExternalScripts([
    "https://checkout.razorpay.com/v1/checkout.js",
  ]);

  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const getAuthConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const config = userInfo?.token ? getAuthConfig() : {};
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads`,
        config
      );
      setLeads(data);
    } catch (error: any) {
      console.error("Failed to fetch leads:", error);
      toast.error("Failed to load leads board.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [userInfo]);

  const handleUnlockLead = async (lead: LeadType) => {
    if (!userInfo) {
      toast.error("Please login to purchase/unlock leads.");
      router.push("/login?redirect=/leads");
      return;
    }

    if (!isRazorpayLoaded) {
      toast.error("Razorpay SDK is loading, please try again in a moment.");
      return;
    }

    try {
      setPurchasingId(lead._id);
      const authConfig = getAuthConfig();

      // Create Razorpay Order
      const { data: orderData } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/${lead._id}/buy`,
        {},
        authConfig
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "HousePlanFiles",
        description: `Unlock Lead: ${lead.title}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            setLoading(true);
            // Verify payment
            await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/${lead._id}/verify`,
              response,
              authConfig
            );
            toast.success("Payment verified! Lead unlocked successfully.");
            await fetchLeads(); // Reload leads list
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.phone || "",
        },
        theme: {
          color: "#ea580c", // orange-600
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to initiate purchase.");
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mb-3 px-3 py-1 text-sm border-none">
              Exclusive Lead Marketplace
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Project <span className="text-orange-600">Leads Board</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Browse direct customer inquiries and project requirements. Pay a small fee to unlock contact information and get new business instantly.
            </p>
          </div>

          {loading && leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading project leads...</p>
            </div>
          ) : (
            <>
              {leads.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 shadow-sm">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">No Leads Available</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    There are no customer inquiries listed at the moment. Please check back later.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {leads.map((lead) => {
                    const isSold = lead.status === "Sold";
                    const isUnlocked = isSold && lead.clientPhone !== "Locked (Pay to Unlock)";
                    const isSoldToOthers = isSold && !isUnlocked;

                    return (
                      <motion.div
                        key={lead._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full ${
                          isUnlocked ? "border-green-200 ring-2 ring-green-500/10" : "border-gray-150"
                        }`}
                      >
                        <div>
                          {/* Top Badges & Meta */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                              {lead.category}
                            </span>
                            <div className="flex items-center gap-2">
                              {isUnlocked && (
                                <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> Unlocked
                                </span>
                              )}
                              {isSoldToOthers && (
                                <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5" /> Sold Out
                                </span>
                              )}
                              {!isSold && (
                                <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                  Available
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Lead Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                            {lead.title}
                          </h3>

                          {/* Info Rows */}
                          <div className="grid grid-cols-2 gap-4 my-4 py-3 border-y border-gray-50 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="font-semibold truncate">{lead.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="font-bold truncate text-orange-600">{lead.budget}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 col-span-2">
                              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span>Posted on: {new Date(lead.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Requirements Details */}
                          <div className="mb-6">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                              Project Requirements
                            </h4>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed line-clamp-3">
                              {lead.requirements}
                            </p>
                          </div>
                        </div>

                        {/* Action / Locked Contact Block */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          {isUnlocked ? (
                            <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 space-y-3">
                              <div className="flex items-center gap-2 text-sm font-bold text-green-800">
                                <Unlock className="w-4 h-4" /> Client Contact Details
                              </div>
                              <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="font-bold">{lead.clientName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <a href={`tel:${lead.clientPhone}`} className="font-semibold hover:underline">
                                    {lead.clientPhone}
                                  </a>
                                </div>
                                {lead.clientEmail && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <a href={`mailto:${lead.clientEmail}`} className="hover:underline">
                                      {lead.clientEmail}
                                    </a>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button
                                  onClick={() => window.open(`tel:${lead.clientPhone}`, "_self")}
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-9 text-xs"
                                >
                                  <Phone className="w-3.5 h-3.5 mr-1" /> Call Now
                                </Button>
                                <Button
                                  onClick={() =>
                                    window.open(
                                      `https://wa.me/91${lead.clientPhone}?text=${encodeURIComponent(
                                        `Hi ${lead.clientName}, I am contacting you regarding your request for "${lead.title}" on HousePlanFiles.`
                                      )}`,
                                      "_blank"
                                    )
                                  }
                                  className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-9 text-xs"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
                                </Button>
                              </div>
                            </div>
                          ) : isSoldToOthers ? (
                            <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 text-center">
                              <span className="text-red-700 text-sm font-bold block mb-1">Lead Closed</span>
                              <span className="text-gray-500 text-xs font-medium">
                                This lead has been purchased by another professional and is no longer available.
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                                  Price to Unlock
                                </span>
                                <span className="text-2xl font-black text-gray-900">
                                  ₹{lead.price}
                                </span>
                              </div>
                              <Button
                                onClick={() => handleUnlockLead(lead)}
                                disabled={purchasingId !== null}
                                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-5 rounded-xl flex items-center gap-2 text-sm shadow-md hover:shadow-orange-500/10 transition-all hover:-translate-y-0.5"
                              >
                                {purchasingId === lead._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Lock className="w-4 h-4" />
                                )}
                                Pay &amp; Unlock Contact
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LeadsPageClient;
