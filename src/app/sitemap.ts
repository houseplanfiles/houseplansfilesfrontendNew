import { MetadataRoute } from "next";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://houseplansfiles-backend.vercel.app";

const BASE_URL = "https://www.houseplanfiles.com";

// Plot-size pillar pages — one per major plot size, high priority for keyword cannibalization fix
const PLOT_SIZES = ["30x40", "20x40", "30x50", "40x60", "20x60", "25x50"];
const plotPillarPages: MetadataRoute.Sitemap = PLOT_SIZES.map((size) => ({
  url: `${BASE_URL}/house-plans/plot/${size}`,
  lastModified: new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.9,
}));

// City geo landing pages — high priority for local SEO
const GEO_CITIES = ["bhopal", "indore", "lucknow", "jaipur", "nagpur", "pune", "hyderabad", "chennai", "mumbai", "bengaluru", "delhi", "kolkata", "ahmedabad", "chandigarh", "patna", "ranchi"];
const cityPages: MetadataRoute.Sitemap = GEO_CITIES.map((city) => ({
  url: `${BASE_URL}/city/${city}`,
  lastModified: new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.85,
}));

// Static pages with their priorities and change frequencies
const staticPages: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
  { url: `${BASE_URL}/house-plans`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
  { url: `${BASE_URL}/architects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE_URL}/contractors`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE_URL}/interior-designs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/marketplace`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/packages`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  { url: `${BASE_URL}/floor-plans`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
  { url: `${BASE_URL}/3d-plans`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
  { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/city-partners`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 },
  { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/terms-and-conditions`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/refund-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/payment-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
];

async function getProductSlugs(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products?limit=5000&fields=slug,updatedAt`, {
      next: { revalidate: 0 },
      headers: { "User-Agent": "HousePlanFiles-NextJS" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const products = data.products || data || [];
    return products
      .filter((p: any) => p._id)
      .map((p: any) => {
        const titleSlug = p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" : "";
        const urlSlug = p.slug || `${titleSlug}${p._id}`;
        return {
          url: `${BASE_URL}/house-plans/${urlSlug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      });
  } catch {
    return [];
  }
}
async function getBlogSlugs(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blogs?limit=1000&fields=slug,updatedAt`, {
      next: { revalidate: 0 },
      headers: { "User-Agent": "HousePlanFiles-NextJS" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const blogs = data.blogs || data || [];
    return blogs
      .filter((b: { slug?: string }) => b.slug)
      .map((b: { slug: string; updatedAt?: string }) => ({
        url: `${BASE_URL}/blog/${b.slug}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.65,
      }));
  } catch {
    return [];
  }
}
async function getArchitects(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users?role=professional&limit=5000&fields=_id,updatedAt`, {
      next: { revalidate: 0 },
      headers: { "User-Agent": "HousePlanFiles-NextJS" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.users || data || [];
    return items
      .filter((a: { _id?: string }) => a._id)
      .map((a: { _id: string; updatedAt?: string }) => ({
        url: `${BASE_URL}/architects/${a._id}`,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}
async function getContractors(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users?role=contractor&limit=5000&fields=_id,updatedAt`, {
      next: { revalidate: 0 },
      headers: { "User-Agent": "HousePlanFiles-NextJS" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.users || data || [];
    return items
      .filter((c: { _id?: string }) => c._id)
      .map((c: { _id: string; updatedAt?: string }) => ({
        url: `${BASE_URL}/contractors/${c._id}`,
        lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

async function getSellers(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users?role=seller&limit=5000&fields=_id,updatedAt`, {
      next: { revalidate: 0 },
      headers: { "User-Agent": "HousePlanFiles-NextJS" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.users || data || [];
    return items
      .filter((s: { _id?: string }) => s._id)
      .map((s: { _id: string; updatedAt?: string }) => ({
        url: `${BASE_URL}/seller-shop/${s._id}`,
        lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogs, architects, contractors, sellers] = await Promise.all([
    getProductSlugs(),
    getBlogSlugs(),
    getArchitects(),
    getContractors(),
    getSellers()
  ]);
  return [...staticPages, ...plotPillarPages, ...cityPages, ...products, ...blogs, ...architects, ...contractors, ...sellers];
}
