"use client";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { handleCallClick } from "@/utils/callHelper";
import React, { useState, useEffect, useMemo, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "@/components/MotionWrapper";
import { toast } from "sonner";
import {
  Loader2,
  ServerCrash,
  Search,
  Package,
  X,
  Send,
  MapPin,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Store,
  MessageCircle,
  Phone,
} from "lucide-react";

// Helmet ko import kiya gaya hai

import { RootState, AppDispatch } from "@/lib/store";
import { fetchPublicSellerProducts } from "@/lib/features/seller/sellerProductSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/sellerinquiries/sellerinquirySlice";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
// --- 1. FULL SCREEN IMAGE VIEWER ---
const ImageViewModal = ({ imageUrl, onClose }: any) => {
  if (!imageUrl) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-5 right-5 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-red-600/80 rounded-full p-3 transition-all cursor-pointer shadow-lg border border-white/20"
      >
        <X size={32} />
      </button>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-7xl w-full h-full flex items-center justify-center pointer-events-none"
      >
        <img
          src={imageUrl}
          alt="Full View"
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </motion.div>
  );
};
// --- 2. INQUIRY MODAL ---
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
    message: `Hi, I saw your listing for "${product.name}" on the marketplace. Please send me the best price.`,
  });
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Inquiry Sent! Seller will contact you.");
      dispatch(resetActionStatus());
      onClose();
    }
    if (actionStatus === "failed") {
      toast.error(String(error || "Failed to send."));
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
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        <div className="bg-gray-900 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Contact Seller</h2>
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
                rows={3}
                className="mt-1 resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={actionStatus === "loading"}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-md font-medium"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Inquiry
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
// --- 3. PRODUCT CARD (Optimized for Mobile 2-Cols) ---
const ProductCard = ({ product, onInquiryClick, onImageClick }: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full"
  >
    <div
      className="relative h-36 sm:h-64 overflow-hidden bg-gray-100 cursor-zoom-in"
      onClick={() => onImageClick(product.image)}
    >
      <Image
        src={product.image || "/marketplace_banner.png"}
        alt={product.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-md px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold text-gray-700 flex items-center gap-1 shadow-sm z-10">
        <MapPin size={10} className="sm:w-3 sm:h-3 text-orange-500" />
        <span className="truncate max-w-[60px] sm:max-w-none">
          {product.city}
        </span>
      </div>
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
        <div className="bg-orange-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-[8px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm z-10 inline-block w-max">
          {product.category}
        </div>
        {product.seller?.businessType && (
          <div className="bg-green-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-[8px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm z-10 inline-block w-max">
            {product.seller.businessType === "Manufacturer" && "🏭 Manufacturer"}
            {product.seller.businessType === "Supplier" && "🚛 Supplier"}
            {product.seller.businessType === "Both" && "🏭 Manufacturer & Supplier"}
            {product.seller.businessType === "Retail" && "🏪 Retail Shop"}
          </div>
        )}
      </div>
    </div>
    <div className="p-3 sm:p-5 flex flex-col flex-grow">
      <div className="mb-2">
        <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight line-clamp-2 sm:line-clamp-1 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-gray-400 mt-1 truncate">
          By: <span className="font-medium text-gray-600">{product.seller?.businessName || "Verified Seller"}</span>
        </p>
      </div>
      <div className="mt-auto pt-2 sm:pt-4 border-t border-gray-50 flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="hidden sm:block text-xs text-gray-400">Price</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-xl font-extrabold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.unit && (
              <span className="text-[10px] sm:text-xs text-gray-400 font-bold">
                / {product.unit}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full mt-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onInquiryClick(product);
            }}
            className="w-full h-8 sm:h-10 text-xs sm:text-sm bg-gray-900 hover:bg-orange-600 text-white rounded-lg px-3 transition-colors"
          >
            {(product.seller?.businessType === "Manufacturer" || product.seller?.businessType === "Both") ? "Get Bulk Quote" : "Enquiry"}
          </Button>

          {(product.seller?.contractorType === "Verified" || product.seller?.contractorType === "Premium" || product.seller?.role === "Premium") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://wa.me/91${product.seller.phone}?text=${encodeURIComponent(`Hi ${product.seller.businessName}, I'm interested in: ${product.name}`)}`, "_blank");
                }}
                className="w-full h-8 sm:h-10 text-[11px] sm:text-xs bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg px-0 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> WhatsApp
              </Button>
              {(product.seller?.contractorType === "Premium" || product.seller?.role === "Premium") ? (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `tel:${product.seller.phone}`;
                  }}
                  className="w-full h-8 sm:h-10 text-[11px] sm:text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-0 transition-colors flex items-center justify-center"
                >
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Call Now
                </Button>
              ) : (
                <div /> // Empty placeholder for grid
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

// --- 4. SHOP CARD (Main Grid Item) ---
const ShopCard = ({ seller, productCount, products }: { seller: any; productCount: number; products: any[] }) => {
  const router = useRouter();
  // We use the seller's photo, falling back to the first product's image
  const displayImage = seller.photoUrl || products[0]?.image || "https://via.placeholder.com/400x300";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full cursor-pointer"
      onClick={() => router.push(`/seller-shop/${seller._id}`)}
    >
      <div className="relative h-48 sm:h-64 overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={seller.businessName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

        {/* City Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1 shadow-sm z-10 max-w-[85%]">
          <MapPin size={12} className="text-orange-500 flex-shrink-0" />
          <span className="truncate">
            {[seller.businessAddress, seller.address, seller.city, seller.pincode].filter(Boolean).join(", ") || products[0]?.city || "India"}
          </span>
        </div>

        {/* Badges Container - stacked vertically to prevent overlap */}
        <div className="absolute bottom-3 left-3 flex flex-col items-start gap-1.5 z-10 max-w-[calc(100%-1.5rem)]">
          {/* Business Type Badge */}
          {seller.businessType && (
            <div className="bg-green-600 text-white px-2.5 py-1 rounded-md text-[11px] font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap">
              {seller.businessType === "Manufacturer" && "🏭 Manufacturer"}
              {seller.businessType === "Supplier" && "🚛 Supplier"}
              {seller.businessType === "Both" && "🏭 Manufacturer & Supplier"}
              {seller.businessType === "Retail" && "🏪 Retail Shop"}
            </div>
          )}
          {/* Product Count Badge */}
          <div className="bg-orange-600 text-white px-2.5 py-1 rounded-md text-[11px] font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <Package size={13} /> {productCount} Items
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base sm:text-xl font-extrabold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors uppercase">
            {seller.businessName || "Verified Shop"}
          </h3>
        </div>

        {seller.charges && (
          <p className="text-xs text-orange-600 font-bold mb-1 border-b border-gray-50 pb-1">Starting from: {seller.charges}</p>
        )}

        <p className="text-xs text-gray-500 mb-4 line-clamp-1 mt-1">
          Explore collection of {products[0]?.category} and more.
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50">
          <Button className="w-full bg-gray-900 hover:bg-orange-600 text-white rounded-lg h-10 sm:h-11 font-bold">
            Visit Store <Store size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// --- 4. MAIN PAGE ---
const SellersSection: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { products, status, error } = useSelector(
    (state: RootState) => state.sellerProducts
  );

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShopCategory, setSelectedShopCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("all-cities");
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [selectedBusinessType, setSelectedBusinessType] = useState("All");
  const [selectedMaterialType, setSelectedMaterialType] = useState("All");

  // Fixed shop categories
  const SHOP_CATEGORIES = [
    "All",
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
  ];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const handleOpenInquiry = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchPublicSellerProducts({ limit: 8 }));
  }, [dispatch]);

  // Unique Categories & Cities from products
  const uniqueCategories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(),
    ],
    [products]
  );
  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    products.forEach(p => {
      if (p.city) cities.add(p.city.trim());
      if (p.seller?.city) cities.add(p.seller.city.trim());
    });
    return [
      "All Cities",
      ...Array.from(cities).sort((a, b) => a.localeCompare(b))
    ];
  }, [products]);

  const uniqueMaterialTypes = useMemo(() => {
    const materials = new Set<string>();
    products.forEach(p => {
      if (p.seller?.materialType) materials.add(p.seller.materialType.trim());
    });
    return [
      "All",
      ...Array.from(materials).sort((a, b) => a.localeCompare(b))
    ];
  }, [products]);

  // Display Items Logic
  const displayItems = useMemo(() => {
    // 1. First filter products by search/category/city/businessType/materialType
    let filteredItems = products;
    if (selectedShopCategory !== "All")
      filteredItems = filteredItems.filter((p) =>
        p.seller?.category === selectedShopCategory ||
        p.category === selectedShopCategory ||
        p.seller?.materialType?.toLowerCase().includes(selectedShopCategory.toLowerCase())
      );
    if (selectedCity !== "all-cities")
      filteredItems = filteredItems.filter((p) => p.city === selectedCity || p.seller?.city === selectedCity);
    if (selectedBusinessType !== "All") {
      filteredItems = filteredItems.filter((p) => {
        const type = p.seller?.businessType;
        return type === selectedBusinessType;
      });
    }
    if (selectedMaterialType !== "All") {
      filteredItems = filteredItems.filter((p) => p.seller?.materialType === selectedMaterialType);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.seller?.businessName?.toLowerCase().includes(lower) ||
          (p.city && p.city.toLowerCase().includes(lower))
      );
    }
    if (selectedPincode) {
      const pin = selectedPincode.trim().toLowerCase();
      filteredItems = filteredItems.filter((p) =>
        (p.pincode && String(p.pincode).toLowerCase().includes(pin)) ||
        (p.address && String(p.address).toLowerCase().includes(pin)) ||
        (p.seller?.address && String(p.seller.address).toLowerCase().includes(pin)) ||
        (p.seller?.businessAddress && String(p.seller.businessAddress).toLowerCase().includes(pin)) ||
        (p.seller?.pincode && String(p.seller.pincode).toLowerCase().includes(pin))
      );
    }

    // 2. Separate into Shop vs Product based on Premium status
    const itemsList: any[] = [];
    const premiumShopsMap = new Map();

    filteredItems.forEach((p) => {
      if (!p.seller) return;

      const isPremium = p.seller.contractorType === "Premium" || p.seller.role === "Premium";

      if (isPremium) {
        const sellerId = p.seller._id;
        if (!premiumShopsMap.has(sellerId)) {
          premiumShopsMap.set(sellerId, {
            type: 'shop',
            seller: p.seller,
            products: [],
            id: 'shop_' + sellerId
          });
        }
        premiumShopsMap.get(sellerId).products.push(p);
      } else {
        itemsList.push({
          type: 'product',
          product: p,
          id: 'prod_' + p._id
        });
      }
    });

    const finalItems = [...Array.from(premiumShopsMap.values()), ...itemsList];

    // Sorting Logic: 1st Premium, 2nd Standard (Verified), 3rd Free (Normal)
    const getTierValue = (type: string) => {
      if (type === "Premium") return 3;
      if (type === "Verified" || type === "Standard") return 2;
      return 1;
    };

    finalItems.sort((a, b) => {
      const sellerA = a.type === 'shop' ? a.seller : a.product.seller;
      const sellerB = b.type === 'shop' ? b.seller : b.product.seller;

      const tierA = getTierValue(sellerA?.contractorType || sellerA?.role);
      const tierB = getTierValue(sellerB?.contractorType || sellerB?.role);

      if (tierA !== tierB) {
        return tierB - tierA; // Higher tier comes first
      }

      // Within Premium (or same tier): sort by number of projects/work samples
      const projectsA = sellerA?.workSamples?.length || 0;
      const projectsB = sellerB?.workSamples?.length || 0;
      if (projectsA !== projectsB) {
        return projectsB - projectsA; // More projects come first
      }

      // Then by profile update recency
      const updatedA = new Date(sellerA?.updatedAt || 0).getTime();
      const updatedB = new Date(sellerB?.updatedAt || 0).getTime();
      return updatedB - updatedA; // Recently updated come first
    });

    return finalItems;
  }, [products, searchTerm, selectedShopCategory, selectedCity, selectedBusinessType, selectedMaterialType, selectedPincode]);

  return (
    <div className="flex flex-col bg-gray-50/50 pt-10">

      {/* --- Banner --- */}
      <div className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/marketplace_banner.png" alt="Marketplace" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center z-10 flex flex-col justify-center items-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-4 drop-shadow-md"
          >
            Marketplace
          </motion.h2>
          <div className="h-1 w-20 md:w-24 bg-orange-600 mx-auto rounded-full mb-6"></div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-200 text-sm md:text-base max-w-2xl mx-auto mb-8 font-medium"
          >
            Discover verified building material stores and interior showrooms.
          </motion.p>

          <Button
            onClick={() => router.push("/register")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-5 px-8 rounded-full shadow-lg hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1 text-base flex items-center gap-2"
          >
            <Store className="w-5 h-5" /> Register Your Shop
          </Button>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-16 relative z-20 pb-20 w-full">
        {/* --- Filters Card --- */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 md:p-8 mb-8 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2">
              <Label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Search Shop or Product</Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="What are you looking for?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 text-base rounded-xl focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Business Type</Label>
              <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Both">Manufacturer &amp; Supplier Both</SelectItem>
                  <SelectItem value="Retail">Retail Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Category</Label>
              <Select value={selectedShopCategory} onValueChange={setSelectedShopCategory}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHOP_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Material Type</Label>
              <Select value={selectedMaterialType} onValueChange={setSelectedMaterialType}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {uniqueMaterialTypes.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">City</Label>
              <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cityPopoverOpen}
                    className="h-12 w-full justify-between bg-gray-50 border-gray-200 rounded-xl text-sm font-normal hover:bg-white transition-colors"
                  >
                    {selectedCity === "all-cities" ? "All Cities" : selectedCity}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0 z-[100]" align="start">
                  <div className="flex items-center border-b px-3 bg-white">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      placeholder="Search city..."
                      value={citySearchTerm}
                      onChange={(e) => setCitySearchTerm(e.target.value)}
                      className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="max-h-72 overflow-y-auto p-1 bg-white">
                    {uniqueCities
                      .filter(city => city.toLowerCase().includes(citySearchTerm.toLowerCase().trim()))
                      .map((city) => (
                        <div
                          key={city}
                          className={cn(
                            "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-orange-50 hover:text-orange-600 transition-colors",
                            (selectedCity.toLowerCase().trim() === city.toLowerCase().trim() || (city === "All Cities" && selectedCity === "all-cities")) ? "bg-orange-100 text-orange-700 font-semibold" : "text-gray-700"
                          )}
                          onClick={() => {
                            setSelectedCity(city === "All Cities" ? "all-cities" : city);
                            setCityPopoverOpen(false);
                            setCitySearchTerm("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              (selectedCity === city || (city === "All Cities" && selectedCity === "all-cities")) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {city}
                        </div>
                      ))}
                    {uniqueCities.filter(city => city.toLowerCase().includes(citySearchTerm.toLowerCase())).length === 0 && (
                      <div className="py-4 text-center text-sm text-gray-500">No city found.</div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Pincode</Label>
              <Input
                placeholder="e.g. 110001"
                value={selectedPincode}
                onChange={(e) => setSelectedPincode(e.target.value)}
                className="h-12 bg-gray-50 border-gray-200 text-base rounded-xl focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* --- Shops Grid --- */}
        {status === "loading" ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
          </div>
        ) : status === "failed" ? (
          <div className="py-20 text-center bg-white rounded-3xl shadow-inner">
            <ServerCrash className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold">Connection Error</h3>
            <p className="text-gray-500">{String(error)}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Marketplace Results</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{displayItems.length} ITEMS</span>
            </div>

            {displayItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                <AnimatePresence mode="popLayout">
                  {displayItems.map((item) => (
                    item.type === 'shop' ? (
                      <ShopCard
                        key={item.id}
                        seller={item.seller}
                        productCount={item.products.length}
                        products={item.products}
                      />
                    ) : (
                      <ProductCard
                        key={item.id}
                        product={item.product}
                        onInquiryClick={handleOpenInquiry}
                        onImageClick={setFullScreenImage}
                      />
                    )
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <Store className="h-20 w-20 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900">No items found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to find sellers in your area.</p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedShopCategory("All");
                    setSelectedCity("all-cities");
                    setSelectedBusinessType("All");
                    setSelectedMaterialType("All");
                    setSelectedPincode("");
                  }}
                  variant="link"
                  className="mt-4 text-orange-600 font-bold"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* --- Modals Overlay --- */}
      <AnimatePresence>
        {isModalOpen && (
          <InquiryModal
            product={selectedProduct}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        {fullScreenImage && (
          <ImageViewModal
            imageUrl={fullScreenImage}
            onClose={() => setFullScreenImage(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default SellersSection;
