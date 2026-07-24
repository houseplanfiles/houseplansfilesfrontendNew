"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Loader2, Trash2, IndianRupee, Inbox, CheckCircle2,
  Tag, Globe, Users, Building2, ShoppingBag, X, Plus,
  PencilLine, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RootState } from "@/lib/store";

// ─── Types ───────────────────────────────────────────────────────────────────
type SourceType = "admin_lead" | "contractor_inquiry" | "seller_inquiry" | "corporate_inquiry";

interface UnifiedLead {
  _id: string;
  sourceType: SourceType;
  title: string;
  category: string;
  city: string;
  budget: string;
  requirements: string;
  price: number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  status: "Available" | "Sold";
  buyer: string | null;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const sourceBadge: Record<SourceType, { label: string; class: string; Icon: any }> = {
  admin_lead:           { label: "Admin Lead",     class: "bg-orange-100 text-orange-700", Icon: Tag },
  contractor_inquiry:   { label: "Contractor",     class: "bg-blue-100 text-blue-700",    Icon: Users },
  seller_inquiry:       { label: "Seller Product", class: "bg-amber-100 text-amber-700",  Icon: ShoppingBag },
  corporate_inquiry:    { label: "Corporate",      class: "bg-violet-100 text-violet-700",Icon: Building2 },
};

// ─── Set Price Modal ──────────────────────────────────────────────────────────
const SetPriceModal = ({
  lead,
  onClose,
  onSaved,
  token,
}: {
  lead: UnifiedLead;
  onClose: () => void;
  onSaved: () => void;
  token: string;
}) => {
  const isAdminLead = lead.sourceType === "admin_lead";

  const [form, setForm] = useState({
    title: lead.title,
    category: lead.category,
    city: lead.city,
    budget: lead.budget,
    requirements: lead.requirements,
    price: lead.price > 0 ? lead.price.toString() : "",
    clientName: lead.clientName,
    clientPhone: lead.clientPhone,
    clientEmail: lead.clientEmail || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const price = parseFloat(form.price);
    if (!form.price || isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price greater than 0.");
      return;
    }

    setSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (lead._id === "new") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads`,
          { ...form, price },
          config
        );
        toast.success("New lead created successfully!");
      } else if (isAdminLead) {
        // Update existing admin lead
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/${lead._id}`,
          { ...form, price },
          config
        );
        toast.success("Lead updated successfully!");
      } else {
        // Convert inquiry → new admin Lead
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads`,
          {
            title: form.title,
            category: form.category,
            city: form.city,
            budget: form.budget,
            requirements: form.requirements,
            price,
            clientName: lead.clientName,
            clientPhone: lead.clientPhone,
            clientEmail: lead.clientEmail || "",
          },
          config
        );
        toast.success("Inquiry converted to Lead and published!");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save lead.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-orange-400" />
              {lead._id === "new" ? "Create New Lead" : isAdminLead ? "Edit Lead & Price" : "Convert to Paid Lead"}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {lead._id === "new"
                ? "Manually create a new lead to display on the board."
                : isAdminLead
                ? "Update details for this published lead."
                : "Set a price to publish this inquiry on the Leads Board."}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Client info (read-only preview) */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1 border">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Client Details (Hidden from public)
            </p>
            <p><span className="font-bold text-gray-600">Name:</span> {lead.clientName}</p>
            <p><span className="font-bold text-gray-600">Phone:</span> {lead.clientPhone}</p>
            {lead.clientEmail && (
              <p><span className="font-bold text-gray-600">Email:</span> {lead.clientEmail}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-600">Lead Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Need Civil Contractor for 2BHK..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Category</label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Contractor"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">City</label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Jaipur"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Budget</label>
              <Input
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="e.g. ₹25 Lakhs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-orange-500" />
                Unlock Price (₹)
              </label>
              <Input
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 299"
                className="border-orange-300 focus:border-orange-500"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-600">Requirements</label>
              <textarea
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Describe the project..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            {lead._id === "new" ? "Create Lead" : isAdminLead ? "Save Changes" : "Publish Lead"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Admin Lead Management Page ─────────────────────────────────────────
const AdminLeadManagement: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const token = userInfo?.token || "";

  const [leads, setLeads] = useState<UnifiedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<UnifiedLead | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<string>("all");
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Admin can see full unmasked data from aggregated endpoint
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/admin/all`,
        config
      );
      setLeads(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchLeads();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this lead permanently?")) return;
    setDeletingId(id);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Lead deleted.");
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSource = filterSource === "all" || l.sourceType === filterSource;
      const matchSearch =
        search === "" ||
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.city.toLowerCase().includes(search.toLowerCase()) ||
        l.category.toLowerCase().includes(search.toLowerCase());
      return matchSource && matchSearch;
    });
  }, [leads, filterSource, search]);

  const stats = useMemo(() => ({
    total: leads.length,
    published: leads.filter((l) => l.sourceType === "admin_lead").length,
    sold: leads.filter((l) => l.status === "Sold").length,
    unpublished: leads.filter((l) => l.sourceType !== "admin_lead").length,
  }), [leads]);

  return (
    <>
      <div className="space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-orange-600" />
              Lead Marketplace Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              View all inquiries from every source. Set prices to publish them on the public Leads Board.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
            <Button
              onClick={() => setSelectedLead({
                _id: "new",
                sourceType: "admin_lead",
                title: "",
                category: "",
                city: "",
                budget: "",
                requirements: "",
                price: 0,
                clientName: "",
                clientPhone: "",
                clientEmail: "",
                status: "Available",
                buyer: null,
                createdAt: new Date().toISOString()
              })}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold h-9 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Create New Lead
            </Button>
            <a
              href="/leads"
              target="_blank"
              className="text-sm text-orange-600 font-bold flex items-center gap-1.5 hover:underline"
            >
              <ExternalLink className="w-4 h-4" /> View Public Leads Board
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Inquiries", value: stats.total, color: "bg-blue-50 text-blue-700" },
            { label: "Published Leads", value: stats.published, color: "bg-orange-50 text-orange-700" },
            { label: "Sold Leads", value: stats.sold, color: "bg-green-50 text-green-700" },
            { label: "Pending to Publish", value: stats.unpublished, color: "bg-gray-50 text-gray-700" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-4 ${s.color} border`}>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs font-bold mt-0.5 opacity-80">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Search by title, city, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs h-9"
          />
          <div className="flex gap-2 flex-wrap">
            {["all", "admin_lead", "contractor_inquiry", "seller_inquiry", "corporate_inquiry"].map(
              (src) => (
                <button
                  key={src}
                  onClick={() => setFilterSource(src)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    filterSource === src
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {src === "all"
                    ? "All Sources"
                    : src === "admin_lead"
                    ? "Admin Leads"
                    : src === "contractor_inquiry"
                    ? "Contractor"
                    : src === "seller_inquiry"
                    ? "Seller"
                    : "Corporate"}
                </button>
              )
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading all inquiries...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold">No records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 font-bold text-gray-600 text-xs uppercase tracking-wider">Source</th>
                    <th className="p-4 font-bold text-gray-600 text-xs uppercase tracking-wider">Title / Category</th>
                    <th className="p-4 font-bold text-gray-600 text-xs uppercase tracking-wider">City</th>
                    <th className="p-4 font-bold text-gray-600 text-xs uppercase tracking-wider">Client</th>
                    <th className="p-4 font-bold text-gray-600 text-xs uppercase tracking-wider">Price</th>
                    <th className="p-4 font-bold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                    <th className="p-4 font-bold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                    <th className="p-4 font-bold text-gray-600 text-xs uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => {
                    const src = sourceBadge[lead.sourceType] || sourceBadge.admin_lead;
                    const isAdminLead = lead.sourceType === "admin_lead";
                    return (
                      <tr key={lead._id.toString()} className="border-t hover:bg-orange-50/20 transition-colors">
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${src.class}`}>
                            <src.Icon className="w-3 h-3" />
                            {src.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-gray-800 max-w-[220px] truncate">{lead.title}</p>
                          <p className="text-xs text-gray-400">{lead.category}</p>
                        </td>
                        <td className="p-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-gray-400" />
                            {lead.city}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-gray-700">{lead.clientName}</p>
                          <p className="text-xs text-gray-400">{lead.clientPhone}</p>
                          {lead.clientEmail && (
                            <p className="text-xs text-gray-400">{lead.clientEmail}</p>
                          )}
                        </td>
                        <td className="p-4">
                          {lead.price > 0 ? (
                            <span className="font-black text-orange-600 text-base">₹{lead.price}</span>
                          ) : (
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              Not Set
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {isAdminLead ? (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              lead.status === "Sold"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}>
                              {lead.status}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                              Not Published
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-500 text-xs">
                          {format(new Date(lead.createdAt), "dd MMM, yyyy")}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => setSelectedLead(lead)}
                              className={`text-xs font-bold h-8 px-3 ${
                                isAdminLead
                                  ? "bg-slate-700 hover:bg-slate-800 text-white"
                                  : "bg-orange-600 hover:bg-orange-700 text-white"
                              }`}
                            >
                              {isAdminLead ? (
                                <><PencilLine className="w-3.5 h-3.5 mr-1" /> Edit</>
                              ) : (
                                <><Plus className="w-3.5 h-3.5 mr-1" /> Set Price</>
                              )}
                            </Button>
                            {isAdminLead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(lead._id)}
                                disabled={deletingId === lead._id}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
                              >
                                {deletingId === lead._id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Set Price / Edit Modal */}
      {selectedLead && (
        <SetPriceModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSaved={fetchLeads}
          token={token}
        />
      )}
    </>
  );
};

export default AdminLeadManagement;
