"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Loader2, Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminAnalyticsReportPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userInfo } = useSelector((state: RootState) => state.user);

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
    r.name?.toLowerCase().includes(search.toLowerCase()) || 
    r.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    r.role?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Analytics Report", 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [["Name / Company", "Role", "Profile Views", "Project Views", "WhatsApp Clicks", "Call Clicks"]],
      body: filteredReports.map(r => [
        r.companyName ? `${r.name} (${r.companyName})` : r.name,
        r.role,
        r.profileViews,
        r.projectViews,
        r.whatsappClicks,
        r.callClicks
      ]),
    });
    
    doc.save("analytics_report.pdf");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

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
                  <td className="px-4 py-3 font-semibold">{r.profileViews}</td>
                  <td className="px-4 py-3 font-semibold">{r.projectViews}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{r.whatsappClicks}</td>
                  <td className="px-4 py-3 font-bold text-blue-600">{r.callClicks}</td>
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
    </div>
  );
};

export default AdminAnalyticsReportPage;
