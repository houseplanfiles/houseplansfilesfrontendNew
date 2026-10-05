"use client";

import Link from "next/link";
import { ArrowRight, Globe2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="bg-gray-900 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center gap-4 mb-6">
          <Building2 className="w-8 h-8 text-orange-500" />
          <div className="h-0.5 w-12 bg-gray-700" />
          <Globe2 className="w-8 h-8 text-orange-500" />
        </div>
        
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Local to Digital <span className="text-orange-500">→</span> Digital to <span className="text-orange-500">Global</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto font-medium">
          Take your construction business to the next level. Join India's fastest growing digital platform for architects, contractors, and building material suppliers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register?role=professional">
            <Button className="bg-orange-600 text-white hover:bg-orange-700 font-bold px-10 py-7 text-lg rounded-full shadow-2xl transition-transform hover:-translate-y-1 w-full sm:w-auto">
              Join as Professional
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              className="border-2 border-gray-700 text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white font-bold px-10 py-7 text-lg rounded-full transition-colors w-full sm:w-auto"
            >
              Contact Support
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto pt-10 border-t border-gray-800">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-white mb-1">5K+</div>
            <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">Professionals</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-white mb-1">10K+</div>
            <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">House Plans</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-white mb-1">50+</div>
            <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">Cities Active</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-white mb-1">1M+</div>
            <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">Happy Users</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
