import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SingleBlogPostPageClient from "@/components/SingleBlogPostPageClient";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";

async function getBlogPost(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blogs/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);
  if (!post) return { title: "Blog Post Not Found" };
  const title = `${post.title} | HousePlanFiles Blog`;
  const description = post.metaDescription || post.description || `Read ${post.title} on HousePlanFiles Blog.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", publishedTime: post.createdAt, images: [{ url: post.mainImage || "/logo1.png" }] },
    alternates: { canonical: `https://www.houseplanfiles.com/blog/${resolvedParams.slug}` },
  };
}

const blogPostingSchema = (post: any, slug: string) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.h1Text || post.title,
  description: post.metaDescription || post.description,
  image: post.mainImage || "/logo1.png",
  datePublished: post.createdAt,
  dateModified: post.updatedAt,
  author: { "@type": "Person", name: post.author || "HousePlanFiles Team" },
  publisher: { "@type": "Organization", name: "HousePlanFiles", logo: { "@type": "ImageObject", url: "https://www.houseplanfiles.com/logo1.png" } },
  url: `https://www.houseplanfiles.com/blog/${slug}`,
});

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);
  if (!post) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema(post, resolvedParams.slug)) }} />
      <SingleBlogPostPageClient />
    </>
  );
}
