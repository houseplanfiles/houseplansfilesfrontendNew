"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchDashboardSummary } from "@/lib/features/admin/adminSlice";
import { Button } from "@/components/ui/button";
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
  Eye,
  FolderOpen,
  MessageCircle,
  Phone,
  BarChart3
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

const AdminDashboardPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { summary, status } = useSelector((state: RootState) => state.admin);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userReports, setUserReports] = useState<any[]>([]);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    const fetchAnalytics = async () => {
      try {
        const params = { 
          timeRange: timeRange === "all" ? "" : timeRange,
          startDate: timeRange === "custom" ? startDate : "",
          endDate: timeRange === "custom" ? endDate : ""
        };
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics/admin`, {
          params,
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });
        setAnalytics(data);
      } catch (err) {}
    };

    const fetchUserReports = async () => {
      setReportLoading(true);
      try {
        const params = { 
          timeRange: timeRange === "all" ? "" : timeRange,
          startDate: timeRange === "custom" ? startDate : "",
          endDate: timeRange === "custom" ? endDate : ""
        };
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics/admin/user-reports`, {
          params,
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });
        setUserReports(data);
      } catch (err) {}
      setReportLoading(false);
    };
    if (userInfo?.token) {
      if (timeRange === "custom" && (!startDate || !endDate)) return;
      fetchAnalytics();
      fetchUserReports();
    }
  }, [dispatch, userInfo?.token, timeRange, startDate, endDate]);

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

  const profileViews = analytics?.profileViews || 0;
  const projectViews = (analytics?.productViews || 0) + (analytics?.planViews || 0) + (analytics?.sellerProductViews || 0);
  const whatsappClicks = analytics?.whatsappClicks || 0;
  const callClicks = analytics?.callClicks || 0;
  const leadPurchases = summary.totalOrders || 0;

  // Use real historical data for chart if available, format date nicely
  const chartData = analytics?.dailyData?.length > 0 
    ? analytics.dailyData.map((d: any) => ({
        name: new Date(d.date).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' }),
        ProfileViews: d.profileViews || 0,
        ProjectsViews: d.projectViews || 0,
        WhatsAppClick: d.whatsappClicks || 0,
      }))
    : [
        { name: "Today", ProfileViews: profileViews, ProjectsViews: projectViews, WhatsAppClick: whatsappClicks },
      ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 print:hidden">Dashboard</h1>
          <p className="mt-1 text-gray-500 text-sm print:hidden">
            Welcome back, {userInfo?.name || "Houseplanfiles.com"}! Here&apos;s a summary of your store.
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button onClick={() => window.print()} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 rounded-lg shadow-none">
            Export PDF
          </Button>
          <Link href="/admin/reports">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 rounded-lg shadow-none">
              Generate Report
            </Button>
          </Link>
        </div>
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

      <div className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {timeRange === 'custom' && (
              <div className="flex items-center gap-2">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm" />
                <span>-</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm" />
              </div>
            )}
            <div className="relative flex items-center bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer w-full"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="7d">Last 7 Days</option>
                <option value="1m">1 Month</option>
                <option value="3m">3 Months</option>
                <option value="6m">6 Months</option>
                <option value="1y">1 Year</option>
                <option value="all">All Time</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Colorful 6 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <PerformanceCard 
            title="Profile Views" 
            value={profileViews.toLocaleString()} 
            icon={Eye} 
            bgColor="bg-[#2563EB]" 
            trend="+0%" 
          />
          <PerformanceCard 
            title="Projects Views" 
            value={projectViews.toLocaleString()} 
            icon={FolderOpen} 
            bgColor="bg-[#F59E0B]" 
            trend="+0%" 
          />
          <PerformanceCard 
            title="WhatsApp Click" 
            value={whatsappClicks.toLocaleString()} 
            icon={MessageCircle} 
            bgColor="bg-[#10B981]" 
            trend="+0%" 
          />
          <PerformanceCard 
            title="Call Click" 
            value={callClicks.toLocaleString()} 
            icon={Phone} 
            bgColor="bg-[#8B5CF6]" 
            trend="+0%" 
          />
          <PerformanceCard 
            title="Lead Purchase" 
            value={leadPurchases.toLocaleString()} 
            icon={ShoppingCart} 
            bgColor="bg-[#EF4444]" 
            trend="+0%" 
          />
          <div className="bg-[#06B6D4] rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="flex items-start gap-4 z-10 relative">
              <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/90 mb-1">Overall Progress</p>
                <h3 className="text-3xl font-bold text-white">78%</h3>
                <p className="text-xs text-white/80 mt-1">{"🚀"} Strong Growth</p>
              </div>
            </div>
            <div className="mt-4 bg-white/20 h-2 w-full rounded-full overflow-hidden">
              <div className="bg-white h-full" style={{ width: '78%' }}></div>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-10">
              <BarChart3 className="h-40 w-40" />
            </div>
          </div>
        </div>

        
        {/* Profile Stats Tables */}
        {!reportLoading && userReports.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Contacted Profiles */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contacted Profiles</h3>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr><th className="text-left px-4 py-2 font-medium text-gray-500">Profile</th><th className="text-right px-4 py-2 font-medium text-gray-500">Contact Clicks</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userReports
                      .filter(u => (u.contactClicks || 0) + (u.whatsappClicks || 0) + (u.callClicks || 0) > 0)
                      .sort((a,b) => ((b.contactClicks||0) + (b.whatsappClicks||0) + (b.callClicks||0)) - ((a.contactClicks||0) + (a.whatsappClicks||0) + (a.callClicks||0)))
                      .slice(0, 10).map(u => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-800">{u.name || u.companyName || u.businessName}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{(u.contactClicks||0) + (u.whatsappClicks||0) + (u.callClicks||0)}</td>
                      </tr>
                    ))}
                    {userReports.filter(u => (u.contactClicks || 0) + (u.whatsappClicks || 0) + (u.callClicks || 0) > 0).length === 0 && (
                      <tr><td colSpan={2} className="text-center py-4 text-gray-400">No data found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Visited Profiles */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Visited Profiles</h3>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr><th className="text-left px-4 py-2 font-medium text-gray-500">Profile</th><th className="text-right px-4 py-2 font-medium text-gray-500">Views</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userReports
                      .sort((a,b) => (b.profileViews||0) - (a.profileViews||0))
                      .slice(0, 10).map(u => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-800">{u.name || u.companyName || u.businessName}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{u.profileViews || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Performance Profiles */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Low Performance Profiles</h3>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr><th className="text-left px-4 py-2 font-medium text-gray-500">Profile</th><th className="text-right px-4 py-2 font-medium text-gray-500">Views</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userReports
                      .sort((a,b) => (a.profileViews||0) - (b.profileViews||0))
                      .slice(0, 10).map(u => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-800">{u.name || u.companyName || u.businessName}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{u.profileViews || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Chart and Table Section */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Overview</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Line type="monotone" name="Profile Views" dataKey="ProfileViews" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  <Line type="monotone" name="Projects Views" dataKey="ProjectsViews" stroke="#F59E0B" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  <Line type="monotone" name="WhatsApp Click" dataKey="WhatsAppClick" stroke="#10B981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead Purchase Table Placeholder */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Lead Purchase</h3>
              <Link href="/admin/orders" className="text-xs font-semibold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-xs font-semibold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100">
                <span>Package</span>
                <span className="text-center">Leads</span>
                <span className="text-right">Status</span>
              </div>
              {summary.recentOrders?.slice(0, 5).map((order: any, idx: number) => (
                <div key={idx} className="grid grid-cols-3 items-center text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <span className="font-medium text-gray-700 truncate">{order.orderItems?.[0]?.name || "Plan"}</span>
                  <span className="text-center font-bold text-gray-900">1</span>
                  <span className="text-right">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {order.isPaid ? 'Active' : 'Pending'}
                    </span>
                  </span>
                </div>
              ))}
              {(!summary.recentOrders || summary.recentOrders.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No recent purchases.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders - Original Table */}
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

// Reusable stat card — original style
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

// Performance Card — Matches the colorful screenshot style
const PerformanceCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  bgColor: string;
  trend: string;
}) => (
  <div className={`${bgColor} rounded-2xl p-6 text-white flex items-start gap-4 shadow-sm relative overflow-hidden transition-transform hover:-translate-y-1 duration-200`}>
    <div className="bg-white/20 p-3 rounded-xl flex-shrink-0 z-10 relative">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div className="z-10 relative">
      <p className="text-sm font-medium text-white/90 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      <p className="text-xs text-white/80 mt-1">↑ {trend} vs. last 30 days</p>
    </div>
    {/* Decorative background icon */}
    <div className="absolute -right-6 -bottom-6 opacity-10">
      <Icon className="h-32 w-32" />
    </div>
  </div>
);

export default AdminDashboardPage;
