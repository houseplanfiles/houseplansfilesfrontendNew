"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
const categories = [
  { _id: "668e7d2354898144214a1a10", name: "Electronics" },
  { _id: "668e7d2354898144214a1a11", name: "Books" },
];
const brands = [
  { _id: "668e7d2354898144214a1a12", name: "Apple" },
  { _id: "668e7d2354898144214a1a13", name: "Samsung" },
];
interface IFormData {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  countInStock: number;
  category: string;
  brand: string;
  unit: string;
  seoTitle?: string;
  seoDescription?: string;
  seoAltText?: string;
}
interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSave: (productId: string, formData: FormData) => void;
  isLoading: boolean;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      name: product?.name,
      description: product?.description,
      price: product?.price,
      salePrice: product?.salePrice,
      countInStock: product?.countInStock,
      category: product?.category?.name || product?.category,
      brand: product?.brand?.name || product?.brand,
      unit: product?.unit,
      seoTitle: product?.seo?.title || "",
      seoDescription: product?.seo?.description || "",
      seoAltText: product?.seo?.altText || "",
    },
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        countInStock: product.countInStock,
        category: product.category?.name || product.category,
        brand: product.brand?.name || product.brand,
        unit: product.unit,
        seoTitle: product.seo?.title || "",
        seoDescription: product.seo?.description || "",
        seoAltText: product.seo?.altText || "",
      });
      setNewImage(null);
    }
  }, [product, reset]);
  const handleSave = (data: IFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (newImage) {
      formData.append("image", newImage);
    }
    onSave(product._id, formData);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {product?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                {...register("price", { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="salePrice">Discount Price (₹)</Label>
              <Input
                id="salePrice"
                type="number"
                {...register("salePrice", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register("category", { required: true })}
                className="w-full p-2 border rounded"
                placeholder="e.g. Cement"
              />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                {...register("brand", { required: true })}
                className="w-full p-2 border rounded"
                placeholder="e.g. Ambuja"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="countInStock">Stock Quantity</Label>
            <Input
              id="countInStock"
              type="number"
              {...register("countInStock", {
                required: true,
                valueAsNumber: true,
              })}
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit (kg, nos, per sqft, etc.)</Label>
            <Input
              id="unit"
              {...register("unit", { required: true })}
              placeholder="e.g. kg"
            />
          </div>
          <div className="pt-4 mt-2 border-t border-gray-200">
            <h4 className="font-semibold text-md mb-4 text-gray-800">SEO Meta Data</h4>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="seoTitle">Meta Title</Label>
                <Input id="seoTitle" placeholder="SEO Title" {...register("seoTitle")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea id="seoDescription" placeholder="SEO Description" {...register("seoDescription")} rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seoAltText">Image Alt Text</Label>
                <Input id="seoAltText" placeholder="Main Image Alt Text" {...register("seoAltText")} />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="newImage">Change Main Image (Optional)</Label>
            <Input
              id="newImage"
              type="file"
              onChange={(e) =>
                setNewImage(e.target.files ? e.target.files[0] : null)
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              Current Image:{" "}
              <a
                href={product?.image}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View
              </a>
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
