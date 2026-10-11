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
import { getArchitectProfileUrl, getContractorProfileUrl, getSellerStoreUrl } from "@/utils/profileUrls";

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
  </svg>
);

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

  const [activeFilter, setActiveFilter] = useState("all");

  const filteredReports = useMemo(() => {
    let result = reports.filter(r => 
      (r.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
      (r.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.companyName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.role?.toLowerCase() || "").includes(search.toLowerCase())
    );

    if (activeFilter === "top-searched") {
      result = result.sort((a, b) => (b.profileViews || 0) - (a.profileViews || 0));
    } else if (activeFilter === "top-contacted") {
      result = result.sort((a, b) => {
        const aScore = (a.whatsappClicks || 0) + (a.callClicks || 0);
        const bScore = (b.whatsappClicks || 0) + (b.callClicks || 0);
        return bScore - aScore;
      });
    } else if (activeFilter === "low-performing") {
      result = result.sort((a, b) => {
        const aScore = (a.profileViews || 0) + (a.whatsappClicks || 0) + (a.callClicks || 0);
        const bScore = (b.profileViews || 0) + (b.whatsappClicks || 0) + (b.callClicks || 0);
        return aScore - bScore;
      });
    }

    return result;
  }, [reports, search, activeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, timeRange, activeFilter]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
    const doc = new jsPDF("p", "mm", "a4");
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // ── HEADER BAR ──────────────────────────────────────────────────
    doc.setFillColor(30, 30, 40);
    doc.rect(0, 0, pageW, 28, "F");
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(`${user.name}'s Analytics Report`, 14, 12);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 180);
    const subtitle = `Role: ${(user.role || "").toUpperCase()}${user.companyName ? ' • ' + user.companyName : ''}   |   Period: ${timeRange === 'all' ? 'All Time' : timeRange}   |   Email: ${user.email || 'N/A'}`;
    doc.text(subtitle, 14, 22);

    // ── 4 COLORED STAT CARDS (2 x 2 grid) ──────────────────────────
    const cards = [
      { label: "Profile Views",   value: user.profileViews   || 0, r: 37,  g: 99,  b: 235 },
      { label: "Projects Views",  value: user.projectViews   || 0, r: 245, g: 158, b: 11  },
      { label: "WhatsApp Clicks", value: user.whatsappClicks || 0, r: 16,  g: 185, b: 129 },
      { label: "Call Clicks",     value: user.callClicks     || 0, r: 139, g: 92,  b: 246 },
    ];
    const cardW = (pageW - 14 - 14 - 6) / 2;
    const cardH = 22;
    const cardStartY = 34;
    cards.forEach((card, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 14 + col * (cardW + 6);
      const y = cardStartY + row * (cardH + 4);
      doc.setFillColor(card.r, card.g, card.b);
      doc.roundedRect(x, y, cardW, cardH, 3, 3, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(card.label.toUpperCase(), x + 4, y + 8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(card.value.toLocaleString(), x + 4, y + 18);
    });

    // ── ENGAGEMENT SUMMARY TABLE ────────────────────────────────────
    const tableStartY = cardStartY + 2 * (cardH + 4) + 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 40);
    doc.text("Engagement Summary", 14, tableStartY);
    const pv  = user.profileViews   || 0;
    const prV = user.projectViews   || 0;
    const wa  = user.whatsappClicks || 0;
    const cl  = user.callClicks     || 0;
    autoTable(doc, {
      startY: tableStartY + 4,
      theme: "grid",
      head: [["Metric", "Start (10%)", "Mid (50%)", "Current (100%)"]],
      body: [
        ["Profile Views",   Math.floor(pv*0.1),  Math.floor(pv*0.5),  pv],
        ["Projects Views",  Math.floor(prV*0.1), Math.floor(prV*0.5), prV],
        ["WhatsApp Clicks", Math.floor(wa*0.1),  Math.floor(wa*0.5),  wa],
        ["Call Clicks",     Math.floor(cl*0.1),  Math.floor(cl*0.5),  cl],
        ["Total", Math.floor((pv+prV+wa+cl)*0.1), Math.floor((pv+prV+wa+cl)*0.5), pv+prV+wa+cl],
      ],
      headStyles: { fillColor: [30, 30, 40], textColor: 255, fontStyle: "bold" },
      bodyStyles: { textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [245, 245, 250] },
      columnStyles: { 0: { fontStyle: "bold" }, 3: { fontStyle: "bold", textColor: [37, 99, 235] } },
      margin: { left: 14, right: 14 },
    });

    // ── CLICK HISTORY TABLE (left column) ──────────────────────────
    const afterEngagement = (doc as any).lastAutoTable?.finalY ?? tableStartY + 50;
    const clickHistory = [...(user.dailyAnalytics || [])]
      .filter((d: any) => d.whatsappClicks > 0 || d.callClicks > 0)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 40);
    doc.text("Click History (Dates)", 14, afterEngagement + 10);
    if (clickHistory.length > 0) {
      autoTable(doc, {
        startY: afterEngagement + 14,
        theme: "striped",
        head: [["Date", "WhatsApp", "Call"]],
        body: clickHistory.map((d: any) => [
          new Date(d.date).toLocaleDateString("en-GB").replace(/\//g, "-"),
          d.whatsappClicks || 0,
          d.callClicks     || 0,
        ]),
        headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
        columnStyles: {
          1: { textColor: [16, 185, 129], fontStyle: "bold" },
          2: { textColor: [37, 99, 235],  fontStyle: "bold" },
        },
        margin: { left: 14, right: pageW / 2 + 3 },
      });
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text("No click history available.", 14, afterEngagement + 18);
    }

    // ── TOP 10 VIEWED PROJECTS (right column) ──────────────────────
    const topProjects = [...(user.workSamples || [])]
      .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 40);
    doc.text("Top 10 Viewed Projects", pageW / 2 + 3, afterEngagement + 10);
    if (topProjects.length > 0) {
      autoTable(doc, {
        startY: afterEngagement + 14,
        theme: "striped",
        head: [["#", "Project Title", "Views"]],
        body: topProjects.map((ws: any, idx: number) => [
          `#${idx + 1}`,
          ws.title || "Untitled",
          ws.views  || 0,
        ]),
        headStyles: { fillColor: [234, 88, 12], textColor: 255, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 10 },
          2: { fontStyle: "bold", textColor: [234, 88, 12] },
        },
        margin: { left: pageW / 2 + 3, right: 14 },
      });
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text("No projects found.", pageW / 2 + 3, afterEngagement + 18);
    }

    // ── FOOTER ──────────────────────────────────────────────────────
    doc.setFillColor(245, 245, 250);
    doc.rect(0, pageH - 12, pageW, 12, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated by HousePlanFiles Admin  •  ${new Date().toLocaleDateString("en-GB")}`, 14, pageH - 4);
    doc.text("houseplanfiles.com", pageW - 14, pageH - 4, { align: "right" });

    doc.save(`analytics_${user.name.replace(/\s+/g, '_')}_${timeRange}.pdf`);
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
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button 
                variant={activeFilter === "all" ? "default" : "outline"} 
                onClick={() => setActiveFilter("all")}
                className={activeFilter === "all" ? "bg-gray-800 hover:bg-gray-900" : ""}
                size="sm"
              >
                All Profiles
              </Button>
              <Button 
                variant={activeFilter === "top-searched" ? "default" : "outline"} 
                onClick={() => setActiveFilter("top-searched")}
                className={activeFilter === "top-searched" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                size="sm"
              >
                Top Searched Profiles
              </Button>
              <Button 
                variant={activeFilter === "top-contacted" ? "default" : "outline"} 
                onClick={() => setActiveFilter("top-contacted")}
                className={activeFilter === "top-contacted" ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
                size="sm"
              >
                Top Contacted Profiles
              </Button>
              <Button 
                variant={activeFilter === "low-performing" ? "default" : "outline"} 
                onClick={() => setActiveFilter("low-performing")}
                className={activeFilter === "low-performing" ? "bg-purple-500 hover:bg-purple-600 text-white" : ""}
                size="sm"
              >
                Low Performing Profiles
              </Button>
            </div>

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
                              const role = r.role?.toLowerCase();
                              const url = role === 'seller' ? getSellerStoreUrl(r) :
                                          role === 'architect' ? getArchitectProfileUrl(r) :
                                          getContractorProfileUrl(r);
                              window.open(url, '_blank');
                            }}
                            title="View Profile"
                            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          
                          {r.phone && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  const phoneDigits = r.phone.replace(/\D/g, '');
                                  const cleanPhone = phoneDigits.startsWith('91') ? phoneDigits : `91${phoneDigits}`;
                                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${r.name || ''}, connecting from HousePlanFiles.`)}`, '_blank');
                                }}
                                title="Chat on WhatsApp"
                                className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 px-2"
                              >
                                <WhatsAppIcon className="w-4 h-4" />
                              </Button>

                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => window.location.href = `tel:${r.phone.replace(/\D/g, '')}`}
                                title="Call User"
                                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-2"
                              >
                                <Phone className="w-4 h-4" />
                              </Button>
                            </>
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
              <div className="flex items-center gap-2">
                {selectedUser.phone && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const phoneDigits = selectedUser.phone.replace(/\D/g, '');
                        const cleanPhone = phoneDigits.startsWith('91') ? phoneDigits : `91${phoneDigits}`;
                        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${selectedUser.name || ''}, connecting from HousePlanFiles.`)}`, '_blank');
                      }}
                      title="Chat on WhatsApp"
                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 gap-1.5"
                    >
                      <WhatsAppIcon className="w-4 h-4" /> WhatsApp
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.href = `tel:${selectedUser.phone.replace(/\D/g, '')}`}
                      title="Call User"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 gap-1.5"
                    >
                      <Phone className="w-4 h-4" /> Call
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownloadIndividualPDF(selectedUser)}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" /> Export PDF
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedUser(null)} 
                  className="rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </Button>
              </div>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Whatsapp & Call Clicks Dates */}
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Click History (Dates)</h3>
                  <div className="max-h-64 overflow-y-auto pr-2">
                    {selectedUser.dailyAnalytics && selectedUser.dailyAnalytics.filter((d: any) => (d.whatsappClicks > 0 || d.callClicks > 0)).length > 0 ? (
                      <table className="w-full text-sm text-left">
                        <thead className="sticky top-0 bg-white shadow-sm text-gray-600 font-medium">
                          <tr>
                            <th className="py-2 px-1">Date</th>
                            <th className="py-2 px-1 text-center text-green-600">WhatsApp</th>
                            <th className="py-2 px-1 text-center text-blue-600">Call</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedUser.dailyAnalytics
                            .filter((d: any) => (d.whatsappClicks > 0 || d.callClicks > 0))
                            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((d: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="py-2 px-1 font-medium">{new Date(d.date).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
                              <td className="py-2 px-1 text-center font-semibold text-green-600">{d.whatsappClicks || 0}</td>
                              <td className="py-2 px-1 text-center font-semibold text-blue-600">{d.callClicks || 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-sm text-gray-500 py-4 text-center">No click history available.</p>
                    )}
                  </div>
                </div>

                {/* Top 10 Project Views */}
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Top 10 Viewed Projects</h3>
                  <div className="max-h-64 overflow-y-auto pr-2">
                    {selectedUser.workSamples && selectedUser.workSamples.length > 0 ? (
                      <div className="space-y-3">
                        {[...selectedUser.workSamples]
                          .sort((a, b) => (b.views || 0) - (a.views || 0))
                          .slice(0, 10)
                          .map((ws: any, idx: number) => (
                          <div key={ws._id || idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-gray-400">#{idx + 1}</span>
                              <div className="max-w-[150px] sm:max-w-[200px]">
                                <p className="text-sm font-semibold text-gray-900 truncate" title={ws.title}>{ws.title || "Untitled"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 font-bold text-orange-600">
                              <Eye className="w-4 h-4" /> {ws.views || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-4 text-center">No projects found.</p>
                    )}
                  </div>
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
