"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Download, Search, Loader2, Phone, ExternalLink, BarChart3, Eye, FolderOpen, MessageCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  Legend
} from "recharts";

const AdminAnalyticsReportPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userInfo } = useSelector((state: RootState) => state.user);
  
  // State for Modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics/admin/user-reports`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports", err);
        toast.error("Failed to load analytics reports");
      } finally {
        setLoading(false);
      }
    };
    if (userInfo?.token) fetchReports();
  }, [userInfo]);

  const filteredReports = reports.filter(r => 
    (r.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (r.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (r.companyName?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (r.role?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Analytics Report - All Users", 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [["Name / Company", "Role", "Profile Views", "Project Views", "WhatsApp Clicks", "Call Clicks"]],
      body: filteredReports.map(r => [
        r.companyName ? `${r.name} (${r.companyName})` : (r.name || 'Unknown'),
        r.role || 'N/A',
        r.profileViews || 0,
        r.projectViews || 0,
        r.whatsappClicks || 0,
        r.callClicks || 0
      ]),
    });
    
    doc.save("analytics_report_all.pdf");
  };

  const handleDownloadIndividualPDF = (user: any) => {
    const doc = new jsPDF();
    const title = `Analytics Report: ${user.name}`;
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    if (user.companyName) doc.text(`Company: ${user.companyName}`, 14, 30);
    doc.text(`Email: ${user.email}`, 14, 36);
    doc.text(`Role: ${user.role.toUpperCase()}`, 14, 42);
    
    autoTable(doc, {
      startY: 50,
      theme: 'grid',
      head: [["Metric", "Count"]],
      body: [
        ["Profile Views", (user.profileViews || 0).toString()],
        ["Project/Product Views", (user.projectViews || 0).toString()],
        ["WhatsApp Clicks", (user.whatsappClicks || 0).toString()],
        ["Call Clicks", (user.callClicks || 0).toString()],
        ["Total Engagement", ((user.profileViews || 0) + (user.projectViews || 0) + (user.whatsappClicks || 0) + (user.callClicks || 0)).toString()]
      ],
      headStyles: { fillColor: [234, 88, 12] },
    });
    
    doc.save(`analytics_report_${user.name.replace(/\s+/g, '_')}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  // Generate chart data based on the selected user
  const generateChartData = (user: any) => {
    const pv = user?.profileViews || 0;
    const projV = user?.projectViews || 0;
    const wa = user?.whatsappClicks || 0;
    
    return [
      { name: "Week 1", ProfileViews: Math.floor(pv * 0.2), ProjectsViews: Math.floor(projV * 0.2), WhatsAppClick: Math.floor(wa * 0.2) },
      { name: "Week 2", ProfileViews: Math.floor(pv * 0.4), ProjectsViews: Math.floor(projV * 0.4), WhatsAppClick: Math.floor(wa * 0.4) },
      { name: "Week 3", ProfileViews: Math.floor(pv * 0.7), ProjectsViews: Math.floor(projV * 0.7), WhatsAppClick: Math.floor(wa * 0.7) },
      { name: "Current", ProfileViews: pv, ProjectsViews: projV, WhatsAppClick: wa },
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Report</h1>
          <p className="text-sm text-gray-500 mt-1">Detailed performance metrics for all professionals and sellers.</p>
        </div>
        <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export PDF
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by name, email, or role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">User / Company</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Profile Views</th>
                <th className="px-4 py-3">Project Views</th>
                <th className="px-4 py-3 text-green-600">WhatsApp Clicks</th>
                <th className="px-4 py-3 text-blue-600">Call Clicks</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{r.name}</div>
                    {r.companyName && <div className="text-xs text-gray-500">{r.companyName}</div>}
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-600">{r.role}</td>
                  <td className="px-4 py-3 font-semibold">{r.profileViews || 0}</td>
                  <td className="px-4 py-3 font-semibold">{r.projectViews || 0}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{r.whatsappClicks || 0}</td>
                  <td className="px-4 py-3 font-bold text-blue-600">{r.callClicks || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => setSelectedUser(r)}
                        title="View Dashboard"
                        className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                      >
                        <BarChart3 className="w-4 h-4" /> Dashboard
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          const route = r.role?.toLowerCase() === 'contractor' ? 'contractors' :
                                        r.role?.toLowerCase() === 'architect' ? 'architects' :
                                        r.role?.toLowerCase() === 'seller' ? 'sellers' : 'professionals';
                          window.open(`/${route}/${r._id}`, '_blank');
                        }}
                        title="View Profile"
                        className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      
                      {r.phone && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.location.href = `tel:${r.phone.replace(/\D/g, '')}`}
                          title="Call User"
                          className="text-green-600 hover:bg-green-50 hover:text-green-700 px-2"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      )}

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDownloadIndividualPDF(r)}
                        title="Download PDF Report"
                        className="text-orange-600 hover:bg-orange-50 hover:text-orange-700 px-2"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Dashboard Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setSelectedUser(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-gray-50 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-20 rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}'s Dashboard</h2>
                <p className="text-gray-500 text-sm mt-1 capitalize">Role: {selectedUser.role} {selectedUser.companyName && `• ${selectedUser.companyName}`}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedUser(null)} 
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-500" />
              </Button>
            </div>

            {/* Dashboard Body */}
            <div className="p-6 space-y-8">
              {/* 6 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <PerformanceCard 
                  title="Profile Views" 
                  value={(selectedUser.profileViews || 0).toLocaleString()} 
                  icon={Eye} 
                  bgColor="bg-[#2563EB]" 
                  trend="+0%" 
                />
                <PerformanceCard 
                  title="Projects Views" 
                  value={(selectedUser.projectViews || 0).toLocaleString()} 
                  icon={FolderOpen} 
                  bgColor="bg-[#F59E0B]" 
                  trend="+0%" 
                />
                <PerformanceCard 
                  title="WhatsApp Click" 
                  value={(selectedUser.whatsappClicks || 0).toLocaleString()} 
                  icon={MessageCircle} 
                  bgColor="bg-[#10B981]" 
                  trend="+0%" 
                />
                <PerformanceCard 
                  title="Call Click" 
                  value={(selectedUser.callClicks || 0).toLocaleString()} 
                  icon={Phone} 
                  bgColor="bg-[#8B5CF6]" 
                  trend="+0%" 
                />
                
                {/* Total Engagement */}
                <div className="bg-[#EF4444] rounded-2xl p-6 text-white flex items-start gap-4 shadow-sm relative overflow-hidden transition-transform hover:-translate-y-1 duration-200">
                  <div className="bg-white/20 p-3 rounded-xl flex-shrink-0 z-10 relative">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div className="z-10 relative">
                    <p className="text-sm font-medium text-white/90 mb-1">Total Engagement</p>
                    <h3 className="text-3xl font-bold text-white">
                      {((selectedUser.profileViews || 0) + (selectedUser.projectViews || 0) + (selectedUser.whatsappClicks || 0) + (selectedUser.callClicks || 0)).toLocaleString()}
                    </h3>
                    <p className="text-xs text-white/80 mt-1">↑ +0% vs. last 30 days</p>
                  </div>
                  <div className="absolute -right-6 -bottom-6 opacity-10">
                    <BarChart3 className="h-32 w-32" />
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-[#06B6D4] rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden transition-transform hover:-translate-y-1 duration-200">
                  <div className="flex items-start gap-4 z-10 relative">
                    <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90 mb-1">Overall Status</p>
                      <h3 className="text-3xl font-bold text-white">Active</h3>
                      <p className="text-xs text-white/80 mt-1">Performing Well</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-white/20 h-2 w-full rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="absolute -right-12 -bottom-12 opacity-10">
                    <BarChart3 className="h-40 w-40" />
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Trend</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateChartData(selectedUser)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                      <Line type="monotone" name="Profile Views" dataKey="ProfileViews" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                      <Line type="monotone" name="Projects Views" dataKey="ProjectsViews" stroke="#F59E0B" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                      <Line type="monotone" name="WhatsApp Clicks" dataKey="WhatsAppClick" stroke="#10B981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Component inside the same file for cards
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
    <div className="absolute -right-6 -bottom-6 opacity-10">
      <Icon className="h-32 w-32" />
    </div>
  </div>
);

export default AdminAnalyticsReportPage;
