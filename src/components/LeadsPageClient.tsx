"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Briefcase,
  Phone,
  Mail,
  User,
  Lock,
  Unlock,
  AlertCircle,
  MessageCircle,
  Loader2,
  IndianRupee,
  Sparkles,
  Download,
  Search,
} from "lucide-react";
import { RootState } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

declare global {
  interface Window { Razorpay: any; }
}

interface LeadType {
  _id: string;
  sourceType?: "admin_lead" | "contractor_inquiry" | "seller_inquiry" | "corporate_inquiry";
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
  contactRevealed: boolean;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  Architect: "bg-violet-100 text-violet-700",
  Contractor: "bg-blue-100 text-blue-700",
  "Interior Designer": "bg-pink-100 text-pink-700",
  "Electrical Contractor": "bg-yellow-100 text-yellow-700",
  "Swimming Pool Contractor": "bg-cyan-100 text-cyan-700",
  Corporate: "bg-indigo-100 text-indigo-700",
  "Building Material": "bg-amber-100 text-amber-700",
};

const downloadLead = (lead: LeadType) => {
  const content = [
    "===========================================",
    "  LEAD CONTACT DETAILS — HousePlanFiles",
    "===========================================",
    "",
    `Title    : ${lead.title}`,
    `Category : ${lead.category}`,
    `City     : ${lead.city}`,
    `Budget   : ${lead.budget}`,
    "",
    "--- CLIENT CONTACT ---",
    `Name     : ${lead.clientName}`,
    `Phone    : ${lead.clientPhone}`,
    `Email    : ${lead.clientEmail || "N/A"}`,
    "",
    "--- PROJECT REQUIREMENTS ---",
    lead.requirements,
    "",
    `Downloaded on: ${new Date().toLocaleString()}`,
    "===========================================",
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lead_contact_${lead._id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function LeadsPageClient() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  const [cityFilter, setCityFilter] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Load Razorpay SDK manually
  useEffect(() => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      setRazorpayReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    document.body.appendChild(script);
  }, []);

  const getAuthConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  }), [userInfo]);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const config = userInfo?.token ? getAuthConfig() : {};
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads`,
        config
      );
      setLeads(data);
    } catch (err: any) {
      toast.error("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }, [userInfo, getAuthConfig]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleUnlockLead = async (lead: LeadType) => {
    if (!userInfo) {
      toast.error("Please login to purchase this lead.");
      router.push("/login?redirect=/leads");
      return;
    }
    if (!razorpayReady) {
      toast.error("Payment gateway loading... please wait.");
      return;
    }
    try {
      setPurchasingId(lead._id);
      const authConfig = getAuthConfig();
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
            await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/${lead._id}/verify`,
              response,
              authConfig
            );
            toast.success("Payment successful! Lead unlocked.");
            fetchLeads();
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        prefill: { name: userInfo.name, email: userInfo.email },
        theme: { color: "#ea580c" },
      };
      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment.");
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-gray-50 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" /> Exclusive Lead Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Project <span className="text-orange-600">Leads Board</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
              Real customer inquiries from across the platform. Pay to unlock contact details and win projects instantly.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-10 flex flex-col gap-6">
            <div className="relative w-full sm:w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by City..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all w-full rounded-xl"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Column 1 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Professionals</h3>
                <div className="space-y-3">
                  {["Architect", "Civil Engineer", "Interior Designer", "Structure Engineer", "MEP Consultant", "Vastu Consultant"].map((prof) => (
                    <label key={prof} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={selectedCategories.includes(prof)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, prof]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== prof));
                            }
                          }}
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded transition-colors peer-checked:bg-orange-500 peer-checked:border-orange-500 flex items-center justify-center group-hover:border-orange-400">
                          <svg className={`w-3 h-3 text-white transition-opacity ${selectedCategories.includes(prof) ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{prof}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Column 2 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Contractors</h3>
                <div className="space-y-3">
                  {["Building Contractor", "Interior Contractor", "Electrical Contractor", "Plumbing Contractor", "Carpenter", "Painting Contractor", "Tiles Contractor"].map((prof) => (
                    <label key={prof} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={selectedCategories.includes(prof)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, prof]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== prof));
                            }
                          }}
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded transition-colors peer-checked:bg-orange-500 peer-checked:border-orange-500 flex items-center justify-center group-hover:border-orange-400">
                          <svg className={`w-3 h-3 text-white transition-opacity ${selectedCategories.includes(prof) ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{prof}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Fetching latest leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No Leads Yet</h3>
              <p className="text-gray-400 mt-2 max-w-sm mx-auto text-sm">No inquiries available. Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {leads.filter((lead) => {
                const matchesCity = !cityFilter || (lead.city && lead.city.toLowerCase().includes(cityFilter.toLowerCase()));
                const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(cat => {
                  const searchStr = cat.toLowerCase();
                  return (
                    lead.category?.toLowerCase().includes(searchStr) ||
                    lead.title?.toLowerCase().includes(searchStr) ||
                    lead.requirements?.toLowerCase().includes(searchStr)
                  );
                });
                return matchesCity && matchesCategory;
              }).map((lead, idx) => {
                // ✅ Use ONLY the explicit boolean from backend — zero string matching
                const revealed: boolean = lead.contactRevealed === true;
                const isSold: boolean = lead.status === "Sold";
                const soldToOthers: boolean = isSold && !revealed;
                const isAdminLead: boolean = lead.sourceType === "admin_lead";
                // Can purchase ONLY if: admin lead + has price + NOT yet sold
                const canBuy: boolean = isAdminLead && lead.price > 0 && !isSold;
                const catColor = categoryColors[lead.category] || "bg-gray-100 text-gray-600";

                return (
                  <motion.div
                    key={`${lead._id}-${idx}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
                      revealed ? "border-green-300 ring-2 ring-green-400/15"
                      : soldToOthers ? "border-red-200"
                      : "border-gray-200 hover:border-orange-200"
                    }`}
                  >
                    <div>
                      {/* Badges */}
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${catColor}`}>
                          {lead.category}
                        </span>
                        <div className="flex items-center gap-2">
                          {revealed && (
                            <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                              <Unlock className="w-3 h-3" /> Unlocked by You
                            </span>
                          )}
                          {soldToOthers && (
                            <span className="bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Sold
                            </span>
                          )}
                          {canBuy && (
                            <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                              Available
                            </span>
                          )}
                          {!isAdminLead && (
                            <span className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full text-xs font-bold">
                              New Inquiry
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug line-clamp-2">
                        {lead.title}
                      </h3>

                      {/* Meta */}
                      <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-50 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="font-semibold text-gray-700 truncate">{lead.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <IndianRupee className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="font-bold text-orange-600 truncate">{lead.budget}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 col-span-2 text-xs">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>
                            Posted: {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Requirements */}
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Requirements</p>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{lead.requirements}</p>
                    </div>

                    {/* ── ACTION BLOCK — 4 mutually exclusive states ── */}
                    <div className="mt-5 pt-4 border-t border-gray-100">

                      {/* ✅ STATE 1: BUYER — show contact + download */}
                      {revealed ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-green-800 flex items-center gap-2">
                              <Unlock className="w-4 h-4" /> Client Contact Details
                            </span>
                            <button
                              onClick={() => downloadLead(lead)}
                              className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" /> Save
                            </button>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-bold">{lead.clientName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <a href={`tel:${lead.clientPhone}`} className="font-semibold text-green-700 hover:underline">
                                {lead.clientPhone}
                              </a>
                            </div>
                            {lead.clientEmail && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <a href={`mailto:${lead.clientEmail}`} className="text-sm text-blue-600 hover:underline">
                                  {lead.clientEmail}
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <Button
                              onClick={() => window.open(`tel:${lead.clientPhone}`, "_self")}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-9 text-xs"
                            >
                              <Phone className="w-3.5 h-3.5 mr-1" /> Call Now
                            </Button>
                            <Button
                              onClick={() => window.open(
                                `https://wa.me/91${lead.clientPhone}?text=${encodeURIComponent(
                                  `Hi, I'm reaching out about your project "${lead.title}" on HousePlanFiles.`
                                )}`, "_blank"
                              )}
                              className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-9 text-xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
                            </Button>
                          </div>
                        </div>

                      /* ❌ STATE 2: SOLD TO OTHERS — no pay button */
                      ) : soldToOthers ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                          <span className="text-red-600 text-sm font-bold block">Lead Already Sold</span>
                          <span className="text-gray-400 text-xs mt-1 block">
                            This lead was purchased by another professional.
                          </span>
                        </div>

                      /* 💰 STATE 3: AVAILABLE — pay to unlock */
                      ) : canBuy ? (
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                              Unlock Price
                            </span>
                            <span className="text-2xl font-black text-gray-900">₹{lead.price}</span>
                          </div>
                          <Button
                            onClick={() => handleUnlockLead(lead)}
                            disabled={purchasingId !== null}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-5 rounded-xl flex items-center gap-2 text-sm shadow-md"
                          >
                            {purchasingId === lead._id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Lock className="w-4 h-4" />
                            }
                            Pay &amp; Unlock
                          </Button>
                        </div>

                      /* 🔒 STATE 4: NEW INQUIRY — admin hasn't priced yet */
                      ) : (
                        <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-orange-700">
                            <Lock className="w-4 h-4 flex-shrink-0" />
                            <p className="text-xs font-semibold leading-tight">
                              Contact locked.{" "}
                              <span className="text-gray-400 font-normal">Admin will set pricing soon.</span>
                            </p>
                          </div>
                          <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                            Coming Soon
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
