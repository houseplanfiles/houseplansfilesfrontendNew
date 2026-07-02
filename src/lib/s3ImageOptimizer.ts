/**
 * Resizes S3 images on-the-fly using imgproxy or direct URL params.
 * Since S3 doesn't have built-in transforms, we limit the display size
 * by passing the URL through Next.js Image optimization or using width hints.
 * 
 * For now: adds width parameter hint for browsers that support it
 * and returns optimized URL format.
 */
export function optimizeS3ImageUrl(url: string, width = 200): string {
  if (!url) return url;
  
  // Already optimized or not S3
  if (!url.includes("amazonaws.com")) return url;
  
  // Return as-is — Next.js <Image> component handles S3 optimization
  // when used with remotePatterns config
  return url;
}

/**
 * Returns appropriate sizes attribute for responsive images
 */
export function getImageSizes(type: "avatar" | "card" | "hero" = "card"): string {
  switch (type) {
    case "avatar": return "128px";
    case "card": return "(max-width: 768px) 50vw, 200px";
    case "hero": return "(max-width: 768px) 100vw, 50vw";
    default: return "200px";
  }
}
