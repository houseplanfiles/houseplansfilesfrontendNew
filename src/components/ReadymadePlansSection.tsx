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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, FileText, CheckCircle2, User, Phone, MapPin, Grid, Layers, Compass } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SERVICE_CATEGORIES = [
  { value: "Architect / Civil engineer / Interior Designer", label: "Architect / Civil engineer / Interior Designer (आर्किटेक्ट / सिविल इंजीनियर / इंटीरियर डिज़ाइनर)" },
  { value: "Civil Construction", label: "Civil Construction (सिविल कंस्ट्रक्शन / निर्माण)" },
  { value: "Interior Contractor", label: "Interior Contractor (इंटीरियर ठेकेदार)" },
  { value: "Marketplace / Material / Procurement Requirements", label: "Marketplace / Material Requirements (सामग्री की आवश्यकता)" },
  { value: "Electrical Contractor", label: "Electrical Contractor (बिजली ठेकेदार)" },
  { value: "Plumbing Contractor", label: "Plumbing Contractor (नलसाजी ठेकेदार)" },
  { value: "Tiles & Granite Contractor", label: "Tiles & Granite Contractor (टाइल्स और ग्रेनाइट ठेकेदार)" },
  { value: "Painting & Waterproofing Contractor", label: "Painting & Waterproofing Contractor (पेंटिंग और वॉटरप्रूफिंग)" },
  { value: "Swimming Pool Contractors", label: "Swimming Pool Contractors (स्विमिंग पूल ठेकेदार)" },
  { value: "HVAC Contractors", label: "HVAC Contractors (एचवीएसी ठेकेदार)" },
  { value: "Landscaping & Garden Contractor", label: "Landscaping & Garden Contractor (भूनिर्माण और उद्यान ठेकेदार)" },
  { value: "Pest Control", label: "Pest Control (कीट नियंत्रण)" },
  { value: "Pre Engineering Board Services / PEB", label: "Pre Engineering Board Services / PEB (पीईबी सेवाएं)" },
  { value: "Pre Fabricated House", label: "Pre Fabricated House (पूर्वनिर्मित घर)" },
  { value: "Manpower Supply", label: "Manpower Supply (जनशक्ति की आपूर्ति)" },
  { value: "Modular Kitchen Services", label: "Modular Kitchen Services (मॉड्यूलर किचन सेवाएं)" },
  { value: "Lift Services", label: "Lift Services (लिफ्ट सेवाएं)" },
  { value: "Building Inspection", label: "Building Inspection (भवन निरीक्षण)" },
  { value: "Solar Rooftop Panel Services", label: "Solar Rooftop Panel Services (सौर रूफटॉप पैनल सेवाएं)" },
  { value: "Other", label: "Other (अन्य)" }
];

const ReadymadePlansSection = () => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.standardRequests
  );

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    city: "",
    category: "",
    plotSize: "",
    area: "",
    floor: "",
    spaceType: "Residential",
    style: "",
    details: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, spaceType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!formData.whatsapp.trim()) {
      toast.error("Please enter your WhatsApp number.");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city.");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a service category.");
      return;
    }
    if (!formData.area.trim()) {
      toast.error("Please enter total area.");
      return;
    }
    if (!formData.details.trim()) {
      toast.error("Please enter project details.");
      return;
    }

    const payload = {
      packageName: "Home Page Inquiry",
      name: formData.name,
      whatsapp: formData.whatsapp,
      city: formData.city,
      category: formData.category,
      plotSize: formData.plotSize,
      area: formData.area,
      floor: formData.floor,
      spaceType: formData.spaceType,
      style: formData.style,
      projectDetails: formData.details,
    };

    dispatch(createStandardRequest(payload));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Request submitted successfully!");
      setFormData({
        name: "",
        whatsapp: "",
        city: "",
        category: "",
        plotSize: "",
        area: "",
        floor: "",
        spaceType: "Residential",
        style: "",
        details: "",
      });
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(error || "Submission failed. Please try again.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-soft-teal/20 via-background to-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Premium Marketing Info */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-3">
                <FileText size={16} />
                <span>Request Board</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
                Write Your <br className="hidden md:inline" />
                <span className="text-orange-600">Requirements Here</span>
              </h2>
              <div className="h-1 w-20 bg-orange-500 rounded-full mt-4"></div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              Looking for customized floor plans, civil construction, interior design, or other specialized services? Share your details and requirements with us. Our expert team and verified professionals will get in touch with you shortly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4 pt-4"
            >
              {[
                "⚡ Quick response within 24 hours",
                "📐 Direct connection with verified Architects & Interior Designers",
                "🏢 Residential & Commercial project expertise",
                "🗺️ Vastu-compliant layouts & construction planning",
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 text-foreground font-medium text-base">
                  <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                  <span>{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Premium Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Grid for Name & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="name" className="text-foreground font-semibold flex items-center gap-1.5 mb-1.5">
                        <User size={16} className="text-orange-500" />
                        Name*
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="h-12 border-input rounded-xl focus-visible:ring-orange-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp" className="text-foreground font-semibold flex items-center gap-1.5 mb-1.5">
                        <Phone size={16} className="text-orange-500" />
                        WhatsApp / Mobile No.*
                      </Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        required
                        placeholder="10-digit number"
                        className="h-12 border-input rounded-xl focus-visible:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Grid for City & Service Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="city" className="text-foreground font-semibold flex items-center gap-1.5 mb-1.5">
                        <MapPin size={16} className="text-orange-500" />
                        City*
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Your city"
                        className="h-12 border-input rounded-xl focus-visible:ring-orange-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-foreground font-semibold flex items-center gap-1.5 mb-1.5">
                        <Grid size={16} className="text-orange-500" />
                        Service Category*
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                        required
                      >
                        <SelectTrigger className="w-full h-12 border-input rounded-xl bg-background focus:ring-orange-500">
                          <SelectValue placeholder="Choose service category" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {SERVICE_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Grid for Plot Size & Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="plotSize" className="text-foreground font-semibold flex items-center gap-1.5 mb-1.5">
                        <Compass size={16} className="text-orange-500" />
                        Plot Size (Optional)
                      </Label>
                      <Input
                        id="plotSize"
                        value={formData.plotSize}
                        onChange={handleChange}
                        placeholder="e.g., G+1, 30x50"
                        className="h-12 border-input rounded-xl focus-visible:ring-orange-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="area" className="text-foreground font-semibold flex items-center gap-1.5 mb-1.5">
                        <Layers size={16} className="text-orange-500" />
                        Total Area (sq.ft.)*
                      </Label>
                      <Input
                        id="area"
                        type="number"
                        value={formData.area}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 1500"
                        className="h-12 border-input rounded-xl focus-visible:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Grid for Floor & Preferred Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="floor" className="text-foreground font-semibold mb-1.5 block">
                        Floors (Optional)
                      </Label>
                      <Input
                        id="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        placeholder="e.g., Ground, G+1, G+2"
                        className="h-12 border-input rounded-xl focus-visible:ring-orange-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="style" className="text-foreground font-semibold mb-1.5 block">
                        Preferred Style (Optional)
                      </Label>
                      <Input
                        id="style"
                        value={formData.style}
                        onChange={handleChange}
                        placeholder="e.g., Modern, Traditional"
                        className="h-12 border-input rounded-xl focus-visible:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Space Type */}
                  <div>
                    <Label className="text-foreground font-semibold mb-2 block">Space Type*</Label>
                    <RadioGroup
                      defaultValue="Residential"
                      value={formData.spaceType}
                      onValueChange={handleRadioChange}
                      className="flex items-center space-x-6 pt-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Residential" id="space-r1" className="text-orange-500 focus:ring-orange-500" />
                        <Label htmlFor="space-r1" className="cursor-pointer font-medium">Residential</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Commercial" id="space-r2" className="text-orange-500 focus:ring-orange-500" />
                        <Label htmlFor="space-r2" className="cursor-pointer font-medium">Commercial</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Project Details */}
                  <div>
                    <Label htmlFor="details" className="text-foreground font-semibold mb-1.5 block">
                      Project Details & Requirements*
                    </Label>
                    <Textarea
                      id="details"
                      value={formData.details}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Write your requirements here (e.g., 3 BHK, double height hall, modern elevation, material specs, etc.)..."
                      className="border-input rounded-xl focus-visible:ring-orange-500 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-14 text-lg font-bold shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition-all duration-200"
                    disabled={actionStatus === "loading"}
                  >
                    {actionStatus === "loading" && (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    )}
                    Post Requirements
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ReadymadePlansSection;
