"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
type AppDispatch = typeof store.dispatch;
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { registerUser, resetActionStatus } from "@/lib/features/users/userSlice";

const userRoles = [
  { id: "user", label: "Register as a Home owner" },
  { id: "professional", label: "Register as a Architect, engineer, interior designer" },
  { id: "seller", label: "Register as a manufacturer, supplier or Shop" },
  { id: "Contractor", label: "Register as a Contractor" },
];

const professionalSubRoles = [
  "Architect", "Civil Design Engineer", "Structure Engineer",
  "Interior Designer", "Site Engineer", "MEP Consultant", "Vastu Consultant",
];

const contractorProfessions = [
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
  "Carpenter",
  "Glass Fabricator",
  "Labour Contractor",
  "Turnkey Contractor"
];

const materialTypes = [
  "Cement & Concrete", "Bricks & Blocks", "Steel & Rebar", "Paints",
  "Electricals", "Plumbing", "Interior Design Materials", "Construction Machinery", "Other",
];

const experienceLevels = ["0-2 Years", "2-5 Years", "5-10 Years", "10+ Years"];

const RegisterClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const dispatch = useDispatch();
  const router = useRouter();

  const { userInfo, actionStatus, error } = useSelector((state: RootState) => state.user);

  const defaultFormData = {
    role: "user", email: "", password: "", phone: "", name: "",
    profession: "", businessName: "", address: "", city: "", pincode: "", materialType: "", category: "",
    companyName: "", experience: "", bankAccountNumber: "", bankName: "", businessType: "Both",
    ifscCode: "", upiId: "", gstNumber: "", natureOfBusiness: "",
    businessAddress: "", qualification: "", skills: "", serviceTypes: [] as string[],
    charges: "", photo: null as File | null, businessCertification: null as File | null,
    shopImage: null as File | null, portfolio: null as File | null,
  };

  const [formData, setFormData] = useState(defaultFormData);
  const isLoading = actionStatus === "loading";

  useEffect(() => {
    if (actionStatus === "failed" && error) {
      toast.error(String(error));
      dispatch(resetActionStatus());
    }
    if (actionStatus === "succeeded" && userInfo) {
      dispatch(resetActionStatus());
      switch (userInfo.role) {
        case "admin":
          toast.success("Admin registration successful! Redirecting...");
          setTimeout(() => router.push("/admin"), 1000);
          break;
        case "professional":
          toast.success("Professional registration successful! Your account is under review.");
          setTimeout(() => router.push("/login"), 2000);
          break;
        case "seller":
          toast.success("Material Seller registration successful! Your account is under review.");
          setTimeout(() => router.push("/login"), 2000);
          break;
        default:
          toast.success("Registration successful! Redirecting...");
          setTimeout(() => router.push("/login"), 1000);
      }
    }
  }, [actionStatus, userInfo, error, router, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.files![0] }));
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setFormData({ ...defaultFormData, role: value, email: formData.email, password: formData.password });
  };

  const handleServiceTypeChange = (type: string) => {
    setFormData((prev) => {
      const current = prev.serviceTypes;
      return { ...prev, serviceTypes: current.includes(type) ? current.filter((t) => t !== type) : [...current, type] };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    for (const key in formData) {
      const value = formData[key as keyof typeof formData];
      if (value) {
        if (key === "serviceTypes" && Array.isArray(value)) {
          dataToSubmit.append(key, JSON.stringify(value));
        } else {
          dataToSubmit.append(key, value as string | Blob);
        }
      }
    }
    (dispatch as AppDispatch)(registerUser(dataToSubmit));
  };

  const renderRoleSpecificFields = () => {
    const motionProps = {
      key: selectedRole,
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.3 },
    };

    switch (selectedRole) {
      case "user":
      case "admin":
        return (
          <motion.div {...motionProps} className="space-y-5">
            <div><Label htmlFor="name">Full Name*</Label><Input id="name" required value={formData.name} onChange={handleChange} /></div>
            <div><Label htmlFor="phone">Phone Number*</Label><Input id="phone" type="tel" required value={formData.phone} onChange={handleChange} /></div>
          </motion.div>
        );

      case "professional":
        return (
          <motion.div {...motionProps} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Full Name*</Label><Input id="name" required value={formData.name} onChange={handleChange} placeholder="Enter your full name" /></div>
              <div><Label>Company Name (Optional)</Label><Input id="companyName" value={formData.companyName} onChange={handleChange} placeholder="Enter company name" /></div>
            </div>
            <div><Label>Phone*</Label><Input id="phone" type="tel" required value={formData.phone} onChange={handleChange} /></div>
            <div>
              <Label>Profession*</Label>
              <Select onValueChange={(v) => handleSelectChange(v, "profession")} value={formData.profession} required>
                <SelectTrigger><SelectValue placeholder="Choose profession" /></SelectTrigger>
                <SelectContent>{professionalSubRoles.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>City*</Label><Input id="city" required value={formData.city} onChange={handleChange} placeholder="Your city" /></div>
              <div><Label>Qualification (Optional)</Label><Input id="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. B.Arch, M.Tech" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Experience*</Label>
                <Select onValueChange={(v) => handleSelectChange(v, "experience")} value={formData.experience} required>
                  <SelectTrigger><SelectValue placeholder="Select experience" /></SelectTrigger>
                  <SelectContent>{experienceLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Consultation Charges*</Label><Input id="charges" required value={formData.charges} onChange={handleChange} placeholder="e.g. ₹5,000 or ₹50/sqft" /></div>
            </div>
            <div><Label>Skills (Comma separated)*</Label><Input id="skills" required value={formData.skills} onChange={handleChange} placeholder="e.g. AutoCAD, Interior Design..." /></div>
            <div><Label>Office / Contact Address*</Label><Textarea id="address" required value={formData.address} onChange={handleChange} placeholder="Full address" /></div>
            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold mb-4 text-primary">💳 Bank & Payment Details (Optional)</h3>
              <div className="space-y-4">
                <div><Label htmlFor="bankName">Bank Name</Label><Input id="bankName" placeholder="e.g. HDFC Bank, SBI" value={formData.bankName} onChange={handleChange} /></div>
                <div><Label htmlFor="bankAccountNumber">Bank Account Number</Label><Input id="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} placeholder="Enter your account number" /></div>
                <div><Label htmlFor="ifscCode">IFSC Code</Label><Input id="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="e.g., SBIN0001234" style={{ textTransform: "uppercase" }} /></div>
                <div><Label htmlFor="upiId">UPI ID</Label><Input id="upiId" value={formData.upiId} onChange={handleChange} placeholder="yourname@paytm" /></div>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold mb-4 text-primary">📄 Portfolio & Documents</h3>
              <div className="space-y-4">
                <div><Label htmlFor="portfolio">Portfolio PDF (Optional)</Label><Input id="portfolio" type="file" accept=".pdf" onChange={handleFileChange} /></div>
                <div><Label htmlFor="businessCertification">Qualification Certification (Optional)</Label><Input id="businessCertification" type="file" accept="image/*,.pdf" onChange={handleFileChange} /></div>
                <div><Label htmlFor="shopImage">Shop/Office Image (Optional)</Label><Input id="shopImage" type="file" accept="image/*" onChange={handleFileChange} /></div>
              </div>
            </div>
          </motion.div>
        );

      case "seller":
        return (
          <motion.div {...motionProps} className="space-y-5">
            <div><Label>Business Name*</Label><Input id="businessName" required value={formData.businessName} onChange={handleChange} /></div>
            <div><Label>Phone*</Label><Input id="phone" type="tel" required value={formData.phone} onChange={handleChange} /></div>
            <div><Label>Address*</Label><Textarea id="address" required value={formData.address} onChange={handleChange} /></div>
            <div><Label>City*</Label><Input id="city" required value={formData.city} onChange={handleChange} /></div>
            <div><Label>Pincode*</Label><Input id="pincode" required value={formData.pincode} onChange={handleChange} /></div>
            <div>
              <Label>Business Category*</Label>
              <Select onValueChange={(v) => handleSelectChange(v, "businessType")} value={formData.businessType} required>
                <SelectTrigger><SelectValue placeholder="Select Business Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Both">Manufacturer &amp; Supplier Both</SelectItem>
                  <SelectItem value="Retail">Retail Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category*</Label>
              <Select onValueChange={(v) => handleSelectChange(v, "category")} value={formData.category} required>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  {[
                    "Building Material",
                    "Cement & Concrete",
                    "Steel & Iron",
                    "Bricks & Blocks",
                    "Tiles & Flooring",
                    "Electrical Material",
                    "Plumbing Material",
                    "Paint & Coatings",
                    "Glass & Windows",
                    "Doors & Frames",
                    "Modular Kitchen",
                    "Sanitary & Bath",
                    "Solar & Renewable Energy",
                    "Home Decor",
                    "Furniture",
                    "Chemical Product",
                    "Machinery",
                    "Tools & Equipment",
                    "Safety & PPE",
                    "Hardware & Fasteners",
                  ].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>GST Number*</Label><Input id="gstNumber" required value={formData.gstNumber} onChange={handleChange} placeholder="Enter GSTIN" /></div>
            <div><Label>Business Address*</Label><Textarea id="businessAddress" required value={formData.businessAddress} onChange={handleChange} /></div>
            <div><Label htmlFor="businessCertification">Business License / Certification*</Label><Input id="businessCertification" type="file" accept="image/*,.pdf" required onChange={handleFileChange} /></div>
            <div><Label htmlFor="photo">Profile/Store Image (Optional)</Label><Input id="photo" type="file" accept="image/*" onChange={handleFileChange} /></div>
          </motion.div>
        );

      case "Contractor":
        return (
          <motion.div {...motionProps} className="space-y-5">
            <div><Label>Full Name*</Label><Input id="name" required value={formData.name} onChange={handleChange} /></div>
            <div><Label>Company Name*</Label><Input id="companyName" required value={formData.companyName} onChange={handleChange} /></div>
            <div><Label>Phone*</Label><Input id="phone" type="tel" required value={formData.phone} onChange={handleChange} /></div>
            <div>
              <Label>Profession*</Label>
              <Select onValueChange={(v) => handleSelectChange(v, "profession")} value={formData.profession} required>
                <SelectTrigger><SelectValue placeholder="Select Profession" /></SelectTrigger>
                <SelectContent>{contractorProfessions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Experience*</Label>
              <Select onValueChange={(v) => handleSelectChange(v, "experience")} value={formData.experience} required>
                <SelectTrigger><SelectValue placeholder="Select your experience level" /></SelectTrigger>
                <SelectContent>{experienceLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Address*</Label><Textarea id="address" required value={formData.address} onChange={handleChange} /></div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-primary">Services Offered*</Label>
              <div className="grid grid-cols-2 gap-4">
                {["NEW CONSTRUCTION", "RENOVATION"].map((type) => (
                  <div key={type} onClick={() => handleServiceTypeChange(type)} className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.serviceTypes.includes(type) ? "bg-orange-50 border-orange-500 text-orange-700 shadow-sm" : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200"}`}>
                    <span className="text-xs font-bold">{type}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.serviceTypes.includes(type) ? "bg-orange-500 border-orange-500 text-white" : "border-gray-300"}`}>
                      {formData.serviceTypes.includes(type) && <CheckCircle size={12} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div><Label>City*</Label><Input id="city" required value={formData.city} onChange={handleChange} /></div>
            <div><Label>GST Number (Optional)</Label><Input id="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="Enter GSTIN" /></div>
            <div><Label htmlFor="businessCertification">Business Certification (Optional)</Label><Input id="businessCertification" type="file" accept="image/*,.pdf" onChange={handleFileChange} /></div>
            <div><Label htmlFor="photo">Profile Picture (DP)*</Label><Input id="photo" type="file" accept="image/*" required onChange={handleFileChange} /></div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-soft-teal p-4 py-12">
        <div className="bg-card text-foreground p-8 sm:p-10 rounded-2xl shadow-2xl max-w-lg w-full">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <fieldset className="space-y-3">
              <legend className="sr-only">Select your registration type</legend>
              {userRoles.map((role) => (
                <div key={role.id}>
                  <input type="radio" id={`${role.id}-radio`} name="user-role" value={role.id} className="sr-only" checked={selectedRole === role.id} onChange={(e) => handleRoleChange(e.target.value)} />
                  <label htmlFor={`${role.id}-radio`} className={`flex items-center justify-between w-full p-4 rounded-lg cursor-pointer border-2 transition-all duration-300 ${selectedRole === role.id ? "bg-accent text-accent-foreground border-transparent shadow-md" : "bg-input border-border hover:border-primary/50"}`}>
                    <span className="font-semibold">{role.label}</span>
                    {selectedRole === role.id && <CheckCircle size={20} />}
                  </label>
                </div>
              ))}
            </fieldset>

            <AnimatePresence mode="wait">{renderRoleSpecificFields()}</AnimatePresence>

            <div><Label htmlFor="email">Email address*</Label><Input type="email" id="email" required value={formData.email} onChange={handleChange} /></div>
            <div>
              <Label htmlFor="password">Password*</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} id="password" required value={formData.password} onChange={handleChange} className="pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center pt-4">
              By registering, you agree to our{" "}
              <Link href="/terms-and-conditions" className="text-primary hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            <Button type="submit" className="w-full text-base font-bold py-3 h-12 btn-primary" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterClient;
