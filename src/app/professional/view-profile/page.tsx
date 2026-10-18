"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchCurrentUser } from "@/lib/features/users/userSlice";
import ContractorProfilePageClient from "@/components/ContractorProfilePageClient";
import { Loader2, UserCheck, Edit3 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function MyPublicProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [contractorData, setContractorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userInfo?._id) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/contractor/${userInfo._id}`
        );
        setContractorData(data);
      } catch (err) {
        console.error("Failed to fetch contractor live profile:", err);
        setContractorData(userInfo);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?._id) {
      loadProfile();
    }
  }, [userInfo?._id]);

  if (loading && !contractorData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
        <p className="text-sm font-semibold text-gray-500">Loading your public profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Banner inside panel */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 md:p-5 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight">Your Live Public Profile</h2>
            <p className="text-xs text-orange-100 font-medium">
              This is exactly how clients see your profile and contact you on HousePlanFiles.
            </p>
          </div>
        </div>

        <Link
          href="/professional/profile"
          className="inline-flex items-center gap-2 bg-white hover:bg-orange-50 text-orange-700 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile Details</span>
        </Link>
      </div>

      {/* Embedded Public Profile */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <ContractorProfilePageClient initialContractor={contractorData || userInfo} isEmbedded={true} />
      </div>
    </div>
  );
}
