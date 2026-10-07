"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, ShoppingCart, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import WishlistPanel from "@/components/WishlistPanel";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { logout } from "@/lib/features/users/userSlice";
import { toast } from "sonner";
import { PostRequirementModal } from "./PostRequirementModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "@/components/MotionWrapper";
const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isPostRequirementModalOpen, setIsPostRequirementModalOpen] = useState(false);
  const { state: cartState } = useCart();
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

  const pathname = usePathname();
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const isUserAllowed =
    mounted &&
    userInfo &&
    ["user", "admin", "professional", "seller", "contractor", "architect"].includes(
      userInfo.role?.toLowerCase() || ""
    );
  const showCartAndWishlist = mounted && (!userInfo || userInfo?.role === "user");
  const getDashboardPath = () => {
    if (!userInfo) return "/login";
    switch (userInfo.role?.toLowerCase()) {
      case "seller": return "/seller";
      case "professional":
      case "contractor":
      case "architect": return "/professional";
      case "admin": return "/admin";
      default: return "/dashboard";
    }
  };
  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    router.push("/login");
  };
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isWishlistOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isMenuOpen, isWishlistOpen]);
  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "Readymade Designs",
      path: "/house-plans",
      submenu: [
        { name: "Floor Plan", path: "/house-plans" },
        { name: "Floor plan + 3D Elevation", path: "/3d-plans" },
        { name: "Readymade Interior Designs", path: "/interior-designs" },
        { name: "Digital Products (Download)", path: "/download" },
      ],
    },
    { name: "Architects & Engineers", path: "/architects" },
    { name: "Contractors", path: "/city-partners" },
    { name: "Material Marketplace", path: "/building-material-marketplace" },
    { name: "Tutorials", path: "/tutorials" },
  ];

  const isActive = (path: string) => pathname === path;
  const displayName = userInfo?.name || userInfo?.businessName || "User";
  const avatarFallback = displayName.charAt(0).toUpperCase();

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white border-b border-transparent">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo1.png"
                  alt="HousePlanFiles Logo"
                  width={220}
                  height={72}
                  className="h-16 sm:h-20 w-auto object-contain"
                  priority
                />
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3 ml-8 mr-4 h-20" />
            <div className="flex items-center gap-1.5 flex-shrink-0 h-20" />
          </div>
        </div>
      </header>
    );
  }
  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-200"
          : "bg-white border-transparent"
          }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo1.png"
                  alt="HousePlanFiles Logo"
                  width={220}
                  height={72}
                  className="h-16 sm:h-20 w-auto object-contain"
                  priority
                />
              </Link>
            </div>
            <nav className="hidden lg:flex items-center gap-4 ml-6 mr-4 h-full">
              {navLinks.map((link) => (
                link.submenu ? (
                  <div
                    key={link.name}
                    className="relative group shrink-0 h-full flex items-center"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={link.path}
                      className={`text-[15px] font-medium flex items-center gap-1 relative transition-colors duration-300 whitespace-nowrap py-2 ${isActive(link.path) || link.submenu.some(sub => isActive(sub.path))
                        ? "text-orange-600"
                        : "text-gray-700 hover:text-orange-600"
                        }`}
                    >
                      {link.name}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180 text-orange-600' :
                        (isActive(link.path) || link.submenu.some(sub => isActive(sub.path)) ? 'text-orange-600' : 'text-gray-600 group-hover:text-orange-600')
                        }`} />
                      <span
                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transition-transform duration-300 origin-center ${isActive(link.path) || link.submenu.some(sub => isActive(sub.path)) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          }`}
                      />
                    </Link>
                    {activeDropdown === link.name && (
                      <div className="absolute left-0 top-[calc(100%-10px)] pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2">
                          {link.submenu.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.path}
                              className={`block px-4 py-3 text-sm font-medium transition-colors ${isActive(sub.path) ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                }`}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`text-[15px] font-medium flex items-center relative transition-colors duration-300 group whitespace-nowrap h-full ${isActive(link.path)
                      ? "text-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                      }`}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-[26px] left-0 w-full h-0.5 bg-orange-500 transition-transform duration-300 origin-center ${isActive(link.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                    />
                  </Link>
                )
              ))}
            </nav>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="hidden md:flex items-center gap-4">
                {/* Location Dropdown */}
                <div className="relative flex items-center bg-white shadow-sm rounded-full border border-gray-200 hover:border-orange-400 transition-colors shrink-0">
                  <div className="flex items-center pl-2 pr-0.5 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <select 
                    className="bg-transparent border-none focus:ring-0 text-[11px] font-semibold text-slate-800 py-1 pl-1 pr-5 cursor-pointer appearance-none outline-none hover:text-orange-600 transition-colors"
                    onChange={(e) => {
                      if (e.target.value) {
                        router.push(`/city/${e.target.value.toLowerCase().replace(/\s+/g, '-')}`);
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Select City</option>
                    {["Pan India", "Agra", "Ahmedabad", "Ajmer", "Aligarh", "Allahabad", "Amritsar", "Aurangabad", "Bareilly", "Bengaluru", "Bhopal", "Bhubaneswar", "Bikaner", "Chandigarh", "Chennai", "Coimbatore", "Cuttack", "Dehradun", "Delhi", "Dhanbad", "Faridabad", "Ghaziabad", "Gorakhpur", "Guwahati", "Gwalior", "Hubli-Dharwad", "Hyderabad", "Indore", "Jabalpur", "Jaipur", "Jalandhar", "Jammu", "Jamshedpur", "Jodhpur", "Kanpur", "Kochi", "Kolkata", "Kota", "Lucknow", "Ludhiana", "Madurai", "Meerut", "Moradabad", "Mumbai", "Mysore", "Nagpur", "Nashik", "Noida", "Patna", "Pune", "Raipur", "Rajkot", "Ranchi", "Saharanpur", "Salem", "Siliguri", "Solapur", "Srinagar", "Surat", "Thane", "Thiruvananthapuram", "Tiruchirappalli", "Vadodara", "Varanasi", "Vijayawada", "Visakhapatnam", "Warangal"].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-1.5 text-slate-600 pointer-events-none" />
                </div>

                {/* Search Icon */}
                <button className="text-gray-600 hover:text-orange-600 p-2 rounded-full hover:bg-gray-50 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>

                {/* Wishlist/Cart Icons */}
                {showCartAndWishlist && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsWishlistOpen(true)}
                      className="relative text-gray-600 hover:text-orange-600 transition-colors p-1"
                      aria-label="Wishlist"
                    >
                      <Heart className="w-[17px] h-[17px]" />
                      {wishlistItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {wishlistItems.length}
                        </span>
                      )}
                    </button>
                    <Link
                      href="/cart"
                      className="relative text-gray-600 hover:text-orange-600 transition-colors p-1 mr-2 border-r border-gray-200 pr-4"
                      aria-label="Cart"
                    >
                      <ShoppingCart className="w-[17px] h-[17px]" />
                      {cartState.items.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {cartState.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                      )}
                    </Link>
                  </div>
                )}

                {/* Authentication / Profile */}
                {isUserAllowed ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 outline-none">
                        <Avatar className="w-9 h-9 border-2 border-orange-100 hover:border-orange-500 transition-colors">
                          <AvatarFallback className="bg-orange-500 text-white font-bold">
                            {avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={getDashboardPath()}>
                        <DropdownMenuItem className="cursor-pointer py-2">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login">
                      <Button variant="outline" className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-5 h-9 text-xs font-semibold">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-5 h-9 text-xs font-semibold shadow-md shadow-orange-500/20">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="text-gray-700 hover:text-orange-600 transition-colors p-1"
                  aria-label="Open Menu"
                >
                  <Menu className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 z-[60] bg-white w-[85%] max-w-sm p-6 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 flex-shrink-0">
                <Image src="/logo1.png" alt="Logo" width={120} height={40} className="h-10 w-auto" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <nav className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    link.submenu ? (
                      <div key={link.name} className="flex flex-col mb-2">
                        <span className="text-xs font-black uppercase text-gray-400 tracking-widest px-4 pt-4 pb-2">
                          {link.name}
                        </span>
                        <div className="flex flex-col pl-4 border-l border-orange-100 ml-4 gap-1">
                          {link.submenu.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.path}
                              onClick={() => setIsMenuOpen(false)}
                              className={`text-base font-semibold py-3 px-4 rounded-xl transition-all ${isActive(sub.path)
                                ? "bg-orange-50 text-orange-600"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={link.name}
                        href={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-lg font-medium p-4 rounded-xl transition-all ${isActive(link.path)
                          ? "bg-orange-50 text-orange-600 translate-x-2 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
                          }`}
                      >
                        {link.name}
                      </Link>
                    )
                  ))}
                </div>
              </nav>
              <div className="border-t pt-6 mt-4 flex-shrink-0 space-y-4">
                {showCartAndWishlist && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Link href="/cart" className="flex items-center justify-center gap-2 bg-gray-50 p-3 rounded-lg text-gray-700 font-medium">
                      <ShoppingCart size={18} /> Cart ({cartState.items.length})
                    </Link>
                    <button
                      onClick={() => setIsWishlistOpen(true)}
                      className="flex items-center justify-center gap-2 bg-gray-50 p-3 rounded-lg text-gray-700 font-medium"
                    >
                      <Heart size={18} /> Wishlist ({wishlistItems.length})
                    </button>
                  </div>
                )}
                {isUserAllowed ? (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <Link href={getDashboardPath()} className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-orange-500">
                          <AvatarFallback className="bg-orange-500 text-white font-bold">
                            {avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{displayName}</p>
                          <p className="text-xs text-gray-500">View Dashboard</p>
                        </div>
                      </Link>
                    </div>
                    <Button variant="destructive" onClick={handleLogout} className="w-full h-10">
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/login">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-lg rounded-xl shadow-lg shadow-orange-200">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="outline" className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 py-6 text-lg rounded-xl">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <WishlistPanel isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <PostRequirementModal isOpen={isPostRequirementModalOpen} onClose={() => setIsPostRequirementModalOpen(false)} />
    </>
  );
};

export default Navbar;