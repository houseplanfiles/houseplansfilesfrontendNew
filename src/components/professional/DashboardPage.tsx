"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Package,
  DollarSign,
  Star,
  PlusCircle,
  ClipboardList,
  Briefcase,
  Eye,
  MessageSquare,
  LayoutGrid,
  Phone,
  Loader2,
  Calendar,
  FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchMyProducts } from "@/lib/features/products/productSlice";
import { fetchMyProfessionalOrders } from "@/lib/features/professional/professionalOrderSlice";
import { fetchMyInquiries } from "@/lib/features/inquiries/inquirySlice";
import { fetchCurrentUser } from "@/lib/features/users/userSlice";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  isLoading,
}: {
  title: string;
  value: string | undefined | null;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  isLoading?: boolean;
}) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all duration-300">
    <div className="flex items-center justify-between w-full mb-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
        {title}
      </p>
      <div
        className={`${iconBg} ${iconColor} p-2.5 rounded-xl flex-shrink-0 bg-opacity-20`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-3xl font-black text-gray-800 leading-tight">
        {isLoading ? "..." : value || "0"}
      </p>
    </div>
  </div>
);

const getDateThreshold = (range: string) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (range === "today") return d;
  if (range === "7d") d.setDate(d.getDate() - 7);
  else if (range === "1m") d.setMonth(d.getMonth() - 1);
  else if (range === "3m") d.setMonth(d.getMonth() - 3);
  else if (range === "6m") d.setMonth(d.getMonth() - 6);
  else if (range === "1y") d.setFullYear(d.getFullYear() - 1);
  else return null;
  return d;
};

const formatRealChartData = (
  dailyAnalytics: any[] = [],
  isProfessionalPartner: boolean,
  orders: any[] = [],
  myProducts: any[] = [],
  thresholdDate: Date | null,
) => {
  const today = new Date();
  const datesMap: any = {};

  // Decide how many days to show in chart based on threshold
  let daysToShow = 14;
  if (thresholdDate) {
    const diffTime = Math.abs(today.getTime() - thresholdDate.getTime());
    daysToShow = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysToShow > 30) daysToShow = 30; // Max 30 points on chart for readability
  }

  for (let i = daysToShow; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const formattedName = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    datesMap[dateString] = {
      name: formattedName,
      "Profile Views": 0,
      "WhatsApp Clicks": 0,
      "Call Clicks": 0,
      "Product Views": 0,
      Sales: 0,
    };
  }

  if (Array.isArray(dailyAnalytics)) {
    dailyAnalytics.forEach((entry) => {
      if (datesMap[entry.date]) {
        datesMap[entry.date]["Profile Views"] = entry.profileViews || 0;
        datesMap[entry.date]["WhatsApp Clicks"] = entry.whatsappClicks || 0;
        datesMap[entry.date]["Call Clicks"] = entry.callClicks || 0;
      }
    });
  }

  if (!isProfessionalPartner) {
    if (Array.isArray(orders)) {
      orders.forEach((order) => {
        if (order.isPaid) {
          const date = new Date(order.createdAt);
          const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          if (datesMap[dateString]) {
            order.orderItems.forEach((item: any) => {
              datesMap[dateString]["Sales"] += item.price * item.quantity;
            });
          }
        }
      });
    }

    if (Array.isArray(myProducts)) {
      myProducts.forEach((product) => {
        if (Array.isArray(product.dailyAnalytics)) {
          product.dailyAnalytics.forEach((entry: any) => {
            if (datesMap[entry.date]) {
              datesMap[entry.date]["Product Views"] += entry.views || 0;
            }
          });
        }
      });
    }
  }

  return Object.values(datesMap);
};

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { userInfo } = useSelector((state: RootState) => state.user);

  const [unlockedLeadsCount, setUnlockedLeadsCount] = useState(0);
  const [timeRange, setTimeRange] = useState("all");
  const isProfessionalPartner = [
    "professional",
    "contractor",
    "architect",
  ].includes(userInfo?.role?.toLowerCase() || "");

  const { myProducts, listStatus: productStatus } = useSelector(
    (state: RootState) => state.products,
  );
  const { orders, status: orderStatus } = useSelector(
    (state: RootState) => state.professionalOrders,
  );
  const { inquiries, listStatus: inquiryStatus } = useSelector(
    (state: RootState) => state.inquiries,
  );

  useEffect(() => {
    if (userInfo?._id && userInfo?.token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, userInfo?._id, userInfo?.token]);

  useEffect(() => {
    if (isProfessionalPartner) {
      dispatch(fetchMyInquiries());
      if (userInfo?.token) {
        axios
          .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/my-unlocked`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          })
          .then((res) => setUnlockedLeadsCount(res.data.length))
          .catch((err) => console.error(err));
      }
    } else {
      dispatch(fetchMyProducts());
      dispatch(fetchMyProfessionalOrders());
    }
  }, [dispatch, isProfessionalPartner, userInfo]);

  const thresholdDate = useMemo(() => getDateThreshold(timeRange), [timeRange]);

  const stats = useMemo(() => {
    let profileViews = 0,
      whatsappClicks = 0,
      callClicks = 0;

    if (thresholdDate && userInfo?.dailyAnalytics) {
      userInfo.dailyAnalytics.forEach((d: any) => {
        const entryDate = new Date(d.date + "T00:00:00");
        if (entryDate >= thresholdDate) {
          profileViews += d.profileViews || 0;
          whatsappClicks += d.whatsappClicks || 0;
          callClicks += d.callClicks || 0;
        }
      });
    } else {
      profileViews = userInfo?.profileViews || 0;
      whatsappClicks = userInfo?.whatsappClicks || 0;
      callClicks = userInfo?.callClicks || 0;
    }

    if (isProfessionalPartner) {
      return {
        enquiriesCount: inquiries?.length || 0,
        unlockedLeads: unlockedLeadsCount,
        profileViews,
        whatsappClicks,
        callClicks,
        portfolioCount: userInfo?.workSamples?.length || 0,
        projectsCount: userInfo?.projects?.length || 0,
        totalSales: 0,
        averageRating: "0.0",
        productsListed: 0,
        totalProductViews: 0,
      };
    }

    let totalSales = 0;
    let totalRating = 0;
    let reviewCount = 0;
    let totalProductViews = 0;

    orders?.forEach((order) => {
      if (order.isPaid) {
        const orderDate = new Date(order.createdAt);
        if (!thresholdDate || orderDate >= thresholdDate) {
          order.orderItems.forEach((item) => {
            totalSales += item.price * item.quantity;
          });
        }
      }
    });

    myProducts?.forEach((product) => {
      if (thresholdDate && product.dailyAnalytics) {
        product.dailyAnalytics.forEach((d: any) => {
          const entryDate = new Date(d.date + "T00:00:00");
          if (entryDate >= thresholdDate) {
            totalProductViews += d.views || 0;
          }
        });
      } else {
        totalProductViews += product.views || 0;
      }

      if (product.rating && product.rating > 0) {
        totalRating += product.rating;
        reviewCount += 1;
      }
    });

    const averageRating =
      reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "0.0";

    return {
      productsListed: myProducts?.length || 0,
      totalProductViews,
      profileViews,
      whatsappClicks,
      callClicks,
      totalSales: totalSales,
      formattedTotalSales: `₹${totalSales.toLocaleString()}`,
      averageRating: averageRating,
      enquiriesCount: 0,
      unlockedLeads: 0,
      portfolioCount: 0,
      projectsCount: 0,
    };
  }, [
    orders,
    myProducts,
    isProfessionalPartner,
    inquiries,
    userInfo,
    unlockedLeadsCount,
    thresholdDate,
  ]);

  const summaryCards = isProfessionalPartner
    ? [
        {
          title: "Direct Enquiries",
          value: String(stats.enquiriesCount),
          icon: MessageSquare,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
        {
          title: "Unlocked Leads",
          value: String(stats.unlockedLeads),
          icon: ClipboardList,
          iconBg: "bg-indigo-100",
          iconColor: "text-indigo-500",
        },
        {
          title: "Portfolio Items",
          value: String(stats.portfolioCount),
          icon: Briefcase,
          iconBg: "bg-purple-100",
          iconColor: "text-purple-500",
        },
        {
          title: "Active Projects",
          value: String(stats.projectsCount),
          icon: LayoutGrid,
          iconBg: "bg-orange-100",
          iconColor: "text-orange-500",
        },
        {
          title: "Profile Views",
          value: String(stats.profileViews),
          icon: Eye,
          iconBg: "bg-teal-100",
          iconColor: "text-teal-500",
        },
        {
          title: "WhatsApp Clicks",
          value: String(stats.whatsappClicks),
          icon: MessageSquare,
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          title: "Call Clicks",
          value: String(stats.callClicks),
          icon: Phone,
          iconBg: "bg-rose-100",
          iconColor: "text-rose-500",
        },
      ]
    : [
        {
          title: "Products Listed",
          value: String(stats.productsListed),
          icon: Package,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-500",
        },
        {
          title: "Total Sales",
          value: stats.formattedTotalSales,
          icon: DollarSign,
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          title: "Average Rating",
          value: stats.averageRating,
          icon: Star,
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
        },
        {
          title: "Product Views",
          value: String(stats.totalProductViews),
          icon: Eye,
          iconBg: "bg-teal-100",
          iconColor: "text-teal-500",
        },
        {
          title: "Profile Views",
          value: String(stats.profileViews),
          icon: Eye,
          iconBg: "bg-orange-100",
          iconColor: "text-orange-500",
        },
        {
          title: "WhatsApp Clicks",
          value: String(stats.whatsappClicks),
          icon: MessageSquare,
          iconBg: "bg-green-100",
          iconColor: "text-green-500",
        },
        {
          title: "Call Clicks",
          value: String(stats.callClicks),
          icon: Phone,
          iconBg: "bg-rose-100",
          iconColor: "text-rose-500",
        },
      ];

  const chartData = useMemo(() => {
    return formatRealChartData(
      userInfo?.dailyAnalytics || [],
      isProfessionalPartner,
      orders || [],
      myProducts || [],
      thresholdDate,
    );
  }, [userInfo, isProfessionalPartner, orders, myProducts, thresholdDate]);

  const isLoadingData =
    productStatus === "loading" ||
    orderStatus === "loading" ||
    inquiryStatus === "loading";
  const rawLabel = userInfo?.profession || userInfo?.role || "Professional";
  const professionLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${professionLabel} Performance Report`, 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(
      `Time Range: ${timeRange === "all" ? "All Time" : timeRange.toUpperCase()}`,
      14,
      30,
    );

    autoTable(doc, {
      startY: 40,
      head: [["Metric", "Value"]],
      body: summaryCards.map((c) => [c.title, c.value]),
      theme: "grid",
      headStyles: { fillColor: [249, 115, 22] },
    });

    doc.save(`${userInfo?.name || "Dashboard"}_Report_${timeRange}.pdf`);
  };

  return (
    <div className="space-y-8 bg-[#f8f9fc] min-h-screen p-4 sm:p-6 lg:p-8 -m-6 sm:-m-8 rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {isProfessionalPartner
              ? `${professionLabel} Dashboard`
              : "Professional Dashboard"}
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Manage your{" "}
            {isProfessionalPartner
              ? "profile and leads"
              : "products and orders"}{" "}
            from here.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="1m">This Month</option>
              <option value="3m">3 Months</option>
              <option value="1y">1 Year</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <Button
            onClick={generatePDFReport}
            variant="outline"
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm gap-2"
          >
            <FileText className="w-4 h-4" /> Export Report
          </Button>

          <Link
            href={
              isProfessionalPartner
                ? "/professional/portfolio"
                : "/professional/add-product"
            }
          >
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 h-[42px] rounded-lg shadow-sm flex items-center gap-2 transition-all">
              <PlusCircle size={18} />
              {isProfessionalPartner
                ? "Update Portfolio"
                : "Upload New Product"}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((card) => (
          <StatCard key={card.title} {...card} isLoading={isLoadingData} />
        ))}
      </div>

      {/* Performance Graph Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">
          Performance Overview ({timeRange === "all" ? "All Time" : timeRange})
        </h2>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
              {isProfessionalPartner ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="Profile Views"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="WhatsApp Clicks"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Call Clicks"
                    stroke="#f43f5e"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="Product Views"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Profile Views"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Sales"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isProfessionalPartner ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
            Recent Enquiries
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            {inquiries && inquiries.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      Customer
                    </th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      Message
                    </th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {inquiries.slice(0, 5).map((inq) => (
                    <tr
                      key={inq._id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {inq.senderName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {inq.senderEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {new Date(inq.createdAt)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "/")}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {inq.requirements}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            inq.status === "New"
                              ? "bg-blue-50 text-blue-600 border border-blue-100"
                              : "bg-gray-50 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-400 py-16 font-medium">
                No recent inquiries found.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
            Recent Sales
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            {orders && orders.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      Order ID
                    </th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      Customer
                    </th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      Items
                    </th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      Total
                    </th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.slice(0, 5).map((order) => {
                    const itemsTotal = order.orderItems.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0,
                    );
                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                          {order._id.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">
                            {order.user?.name ||
                              order.shippingAddress?.name ||
                              "Guest"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">
                          {new Date(order.createdAt)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "/")}
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">
                          {order.orderItems.map((item) => item.name).join(", ")}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-black">
                          ₹{itemsTotal.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              order.isPaid
                                ? "bg-green-50 text-green-600 border border-green-100"
                                : "bg-red-50 text-red-600 border border-red-100"
                            }`}
                          >
                            {order.isPaid ? "Paid" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-400 py-16 font-medium">
                No recent sales found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardPage;
