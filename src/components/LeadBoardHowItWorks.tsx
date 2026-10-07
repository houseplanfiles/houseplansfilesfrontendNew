"use client";
import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Search, FileText, CheckCircle, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create Profile",
    desc: "Register as a professional and set up your business profile with your portfolio.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Search,
    title: "Browse Leads",
    desc: "Access our live Lead Board and find requirements matching your expertise in your city.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: FileText,
    title: "Send Proposals",
    desc: "Contact the clients directly, share your quotations, and discuss the project details.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: CheckCircle,
    title: "Close Deals",
    desc: "Convert leads into clients and grow your construction business exponentially.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

const LeadBoardHowItWorks = () => {
  return (
    <div className="py-5 md:py-12 mt-4 md:mt-10 border-t border-gray-100 bg-[#FAF9F6]">
      <div className="text-center mb-5 md:mb-12">
        <h2 className="text-xl md:text-5xl font-black text-[#1e293b] tracking-tight mb-0.5 md:mb-2">
          Lead Board
        </h2>
        <h3 className="text-base md:text-3xl font-bold text-orange-600 mb-2 md:mb-4">
          How It Works
        </h3>
        <p className="text-gray-500 text-xs md:text-base font-medium max-w-2xl mx-auto px-4 md:px-0">
          Get verified construction and design leads directly on your dashboard. Grow your business in 4 simple steps.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative px-1 md:px-0">
        {/* Connecting Line (hidden on mobile) */}
        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-gray-100 via-orange-200 to-gray-100 z-0"></div>

        {STEPS.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="relative z-10 flex flex-col items-center text-center group bg-white p-3 md:p-6 rounded-xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className={`w-11 h-11 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-2.5 md:mb-5 group-hover:scale-110 transition-transform duration-300 relative`}>
              <step.icon className="w-5 h-5 md:w-7 md:h-7" />
              <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-7 md:h-7 bg-gray-900 text-white text-[9px] md:text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {index + 1}
              </div>
            </div>
            <h4 className="text-sm md:text-lg font-extrabold text-gray-900 mb-1 md:mb-2 group-hover:text-orange-600 transition-colors">{step.title}</h4>
            <p className="text-gray-500 text-[10px] md:text-sm font-medium leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeadBoardHowItWorks;
