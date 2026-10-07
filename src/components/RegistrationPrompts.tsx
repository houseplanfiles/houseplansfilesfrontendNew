"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PencilRuler, HardHat, Store, Wrench, Factory, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROMPTS = [
  {
    id: "architects",
    title: "Architects & Engineers",
    icon: PencilRuler,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    btnColor: "bg-blue-600 hover:bg-blue-700",
    categories: ["Architects", "Interior Designers", "Civil Engineers", "Structural Engineers", "Vastu Consultants"],
    link: "/register?role=professional",
  },
  {
    id: "contractors",
    title: "Contractors",
    icon: HardHat,
    color: "bg-orange-50 text-orange-600 border-orange-100",
    btnColor: "bg-orange-600 hover:bg-orange-700",
    categories: ["Civil Contractors", "Turnkey Contractors", "Painting Contractors", "Electrical Contractors", "Plumbing Contractors"],
    link: "/register?role=Contractor",
  },
  {
    id: "marketplace",
    title: "Building Material (Marketplace)",
    icon: Store,
    color: "bg-red-50 text-red-600 border-red-100",
    btnColor: "bg-red-600 hover:bg-red-700",
    categories: ["Cement & Steel", "Bricks & Blocks", "Tiles & Marbles", "Hardware & Paints", "Home Decor & Furniture"],
    link: "/register?role=seller",
  },
  {
    id: "industrial",
    title: "Industrial & Infrastructure",
    icon: Factory,
    color: "bg-teal-50 text-teal-600 border-teal-100",
    btnColor: "bg-teal-600 hover:bg-teal-700",
    categories: ["Pre Engineered Buildings", "Pre Fabricated Buildings", "Machinery Rental", "Manpower Supply", "Project Managers"],
    link: "/register?role=industrial",
  },
  {
    id: "others",
    title: "Other Services",
    icon: Wrench,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    btnColor: "bg-purple-600 hover:bg-purple-700",
    categories: ["Carpenters", "Electricians", "Plumbers", "Painters", "Fabricators & Welders"],
    link: "/register?role=other_services",
  },
];

const RegistrationPrompts = () => {
  return (
    <section className="py-10 md:py-16 bg-[#FAF9F6] border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7 md:mb-12">
          <h2 className="text-2xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2 md:mb-4">
            Join Our Network of <span className="text-orange-600">Professionals</span>
          </h2>
          <p className="text-sm md:text-lg text-gray-500 font-medium max-w-3xl mx-auto px-2">
            Select your category, register your business, and start getting quality leads from customers in your city today.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {PROMPTS.map((prompt, index) => (
            <motion.div 
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`bg-white rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-xl border transition-all duration-300 flex flex-col h-full group ${prompt.color.split(' ')[2]}`}
            >
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-5 transition-transform group-hover:scale-110 ${prompt.color.split(' ')[0]} ${prompt.color.split(' ')[1]}`}>
                <prompt.icon className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              
              <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-2 md:mb-5 leading-tight">{prompt.title}</h3>
              
              <ul className="space-y-1.5 md:space-y-3 mb-4 md:mb-8 flex-grow">
                {prompt.categories.map((cat, i) => (
                  <li key={i} className="flex items-start text-gray-600 font-medium text-[11px] md:text-sm">
                    <Check className={`w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 shrink-0 mt-0.5 ${prompt.color.split(' ')[1]}`} />
                    <span>{cat}</span>
                  </li>
                ))}
                <li className="flex items-start text-gray-400 font-medium text-[10px] md:text-xs italic mt-1">
                  <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1.5 md:mr-2 shrink-0 opacity-50 mt-0.5" />
                  And many more...
                </li>
              </ul>
              
              <Link href={prompt.link} className="mt-auto">
                <Button className={`w-full h-9 md:h-12 rounded-lg md:rounded-xl text-white font-bold text-xs md:text-base shadow-md transition-all group-hover:-translate-y-1 ${prompt.btnColor}`}>
                  Register Now
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegistrationPrompts;
