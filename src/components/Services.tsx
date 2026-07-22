"use client";
import Link from "next/link";
import {
  Home,
  Compass,
  HardHat,
  Zap,
  Droplet,
  Grid,
  Paintbrush,
  Waves,
  Building2,
  Layers,
  Bug,
  Leaf,
  Users,
  ChefHat,
  ArrowUpDown,
  Boxes,
  ClipboardCheck,
  Sun,
  Wind,
  Hammer,
  Wrench,
  Shield,
  Settings
} from "lucide-react";

// Section 1: Home Designing and Construction Services
const HOME_SERVICES = [
  { id: 1, label: "House Planning", link: "/architects?profession=Architect", icon: Home, color: "bg-blue-500/10 text-blue-600 hover:border-blue-500" },
  { id: 2, label: "Architect", link: "/architects?profession=Architect", icon: Compass, color: "bg-indigo-500/10 text-indigo-600 hover:border-indigo-500" },
  { id: 3, label: "Contractor (Building & Interior)", link: "/city-partners?profession=Building", icon: HardHat, color: "bg-amber-500/10 text-amber-600 hover:border-amber-500" },
  { id: 4, label: "Electrical Contractor", link: "/city-partners?profession=Electrical", icon: Zap, color: "bg-yellow-500/10 text-yellow-600 hover:border-yellow-500" },
  { id: 5, label: "Plumbing Contractor", link: "/city-partners?profession=Plumbing", icon: Droplet, color: "bg-sky-500/10 text-sky-600 hover:border-sky-500" },
  { id: 6, label: "Tiles & Stone Contractor", link: "/city-partners?profession=Tile & granite", icon: Grid, color: "bg-teal-500/10 text-teal-600 hover:border-teal-500" },
  { id: 7, label: "Painting Contractor", link: "/city-partners?profession=Painting", icon: Paintbrush, color: "bg-rose-500/10 text-rose-600 hover:border-rose-500" },
  { id: 8, label: "Garden & Landscaping Contractor", link: "/city-partners?profession=Interior", icon: Leaf, color: "bg-green-500/10 text-green-600 hover:border-green-500" },
  { id: 9, label: "Carpenter Services", link: "/city-partners?profession=Interior", icon: Hammer, color: "bg-orange-500/10 text-orange-600 hover:border-orange-500" },
  { id: 10, label: "HVAC System Installation", link: "/city-partners?profession=Electrical", icon: Wind, color: "bg-blue-600/10 text-blue-700 hover:border-blue-600" },
  { id: 11, label: "Lift Installation Services", link: "/city-partners?profession=Building", icon: ArrowUpDown, color: "bg-purple-500/10 text-purple-600 hover:border-purple-500" },
  { id: 12, label: "Swimming Pool Contractor", link: "/city-partners?profession=Building", icon: Waves, color: "bg-cyan-500/10 text-cyan-600 hover:border-cyan-500" },
  { id: 13, label: "Solar Panel Installation", link: "/city-partners?profession=Electrical", icon: Sun, color: "bg-amber-600/10 text-amber-700 hover:border-amber-600" },
  { id: 14, label: "Pest Control Service", link: "/city-partners?profession=Building", icon: Bug, color: "bg-red-500/10 text-red-600 hover:border-red-500" },
  { id: 15, label: "Water Proofing Installation", link: "/city-partners?profession=Building", icon: Shield, color: "bg-sky-600/10 text-sky-700 hover:border-sky-600" },
  { id: 16, label: "False Ceiling Contractor", link: "/city-partners?profession=Interior", icon: Layers, color: "bg-fuchsia-500/10 text-fuchsia-600 hover:border-fuchsia-500" },
  { id: 17, label: "Modular Kitchen Services", link: "/city-partners?profession=Interior", icon: ChefHat, color: "bg-orange-500/10 text-orange-600 hover:border-orange-500" },
];

// Section 2: Industrial Construction and Infrastructure Services
const INDUSTRIAL_SERVICES = [
  { id: 1, label: "Pre Engineering Buildings", link: "/city-partners?profession=Building", icon: Building2, color: "bg-emerald-500/10 text-emerald-600 hover:border-emerald-500" },
  { id: 2, label: "Pre Fabricated Buildings", link: "/city-partners?profession=Building", icon: Layers, color: "bg-violet-500/10 text-violet-600 hover:border-violet-500" },
  { id: 3, label: "Pre Cast Concrete Material", link: "/marketplace?category=Building Material", icon: Boxes, color: "bg-stone-500/10 text-stone-600 hover:border-stone-500" },
  { id: 4, label: "Machinery Services", link: "/city-partners?profession=Building", icon: Settings, color: "bg-gray-500/10 text-gray-600 hover:border-gray-500" },
  { id: 5, label: "Manpower Supply", link: "/city-partners?profession=Building", icon: Users, color: "bg-fuchsia-500/10 text-fuchsia-600 hover:border-fuchsia-500" },
  { id: 6, label: "Building Inspection Services", link: "/city-partners?profession=Building", icon: ClipboardCheck, color: "bg-slate-500/10 text-slate-600 hover:border-slate-500" },
  { id: 7, label: "Building Material Services", link: "/marketplace?category=Building Material", icon: Wrench, color: "bg-orange-600/10 text-orange-700 hover:border-orange-600" },
];

const Services = () => {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1 */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Home Designing &amp; Construction Services
            </h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              Click on any category below to instantly find and connect with verified local professionals registered in your city.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {HOME_SERVICES.map((option) => (
              <Link
                key={option.id}
                href={option.link}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 hover:scale-105 group text-center"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300 ${option.color.split(" ")[0]} ${option.color.split(" ")[1]}`}>
                  <option.icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 px-1">
                  {option.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Industrial Construction &amp; Infrastructure Services
            </h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              Explore specialized services and experts for large scale industrial and infrastructure projects.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {INDUSTRIAL_SERVICES.map((option) => (
              <Link
                key={option.id}
                href={option.link}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 hover:scale-105 group text-center"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300 ${option.color.split(" ")[0]} ${option.color.split(" ")[1]}`}>
                  <option.icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 px-1">
                  {option.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Services;
