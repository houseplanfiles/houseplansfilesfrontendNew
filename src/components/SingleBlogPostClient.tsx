"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, ServerCrash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BlogSidebar from "@/components/BlogSidebar";
import { fetchPostBySlug, clearCurrentPost } from "@/lib/features/blog/blogSlice";
import { RootState, AppDispatch } from "@/lib/store";

interface Props {
  slug: string;
  initialPost?: any;
}

export default function SingleBlogPostClient({ slug, initialPost }: Props) {
  const dispatch: AppDispatch = useDispatch();
  const { post, status } = useSelector((state: RootState) => state.blog);

  const displayPost = post?.slug === slug ? post : initialPost;

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostBySlug(slug));
    }
    return () => { dispatch(clearCurrentPost()); };
  }, [dispatch, slug]);

  if (status === "loading" && !displayPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!displayPost) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center text-center p-4">
        <ServerCrash className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-4xl font-bold text-foreground">Post Not Found</h1>
        <p className="mt-2 text-muted-foreground">The blog post you are looking for does not exist.</p>
        <Button asChild className="mt-6 btn-primary">
          <Link href="/blogs">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";
  const imageUrl = displayPost.mainImage?.startsWith("http")
    ? displayPost.mainImage
    : displayPost.mainImage ? `${backendApiUrl}${displayPost.mainImage}` : "/logo1.png";

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            {/* Main Image */}
            {displayPost.mainImage && (
              <div className="rounded-2xl overflow-hidden mb-8 shadow-large aspect-video">
                <img
                  src={imageUrl}
                  alt={displayPost.imageAltText || displayPost.title}
                  title={displayPost.imageTitleText || displayPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title - uses h1Text if admin set it for SEO */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {displayPost.h1Text || displayPost.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
              <span className="flex items-center gap-1.5">
                By <strong className="text-foreground">{displayPost.author}</strong>
              </span>
              <span>{new Date(displayPost.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
              {displayPost.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {displayPost.tags.map((tag: string) => (
                    <span key={tag} className="bg-orange-50 text-orange-600 text-xs px-2 py-0.5 rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none text-foreground
                prose-headings:font-bold prose-headings:text-foreground
                prose-h2:text-2xl prose-h3:text-xl
                prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-medium
                prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1"
              dangerouslySetInnerHTML={{ __html: displayPost.content }}
            />

            {/* Share */}
            <div className="mt-10 pt-6 border-t border-border">
              <p className="font-semibold text-gray-700 mb-3">Share this post:</p>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "WhatsApp", color: "bg-green-500", href: `https://wa.me/?text=${encodeURIComponent(displayPost.title + " " + window.location.href)}` },
                  { label: "Facebook", color: "bg-blue-600", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
                  { label: "Twitter", color: "bg-black", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(displayPost.title)}&url=${encodeURIComponent(window.location.href)}` },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`${s.color} text-white text-sm px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity`}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <BlogSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
