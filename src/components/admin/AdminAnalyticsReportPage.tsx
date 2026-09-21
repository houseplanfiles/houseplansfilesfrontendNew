"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Download, Search, Loader2, Phone, ExternalLink, BarChart3, Eye, FolderOpen, MessageCircle, X, Calendar } from "lucide-react";
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
  const [timeRange, setTimeRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { userInfo } = useSelector((state: RootState) => state.user);
  
  // State for Modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics/admin/user-reports`, {
          params: { timeRange: timeRange === "all" ? "" : timeRange },
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
  }, [userInfo, timeRange]);

  const filteredReports = useMemo(() => {
    return reports.filter(r => 
      (r.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
      (r.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.companyName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.role?.toLowerCase() || "").includes(search.toLowerCase())
    );
  }, [reports, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, timeRange]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const topProfiles = useMemo(() => {
    return [...filteredReports].sort((a, b) => {
      const aScore = (a.profileViews || 0) + (a.whatsappClicks || 0) + (a.callClicks || 0);
      const bScore = (b.profileViews || 0) + (b.whatsappClicks || 0) + (b.callClicks || 0);
      return bScore - aScore;
    }).slice(0, 10);
  }, [filteredReports]);

  const lowProfiles = useMemo(() => {
    return [...filteredReports].sort((a, b) => {
      const aScore = (a.profileViews || 0) + (a.whatsappClicks || 0) + (a.callClicks || 0);
      const bScore = (b.profileViews || 0) + (b.whatsappClicks || 0) + (b.callClicks || 0);
      return aScore - bScore;
    }).slice(0, 10);
  }, [filteredReports]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Analytics Report - ${timeRange.toUpperCase()}`, 14, 15);
    
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
    
    doc.save(`analytics_report_${timeRange}.pdf`);
  };

  const handleDownloadIndividualPDF = (user: any) => {
    const doc = new jsPDF();
    const title = `Analytics Report: ${user.name} (${timeRange})`;
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

  const generateChartData = (user: any) => {
    const pv = user?.profileViews || 0;
    const projV = user?.projectViews || 0;
    const wa = user?.whatsappClicks || 0;
    const cl = user?.callClicks || 0;
    
    return [
      { name: "Start", ProfileViews: Math.floor(pv * 0.1), ProjectsViews: Math.floor(projV * 0.1), WhatsAppClick: Math.floor(wa * 0.1), CallClick: Math.floor(cl * 0.1) },
      { name: "Mid", ProfileViews: Math.floor(pv * 0.5), ProjectsViews: Math.floor(projV * 0.5), WhatsAppClick: Math.floor(wa * 0.5), CallClick: Math.floor(cl * 0.5) },
      { name: "Current", ProfileViews: pv, ProjectsViews: projV, WhatsAppClick: wa, CallClick: cl },
    ];
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics Report</h1>
          <p className="text-sm text-gray-500 mt-1">Detailed performance metrics for all professionals and sellers.</p>
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
              <option value="1m">1 Month</option>
              <option value="3m">3 Months</option>
              <option value="6m">6 Months</option>
              <option value="1y">1 Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          {/* Top Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-green-700 flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5" /> Top Contacted Profiles
              </h3>
              <div className="space-y-3">
                {topProfiles.map((p, i) => (
                  <div key={p._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors" onClick={() => setSelectedUser(p)}>
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-gray-400 font-bold">#{i + 1}</div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.name} {p.companyName && <span className="text-xs text-gray-500 font-normal">({p.companyName})</span>}</p>
                        <p className="text-xs text-gray-500 capitalize">{p.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{((p.whatsappClicks||0) + (p.callClicks||0) + (p.profileViews||0)).toLocaleString()} pts</p>
                      <div className="flex gap-2 text-xs text-gray-500 justify-end">
                        <span className="flex items-center gap-1 text-green-600"><MessageCircle className="w-3 h-3"/> {p.whatsappClicks || 0}</span>
                        <span className="flex items-center gap-1 text-blue-600"><Phone className="w-3 h-3"/> {p.callClicks || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {topProfiles.length === 0 && <p className="text-sm text-gray-500">No data available for this time range.</p>}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-red-600 flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5" /> Low Performance Profiles
              </h3>
              <div className="space-y-3">
                {lowProfiles.map((p, i) => (
                  <div key={p._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer transition-colors" onClick={() => setSelectedUser(p)}>
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-red-400 font-bold">#{i + 1}</div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.name} {p.companyName && <span className="text-xs text-red-500 font-normal">({p.companyName})</span>}</p>
                        <p className="text-xs text-red-500 capitalize">{p.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-900">{((p.whatsappClicks||0) + (p.callClicks||0) + (p.profileViews||0)).toLocaleString()} pts</p>
                      <p className="text-xs text-red-600">{p.profileViews || 0} Views</p>
                    </div>
                  </div>
                ))}
                 {lowProfiles.length === 0 && <p className="text-sm text-gray-500">No data available for this time range.</p>}
              </div>
            </div>
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
                  {currentItems.map((r) => (
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
                            <BarChart3 className="w-4 h-4" /> Dash
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
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400">
                        No matching records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 px-2">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} entries
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(num => num === 1 || num === totalPages || Math.abs(currentPage - num) <= 1)
                      .map((num, i, arr) => (
                        <React.Fragment key={num}>
                          {i > 0 && arr[i - 1] !== num - 1 && (
                            <span className="text-gray-400 px-1">...</span>
                          )}
                          <Button
                            variant={currentPage === num ? "default" : "outline"}
                            size="sm"
                            className={currentPage === num ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                            onClick={() => paginate(num)}
                          >
                            {num}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* User Dashboard Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setSelectedUser(null)}
          ></div>
          
          <div className="relative bg-gray-50 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-20 rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}'s Analytics ({timeRange === 'all' ? 'All Time' : timeRange})</h2>
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

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <PerformanceCard 
                  title="Profile Views" 
                  value={(selectedUser.profileViews || 0).toLocaleString()} 
                  icon={Eye} 
                  bgColor="bg-[#2563EB]" 
                />
                <PerformanceCard 
                  title="Projects Views" 
                  value={(selectedUser.projectViews || 0).toLocaleString()} 
                  icon={FolderOpen} 
                  bgColor="bg-[#F59E0B]" 
                />
                <PerformanceCard 
                  title="WhatsApp Clicks" 
                  value={(selectedUser.whatsappClicks || 0).toLocaleString()} 
                  icon={MessageCircle} 
                  bgColor="bg-[#10B981]" 
                />
                <PerformanceCard 
                  title="Call Clicks" 
                  value={(selectedUser.callClicks || 0).toLocaleString()} 
                  icon={Phone} 
                  bgColor="bg-[#8B5CF6]" 
                />
              </div>

              {/* Attractive Graph */}
              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Engagement Chart ({timeRange === 'all' ? 'All Time' : timeRange})</h3>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateChartData(selectedUser)} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 13}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 13}} dx={-15} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 600 }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '30px' }} />
                      <Line type="monotone" name="Profile Views" dataKey="ProfileViews" stroke="#3B82F6" strokeWidth={4} dot={{r: 6, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 8, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff'}} />
                      <Line type="monotone" name="Projects Views" dataKey="ProjectsViews" stroke="#F59E0B" strokeWidth={4} dot={{r: 6, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 8, stroke: '#F59E0B', strokeWidth: 2, fill: '#fff'}} />
                      <Line type="monotone" name="WhatsApp Clicks" dataKey="WhatsAppClick" stroke="#10B981" strokeWidth={4} dot={{r: 6, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 8, stroke: '#10B981', strokeWidth: 2, fill: '#fff'}} />
                      <Line type="monotone" name="Call Clicks" dataKey="CallClick" stroke="#8B5CF6" strokeWidth={4} dot={{r: 6, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 8, stroke: '#8B5CF6', strokeWidth: 2, fill: '#fff'}} />
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

const PerformanceCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  bgColor: string;
}) => (
  <div className={`${bgColor} rounded-2xl p-6 text-white flex items-start gap-4 shadow-md relative overflow-hidden transition-transform hover:-translate-y-1 duration-300`}>
    <div className="bg-white/20 p-3 rounded-xl flex-shrink-0 z-10 relative backdrop-blur-sm">
      <Icon className="h-7 w-7 text-white" />
    </div>
    <div className="z-10 relative">
      <p className="text-sm font-medium text-white/90 mb-1">{title}</p>
      <h3 className="text-4xl font-extrabold text-white tracking-tight">{value}</h3>
    </div>
    <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
      <Icon className="h-40 w-40" />
    </div>
  </div>
);

export default AdminAnalyticsReportPage;
