"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import {
  updateProfile,
  resetActionStatus,
} from "@/lib/features/users/userSlice";
import axios from "axios";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";

import { Button } from "@/components/ui/button";
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
  socialFacebook?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  socialYoutube?: string;
  socialTwitter?: string;
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
          setValue("socialFacebook", userInfo.socialLinks.facebook || "");
          setValue("socialInstagram", userInfo.socialLinks.instagram || "");
          setValue("socialLinkedin", userInfo.socialLinks.linkedin || "");
          setValue("socialYoutube", userInfo.socialLinks.youtube || "");
          setValue("socialTwitter", userInfo.socialLinks.twitter || "");
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
      toast.error(String(error || "Failed to update profile."));
      dispatch(resetActionStatus());
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
      facebook: data.socialFacebook || "",
      instagram: data.socialInstagram || "",
      linkedin: data.socialLinkedin || "",
      youtube: data.socialYoutube || "",
      twitter: data.socialTwitter || "",
    };
    dataToSubmit.append("socialLinks", JSON.stringify(socialLinks));

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

  return (
    <div className="space-y-6 p-4 md:p-6">
      
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
      <p className="text-gray-600">
        Update your public profile and account details.
      </p>

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
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Add links to your social media profiles to display on your public page.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="md:col-span-2">
              <Label htmlFor="socialTwitter">X (Twitter) URL</Label>
              <Input id="socialTwitter" {...register("socialTwitter")} placeholder="https://x.com/yourprofile" />
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
