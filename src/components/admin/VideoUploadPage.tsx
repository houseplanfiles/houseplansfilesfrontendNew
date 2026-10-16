"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchVideos,
  fetchTopics,
  addVideoLink,
  updateVideo,
  deleteVideo,
  resetActionStatus,
  fetchAllProductsForDropdown,
} from "@/lib/features/videos/videoSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Trash2,
  Youtube,
  Clapperboard,
  Edit2,
  Video,
  ExternalLink,
  Plus,
  Search,
} from "lucide-react";

const VideoUploadPage = () => {
  const dispatch = useDispatch();
  const { videos, topics, listStatus, actionStatus, error } = useSelector(
    (state: any) => state.videos
  );
  const { products: allProducts } = useSelector((state: any) => state.products);
  const { userInfo } = useSelector((state: any) => state.user);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [topic, setTopic] = useState("");
  const [productLink, setProductLink] = useState("");

  // Edit State & Modal
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editYoutubeLink, setEditYoutubeLink] = useState("");
  const [editTopic, setEditTopic] = useState("");
  const [editProductLink, setEditProductLink] = useState("");

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterTopic, setSelectedFilterTopic] = useState("all");

  useEffect(() => {
    if (userInfo?.role === "admin") {
      dispatch(fetchVideos() as any);
      dispatch(fetchTopics() as any);
      if (!allProducts || allProducts.length === 0) {
        dispatch(fetchAllProductsForDropdown({}) as any);
      }
    }
  }, [dispatch, userInfo, allProducts]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully!");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(error || "An error occurred.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeLink || !topic) {
      return toast.error("Please provide a Title, YouTube Link, and Topic.");
    }
    (dispatch(
      addVideoLink({
        title,
        description,
        youtubeLink,
        topic,
        productLink: productLink === "none" ? null : productLink,
      }) as any
    ) as Promise<any>).then((res: any) => {
      if (res.type.endsWith("fulfilled")) {
        setTitle("");
        setDescription("");
        setYoutubeLink("");
        setTopic("");
        setProductLink("");
        dispatch(fetchTopics() as any);
      }
    });
  };

  const handleOpenEdit = (video: any) => {
    setEditingVideo(video);
    setEditTitle(video.title || "");
    setEditDescription(video.description || "");
    setEditYoutubeLink(video.youtubeLink || "");
    setEditTopic(video.topic || "");
    setEditProductLink(video.productLink?._id || video.productLink || "none");
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    if (!editTitle || !editYoutubeLink || !editTopic) {
      return toast.error("Please provide a Title, YouTube Link, and Topic.");
    }

    (dispatch(
      updateVideo({
        id: editingVideo._id,
        title: editTitle,
        description: editDescription,
        youtubeLink: editYoutubeLink,
        topic: editTopic,
        productLink: editProductLink === "none" ? null : editProductLink,
      }) as any
    ) as Promise<any>).then((res: any) => {
      if (res.type.endsWith("fulfilled")) {
        setEditingVideo(null);
        dispatch(fetchTopics() as any);
      }
    });
  };

  const handleDelete = (videoId: string) => {
    if (window.confirm("Are you sure you want to delete this tutorial video?")) {
      dispatch(deleteVideo(videoId) as any);
    }
  };

  const productOptions = (allProducts || []).map((p: any) => ({
    value: p._id,
    label: p.name || p.Name,
  }));

  const filteredVideos = (videos || []).filter((v: any) => {
    const matchesSearch =
      (v.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.topic || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic =
      selectedFilterTopic === "all" || v.topic === selectedFilterTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Clapperboard className="w-3.5 h-3.5" /> Tutorial & Video Management
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Tutorial Videos
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Upload tutorial videos with YouTube links, titles, full descriptions, and link them to store products.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-sm">
              Total Videos: <strong className="text-orange-600">{videos.length}</strong>
            </span>
          </div>
        </div>

        {/* Add Video Form Card */}
        <Card className="mb-10 border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-orange-50/60 to-transparent border-b border-orange-100/60 pb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">
                  Add New Tutorial Video
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500">
                  Enter video title, YouTube URL, description, topic, and optional product association.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="title" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Video Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., How to read structural drawings properly"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1.5 h-11 bg-white border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="topic" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Topic / Category <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g., House Planning, 3D Elevation, Architecture Tips"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    list="topic-suggestions"
                    required
                    className="mt-1.5 h-11 bg-white border-slate-200 rounded-xl text-sm"
                  />
                  <datalist id="topic-suggestions">
                    {topics.map((t: string, i: number) => (
                      <option key={i} value={t} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <Label htmlFor="youtubeLink" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  YouTube Video Link <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600" />
                  <Input
                    id="youtubeLink"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    required
                    className="pl-11 h-11 bg-white border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Video Description (Detailed explanation & key points)
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Explain what this tutorial teaches, key timestamps, notes or instructions for users..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 bg-white border-slate-200 rounded-xl text-sm resize-y"
                />
              </div>

              <div>
                <Label htmlFor="productLink" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Link to Store Product (Optional)
                </Label>
                <div className="mt-1.5">
                  <Select onValueChange={setProductLink} value={productLink}>
                    <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl text-sm">
                      <SelectValue placeholder="Select a product to link with this video..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (General Tutorial)</SelectItem>
                      {productOptions.map((option: any) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-11 px-6 rounded-xl shadow-sm text-sm"
                  disabled={actionStatus === "loading"}
                >
                  {actionStatus === "loading" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Publish Tutorial Video
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Video List Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-orange-600" /> Uploaded Tutorial Videos ({filteredVideos.length})
            </h2>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10 w-48 sm:w-60 bg-white border-slate-200 rounded-xl text-xs"
                />
              </div>
              <select
                value={selectedFilterTopic}
                onChange={(e) => setSelectedFilterTopic(e.target.value)}
                className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Topics</option>
                {topics.map((t: string) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {listStatus === "loading" ? (
            <div className="flex justify-center p-16">
              <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
            </div>
          ) : filteredVideos.length === 0 ? (
            <Card className="text-center py-16 bg-white border-slate-200 rounded-2xl shadow-sm">
              <CardContent>
                <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center mb-3">
                  <Clapperboard className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No tutorial videos found</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  {searchTerm || selectedFilterTopic !== "all"
                    ? "Try clearing your search query or topic filter."
                    : "Start by filling the form above and adding your first YouTube tutorial video."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredVideos.map((video: any) => (
                <Card
                  key={video._id}
                  className="overflow-hidden group relative bg-white border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <span className="absolute top-2.5 left-2.5 text-[10px] bg-slate-900/80 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {video.topic}
                    </span>
                    <a
                      href={video.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Youtube className="w-5 h-5 fill-current" />
                      </div>
                    </a>
                  </div>

                  <CardContent className="p-4 flex flex-col flex-grow">
                    <h3
                      className="font-bold text-sm text-slate-900 line-clamp-2 mb-1.5 leading-snug"
                      title={video.title}
                    >
                      {video.title}
                    </h3>

                    {video.description ? (
                      <p className="text-xs text-slate-600 line-clamp-3 mb-2.5 leading-relaxed">
                        {video.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic mb-2.5">
                        No description provided.
                      </p>
                    )}

                    {video.productLink && (
                      <div className="mt-auto pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-orange-600 font-semibold truncate">
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          Linked: {video.productLink.name || video.productLink.Name}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(video)}
                        className="h-8 px-2.5 text-xs font-semibold text-slate-700 hover:text-orange-600 border-slate-200"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(video._id)}
                        className="h-8 px-2.5 text-xs font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        <Dialog open={!!editingVideo} onOpenChange={(open) => !open && setEditingVideo(null)}>
          <DialogContent className="max-w-xl bg-white rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-orange-600" /> Edit Tutorial Video
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleUpdate} className="space-y-4 mt-3">
              <div>
                <Label htmlFor="edit-title" className="text-xs font-bold text-slate-700 uppercase">
                  Video Title
                </Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="mt-1 h-10 border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <Label htmlFor="edit-topic" className="text-xs font-bold text-slate-700 uppercase">
                  Topic / Category
                </Label>
                <Input
                  id="edit-topic"
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  required
                  className="mt-1 h-10 border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <Label htmlFor="edit-youtubeLink" className="text-xs font-bold text-slate-700 uppercase">
                  YouTube Link
                </Label>
                <Input
                  id="edit-youtubeLink"
                  value={editYoutubeLink}
                  onChange={(e) => setEditYoutubeLink(e.target.value)}
                  required
                  className="mt-1 h-10 border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <Label htmlFor="edit-description" className="text-xs font-bold text-slate-700 uppercase">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1 border-slate-200 rounded-xl text-sm resize-y"
                />
              </div>

              <div>
                <Label htmlFor="edit-productLink" className="text-xs font-bold text-slate-700 uppercase">
                  Linked Product
                </Label>
                <div className="mt-1">
                  <Select onValueChange={setEditProductLink} value={editProductLink}>
                    <SelectTrigger className="h-10 border-slate-200 rounded-xl text-sm">
                      <SelectValue placeholder="Select product..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {productOptions.map((opt: any) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingVideo(null)}
                  className="rounded-xl text-xs font-bold h-10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold h-10 px-5"
                  disabled={actionStatus === "loading"}
                >
                  {actionStatus === "loading" && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default VideoUploadPage;
