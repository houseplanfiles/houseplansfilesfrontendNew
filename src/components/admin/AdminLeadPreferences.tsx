"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Zap, Loader2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const AdminLeadPreferences = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("all");
  const [frequency, setFrequency] = useState("all");

  const headers = { Authorization: `Bearer ${userInfo?.token}` };

  useEffect(() => {
    if (!userInfo?.token) return;
    setLoading(true);
    axios
      .get(`${API}/api/lead-preferences`, {
        params: { status, frequency },
        headers,
      })
      .then((r) => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.token, status, frequency]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { data } = await axios.put(
        `${API}/api/lead-preferences/${id}`,
        { status: newStatus },
        { headers },
      );
      setItems((prev) => prev.map((p) => (p._id === id ? data : p)));
    } catch {
      alert("Failed to update status");
    }
  };

  const totals = {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    leads: items.reduce((s, i) => s + (i.leadCount || 0), 0),
  };

  const sel =
    "border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Zap className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Paid Lead Requests
            </h2>
            <p className="text-xs text-gray-500">
              {totals.all} requests · {totals.pending} pending · {totals.leads}{" "}
              leads requested
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            id="lead-pref-status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={sel}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            id="lead-pref-frequency-filter"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className={sel}
          >
            <option value="all">All Plans</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500 py-10 text-sm">
          No paid lead requests found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-3 py-2">Date</th>
                <th className="text-left px-3 py-2">Professional</th>
                <th className="text-left px-3 py-2">Role</th>
                <th className="text-left px-3 py-2">Contact</th>
                <th className="text-left px-3 py-2">City</th>
                <th className="text-left px-3 py-2">Plan</th>
                <th className="text-left px-3 py-2">Leads</th>
                <th className="text-left px-3 py-2">Budget</th>
                <th className="text-left px-3 py-2">Notes</th>
                <th className="text-left px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-3 py-2 font-medium">
                    {p.user?.name || p.user?.companyName || "-"}
                    <div className="text-xs text-gray-400">{p.user?.email}</div>
                  </td>
                  <td className="px-3 py-2 capitalize">
                    {p.user?.profession || p.user?.role || "-"}
                  </td>
                  <td className="px-3 py-2">{p.phone || p.user?.phone || "-"}</td>
                  <td className="px-3 py-2">{p.city || "-"}</td>
                  <td className="px-3 py-2 capitalize">{p.frequency}</td>
                  <td className="px-3 py-2 font-bold text-orange-600">
                    {p.leadCount}
                  </td>
                  <td className="px-3 py-2">{p.budget || "-"}</td>
                  <td className="px-3 py-2 max-w-[200px] truncate" title={p.notes}>
                    {p.notes || "-"}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={p.status}
                      onChange={(e) => updateStatus(p._id, e.target.value)}
                      className={`rounded-full px-2 py-1 text-xs font-semibold capitalize border-none outline-none cursor-pointer ${statusStyles[p.status]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLeadPreferences;
