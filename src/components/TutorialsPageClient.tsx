"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchVideos, fetchTopics } from "@/lib/features/videos/videoSlice";
import { RootState, AppDispatch } from "@/lib/store";
import {
  Loader2,
  PlayCircle,
  X,
  Youtube,
  Clapperboard,
  Search,
  ExternalLink,
  BookOpen,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TutorialsPageClient() {
  const dispatch: AppDispatch = useDispatch();
  const { videos, topics, listStatus } = useSelector(
    (state: RootState) => state.videos
  );

  const [selectedTopic, setSelectedTopic] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVideo, setActiveVideo] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchVideos(null));
    dispatch(fetchTopics());
  }, [dispatch]);

  const filteredVideos = useMemo(() => {
    return (videos || []).filter((v: any) => {
      const matchesTopic =
        selectedTopic === "All" || v.topic === selectedTopic;
      const matchesSearch =
        (v.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.topic || "").toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [videos, selectedTopic, searchTerm]);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff6b00_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-bold tracking-wide uppercase mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" /> Learning Hub & Video Guides
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Architectural & Construction <span className="text-orange-500">Tutorials</span>
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Watch curated video tutorials on 3D elevation, floor planning, site execution, interior design tips, and construction best practices.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search tutorials by title, topic or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 h-12 sm:h-14 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 border border-white/20 rounded-2xl text-sm sm:text-base backdrop-blur-md transition-all shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3.5">
            <button
              onClick={() => setSelectedTopic("All")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedTopic === "All"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Topics ({videos.length})
            </button>
            {topics.map((t: string) => {
              const count = (videos || []).filter((v: any) => v.topic === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedTopic === t
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Videos Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-grow w-full">
        {listStatus === "loading" ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
            <p className="text-sm font-semibold">Loading tutorials...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
              <Clapperboard className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No tutorial videos found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              {searchTerm || selectedTopic !== "All"
                ? "Try searching for a different keyword or select another category."
                : "Tutorial videos will appear here once added by the administration team."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredVideos.map((video: any) => (
              <div
                key={video._id}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Video Thumbnail */}
                <div
                  onClick={() => setActiveVideo(video)}
                  className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden"
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white/20" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 text-[11px] bg-slate-900/80 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {video.topic}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3
                    onClick={() => setActiveVideo(video)}
                    className="font-bold text-base sm:text-lg text-slate-900 line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors leading-snug mb-2"
                    title={video.title}
                  >
                    {video.title}
                  </h3>

                  {video.description ? (
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {video.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mb-4">
                      Click watch now to stream the complete tutorial.
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Button
                      onClick={() => setActiveVideo(video)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <PlayCircle className="w-4 h-4" /> Watch Tutorial
                    </Button>

                    {video.productLink && (
                      <Link
                        href={`/house-plans/${video.productLink._id || video.productLink}`}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline"
                      >
                        <span>Related Plan</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  {activeVideo.topic}
                </span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Iframe Embed */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeVideoId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer Info */}
            <div className="p-5 sm:p-6 bg-slate-950 text-white">
              <h2 className="text-lg sm:text-xl font-extrabold leading-snug">
                {activeVideo.title}
              </h2>
              {activeVideo.description && (
                <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto pr-2">
                  {activeVideo.description}
                </p>
              )}
              {activeVideo.productLink && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <Link
                    href={`/house-plans/${activeVideo.productLink._id || activeVideo.productLink}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300"
                  >
                    View Associated House Plan Design <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
