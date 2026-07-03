"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Search, Save, Globe } from "lucide-react";

const SellerSEOPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [seoForm, setSeoForm] = useState({
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  useEffect(() => {
    fetchSeller();
  }, [id]);

  const fetchSeller = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo") || "{}").token}`,
          },
        }
      );
      setSeller(data);
      setSeoForm({
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        seoKeywords: data.seoKeywords || "",
      });
    } catch {
      toast.error("Failed to fetch seller details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSEO = async () => {
    try {
      setUpdating(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`,
        seoForm,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo") || "{}").token}`,
          },
        }
      );
      toast.success("Seller Store SEO updated successfully!");
      fetchSeller();
    } catch {
      toast.error("Failed to update SEO");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  const isSeller = seller?.role?.toLowerCase() === "seller";
  const isContractor = seller?.role?.toLowerCase() === "contractor";
  const isProfessional = seller?.role?.toLowerCase() === "professional";

  const pageTitle = isSeller
    ? "Seller Store SEO"
    : isProfessional
    ? `${seller?.profession || "Architect"} Profile SEO`
    : isContractor
    ? "Contractor Profile SEO"
    : "Profile SEO";

  const profileUrl = isSeller
    ? `${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://www.houseplanfiles.com"}/seller-shop/${id}`
    : isProfessional
    ? `${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://www.houseplanfiles.com"}/architects/${id}`
    : `${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://www.houseplanfiles.com"}/contractors/${id}`;

  const displayName = seller?.businessName || seller?.companyName || seller?.name || "User";

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="rounded-full h-12 w-12 p-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">
              {displayName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seller Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              {(seller?.shopImageUrl || seller?.photoUrl) && (
                <img
                  src={seller.shopImageUrl || seller.photoUrl}
                  alt={seller.businessName}
                  className="w-full h-48 object-cover rounded-2xl"
                />
              )}
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  {seller?.businessName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{seller?.city}</p>
                <p className="text-sm text-gray-500">{seller?.category}</p>
                <p className="text-sm text-gray-500">{seller?.businessType}</p>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className={`w-4 h-4 ${seoForm.seoTitle ? "text-green-500" : "text-gray-300"}`} />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {seoForm.seoTitle ? "SEO CONFIGURED" : "NO CUSTOM SEO"}
                  </span>
                </div>
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-600 hover:underline break-all"
                >
                  {profileUrl}
                </a>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4 text-xs text-orange-800 space-y-1">
                <p className="font-bold">💡 SEO Tips:</p>
                <p>• Meta Title: 50–60 characters ideal</p>
                <p>• Meta Description: 150–160 characters ideal</p>
                <p>• Keywords: comma-separated, location + product focus</p>
              </div>
            </div>
          </div>

          {/* SEO Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border-4 border-orange-600/10 space-y-8">
              <div className="flex items-center gap-3 border-b pb-6">
                <Search className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-black text-gray-900">
                  SEO Configuration for{" "}
                  <span className="text-orange-600 italic">
                    "{displayName}"
                  </span>
                </h2>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-500">
                  Meta Title
                </Label>
                <Input
                  value={seoForm.seoTitle}
                  onChange={(e) =>
                    setSeoForm({ ...seoForm, seoTitle: e.target.value })
                  }
                  placeholder={`e.g., ${displayName} – ${isSeller ? seller?.category + " in " + seller?.city : (seller?.city || "India")} | HousePlanFiles`}
                  className="h-14 rounded-2xl border-gray-100 focus:ring-orange-600"
                  maxLength={70}
                />
                <p className="text-[11px] text-gray-400">
                  {seoForm.seoTitle.length}/70 characters (50–60 recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-500">
                  Meta Description
                </Label>
                <Textarea
                  value={seoForm.seoDescription}
                  onChange={(e) =>
                    setSeoForm({ ...seoForm, seoDescription: e.target.value })
                  }
                  placeholder={`e.g., ${isSeller ? "Buy " + (seller?.category || "building materials") + " from " + displayName : displayName + " – Expert " + (seller?.profession || "Professional")} in ${seller?.city || "India"}. Verified on HousePlanFiles.`}
                  className="min-h-[120px] rounded-[2rem] border-gray-100 focus:ring-orange-600 p-6 resize-none"
                  maxLength={180}
                />
                <p className="text-[11px] text-gray-400">
                  {seoForm.seoDescription.length}/180 characters (150–160 recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-500">
                  Keywords (Comma separated)
                </Label>
                <Input
                  value={seoForm.seoKeywords}
                  onChange={(e) =>
                    setSeoForm({ ...seoForm, seoKeywords: e.target.value })
                  }
                  placeholder={`e.g., ${seller?.category?.toLowerCase() || "building material"}, ${seller?.city?.toLowerCase() || "india"}, ${seller?.businessType?.toLowerCase() || "supplier"}, buy online`}
                  className="h-14 rounded-2xl border-gray-100 focus:ring-orange-600"
                />
                <p className="text-[11px] text-gray-400">
                  Add location + product type keywords for best results.
                </p>
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleUpdateSEO}
                  disabled={updating}
                  className="w-full h-16 rounded-[2rem] bg-orange-600 hover:bg-orange-700 text-white font-black text-xl shadow-xl shadow-orange-600/30 gap-3"
                >
                  {updating ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : (
                    <Save className="w-6 h-6" />
                  )}
                  Save SEO Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default SellerSEOPage;
