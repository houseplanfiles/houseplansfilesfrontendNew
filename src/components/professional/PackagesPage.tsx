"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { updateProfile, fetchCurrentUser } from "@/lib/features/users/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Save,
  Package as PackageIcon,
  MoreVertical,
  Edit2,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PackagesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, actionStatus } = useSelector(
    (state: RootState) => state.user
  );

  const [packages, setPackages] = useState<any[]>([]);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackageIdx, setEditingPackageIdx] = useState<number | null>(null);

  const [tempPackage, setTempPackage] = useState({
    name: "",
    price: "",
    description: "",
    pdfFile: null as File | null,
    pdfUrl: "",
  });

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      setPackages(userInfo.packages || []);
    }
  }, [userInfo]);

  const handleOpenPackageModal = (idx: number | null = null) => {
    if (idx !== null) {
      setEditingPackageIdx(idx);
      setTempPackage({
        ...packages[idx],
        pdfFile: null,
      });
    } else {
      setEditingPackageIdx(null);
      setTempPackage({ name: "", price: "", description: "", pdfFile: null, pdfUrl: "" });
    }
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = () => {
    if (!tempPackage.name) return toast.error("Package name is required");
    const updated = [...packages];
    if (editingPackageIdx !== null) {
      updated[editingPackageIdx] = tempPackage;
    } else {
      updated.push(tempPackage);
    }
    setPackages(updated);
    setIsPackageModalOpen(false);
    toast.success(editingPackageIdx !== null ? "Package updated" : "Package added");
  };

  const handleRemovePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
    toast.success("Package removed");
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    const packagesToSubmit = packages.map((pkg, idx) => {
      const { pdfFile, ...rest } = pkg;
      if (pdfFile) {
        formData.append(`package_pdf_${idx}`, pdfFile);
      }
      return rest;
    });
    formData.append("packages", JSON.stringify(packagesToSubmit));

    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success("Service packages saved successfully!");
    } catch (err: any) {
      if (err === "SESSION_EXPIRED" || err === "Session expired. Please login again.") {
        toast.error("Session expire ho gayi hai. Dobara login karein.");
        setTimeout(() => { window.location.href = "/login"; }, 1500);
      } else {
        toast.error(err || "Failed to save packages");
      }
    }
  };

  const isLoading = actionStatus === "loading";

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Service Packages</h1>
          <p className="mt-1 text-gray-500 font-medium">Create and manage execution rate packages displayed on your profile.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleOpenPackageModal()}
            className="bg-orange-600 hover:bg-orange-700 text-white font-black gap-2 shadow-lg shadow-orange-600/20"
          >
            <Plus className="w-4 h-4" /> Add Package
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gray-900 hover:bg-black text-white font-black px-8 shadow-xl gap-2"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-blue-600" /> My Service Packages
          </h2>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Package Name</TableHead>
                <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Rate / Price</TableHead>
                <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest hidden md:table-cell">Description</TableHead>
                <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest hidden md:table-cell">Brochure</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.length > 0 ? (
                packages.map((pkg, idx) => (
                  <TableRow key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-bold text-gray-800">{pkg.name}</TableCell>
                    <TableCell className="font-black text-blue-600">{pkg.price}</TableCell>
                    <TableCell className="text-gray-500 text-sm hidden md:table-cell line-clamp-1 max-w-[300px]">{pkg.description || "N/A"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {pkg.pdfUrl ? (
                        <a
                          href={pkg.pdfUrl.startsWith("http") ? pkg.pdfUrl : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${pkg.pdfUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-orange-600 hover:underline font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" /> View PDF
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleOpenPackageModal(idx)} className="gap-2 font-bold cursor-pointer">
                            <Edit2 className="w-4 h-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemovePackage(idx)} className="gap-2 font-bold text-red-600 cursor-pointer hover:bg-red-50">
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-400 font-bold italic">
                    No packages added yet. Click &quot;Add Package&quot; to list your service rates.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PACKAGE MODAL */}
      <Dialog open={isPackageModalOpen} onOpenChange={setIsPackageModalOpen}>
        <DialogContent className="max-w-md bg-white text-gray-900 shadow-2xl border border-gray-200 z-[1050]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
              {editingPackageIdx !== null ? "Edit Package" : "Create New Package"}
            </DialogTitle>
            <DialogDescription className="font-medium text-gray-500">
              Define the details for your construction service package.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Package Name</Label>
              <Input
                placeholder="e.g. Standard Construction"
                value={tempPackage.name}
                onChange={(e) => setTempPackage({ ...tempPackage, name: e.target.value })}
                className="font-bold h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Price / Rate</Label>
              <Input
                placeholder="e.g. ₹1500/sqft"
                value={tempPackage.price}
                onChange={(e) => setTempPackage({ ...tempPackage, price: e.target.value })}
                className="font-bold h-11 text-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">What's Included</Label>
              <Textarea
                placeholder="Briefly list features..."
                value={tempPackage.description}
                onChange={(e) => setTempPackage({ ...tempPackage, description: e.target.value })}
                className="min-h-[120px] font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Technical Brochure (PDF)</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files) {
                      setTempPackage({ ...tempPackage, pdfFile: e.target.files[0] });
                    }
                  }}
                  className="font-bold h-11 border-dashed"
                />
                {(tempPackage.pdfUrl || tempPackage.pdfFile) && (
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                    <FileText className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase">{tempPackage.pdfFile ? "New Selected" : "Existing"}</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase italic tracking-widest">Upload detailed scope or contract in PDF format.</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsPackageModalOpen(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleSavePackage} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8">
              {editingPackageIdx !== null ? "Update Package" : "Add to List"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackagesPage;
