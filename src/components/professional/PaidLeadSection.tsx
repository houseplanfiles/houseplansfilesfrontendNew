"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Zap, Loader2, CheckCircle2, X, Send } from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const PaidLeadSection = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [form, setForm] = useState({
    frequency: "monthly",
    leadCount: "10",
    city: "",
    serviceType: "",
    budget: "",
    phone: "",
    notes: "",
  });

  const headers = { Authorization: `Bearer ${userInfo?.token}` };

  const loadHistory = () => {
    if (!userInfo?.token) return;
    axios
      .get(`${API}/api/lead-preferences/my`, { headers })
      .then((r) => setHistory(r.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadHistory();
    setForm((f) => ({
      ...f,
      city: userInfo?.city || "",
      phone: userInfo?.phone || "",
      serviceType: userInfo?.profession || userInfo?.role || "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/lead-preferences`, form, { headers });
      setSuccess("Request submitted! Our team will contact you soon.");
      setOpen(false);
      loadHistory();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const input =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Get Paid Leads</h2>
            <p className="text-white/90 text-sm mt-1">
              Tell us how many verified leads you want — weekly, monthly or
              yearly — and our team will set it up for you.
            </p>
          </div>
        </div>
        <button
          id="paid-lead-request-btn"
          onClick={() => setOpen(true)}
          className="bg-white text-orange-600 font-semibold px-6 py-2.5 rounded-lg shadow hover:bg-orange-50 transition-all whitespace-nowrap"
        >
          Request Leads
        </button>
      </div>

      {success && (
        <div className="mt-4 flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 text-sm">
          <CheckCircle2 className="w-4 h-4" /> {success}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-5 bg-white rounded-xl overflow-x-auto text-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Plan</th>
                <th className="text-left px-4 py-2">Leads</th>
                <th className="text-left px-4 py-2">City</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 5).map((h) => (
                <tr key={h._id} className="border-t">
                  <td className="px-4 py-2">
                    {new Date(h.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-2 capitalize">{h.frequency}</td>
                  <td className="px-4 py-2 font-semibold">{h.leadCount}</td>
                  <td className="px-4 py-2">{h.city || "-"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusStyles[h.status]}`}
                    >
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={submit}
            className="bg-white text-gray-800 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Paid Lead Request</h3>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium">How often?</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {["weekly", "monthly", "yearly"].map((f) => (
                  <button
                    type="button"
                    key={f}
                    id={`freq-${f}`}
                    onClick={() => setForm({ ...form, frequency: f })}
                    className={`py-2 rounded-lg border text-sm font-semibold capitalize transition ${
                      form.frequency === f
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-300 hover:border-orange-400"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Number of leads ({form.frequency})
              </label>
              <input
                id="lead-count"
                type="number"
                min={1}
                required
                value={form.leadCount}
                onChange={(e) => setForm({ ...form, leadCount: e.target.value })}
                className={input}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">City</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={input}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={input}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Service Type</label>
                <input
                  value={form.serviceType}
                  onChange={(e) =>
                    setForm({ ...form, serviceType: e.target.value })
                  }
                  className={input}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Budget (optional)</label>
                <input
                  value={form.budget}
                  placeholder="e.g. ₹5,000"
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className={input}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className={input}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              id="submit-lead-request"
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PaidLeadSection;
