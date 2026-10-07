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

// Slider removed, using single responsive images directly

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
    <section className="relative min-h-[50vh] h-auto py-12 md:py-20 md:min-h-[450px] flex items-center text-white overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {/* Desktop Image */}
        <Image
          src="/hero_premium_bg.jpg"
          alt="Ultra-luxurious modern house exterior at twilight"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center hidden sm:block"
        />
        {/* Mobile Image */}
        <Image
          src="/hero_mobile_premium_bg.jpg"
          alt="Ultra-luxurious modern house exterior at twilight mobile"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:hidden"
        />
        <div className="absolute inset-0 bg-black/60 sm:bg-black/50" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col justify-center items-center pt-4 sm:pt-6 text-center h-full min-h-[40vh]">
          <div className="max-w-5xl w-full flex flex-col items-center">
            <div className="inline-block bg-orange-500 text-white font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm tracking-widest uppercase mb-6 shadow-lg">
              India's Premium Platform
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-normal md:leading-normal tracking-tight mb-5 drop-shadow-2xl whitespace-nowrap sm:whitespace-normal">
              Home Design & Construction <br /> Ka <span className="text-orange-500">Digital Bazar</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-8 max-w-3xl font-medium drop-shadow-lg leading-relaxed text-center whitespace-normal">
              Ek hi platform par paaiye ghar se judi har zaroorat — Readymade Designs, Architects, Contractors, aur Marketplace.
            </p>

            {/* Search Bar Removed */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
