"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useState, useEffect } from "react";

import { Eye, EyeOff, CheckCircle, Loader2, Building2, HardHat, Store, Wrench, Factory, ChevronRight, Home } from "lucide-react";
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
  { 
    id: "professional", 
    label: "Architects & Engineers",
    subItems: [
      "Architects",
      "Interior Designers",
      "Civil Engineers",
      "Structural Engineers",
      "Vastu Consultants"
    ],
    theme: "blue",
    icon: <Building2 className="w-5 h-5" />
  },
  { 
    id: "Contractor", 
    label: "Contractors",
    subItems: [
      "Civil Contractors",
      "Turnkey Contractors",
      "Painting Contractors",
      "Electrical Contractors",
      "Plumbing Contractors"
    ],
    theme: "orange",
    icon: <HardHat className="w-5 h-5" />
  },
  { 
    id: "seller", 
    label: "Manufacturers & Suppliers",
    subItems: [
      "Building Material Shops",
      "Hardware Stores",
      "Cement & Steel",
      "Furniture Showrooms",
      "Sanitary & Tile Shops"
    ],
    theme: "green",
    icon: <Store className="w-5 h-5" />
  },
  { 
    id: "other_services", 
    label: "Other Services",
    subItems: [
      "Pest Control Services",
      "Landscaping Services",
      "HVAC Technicians",
      "Lift Installation",
      "Solar Installation"
    ],
    theme: "purple",
    icon: <Wrench className="w-5 h-5" />
  },
  { 
    id: "industrial", 
    label: "Industrial Services",
    subItems: [
      "Pre-Engineered Bldgs",
      "Machinery Rental",
      "Manpower Supply",
      "Project Management",
      "Heavy Infrastructure"
    ],
    theme: "red",
    icon: <Factory className="w-5 h-5" />
  },
];

const professionalSubRoles = [
  "Architect",
  "Civil Engineers",
  "Interior Designers",
  "Structural Engineers",
  "Site Engineers",
  "Vastu Consultant",
];

const contractorProfessions = [
  "Building Contractors", "Interior Contractor", "Electrical Contractor",
  "Plumbing Contractor", "Tiles Contractor", "Painting Contractor"
];

const homeDesigningProfessions = [
  "Architects & engineers", "Interior designer", "Contractors Building & Interior", "Electrical Contractor", "Plumbing Contractor", 
  "Tiles & Stone Contractor", "Painting Contractor", "Carpenter Services", "False Ceiling Contractor", "Building material"
];

const industrialProfessions = [
  "Pre Engineered Buildings", "Pre Fabricated Buildings", "Pre Cast Materials", "Structural Engineers", "Machinary Rental Services", "Manpower Supply", "Project Managers", "Flooring Service", "Roofing Services"
];

const otherServicesProfessions = [
  "Pest Control", "Garden and Landscaping", "Glass Fabricator", "HVAC Services", 
  "Lift Installation Services", "Solar Installation Services", "Home Automation", "Water Proffing Service", "Modular Kitchen Services", "Swimming Pool Contractor", "Fire Safety Service", "Carpenter", "False Ceiling Contractor"
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

const stateOptions = (State.getStatesOfCountry("IN") || []).map(s => ({ value: s.name, label: s.name }));
const cityOptions = (City.getCitiesOfCountry("IN") || []).map(c => ({ value: c.name, label: `${c.name}, ${c.stateCode}` }));

const MultiRoleRegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPlan, setSelectedPlanState] = useState<string>("Basic");
  const [profileCreation, setProfileCreation] = useState<boolean>(false);
  const [profileStoreManagement, setProfileStoreManagement] = useState<string>("None");
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { loaded: isRazorpayLoaded } = useExternalScripts([
    "https://checkout.razorpay.com/v1/checkout.js",
  ]);

  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    role: "professional",
    email: "",
    password: "",
    phone: "",
    name: "",
    profession: "",
    businessName: "",
    address: "",
    city: [] as string[],
    selectedStates: [] as string[],
    isPanIndia: false,
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
    
    // Calculate prices based on selected role and tier
    let planPrice = 999;
    let planName = "City Listing (3 Months)";

    switch (selectedPlan) {
      // Architect, Contractor, Other Services
      case "City_3M":
      case "Basic": {
        const cCount = formData.city.length > 0 ? formData.city.length : 1;
        planPrice = 999 * cCount;
        planName = `City Listing (3 Months) - ${cCount > 1 ? `${cCount} Cities` : "Per City"}`;
        break;
      }
      case "City_6M":
      case "Premium": {
        const cCount = formData.city.length > 0 ? formData.city.length : 1;
        planPrice = 1999 * cCount;
        planName = `City Listing (6 Months) - ${cCount > 1 ? `${cCount} Cities` : "Per City"}`;
        break;
      }
      case "City_1Y":
      case "Premium+": {
        const cCount = formData.city.length > 0 ? formData.city.length : 1;
        planPrice = 2999 * cCount;
        planName = `City Listing (1 Year) - ${cCount > 1 ? `${cCount} Cities` : "Per City"}`;
        break;
      }
      case "State_1Y":
        planPrice = 9999;
        planName = "State Listing (1 Year)";
        break;
      case "Pan_India_1Y":
        planPrice = 14999;
        planName = "PAN India Listing (1 Year)";
        break;

      // Marketplace / Building Material (Seller)
      case "Seller_City":
      case "Seller_Auto": {
        const cityCount = formData.city.length > 0 ? formData.city.length : 1;
        planPrice = 2999 * cityCount;
        planName = `Marketplace Shop Listing (${cityCount > 1 ? `${cityCount} Cities` : "Per City"} / 1 Year)`;
        break;
      }
      case "Seller_State":
        planPrice = 9999;
        planName = "Marketplace State Listing (1 Year)";
        break;
      case "Seller_Pan_India":
        planPrice = 14999;
        planName = "Marketplace PAN India Listing (1 Year)";
        break;

      // Infra and Industrial Services
      case "Industrial_City": {
        const cCount = formData.city.length > 0 ? formData.city.length : 1;
        planPrice = 4999 * cCount;
        planName = `Industrial Services (City / 1 Year) - ${cCount > 1 ? `${cCount} Cities` : "Per City"}`;
        break;
      }
      case "Industrial_State":
        planPrice = 14999;
        planName = "Industrial Services (State / 1 Year)";
        break;
      case "Industrial_Pan_India":
        planPrice = 24999;
        planName = "Industrial Services (PAN India / 1 Year)";
        break;

      default:
        planPrice = 999;
        planName = "Listing Plan";
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
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery) {
      const roleExists = userRoles.some((r) => r.id === roleFromQuery);
      if (roleExists) {
        handleRoleChange(roleFromQuery);
      }
    }
  }, [searchParams]); // Re-run if searchParams change

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

  useEffect(() => {
    if (formData.city.length > 2 && !formData.isPanIndia) {
      setFormData((prev) => ({ ...prev, isPanIndia: true, city: [] }));
      if (selectedRole === "seller") {
        setSelectedPlanState("Seller_Pan_India");
      } else if (selectedRole === "industrial") {
        setSelectedPlanState("Industrial_Pan_India");
      } else {
        setSelectedPlanState("Pan_India_1Y");
      }
      toast.info("Switched to PAN INDIA plan automatically as you selected more than 2 cities.");
    }
  }, [formData.city, selectedRole, formData.isPanIndia]);

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
    setSelectedPlanState(value === "seller" ? "Seller_Auto" : value === "industrial" ? "Industrial_State" : "Basic");
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
      selectedStates: [] as string[],
      isPanIndia: false,
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
          dataToSubmit.append(key, formData.isPanIndia ? "PAN India" : value.join(", "));
        } else if (key === "selectedStates" && Array.isArray(value)) {
          dataToSubmit.append(key, JSON.stringify(value));
        } else if (key === "role" && ["home_designing", "industrial", "other_services"].includes(value as string)) {
          dataToSubmit.append("role", "Contractor");
        } else {
          dataToSubmit.append(key, value as string | Blob);
        }
      }
    }
    if (selectedRole !== "user") {
      const isPan = Boolean(formData.isPanIndia || selectedPlan.toLowerCase().includes("pan_india"));
      dataToSubmit.set("isPanIndia", String(isPan));
      dataToSubmit.append("selectedPlan", selectedPlan);
      dataToSubmit.append("profileCreation", String(profileCreation));
      dataToSubmit.append("profileStoreManagement", profileStoreManagement);
      if (formData.selectedStates && formData.selectedStates.length > 0) {
        dataToSubmit.set("state", formData.selectedStates[0]);
      }
      if (formData.pincode) {
        dataToSubmit.set("pincode", formData.pincode);
      }
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
              <Label>Business or profession*</Label>
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
                <Label>Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
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
                  <SelectItem value="Local Shop">Local Shop</SelectItem>
                  <SelectItem value="Both">Manufacturer &amp; Supplier Both</SelectItem>
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
              <Label>Business or profession*</Label>
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
              {selectedRole !== 'industrial' && selectedRole !== 'other_services' && (
                <>
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
                </>
              )}
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
      <div className="min-h-screen bg-[#FAF9F6] relative overflow-hidden font-sans pb-12">
        {/* Subtle decorative background patterns */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

        <form className="relative z-10 flex flex-col min-h-full" onSubmit={handleSubmit}>
          {!selectedRole && (
            <div className="w-full">
              {/* HERO SECTION */}
              <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 md:pt-20 md:pb-16">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                  {/* Left Text */}
                  <div className="lg:w-[55%] flex flex-col items-start text-left">
                    <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs md:text-sm font-bold text-orange-600 mb-6 shadow-sm">
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Join Our Community
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                      Create Your <span className="text-orange-600">Account</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 font-medium mb-8 max-w-lg leading-relaxed">
                      Select your registration type below to get started and join our premium marketplace.
                    </p>
                    <p className="text-sm font-bold text-slate-500 flex items-center flex-wrap gap-2 md:gap-3">
                      Build your profile <span className="text-orange-300">•</span> Connect with professionals <span className="text-orange-300">•</span> Grow your business
                    </p>
                  </div>
                  
                  {/* Right Visual */}
                  <div className="lg:w-[45%] relative hidden lg:flex justify-end">
                    <div className="relative w-full max-w-lg aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border-[6px] border-white group">
                      <img 
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                        alt="Premium Real Estate" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 shadow-lg transform translate-y-1 group-hover:translate-y-0 transition-all duration-500">
                          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                            <Building2 className="w-6 h-6 text-orange-500" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">Join 50,000+ Professionals</p>
                            <p className="text-xs text-slate-500 font-semibold mt-0.5">Architects, Contractors & Sellers</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* REGISTRATION CARDS */}
              <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">
                  {userRoles.map((role) => {
                    const getThemeClasses = (t: string) => {
                      switch(t) {
                        case 'blue': return { bg: 'bg-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50', border: 'hover:border-blue-400', shadow: 'shadow-blue-500/20', hoverBg: 'group-hover:bg-blue-700' };
                        case 'orange': return { bg: 'bg-[#ea580c]', text: 'text-[#ea580c]', lightBg: 'bg-orange-50', border: 'hover:border-[#ea580c]', shadow: 'shadow-orange-500/20', hoverBg: 'group-hover:bg-[#c2410c]' };
                        case 'green': return { bg: 'bg-emerald-600', text: 'text-emerald-600', lightBg: 'bg-emerald-50', border: 'hover:border-emerald-400', shadow: 'shadow-emerald-500/20', hoverBg: 'group-hover:bg-emerald-700' };
                        case 'purple': return { bg: 'bg-purple-600', text: 'text-purple-600', lightBg: 'bg-purple-50', border: 'hover:border-purple-400', shadow: 'shadow-purple-500/20', hoverBg: 'group-hover:bg-purple-700' };
                        case 'red': return { bg: 'bg-rose-600', text: 'text-rose-600', lightBg: 'bg-rose-50', border: 'hover:border-rose-400', shadow: 'shadow-rose-500/20', hoverBg: 'group-hover:bg-rose-700' };
                        default: return { bg: 'bg-[#ea580c]', text: 'text-[#ea580c]', lightBg: 'bg-orange-50', border: 'hover:border-[#ea580c]', shadow: 'shadow-orange-500/20', hoverBg: 'group-hover:bg-[#c2410c]' };
                      }
                    };
                    const theme = getThemeClasses(role.theme || 'orange');
                    return (
                      <div
                        key={role.id}
                        role="button"
                        onClick={() => handleRoleChange(role.id)}
                        className={`group relative flex flex-col p-3 sm:p-5 md:p-6 rounded-[16px] sm:rounded-[24px] border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 ${theme.border} transition-all duration-300 h-full text-left overflow-hidden cursor-pointer`}
                      >
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${theme.lightBg} ${theme.text} flex items-center justify-center mb-3 sm:mb-5 shrink-0 transition-colors duration-300`}>
                          <div className="scale-75 sm:scale-100">
                            {role.icon}
                          </div>
                        </div>
                        <h3 className="font-extrabold text-slate-800 text-[13px] sm:text-[17px] mb-3 sm:mb-5 leading-tight pr-1 sm:pr-2 min-h-[32px] sm:min-h-[auto]">
                          {role.label}
                        </h3>
                        
                        <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-grow">
                          {role.subItems?.map((item: string, idx: number) => (
                            <li key={idx} className="flex items-start text-[10px] sm:text-sm text-gray-600 font-medium leading-snug">
                              <svg className={`w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2.5 ${theme.text} shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                              {item}
                            </li>
                          ))}
                          <li className="flex items-center text-[9px] sm:text-xs text-gray-400 italic pt-1 sm:pt-2 font-medium">
                            <span className="mr-1.5 sm:mr-2 opacity-60">→</span> And many more...
                          </li>
                        </ul>

                        <div className={`mt-auto w-full py-2 sm:py-3 rounded-lg sm:rounded-xl ${theme.bg} text-white font-bold text-[11px] sm:text-sm flex items-center justify-center shadow-md ${theme.shadow} ${theme.hoverBg} transition-colors duration-300`}>
                          Register Now
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TRUST SECTION */}
              <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
                 <div className="flex flex-col items-center justify-center border-t border-gray-200 pt-10">
                   <p className="text-slate-800 font-bold text-lg mb-4">Trusted by 50,000+ Professionals</p>
                   <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                     <span className="flex items-center"><Building2 className="w-4 h-4 mr-1.5 text-orange-500"/> Build</span>
                     <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                     <span className="flex items-center"><Home className="w-4 h-4 mr-1.5 text-orange-500"/> Connect</span>
                     <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                     <span className="flex items-center"><Store className="w-4 h-4 mr-1.5 text-orange-500"/> Grow</span>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {selectedRole && (
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 my-12 relative z-10 flex-grow">
              <div className="bg-white p-6 sm:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 mb-4 pb-4 border-b border-border">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {userRoles.find(r => r.id === selectedRole)?.label || "Registration"}
                    </h2>
                    <p className="text-sm text-muted-foreground">Please fill in your details to continue</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setSelectedRole("");
                      setFormData(prev => ({ ...prev, role: "" }));
                    }}
                    className="h-9 px-4 text-sm"
                  >
                    Change Type
                  </Button>
                </div>
                
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
                {/* Unified Location Selector */}
                <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-foreground">Select Operating Region</h3>
                    <p className="text-xs text-muted-foreground">Select your coverage area to see suitable plans</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>State* <span className="text-xs text-gray-400 font-normal">(select multiple)</span></Label>
                      <CreatableSelect
                        isMulti
                        options={stateOptions}
                        value={(formData.selectedStates as string[]).map(s => ({ value: s, label: s }))}
                        onChange={(vals: any) => {
                           const newStates = vals ? vals.map((v: any) => v.value) : [];
                           setFormData(prev => ({ ...prev, selectedStates: newStates }));
                        }}
                        placeholder="Search or select state..."
                        className="text-sm mb-4"
                        formatCreateLabel={(input: string) => `Add "${input}"`}
                      />
                      <Label>City* <span className="text-xs text-gray-400 font-normal">(select multiple)</span></Label>
                      <CreatableSelect
                        isMulti
                        options={cityOptions}
                        value={(formData.city as string[]).map(c => ({ value: c, label: c }))}
                        onChange={(vals: any) => {
                           const newCities = vals ? vals.map((v: any) => v.value) : [];
                           setFormData(prev => ({ ...prev, city: newCities }));
                        }}
                        placeholder="Search or select city name..."
                        className="text-sm"
                        formatCreateLabel={(input: string) => `Add "${input}"`}
                        isDisabled={formData.isPanIndia}
                      />
                    </div>
                    <div>
                      <div className="flex items-center h-full">
                        <div className="flex items-center space-x-3 w-full p-4 bg-white border border-orange-200 rounded-lg shadow-sm">
                          <input
                            type="checkbox"
                            id="panIndia_unified"
                            className="w-5 h-5 rounded border-orange-400 text-orange-600 focus:ring-orange-500 cursor-pointer"
                            checked={formData.isPanIndia}
                            onChange={(e) => setFormData(prev => ({ ...prev, isPanIndia: e.target.checked, city: e.target.checked ? [] : prev.city }))}
                          />
                          <label htmlFor="panIndia_unified" className="text-base font-bold text-orange-700 cursor-pointer">
                            Serve PAN India
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground">Choose your Listing Plan</h3>
                  <p className="text-xs text-muted-foreground">Select the right plan to grow your business</p>
                </div>
                
                {/* Plans Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(selectedRole === "seller"
                    ? [
                        { id: "Seller_City", name: "City Shop (1 Year)", price: 2999 * (formData.city.length > 1 ? formData.city.length : 1), final: (2999 * (formData.city.length > 1 ? formData.city.length : 1) * 1.18).toFixed(2), note: formData.city.length > 1 ? `${formData.city.length} Cities Selected` : "Per City Shop Listing", color: "border-blue-500 bg-blue-500/5 text-blue-800" },
                        { id: "Seller_State", name: "State Listing (1 Year)", price: 9999, final: "11,798.82", note: "Entire State Coverage", color: "border-orange-500 bg-orange-500/5 text-orange-800" },
                        { id: "Seller_Pan_India", name: "PAN INDIA (1 Year)", price: 14999, final: "17,698.82", note: "All India Coverage", color: "border-purple-500 bg-purple-500/5 text-purple-800" }
                      ]
                    : selectedRole === "industrial"
                    ? [
                        { id: "Industrial_City", name: "City Level (1 Year)", price: 4999 * (formData.city.length > 1 ? formData.city.length : 1), final: (4999 * (formData.city.length > 1 ? formData.city.length : 1) * 1.18).toFixed(2), note: formData.city.length > 1 ? `${formData.city.length} Cities Selected` : "City Level Listing", color: "border-blue-500 bg-blue-500/5 text-blue-800" },
                        { id: "Industrial_State", name: "State Level (1 Year)", price: 14999, final: "17,698.82", note: "State Level Listing", color: "border-orange-500 bg-orange-500/5 text-orange-800" },
                        { id: "Industrial_Pan_India", name: "PAN INDIA (1 Year)", price: 24999, final: "29,498.82", note: "All India Coverage", color: "border-red-500 bg-red-500/5 text-red-800" }
                      ]
                    : [
                        { id: "City_3M", name: "City (3 Months)", price: 999 * (formData.city.length > 1 ? formData.city.length : 1), final: (999 * (formData.city.length > 1 ? formData.city.length : 1) * 1.18).toFixed(2), note: formData.city.length > 1 ? `${formData.city.length} Cities Selected` : "City Listing", color: "border-green-500 bg-green-500/5 text-green-800" },
                        { id: "City_6M", name: "City (6 Months)", price: 1999 * (formData.city.length > 1 ? formData.city.length : 1), final: (1999 * (formData.city.length > 1 ? formData.city.length : 1) * 1.18).toFixed(2), note: formData.city.length > 1 ? `${formData.city.length} Cities Selected` : "Verified Profile", color: "border-blue-500 bg-blue-500/5 text-blue-800" },
                        { id: "City_1Y", name: "City (1 Year)", price: 2999 * (formData.city.length > 1 ? formData.city.length : 1), final: (2999 * (formData.city.length > 1 ? formData.city.length : 1) * 1.18).toFixed(2), note: formData.city.length > 1 ? `${formData.city.length} Cities Selected` : "Premium Full Year", color: "border-orange-500 bg-orange-500/5 text-orange-800" },
                        { id: "State_1Y", name: "State (1 Year)", price: 9999, final: "11,798.82", note: "State-wide Coverage", color: "border-indigo-500 bg-indigo-500/5 text-indigo-800" },
                        { id: "Pan_India_1Y", name: "PAN INDIA (1 Year)", price: 14999, final: "17,698.82", note: "All India Top Listing", color: "border-purple-500 bg-purple-500/5 text-purple-800" }
                      ]
                  ).filter(p => {
                    const isPanIndiaPlan = p.id.toLowerCase().includes("pan_india");
                    const isStatePlan = p.id.toLowerCase().includes("state");
                    const isCityPlan = p.id.toLowerCase().includes("city");

                    if (formData.isPanIndia) return isPanIndiaPlan;
                    if (formData.city && formData.city.length > 0) return isCityPlan;
                    if (formData.selectedStates && formData.selectedStates.length > 0) return isStatePlan;
                    
                    return true;
                  }).map((p) => (
                    <div
                      key={p.id}
                      role="button"
                      onClick={() => {
                        setSelectedPlanState(p.id);
                        if (p.id.toLowerCase().includes("pan_india")) {
                          setFormData((prev) => ({ ...prev, isPanIndia: true }));
                        } else {
                          setFormData((prev) => ({ ...prev, isPanIndia: false }));
                        }
                      }}
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
                        <span className="text-xl font-extrabold text-foreground">₹{p.price.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-1">+18% GST</span>
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        Final Amount: <strong className="text-foreground">₹{p.final}</strong>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5">{p.note}</p>
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
            </div>
            </div>
            )}
          </form>
      </div>
      <Footer />
    </>
  );
};
export default MultiRoleRegisterPage;
