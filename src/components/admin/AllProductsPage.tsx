"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import {
  fetchProducts,
  deleteProduct,
  resetProductState,
  Product,
} from "@/lib/features/products/productSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProductModal from "./EditProductModal";
import useDebounce from "@/hooks/useDebounce";

const CATEGORIES = [
  "Modern Home Design",
  "Duplex House Plans",
  "Single Storey House Plan",
  "Bungalow / Villa House Plans",
  "Apartment / Flat Plans",
  "Farmhouse",
  "Cottage Plans",
  "Row House / Twin House Plans",
  "Village House Plans",
  "Contemporary / Modern House Plans",
  "Colonial / Heritage House Plans",
  "Classic House Plan",
  "Kerala House Plans",
  "Kashmiri House Plan",
  "Marriage Garden",
  "Hospitals",
  "Shops and Showrooms",
  "Highway Resorts and Hotels",
  "Schools and Colleges Plans",
  "Temple & Mosque",
];

const AllProductsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter(); // ✅ FIX ADDED

  const { products, listStatus, actionStatus, error, pages, count } =
    useSelector((state: RootState) => state.products);

  const searchParams = useSearchParams();

  const initialPage = parseInt(searchParams?.get("page") || "1", 10);
  const initialCategory = searchParams?.get("category") || "all";
  const initialSearchTerm = searchParams?.get("search") || "";

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const [jumpToPage, setJumpToPage] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams();

    if (currentPage > 1) {
      params.set("page", String(currentPage));
    }

    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    }

    router.push(`/admin/products?${params.toString()}`);
  }, [currentPage, selectedCategory, debouncedSearchTerm, router]);

  useEffect(() => {
    const params: any = {
      pageNumber: currentPage,
      limit: 12,
    };

    if (debouncedSearchTerm) params.searchTerm = debouncedSearchTerm;
    if (selectedCategory !== "all") params.category = selectedCategory;

    dispatch(fetchProducts(params));
  }, [dispatch, currentPage, debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      if (isEditModalOpen) {
        toast.success("Product updated successfully!");
        handleCloseModal();
      }
      dispatch(resetProductState());
    }

    if (actionStatus === "failed" && error) {
      toast.error(String(error));
      dispatch(resetProductState());
    }
  }, [actionStatus, error, dispatch, isEditModalOpen]);

  const totalPages = pages || 1;

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId)).then((res) => {
        if (res.type.endsWith("fulfilled")) {
          toast.success("Product deleted successfully!");
          if (products.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
      });
    }
  };

  const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = parseInt(jumpToPage, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        setJumpToPage("");
      } else {
        toast.error(`Enter page between 1 and ${totalPages}`);
      }
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
          <Link href="/admin/products/add">
            <Button>
              <PlusCircle className="mr-2" size={18} />
              Add New Product
            </Button>
          </Link>
        </div>

        <p className="text-gray-600">
          Manage all your house plans and products here.
        </p>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                className="pl-10"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || selectedCategory !== "all") && (
            <div className="mt-3">
              <Button variant="ghost" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border">
          {listStatus === "loading" ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4">Image</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-t">
                        <td className="p-4">
                          <Avatar>
                            <AvatarImage src={product.mainImage} />
                          </Avatar>
                        </td>

                        <td className="p-4">{product.name}</td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">₹{product.price}</td>

                        <td className="p-4 flex gap-2">
                          <Button size="icon" onClick={() => handleEdit(product)}>
                            <Edit />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                    </Button>
                    <span className="text-sm font-medium text-gray-700 mx-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Go to page:</span>
                    <Input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={jumpToPage}
                      onChange={(e) => setJumpToPage(e.target.value)}
                      onKeyDown={handleJumpToPage}
                      className="w-20 h-9"
                      placeholder="e.g. 3"
                    />
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => {
                        const page = parseInt(jumpToPage, 10);
                        if (!isNaN(page) && page >= 1 && page <= totalPages) {
                          setCurrentPage(page);
                          setJumpToPage("");
                        } else {
                          toast.error(`Enter page between 1 and ${totalPages}`);
                        }
                      }}
                    >
                      Go
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </>
  );
};

export default AllProductsPage;