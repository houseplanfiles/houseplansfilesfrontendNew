"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchDashboardSummary } from "@/lib/features/admin/adminSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Briefcase,
  Loader2,
  BookOpen,
  UserCheck,
  Upload,
  Store,
} from "lucide-react";

const AdminDashboardPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { summary, status } = useSelector((state: RootState) => state.admin);
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  if (status === "loading" || !summary) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  const row1Cards = [
    {
      title: "TOTAL REVENUE",
      value: `₹${(summary.totalRevenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "TOTAL ORDERS",
      value: (summary.totalOrders || 0).toLocaleString(),
      icon: ShoppingCart,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "TOTAL USER",
      value: (summary.totalCustomers || 0).toLocaleString(),
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "CONTRACTORS",
      value: (summary.totalContractors || 0).toLocaleString(),
      icon: Briefcase,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
  ];

  const row2Cards = [
    {
      title: "PROFESSIONALS",
      value: (summary.totalProfessionals || 0).toLocaleString(),
      icon: UserCheck,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-500",
    },
    {
      title: "TOTAL PLANS",
      value: (summary.totalProducts || 0).toLocaleString(),
      icon: BookOpen,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-500",
    },
    {
      title: "PROJECT UPLOADED",
      value: (summary.totalContractorProjects || 0).toLocaleString(),
      icon: Upload,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-500",
    },
    {
      title: "SELLER PRODUCT",
      value: (summary.totalSellerProducts || 0).toLocaleString(),
      icon: Store,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Welcome back, {userInfo?.name || "Houseplanfiles.com"}! Here&apos;s a summary of your store.
          </p>
        </div>
        <Link href="/admin/reports">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 rounded-lg shadow-none">
            Generate Report
          </Button>
        </Link>
      </div>

      {/* Row 1 — 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {row1Cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Row 2 — 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {row2Cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Customer</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Date</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Status</th>
                <th className="text-right px-6 py-4 text-gray-500 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {summary.recentOrders && summary.recentOrders.length > 0 ? (
                summary.recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {order.user?.name || order.shippingAddress?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-GB").replace(/\//g, "/")}
                    </td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
                          Not Paid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-800 font-medium">
                      ₹{(order.totalPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-gray-100">
            <Link href="/admin/orders">
              <Button variant="link" className="text-orange-500 hover:text-orange-600 p-0 h-auto font-medium">
                View All Orders →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable stat card — matches the screenshot style exactly
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

export default AdminDashboardPage;
