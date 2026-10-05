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
    <div className="py-12 mt-10 border-t border-gray-100">
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Lead Board — <span className="text-orange-600">How It Works</span>
        </h3>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto">
          Get verified construction and design leads directly on your dashboard. Grow your business in 4 simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Connecting Line (hidden on mobile) */}
        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-gray-100 via-orange-200 to-gray-100 z-0"></div>

        {STEPS.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="relative z-10 flex flex-col items-center text-center group"
          >
            <div className={`w-20 h-20 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative bg-white`}>
              <step.icon className="w-8 h-8" />
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 text-white font-bold rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                {index + 1}
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
            <p className="text-gray-500 text-sm font-medium leading-relaxed px-4">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeadBoardHowItWorks;
