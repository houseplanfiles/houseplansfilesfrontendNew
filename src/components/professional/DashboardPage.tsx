"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Star, PlusCircle, ClipboardList, Briefcase, Eye, MessageSquare, LayoutGrid, Phone, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchMyProducts } from "@/lib/features/products/productSlice";
import { fetchMyProfessionalOrders } from "@/lib/features/professional/professionalOrderSlice";
import { fetchMyInquiries } from "@/lib/features/inquiries/inquirySlice";
import { fetchCurrentUser } from "@/lib/features/users/userSlice";
import axios from "axios";

// Reusable stat card — matches the Admin dashboard style exactly
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
  <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
        {title}
      </p>
      <p className="text-3xl font-black text-gray-900 leading-tight">
        {isLoading ? "..." : value}
      </p>
    </div>
    <div className={`${iconBg} ${iconColor} p-3 rounded-xl flex-shrink-0`}>
      <Icon className="h-6 w-6" strokeWidth={1.8} />
    </div>
  </div>
);

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { userInfo } = useSelector((state: RootState) => state.user);
  
  const [unlockedLeadsCount, setUnlockedLeadsCount] = useState(0);
  const isProfessionalPartner = ["professional", "contractor", "architect"].includes(userInfo?.role?.toLowerCase() || "");

  const { myProducts, listStatus: productStatus } = useSelector(
    (state: RootState) => state.products
  );
  const { orders, status: orderStatus } = useSelector(
    (state: RootState) => state.professionalOrders
  );
  const { inquiries, listStatus: inquiryStatus } = useSelector(
    (state: RootState) => state.inquiries
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
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/my-unlocked`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        })
        .then(res => setUnlockedLeadsCount(res.data.length))
        .catch(err => console.error(err));
      }
    } else {
      dispatch(fetchMyProducts());
      dispatch(fetchMyProfessionalOrders());
    }
  }, [dispatch, isProfessionalPartner, userInfo]);

  const stats = useMemo(() => {
    if (isProfessionalPartner) {
       return {
         enquiriesCount: inquiries?.length || 0,
         unlockedLeads: unlockedLeadsCount,
         profileViews: userInfo?.profileViews || 0,
         whatsappClicks: userInfo?.whatsappClicks || 0,
         callClicks: userInfo?.callClicks || 0,
         portfolioCount: userInfo?.workSamples?.length || 0,
         projectsCount: userInfo?.projects?.length || 0
       };
    }

    let totalSales = 0;
    let totalRating = 0;
    let reviewCount = 0;
    let totalProductViews = 0;

    orders?.forEach((order) => {
      if (order.isPaid) {
        order.orderItems.forEach((item) => {
          totalSales += item.price * item.quantity;
        });
      }
    });

    myProducts?.forEach((product) => {
      totalProductViews += (product.views || 0);
      if (product.rating && product.rating > 0) {
        totalRating += product.rating;
        reviewCount += 1;
      }
    });

    const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "0.0";

    return {
      productsListed: myProducts?.length || 0,
      totalProductViews,
      profileViews: userInfo?.profileViews || 0,
      whatsappClicks: userInfo?.whatsappClicks || 0,
      callClicks: userInfo?.callClicks || 0,
      totalSales: `₹${totalSales.toLocaleString()}`,
      averageRating: averageRating,
    };
  }, [orders, myProducts, isProfessionalPartner, inquiries, userInfo, unlockedLeadsCount]);

  const summaryCards = isProfessionalPartner ? [
    { title: "Direct Enquiries", value: String(stats.enquiriesCount), icon: MessageSquare, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { title: "Unlocked Leads", value: String(stats.unlockedLeads), icon: ClipboardList, iconBg: "bg-indigo-100", iconColor: "text-indigo-500" },
    { title: "Portfolio Items", value: String(stats.portfolioCount), icon: Briefcase, iconBg: "bg-purple-100", iconColor: "text-purple-600" },
    { title: "Active Projects", value: String(stats.projectsCount), icon: LayoutGrid, iconBg: "bg-orange-100", iconColor: "text-orange-500" },
    { title: "Profile Views", value: String(stats.profileViews), icon: Eye, iconBg: "bg-teal-100", iconColor: "text-teal-500" },
    { title: "WhatsApp Clicks", value: String(stats.whatsappClicks), icon: MessageSquare, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { title: "Call Clicks", value: String(stats.callClicks), icon: Phone, iconBg: "bg-rose-100", iconColor: "text-rose-500" },
  ] : [
    { title: "Products Listed", value: String(stats.productsListed), icon: Package, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { title: "Total Sales", value: stats.totalSales, icon: DollarSign, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { title: "Average Rating", value: stats.averageRating, icon: Star, iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
    { title: "Product Views", value: String(stats.totalProductViews), icon: Eye, iconBg: "bg-teal-100", iconColor: "text-teal-500" },
    { title: "Profile Views", value: String(stats.profileViews), icon: Eye, iconBg: "bg-orange-100", iconColor: "text-orange-500" },
    { title: "WhatsApp Clicks", value: String(stats.whatsappClicks), icon: MessageSquare, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { title: "Call Clicks", value: String(stats.callClicks), icon: Phone, iconBg: "bg-rose-100", iconColor: "text-rose-500" },
  ];

  const isLoadingData = productStatus === "loading" || orderStatus === "loading" || inquiryStatus === "loading";
  const rawLabel = userInfo?.profession || userInfo?.role || "Professional";
  const professionLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isProfessionalPartner ? `${professionLabel} Dashboard` : "Professional Dashboard"}
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Manage your {isProfessionalPartner ? "profile and leads" : "products and orders"} from here.
          </p>
        </div>
        <Link href={isProfessionalPartner ? "/professional/portfolio" : "/professional/add-product"}>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 rounded-lg shadow-none flex items-center gap-2">
            <PlusCircle size={18} />
            {isProfessionalPartner ? "Update Portfolio" : "Upload New Product"}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((card) => (
          <StatCard 
            key={card.title} 
            title={card.title}
            value={card.value}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
            isLoading={isLoadingData} 
          />
        ))}
      </div>

      {isProfessionalPartner ? (
        <div>
           <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Enquiries</h2>
           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
             {inquiries && inquiries.length > 0 ? (
               <table className="w-full text-sm">
                  <thead>
                     <tr className="border-b border-gray-100">
                        <th className="text-left px-6 py-4 text-gray-500 font-medium">Customer</th>
                        <th className="text-left px-6 py-4 text-gray-500 font-medium">Date</th>
                        <th className="text-left px-6 py-4 text-gray-500 font-medium">Message</th>
                        <th className="text-left px-6 py-4 text-gray-500 font-medium">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {inquiries.slice(0, 5).map((inq) => (
                        <tr key={inq._id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="font-medium text-gray-800">{inq.senderName}</div>
                              <div className="text-xs text-gray-500">{inq.senderEmail}</div>
                           </td>
                           <td className="px-6 py-4 text-gray-500">
                              {new Date(inq.createdAt).toLocaleDateString("en-GB").replace(/\//g, "/")}
                           </td>
                           <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                              {inq.requirements}
                           </td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                 inq.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                 {inq.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             ) : (
                <div className="text-center text-gray-400 py-12">No recent inquiries found.</div>
             )}
           </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Sales</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {orders && orders.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-gray-500 font-medium">Order ID</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium">Customer</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium">Date</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium">Items</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium">Total</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.slice(0, 5).map((order) => {
                    const itemsTotal = order.orderItems.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    );
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-800 font-medium">{order._id.substring(0, 8)}...</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">
                             {order.user?.name || order.shippingAddress?.name || "Guest"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("en-GB").replace(/\//g, "/")}
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">
                          {order.orderItems.map((item) => item.name).join(", ")}
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-semibold">
                          ₹{itemsTotal.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              order.isPaid
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
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
              <div className="text-center text-gray-400 py-12">
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
