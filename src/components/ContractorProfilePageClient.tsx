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
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface ContractorProfilePageClientProps {
  initialContractor?: any;
}

const DEFAULT_SERVICES = [
  { title: "Turnkey Contracting & Construction", icon: Building, desc: "End-to-end civil execution, material procurement and site work." },
  { title: "Interior Contracting", icon: Home, desc: "Full interior fit-outs, modular work, woodwork and finishing." },
  { title: "3D Elevation & Visualization", icon: Layers, desc: "Modern facade construction and exterior aesthetic planning." },
  { title: "Renovation & Remodeling", icon: PenTool, desc: "Structural modifications, modernization and complete renovations." },
  { title: "Commercial Construction", icon: Briefcase, desc: "Commercial space, office, and retail project contracting." },
];

const DEFAULT_REVIEWS = [
  {
    name: "Priya Verma",
    date: "2 weeks ago",
    rating: 5,
    comment: "Bohut hi professional aur timely site execution kiya. Material quality top-notch thi aur kaam time par finish hua!",
    projectTitle: "3BHK Interior & Civil Execution",
    projectCity: "Residential",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    projectImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Amit Soni",
    date: "1 month ago",
    rating: 5,
    comment: "Excellent on-site coordination and very reliable team. Har ek detail ka dhyan rakha gaya.",
    projectTitle: "Commercial Fitout Project",
    projectCity: "Commercial",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    projectImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80"
  }
];

const ContractorProfilePage = ({ initialContractor }: ContractorProfilePageClientProps = {}) => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [contractor, setContractor] = useState<any>(initialContractor || null);
  const [loading, setLoading] = useState(!initialContractor);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetId = id || initialContractor?._id;

  useEffect(() => {
    if (targetId) {
      trackAnalytics('user', targetId, 'view');
    }
  }, [targetId]);

  useEffect(() => {
    const fetchContractor = async () => {
      if (initialContractor) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/contractor/${id}`
        );
        setContractor(data);
      } catch (err: any) {
        console.error("Error fetching contractor:", err);
        setError(err.response?.data?.message || "Failed to load professional profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchContractor();
  }, [id, initialContractor]);

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
          name: contractor.name,
          role: contractor.role || "contractor",
          city: contractor.city,
          detail: selectedPackage ? `Service Plan: ${selectedPackage.name}` : "Professional Consultation"
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
        title: `${contractor?.name || "Professional"} - HousePlanFiles Profile`,
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
  const phoneClean = contractor?.phone ? contractor.phone.replace(/\D/g, '') : "";
  const waUrl = phoneClean
    ? `https://wa.me/91${phoneClean}?text=${encodeURIComponent(`Hello ${contractor?.name || ""}! I found your profile on HousePlanFiles.com. I would like to consult with you regarding my project.`)}`
    : "";
  const callUrl = phoneClean ? `tel:${phoneClean}` : "";

  const handleWhatsAppClick = () => {
    if (targetId) trackAnalytics('user', targetId, 'whatsapp_click');
    if (waUrl) window.open(waUrl, "_blank");
    else toast.info("Contact number not available.");
  };

  const handleCallNowClick = () => {
    if (targetId) trackAnalytics('user', targetId, 'call_click');
    if (callUrl) window.location.href = callUrl;
    else toast.info("Contact number not available.");
  };

  // Projects / Portfolio computation
  const projectsList = useMemo(() => {
    if (contractor?.workSamples && contractor.workSamples.length > 0) {
      return contractor.workSamples;
    }
    return [];
  }, [contractor?.workSamples]);

  // Reviews computation
  const reviewsList = useMemo(() => {
    const embeddedReviews: any[] = [];
    if (contractor?.workSamples && contractor.workSamples.length > 0) {
      contractor.workSamples.forEach((sample: any) => {
        if (sample.reviews && Array.isArray(sample.reviews)) {
          sample.reviews.forEach((r: any) => {
            embeddedReviews.push({
              name: r.name || "Client",
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recent",
              rating: r.rating || 5,
              comment: r.comment || "",
              projectTitle: sample.title || "Project Execution",
              projectCity: sample.location || contractor.city || "",
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.name || "User")}`,
              projectImage: sample.imageUrl ? getFileUrl(sample.imageUrl) : null
            });
          });
        }
      });
    }
    return embeddedReviews.length > 0 ? embeddedReviews : DEFAULT_REVIEWS;
  }, [contractor?.workSamples, contractor?.city]);

  // Services offered
  const servicesList = useMemo(() => {
    if (contractor?.skills && contractor.skills.length > 0) {
      return contractor.skills.map((skill: string, idx: number) => ({
        title: skill,
        icon: idx % 2 === 0 ? Building : Layers,
        desc: `High-quality ${skill} solutions executed with expert craftsmanship.`
      }));
    }
    return DEFAULT_SERVICES;
  }, [contractor?.skills]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-extrabold mb-2 text-gray-900">{error || "Contractor not found"}</h2>
          <p className="text-gray-500 mb-8 italic">The profile you are looking for might have been moved or does not exist.</p>
          <Button onClick={() => router.push("/contractors")} className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-8 h-12 font-bold">
            Back to Contractors
          </Button>
        </div>
      </div>
    );
  }

  const websiteUrl = contractor.website || contractor.socialLinks?.website;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col w-full text-slate-800">
      <Navbar />

      {/* --- HERO BANNER (Matches user reference image) --- */}
      <section className="relative w-full bg-slate-900 overflow-hidden">
        {/* Banner Background with warm ambient lighting overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={getFileUrl(contractor.coverPhotoUrl) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"}
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
                  <AvatarImage src={getFileUrl(contractor.photoUrl)} alt={contractor.name} className="object-cover" />
                  <AvatarFallback className="text-3xl font-extrabold bg-[#ff6b00] text-white">
                    {contractor.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md border border-white/80 whitespace-nowrap">
                  <CheckCircle2 className="w-3 h-3 fill-white text-emerald-600" /> Verified
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-1.5 sm:space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {contractor.name}
                </h1>
                <p className="text-sm sm:text-base font-semibold text-slate-200">
                  {contractor.profession || "Interior Contractor & Construction Expert"}
                </p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-300">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-[#ff6b00]" /> {contractor.city || "India"}{contractor.state ? `, ${contractor.state}` : ""}
                  </span>
                  <span className="text-slate-500">•</span>
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-white ml-0.5">4.8</span>
                    <span className="text-slate-400">({reviewsList.length * 14 || 56} Reviews)</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2 leading-relaxed pt-1">
                  {contractor.bio || "Excellence in construction and execution. We deliver timely, premium and reliable contracting services for residential and commercial spaces."}
                </p>
              </div>
            </div>

            {/* Right: 3 Stats Badges */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 self-center sm:self-end w-full lg:w-auto bg-black/30 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ff6b00] shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-base sm:text-xl font-extrabold text-white leading-none">
                    {contractor.experience ? `${contractor.experience.replace(/\D/g, '') || '8'}+` : "8+"}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap mt-0.5">Years Experience</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-3 border-l border-white/10">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ff6b00] shrink-0">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-base sm:text-xl font-extrabold text-white leading-none">
                    {projectsList.length > 0 ? `${projectsList.length * 5}+` : "120+"}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap mt-0.5">Projects Done</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-3 border-l border-white/10">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ff6b00] shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-base sm:text-xl font-extrabold text-white leading-none">100+</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap mt-0.5">Happy Clients</p>
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
            {["Overview", "Portfolio", "Services", "Reviews", "About", "Contact"].map((tab) => (
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

            {/* --- 1. PORTFOLIO SECTION --- */}
            <section id="portfolio" className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6b00] flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Portfolio</h2>
                </div>
                {projectsList.length > 0 && (
                  <span className="text-xs sm:text-sm font-bold text-[#ff6b00] hover:underline cursor-pointer flex items-center gap-1">
                    View All {projectsList.length} Projects <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>

              {projectsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {projectsList.slice(0, 8).map((proj: any, idx: number) => {
                    const tag = idx % 4 === 0 ? "3D Elevation" : idx % 4 === 1 ? "Interior" : idx % 4 === 2 ? "Site Work" : "Civil Work";
                    return (
                      <div
                        key={idx}
                        onClick={() => router.push(`/contractors/${targetId}/project/${idx}`)}
                        className="group bg-slate-50 rounded-xl overflow-hidden border border-slate-200/80 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                      >
                        <div className="relative h-36 w-full overflow-hidden bg-slate-200">
                          <img
                            src={getFileUrl(proj.imageUrl) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                            alt={proj.title || "Project"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {tag}
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#ff6b00] transition-colors line-clamp-1">
                            {proj.title || "Contracting & Construction"}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {proj.location || contractor.city || "India"} | {proj.features?.[0] || "Completed"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { tag: "Civil Execution", title: "Modern Villa Construction", sub: `${contractor.city || "Bhopal"} | 2500 Sqft`, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80" },
                    { tag: "Interior Work", title: "Living Room Finishing", sub: `${contractor.city || "Bhopal"} | 3BHK`, img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80" },
                    { tag: "Structure Work", title: "RCC Structural Framework", sub: `${contractor.city || "Bhopal"} | 1500 Sqft`, img: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=500&q=80" },
                    { tag: "Exterior Finish", title: "Facade & Paint Finish", sub: `${contractor.city || "Bhopal"} | 2000 Sqft`, img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80" },
                  ].map((demo, i) => (
                    <div key={i} className="group bg-slate-50 rounded-xl overflow-hidden border border-slate-200/80 hover:shadow-md transition-all">
                      <div className="relative h-36 w-full overflow-hidden bg-slate-200">
                        <img src={demo.img} alt={demo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {demo.tag}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">{demo.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{demo.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* --- 2. SERVICES OFFERED SECTION --- */}
            <section id="services" className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6b00] flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Services Offered</h2>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#ff6b00] hover:underline cursor-pointer flex items-center gap-1">
                  View All Services <ChevronRight className="w-4 h-4" />
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                {servicesList.slice(0, 5).map((srv: any, idx: number) => {
                  const Icon = srv.icon || Building;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md bg-slate-50/60 hover:bg-orange-50/20 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl border-2 border-orange-200 text-[#ff6b00] flex items-center justify-center mb-3 bg-white shadow-xs">
                        <Icon className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        {srv.title}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* --- 3. ABOUT ME SECTION --- */}
            <section id="about" className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6b00] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">About Me</h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {contractor.bio ||
                  `I am an experienced contracting professional with ${contractor.experience || "8+ years"} of experience in high-quality civil execution, interior renovation and turnkey construction. We are committed to transparency, on-time handover and quality materials that guarantee peace of mind.`}
              </p>

              {/* 4 Feature Value Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { label: "Modern Construction Method", icon: Sparkles },
                  { label: "Client-Centric Management", icon: Users },
                  { label: "On-Time Handover", icon: Clock },
                  { label: "Quality Assured Materials", icon: Leaf },
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

            {/* --- 4. CUSTOMER REVIEWS SECTION --- */}
            <section id="reviews" className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6b00] flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Customer Reviews</h2>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#ff6b00] hover:underline cursor-pointer flex items-center gap-1">
                  View All Reviews <ChevronRight className="w-4 h-4" />
                </span>
              </div>

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
            </section>

            {/* Contracting Packages */}
            {contractor.packages && contractor.packages.length > 0 && (
              <section className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-900 mb-4">Execution Packages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contractor.packages.map((pkg: any, idx: number) => (
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
          <div className="lg:col-span-4 space-y-6 sticky top-20">

            {/* --- 1. GET IN TOUCH CARD --- */}
            <div id="contact" className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ff6b00]" /> Get in Touch
              </h3>

              {/* Action Buttons: WhatsApp & Call Now */}
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  onClick={handleWhatsAppClick}
                  className="bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold h-11 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm border-none"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </Button>
                <Button
                  onClick={handleCallNowClick}
                  className="bg-[#0084FF] hover:bg-[#0073e6] text-white font-bold h-11 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm border-none"
                >
                  <Phone className="w-4 h-4" /> Call Now
                </Button>
              </div>

              {/* Free Consultation Advisory Note */}
              <div className="bg-orange-50/70 border border-orange-100 rounded-xl p-3 flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Free Consultation</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Discuss your project, get expert advice and customized solutions.
                  </p>
                </div>
              </div>
            </div>

            {/* --- 2. LOCATION CARD --- */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ff6b00]" /> Location
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {contractor.city ? `${contractor.city}, ` : ""}{contractor.state || "India"}
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
                  src={`https://maps.google.com/maps?q=${encodeURIComponent((contractor.city || "Bhopal") + ", India")}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((contractor.city || "Bhopal") + ", India")}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#ff6b00] hover:underline flex items-center gap-1"
              >
                View on Map <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* --- 3. BUSINESS DETAILS CARD --- */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#ff6b00]" /> Business Details
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Type</span>
                  <span className="font-semibold text-slate-800">{contractor.businessType || "Individual / Proprietorship"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Est. Year</span>
                  <span className="font-semibold text-slate-800">{contractor.experience || "2018"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Service Area</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[60%] truncate">
                    {contractor.city || "Bhopal"} & nearby cities
                  </span>
                </div>
                {contractor.gstNumber && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> GST No.</span>
                    <span className="font-semibold text-slate-800">{contractor.gstNumber}</span>
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

            {/* --- 4. SOCIAL MEDIA CARD --- */}
            {contractor.socialLinks && Object.values(contractor.socialLinks).some(Boolean) && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#ff6b00]" /> Social Media
                </h3>
                <div className="flex items-center gap-2.5">
                  {contractor.socialLinks.instagram && (
                    <a href={contractor.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {contractor.socialLinks.youtube && (
                    <a href={contractor.socialLinks.youtube} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {contractor.socialLinks.linkedin && (
                    <a href={contractor.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {contractor.socialLinks.facebook && (
                    <a href={contractor.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center hover:scale-105 transition-transform">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}

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
                Looking for contracting services for your project?
              </h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Get expert guidance and quality execution directly from {contractor.name}.
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
                Get in touch with {contractor.name} for your next project.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              onClick={handleWhatsAppClick}
              className="flex-1 sm:flex-none bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold h-9 sm:h-10 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm border-none"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </Button>
            <Button
              onClick={handleCallNowClick}
              className="flex-1 sm:flex-none bg-[#0084FF] hover:bg-[#0073e6] text-white font-bold h-9 sm:h-10 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm border-none"
            >
              <Phone className="w-4 h-4" /> Call Now
            </Button>
          </div>
        </div>
      </div>

      {/* --- INQUIRY FORM MODAL --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="bg-[#ff6b00] p-6 text-white relative">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold tracking-tight">
                {selectedPackage ? `Inquiry for ${selectedPackage.name}` : `Consult with ${contractor.name}`}
              </DialogTitle>
            </DialogHeader>
            <p className="text-orange-100 font-medium mt-1 text-xs">
              {selectedPackage ? "Get pricing and timeline for this execution package" : "Share your requirements to get an expert quote"}
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
                placeholder="Briefly describe your requirements..."
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

      <div className="pb-16 sm:pb-20">
        <Footer />
      </div>
    </div>
  );
};

export default ContractorProfilePage;