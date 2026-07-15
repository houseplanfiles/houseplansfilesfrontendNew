"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import {
  createPremiumRequest,
  resetActionStatus,
} from "@/lib/features/premiumRequest/premiumRequestSlice";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
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
  { value: "Marketplace / Material / Procurement Requirements", label: "Marketplace / Material / Procurement Requirements (मार्केटप्लेस / सामग्री / खरीद आवश्यकताएं)" },
  { value: "Electrical Contractor", label: "Electrical Contractor (इलेक्ट्रिकल ठेकेदार)" },
  { value: "Plumbing Contractor", label: "Plumbing Contractor (प्लंबिंग ठेकेदार)" },
  { value: "Tiles & Granite Contractor", label: "Tiles & Granite Contractor (टाइल्स और ग्रेनाइट ठेकेदार)" },
  { value: "Painting & Waterproofing Contractor", label: "Painting & Waterproofing Contractor (पेंटिंग और वॉटरप्रूफिंग ठेकेदार)" },
  { value: "Swimming Pool Contractors", label: "Swimming Pool Contractors (स्विमिंग पूल ठेकेदार)" },
  { value: "HVAC Contractors", label: "HVAC Contractors (एचवीएसी ठेकेदार)" },
  { value: "Landscaping & Garden Contractor", label: "Landscaping & Garden Contractor (छत का बगीचा / भूदृश्य ठेकेदार)" },
  { value: "Pest Control", label: "Pest Control (कीट नियंत्रण)" },
  { value: "Pre Engineering Board Services / PEB", label: "Pre Engineering Board Services / PEB (प्री इंजीनियरिंग बोर्ड सेवाएं / पीईबी)" },
  { value: "Pre Fabricated House", label: "Pre Fabricated House (प्री-फैब्रिकेटेड हाउस)" },
  { value: "Manpower Supply", label: "Manpower Supply (मैनपावर सप्लाई)" },
  { value: "Modular Kitchen Services", label: "Modular Kitchen Services (मॉड्यूलर किचन सेवाएं)" },
  { value: "Lift Services", label: "Lift Services (लिफ्ट सेवाएं)" },
  { value: "Building Inspection", label: "Building Inspection (भवन निरीक्षण)" },
  { value: "Solar Rooftop Panel Services", label: "Solar Rooftop Panel Services (सोलर रूफटॉप पैनल सेवाएं)" },
  { value: "Other", label: "Other (अन्य / अन्य आवश्यकताएं)" }
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  plotSize: string;
  floor: string;
  spaceType: "Residential" | "Commercial";
  area: string;
  style: string;
  details: string;
  category: string;
}

const PremiumBookingPage: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { actionStatus, error } = useSelector(
    (state: RootState) => state.premiumRequests
  );

  const searchParams = useSearchParams();
  const packageName = searchParams.get("packageName") || "Premium Consultation";
  const packageUnit = searchParams.get("packageUnit") || "";
  const packagePrice = searchParams.get("packagePrice") || "";

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    city: "",
    address: "",
    plotSize: "",
    floor: "",
    spaceType: "Residential",
    area: "",
    style: "",
    details: "",
    category: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (value: "Residential" | "Commercial") => {
    setFormData((prev) => ({ ...prev, spaceType: value }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.name.trim() ||
      !formData.whatsapp.trim() ||
      !formData.city.trim() ||
      !formData.area.trim() ||
      !formData.details.trim() ||
      !formData.category.trim()
    ) {
      toast.error("Please fill all required fields marked with *");
      return false;
    }
    if (!/^\d{10}$/.test(formData.whatsapp.replace(/\s+/g, ""))) {
      toast.error("Please enter a valid 10-digit WhatsApp number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const requestData = {
      packageName,
      name: formData.name.trim(),
      whatsapp: formData.whatsapp.replace(/\s+/g, ""),
      city: formData.city.trim(),
      plotSize: formData.plotSize.trim(),
      totalArea: Number(formData.area),
      floors: formData.floor.trim(),
      spaceType: formData.spaceType,
      preferredStyle: formData.style.trim(),
      projectDetails: formData.details.trim(),
      ratePlan: `${packagePrice} ${packageUnit}`,
      category: formData.category,
      ...(formData.email && { email: formData.email.trim() }),
      ...(formData.phone && { phone: formData.phone.trim() }),
      ...(formData.address && { address: formData.address.trim() }),
    };

    try {
      await dispatch(createPremiumRequest(requestData)).unwrap();
    } catch (err) {
      // Error handled in useEffect
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Thank you for your inquiry! Our team will contact you shortly."
      );
      dispatch(resetActionStatus());
      router.replace("/");
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Submission failed. Please try again.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, router]);

  const isLoading = actionStatus === "loading" || isSubmitting;

  return (
    <>
      <Navbar />
      <main className="bg-soft-teal py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-xl shadow-xl max-w-2xl mx-auto">
            <div className="p-6 border-b text-center">
              <h1 className="text-3xl font-bold text-foreground">
                Request a Premium Consultation
              </h1>
              <p className="text-lg text-primary font-semibold mt-1">
                For: {packageName}
              </p>
              {packagePrice && packageUnit && (
                <p className="text-md text-muted-foreground">
                  (Rate: ₹{packagePrice} {packageUnit})
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-foreground border-b pb-2 mb-6">
                  Fill Your Details
                </h3>

                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      placeholder="10-digit WhatsApp number"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Your city"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Select Service Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                    required
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full mt-1.5 h-12 border-input rounded-lg bg-background focus:ring-orange-500">
                      <SelectValue placeholder="Choose a service category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address">Complete Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your complete address"
                    disabled={isLoading}
                  />
                </div>

                <h3 className="text-lg font-semibold text-foreground border-b pb-2 mb-4 mt-8">
                  Project Information
                </h3>

                <div>
                  <Label>Space Type *</Label>
                  <RadioGroup
                    value={formData.spaceType}
                    onValueChange={handleRadioChange}
                    className="flex items-center space-x-4 pt-2"
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Residential" id="residential" />
                      <Label htmlFor="residential">Residential</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Commercial" id="commercial" />
                      <Label htmlFor="commercial">Commercial</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="area">Total Area (sq.ft.) *</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 1500"
                      min="1"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="plotSize">Plot Size</Label>
                    <Input
                      id="plotSize"
                      value={formData.plotSize}
                      onChange={handleChange}
                      placeholder="e.g., 30x50"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="floor">Number of Floors</Label>
                    <Input
                      id="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      placeholder="e.g., Ground, G+1"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="style">Preferred Style</Label>
                    <Input
                      id="style"
                      value={formData.style}
                      onChange={handleChange}
                      placeholder="e.g., Modern, Traditional"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="details">
                    Project Details & Requirements *
                  </Label>
                  <Textarea
                    id="details"
                    value={formData.details}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Please describe your requirements..."
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary mt-6 text-lg py-3"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PremiumBookingPage;