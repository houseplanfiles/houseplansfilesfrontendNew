"use client";
import Image from "next/image";


import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { handleCallClick } from "@/utils/callHelper";
import React, { useState, useEffect, useMemo, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "@/components/MotionWrapper";
import { toast } from "sonner";
import { trackAnalytics } from "@/lib/analytics";
import {
  Loader2,
  ServerCrash,
  X,
  Send,
  MapPin,
  Store,
  ArrowLeft,
  Package,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Phone,
  MessageCircle,
  Info,
  Youtube
} from "lucide-react";

const getYouTubeID = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
import { RootState, AppDispatch } from "@/lib/store";
import { fetchPublicProductById, clearProduct } from "@/lib/features/seller/sellerProductSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/sellerinquiries/sellerinquirySlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialShare from "@/components/SocialShare";

// --- 1. MODAL COMPONENT ---
const InquiryModal = ({ product, onClose }: { product: any; onClose: () => void }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.sellerInquiries
  );
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    message: `Hi, I'm interested in "${product.name}". Please provide more details and the best price.`,
  });

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Inquiry Sent! Seller will contact you.");
      dispatch(resetActionStatus());
      onClose();
    }
    if (actionStatus === "failed") {
      toast.error(String(error || "Failed to send inquiry."));
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, onClose]);

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch(createInquiry({ ...formData, productId: product._id }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        <div className="bg-gray-900 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Inquiry for Product</h2>
            <p className="text-sm text-gray-400 mt-1">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={actionStatus === "loading"}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-md font-bold"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" /> Send Inquiry Now
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// --- 2. MAIN COMPONENT ---
interface SellerProductProps {
  initialProduct?: any;
}

const SellerProductDetailPage: FC<SellerProductProps> = ({ initialProduct }) => {
  const { productId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { product: reduxProduct, status, error } = useSelector(
    (state: RootState) => state.sellerProducts
  );
  const product = initialProduct || reduxProduct;
  
  const [selectedImage, setSelectedImage] = useState("");
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    if (productId) {
      if (!initialProduct) {
        dispatch(fetchPublicProductById(productId as string));
      }
      trackAnalytics('sellerProduct', productId as string, 'view');
    }
    // Cleanup: reset product state when leaving this page
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, productId, initialProduct]);

  useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image);
    }
  }, [product]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    return [product.image, ...(product.images || [])].filter(Boolean);
  }, [product]);

  if (!product && (status === "loading" || status === "idle")) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product && status === "failed") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <ServerCrash className="h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-bold">Product not found</h3>
          <p className="text-gray-500 mb-6">{String(error || "The product you're looking for doesn't exist.")}</p>
          <Button onClick={() => router.push("/marketplace")} variant="outline">Back to Marketplace</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        </div>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs / Back */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
           <Link href="/marketplace" className="hover:text-orange-600 transition-colors">Marketplace</Link>
           <span>/</span>
           {product?.seller && (
             <>
               <Link href={`/seller-shop/${product.seller._id}`} className="hover:text-orange-600 transition-colors">
                 {product.seller.businessName}
               </Link>
               <span>/</span>
             </>
           )}
           <span className="text-gray-900 font-medium truncate max-w-[200px]">{product?.name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left: Image Gallery */}
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 lg:col-span-7 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col">
              <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-white shadow-inner mb-4 border border-gray-200 group flex items-center justify-center">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.seoAltText || product.name}
                    className="max-w-full max-h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Package size={64} className="text-gray-300" />
                )}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm pointer-events-none">
                  <ZoomIn size={20} className="text-gray-500" />
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="flex flex-wrap gap-3 mt-auto">
                  {galleryImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-white flex items-center justify-center ${
                        selectedImage === img ? "border-orange-600 shadow-md scale-105" : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="max-w-full max-h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="p-6 lg:p-10 flex flex-col lg:col-span-5 bg-white">
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {product.brand}
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-baseline flex-wrap gap-3 mb-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-orange-600">
                      ₹{(product.salePrice > 0 && product.salePrice < product.price ? product.salePrice : product.price).toLocaleString()}
                    </span>
                    {product.unit && (
                      <span className="text-lg text-gray-500 font-bold bg-gray-100 px-2.5 py-1 rounded-lg">
                        / {product.unit}
                      </span>
                    )}
                  </div>
                  {product.salePrice > 0 && product.salePrice < product.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-400 line-through">₹{product.price.toLocaleString()}</span>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                        {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Rating & Social Sharing */}
                <div className="flex flex-col gap-5 mb-8 py-5 border-y border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400 text-lg">
                      {"★".repeat(Math.round(product.rating || 4.8))}
                      {"☆".repeat(5 - Math.round(product.rating || 4.8))}
                    </div>
                    <span className="text-gray-900 font-bold">{product.rating || "4.8"}</span>
                    <span className="text-gray-400 text-sm font-medium">({product.reviewsCount || "12"} reviews)</span>
                  </div>

                  <SocialShare 
                    url={typeof window !== 'undefined' ? window.location.href : ''} 
                    title={product.name} 
                    phone={product.seller?.phone} 
                  />
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm">Verified Product from Authorized Seller</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={18} className="text-orange-500 flex-shrink-0" />
                    <span className="text-sm">Available in {product.city || "All India"}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-3">
                {product.seller?.contractorType === "Premium" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => {
                        trackAnalytics('user', product.seller._id, 'whatsapp_click');
                        const waLink = `https://wa.me/91${product.seller.phone}?text=${encodeURIComponent(`Hi ${product.seller.businessName}, I am interested in your product: "${product.name}".`)}`;
                        window.open(waLink, "_blank");
                      }}
                      className="w-full h-12 sm:h-14 bg-[#25D366] hover:bg-[#128C7E] text-white text-base sm:text-lg font-bold rounded-xl shadow-md transform transition hover:-translate-y-0.5"
                    >
                      <MessageCircle className="mr-2 sm:mr-3 h-5 w-5" /> WhatsApp
                    </Button>
                    <Button 
                      onClick={() => {
                        trackAnalytics('user', product.seller._id, 'call_click');
                        window.location.href = `tel:${product.seller.phone}`;
                      }}
                      className="w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg font-bold rounded-xl shadow-md transform transition hover:-translate-y-0.5"
                    >
                      <Phone className="mr-2 sm:mr-3 h-5 w-5" /> Call Now
                    </Button>
                  </div>
                )}
                
                <Button 
                  onClick={() => setIsInquiryOpen(true)}
                  className={`w-full h-12 sm:h-14 ${product.seller?.contractorType === "Premium" ? "bg-gray-900" : "bg-orange-600"} hover:opacity-90 text-white text-base sm:text-lg font-bold rounded-xl shadow-md transform transition hover:-translate-y-0.5`}
                >
                  <Send className="mr-2 sm:mr-3 h-5 w-5" /> Send Inquiry
                </Button>
                
                {product.seller && (
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/seller-shop/${product.seller._id}`)}
                    className="w-full h-12 sm:h-14 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-base sm:text-lg font-bold rounded-xl transition-all"
                  >
                    <Store className="mr-2 sm:mr-3 h-5 w-5" /> Visit Seller Shop
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Product Description Section */}
        {product.description && (
          <div className="mt-8 bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-orange-600" />
              Product Description
            </h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
              {product.description}
            </div>
          </div>
        )}

        {/* YouTube Video Section */}
        {product.youtubeLink && getYouTubeID(product.youtubeLink) && (
          <div className="mt-8 bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Youtube className="w-6 h-6 text-red-600" />
              Product Video
            </h3>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeID(product.youtubeLink)}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Seller Minimal Card */}
        {product.seller && (
          <div className="mt-12 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0 overflow-hidden">
                 {product.seller.photoUrl ? (
                   <Image src={product.seller.photoUrl || "/contractor.jpeg"} alt="Seller" fill className="object-cover rounded-2xl" sizes="(max-width: 768px) 50vw, 33vw" />
                 ) : (
                   <Store size={32} />
                 )}
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sold By</p>
                <h4 className="text-xl font-bold text-gray-900">{product.seller.businessName}</h4>
                {((product.seller.natureOfBusiness && product.seller.natureOfBusiness.length > 0) || product.seller.businessType) && (
                  <p className="text-xs font-semibold text-orange-600 mt-1">
                    {product.seller.natureOfBusiness && product.seller.natureOfBusiness.length > 0 && product.seller.natureOfBusiness.join(" • ")}
                    {product.seller.businessType && (
                      <>
                        {product.seller.natureOfBusiness && product.seller.natureOfBusiness.length > 0 && " • "}
                        ({
                          product.seller.businessType === "Manufacturer" ? "🏭 Manufacturer" :
                          product.seller.businessType === "Supplier" ? "🚛 Supplier" :
                          product.seller.businessType === "Both" ? "🏭 Manufacturer & Supplier" :
                          product.seller.businessType === "Retail" ? "🏪 Retail Shop" :
                          product.seller.businessType
                        })
                      </>
                    )}
                  </p>
                )}
                {product.seller.gstNumber && (
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">GST: {product.seller.gstNumber}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-8">
               <div className="text-center md:text-left">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold text-gray-700">{product.seller.businessAddress || product.seller.address || product.seller.city || "India"}</p>
               </div>
               <Link href={`/seller-shop/${product.seller._id}`}
                className="bg-gray-100 hover:bg-orange-600 hover:text-white text-gray-900 px-6 py-3 rounded-xl font-bold transition-all text-sm"
               >
                 View Store
               </Link>
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {isInquiryOpen && (
          <InquiryModal product={product} onClose={() => setIsInquiryOpen(false)} />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default SellerProductDetailPage;
