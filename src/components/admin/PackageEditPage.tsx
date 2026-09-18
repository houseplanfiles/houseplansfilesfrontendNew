"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  createPackage,
  updatePackage,
  resetActionStatus,
  fetchAllPackages,
} from "@/lib/features/packages/packageSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const defaultFormData = {
  title: "",
  price: "",
  unit: "Per sq.ft.",
  areaType: "",
  packageType: "standard",
  isPopular: false,
  features: "",
  includes: "",
  note: "",
};

const PackageEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();

  const { packages, actionStatus, error } = useSelector(
    (state: RootState) => state.packages
  );

  const [formData, setFormData] = useState(defaultFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(id) && id !== "add";

  useEffect(() => {
    if (isEditMode && packages.length === 0) {
      dispatch(fetchAllPackages());
    }
  }, [isEditMode, packages.length, dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded" && isSubmitting) {
      toast({
        title: `Package ${isEditMode ? "updated" : "created"} successfully!`,
      });
      if (isEditMode) {
        router.push("/admin/packages");
      } else {
        // Clear form for adding more
        setFormData(defaultFormData);
        setImageFile(null);
        const fileInput = document.getElementById("image") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
      setIsSubmitting(false);
    }
    if (actionStatus === "failed" && isSubmitting) {
      toast({ title: "Error", description: error, variant: "destructive" });
      setIsSubmitting(false);
    }
    return () => {
      if (actionStatus !== "loading") {
        dispatch(resetActionStatus());
      }
    };
  }, [actionStatus, error, router, dispatch, isEditMode, toast, isSubmitting]);

  useEffect(() => {
    if (isEditMode && packages.length > 0) {
      const existingPackage = packages.find((p) => p._id === id);
      if (existingPackage) {
        setFormData({
          title: existingPackage.title,
          price: String(existingPackage.price),
          unit: existingPackage.unit,
          areaType: existingPackage.areaType || "",
          packageType: existingPackage.packageType,
          isPopular: existingPackage.isPopular,
          note: existingPackage.note || "",
          features: existingPackage.features.join(", "),
          includes: existingPackage.includes?.join(", ") || "",
        });
      }
    } else if (!isEditMode) {
      setFormData(defaultFormData);
    }
  }, [id, packages, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("price", formData.price);
    submitData.append("unit", formData.unit);
    submitData.append("areaType", formData.areaType);
    submitData.append("packageType", formData.packageType);
    submitData.append("isPopular", String(formData.isPopular));
    submitData.append("note", formData.note);
    
    const featuresArray = formData.features.split(",").map((item) => item.trim()).filter(Boolean);
    featuresArray.forEach(f => submitData.append("features", f));
    
    const includesArray = formData.includes.split(",").map((item) => item.trim()).filter(Boolean);
    includesArray.forEach(i => submitData.append("includes", i));

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    if (isEditMode) {
      dispatch(updatePackage({ id: id as string, packageData: submitData }));
    } else {
      dispatch(createPackage(submitData));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Package" : "Add New Package"}
        </h1>
        <Button variant="outline" onClick={() => router.push("/admin/packages")}>
          Back to List
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow"
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Floor Plan or Gold Partner"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Enter price here"
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit (e.g., Per sq.ft. or Lifetime)</Label>
            <Input
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="areaType">Area Type (Optional)</Label>
          <Input
            id="areaType"
            name="areaType"
            value={formData.areaType}
            onChange={handleChange}
            placeholder="e.g. Residential, District, etc."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="packageType">Package Type</Label>
            <select
              name="packageType"
              id="packageType"
              value={formData.packageType}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md bg-background"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="marketplace">Marketplace</option>
              <option value="city_partner">City Partner</option>
              <option value="construction">Construction</option>
            </select>
          </div>
          <div>
            <Label htmlFor="image">Package Image (Optional)</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="features">Features (comma separated)</Label>
          <Textarea
            id="features"
            name="features"
            value={formData.features}
            onChange={handleChange}
            placeholder="Feature 1, Feature 2, Feature 3"
          />
        </div>
        <div>
          <Label htmlFor="includes">Includes (comma separated)</Label>
          <Textarea
            id="includes"
            name="includes"
            value={formData.includes}
            onChange={handleChange}
            placeholder="Extra items included in the package"
          />
        </div>
        <div>
          <Label htmlFor="note">Note (Optional)</Label>
          <Input
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="e.g. Best value, Most popular"
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isPopular"
            name="isPopular"
            checked={formData.isPopular}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <Label htmlFor="isPopular" className="font-medium">
            Mark as Popular Package
          </Label>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={actionStatus === "loading"}
            className="w-full"
          >
            {actionStatus === "loading" ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </>
            ) : isEditMode ? (
              "Update Package"
            ) : (
              "Save and Add More"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PackageEditPage;