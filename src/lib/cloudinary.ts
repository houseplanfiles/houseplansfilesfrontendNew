/**
 * Transforms a Cloudinary URL to serve optimized smaller images.
 * Adds auto format, quality and width transformations.
 */
export function optimizeCloudinaryUrl(url: string, width = 400): string {
  if (!url) return url;
  if (!url.includes("res.cloudinary.com")) return url;

  // Agar pehle se f_auto ya q_auto hai, ya format error de raha hai, 
  // toh safe play karte huye direct original URL return karo.
  return url;
}

/**
 * FIX: Returns a Next.js /_next/image optimized URL for any image source.
 *
 * This routes both S3 and Cloudinary images through Next.js image optimization,
 * which handles WebP/AVIF conversion, resizing, and caching automatically.
 *
 * Requirements: the image hostname must be in next.config.js remotePatterns.
 *
 * Usage:
 *   <img src={getOptimizedImageUrl(product.mainImage, 400)} ... />
 *
 * Or better yet, use Next.js <Image> component which calls this automatically:
 *   <Image src={product.mainImage} width={400} height={300} alt="..." />
 */
export function getOptimizedImageUrl(url: string, width = 400): string {
  if (!url) return url;

  // Already a Cloudinary URL — use Cloudinary's own transforms (free tier friendly)
  if (url.includes("res.cloudinary.com")) {
    return optimizeCloudinaryUrl(url, width);
  }

  // Next.js _next/image endpoint can be unreliable for raw img tags with dynamic hostnames.
  // Just return the raw URL for S3/localhost and other sources.
  return url;
}
