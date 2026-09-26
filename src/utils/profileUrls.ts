export function slugify(text?: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace with -
    .replace(/-+/g, "-"); // collapse dashes
}

export function getArchitectProfileUrl(architect?: { _id?: string; city?: string; name?: string; businessName?: string } | null): string {
  if (!architect) return "/architects";
  const city = slugify(architect.city) || "india";
  const rawName = architect.name || architect.businessName || "architect";
  const name = slugify(rawName) || "architect";
  return `/architect/${encodeURIComponent(city)}/${encodeURIComponent(name)}`;
}

export function getContractorProfileUrl(contractor?: {
  _id?: string;
  profession?: string;
  city?: string;
  name?: string;
  role?: string;
  businessName?: string;
} | null): string {
  if (!contractor) return "/contractors";
  const role = (contractor.role || "").toLowerCase();
  const profession = (contractor.profession || "").toLowerCase();

  if (role === "architect" || profession === "architect") {
    return getArchitectProfileUrl(contractor);
  }

  const profSlug = slugify(contractor.profession) || "contractor";
  const citySlug = slugify(contractor.city) || "india";
  const rawName = contractor.name || contractor.businessName || "expert";
  const nameSlug = slugify(rawName) || "expert";
  return `/contractor/${encodeURIComponent(profSlug)}/${encodeURIComponent(citySlug)}/${encodeURIComponent(nameSlug)}`;
}

export function getSellerStoreUrl(seller?: {
  _id?: string;
  companyName?: string;
  businessName?: string;
  name?: string;
  city?: string;
  role?: string;
} | null): string {
  if (!seller) return "/building-material-marketplace";
  const rawName = seller.businessName || seller.companyName || seller.name || "seller";
  const nameSlug = slugify(rawName) || "seller";
  const citySlug = slugify(seller.city);
  if (citySlug) {
    return `/seller-shop/${encodeURIComponent(citySlug)}/${encodeURIComponent(nameSlug)}`;
  }
  return `/seller-shop/${encodeURIComponent(nameSlug)}`;
}
