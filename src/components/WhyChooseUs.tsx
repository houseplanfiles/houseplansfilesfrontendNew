import React from "react";
import Image from "next/image";
import { ShieldCheck, IndianRupee, Map, Lock, LayoutGrid } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    subtitle: "& Businesses",
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    subtitle: "& Real Reviews",
  },
  {
    icon: Map,
    title: "Pan India",
    subtitle: "Service Network",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    subtitle: "& Support",
  },
  {
    icon: LayoutGrid,
    title: "Easy Range of",
    subtitle: "Products & Services",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-[#1e293b] text-white py-12 lg:py-0 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Content */}
          <div className="w-full lg:w-3/5 lg:py-12 z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-white">
              Why Choose HousePlanFiles?
            </h2>
            <p className="text-gray-400 mb-12 text-sm md:text-base font-medium">
              Sirf ek platform nahi, aapke construction journey ka complete partner.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4">
              {FEATURES.map((feature, index) => (
                <div key={index} className="flex flex-col gap-3 group">
                  <div className="w-12 h-12 rounded-xl border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-200 leading-tight group-hover:text-white transition-colors">
                      {feature.title}
                    </p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="w-full lg:w-2/5 relative mt-12 lg:mt-0 h-[350px] lg:h-[450px]">
            {/* Using an existing placeholder image for the professional */}
            <Image
              src="/b13.webp" 
              alt="Professional Builder"
              fill
              className="object-cover object-center lg:object-right-bottom [mask-image:linear-gradient(to_top,white_80%,transparent_100%)] lg:[mask-image:linear-gradient(to_left,white_70%,transparent_100%)]"
            />
            
            {/* Floating Clean Badge instead of cursive text */}
            <div className="absolute top-10 left-10 lg:-left-4 z-20">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">100% Secure</p>
                  <p className="text-gray-300 text-sm font-medium">Your Vision, Our Support</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
