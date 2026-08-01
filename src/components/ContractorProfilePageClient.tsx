"use client";
import { useParams, useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Building,
  Building2,
  Phone,
  Briefcase,
  Star,
  Download,
  Mail,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  X,
  Send,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { trackAnalytics } from "@/lib/analytics";


interface ContractorProfilePageClientProps {
  contractorId?: string;
}

const ContractorProfilePage = ({ contractorId }: ContractorProfilePageClientProps = {}) => {
  const params = useParams();
  const id = contractorId || params?.id;
  const router = useRouter();
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/contractor/${id}`
        );
        setContractor(data);
        trackAnalytics('user', id, 'view');
      } catch (error) {
        console.error("Error fetching contractor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContractor();
  }, [id]);

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
        recipient: id,
        recipientInfo: {
          name: contractor.name,
          role: contractor.role,
          city: contractor.city,
          detail: selectedPackage ? `Service Plan: ${selectedPackage.name}` : "General Enquiry"
        },
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        senderWhatsapp: formData.senderWhatsapp,
        requirements: formData.requirements
      };

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inquiries`, inquiryData);
      
      toast.success("Enquiry sent successfully! The contractor will contact you soon.");
      setFormData({ senderName: "", senderEmail: "", senderWhatsapp: "", requirements: "" });
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100 italic">
          <h2 className="text-3xl font-extrabold mb-4">Contractor not found</h2>
          <Button onClick={() => router.push("/city-partners")} variant="secondary">Back to Partners</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      

      <Navbar />

      <main className="pb-16 sm:pb-32">
        {/* --- HERO SECTION --- */}
        <div className="relative bg-gray-900 py-8 sm:pt-16 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={getFileUrl(contractor.coverPhotoUrl) || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80"}
              alt="Cover"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col items-center mb-8 sm:mb-12">
              <div className="relative mb-4 sm:mb-6">
                <Avatar className="w-24 h-24 sm:w-40 sm:h-40 border-4 border-white/20 shadow-2xl">
                  <AvatarImage src={getFileUrl(contractor.photoUrl)} alt={contractor.name} />
                  <AvatarFallback className="bg-orange-600 text-white text-3xl sm:text-4xl font-extrabold">
                    {contractor.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {contractor.contractorType === "Premium" && (
                  <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-1.5 sm:p-2 rounded-full shadow-lg border-2 border-gray-900">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  </div>
                )}
              </div>
              <Badge className="bg-orange-500 mb-3 sm:mb-4 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 fill-current" /> Premium Partner
              </Badge>
              <h1 className="text-2xl md:text-5xl font-extrabold text-white tracking-tight mb-2 sm:mb-4 text-center">
                {contractor.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                <p className="text-gray-400 font-extrabold flex items-center gap-1.5 sm:gap-2 uppercase tracking-widest text-[9px] sm:text-[10px]">
                  <MapPin className="w-3 h-3 text-orange-500" /> {contractor.city} • {contractor.experience || "Expert"} Experience
                </p>
                {/* Service Types Badges */}
                {contractor.serviceTypes && contractor.serviceTypes.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                    {contractor.serviceTypes.map((type: string) => (
                      <Badge key={type} className="bg-blue-600/30 text-blue-400 border border-blue-500/50 text-[9px] sm:text-[10px] py-0.5 px-2.5 sm:px-3">
                        {type}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 items-stretch">
              {/* Business Info Column */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 text-white shadow-2xl">
                <h3 className="text-lg sm:text-xl font-extrabold mb-5 sm:mb-8 flex items-center gap-2 sm:gap-3">
                  <Building className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" /> Business Info
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-orange-500 border border-white/10">
                      <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Profession</p>
                      <p className="text-base sm:text-lg font-extrabold text-white uppercase">{contractor.profession}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-orange-500 border border-white/10">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Service Area</p>
                      <p className="text-base sm:text-lg font-extrabold text-white uppercase">{contractor.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Expert Column */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 text-white shadow-2xl">
                <h3 className="text-lg sm:text-xl font-extrabold mb-5 sm:mb-8 flex items-center gap-2 sm:gap-3">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 fill-orange-500" /> Why Expert?
                </h3>
                <div className="space-y-3 sm:space-y-5">
                  {["Top-Tier Verified", "Assured Materials", "Timely Delivery"].map((tx, i) => (
                    <div key={i} className="flex gap-3 sm:gap-4 items-center">
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                      <span className="text-sm sm:text-base font-extrabold text-gray-100">{tx}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Column */}
              <div className="flex flex-col gap-3 sm:gap-4">
                <Button onClick={() => handleInquiryAction()} className="w-full bg-orange-600 hover:bg-orange-700 h-14 sm:h-16 rounded-xl sm:rounded-2xl text-base sm:text-lg font-extrabold shadow-2xl shadow-orange-600/40 text-white transition-all active:scale-95 border-none">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" /> Contact Now
                </Button>
                
                {/* WhatsApp Button */}
                {(contractor.contractorType === "Verified" || contractor.contractorType === "Premium" || contractor.role === "Premium") && (
                  <Button 
                    onClick={() => {
                      trackAnalytics('user', contractor._id, 'whatsapp_click');
                      const phoneStr = contractor.phone ? contractor.phone.replace(/\D/g, '') : '';
                      window.open(`https://wa.me/${phoneStr}?text=${encodeURIComponent(`Hi ${contractor.name}, I found your profile on HousePlansFiles.`)}`, "_blank");
                    }} 
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] h-14 sm:h-16 rounded-xl sm:rounded-2xl text-base sm:text-lg font-extrabold shadow-2xl shadow-green-600/40 text-white transition-all active:scale-95 border-none"
                  >
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" /> WhatsApp
                  </Button>
                )}

                {contractor.portfolioUrl && (contractor.contractorType === "Premium" || contractor.role === "Premium") && (
                  <a href={getFileUrl(contractor.portfolioUrl)} target="_blank" rel="noreferrer" className="block w-full">
                    <Button variant="outline" className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl border-2 border-white/20 text-gray-900 bg-white/90 hover:bg-white backdrop-blur-md font-extrabold text-base sm:text-lg transition-all">
                      <Download className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" /> Get Portfolio
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTENT SECTION BELOW BANNER --- */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mt-10 sm:mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">

            {/* LEFT: Service Packages (3 stacked) */}
            <aside className="lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 px-1 sm:px-2">
                <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-orange-600 rounded-full" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Service Plans</h2>
              </div>
              {contractor.packages && contractor.packages.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {contractor.packages.map((pkg: any, idx: number) => (
                    <Card key={idx} className="bg-white border-2 border-gray-50 shadow-sm rounded-xl sm:rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-xl transition-all p-4 sm:p-6 group">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-3 sm:mb-4 gap-2 sm:gap-0">
                        <h4 className="text-lg sm:text-xl font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors uppercase leading-tight">{pkg.name}</h4>
                        <div className="bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100 self-start">
                          <span className="text-orange-600 font-extrabold text-sm sm:text-base">
                            {pkg.price.includes("₹") ? pkg.price : `₹${pkg.price}`}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-500 font-bold mb-4 sm:mb-6 line-clamp-3 leading-relaxed">{pkg.description}</p>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleInquiryAction(pkg)}
                          className="flex-grow bg-gray-900 text-white font-extrabold h-12 rounded-2xl hover:bg-orange-600 shadow-md transition-all active:scale-95"
                        >
                          Enquire Now
                        </Button>
                        {pkg.pdfUrl && (
                          <a href={getFileUrl(pkg.pdfUrl)} target="_blank" rel="noreferrer">
                            <Button
                              variant="outline"
                              size="icon"
                              title="Download Package PDF"
                              className="w-12 h-12 rounded-2xl border-2 border-gray-100 text-gray-400 hover:text-orange-600 hover:border-orange-200 transition-all"
                            >
                              <Download className="w-5 h-5" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-10 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200 italic font-bold text-gray-400">No packages available</div>
              )}
            </aside>

            {/* RIGHT: Recent Projects Grid */}
            <div className="lg:col-span-9 space-y-6 sm:space-y-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 px-1 sm:px-2">
                <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-orange-600 rounded-full" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight uppercase">Recent Projects</h2>
              </div>
              {contractor.workSamples && contractor.workSamples.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
                  {contractor.workSamples.map((sw: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => router.push(`/contractors/${id}/project/${i}`)}
                      className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    >
                      {/* Image */}
                      <img
                        src={getFileUrl(sw.imageUrl)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={sw.title || "Project"}
                      />

                      {/* Permanent Bottom Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                      {/* Center Decorative Icon */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
                          <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400 opacity-80" />
                        </div>
                      </div>

                      {/* Details on Image */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center space-y-1 sm:space-y-2">
                        <h3 className="text-lg md:text-2xl font-extrabold text-orange-500 tracking-tight uppercase line-clamp-1 leading-tight">
                          {sw.title || "Elite Project"}
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-white font-extrabold text-xs sm:text-sm group-hover:gap-3 transition-all opacity-90">
                          Explore <span className="text-base sm:text-lg">→</span>
                        </div>
                      </div>

                      {/* Location Badge (Top Right) */}
                      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                        <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 font-bold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full uppercase text-[9px] sm:text-[10px] tracking-widest">
                          {sw.location}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 sm:p-20 bg-white rounded-3xl sm:rounded-[3rem] text-center border-2 border-dashed border-gray-100 italic font-bold text-gray-400">No works showcased yet.</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- INQUIRY FORM MODAL --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="bg-gray-900 p-8 text-white relative">
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold tracking-tight">
                {selectedPackage ? "Inquiry for " + selectedPackage.name : "Send Inquiry"}
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-400 font-bold mt-2 text-sm">
              {selectedPackage ? `Get details for this plan` : `Contact ${contractor.name} for your project`}
            </p>
            <div className="absolute top-6 right-6 cursor-pointer" onClick={() => setIsDialogOpen(false)}>
              <X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
            </div>
          </div>

          <form onSubmit={onInquirySubmit} className="p-8 space-y-6 bg-white">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Your Name</p>
              <Input 
                placeholder="John Doe" 
                className="h-12 px-4 rounded-xl bg-gray-50 border-gray-200 text-base font-bold" 
                value={formData.senderName}
                onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                required 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Email Address</p>
                <Input 
                  type="email"
                  placeholder="john@example.com" 
                  className="h-12 px-4 rounded-xl bg-gray-50 border-gray-200 text-base font-bold" 
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({...formData, senderEmail: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">WhatsApp Number</p>
                <Input 
                  placeholder="9998887776" 
                  className="h-12 px-4 rounded-xl bg-gray-50 border-gray-200 text-base font-bold" 
                  value={formData.senderWhatsapp}
                  onChange={(e) => setFormData({...formData, senderWhatsapp: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Your Message</p>
              <Textarea 
                placeholder="How can we help you?" 
                className="min-h-[120px] p-4 rounded-xl bg-gray-50 border-gray-200 text-base font-bold" 
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                required 
              />
            </div>
            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-lg font-extrabold shadow-md flex gap-2"
            >
              {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : <>Send Inquiry <Send className="w-5 h-5" /></>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ContractorProfilePage;