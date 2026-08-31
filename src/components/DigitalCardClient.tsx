"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Leaf, 
  PenTool, 
  BarChart, 
  PlayCircle,
  ShieldCheck,
  Settings,
  TrendingUp,
  Compass,
  HardHat,
  Palette,
  Building,
  Store,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "@/components/MotionWrapper";

const DigitalCardClient = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-white">
        {/* Background diagonal split */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-gray-900 to-gray-800 transform skew-x-12 translate-x-32 hidden lg:block"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 lg:hidden -z-10 mt-[600px] sm:mt-[500px]"></div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-orange-500 font-bold tracking-wider text-sm md:text-base uppercase mb-2">
                  Smarter connections. Stronger impact.
                </h3>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  Digital Cards
                  <span className="block font-medium text-3xl md:text-4xl lg:text-5xl mt-2 text-gray-700">for Modern Professionals</span>
                </h1>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg md:text-xl text-gray-600 max-w-lg"
              >
                Share your contact details, portfolio, services and social profiles instantly. Simple. Smart. Powerful.
              </motion.p>

              {/* Feature Icons Row */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap items-center gap-6 md:gap-10 py-4"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-3 bg-white shadow-sm border border-orange-100 text-orange-500 rounded-2xl">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">Tap & Share <span className="block text-xs font-medium text-gray-500">Instantly</span></div>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-3 bg-white shadow-sm border border-green-100 text-green-500 rounded-2xl">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">Eco-Friendly <span className="block text-xs font-medium text-gray-500">Paperless</span></div>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-3 bg-white shadow-sm border border-orange-100 text-orange-500 rounded-2xl">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">Custom Design <span className="block text-xs font-medium text-gray-500">Your Brand</span></div>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-3 bg-white shadow-sm border border-purple-100 text-purple-500 rounded-2xl">
                    <BarChart className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">Track & Grow <span className="block text-xs font-medium text-gray-500">Digital Insights</span></div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-md text-lg font-semibold shadow-xl shadow-orange-500/20 group transition-all">
                  Create Your Digital Card 
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="w-full sm:w-auto px-8 py-6 rounded-md text-lg font-semibold border-gray-300 hover:bg-gray-50 text-gray-700">
                  <PlayCircle className="w-5 h-5 mr-2 text-orange-500" />
                  How It Works
                </Button>
              </motion.div>
            </div>

            {/* Right Image (Two Overlapping Golden Cards) */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end py-10 lg:py-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-full max-w-[500px] h-[500px] flex items-center justify-center"
              >
                {/* Back Card (Right, Tilted Right) */}
                <div className="absolute right-0 lg:right-4 w-[280px] h-[400px] bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl transform rotate-6 translate-x-8 border border-yellow-300/50 flex flex-col items-center p-6 text-black z-0">
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
                    {/* QR Code Mockup */}
                    <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-inner">
                      <Image src="/qr-placeholder.png" alt="QR Code" width={128} height={128} className="w-full h-full object-cover rounded opacity-80" unoptimized onError={(e) => { e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" }} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold tracking-wide">Scan or Tap</p>
                      <p className="text-sm font-semibold tracking-wide">to Connect</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-black/80 flex items-center justify-center">
                      <WifiIcon />
                    </div>
                    <div className="mt-auto pt-4 border-t border-black/20 w-full text-center">
                      <p className="text-xs font-bold tracking-widest opacity-80">houseplanfiles.com</p>
                    </div>
                  </div>
                </div>

                {/* Front Card (Left, Tilted Left) */}
                <div className="absolute left-0 lg:left-4 w-[320px] h-[450px] bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] transform -rotate-3 -translate-x-4 border border-yellow-300 flex flex-col items-center justify-between p-8 text-black z-10 backdrop-blur-sm">
                   <div className="text-center mt-2 flex flex-col items-center">
                     <HomeIcon />
                     <h2 className="text-3xl font-black mt-4 tracking-wide uppercase">YOUR NAME</h2>
                     <div className="h-px w-full bg-black/40 my-2"></div>
                     <p className="text-[10px] font-bold tracking-[0.2em] opacity-90 uppercase">Architect | Designer | Builder</p>
                   </div>
                   
                   <div className="flex flex-col items-center my-6">
                     <div className="w-20 h-20 rounded-full border-[3px] border-black flex items-center justify-center mb-4">
                        <WifiIcon />
                     </div>
                     <p className="text-sm font-bold tracking-[0.15em]">TAP TO CONNECT</p>
                   </div>

                   <div className="flex gap-4 w-full justify-center mb-2">
                     <div className="w-10 h-10 bg-black text-yellow-500 rounded-full flex items-center justify-center shadow-lg"><PhoneIcon /></div>
                     <div className="w-10 h-10 bg-black text-yellow-500 rounded-full flex items-center justify-center shadow-lg"><MailIcon /></div>
                     <div className="w-10 h-10 bg-black text-yellow-500 rounded-full flex items-center justify-center shadow-lg"><GlobeIcon /></div>
                     <div className="w-10 h-10 bg-black text-yellow-500 rounded-full flex items-center justify-center shadow-lg"><MapPinIcon /></div>
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Professions Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Perfect for <span className="text-orange-500 relative inline-block">Every Profession<span className="absolute -bottom-2 left-0 w-full h-1 bg-orange-500 rounded-full"></span></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <ProfessionCard 
              title="Architects"
              icon={<Compass className="w-6 h-6" />}
              color="text-orange-500"
              bg="bg-orange-100"
              features={["Share Projects", "Services & Expertise", "Contact Instantly"]}
              image="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop"
            />
            <ProfessionCard 
              title="Contractors"
              icon={<HardHat className="w-6 h-6" />}
              color="text-orange-500"
              bg="bg-orange-100"
              features={["Company Profile", "Projects Gallery", "Call / WhatsApp / Email"]}
              image="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=800&auto=format&fit=crop"
            />
            <ProfessionCard 
              title="Interior Designers"
              icon={<Palette className="w-6 h-6" />}
              color="text-orange-500"
              bg="bg-orange-100"
              features={["Design Portfolio", "Client Reviews", "Social Media Links"]}
              image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop"
            />
            <ProfessionCard 
              title="Builders & Contractors"
              icon={<Building className="w-6 h-6" />}
              color="text-orange-500"
              bg="bg-orange-100"
              features={["Services & Specialization", "Ongoing Projects", "Easy Contact Options"]}
              image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
            />
            <ProfessionCard 
              title="Marketplace Stores"
              icon={<Store className="w-6 h-6" />}
              color="text-orange-500"
              bg="bg-orange-100"
              features={["Store Profile", "Products & Offers", "Location & Contact"]}
              image="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* Bottom Footer Banner */}
      <section className="bg-[#1C1C1C] text-white py-8 border-t-4 border-orange-500">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-orange-500" />
                <span className="font-medium">Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-orange-500" />
                <span className="font-medium">Fully Customizable</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <span className="font-medium">Built to Grow</span>
              </div>
            </div>
            
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-lg text-base font-bold transition-transform hover:scale-105 group w-full md:w-auto">
              Create Your Digital Card
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Mini components for the mockup UI
const HomeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const WifiIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><circle cx="12" cy="20" r="1"/></svg>
);
const PhoneIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MailIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const GlobeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>;
const MapPinIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;

const ProfessionCard = ({ title, icon, color, bg, features, image }: any) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100 flex flex-col h-full group"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Floating Icon */}
        <div className={`absolute -bottom-6 left-6 w-12 h-12 rounded-full ${bg} ${color} flex items-center justify-center border-4 border-white shadow-md z-10`}>
          {icon}
        </div>
      </div>
      
      <div className="p-6 pt-8 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <ul className="space-y-3 flex-1">
          {features.map((feature: string, idx: number) => (
            <li key={idx} className="flex items-start text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-orange-500 mr-2 mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default DigitalCardClient;
