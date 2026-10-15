"use client";
import Image from "next/image";


import Link from "next/link";
import { useRouter, usePathname, useParams, useSearchParams } from "next/navigation";
import { getContractorProfileUrl } from "@/utils/profileUrls";


import React, { useState, useEffect, useMemo, useRef, FC, FormEvent } from "react";
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
  LayoutGrid,
  Hammer,
  Sofa,
  Zap,
  Pipette,
  Layers,
  Paintbrush,
  Wrench,
  ArrowRight,
  ArrowLeft,
  Sparkles,
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
  "Tiles & Marble",
  "Painting",
  "Other Services",
];

const CONTRACTOR_CATEGORY_CARDS = [
  {
    id: "Building",
    label: "Building Contractor",
    tag: "Civil & Construction",
    desc: "Complete house construction, structural civil work, RCC framing & renovation.",
    icon: Hammer,
    image: "/contractor.jpeg",
    color: "from-amber-500 to-orange-600",
    borderHover: "hover:border-orange-400",
  },
  {
    id: "Interior",
    label: "Interior Contractor",
    tag: "Interior Design & Fitouts",
    desc: "Full home interiors, modular kitchens, wardrobes, false ceiling & turnkey woodwork.",
    icon: Sofa,
    image: "/cat_home_designs.jpg",
    color: "from-blue-500 to-indigo-600",
    borderHover: "hover:border-blue-400",
  },
  {
    id: "Electrical",
    label: "Electrical Contractor",
    tag: "Wiring & Power Systems",
    desc: "House wiring, electrical DB panels, fittings, power backups & automation.",
    icon: Zap,
    image: "/b1.jpg",
    color: "from-yellow-500 to-amber-600",
    borderHover: "hover:border-amber-400",
  },
  {
    id: "Plumbing",
    label: "Plumbing Contractor",
    tag: "Piping & Water Solutions",
    desc: "Water line piping, sanitary fittings, sewage & drainage systems, pump setup.",
    icon: Pipette,
    image: "/b2.jpeg",
    color: "from-cyan-500 to-blue-600",
    borderHover: "hover:border-cyan-400",
  },
  {
    id: "Tiles & Marble",
    label: "Tiles & Marble",
    tag: "Flooring & Stone Work",
    desc: "Floor & wall tiling, Italian marble laying, granite countertops & diamond polishing.",
    icon: Layers,
    image: "/floorplan2.webp",
    color: "from-emerald-500 to-teal-600",
    borderHover: "hover:border-emerald-400",
  },
  {
    id: "Painting",
    label: "Painting Contractor",
    tag: "Wall Finishes & Colors",
    desc: "Interior & exterior wall painting, waterproof coatings, textures & royal finishes.",
    icon: Paintbrush,
    image: "/b3.webp",
    color: "from-purple-500 to-pink-600",
    borderHover: "hover:border-purple-400",
  },
  {
    id: "Other Services",
    label: "Other Services",
    tag: "Specialized Services",
    desc: "Fabrication, swimming pool, waterproofing, solar panel setup & HVAC contracting.",
    icon: Wrench,
    image: "/b14.webp",
    color: "from-rose-500 to-red-600",
    borderHover: "hover:border-rose-400",
  },
];

const CONTRACTOR_CATEGORY_TABS = [
  { id: "All", label: "All Contractors", icon: LayoutGrid, tag: "Browse All" },
  ...CONTRACTOR_CATEGORY_CARDS.map((cat) => ({
    id: cat.id,
    label: cat.label,
    icon: cat.icon,
    tag: cat.tag,
  })),
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
  const contractorsSectionRef = useRef<HTMLDivElement>(null);

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

  // Sync URL query params if user clicked navbar link or external link
  useEffect(() => {
    const prof = searchParams?.get("profession");
    if (prof && prof !== professionFilter) {
      setProfessionFilter(prof);
    }
  }, [searchParams]);

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

  // Dynamic contractor count per category
  const categoryCounts = useMemo(() => {
    if (!Array.isArray(contractors)) return { All: 0 } as Record<string, number>;
    const counts: Record<string, number> = { All: 0 };
    (contractors as any[]).forEach((c) => {
      if (c.status !== "Approved") return;
      counts.All = (counts.All || 0) + 1;
      const p = (c.profession || "").toLowerCase();
      if (p.includes("building") || p.includes("civil") || p.includes("general") || p.includes("commercial") || p.includes("construction")) {
        counts["Building"] = (counts["Building"] || 0) + 1;
      }
      if (p.includes("interior") || p.includes("fit-out") || p.includes("decor") || p.includes("carpenter") || p.includes("ceiling")) {
        counts["Interior"] = (counts["Interior"] || 0) + 1;
      }
      if (p.includes("electr") || p.includes("wiring") || p.includes("power")) {
        counts["Electrical"] = (counts["Electrical"] || 0) + 1;
      }
      if (p.includes("plumb") || p.includes("sanitary") || p.includes("pipe") || p.includes("drain")) {
        counts["Plumbing"] = (counts["Plumbing"] || 0) + 1;
      }
      if (p.includes("tile") || p.includes("marble") || p.includes("stone") || p.includes("granite") || p.includes("flooring")) {
        counts["Tiles & Marble"] = (counts["Tiles & Marble"] || 0) + 1;
      }
      if (p.includes("paint") || p.includes("color") || p.includes("wall") || p.includes("texture")) {
        counts["Painting"] = (counts["Painting"] || 0) + 1;
      }
      if (p.includes("other") || p.includes("service") || p.includes("fabricat") || p.includes("waterproof") || p.includes("hvac") || p.includes("pool") || p.includes("solar")) {
        counts["Other Services"] = (counts["Other Services"] || 0) + 1;
      }
    });
    return counts;
  }, [contractors]);

  const handleSelectCategory = (catId: string) => {
    setProfessionFilter(catId);
    setTimeout(() => {
      contractorsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

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

      // City filter
      let matchesCity = true;
      if (cityFilter) {
        const q = cityFilter.toLowerCase();
        matchesCity =
          c.isPanIndia ||
          c.city?.toLowerCase() === "pan india" ||
          c.selectedPlan?.toLowerCase().includes("pan_india") ||
          (c.city && c.city.toLowerCase().includes(q)) ||
          (c.selectedCities && c.selectedCities.some((ct: string) => ct.toLowerCase().includes(q)));
        if (!matchesCity) return false;
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
          
        if (!matchesState && !(cityFilter && matchesCity)) {
          return false;
        }
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
          lowerCaseProfession.includes("civil") ||
          lowerCaseProfession.includes("general") ||
          lowerCaseProfession.includes("commercial") ||
          lowerCaseProfession.includes("construction")
        )) ||
        (filter.toLowerCase() === "interior" && (
          lowerCaseProfession.includes("interior") ||
          lowerCaseProfession.includes("fit-out") ||
          lowerCaseProfession.includes("decor") ||
          lowerCaseProfession.includes("carpenter") ||
          lowerCaseProfession.includes("ceiling")
        )) ||
        (filter.toLowerCase() === "electrical" && (
          lowerCaseProfession.includes("electr") ||
          lowerCaseProfession.includes("wiring") ||
          lowerCaseProfession.includes("power")
        )) ||
        (filter.toLowerCase() === "plumbing" && (
          lowerCaseProfession.includes("plumb") ||
          lowerCaseProfession.includes("sanitary") ||
          lowerCaseProfession.includes("pipe") ||
          lowerCaseProfession.includes("drain")
        )) ||
        (filter.toLowerCase() === "tiles & marble" && (
          lowerCaseProfession.includes("tile") ||
          lowerCaseProfession.includes("marble") ||
          lowerCaseProfession.includes("stone") ||
          lowerCaseProfession.includes("granite") ||
          lowerCaseProfession.includes("flooring")
        )) ||
        (filter.toLowerCase() === "painting" && (
          lowerCaseProfession.includes("paint") ||
          lowerCaseProfession.includes("color") ||
          lowerCaseProfession.includes("wall") ||
          lowerCaseProfession.includes("texture")
        )) ||
        (filter.toLowerCase() === "other services" && (
          lowerCaseProfession.includes("other") ||
          lowerCaseProfession.includes("service") ||
          lowerCaseProfession.includes("fabricat") ||
          lowerCaseProfession.includes("waterproof") ||
          lowerCaseProfession.includes("hvac") ||
          lowerCaseProfession.includes("pool") ||
          lowerCaseProfession.includes("solar")
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

  const activeCategory = CONTRACTOR_CATEGORY_CARDS.find((c) => c.id === professionFilter);
  const ActiveCategoryIcon = activeCategory?.icon || LayoutGrid;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
      <Navbar />

      {/* --- Hero Section --- */}
      <div className="relative bg-gray-900 py-12 sm:py-20 overflow-hidden w-full">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80" className="object-cover opacity-20" alt="Hero" fill priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        </div>
        <div className="relative max-w-[1600px] mx-auto px-4 text-center">
          <Badge className="bg-orange-500 mb-4 font-bold text-xs">Trusted Network</Badge>
          <h1 className="text-xl min-[350px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 px-1 leading-tight">
            {professionFilter === "All"
              ? "City Contractor (Building & Interior)"
              : `${activeCategory?.label || professionFilter} in your City`}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl mx-auto mb-6">
            {professionFilter === "All"
              ? "Find verified building and interior contractors in your city. Select a category below to get started."
              : activeCategory?.desc || "Verified professionals ready for your dream construction project."}
          </p>
          <div className="flex justify-center px-4">
            <Button onClick={() => router.push("/register?role=Contractor")} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 py-4 px-6 sm:py-6 sm:px-8 rounded-full shadow-lg transition-transform hover:scale-105 font-bold">
              <UserPlus className="w-5 h-5 mr-2" /> Register With Us
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-20">
        {/* --- Category Tab Strip --- */}
        <div className="mb-6 bg-white p-2.5 sm:p-3.5 rounded-2xl md:rounded-[26px] shadow-lg border border-gray-100">
          <div
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CONTRACTOR_CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = professionFilter === tab.id;
              const count = categoryCounts[tab.id];
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectCategory(tab.id)}
                  className={`flex items-center gap-2 md:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs whitespace-nowrap transition-all duration-200 shrink-0 border-2 ${
                    isSelected
                      ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/25 scale-[1.02]"
                      : "bg-white text-gray-700 border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-600"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isSelected ? "bg-white/20 text-white" : "bg-orange-50 text-orange-600"}`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="leading-tight">{tab.label}</span>
                    <span className={`text-[10px] font-normal leading-tight hidden sm:block ${
                      isSelected ? "text-orange-100" : "text-gray-400"
                    }`}>
                      {count !== undefined ? `${count} available` : tab.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- 1. Visual Category Grid (Shown when 'All' is selected) --- */}
        {professionFilter === "All" ? (
          <div className="mb-10 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Contractor Categories
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                Pehle Category Chunein
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Apni zaroorat ke hisaab se category select karein aur verified local contractors dekhein
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {CONTRACTOR_CATEGORY_CARDS.map((cat) => {
                const Icon = cat.icon;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`group bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col hover:-translate-y-1 ${cat.borderHover}`}
                  >
                    <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-gray-950/20 to-transparent" />
                      <div className="absolute top-2.5 right-2.5">
                        <Badge className="bg-white/95 text-gray-800 text-[10px] font-bold shadow-sm backdrop-blur-xs">
                          {count} Verified
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 flex flex-col flex-grow relative">
                      <div className={`absolute -top-5 left-4 sm:left-5 w-11 h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-md flex items-center justify-center border-2 border-white`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="mt-4 flex-grow">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                          {cat.tag}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 mt-0.5">
                          {cat.label}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-orange-600 group-hover:underline flex items-center gap-1">
                          View Contractors
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="text-[11px] font-medium text-gray-400">
                          {count} Available
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* --- 2. Active Category Banner (Shown when a category is selected) --- */
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-2xl md:rounded-3xl p-5 sm:p-6 text-white mb-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0 border border-white/30">
                  <ActiveCategoryIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-orange-100">
                      Category Selected
                    </span>
                    <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {approvedContractors.length} Contractors
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    {activeCategory?.label || professionFilter}
                  </h2>
                  <p className="text-xs sm:text-sm text-orange-100 mt-0.5 max-w-xl line-clamp-1">
                    {activeCategory?.desc || "Showing verified contractors in this category"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setProfessionFilter("All")}
                className="px-4 py-2 sm:py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                All Categories
              </button>
            </div>
          </div>
        )}

        {/* --- Anchor ref for scroll --- */}
        <div ref={contractorsSectionRef} />

        {/* --- Filters Section --- */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 mb-10 w-full">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <FilterIcon className="w-3.5 h-3.5 text-orange-600" /> Filter Contractors
            </span>
            <div className="flex items-center gap-2">
              <label 
                htmlFor="contractorPanIndiaCheck"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  (stateFilter !== "All States" || cityFilter || pincodeFilter) 
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60" 
                    : isPanIndiaFilter 
                      ? "bg-orange-600 border-orange-600 text-white shadow-sm cursor-pointer" 
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                <input 
                  id="contractorPanIndiaCheck" 
                  type="checkbox" 
                  checked={isPanIndiaFilter} 
                  disabled={stateFilter !== "All States" || cityFilter !== "" || pincodeFilter !== ""}
                  onChange={(e) => setIsPanIndiaFilter(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-3.5 h-3.5 cursor-pointer disabled:cursor-not-allowed"
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
                disabled={isPanIndiaFilter}
                className="mt-1 w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                  disabled={isPanIndiaFilter}
                  className="pl-9 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white text-xs disabled:opacity-50 disabled:cursor-not-allowed" 
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
                disabled={isPanIndiaFilter}
                className="mt-1 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white text-xs disabled:opacity-50 disabled:cursor-not-allowed" 
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
              const isPaid = (contractor as any).paymentStatus === "Paid";
              const isPremium = isPaid && contractor.contractorType === "Premium";
              const isVerified = isPaid && contractor.contractorType === "Verified";
              const phoneStr = contractor.phone ? (contractor.phone || '').replace(/\D/g, '') : '';
              const cleanPhone = phoneStr.startsWith('91') ? phoneStr : '91' + phoneStr;
              const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello! I found your profile on www.houseplanfiles.com - Architect Contractor Marketplace. I would like to connect with you.")}`;

              return (
                <div key={contractor._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full group">
                  <div className="h-20 sm:h-28 bg-gray-100 relative">
                    <Image src={contractor.shopImageUrl ? getFileUrl(contractor.shopImageUrl) : "/contractor.jpeg"} className="object-cover" alt="Shop Image" fill sizes="(max-width: 768px) 50vw, 25vw" />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {isPremium && <Badge className="bg-orange-500 text-[10px]">Premium</Badge>}
                      {isVerified && <Badge className="bg-blue-600 text-[10px]">Verified</Badge>}
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
                      <Link href={getContractorProfileUrl(contractor)} className="w-full">
                        <Button
                          variant="outline"
                          className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 h-8 sm:h-10 text-[11px] sm:text-xs font-bold"
                        >
                          View Profile
                        </Button>
                      </Link>
                      {isPremium && (
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
                      {isVerified && (
                        <Button
                          onClick={() => { trackAnalytics('user', contractor._id, 'whatsapp_click'); window.open(waLink, "_blank"); }}
                          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors h-8 sm:h-10 text-[11px] sm:text-xs font-semibold"
                        >
                          <MessageCircle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                          <span className="truncate">WhatsApp Enquiry</span>
                        </Button>
                      )}
                      {(!isPaid || !contractor.contractorType || contractor.contractorType === "Normal") && (
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

