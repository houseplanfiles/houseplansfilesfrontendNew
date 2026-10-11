"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  Factory, 
  Truck, 
  Blocks, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  HardHat, 
  Sparkles
} from "lucide-react";

interface IndustrialServiceItem {
  id: number;
  name: string;
  slug: string;
  tag: string;
  desc: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgLight: string;
}

const INDUSTRIAL_SERVICES: IndustrialServiceItem[] = [
  {
    id: 1,
    name: "Pre Engineering Buildings",
    slug: "pre-engineering-buildings",
    tag: "PEB Sheds & Warehouses",
    desc: "Turnkey PEB structural sheds, factory warehouses & heavy industrial steel fabrication.",
    image: "/b14.webp",
    icon: Building2,
    accentColor: "text-orange-600",
    bgLight: "bg-orange-50",
  },
  {
    id: 2,
    name: "Pre Fabricated Buildings",
    slug: "pre-fabricated-buildings",
    tag: "Modular & Site Offices",
    desc: "Rapid assembly modular prefab cabins, site offices, worker housing & container units.",
    image: "/c3.webp",
    icon: Factory,
    accentColor: "text-blue-600",
    bgLight: "bg-blue-50",
  },
  {
    id: 3,
    name: "Pre Cast Concrete Material",
    slug: "pre-cast-concrete-material",
    tag: "Precast Walls & Beams",
    desc: "Ready-to-install precast boundary walls, columns, slabs, girders & drainage solutions.",
    image: "/b11.webp",
    icon: Blocks,
    accentColor: "text-purple-600",
    bgLight: "bg-purple-50",
  },
  {
    id: 4,
    name: "Machinery Services",
    slug: "machinery-services",
    tag: "Heavy Equipment Rental",
    desc: "Heavy cranes, hydraulic excavators, JCBs, transit mixers & plant machinery rental.",
    image: "/b12.webp",
    icon: Truck,
    accentColor: "text-amber-600",
    bgLight: "bg-amber-50",
  },
];

const IndustrialServicesSection = () => {
  return (
    <section className="py-14 sm:py-16 md:py-20 bg-gradient-to-b from-white via-slate-50/70 to-white border-t border-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Centered Header & Intro --- */}
        <div className="text-center max-w-5xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 shadow-xs">
            <HardHat className="w-4 h-4 text-[#ff6b00]" />
            <span>Industrial & Heavy Infrastructure</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight whitespace-nowrap">
            Industrial <span className="text-[#ff6b00]">Services</span> & Solutions
          </h2>
          
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
            Find verified contractors, PEB specialists, machinery providers, and structural engineers for commercial, industrial, and heavy infrastructure projects across India.
          </p>

          <div className="mt-5 flex items-center justify-center">
            <Link
              href="/industrial-services"
              className="inline-flex items-center gap-2 bg-[#ff6b00] hover:bg-[#e66000] text-white px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* --- Quick Value Highlights Bar (Centered) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-10 w-full">
          <div className="flex items-center gap-2.5 sm:gap-3 bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="p-1.5 sm:p-2 rounded-lg bg-orange-100 text-[#ff6b00] shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Verified Vendors</p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">100% vetted profiles</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
              <Factory className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Turnkey Solutions</p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Design to completion</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Direct Quotes</p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">No middleman markup</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="p-1.5 sm:p-2 rounded-lg bg-purple-100 text-purple-600 shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Pan-India Support</p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Multi-city mobilization</p>
            </div>
          </div>
        </div>

        {/* --- Services Grid (Only 4, 2 in a row on mobile/tablet) --- */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 w-full">
          {INDUSTRIAL_SERVICES.slice(0, 4).map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                href={`/industrial-services/${service.slug}`}
                className="group relative bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-32 sm:h-40 md:h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                  
                  {/* Category Tag Badge */}
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between">
                    <span className="inline-block text-[10px] sm:text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-white/20 truncate max-w-full">
                      {service.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-3 sm:p-5 pt-3.5 sm:pt-5 flex-grow flex flex-col justify-between bg-white">
                  {/* Floating Icon */}
                  <div className={`absolute -top-5 left-3 sm:-top-6 sm:left-5 ${service.bgLight} p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl shadow-md border-2 border-white`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${service.accentColor}`} />
                  </div>

                  <div className="pt-2 sm:pt-3">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-base md:text-lg group-hover:text-[#ff6b00] transition-colors leading-snug line-clamp-2">
                      {service.name}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed hidden sm:block">
                      {service.desc}
                    </p>
                  </div>

                  {/* Footer link in card */}
                  <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs md:text-sm font-semibold text-slate-700 group-hover:text-[#ff6b00] transition-colors">
                    <span>Explore Contractors</span>
                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-orange-50 group-hover:translate-x-1 transition-all">
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 group-hover:text-[#ff6b00]" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* --- Centered Explore All Button --- */}
        <div className="text-center mb-10 sm:mb-12">
          <Link
            href="/industrial-services"
            className="inline-flex items-center gap-2 bg-white hover:bg-orange-50 text-[#ff6b00] border-2 border-[#ff6b00] px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm md:text-base shadow-xs transition-all hover:scale-105 active:scale-95"
          >
            <span>Explore All Industrial Categories (10+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* --- Bottom Call to Action Card --- */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 sm:p-8 md:p-10 border border-slate-800 shadow-xl relative overflow-hidden max-w-6xl mx-auto">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Custom Project Requirement?
              </span>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Have an industrial or commercial construction requirement?
              </h3>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-300 font-normal">
                Post your specifications or hire verified contractors, PEB structural designers, and machinery suppliers across India.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href="/leads"
                className="w-full sm:w-auto bg-[#ff6b00] hover:bg-[#e66000] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm md:text-base shadow-lg transition-transform hover:scale-105 text-center"
              >
                Post Industrial Requirement
              </Link>
              <Link
                href="/industrial-services"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm md:text-base transition-transform hover:scale-105 text-center backdrop-blur-sm"
              >
                View All Categories
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default IndustrialServicesSection;
