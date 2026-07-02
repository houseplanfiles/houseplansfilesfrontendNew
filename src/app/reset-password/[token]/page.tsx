
import { use } from "react";
import ResetPasswordPageClient from "@/components/ResetPasswordPageClient";

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = await params;
  return <ResetPasswordPageClient token={resolvedParams.token} />;
}
