"use client";
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, PencilRuler, HardHat, Wrench, ShoppingCart, ArrowRight, Users, ShieldCheck, MapPin, Star, Globe, Factory } from "lucide-react";

const CATEGORIES = [
  {
    id: 1,
    title: "Readymade Home Designs",
    desc: "Ready to use house plans for every plot size & budget",
    link: "/house-plans",
    icon: Home,
    btnText: "Explore Designs",
    image: "/cat_home_designs.jpg",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-500",
  },
  {
    id: 2,
    title: "Architects & Engineers",
    desc: "Design, planning & structural experts",
    link: "/architects",
    icon: PencilRuler,
    btnText: "Find Experts",
    image: "/architect_hero.webp",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-500",
  },
  {
    id: 3,
    title: "Contractors",
    desc: "Verified contractors for your dream project",
    link: "/contractors",
    icon: HardHat,
    btnText: "Find Contractors",
    image: "/contractor2.webp",
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-500",
  },
  {
    id: 4,
    title: "Other Services",
    desc: "Plumbing, electrical, painting, waterproofing & more",
    link: "/other-services",
    icon: Wrench,
    btnText: "Explore Services",
    image: "/b14.webp",
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-500",
  },
  {
    id: 5,
    title: "Marketplace",
    desc: "Building materials, home decor, furniture & more",
    link: "/building-material-marketplace",
    icon: ShoppingCart,
    btnText: "Shop Now",
    image: "/marketplace.webp",
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-500",
  },
  {
    id: 6,
    title: "Industrial Services",
    desc: "Pre-engineered buildings, machinery, and heavy infrastructure",
    link: "/industrial-services",
    icon: Factory,
    btnText: "Explore Industrial",
    image: "/b11.jpg",
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-500",
  },
];

const HomeServicesCategoriesSection: FC<{ hideHeader?: boolean; className?: string }> = ({ hideHeader = false, className = "bg-[#FAF9F6] py-10" }) => {
  return (
    <section className={className}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        {!hideHeader && (
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Aap Kya Dhoondh Rahe Hain?
            </h2>
            <p className="text-gray-500 font-medium mt-2 text-lg">
              Apni zaroorat ke hisaab se category select karein
            </p>
          </div>
        )}

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-6 mb-4">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id} 
              href={cat.link}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group flex flex-col h-full"
            >
              <div className="relative h-28 sm:h-40 w-full overflow-hidden">
                <Image 
                  src={cat.image} 
                  alt={cat.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 sm:p-6 flex flex-col flex-grow relative">
                {/* Floating Icon Badge */}
                <div className={`absolute -top-6 sm:-top-8 left-3 sm:left-6 w-10 h-10 sm:w-14 sm:h-14 ${cat.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg border-2 sm:border-4 border-white`}>
                  <cat.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                
                <h3 className="text-xs sm:text-lg font-bold text-gray-900 mt-5 sm:mt-6 mb-1 sm:mb-2 leading-tight group-hover:text-orange-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[10px] sm:text-sm text-gray-500 mb-3 sm:mb-6 flex-grow line-clamp-2 sm:line-clamp-none">
                  {cat.desc}
                </p>
                <div className={`w-full py-1.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-base font-bold transition-colors ${cat.lightColor} ${cat.textColor} group-hover:${cat.color} group-hover:text-white mt-auto`}>
                  <span className="truncate">{cat.btnText}</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>



      </div>
    </section>
  );
};

export default HomeServicesCategoriesSection;
