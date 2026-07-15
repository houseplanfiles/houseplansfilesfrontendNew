"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import {
  createStandardRequest,
  resetActionStatus,
} from "@/lib/features/standardRequest/standardRequestSlice";

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

const BookingPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { actionStatus, error } = useSelector(
    (state: RootState) => state.standardRequests
  );

  const searchParams = useSearchParams();
  const packageName = searchParams.get("packageName") || "Consultation Service";
  const packageUnit = searchParams.get("packageUnit") || "";
  const packagePrice = searchParams.get("packagePrice") || "";

  const [formData, setFormData] = useState({
    name: "",
    plotSize: "",
    floor: "",
    whatsapp: "",
    city: "",
    spaceType: "Residential",
    area: "",
    style: "",
    details: "",
    category: "",
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestData = {
      packageName,
      name: formData.name,
      whatsapp: formData.whatsapp,
      city: formData.city,
      totalArea: Number(formData.area),
      projectDetails: formData.details,
      plotSize: formData.plotSize,
      floors: formData.floor,
      spaceType: formData.spaceType,
      preferredStyle: formData.style,
      ratePlan: `${packagePrice} ${packageUnit}`,
      category: formData.category,
    };

    dispatch(createStandardRequest(requestData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Thank you for your inquiry! Our team will contact you shortly."
      );
      dispatch(resetActionStatus());
      router.push("/");
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Submission failed. Please try again.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, router]);

  return (
    <>
      <Navbar />
      <main className="bg-soft-teal py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-xl shadow-xl max-w-2xl mx-auto">
            <div className="p-6 border-b text-center">
              <h1 className="text-3xl font-bold text-foreground">
                Request a Consultation
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
                  <Label htmlFor="name">Name*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp / Mobile No.*</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      placeholder="10-digit number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City*</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Your city"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plotSize">Plot Size</Label>
                    <Input
                      id="plotSize"
                      value={formData.plotSize}
                      onChange={handleChange}
                      placeholder="e.g., 30x50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Total Area (sq.ft.)*</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 1500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="floor">Floors</Label>
                  <Input
                    id="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    placeholder="e.g., Ground, G+1"
                  />
                </div>

                <div>
                  <Label>Space Type*</Label>
                  <RadioGroup
                    defaultValue="Residential"
                    value={formData.spaceType}
                    onValueChange={handleRadioChange}
                    className="flex items-center space-x-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Residential" id="r1" />
                      <Label htmlFor="r1">Residential</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Commercial" id="r2" />
                      <Label htmlFor="r2">Commercial</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="style">Preferred Style (Optional)</Label>
                  <Input
                    id="style"
                    value={formData.style}
                    onChange={handleChange}
                    placeholder="e.g., Modern, Traditional"
                  />
                </div>

                <div>
                  <Label htmlFor="details">Project Details*</Label>
                  <Textarea
                    id="details"
                    value={formData.details}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tell us more about your requirements..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary mt-4 text-lg py-3"
                  disabled={actionStatus === "loading"}
                >
                  {actionStatus === "loading" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Request
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

export default BookingPage;