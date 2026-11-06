"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ORGANIZED_CATEGORIES = [
  {
    group: "Architects & Engineers",
    items: [
      "Architecture",
      "Interior Design",
      "Civil Engineering",
      "Structural Design",
      "MEP Consulting",
      "Vastu Consulting",
      "Landscape Design",
      "3D Elevation / Rendering",
    ],
  },
  {
    group: "Construction & Contractors",
    items: [
      "House Construction",
      "Renovation & Remodeling",
      "Painting Services",
      "Plumbing Services",
      "Electrical Services",
      "Carpentry",
      "Flooring & Tiling",
      "False Ceiling",
      "Modular Kitchen",
      "Furniture & Woodwork",
      "Roofing Services",
      "Waterproofing",
    ],
  },
  {
    group: "Home & Specialty Services",
    items: [
      "Pest Control",
      "HVAC",
      "Solar Panel Installation",
      "Smart Home Automation",
      "Security Systems (CCTV)",
      "Glass & Aluminium Works",
      "Fabrication & Welding",
    ],
  },
  {
    group: "Building Materials & Shops",
    items: [
      "Building Material Shop",
      "Cement & Concrete",
      "Steel & Iron Supplier",
      "Bricks & Blocks",
      "Tiles & Sanitaryware",
      "Hardware Store",
    ],
  },
  {
    group: "Industrial Solutions",
    items: [
      "Pre-Engineered Buildings (PEB)",
      "Precast Concrete Materials",
      "Prefab Modular Cabins",
      "Heavy Machinery Rental",
      "Industrial Roofing & Flooring",
    ],
  },
];

interface PostRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostRequirementModal: React.FC<PostRequirementModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      category: formData.get("category"),
      budget: formData.get("budget"),
      qualityTier: formData.get("qualityTier") || "medium",
      requirements: formData.get("requirements")
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Your requirement has been posted successfully!");
        onClose();
      } else {
        toast.error(result.message || "Failed to post requirement");
      }
    } catch (error) {
      console.error("Submit error", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Post Your Requirement</DialogTitle>
          <DialogDescription className="text-gray-500">
            Tell us what you need and get connected with top professionals in your city.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input id="name" name="name" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone / WhatsApp <span className="text-red-500">*</span></Label>
              <Input id="phone" name="phone" required placeholder="e.g. 9876543210" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
              <Input id="city" name="city" required placeholder="Mumbai" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <Input id="budget" name="budget" placeholder="e.g. 5 Lakhs" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
            <select 
              id="category" 
              name="category" 
              required
              defaultValue=""
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select a category...</option>
              {ORGANIZED_CATEGORIES.map((grp) => (
                <optgroup key={grp.group} label={grp.group} className="font-bold text-gray-900 bg-gray-50">
                  {grp.items.map((cat) => (
                    <option key={cat} value={cat} className="font-normal text-gray-700 bg-white">
                      {cat}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualityTier">Lead Quality / Priority</Label>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-slate-200 cursor-pointer text-xs font-semibold hover:border-blue-400 has-checked:border-blue-500 has-checked:bg-blue-50/50 has-checked:text-blue-700">
                <input type="radio" name="qualityTier" value="low" className="sr-only" />
                <span>🟢 Low (Standard)</span>
              </label>
              <label className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-slate-200 cursor-pointer text-xs font-semibold hover:border-amber-400 has-checked:border-amber-500 has-checked:bg-amber-50/50 has-checked:text-amber-700">
                <input type="radio" name="qualityTier" value="medium" defaultChecked className="sr-only" />
                <span>🟡 Medium</span>
              </label>
              <label className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-slate-200 cursor-pointer text-xs font-semibold hover:border-purple-400 has-checked:border-purple-500 has-checked:bg-purple-50/50 has-checked:text-purple-700">
                <input type="radio" name="qualityTier" value="high" className="sr-only" />
                <span>🔥 High (Premium)</span>
              </label>
            </div>
            <p className="text-[11px] text-gray-400">Select urgency & project scope so the best suited professionals connect.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements <span className="text-red-500">*</span></Label>
            <Textarea 
              id="requirements" 
              name="requirements" 
              required 
              placeholder="Describe your project details, dimensions, specific needs..."
              className="h-24 resize-none"
            />
          </div>

          <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Submit Requirement"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
