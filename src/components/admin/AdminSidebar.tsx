"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Box, PlusCircle, Users, BarChart2,
  UserCircle, LogOut, X, ChevronDown, FileText, Building, Briefcase,
  HelpCircle, FileCheck2, Gem, PenSquare, Image, Package, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/features/users/userSlice";
import NotificationBell from "@/components/NotificationBell";

const mainLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Reports", path: "/admin/reports", icon: BarChart2 },
  { name: "Profile", path: "/admin/profile", icon: UserCircle },
  { name: "Videos", path: "/admin/addvideos", icon: PlusCircle },
  { name: "Seller Products", path: "/admin/seller-products", icon: Box },
  { name: "Media", path: "/admin/media", icon: FileText },
  { name: "Seller Enquiries", path: "/admin/seller-enquiries", icon: Briefcase },
  { name: "Professional Plans", path: "/admin/managesellerplans", icon: Briefcase },
  { name: "Contractor & Architect Projects", path: "/admin/contractor-projects", icon: Box },
  { name: "Manage Contractors", path: "/admin/manage-contractors", icon: Briefcase },
  { name: "Seller Store SEO", path: "/admin/users", icon: Globe },
];
const requestLinks = [
  { name: "Customization", path: "/admin/customization-requests", icon: FileCheck2 },
  { name: "Standard", path: "/admin/standard-requests", icon: FileText },
  { name: "Premium", path: "/admin/premium-requests", icon: Gem },
];
const inquiryLinks = [
  { name: "Corporate", path: "/admin/inquiries", icon: Briefcase },
  { name: "Seller/Contractor", path: "/admin/inquiries-sc", icon: HelpCircle },
];
const productLinks = [
  { name: "All Products", path: "/admin/products", icon: Box },
  { name: "Add New Product", path: "/admin/products/add", icon: PlusCircle },
];
const blogLinks = [
  { name: "All Posts", path: "/admin/blogs", icon: Box },
  { name: "Add New Post", path: "/admin/blogs/add", icon: PlusCircle },
];
const galleryLinks = [
  { name: "Manage Gallery", path: "/admin/gallery", icon: Box },
  { name: "Add Image", path: "/admin/gallery/add", icon: PlusCircle },
];
const packageLinks = [
  { name: "All Packages", path: "/admin/packages", icon: Box },
  { name: "Add New Package", path: "/admin/packages/add", icon: PlusCircle },
];
const userLinks = [
  { name: "All Users", path: "/admin/users", icon: Users },
  { name: "Add New User", path: "/admin/users/add", icon: PlusCircle },
];

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const AdminSidebar = ({ isOpen, setIsOpen }: AdminSidebarProps) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    products: false, users: false, requests: false,
    inquiries: false, blogs: false, gallery: false, packages: false,
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => { dispatch(logout()); router.push("/login"); };
  const toggleMenu = (menu: string) =>
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));

  const baseLinkClasses = "flex items-center w-full p-3 rounded-md transition-colors duration-200 text-sm";
  const inactiveClasses = "text-gray-300 hover:bg-slate-700 hover:text-white";
  const activeClasses = "bg-orange-600 text-white font-semibold shadow-lg";

  const NavItem = ({ link, exact = false }: { link: any; exact?: boolean }) => {
    const isActive = exact ? pathname === link.path : pathname.startsWith(link.path);
    return (
      <Link
        href={link.path}
        onClick={() => setIsOpen(false)}
        className={`${baseLinkClasses} my-1 ${isActive ? activeClasses : inactiveClasses}`}
      >
        <link.icon className="h-5 w-5 mr-3" />
        <span>{link.name}</span>
      </Link>
    );
  };

  const renderSubMenu = (title: string, icon: any, menuKey: string, links: any[]) => (
    <div key={menuKey}>
      <button
        onClick={() => toggleMenu(menuKey)}
        className={`${baseLinkClasses} ${inactiveClasses} justify-between mt-1`}
      >
        <div className="flex items-center">
          {React.createElement(icon, { className: "h-5 w-5 mr-3" })}
          <span>{title}</span>
        </div>
        <ChevronDown className={`h-5 w-5 transition-transform ${openMenus[menuKey] ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence mode="wait">
        {openMenus[menuKey] && (
          <motion.div
            key={menuKey}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-4 border-l-2 border-slate-700 ml-3"
          >
            {links.map((link) => <NavItem key={link.name} link={link} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* ✅ Overlay — only rendered client-side via AnimatePresence */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ✅ suppressHydrationWarning prevents aside class mismatch complaints */}
      <aside
        suppressHydrationWarning
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white p-4 shadow-2xl flex flex-col z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
          <Link href="/admin">
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          </Link>
          <div className="flex items-center space-x-1">
            <NotificationBell />
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <nav className="flex-grow overflow-y-auto pr-2">
          {mainLinks.map((link) => (
            <NavItem key={link.name} link={link} exact={link.path === "/admin"} />
          ))}
          {renderSubMenu("Products", ShoppingBag, "products", productLinks)}
          {renderSubMenu("Blog", PenSquare, "blogs", blogLinks)}
          {renderSubMenu("Gallery", Image, "gallery", galleryLinks)}
          {renderSubMenu("Packages", Package, "packages", packageLinks)}
          {renderSubMenu("Users", Users, "users", userLinks)}
          {renderSubMenu("Requests", Building, "requests", requestLinks)}
          {renderSubMenu("Inquiries", HelpCircle, "inquiries", inquiryLinks)}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-700">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;