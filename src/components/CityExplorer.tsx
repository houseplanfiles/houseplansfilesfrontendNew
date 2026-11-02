"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL_CITIES_DATA = [
  { slug: "mumbai", display: "Mumbai", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=600", desc: "Sea Link & Coastal Homes" },
  { slug: "delhi", display: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600", desc: "Capital Heritage & Kothis" },
  { slug: "bengaluru", display: "Bengaluru", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=600", desc: "Garden City Modern Villas" },
  { slug: "hyderabad", display: "Hyderabad", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df8?q=80&w=600", desc: "Charminar & Luxury Villas" },
  { slug: "ahmedabad", display: "Ahmedabad", image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=600", desc: "Sabarmati Heritage & Modern" },
  { slug: "chennai", display: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600", desc: "Traditional & Coastal Homes" },
  { slug: "kolkata", display: "Kolkata", image: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=600", desc: "Howrah & Colonial Living" },
  { slug: "surat", display: "Surat", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600", desc: "Diamond City Residences" },
  { slug: "pune", display: "Pune", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=600", desc: "Smart City Duplexes" },
  { slug: "jaipur", display: "Jaipur", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600", desc: "Pink City Havelis & Villas" },
  { slug: "lucknow", display: "Lucknow", image: "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=600", desc: "Awadhi Architecture & Homes" },
  { slug: "kanpur", display: "Kanpur", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600", desc: "Modern Independent Kothis" },
  { slug: "nagpur", display: "Nagpur", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600", desc: "Orange City Duplexes" },
  { slug: "indore", display: "Indore", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600", desc: "Clean City Luxury Villas" },
  { slug: "thane", display: "Thane", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=600", desc: "Lake City Premium Towers" },
  { slug: "bhopal", display: "Bhopal", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=600", desc: "Lake City Contemporary Villas" },
  { slug: "visakhapatnam", display: "Visakhapatnam", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", desc: "Vizag Port & Coastline Homes" },
  { slug: "pimpri-chinchwad", display: "Pimpri-Chinchwad", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600", desc: "Modern Industrial Suburb" },
  { slug: "patna", display: "Patna", image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600", desc: "Golghar & Historic City Homes" },
  { slug: "vadodara", display: "Vadodara", image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600", desc: "Laxmi Vilas Royal Living" },
  { slug: "ghaziabad", display: "Ghaziabad", image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=600", desc: "NCR Contemporary Duplexes" },
  { slug: "ludhiana", display: "Ludhiana", image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=600", desc: "Grand Punjab Kothis" },
  { slug: "agra", display: "Agra", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600", desc: "Taj Heritage City Living" },
  { slug: "nashik", display: "Nashik", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600", desc: "Godavari Valley Green Homes" },
  { slug: "faridabad", display: "Faridabad", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600", desc: "NCR Modern Residencies" },
  { slug: "meerut", display: "Meerut", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600", desc: "Western UP Modern Homes" },
  { slug: "rajkot", display: "Rajkot", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600", desc: "Saurashtra Traditional & Modern" },
  { slug: "kalyan-dombivli", display: "Kalyan-Dombivli", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600", desc: "MMR Growth Hub Homes" },
  { slug: "vasai-virar", display: "Vasai-Virar", image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=600", desc: "Coastal Suburb Homes" },
  { slug: "varanasi", display: "Varanasi", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600", desc: "Holy Ghats & Heritage Homes" },
  { slug: "srinagar", display: "Srinagar", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600", desc: "Dal Lake & Kashmiri Wood Architecture" },
  { slug: "aurangabad", display: "Aurangabad", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600", desc: "Bibi Ka Maqbara & Marathwada Homes" },
  { slug: "dhanbad", display: "Dhanbad", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600", desc: "Mineral Hub Modern Residencies" },
  { slug: "amritsar", display: "Amritsar", image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=600", desc: "Golden Temple & Royal Kothis" },
  { slug: "navi-mumbai", display: "Navi Mumbai", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600", desc: "Planned Modern Architecture" },
  { slug: "allahabad", display: "Allahabad", image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600", desc: "Sangam City Colonial Villas" },
  { slug: "ranchi", display: "Ranchi", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600", desc: "City of Falls Modern Villas" },
  { slug: "howrah", display: "Howrah", image: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=600", desc: "Heritage Riverfront Homes" },
  { slug: "coimbatore", display: "Coimbatore", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600", desc: "Kongu Region Contemporary Living" },
  { slug: "jabalpur", display: "Jabalpur", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600", desc: "Bhedaghat Marble City Homes" },
  { slug: "gwalior", display: "Gwalior", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600", desc: "Fort City Heritage & Modern" },
  { slug: "vijayawada", display: "Vijayawada", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600", desc: "Krishna Riverfront Residences" },
  { slug: "jodhpur", display: "Jodhpur", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600", desc: "Blue City Desert Mansions" },
  { slug: "madurai", display: "Madurai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600", desc: "Temple City Traditional Architecture" },
  { slug: "raipur", display: "Raipur", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600", desc: "Chhattisgarh Modern Living" },
  { slug: "kota", display: "Kota", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600", desc: "Chambal City Modern Villas" },
  { slug: "guwahati", display: "Guwahati", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600", desc: "Brahmaputra Valley Green Villas" },
  { slug: "chandigarh", display: "Chandigarh", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600", desc: "Planned City Luxury Sectors" },
  { slug: "solapur", display: "Solapur", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600", desc: "South Maharashtra Residencies" },
  { slug: "hubli", display: "Hubli", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600", desc: "North Karnataka Modern Homes" }
];

const CityExplorer = () => {
  const [selectedCity, setSelectedCity] = useState("Bhopal");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleExplore = () => {
    if (selectedCity) {
      router.push(`/architects?city=${selectedCity.toLowerCase().replace(/\s+/g, '-')}`);
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
      const container = carouselRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 20) {
        container.scrollTo({ left: 0, behavior: "smooth" });
        setActiveIndex(0);
      } else {
        container.scrollBy({ left: 300, behavior: "smooth" });
        setActiveIndex((prev) => Math.min(ALL_CITIES_DATA.length - 1, prev + 1));
      }
    }
  };

  // Automatic slider / autoplay effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 20) {
          container.scrollTo({ left: 0, behavior: "smooth" });
          setActiveIndex(0);
        } else {
          container.scrollBy({ left: 280, behavior: "smooth" });
          setActiveIndex((prev) => (prev + 1) % ALL_CITIES_DATA.length);
        }
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused]);

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
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar pl-2 scroll-smooth" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {ALL_CITIES_DATA.map((city, idx) => (
                <Link 
                  key={`${city.slug}-${idx}`} 
                  href={`/city/${city.slug}`}
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

