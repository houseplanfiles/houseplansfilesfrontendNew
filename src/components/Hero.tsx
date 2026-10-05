"use client";
import Image from "next/image";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { motion, AnimatePresence } from "@/components/MotionWrapper";
import AnimatedStat from "./AnimatedStat";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const slides = [
  { image: "/b11.webp", alt: "Modern white house with a lawn" },
  { image: "/b12.webp", alt: "Classic house with a beautiful garden" },
  { image: "/b13.webp", alt: "Luxurious apartment building exterior" },
  { image: "/b14.webp", alt: "Luxurious apartment building interior" },
];

const CATEGORIES = [
  "Modern Home Design",
  "Duplex House Plans",
  "Single Storey House Plan",
  "Bungalow / Villa House Plans",
  "Apartment / Flat Plans",
  "Farmhouse",
  "Cottage Plans",
  "Row House / Twin House Plans",
  "Village House Plans",
  "Contemporary / Modern House Plans",
  "Colonial / Heritage House Plans",
  "Classic House Plan",
  "Kerala House Plans",
  "Kashmiri House Plan",
  "Marriage Garden",
  "Hospitals",
  "Shops and Showrooms",
  "Highway Resorts and Hotels",
  "Schools and Colleges Plans",
  "Temple & Mosque",
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { products, listStatus } = useSelector(
    (state: RootState) => state.products
  );

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Fetch products only when user interacts with search to save TBT and LCP
  const handleSearchFocus = () => {
    if (listStatus === "idle") {
      dispatch(fetchProducts({ limit: 15 }));
    }
  };

  // Live search suggestions
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = products
        .filter(
          (product: any) =>
            product.plotSize &&
            product.plotSize.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (overrideTerm?: string) => {
    const termToSearch = typeof overrideTerm === 'string' ? overrideTerm : searchTerm;
    const queryParams = new URLSearchParams();
    
    if (selectedCategory) queryParams.append("category", selectedCategory);
    if (termToSearch) queryParams.append("search", termToSearch);
    
    setSuggestions([]);
    
    const st = termToSearch.toLowerCase();
    // Smart routing based on search intent
    if (st.includes("architect") || st.includes("contractor") || st.includes("engineer") || st.includes("plumber")) {
      router.push(`/architects?${queryParams.toString()}`);
    } else if (st.includes("tile") || st.includes("decor") || st.includes("cement") || st.includes("paint") || st.includes("material")) {
      router.push(`/building-material-marketplace?${queryParams.toString()}`);
    } else {
      router.push(`/house-plans?${queryParams.toString()}`);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchTerm(suggestion.plotSize);
    setSuggestions([]);
    router.push(`/house-plans?search=${suggestion.plotSize}`);
  };

  return (
    <section className="relative min-h-[60vh] h-auto py-20 md:min-h-[550px] flex items-center text-white overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0">
        <Image
          key={currentSlide}
          src={slides[currentSlide].image}
          alt={slides[currentSlide].alt}
          fill
          priority={currentSlide === 0}
          loading={currentSlide === 0 ? "eager" : "lazy"}
          sizes="100vw"
          className="object-cover object-center transition-opacity duration-700"
          style={{ opacity: 1 }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-start pt-10">
          <div className="max-w-4xl w-full">
            <div className="inline-block bg-orange-500 text-white font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm tracking-widest uppercase mb-6 shadow-lg">
              India's Premium Platform
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-[1.2] tracking-tight mb-5 drop-shadow-2xl">
              Home Design &<br />
              Construction Ka<br />
              <span className="text-orange-500">Digital Bazar</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-8 max-w-2xl font-medium drop-shadow-lg leading-relaxed">
              Ek hi platform par paaiye ghar se judi har zaroorat — Readymade Designs, Architects, Contractors, aur Marketplace.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-4xl relative mb-8" ref={searchContainerRef}>
              <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl border border-gray-100 transition-all focus-within:shadow-[0_8px_40px_rgb(0,0,0,0.2)] w-full">
                <Search className="w-6 h-6 text-gray-400 ml-4 absolute left-2" />
                <Input
                  placeholder="Search by city, service, design, professional, product..."
                  className="flex-1 h-12 sm:h-14 pl-14 pr-2 sm:pr-6 text-sm sm:text-lg border-none focus-visible:ring-0 text-gray-800 bg-transparent rounded-full shadow-none font-medium placeholder:text-gray-400 min-w-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={handleSearchFocus}
                  autoComplete="off"
                />
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12 sm:h-14 w-14 sm:w-16 flex items-center justify-center shrink-0 shadow-md transition-colors"
                  onClick={() => handleSearch()}
                >
                  <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </div>

              {/* Autocomplete Suggestions */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl z-50 text-left border border-gray-100 max-h-60 overflow-y-auto"
                  >
                    <ul className="py-2">
                      {suggestions.map((s: any) => (
                        <li
                          key={s._id}
                          className="px-5 py-3 cursor-pointer text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-b border-gray-50 last:border-none transition-colors"
                          onClick={() => handleSuggestionClick(s)}
                        >
                          <span className="font-semibold">{s.plotSize}</span> — {s.name}
                        </li>
                      ))}
                      <li
                        className="px-5 py-3 cursor-pointer text-sm text-orange-600 font-bold hover:bg-orange-50 text-center transition-colors"
                        onClick={() => handleSearch()}
                      >
                        View all for &quot;{searchTerm}&quot;
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-white drop-shadow-md">Popular Searches:</span>
              <div className="flex flex-wrap gap-2">
                {["30x40 House Plan", "Architect in Bhopal", "Contractor in Indore", "Tiles Supplier", "Home Decor"].map((tag) => (
                  <button 
                    key={tag} 
                    onClick={() => {
                      setSearchTerm(tag);
                      handleSearch(tag);
                    }}
                    className="text-xs font-semibold bg-black/40 hover:bg-orange-500 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            </div>
          </div>
      </div>
    </section>
  );
};

export default Hero;
