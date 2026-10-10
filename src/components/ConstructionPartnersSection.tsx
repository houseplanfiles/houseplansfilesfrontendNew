"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  FC,
  FormEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchContractors } from "@/lib/features/users/userSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/inquiries/inquirySlice";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { motion, AnimatePresence } from "@/components/MotionWrapper";
import { toast } from "sonner";
import { MapPin, Building, Phone, X, Send, Loader2, Star, Briefcase, CheckCircle2, UserPlus, Search, Filter, HardHat, Paintbrush, MessageCircle, Home, Compass, Zap, Droplet, Grid, Waves, Building2, Layers, Bug, Leaf, Users, ChefHat, ArrowUpDown, Boxes, ClipboardCheck, Sun, Wind, Hammer, Wrench, Shield, Settings, Flame, PencilRuler, Sofa, LayoutGrid, PaintRoller, AppWindow, Factory, PackageOpen, Cuboid, Truck, Fan, Cpu, Umbrella, TreePine, Utensils, ChevronLeft, ChevronRight } from "lucide-react";
import { getContractorProfileUrl } from "@/utils/profileUrls";
import { trackAnalytics } from "@/lib/analytics";


// --- Types ---
type CityPartnerType = {
  _id: string;
  name?: string;
  companyName?: string;
  city?: string;
  address?: string;
  experience?: string;
  photoUrl?: string;
  shopImageUrl?: string;
  phone?: string;
  profession?: string;
  status?: string;
  contractorType?: "Normal" | "Verified" | "Premium";
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";

const getImageUrl = (path?: string) =>
  !path
    ? "/contractor.jpeg"
    : path.startsWith("http")
      ? path
      : `${BACKEND_URL}/${path.replace(/^\//, "")}`;

// --- Contact Modal ---
const ContactModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  user: CityPartnerType | null;
}> = ({ isOpen, onClose, user }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus } = useSelector((state: RootState) => state.inquiries);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inquiryData = {
      recipient: user._id,
      recipientInfo: {
        name: user.name || "Partner",
        role: "City Partner",
        phone: user.phone || "",
        city: user.city || "",
        address: user.address || "",
        detail: `${user.profession || "Contractor"} - ${user.experience || "Experienced"}`,
      },
      senderName: formData.get("name") as string,
      senderEmail: formData.get("email") as string,
      senderWhatsapp: formData.get("whatsapp") as string,
      requirements: formData.get("requirements") as string,
    };

    dispatch(createInquiry(inquiryData)).then((result) => {
      if (createInquiry.fulfilled.match(result)) {
        toast.success(`Your inquiry has been sent to ${user.name}!`);
        dispatch(resetActionStatus());
        onClose();
      } else {
        toast.error(typeof result.payload === 'string' ? result.payload : "An error occurred.");
        dispatch(resetActionStatus());
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10"
          >
            <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Contact {user.name}</h2>
                <p className="text-gray-400 text-sm">Get a quote for your project</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" name="email" placeholder="you@email.com" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input type="tel" id="whatsapp" name="whatsapp" placeholder="+91..." required className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="requirements">Requirement Details</Label>
                  <Textarea id="requirements" name="requirements" placeholder="Tell us about your project..." rows={4} required className="mt-1 resize-none" />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium bg-orange-600 hover:bg-orange-700" disabled={actionStatus === "loading"}>
                  {actionStatus === "loading" ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                  {actionStatus === "loading" ? "Sending..." : "Send Inquiry"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Partner Card ---
const PartnerCard: FC<{
  partner: CityPartnerType;
  onContact: (p: CityPartnerType) => void;
  index: number;
  navigate: (path: string) => void;
}> = ({ partner, onContact, index, navigate }) => {
  const type = partner.contractorType || "Normal";
  const phoneStr = partner.phone ? partner.phone.replace(/\D/g, '') : '';
  const cleanPhone = phoneStr.startsWith('91') ? phoneStr : '91' + phoneStr;
  const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello! I found your profile on www.houseplanfiles.com - Architect Contractor Marketplace. I would like to connect with you.")}`;
  const callLink = `tel:${phoneStr}`;

  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
  >
    <div className="h-24 sm:h-32 bg-gray-100 relative">
      <Image src={getImageUrl(partner.shopImageUrl)} alt={partner.companyName || "Contractor"} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1.5 sm:gap-2 items-end">
        {partner.contractorType === "Premium" && (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md text-[10px] sm:text-xs">
            <Star className="w-3 h-3 mr-1 fill-current" /> Top Rated
          </Badge>
        )}
      </div>
    </div>

    <div className="px-3 sm:px-5 pb-3.5 sm:pb-5 flex flex-col flex-grow relative">
      <div className="-mt-7 sm:-mt-10 mb-2 sm:mb-3">
        <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 sm:border-4 border-white shadow-md">
          {partner.photoUrl ? (
            <Image
              src={getImageUrl(partner.photoUrl)}
              alt={partner.name || "Partner"}
              width={128}
              height={128}
              className="aspect-square h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <AvatarFallback>{partner.name?.charAt(0)}</AvatarFallback>
          )}
          <AvatarFallback className="text-base sm:text-xl font-bold bg-orange-100 text-orange-700">
            {partner.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-grow">
        <h3 className="text-base sm:text-xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-2">
          {partner.name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.642 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.358-.166-2.001A11.954 11.954 0 0110 1.944zM8.5 11l-2-2 1.414-1.414L8.5 8.172l3.586-3.586L13.5 6l-5 5z" clipRule="evenodd" />
            </svg>
            <span className="text-[11px] sm:text-sm text-slate-600">Verified Professional</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-[11px] sm:text-sm text-slate-600 line-clamp-1">{partner.city || "Available locally"}</span>
          </div>

          <div className="border-t border-gray-100 my-3"></div>

          <div className="flex items-center gap-2">
            <HardHat className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-[11px] sm:text-sm text-slate-600 line-clamp-1">{partner.profession}</span>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[11px] sm:text-sm text-slate-600 leading-tight">{partner.experience} Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-[11px] sm:text-sm text-slate-600 line-clamp-1">{partner.city || "Available locally"}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 sm:pt-5 mt-auto flex flex-col gap-2.5">
        <Link 
          href={getContractorProfileUrl(partner)} 
          className="w-full h-10 sm:h-11 border border-orange-500 text-orange-600 hover:bg-orange-50 font-bold text-[13px] sm:text-sm flex items-center justify-center rounded-lg transition-all"
        >
          View Profile
        </Link>

        {type === "Premium" && (
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => { trackAnalytics('user', partner._id, 'whatsapp_click'); window.open(waLink, "_blank"); }}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors h-10 sm:h-11 px-1 sm:px-2 flex items-center justify-center gap-1.5 rounded-lg shadow-sm font-bold text-[12px] sm:text-sm"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </Button>
            <Button 
              onClick={() => { trackAnalytics('user', partner._id, 'call_click'); window.location.href = callLink; }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors h-10 sm:h-11 px-1 sm:px-2 flex items-center justify-center gap-1.5 rounded-lg shadow-sm font-bold text-[12px] sm:text-sm"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span className="truncate">Call Now</span>
            </Button>
          </div>
        )}

        {type === "Verified" && (
          <Button 
            onClick={() => { trackAnalytics('user', partner._id, 'whatsapp_click'); window.open(waLink, "_blank"); }}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors h-10 sm:h-11 flex items-center justify-center gap-2 rounded-lg shadow-sm font-bold text-[13px] sm:text-sm"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp Enquiry</span>
          </Button>
        )}

        {type !== "Premium" && type !== "Verified" && (
          <Button 
            onClick={() => { trackAnalytics('user', partner._id, 'contact'); onContact(partner); }} 
            className="w-full h-10 sm:h-11 bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold text-[13px] sm:text-sm rounded-lg transition-all"
          >
            Enquiry Now
          </Button>
        )}
      </div>
    </div>
  </motion.div>
)};

const CONTRACTOR_CATEGORIES = [
  "All",
  "Building",
  "Interior",
  "Electrical",
  "Plumbing",
  "Tiles & Marble",
  "Painting",
  "Other Services",
];

// --- MAIN COMPONENT: ConstructionPartnersSection ---
const ConstructionPartnersSection: FC<{ hideHeader?: boolean }> = ({ hideHeader }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  
  const { contractors, contractorListStatus } = useSelector(
    (state: RootState) => state.user
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<CityPartnerType | null>(null);
  const [cityFilter, setCityFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState("All");
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = 240;
      categoryScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchContractors({ 
        city: cityFilter, 
        status: "Approved",
        limit: 8 
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, cityFilter]);

  const filteredPartners = useMemo(() => {
    if (!Array.isArray(contractors)) return [];
    
    return (contractors as CityPartnerType[]).filter((p) => {
      const isApproved = p.status === "Approved";
      const isValidType = ["Normal", "Verified", "Premium"].includes(p.contractorType || "");
      const matchesCity = !cityFilter || p.city?.toLowerCase().includes(cityFilter.toLowerCase()) || p.city?.toLowerCase() === "pan india";
      
      if (!isApproved || !isValidType || !matchesCity) return false;
      const filter = professionFilter || "All";
      if (filter === "All") return true;

      const lowerCaseProfession = p.profession?.toLowerCase() || "";
      
      // Special alias for Civil Construction to match older "Building" or "Construction"
      if (filter === "Civil Construction") {
        return (
          lowerCaseProfession.includes("civil") ||
          lowerCaseProfession.includes("building") ||
          lowerCaseProfession.includes("construction") ||
          lowerCaseProfession.includes("turnkey")
        );
      }

      // Default sub-string match using the first word and whole category
      const keyword = filter.split(" ")[0].toLowerCase();
      return lowerCaseProfession.includes(keyword) || lowerCaseProfession.includes(filter.toLowerCase());
    });
  }, [contractors, cityFilter, professionFilter]);

  const handleContactClick = (partner: CityPartnerType) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="city-partners" className={hideHeader ? "w-full" : "bg-[#FAF9F6] py-16 md:py-24 border-b"}>
        <div className={hideHeader ? "w-full" : "max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"}>
          
          {/* --- HERO HEADER --- */}
          {!hideHeader && (
            <div className="text-center mb-10 md:mb-16">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] md:text-sm font-bold text-orange-600 mb-4 md:mb-6 shadow-sm">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
              Verified Professionals
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3 md:mb-5 leading-tight">
              Top <span className="text-orange-600">Contractors</span>
            </h2>
            <p className="text-sm md:text-lg text-gray-500 font-medium max-w-2xl mx-auto px-4 leading-relaxed">
              Hire verified local contractors for construction and interiors. Get your project done with the best in the business.
            </p>
          </div>
          )}

          <main className="relative z-10">
            {/* --- FILTERS SECTION --- */}
            <div className="mb-10 md:mb-14 bg-white p-4 md:p-6 rounded-2xl md:rounded-[32px] shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 lg:items-end">
                  {/* City Search */}
                  <div className="w-full lg:w-1/3 text-left">
                    <Label htmlFor="city-filter" className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      <MapPin className="inline-block w-3.5 h-3.5 mr-1 mb-0.5 text-orange-400"/> Find by City
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <Input
                        id="city-filter"
                        placeholder="Search City (e.g. Delhi, Mumbai)"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="pl-10 md:pl-12 h-12 md:h-14 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all rounded-xl text-sm md:text-base font-medium shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Profession Filter Toggle */}
                  <div className="w-full lg:w-2/3 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        <Filter className="inline-block w-3.5 h-3.5 mr-1 mb-0.5 text-orange-400" /> Specialization
                      </Label>
                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Scroll to explore</span>
                    </div>

                    <div className="relative flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => scrollCategories("left")}
                        className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-gray-200 shadow-xs hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600 flex items-center justify-center text-gray-600 transition-all active:scale-95"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      <div 
                        ref={categoryScrollRef}
                        className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth flex-grow -mx-1 px-1" 
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {CONTRACTOR_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setProfessionFilter(cat)}
                            className={`h-10 md:h-12 px-4 sm:px-6 md:px-7 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all border-2 shrink-0 flex items-center gap-2 ${
                              professionFilter === cat
                                ? "bg-orange-50 text-orange-700 border-orange-500 shadow-sm"
                                : "bg-white text-gray-600 border-gray-100 hover:border-orange-200 hover:bg-gray-50 hover:text-orange-600"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => scrollCategories("right")}
                        className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-gray-200 shadow-xs hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600 flex items-center justify-center text-gray-600 transition-all active:scale-95"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
            </div>

            {/* --- GRID CONTENT --- */}
            {contractorListStatus === "loading" ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
                <p className="mt-4 text-gray-500">Loading contractors...</p>
              </div>
            ) : (
              <div className="space-y-10">
                {filteredPartners.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No contractors found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                    {filteredPartners.slice(0, 8).map((partner, index) => (
                      <div key={partner._id} className={index >= 4 ? 'hidden sm:block' : ''}>
                        <PartnerCard partner={partner} onContact={handleContactClick} index={index} navigate={(p) => router.push(p)} />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-center">
                  <Button 
                    onClick={() => router.push("/city-partners")}
                    variant="outline" 
                    className="border-gray-300 text-gray-600 hover:bg-gray-900 hover:text-white px-8 py-6 rounded-xl text-lg font-medium"
                  >
                    View All Contractors
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </section>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedPartner}
      />
    </>
  );
};

export default ConstructionPartnersSection;

