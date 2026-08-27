"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useState, useEffect, useMemo, FC, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchArchitects } from "@/lib/features/users/userSlice";
import { createInquiry, resetActionStatus } from "@/lib/features/inquiries/inquirySlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "@/components/MotionWrapper";
import { toast } from "sonner";
import {
  MapPin, Phone, X, Send, Loader2, Star, Briefcase, Search,
  CheckCircle2, Filter as FilterIcon, SlidersHorizontal, UserPlus,
  ChevronLeft, ChevronRight, MessageCircle, BookOpen, Zap,
} from "lucide-react";

type ArchitectType = {
  _id: string;
  name: string;
  companyName?: string;
  city?: string;
  address?: string;
  experience?: string;
  photoUrl?: string;
  shopImageUrl?: string;
  qualification?: string;
  skills?: string[];
  charges?: string;
  phone?: string;
  profession?: string;
  status?: string;
  contractorType?: "Normal" | "Verified" | "Premium";
};

const getFileUrl = (path: string) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path.replace(/\\/g, "/")}`;
};

const ContactModal: FC<{ isOpen: boolean; onClose: () => void; user: ArchitectType | null }> = ({ isOpen, onClose, user }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus } = useSelector((state: RootState) => state.inquiries);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inquiryData = {
      recipient: user._id,
      recipientInfo: { name: user.name, role: "Architect", phone: user.phone, city: user.city, address: user.address, detail: `${user.profession} - ${user.qualification}` },
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10">
            <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Contact {user.name}</h2>
                <p className="text-gray-400 text-sm">Discuss your architectural requirements</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required className="mt-1" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Label htmlFor="requirements">Project Details</Label>
                  <Textarea id="requirements" name="requirements" placeholder="Describe your project, plot size, or specific requirements..." rows={4} required className="mt-1 resize-none" />
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

const ArchitectsPage: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { architects, architectListStatus } = useSelector((state: RootState) => state.user);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArchitect, setSelectedArchitect] = useState<ArchitectType | null>(null);
  const [cityFilter, setCityFilter] = useState(searchParams?.get("city") || "");
  const [professionFilter, setProfessionFilter] = useState(() => searchParams?.get("profession") || "All");
  const [currentPage, setCurrentPage] = useState(1);
  const [revealedPhoneIds, setRevealedPhoneIds] = useState<Set<string>>(new Set());
  const itemsPerPage = 8;

  const togglePhoneReveal = (id: string) => {
    setRevealedPhoneIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => { dispatch(fetchArchitects({ page: 1, limit: 100 })); }, [dispatch]);
  
  useEffect(() => {
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (cityFilter) params.set("city", cityFilter);
    if (professionFilter && professionFilter !== "All") params.set("profession", professionFilter);
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [cityFilter, professionFilter, router, pathname]);

  const filteredArchitects = useMemo(() => {
    if (!Array.isArray(architects)) return [];
    return (architects as ArchitectType[]).filter((c) => {
      const isApproved = c.status === "Approved";
      const matchesCity = !cityFilter || c.city?.toLowerCase().includes(cityFilter.toLowerCase());
      const matchesProfession = professionFilter === "All" || c.profession?.toLowerCase() === professionFilter.toLowerCase();
      return isApproved && matchesCity && matchesProfession;
    });
  }, [architects, cityFilter, professionFilter]);

  const totalPages = Math.ceil(filteredArchitects.length / itemsPerPage);
  const paginatedArchitects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredArchitects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArchitects, currentPage, itemsPerPage]);

  const handleContactClick = (architect: ArchitectType) => { setSelectedArchitect(architect); setIsModalOpen(true); };

  const categories = ["All", "Architect", "Civil Design Engineer", "Structure Engineer", "Interior Designer", "Site Engineer", "MEP Consultant", "Vastu Consultant"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-slate-900 py-12 sm:py-20 overflow-hidden w-full">
        <div className="absolute inset-0">
          <Image src="/architect_hero.webp" alt="Architects Background" fill sizes="100vw" className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-4 px-4 py-1 text-xs sm:text-sm backdrop-blur-md">Design Experts</Badge>
          <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 px-2 leading-tight">
            Hire Your Top City Architects, Interior Designers & Professionals
          </h1>
          <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8 font-medium px-4">2D, 3D, Structural and Site Engineers</p>
          <div className="flex justify-center px-4">
            <Button onClick={() => router.push("/register")} className="w-full max-w-[280px] sm:max-w-none sm:w-auto bg-orange-600 text-white hover:bg-orange-700 font-bold py-5 sm:py-6 px-6 sm:px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1 text-sm sm:text-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 mr-2" /> Register as professional
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pb-20 overflow-hidden">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-10 w-full">
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            <div className="w-full lg:w-1/3">
              <Label htmlFor="city-filter" className="text-xs font-bold text-gray-500 tracking-wide uppercase">Search by City</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="city-filter" placeholder="e.g. Delhi, Mumbai, Lucknow" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="pl-9 h-11 sm:h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all text-sm w-full" />
              </div>
            </div>

            {/* Mobile Filter */}
            <div className="lg:hidden w-full">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center justify-between h-11 sm:h-12 border-gray-200 text-gray-700 font-semibold rounded-xl bg-gray-50/50 px-4">
                    <span className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" />{professionFilter === "All" ? "Specialization" : professionFilter}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl p-0">
                  <SheetHeader className="p-6 border-b bg-white sticky top-0 z-10">
                    <SheetTitle className="text-xl font-bold flex items-center gap-2"><FilterIcon className="w-5 h-5 text-orange-600" />Select Specialization</SheetTitle>
                  </SheetHeader>
                  <div className="p-6 overflow-y-auto h-full pb-24">
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map((cat) => (
                        <button key={cat} onClick={() => setProfessionFilter(cat)} className={`w-full text-left p-4 rounded-xl text-sm font-semibold transition-all border flex items-center justify-between ${professionFilter === cat ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-white text-gray-600 border-gray-100"}`}>
                          {cat}{professionFilter === cat && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Categories */}
            <div className="hidden lg:block w-full lg:w-2/3">
              <Label className="text-xs font-bold text-gray-500 tracking-wide flex items-center gap-2 mb-2 uppercase"><FilterIcon className="w-3 h-3" /> Specialization</Label>
              <div className="flex overflow-x-auto whitespace-nowrap gap-2 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setProfessionFilter(cat)} className={`px-4 h-10 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${professionFilter === cat ? "bg-orange-600 text-white border-orange-600 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {architectListStatus === "loading" ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
            <p className="mt-4 text-gray-500">Finding experts...</p>
          </div>
        ) : (
          <>
            {paginatedArchitects.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {paginatedArchitects.map((architect, index) => {
                    const type = architect.contractorType || "Normal";
                    const phoneStr = architect.phone ? architect.phone.replace(/\D/g, '') : '';
                    const waLink = `https://wa.me/${phoneStr}?text=${encodeURIComponent(`Hi ${architect.name}, I found your profile on HousePlansFiles.`)}`;
                    const callLink = `tel:${phoneStr}`;

                    return (
                      <div key={architect._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                        {/* Banner */}
                        <div className="h-28 sm:h-32 relative overflow-hidden shrink-0">
                          <Image src={architect.shopImageUrl ? getFileUrl(architect.shopImageUrl) : "/architect.png"} alt={`${architect.name} banner`} fill className="object-cover" sizes="100vw" priority />
                          {type === "Premium" && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-orange-500 text-white border-none shadow-lg px-2 py-0.5 text-[10px] font-bold"><Zap className="w-3 h-3 mr-1 fill-current" /> PREMIUM</Badge>
                            </div>
                          )}
                        </div>

                        {/* Profile */}
                        <div className="px-4 sm:px-5 pb-5 flex flex-col flex-grow relative">
                          <div className="-mt-10 mb-3 relative z-10">
                            <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                              <AvatarImage src={architect.photoUrl} alt={architect.name} />
                              <AvatarFallback className="text-xl font-bold bg-orange-600 text-white">{architect.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex-grow">
                            <div className="flex items-center gap-1.5 mb-1">
                              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{architect.name}</h3>
                              {type === "Verified" && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                            </div>
                            <p className="text-gray-500 text-xs font-medium mb-4 flex items-center gap-1">
                              <BookOpen className="w-3 h-3 shrink-0" />
                              <span className="line-clamp-1">{architect.qualification || "Expert Designer"}</span>
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                                <Briefcase className="w-4 h-4 text-orange-600 shrink-0" />
                                <span className="text-xs sm:text-sm text-orange-900 font-semibold line-clamp-1">{architect.profession}</span>
                              </div>
                              <div className="flex items-center gap-3 px-2 text-gray-600">
                                <Star className="w-4 h-4 text-orange-500 shrink-0" />
                                <span className="text-xs sm:text-sm">{architect.experience} Experience</span>
                              </div>
                              <div className="flex items-center gap-3 px-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                                <span className="text-xs sm:text-sm line-clamp-1">{architect.city || "Local"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Buttons */}
                          <div className="pt-5 mt-auto flex flex-col gap-2">
                            <Button onClick={() => router.push(`/architects/${architect._id}`)} variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 h-10 text-xs">View Profile</Button>
                            {type === "Premium" ? (
                              <>
                                <div className="flex flex-col gap-2">
                                  <Button onClick={() => window.open(waLink, "_blank")} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-[11px] sm:text-xs h-10 px-0 sm:px-1">
                                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> WhatsApp
                                  </Button>
                                  <Button onClick={() => { trackAnalytics('user', architect._id, 'call_click'); window.location.href = callLink; }} className="w-full bg-blue-600 text-white text-[11px] sm:text-xs h-10 px-0 sm:px-1">
                                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Call Now
                                  </Button>
                                </div>
                              </>
                            ) : type === "Verified" ? (
                              <Button onClick={() => window.open(waLink, "_blank")} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-11">
                                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Enquiry
                              </Button>
                            ) : (
                              <Button onClick={() => handleContactClick(architect)} className="w-full bg-gray-800 hover:bg-gray-900 text-white h-11">Request Quote</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-wrap justify-center items-center gap-2 pb-10">
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="rounded-xl w-9 h-9">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} onClick={() => setCurrentPage(pageNum)} className={`w-9 h-9 rounded-xl text-xs font-bold ${currentPage === pageNum ? "bg-orange-600" : ""}`}>
                          {pageNum}
                        </Button>
                      ))}
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="rounded-xl w-9 h-9">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mx-4">
                <Search className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No experts found</h3>
                <Button variant="outline" onClick={() => { setCityFilter(""); setProfessionFilter("All"); }} className="mt-6">Clear Filters</Button>
              </div>
            )}
          </>
        )}
      </main>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedArchitect} />
      <Footer />
    </div>
  );
};

export default ArchitectsPage;
