"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  Factory, 
  Truck, 
  Users, 
  Blocks, 
  Maximize, 
  SearchCheck, 
  Construction, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  HardHat, 
  Wrench,
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
  {
    id: 5,
    name: "Manpower Supply",
    slug: "manpower-supply",
    tag: "Skilled & Semi-Skilled",
    desc: "Certified industrial welders, structural fitters, riggers & civil construction labor teams.",
    image: "/b13.webp",
    icon: Users,
    accentColor: "text-cyan-600",
    bgLight: "bg-cyan-50",
  },
  {
    id: 6,
    name: "Building Inspection Services",
    slug: "building-inspection-services",
    tag: "Audits & NDT Testing",
    desc: "Structural safety audits, non-destructive testing (NDT), load tests & stability certifications.",
    image: "/b4.webp",
    icon: SearchCheck,
    accentColor: "text-emerald-600",
    bgLight: "bg-emerald-50",
  },
  {
    id: 7,
    name: "Bulk Building Material Services",
    slug: "bulk-building-material-services",
    tag: "Direct Factory Supply",
    desc: "Wholesale factory supply of TMT bars, structural steel, ready-mix concrete & industrial cement.",
    image: "/b5.webp",
    icon: Construction,
    accentColor: "text-rose-600",
    bgLight: "bg-rose-50",
  },
  {
    id: 8,
    name: "Flooring Services",
    slug: "flooring-services",
    tag: "Epoxy & Trimix Flooring",
    desc: "Heavy-duty epoxy coatings, vacuum dewatered Trimix, polyurethane & laser screed flooring.",
    image: "/b6.webp",
    icon: Maximize,
    accentColor: "text-indigo-600",
    bgLight: "bg-indigo-50",
  },
];

const IndustrialServicesSection = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white via-slate-50/60 to-white border-t border-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Top Header & Intro --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
              <HardHat className="w-4 h-4 text-[#ff6b00]" />
              <span>Industrial & Heavy Infrastructure</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Industrial <span className="text-[#ff6b00]">Services</span> & Solutions
            </h2>
            
            <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              Find verified contractors, PEB specialists, machinery providers, and structural engineers for commercial, industrial, and heavy infrastructure projects across India.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/industrial-services"
              className="inline-flex items-center gap-2 bg-[#ff6b00] hover:bg-[#e66000] text-white px-5 py-3 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* --- Quick Value Highlights Bar --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <div className="flex items-center gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="p-2 rounded-lg bg-orange-100 text-[#ff6b00] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Verified Vendors</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">100% vetted profiles</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Turnkey Solutions</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Design to completion</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Direct Quotes</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">No middleman markup</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Pan-India Support</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Multi-city mobilization</p>
            </div>
          </div>
        </div>

        {/* --- Services Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIAL_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                href={`/industrial-services/${service.slug}`}
                className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                  
                  {/* Category Tag Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-block text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                      {service.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-5 sm:p-6 flex-grow flex flex-col justify-between bg-white">
                  {/* Floating Icon */}
                  <div className={`absolute -top-6 left-5 ${service.bgLight} p-2.5 rounded-xl shadow-md border-2 border-white`}>
                    <Icon className={`w-5 h-5 ${service.accentColor}`} />
                  </div>

                  <div className="pt-2">
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#ff6b00] transition-colors leading-snug">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>

                  {/* Footer link in card */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-[#ff6b00] transition-colors">
                    <span>Explore Contractors</span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-orange-50 group-hover:translate-x-1 transition-all">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#ff6b00]" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* --- Bottom Call to Action Card --- */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Custom Project Requirement?
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Have a large industrial or commercial construction requirement?
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-300 font-normal">
                Post your specifications or hire verified contractors, PEB structural designers, and machinery suppliers across any location in India.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href="/leads"
                className="w-full sm:w-auto bg-[#ff6b00] hover:bg-[#e66000] text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 text-center"
              >
                Post Industrial Requirement
              </Link>
              <Link
                href="/industrial-services"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-transform hover:scale-105 text-center backdrop-blur-sm"
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
