"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "@/components/MotionWrapper";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
type AppDispatch = typeof store.dispatch;
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { registerUser, resetActionStatus } from "@/lib/features/users/userSlice";
import { State, City } from 'country-state-city';
import ReactSelect from 'react-select';

const userRoles = [
  { id: "user", label: "Register as a Home owner" },
  { id: "industrial", label: "Register as Industrial & infra services (PEB, prefab, manpower, machinery)" },
  { id: "professional", label: "Register as architect, engineer....." },
  { id: "other_services", label: "Register in other services (Pest control, fabricator, roofing, flooring)" },
  { id: "Contractor", label: "Register as contractor (Building, interior, electrical.......)" },
  { id: "seller", label: "Register as building material (Manufacturer, supplier, shop)" },
];

const professionalSubRoles = [
  "Architect", "Civil Design Engineer", "Structure Engineer",
  "Interior Designer", "Site Engineer", "MEP Consultant", "Vastu Consultant",
];

const contractorProfessions = [
  {
    category: "Home Designing & Construction",
    professions: ["Building", "Interior", "Electrical", "Plumbing", "Tiles & Granite", "Painting & Waterproofing", "Carpenter", "Swimming Pool"]
  },
  {
    category: "Industrial Construction & Infrastructure",
    professions: ["Pre Engineering Board / PEB", "Pre Fabricated House", "Project Management Consultancy", "Project Manager", "Manpower Supply"]
  },
  {
    category: "Other Services",
    professions: ["Pest Control", "Landscaping & Garden", "Modular Kitchen", "Lift Services", "Solar Rooftop Panel", "HVAC", "Glass Fabricator"]
  },
  {
    category: "Already Registered (Existing)",
    professions: [
      "Civil Construction Contractor", "Interior Contractor", "Electrical Contractor",
      "Plumbing Contractor", "Tiles & Granite Contractor", "Painting & Waterproofing Contractor",
      "Swimming Pool Contractor", "Pre Engineering Board / PEB", "Pre Fabricated House Contractor",
      "Pest Control Contractor", "Landscaping & Garden Contractor", "Manpower Supply",
      "Modular Kitchen Contractor", "Lift Services Contractor", "Project Management Consultancy",
      "Solar Rooftop Panel Contractor", "HVAC Contractor", "Carpenter", "Glass Fabricator",
      "Labour Contractor", "Turnkey Contractor"
    ]
  }
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
    profession: "", businessName: "", address: "", city: "", state: "", pincode: "", materialType: "", category: "",
    companyName: "", experience: "", bankAccountNumber: "", bankName: "", businessType: "Both",
    ifscCode: "", upiId: "", gstNumber: "", natureOfBusiness: "",
    businessAddress: "", qualification: "", skills: "", serviceTypes: [] as string[],
    selectedStates: [] as any[], selectedCities: [] as any[], registrationAmount: 0,
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
          toast.success("Registration successful! Opening your profile...");
          setTimeout(() => router.push("/professional/profile"), 1500);
          break;
        case "Contractor":
          toast.success("Registration successful! Opening your profile...");
          setTimeout(() => router.push("/professional/profile"), 1500);
          break;
        case "seller":
          toast.success("Registration successful! Opening your store profile...");
          setTimeout(() => router.push("/seller/profile"), 1500);
          break;
        default:
          toast.success("Registration successful! Welcome to HousePlanFiles!");
          setTimeout(() => router.push("/dashboard"), 1000);
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
      let value = formData[key as keyof typeof formData];
      if (value !== undefined && value !== null && value !== "") {
        if (key === "role" && (value === "industrial" || value === "other_services")) {
          value = "Contractor";
        }
        if (key === "selectedStates" || key === "selectedCities" || key === "serviceTypes") {
          if (Array.isArray(value) && value.length > 0) {
            dataToSubmit.append(key, JSON.stringify(value));
          }
        } else {
          dataToSubmit.append(key, value as string | Blob);
        }
      }
    }
    (dispatch as AppDispatch)(registerUser(dataToSubmit));
  };

  useEffect(() => {
    if (selectedRole === "industrial") {
      const stateCount = formData.selectedStates.length;
      const cityCount = formData.selectedCities.length;
      setFormData(prev => ({ ...prev, registrationAmount: (stateCount * 9999) + (cityCount * 4999) }));
    } else {
      setFormData(prev => ({ ...prev, registrationAmount: 0 }));
    }
  }, [formData.selectedStates, formData.selectedCities, selectedRole]);

  const renderLocationFields = (isMulti: boolean = false) => {
    const stateOptions = State.getStatesOfCountry('IN').map(s => ({ value: s.isoCode, label: s.name }));
    
    // For single select, let's just load ALL Indian cities.
    // For multi select, if states are selected, load cities for those states. If none, load all.
    let cityOptions: any[] = [];
    if (isMulti && formData.selectedStates && formData.selectedStates.length > 0) {
      formData.selectedStates.forEach((s: any) => {
        cityOptions = [...cityOptions, ...City.getCitiesOfState('IN', s.value).map(c => ({ value: c.name, label: `${c.name} (${s.label})`, stateCode: s.value }))];
      });
    } else {
      cityOptions = (City.getCitiesOfCountry('IN') || []).map(c => ({ value: c.name, label: `${c.name}, ${c.stateCode}` }));
    }

    if (isMulti) {
      return (
        <div className="space-y-4 md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Select States*</Label>
              <ReactSelect 
                isMulti
                options={stateOptions}
                value={formData.selectedStates}
                onChange={(val: any) => setFormData(prev => ({ ...prev, selectedStates: val || [], selectedCities: prev.selectedCities.filter((c:any) => val?.some((s:any) => s.value === c.stateCode)) }))}
                placeholder="Search & select states..."
                className="text-sm"
              />
            </div>
            <div>
              <Label>Select Cities*</Label>
              <ReactSelect 
                isMulti
                options={cityOptions}
                value={formData.selectedCities}
                onChange={(val: any) => setFormData(prev => ({ ...prev, selectedCities: val || [] }))}
                placeholder="Search & select cities..."
                className="text-sm"
              />
            </div>
          </div>
          {formData.registrationAmount > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm font-semibold text-orange-800">Package Amount Calculated:</p>
              <p className="text-2xl font-bold text-orange-600">₹{formData.registrationAmount.toLocaleString()}</p>
              <p className="text-xs text-orange-600/80 mt-1">
                {formData.selectedStates.length} State(s) × ₹9,999 + {formData.selectedCities.length} City(s) × ₹4,999
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="w-full">
        <Label>City*</Label>
        <ReactSelect 
          options={cityOptions}
          value={cityOptions.find(c => c.value === formData.city) || null}
          onChange={(val: any) => setFormData(prev => ({ ...prev, city: val?.value || "" }))}
          placeholder="Search and select city in India..."
          className="text-sm"
        />
      </div>
    );
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
            {renderLocationFields(false)}
            <div><Label>Qualification (Optional)</Label><Input id="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. B.Arch, M.Tech" /></div>
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
            {renderLocationFields(false)}
            <div><Label>Pincode</Label><Input id="pincode" value={formData.pincode} onChange={handleChange} /></div>
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

      case "industrial":
      case "other_services":
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
                <SelectContent>
                  {contractorProfessions.map((group) => (
                    <SelectGroup key={group.category}>
                      <SelectLabel className="text-orange-600 bg-orange-50/50 uppercase tracking-wider text-xs">{group.category}</SelectLabel>
                      {group.professions.map((prof) => (
                        <SelectItem key={prof} value={prof}>
                          {prof}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
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
            {renderLocationFields(selectedRole === "industrial")}
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
        <div className="bg-card text-foreground p-8 sm:p-10 rounded-2xl shadow-2xl max-w-3xl w-full">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <legend className="sr-only">Select your registration type</legend>
              {userRoles.map((role) => (
                <div key={role.id}>
                  <input type="radio" id={`${role.id}-radio`} name="user-role" value={role.id} className="sr-only" checked={selectedRole === role.id} onChange={(e) => handleRoleChange(e.target.value)} />
                  <label htmlFor={`${role.id}-radio`} className={`flex items-center justify-between w-full p-4 h-full rounded-lg cursor-pointer border-2 transition-all duration-300 ${selectedRole === role.id ? "bg-accent text-accent-foreground border-transparent shadow-md" : "bg-input border-border hover:border-primary/50"}`}>
                    <span className="font-semibold">{role.label}</span>
                    {selectedRole === role.id && <CheckCircle size={20} />}
                  </label>
                </div>
              ))}
            </fieldset>

            <AnimatePresence>{renderRoleSpecificFields()}</AnimatePresence>

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
