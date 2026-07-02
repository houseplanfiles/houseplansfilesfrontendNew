"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchArchitects } from "@/lib/features/users/userSlice";
import { createInquiry, resetActionStatus } from "@/lib/features/inquiries/inquirySlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MapPin, Phone, X, Send, Loader2, Star, Briefcase,
  Search, CheckCircle2, ChevronLeft, ChevronRight,
} from "lucide-react";

export default function ArchitectsClient() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { architects, architectListStatus, architectPagination } = useSelector(
    (state: RootState) => state.user
  );
  const { actionStatus } = useSelector((state: RootState) => state.inquiries);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedArchitect, setSelectedArchitect] = useState<any>(null);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchArchitects({ page, search, city: cityFilter }));
  }, [dispatch, page, search, cityFilter]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Inquiry sent successfully! The architect will contact you soon.");
      setInquiryForm({ name: "", email: "", phone: "", message: "" });
      setIsSheetOpen(false);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, dispatch]);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArchitect) return;
    dispatch(createInquiry({ ...inquiryForm, architectId: selectedArchitect._id, type: "architect" }));
  };

  const isLoading = architectListStatus === "loading";
  const pages = architectPagination?.pages || 1;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search architects..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-11"
            />
          </div>
          <Input
            placeholder="Filter by city..."
            value={cityFilter}
            onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
            className="h-11 sm:w-48"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
          </div>
        ) : architects.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No architects found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {architects.map((arch: any) => (
              <motion.div
                key={arch._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden group"
              >
                {/* Cover */}
                <div className="h-28 bg-gradient-to-r from-orange-400 to-orange-600 relative">
                  {arch.shopImageUrl && (
                    <img src={arch.shopImageUrl} alt={arch.companyName || arch.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="p-5 -mt-8 relative">
                  <Avatar className="w-16 h-16 border-4 border-white shadow-medium mb-3">
                    <AvatarImage src={arch.photoUrl} alt={arch.name} />
                    <AvatarFallback className="bg-orange-500 text-white font-bold text-xl">
                      {arch.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-1">
                        {arch.name}
                        {arch.isApproved && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </h3>
                      {arch.companyName && <p className="text-sm text-gray-500">{arch.companyName}</p>}
                    </div>
                    {arch.experience && (
                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                        {arch.experience}yr exp
                      </Badge>
                    )}
                  </div>

                  {arch.city && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <MapPin className="w-3.5 h-3.5" /> {arch.city}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      className="flex-1 btn-primary"
                      onClick={() => router.push(`/architects/${arch._id}`)}
                    >
                      View Profile
                    </Button>
                    <Sheet open={isSheetOpen && selectedArchitect?._id === arch._id} onOpenChange={setIsSheetOpen}>
                      <SheetTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-orange-500 text-orange-600"
                          onClick={() => { setSelectedArchitect(arch); setIsSheetOpen(true); }}
                        >
                          <Send className="w-3.5 h-3.5 mr-1" /> Inquire
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Send Inquiry to {arch.name}</SheetTitle>
                        </SheetHeader>
                        <form onSubmit={handleInquiry} className="space-y-4 mt-6">
                          <div>
                            <Label>Your Name</Label>
                            <Input value={inquiryForm.name} onChange={(e) => setInquiryForm(f => ({ ...f, name: e.target.value }))} required className="mt-1.5" />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input type="email" value={inquiryForm.email} onChange={(e) => setInquiryForm(f => ({ ...f, email: e.target.value }))} required className="mt-1.5" />
                          </div>
                          <div>
                            <Label>Phone</Label>
                            <Input value={inquiryForm.phone} onChange={(e) => setInquiryForm(f => ({ ...f, phone: e.target.value }))} className="mt-1.5" />
                          </div>
                          <div>
                            <Label>Message</Label>
                            <Textarea value={inquiryForm.message} onChange={(e) => setInquiryForm(f => ({ ...f, message: e.target.value }))} rows={4} required className="mt-1.5" />
                          </div>
                          <Button type="submit" className="w-full btn-primary" disabled={actionStatus === "loading"}>
                            {actionStatus === "loading" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                            Send Inquiry
                          </Button>
                        </form>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border-orange-500 text-orange-600">
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm text-gray-600 font-medium">Page {page} of {pages}</span>
            <Button variant="outline" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="border-orange-500 text-orange-600">
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
