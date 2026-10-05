"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURED_CITIES = [
  { slug: "bhopal", display: "Bhopal", image: "/b11.webp" },
  { slug: "indore", display: "Indore", image: "/b12.webp" },
  { slug: "lucknow", display: "Lucknow", image: "/b13.webp" },
  { slug: "delhi", display: "Delhi", image: "/b14.webp" },
  { slug: "mumbai", display: "Mumbai", image: "/b11.webp" },
];

const ALL_CITIES = [
  "Bhopal", "Indore", "Lucknow", "Jaipur", "Nagpur", "Pune", 
  "Hyderabad", "Chennai", "Mumbai", "Bengaluru", "Delhi", 
  "Kolkata", "Ahmedabad", "Chandigarh", "Patna", "Ranchi"
];

const CityExplorer = () => {
  const [selectedCity, setSelectedCity] = useState("Bhopal");
  const router = useRouter();

  const handleExplore = () => {
    if (selectedCity) {
      router.push(`/architects?city=${selectedCity.toLowerCase()}`);
    }
  };

  return (
    <section className="bg-white py-10 border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-50 text-orange-500 rounded-full mb-6">
              <MapPin className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              Har Shehr Ke <br />
              <span className="text-orange-600">Apne Professionals</span>
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              Apne shehar ko select karein aur local experts se judein.
            </p>

            <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-sm flex flex-col sm:flex-row gap-2 max-w-md">
              <div className="flex-grow flex items-center bg-gray-50 rounded-xl px-4 h-12">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <select 
                  className="w-full bg-transparent border-none focus:ring-0 text-gray-700 text-sm font-semibold outline-none cursor-pointer"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {ALL_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <Button 
                onClick={handleExplore}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 px-6 font-bold flex items-center gap-2 transition-all w-full sm:w-auto shrink-0 shadow-md shadow-orange-500/20"
              >
                Explore City
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Content - Scrollable City Cards */}
          <div className="w-full lg:w-2/3 overflow-hidden">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {FEATURED_CITIES.map((city) => (
                <Link 
                  key={city.slug} 
                  href={`/architects?city=${city.slug}`}
                  className="snap-center shrink-0 w-[240px] sm:w-[280px] group block"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 h-[220px] sm:h-[260px]">
                    <Image 
                      src={city.image} 
                      alt={city.display} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end">
                      <h3 className="text-xl font-bold text-white drop-shadow-md">
                        {city.display}
                      </h3>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Custom CSS to hide scrollbar but allow scroll */}
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
