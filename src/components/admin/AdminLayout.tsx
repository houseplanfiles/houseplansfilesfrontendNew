"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu } from "lucide-react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Prevent hydration mismatch — don't render sidebar until client is ready
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {mounted && (
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      )}

      <div className="flex-1 flex flex-col w-full lg:ml-64">
        <header className="lg:hidden sticky top-0 bg-white shadow-sm z-20 p-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-700"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold ml-4">Admin Dashboard</h1>
        </header>

        <main className="flex-grow p-4 md:p-8 overflow-y-auto">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;