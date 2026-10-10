"use client";
import React from 'react';
import Link from 'next/link';
import { Search, User, MapPin, IndianRupee, Clock, Lock, MessageCircle, Phone, ArrowRight, TrendingUp, Users, Home, Grid } from 'lucide-react';
import Image from 'next/image';

const steps = [
  {
    num: 1,
    title: "Customer Enquiry",
    desc: "A customer searches for home designing, construction or related services on HousePlanFiles.com and submits an enquiry.",
    mockup: (
      <div className="bg-white border-2 border-slate-700 rounded-lg overflow-hidden h-full flex flex-col shadow-sm text-left">
        <div className="bg-slate-700 h-2 w-full flex items-center px-1 space-x-1">
          <div className="w-1 h-1 rounded-full bg-red-400"></div><div className="w-1 h-1 rounded-full bg-yellow-400"></div><div className="w-1 h-1 rounded-full bg-green-400"></div>
        </div>
        <div className="p-2 flex-grow flex flex-col">
          <div className="flex items-center gap-1 mb-2">
            <div className="w-3 h-3 bg-orange-500 rounded flex items-center justify-center text-white text-[6px] font-bold">H</div>
            <span className="text-[7px] font-bold text-slate-800">HousePlanFiles<span className="text-gray-400 font-normal">.com</span></span>
          </div>
          <div className="flex bg-gray-50 border border-gray-200 rounded-md overflow-hidden mb-2">
            <input type="text" value="home design near me" readOnly className="text-[7px] bg-transparent w-full px-1.5 py-1 text-slate-700 outline-none" />
            <div className="bg-orange-500 w-4 flex items-center justify-center"><Search className="w-2 h-2 text-white" /></div>
          </div>
          <div className="space-y-1.5 mb-2">
            <div className="flex items-center gap-1.5"><User className="w-2 h-2 text-gray-400"/><div className="h-1 bg-gray-200 rounded w-16"></div></div>
            <div className="flex items-center gap-1.5"><User className="w-2 h-2 text-gray-400"/><div className="h-1 bg-gray-200 rounded w-20"></div></div>
            <div className="flex items-center gap-1.5"><User className="w-2 h-2 text-gray-400"/><div className="h-1 bg-gray-200 rounded w-14"></div></div>
          </div>
          <Link href="/leads" className="mt-auto bg-orange-500 hover:bg-orange-600 text-white text-[7px] font-bold text-center py-1 rounded-md block transition-colors">
            Submit Enquiry
          </Link>
        </div>
      </div>
    )
  },
  {
    num: 2,
    title: "Lead Goes to Lead Board",
    desc: "The enquiry is verified and listed on the Lead Board with complete details like location, requirement and budget.",
    mockup: (
      <div className="bg-white border-2 border-slate-700 rounded-lg overflow-hidden h-full flex flex-col shadow-sm text-left">
        <div className="bg-slate-800 text-white text-[8px] font-bold px-2 py-1.5 flex items-center gap-1">
          <Users className="w-2.5 h-2.5" /> Lead Board
        </div>
        <div className="p-2 flex-grow flex flex-col border border-orange-200 m-1 rounded-md bg-white">
          <div className="flex items-center justify-between mb-1">
            <span className="bg-orange-500 text-white text-[5px] px-1 py-0.5 rounded-sm font-bold">New Lead</span>
            <span className="text-[5px] text-orange-600 font-bold bg-orange-50 px-1 py-0.5 rounded">Bhopal</span>
          </div>
          <div className="flex items-center gap-1 text-[7px] font-bold text-slate-800 mb-1"><Home className="w-2 h-2 text-slate-500"/> House Construction</div>
          <div className="flex items-center gap-1 text-[7px] text-slate-600 mb-1"><MapPin className="w-2 h-2 text-slate-400"/> Bhopal, MP</div>
          <div className="flex items-center gap-1 text-[7px] font-bold text-slate-800 mb-1"><IndianRupee className="w-2 h-2 text-slate-400"/> Budget: ₹50 Lacs</div>
          <div className="flex items-center gap-1 text-[6px] text-slate-500 mb-1.5"><Clock className="w-2 h-2 text-slate-400"/> Just Now (Only 2 Seats)</div>
          <Link href="/leads" className="mt-auto bg-orange-500 hover:bg-orange-600 text-white text-[7px] font-bold text-center py-1 rounded-md block transition-colors">
            View Details
          </Link>
        </div>
      </div>
    )
  },
  {
    num: 3,
    title: "Check & Choose Leads",
    desc: "Browse the latest leads on your dashboard or Lead Board. Check all details and select the leads you want to purchase.",
    mockup: (
      <div className="bg-white border-2 border-slate-700 rounded-lg overflow-hidden h-full flex flex-col shadow-sm text-left relative">
         <div className="bg-slate-700 h-2 w-full flex items-center px-1 space-x-1">
          <div className="w-1 h-1 rounded-full bg-red-400"></div><div className="w-1 h-1 rounded-full bg-yellow-400"></div><div className="w-1 h-1 rounded-full bg-green-400"></div>
        </div>
        <div className="flex flex-grow overflow-hidden">
          <div className="w-[30%] bg-slate-800 p-1 flex flex-col gap-1">
            <div className="flex items-center gap-1 mb-1 border-b border-slate-600 pb-1">
               <div className="w-2 h-2 bg-orange-500 rounded-sm"></div><span className="text-[4px] text-white font-bold">HousePlanFiles</span>
            </div>
            <div className="text-[5px] text-slate-300 flex items-center gap-1"><Grid className="w-2 h-2"/> Dashboard</div>
            <Link href="/leads" className="text-[5px] text-white bg-orange-500 rounded-sm px-1 py-0.5 flex items-center gap-1">
              <Users className="w-2 h-2"/> Lead Board
            </Link>
            <div className="text-[5px] text-slate-300 flex items-center gap-1"><User className="w-2 h-2"/> My Profile</div>
          </div>
          <div className="w-[70%] bg-gray-50 p-1.5 flex flex-col">
            <div className="flex text-[5px] font-bold text-slate-700 border-b border-gray-200 pb-0.5 mb-1">
              <span className="w-2/3">Customer Details</span>
              <span className="w-1/3 text-right">Location</span>
            </div>
            <Link href="/leads" className="flex text-[5px] text-slate-600 mb-1 bg-white p-0.5 rounded shadow-sm border border-gray-100 hover:border-orange-300 transition-colors">
              <span className="w-2/3 flex flex-col"><span className="font-bold text-slate-800">1. House Construction</span><span className="text-[4px] text-slate-400">Budget: ₹50 Lacs</span></span>
              <span className="w-1/3 text-right">Bhopal</span>
            </Link>
            <Link href="/leads" className="flex text-[5px] text-slate-600 mb-1 bg-white p-0.5 rounded shadow-sm border border-gray-100 hover:border-orange-300 transition-colors">
               <span className="w-2/3 flex flex-col"><span className="font-bold text-slate-800">2. Interior Design</span><span className="text-[4px] text-slate-400">Budget: ₹20-30 Lakh</span></span>
              <span className="w-1/3 text-right">Indore</span>
            </Link>
          </div>
        </div>
      </div>
    )
  },
  {
    num: 4,
    title: "Purchase Leads",
    desc: "Buy verified leads at nominal rates (₹99 - ₹499). Each lead is strictly shared with only 2 professionals.",
    mockup: (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col shadow-sm text-left p-2">
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-[8px] font-bold text-slate-800">Choose Lead</h4>
          <span className="text-[5px] bg-orange-100 text-orange-700 font-bold px-1 py-0.5 rounded">Max 2 Pros</span>
        </div>
        <div className="flex-grow flex flex-col gap-1">
          <div className="flex items-center justify-between border border-orange-400 bg-orange-50 rounded-md p-1 relative overflow-hidden">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border-2 border-orange-500 flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-orange-500"></div></div>
              <span className="text-[6.5px] font-bold text-slate-800">Standard Lead</span>
            </div>
            <span className="text-[7px] font-bold text-orange-600">₹99 / ₹149</span>
          </div>
          <div className="flex items-center justify-between border border-gray-200 rounded-md p-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border border-gray-300"></div>
              <span className="text-[6.5px] text-slate-600">High Budget Lead</span>
            </div>
            <span className="text-[7px] font-bold text-slate-800">₹199 / ₹499</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded p-1 text-[5px] text-slate-500 text-center font-medium">
            🔒 Only available for 2 professionals
          </div>
        </div>
        <Link href="/leads" className="mt-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[7px] font-bold flex items-center justify-center gap-1 py-1 rounded-md transition-colors block text-center">
          <Lock className="w-2 h-2 inline" /> Unlock Lead
        </Link>
      </div>
    )
  },
  {
    num: 5,
    title: "Contact Customers",
    desc: "Get direct contact details (WhatsApp / Call) and connect with the customer to discuss their requirements and convert the lead.",
    mockup: (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col shadow-sm text-left p-2">
        <div className="flex flex-col gap-1.5 mb-2">
          <Link 
            href="/leads"
            className="bg-green-500 hover:bg-green-600 active:scale-95 text-white text-[8px] font-bold flex items-center justify-center gap-1 py-1.5 rounded-md shadow-sm transition-all cursor-pointer"
          >
            <MessageCircle className="w-2.5 h-2.5" /> Chat on WhatsApp
          </Link>
          <Link 
            href="/leads"
            className="border border-slate-300 hover:bg-slate-100 active:scale-95 text-slate-700 text-[8px] font-bold flex items-center justify-center gap-1 py-1.5 rounded-md transition-all cursor-pointer"
          >
            <Phone className="w-2.5 h-2.5" /> Call Now
          </Link>
        </div>
        <div className="border-t border-gray-100 pt-1.5 flex flex-col gap-1 mt-auto">
          <div className="flex items-center gap-1 text-[7px]"><User className="w-2 h-2 text-slate-500"/><span className="text-slate-500">Requirement:</span> <span className="font-bold text-slate-800 line-clamp-1">House Construction</span></div>
          <div className="flex items-center gap-1 text-[7px]"><MapPin className="w-2 h-2 text-slate-500"/><span className="text-slate-500">City:</span> <span className="font-bold text-slate-800">Bhopal</span></div>
          <div className="flex items-center gap-1 text-[7px]"><IndianRupee className="w-2 h-2 text-slate-500"/><span className="text-slate-500">Budget:</span> <span className="font-bold text-slate-800">₹50 Lacs</span></div>
          <div className="flex items-center gap-1 text-[7px]"><Phone className="w-2 h-2 text-slate-500"/><span className="text-slate-500">Contact:</span> <span className="font-bold text-slate-800">88XXXXXX90</span></div>
        </div>
      </div>
    )
  },
  {
    num: 6,
    title: "Get More Business",
    desc: "Turn enquiries into projects and grow your business with regular leads from HousePlanFiles.com.",
    mockup: (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col shadow-sm text-left relative">
        <div className="absolute inset-0 bg-blue-50/50">
          <Image src="/b11.webp" alt="More Business" fill sizes="20vw" className="object-cover opacity-80" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <TrendingUp className="w-12 h-12 text-green-500 drop-shadow-md transform -rotate-12 translate-x-4 -translate-y-4" strokeWidth={3} />
        </div>
        <Link href="/leads" className="mt-auto relative z-10 bg-orange-500 hover:bg-orange-600 text-white text-center py-1.5 px-2 rounded-t-xl block transition-colors">
          <div className="text-[8px] font-bold leading-tight">More Leads<br/>More Projects<br/>More Growth</div>
        </Link>
      </div>
    )
  }
];

export default function LeadSteps() {
  return (
    <div className="w-full bg-white pb-16 pt-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-3 px-6 shadow-md border-y-4 border-orange-600 relative overflow-hidden flex justify-center">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center z-10">
          <h2 className="text-white text-2xl md:text-3xl font-black whitespace-nowrap drop-shadow-md uppercase tracking-wider">Lead Board</h2>
          <div className="w-0.5 h-6 md:h-8 bg-orange-200/50 hidden md:block"></div>
          <p className="text-white text-lg md:text-2xl font-bold tracking-wide drop-shadow-md italic">How It Works</p>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="max-w-[1600px] mx-auto px-2 md:px-4 mt-12 md:mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-4 relative">
          
          {steps.map((step, index) => (
            <div key={step.num} className="flex flex-col bg-[#F8F9FA] rounded-[16px] md:rounded-[20px] p-2 md:p-4 relative group hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
              
              {/* Number Badge */}
              <div className="absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-lg border-4 border-white z-10 group-hover:scale-110 transition-transform">
                {step.num}
              </div>

              {/* Title */}
              <div className="text-center mt-5 md:mt-6 mb-3 md:mb-4 flex-grow">
                <h3 className="font-extrabold text-slate-800 text-[12px] md:text-[15px] leading-tight min-h-[34px] md:min-h-[38px] flex items-center justify-center group-hover:text-orange-600 transition-colors">{step.title}</h3>
              </div>

              {/* Mockup Container */}
              <div className="h-[180px] w-full rounded-lg md:rounded-xl overflow-hidden mt-auto mx-auto border border-gray-200/50 bg-white p-1">
                {step.mockup}
              </div>

              {/* Arrows between steps (hidden on small screens, shown only if not last) */}
              {index < steps.length - 1 && (
                <div className="hidden xl:flex absolute top-[40%] -right-3 z-20 text-orange-500 bg-white rounded-full p-1 shadow-sm">
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </div>
              )}
            </div>
          ))}
          
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Link
            href="/leads"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-105 text-sm md:text-base cursor-pointer"
          >
            <span>Explore Lead Board &amp; Get Leads</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
