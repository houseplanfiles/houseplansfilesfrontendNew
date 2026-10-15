"use client";
import { useParams, useRouter } from "next/navigation";
import { trackAnalytics } from "@/lib/analytics";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Phone,
  Briefcase,
  Star,
  CheckCircle2,
  Loader2,
  X,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Share2,
  Copy,
  Check,
  Calendar,
  Building,
  Home,
  Compass,
  Layers,
  Sparkles,
  Users,
  Clock,
  Leaf,
  PenTool,
  Award,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Zap,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import ActivatePremiumModal from "@/components/ActivatePremiumModal";

interface ArchitectProfilePageClientProps {
  initialArchitect?: any;
}

const ArchitectProfilePage = ({ initialArchitect }: ArchitectProfilePageClientProps = {}) => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [architect, setArchitect] = useState<any>(initialArchitect || null);
  const [loading, setLoading] = useState(!initialArchitect);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetId = (id as string) || initialArchitect?._id;
  const isPaid = architect?.paymentStatus === "Paid";

  const handlePayToUpgrade = async () => {
    setIsPaying(true);
    try {
      if (!(window as any).Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      }

      const planName = architect.selectedPlan || "City Listing Plan (Premium - 1 Year)";
      const planPrice = 999;
      const taxPrice = Math.round(planPrice * 0.18 * 100) / 100;
      const totalPrice = planPrice + taxPrice;

      const orderData = {
        userId: targetId,
        orderItems: [{ name: planName, price: planPrice }],
        shippingAddress: {
          name: architect.name || "",
          email: architect.email || "",
          phone: architect.phone || "",
          location: architect.city || "",
        },
        paymentMethod: "Razorpay",
        itemsPrice: planPrice,
        taxPrice: taxPrice,
        shippingPrice: 0,
        totalPrice: totalPrice,
        orderType: "subscription",
      };

      const { data: createdOrder } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
        orderData
      );

      const { data: razorpayOrderData } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${createdOrder._id}/create-razorpay-order`,
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
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${createdOrder._id}/verify-payment`,
              response
            );
            toast.success("Payment successful! Account upgraded to Premium!");
            setArchitect((prev: any) => ({
              ...prev,
              paymentStatus: "Paid",
              contractorType: "Premium",
              isApproved: true,
              status: "Approved"
            }));
            setIsUpgradeModalOpen(false);
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: architect.name || "",
          email: architect.email || "",
          contact: architect.phone || "",
        },
        theme: { color: "#ea580c" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment gateway.");
    } finally {
      setIsPaying(false);
    }
  };

  useEffect(() => {
    if (targetId) {
      trackAnalytics('user', targetId, 'view');
    }
  }, [targetId]);

  useEffect(() => {
    const fetchArchitect = async () => {
      if (initialArchitect) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/contractor/${id}`
        );
        setArchitect(data);
      } catch (err: any) {
        console.error("Error fetching expert:", err);
        setError(err.response?.data?.message || "Failed to load professional profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchArchitect();
  }, [id, initialArchitect]);

  const getFileUrl = (path: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path.replace(/\\/g, "/")}`;
  };

  const handleInquiryAction = (pkg: any = null) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderWhatsapp: "",
    requirements: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const onInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const inquiryData = {
        recipient: targetId,
        recipientInfo: {
          name: architect.name,
          role: architect.role,
          city: architect.city,
          detail: selectedPackage ? `Service Plan: ${selectedPackage.name}` : "Architectural Consultation"
        },
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        senderWhatsapp: formData.senderWhatsapp,
        requirements: formData.requirements
      };

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inquiries`, inquiryData);
      
      toast.success("Enquiry sent successfully! The professional will contact you soon.");
      setFormData({ senderName: "", senderEmail: "", senderWhatsapp: "", requirements: "" });
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `${architect?.name || "Professional"} - HousePlanFiles Profile`,
        url: shareUrl,
      }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyLink = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // WhatsApp and Call handlers
  const phoneClean = architect?.phone ? architect.phone.replace(/\D/g, '') : "";
  const waUrl = phoneClean
    ? `https://wa.me/91${phoneClean}?text=${encodeURIComponent(`Hello ${architect?.name || ""}! I found your profile on HousePlanFiles.com. I would like to consult with you regarding my project.`)}`
    : "";
  const callUrl = phoneClean ? `tel:${phoneClean}` : "";

  const handleWhatsAppClick = () => {
    if (!isPaid) {
      setIsUpgradeModalOpen(true);
      return;
    }
    if (targetId) trackAnalytics('user', targetId, 'whatsapp_click');
    if (waUrl) window.open(waUrl, "_blank");
    else toast.info("Contact number not available.");
  };

  const handleCallNowClick = () => {
    if (!isPaid) {
      setIsUpgradeModalOpen(true);
      return;
    }
    if (targetId) trackAnalytics('user', targetId, 'call_click');
    if (callUrl) window.location.href = callUrl;
    else toast.info("Contact number not available.");
  };

  // Real Projects / Portfolio computation
  const projectsList = useMemo(() => {
    if (architect?.workSamples && Array.isArray(architect.workSamples)) {
      return architect.workSamples;
    }
    return [];
  }, [architect?.workSamples]);

  // Real Reviews computation - only from DB
  const reviewsList = useMemo(() => {
    const embeddedReviews: any[] = [];
    if (architect?.workSamples && Array.isArray(architect.workSamples)) {
      architect.workSamples.forEach((sample: any) => {
        if (sample.reviews && Array.isArray(sample.reviews)) {
          sample.reviews.forEach((r: any) => {
            embeddedReviews.push({
              name: r.name || "Client",
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recent",
              rating: r.rating || 5,
              comment: r.comment || "",
              projectTitle: sample.title || "Project",
              projectCity: sample.location || architect.city || "",
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.name || "User")}`,
              projectImage: sample.imageUrl ? getFileUrl(sample.imageUrl) : null
            });
          });
        }
      });
    }
    return embeddedReviews;
  }, [architect?.workSamples, architect?.city]);

  const avgRating = useMemo(() => {
    if (reviewsList.length === 0) return null;
    const total = reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (total / reviewsList.length).toFixed(1);
  }, [reviewsList]);

  // Parse social links safely
  const socialLinks = useMemo(() => {
    if (!architect) return {};
    let sl = architect.socialLinks;
    if (typeof sl === "string") {
      try { sl = JSON.parse(sl); } catch(e) { sl = {}; }
    }
    sl = { ...(sl || {}) };
    if (!sl.website && architect.website) sl.website = architect.website;
    if (!sl.facebook && architect.facebook) sl.facebook = architect.facebook;
    if (!sl.instagram && architect.instagram) sl.instagram = architect.instagram;
    if (!sl.linkedin && architect.linkedin) sl.linkedin = architect.linkedin;
    if (!sl.youtube && architect.youtube) sl.youtube = architect.youtube;
    if (!sl.whatsapp && architect.phone) sl.whatsapp = `https://wa.me/${architect.phone.replace(/[^0-9]/g, "")}`;
    return sl;
  }, [architect]);

  // Real Services offered - from architect skills/serviceTypes with smart fallback
  const servicesList = useMemo(() => {
    const list: any[] = [];
    let skillsArr: string[] = [];
    if (Array.isArray(architect?.skills)) {
      skillsArr = architect.skills;
    } else if (typeof architect?.skills === "string" && architect.skills.trim()) {
      skillsArr = architect.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    skillsArr.forEach((skill: string, idx: number) => {
      list.push({
        title: skill,
        icon: idx % 2 === 0 ? PenTool : Layers,
      });
    });

    let serviceArr: string[] = [];
    if (Array.isArray(architect?.serviceTypes)) {
      serviceArr = architect.serviceTypes;
    } else if (typeof architect?.serviceTypes === "string" && architect.serviceTypes.trim()) {
      serviceArr = architect.serviceTypes.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    serviceArr.forEach((st: string) => {
      if (!list.some(s => s.title.toLowerCase() === st.toLowerCase())) {
        list.push({ title: st, icon: Compass });
      }
    });

    if (list.length === 0) {
      const defaultServices = [
        "Architectural 2D & 3D Planning",
        "Elevation Design & 3D Walkthrough",
        "Structural Layout & Engineering",
        "Interior Design & Space Planning",
        "Site Supervision & Consultation"
      ];
      defaultServices.forEach((s) => {
        list.push({ title: s, icon: Compass });
      });
    }

    return list;
  }, [architect?.skills, architect?.serviceTypes]);

  // Name formatting: only add "Ar." if architect role and not already added
  const displayName = useMemo(() => {
    if (!architect?.name) return "Professional";
    const isArchitect = (architect.role === "Architect" || architect.role === "architect" || architect.profession?.toLowerCase() === "architect");
    if (isArchitect && !architect.name.startsWith("Ar.")) {
      return `Ar. ${architect.name}`;
    }
    return architect.name;
  }, [architect?.name, architect?.role, architect?.profession]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!architect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-extrabold mb-2 text-gray-900">{error || "Expert not found"}</h2>
          <p className="text-gray-500 mb-8 italic">The profile you are looking for might have been moved or does not exist.</p>
          <Button onClick={() => router.push("/architects")} className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-8 h-12 font-bold">
            Back to Experts
          </Button>
        </div>
      </div>
    );
  }

  const websiteUrl = architect.website || architect.socialLinks?.website;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col w-full text-slate-800">
      <Navbar />

      {!isPaid && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200 px-4 py-2.5 text-center text-xs font-semibold text-amber-900 flex flex-wrap items-center justify-center gap-2 shadow-xs">
          <span>⚡ This profile is currently in <strong>Demo Mode</strong> (Payment Pending).</span>
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white text-[11px] font-bold px-3.5 py-1 rounded-full shadow-sm cursor-pointer transition-transform hover:scale-105"
          >
            <Zap className="w-3 h-3 fill-white" /> Click here to Pay & Upgrade to Premium
          </button>
        </div>
      )}

      {/* --- HERO BANNER --- */}
      <section className="relative w-full bg-slate-900 overflow-hidden">
        {/* Banner Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={getFileUrl(architect.coverPhotoUrl) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 md:pt-12 md:pb-10">
          {/* Top Right: Share Profile Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all shadow-sm"
            >
              <Share2 className="w-4 h-4" /> Share Profile
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 md:gap-8">
            {/* Left: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 sm:gap-6">
              {/* Avatar with Verified badge */}
              <div className="relative shrink-0">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white/90 shadow-2xl overflow-hidden bg-slate-800">
                  <AvatarImage src={getFileUrl(architect.photoUrl)} alt={architect.name} className="object-cover" />
                  <AvatarFallback className="text-3xl font-extrabold bg-[#ff6b00] text-white">
                    {architect.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isPaid ? (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md border border-white/80 whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3 fill-white text-emerald-600" /> Verified
                  </div>
                ) : (
                  <button
                    onClick={() => setIsUpgradeModalOpen(true)}
                    title="Click to activate Premium Account"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[10px] sm:text-[11px] font-extrabold px-3 py-0.5 rounded-full flex items-center gap-1 shadow-lg border border-white/90 whitespace-nowrap transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Zap className="w-3 h-3 fill-white" /> Demo Account
                  </button>
                )}
              </div>

              {/* Text Info */}
              <div className="space-y-1.5 sm:space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {displayName}
                </h1>
                <p className="text-sm sm:text-base font-semibold text-slate-200">
                  {architect.profession || architect.role || "Design & Construction Professional"}
                </p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-300">
                  {architect.city && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-[#ff6b00]" /> {architect.city}{architect.state ? `, ${architect.state}` : ""}
                    </span>
                  )}
                  {avgRating ? (
                    <>
                      <span className="text-slate-500">•</span>
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                          {[...Array(Math.round(Number(avgRating)))].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="font-bold text-white ml-0.5">{avgRating}</span>
                        <span className="text-slate-400">({reviewsList.length} Reviews)</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-500">•</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Profile
                      </span>
                    </>
                  )}
                </div>

                {architect.bio && (
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2 leading-relaxed pt-1">
                    {architect.bio}
                  </p>
                )}

                {/* Social media links in hero */}
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noreferrer" title="Instagram" className="w-7 h-7 rounded-full bg-white/10 hover:bg-pink-600 text-white flex items-center justify-center transition-all">
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {socialLinks.facebook && (
                    <a href={socialLinks.facebook} target="_blank" rel="noreferrer" title="Facebook" className="w-7 h-7 rounded-full bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center transition-all">
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="w-7 h-7 rounded-full bg-white/10 hover:bg-blue-500 text-white flex items-center justify-center transition-all">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a href={socialLinks.youtube} target="_blank" rel="noreferrer" title="YouTube" className="w-7 h-7 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-all">
                      <Youtube className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {websiteUrl && (
                    <a href={websiteUrl} target="_blank" rel="noreferrer" title="Website" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#ff6b00] text-white flex items-center justify-center transition-all">
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {socialLinks.whatsapp && (
                    <button
                      type="button"
                      onClick={() => {
                        if (isPaid) {
                          window.open(socialLinks.whatsapp, "_blank");
                        } else {
                          setIsUpgradeModalOpen(true);
                        }
                      }}
                      title={isPaid ? "WhatsApp" : "WhatsApp (Locked - Demo Account)"}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center transition-all cursor-pointer relative"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      {!isPaid && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-300" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Stats Badges (Real data only, no fake 510+ or fake 100+) */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 self-center sm:self-end w-full lg:w-auto bg-black/30 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10">
              {architect.experience && (
                <div className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ff6b00] shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-base sm:text-xl font-extrabold text-white leading-none">
                      {architect.experience}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap mt-0.5">Experience</p>
                  </div>
                </div>
              )}

              <div className={`flex items-center gap-2.5 sm:gap-3 px-2 sm:px-3 ${architect.experience ? "border-l border-white/10" : ""}`}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ff6b00] shrink-0">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-base sm:text-xl font-extrabold text-white leading-none">
                    {projectsList.length}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap mt-0.5">Projects Uploaded</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-3 border-l border-white/10">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ff6b00] shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className={`text-base sm:text-xl font-extrabold leading-none ${isPaid ? "text-white" : "text-amber-400"}`}>
                    {isPaid ? (architect.contractorType || "Verified") : "Demo"}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap mt-0.5">Member Status</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SUB NAVIGATION TABS BAR --- */}
      <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-3 text-xs sm:text-sm font-semibold">
            {["Overview", "Portfolio", "Services", "About", "Contact"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  const el = document.getElementById(tab.toLowerCase());
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 whitespace-nowrap pb-1 border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-[#ff6b00] text-[#ff6b00] font-bold"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab === "Overview" && <Home className="w-4 h-4" />}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-10">

            {/* --- 1. PORTFOLIO SECTION (REAL DATA ONLY) --- */}
            <section id="portfolio" className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6b00] flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Portfolio</h2>
                </div>
                {projectsList.length > 0 && (
                  <span className="text-xs sm:text-sm font-bold text-[#ff6b00]">
                    Total {projectsList.length} Projects
                  </span>
                )}
              </div>

              {projectsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {projectsList.map((proj: any, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => router.push(`/contractors/${targetId}/project/${idx}`)}
                      className="group bg-slate-50 rounded-xl overflow-hidden border border-slate-200/80 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                    >
                      <div className="relative h-36 w-full overflow-hidden bg-slate-200">
                        <img
                          src={getFileUrl(proj.imageUrl) || "/architect_hero.webp"}
                          alt={proj.title || "Project"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {proj.features?.[0] && (
                          <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {proj.features[0]}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#ff6b00] transition-colors line-clamp-1">
                          {proj.title || "Architectural Work"}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {proj.location || architect.city || "Project Site"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">No portfolio projects uploaded yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Project photos will appear here once the professional uploads work samples.</p>
                </div>
              )}
            </section>

            {/* --- 2. SERVICES OFFERED SECTION (REAL DATA ONLY) --- */}
            <section id="services" className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6b00] flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Services & Skills</h2>
              </div>

              {servicesList.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {servicesList.map((srv: any, idx: number) => {
                    const Icon = srv.icon || PenTool;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md bg-slate-50/60 hover:bg-orange-50/20 transition-all duration-300"
                      >
                        <div className="w-11 h-11 rounded-xl border border-orange-200 text-[#ff6b00] flex items-center justify-center mb-2.5 bg-white shadow-xs">
                          <Icon className="w-5 h-5 stroke-[1.8]" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                          {srv.title}
                        </h4>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                  <Compass className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">Specialization: {architect.profession || "Design Services"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Contact directly via WhatsApp or Call for detailed service inquiries.</p>
                </div>
              )}
            </section>

            {/* --- 3. ABOUT SECTION --- */}
            <section id="about" className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6b00] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">About {architect.name}</h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {architect.bio ||
                  `${architect.name} is a verified ${architect.profession || "professional"} based in ${architect.city || "India"}${architect.qualification ? ` with qualification in ${architect.qualification}` : ""}${architect.experience ? ` having ${architect.experience} of experience` : ""}. Connect directly for project consultations, designs and execution estimates.`}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { label: "Verified Professional", icon: ShieldCheck },
                  { label: "Direct Communication", icon: Users },
                  { label: "On-Time Service", icon: Clock },
                  { label: "Quality Commitment", icon: Sparkles },
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100/70"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#ff6b00] text-white flex items-center justify-center shrink-0">
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* --- 4. CUSTOMER REVIEWS --- */}
            <section id="reviews" className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6b00] flex items-center justify-center">
                    <Star className="w-5 h-5 fill-[#ff6b00]" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Customer Reviews</h2>
                    <p className="text-xs text-slate-500 font-medium">Ratings and feedback from verified project clients</p>
                  </div>
                </div>
                {avgRating && (
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-900">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{avgRating} ({reviewsList.length} Reviews)</span>
                  </div>
                )}
              </div>

              {reviewsList.length > 0 ? (
                <div className="space-y-4">
                  {reviewsList.map((rev: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-slate-50/40 flex flex-col sm:flex-row items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <Avatar className="w-10 h-10 rounded-full border border-slate-200">
                          <AvatarImage src={rev.avatar} alt={rev.name} />
                          <AvatarFallback className="bg-slate-200 font-bold text-xs">{rev.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">{rev.name}</h4>
                            <div className="flex text-amber-400">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{rev.date}</p>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{rev.comment}</p>
                        </div>
                      </div>

                      {rev.projectImage && (
                        <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 text-right">
                          <img
                            src={rev.projectImage}
                            alt="Project Preview"
                            className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg object-cover border border-slate-200 shadow-xs"
                          />
                          <div className="text-[10px] text-slate-500 font-medium">
                            <p className="font-bold text-slate-700">{rev.projectTitle}</p>
                            <p>{rev.projectCity}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-slate-50/60 rounded-xl border border-slate-100 space-y-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
                    <Star className="w-6 h-6 fill-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">No Reviews Yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Be the first to collaborate with {displayName} and share your experience with the community.
                    </p>
                  </div>
                  <Button
                    onClick={() => handleInquiryAction()}
                    className="bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-bold h-9 px-5 rounded-lg shadow-xs border-none cursor-pointer"
                  >
                    Send Direct Inquiry
                  </Button>
                </div>
              )}
            </section>

            {/* Design Packages (If available in DB) */}
            {architect.packages && architect.packages.length > 0 && (
              <section className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-900 mb-4">Design Packages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {architect.packages.map((pkg: any, idx: number) => (
                    <Card key={idx} className="p-4 rounded-xl border border-slate-200 hover:border-orange-200 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm text-slate-900">{pkg.name}</h4>
                        <span className="font-extrabold text-sm text-[#ff6b00]">
                          {pkg.price?.includes("₹") ? pkg.price : `₹${pkg.price}`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{pkg.description}</p>
                      <Button
                        onClick={() => handleInquiryAction(pkg)}
                        className="w-full h-9 rounded-lg bg-slate-900 hover:bg-[#ff6b00] text-white text-xs font-bold"
                      >
                        Enquire Package
                      </Button>
                    </Card>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* ================= RIGHT COLUMN / SIDEBAR ================= */}
          {/* Requested Order: 1. Professional Details -> 2. Social Media -> 3. Location -> 4. Get in Touch */}
          <div className="lg:col-span-4 space-y-6 sticky top-20">

            {/* --- 1. PROFESSIONAL DETAILS CARD --- */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#ff6b00]" /> Professional Details
              </h3>

              <div className="space-y-2.5 text-xs">
                {architect.companyName && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> Company</span>
                    <span className="font-semibold text-slate-800 text-right">{architect.companyName}</span>
                  </div>
                )}
                {architect.qualification && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Qualification</span>
                    <span className="font-semibold text-slate-800 uppercase text-right">{architect.qualification}</span>
                  </div>
                )}
                {architect.experience && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Experience</span>
                    <span className="font-semibold text-slate-800">{architect.experience}</span>
                  </div>
                )}
                {architect.city && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Service Area</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[60%] truncate">
                      {architect.city} &amp; nearby regions
                    </span>
                  </div>
                )}
                {architect.gstNumber && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> GST No.</span>
                    <span className="font-semibold text-slate-800">{architect.gstNumber}</span>
                  </div>
                )}
                {websiteUrl && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</span>
                    <a
                      href={websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#ff6b00] hover:underline truncate max-w-[60%]"
                    >
                      {websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* --- 2. SOCIAL MEDIA & ONLINE PRESENCE CARD --- */}
            {(socialLinks.instagram || socialLinks.youtube || socialLinks.linkedin || socialLinks.facebook || socialLinks.whatsapp || websiteUrl) && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#ff6b00]" /> Social Media &amp; Online Presence
                </h3>
                <div className="flex flex-wrap items-center gap-2.5">
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noreferrer" title="Instagram" className="w-9 h-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.facebook && (
                    <a href={socialLinks.facebook} target="_blank" rel="noreferrer" title="Facebook" className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center hover:scale-105 transition-transform">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a href={socialLinks.youtube} target="_blank" rel="noreferrer" title="YouTube" className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.whatsapp && (
                    <button
                      type="button"
                      onClick={() => {
                        if (isPaid) {
                          window.open(socialLinks.whatsapp, "_blank");
                        } else {
                          setIsUpgradeModalOpen(true);
                        }
                      }}
                      title={isPaid ? "WhatsApp" : "WhatsApp (Locked - Demo Account)"}
                      className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:scale-105 transition-transform relative cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {!isPaid && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-500" />}
                    </button>
                  )}
                  {websiteUrl && (
                    <a href={websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`} target="_blank" rel="noreferrer" title="Website" className="w-9 h-9 rounded-lg bg-orange-50 text-[#ff6b00] flex items-center justify-center hover:scale-105 transition-transform">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* --- 3. LOCATION CARD --- */}
            {architect.city && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ff6b00]" /> Location
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {architect.city}{architect.state ? `, ${architect.state}` : ""}{architect.pincode ? ` - ${architect.pincode}` : ""}
                </p>

                {/* Map Preview embed */}
                <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <iframe
                    title="Location Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(architect.city + ", India")}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(architect.city + ", India")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#ff6b00] hover:underline flex items-center gap-1"
                >
                  View on Map <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* --- 4. GET IN TOUCH CARD --- */}
            <div id="contact" className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ff6b00]" /> Get in Touch
              </h3>

              {/* Action Buttons: WhatsApp & Call Now (Visible to all, locked for Demo accounts) */}
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  onClick={handleWhatsAppClick}
                  className={`${isPaid ? "bg-[#25D366] hover:bg-[#1ebd5a]" : "bg-emerald-600/90 hover:bg-emerald-700"} text-white font-bold h-11 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm border-none cursor-pointer`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                  {!isPaid && <Lock className="w-3.5 h-3.5 ml-0.5 text-white/90" />}
                </Button>
                <Button
                  onClick={handleCallNowClick}
                  className={`${isPaid ? "bg-[#0084FF] hover:bg-[#0073e6]" : "bg-blue-600/90 hover:bg-blue-700"} text-white font-bold h-11 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm border-none cursor-pointer`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                  {!isPaid && <Lock className="w-3.5 h-3.5 ml-0.5 text-white/90" />}
                </Button>
              </div>

              <Button
                onClick={() => setIsDialogOpen(true)}
                className="w-full bg-[#ff6b00] hover:bg-[#e05e00] text-white font-extrabold h-11 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md border-none cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send Project Inquiry
              </Button>

              {!isPaid && (
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-center space-y-1">
                  <p className="text-xs font-bold text-amber-900 flex items-center justify-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> Demo Account (Payment Pending)
                  </p>
                  <p className="text-[11px] text-amber-700 leading-tight">
                    Direct WhatsApp &amp; Call buttons are locked. Upgrade to Premium to activate direct contact.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="text-xs font-black text-orange-600 hover:text-orange-700 underline mt-1 cursor-pointer"
                  >
                    Pay &amp; Activate Premium
                  </button>
                </div>
              )}
            </div>

            {/* --- 5. SHARE PROFILE CARD --- */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#ff6b00]" /> Share Profile
              </h3>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  className="bg-transparent text-xs text-slate-600 w-full outline-hidden truncate"
                />
                <button onClick={handleCopyLink} className="text-slate-500 hover:text-[#ff6b00] transition-colors shrink-0">
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* --- 6. REQUEST A FREE QUOTE BANNER --- */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200 space-y-3 text-center">
              <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                Looking to consult with {architect.name}?
              </h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Share your requirements to get customized design and pricing details.
              </p>
              <Button
                onClick={() => handleInquiryAction()}
                className="w-full bg-[#ff6b00] hover:bg-[#e05e00] text-white font-extrabold h-11 rounded-xl shadow-md text-xs sm:text-sm border-none"
              >
                Request a Free Quote
              </Button>
            </div>

          </div>
        </div>
      </main>

      {/* --- STICKY BOTTOM BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 shadow-2xl">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-[#ff6b00] text-white flex items-center justify-center shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                Turn Your Dream Space Into Reality
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Get in touch with {architect.name} for your next project.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              onClick={handleWhatsAppClick}
              className={`${isPaid ? "bg-[#25D366] hover:bg-[#1ebd5a]" : "bg-emerald-600/90 hover:bg-emerald-700"} text-white font-bold h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm border-none cursor-pointer`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
              {!isPaid && <Lock className="w-3 h-3 text-white/90" />}
            </Button>
            <Button
              onClick={handleCallNowClick}
              className={`${isPaid ? "bg-[#0084FF] hover:bg-[#0073e6]" : "bg-blue-600/90 hover:bg-blue-700"} text-white font-bold h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm border-none cursor-pointer`}
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
              {!isPaid && <Lock className="w-3 h-3 text-white/90" />}
            </Button>
            {!isPaid && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold h-9 sm:h-10 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm border-none cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Send Inquiry
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* --- INQUIRY FORM MODAL --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="bg-[#ff6b00] p-6 text-white relative">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold tracking-tight">
                {selectedPackage ? `Inquiry for ${selectedPackage.name}` : `Consult with ${architect.name}`}
              </DialogTitle>
            </DialogHeader>
            <p className="text-orange-100 font-medium mt-1 text-xs">
              {selectedPackage ? "Get pricing and timeline for this design package" : "Share your requirements to get an expert quote"}
            </p>
            <div className="absolute top-5 right-5 cursor-pointer" onClick={() => setIsDialogOpen(false)}>
              <X className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
            </div>
          </div>

          <form onSubmit={onInquirySubmit} className="p-6 space-y-4 bg-white">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Your Name</label>
              <Input
                placeholder="John Doe"
                className="h-10 px-3 rounded-lg bg-slate-50 border-slate-200 text-sm font-semibold"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Email Address</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="h-10 px-3 rounded-lg bg-slate-50 border-slate-200 text-sm font-semibold"
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">WhatsApp Number</label>
                <Input
                  placeholder="9998887776"
                  className="h-10 px-3 rounded-lg bg-slate-50 border-slate-200 text-sm font-semibold"
                  value={formData.senderWhatsapp}
                  onChange={(e) => setFormData({ ...formData, senderWhatsapp: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Project Details</label>
              <Textarea
                placeholder="Briefly describe your dream project, plot size or requirements..."
                className="min-h-[100px] p-3 rounded-lg bg-slate-50 border-slate-200 text-sm font-semibold"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-sm font-extrabold shadow-md flex items-center justify-center gap-2 border-none"
            >
              {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : <>Send Inquiry <Send className="w-4 h-4" /></>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- UPGRADE TO PREMIUM MODAL --- */}
      <ActivatePremiumModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        user={architect}
        onSuccess={(updated) => {
          setArchitect((prev: any) => ({
            ...prev,
            ...updated,
          }));
        }}
      />

      <div className="pb-16 sm:pb-20">
        <Footer />
      </div>
    </div>
  );
};

export default ArchitectProfilePage;
