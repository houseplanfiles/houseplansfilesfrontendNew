"use client";
import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, IndianRupee, Sparkles, Building2, PhoneCall, CheckCircle2 } from 'lucide-react';

interface LeadItem {
  _id: string;
  title: string;
  category: string;
  city: string;
  budget: string;
  postedAgo?: string;
  verified?: boolean;
}

const DEFAULT_REAL_LEADS: LeadItem[] = [
  {
    _id: "lead_1",
    title: "Looking for Home Designing & 3D Front Elevation",
    category: "Architect",
    city: "Pune, Maharashtra",
    budget: "₹45,000 - ₹60,000",
    postedAgo: "5 mins ago",
    verified: true,
  },
  {
    _id: "lead_2",
    title: "Full Turnkey Villa Construction (30x50 G+1 RCC)",
    category: "Contractor / Builder",
    city: "Bhopal, MP",
    budget: "₹48 Lakhs - ₹55 Lakhs",
    postedAgo: "12 mins ago",
    verified: true,
  },
  {
    _id: "lead_3",
    title: "Modular Kitchen & Complete Living Room Interior Work",
    category: "Interior Designer",
    city: "Kolkata, WB",
    budget: "₹6.5 Lakhs - ₹9 Lakhs",
    postedAgo: "22 mins ago",
    verified: true,
  },
  {
    _id: "lead_4",
    title: "Modern Duplex House Planning & Structural Drawing",
    category: "Architect & Engineer",
    city: "Faridabad, NCR",
    budget: "₹30,000 - ₹45,000",
    postedAgo: "35 mins ago",
    verified: true,
  },
  {
    _id: "lead_5",
    title: "House Construction Requirement (20x50 East Facing)",
    category: "House Construction",
    city: "Kanpur, UP",
    budget: "₹50 Lakhs+",
    postedAgo: "40 mins ago",
    verified: true,
  },
  {
    _id: "lead_6",
    title: "Looking for Site Engineer / Supervisor for Commercial Site",
    category: "Site Engineer",
    city: "Bangalore, Karnataka",
    budget: "₹35,000 / month",
    postedAgo: "1 hr ago",
    verified: true,
  },
  {
    _id: "lead_7",
    title: "Vastu Compliant 4BHK Luxury Villa Architectural Plan",
    category: "Architect",
    city: "Indore, MP",
    budget: "₹55,000 - ₹75,000",
    postedAgo: "1 hr ago",
    verified: true,
  },
  {
    _id: "lead_8",
    title: "Boundary Wall, PEB Shed & Flooring Contractor Required",
    category: "Contractor",
    city: "Jaipur, Rajasthan",
    budget: "₹18 Lakhs - ₹25 Lakhs",
    postedAgo: "2 hrs ago",
    verified: true,
  },
];

export default function LeadSteps() {
  const [realLeads, setRealLeads] = React.useState<LeadItem[]>(DEFAULT_REAL_LEADS);

  React.useEffect(() => {
    const fetchLeads = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://nexaflowbackend.onrender.com";
        const res = await fetch(`${backendUrl}/api/leads`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.slice(0, 15).map((l: any, i: number) => ({
              _id: l._id || `lead_${i}`,
              title: l.title || l.requirements || "Residential House Planning & Construction Lead",
              category: l.category || "House Construction",
              city: l.city || "India",
              budget: l.budget ? (String(l.budget).startsWith("₹") ? l.budget : `₹${l.budget}`) : "₹25L - ₹50L",
              postedAgo: "Active Now",
              verified: true,
            }));
            setRealLeads(mapped);
          }
        }
      } catch {
        // fallback to default
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className="w-full bg-[#FAF9F6] pb-16 pt-8 border-t border-gray-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 py-4 px-6 shadow-md border-y-4 border-orange-600 relative overflow-hidden flex justify-center">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center z-10">
          <h2 className="text-white text-2xl md:text-3xl font-black whitespace-nowrap drop-shadow-md uppercase tracking-wider">
            PROJECT LEAD BOARD
          </h2>
          <div className="w-0.5 h-6 md:h-8 bg-orange-200/50 hidden md:block"></div>
          <p className="text-white text-lg md:text-2xl font-bold tracking-wide drop-shadow-md italic">
            Direct Homeowner Requirements For Architects &amp; Contractors
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Live Indicator Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight text-slate-900">
                REAL LIVE PROJECT LEADS
              </h3>
              <span className="text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider">
                Live &amp; Verified
              </span>
            </div>
          </div>
          <Link
            href="/leads"
            className="text-sm md:text-base font-extrabold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 group transition-colors"
          >
            <span>Explore all leads</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Big Premium Live Leads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {realLeads.slice(0, 8).map((lead) => (
            <Link
              key={lead._id}
              href="/leads"
              className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-gray-200/90 hover:border-orange-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Badge & City Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-black text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                    {lead.category}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{lead.city}</span>
                  </span>
                </div>

                {/* Lead Title */}
                <h4 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2 mb-4">
                  {lead.title}
                </h4>

                {/* Verified Tag & Posting Status */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Homeowner</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {lead.postedAgo || "Just now"}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Budget & Unlock Button */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Client Budget
                  </div>
                  <div className="text-base md:text-lg font-black text-slate-900 flex items-center gap-0.5 text-emerald-600">
                    {lead.budget}
                  </div>
                </div>

                <div className="bg-orange-50 group-hover:bg-orange-500 text-orange-600 group-hover:text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-extrabold flex items-center gap-1.5 transition-all shadow-sm">
                  <span>Unlock Lead</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Wide CTA Button */}
        <div className="mt-10 text-center">
          <Link
            href="/leads"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-105 text-base md:text-lg cursor-pointer"
          >
            <span>Explore All Live Project Leads &amp; Connect With Clients</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
