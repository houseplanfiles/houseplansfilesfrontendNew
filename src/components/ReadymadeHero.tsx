"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, X, Sparkles, CheckCircle2, Compass, Layers, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SuggestionItem {
  plotSize: string;
  name?: string;
}

interface ReadymadeHeroProps {
  selectedCategory?: string;
  searchTerm?: string;
  onSearch: (searchTerm: string, category: string) => void;
  onReset?: () => void;
  categories: string[];
  products?: any[];
}

const POPULAR_SIZES = [
  "20x40",
  "20x50",
  "25x40",
  "25x50",
  "30x40",
  "30x50",
  "40x50",
  "40x60",
  "50x80",
];

const STANDARD_PLOT_SIZES = [
  "15x30",
  "15x40",
  "20x30",
  "20x40",
  "20x45",
  "20x50",
  "20x60",
  "22x50",
  "25x30",
  "25x40",
  "25x45",
  "25x50",
  "25x60",
  "30x30",
  "30x40",
  "30x45",
  "30x50",
  "30x60",
  "35x50",
  "35x60",
  "40x40",
  "40x50",
  "40x60",
  "45x65",
  "50x60",
  "50x70",
  "50x80",
  "60x80",
];

export default function ReadymadeHero({
  selectedCategory = "all",
  searchTerm = "",
  onSearch,
  onReset,
  categories,
  products = [],
}: ReadymadeHeroProps) {
  const [heroSearchTerm, setHeroSearchTerm] = useState(searchTerm);
  const [heroCategory, setHeroCategory] = useState(
    selectedCategory && selectedCategory !== "all" ? selectedCategory : "all"
  );
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync external filter changes with internal state
  useEffect(() => {
    setHeroSearchTerm(searchTerm || "");
  }, [searchTerm]);

  useEffect(() => {
    setHeroCategory(
      selectedCategory && selectedCategory !== "all" ? selectedCategory : "all"
    );
  }, [selectedCategory]);

  // Live autocomplete suggestions based on products and standard plot sizes
  useEffect(() => {
    const term = heroSearchTerm.trim().toLowerCase();
    if (term.length >= 1) {
      const results: SuggestionItem[] = [];
      const seenSizes = new Set<string>();

      // 1. Matches from existing loaded products
      if (products && products.length > 0) {
        products.forEach((p: any) => {
          const pSize = p.plotSize?.trim();
          const pName = p.name || p.Name;
          if (
            pSize &&
            (pSize.toLowerCase().includes(term) || (pName && pName.toLowerCase().includes(term)))
          ) {
            const cleanSize = pSize.toLowerCase();
            if (!seenSizes.has(cleanSize)) {
              seenSizes.add(cleanSize);
              results.push({
                plotSize: pSize,
                name: pName,
              });
            }
          }
        });
      }

      // 2. Matches from standard plot sizes
      STANDARD_PLOT_SIZES.forEach((size) => {
        if (size.toLowerCase().includes(term) && !seenSizes.has(size.toLowerCase())) {
          seenSizes.add(size.toLowerCase());
          results.push({
            plotSize: size,
            name: `${size} House Plan`,
          });
        }
      });

      setSuggestions(results.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }, [heroSearchTerm, products]);

  // Close suggestions dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExecuteSearch = (termOverride?: string, catOverride?: string) => {
    const finalTerm = typeof termOverride === "string" ? termOverride : heroSearchTerm;
    const finalCat = typeof catOverride === "string" ? catOverride : heroCategory;
    setShowSuggestions(false);
    onSearch(finalTerm.trim(), finalCat);

    // Smooth scroll down to plans list
    if (typeof window !== "undefined") {
      const el = document.getElementById("plans-results-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleSelectSuggestion = (item: SuggestionItem) => {
    setHeroSearchTerm(item.plotSize);
    setShowSuggestions(false);
    handleExecuteSearch(item.plotSize, heroCategory);
  };

  const handleTagClick = (size: string) => {
    if (heroSearchTerm.toLowerCase() === size.toLowerCase()) {
      // Toggle off if already selected
      setHeroSearchTerm("");
      handleExecuteSearch("", heroCategory);
    } else {
      setHeroSearchTerm(size);
      handleExecuteSearch(size, heroCategory);
    }
  };

  const handleClearAll = () => {
    setHeroSearchTerm("");
    setHeroCategory("all");
    setShowSuggestions(false);
    if (onReset) {
      onReset();
    } else {
      onSearch("", "all");
    }
  };

  const hasActiveFilter =
    Boolean(heroSearchTerm.trim()) || (heroCategory && heroCategory !== "all");

  return (
    <section className="relative flex items-center justify-center text-white overflow-hidden py-8 md:py-10">
      {/* Background Image with Multi-layer Premium Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/cat_home_designs.jpg"
          alt="Readymade House Plans & Designs"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-3 py-1 rounded-full text-xs tracking-wider uppercase mb-3 shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          1000+ Verified Readymade House Plans
        </div>

        {/* Hero Title */}
        <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-2 drop-shadow-xl">
          Readymade House Plans{" "}
          <span className="text-orange-400">&amp; Floor Designs</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-xs sm:text-sm text-gray-200 mb-4 max-w-2xl font-medium drop-shadow-md leading-relaxed">
          Plot size (e.g. 20x40, 30x40, 40x60) ya category ke mutabik naksha dhoondhein — DWG &amp; PDF instant download.
        </p>

        {/* Hero Search Bar Container */}
        <div
          ref={searchContainerRef}
          className="bg-white rounded-xl p-2 shadow-2xl border border-white/50 max-w-2xl w-full mx-auto relative text-left"
        >
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            {/* Category Dropdown */}
            <div className="w-full sm:w-[180px] shrink-0">
              <Select
                value={heroCategory}
                onValueChange={(val) => {
                  setHeroCategory(val);
                }}
              >
                <SelectTrigger className="w-full h-10 text-sm text-gray-800 font-semibold border-2 border-gray-100 bg-gray-50 focus:border-orange-500 focus:ring-0 transition-all rounded-xl px-3 hover:bg-gray-100">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="max-h-72 z-50">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Plot Size / Keyword Input with Autocomplete */}
            <div className="flex-1 relative">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search plot size e.g. 25x40, 30x50..."
                  className="h-10 text-sm pl-9 pr-8 border-2 border-gray-100 bg-gray-50 focus:border-orange-500 focus:ring-0 text-gray-800 transition-all rounded-xl placeholder:text-gray-400 font-medium hover:bg-gray-100"
                  value={heroSearchTerm}
                  onChange={(e) => {
                    setHeroSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleExecuteSearch();
                    }
                  }}
                  autoComplete="off"
                />
                {heroSearchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeroSearchTerm("");
                      setSuggestions([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full"
                    aria-label="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Suggestions Box */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl z-50 text-left border border-gray-200 max-h-64 overflow-y-auto p-2"
                  >
                    <div className="text-[11px] font-bold text-gray-400 px-3 py-1 uppercase tracking-wider">
                      Suggested Plot Sizes
                    </div>
                    <ul className="divide-y divide-gray-50">
                      {suggestions.map((s, idx) => (
                        <li
                          key={idx}
                          className="px-3 py-2.5 rounded-xl cursor-pointer text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center justify-between gap-2"
                          onClick={() => handleSelectSuggestion(s)}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-md text-xs shrink-0">
                              {s.plotSize}
                            </span>
                            <span className="truncate font-medium text-gray-800">
                              {s.name || `${s.plotSize} House Plan`}
                            </span>
                          </div>
                          <span className="text-xs text-orange-500 font-semibold shrink-0">
                            Search →
                          </span>
                        </li>
                      ))}
                      <li
                        className="mt-1 px-3 py-2 rounded-xl cursor-pointer text-sm text-orange-600 font-bold hover:bg-orange-100 text-center transition-colors"
                        onClick={() => handleExecuteSearch()}
                      >
                        View all results for &quot;{heroSearchTerm}&quot;
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Button */}
            <Button
              onClick={() => handleExecuteSearch()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 px-5 rounded-xl transition-all shadow-md hover:shadow-orange-500/30 shrink-0 flex items-center justify-center gap-1.5 group text-sm cursor-pointer"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Search</span>
            </Button>
          </div>
        </div>

        {/* Popular Searches Chips */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 max-w-3xl">
          <span className="text-xs font-semibold text-gray-200">
            Popular:
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            {POPULAR_SIZES.map((size) => {
              const isSelected = heroSearchTerm.toLowerCase() === size.toLowerCase();
              return (
                <button
                  key={size}
                  onClick={() => handleTagClick(size)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? "bg-orange-500 border-orange-400 text-white shadow-md shadow-orange-500/30 scale-105"
                      : "bg-white/10 hover:bg-orange-500 hover:border-orange-500 backdrop-blur-md border-white/20 text-white"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Clear Tag (if search/category is set) */}
        {hasActiveFilter && (
          <div className="mt-4 flex items-center gap-2 bg-orange-950/80 backdrop-blur-md border border-orange-500/40 px-3.5 py-1.5 rounded-full text-xs text-orange-200 shadow-md">
            <span>
              Active: {heroSearchTerm ? `"${heroSearchTerm}"` : ""}{" "}
              {heroCategory && heroCategory !== "all" ? `• Category: ${heroCategory}` : ""}
            </span>
            <button
              onClick={handleClearAll}
              className="ml-1 flex items-center gap-1 text-white hover:text-orange-300 font-bold underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        )}

        {/* Value Props / Highlights Badges */}
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-gray-200 font-medium">
          <div className="flex items-center gap-1 bg-black/25 backdrop-blur-sm border border-white/10 rounded-lg py-1 px-2.5">
            <CheckCircle2 className="w-3 h-3 text-orange-400" /> Instant Download
          </div>
          <div className="flex items-center gap-1 bg-black/25 backdrop-blur-sm border border-white/10 rounded-lg py-1 px-2.5">
            <Compass className="w-3 h-3 text-orange-400" /> 100% Vastu
          </div>
          <div className="flex items-center gap-1 bg-black/25 backdrop-blur-sm border border-white/10 rounded-lg py-1 px-2.5">
            <Layers className="w-3 h-3 text-orange-400" /> DWG &amp; PDF
          </div>
          <div className="flex items-center gap-1 bg-black/25 backdrop-blur-sm border border-white/10 rounded-lg py-1 px-2.5">
            <Sparkles className="w-3 h-3 text-orange-400" /> Customizable
          </div>
        </div>
      </div>
    </section>
  );
}
