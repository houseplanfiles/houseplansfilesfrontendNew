"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import {
  updateProfile,
  resetActionStatus,
} from "@/lib/features/users/userSlice";

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
                    {["Building Material", "Home Decor", "Furniture", "Chemical Product", "Machinery"].map((c) => (
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
              <div className="md:col-span-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  placeholder="Enter detailed business address"
                />
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
    </div>
  );
};

export default SellerProfilePage;
