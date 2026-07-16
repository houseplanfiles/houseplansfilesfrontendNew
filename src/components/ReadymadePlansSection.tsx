"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import {
  createStandardRequest,
  resetActionStatus,
} from "@/lib/features/standardRequest/standardRequestSlice";
import { motion } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Home,
  Compass,
  HardHat,
  Zap,
  Droplet,
  Grid,
  Paintbrush,
  Waves,
  Building2,
  Layers,
  Bug,
  Leaf,
  Users,
  ChefHat,
  ArrowUpDown,
  Boxes,
  ClipboardCheck,
  Sun,
  Wind,
  Hammer,
} from "lucide-react";

// The 20 options with their display labels, matching backend categories, and icons
const OPTIONS = [
  { id: 1, label: "House Planning", category: "Architect / Civil engineer / Interior Designer", icon: Home, color: "bg-blue-500/10 text-blue-600" },
  { id: 2, label: "Architect", category: "Architect / Civil engineer / Interior Designer", icon: Compass, color: "bg-indigo-500/10 text-indigo-600" },
  { id: 3, label: "Contractor", category: "Civil Construction", icon: HardHat, color: "bg-amber-500/10 text-amber-600" },
  { id: 4, label: "Electrical Contractor", category: "Electrical Contractor", icon: Zap, color: "bg-yellow-500/10 text-yellow-600" },
  { id: 5, label: "Plumbing Contractor", category: "Plumbing Contractor", icon: Droplet, color: "bg-sky-500/10 text-sky-600" },
  { id: 6, label: "Tiles Contractor", category: "Tiles & Granite Contractor", icon: Grid, color: "bg-teal-500/10 text-teal-600" },
  { id: 7, label: "Painting Contractor", category: "Painting & Waterproofing Contractor", icon: Paintbrush, color: "bg-rose-500/10 text-rose-600" },
  { id: 8, label: "Swimming Pool Contractor", category: "Swimming Pool Contractors", icon: Waves, color: "bg-cyan-500/10 text-cyan-600" },
  { id: 9, label: "Pre Engineered Building Contractor", category: "Pre Engineering Board Services / PEB", icon: Building2, color: "bg-emerald-500/10 text-emerald-600" },
  { id: 10, label: "Pre Fabricated Building", category: "Pre Fabricated House", icon: Layers, color: "bg-violet-500/10 text-violet-600" },
  { id: 11, label: "Pest Control", category: "Pest Control", icon: Bug, color: "bg-red-500/10 text-red-600" },
  { id: 12, label: "Landscaping or Garden Contractor", category: "Landscaping & Garden Contractor", icon: Leaf, color: "bg-green-500/10 text-green-600" },
  { id: 13, label: "Manpower Supply", category: "Manpower Supply", icon: Users, color: "bg-fuchsia-500/10 text-fuchsia-600" },
  { id: 14, label: "Modular Kitchen Services", category: "Modular Kitchen Services", icon: ChefHat, color: "bg-orange-500/10 text-orange-600" },
  { id: 15, label: "Lift Installation Services", category: "Lift Services", icon: ArrowUpDown, color: "bg-purple-500/10 text-purple-600" },
  { id: 16, label: "Pre Cast Materials", category: "Marketplace / Material / Procurement Requirements", icon: Boxes, color: "bg-stone-500/10 text-stone-600" },
  { id: 17, label: "Building Inspection Services", category: "Building Inspection", icon: ClipboardCheck, color: "bg-slate-500/10 text-slate-600" },
  { id: 18, label: "Solar Panel Contractor", category: "Solar Rooftop Panel Services", icon: Sun, color: "bg-amber-600/10 text-amber-700" },
  { id: 19, label: "HVAC Contractor", category: "HVAC Contractors", icon: Wind, color: "bg-blue-600/10 text-blue-700" },
  { id: 20, label: "Building Material Services", category: "Marketplace / Material / Procurement Requirements", icon: Hammer, color: "bg-orange-600/10 text-orange-700" },
];

const ReadymadePlansSection = () => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.standardRequests
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<typeof OPTIONS[0] | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    whatsapp: "",
    details: "",
  });

  const handleOpenForm = (option: typeof OPTIONS[0]) => {
    setSelectedOption(option);
    setIsOpen(true);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setSelectedOption(null);
    setFormData({
      name: "",
      city: "",
      whatsapp: "",
      details: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city.");
      return;
    }
    if (!formData.whatsapp.trim()) {
      toast.error("Please enter your WhatsApp or Mobile number.");
      return;
    }
    if (!formData.details.trim()) {
      toast.error("Please enter your requirements.");
      return;
    }

    const payload = {
      packageName: `Inquiry: ${selectedOption?.label}`,
      name: formData.name,
      city: formData.city,
      whatsapp: formData.whatsapp,
      category: selectedOption?.category || "Other",
      projectDetails: formData.details,
      spaceType: "Residential", // Default
      totalArea: 1, // Default (using 1 instead of 0 to bypass falsy !totalArea validation in legacy backend)
    };

    dispatch(createStandardRequest(payload));
  };

  const handleWhatsAppRedirect = () => {
    if (!selectedOption) return;
    
    const message = `Hello, I want to inquire about *${selectedOption.label}* services.
*Name:* ${formData.name || "N/A"}
*City:* ${formData.city || "N/A"}
*WhatsApp/Mobile:* ${formData.whatsapp || "N/A"}
*Requirements:* ${formData.details || "N/A"}`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919755248864?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Request submitted successfully!");
      handleCloseForm();
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(error || "Submission failed. Please try again.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              What are you <span className="text-orange-600">looking for?</span>
            </h2>
            <div className="h-1 w-24 bg-orange-500 rounded-full mx-auto mt-4 mb-4"></div>
            <p className="text-muted-foreground text-lg">
              Select a service below to post your requirements and connect with verified experts instantly.
            </p>
          </motion.div>
        </div>

        {/* 20 Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {OPTIONS.map((opt, idx) => {
            const IconComponent = opt.icon;
            return (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => handleOpenForm(opt)}
                className="bg-card border border-border/80 hover:border-orange-500/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200 ${opt.color}`}>
                  <IconComponent size={28} />
                </div>
                <h3 className="text-sm md:text-base font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[40px] flex items-center justify-center">
                  {opt.label}
                </h3>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Inquiry Dialog Form */}
      <Dialog open={isOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              Inquire for <span className="text-orange-600">{selectedOption?.label}</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Please enter your details below. Our team will get back to you shortly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            
            {/* Name field */}
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Your Name*
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="mt-1 h-11 rounded-xl border-input focus-visible:ring-orange-500"
              />
            </div>

            {/* City field */}
            <div>
              <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                City*
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter your city"
                className="mt-1 h-11 rounded-xl border-input focus-visible:ring-orange-500"
              />
            </div>

            {/* WhatsApp/Mobile Number field */}
            <div>
              <Label htmlFor="whatsapp" className="text-sm font-semibold text-gray-700">
                WhatsApp / Mobile No.*
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                placeholder="Enter 10-digit number"
                className="mt-1 h-11 rounded-xl border-input focus-visible:ring-orange-500"
              />
            </div>

            {/* Detail Requirements field */}
            <div>
              <Label htmlFor="details" className="text-sm font-semibold text-gray-700">
                Detail Requirements*
              </Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe your project size, budget, style preference, etc..."
                className="mt-1 rounded-xl border-input focus-visible:ring-orange-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-3">
              <Button
                type="button"
                onClick={handleWhatsAppRedirect}
                className="w-full sm:flex-1 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-xl h-12 text-base font-bold flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Contact WhatsApp
              </Button>
              <Button
                type="submit"
                disabled={actionStatus === "loading"}
                className="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-12 text-base font-bold flex items-center justify-center"
              >
                {actionStatus === "loading" && (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                )}
                Submit Inquiry
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReadymadePlansSection;
