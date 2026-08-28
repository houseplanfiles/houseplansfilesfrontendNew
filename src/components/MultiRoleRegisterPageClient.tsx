"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useState, useEffect } from "react";

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { State, City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable';
import { Textarea } from "@/components/ui/textarea";
import {
  registerUser,
  resetActionStatus,
} from "@/lib/features/users/userSlice";
import axios from "axios";
import useExternalScripts from "@/hooks/usePaymentGateway";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";

const userRoles = [
  { id: "user", label: "Register as a Home owner" },
  { id: "professional", label: "Register as a Architect, engineer, interior designer" },
  { id: "seller", label: "Register as a manufacturer, supplier or Shop" },
  { id: "Contractor", label: "Register as a Contractor" },
  { id: "home_designing", label: "Register for Home Designing & Construction Services" },
  { id: "industrial", label: "Register for Industrial Construction & Infrastructure Services" },
  { id: "other_services", label: "Register for Other Services" },
];

const professionalSubRoles = [
  "Architect",
  "Civil Design Engineer",
  "Structure Engineer",
  "Interior Designer",
  "Site Engineer",
  "MEP Consultant",
  "Vastu Consultant",
];

const contractorProfessions = [
  "Civil Construction Contractor", "Interior Contractor", "Electrical Contractor",
  "Plumbing Contractor", "Tiles & Granite Contractor", "Painting & Waterproofing Contractor",
  "Swimming Pool Contractor", "Pre Engineering Board / PEB", "Pre Fabricated House Contractor",
  "Pest Control Contractor", "Landscaping & Garden Contractor"
];

const homeDesigningProfessions = [
  "Architects & engineers", "Interior designer", "Contractors Building & Interior", "Electrical Contractor", "Plumbing Contractor", 
  "Tiles & Stone Contractor", "Painting Contractor", "Carpenter Services", "False Ceiling Contractor", "Building material"
];

const industrialProfessions = [
  "Pre Engineering Buildings", "Pre Fabricated Buildings", "Pre Cast Concrete Material", "Machinery Services", "Manpower Supply", "Building Inspection Services", "Bulk Building Material Services"
];

const otherServicesProfessions = [
  "Pest Control Service", "HVAC System Installation", "Lift Installation Services", "Solar Panel Installation", 
  "Home Automation", "Water Proofing Installation", "Garden & Landscaping Contractor", "Modular Kitchen Services", "Swimming Pool Contractor", "Fire safety services", "Fabricator"
];

const materialTypes = [
  "Cement & Concrete",
  "Bricks & Blocks",
  "Steel & Rebar",
  "Paints",
  "Electricals",
  "Plumbing",
  "Interior Design Materials",
  "Construction Machinery",
  "Other",
];

const experienceLevels = ["0-2 Years", "2-5 Years", "5-10 Years", "10+ Years"];

const cityOptions = (City.getCitiesOfCountry("IN") || []).map(c => ({ value: c.name, label: `${c.name}, ${c.stateCode}` }));

const MultiRoleRegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [selectedPlan, setSelectedPlanState] = useState<string>("Basic");
  const [profileCreation, setProfileCreation] = useState<boolean>(false);
  const [profileStoreManagement, setProfileStoreManagement] = useState<string>("None");
  const dispatch = useDispatch();
  const router = useRouter();

  const { loaded: isRazorpayLoaded } = useExternalScripts([
    "https://checkout.razorpay.com/v1/checkout.js",
  ]);

  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    role: "user",
    email: "",
    password: "",
    phone: "",
    name: "",
    profession: "",
    businessName: "",
    address: "",
    city: [] as string[],
    pincode: "",
    materialType: "",
    category: "",
    companyName: "",
    experience: "",
    businessType: "Both",
    bankAccountNumber: "",
    bankName: "",
    ifscCode: "",
    upiId: "",
    gstNumber: "",
    natureOfBusiness: "",
    businessAddress: "",
    qualification: "",
    skills: "",
    serviceTypes: [] as string[],
    charges: "",
    photo: null,
    businessCertification: null,
    shopImage: null,
    portfolio: null,
  });

  const isLoading = actionStatus === "loading";

  const initiatePayment = async (registeredUser: any) => {
    if (!isRazorpayLoaded) {
      toast.error("Payment Gateway is loading. Please wait a moment.");
      return;
    }
    
    // Calculate prices
    let planPrice = 999;
    let planName = "Basic Listing";

    switch (selectedPlan) {
      case "Standard":
        planPrice = 1499;
        planName = "Standard Listing";
        break;
      case "Premium":
        planPrice = 1999;
        planName = "Premium Listing (6 Month)";
        break;
      case "Premium+":
        planPrice = 2999;
        planName = "Premium+ Listing (12 Month)";
        break;
      case "Industrial_and_Infra_Services":
        planPrice = 4999;
        planName = "Industrial & Infra Services";
        break;
      default:
        planPrice = 999;
        planName = "Basic Listing";
    }

    const items = [{ name: planName, price: planPrice }];

    if (profileCreation) {
      items.push({ name: "Profile Creation Addon", price: 499 });
    }

    if (profileStoreManagement === "6_Month") {
      items.push({ name: "6-Month Profile & Store Management", price: 999 });
    } else if (profileStoreManagement === "1_Year") {
      items.push({ name: "1-Year Profile & Store Management", price: 1499 });
    }

    const subtotal = items.reduce((acc, curr) => acc + curr.price, 0);
    const taxPrice = Math.round(subtotal * 0.18 * 100) / 100;
    const totalPrice = subtotal + taxPrice;

    try {
      const orderData = {
        userId: registeredUser._id,
        orderItems: items,
        shippingAddress: {
          name: formData.name || formData.businessName || registeredUser.name || "",
          email: formData.email || registeredUser.email,
          phone: formData.phone || registeredUser.phone || "",
          location: "",
        },
        paymentMethod: "Razorpay",
        itemsPrice: subtotal,
        taxPrice: taxPrice,
        shippingPrice: 0,
        totalPrice: totalPrice,
        orderType: "subscription",
      };

      const { data: createdOrder } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
        orderData
      );

      if (!createdOrder || !createdOrder._id) {
        throw new Error("Could not create listing subscription order");
      }

      // Create Razorpay Order
      const { data: razorpayOrderData } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${createdOrder._id}/create-razorpay-order`,
        {}
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: "Houseplanfiles",
        order_id: razorpayOrderData.orderId,
        handler: async (response: any) => {
          try {
            const { data: verifiedOrder } = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${createdOrder._id}/verify-payment`,
              response
            );
            toast.success("Payment successful! Your listing is now active.");
            
            // Auto download invoice
            try {
              generateInvoicePDF(verifiedOrder, {
                name: formData.name || formData.businessName || registeredUser.name || "",
                email: formData.email || registeredUser.email,
                phone: formData.phone || registeredUser.phone || "",
              });
            } catch (pdfErr) {
              console.error("Failed to auto-download invoice:", pdfErr);
            }

            // Redirect based on role
            const role = registeredUser.role?.toLowerCase();
            if (role === "seller") {
              router.push("/seller/profile");
            } else if (role === "professional" || role === "contractor") {
              router.push("/professional/profile");
            } else {
              router.push("/dashboard");
            }
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.name || formData.businessName || registeredUser.name || "",
          email: formData.email || registeredUser.email,
          contact: formData.phone || registeredUser.phone || "",
        },
        theme: {
          color: "#ea580c",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment gateway.");
    }
  };

  useEffect(() => {
    if (actionStatus === "failed" && error) {
      toast.error(String(error));
      dispatch(resetActionStatus());
    }
    if (actionStatus === "succeeded" && userInfo) {
      dispatch(resetActionStatus());
      if (userInfo.role === "admin") {
        toast.success("Admin registration successful! Redirecting...");
        setTimeout(() => router.push("/admin"), 1000);
      } else if (userInfo.role === "user") {
        toast.success("Registration successful! Welcome to HousePlanFiles!");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        toast.success("Registration successful! Initiating payment...");
        initiatePayment(userInfo);
      }
    }
  }, [actionStatus, userInfo, error, router, dispatch, isRazorpayLoaded, selectedPlan, profileCreation, profileStoreManagement]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    setFormData({
      role: value,
      email: formData.email,
      password: formData.password,
      phone: "",
      name: "",
      profession: "",
      businessName: "",
      address: "",
      city: [] as string[],
      pincode: "",
      materialType: "",
      category: "",
      companyName: "",
      experience: "",
      bankAccountNumber: "",
      bankName: "",
      ifscCode: "",
      upiId: "",
      gstNumber: "",
      natureOfBusiness: "",
      businessAddress: "",
      businessType: "Both",
      qualification: "",
      skills: "",
      serviceTypes: [],
      charges: "",
      photo: null,
      businessCertification: null,
      shopImage: null,
      portfolio: null,
    });
  };

  const handleServiceTypeChange = (type: string) => {
    setFormData(prev => {
      const current = prev.serviceTypes;
      if (current.includes(type)) {
        return { ...prev, serviceTypes: current.filter(t => t !== type) };
      } else {
        return { ...prev, serviceTypes: [...current, type] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    for (const key in formData) {
      const value = formData[key as keyof typeof formData];
      if (value !== undefined && value !== null && value !== "") {
        if (key === "serviceTypes" && Array.isArray(value)) {
          dataToSubmit.append(key, JSON.stringify(value));
        } else if (key === "city" && Array.isArray(value)) {
          dataToSubmit.append(key, value.join(", "));
        } else if (key === "role" && ["home_designing", "industrial", "other_services"].includes(value as string)) {
          dataToSubmit.append("role", "Contractor");
        } else {
          dataToSubmit.append(key, value as string | Blob);
        }
      }
    }
    if (selectedRole !== "user") {
      dataToSubmit.append("selectedPlan", selectedPlan);
      dataToSubmit.append("profileCreation", String(profileCreation));
      dataToSubmit.append("profileStoreManagement", profileStoreManagement);
    }
    (dispatch as AppDispatch)(registerUser(dataToSubmit));
  };

  const renderRoleSpecificFields = () => {
    const motionProps = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.3 },
    };
    switch (selectedRole) {
      case "user":
      case "admin":
        return (
          <motion.div key={selectedRole} {...motionProps} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name*</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number*</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </motion.div>
        );

      case "professional":
        return (
          <motion.div key={selectedRole} {...motionProps} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name*</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label>Company Name (Optional)</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </div>
            </div>
            <div>
              <Label>Phone*</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Profession*</Label>
              <Select
                onValueChange={(v) => handleSelectChange(v, "profession")}
                value={formData.profession}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose profession" />
                </SelectTrigger>
                <SelectContent>
                  {professionalSubRoles.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>City* <span className="text-xs text-gray-400 font-normal">(select multiple or type your own)</span></Label>
                <CreatableSelect
                  isMulti
                  options={cityOptions}
                  value={(formData.city as string[]).map(c => ({ value: c, label: c }))}
                  onChange={(vals: any) => setFormData(prev => ({ ...prev, city: vals ? vals.map((v: any) => v.value) : [] }))}
                  placeholder="Search or type city name..."
                  className="text-sm"
                  formatCreateLabel={(input: string) => `Add "${input}"`}
                />
              </div>
              <div>
                <Label>Qualification (Optional)</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g. B.Arch, M.Tech"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Experience*</Label>
                <Select
                  onValueChange={(v) => handleSelectChange(v, "experience")}
                  value={formData.experience}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Service / Consultation Charges*</Label>
                <Input
                  id="charges"
                  required
                  value={formData.charges}
                  onChange={handleChange}
                  placeholder="e.g. ₹5,000 or ₹50/sqft"
                />
              </div>
            </div>
            <div>
              <Label>Skills (Comma separated)*</Label>
              <Input
                id="skills"
                required
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. AutoCAD, Interior Design, Plumbing..."
              />
            </div>
            <div>
              <Label>Office / Contact Address*</Label>
              <Textarea
                id="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address"
              />
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold mb-4 text-primary">
                💳 Bank & Payment Details (Optional)
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    type="text"
                    placeholder="e.g. HDFC Bank, SBI"
                    value={formData.bankName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                  <Input
                    id="bankAccountNumber"
                    type="text"
                    placeholder="Enter your account number"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For receiving payments from clients
                  </p>
                </div>
                <div>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    type="text"
                    placeholder="e.g., SBIN0001234"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    style={{ textTransform: "uppercase" }}
                  />
                </div>
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    type="text"
                    placeholder="yourname@paytm or 9876543210@paytm"
                    value={formData.upiId}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your UPI ID for quick payments
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold mb-4 text-primary">
                📄 Portfolio & Documents
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="portfolio">Portfolio PDF (Optional)</Label>
                  <Input
                    id="portfolio"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload your work portfolio (PDF only, max 10MB)
                  </p>
                </div>
                <div>
                  <Label htmlFor="businessCertification">
                    Qualification Certification (Optional)
                  </Label>
                  <Input
                    id="businessCertification"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload your professional certification or license
                  </p>
                </div>
                <div>
                  <Label htmlFor="shopImage">
                    Shop/Office Image (Optional)
                  </Label>
                  <Input
                    id="shopImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an image of your office or workspace
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "seller":
        return (
          <motion.div key={selectedRole} {...motionProps} className="space-y-5">
            <div>
              <Label>Full Name*</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label>Business Name*</Label>
              <Input
                id="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter business name"
              />
            </div>
            <div>
              <Label>Phone*</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label>Address*</Label>
              <Textarea
                id="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter business address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>City* <span className="text-xs text-gray-400 font-normal">(select multiple or type your own)</span></Label>
                <CreatableSelect
                  isMulti
                  options={cityOptions}
                  value={(formData.city as string[]).map(c => ({ value: c, label: c }))}
                  onChange={(vals: any) => setFormData(prev => ({ ...prev, city: vals ? vals.map((v: any) => v.value) : [] }))}
                  placeholder="Search or type city name..."
                  className="text-sm"
                  formatCreateLabel={(input: string) => `Add "${input}"`}
                />
              </div>
              <div>
                <Label>Pincode*</Label>
                <Input
                  id="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
            <div>
              <Label>Business Category*</Label>
              <Select
                onValueChange={(v) => handleSelectChange(v, "businessType")}
                value={formData.businessType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Business Category" />
                </SelectTrigger>
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
              <Select
                onValueChange={(v) => handleSelectChange(v, "category")}
                value={formData.category}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
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
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>GST Number*</Label>
              <Input
                id="gstNumber"
                required
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Enter GSTIN"
              />
            </div>
            <div>
              <Label>Business Address*</Label>
              <Textarea
                id="businessAddress"
                required
                value={formData.businessAddress}
                onChange={handleChange}
                placeholder="Enter detailed business address"
              />
            </div>
            <div>
              <Label htmlFor="businessCertification">
                Business License / Certification (Optional)
              </Label>
              <Input
                id="businessCertification"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload your business license or shop registration certificate (can be added later)
              </p>
            </div>
            <div>
              <Label htmlFor="photo">Profile/Store Image (Optional)</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </motion.div>
        );

      case "Contractor":
      case "home_designing":
      case "industrial":
      case "other_services": {
        let professionsList: string[] = [];
        if (selectedRole === "Contractor") professionsList = contractorProfessions;
        else if (selectedRole === "home_designing") professionsList = homeDesigningProfessions;
        else if (selectedRole === "industrial") professionsList = industrialProfessions;
        else if (selectedRole === "other_services") professionsList = otherServicesProfessions;

        return (
          <motion.div key={selectedRole} {...motionProps} className="space-y-5">
            <div>
              <Label>Full Name*</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Company Name*</Label>
              <Input
                id="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Phone*</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Profession*</Label>
              <Select
                onValueChange={(v) => handleSelectChange(v, "profession")}
                value={formData.profession}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Profession" />
                </SelectTrigger>
                <SelectContent>
                  {professionsList.map((prof) => (
                    <SelectItem key={prof} value={prof}>
                      {prof}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Experience*</Label>
              <Select
                onValueChange={(v) => handleSelectChange(v, "experience")}
                value={formData.experience}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Address*</Label>
              <Textarea
                id="address"
                required
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-primary">Services Offered*</Label>
              <div className="grid grid-cols-2 gap-4">
                {["NEW CONSTRUCTION", "RENOVATION"].map((type) => (
                  <div
                    key={type}
                    onClick={() => handleServiceTypeChange(type)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.serviceTypes.includes(type)
                        ? "bg-orange-50 border-orange-500 text-orange-700 shadow-sm"
                        : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200"
                      }`}
                  >
                    <span className="text-xs font-bold">{type}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.serviceTypes.includes(type)
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "border-gray-300"
                      }`}>
                      {formData.serviceTypes.includes(type) && <CheckCircle size={12} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>City* <span className="text-xs text-gray-400 font-normal">(select multiple or type your own)</span></Label>
              <CreatableSelect
                isMulti
                options={cityOptions}
                value={(formData.city as string[]).map(c => ({ value: c, label: c }))}
                onChange={(vals: any) => setFormData(prev => ({ ...prev, city: vals ? vals.map((v: any) => v.value) : [] }))}
                placeholder="Search or type city name..."
                className="text-sm"
                formatCreateLabel={(input: string) => `Add "${input}"`}
              />
            </div>
            <div>
              <Label>GST Number (Optional)</Label>
              <Input
                id="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Enter GSTIN"
              />
            </div>
            <div>
              <Label htmlFor="businessCertification">
                Business Certification (Optional)
              </Label>
              <Input
                id="businessCertification"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload your contractor license or business certification
              </p>
            </div>
            <div>
              <Label htmlFor="photo">Profile Picture (DP)*</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload your professional profile picture
              </p>
            </div>
          </motion.div>
        );
      }

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
                <div
                  key={role.id}
                  role="button"
                  onClick={() => handleRoleChange(role.id)}
                  className={`flex items-center justify-between w-full p-4 h-full rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                    selectedRole === role.id
                      ? "bg-accent text-accent-foreground border-transparent shadow-md"
                      : "bg-input border-border hover:border-primary/50"
                  }`}
                >
                  <span className="font-semibold">{role.label}</span>
                  {selectedRole === role.id && <CheckCircle size={20} />}
                </div>
              ))}
            </fieldset>
            <AnimatePresence mode="wait">
              {renderRoleSpecificFields()}
            </AnimatePresence>
            <div>
              <Label htmlFor="email">Email address*</Label>
              <Input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="password">Password*</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Subscription & Addons Panel */}
            {selectedRole !== "user" && (
              <div className="space-y-6 pt-4 border-t border-border mt-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Choose your Listing Plan</h3>
                  <p className="text-xs text-muted-foreground">Select the right plan to grow your business</p>
                </div>
                
                {/* Plans Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "Basic", name: "Basic Listing", price: 999, final: "1,178.82", color: "border-green-500 bg-green-500/5 text-green-800" },
                    { id: "Standard", name: "Standard Listing", price: 1499, final: "1,768.82", color: "border-blue-500 bg-blue-500/5 text-blue-800" },
                    { id: "Premium", name: "Premium (6 Months)", price: 1999, final: "2,358.82", color: "border-orange-500 bg-orange-500/5 text-orange-800" },
                    { id: "Premium+", name: "Premium+ (12 Months)", price: 2999, final: "3,538.82", color: "border-purple-500 bg-purple-500/5 text-purple-800" },
                    { id: "Industrial_and_Infra_Services", name: "Industrial & Infra Services", price: 4999, final: "5,898.82", color: "border-red-500 bg-red-500/5 text-red-800" }
                  ].map((p) => (
                    <div
                      key={p.id}
                      role="button"
                      onClick={() => setSelectedPlanState(p.id)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedPlan === p.id 
                          ? `${p.color} ring-2 ring-primary border-primary` 
                          : "border-border hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{p.name}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedPlan === p.id ? "bg-primary border-primary text-white" : "border-gray-300"
                        }`}>
                          {selectedPlan === p.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                      <div className="mt-2 flex items-baseline">
                        <span className="text-xl font-extrabold text-foreground">₹{p.price}</span>
                        <span className="text-xs text-muted-foreground ml-1">+18% GST</span>
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        Final Amount: <strong className="text-foreground">₹{p.final}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optional Services */}
                <div className="space-y-3 pt-3 border-t border-dashed border-border">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Optional Services</h4>
                    <p className="text-[11px] text-muted-foreground">Boost your profile and store visibility</p>
                  </div>
                  
                  {/* Service 1: Profile Creation */}
                  <div
                    role="button"
                    onClick={() => setProfileCreation(!profileCreation)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      profileCreation 
                        ? "bg-teal-500/5 border-teal-500 text-teal-800" 
                        : "border-border hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">Profile Creation Service</span>
                      <span className="text-[10px] text-muted-foreground font-medium">One-time setup fee</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold">₹499</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        profileCreation ? "bg-teal-500 border-teal-500 text-white" : "border-gray-300"
                      }`}>
                        {profileCreation && <CheckCircle size={10} />}
                      </div>
                    </div>
                  </div>

                  {/* Service 2 & 3: Management Plans */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "6_Month", name: "6-Month Management", price: 999 },
                      { id: "1_Year", name: "1-Year Management", price: 1499 }
                    ].map((m) => (
                      <div
                        key={m.id}
                        role="button"
                        onClick={() => setProfileStoreManagement(profileStoreManagement === m.id ? "None" : m.id)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          profileStoreManagement === m.id
                            ? "bg-amber-500/5 border-amber-500 text-amber-800"
                            : "border-border hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold">{m.name}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            profileStoreManagement === m.id ? "bg-amber-500 border-amber-500 text-white" : "border-gray-300"
                          }`}>
                            {profileStoreManagement === m.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </div>
                        <div className="mt-1 flex items-baseline justify-between">
                          <span className="text-xs text-muted-foreground">Profile & Store</span>
                          <span className="text-xs font-bold text-foreground">₹{m.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center pt-4">
              By registering, you agree to our{" "}
              <Link href="/terms-and-conditions" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <Button
              type="submit"
              className="w-full text-base font-bold py-3 h-12 btn-primary"
              disabled={isLoading}
            >
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
export default MultiRoleRegisterPage;