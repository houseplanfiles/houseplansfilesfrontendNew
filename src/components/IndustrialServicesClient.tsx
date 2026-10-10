"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PostRequirementModal } from "./PostRequirementModal";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Zap,
  Search,
  ArrowRight,
  Bug,
  Snowflake,
  ArrowUpDown,
  Hammer,
  Square,
  Droplets,
  ChefHat,
  Home,
  Sun,
  Layout,
  Leaf,
  Waves
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Building2, Factory, Construction, Truck, Users, SearchCheck,
  Blocks, Maximize, Ruler
} from "lucide-react";

const INDUSTRIAL_SERVICES = [
  { id: 1, name: "Pre Engineering Buildings", icon: Building2, iconColor: "text-orange-500", iconBg: "bg-orange-100", image: "/b14.webp" },
  { id: 2, name: "Pre Fabricated Buildings", icon: Factory, iconColor: "text-blue-500", iconBg: "bg-blue-100", image: "/c3.webp" },
  { id: 3, name: "Pre Cast Concrete Material", icon: Blocks, iconColor: "text-purple-500", iconBg: "bg-purple-100", image: "/b11.webp" },
  { id: 4, name: "Machinery Services", icon: Truck, iconColor: "text-amber-700", iconBg: "bg-amber-100", image: "/b12.webp" },
  { id: 5, name: "Manpower Supply", icon: Users, iconColor: "text-cyan-500", iconBg: "bg-cyan-100", image: "/b13.webp" },
  { id: 6, name: "Building Inspection Services", icon: SearchCheck, iconColor: "text-blue-400", iconBg: "bg-blue-100", image: "/b4.webp" },
  { id: 7, name: "Bulk Building Material Services", icon: Construction, iconColor: "text-green-500", iconBg: "bg-green-100", image: "/b5.webp" },
  { id: 8, name: "Flooring Services", icon: Maximize, iconColor: "text-indigo-500", iconBg: "bg-indigo-100", image: "/b6.webp" },
  { id: 9, name: "Roofing", icon: Home, iconColor: "text-yellow-500", iconBg: "bg-yellow-100", image: "/c2.webp" },
  { id: 10, name: "Structural Designers", icon: Ruler, iconColor: "text-teal-500", iconBg: "bg-teal-100", image: "/r1.webp" }
];

const IndustrialServicesClient = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isPostReqModalOpen, setIsPostReqModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery || selectedCity) {
      toast.success("Searching for services...");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* --- Premium Hero Section --- */}
        <section className="relative bg-[#18181b] pt-12 pb-24 lg:pt-16 lg:pb-28 overflow-hidden border-b-4 border-orange-500">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#18181b] via-[#18181b]/95 to-[#18181b]/30 z-10 w-full lg:w-[85%]" />
            <Image 
              src="/hero_premium_bg.jpg" 
              alt="Other Services Hero" 
              fill
              className="object-cover object-right ml-auto w-full lg:w-3/4 opacity-70"
              priority
            />
          </div>

          <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="max-w-3xl">
              <span className="inline-block bg-[#ff6b00] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6 shadow-md">
                Trusted Network
              </span>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                Industrial <span className="text-[#ff6b00]">Services</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed font-medium">
                Find verified contractors for industrial construction and infrastructure services across India.
              </p>

              <div className="flex flex-wrap items-center gap-4 md:gap-8">
                <div className="flex items-center gap-2">
                  <div className="bg-[#ff6b00] p-1.5 rounded-md"><ShieldCheck className="w-4 h-4 text-white" /></div>
                  <span className="text-sm font-semibold text-white">Verified<br/>Professionals</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-gray-700"></div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#ff6b00] p-1.5 rounded-md"><Star className="w-4 h-4 text-white" /></div>
                  <span className="text-sm font-semibold text-white">Trusted<br/>Ratings</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-gray-700"></div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#ff6b00] p-1.5 rounded-md"><MapPin className="w-4 h-4 text-white" /></div>
                  <span className="text-sm font-semibold text-white">Pan India<br/>Service</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-gray-700"></div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#ff6b00] p-1.5 rounded-md"><Zap className="w-4 h-4 text-white" /></div>
                  <span className="text-sm font-semibold text-white">Easy<br/>Booking</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-6 lg:mt-0 lg:mr-12 w-full sm:w-auto">
              <Link href="/register" className="bg-transparent hover:bg-white/10 text-white font-bold py-2.5 px-6 rounded-md shadow-lg transition-transform hover:scale-105 border border-orange-500 text-center text-sm md:text-base min-w-[200px]">
                Register
              </Link>
              <button 
                onClick={() => setIsPostReqModalOpen(true)}
                className="bg-[#ff6b00] hover:bg-[#e66000] text-white font-bold py-2.5 px-6 rounded-md shadow-lg transition-transform hover:scale-105 border border-transparent text-center text-sm md:text-base min-w-[200px]"
              >
                Post Your Requirements
              </button>
            </div>
          </div>
        </section>
        
        <PostRequirementModal isOpen={isPostReqModalOpen} onClose={() => setIsPostReqModalOpen(false)} />

        {/* --- Floating Search Bar --- */}
        <section className="relative z-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-12">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-2 sm:p-3 flex flex-col md:flex-row items-center gap-2 border border-gray-100">
            <div className="flex-grow flex items-center gap-3 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search services..."
                className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder:text-gray-400 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto px-4 py-2 min-w-[200px]">
              <MapPin className="w-4 h-4 text-gray-400" />
              <select 
                className="w-full bg-transparent border-none focus:outline-none text-gray-800 font-medium cursor-pointer"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select City</option>
                <option value="Pan India">Pan India</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <Button type="submit" className="w-full md:w-auto bg-[#ff6b00] hover:bg-[#e66000] text-white px-8 py-6 rounded-xl font-bold text-base transition-colors shadow-lg shadow-orange-500/20 whitespace-nowrap">
              Find Service
            </Button>
          </form>
        </section>

        {/* --- Services Grid --- */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
          <div className="mb-10">
            <span className="text-[#ff6b00] font-extrabold text-sm tracking-wider uppercase mb-2 block">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-4">Explore Our Service Categories</h2>
            <p className="text-gray-500 text-lg max-w-3xl">Quality services, trusted professionals, best in class solutions for your home and property.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {INDUSTRIAL_SERVICES.map((service) => {
              const IconComponent = service.icon;
              return (
                <Link 
                  href={`/industrial-services/${service.name.toLowerCase().replace(/\s+/g, '-')}`} 
                  key={service.id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image 
                      src={service.image} 
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  
                  <div className="relative p-6 pt-8 flex-grow flex flex-col justify-between">
                    <div className={`absolute -top-6 left-6 ${service.iconBg} p-3 rounded-xl shadow-md border border-white`}>
                      <IconComponent className={`w-6 h-6 ${service.iconColor}`} />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#ff6b00] transition-colors">{service.name}</h3>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#ff6b00]" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default IndustrialServicesClient;
