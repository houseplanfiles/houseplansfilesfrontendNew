"use client";
import React, { FC } from "react";
import { useRouter } from "next/navigation";
import {
  PencilRuler,
  Sofa,
  HardHat,
  Zap,
  Droplet,
  LayoutGrid,
  PaintRoller,
  Hammer,
  AppWindow,
  Cuboid,
  Factory,
  PackageOpen,
  Settings,
  Users,
  ClipboardCheck,
  Truck,
  Bug,
  Fan,
  ArrowUpDown,
  Sun,
  Cpu,
  Umbrella,
  TreePine,
  Utensils,
  Waves,
  Flame,
  Wrench,
} from "lucide-react";

// Section 1: Home Designing and Construction Services
const HOME_SERVICES = [
  { id: 1, label: "Architects & engineers", link: "/architects", icon: PencilRuler, color: "bg-blue-500/10 text-blue-600 hover:border-blue-500" },
  { id: 2, label: "Interior designer", link: "/home-designing-services?profession=Interior", icon: Sofa, color: "bg-indigo-500/10 text-indigo-600 hover:border-indigo-500" },
  { id: 3, label: "Contractors Buildind & Interior", link: "/home-designing-services?profession=Building", icon: HardHat, color: "bg-amber-500/10 text-amber-600 hover:border-amber-500" },
  { id: 4, label: "Electrical Contractor", link: "/home-designing-services?profession=Electrical", icon: Zap, color: "bg-yellow-500/10 text-yellow-600 hover:border-yellow-500" },
  { id: 5, label: "Plumbing Contractor", link: "/home-designing-services?profession=Plumbing", icon: Droplet, color: "bg-sky-500/10 text-sky-600 hover:border-sky-500" },
  { id: 6, label: "Tiles & Stone Contractor", link: "/home-designing-services?profession=Tiles %26 Granite", icon: LayoutGrid, color: "bg-teal-500/10 text-teal-600 hover:border-teal-500" },
  { id: 7, label: "Painting Contractor", link: "/home-designing-services?profession=Painting %26 Waterproofing", icon: PaintRoller, color: "bg-rose-500/10 text-rose-600 hover:border-rose-500" },
  { id: 9, label: "Carpenter Services", link: "/home-designing-services?profession=Carpenter", icon: Hammer, color: "bg-orange-500/10 text-orange-600 hover:border-orange-500" },
  { id: 16, label: "False Ceiling Contractor", link: "/home-designing-services?profession=Interior", icon: AppWindow, color: "bg-fuchsia-500/10 text-fuchsia-600 hover:border-fuchsia-500" },
  { id: 21, label: "Building material", link: "/marketplace?category=Building Material", icon: Cuboid, color: "bg-emerald-500/10 text-emerald-600 hover:border-emerald-500" },
];

// Section 2: Industrial Construction and Infrastructure Services
const INDUSTRIAL_SERVICES = [
  { id: 1, label: "Pre Engineering Buildings", link: "/industrial-services?profession=Pre Engineering Board / PEB", icon: Factory, color: "bg-emerald-500/10 text-emerald-600 hover:border-emerald-500" },
  { id: 2, label: "Pre Fabricated Buildings", link: "/industrial-services?profession=Pre Fabricated House", icon: PackageOpen, color: "bg-violet-500/10 text-violet-600 hover:border-violet-500" },
  { id: 3, label: "Pre Cast Concrete Material", link: "/industrial-services?profession=Building", icon: Cuboid, color: "bg-stone-500/10 text-stone-600 hover:border-stone-500" },
  { id: 4, label: "Machinery Services", link: "/industrial-services?profession=Building", icon: Settings, color: "bg-gray-500/10 text-gray-600 hover:border-gray-500" },
  { id: 5, label: "Manpower Supply", link: "/industrial-services?profession=Manpower Supply", icon: Users, color: "bg-fuchsia-500/10 text-fuchsia-600 hover:border-fuchsia-500" },
  { id: 6, label: "Building Inspection Services", link: "/industrial-services?profession=Building Inspection", icon: ClipboardCheck, color: "bg-slate-500/10 text-slate-600 hover:border-slate-500" },
  { id: 7, label: "Bulk Building Material Services", link: "/industrial-services?profession=Building", icon: Truck, color: "bg-orange-600/10 text-orange-700 hover:border-orange-600" },
];

// Section 3: Other Services
const OTHER_SERVICES = [
  { id: 14, label: "Pest Control Service", link: "/other-services?profession=Pest Control", icon: Bug, color: "bg-red-500/10 text-red-600 hover:border-red-500" },
  { id: 10, label: "HVAC System Installation", link: "/other-services?profession=HVAC", icon: Fan, color: "bg-blue-600/10 text-blue-700 hover:border-blue-600" },
  { id: 11, label: "Lift Installation Services", link: "/other-services?profession=Lift Services", icon: ArrowUpDown, color: "bg-purple-500/10 text-purple-600 hover:border-purple-500" },
  { id: 13, label: "Solar Panel Installation", link: "/other-services?profession=Solar Rooftop Panel", icon: Sun, color: "bg-amber-600/10 text-amber-700 hover:border-amber-600" },
  { id: 18, label: "Home Automation", link: "/other-services?profession=Electrical", icon: Cpu, color: "bg-yellow-600/10 text-yellow-700 hover:border-yellow-600" },
  { id: 15, label: "Water Proofing Installation", link: "/other-services?profession=Painting %26 Waterproofing", icon: Umbrella, color: "bg-sky-600/10 text-sky-700 hover:border-sky-600" },
  { id: 8, label: "Garden & Landscaping Contractor", link: "/other-services?profession=Landscaping %26 Garden", icon: TreePine, color: "bg-green-500/10 text-green-600 hover:border-green-500" },
  { id: 17, label: "Modular Kitchen Services", link: "/other-services?profession=Modular Kitchen", icon: Utensils, color: "bg-orange-500/10 text-orange-600 hover:border-orange-500" },
  { id: 12, label: "Swimming Pool Contractor", link: "/other-services?profession=Swimming Pool", icon: Waves, color: "bg-cyan-500/10 text-cyan-600 hover:border-cyan-500" },
  { id: 22, label: "Fire safety services", link: "/other-services?profession=Building", icon: Flame, color: "bg-red-500/10 text-red-600 hover:border-red-500" },
  { id: 23, label: "Fabricator", link: "/other-services?profession=Glass Fabricator", icon: Wrench, color: "bg-gray-500/10 text-gray-600 hover:border-gray-500" },
];

const HomeServicesCategoriesSection: FC = () => {
  const router = useRouter();

  return (
    <section id="services-categories" className="bg-gray-50 pt-16 pb-6 md:pt-20 md:pb-8 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- WHAT ARE YOU LOOKING FOR? GRID SECTION 1 --- */}
        <div className="mb-16">
          <div className="text-center pt-2 mb-10 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Home Designing &amp; Construction <span className="text-orange-600">Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Click on any category below to instantly find and connect with verified local professionals registered in your city.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
            {HOME_SERVICES.map((option) => (
              <button
                key={option.id}
                onClick={() => router.push(option.link)}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100/80 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 group text-center min-h-[120px]"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${option.color.split(" ")[0]} ${option.color.split(" ")[1]}`}>
                  <option.icon size={40} strokeWidth={2} />
                </div>
                <span className="text-sm md:text-base font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 px-1 leading-snug">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* --- WHAT ARE YOU LOOKING FOR? GRID SECTION 2 --- */}
        <div className="mb-16">
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Other <span className="text-orange-600">Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Discover a wide range of additional maintenance and finishing services.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
            {OTHER_SERVICES.map((option) => (
              <button
                key={option.id}
                onClick={() => router.push(option.link)}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100/80 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 group text-center min-h-[120px]"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${option.color.split(" ")[0]} ${option.color.split(" ")[1]}`}>
                  <option.icon size={40} strokeWidth={2} />
                </div>
                <span className="text-sm md:text-base font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 px-1 leading-snug">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* --- WHAT ARE YOU LOOKING FOR? GRID SECTION 3 --- */}
        <div className="mb-8">
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Industrial Construction &amp; <span className="text-orange-600">Infrastructure Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Explore specialized services and experts for large scale industrial and infrastructure projects.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
            {INDUSTRIAL_SERVICES.map((option) => (
              <button
                key={option.id}
                onClick={() => router.push(option.link)}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100/80 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 group text-center min-h-[120px]"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${option.color.split(" ")[0]} ${option.color.split(" ")[1]}`}>
                  <option.icon size={40} strokeWidth={2} />
                </div>
                <span className="text-sm md:text-base font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 px-1 leading-snug">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeServicesCategoriesSection;
