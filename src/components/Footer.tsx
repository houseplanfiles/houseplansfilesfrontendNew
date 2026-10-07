"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Send,
  AtSign,
} from "lucide-react";

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const PinterestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.084-.602-.167-1.592.034-2.327.185-.68.995-4.223.995-4.223s-.255-.51-.255-1.267c0-1.185.688-2.072 1.553-2.072.73 0 1.08.547 1.08 1.202 0 .73-.465 1.822-.705 2.832-.202.84.42 1.532 1.258 1.532 1.508 0 2.65-1.59 2.65-3.868 0-2.046-1.445-3.48-3.566-3.48-2.35 0-3.738 1.743-3.738 3.355 0 .64.246 1.332.558 1.727.06.074.068.103.05.178-.02.083-.07.28-.09.358-.026.09-.105.12-.24.06-1.1-.47-1.8-1.82-1.8-3.132 0-2.438 2.085-4.73 5.25-4.73 2.76 0 4.86 1.956 4.86 4.418 0 2.712-1.72 4.882-4.14 4.882-.828 0-1.606-.43-1.865-.934 0 0-.405 1.616-.502 2.01-.132.52-.25.99-.4 1.392.36.11.732.17 1.114.17C18.627 24 24 18.627 24 12S18.627 2 12 2z" />
  </svg>
);

const ThreadsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a10 10 0 0 1-10-10C2 7.1 7.1 2 12 2s10 5.1 10 10c0 4.2-2.6 7.8-6.2 9.2" />
    <path d="M15.5 12c0-1.9-1.6-3.5-3.5-3.5S8.5 10.1 8.5 12c0 1.5 1 2.8 2.3 3.3" />
    <path d="M12 12v6.5" />
  </svg>
);

const Footer = () => {
  const socialLinks = [
    { name: "Facebook", Icon: Facebook, href: "https://www.facebook.com/Houseplansndesignfiles" },
    { name: "Instagram", Icon: Instagram, href: "https://www.instagram.com/house_plan_files" },
    { name: "Twitter", Icon: Twitter, href: "https://x.com/files22844" },
    { name: "YouTube", Icon: Youtube, href: "https://www.youtube.com/@houseplansfiles8308" },
    { name: "LinkedIn", Icon: Linkedin, href: "https://www.linkedin.com/company/105681541/" },
    { name: "Pinterest", Icon: PinterestIcon, href: "https://pinterest.com/houseplanfiles/" },
    { name: "WhatsApp", Icon: WhatsAppIcon, href: "https://wa.me/918815939484" },
    { name: "Telegram", Icon: Send, href: "https://t.me/+tPzdohVcUbJiZmNl" },
    { name: "Threads", Icon: ThreadsIcon, href: "https://www.threads.net/@house_plan_files?hl=en" },
    { name: "Koo", Icon: AtSign, href: "#" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-12 lg:gap-12">

          {/* About Section */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <img
                src="/logo.png"
                alt="Houseplanfile Logo"
                width="150"
                height="48"
                loading="lazy"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
              <span className="text-2xl font-black text-white tracking-tight">HousePlan<span className="text-orange-500">Files</span></span>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed font-medium">
              Creating exceptional architectural designs for over 15 years. Your dream project starts with the perfect plan and the right professionals.
            </p>
            <div className="flex space-x-2 flex-wrap gap-y-2">
              {socialLinks.map(({ Icon, href, name }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={name}
                  aria-label={name}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Services</h3>
            <ul className="space-y-4">
              {[
                { name: "Custom House Plans", href: "/house-plans" },
                { name: "3D Visualization", href: "/services" },
                { name: "Interior Design", href: "/interior-designs" },
                { name: "Building Permits", href: "/services" },
                { name: "Construction Support", href: "/contact" },
                { name: "About Us", href: "/about" },
              ].map((service) => (
                <li key={service.name}>
                  <Link href={service.href} className="text-gray-400 font-medium hover:text-orange-500 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500/0 mr-2 transition-all hover:bg-orange-500"></span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore / Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Explore</h3>
            <ul className="space-y-4">
              {[
                { name: "Gallery", href: "/gallery" },
                { name: "Downloads", href: "/downloads" },
                { name: "Blogs", href: "/blogs" },
                { name: "Careers", href: "/careers" },
                { name: "Leads Board", href: "/leads" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 font-medium hover:text-orange-500 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500/0 mr-2 transition-all hover:bg-orange-500"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Support</h3>
            <ul className="space-y-4">
              {[
                { name: "Contact Us", href: "/contact" },
                { name: "Payment Policy", href: "/payment-policy" },
                { name: "Refund Policy", href: "/refund-policy" },
                { name: "Terms of Service", href: "/terms-and-conditions" },
                { name: "Privacy Policy", href: "/privacy-policy" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 font-medium hover:text-orange-500 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500/0 mr-2 transition-all hover:bg-orange-500"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Contact Details</h3>
            <div className="space-y-5">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-gray-400 font-medium mt-2">Bareli, Madhya Pradesh, 464668, India</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-orange-500" />
                </div>
                <a href="tel:+918815939484" className="text-gray-400 font-medium hover:text-orange-500 transition-colors">
                  +91 88 159 394 84
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-orange-500" />
                </div>
                <a href="mailto:Info@houseplanfiles.com" className="text-gray-400 font-medium hover:text-orange-500 transition-colors break-all">
                  Info@houseplanfiles.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-y-6">
            <p className="text-gray-500 text-sm font-medium text-center lg:text-left">
              &copy; {new Date().getFullYear()} HousePlanFiles. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">We Accept:</span>
              <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg shadow-inner">
                <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/razorpay-icon.png" alt="Razorpay" width="60" height="24" loading="lazy" className="h-5 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width="60" height="24" loading="lazy" className="h-5 object-contain" />
                <img src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" alt="PhonePe" width="60" height="24" loading="lazy" className="h-5 object-contain" />
              </div>
            </div>

            <div className="flex space-x-6">
              <Link href="/terms-and-conditions" className="text-gray-500 hover:text-orange-500 font-medium text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="text-gray-500 hover:text-orange-500 font-medium text-sm transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
