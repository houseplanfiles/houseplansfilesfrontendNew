import { redirect } from "next/navigation";

// Canonical URL is /terms-and-conditions — redirect to avoid duplicate content
export default function TermsRedirectPage() {
  redirect("/terms-and-conditions");
}
