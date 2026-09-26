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

export function getArchitectProfileUrl(architect?: { _id?: string; city?: string; name?: string } | null): string {
  if (!architect) return "/architects";
  if (architect.name) {
    const city = slugify(architect.city) || "india";
    const name = slugify(architect.name) || "architect";
    return `/architect/${encodeURIComponent(city)}/${encodeURIComponent(name)}`;
  }
  return architect._id ? `/architects/${architect._id}` : "/architects";
}

export function getContractorProfileUrl(contractor?: {
  _id?: string;
  profession?: string;
  city?: string;
  name?: string;
  role?: string;
} | null): string {
  if (!contractor) return "/contractors";
  const role = (contractor.role || "").toLowerCase();
  const profession = (contractor.profession || "").toLowerCase();

  if (role === "architect" || profession === "architect") {
    return getArchitectProfileUrl(contractor);
  }

  if (contractor.name) {
    const profSlug = slugify(contractor.profession) || "contractor";
    const citySlug = slugify(contractor.city) || "india";
    const nameSlug = slugify(contractor.name) || "pro";
    return `/contractor/${encodeURIComponent(profSlug)}/${encodeURIComponent(citySlug)}/${encodeURIComponent(nameSlug)}`;
  }

  return contractor._id ? `/contractors/${contractor._id}` : "/contractors";
}

export function getSellerStoreUrl(seller?: {
  _id?: string;
  companyName?: string;
  businessName?: string;
  role?: string;
} | null): string {
  if (!seller) return "/building-material-marketplace";
  const name = seller.companyName || seller.businessName;
  if (name) {
    const businessSlug = slugify(name) || "seller";
    const roleSlug = slugify(seller.role) || "seller";
    return `/seller/${encodeURIComponent(businessSlug)}/${encodeURIComponent(roleSlug)}`;
  }
  return seller._id ? `/seller-shop/${seller._id}` : "/building-material-marketplace";
}
