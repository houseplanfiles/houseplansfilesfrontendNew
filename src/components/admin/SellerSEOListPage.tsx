"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Globe, Search, CheckCircle, XCircle, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/admin/AdminSidebar";

const SellerSEOListPage = () => {
  const router = useRouter();
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?role=seller&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo") || "{}").token}`,
          },
        }
      );
      const sellerList = data.users || data.data || data || [];
      setSellers(Array.isArray(sellerList) ? sellerList : []);
    } catch {
      toast.error("Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  const filtered = sellers.filter((s) =>
    (s.businessName || s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.city || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const seoConfigured = filtered.filter((s) => s.seoTitle).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:ml-64 p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Globe className="w-8 h-8 text-orange-600" />
            Seller Store SEO Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage SEO for each seller's store page. Click the SEO button to configure.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Sellers</p>
            <p className="text-4xl font-black text-gray-900 mt-1">{sellers.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
            <p className="text-xs font-bold uppercase tracking-widest text-green-500">SEO Configured</p>
            <p className="text-4xl font-black text-green-600 mt-1">{seoConfigured}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
            <p className="text-xs font-bold uppercase tracking-widest text-red-400">SEO Pending</p>
            <p className="text-4xl font-black text-red-500 mt-1">{filtered.length - seoConfigured}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search by store name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600">Store</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">City</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">SEO Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      No sellers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((seller) => (
                    <tr key={seller._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {seller.shopImageUrl || seller.photoUrl ? (
                            <img
                              src={seller.shopImageUrl || seller.photoUrl}
                              alt={seller.businessName}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <Store className="w-5 h-5 text-orange-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{seller.businessName || seller.name}</p>
                            <p className="text-xs text-gray-400">{seller.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{seller.city || "-"}</td>
                      <td className="p-4 text-sm text-gray-600">{seller.category || "-"}</td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          seller.status === "Approved" ? "bg-green-100 text-green-700" :
                          seller.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {seller.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {seller.seoTitle ? (
                          <div className="flex items-center gap-1.5 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-semibold">Configured</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <XCircle className="w-4 h-4" />
                            <span className="text-xs font-semibold">Not Set</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          onClick={() => router.push(`/admin/seller-seo/${seller._id}`)}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg gap-2 text-xs"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Manage SEO
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerSEOListPage;
