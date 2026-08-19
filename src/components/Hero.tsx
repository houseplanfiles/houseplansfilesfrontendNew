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

  // Fetch products once for search suggestions
  useEffect(() => {
    if (listStatus === "idle") {
      const timer = setTimeout(() => {
        dispatch(fetchProducts({ limit: 15 }));
      }, 2500); // Delay by 2.5s to not block initial hydration
      return () => clearTimeout(timer);
    }
  }, [dispatch, listStatus]);

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

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.append("category", selectedCategory);
    if (searchTerm) queryParams.append("search", searchTerm);
    setSuggestions([]);
    // ✅ Updated URL: /house-plans instead of /products
    router.push(`/house-plans?${queryParams.toString()}`);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchTerm(suggestion.plotSize);
    setSuggestions([]);
    router.push(`/house-plans?search=${suggestion.plotSize}`);
  };

  return (
    <section className="relative h-[80vh] min-h-[550px] md:h-screen md:min-h-[700px] flex items-center justify-center text-white overflow-hidden">
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
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full pt-10 md:pt-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 leading-[1.3] sm:leading-[1.2] tracking-wide max-w-5xl mx-auto drop-shadow-2xl text-white px-4">
          Find Readymade Home design, Architect, contractor and marketplace shop in your city
        </h2>

        <p
          className="text-sm sm:text-lg md:text-xl mb-6 md:mb-8 text-white/90 font-light max-w-lg mx-auto md:max-w-none drop-shadow-md"
        >
          Discover amazing architectural designs for your dream home
        </p>

        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-10 flex flex-wrap justify-center gap-3 sm:gap-4"
        >
          <Link href="/architects">
            <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-5 sm:px-6 py-5 rounded-xl shadow-xl text-sm sm:text-base transition-transform hover:-translate-y-1">
              Architects
            </Button>
          </Link>
          <Link href="/house-plans">
            <Button className="bg-white text-red-500 hover:bg-gray-100 hover:text-red-600 font-bold px-5 sm:px-6 py-5 rounded-xl shadow-xl text-sm sm:text-base transition-transform hover:-translate-y-1">
              Readymade plans
            </Button>
          </Link>
          <Link href="/contractors">
            <Button className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700 font-bold px-5 sm:px-6 py-5 rounded-xl shadow-xl text-sm sm:text-base transition-transform hover:-translate-y-1">
              Contractors
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button className="bg-green-700 text-white hover:bg-green-800 font-bold px-5 sm:px-6 py-5 rounded-xl shadow-xl text-sm sm:text-base transition-transform hover:-translate-y-1">
              Marketplace
            </Button>
          </Link>
          <Link href="/leads">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 font-bold px-5 sm:px-6 py-5 rounded-xl shadow-xl text-sm sm:text-base transition-transform hover:-translate-y-1">
              Lead Board
            </Button>
          </Link>
          <Link href="/city-partners?profession=Building">
            <Button className="bg-white text-indigo-600 hover:bg-gray-100 hover:text-indigo-700 font-bold px-5 sm:px-6 py-5 rounded-xl shadow-xl text-sm sm:text-base transition-transform hover:-translate-y-1">
              Infra Services
            </Button>
          </Link>
          <Link href="/city-partners?profession=Other">
            <Button className="bg-white text-teal-600 hover:bg-gray-100 hover:text-teal-700 font-bold px-5 sm:px-6 py-5 rounded-xl shadow-xl text-sm sm:text-base transition-transform hover:-translate-y-1">
              Other Services
            </Button>
          </Link>
        </motion.div>

        {/* Search Bar */}
        <div
          ref={searchContainerRef}
          className="bg-white rounded-xl md:rounded-2xl p-2 sm:p-4 shadow-large max-w-2xl w-full mx-auto relative"
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1">
              <Select
                onValueChange={setSelectedCategory}
                disabled={listStatus === "loading"}
              >
                <SelectTrigger className="w-full h-12 text-base text-gray-700 font-medium border-2 border-transparent bg-gray-50 focus:border-orange-500 focus:ring-0 transition-all duration-300 hover:bg-gray-100 rounded-xl px-4">
                  <SelectValue
                    placeholder={
                      listStatus === "loading" ? "Loading..." : "Category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 relative">
              <Input
                placeholder="Search plot size e.g. 25x40"
                className="h-12 text-base border-2 border-transparent bg-gray-50 focus:border-orange-500 focus:ring-0 text-gray-700 transition-all duration-300 hover:bg-gray-100 rounded-xl px-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />

              {/* Autocomplete Suggestions */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 text-left border border-gray-100 max-h-48 overflow-y-auto"
                  >
                    <ul className="py-1">
                      {suggestions.map((s: any) => (
                        <li
                          key={s._id}
                          className="px-3 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-50 last:border-none"
                          onClick={() => handleSuggestionClick(s)}
                        >
                          <span className="font-semibold">{s.plotSize}</span> —{" "}
                          {s.name}
                        </li>
                      ))}
                      <li
                        className="px-3 py-2 cursor-pointer text-sm text-orange-600 font-semibold hover:bg-gray-100 text-center"
                        onClick={handleSearch}
                      >
                        View all for &quot;{searchTerm}&quot;
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full sm:w-auto sm:px-8 h-12 rounded-xl transition-all duration-300 shadow-md group"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5 sm:mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="inline text-base">Search</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-8 mt-8 md:mt-12 max-w-lg mx-auto w-full">
          <AnimatedStat end={1000} suffix="+" label="House Plans" />
          <AnimatedStat end={1000} suffix="+" label="Happy Clients" />
          <AnimatedStat end={10} suffix="+" label="Years Exp." />
        </div>
      </div>
    </section>
  );
};

export default Hero;
