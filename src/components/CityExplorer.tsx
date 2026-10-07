"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL_CITIES_DATA = [
  { slug: "mumbai", display: "Mumbai", image: "/b11.webp", desc: "Modern Living Spaces" },
  { slug: "delhi", display: "Delhi", image: "/b12.webp", desc: "Premium Residences" },
  { slug: "bengaluru", display: "Bengaluru", image: "/b13.webp", desc: "Tech-City Homes" },
  { slug: "hyderabad", display: "Hyderabad", image: "/b14.webp", desc: "Luxury Villas" },
  { slug: "ahmedabad", display: "Ahmedabad", image: "/b11.webp", desc: "Modern Homes" },
  { slug: "chennai", display: "Chennai", image: "/b12.webp", desc: "Quality Construction" },
  { slug: "kolkata", display: "Kolkata", image: "/b13.webp", desc: "Heritage & Modern" },
  { slug: "surat", display: "Surat", image: "/b14.webp", desc: "Trusted Experts" },
  { slug: "pune", display: "Pune", image: "/b11.webp", desc: "Modern Living Spaces" },
  { slug: "jaipur", display: "Jaipur", image: "/b12.webp", desc: "Premium Residences" },
  { slug: "lucknow", display: "Lucknow", image: "/b13.webp", desc: "Quality Construction" },
  { slug: "kanpur", display: "Kanpur", image: "/b14.webp", desc: "Trusted Experts" },
  { slug: "nagpur", display: "Nagpur", image: "/b11.webp", desc: "Modern Homes" },
  { slug: "indore", display: "Indore", image: "/b12.webp", desc: "Luxury Villas" },
  { slug: "thane", display: "Thane", image: "/b13.webp", desc: "Premium Residences" },
  { slug: "bhopal", display: "Bhopal", image: "/b14.webp", desc: "Modern Living Spaces" },
  { slug: "visakhapatnam", display: "Visakhapatnam", image: "/b11.webp", desc: "Quality Construction" },
  { slug: "pimpri-chinchwad", display: "Pimpri-Chinchwad", image: "/b12.webp", desc: "Trusted Experts" },
  { slug: "patna", display: "Patna", image: "/b13.webp", desc: "Modern Homes" },
  { slug: "vadodara", display: "Vadodara", image: "/b14.webp", desc: "Luxury Villas" },
  { slug: "ghaziabad", display: "Ghaziabad", image: "/b11.webp", desc: "Premium Residences" },
  { slug: "ludhiana", display: "Ludhiana", image: "/b12.webp", desc: "Modern Living Spaces" },
  { slug: "agra", display: "Agra", image: "/b13.webp", desc: "Quality Construction" },
  { slug: "nashik", display: "Nashik", image: "/b14.webp", desc: "Trusted Experts" },
  { slug: "faridabad", display: "Faridabad", image: "/b11.webp", desc: "Modern Homes & Villas" },
  { slug: "meerut", display: "Meerut", image: "/b12.webp", desc: "Modern Living Spaces" },
  { slug: "rajkot", display: "Rajkot", image: "/b13.webp", desc: "Quality Construction" },
  { slug: "kalyan-dombivli", display: "Kalyan-Dombivli", image: "/b14.webp", desc: "Trusted Experts" },
  { slug: "vasai-virar", display: "Vasai-Virar", image: "/b11.webp", desc: "Modern Homes" },
  { slug: "varanasi", display: "Varanasi", image: "/b12.webp", desc: "Premium Residences" },
  { slug: "srinagar", display: "Srinagar", image: "/b13.webp", desc: "Luxury Villas" },
  { slug: "aurangabad", display: "Aurangabad", image: "/b14.webp", desc: "Modern Living Spaces" },
  { slug: "dhanbad", display: "Dhanbad", image: "/b11.webp", desc: "Quality Construction" },
  { slug: "amritsar", display: "Amritsar", image: "/b12.webp", desc: "Trusted Experts" },
  { slug: "navi-mumbai", display: "Navi Mumbai", image: "/b13.webp", desc: "Modern Homes" },
  { slug: "allahabad", display: "Allahabad", image: "/b14.webp", desc: "Premium Residences" },
  { slug: "ranchi", display: "Ranchi", image: "/b11.webp", desc: "Luxury Villas" },
  { slug: "howrah", display: "Howrah", image: "/b12.webp", desc: "Modern Living Spaces" },
  { slug: "coimbatore", display: "Coimbatore", image: "/b13.webp", desc: "Quality Construction" },
  { slug: "jabalpur", display: "Jabalpur", image: "/b14.webp", desc: "Trusted Experts" },
  { slug: "gwalior", display: "Gwalior", image: "/b11.webp", desc: "Modern Homes" },
  { slug: "vijayawada", display: "Vijayawada", image: "/b12.webp", desc: "Premium Residences" },
  { slug: "jodhpur", display: "Jodhpur", image: "/b13.webp", desc: "Luxury Villas" },
  { slug: "madurai", display: "Madurai", image: "/b14.webp", desc: "Modern Living Spaces" },
  { slug: "raipur", display: "Raipur", image: "/b11.webp", desc: "Quality Construction" },
  { slug: "kota", display: "Kota", image: "/b12.webp", desc: "Trusted Experts" },
  { slug: "guwahati", display: "Guwahati", image: "/b13.webp", desc: "Modern Homes" },
  { slug: "chandigarh", display: "Chandigarh", image: "/b14.webp", desc: "Premium Residences" },
  { slug: "solapur", display: "Solapur", image: "/b11.webp", desc: "Luxury Villas" },
  { slug: "hubli", display: "Hubli", image: "/b12.webp", desc: "Modern Living Spaces" }
];

const CityExplorer = () => {
  const [selectedCity, setSelectedCity] = useState("Bhopal");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleExplore = () => {
    if (selectedCity) {
      router.push(`/architects?city=${selectedCity.toLowerCase()}`);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
      setActiveIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
      setActiveIndex((prev) => Math.min(ALL_CITIES_DATA.length - 1, prev + 1));
    }
  };

  return (
    <section className="bg-[#FAF9F6] py-10 md:py-20 border-t border-gray-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      
      {/* Subtle curved architectural line (SVG) */}
      <svg className="absolute top-10 left-10 text-orange-200/50 w-64 h-64 pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path d="M0,100 C0,44.77 44.77,0 100,0" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-center lg:items-stretch">
          
          {/* Left Content (approx 40%) */}
          <div className="w-full lg:w-[40%] flex flex-col justify-center text-center lg:text-left">
            <div className="mb-6 flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 shadow-sm rounded-full text-xs font-bold text-gray-700 tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Local Experts
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.15] mb-3 md:mb-5 tracking-tight font-sans">
              Har Shehr Ke <br className="hidden lg:block" />
              <span className="text-[#FF6B00]">Apne Professionals</span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-slate-500 mb-6 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
              Apne shehar ko select karein aur local experts, architects, aur contractors se judein.
            </p>

            {/* Premium Control Group */}
            <div className="bg-white rounded-2xl p-2 shadow-lg shadow-gray-200/50 flex flex-col sm:flex-row gap-2 max-w-lg mx-auto lg:mx-0 border border-gray-100">
              <div className="flex-grow flex items-center bg-gray-50/50 hover:bg-gray-50 rounded-xl px-4 h-14 transition-colors">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <select 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 text-base font-semibold outline-none cursor-pointer appearance-none pr-8 relative"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M7 7l3-3 3 3m0 6l-3 3-3-3'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em" }}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {ALL_CITIES_DATA.map((city) => (
                    <option key={city.slug} value={city.display}>{city.display}</option>
                  ))}
                </select>
              </div>
              <Button 
                onClick={handleExplore}
                className="bg-[#FF6B00] hover:bg-[#e66000] text-white rounded-xl h-14 px-8 text-base font-bold flex items-center gap-2 transition-all w-full sm:w-auto shrink-0 shadow-md shadow-orange-500/20"
              >
                Explore City
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right Content - Carousel (approx 60%) */}
          <div className="w-full lg:w-[60%] flex flex-col mt-2 lg:mt-0 overflow-hidden">
            {/* Carousel Controls */}
            <div className="hidden md:flex justify-end gap-3 mb-4 pr-2">
              <button onClick={scrollLeft} className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-slate-600 hover:bg-orange-50 hover:text-[#FF6B00] hover:border-orange-200 transition-all shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={scrollRight} className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-slate-600 hover:bg-orange-50 hover:text-[#FF6B00] hover:border-orange-200 transition-all shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div 
              ref={carouselRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar pl-2" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {ALL_CITIES_DATA.map((city, idx) => (
                <Link 
                  key={`${city.slug}-${idx}`} 
                  href={`/architects?city=${city.slug}`}
                  className="snap-center shrink-0 w-[220px] sm:w-[250px] group block"
                >
                  <div className={`relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-[260px] sm:h-[300px] group-hover:-translate-y-1.5 bg-white border-2 ${idx === activeIndex ? 'border-[#FF6B00]/50 shadow-orange-500/10' : 'border-transparent'}`}>
                    <Image 
                      src={city.image} 
                      alt={city.display} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Dark gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end">
                      <div className="flex flex-col">
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                          {city.display}
                        </h3>
                        <p className="text-[#FF6B00] font-medium text-xs sm:text-sm mt-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          {city.desc || "Modern Homes"}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:border-[#FF6B00] transition-all duration-300 shadow-sm shrink-0">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Subtle Pagination Indicators */}
            <div className="flex justify-center lg:justify-start gap-1.5 mt-2 pl-2">
              {[0, 1, 2, 3].map((dot) => (
                <div 
                  key={dot}
                  className={`h-1.5 rounded-full transition-all duration-300 ${dot === Math.min(3, Math.floor(activeIndex / 4)) ? 'w-6 bg-[#FF6B00]' : 'w-2 bg-gray-300'}`}
                />
              ))}
            </div>
            
            <style jsx>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CityExplorer;

