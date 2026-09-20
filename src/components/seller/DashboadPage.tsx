"use client";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Reusable stat card — matched to the provided mockup style
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
  <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all duration-300">
    <div className="flex items-center justify-between w-full mb-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
        {title}
      </p>
      <div className={`${iconBg} ${iconColor} p-2.5 rounded-xl flex-shrink-0 bg-opacity-20`}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-3xl font-black text-gray-800 leading-tight">
        {value || "0"}
      </p>
    </div>
  </div>
);

// Helper to format actual dailyAnalytics from backend
const formatRealChartData = (dailyAnalytics: any[] = [], dailyStats: any[] = []) => {
  const today = new Date();
  
  // Create last 15 days map
  const datesMap: any = {};
  for(let i = 14; i >= 0; i--) {
     const date = new Date();
     date.setDate(today.getDate() - i);
     const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
     const formattedName = date.toLocaleDateString("en-GB", { day: 'numeric', month: 'short' });
     
     datesMap[dateString] = {
       name: formattedName,
       "Products": 0, // In full implementation, map daily product views
       "Inquiries": 0, 
       "Buyers": 0,
       "Profile Views": 0,
     };
  }
  
  // Fill in profile views from user daily analytics
  if (Array.isArray(dailyAnalytics)) {
    dailyAnalytics.forEach(entry => {
      if (datesMap[entry.date]) {
         datesMap[entry.date]["Profile Views"] = entry.profileViews || 0;
      }
    });
  }

  // Fill in inquiries and buyers from seller dailyStats
  if (Array.isArray(dailyStats)) {
    dailyStats.forEach(stat => {
      if (datesMap[stat.date]) {
         datesMap[stat.date]["Inquiries"] = stat.inquiries || 0;
         datesMap[stat.date]["Buyers"] = stat.buyers || 0;
      }
    });
  }

  return Object.values(datesMap);
};

const SellerDashboardPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { stats, recentInquiries, status, error } = useSelector(
    (state: RootState) => state.sellerDashboard as any
  );

  useEffect(() => {
    dispatch(fetchSellerDashboardData());
  }, [dispatch]);

  const chartData = useMemo(() => {
    return formatRealChartData(userInfo?.dailyAnalytics || [], stats?.dailyStats || []);
  }, [userInfo, stats]);

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
      iconColor: "text-blue-500",
    },
    {
      title: "Total Inquiries",
      value: stats?.totalInquiries?.toLocaleString() || "0",
      icon: MessageSquare,
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      title: "Unique Buyers",
      value: stats?.totalBuyers?.toLocaleString() || "0",
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
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
    <div className="space-y-8 bg-[#f8f9fc] min-h-screen p-4 sm:p-6 lg:p-8 -m-6 sm:-m-8 rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Seller Dashboard</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Welcome back, {userInfo?.businessName || userInfo?.name || "Seller"}! Here&apos;s a summary of your store.
          </p>
        </div>
        <Link href="/seller/products/add">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-5 rounded-xl shadow-sm flex items-center gap-2 transition-all">
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

      {/* Performance Graph Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Performance Overview</h2>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="Products" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="Inquiries" stroke="#22c55e" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="Buyers" stroke="#f43f5e" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Recent Inquiries</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">Customer</th>
                <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">Product</th>
                <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">Date</th>
                <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentInquiries && recentInquiries.length > 0 ? (
                recentInquiries.map((inquiry: any) => (
                  <tr key={inquiry._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{inquiry.name}</div>
                      <div className="text-xs text-gray-500">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {inquiry.product?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-GB").replace(/\//g, "/")}
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.status === "Pending" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">
                          {inquiry.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-16 font-medium text-gray-400">
                    No recent inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
            <Link href="/seller/inquiries">
              <Button variant="link" className="text-orange-500 hover:text-orange-600 p-0 h-auto font-bold tracking-tight">
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
