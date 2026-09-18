"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchSellerDashboardData } from "@/lib/features/sellerdashboard/sellerDashboardSlice";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Users,
  Package,
  Loader2,
  ServerCrash,
  Eye
} from "lucide-react";

// Reusable stat card — matches the Admin dashboard style exactly
const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
        {title}
      </p>
      <p className="text-3xl font-black text-gray-900 leading-tight">{value}</p>
    </div>
    <div className={`${iconBg} ${iconColor} p-3 rounded-xl flex-shrink-0`}>
      <Icon className="h-6 w-6" strokeWidth={1.8} />
    </div>
  </div>
);

const SellerDashboardPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { stats, recentInquiries, status, error } = useSelector(
    (state: RootState) => state.sellerDashboard as any
  );

  useEffect(() => {
    dispatch(fetchSellerDashboardData());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-20">
        <ServerCrash className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Failed to Load Dashboard
        </h3>
        <p className="text-gray-600">{String(error)}</p>
        <Button
          onClick={() => dispatch(fetchSellerDashboardData())}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts?.toLocaleString() || "0",
      icon: Package,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Inquiries",
      value: stats?.totalInquiries?.toLocaleString() || "0",
      icon: MessageSquare,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Unique Buyers",
      value: stats?.totalBuyers?.toLocaleString() || "0",
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Profile Views",
      value: (userInfo?.profileViews || 0).toLocaleString(),
      icon: Eye,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Welcome back, {userInfo?.businessName || userInfo?.name || "Seller"}! Here&apos;s a summary of your store.
          </p>
        </div>
        <Link href="/seller/products/add">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 rounded-lg shadow-none">
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Row 1 — 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Recent Inquiries Table */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Inquiries</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Customer</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Product</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Date</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentInquiries && recentInquiries.length > 0 ? (
                recentInquiries.map((inquiry: any) => (
                  <tr key={inquiry._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{inquiry.name}</div>
                      <div className="text-xs text-gray-500">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {inquiry.product?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-GB").replace(/\//g, "/")}
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.status === "Pending" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {inquiry.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400">
                    No recent inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-gray-100">
            <Link href="/seller/inquiries">
              <Button variant="link" className="text-orange-500 hover:text-orange-600 p-0 h-auto font-medium">
                View All Inquiries →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
