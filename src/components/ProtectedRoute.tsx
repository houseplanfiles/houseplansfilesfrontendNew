"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import { toast } from "sonner";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
      toast.error("You are not authorized to view this page.");
      router.push("/");
    }
  }, [userInfo, allowedRoles, router]);

  if (!userInfo) return null;
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
