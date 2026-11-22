"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  Zap,
  Loader2,
  CheckCircle2,
  X,
  Send,
  Lock,
  Unlock,
  MapPin,
  Calendar,
  Phone,
  Mail,
  User,
  IndianRupee,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  completed: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

interface LeadItem {
  _id: string;
  title: string;
  category: string;
  city: string;
  budget: string;
  requirements: string;
  price: number;
  qualityTier?: "low" | "medium" | "high";
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  contactRevealed?: boolean;
  status: string;
  createdAt: string;
}

const PaidLeadSection = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  // Leads sections
  const [targetedLeads, setTargetedLeads] = useState<LeadItem[]>([]);
  const [unlockedLeads, setUnlockedLeads] = useState<LeadItem[]>([]);
  const [loadingTargeted, setLoadingTargeted] = useState(false);
  const [loadingUnlocked, setLoadingUnlocked] = useState(false);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    frequency: "monthly",
    leadCount: "10",
    qualityPreference: "all",
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

  const loadTargetedLeads = () => {
    if (!userInfo?.token) return;
    setLoadingTargeted(true);
    axios
      .get(`${API}/api/leads/my-targeted`, { headers })
      .then((r) => setTargetedLeads(r.data))
      .catch(() => setTargetedLeads([]))
      .finally(() => setLoadingTargeted(false));
  };

  const loadUnlockedLeads = () => {
    if (!userInfo?.token) return;
    setLoadingUnlocked(true);
    axios
      .get(`${API}/api/leads/my-unlocked`, { headers })
      .then((r) => setUnlockedLeads(r.data))
      .catch(() => setUnlockedLeads([]))
      .finally(() => setLoadingUnlocked(false));
  };

  useEffect(() => {
    loadHistory();
    loadTargetedLeads();
    loadUnlockedLeads();
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

  // Buy targeted lead with Razorpay
  const handleBuyTargetedLead = async (lead: LeadItem) => {
    if (typeof window === "undefined" || !(window as any).Razorpay) {
      toast.error("Payment gateway is loading. Please try in a moment.");
      return;
    }

    try {
      setPurchasingId(lead._id);
      const { data: orderData } = await axios.post(
        `${API}/api/leads/${lead._id}/buy`,
        {},
        { headers }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "HousePlanFiles",
        description: `Unlock Lead: ${lead.title}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            await axios.post(
              `${API}/api/leads/${lead._id}/verify`,
              response,
              { headers }
            );
            toast.success("Payment verified! Lead unlocked with full client contact details.");
            loadTargetedLeads();
            loadUnlockedLeads();
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Payment verification failed.");
          }
        },
        prefill: { name: userInfo?.name, email: userInfo?.email, contact: userInfo?.phone },
        theme: { color: "#ea580c" },
      };

      const rz = new (window as any).Razorpay(options);
      rz.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment.");
    } finally {
      setPurchasingId(null);
    }
  };

  const input =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

  return (
    <div className="space-y-6">
      {/* ─── 1. BANNER & REQUEST NEW LEADS ─── */}
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

        {/* Lead Requests History */}
        {history.length > 0 && (
          <div className="mt-5 bg-white rounded-xl overflow-x-auto text-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Plan</th>
                  <th className="text-left px-4 py-2">Quality</th>
                  <th className="text-left px-4 py-2">Quota Delivered</th>
                  <th className="text-left px-4 py-2">City</th>
                  <th className="text-left px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map((h) => (
                  <tr key={h._id} className="border-t">
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(h.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-2 capitalize font-medium">{h.frequency}</td>
                    <td className="px-4 py-2">
                      <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {h.qualityPreference || "All"}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-bold text-orange-600">
                      {h.deliveredCount || 0} / {h.leadCount}
                    </td>
                    <td className="px-4 py-2">{h.city || "-"}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          statusStyles[h.status] || "bg-gray-100 text-gray-700"
                        }`}
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
      </div>

      {/* ─── 2. UNPAID LEADS TARGETED BY ADMIN (UNLOCKED UPON PAYMENT) ─── */}
      <div className="bg-white rounded-2xl border border-orange-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                Exclusive Leads Offered to You ({targetedLeads.length})
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Admin ne yeh leads aapke liye transfer/offer ki hain. Contact details locked hain — unlock karne ke liye pay karein.
            </p>
          </div>
          {targetedLeads.length > 0 && (
            <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold px-3 py-1 rounded-full w-fit">
              Pay &amp; Unlock Contact
            </span>
          )}
        </div>

        {loadingTargeted ? (
          <div className="py-8 text-center text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" />
            <p className="text-xs">Loading targeted leads...</p>
          </div>
        ) : targetedLeads.length === 0 ? (
          <div className="py-8 text-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <Lock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-600">No pending unpaid leads offered</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Jab admin aapko koi lead offer karega, wo yahan show hogi taaki aap usko pay karke unlock kar sakein.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetedLeads.map((lead) => {
              const q = lead.qualityTier || "medium";
              const qColor =
                q === "high"
                  ? "bg-purple-100 text-purple-700"
                  : q === "low"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700";

              return (
                <div
                  key={lead._id}
                  className="p-4 rounded-xl border border-orange-200 bg-gradient-to-br from-white to-orange-50/20 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-sm">{lead.title}</h4>
                        <p className="text-xs text-gray-500 font-medium">
                          {lead.category} • <span className="text-gray-700 font-semibold">{lead.city}</span>
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${qColor}`}>
                        {q.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 bg-white/70 p-2 rounded-lg border border-gray-100">
                      {lead.requirements || "Client requirement details available."}
                    </p>

                    {/* Locked Contact Details Box */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <p className="font-bold text-amber-800">Contact Details Hidden</p>
                          <p className="text-[11px] text-amber-700">Client phone, name &amp; email will be revealed after payment</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-4 pt-3 border-t border-orange-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Price to unlock</span>
                      <span className="text-lg font-black text-orange-600">₹{lead.price || 99}</span>
                    </div>
                    <button
                      onClick={() => handleBuyTargetedLead(lead)}
                      disabled={purchasingId === lead._id}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      {purchasingId === lead._id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" /> Pay ₹{lead.price || 99} to Unlock
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 3. FULLY UNLOCKED LEADS (PAID OR ADMIN ASSIGNED DIRECT) ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-700 p-1.5 rounded-lg">
                <Unlock className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                My Unlocked / Paid Leads ({unlockedLeads.length})
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Yeh leads aapke paas fully unlocked hain with complete client phone, email and requirements.
            </p>
          </div>
          <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3 py-1 rounded-full w-fit">
            Full Details Unlocked
          </span>
        </div>

        {loadingUnlocked ? (
          <div className="py-8 text-center text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600 mb-2" />
            <p className="text-xs">Loading unlocked leads...</p>
          </div>
        ) : unlockedLeads.length === 0 ? (
          <div className="py-8 text-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm font-semibold text-gray-600">No unlocked leads yet</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Jaise hi aap koi lead buy karenge ya Admin aapke quota mein transfer karega, full details yahan dikhengi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedLeads.map((lead) => (
              <div
                key={lead._id}
                className="p-4 rounded-xl border border-green-200 bg-gradient-to-br from-white to-green-50/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm">{lead.title}</h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {lead.category} • <span className="text-gray-700 font-semibold">{lead.city}</span>
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      ✓ UNLOCKED
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200">
                    <strong className="text-gray-900">Requirements:</strong> {lead.requirements || "As discussed with customer."}
                  </p>

                  {/* UNMASKED CLIENT CONTACT CARD */}
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                      <User className="w-4 h-4 text-emerald-700" />
                      <span>{lead.clientName || "Client Name"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-800">
                      <Phone className="w-4 h-4 text-emerald-700" />
                      <a href={`tel:${lead.clientPhone}`} className="hover:underline font-semibold text-emerald-900">
                        {lead.clientPhone || "No phone provided"}
                      </a>
                    </div>
                    {lead.clientEmail && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-emerald-700" />
                        <a href={`mailto:${lead.clientEmail}`} className="hover:underline">
                          {lead.clientEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Date: {format(new Date(lead.createdAt), "dd MMM, yyyy")}</span>
                  <a
                    href={`tel:${lead.clientPhone}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-md flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Call Client Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── REQUEST LEADS MODAL ─── */}
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

            <div>
              <label className="text-sm font-medium">Lead Quality Preference</label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {[
                  { id: "all", label: "All Tiers", color: "border-gray-300" },
                  { id: "low", label: "🟢 Low", color: "border-blue-300" },
                  { id: "medium", label: "🟡 Medium", color: "border-amber-300" },
                  { id: "high", label: "🔥 High", color: "border-purple-300" },
                ].map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setForm({ ...form, qualityPreference: q.id })}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                      form.qualityPreference === q.id
                        ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Choose desired lead quality based on your client criteria.</p>
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
