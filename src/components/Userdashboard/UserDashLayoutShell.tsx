"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import DashboardLayout from "@/components/Userdashboard/DashboardLayout";

export default function UserDashLayoutShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!userInfo) { router.push("/login"); return; }
  }, [mounted, userInfo, router]);

  if (!mounted || !userInfo) return null;

  return <DashboardLayout>{children}</DashboardLayout>;
}
