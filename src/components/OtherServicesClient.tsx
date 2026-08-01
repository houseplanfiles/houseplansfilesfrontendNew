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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Animation & Icons
import { motion, AnimatePresence } from "framer-motion";
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
  "Swimming Pool",
  "Pre Engineering Board / PEB",
  "Pre Fabricated House",
  "Pest Control",
  "Landscaping & Garden",
  "Manpower Supply",
  "Modular Kitchen",
  "Lift Services",
  "Building Inspection",
  "Solar Rooftop Panel",
  "HVAC",
  "Carpenter",
  "Glass Fabricator"
];

// --- Contact Modal Component ---
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
  // Read ?city= from URL on mount (e.g. /contractors?city=Bhopal)
  const [cityFilter, setCityFilter] = useState(() => searchParams?.get("city") || "");
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
    if (cityFilter) params.set("city", cityFilter);
    if (professionFilter && professionFilter !== "All") params.set("profession", professionFilter);
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [cityFilter, professionFilter, router, pathname]);

  const approvedContractors = useMemo(() => {
    if (!Array.isArray(contractors)) return [];
    return (contractors as ContractorType[]).filter((c) => {
      const isApproved = c.status === "Approved";
      const matchesCity = !cityFilter || c.city?.toLowerCase().includes(cityFilter.toLowerCase());
      const lowerCaseProfession = c.profession?.toLowerCase() || "";
      const filter = professionFilter || "All";
      const matchesProfession = filter === "All" ||
        (filter.toLowerCase() === "building" && (
          lowerCaseProfession.includes("civil") ||
          lowerCaseProfession.includes("building") ||
          lowerCaseProfession.includes("construction") ||
          lowerCaseProfession.includes("turnkey") ||
          lowerCaseProfession.includes("labour")
        )) ||
        lowerCaseProfession.includes(filter.toLowerCase()) ||
        filter.toLowerCase().includes(lowerCaseProfession);
      return isApproved && matchesCity && matchesProfession;
    });
  }, [contractors, cityFilter, professionFilter]);

  const paginatedContractors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return approvedContractors.slice(startIndex, startIndex + itemsPerPage);
  }, [approvedContractors, currentPage]);

  const handleContactClick = (contractor: ContractorType) => {
    setSelectedContractor(contractor);
    setIsModalOpen(true);
  };

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
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl lg:whitespace-nowrap font-extrabold text-white mb-4 px-2 leading-tight">
            Other Services
          </h1>
          <div className="flex justify-center px-4">
            <Button onClick={() => router.push("/register")} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 py-6 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
              <UserPlus className="w-5 h-5 mr-2" /> Register With Us
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pb-20">
        {/* --- Filters Section --- */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-10 w-full">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <Label className="text-xs font-bold text-gray-500 uppercase">Find by City</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search City..." value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="pl-9 h-12 bg-gray-50 w-full" />
              </div>
            </div>

            {/* Profession Filter */}
            <div className="w-full">
              {/* Mobile Filter */}
              <div className="lg:hidden w-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full h-12 flex justify-between px-4 border-gray-200">
                      <span>Profession: {professionFilter}</span>
                      <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl p-0">
                    <SheetHeader className="p-6 border-b bg-white sticky top-0 z-10">
                      <SheetTitle className="text-xl font-bold flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-orange-600" />
                        Select Specialization
                      </SheetTitle>
                    </SheetHeader>
                    <div className="p-6 overflow-y-auto h-full pb-24">
                      <div className="grid grid-cols-1 gap-2">
                        {CONTRACTOR_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setProfessionFilter(cat)}
                            className={`w-full text-left p-4 rounded-xl text-sm font-semibold transition-all border flex items-center justify-between ${
                              professionFilter === cat
                                ? "bg-orange-50 text-orange-600 border-orange-200"
                                : "bg-white text-gray-600 border-gray-100"
                            }`}
                          >
                            {cat}
                            {professionFilter === cat && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Filter */}
              <div className="hidden lg:block w-full">
                <Label className="text-xs font-bold text-gray-500 tracking-wide flex items-center gap-2 mb-2 uppercase">
                  <FilterIcon className="w-3 h-3" /> Specialization
                </Label>
                <div
                  className="flex overflow-x-auto whitespace-nowrap gap-2 pb-2"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {CONTRACTOR_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProfessionFilter(cat)}
                      className={`px-4 h-10 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
                        professionFilter === cat
                          ? "bg-orange-600 text-white border-orange-600 shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Grid Section --- */}
        {contractorListStatus === "loading" ? (
          <div className="text-center py-24"><Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {paginatedContractors.map((contractor) => {
              const phoneStr = contractor.phone ? contractor.phone.replace(/\D/g, '') : '';
              const waLink = `https://wa.me/${phoneStr}`;

              return (
                <div key={contractor._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full group">
                  <div className="h-28 bg-gray-100 relative">
                    <Image src={contractor.shopImageUrl ? getFileUrl(contractor.shopImageUrl) : "/contractor.jpeg"} className="object-cover" alt="Shop Image" fill sizes="(max-width: 768px) 50vw, 25vw" />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {contractor.contractorType === "Premium" && <Badge className="bg-orange-500 text-[10px]">Premium</Badge>}
                      {contractor.contractorType === "Verified" && <Badge className="bg-blue-600 text-[10px]">Verified</Badge>}
                    </div>
                  </div>

                  <div className="px-4 pb-5 flex flex-col flex-grow">
                    <div className="-mt-8 mb-3 relative z-10">
                      <Avatar className="w-16 h-16 border-4 border-white shadow-md">
                        <AvatarImage src={contractor.photoUrl} />
                        <AvatarFallback>{contractor.name?.[0]}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{contractor.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                        <Building className="w-3 h-3" /> {contractor.companyName || "Independent"}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs bg-gray-50 p-1.5 rounded-md">
                          <Briefcase className="w-3.5 h-3.5 text-orange-500" /> {contractor.profession}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 px-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" /> {contractor.city}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-2">
                      <Link href={`/contractors/${contractor._id}`} className="w-full">
                        <Button
                          variant="outline"
                          className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 h-10 text-xs font-bold"
                        >
                          View Profile
                        </Button>
                      </Link>
                      {contractor.contractorType === "Premium" && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <Button onClick={() => window.open(waLink)} className="bg-[#25D366] text-[10px] h-10 px-1 hover:bg-[#128C7E]">
                              <MessageCircle className="w-3 h-3 mr-1" /> WhatsApp
                            </Button>
                            <Button onClick={() => togglePhoneReveal(contractor._id)} className={`text-[10px] h-10 px-1 ${revealedPhoneIds.has(contractor._id) ? 'bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                              <Phone className="w-3 h-3 mr-1" /> {revealedPhoneIds.has(contractor._id) ? contractor.phone : "Call Now"}
                            </Button>
                          </div>
                        </>
                      )}
                      {contractor.contractorType === "Verified" && (
                        <Button
                          onClick={() => { trackAnalytics('user', partner._id, 'whatsapp_click'); window.open(waLink, "_blank"); }}
                          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors h-10"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp Enquiry
                        </Button>
                      )}
                      {(!contractor.contractorType || contractor.contractorType === "Normal") && (
                        <Button onClick={() => handleContactClick(contractor)} className="w-full bg-gray-800 hover:bg-gray-900 h-10 text-white">
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

      {/* Browse by city section — placed after contractor listings */}
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
                  House plans &amp; architects →
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