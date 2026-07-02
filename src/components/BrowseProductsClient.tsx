"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, ServerCrash, Filter, Heart, Download, Lock,
  ChevronLeft, ChevronRight, X, Search, Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { useCurrency } from "@/contexts/CurrencyContext";
import DisplayPrice from "@/components/DisplayPrice";

const slugify = (text: any) => {
  if (!text) return "";
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
};

interface BrowseProductsClientProps {
  defaultCategory?: string;
  defaultRegion?: string;
}

export default function BrowseProductsClient({
  defaultCategory = "",
  defaultRegion = "",
}: BrowseProductsClientProps) {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const urlCategory = searchParams?.get("category") || defaultCategory;
  const urlSearch = searchParams?.get("search") || "";

  const { products, listStatus, pages } = useSelector(
    (state: RootState) => state.products
  );
  const { plans: approvedPlans, listStatus: profListStatus } = useSelector(
    (state: RootState) => state.professionalPlans
  );
  const { orders } = useSelector((state: RootState) => state.orders);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [direction, setDirection] = useState("");
  const [rooms, setRooms] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"admin" | "professional">("admin");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [videoModal, setVideoModal] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(fetchProducts({
      keyword: debouncedSearch,
      category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      direction,
      rooms,
      page,
      limit: 12,
    }));
  }, [dispatch, debouncedSearch, category, priceRange, direction, rooms, page]);

  useEffect(() => {
    if (profListStatus === "idle") {
      dispatch(fetchAllApprovedPlans({}));
    }
  }, [dispatch, profListStatus]);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, userInfo]);

  const purchasedProductIds = useMemo(() => {
    if (!orders?.length) return new Set<string>();
    return new Set(
      orders.flatMap((order: any) =>
        order.orderItems?.map((item: any) => item.product?.toString() || item._id?.toString())
      ).filter(Boolean)
    );
  }, [orders]);

  const displayProducts = activeTab === "admin" ? products : approvedPlans;
  const isLoading = activeTab === "admin" ? listStatus === "loading" : profListStatus === "loading";

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Switch */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeTab === "admin"
                ? "bg-orange-500 text-white shadow-orange"
                : "bg-white text-gray-600 border hover:border-orange-500"
            }`}
          >
            All Plans
          </button>
          <button
            onClick={() => setActiveTab("professional")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeTab === "professional"
                ? "bg-orange-500 text-white shadow-orange"
                : "bg-white text-gray-600 border hover:border-orange-500"
            }`}
          >
            Architect Plans
          </button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`${isFilterOpen ? "block" : "hidden"} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-xl shadow-soft p-5 sticky top-24 space-y-6">
              <h2 className="font-bold text-gray-900 text-lg">Filters</h2>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Search</Label>
                <Input
                  placeholder="Plot size, name..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="h-10"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Category</Label>
                <Select value={category} onValueChange={(v) => { setCategory(v === "all" ? "" : v); setPage(1); }}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {["Modern Home Design", "Duplex House Plans", "Single Storey House Plan",
                      "Bungalow / Villa House Plans", "Apartment / Flat Plans", "Village House Plans",
                      "Vastu House Plans", "3BHK House Plans", "2BHK House Plans",
                    ].map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Direction (Facing)</Label>
                <Select value={direction} onValueChange={(v) => { setDirection(v === "all" ? "" : v); setPage(1); }}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="All Directions" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Directions</SelectItem>
                    {["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"].map((d) => (
                      <SelectItem key={d} value={d}>{d} Facing</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">BHK</Label>
                <Select value={rooms} onValueChange={(v) => { setRooms(v === "all" ? "" : v); setPage(1); }}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="All BHK" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All BHK</SelectItem>
                    {["1", "2", "3", "4", "5"].map((r) => (
                      <SelectItem key={r} value={r}>{r} BHK</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Price Range: ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
                </Label>
                <Slider
                  min={0} max={50000} step={500}
                  value={priceRange}
                  onValueChange={(v) => { setPriceRange(v); setPage(1); }}
                  className="mt-2"
                />
              </div>

              <Button
                variant="outline"
                className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
                onClick={() => { setSearch(""); setCategory(""); setDirection(""); setRooms(""); setPriceRange([0, 50000]); setPage(1); }}
              >
                Clear Filters
              </Button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 text-sm">
                {isLoading ? "Loading..." : `${displayProducts.length} plans found`}
              </p>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-600 border rounded-lg px-3 py-2 hover:border-orange-500"
              >
                <Filter size={16} /> Filters
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-20">
                <ServerCrash className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">No plans found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayProducts.map((product: any) => {
                  const isPurchased = purchasedProductIds.has(product._id?.toString());
                  const inWishlist = isInWishlist(product._id);
                  const href = activeTab === "admin"
                    ? `/house-plans/${product.slug || slugify(product.name) + "-" + product._id}`
                    : `/house-plans/${product.slug || slugify(product.name) + "-" + product._id}`;

                  return (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden group"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Link href={href || "/house-plans"}>
                          <img
                            src={product.mainImage || "/floorplan.jpg"}
                            alt={product.seo?.altText || `${product.name} - House Plan`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </Link>
                        {isPurchased && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Purchased
                          </div>
                        )}
                        {product.isSale && product.salePrice > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Sale
                          </div>
                        )}
                        <button
                          onClick={() => inWishlist ? removeFromWishlist(product._id) : addToWishlist(product)}
                          className={`absolute bottom-2 right-2 p-2 rounded-full transition-all ${
                            inWishlist ? "bg-red-500 text-white" : "bg-white/90 text-gray-600 hover:text-red-500"
                          }`}
                          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <div className="p-4">
                        <Link href={href || "/house-plans"}>
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-orange-600 transition-colors mb-2">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.plotSize && (
                            <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                              {product.plotSize}
                            </span>
                          )}
                          {product.rooms && (
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                              {product.rooms} BHK
                            </span>
                          )}
                          {product.direction && (
                            <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                              {product.direction}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            {product.salePrice > 0 ? (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-orange-600">
                                  <DisplayPrice price={product.salePrice} />
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  <DisplayPrice price={product.price} />
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-orange-600">
                                <DisplayPrice price={product.price} />
                              </span>
                            )}
                          </div>
                          <Link href={href || "/house-plans"}>
                            <Button size="sm" className="btn-primary h-8 text-xs">
                              View Plan
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-orange-500 text-orange-600"
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm text-gray-600 font-medium">
                  Page {page} of {pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="border-orange-500 text-orange-600"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
