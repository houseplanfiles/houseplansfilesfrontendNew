"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  Loader2,
  ServerCrash,
  Download,
  Filter,
  Heart,
  ChevronLeft,
  ChevronRight,
  Lock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/use-toast";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { submitCustomizationRequest } from "@/lib/features/customization/customizationSlice";

import useDebounce from "@/hooks/useDebounce";
import { useCurrency } from "@/contexts/CurrencyContext"; // Currency Context जोड़ा गया
import DisplayPrice from "@/components/DisplayPrice"; // DisplayPrice कंपोनेंट जोड़ा गया

const themes = [
  "Modern Theme",
  "Contemporary Theme",
  "Minimalist Theme",
  "Traditional Theme",
  "Industrial Theme",
  "Bohemian (Boho) Theme",
  "Scandinavian Theme",
  "Rustic Theme",
  "Transitional Theme",
  "Eclectic Theme",
];

const FilterSidebar = ({
  filters,
  setFilters,
  isOpen,
  onClose,
  selectedCategories = [],
  setSelectedCategories,
}: any) => {
  const categoryOptions = [
    { id: "full-house", label: "Full House (पूरा घर)", value: "Full House" },
    { id: "bedroom", label: "Bedroom (बेडरूम)", value: "Bedroom" },
    { id: "drawing-room", label: "Drawing Room (ड्राइंग रूम)", value: "Drawing Room" },
    { id: "living-room", label: "Living Room (लिविंग रूम)", value: "Living Room" },
    { id: "kitchen", label: "Kitchen (किचन)", value: "Kitchen" },
    { id: "terrace-garden", label: "Terrace Garden (छत का बगीचा / टेरेस गार्डन)", value: "Terrace Garden" },
    { id: "outdoor", label: "Outdoor (बाहरी हिस्सा / आउटडोर)", value: "Outdoor" },
    { id: "dining", label: "Dining (डाइनिंग एरिया)", value: "Dining" },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-120px)]
          w-80 sm:w-96 lg:w-full
          p-4 sm:p-6 bg-white rounded-none lg:rounded-xl 
          shadow-2xl lg:shadow-lg border-r lg:border border-gray-200 
          z-50 lg:z-auto overflow-y-auto
          lg:top-[100px]
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close filters"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
          <Filter className="w-5 h-5 mr-2 text-gray-500" />
          Filters
        </h3>
        <div className="space-y-4 sm:space-y-6">
          {/* Readymade Interior Designs Categories */}
          <div className="border-b border-gray-200 pb-4">
            <Label className="font-bold text-gray-800 text-sm sm:text-base mb-3 block">
              Categories
            </Label>
            <div className="space-y-2.5 mt-2">
              {categoryOptions.map((option) => (
                <label key={option.id} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-orange-600 border-gray-300 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer accent-orange-600"
                    checked={selectedCategories.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, option.value]);
                      } else {
                        setSelectedCategories(selectedCategories.filter((c: string) => c !== option.value));
                      }
                    }}
                  />
                  <span className="text-xs sm:text-sm text-gray-600 group-hover:text-orange-600 transition-colors font-medium">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label
              htmlFor="theme"
              className="font-semibold text-gray-600 text-sm sm:text-base"
            >
              Theme
            </Label>
            <Select
              value={filters.theme}
              onValueChange={(value) =>
                setFilters((prev: any) => ({ ...prev, theme: value }))
              }
            >
              <SelectTrigger
                id="theme"
                className="mt-2 bg-gray-100 border-transparent h-11 sm:h-12"
              >
                <SelectValue placeholder="Select Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                {themes.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="propertyType"
              className="font-semibold text-gray-600 text-sm sm:text-base"
            >
              Property Type
            </Label>
            <Select
              value={filters.propertyType}
              onValueChange={(value) =>
                setFilters((prev: any) => ({ ...prev, propertyType: value }))
              }
            >
              <SelectTrigger
                id="propertyType"
                className="mt-2 bg-gray-100 border-transparent h-11 sm:h-12"
              >
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-semibold text-gray-600 text-sm sm:text-base">
              Budget: ₹{filters.budget[0].toLocaleString()} - ₹
              {filters.budget[1].toLocaleString()}
            </Label>
            <Slider
              value={filters.budget}
              onValueChange={(value) =>
                setFilters((prev: any) => ({
                  ...prev,
                  budget: value as [number, number],
                }))
              }
              max={50000}
              min={500}
              step={100}
              className="mt-3"
            />
          </div>
          <Button
            onClick={() => {
              setFilters({
                theme: "all",
                category: "all",
                roomType: "all",
                propertyType: "all",
                budget: [500, 50000],
              });
              setSelectedCategories([]);
              onClose?.();
            }}
            variant="outline"
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </motion.aside>
    </>
  );
};

const CustomizeInteriorForm = ({ userInfo, dispatch, toast }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    project: "",
    mobile: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        name: userInfo.name || userInfo.businessName || "",
      }));
    }
  }, [userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.project || !formData.mobile) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const apiData = new FormData();
    apiData.append("name", formData.name);
    apiData.append("countryName", formData.city); // Map City to countryName
    apiData.append("description", formData.project); // Map Project to description
    apiData.append("whatsappNumber", formData.mobile); // Map Mobile to whatsappNumber
    apiData.append("email", userInfo?.email || "inquiry@houseplanfiles.com");
    apiData.append("requestType", "Interior Design");

    try {
      await (dispatch as any)(submitCustomizationRequest(apiData)).unwrap();
      toast({
        title: "Success",
        description: "Your customization inquiry has been submitted successfully! We will contact you soon.",
      });
      setFormData({
        name: userInfo?.name || userInfo?.businessName || "",
        city: "",
        project: "",
        mobile: "",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err || "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-lg w-full sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-orange-500 rounded-full block"></span>
        Customize your Interior
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
          <input
            type="text"
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="Your City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Project</label>
          <input
            type="text"
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="Project Description"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile No.</label>
          <input
            type="tel"
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="Mobile / WhatsApp"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-all shadow-md shadow-orange-500/10"
        >
          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </Button>
      </form>
    </div>
  );
};

const ProductCard = ({ product, userOrders }: any) => {
  const router = useRouter();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { symbol, rate } = useCurrency(); // Currency हुक जोड़ा गया

  const isWishlisted = isInWishlist(product._id);
  const productName =
    product.name || product.planName || product.Name || "Interior Design";
  const linkTo =
    product.source === "admin"
      ? `/house-plans/${product._id}`
      : `/professional-plan/${product._id}`;
  const hasPurchased = userOrders?.some(
    (order: any) =>
      order.isPaid &&
      order.orderItems?.some(
        (item: any) =>
          item.productId === product._id || item.productId?._id === product._id
      )
  );

  const handleDownload = async () => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to download.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }
    if (!hasPurchased) {
      toast({
        title: "Not Purchased",
        description: "Please purchase this plan to download it.",
        variant: "destructive",
      });
      router.push(linkTo);
      return;
    }
    const planFileUrl =
      (Array.isArray(product.planFile)
        ? product.planFile[0]
        : product.planFile) || product["Download 1 URL"];
    if (!planFileUrl) {
      toast({
        title: "Error",
        description: "No downloadable file found.",
        variant: "destructive",
      });
      return;
    }
    try {
      toast({ title: "Success", description: "Your download is starting..." });
      const response = await fetch(planFileUrl);
      if (!response.ok) throw new Error("Network response was not ok.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileExtension =
        planFileUrl.split(".").pop()?.split("?")[0] || "pdf";
      a.download = `Interior-${productName.replace(/\s+/g, "-")}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Error",
        description: "Failed to download the file.",
        variant: "destructive",
      });
    }
  };

  const regularPrice = product.price || product["Regular price"] || 0;
  const salePrice = product.salePrice || product["Sale price"] || 0;
  const isSale = salePrice > 0 && salePrice < regularPrice;
  const displayPrice = isSale ? salePrice : regularPrice;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative p-2">
        <Link href={linkTo}>
          <img
            src={
              product.mainImage ||
              product.image ||
              product.Images?.split(",")[0] ||
              house3
            }
            alt={productName}
            className="w-full h-40 sm:h-48 object-cover rounded-md group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {isSale && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-red-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-md shadow">
            Sale!
          </div>
        )}
        {hasPurchased && (
          <div className="absolute top-2 right-12 sm:right-14 bg-green-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-md z-10">
            Purchased
          </div>
        )}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              if (!userInfo) {
                toast({
                  title: "Login Required",
                  description: "Please log in to add items to your wishlist.",
                  variant: "destructive",
                });
                router.push("/login");
                return;
              }
              isWishlisted
                ? removeFromWishlist(product._id)
                : addToWishlist(product);
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted ? "text-red-500 scale-110" : "text-gray-600 hover:text-red-500 hover:scale-110"}`}
            aria-label="Toggle Wishlist"
          >
            <Heart
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="py-2">
            <p className="text-xs text-gray-500">Style</p>
            <p className="font-bold text-sm sm:text-base text-gray-800 truncate">
              {product.style || product.category || "N/A"}
            </p>
          </div>
          <div className="bg-teal-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Room Type</p>
            <p className="font-bold text-sm sm:text-base text-gray-800 truncate">
              {product.roomType || product.size || "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4 pt-2">
        <p className="text-xs text-gray-500 uppercase">
          {Array.isArray(product.category)
            ? product.category[0]
            : product.category || "Interior Design"}
        </p>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-1 truncate">
          {productName}
        </h3>
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          {isSale && (
            <s className="text-sm sm:text-md text-gray-400">
              <DisplayPrice inrPrice={regularPrice} />
            </s>
          )}
          <span className="text-lg sm:text-xl font-bold text-gray-800">
            <DisplayPrice inrPrice={displayPrice} />
          </span>
          {isSale &&
            parseFloat(String(regularPrice)) > 0 &&
            parseFloat(String(displayPrice)) > 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                SAVE {symbol}
                {(
                  (parseFloat(String(regularPrice)) -
                    parseFloat(String(displayPrice))) *
                  rate
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
        </div>
      </div>
      <div className="p-3 sm:p-4 pt-2 mt-auto grid grid-cols-1 gap-2">
        <Link href={linkTo}>
          <Button
            variant="outline"
            className="w-full text-sm sm:text-base bg-gray-800 text-white hover:bg-gray-700 py-2"
          >
            Read more
          </Button>
        </Link>
        <Button
          className={`w-full text-sm sm:text-base text-white rounded-md py-2 ${hasPurchased ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-400 cursor-not-allowed"}`}
          onClick={handleDownload}
          disabled={!hasPurchased}
        >
          {hasPurchased ? (
            <>
              <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Download PDF
            </>
          ) : (
            <>
              <Lock className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Purchase to Download
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

const InteriorDesignsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();

  const {
    products: adminProducts,
    count: adminCount,
    pages: adminPages,
    listStatus: adminListStatus,
    error: adminError,
  } = useSelector((state: RootState) => state.products);
  const {
    plans: professionalPlans,
    listStatus: profListStatus,
    error: profError,
  } = useSelector((state: RootState) => state.professionalPlans);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.orders);

  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    theme: "all",
    category: "all",
    roomType: "all",
    propertyType: "all",
    budget: [500, 50000] as [number, number],
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jumpToPage, setJumpToPage] = useState("");
  const CARDS_PER_PAGE = 12;

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const params: any = {
      pageNumber: currentPage,
      limit: CARDS_PER_PAGE,
      planCategory: "interior-designs",
    };
    if (debouncedFilters.theme !== "all") params.theme = debouncedFilters.theme;
    if (debouncedFilters.roomType !== "all")
      params.roomType = debouncedFilters.roomType;
    if (debouncedFilters.propertyType !== "all")
      params.propertyType = debouncedFilters.propertyType;
    if (sortBy !== "newest") params.sortBy = sortBy;
    if (
      debouncedFilters.budget[0] !== 500 ||
      debouncedFilters.budget[1] !== 50000
    ) {
      params.budget = `${debouncedFilters.budget[0]}-${debouncedFilters.budget[1]}`;
    }
    dispatch(fetchProducts(params));
    dispatch(fetchAllApprovedPlans(params));
    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, userInfo, currentPage, debouncedFilters, sortBy]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedFilters, sortBy, selectedCategories]);

  const combinedProducts = useMemo(
    () => [
      ...(Array.isArray(adminProducts)
        ? adminProducts.map((p) => ({ ...p, source: "admin" }))
        : []),
      ...(Array.isArray(professionalPlans)
        ? professionalPlans.map((p) => ({ ...p, source: "professional" }))
        : []),
    ],
    [adminProducts, professionalPlans]
  );

  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return combinedProducts;
    return combinedProducts.filter((product) => {
      const name = (product.name || product.planName || product.Name || "").toLowerCase();
      const roomType = (product.roomType || product.size || "").toLowerCase();
      const category = (
        Array.isArray(product.category) 
          ? product.category.join(" ") 
          : (product.category || "")
      ).toLowerCase();

      return selectedCategories.some((cat) => {
        const catLower = cat.toLowerCase();
        
        if (catLower === "full house") {
          return name.includes("full house") || name.includes("complete") || category.includes("full house");
        }
        if (catLower === "bedroom") {
          return name.includes("bedroom") || roomType.includes("bedroom") || category.includes("bedroom");
        }
        if (catLower === "drawing room") {
          return name.includes("drawing") || roomType.includes("drawing") || category.includes("drawing");
        }
        if (catLower === "living room") {
          return name.includes("living") || roomType.includes("living") || category.includes("living");
        }
        if (catLower === "kitchen") {
          return name.includes("kitchen") || roomType.includes("kitchen") || category.includes("kitchen");
        }
        if (catLower === "terrace garden") {
          return name.includes("terrace") || name.includes("garden") || roomType.includes("terrace") || category.includes("terrace");
        }
        if (catLower === "outdoor") {
          return name.includes("outdoor") || name.includes("exterior") || roomType.includes("outdoor") || category.includes("outdoor");
        }
        if (catLower === "dining") {
          return name.includes("dining") || roomType.includes("dining") || category.includes("dining");
        }
        return false;
      });
    });
  }, [combinedProducts, selectedCategories]);

  const totalCount = adminCount || 0;
  const totalPages = adminPages > 0 ? adminPages : 1;

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";
  const isError = adminListStatus === "failed" || profListStatus === "failed";
  const errorMessage = String(adminError || profError || "An error occurred.");

  const handlePageJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left Column: Categories and filters (Desktop) */}
          <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              isOpen={true}
              onClose={() => {}}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>

          {/* Left Column Drawer (Mobile) */}
          <div className="lg:hidden">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>

          {/* Center Column: Design listings grid */}
          <div className="w-full lg:w-2/4 xl:w-3/5">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
              <div className="w-full sm:w-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Interior Design Plans
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Showing {filteredProducts.length} of {totalCount} results
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Link href="/customize/interior-design">
                  <Button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all">
                    Customize Your Interior
                  </Button>
                </Link>
                <Button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex-1 sm:flex-initial"
                  variant="outline"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <div className="flex-1 sm:flex-initial sm:w-48">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Sort by latest</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center h-64 sm:h-96">
                <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-orange-500" />
              </div>
            )}

            {isError && (
              <div className="text-center py-12 sm:py-20">
                <ServerCrash className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500" />
                <h3 className="mt-4 text-lg sm:text-xl font-semibold text-red-500">
                  Failed to Load Interior Designs
                </h3>
                <p className="mt-2 text-sm sm:text-base text-gray-500 px-4">
                  {errorMessage}
                </p>
              </div>
            )}

            {!isLoading && !isError && (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6"
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard
                        key={`${product.source}-${product._id}`}
                        product={product}
                        userOrders={orders}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 sm:py-20 px-4">
                      <h3 className="text-lg sm:text-xl font-semibold">
                        No Interior Designs Found
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-gray-500">
                        Try adjusting your filters to see more results.
                      </p>
                    </div>
                  )}
                </motion.div>

                {totalPages > 1 && (
                  <div className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-3 sm:gap-4 px-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="text-sm sm:text-base"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <span className="font-medium text-sm sm:text-base">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="text-sm sm:text-base"
                    >
                      Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>

                    <form
                      onSubmit={handlePageJump}
                      className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      <Input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={jumpToPage}
                        onChange={(e) => setJumpToPage(e.target.value)}
                        placeholder="Page #"
                        className="w-24 h-10 text-sm"
                        aria-label="Jump to page"
                      />
                      <Button type="submit" variant="outline" className="h-10">
                        Go
                      </Button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column: Customize Form (Desktop Only) */}
          <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
            <CustomizeInteriorForm
              userInfo={userInfo}
              dispatch={dispatch}
              toast={toast}
            />
          </div>
        </div>

        {/* Customize Form (Mobile Only at the bottom) */}
        <div className="lg:hidden mt-10">
          <CustomizeInteriorForm
            userInfo={userInfo}
            dispatch={dispatch}
            toast={toast}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InteriorDesignsPage;

