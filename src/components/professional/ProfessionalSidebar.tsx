"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { LayoutGrid, Package, PlusSquare, User, LogOut, ClipboardList, Briefcase, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/features/users/userSlice";
import { RootState, AppDispatch } from "@/lib/store";

const navLinks = [
  { name: "Dashboard", path: "/professional", icon: LayoutGrid },
  { name: "My Products", path: "/professional/my-products", icon: Package, roles: ["professional", "admin"] },
  { name: "Add New Product", path: "/professional/add-product", icon: PlusSquare, roles: ["professional", "admin"] },
  { name: "My Enquiries", path: "/professional/enquiries", icon: ClipboardList, roles: ["contractor", "Contractor", "architect", "Architect", "professional", "admin"] },
  { name: "My Orders", path: "/professional/my-orders", icon: ClipboardList, roles: ["professional", "admin"] },
  { name: "My Portfolio", path: "/professional/portfolio", icon: Briefcase, roles: ["contractor", "Contractor", "architect", "Architect", "professional", "admin"] },
  { name: "My Projects", path: "/professional/projects", icon: LayoutGrid, roles: ["contractor", "Contractor", "architect", "Architect", "professional", "admin"] },

  { name: "My Profile", path: "/professional/profile", icon: User },
];

interface ProfessionalSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ProfessionalSidebar = ({ isOpen, setIsOpen }: ProfessionalSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const handleLogout = () => { dispatch(logout()); router.push("/login"); };

  const baseClasses = "flex items-center w-full p-3.5 rounded-lg text-sm font-medium transition-colors duration-200";
  const activeClasses = "bg-primary text-white";
  const inactiveClasses = "text-gray-200 hover:bg-slate-700";

  const isProPartner = ["contractor", "architect", "professional"].includes(userInfo?.role?.toLowerCase() || "");

  return (
    <aside style={{ top: "80px" }} className={`fixed md:sticky left-0 bg-slate-900 text-white p-4 flex flex-col w-64 transition-transform duration-300 ease-in-out z-50 h-[calc(100vh-80px)] md:shrink-0 overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white capitalize">{isProPartner ? userInfo?.role : "Professional"}</h2>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white transition-colors" aria-label="Close sidebar"><X className="h-6 w-6" /></button>
      </div>
      <nav className="flex flex-col space-y-2 flex-1 min-h-0 overflow-y-auto">
        {navLinks
          .filter((link) => !link.roles || (userInfo?.role && link.roles.includes(userInfo.role)))
          .map((link) => {
            const isActive = link.path === "/professional" ? pathname === link.path : pathname.startsWith(link.path);
            let linkName = link.name;
            if (isProPartner) {
              if (link.name === "My Products") linkName = "My Services";
              if (link.name === "Add New Product") linkName = "Add New Service";
            }
            return (
              <Link key={link.name} href={link.path} onClick={() => setIsOpen(false)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                <link.icon className="mr-3 h-5 w-5 shrink-0" /><span>{linkName}</span>
              </Link>
            );
          })}
      </nav>
      <div className="mt-4 pt-4 border-t border-slate-700 shrink-0">
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-colors">
          <LogOut className="mr-3 h-5 w-5" /><span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default ProfessionalSidebar;
