"use client";
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, PencilRuler, HardHat, Wrench, ShoppingCart, ArrowRight, Users, ShieldCheck, MapPin, Star, Globe } from "lucide-react";

const CATEGORIES = [
  {
    id: 1,
    title: "Readymade Home Designs",
    desc: "Ready to use house plans for every plot size & budget",
    link: "/house-plans",
    icon: Home,
    btnText: "Explore Designs",
    image: "/b11.webp",
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
    image: "/b12.webp",
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
    image: "/b13.webp",
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
    image: "/b11.webp",
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-500",
  },
];

const HomeServicesCategoriesSection: FC = () => {
  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Aap Kya Dhoondh Rahe Hain?
          </h2>
          <p className="text-gray-500 font-medium mt-2 text-lg">
            Apni zaroorat ke hisaab se category select karein
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id} 
              href={cat.link}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group flex flex-col h-full"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image 
                  src={cat.image} 
                  alt={cat.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow relative">
                {/* Floating Icon Badge */}
                <div className={`absolute -top-8 left-6 w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2 leading-tight group-hover:text-orange-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-gray-500 mb-6 flex-grow">
                  {cat.desc}
                </p>
                <div className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors ${cat.lightColor} ${cat.textColor} group-hover:${cat.color} group-hover:text-white`}>
                  {cat.btnText}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-8 px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center divide-x divide-gray-100">
            <div className="flex items-center justify-center gap-4 px-4">
              <Users className="w-10 h-10 text-gray-800" />
              <div>
                <p className="font-extrabold text-xl text-gray-900">1000+</p>
                <p className="text-xs font-semibold text-gray-500">Happy Customers</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 px-4">
              <ShieldCheck className="w-10 h-10 text-gray-800" />
              <div>
                <p className="font-extrabold text-xl text-gray-900">500+</p>
                <p className="text-xs font-semibold text-gray-500">Verified Professionals</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 px-4">
              <MapPin className="w-10 h-10 text-gray-800" />
              <div>
                <p className="font-extrabold text-xl text-gray-900">50+</p>
                <p className="text-xs font-semibold text-gray-500">Cities Across India</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 px-4">
              <div className="flex -space-x-2">
                <Star className="w-10 h-10 text-orange-500 fill-orange-500" />
              </div>
              <div>
                <p className="font-extrabold text-xl text-gray-900">4.8/5</p>
                <p className="text-xs font-semibold text-gray-500">Google Rating (40+ Reviews)</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 px-4 hidden md:flex">
              <Globe className="w-10 h-10 text-gray-800" />
              <div>
                <p className="font-extrabold text-xl text-gray-900">50+ Countries</p>
                <p className="text-xs font-semibold text-gray-500">Serving Across</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeServicesCategoriesSection;
