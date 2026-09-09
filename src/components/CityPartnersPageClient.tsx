"use client";
import Image from "next/image";


import Link from "next/link";
import { useRouter, usePathname, useParams, useSearchParams } from "next/navigation";


import React, { useState, useEffect, useMemo, FC, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchContractors } from "@/lib/features/users/userSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/inquiries/inquirySlice";




// Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Animation & Icons
import { motion, AnimatePresence } from "@/components/MotionWrapper";
import { toast } from "sonner";
import {
  MapPin,
  Building,
  Phone,
  X,
  Send,
  Loader2,
  Star,
  Briefcase,
  Search,
  CheckCircle2,
  Filter as FilterIcon,
  SlidersHorizontal,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { trackAnalytics } from "@/lib/analytics";
// --- Types ---
type ContractorType = {
  _id: string;
  name: string;
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
// --- Helpers ---
const getFileUrl = (path: string) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path.replace(/\\/g, "/")}`;
};
const CONTRACTOR_CATEGORIES = [
  "All",
  "Building",
  "Interior",
  "Electrical",
  "Plumbing",
  "Tiles & Granite",
  "Painting & Waterproofing",
  "Carpenter",
  "Swimming Pool",
  "Civil Construction Contractor",
  "Interior Contractor",
  "Electrical Contractor",
  "Plumbing Contractor",
  "Tiles & Granite Contractor",
  "Painting & Waterproofing Contractor",
  "Swimming Pool Contractor",
  "Pre Engineering Board / PEB",
  "Pre Fabricated House Contractor",
  "Pest Control Contractor",
  "Landscaping & Garden Contractor",
  "Manpower Supply",
  "Modular Kitchen Contractor",
  "Lift Services Contractor",
  "Building Inspection Contractor",
  "Solar Rooftop Panel Contractor",
  "HVAC Contractor",
  "Glass Fabricator",
  "Labour Contractor",
  "Turnkey Contractor"
];
const ContactModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  user: ContractorType | null;
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
        name: user.name,
        role: "Contractor",
        phone: user.phone,
        city: user.city,
        address: user.address,
        detail: `${user.profession} - ${user.experience}`,
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
        toast.error(String(result.payload) || "An error occurred.");
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
              <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" name="name" required className="mt-1" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" name="email" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input type="tel" id="whatsapp" name="whatsapp" required className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="requirements">Requirement Details</Label>
                  <Textarea id="requirements" name="requirements" rows={4} required className="mt-1" />
                </div>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 h-12" disabled={actionStatus === "loading"}>
                  {actionStatus === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                  Send Inquiry
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main Page Component ---
const PartnersPage: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { contractors, contractorListStatus } = useSelector((state: RootState) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<ContractorType | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [isPanIndiaFilter, setIsPanIndiaFilter] = useState(searchParams?.get("panIndia") === "true");
  const [stateFilter, setStateFilter] = useState(searchParams?.get("state") || "All States");
  const [cityFilter, setCityFilter] = useState(() => searchParams?.get("city") || "");
  const [pincodeFilter, setPincodeFilter] = useState(searchParams?.get("pincode") || "");
  const [professionFilter, setProfessionFilter] = useState(() => searchParams?.get("profession") || "All");
  const [currentPage, setCurrentPage] = useState(1);
  const [revealedPhoneIds, setRevealedPhoneIds] = useState<Set<string>>(new Set());
  const itemsPerPage = 8;

  const togglePhoneReveal = (id: string) => {
    setRevealedPhoneIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    dispatch(fetchContractors({ page: 1, limit: 500 }));
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (isPanIndiaFilter) params.set("panIndia", "true");
    if (stateFilter && stateFilter !== "All States") params.set("state", stateFilter);
    if (cityFilter) params.set("city", cityFilter);
    if (pincodeFilter) params.set("pincode", pincodeFilter);
    if (professionFilter && professionFilter !== "All") params.set("profession", professionFilter);
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [isPanIndiaFilter, stateFilter, cityFilter, pincodeFilter, professionFilter, router, pathname]);

  const approvedContractors = useMemo(() => {
    if (!Array.isArray(contractors)) return [];
    return (contractors as any[]).filter((c) => {
      const isApproved = c.status === "Approved";
      if (!isApproved) return false;

      // PAN India filter
      if (isPanIndiaFilter) {
        const isPan = c.isPanIndia || c.city?.toLowerCase() === "pan india" || c.selectedPlan?.toLowerCase().includes("pan_india");
        if (!isPan) return false;
      }

      // State filter
      if (stateFilter && stateFilter !== "All States") {
        const sFilter = stateFilter.toLowerCase();
        const matchesState = 
          c.isPanIndia ||
          c.city?.toLowerCase() === "pan india" ||
          c.selectedPlan?.toLowerCase().includes("pan_india") ||
          (c.state && c.state.toLowerCase() === sFilter) ||
          (c.selectedStates && c.selectedStates.some((s: string) => s.toLowerCase() === sFilter));
        if (!matchesState) return false;
      }

      // City filter
      if (cityFilter) {
        const q = cityFilter.toLowerCase();
        const matchesCity =
          c.isPanIndia ||
          c.city?.toLowerCase() === "pan india" ||
          c.selectedPlan?.toLowerCase().includes("pan_india") ||
          (c.city && c.city.toLowerCase().includes(q)) ||
          (c.selectedCities && c.selectedCities.some((ct: string) => ct.toLowerCase().includes(q)));
        if (!matchesCity) return false;
      }

      // Pincode filter
      if (pincodeFilter) {
        const pFilter = pincodeFilter.trim();
        const matchesPincode = c.pincode && c.pincode.toString().includes(pFilter);
        if (!matchesPincode) return false;
      }

      const lowerCaseProfession = c.profession?.toLowerCase() || "";
      const filter = professionFilter || "All";
      const matchesProfession = filter === "All" ||
        (filter.toLowerCase() === "building" && (
          lowerCaseProfession.includes("building") ||
          lowerCaseProfession.includes("general") ||
          lowerCaseProfession.includes("commercial")
        )) ||
        (filter.toLowerCase() === "interior" && (
          lowerCaseProfession.includes("interior") ||
          lowerCaseProfession.includes("fit-out") ||
          lowerCaseProfession.includes("decor")
        )) ||
        lowerCaseProfession.includes(filter.toLowerCase());

      return matchesProfession;
    });
  }, [contractors, isPanIndiaFilter, stateFilter, cityFilter, pincodeFilter, professionFilter]);

  const totalPages = Math.ceil(approvedContractors.length / itemsPerPage);
  const paginatedContractors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return approvedContractors.slice(startIndex, startIndex + itemsPerPage);
  }, [approvedContractors, currentPage, itemsPerPage]);

  const handleContactClick = (contractor: ContractorType) => {
    setSelectedContractor(contractor);
    setIsModalOpen(true);
  };

  const INDIAN_STATES = [
    "All States", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
    "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
      <Navbar />

      {/* --- Hero Section --- */}
      <div className="relative bg-gray-900 py-12 sm:py-20 overflow-hidden w-full">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80" className="object-cover opacity-20" alt="Hero" fill priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <Badge className="bg-orange-500 mb-4">Trusted Network</Badge>
          <h1 className="text-[13px] min-[350px]:text-[15px] min-[390px]:text-[17px] sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 px-1 leading-tight whitespace-nowrap">
            City Contractor (Building &amp; Interior)
          </h1>
          <div className="flex justify-center px-4">
            <Button onClick={() => router.push("/register?role=Contractor")} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 py-4 px-6 sm:py-6 sm:px-8 rounded-full shadow-lg transition-transform hover:scale-105">
              <UserPlus className="w-5 h-5 mr-2" /> Register With Us
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pb-20">
        {/* --- Filters Section --- */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 mb-10 w-full">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <FilterIcon className="w-3.5 h-3.5 text-orange-600" /> Filter Contractors
            </span>
            <div className="flex items-center gap-2">
              <label 
                htmlFor="contractorPanIndiaCheck"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                  isPanIndiaFilter ? "bg-orange-600 border-orange-600 text-white shadow-sm" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <input 
                  id="contractorPanIndiaCheck" 
                  type="checkbox" 
                  checked={isPanIndiaFilter} 
                  onChange={(e) => setIsPanIndiaFilter(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-3.5 h-3.5 cursor-pointer"
                />
                PAN INDIA
              </label>
              {(isPanIndiaFilter || stateFilter !== "All States" || cityFilter || pincodeFilter || professionFilter !== "All") && (
                <button 
                  onClick={() => {
                    setIsPanIndiaFilter(false);
                    setStateFilter("All States");
                    setCityFilter("");
                    setPincodeFilter("");
                    setProfessionFilter("All");
                  }} 
                  className="text-xs text-red-500 hover:text-red-700 font-semibold underline ml-2"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
            {/* State Filter */}
            <div>
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">State</Label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="mt-1 w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all cursor-pointer"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">City</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="e.g. Bhopal, Indore" 
                  value={cityFilter} 
                  onChange={(e) => setCityFilter(e.target.value)} 
                  className="pl-9 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white text-xs" 
                />
              </div>
            </div>

            {/* Pincode Filter */}
            <div>
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Pincode</Label>
              <Input 
                placeholder="e.g. 462001, 464668" 
                value={pincodeFilter} 
                onChange={(e) => setPincodeFilter(e.target.value)} 
                className="mt-1 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white text-xs" 
              />
            </div>

            {/* Specialization Filter */}
            <div>
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Specialization</Label>
              <Select value={professionFilter} onValueChange={(val) => setProfessionFilter(val)}>
                <SelectTrigger className="mt-1 w-full h-11 bg-gray-50 border-gray-200 rounded-xl text-xs font-medium text-gray-800">
                  <SelectValue placeholder="Select Specialization" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {CONTRACTOR_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* --- Grid Section --- */}
        {contractorListStatus === "loading" ? (
          <div className="text-center py-24"><Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {paginatedContractors.map((contractor) => {
              const phoneStr = contractor.phone ? (contractor.phone || '').replace(/\D/g, '') : '';
              const cleanPhone = phoneStr.startsWith('91') ? phoneStr : '91' + phoneStr;
              const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("hello i found your profile on Houseplanfiles.com")}`;

              return (
                <div key={contractor._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full group">
                  <div className="h-20 sm:h-28 bg-gray-100 relative">
                    <Image src={contractor.shopImageUrl ? getFileUrl(contractor.shopImageUrl) : "/contractor.jpeg"} className="object-cover" alt="Shop Image" fill sizes="(max-width: 768px) 50vw, 25vw" />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {contractor.contractorType === "Premium" && <Badge className="bg-orange-500 text-[10px]">Premium</Badge>}
                      {contractor.contractorType === "Verified" && <Badge className="bg-blue-600 text-[10px]">Verified</Badge>}
                    </div>
                  </div>

                  <div className="px-2.5 sm:px-4 pb-3.5 sm:pb-5 flex flex-col flex-grow">
                    <div className="-mt-6 sm:-mt-8 mb-2 sm:mb-3 relative z-10">
                      <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 sm:border-4 border-white shadow-md">
                        <AvatarImage src={contractor.photoUrl} />
                        <AvatarFallback>{contractor.name?.[0]}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 line-clamp-1 text-sm sm:text-base">{contractor.name}</h3>
                      <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                        <Building className="w-3 h-3 shrink-0" /> <span className="line-clamp-1">{contractor.companyName || "Independent"}</span>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs bg-gray-50 p-1 sm:p-1.5 rounded-md">
                          <Briefcase className="w-3.5 h-3.5 text-orange-500 shrink-0" /> <span className="line-clamp-1">{contractor.profession}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 px-0.5 sm:px-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" /> <span className="line-clamp-1">{contractor.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-5 flex flex-col gap-1.5 sm:gap-2">
                      <Link href={`/contractors/${contractor._id}`} className="w-full">
                        <Button
                          variant="outline"
                          className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 h-8 sm:h-10 text-[11px] sm:text-xs font-bold"
                        >
                          View Profile
                        </Button>
                      </Link>
                      {contractor.contractorType === "Premium" && (
                        <>
                          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                            <Button 
                              onClick={() => { trackAnalytics('user', contractor._id, 'whatsapp_click'); window.open(waLink); }} 
                              className="bg-[#25D366] text-[10px] sm:text-xs font-semibold h-8 sm:h-10 px-1 sm:px-2 hover:bg-[#128C7E] w-full flex items-center justify-center gap-1 leading-none shadow-sm"
                            >
                              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                              <span className="truncate">WhatsApp</span>
                            </Button>
                            <Button 
                              onClick={() => {
                                trackAnalytics('user', contractor._id, 'call_click');
                                window.location.href = `tel:${(contractor.phone || '').replace(/\D/g, '')}`;
                              }} 
                              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs font-semibold h-8 sm:h-10 px-1 sm:px-2 w-full flex items-center justify-center gap-1 leading-none shadow-sm"
                            >
                              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                              <span className="truncate">Call Now</span>
                            </Button>
                          </div>
                        </>
                      )}
                      {contractor.contractorType === "Verified" && (
                        <Button
                          onClick={() => { trackAnalytics('user', contractor._id, 'whatsapp_click'); window.open(waLink, "_blank"); }}
                          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors h-8 sm:h-10 text-[11px] sm:text-xs font-semibold"
                        >
                          <MessageCircle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                          <span className="truncate">WhatsApp Enquiry</span>
                        </Button>
                      )}
                      {(!contractor.contractorType || contractor.contractorType === "Normal") && (
                        <Button onClick={() => handleContactClick(contractor)} className="w-full bg-gray-800 hover:bg-gray-900 h-8 sm:h-10 text-[11px] sm:text-xs text-white font-medium">
                          Enquiry Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Logic handle kiya hai taaki mobile par na kate */}
        {approvedContractors.length > itemsPerPage && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
            <span className="flex items-center px-4 text-sm font-medium">Page {currentPage} of {Math.ceil(approvedContractors.length / itemsPerPage)}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= Math.ceil(approvedContractors.length / itemsPerPage)}>Next</Button>
          </div>
        )}
      </main>
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedContractor} />

      {/* Browse by city section â€” placed after contractor listings */}
      <section className="bg-orange-50 border-t border-orange-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Browse house plans &amp; architects by city</h2>
          <p className="text-sm text-gray-500 mb-6">
            Each city page shows plans popular for that city&apos;s plot sizes, local architects, contractors, and construction cost guidance.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { slug: "bhopal", display: "Bhopal", state: "Madhya Pradesh" },
              { slug: "indore", display: "Indore", state: "Madhya Pradesh" },
              { slug: "lucknow", display: "Lucknow", state: "Uttar Pradesh" },
              { slug: "jaipur", display: "Jaipur", state: "Rajasthan" },
              { slug: "nagpur", display: "Nagpur", state: "Maharashtra" },
              { slug: "pune", display: "Pune", state: "Maharashtra" },
              { slug: "hyderabad", display: "Hyderabad", state: "Telangana" },
              { slug: "chennai", display: "Chennai", state: "Tamil Nadu" },
            ].map((city) => (
              <a
                key={city.slug}
                href={`/city/${city.slug}`}
                className="flex flex-col p-5 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all group"
              >
                <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {city.display}
                </span>
                <span className="text-xs text-gray-500 mt-1">{city.state}</span>
                <span className="text-xs text-orange-500 mt-3 font-medium group-hover:underline">
                  House plans &amp; architects â†’
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnersPage;

