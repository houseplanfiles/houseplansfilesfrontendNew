"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "@/components/MotionWrapper";
import {
  LayoutDashboard,
  Box,
  PlusCircle,
  UserCircle,
  LogOut,
  X,
  ChevronDown,
  Briefcase,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/features/users/userSlice";
import { RootState } from "@/lib/store";

const mainLinks = [
  { name: "Dashboard", path: "/seller", icon: LayoutDashboard },
  { name: "Profile", path: "/seller/profile", icon: UserCircle },
];
const productLinks = [
  { name: "My Products", path: "/seller/products", icon: Box },
  { name: "Add New", path: "/seller/products/add", icon: PlusCircle },
];
const requestLinks = [
  { name: "All Enquiries", path: "/seller/inquiries", icon: Briefcase },
];

interface SellerSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SellerSidebar = ({ isOpen, setIsOpen }: SellerSidebarProps) => {
  const [openMenus, setOpenMenus] = useState({ products: true, requests: true });
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };
  const toggleMenu = (menu: 'products' | 'requests') =>
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));

  const baseLinkClasses =
    "flex items-center w-full p-3 rounded-xl text-sm font-semibold transition-all duration-200 tracking-tight";
  const inactiveClasses = "text-gray-500 hover:bg-orange-50 hover:text-orange-600";
  const activeClasses = "bg-orange-500 text-white shadow-md shadow-orange-500/20";

  const NavItem = ({ link, exact = false }: { link: { path: string; name: string; icon: any }; exact?: boolean }) => {
    const isActive = exact
      ? pathname === link.path
      : pathname.startsWith(link.path);
    return (
      <Link
        href={link.path}
        onClick={() => setIsOpen(false)}
        className={`${baseLinkClasses} my-1 ${isActive ? activeClasses : inactiveClasses}`}
      >
        <link.icon className="h-5 w-5 mr-3 shrink-0" />
        <span>{link.name}</span>
      </Link>
    );
  };

  const renderSubMenu = (title: string, icon: any, menuKey: 'products' | 'requests', links: any[]) => (
    <div className="mt-2">
      <button
        onClick={() => toggleMenu(menuKey)}
        className={`${baseLinkClasses} ${inactiveClasses} justify-between`}
      >
        <div className="flex items-center">
          {React.createElement(icon, { className: "h-5 w-5 mr-3 shrink-0" })}
          <span>{title}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${openMenus[menuKey] ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {openMenus[menuKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-4 border-l-2 border-gray-100 ml-3"
          >
            {links.map((link) => (
              <NavItem key={link.name} link={link} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar — sticky on desktop (sits below Navbar), fixed slide-in on mobile */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 p-4 flex flex-col z-40
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:translate-x-0 lg:h-screen lg:shrink-0
          ${isOpen ? "translate-x-0 shadow-2xl lg:shadow-none" : "-translate-x-full"}
        `}
        
      >
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <Link href="/seller">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Seller Panel</h1>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto pr-2">
          {mainLinks.map((link) => (
            <NavItem
              key={link.name}
              link={link}
              exact={link.path === "/seller"}
            />
          ))}
          {renderSubMenu("Products", Box, "products", productLinks)}
          {renderSubMenu("Enquiries", Building, "requests", requestLinks)}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-100">
          {userInfo && (
            <div className="p-3 mb-2 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center">
                <UserCircle className="h-8 w-8 mr-3 text-orange-500" />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-sm leading-tight tracking-tight">
                    {userInfo.name || userInfo.businessName}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Seller</span>
                </div>
              </div>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 font-bold transition-colors rounded-xl p-3"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;
