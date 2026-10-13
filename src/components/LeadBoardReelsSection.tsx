"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ReelItem {
  id: string;
  title: string;
  creator: string;
  role: string;
  city: string;
  videoUrl: string;
  poster: string;
  views: string;
  likes: number;
  duration: string;
  tag: string;
}

const REELS_DATA: ReelItem[] = [
  {
    id: "reel-1",
    title: "30x50 Modern Duplex Villa 3D Walkthrough 🏡",
    creator: "Ar. Rohit Sharma",
    role: "Architect",
    city: "Bhopal, MP",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41484-large.mp4",
    poster: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    views: "84.2K",
    likes: 4820,
    duration: "0:24",
    tag: "3D House Tour",
  },
  {
    id: "reel-2",
    title: "Luxury 4BHK Elevation Design & Ambient Lighting ✨",
    creator: "Design Studio Apex",
    role: "Architectural Studio",
    city: "Indore, MP",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-luxurious-modern-house-41512-large.mp4",
    poster: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    views: "128K",
    likes: 9240,
    duration: "0:18",
    tag: "Modern Elevation",
  },
  {
    id: "reel-3",
    title: "Live Site: Column Footing & Concrete Pouring 🏗️",
    creator: "Sharma Construction",
    role: "Civil Contractor",
    city: "Jaipur, RJ",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-construction-worker-working-on-a-building-structure-41556-large.mp4",
    poster: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80",
    views: "62.4K",
    likes: 3510,
    duration: "0:30",
    tag: "Site Inspection",
  },
  {
    id: "reel-4",
    title: "Minimalist Living Room & Warm False Ceiling Setup 🛋️",
    creator: "Interior Craft Studio",
    role: "Interior Designer",
    city: "Delhi NCR",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-walking-through-a-modern-living-room-41487-large.mp4",
    poster: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
    views: "45.1K",
    likes: 2940,
    duration: "0:21",
    tag: "Interior Design",
  },
  {
    id: "reel-5",
    title: "Luxury Farmhouse with Swimming Pool & Green Patio 🏊",
    creator: "Verma & Associates",
    role: "Architect",
    city: "Pune, MH",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-patio-and-pool-41508-large.mp4",
    poster: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    views: "156K",
    likes: 12400,
    duration: "0:28",
    tag: "Farmhouse Design",
  },
  {
    id: "reel-6",
    title: "100% Vastu-Compliant 2BHK Floor Plan Drafting 📐",
    creator: "Ar. Neha Gupta",
    role: "Architect",
    city: "Lucknow, UP",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-architect-working-on-building-blueprints-41560-large.mp4",
    poster: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80",
    views: "73.9K",
    likes: 5120,
    duration: "0:22",
    tag: "Vastu Planning",
  },
  {
    id: "reel-7",
    title: "Excavation & Ground Leveling Foundation Works 🚜",
    creator: "BuildTech Contractors",
    role: "Building Contractor",
    city: "Ahmedabad, GJ",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-heavy-machinery-working-on-a-construction-site-41552-large.mp4",
    poster: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80",
    views: "39.8K",
    likes: 1820,
    duration: "0:25",
    tag: "Civil Works",
  },
  {
    id: "reel-8",
    title: "Happy Client Home Handover in Just 110 Days! 🔑",
    creator: "Om Infra Projects",
    role: "Turnkey Builder",
    city: "Nagpur, MH",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-family-walking-outside-their-new-home-41490-large.mp4",
    poster: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    views: "192K",
    likes: 15700,
    duration: "0:26",
    tag: "Turnkey Delivery",
  },
];

export default function LeadBoardReelsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeReelModalIndex, setActiveReelModalIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    REELS_DATA.forEach((r) => {
      initial[r.id] = r.likes;
    });
    return initial;
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedReels((prev) => {
      const isLiked = !prev[id];
      setLikeCounts((counts) => ({
        ...counts,
        [id]: isLiked ? counts[id] + 1 : counts[id] - 1,
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  const handleShare = async (e: React.MouseEvent, reel: ReelItem) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: reel.title,
          text: `Check out this architecture reel by ${reel.creator} on HousePlanFiles!`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Reel link copied to clipboard!");
    }
  };

  const activeReel = activeReelModalIndex !== null ? REELS_DATA[activeReelModalIndex] : null;

  return (
    <section className="w-full bg-[#FAF9F6] py-12 md:py-16 border-t border-gray-200/70 overflow-hidden relative">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 text-orange-600 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>Trending Short Videos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Watch Real Site &amp; Project <span className="text-[#ff6b00]">Reels</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-1 max-w-2xl font-medium">
              Explore 3D house tours, live construction work, and finished interiors uploaded by verified professionals.
            </p>
          </div>

          {/* Navigation Scroll Buttons */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200 hover:border-orange-300 flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200 hover:border-orange-300 flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reels Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {REELS_DATA.map((reel, index) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              index={index}
              isLiked={!!likedReels[reel.id]}
              likeCount={likeCounts[reel.id] || reel.likes}
              onToggleLike={(e) => toggleLike(e, reel.id)}
              onShare={(e) => handleShare(e, reel)}
              onOpenModal={() => setActiveReelModalIndex(index)}
            />
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-xl border border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ff6b00] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
              ⚡
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base leading-tight">Are you an Architect or Contractor?</h4>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">Upload your project reels, get verified, and receive high-budget homeowner leads directly.</p>
            </div>
          </div>
          <Link
            href="/register"
            className="shrink-0 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>Register as Professional</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* --- FULLSCREEN REEL POPUP MODAL --- */}
      {activeReel && activeReelModalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          {/* Close button */}
          <button
            onClick={() => setActiveReelModalIndex(null)}
            className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Reel Navigation */}
          {activeReelModalIndex > 0 && (
            <button
              onClick={() => setActiveReelModalIndex(activeReelModalIndex - 1)}
              className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center border border-white/20 transition-all cursor-pointer hover:scale-110"
              title="Previous Reel"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Reel Navigation */}
          {activeReelModalIndex < REELS_DATA.length - 1 && (
            <button
              onClick={() => setActiveReelModalIndex(activeReelModalIndex + 1)}
              className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center border border-white/20 transition-all cursor-pointer hover:scale-110"
              title="Next Reel"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Modal Reel Player Frame (9:16 Aspect) */}
          <div className="relative w-full max-w-[390px] h-[86vh] max-h-[780px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col justify-between">
            <video
              src={activeReel.videoUrl}
              poster={activeReel.poster}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

            {/* Top Bar inside Reel */}
            <div className="relative z-10 p-4 flex items-center justify-between text-white">
              <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                {activeReel.tag}
              </span>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Right Side Floating Actions inside Modal */}
            <div className="absolute right-3.5 bottom-28 z-20 flex flex-col items-center gap-4 text-white">
              <button
                onClick={(e) => toggleLike(e, activeReel.id)}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                  likedReels[activeReel.id] 
                    ? "bg-red-500 border-red-400 text-white scale-110" 
                    : "bg-black/40 border-white/20 text-white hover:bg-black/60"
                }`}>
                  <Heart className={`w-5 h-5 ${likedReels[activeReel.id] ? "fill-white" : ""}`} />
                </div>
                <span className="text-[11px] font-bold">
                  {(likeCounts[activeReel.id] || activeReel.likes).toLocaleString()}
                </span>
              </button>

              <button
                onClick={(e) => handleShare(e, activeReel)}
                className="flex flex-col items-center gap-1 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold">Share</span>
              </button>
            </div>

            {/* Bottom Content inside Reel */}
            <div className="relative z-10 p-5 space-y-3 text-white">
              {/* Creator Pill */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md border border-white/60">
                  {activeReel.creator.charAt(0)}
                </div>
                <div>
                  <h5 className="font-extrabold text-sm flex items-center gap-1">
                    {activeReel.creator}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  </h5>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {activeReel.role} • {activeReel.city}
                  </p>
                </div>
              </div>

              {/* Title */}
              <p className="font-bold text-sm leading-snug line-clamp-2 drop-shadow-sm">
                {activeReel.title}
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/leads"
                  onClick={() => setActiveReelModalIndex(null)}
                  className="flex-1 bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-black py-2.5 px-4 rounded-xl text-center shadow-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Enquire This Project
                </Link>
                <Link
                  href="/architects"
                  onClick={() => setActiveReelModalIndex(null)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold py-2.5 px-3.5 rounded-xl border border-white/30 text-center transition-all"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Single Reel Card in Carousel
function ReelCard({
  reel,
  isLiked,
  likeCount,
  onToggleLike,
  onShare,
  onOpenModal,
}: {
  reel: ReelItem;
  index: number;
  isLiked: boolean;
  likeCount: number;
  onToggleLike: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onOpenModal: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div
      onClick={onOpenModal}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative shrink-0 w-[240px] sm:w-[270px] md:w-[290px] h-[420px] sm:h-[460px] md:h-[490px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group snap-start select-none"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.poster}
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-black/40 pointer-events-none" />

      {/* Top Badges */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between">
        <span className="bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold text-white border border-white/20">
          {reel.tag}
        </span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
        </div>
      </div>

      {/* Floating Side Action Icons */}
      <div className="absolute right-2.5 sm:right-3 bottom-24 z-20 flex flex-col items-center gap-3">
        <button
          onClick={onToggleLike}
          aria-label="Like reel"
          className="flex flex-col items-center gap-0.5 group/btn cursor-pointer"
        >
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
            isLiked 
              ? "bg-red-500 border-red-400 text-white scale-110" 
              : "bg-black/40 border-white/20 text-white hover:bg-black/60 group-hover/btn:scale-110"
          }`}>
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? "fill-white" : ""}`} />
          </div>
          <span className="text-[10px] font-extrabold text-white drop-shadow-sm">
            {likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount}
          </span>
        </button>

        <button
          onClick={onShare}
          aria-label="Share reel"
          className="flex flex-col items-center gap-0.5 group/btn cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all group-hover/btn:scale-110">
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] font-extrabold text-white drop-shadow-sm">Share</span>
        </button>
      </div>

      {/* Bottom Content Info */}
      <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 z-10 space-y-2">
        {/* Creator Info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#ff6b00] text-white flex items-center justify-center text-[10px] sm:text-xs font-black shadow-xs border border-white/60 shrink-0">
            {reel.creator.charAt(0)}
          </div>
          <div className="min-w-0 pr-8">
            <h5 className="font-extrabold text-xs text-white truncate flex items-center gap-1">
              {reel.creator}
              <CheckCircle2 className="w-3 h-3 text-emerald-400 fill-emerald-400 shrink-0" />
            </h5>
            <p className="text-[10px] text-slate-300 truncate">
              {reel.city}
            </p>
          </div>
        </div>

        {/* Reel Title */}
        <p className="text-white text-xs sm:text-[13px] font-extrabold leading-snug line-clamp-2 drop-shadow-sm">
          {reel.title}
        </p>

        {/* Views & Duration Pill */}
        <div className="flex items-center gap-2 text-[10px] text-slate-300 font-medium pt-0.5">
          <span className="flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-current" /> {reel.views} views
          </span>
          <span>•</span>
          <span>{reel.duration}</span>
        </div>
      </div>
    </div>
  );
}
