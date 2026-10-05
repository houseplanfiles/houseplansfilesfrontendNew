import React from "react";
import { Search, Users, HardHat, ShoppingCart, Home } from "lucide-react";

const STEPS = [
  {
    id: "01",
    title: "Explore Designs",
    desc: "Find the perfect readymade plan for your plot",
    icon: Search,
  },
  {
    id: "02",
    title: "Hire Professionals",
    desc: "Connect with architects, interior designers & engineers",
    icon: Users,
  },
  {
    id: "03",
    title: "Find Contractors",
    desc: "Get quotes and hire verified local contractors",
    icon: HardHat,
  },
  {
    id: "04",
    title: "Buy Materials",
    desc: "Purchase building materials at the best prices",
    icon: ShoppingCart,
  },
  {
    id: "05",
    title: "Start Construction",
    desc: "Begin your dream project with complete peace of mind",
    icon: Home,
  },
];

const JourneyProcess = () => {
  return (
    <section className="bg-white py-10 md:py-16 border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Aapka Construction Journey Ab <span className="text-orange-600">Bahut Aasaan</span>
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            5 simple steps mein apne dream project ko hakikat banayein
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connecting Dashed Line (Visible on lg screens) */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-orange-200 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {STEPS.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                
                {/* Number Badge & Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white border border-gray-100 shadow-xl rounded-full flex items-center justify-center relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-orange-500" />
                  </div>
                  {/* Floating Number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-500 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-md z-20">
                    {step.id}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 max-w-[200px]">
                  {step.desc}
                </p>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default JourneyProcess;
