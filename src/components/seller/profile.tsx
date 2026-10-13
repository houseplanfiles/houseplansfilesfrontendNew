"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Save, Eye, EyeOff, Zap, Sparkles, CheckCircle2 } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import {
  updateProfile,
  resetActionStatus,
  fetchCurrentUser,
} from "@/lib/features/users/userSlice";
import axios from "axios";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SellerProfilePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    address: "",
    city: "",
    category: "",
    gstNumber: "",
    businessType: "",
    businessAddress: "",
    website: "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [certification, setCertification] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = actionStatus === "loading";
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const isPaid = userInfo?.paymentStatus === "Paid" || userInfo?.contractorType === "Premium" || userInfo?.isApproved === true;

  const handlePayToUpgrade = async () => {
    if (!userInfo) return;
    setIsPaying(true);
    try {
      if (!(window as any).Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      }

      const planName = userInfo.selectedPlan || "Material Seller Listing Plan (Premium - 1 Year)";
      const planPrice = 999;
      const taxPrice = Math.round(planPrice * 0.18 * 100) / 100;
      const totalPrice = planPrice + taxPrice;

      const orderData = {
        userId: userInfo._id,
        orderItems: [{ name: planName, price: planPrice }],
        shippingAddress: {
          name: userInfo.name || userInfo.businessName || "",
          email: userInfo.email || "",
          phone: userInfo.phone || "",
          location: userInfo.city || "",
        },
        paymentMethod: "Razorpay",
        itemsPrice: planPrice,
        taxPrice: taxPrice,
        shippingPrice: 0,
        totalPrice: totalPrice,
        orderType: "subscription",
      };

      const { data: createdOrder } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
        orderData,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      const { data: razorpayOrderData } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${createdOrder._id}/create-razorpay-order`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: "Houseplanfiles",
        order_id: razorpayOrderData.orderId,
        handler: async (response: any) => {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${createdOrder._id}/verify-payment`,
              response,
              { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            toast.success("Payment successful! Your account has been upgraded to Premium!");
            const updatedUser = {
              ...userInfo,
              paymentStatus: "Paid",
              contractorType: "Premium",
              isApproved: true,
              status: "Approved",
            };
            localStorage.setItem("userInfo", JSON.stringify(updatedUser));
            dispatch(fetchCurrentUser());
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: userInfo.name || userInfo.businessName || "",
          email: userInfo.email || "",
          contact: userInfo.phone || "",
        },
        theme: { color: "#ea580c" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment gateway.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!userInfo || !userInfo.token) {
      toast.error("User session not found.");
      return;
    }
    setDownloadingInvoice(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data: orders } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/myorders`,
        config
      );

      // Find the subscription order
      const subscriptionOrder = orders.find((o: any) => o.orderType === "subscription");
      if (subscriptionOrder) {
        generateInvoicePDF(subscriptionOrder, {
          name: userInfo.name || userInfo.businessName || "Seller",
          email: userInfo.email,
          phone: userInfo.phone || "",
        });
        toast.success("Invoice downloaded successfully!");
      } else {
        // Fallback: If no subscription order in DB, construct one dynamically from paymentDetails
        const fallbackOrder = {
          _id: userInfo.paymentDetails?.orderId || `SUB-${userInfo._id.substring(18)}`,
          createdAt: userInfo.paymentDetails?.paidAt || userInfo.createdAt || new Date(),
          orderItems: [
            { name: `${userInfo.selectedPlan || "Listing"} Plan`, price: userInfo.paymentDetails?.amountPaid || 999 }
          ],
          itemsPrice: userInfo.paymentDetails?.amountPaid || 999,
          taxPrice: userInfo.paymentDetails?.gstPaid || 0,
          totalPrice: (userInfo.paymentDetails?.amountPaid || 999) + (userInfo.paymentDetails?.gstPaid || 0)
        };
        generateInvoicePDF(fallbackOrder, {
          name: userInfo.name || userInfo.businessName || "Seller",
          email: userInfo.email,
          phone: userInfo.phone || "",
        });
        toast.success("Invoice downloaded successfully!");
      }
    } catch (err) {
      console.error("Failed to download invoice:", err);
      toast.error("Failed to fetch order information for invoice.");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  // Jab component load ho, Redux se data lekar form ko bharein
  useEffect(() => {
    if (userInfo) {
      setFormData({
        businessName: userInfo.businessName || "",
        phone: userInfo.phone || "",
        address: userInfo.address || "",
        city: userInfo.city || "",
        category: userInfo.category || "",
        gstNumber: userInfo.gstNumber || "",
        businessType: userInfo.businessType || "",
        businessAddress: userInfo.businessAddress || "",
        website: userInfo.socialLinks?.website || (userInfo as any).website || "",
      });
      setPhotoPreview(userInfo.photoUrl || null);
    }
  }, [userInfo]);

  // Update hone ke baad success/error message dikhayein
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Profile updated successfully!");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(
        String(error || "Failed to update profile. Please try again.")
      );
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (e.target.id === "photo") {
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
      } else if (e.target.id === "businessCertification") {
        setCertification(file);
      }
    }
  };

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSubmit.append(key, value);
    });

    const socialLinks = {
      ...(userInfo.socialLinks || {}),
      website: formData.website || "",
    };
    dataToSubmit.append("socialLinks", JSON.stringify(socialLinks));

    if (photo) {
      dataToSubmit.append("photo", photo);
    }
    if (certification) {
      dataToSubmit.append("businessCertification", certification);
    }
    dispatch(updateProfile(dataToSubmit));
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    const dataToSubmit = new FormData();
    dataToSubmit.append("password", passwordData.newPassword);
    dispatch(updateProfile(dataToSubmit)).then(() => {
      setPasswordData({ newPassword: "", confirmPassword: "" });
    });
  };

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-10 w-10 text-orange-500" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

      {!isPaid && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-white/30 tracking-wider">
                ⚡ Demo Account
              </span>
              <span className="text-xs text-amber-100 font-semibold">Payment Incomplete</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold leading-snug">
              Your seller account is currently in Demo Mode.
            </h3>
            <p className="text-xs text-orange-100 max-w-xl">
              Complete your payment of ₹999 + GST to activate your store, unlock verified status, and receive buyer inquiries directly!
            </p>
          </div>
          <Button
            type="button"
            onClick={handlePayToUpgrade}
            disabled={isPaying}
            className="shrink-0 bg-white hover:bg-slate-100 text-[#ea580c] hover:text-[#c2410c] font-black px-6 h-11 rounded-xl shadow-md border-none cursor-pointer flex items-center gap-2"
          >
            {isPaying ? <Loader2 className="animate-spin w-4 h-4 text-orange-600" /> : <><Sparkles className="w-4 h-4 text-orange-600" /> Pay & Upgrade to Premium</>}
          </Button>
        </div>
      )}

      {/* --- Profile Information Card --- */}
      <Card>
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
          <CardDescription>
            Update your public profile details here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={photoPreview || userInfo.photoUrl || undefined}
                  alt={userInfo.businessName}
                />
                <AvatarFallback>
                  {userInfo.businessName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo">Change Profile Picture</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to 5MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email (Cannot be changed)</Label>
                <Input id="email" value={userInfo.email} disabled />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(v) => handleSelectChange(v, "category")} value={formData.category}>
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
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="city">City / Cities</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Delhi, Mumbai"
                />
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                  Enter multiple cities separated by comma.
                </p>

              </div>
              <div>
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GSTIN"
                />
              </div>
              <div>
                <Label htmlFor="businessType">Business Category</Label>
                <Select onValueChange={(v) => handleSelectChange(v, "businessType")} value={formData.businessType}>
                  <SelectTrigger><SelectValue placeholder="Select Business Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                    <SelectItem value="Both">Manufacturer &amp; Supplier Both</SelectItem>
                    <SelectItem value="Retail">Retail Shop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 bg-orange-50/50 p-4 rounded-xl border border-orange-200">
                <Label htmlFor="website" className="font-bold text-orange-950 flex items-center gap-1.5">
                  Official Website URL (Backlink)
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="mt-1 bg-white border-orange-300 focus:border-orange-500"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Enter your company website. This link will be displayed on your store profile to provide high-quality backlink and organic traffic.
                </p>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="businessCertification">Business License / Certification (Optional)</Label>
                <Input
                  id="businessCertification"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="mt-1"
                />
                {userInfo.businessCertificationUrl && (
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    Current License: <a href={userInfo.businessCertificationUrl} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">View Current License</a>
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* --- Change Password Card --- */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your login password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} variant="secondary">
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* --- Subscription & Invoice Card --- */}
      {userInfo.selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription & Invoices</CardTitle>
            <CardDescription>View your active listing plan and download receipts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg border gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Plan: <span className="text-orange-600 font-bold">{userInfo.selectedPlan}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Payment Status: <span className="font-semibold text-green-600">{userInfo.paymentStatus || "Paid"}</span>
                </p>
                {userInfo.paymentDetails?.paidAt && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Paid on: {new Date(userInfo.paymentDetails.paidAt).toLocaleDateString("en-IN")}
                  </p>
                )}
              </div>
              
              {userInfo.paymentStatus === "Paid" && (
                <Button 
                  onClick={handleDownloadInvoice} 
                  disabled={downloadingInvoice}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium shadow"
                >
                  {downloadingInvoice ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Downloading...
                    </>
                  ) : (
                    "Download Invoice (PDF)"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SellerProfilePage;
