"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PencilRuler, HardHat, Store, Wrench, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROMPTS = [
  {
    id: "architects",
    title: "Architects & Engineers",
    icon: PencilRuler,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    btnColor: "bg-blue-600 hover:bg-blue-700",
    categories: ["Architects", "Interior Designers", "Civil Engineers", "Structural Engineers", "Vastu Consultants"],
    link: "/register?role=architect",
  },
  {
    id: "contractors",
    title: "Contractors",
    icon: HardHat,
    color: "bg-orange-50 text-orange-600 border-orange-100",
    btnColor: "bg-orange-600 hover:bg-orange-700",
    categories: ["Civil Contractors", "Turnkey Contractors", "Painting Contractors", "Electrical Contractors", "Plumbing Contractors"],
    link: "/register?role=contractor",
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
    id: "others",
    title: "Other Services",
    icon: Wrench,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    btnColor: "bg-purple-600 hover:bg-purple-700",
    categories: ["Carpenters", "Electricians", "Plumbers", "Painters", "Fabricators & Welders"],
    link: "/register?role=service",
  },
];

const RegistrationPrompts = () => {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Join Our Network of <span className="text-orange-600">Professionals</span>
          </h2>
          <p className="text-lg text-gray-500 font-medium max-w-3xl mx-auto">
            Select your category, register your business, and start getting quality leads from customers in your city today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PROMPTS.map((prompt, index) => (
            <motion.div 
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl border transition-all duration-300 flex flex-col h-full group ${prompt.color.split(' ')[2]}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${prompt.color.split(' ')[0]} ${prompt.color.split(' ')[1]}`}>
                <prompt.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{prompt.title}</h3>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {prompt.categories.map((cat, i) => (
                  <li key={i} className="flex items-start text-gray-600 font-medium text-sm md:text-base">
                    <Check className={`w-5 h-5 mr-3 shrink-0 ${prompt.color.split(' ')[1]}`} />
                    <span>{cat}</span>
                  </li>
                ))}
                <li className="flex items-start text-gray-400 font-medium text-sm italic mt-2">
                  <ArrowRight className="w-4 h-4 mr-3 shrink-0 opacity-50 mt-0.5" />
                  And many more...
                </li>
              </ul>
              
              <Link href={prompt.link} className="mt-auto">
                <Button className={`w-full h-14 rounded-xl text-white font-bold text-lg shadow-md transition-all group-hover:-translate-y-1 ${prompt.btnColor}`}>
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
