"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Save, Zap, Sparkles, CheckCircle2, ExternalLink } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import {
  updateProfile,
  resetActionStatus,
  fetchCurrentUser,
} from "@/lib/features/users/userSlice";
import axios from "axios";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";
import { getContractorProfileUrl } from "@/utils/profileUrls";

import { Button } from "@/components/ui/button";
import ActivatePremiumModal from "@/components/ActivatePremiumModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type FormData = {
  name: string;
  phone: string;
  profession: string;
  companyName?: string;
  city: string;
  address?: string;
  experience: string;
  qualification?: string;
  skills?: string;
  charges?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  socialWebsite?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  socialYoutube?: string;
  socialTwitter?: string;
  socialWhatsapp?: string;
  socialPinterest?: string;
  socialTelegram?: string;
  socialThreads?: string;
};

const ProfilePageProf = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  // professional, architect, contractor — sab ke liye extra fields dikhao
  const isProfessional = ["professional", "architect", "contractor"].includes(userInfo?.role?.toLowerCase() || "");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [certification, setCertification] = useState<File | null>(null);

  const isLoading = actionStatus === "loading";
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isPaid = userInfo?.paymentStatus === "Paid" || userInfo?.contractorType === "Premium";

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

      const planName = userInfo.selectedPlan || "City Listing Plan (Premium - 1 Year)";
      const planPrice = 999;
      const taxPrice = Math.round(planPrice * 0.18 * 100) / 100;
      const totalPrice = planPrice + taxPrice;

      const orderData = {
        userId: userInfo._id,
        orderItems: [{ name: planName, price: planPrice }],
        shippingAddress: {
          name: userInfo.name || "",
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
          name: userInfo.name || "",
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
          name: userInfo.name || userInfo.businessName || "Professional",
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
          name: userInfo.name || userInfo.businessName || "Professional",
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

  useEffect(() => {
    if (userInfo) {
      setValue("name", userInfo.name || "");
      setValue("phone", userInfo.phone || "");
      setValue("profession", userInfo.profession || "");
      setValue("companyName", userInfo.companyName || "");
      setValue("city", userInfo.city || "");
      setValue("address", userInfo.address || "");
      setValue("experience", userInfo.experience || "");
      if (isProfessional) {
        setValue("qualification", userInfo.qualification || "");
        setValue("skills", Array.isArray(userInfo.skills) ? userInfo.skills.join(", ") : userInfo.skills || "");
        setValue("charges", userInfo.charges || "");
        setValue("seoTitle", userInfo.seoTitle || "");
        setValue("seoDescription", userInfo.seoDescription || "");
        setValue("seoKeywords", userInfo.seoKeywords || "");
        
        if (userInfo.socialLinks) {
          setValue("socialWebsite", userInfo.socialLinks.website || (userInfo as any).website || "");
          setValue("socialFacebook", userInfo.socialLinks.facebook || "");
          setValue("socialInstagram", userInfo.socialLinks.instagram || "");
          setValue("socialLinkedin", userInfo.socialLinks.linkedin || "");
          setValue("socialYoutube", userInfo.socialLinks.youtube || "");
          setValue("socialTwitter", userInfo.socialLinks.twitter || "");
          setValue("socialWhatsapp", userInfo.socialLinks.whatsapp || "");
          setValue("socialPinterest", userInfo.socialLinks.pinterest || "");
          setValue("socialTelegram", userInfo.socialLinks.telegram || "");
          setValue("socialThreads", userInfo.socialLinks.threads || "");
        } else if ((userInfo as any).website) {
          setValue("socialWebsite", (userInfo as any).website);
        }
      }
      setPhotoPreview(userInfo.photoUrl || null);
    }
  }, [userInfo, setValue, isProfessional]);

  // Update hone ke baad success/error message dikhayein
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Profile updated successfully!");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      if (error === "Session expired. Please login again." || error === "SESSION_EXPIRED") {
        toast.error("Session expire ho gayi hai. Dobara login karein.");
        dispatch(resetActionStatus());
        setTimeout(() => { window.location.href = "/login"; }, 1500);
      } else {
        toast.error(String(error || "Failed to update profile."));
        dispatch(resetActionStatus());
      }
    }
  }, [actionStatus, error, dispatch]);

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

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const dataToSubmit = new FormData();
    // Form se saara data append karein
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !key.startsWith("social")) {
        dataToSubmit.append(key, value);
      }
    });

    const socialLinks = {
      website: data.socialWebsite || "",
      facebook: data.socialFacebook || "",
      instagram: data.socialInstagram || "",
      linkedin: data.socialLinkedin || "",
      youtube: data.socialYoutube || "",
      twitter: data.socialTwitter || "",
      whatsapp: data.socialWhatsapp || "",
      pinterest: data.socialPinterest || "",
      telegram: data.socialTelegram || "",
      threads: data.socialThreads || "",
    };
    dataToSubmit.append("socialLinks", JSON.stringify(socialLinks));
    if (data.socialWebsite) {
      dataToSubmit.append("website", data.socialWebsite);
    }

    // Agar nayi photo hai to use bhi append karein
    if (photo) {
      dataToSubmit.append("photo", photo);
    }
    if (certification) {
      dataToSubmit.append("businessCertification", certification);
    }
    dispatch(updateProfile(dataToSubmit));
  };

  if (!userInfo) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto" />
      </div>
    );
  }

  const publicProfileUrl = userInfo ? getContractorProfileUrl(userInfo) : "/contractors";

  return (
    <div className="space-y-6 p-4 md:p-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600">
            Update your public profile and account details.
          </p>
        </div>
        <a
          href={publicProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
        >
          <span>View Public Profile</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {!isPaid && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-3xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-white/30 tracking-wider">
                ⚡ Demo Account
              </span>
              <span className="text-xs text-amber-100 font-semibold">Payment Incomplete</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold leading-snug">
              Your profile is currently running in Demo Mode.
            </h3>
            <p className="text-xs text-orange-100 max-w-xl">
              Pay ₹999 + GST to unlock your verified Golden badge, display direct WhatsApp & call buttons to clients, and get top placement in city listings.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setIsUpgradeModalOpen(true)}
            className="shrink-0 bg-white hover:bg-slate-100 text-[#ea580c] hover:text-[#c2410c] font-black px-6 h-11 rounded-xl shadow-md border-none cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-orange-600" /> Pay &amp; Upgrade to Premium
          </Button>
        </div>
      )}

      {/* Upgrade to Premium Modal */}
      <ActivatePremiumModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        user={userInfo}
        onSuccess={() => {
          dispatch(fetchCurrentUser() as any);
        }}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              This information will be displayed publicly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={photoPreview || undefined} alt={userInfo.name} />
                <AvatarFallback className="text-4xl">
                  {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "P"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo">Change Profile Picture</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A high-quality picture helps you get more clients.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  value={userInfo.email}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed.
                </p>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  id="role"
                  disabled
                  value={userInfo.role}
                  className="capitalize"
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input
                  id="companyName"
                  {...register("companyName")}
                  placeholder="Enter your company name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
            <CardDescription>
              Describe your expertise and experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="profession">Your Profession</Label>
              <Input
                id="profession"
                {...register("profession", {
                  required: "Profession is required",
                })}
              />
              {errors.profession && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.profession.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Your office or contact address"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                {...register("experience", {
                  required: "Experience is required",
                })}
                placeholder="e.g., 5-10 Years"
              />
              {errors.experience && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {isProfessional && (
              <>
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    {...register("qualification")}
                    placeholder="e.g., B.Arch, M.Arch"
                  />
                </div>
                <div>
                  <Label htmlFor="charges">Consultation Charges</Label>
                  <Input
                    id="charges"
                    {...register("charges")}
                    placeholder="e.g., ₹2000 per visit"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="skills">Skills / Expertise (Comma separated)</Label>
                  <Input
                    id="skills"
                    {...register("skills")}
                    placeholder="e.g., AutoCAD, 3DS Max, Revit, SketchUp"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="businessCertification">Business License / Certification (Optional)</Label>
                  <Input
                    id="businessCertification"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="mt-1 bg-white"
                  />
                  {userInfo.businessCertificationUrl && (
                    <p className="text-xs text-muted-foreground mt-2 font-medium">
                      Current License: <a href={userInfo.businessCertificationUrl} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">View Current License</a>
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Website & Social Media Links</CardTitle>
            <CardDescription>Add links to your official website and social media profiles to display on your public page (creates backlink).</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 bg-orange-50/50 p-4 rounded-xl border border-orange-200">
              <Label htmlFor="socialWebsite" className="font-bold text-orange-950 flex items-center gap-1.5">
                Official Website URL (Backlink)
              </Label>
              <Input 
                id="socialWebsite" 
                {...register("socialWebsite")} 
                placeholder="https://yourwebsite.com" 
                className="mt-1 bg-white border-orange-300 focus:border-orange-500"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Your website link will appear on your public profile and help drive direct organic backlink traffic.
              </p>
            </div>
            <div>
              <Label htmlFor="socialFacebook">Facebook URL</Label>
              <Input id="socialFacebook" {...register("socialFacebook")} placeholder="https://facebook.com/yourprofile" />
            </div>
            <div>
              <Label htmlFor="socialInstagram">Instagram URL</Label>
              <Input id="socialInstagram" {...register("socialInstagram")} placeholder="https://instagram.com/yourprofile" />
            </div>
            <div>
              <Label htmlFor="socialLinkedin">LinkedIn URL</Label>
              <Input id="socialLinkedin" {...register("socialLinkedin")} placeholder="https://linkedin.com/in/yourprofile" />
            </div>
            <div>
              <Label htmlFor="socialYoutube">YouTube Channel URL</Label>
              <Input id="socialYoutube" {...register("socialYoutube")} placeholder="https://youtube.com/c/yourchannel" />
            </div>
            <div>
              <Label htmlFor="socialTwitter">X (Twitter) URL</Label>
              <Input id="socialTwitter" {...register("socialTwitter")} placeholder="https://x.com/yourprofile" />
            </div>
            <div>
              <Label htmlFor="socialWhatsapp">WhatsApp Number/URL</Label>
              <Input id="socialWhatsapp" {...register("socialWhatsapp")} placeholder="https://wa.me/91XXXXXXXXXX" />
            </div>
            <div>
              <Label htmlFor="socialPinterest">Pinterest URL</Label>
              <Input id="socialPinterest" {...register("socialPinterest")} placeholder="https://pinterest.com/yourprofile" />
            </div>
            <div>
              <Label htmlFor="socialTelegram">Telegram URL</Label>
              <Input id="socialTelegram" {...register("socialTelegram")} placeholder="https://t.me/yourprofile" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="socialThreads">Threads URL</Label>
              <Input id="socialThreads" {...register("socialThreads")} placeholder="https://threads.net/@yourprofile" />
            </div>
          </CardContent>
        </Card>



        <Button
          type="submit"
          className="btn-primary"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Update Profile
            </>
          )}
        </Button>
      </form>

      {/* --- Subscription & Invoice Card --- */}
      {userInfo.selectedPlan && (
        <Card className="max-w-3xl mt-6">
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
                  type="button"
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

export default ProfilePageProf;
